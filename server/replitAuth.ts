import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl / 1000, // convert to seconds
    tableName: "sessions",
  });
  // On Replit, always use HTTPS (REPLIT_DOMAINS is set in production)
  const isSecure = !!process.env.REPLIT_DOMAINS || process.env.NODE_ENV === 'production';
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    authProvider: "replit",
    hasInviteAccess: false, // Explicitly set to false for security - users must use invite codes
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    const targetDomain = domains.includes(req.hostname) ? req.hostname : domains[0];
    
    passport.authenticate(`replitauth:${targetDomain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const requireInviteAccess: RequestHandler = async (req, res, next) => {
  // First check if user is authenticated
  const user = req.user as any;
  
  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get user ID from either Twitter or Replit auth
  let userId;
  if (user.id && user.username && !user.claims) {
    // Twitter OAuth user
    userId = user.id;
  } else if (user.claims) {
    // Replit OAuth user
    userId = user.claims.sub;
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if user has invite access
    const dbUser = await storage.getUser(userId);
    if (!dbUser || !dbUser.hasInviteAccess) {
      return res.status(403).json({ message: "Invite code required to access this feature" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking invite access:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  console.log("Auth check - isAuthenticated:", req.isAuthenticated(), "user exists:", !!user);
  console.log("User object:", user ? { 
    id: user.id,
    username: user.username,
    hasClaims: !!user.claims, 
    hasAccessToken: !!user.access_token, 
    hasRefreshToken: !!user.refresh_token, 
    expiresAt: user.expires_at 
  } : "no user");

  if (!req.isAuthenticated() || !user) {
    console.log("Auth failed - no session or user");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Handle Twitter OAuth users (simple user object with id and username)
  if (user.id && user.username && !user.claims) {
    console.log("Auth passed - Twitter OAuth user");
    return next();
  }

  // Handle Replit OAuth users (complex user object with claims and tokens)
  if (user.claims) {
    const now = Math.floor(Date.now() / 1000);
    
    // If token is still valid, proceed
    if (user.expires_at && now <= user.expires_at) {
      console.log("Auth passed - valid Replit token");
      return next();
    }
    
    // Try to refresh token if expired
    const refreshToken = user.refresh_token;
    if (refreshToken) {
      try {
        console.log("Attempting token refresh...");
        const config = await getOidcConfig();
        const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
        updateUserSession(user, tokenResponse);
        console.log("Token refresh successful");
        return next();
      } catch (error) {
        console.error("Token refresh failed:", error);
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  }

  // If no valid session, return unauthorized
  console.log("Auth failed - no valid claims or token");
  return res.status(401).json({ message: "Unauthorized" });
};
