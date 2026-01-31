import passport from "passport";
import type { Express } from "express";
import { storage } from "./storage";
import crypto from "crypto";

export function setupTwitterAuth(app: Express) {
  if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
    console.warn("Twitter authentication not configured - missing credentials");
    return;
  }

  // Generate PKCE challenge
  function generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    return { codeVerifier, codeChallenge };
  }

  // Twitter auth routes - no longer requires invite code upfront
  app.get("/api/auth/twitter", async (req, res) => {
    console.log("Starting Twitter OAuth 2.0 authentication...");

    try {
      const { codeVerifier, codeChallenge } = generatePKCE();
      const state = crypto.randomBytes(16).toString('hex');

      // Store PKCE verifier and state in session
      req.session.codeVerifier = codeVerifier;
      req.session.oauthState = state;

      // Use dynamic callback URL based on request host
      const host = req.get("host") || "dao-ai.replit.app";
      const callbackURL = `https://${host}/api/auth/twitter/callback`;
      console.log("Callback URL being used:", callbackURL);
      
      // Store callback URL in session for token exchange
      req.session.callbackURL = callbackURL;

      const authParams = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.TWITTER_CONSUMER_KEY!,
        redirect_uri: callbackURL,
        scope: 'tweet.read users.read',
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      const authURL = `https://twitter.com/i/oauth2/authorize?${authParams.toString()}`;
      console.log("Redirecting to Twitter auth URL");

      // Set proper headers for redirect
      res.status(302);
      res.setHeader('Location', authURL);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.end();

    } catch (error) {
      console.error("Twitter auth initialization error:", error);
      res.redirect("/auth?error=twitter_auth_failed");
    }
  });

  app.get("/api/auth/twitter/callback", async (req, res) => {
    console.log("Twitter callback received");
    console.log("Query params:", req.query);

    try {
      const { code, state } = req.query;

      if (!code) {
        throw new Error("No authorization code received");
      }

      // Verify state
      if (state !== req.session.oauthState) {
        throw new Error("Invalid state parameter");
      }

      const codeVerifier = req.session.codeVerifier;
      if (!codeVerifier) {
        throw new Error("Code verifier not found in session");
      }

      // Get callback URL from session (stored during auth initiation)
      const callbackURL = req.session.callbackURL || `https://${req.get("host")}/api/auth/twitter/callback`;
      
      // Exchange code for access token
      const tokenData = await exchangeCodeForToken(code as string, codeVerifier, callbackURL);
      console.log("Token exchange successful");

      // Get user profile
      const userProfile = await getUserProfile(tokenData.access_token);
      console.log("User profile retrieved:", userProfile.username);

      // Check for claimable profiles with this Twitter handle FIRST
      const claimableProfiles = await storage.getClaimableProfilesForUser(userProfile.username);
      console.log(`Found ${claimableProfiles.length} claimable profiles for ${userProfile.username}`);

      if (claimableProfiles.length > 0) {
        // CLAIMING FLOW: Don't create any users, use session-based approach
        console.log(`CLAIMING FLOW: User ${userProfile.username} has ${claimableProfiles.length} claimable profiles`);
        
        // Store Twitter OAuth data and claimable profiles in session without creating user
        req.session.twitterOAuthData = {
          id: userProfile.id,
          username: userProfile.username,
          name: userProfile.name,
          profileImageUrl: userProfile.profile_image_url
        };
        req.session.claimableProfiles = claimableProfiles;
        req.session.claimableProfilesCount = claimableProfiles.length;
        req.session.twitterHandle = userProfile.username;
        req.session.hasClaimableProfiles = true;
        req.session.inClaimingFlow = true;

        // Clean up OAuth session data
        delete req.session.codeVerifier;
        delete req.session.oauthState;

        console.log(`Stored claiming data in session for ${userProfile.username} - redirecting to claiming flow`);

        // Redirect directly to onboarding for claiming
        res.redirect("/onboarding?claiming=true");
        return;
      }

      // NORMAL FLOW: No claimable profiles, create/update regular Twitter user
      console.log(`NORMAL FLOW: No claimable profiles for ${userProfile.username}, checking existing user`);
      
      // Check if user already exists in database by Twitter ID (access_id) first, then by username
      let existingUser = await storage.getUserByTwitterId(userProfile.id);
      
      // If no user found by Twitter ID, check by username (for accounts created before Twitter auth)
      if (!existingUser) {
        existingUser = await storage.getUserByUsername(userProfile.username);
        console.log(`Checking by username ${userProfile.username}, found:`, existingUser ? 'yes' : 'no');
      }
      
      let userData;
      if (existingUser) {
        // User exists - preserve their hasInviteAccess status and other important fields
        console.log(`Existing user found: ${existingUser.username}, hasInviteAccess: ${existingUser.hasInviteAccess}`);
        
        // PRESERVE EXISTING id - never change it to maintain foreign key relationships
        // Set access_id for Twitter OAuth authentication linking
        userData = {
          id: existingUser.id, // NEVER CHANGE - preserves all data relationships
          access_id: userProfile.id, // Set Twitter OAuth ID for authentication
          username: userProfile.username,
          email: existingUser.email, // Preserve existing email
          firstName: userProfile.name?.split(' ')[0] || existingUser.firstName,
          lastName: userProfile.name?.split(' ').slice(1).join(' ') || existingUser.lastName,
          profileImageUrl: userProfile.profile_image_url || existingUser.profileImageUrl,
          twitterHandle: userProfile.username,
          twitterUrl: `https://x.com/${userProfile.username}`,
          authProvider: "twitter",
          hasInviteAccess: existingUser.hasInviteAccess, // Preserve existing access level
          // Preserve other important fields
          xpPoints: existingUser.xpPoints,
          grsScore: existingUser.grsScore,
          grsPercentile: existingUser.grsPercentile,
          dailyStreak: existingUser.dailyStreak,
          weeklyXp: existingUser.weeklyXp,
          lastActiveDate: existingUser.lastActiveDate,
          onboardingCompletedAt: existingUser.onboardingCompletedAt,
          profileCompletedAt: existingUser.profileCompletedAt,
        };
      } else {
        // New user - set defaults with access_id system
        console.log(`New user: ${userProfile.username}, setting hasInviteAccess to false`);
        userData = {
          id: userProfile.id, // For new users, id and access_id will be the same initially
          access_id: userProfile.id, // Set Twitter OAuth ID for authentication
          username: userProfile.username,
          email: null, // Twitter OAuth 2.0 doesn't provide email by default
          firstName: userProfile.name?.split(' ')[0] || null,
          lastName: userProfile.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: userProfile.profile_image_url || null,
          twitterHandle: userProfile.username, // Store the X/Twitter handle
          twitterUrl: `https://x.com/${userProfile.username}`, // Generate the X profile URL
          authProvider: "twitter",
          hasInviteAccess: false, // Explicitly set to false for security - users must use invite codes
        };
      }

      // Create or update user in database
      let dbUser;
      if (existingUser) {
        // Update existing user
        dbUser = await storage.updateUser(existingUser.id, userData);
        console.log(`Updated existing Twitter user: ${userProfile.username}, hasInviteAccess: ${dbUser.hasInviteAccess}`);
      } else {
        // Create new user
        dbUser = await storage.createUser(userData);
        console.log(`Created new Twitter user: ${userProfile.username}, hasInviteAccess: ${dbUser.hasInviteAccess}`);
      }

      // Log the user in using Passport
      req.logIn(dbUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/auth?error=login_failed");
        }

        console.log("Twitter authentication successful for user:", dbUser.username);

        // Clean up session
        delete req.session.codeVerifier;
        delete req.session.oauthState;
        delete req.session.callbackURL;
        req.session.hasClaimableProfiles = false;
        req.session.inClaimingFlow = false;

        // Redirect based on user's access level
        if (dbUser.hasInviteAccess) {
          console.log(`User ${dbUser.username} has full access, redirecting to home`);
          res.redirect("/home");
        } else {
          console.log(`User ${dbUser.username} needs invite code, redirecting to onboarding`);
          res.redirect("/onboarding");
        }
      });

    } catch (error) {
      console.error("Twitter callback error:", error);
      res.redirect("/auth?error=twitter_auth_failed");
    }
  });

  // Exchange authorization code for access token
  async function exchangeCodeForToken(code: string, codeVerifier: string, callbackURL: string) {
    const postData = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: callbackURL,
      code_verifier: codeVerifier,
      client_id: process.env.TWITTER_CONSUMER_KEY!
    });

    const authHeader = `Basic ${Buffer.from(`${process.env.TWITTER_CONSUMER_KEY}:${process.env.TWITTER_CONSUMER_SECRET}`).toString('base64')}`;

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader
      },
      body: postData.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token exchange failed:", data);
      throw new Error(`Token exchange failed: ${data.error_description || data.error}`);
    }

    return data;
  }

  // Get user profile from Twitter API
  async function getUserProfile(accessToken: string) {
    const response = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const userData = await response.json();

    if (!response.ok) {
      console.error("User profile fetch failed:", userData);
      throw new Error(`Twitter API error: ${userData.detail || "Unknown error"}`);
    }

    return userData.data;
  }
}