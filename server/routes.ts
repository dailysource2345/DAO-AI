import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireInviteAccess } from "./replitAuth";
import { setupEmailAuth, verifyEmailCode, resendVerificationCode } from "./emailAuth";
import { setupTwitterAuth } from "./twitterAuth";
import { backupService } from "./backup";
import { databaseMonitor } from "./database-monitor";
import { connectionRecovery } from "./connection-recovery";
import { backupRestore } from "./backup-restore";
import { insertDaoSchema, insertGovernanceIssueSchema, insertCommentSchema, insertVoteSchema, insertInviteCodeSchema, insertReviewSchema, insertReviewReportSchema, insertContentReportSchema } from "@shared/schema";
import { NotificationService } from "./notifications";
import { ogStorageService } from "./services/ogStorageService";
import { roflService, type SocialProfiles } from "./services/roflService";
import { z } from "zod";
import passport from "passport";
import { eq, desc, asc, and, or, ilike, sql, gte, lte, lt } from "drizzle-orm";
import { db } from "./db";
import { users, governanceIssues, comments, votes, stanceVotes, daos, userDaoFollows, userDaoScores, sessions, adminSessions, inviteCodes, reviews, credaActivities, referrals, commentVotes } from "../shared/schema";
import { Request, Response } from "express";
import type { User, Review, Vote, GovernanceIssue, Comment, Dao, CredaActivity, InviteCode, StanceVote } from "@shared/schema";
import sharp from 'sharp';
import bcrypt from 'bcryptjs';
// Note: Using PNG image generation with Sharp for Twitter/X Open Graph compatibility

// 0G Storage helper: Records activity to 0G Storage after DB insert (async, non-blocking)
async function recordActivityToOgStorage(
  activityId: number,
  activityType: 'STANCE' | 'COMMENT' | 'VOTE' | 'REVIEW',
  userId: string,
  targetId: number,
  targetType: 'ISSUE' | 'COMMENT' | 'REVIEW' | 'USER' | 'DAO',
  content: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    if (!ogStorageService.isAvailable()) {
      console.log('[0G Storage] Service not available, skipping on-chain recording');
      return;
    }

    let result;
    switch (activityType) {
      case 'STANCE':
        result = await ogStorageService.recordStanceCreated(activityId, userId, targetId, content, metadata);
        break;
      case 'COMMENT':
        result = await ogStorageService.recordCommentCreated(activityId, userId, targetId, metadata.issueId || 0, content, metadata);
        break;
      case 'VOTE':
        result = await ogStorageService.recordVoteCast(activityId, userId, targetId, targetType as 'ISSUE' | 'COMMENT' | 'REVIEW', metadata.voteType || 'vote', metadata);
        break;
      case 'REVIEW':
        result = await ogStorageService.recordReviewCreated(activityId, userId, targetId, targetType as 'USER' | 'DAO' | 'POST', content, metadata.rating || 0, metadata);
        break;
    }

    if (result?.success && result.txHash && result.rootHash) {
      await storage.updateCredaActivityWithOgProof(activityId, result.txHash, result.rootHash);
    }
  } catch (error) {
    // 0G Storage failures should not fail the main action
    console.error('[0G Storage] Failed to record activity:', error);
  }
}

// Simple in-memory cache for expensive endpoints (PERFORMANCE OPTIMIZATION)
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATIONS = {
  leaderboard: 60 * 1000, // 1 minute for leaderboard
  grsScore: 5 * 60 * 1000, // 5 minutes for GRS scores
  stats: 2 * 60 * 1000, // 2 minutes for stats
};

function getCachedResponse<T>(key: string, duration: number): T | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data as T;
  }
  return null;
}

function setCachedResponse(key: string, data: any): void {
  responseCache.set(key, { data, timestamp: Date.now() });
  // Clean old entries periodically
  if (responseCache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of responseCache.entries()) {
      if (now - v.timestamp > 10 * 60 * 1000) {
        responseCache.delete(k);
      }
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint for deployment (no auth, no database)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Documentation download endpoint
  app.get('/api/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const allowedFiles = ['OASIS_ROFL_INTEGRATION.md', 'README.md', 'DEPLOY_ROFL.md'];
    
    if (!allowedFiles.includes(filename)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), filename);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${filename.replace('.md', '.txt')}"`);
      res.send(content);
    } catch (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  // Auth middleware
  await setupAuth(app);
  setupEmailAuth();
  setupTwitterAuth(app);

  // Auth routes for both Replit Auth and Email Auth
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      let userId;
      let user;

      // Check if user is authenticated via Replit Auth
      if (req.user && req.user.claims) {
        userId = req.user.claims.sub;
        user = await storage.getUser(userId);
      }
      // Check if user is authenticated via Email Auth
      else if (req.user && req.user.id) {
        userId = req.user.id;
        user = await storage.getUser(userId);
      }

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Email authentication routes
  const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const verifyEmailSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
  });

  app.post('/api/auth/signup', async (req, res, next) => {
    try {
      const validatedData = signupSchema.parse(req.body);

      passport.authenticate('local-signup', (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
          return res.status(400).json({ message: info.message || 'Signup failed' });
        }

        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Login failed after signup' });
          }
          return res.status(201).json({
            message: 'Signup successful. Please check your email for verification code.',
            user: { id: user.id, email: user.email, emailVerified: user.emailVerified }
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: 'Invalid input data' });
    }
  });

  app.post('/api/auth/signin', async (req, res, next) => {
    try {
      const validatedData = signinSchema.parse(req.body);

      passport.authenticate('local-signin', (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
          return res.status(401).json({ message: info.message || 'Invalid credentials' });
        }

        req.logIn(user, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Login failed' });
          }
          return res.json({
            message: 'Signin successful',
            user: { id: user.id, email: user.email, emailVerified: user.emailVerified }
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: 'Invalid input data' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, code } = verifyEmailSchema.parse(req.body);

      const verified = await verifyEmailCode(email, code);
      if (verified) {
        res.json({ message: 'Email verified successfully' });
      } else {
        res.status(400).json({ message: 'Invalid or expired verification code' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid input data' });
    }
  });

  app.post('/api/auth/resend-verification', async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);

      const sent = await resendVerificationCode(email);
      if (sent) {
        res.json({ message: 'Verification code sent successfully' });
      } else {
        res.status(400).json({ message: 'Unable to send verification code' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid input data' });
    }
  });

  app.post('/api/auth/signout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Signed out successfully' });
    });
  });

  // Legacy wallet verification endpoint - REMOVED for confidentiality
  // Wallet addresses must NEVER touch the backend directly.
  // Use /api/rofl/link-identity instead - wallet is verified inside ROFL enclave.
  app.post('/api/user/verify-wallet', isAuthenticated, async (req, res) => {
    return res.status(410).json({ 
      message: 'This endpoint has been removed for privacy reasons',
      hint: 'Use the confidential identity linking feature instead. Your wallet is verified inside a secure enclave without exposing the address to our servers.'
    });
  });

  // =============================================================================
  // ROFL CONFIDENTIAL COMPUTE ENDPOINTS
  // =============================================================================
  
  // LEGACY ROFL Reputation Computation Endpoint - DEPRECATED
  // This endpoint is DISABLED for privacy. Use /api/rofl/link-identity instead.
  // The new endpoint never sees wallet addresses - only signed messages.
  app.post('/api/rofl/compute-reputation', isAuthenticated, async (req, res) => {
    return res.status(410).json({ 
      message: 'This endpoint has been deprecated for privacy reasons',
      hint: 'Use /api/rofl/link-identity instead. Your wallet is verified inside a secure enclave using signature verification, without exposing the address to our servers.',
      migration: 'Sign a challenge message with your wallet and submit to /api/rofl/link-identity'
    });
  });

  // Legacy wallet-based ROFL handler has been PERMANENTLY REMOVED
  // Reason: Wallet addresses must NEVER touch the backend for confidentiality
  // Use /api/rofl/link-identity instead - wallet verified inside ROFL enclave only

  // Schema for CONFIDENTIAL identity linking (wallet NEVER visible to backend)
  // Defense-in-depth: Explicitly reject any wallet_address field to prevent accidental leakage
  const roflLinkIdentitySchema = z.object({
    signedMessage: z.string().min(130).max(140).regex(/^0x[0-9a-fA-F]+$/),
    challenge: z.string().min(20).max(500),
    socialProfiles: z.object({}).passthrough()
  }).strict().refine(
    (data: any) => !('wallet_address' in data || 'walletAddress' in data),
    { message: 'Wallet addresses are forbidden for confidentiality. Use signed messages only.' }
  );

  // CONFIDENTIAL Identity Linking Endpoint
  // Backend NEVER sees the wallet address - only signed message is passed through
  app.post('/api/rofl/link-identity', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Validate input
      const validatedData = roflLinkIdentitySchema.parse(req.body);
      const { signedMessage, challenge, socialProfiles } = validatedData;

      // Get user's profile to collect social data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Build social profiles from user data (supplement what client sent)
      const fullSocialProfiles: SocialProfiles = { ...socialProfiles };

      // Add Twitter data if available
      if ((user.twitterHandle || user.twitterUrl) && !fullSocialProfiles.twitter) {
        fullSocialProfiles.twitter = {
          handle: user.twitterHandle || undefined,
          followers: 0,
          account_age_days: user.createdAt 
            ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            : 0
        };
      }

      // Add GitHub data if available
      if (user.githubUrl && !fullSocialProfiles.github) {
        fullSocialProfiles.github = {
          username: user.githubUrl.split('/').pop() || undefined,
          repos: 0,
          stars: 0,
          account_age_days: 0
        };
      }

      // Check if we have any social profiles
      if (Object.keys(fullSocialProfiles).length === 0) {
        return res.status(400).json({ 
          message: 'At least one social profile is required for identity linking',
          hint: 'Please add Twitter, GitHub, or other social profiles first'
        });
      }

      // Check ROFL service availability
      if (!roflService.isAvailable()) {
        return res.status(503).json({ 
          message: 'ROFL service is not available'
        });
      }

      // Submit to ROFL for CONFIDENTIAL computation
      // CRITICAL: Backend does NOT see the wallet address
      // Only the signed message is forwarded to ROFL
      console.log(`[ROFL] Confidential identity linking for user ${userId}`);
      
      const roflResult = await roflService.linkIdentityConfidentially(
        userId,
        signedMessage,
        challenge,
        fullSocialProfiles
      );

      // Record to 0G Storage for immutable audit
      const ogResult = await roflService.recordToOgStorage(userId, roflResult);

      // Update user record with ROFL attestation data
      // CRITICAL: NO wallet address is stored - only attestation and scores
      await db.update(users)
        .set({
          // NOTE: walletAddress is NOT set - privacy preserved
          roflReputationScore: roflResult.reputation_score,
          roflConfidenceScore: Math.round(roflResult.confidence_score * 100),
          roflEnclaveId: roflResult.attestation.enclave_id,
          roflAppHash: roflResult.attestation.app_hash,
          roflAttestationHash: roflResult.attestation.attestation_hash,
          roflAttestationSignature: JSON.stringify(roflResult.attestation.signature),
          roflComputedAt: new Date(roflResult.attestation.timestamp),
          roflOgTxHash: ogResult.txHash || null,
          roflOgRootHash: ogResult.rootHash || null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log(`[ROFL] Confidential identity linked for user ${userId}: score=${roflResult.reputation_score}`);

      // Return result (NO wallet address exposed)
      res.json({
        success: true,
        daoai_user_id: roflResult.daoai_user_id,
        reputation_score: roflResult.reputation_score,
        confidence_score: roflResult.confidence_score,
        score_breakdown: roflResult.score_breakdown,
        privacy_mode: roflResult.privacy_mode || 'confidential',
        wallet_hash: roflResult.wallet_hash, // Hash only - not the actual address
        attestation: {
          enclave_id: roflResult.attestation.enclave_id,
          app_hash: roflResult.attestation.app_hash,
          attestation_hash: roflResult.attestation.attestation_hash,
          timestamp: roflResult.attestation.timestamp,
          verification: roflResult.attestation.verification
        },
        og_storage: ogResult.success ? {
          tx_hash: ogResult.txHash,
          root_hash: ogResult.rootHash
        } : null
      });

    } catch (error: any) {
      console.error('[ROFL] Confidential identity linking error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Invalid request format' });
      }
      
      res.status(500).json({ 
        message: 'Failed to link identity',
        error: error.message 
      });
    }
  });

  // ROFL Health Check Endpoint
  app.get('/api/rofl/health', async (req, res) => {
    try {
      const health = await roflService.getHealth();
      res.json(health);
    } catch (error) {
      res.status(503).json({ 
        healthy: false, 
        error: 'ROFL service unavailable' 
      });
    }
  });

  // ROFL Enclave Info Endpoint
  app.get('/api/rofl/info', async (req, res) => {
    try {
      const info = await roflService.getEnclaveInfo();
      if (info) {
        res.json(info);
      } else {
        res.status(503).json({ error: 'Unable to fetch enclave info' });
      }
    } catch (error) {
      res.status(503).json({ error: 'ROFL service unavailable' });
    }
  });

  // Reset ROFL wallet connection (for testing)
  app.post('/api/rofl/reset', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Clear ROFL-related fields
      await storage.updateUser(userId, {
        roflReputationScore: null,
        roflConfidenceScore: null,
        roflWalletHash: null,
        roflEnclaveId: null,
        roflAppHash: null,
        roflAttestationHash: null,
        roflComputedAt: null,
        roflOgTxHash: null,
        roflOgRootHash: null,
      });

      res.json({ 
        success: true, 
        message: 'ROFL wallet connection reset successfully. You can now link a new wallet.' 
      });
    } catch (error: any) {
      console.error('[ROFL] Reset error:', error);
      res.status(500).json({ message: 'Failed to reset wallet connection', error: error.message });
    }
  });

  // Get user's ROFL reputation (public endpoint)
  app.get('/api/rofl/reputation/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.roflReputationScore) {
        return res.status(404).json({ 
          message: 'No ROFL reputation computed for this user',
          hint: 'User needs to submit wallet for ROFL computation'
        });
      }

      res.json({
        user_id: userId,
        reputation_score: user.roflReputationScore,
        confidence_score: (user.roflConfidenceScore || 0) / 100,
        attestation: {
          enclave_id: user.roflEnclaveId,
          app_hash: user.roflAppHash,
          attestation_hash: user.roflAttestationHash,
          computed_at: user.roflComputedAt
        },
        og_storage: user.roflOgTxHash ? {
          tx_hash: user.roflOgTxHash,
          root_hash: user.roflOgRootHash
        } : null
      });

    } catch (error) {
      console.error('[ROFL] Get reputation error:', error);
      res.status(500).json({ message: 'Failed to get reputation' });
    }
  });

  // Admin authentication endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      // Get admin credentials from environment variables
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

      console.log("Admin login attempt:", {
        receivedUsername: username,
        receivedPassword: password ? "***" : "empty",
        envUsernameSet: !!ADMIN_USERNAME,
        envPasswordSet: !!ADMIN_PASSWORD
      });

      if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.log("Admin credentials not configured in environment");
        return res.status(500).json({ message: "Admin credentials not configured" });
      }

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        console.log("Admin authentication successful");
        // Store admin session
        if (req.session) {
          (req.session as any).adminAuthenticated = true;
        }
        res.json({ success: true, message: "Admin authenticated successfully" });
      } else {
        console.log("Admin authentication failed - credentials mismatch");
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Failed to authenticate admin" });
    }
  });

  // Admin auth endpoint (for password-only authentication)
  app.post('/api/admin/auth', async (req, res) => {
    try {
      const { password } = req.body;

      // Get admin credentials from environment variables
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Default fallback for demo

      console.log("Admin auth attempt:", {
        receivedPassword: password ? "***" : "empty",
        envPasswordSet: !!ADMIN_PASSWORD
      });

      if (password === ADMIN_PASSWORD) {
        console.log("Admin authentication successful");
        // Store admin session
        if (req.session) {
          (req.session as any).adminAuthenticated = true;
        }
        res.json({ success: true, message: "Admin authenticated successfully" });
      } else {
        console.log("Admin authentication failed - password mismatch");
        res.status(401).json({ message: "Invalid admin password" });
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(500).json({ message: "Failed to authenticate admin" });
    }
  });

  // Admin auth check endpoint
  app.get('/api/admin/check-auth', (req, res) => {
    console.log("Check auth - session:", req.session ? "exists" : "missing", "adminAuth:", (req.session as any)?.adminAuthenticated);
    if (req.session && (req.session as any).adminAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Admin middleware for protecting admin routes
  const requireAdminAuth = (req: any, res: any, next: any) => {
    console.log("RequireAdminAuth - session:", req.session ? "exists" : "missing", "adminAuth:", (req.session as any)?.adminAuthenticated);
    if (req.session && (req.session as any).adminAuthenticated) {
      next();
    } else {
      res.status(401).json({ message: "Admin authentication required" });
    }
  };

  // Company authentication routes
  app.post('/api/company/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const companyUser = await storage.getCompanyUserByEmail(email);
      
      if (!companyUser) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!companyUser.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      const passwordMatch = await bcrypt.compare(password, companyUser.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      await storage.updateCompanyUserLastLogin(companyUser.id);

      if (req.session) {
        (req.session as any).companyUserId = companyUser.id;
        (req.session as any).companyId = companyUser.companyId;
      }

      const { password: _, ...userWithoutPassword } = companyUser;
      res.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Company login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get('/api/company/check-auth', (req, res) => {
    if (req.session && (req.session as any).companyUserId) {
      res.json({ 
        authenticated: true,
        companyId: (req.session as any).companyId,
        userId: (req.session as any).companyUserId
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.post('/api/company/logout', (req, res) => {
    if (req.session) {
      delete (req.session as any).companyUserId;
      delete (req.session as any).companyId;
    }
    res.json({ success: true, message: "Logged out successfully" });
  });

  const requireCompanyAuth = (req: any, res: any, next: any) => {
    if (req.session && (req.session as any).companyUserId) {
      next();
    } else {
      res.status(401).json({ message: "Company authentication required" });
    }
  };

  // Company dashboard endpoints (protected)
  app.get('/api/company/dashboard/profile', requireCompanyAuth, async (req: any, res) => {
    try {
      const companyId = (req.session as any).companyId;
      const company = await storage.getCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error fetching company profile:", error);
      res.status(500).json({ message: "Failed to fetch company profile" });
    }
  });

  app.get('/api/company/dashboard/reviews', requireCompanyAuth, async (req: any, res) => {
    try {
      const companyId = (req.session as any).companyId;
      const company = await storage.getCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const reviews = await storage.getProjectReviews(company.externalId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching company reviews:", error);
      res.status(500).json({ message: "Failed to fetch company reviews" });
    }
  });

  app.post('/api/company/dashboard/reviews/:reviewId/reply', requireCompanyAuth, async (req: any, res) => {
    try {
      const companyId = (req.session as any).companyId;
      const { reviewId } = req.params;
      const { reply } = req.body;

      if (!reply || reply.trim().length === 0) {
        return res.status(400).json({ message: "Reply content is required" });
      }

      const company = await storage.getCompanyById(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const updatedReview = await storage.addCompanyReplyToReview(parseInt(reviewId), reply);
      res.json({ success: true, review: updatedReview });
    } catch (error) {
      console.error("Error adding company reply:", error);
      res.status(500).json({ message: "Failed to add reply" });
    }
  });

  app.get('/api/company/dashboard/analytics', requireCompanyAuth, async (req: any, res) => {
    try {
      const companyId = (req.session as any).companyId;
      const analytics = await storage.getCompanyAnalytics(companyId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching company analytics:", error);
      res.status(500).json({ message: "Failed to fetch company analytics" });
    }
  });

  // DAO routes
  // Get all DAOs from database
  app.get("/api/daos", async (req, res) => {
    try {
      const daos = await storage.getAllDaos();
      res.json(daos);
    } catch (error) {
      console.error('Error fetching DAOs:', error);
      res.status(500).json({ message: "Failed to fetch DAOs" });
    }
  });

  app.get('/api/daos/:slug', async (req, res) => {
    try {
      const slug = req.params.slug.toLowerCase(); // Convert to lowercase for case-insensitive lookup

      // Special handling for Jupiter DAO to include X account info
      if (slug === 'jupiter') {
        const jupiterDao = {
          id: 5,
          name: "Jupiter",
          slug: "jupiter",
          description: "The key liquidity aggregator and swap infrastructure for Solana, offering the widest range of tokens and best route discovery",
          logoUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center",
          createdAt: new Date().toISOString(),
          createdBy: null,
          updatedAt: new Date().toISOString(),
          creator: null,
          twitterHandle: "jup_dao",
          twitterUrl: "https://x.com/jup_dao"
        };
        return res.json(jupiterDao);
      }

      const dao = await storage.getDaoBySlug(slug);
      if (!dao) {
        return res.status(404).json({ message: "DAO not found" });
      }
      res.json(dao);
    } catch (error) {
      console.error("Error fetching DAO:", error);
      res.status(500).json({ message: "Failed to fetch DAO" });
    }
  });

  // Get reviews for a specific DAO
  app.get('/api/daos/:daoId/reviews', async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      if (isNaN(daoId)) {
        return res.status(400).json({ message: "Invalid DAO ID" });
      }

      console.log(`Fetching reviews for DAO ID: ${daoId}`);
      const reviews = await storage.getDaoReviews(daoId);
      console.log(`Found ${reviews.length} reviews for DAO ${daoId}`);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching DAO reviews:", error);
      res.status(500).json({ message: "Failed to fetch DAO reviews" });
    }
  });

  app.post('/api/daos', requireInviteAccess, async (req: any, res) => {
    try {
      const daoData = insertDaoSchema.parse(req.body);
      const daoWithCreator = {
        ...daoData,
        createdBy: req.user.id
      };
      const dao = await storage.createDao(daoWithCreator);
      res.json(dao);
    } catch (error) {
      console.error("Error creating DAO:", error);
      res.status(500).json({ message: "Failed to create DAO" });
    }
  });

  // Legacy forum routes removed - replaced with governance issue routes

  // Governance Issue routes
  app.get('/api/daos/:daoId/issues', async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const sortBy = req.query.sort as string || 'latest';
      const issues = await storage.getGovernanceIssuesByDao(daoId, sortBy);
      res.json(issues);
    } catch (error) {
      console.error("Error fetching governance issues:", error);
      res.status(500).json({ message: "Failed to fetch governance issues" });
    }
  });

  app.get('/api/issues/recent', async (req, res) => {
    try {
      const issues = await storage.getRecentGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching recent governance issues:", error);
      res.status(500).json({ message: "Failed to fetch recent governance issues" });
    }
  });

  app.get('/api/issues/active', async (req, res) => {
    try {
      const issues = await storage.getActiveGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching active governance issues:", error);
      res.status(500).json({ message: "Failed to fetch active governance issues" });
    }
  });

  // New endpoint for stance slot availability info
  app.get('/api/stance-slots/availability', requireInviteAccess, async (req: any, res) => {
    try {
      // Handle both Twitter OAuth and Replit OAuth user ID formats
      const userId = req.user.claims?.sub || req.user.id;

      // Get user data to check GRS score
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get stance availability info
      const activeStanceCount = await storage.getActiveStanceCount();
      const nextExpirationTime = await storage.getNextStanceExpirationTime();
      const userActiveStanceCount = await storage.getUserActiveStanceCount(userId);

      const meetsGrsRequirement = user.grsScore >= 1400;
      const globalSlotsAvailable = activeStanceCount < 5;

      // Users can now create multiple stances (removed userHasNoActiveStance check)
      const canCreateStance = meetsGrsRequirement && globalSlotsAvailable;
      const slotsAvailable = 5 - activeStanceCount;

      res.json({
        canCreateStance,
        userGrsScore: user.grsScore,
        grsRequirement: 1400,
        meetsGrsRequirement,
        activeStanceCount,
        maxStanceCount: 5,
        slotsAvailable,
        slotsAreFull: activeStanceCount >= 5,
        userActiveStanceCount,
        userHasActiveStance: userActiveStanceCount > 0,
        nextExpirationTime: nextExpirationTime ? nextExpirationTime.toISOString() : null
      });
    } catch (error) {
      console.error("Error fetching stance slot availability:", error);
      res.status(500).json({ message: "Failed to fetch stance slot availability" });
    }
  });

  app.get('/api/issues/:id', async (req, res) => {
    try {
      const issueId = parseInt(req.params.id);
      const issue = await storage.getGovernanceIssueById(issueId);
      if (!issue) {
        return res.status(404).json({ message: "Governance issue not found" });
      }
      res.json(issue);
    } catch (error) {
      console.error("Error fetching governance issue:", error);
      res.status(500).json({ message: "Failed to fetch governance issue" });
    }
  });

  app.post('/api/issues', requireInviteAccess, async (req: any, res) => {
    try {
      // Handle both Twitter OAuth and Replit OAuth user ID formats
      const userId = req.user.claims?.sub || req.user.id;

      // Get user data to validate GRS score
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has minimum GRS score of 1400
      if (user.grsScore < 1400) {
        return res.status(403).json({
          message: "You need a GRS of at least 1400 to post a stance. Keep engaging to build your reputation."
        });
      }

      // Check if there are already 5 active stances
      const activeStances = await storage.getActiveGovernanceIssues();
      if (activeStances.length >= 5) {
        return res.status(429).json({
          message: "Only 5 stances can be active at once. Please wait for a slot to open."
        });
      }

      // Users can now create multiple stances - removed active stance limit check

      // Convert spaceSlug to spaceId if provided
      let spaceId = null;
      if (req.body.spaceSlug && req.body.spaceSlug.trim() !== '') {
        const space = await storage.getSpaceBySlug(req.body.spaceSlug);
        if (space) {
          spaceId = space.id;
        }
      }

      const issueData = insertGovernanceIssueSchema.parse({
        ...req.body,
        authorId: userId,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
        spaceId
      });

      // Validate that either a target project OR a target user is provided
      const hasTargetProject = issueData.targetProjectId && issueData.targetProjectName;
      const hasTargetUser = issueData.targetUserId || issueData.targetUsername;
      
      if (!hasTargetProject && !hasTargetUser) {
        return res.status(400).json({
          message: "A target project or user must be selected"
        });
      }

      // Check if target already has an active stance on it
      if (hasTargetProject) {
        const targetHasActiveStance = await storage.hasActiveStanceOnProject(issueData.targetProjectId!);
        if (targetHasActiveStance) {
          return res.status(409).json({
            message: "This project already has an active stance on it. Wait for it to expire before taking another stance."
          });
        }
      } else if (issueData.targetUserId) {
        const targetHasActiveStance = await storage.hasActiveStanceOnTarget(issueData.targetUserId);
        if (targetHasActiveStance) {
          return res.status(409).json({
            message: "This user already has an active stance on them. Wait for it to expire before taking another stance."
          });
        }
      }

      console.log("Creating governance issue with data:", issueData);

      const issue = await storage.createGovernanceIssue(issueData);
      console.log("Created governance issue:", issue);

      // Award CREDA for creating governance stance and get the activity record
      const credaActivity = await storage.awardStanceCreationCreda(userId, issue.id);

      // Record the stance creation to 0G Storage for on-chain audit trail
      if (credaActivity && credaActivity.id) {
        recordActivityToOgStorage(
          credaActivity.id,
          'STANCE',
          userId,
          issue.id,
          'ISSUE',
          issue.content || '',
          {
            stanceType: issue.stance,
            targetProjectId: issue.targetProjectId,
            targetProjectName: issue.targetProjectName,
            targetUserId: issue.targetUserId,
            targetUsername: issue.targetUsername,
            title: issue.title
          }
        ).catch(err => console.error('[0G Storage] Background recording failed:', err));
      }

      const response = { ...issue, pointsEarned: 100 };
      console.log("Sending response:", response);
      res.json(response);
    } catch (error) {
      console.error("Error creating governance issue:", error);
      res.status(500).json({ message: "Failed to create governance issue", details: (error as Error).message });
    }
  });

  // Comment routes
  app.get('/api/issues/:issueId/comments', async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const comments = await storage.getCommentsByIssue(issueId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', requireInviteAccess, async (req: any, res) => {
    try {
      // Handle both Twitter OAuth and Replit OAuth user ID formats
      const userId = req.user.claims?.sub || req.user.id;

      // Make stance optional for backward compatibility
      const { stance, ...rest } = req.body;
      const commentData = insertCommentSchema.parse({
        ...rest,
        authorId: userId,
        stance: stance || null,
      });

      const comment = await storage.createComment(commentData);

      // Award CREDA for commenting and get activity record for on-chain recording
      const commentActivity = await storage.awardCommentCreda(userId, commentData.content, commentData.issueId);

      // Record the comment to 0G Storage for on-chain audit trail
      if (commentActivity && commentActivity.id) {
        recordActivityToOgStorage(
          commentActivity.id,
          'COMMENT',
          userId,
          comment.id,
          'ISSUE',
          commentData.content,
          {
            issueId: commentData.issueId,
            stance: commentData.stance,
            parentCommentId: commentData.parentCommentId
          }
        );
      }

      // Send notification to the issue author about the new comment
      try {
        const issue = await storage.getGovernanceIssueById(commentData.issueId);
        const commenter = await storage.getUser(userId);

        if (issue && commenter && issue.authorId !== userId) {
          // Use a clean title or fallback to content preview
          const cleanTitle = issue.title && issue.title.length > 3 && !issue.title.match(/^[a-z]{8,}$/)
            ? issue.title
            : issue.content ? issue.content.substring(0, 50) + '...' : 'a stance';

          const commenterName = commenter.username || commenter.twitterHandle || 'Someone';

          await NotificationService.notifyNewComment(
            issue.authorId,
            userId,
            commenterName,
            cleanTitle,
            issue.id,
            'stance',
            commentData.content
          );
        }

        // Check if this is a reply to an existing comment and send reply notification
        if (commentData.parentCommentId && issue && commenter) {
          const parentComment = await storage.getCommentById(commentData.parentCommentId);
          if (parentComment && parentComment.authorId !== userId) {
            const cleanTitle = issue.title && issue.title.length > 3 && !issue.title.match(/^[a-z]{8,}$/)
              ? issue.title
              : issue.content ? issue.content.substring(0, 50) + '...' : 'a stance';

            const commenterName = commenter.username || commenter.twitterHandle || 'Someone';

            await NotificationService.notifyCommentReply(
              parentComment.authorId,
              userId,
              commenterName,
              cleanTitle,
              issue.id,
              commentData.content
            );
          }
        }
      } catch (error) {
        console.error("Failed to send comment notification:", error);
      }

      // Calculate points based on content length
      const pointsEarned = commentData.content.length >= 100 ? 20 : 10;

      res.json({
        ...comment,
        pointsEarned,
        message: pointsEarned > 0
          ? "Comment posted successfully! You earned +" + pointsEarned + " points."
          : "Comment posted successfully!"
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Vote routes
  app.post('/api/votes', requireInviteAccess, async (req: any, res) => {
    try {
      // Handle both Twitter OAuth and Replit OAuth user ID formats
      const userId = req.user.claims?.sub || req.user.id;

      const voteData = insertVoteSchema.parse({
        ...req.body,
        userId: userId,
      });

      // Check if user already voted
      const existingVote = await storage.getUserVote(voteData.userId, voteData.targetType, voteData.targetId);
      if (existingVote) {
        return res.status(400).json({ message: "Already voted" });
      }

      const vote = await storage.createVote(voteData);
      // Vote counts are updated in the storage.createVote method

      // Award point to the author of the upvoted content
      let authorId: string | null = null;
      let daoId: number | null = null;

      if (voteData.targetType === 'issue') {
        const issue = await storage.getGovernanceIssueById(voteData.targetId);
        if (issue) {
          authorId = issue.authorId;
          daoId = issue.daoId;
        }
      } else if (voteData.targetType === 'comment') {
        const comment = await storage.getCommentById(voteData.targetId);
        if (comment) {
          authorId = comment.authorId;
          const issue = await storage.getGovernanceIssueById(comment.issueId);
          if (issue) {
            daoId = issue.daoId;
          }
        }
      }

      // Award XP for voting and for receiving votes
      if (authorId) {
        // Award 5 XP to voter and get activity record for on-chain recording
        const voteActivity = await storage.awardVotingXp(userId, voteData.targetType, voteData.targetId, voteData.voteType);

        // Record the vote to 0G Storage for on-chain audit trail
        if (voteActivity && voteActivity.id) {
          recordActivityToOgStorage(
            voteActivity.id,
            'VOTE',
            userId,
            voteData.targetId,
            voteData.targetType === 'issue' ? 'ISSUE' : 'COMMENT',
            '',
            {
              voteType: voteData.voteType,
              targetType: voteData.targetType
            }
          );
        }

        // Award engagement XP to content author based on vote type and target
        if (voteData.targetType === 'issue') {
          if (voteData.voteType === 'upvote') {
            await storage.awardUpvoteReceivedXp(authorId, voteData.targetId);
          } else {
            await storage.awardDownvoteReceivedXp(authorId, voteData.targetId);
          }
        } else if (voteData.targetType === 'comment' && voteData.voteType === 'upvote') {
          await storage.awardCommentUpvoteReceivedXp(authorId, voteData.targetId);
        }

        // Award comment received XP to stance author if this is a comment
        if (voteData.targetType === 'comment') {
          const comment = await storage.getCommentById(voteData.targetId);
          if (comment) {
            const issue = await storage.getGovernanceIssueById(comment.issueId);
            if (issue && issue.authorId !== authorId) {
              await storage.awardCommentReceivedXp(issue.authorId, issue.id);
            }
          }
        }

        // Send notification to content author about the vote
        try {
          const voter = await storage.getUser(userId);
          if (voter && authorId !== userId) {
            let itemTitle = '';
            let itemId = voteData.targetId;

            if (voteData.targetType === 'issue') {
              const issue = await storage.getGovernanceIssueById(voteData.targetId);
              if (issue) {
                itemTitle = issue.title;
                await NotificationService.notifyNewVote(
                  authorId,
                  userId,
                  voter.username,
                  voteData.voteType,
                  'stance',
                  itemTitle,
                  itemId
                );
              }
            } else if (voteData.targetType === 'comment') {
              const comment = await storage.getCommentById(voteData.targetId);
              if (comment) {
                const issue = await storage.getGovernanceIssueById(comment.issueId);
                if (issue) {
                  itemTitle = `comment on "${issue.title}"`;
                  await NotificationService.notifyNewVote(
                    authorId,
                    userId,
                    voter.username,
                    voteData.voteType,
                    'review',
                    itemTitle,
                    itemId
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("Failed to send vote notification:", error);
        }
      }

      res.json(vote);
    } catch (error) {
      console.error("Error creating vote:", error);
      res.status(500).json({ message: "Failed to create vote" });
    }
  });

  // Issue-specific voting endpoints
  app.get('/api/issues/:issueId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const userId = req.user.claims?.sub || req.user.id;

      const existingVote = await storage.getUserVote(userId, 'issue', issueId);
      res.json(existingVote);
    } catch (error) {
      console.error("Error fetching user vote:", error);
      res.status(500).json({ message: "Failed to fetch user vote" });
    }
  });

  app.post('/api/issues/:issueId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;

      // Check if user already voted
      const existingVote = await storage.getUserVote(userId, 'issue', issueId);
      if (existingVote) {
        return res.status(400).json({ message: "Already voted" });
      }

      const voteData = {
        userId: userId,
        targetType: 'issue' as const,
        targetId: issueId,
        voteType: type
      };

      const vote = await storage.createVote(voteData);

      // Award XP for voting and for receiving votes
      const issue = await storage.getGovernanceIssueById(issueId);
      if (issue) {
        // Award 5 XP to voter and get activity record for on-chain recording
        const voteActivity = await storage.awardVotingXp(userId, 'issue', issueId, type);

        // Record the vote to 0G Storage for on-chain audit trail
        if (voteActivity && voteActivity.id) {
          recordActivityToOgStorage(
            voteActivity.id,
            'VOTE',
            userId,
            issueId,
            'ISSUE',
            '',
            {
              voteType: type,
              targetType: 'issue'
            }
          );
        }

        // Award engagement XP to content author
        if (type === 'upvote') {
          await storage.awardUpvoteReceivedXp(issue.authorId, issueId);
        } else {
          await storage.awardDownvoteReceivedXp(issue.authorId, issueId);
        }
      }

      res.json(vote);
    } catch (error) {
      console.error("Error creating issue vote:", error);
      res.status(500).json({ message: "Failed to create issue vote" });
    }
  });

  // Comment voting endpoints
  app.post('/api/comments/:commentId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;

      if (!['upvote', 'downvote'].includes(type)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      // Check if user already voted on this comment
      const existingVote = await db
        .select()
        .from(commentVotes)
        .where(and(
          eq(commentVotes.userId, userId),
          eq(commentVotes.commentId, commentId)
        ))
        .limit(1);

      if (existingVote.length > 0) {
        return res.status(400).json({ message: "You have already voted on this comment" });
      }

      // Get the comment to check if it exists and get author info
      const comment = await storage.getCommentById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Create the vote record
      await db.insert(commentVotes).values({
        commentId,
        userId,
        voteType: type
      });

      // Update the comment's vote counts
      if (type === 'upvote') {
        await db
          .update(comments)
          .set({ upvotes: sql`${comments.upvotes} + 1` })
          .where(eq(comments.id, commentId));
      } else {
        await db
          .update(comments)
          .set({ downvotes: sql`${comments.downvotes} + 1` })
          .where(eq(comments.id, commentId));
      }

      // Award XP for voting and for receiving votes
      let pointsEarned = 0;

      // Award 3 XP to voter for participating and get activity record for on-chain recording
      const commentVoteActivity = await storage.awardVotingXp(userId, 'comment', commentId, type);
      pointsEarned += 3;

      // Record the vote to 0G Storage for on-chain audit trail
      if (commentVoteActivity && commentVoteActivity.id) {
        recordActivityToOgStorage(
          commentVoteActivity.id,
          'VOTE',
          userId,
          commentId,
          'COMMENT',
          '',
          {
            voteType: type,
            targetType: 'comment'
          }
        );
      }

      // Award engagement XP to comment author
      if (type === 'upvote') {
        await storage.awardUpvoteReceivedXp(comment.authorId, commentId);

        // Send notification for comment upvote (don't notify self)
        if (comment.authorId !== userId) {
          const voter = await storage.getUser(userId);
          await NotificationService.notifyNewVote(
            comment.authorId,
            userId,
            voter?.username || 'Someone',
            'upvote',
            'comment',
            comment.content.substring(0, 50) + '...',
            commentId
          );
        }
      } else {
        await storage.awardDownvoteReceivedXp(comment.authorId, commentId);
      }

      res.json({
        success: true,
        message: "Vote recorded successfully",
        pointsEarned
      });
    } catch (error) {
      console.error("Error creating comment vote:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // Specific review endpoints - must come before individual review endpoint
  app.get('/api/reviews/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentReviews = await storage.getRecentReviews(limit);
      res.json(recentReviews);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      res.status(500).json({ message: "Failed to fetch recent reviews" });
    }
  });

  app.get('/api/reviews/recent-grs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;

      // Add timeout and better error handling
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const reviewsPromise = storage.getRecentReviewsWithGrsChanges(limit);

      const recentReviewsWithGrsChanges = await Promise.race([reviewsPromise, timeoutPromise]);

      // Add caching headers
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
      res.json(recentReviewsWithGrsChanges);
    } catch (error) {
      console.error("Error fetching recent reviews with GRS:", error);
      // Return empty array instead of error to prevent UI blocking
      res.json([]);
    }
  });

  // Individual review endpoint with parameter - must come after specific endpoints
  app.get('/api/reviews/:reviewId', async (req, res) => {
    try {
      console.log("Getting review with ID:", req.params.reviewId);
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        console.log("Invalid review ID:", req.params.reviewId);
        return res.status(400).json({ message: "Invalid review ID" });
      }

      console.log("About to call storage.getReviewById with reviewId:", reviewId);
      const review = await storage.getReviewById(reviewId);
      console.log("Retrieved review from storage:", JSON.stringify(review, null, 2));
      if (!review) {
        console.log("Review not found for ID:", reviewId);
        return res.status(404).json({ message: "Review not found" });
      }

      res.json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  });

  // Review comments endpoints
  app.get('/api/reviews/:reviewId/comments', async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const comments = await storage.getReviewComments(reviewId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching review comments:", error);
      res.status(500).json({ message: "Failed to fetch review comments" });
    }
  });

  app.post('/api/reviews/:reviewId/comments', requireInviteAccess, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const userId = req.user.claims?.sub || req.user.id;
      const { content, parentCommentId } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      const commentData = {
        content: content.trim(),
        authorId: userId,
        reviewId: reviewId,
        parentCommentId: parentCommentId || null
      };

      const newComment = await storage.createReviewComment(commentData);

      // Award CREDA for commenting and get activity record for on-chain recording
      let reviewCommentActivity: any = null;
      try {
        reviewCommentActivity = await storage.awardCredaPoints(userId, 'social', 'review_comment', 10, 'review_comment', reviewId, {
          commentId: newComment.id,
          parentCommentId: parentCommentId || null
        });
      } catch (credaError) {
        console.error("Failed to award CREDA for review comment:", credaError);
        // Don't fail the request if CREDA awarding fails
      }

      // Record the review comment to 0G Storage for on-chain audit trail
      if (reviewCommentActivity && reviewCommentActivity.id) {
        recordActivityToOgStorage(
          reviewCommentActivity.id,
          'COMMENT',
          userId,
          newComment.id,
          'REVIEW',
          content.trim(),
          {
            reviewId: reviewId,
            parentCommentId: parentCommentId || null,
            commentType: 'review_comment'
          }
        ).catch(err => console.error('[0G Storage] Background recording for review comment failed:', err));
      }

      // Send notification for new comment or reply
      try {
        const review = await storage.getReviewById(reviewId);
        const commenter = await storage.getUser(userId);

        if (review && commenter) {
          // If this is a reply to another comment, notify the parent comment author
          if (parentCommentId) {
            const parentComment = await storage.getReviewCommentById(parentCommentId);
            if (parentComment && parentComment.authorId !== userId) {
              const reviewTitle = review.title ? review.title.substring(0, 50) + '...' : 'a review';
              const commenterName = commenter.username || commenter.twitterHandle || 'Someone';

              await NotificationService.notifyCommentReply(
                parentComment.authorId,
                userId,
                commenterName,
                reviewTitle,
                reviewId,
                content.trim()
              );
            }
          } else if (review.reviewerId !== userId) {
            // Otherwise, notify the review author about the new comment
            const reviewTitle = review.title ? review.title.substring(0, 50) + '...' : 'your review';
            const commenterName = commenter.username || commenter.twitterHandle || 'Someone';

            await NotificationService.notifyNewComment(
              review.reviewerId,
              userId,
              commenterName,
              reviewTitle,
              reviewId,
              'review',
              content.trim()
            );
          }
        }
      } catch (notificationError) {
        console.error("Failed to send review comment notification:", notificationError);
        // Don't fail the request if notification fails
      }

      res.status(201).json({
        ...newComment,
        message: "Comment posted successfully!"
      });
    } catch (error) {
      console.error("Error creating review comment:", error);
      res.status(500).json({ message: "Failed to create review comment" });
    }
  });

  // Batch review votes endpoint - reduces N+1 API calls
  app.post('/api/reviews/batch-votes', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { reviewIds } = req.body;
      
      if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        return res.json({});
      }
      
      // Limit to prevent abuse
      const limitedIds = reviewIds.slice(0, 100).map((id: any) => parseInt(id)).filter((id: number) => !isNaN(id));
      
      const votes = await storage.getUserVotesForReviews(userId, limitedIds);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching batch review votes:", error);
      res.status(500).json({ message: "Failed to fetch batch review votes" });
    }
  });

  // Review-specific voting endpoints
  app.get('/api/reviews/:reviewId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.claims?.sub || req.user.id;

      const existingVote = await storage.getUserVote(userId, 'review', reviewId);
      res.json(existingVote);
    } catch (error) {
      console.error("Error fetching user review vote:", error);
      res.status(500).json({ message: "Failed to fetch user user review vote" });
    }
  });

  app.post('/api/reviews/:reviewId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;

      // Validate vote type
      if (type !== 'upvote' && type !== 'downvote') {
        return res.status(400).json({ message: "Invalid vote type. Must be 'upvote' or 'downvote'" });
      }

      // Validate review exists (using simple query to avoid comment loading issues)
      const review = await storage.getReviewBasic(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if user already voted
      const existingVote = await storage.getUserVote(userId, 'review', reviewId);
      
      if (existingVote) {
        // If same vote type, toggle off (remove vote)
        if (existingVote.voteType === type) {
          await storage.deleteVote(userId, 'review', reviewId);
          return res.json({ deleted: true, message: "Vote removed" });
        }
        
        // If different vote type, update the vote
        const updatedVote = await storage.updateVote(userId, 'review', reviewId, type);
        if (!updatedVote) {
          return res.status(500).json({ message: "Failed to update vote" });
        }
        return res.json(updatedVote);
      }

      // Create new vote
      const voteData = {
        userId: userId,
        targetType: 'review' as const,
        targetId: reviewId,
        voteType: type
      };

      const vote = await storage.createVote(voteData);

      // Award CREDA for voting and for receiving votes (review already validated above)
      // Award 5 CREDA to voter and get activity record for on-chain recording
      const reviewVoteActivity = await storage.awardCredaPoints(
        userId,
        'engagement',
        'vote_cast',
        5,
        'review',
        reviewId,
        { action: `Voted ${type} on review ${reviewId}`, voteType: type }
      );

      // Record the vote to 0G Storage for on-chain audit trail
      if (reviewVoteActivity && reviewVoteActivity.id) {
        recordActivityToOgStorage(
          reviewVoteActivity.id,
          'VOTE',
          userId,
          reviewId,
          'REVIEW',
          '',
          {
            voteType: type,
            targetType: 'review'
          }
        );
      }

      // Award engagement CREDA to review author for upvotes
      if (type === 'upvote') {
        await storage.awardCredaPoints(
          review.reviewerId,
          'engagement',
          'review_upvote_received',
          5,
          'review',
          reviewId,
          { action: `Received upvote on review ${reviewId}` }
        );
      }

      res.json(vote);
    } catch (error) {
      console.error("Error creating review vote:", error);
      res.status(500).json({ message: "Failed to create review vote" });
    }
  });

  // Stance voting routes
  app.get('/api/stances/:stanceId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const userId = req.user.id;
      const vote = await storage.getUserStanceVote(userId, stanceId);
      res.json(vote || null);
    } catch (error) {
      console.error("Error fetching user stance vote:", error);
      res.status(500).json({ message: "Failed to fetch user stance vote" });
    }
  });

  // Get all user's stance votes
  app.get('/api/user/stance-votes', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const votes = await storage.getUserStanceVotes(userId);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching user stance votes:", error);
      res.status(500).json({ message: "Failed to fetch user stance votes" });
    }
  });

  app.post('/api/stances/:stanceId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const userId = req.user.claims?.sub || req.user.id;
      const { voteType } = req.body;

      if (!['champion', 'challenge', 'oppose'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      // Check if stance is still active
      const stance = await storage.getGovernanceIssueById(stanceId);
      if (!stance) {
        return res.status(404).json({ message: "Stance not found" });
      }

      if (!stance.isActive || new Date() > new Date(stance.expiresAt)) {
        return res.status(400).json({ message: "Voting period has ended" });
      }

      // Check if user already voted
      const existingVote = await storage.getUserStanceVote(userId, stanceId);

      if (existingVote) {
        return res.status(400).json({ message: "You have already voted on this stance" });
      }

      // Create new vote
      const voteData = {
        userId,
        stanceId,
        voteType
      };
      const vote = await storage.createStanceVote(voteData);

      // Award CREDA for voting (5 CREDA as per CREDA system specification) and get activity record
      const stanceVoteActivity = await storage.awardCredaPoints(
        userId,
        'engagement',
        'vote_cast',
        5,
        'stance_vote',
        stanceId,
        { action: `Voted ${voteType} on stance ${stanceId}`, voteType }
      );

      // Record the vote to 0G Storage for on-chain audit trail
      if (stanceVoteActivity && stanceVoteActivity.id) {
        recordActivityToOgStorage(
          stanceVoteActivity.id,
          'VOTE',
          userId,
          stanceId,
          'ISSUE',
          '',
          {
            voteType: voteType,
            targetType: 'stance'
          }
        );
      }

      // Send notification to stance author about the vote
      try {
        const voter = await storage.getUser(userId);
        if (voter && stance.authorId !== userId) {
          await NotificationService.notifyNewVote(
            stance.authorId,
            userId,
            voter.username || voter.twitterHandle || 'Someone',
            voteType,
            'stance',
            stance.title,
            stanceId
          );
        }
      } catch (error) {
        console.error("Failed to send stance vote notification:", error);
      }

      res.json(vote);
    } catch (error) {
      console.error("Error creating stance vote:", error);
      res.status(500).json({ message: "Failed to create stance vote" });
    }
  });

  app.delete('/api/stances/:stanceId/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const userId = req.user.id;

      await storage.deleteStanceVote(userId, stanceId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting stance vote:", error);
      res.status(500).json({ message: "Failed to delete stance vote" });
    }
  });

  app.get('/api/issues/:issueId/stance-vote-counts', async (req: any, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const counts = await storage.getStanceVoteCounts(issueId);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching stance vote counts:", error);
      res.status(500).json({ message: "Failed to fetch stance vote counts" });
    }
  });

  app.get('/api/stances/:stanceId/vote-counts', async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const counts = await storage.getStanceVoteCounts(stanceId);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching stance vote counts:", error);
      res.status(500).json({ message: "Failed to fetch stance vote counts" });
    }
  });

  app.get('/api/issues/:issueId/stance-voters', async (req: any, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const voters = await storage.getStanceVoters(issueId);
      res.json(voters);
    } catch (error) {
      console.error("Error fetching stance voters:", error);
      res.status(500).json({ message: "Failed to fetch stance voters" });
    }
  });

  app.get('/api/stances/:stanceId/voters', async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const voters = await storage.getStanceVoters(stanceId);
      res.json(voters);
    } catch (error) {
      console.error("Error fetching stance voters:", error);
      res.status(500).json({ message: "Failed to fetch stance voters" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard/global', async (req, res) => {
    try {
      const leaderboard = await storage.getGlobalLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/leaderboard/dao/:daoId', async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoLeaderboard(daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });

  // CREDA Leaderboard routes
  app.get('/api/leaderboard/creda', async (req, res) => {
    try {
      const timeframe = (req.query.timeframe as 'overall' | 'weekly') || 'overall';
      const limit = parseInt(req.query.limit as string) || 50;
      const daoId = req.query.daoId ? parseInt(req.query.daoId as string) : undefined;
      
      // Use cache for leaderboard
      const cacheKey = `leaderboard:creda:${timeframe}:${limit}:${daoId || 'all'}`;
      const cached = getCachedResponse<any[]>(cacheKey, CACHE_DURATIONS.leaderboard);
      if (cached) {
        return res.json(cached);
      }
      
      const leaderboard = await storage.getCredaLeaderboard(timeframe, limit, daoId);
      setCachedResponse(cacheKey, leaderboard);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching CREDA leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch CREDA leaderboard" });
    }
  });

  // XP Leaderboard routes (alias for CREDA)
  app.get('/api/leaderboard/xp', async (req, res) => {
    try {
      const timeframe = (req.query.timeframe as 'overall' | 'weekly') || 'overall';
      const limit = parseInt(req.query.limit as string) || 50;
      const daoId = req.query.daoId ? parseInt(req.query.daoId as string) : undefined;
      const leaderboard = await storage.getCredaLeaderboard(timeframe, limit, daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching XP leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch XP leaderboard" });
    }
  });

  app.get('/api/leaderboard/stats', async (req, res) => {
    try {
      // Use cache for stats
      const cacheKey = 'leaderboard:stats';
      const cached = getCachedResponse<any>(cacheKey, CACHE_DURATIONS.stats);
      if (cached) {
        return res.json(cached);
      }
      
      const stats = await storage.getLeaderboardStats();
      setCachedResponse(cacheKey, stats);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching leaderboard stats:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard stats" });
    }
  });

  app.get('/api/leaderboard/referrals', async (req, res) => {
    try {
      const leaderboard = await storage.getReferralLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching referral leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch referral leaderboard" });
    }
  });

  app.get('/api/leaderboard/governors', async (req, res) => {
    try {
      // Use cache for governors leaderboard
      const cacheKey = 'leaderboard:governors';
      const cached = getCachedResponse<any[]>(cacheKey, CACHE_DURATIONS.leaderboard);
      if (cached) {
        return res.json(cached);
      }
      
      const leaderboard = await storage.getGovernorsLeaderboard();
      const topGovernors = leaderboard.slice(0, 6);
      
      // Enrich with GRS scores to avoid N+1 queries
      const userIds = topGovernors.map((u: any) => u.id);
      const grsScores = await storage.getBatchGrsScores(userIds);
      
      const enrichedLeaderboard = topGovernors.map((user: any) => ({
        ...user,
        grsScore: grsScores[user.id]?.score || 0,
        grsPercentile: grsScores[user.id]?.percentile || 0
      }));
      
      setCachedResponse(cacheKey, enrichedLeaderboard);
      res.json(enrichedLeaderboard);
    } catch (error) {
      console.error("Error fetching governors leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch governors leaderboard" });
    }
  });

  // Get recent users
  app.get('/api/users/recent', async (req, res) => {
    try {
      const users = await storage.getRecentUsers(6);
      res.json(users);
    } catch (error) {
      console.error("Error fetching recent users:", error);
      res.status(500).json({ message: "Failed to fetch recent users" });
    }
  });

  // User search route
  app.get('/api/users/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Combined search route for users and DAOs
  app.get('/api/search/profiles', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const results = await storage.searchUsersAndDaos(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching profiles:", error);
      res.status(500).json({ message: "Failed to search profiles" });
    }
  });

  app.get('/api/twitter/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const accounts = await storage.searchTwitterAccounts(query);

      // If searching for "jup" or "jupiter", make sure Jupiter DAO appears in results
      const searchLower = query.toLowerCase();
      if ((searchLower.includes('jup') || searchLower.includes('jupiter')) && !accounts.some(acc => acc.twitterHandle === 'jup_dao')) {
        accounts.unshift({
          id: 'jupiter_dao_profile',
          username: 'Jupiter DAO',
          firstName: 'Jupiter',
          lastName: 'DAO',
          profileImageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center',
          xpPoints: 12450,
          isUnclaimedProfile: true,
          isClaimed: false,
          twitterHandle: 'jup_dao',
          twitterUrl: 'https://x.com/jup_dao',
          hasInviteAccess: false
        });
      }

      res.json(accounts);
    } catch (error) {
      console.error("Error searching Twitter accounts:", error);
      res.status(500).json({ message: "Failed to search Twitter accounts" });
    }
  });

  app.post('/api/twitter/create-unclaimed', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { twitterHandle, twitterUrl, firstName, lastName, profileType } = req.body;

      if (!twitterHandle) {
        return res.status(400).json({ message: "Twitter handle is required" });
      }

      const cleanHandle = twitterHandle.replace('@', '');

      // Special handling for Jupiter DAO
      if (cleanHandle === 'jup_dao' || cleanHandle === 'jupiter_dao') {
        const profile = await storage.createUnclaimedProfile({
          twitterHandle: 'jup_dao',
          twitterUrl: 'https://x.com/jup_dao',
          firstName: 'Jupiter',
          lastName: 'DAO',
          createdBy: userId,
          profileType: 'dao'
        });
        return res.json(profile);
      }

      const profile = await storage.createUnclaimedProfile({
        twitterHandle: cleanHandle,
        twitterUrl,
        firstName,
        lastName,
        createdBy: userId,
        profileType: profileType || 'member'
      });

      res.json(profile);
    } catch (error) {
      console.error("Error creating unclaimed profile:", error);
      if ((error as Error).message === "Twitter account already exists") {
        return res.status(409).json({ message: (error as Error).message });
      }
      res.status(500).json({ message: "Failed to create unclaimed profile" });
    }
  });

  app.get('/api/twitter/claimable/:handle', requireInviteAccess, async (req: any, res) => {
    try {
      const { handle } = req.params;
      const profiles = await storage.getClaimableProfilesForUser(handle);
      res.json(profiles);
    } catch (error) {
      console.error("Error getting claimable profiles:", error);
      res.status(500).json({ message: "Failed to get claimable profiles" });
    }
  });

  // Get claimable profiles for current authenticated user
  app.get('/api/auth/twitter/claimable-profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // Twitter OAuth user ID

      // Verify the user is authenticated via Twitter OAuth
      if (!req.user.username || req.user.claims) {
        return res.status(400).json({ message: "This endpoint is only for Twitter OAuth users" });
      }

      // Get the current Twitter handle from the logged-in user
      const currentUser = await storage.getUser(userId);
      if (!currentUser || !currentUser.twitterHandle) {
        return res.status(400).json({ message: "Twitter handle not found for current user" });
      }

      // Get claimable profiles
      const profiles = await storage.getClaimableProfilesForUser(currentUser.twitterHandle);
      console.log(`API endpoint found ${profiles.length} claimable profiles for ${currentUser.twitterHandle}`);
      res.json(profiles);
    } catch (error) {
      console.error("Error getting claimable profiles for authenticated user:", error);
      res.status(500).json({ message: "Failed to get claimable profiles" });
    }
  });

  // Get session info including claimable profiles data (no auth required for claiming flow)
  app.get('/api/auth/session-info', async (req: any, res) => {
    try {
      res.json({
        hasClaimableProfiles: req.session.hasClaimableProfiles || false,
        claimableProfilesCount: req.session.claimableProfilesCount || 0,
        twitterHandle: req.session.twitterHandle || null,
        inClaimingFlow: req.session.inClaimingFlow || false,
        twitterOAuthData: req.session.twitterOAuthData || null,
        claimableProfiles: req.session.claimableProfiles || []
      });
    } catch (error) {
      console.error("Error getting session info:", error);
      res.status(500).json({ message: "Failed to get session info" });
    }
  });

  app.post('/api/twitter/claim/:handle', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { handle } = req.params;

      const claimedProfile = await storage.claimProfile(handle, userId);

      if (!claimedProfile) {
        return res.status(404).json({ message: "No claimable profile found" });
      }

      res.json({
        message: "Profile claimed successfully",
        profile: claimedProfile
      });
    } catch (error) {
      console.error("Error claiming profile:", error);
      res.status(500).json({ message: "Failed to claim profile" });
    }
  });

  // New route for session-based profile claiming (no auth required)
  app.post('/api/auth/twitter/claim-profile', async (req: any, res) => {
    try {
      const { unclaimedProfileId } = req.body;

      console.log("Claim profile request:", { unclaimedProfileId, sessionData: req.session });

      // Check if we're in a claiming flow
      if (!req.session.inClaimingFlow || !req.session.twitterOAuthData) {
        return res.status(400).json({ message: "Not in claiming flow or missing Twitter OAuth data" });
      }

      const twitterOAuthData = req.session.twitterOAuthData;

      if (!unclaimedProfileId) {
        return res.status(400).json({ message: "Unclaimed profile ID is required" });
      }

      // Get the unclaimed profile to verify Twitter handle matches
      const claimableProfiles = req.session.claimableProfiles || [];
      const targetProfile = claimableProfiles.find(p => p.id === unclaimedProfileId);

      if (!targetProfile) {
        return res.status(404).json({ message: "No matching claimable profile found" });
      }

      // Verify Twitter handle matches
      if (targetProfile.twitterHandle !== twitterOAuthData.username) {
        return res.status(400).json({ message: "Twitter handle mismatch" });
      }

      console.log("Claiming profile:", targetProfile.id, "for Twitter user:", twitterOAuthData.username);

      // Create a new user by updating the unclaimed profile with OAuth data
      const updatedUser = await storage.updateUser(unclaimedProfileId, {
        email: null, // Twitter OAuth doesn't provide email
        profileImageUrl: twitterOAuthData.profileImageUrl,
        authProvider: "twitter",
        isClaimed: true,
        isUnclaimedProfile: false,
        claimedAt: new Date(),
        updatedAt: new Date(),
      });

      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to claim profile" });
      }

      console.log("Profile claimed successfully:", updatedUser.id);

      // Clear session claiming data
      delete req.session.inClaimingFlow;
      delete req.session.twitterOAuthData;
      delete req.session.claimableProfiles;
      delete req.session.claimableProfilesCount;
      delete req.session.twitterHandle;

      // Log the user in with the claimed profile
      req.logIn(updatedUser, (err) => {
        if (err) {
          console.error("Login error after claiming:", err);
          return res.status(500).json({ message: "Profile claimed but login failed" });
        }

        console.log("User logged in successfully after claiming");

        res.json({
          message: "Profile claimed successfully",
          profile: updatedUser,
          needsInviteCode: !updatedUser.hasInviteAccess
        });
      });

    } catch (error) {
      console.error("Error claiming profile via OAuth:", error);
      res.status(500).json({ message: "Failed to claim profile" });
    }
  });

  // Create unclaimed profile route
  app.post('/api/users/unclaimed', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { fullName, twitterUrl, walletAddress, profileType } = req.body;

      if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
      }

      // Extract Twitter handle from URL
      let twitterHandle = '';
      if (twitterUrl) {
        const match = twitterUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
        if (match) {
          twitterHandle = match[1];
        }
      }

      // If this is a DAO, create ONLY a DAO entry (not a user entry)
      if (profileType === 'dao') {
        let baseSlug = (twitterHandle || fullName).toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Check if slug exists and add unique suffix if needed
        let daoSlug = baseSlug;
        let counter = 1;
        while (true) {
          try {
            const existingDao = await storage.getDaoBySlug(daoSlug);
            if (!existingDao) {
              // Slug is available
              break;
            }
            // Slug exists, try with counter
            daoSlug = `${baseSlug}-${counter}`;
            counter++;
          } catch (error) {
            // If getDaoBySlug throws an error, the slug is available
            break;
          }
        }

        const dao = await storage.createDao({
          name: fullName,
          slug: daoSlug,
          description: `${fullName} DAO community`,
          logoUrl: null,
          twitterHandle: twitterHandle || null,
          twitterUrl: twitterUrl || null,
          website: null,
          category: 'DeFi',
          isVerified: false,
          isUnclaimed: true,
          claimedBy: null,
          claimedAt: null,
          createdBy: userId
        });

        // Return DAO data formatted like a user for compatibility with frontend
        const daoAsUser = {
          id: `dao_${dao.id}`,
          username: dao.slug,
          firstName: dao.name.split(' ')[0],
          lastName: dao.name.split(' ').slice(1).join(' ') || null,
          profileImageUrl: dao.logoUrl,
          twitterHandle: dao.twitterHandle,
          twitterUrl: dao.twitterUrl,
          profileType: 'dao',
          isUnclaimedProfile: dao.isUnclaimed,
          isClaimed: !dao.isUnclaimed,
          actualDaoId: dao.id // Include actual DAO ID for reference
        };

        res.json(daoAsUser);
      } else {
        // For non-DAO profiles, create a user entry as before
        const user = await storage.createUnclaimedProfile({
          twitterHandle: twitterHandle || `user_${Date.now()}`,
          twitterUrl,
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' ') || undefined,
          createdBy: userId,
          profileType: profileType || 'member',
          walletAddress
        });

        res.json(user);
      }
    } catch (error) {
      console.error("Error creating unclaimed profile:", error);
      res.status(500).json({ message: "Failed to create unclaimed profile" });
    }
  });

  // Twitter OAuth profile claiming route - NEW ACCESS_ID SYSTEM
  app.post('/api/users/claim-with-twitter', async (req, res) => {
    try {
      // Check if user has valid Twitter OAuth session data
      if (!req.session.twitterOAuthData || !req.session.inClaimingFlow) {
        return res.status(400).json({ message: "No valid Twitter OAuth claiming session found" });
      }

      const { profileId } = req.body; // Which profile to claim
      const twitterOAuthData = req.session.twitterOAuthData;

      if (!profileId) {
        return res.status(400).json({ message: "Profile ID is required" });
      }

      // Find the unclaimed profile by ID
      const unclaimedProfile = await storage.getUser(profileId);
      if (!unclaimedProfile || !unclaimedProfile.isUnclaimedProfile || unclaimedProfile.isClaimed) {
        return res.status(400).json({ message: "Profile not available for claiming" });
      }

      // Verify the Twitter handle matches
      if (unclaimedProfile.twitterHandle !== twitterOAuthData.username) {
        return res.status(400).json({ message: "Twitter handle mismatch - cannot claim this profile" });
      }

      // Use the new claiming method that sets access_id
      const claimedUser = await storage.claimProfileWithTwitterOAuth(
        twitterOAuthData.username,
        twitterOAuthData.id,
        twitterOAuthData
      );

      if (!claimedUser) {
        return res.status(500).json({ message: "Failed to claim profile" });
      }

      // Log the user in with the claimed profile
      req.logIn(claimedUser, (err) => {
        if (err) {
          console.error("Login error after claiming:", err);
          return res.status(500).json({ message: "Profile claimed but login failed" });
        }

        // Clean up session
        delete req.session.twitterOAuthData;
        delete req.session.claimableProfiles;
        delete req.session.claimableProfilesCount;
        delete req.session.twitterHandle;
        delete req.session.hasClaimableProfiles;
        delete req.session.inClaimingFlow;

        console.log(`Profile claimed successfully for ${claimedUser.username} with access_id: ${claimedUser.access_id}`);
        res.json({ message: "Profile claimed successfully", user: claimedUser });
      });

    } catch (error) {
      console.error("Error claiming profile with Twitter OAuth:", error);
      res.status(500).json({ message: "Failed to claim profile" });
    }
  });

  // Traditional claim profile route (for non-Twitter OAuth claiming)
  app.post('/api/users/:userId/claim', requireInviteAccess, async (req: any, res) => {
    try {
      const claimedBy = req.user.claims?.sub || req.user.id;
      const { userId } = req.params;

      // Check if profile is claimable
      const profile = await storage.getUser(userId);
      if (!profile || !profile.isUnclaimedProfile || profile.isClaimed) {
        return res.status(400).json({ message: "Profile not available for claiming" });
      }

      const user = await storage.claimProfile(userId, claimedBy);
      res.json(user);
    } catch (error) {
      console.error("Error claiming profile:", error);
      res.status(500).json({ message: "Failed to claim profile" });
    }
  });

  // Find claimable profiles route
  app.get('/api/users/claimable', requireInviteAccess, async (req: any, res) => {
    try {
      const { twitterHandle, walletAddress } = req.query;

      const profile = await storage.findClaimableProfile(
        twitterHandle as string,
        walletAddress as string
      );

      if (!profile) {
        return res.status(404).json({ message: "No claimable profile found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error finding claimable profile:", error);
      res.status(500).json({ message: "Failed to find claimable profile" });
    }
  });

  // Get user's XP activities (MUST come before parametric routes)
  app.get('/api/users/creda-activities', requireInviteAccess, async (req: any, res) => {
    try {
      // Handle both Twitter OAuth and Replit OAuth user ID formats
      const userId = req.user.claims?.sub || req.user.id;

      if (!userId) {
        console.log("No user ID found in request. User object:", req.user);
        return res.status(400).json({ message: "User not authenticated" });
      }

      console.log("Fetching CREDA activities for user:", userId);

      // Fetch all CREDA activities for the user
      const activities = await db
        .select()
        .from(credaActivities)
        .where(eq(credaActivities.userId, userId))
        .orderBy(desc(credaActivities.createdAt));

      console.log("Found CREDA activities:", activities.length);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching CREDA activities:", error);
      res.status(500).json({ message: "Failed to fetch CREDA activities" });
    }
  });

  // Today's XP Activities endpoint for Daily Tasks
  app.get('/api/users/creda-activities/today', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get today's start in UTC
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayDateString = todayStart.toISOString().split('T')[0];
      const todayEnd = new Date();
      todayEnd.setUTCHours(23, 59, 59, 999);

      const todayActivities = await db
        .select()
        .from(credaActivities)
        .where(
          and(
            eq(credaActivities.userId, userId),
            sql`DATE(${credaActivities.createdAt}) = ${todayDateString}`
          )
        )
        .orderBy(desc(credaActivities.createdAt));

      res.json(todayActivities);
    } catch (error) {
      console.error("Error fetching today's XP activities:", error);
      res.status(500).json({ message: "Failed to fetch today's activities" });
    }
  });

  // Daily Tasks Progress endpoint
  app.get('/api/daily-tasks/progress', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user data for current streak and longest streak
      const user = await db
        .select({
          dailyStreak: users.dailyStreak,
          longestStreak: users.longestStreak,
          lastStreakDate: users.lastStreakDate
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = user[0];

      // Get today's start and end in UTC
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayDateString = todayStart.toISOString().split('T')[0];
      const todayEnd = new Date();
      todayEnd.setUTCHours(23, 59, 59, 999);

      // Get today's XP activities using SQL DATE function
      const todayActivities = await db
        .select()
        .from(credaActivities)
        .where(
          and(
            eq(credaActivities.userId, userId),
            sql`DATE(${credaActivities.createdAt}) = ${todayDateString}`
          )
        );

      // Count unique action types completed today
      const uniqueActionTypes = new Set(todayActivities.map(activity => activity.activityType));
      const completedActionsCount = uniqueActionTypes.size;

      res.json({
        currentStreak: userData.dailyStreak || 0,
        longestStreak: userData.longestStreak || 0,
        lastStreakDate: userData.lastStreakDate,
        completedActionsToday: completedActionsCount,
        tasksComplete: completedActionsCount >= 3,
        todayActivities: todayActivities
      });

    } catch (error) {
      console.error("Error fetching daily tasks progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User profile routes
  // Combined profile data endpoint for faster loading
  app.get('/api/users/:userIdOrUsername/profile-data', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const [grsScore, issues, comments, reviews, activity, credaActivityData] = await Promise.all([
        storage.getGrsRanking(user.id).catch(() => ({ score: user.grsScore || 1300, percentile: 50 })),
        storage.getUserGovernanceIssues(user.id).catch(() => []),
        storage.getUserComments(user.id).catch(() => []),
        storage.getUserReviews(user.id).catch(() => []),
        storage.getUserActivity(user.id).catch(() => []),
        // Fetch CREDA activities with 0G fields for the on-chain verification column
        db.select().from(credaActivities)
          .where(eq(credaActivities.userId, user.id))
          .orderBy(desc(credaActivities.createdAt))
          .limit(50)
          .catch(() => [])
      ]);

      // Activity already includes ogTxHash from getUserActivity's proper lookup
      // Only fallback to timestamp-based matching for activities that don't have ogTxHash
      const activityWithOgData = activity.map((act: any) => {
        // If activity already has ogTxHash from getUserActivity, keep it
        if (act.ogTxHash) {
          return act;
        }
        
        // Fallback: Try to find matching CREDA activity by type and approximate timestamp
        const matchingCredaActivity = credaActivityData.find((ca: any) => {
          const actTime = new Date(act.createdAt || act.timestamp).getTime();
          const caTime = new Date(ca.createdAt).getTime();
          const timeDiff = Math.abs(actTime - caTime);
          // Match if same user and within 5 minutes
          return timeDiff < 5 * 60 * 1000;
        });
        
        return {
          ...act,
          ogTxHash: matchingCredaActivity?.ogTxHash || null,
          ogRootHash: matchingCredaActivity?.ogRootHash || null,
          ogRecordedAt: matchingCredaActivity?.ogRecordedAt || null
        };
      });

      const xp = { xpPoints: user.xpPoints || 0, level: Math.floor((user.xpPoints || 0) / 100) + 1 };

      res.json({
        user,
        grsScore,
        issues,
        comments,
        reviews,
        activity: activityWithOgData,
        xp
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({ message: "Failed to fetch profile data" });
    }
  });

  app.get('/api/users/:userIdOrUsername', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID (for backward compatibility)
      user = await storage.getUser(userIdOrUsername);

      // If not found by ID, try by username
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/users/:userIdOrUsername/issues', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const issues = await storage.getUserGovernanceIssues(user.id);
      res.json(issues);
    } catch (error) {
      console.error("Error fetching user governance issues:", error);
      res.status(500).json({ message: "Failed to fetch user governance issues" });
    }
  });

  app.get('/api/users/:userIdOrUsername/comments', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const comments = await storage.getUserComments(user.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Failed to fetch user comments" });
    }
  });

  // Review routes
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const reviews = await storage.getRecentReviews(limit);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      res.status(500).json({ message: "Failed to fetch recent reviews" });
    }
  });

  // Space activity routes
  app.get('/api/spaces/:spaceSlug/activities', async (req, res) => {
    try {
      const { spaceSlug } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      console.log(`Fetching activities for space: ${spaceSlug}`);

      // Fetch both reviews and stances for this space
      const [reviews, stances] = await Promise.all([
        storage.getReviewsBySpace(spaceSlug, limit),
        storage.getGovernanceIssuesBySpace(spaceSlug, limit)
      ]);

      console.log(`Found ${reviews.length} reviews and ${stances.length} stances for ${spaceSlug}`);

      // Combine and sort by createdAt
      const activities = [
        ...reviews.map(r => ({ ...r, type: 'review' })),
        ...stances.map(s => ({ ...s, type: 'stance' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
       .slice(0, limit);

      console.log(`Returning ${activities.length} total activities for ${spaceSlug}`);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching space activities:", error);
      res.status(500).json({ message: "Failed to fetch space activities" });
    }
  });

  // Get space by slug
  app.get('/api/spaces/:spaceSlug', async (req, res) => {
    try {
      const { spaceSlug } = req.params;
      const space = await storage.getSpaceBySlug(spaceSlug);
      
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }

      res.json(space);
    } catch (error) {
      console.error("Error fetching space:", error);
      res.status(500).json({ message: "Failed to fetch space" });
    }
  });

  // Vote on a space (bullish/bearish)
  app.post('/api/spaces/:spaceSlug/vote', requireInviteAccess, async (req: any, res) => {
    try {
      const { spaceSlug } = req.params;
      const { voteType, comment } = req.body;
      const userId = req.user.claims?.sub || req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!voteType || (voteType !== 'bullish' && voteType !== 'bearish')) {
        return res.status(400).json({ message: "Invalid vote type. Must be 'bullish' or 'bearish'" });
      }

      // Get space by slug
      const space = await storage.getSpaceBySlug(spaceSlug);
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }

      // Check if user has already voted
      const existingVote = await storage.getUserSpaceVote(userId, space.id);

      let vote;
      if (existingVote) {
        // Update existing vote
        vote = await storage.updateSpaceVote(userId, space.id, voteType, comment);
      } else {
        // Create new vote
        vote = await storage.createSpaceVote({
          spaceId: space.id,
          userId,
          voteType,
          comment: comment || null
        });
      }

      // Fetch updated space data
      const updatedSpace = await storage.getSpaceBySlug(spaceSlug);

      res.json({ vote, space: updatedSpace });
    } catch (error) {
      console.error("Error voting on space:", error);
      res.status(500).json({ message: "Failed to vote on space" });
    }
  });

  // Get user's vote on a space
  app.get('/api/spaces/:spaceSlug/my-vote', requireInviteAccess, async (req: any, res) => {
    try {
      const { spaceSlug } = req.params;
      const userId = req.user.claims?.sub || req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get space by slug
      const space = await storage.getSpaceBySlug(spaceSlug);
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }

      // Get user's vote
      const vote = await storage.getUserSpaceVote(userId, space.id);

      res.json(vote || null);
    } catch (error) {
      console.error("Error fetching user's space vote:", error);
      res.status(500).json({ message: "Failed to fetch user's space vote" });
    }
  });

  // Get recent space vote comments for feed
  app.get('/api/space-votes/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const voteComments = await storage.getRecentSpaceVoteComments(limit);
      res.json(voteComments);
    } catch (error) {
      console.error("Error fetching recent space vote comments:", error);
      res.status(500).json({ message: "Failed to fetch recent space vote comments" });
    }
  });

  // Create review
  app.post("/api/reviews", requireInviteAccess, async (req: any, res) => {
    try {
      console.log("Review creation request body:", req.body);
      console.log("Request user:", req.user);

      const {
        title,
        reviewedUserId,
        reviewedUsername,
        targetUserId,
        rating,
        content,
        category,
        reviewType,
        spaceSlug // Added spaceSlug here
      } = req.body;
      const reviewerId = req.user.claims?.sub || req.user.id;

      console.log("Extracted data:", { title, reviewedUserId, reviewedUsername, targetUserId, rating, content, category, reviewType, reviewerId, spaceSlug });

      // Enhanced validation
      if (!reviewerId) {
        console.log("No reviewer ID found");
        return res.status(401).json({ message: "Authentication required" });
      }

      // Use reviewedUsername if provided, fallback to targetUserId for compatibility
      const targetUsername = reviewedUsername || targetUserId;

      if (!rating || !content || !category || !reviewType || !targetUsername) {
        console.log("Missing required fields validation failed");
        return res.status(400).json({ message: "Missing required fields: rating, content, category, reviewType, and targetUsername are required" });
      }

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        console.log("Rating validation failed:", rating);
        return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
      }

      if (typeof content !== 'string' || content.trim().length < 10) {
        console.log("Content validation failed");
        return res.status(400).json({ message: "Review content must be at least 10 characters long" });
      }

      // Validate reviewType
      if (!['positive', 'negative', 'neutral'].includes(reviewType)) {
        console.log("Invalid review type:", reviewType);
        return res.status(400).json({ message: "Invalid review type" });
      }

      // Use reviewedUserId if provided, fallback to targetUserId for compatibility
      const finalReviewedUserId = reviewedUserId || targetUserId;
      console.log("Final reviewed user ID:", finalReviewedUserId);

      if (!finalReviewedUserId) {
        console.log("No target user ID provided");
        return res.status(400).json({ message: "Target user ID is required" });
      }

      // Validate target username
      if (typeof targetUsername !== 'string' || targetUsername.trim().length === 0) {
        console.log("Invalid target username:", targetUsername);
        return res.status(400).json({ message: "Valid target username is required" });
      }

      // Get reviewer info for validation
      const reviewer = await storage.getUser(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is trying to review themselves (only for platform users)
      if (targetUserId === reviewerId) {
        console.log("User trying to review themselves");
        return res.status(400).json({ message: "You cannot review yourself" });
      }

      // Check if user has already reviewed this person/DAO
      let existingReview = null;
      if (finalReviewedUserId.startsWith('dao_')) {
        const daoId = parseInt(finalReviewedUserId.replace('dao_', ''));
        existingReview = await storage.getReviewByUserAndDao(reviewerId, daoId);
      } else {
        existingReview = await storage.getReviewByUsers(reviewerId, finalReviewedUserId);
      }

      if (existingReview) {
        console.log("User has already reviewed this entity");
        return res.status(400).json({ message: "You have already reviewed this entity" });
      }

      // Convert spaceSlug to spaceId if provided
      let spaceId = null;
      if (spaceSlug && spaceSlug.trim() !== '') {
        console.log(`Looking up space with slug: ${spaceSlug}`);
        const space = await storage.getSpaceBySlug(spaceSlug);
        if (space) {
          spaceId = space.id;
          console.log(`Found space: ${space.name} with ID: ${spaceId}`);
        } else {
          console.log(`No space found for slug: ${spaceSlug}`);
        }
      }

      const reviewData = {
        reviewerId,
        reviewedUserId: finalReviewedUserId.startsWith('dao_') ? null : finalReviewedUserId,
        reviewedDaoId: finalReviewedUserId.startsWith('dao_') ? parseInt(finalReviewedUserId.replace('dao_', '')) : null,
        targetType: finalReviewedUserId.startsWith('dao_') ? 'dao' : 'user',
        isTargetOnPlatform: true, // Assuming review is always on platform users/DAOs for now
        reviewType,
        rating,
        title,
        content,
        pointsAwarded: 5, // Base points for writing a review
        upvotes: 0,
        downvotes: 0,
        spaceId
      };

      console.log("Creating review with data:", reviewData);

      // Create the review
      const review = await storage.createReview(reviewData);
      console.log("Review created successfully:", review);

      // Update GRS impact for the reviewed user/DAO
      try {
        await storage.updateReviewImpact(review.id);
        console.log(`GRS impact applied for review ${review.id} on target ${finalReviewedUserId}`);
      } catch (grsError) {
        console.error("Failed to update GRS impact:", grsError);
        // Don't fail the whole request if GRS update fails
      }

      // Award CREDA to the user being reviewed (if on platform)
      let reviewedUserCredaAward = 0;
      if (!finalReviewedUserId.startsWith('dao_')) {
        try {
          let receivedCredaAmount = 0;
          if (reviewType === 'positive') {
            receivedCredaAmount = 15; // CREDA for receiving positive review
          } else if (reviewType === 'neutral') {
            receivedCredaAmount = 5; // CREDA for receiving neutral review
          } else {
            receivedCredaAmount = 2; // CREDA for receiving negative review
          }
          reviewedUserCredaAward = receivedCredaAmount;

          await storage.awardCredaPoints(finalReviewedUserId, 'social', 'review_received', receivedCredaAmount, 'review', review.id, {
            description: `Received ${reviewType} review from ${reviewerId}`,
            reviewType: reviewType,
            rating: rating,
            receivedFromUser: reviewerId
          });
          console.log(`Awarded ${receivedCredaAmount} CREDA to reviewed user ${finalReviewedUserId}`);
        } catch (credaError) {
          console.error("Failed to award CREDA to reviewed user:", credaError);
          // Don't fail the whole request if CREDA awarding fails
        }
      }

      // Award CREDA for creating a review with descriptive activity name
      let pointsEarned = 0;
      try {
        pointsEarned = 200; // CREDA for writing a review (highest earning activity)
        const activityDescription = `Reviewed ${targetUsername}`;
        const reviewActivity = await storage.awardCredaPoints(reviewerId, 'social', 'review_given', pointsEarned, 'review', review.id, {
          description: activityDescription,
          reviewedUsername: targetUsername,
          rating: rating
        });
        console.log("CREDA awarded successfully for review creation");

        // Record the review to 0G Storage for on-chain audit trail
        if (reviewActivity && reviewActivity.id) {
          recordActivityToOgStorage(
            reviewActivity.id,
            'REVIEW',
            reviewerId,
            review.id,
            reviewData.reviewedUserId ? 'USER' : 'DAO',
            content,
            {
              rating: rating,
              reviewType: reviewType,
              targetUsername: targetUsername,
              title: title
            }
          );
        }
      } catch (credaError) {
        console.error("Failed to award CREDA, but review was created:", credaError);
        // Don't fail the whole request if CREDA awarding fails
        pointsEarned = 0;
      }

      // Send notification to the reviewed user or DAO owner (only if they're on the platform)
      try {
        const reviewerUser = await storage.getUser(reviewerId);
        if (!reviewerUser) {
          throw new Error("Reviewer user not found for notification");
        }

        if (reviewData.reviewedUserId) { // Review for a user
          await NotificationService.notifyNewReview(
            reviewData.reviewedUserId,
            reviewerId,
            reviewerUser.username,
            rating,
            content
          );
        } else if (reviewData.reviewedDaoId) { // Review for a DAO
          const dao = await storage.getDaoById(reviewData.reviewedDaoId);
          if (dao && dao.claimedBy) {
            await NotificationService.notifyNewReview(
              dao.claimedBy,
              reviewerId,
              reviewerUser.username,
              rating,
              `${reviewerUser.username} reviewed your DAO: ${dao.name}`
            );
          }
        }
      } catch (notificationError) {
        console.error("Failed to send review notification:", notificationError);
        // Don't fail the whole request if notification fails
      }

      console.log("About to send success response");

      // Ensure we return a proper JSON response with status 201
      const successResponse = {
        id: review.id,
        reviewerId: review.reviewerId,
        reviewedUserId: review.reviewedUserId,
        reviewedDaoId: review.reviewedDaoId,
        targetType: review.targetType,
        reviewType: review.reviewType,
        rating: review.rating,
        title: review.title, // Include the title in the response
        content: review.content,
        createdAt: review.createdAt,
        pointsEarned, // CREDA earned by the reviewer
        reviewedUserCredaAward: reviewedUserCredaAward, // CREDA earned by the reviewed user
        message: "Review posted successfully!"
      };

      console.log("Sending success response:", successResponse);

      // Set response headers to ensure proper JSON response
      res.setHeader('Content-Type', 'application/json');
      return res.status(201).json(successResponse);

    } catch (error) {
      console.error("Error creating review:", error);

      // Ensure error response is also properly formatted
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        message: "Failed to create review",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get('/api/users/:userIdOrUsername/reviews', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const reviews = await storage.getUserReviews(user.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  app.post('/api/users/:userIdOrUsername/reviews', requireInviteAccess, async (req: any, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let reviewedUser;

      // First try to get by ID, then by username
      reviewedUser = await storage.getUser(userIdOrUsername);
      if (!reviewedUser) {
        reviewedUser = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!reviewedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const reviewerId = req.user.id;

      // Check if user is trying to review themselves
      if (reviewerId === reviewedUser.id) {
        return res.status(400).json({ message: "Cannot review yourself" });
      }

      // Check if review already exists
      const existingReview = await storage.getReviewByUsers(reviewerId, reviewedUser.id);
      if (existingReview) {
        return res.status(409).json({ message: "You have already reviewed this user" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId,
        reviewedUserId: reviewedUser.id
      });

      const review = await storage.createReview(reviewData);

      // Automatically update GRS for review impact
      await storage.updateReviewImpact(review.id);

      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/users/:userIdOrUsername/review-stats', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stats = await storage.getUserReviewStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user review stats:", error);
      res.status(500).json({ message: "Failed to fetch user review stats" });
    }
  });

  // Get advanced review stats for a user
  app.get('/api/users/:userIdOrUsername/advanced-review-stats', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stats = await storage.getUserAdvancedReviewStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching advanced review stats:", error);
      res.status(500).json({ message: "Failed to fetch advanced review stats" });
    }
  });

  // Get stance stats for a user
  app.get('/api/users/:userIdOrUsername/stance-stats', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stats = await storage.getUserStanceStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stance stats:", error);
      res.status(500).json({ message: "Failed to fetch stance stats" });
    }
  });

  app.get('/api/users/:userIdOrUsername/has-reviewed', isAuthenticated, async (req: any, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasReviewed = await storage.hasUserReviewed(req.user.id, user.id);
      res.json({ hasReviewed });
    } catch (error) {
      console.error("Error checking if user has reviewed:", error);
      res.status(500).json({ message: "Failed to check review status" });
    }
  });

  app.get('/api/users/:userIdOrUsername/activity', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user;

      // First try to get by ID, then by username
      user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const activity = await storage.getUserActivity(user.id);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ message: "Failed to fetch user activity" });
    }
  });

  app.patch('/api/users/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      if (userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updateData = req.body;
      const user = await storage.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Admin route for updating any user/DAO
  app.patch('/api/admin/users/:userId', requireAdminAuth, async (req, res) =>{
    try {
      const userId = req.params.userId;
      const updateData = req.body;

      // Log the update for verification changes
      if (updateData.isVerified !== undefined) {
        console.log(`Admin updating user ${userId} verification status to: ${updateData.isVerified}`);
      }

      const user = await storage.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Stats routes
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Follow routes
  app.get('/api/users/:userId/follows', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      if (userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const followedDaos = await storage.getUserFollowedDaos(userId);
      res.json(followedDaos);
    } catch (error) {
      console.error("Error fetching user follows:", error);
      res.status(500).json({ message: "Failed to fetch user follows" });
    }
  });

  app.get('/api/daos/:daoId/follow-status', isAuthenticated, async (req: any, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const userId = req.user.id;

      const followStatus = await storage.getUserFollowingStatus(userId, daoId);
      res.json({ isFollowing: !!followStatus });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  app.post('/api/daos/:daoId/follow', requireInviteAccess, async (req: any, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const userId = req.user.id;

      // Check if already following
      const existingFollow = await storage.getUserFollowingStatus(userId, daoId);
      if (existingFollow) {
        return res.status(409).json({ message: "Already following this DAO" });
      }

      const follow = await storage.followDao(userId, daoId);
      res.json(follow);
    } catch (error) {
      console.error("Error following DAO:", error);
      res.status(500).json({ message: "Failed to follow DAO" });
    }
  });

  app.delete('/api/daos/:daoId/follow', requireInviteAccess, async (req: any, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const userId = req.user.id;

      await storage.unfollowDao(userId, daoId);
      res.json({ message: "Successfully unfollowed DAO" });
    } catch (error) {
      console.error("Error unfollowing DAO:", error);
      res.status(500).json({ message: "Failed to unfollow DAO" });
    }
  });

  // Search routes
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;

      if (!query || query.trim().length < 2) {
        return res.json({ daos: [], threads: [], users: [] });
      }

      const results = await storage.searchContent(query.trim());

      // Ensure we return the correct format expected by the frontend
      const formattedResults = {
        daos: results.daos || [],
        threads: results.threads || [],
        users: results.users || []
      };

      res.json(formattedResults);
    } catch (error) {
      console.error("Error searching content:", error);
      res.status(500).json({ daos: [], threads: [], users: [] });
    }
  });

  // Business profile routes
  app.post('/api/business/onboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const data = req.body;

      const existingProfile = await storage.getBusinessProfileByUserId(userId);
      if (existingProfile) {
        return res.status(400).json({ message: "Business profile already exists" });
      }

      const profile = await storage.createBusinessProfile(userId, data);
      res.json(profile);
    } catch (error) {
      console.error("Error creating business profile:", error);
      res.status(500).json({ message: "Failed to create business profile" });
    }
  });

  app.get('/api/business/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const profile = await storage.getBusinessProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching business profile:", error);
      res.status(500).json({ message: "Failed to fetch business profile" });
    }
  });

  app.get('/api/business/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getBusinessProfileBySlug(slug);
      
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching business profile:", error);
      res.status(500).json({ message: "Failed to fetch business profile" });
    }
  });

  app.get('/api/business/invite/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const profile = await storage.getBusinessProfileByInviteCode(inviteCode);
      
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching business profile by invite code:", error);
      res.status(500).json({ message: "Failed to fetch business profile" });
    }
  });

  app.put('/api/business/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const profile = await storage.getBusinessProfileByUserId(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      const deployedProfile = await storage.deployBusinessProfile(profile.id);
      res.json(deployedProfile);
    } catch (error) {
      console.error("Error deploying business profile:", error);
      res.status(500).json({ message: "Failed to deploy business profile" });
    }
  });

  app.get('/api/business/:slug/reviews', async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getBusinessProfileBySlug(slug);
      
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }

      const reviews = await storage.getBusinessReviews(profile.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching business reviews:", error);
      res.status(500).json({ message: "Failed to fetch business reviews" });
    }
  });

  app.post('/api/business/reviews', async (req, res) => {
    try {
      const { inviteCode, title, content, rating, reviewerName, reviewerEmail } = req.body;

      if (!inviteCode || !content || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const profile = await storage.getBusinessProfileByInviteCode(inviteCode);
      if (!profile) {
        return res.status(404).json({ message: "Invalid invite code" });
      }

      let reviewerId = null;
      if (req.user) {
        reviewerId = req.user.claims?.sub || req.user.id;
      } else if (reviewerEmail) {
        let user = await storage.getUserByEmail(reviewerEmail);
        if (!user) {
          user = await storage.createUser({
            email: reviewerEmail,
            firstName: reviewerName || 'Anonymous',
            username: reviewerEmail.split('@')[0] + '_' + Date.now(),
            authProvider: 'email',
            hasInviteAccess: true
          });
        }
        reviewerId = user.id;
      }

      if (!reviewerId) {
        return res.status(400).json({ message: "Reviewer identification required" });
      }

      const review = await storage.createReview({
        reviewerId,
        reviewedBusinessId: profile.id,
        targetType: 'business',
        title: title || '',
        content,
        rating,
        reviewType: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
        isTargetOnPlatform: true
      });

      await storage.updateBusinessProfile(profile.id, {
        totalReviews: profile.totalReviews + 1,
        averageRating: Math.round(((profile.averageRating * profile.totalReviews) + rating) / (profile.totalReviews + 1))
      });

      await storage.awardCredaPoints(reviewerId, 'Engagement', 'review_given', 50, 'business', profile.id);

      res.json(review);
    } catch (error) {
      console.error("Error creating business review:", error);
      res.status(500).json({ message: "Failed to create business review" });
    }
  });

  app.get('/api/businesses', async (req, res) => {
    try {
      const businesses = await storage.getAllBusinessProfiles();
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Project review endpoints (for /projects page)
  app.post('/api/project-reviews', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { projectId, projectName, projectLogo, projectSlug, rating, title, content } = req.body;

      // Check if user is suspended
      const user = await storage.getUser(userId);
      if (user?.isSuspended) {
        return res.status(403).json({ 
          message: "Your account has been suspended due to suspicious activity. Please contact support on Discord.",
          suspended: true,
          reason: user.suspensionReason || "Account suspended"
        });
      }

      if (!projectId || !projectName || !projectLogo || !projectSlug || !rating || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const review = await storage.createProjectReview({
        userId,
        projectId,
        projectName,
        projectLogo,
        projectSlug,
        rating,
        title: title || null,
        content
      });

      res.json(review);
    } catch (error) {
      console.error("Error creating project review:", error);
      res.status(500).json({ message: "Failed to create project review" });
    }
  });

  app.get('/api/project-reviews', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const reviews = await storage.getAllProjectReviews(limit);
      
      // Manually fetch and attach user data for each review
      // (Workaround for Drizzle ORM .limit() hydration issue)
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review: any) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              twitterHandle: user.twitterHandle,
            } : null
          };
        })
      );
      
      res.json(reviewsWithUsers);
    } catch (error) {
      console.error("Error fetching project reviews:", error);
      res.status(500).json({ message: "Failed to fetch project reviews" });
    }
  });

  app.get('/api/project-reviews/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const reviews = await storage.getProjectReviews(projectId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching project reviews:", error);
      res.status(500).json({ message: "Failed to fetch project reviews" });
    }
  });

  app.post('/api/project-reviews/:reviewId/helpful', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const updatedReview = await storage.markProjectReviewHelpful(reviewId);
      
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(updatedReview);
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      res.status(500).json({ message: "Failed to mark review as helpful" });
    }
  });

  // Review Share Routes (for viral X/Twitter sharing)
  app.post('/api/review-shares', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { reviewId, projectId, platform, projectName, projectLogo, credaEarned, shareText } = req.body;
      
      // Generate unique share token
      const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const shareData = {
        userId,
        reviewId,
        projectId,
        platform: platform || 'twitter',
        shareToken,
        projectName,
        projectLogo,
        credaEarned,
        shareText,
        clicks: 0,
        shareRewardClaimed: false
      };
      
      const share = await storage.createReviewShare(shareData);
      res.json(share);
    } catch (error) {
      console.error("Error creating review share:", error);
      res.status(500).json({ message: "Failed to create review share" });
    }
  });

  app.get('/api/review-shares/:shareToken', async (req, res) => {
    try {
      const { shareToken } = req.params;
      const share = await storage.getReviewShare(shareToken);
      
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }
      
      res.json(share);
    } catch (error) {
      console.error("Error fetching review share:", error);
      res.status(500).json({ message: "Failed to fetch review share" });
    }
  });

  app.post('/api/review-shares/:shareToken/click', async (req, res) => {
    try {
      const { shareToken } = req.params;
      const { referrer, userAgent, ipAddress } = req.body;
      
      const share = await storage.getReviewShare(shareToken);
      
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }
      
      const clickData = {
        shareId: share.id,
        clickedAt: new Date(),
        referrer,
        userAgent,
        ipAddress
      };
      
      await storage.trackReviewShareClick(clickData);
      res.json({ success: true, shareId: share.id });
    } catch (error) {
      console.error("Error tracking share click:", error);
      res.status(500).json({ message: "Failed to track share click" });
    }
  });

  app.post('/api/review-shares/:shareId/claim-reward', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const shareId = parseInt(req.params.shareId);
      
      await storage.claimShareReward(shareId, userId);
      res.json({ success: true, message: "Share reward claimed successfully" });
    } catch (error) {
      console.error("Error claiming share reward:", error);
      res.status(500).json({ message: "Failed to claim share reward" });
    }
  });

  app.get('/api/user/review-shares', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const shares = await storage.getUserReviewShares(userId);
      res.json(shares);
    } catch (error) {
      console.error("Error fetching user review shares:", error);
      res.status(500).json({ message: "Failed to fetch review shares" });
    }
  });

  app.post('/api/link-referral', async (req: any, res) => {
    try {
      // Only require basic authentication, not invite access
      // This allows newly referred users to link their referral
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userId = req.user.claims?.sub || req.user.id;
      const { referralToken } = req.body;
      
      if (!referralToken) {
        return res.status(400).json({ message: "Referral token is required" });
      }
      
      await storage.linkReferralToUser(referralToken, userId);
      res.json({ success: true, message: "Referral linked successfully" });
    } catch (error) {
      console.error("Error linking referral:", error);
      res.status(500).json({ message: "Failed to link referral" });
    }
  });

  // Review Reporting/Flagging Routes
  const reviewReportValidationSchema = insertReviewReportSchema.extend({
    reason: z.enum(["spam", "inappropriate", "misleading", "offensive", "other"]),
    notes: z.string().optional().nullable(),
    reviewId: z.number().int().positive(),
    reportedBy: z.string(),
  });

  app.post('/api/review-reports', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      
      // Validate request body with Zod schema
      const validationResult = reviewReportValidationSchema.safeParse({
        ...req.body,
        reportedBy: userId,
        reviewId: typeof req.body.reviewId === 'string' ? parseInt(req.body.reviewId) : req.body.reviewId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }

      const report = await storage.reportReview(validationResult.data);
      
      // Award CREDA points for reporting spam/inappropriate content
      await storage.awardSpamReportCreda(userId, 'review', validationResult.data.reviewId);
      
      res.json(report);
    } catch (error) {
      console.error("Error reporting review:", error);
      res.status(500).json({ message: "Failed to report review" });
    }
  });

  // Content Reporting Routes (comprehensive spam reporting across all content types)
  const contentReportValidationSchema = insertContentReportSchema.extend({
    contentType: z.enum(["stance", "comment", "review"]),
    contentId: z.number().int().positive(),
    reason: z.enum(["spam", "inappropriate", "misleading", "offensive", "other"]),
    notes: z.string().optional().nullable(),
    reportedBy: z.string(),
  });

  app.post('/api/content-reports', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate request body with Zod schema
      const validationResult = contentReportValidationSchema.safeParse({
        ...req.body,
        reportedBy: userId,
        contentId: typeof req.body.contentId === 'string' ? parseInt(req.body.contentId) : req.body.contentId,
      });

      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }

      // Create the content report
      const report = await storage.reportContent(validationResult.data);

      // Award CREDA for reporting spam
      await storage.awardSpamReportCreda(
        userId,
        validationResult.data.contentType,
        validationResult.data.contentId
      );

      res.json({ 
        report,
        message: "Content reported successfully. You earned 25 CREDA for reporting spam!",
        credaAwarded: 25
      });
    } catch (error) {
      console.error("Error reporting content:", error);
      res.status(500).json({ message: "Failed to report content" });
    }
  });

  // Get all content reports (admin only)
  app.get('/api/admin/content-reports', requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const reports = await storage.getContentReports(status as string);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching content reports:", error);
      res.status(500).json({ message: "Failed to fetch content reports" });
    }
  });

  // Get user's content reports
  app.get('/api/content-reports/my-reports', requireInviteAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const reports = await storage.getContentReportsByUser(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });

  app.get('/api/admin/projects/:projectId/reported-reviews', async (req, res) => {
    try {
      const companyId = parseInt(req.params.projectId);
      const reports = await storage.getReportedReviewsForCompany(companyId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reported reviews:", error);
      res.status(500).json({ message: "Failed to fetch reported reviews" });
    }
  });

  app.delete('/api/admin/project-reviews/:reviewId', requireAdminAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      await storage.deleteProjectReview(reviewId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Admin4 Dashboard - Company/Project Management Routes
  // Get all companies with review statistics
  app.get('/api/admin/companies', async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      
      // Enhance each company with review statistics
      const companiesWithStats = await Promise.all(
        companies.map(async (company) => {
          const analytics = await storage.getCompanyAnalytics(company.id);
          return {
            ...company,
            reviewCount: analytics.totalReviews,
            averageRating: analytics.averageRating,
          };
        })
      );
      
      res.json(companiesWithStats);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.post('/api/admin/companies', requireAdminAuth, async (req, res) => {
    try {
      const companyData = req.body;
      const newCompany = await storage.createCompany(companyData);
      res.json(newCompany);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.get('/api/admin/companies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompanyById(id);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.patch('/api/admin/companies/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedCompany = await storage.updateCompany(id, updates);
      
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(updatedCompany);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete('/api/admin/companies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompany(id);
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Public seed endpoint for initializing companies
  app.post('/api/seed/companies', async (req, res) => {
    try {
      const COMPANIES_TO_SEED = [
        {
          externalId: "1",
          name: "MetaMask",
          slug: "metamask",
          category: "Wallets",
          logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
          description: "Most popular browser extension wallet for Ethereum and EVM chains",
          website: "https://metamask.io",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "2",
          name: "Phantom",
          slug: "phantom",
          category: "Wallets",
          logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
          description: "Leading Solana wallet with beautiful UI and seamless NFT support",
          website: "https://phantom.app",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "3",
          name: "Trust Wallet",
          slug: "trust-wallet",
          category: "Wallets",
          logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
          description: "Secure multi-chain wallet trusted by millions worldwide",
          website: "https://trustwallet.com",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "4",
          name: "Ledger Live",
          slug: "ledger-live",
          category: "Wallets",
          logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
          description: "Hardware wallet companion app for maximum security",
          website: "https://ledger.com",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "5",
          name: "Uniswap",
          slug: "uniswap",
          category: "Exchanges",
          logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
          description: "Leading decentralized exchange for ERC-20 token swaps",
          website: "https://uniswap.org",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "6",
          name: "Jupiter",
          slug: "jupiter",
          category: "Exchanges",
          logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
          description: "Best liquidity aggregator on Solana with optimal routing",
          website: "https://jup.ag",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "7",
          name: "PancakeSwap",
          slug: "pancakeswap",
          category: "Exchanges",
          logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
          description: "Top DEX on BNB Chain with yield farming and more",
          website: "https://pancakeswap.finance",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "8",
          name: "Raydium",
          slug: "raydium",
          category: "Exchanges",
          logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
          description: "Automated market maker and liquidity provider on Solana",
          website: "https://raydium.io",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "9",
          name: "Coinbase Card",
          slug: "coinbase-card",
          category: "Cards",
          logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
          description: "Spend crypto anywhere with cashback rewards",
          website: "https://coinbase.com",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "10",
          name: "KAST",
          slug: "kast",
          category: "Cards",
          logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
          description: "Global money app for saving, sending, and spending stablecoins with Visa integration",
          website: "https://kast.xyz",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "11",
          name: "Binance Card",
          slug: "binance-card",
          category: "Cards",
          logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
          description: "Spend your crypto with zero fees and instant conversion",
          website: "https://binance.com",
          isActive: true,
          isVerified: true,
        },
        {
          externalId: "12",
          name: "BitPay Card",
          slug: "bitpay-card",
          category: "Cards",
          logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
          description: "Convert and spend crypto in real-time with Mastercard",
          website: "https://bitpay.com",
          isActive: true,
          isVerified: true,
        },
      ];

      const results = [];
      const errors = [];

      for (const companyData of COMPANIES_TO_SEED) {
        try {
          // Check if company already exists by externalId or slug
          const existingByExternal = await storage.getCompanyByExternalId(companyData.externalId);
          const existingBySlug = await storage.getCompanyBySlug(companyData.slug);
          
          if (existingByExternal || existingBySlug) {
            console.log(`Company ${companyData.name} already exists, skipping...`);
            continue;
          }

          const newCompany = await storage.createCompany(companyData);
          results.push(newCompany);
          console.log(`✓ Created: ${companyData.name}`);
        } catch (error) {
          console.error(`✗ Failed to create ${companyData.name}:`, error);
          errors.push({ company: companyData.name, error: String(error) });
        }
      }

      res.json({
        success: true,
        created: results.length,
        skipped: COMPANIES_TO_SEED.length - results.length - errors.length,
        errors: errors.length,
        companies: results
      });
    } catch (error) {
      console.error("Error seeding companies:", error);
      res.status(500).json({ message: "Failed to seed companies" });
    }
  });

  // Object storage routes for logo uploads
  // Based on blueprint:javascript_object_storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const { ObjectStorageService } = await import("./objectStorage");
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logos/upload-url", requireAdminAuth, async (req, res) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getLogoUploadURL();
      res.json({ url: uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Company-specific Routes
  app.get('/api/admin/companies/:id/reviews', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviews = await storage.getCompanyReviews(id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching company reviews:", error);
      res.status(500).json({ message: "Failed to fetch company reviews" });
    }
  });

  app.get('/api/admin/companies/:id/analytics', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analytics = await storage.getCompanyAnalytics(id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching company analytics:", error);
      res.status(500).json({ message: "Failed to fetch company analytics" });
    }
  });

  app.get('/api/admin/companies/:id/admins', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const admins = await storage.getCompanyAdmins(id);
      res.json(admins);
    } catch (error) {
      console.error("Error fetching company admins:", error);
      res.status(500).json({ message: "Failed to fetch company admins" });
    }
  });

  app.post('/api/admin/companies/:id/admins', async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const { userId, role } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      const admin = await storage.addCompanyAdmin({ companyId, userId, role: role || 'admin' });
      res.json(admin);
    } catch (error) {
      console.error("Error adding company admin:", error);
      res.status(500).json({ message: "Failed to add company admin" });
    }
  });

  app.delete('/api/admin/companies/:id/admins/:adminId', async (req, res) => {
    try {
      const adminId = parseInt(req.params.adminId);
      await storage.removeCompanyAdmin(adminId);
      res.json({ message: "Company admin removed successfully" });
    } catch (error) {
      console.error("Error removing company admin:", error);
      res.status(500).json({ message: "Failed to remove company admin" });
    }
  });

  // Public API endpoint to fetch company data by externalId (for project pages)
  app.get('/api/companies/external/:externalId', async (req, res) => {
    try {
      const { externalId } = req.params;
      const company = await storage.getCompanyByExternalId(externalId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Public API endpoint to fetch all companies (for browse page)
  app.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      
      const companiesWithReviewCount = await Promise.all(
        companies.map(async (company) => {
          const analytics = await storage.getCompanyAnalytics(company.id);
          return {
            ...company,
            reviewCount: analytics.totalReviews,
            averageRating: analytics.averageRating,
            ratingBreakdown: analytics.ratingBreakdown
          };
        })
      );
      
      res.json(companiesWithReviewCount);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Company User Management Routes
  app.post('/api/admin/companies/:companyId/users', requireAdminAuth, async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const userData = { ...req.body, companyId };
      const newUser = await storage.createCompanyUser(userData);
      res.json(newUser);
    } catch (error) {
      console.error("Error creating company user:", error);
      res.status(500).json({ message: "Failed to create company user" });
    }
  });

  app.get('/api/admin/companies/:companyId/users', requireAdminAuth, async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const users = await storage.getCompanyUsers(companyId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching company users:", error);
      res.status(500).json({ message: "Failed to fetch company users" });
    }
  });

  app.delete('/api/admin/company-users/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompanyUser(id);
      res.json({ message: "Company user deleted successfully" });
    } catch (error) {
      console.error("Error deleting company user:", error);
      res.status(500).json({ message: "Failed to delete company user" });
    }
  });

  // Generate and send credentials for all companies
  app.post('/api/admin/generate-company-credentials', requireAdminAuth, async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      const results = [];
      const errors = [];

      for (const company of companies) {
        try {
          // Skip if company doesn't have an email
          if (!company.email) {
            errors.push({
              companyName: company.name,
              reason: "No email address configured"
            });
            continue;
          }

          // Check if company user already exists
          const existingUser = await storage.getCompanyUserByEmail(company.email);
          if (existingUser) {
            results.push({
              companyName: company.name,
              email: company.email,
              status: "skipped",
              reason: "Account already exists"
            });
            continue;
          }

          // Generate random password
          const { generateRandomPassword, sendCompanyCredentialsEmail } = await import("./emailAuth");
          const password = generateRandomPassword();
          const bcrypt = await import("bcryptjs");
          const hashedPassword = await bcrypt.hash(password, 12);

          // Create company user account
          const newUser = await storage.createCompanyUser({
            companyId: company.id,
            email: company.email,
            password: hashedPassword,
            firstName: company.name,
            role: "admin",
            isActive: true
          });

          // Send credentials email
          const dashboardUrl = `${req.protocol}://${req.get('host')}/business-dashboard`;
          const emailPreviewUrl = await sendCompanyCredentialsEmail(
            company.name,
            company.email,
            password,
            dashboardUrl
          );

          results.push({
            companyName: company.name,
            email: company.email,
            status: "created",
            emailPreviewUrl
          });

        } catch (error) {
          console.error(`Error creating credentials for ${company.name}:`, error);
          errors.push({
            companyName: company.name,
            reason: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }

      res.json({
        success: true,
        totalCompanies: companies.length,
        created: results.filter(r => r.status === "created").length,
        skipped: results.filter(r => r.status === "skipped").length,
        errors: errors.length,
        results,
        errorDetails: errors
      });

    } catch (error) {
      console.error("Error generating company credentials:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to generate company credentials",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin Review Management Routes
  app.get('/api/admin/reviews', async (req, res) => {
    try {
      const reviews = await storage.getAllProjectReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/admin/reviews/project/:projectId', requireAdminAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const reviews = await storage.getProjectReviewsForProject(projectId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching project reviews:", error);
      res.status(500).json({ message: "Failed to fetch project reviews" });
    }
  });

  app.delete('/api/admin/reviews/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProjectReview(id);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Admin Analytics Route
  app.get('/api/admin/analytics', async (req, res) => {
    try {
      // Get all project reviews
      const allReviews = await storage.getAllProjectReviews();
      
      // Calculate analytics from existing reviews
      const projectMap = new Map();
      let totalReviews = allReviews.length;
      let totalRating = 0;
      
      allReviews.forEach(review => {
        // Track per-project stats
        if (!projectMap.has(review.projectId)) {
          projectMap.set(review.projectId, {
            projectId: review.projectId,
            projectName: review.projectName,
            reviewCount: 0,
            totalRating: 0,
            avgRating: 0
          });
        }
        
        const project = projectMap.get(review.projectId);
        project.reviewCount++;
        project.totalRating += review.rating;
        project.avgRating = project.totalRating / project.reviewCount;
        
        totalRating += review.rating;
      });
      
      const analytics = {
        totalCompanies: projectMap.size,
        totalReviews: totalReviews,
        averageRating: totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : '0.00',
        activePages: projectMap.size,
        topProjects: Array.from(projectMap.values())
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 5)
          .map(p => ({
            name: p.projectName,
            reviews: p.reviewCount,
            avgRating: p.avgRating.toFixed(1)
          }))
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin routes - requires authentication
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || !req.user.claims) {
      return res.status(401).json({ message: "Unauthorized" });
    }    // For now, we'll use a simple check - in production, add proper admin role checking
    // You can modify this to check against specific user IDs or roles
    next();
  };

  // Admin endpoint to get all DAOs from database
  app.get('/api/admin/daos', requireAdminAuth, async (req, res) => {
    try {
      const allDaos = await storage.getAllDaos();
      res.json(allDaos);
    } catch (error) {
      console.error("Error fetching admin DAOs:", error);
      res.status(500).json({ message: "Failed to fetch DAOs" });
    }
  });

  // Admin endpoint to update DAO
  app.patch('/api/admin/daos/:daoId', requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const updateData = req.body;

      const updatedDao = await storage.updateDao(daoId, updateData);

      if (!updatedDao) {
        return res.status(404).json({ message: "DAO not found" });
      }

      res.json(updatedDao);
    } catch (error) {
      console.error("Error updating DAO:", error);
      res.status(500).json({ message: "Failed to update DAO" });
    }
  });

  // Admin endpoint to delete DAO
  app.delete('/api/admin/daos/:daoId', requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);

      await storage.deleteDao(daoId);
      res.json({ message: "DAO deleted successfully" });
    } catch (error) {
      console.error("Error deleting DAO:", error);
      res.status(500).json({ message: "Failed to delete DAO" });
    }
  });

  // Admin endpoint to get all stances
  app.get('/api/admin/stances', requireAdminAuth, async (req, res) => {
    try {
      const stances = await storage.getAllStancesForAdmin();
      res.json(stances);
    } catch (error) {
      console.error("Error fetching admin stances:", error);
      res.status(500).json({ message: "Failed to fetch stances" });
    }
  });

  // Admin endpoint to delete stance
  app.delete('/api/admin/stances/:stanceId', requireAdminAuth, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      await storage.deleteStance(stanceId);
      res.json({ message: "Stance deleted successfully" });
    } catch (error) {
      console.error("Error deleting stance:", error);
      res.status(500).json({ message: "Failed to delete stance" });
    }
  });

  // Admin endpoint to update stance expiry
  app.patch('/api/admin/stances/:stanceId/expiry', requireAdminAuth, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const { expiresAt } = req.body;

      if (!expiresAt) {
        return res.status(400).json({ message: "Expiry date is required" });
      }

      await storage.updateStanceExpiry(stanceId, new Date(expiresAt));
      res.json({ message: "Stance expiry updated successfully" });
    } catch (error) {
      console.error("Error updating stance expiry:", error);
      res.status(500).json({ message: "Failed to update stance expiry" });
    }
  });

  // Admin endpoint to extend stance expiry by hours
  app.patch('/api/admin/stances/:stanceId/extend', requireAdminAuth, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const { hours } = req.body;

      if (!hours || ![5, 10, 12].includes(hours)) {
        return res.status(400).json({ message: "Hours must be 5, 10, or 12" });
      }

      // Get current stance to extend from current expiry time
      const stance = await storage.getGovernanceIssueById(stanceId);
      if (!stance) {
        return res.status(404).json({ message: "Stance not found" });
      }

      // Extend from current expiry time
      const currentExpiry = new Date(stance.expiresAt);
      const newExpiry = new Date(currentExpiry.getTime() + (hours * 60 * 60 * 1000));

      await storage.updateStanceExpiry(stanceId, newExpiry);

      res.json({
        message: `Stance expiry extended by ${hours} hours successfully`,
        newExpiresAt: newExpiry.toISOString(),
        previousExpiresAt: stance.expiresAt
      });
    } catch (error) {
      console.error("Error extending stance expiry:", error);
      res.status(500).json({ message: "Failed to extend stance expiry" });
    }
  });

  // Admin endpoint to get all reviews
  app.get('/api/admin/reviews', requireAdminAuth, async (req, res) => {
    try {
      const reviews = await storage.getAllReviewsForAdmin();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching admin reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Admin endpoint to delete review
  app.delete('/api/admin/reviews/:reviewId', requireAdminAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      await storage.deleteReview(reviewId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  app.get('/api/admin/stats', requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Analytics endpoints
  app.get('/api/admin/analytics/growth', requireAdminAuth, async (req, res) => {
    try {
      const timeframe = (req.query.timeframe as 'daily' | 'weekly') || 'daily';
      const days = parseInt(req.query.days as string) || 30;
      const analytics = await storage.getGrowthAnalytics(timeframe, days);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching growth analytics:", error);
      res.status(500).json({ message: "Failed to fetch growth analytics" });
    }
  });

  app.get('/api/admin/analytics/engagement', requireAdminAuth, async (req, res) => {
    try {
      const metrics = await storage.getEngagementMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching engagement metrics:", error);
      res.status(500).json({ message: "Failed to fetch engagement metrics" });
    }
  });

  app.get('/api/admin/analytics/retention', requireAdminAuth, async (req, res) => {
    try {
      const metrics = await storage.getRetentionMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching retention metrics:", error);
      res.status(500).json({ message: "Failed to fetch retention metrics" });
    }
  });

  app.get('/api/admin/analytics/overview', requireAdminAuth, async (req, res) => {
    try {
      const overview = await storage.getPlatformOverview();
      res.json(overview);
    } catch (error) {
      console.error("Error fetching platform overview:", error);
      res.status(500).json({ message: "Failed to fetch platform overview" });
    }
  });

  app.get('/api/admin/users', requireAdminAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/user-details/:userId', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDetails = await storage.getDetailedUserStats(userId);
      res.json(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });

  app.get('/api/admin/user-scores', requireAdminAuth, async (req, res) => {
    try {
      const scores = await storage.getAllUserScores();
      res.json(scores);
    } catch (error) {
      console.error("Error fetching user scores:", error);
      res.status(500).json({ message: "Failed to fetch user scores" });
    }
  });

  // Admin: Get all invite codes
  app.get('/api/admin/invite-codes', requireAdminAuth, async (req, res) => {
    try {
      const inviteCodes = await storage.getAllInviteCodes();
      res.json(inviteCodes);
    } catch (error) {
      console.error("Error fetching invite codes:", error);
      res.status(500).json({ message: "Failed to fetch invite codes" });
    }
  });

  // Admin: Generate new invite codes
  app.post('/api/admin/generate-codes', requireAdminAuth, async (req, res) => {
    try {
      const { count = 100 } = req.body;
      const newCodes = await storage.generateInviteCodes(count);
      res.json({
        message: `Generated ${count} new invite codes`,
        codes: newCodes
      });
    } catch (error) {
      console.error("Error generating invite codes:", error);
      res.status(500).json({ message: "Failed to generate invite codes" });
    }
  });

  app.get('/api/admin/users/:userId/details', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDetails = await storage.getDetailedUserStats(userId);
      if (!userDetails) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });

  app.patch('/api/admin/users/:userId/xp-points', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { score } = req.body;

      if (typeof score !== 'number') {
        return res.status(400).json({ message: "Score must be a number" });
      }

      const updatedUser = await storage.updateUserXpPoints(userId, score);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user XP points:", error);
      res.status(500).json({ message: "Failed to update user XP points" });
    }
  });

  app.patch('/api/admin/users/:userId/dao-score', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { daoId, score } = req.body;

      if (typeof score !== 'number' || typeof daoId !== 'number') {
        return res.status(400).json({ message: "Score and daoId must be numbers" });
      }

      await storage.updateUserDaoScore(userId, daoId, score);
      res.json({ message: "DAO score updated successfully" });
    } catch (error) {
      console.error("Error updating user DAO score:", error);
      res.status(500).json({ message: "Failed to update user DAO score" });
    }
  });

  app.post('/api/admin/grant-access', requireAdminAuth, async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      console.log("Granting access to user:", userId);
      const updatedUser = await storage.updateUser(userId, { hasInviteAccess: true });
      console.log("Updated user:", updatedUser);
      res.json({ message: "Access granted successfully", user: updatedUser });
    } catch (error) {
      console.error("Error granting access:", error);
      res.status(500).json({ message: "Failed to grant access" });
    }
  });

  app.post('/api/admin/revoke-access', requireAdminAuth, async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      console.log("Revoking access from user:", userId);
      const updatedUser = await storage.updateUser(userId, { hasInviteAccess: false });
      console.log("Updated user:", updatedUser);
      res.json({ message: "Access revoked successfully", user: updatedUser });
    } catch (error) {
      console.error("Error revoking access:", error);
      res.status(500).json({ message: "Failed to revoke access" });
    }
  });

  app.post('/api/admin/users/:userId/revoke-access', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      await storage.updateUser(userId, { hasInviteAccess: false });
      res.json({ message: "Access revoked successfully" });
    } catch (error) {
      console.error("Error revoking access:", error);
      res.status(500).json({ message: "Failed to revoke access" });
    }
  });

  // Suspension endpoints
  app.post('/api/admin/users/:userId/suspend', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: "Suspension reason is required" });
      }
      
      const suspendedUser = await storage.suspendUser(userId, reason);
      res.json({ 
        message: "User suspended successfully", 
        user: suspendedUser 
      });
    } catch (error) {
      console.error("Error suspending user:", error);
      res.status(500).json({ message: "Failed to suspend user" });
    }
  });

  app.post('/api/admin/users/:userId/unsuspend', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const unsuspendedUser = await storage.unsuspendUser(userId);
      res.json({ 
        message: "User unsuspended successfully", 
        user: unsuspendedUser 
      });
    } catch (error) {
      console.error("Error unsuspending user:", error);
      res.status(500).json({ message: "Failed to unsuspend user" });
    }
  });

  app.get('/api/admin/suspended-users', requireAdminAuth, async (req, res) => {
    try {
      const suspendedUsers = await storage.getSuspendedUsers();
      res.json(suspendedUsers);
    } catch (error) {
      console.error("Error fetching suspended users:", error);
      res.status(500).json({ message: "Failed to fetch suspended users" });
    }
  });

  app.delete('/api/admin/users/:userId', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin DAO management routes
  app.patch('/api/admin/daos/:daoId', requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const updateData = req.body;

      // Only allow updates to specific fields
      const allowedFields = [
        'name', 'slug', 'description', 'logoUrl', 'twitterHandle',
        'twitterUrl', 'website', 'category', 'isVerified', 'isUnclaimed'
      ];

      const filteredUpdate = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      await storage.updateDao(daoId, filteredUpdate);
      res.json({ message: "DAO updated successfully" });
    } catch (error) {
      console.error("Error updating DAO:", error);
      res.status(500).json({ message: "Failed to update DAO" });
    }
  });

  app.delete('/api/admin/daos/:daoId', requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      await storage.deleteDao(daoId);
      res.json({ message: "DAO deleted successfully" });
    } catch (error) {
      console.error("Error deleting DAO:", error);
      res.status(500).json({ message: "Failed to delete DAO" });
    }
  });

  app.delete('/api/admin/issues/:issueId', requireAdminAuth, async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      await storage.deleteGovernanceIssue(issueId);
      res.json({ message: "Governance issue deleted successfully" });
    } catch (error) {
      console.error("Error deleting governance issue:", error);
      res.status(500).json({ message: "Failed to delete governance issue" });
    }
  });

  app.delete('/api/admin/comments/:commentId', requireAdminAuth, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      await storage.deleteComment(commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Onboarding completion route
  app.post('/api/onboarding/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Award 25 points for completing onboarding
      await storage.awardOnboardingXp(userId);

      // Update user with onboarding completion timestamp
      await storage.updateUser(userId, {
        onboardingCompletedAt: new Date()
      });

      res.json({
        message: "Onboarding completed successfully",
        pointsAwarded: 25
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Profile completion endpoint
  app.put('/api/profile/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { bio, linkedinUrl, githubUrl, discordHandle, telegramHandle, governanceInterests } = req.body;

      // Update user profile with completion timestamp
      await storage.updateUser(userId, {
        bio,
        linkedinUrl,
        githubUrl,
        discordHandle,
        telegramHandle,
        governanceInterests,
        profileCompletedAt: new Date()
      });

      res.json({
        message: "Profile completed successfully"
      });
    } catch (error) {
      console.error("Error completing profile:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });

  // Check if user has completed profile
  app.get('/api/profile/completion-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasCompletedProfile = !!user.profileCompletedAt;
      const hasCompletedOnboarding = !!user.onboardingCompletedAt;

      res.json({
        hasCompletedProfile,
        hasCompletedOnboarding,
        shouldShowProfilePopup: hasCompletedOnboarding && !hasCompletedProfile
      });
    } catch (error) {
      console.error("Error checking profile completion status:", error);
      res.status(500).json({ message: "Failed to check profile status" });
    }
  });

  // Get user's referral link (auto-generate if needed)
  app.get('/api/referral/link', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate referral code if user doesn't have one
      if (!user.referralCode) {
        const referralCode = Buffer.from(`${userId}-${Date.now()}`).toString('base64').substring(0, 8);
        user = await storage.updateUser(userId, { referralCode });
      }

      // Create referral link
      const referralLink = `${req.protocol}://${req.get('host')}/?ref=${user.referralCode}`;

      res.json({
        referralCode: user.referralCode,
        referralLink
      });
    } catch (error) {
      console.error("Error getting referral link:", error);
      res.status(500).json({ message: "Failed to get referral link" });
    }
  });

  // Generate referral link
  app.post('/api/referral/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate unique referral code based on user ID and timestamp
      const referralCode = Buffer.from(`${userId}-${Date.now()}`).toString('base64').substring(0, 8);

      // Store referral code in user record
      await storage.updateUser(userId, { referralCode });

      const referralLink = `${req.protocol}://${req.get('host')}/?ref=${referralCode}`;

      res.json({
        referralCode,
        referralLink,
        message: "Referral link generated successfully"
      });
    } catch (error) {
      console.error("Error generating referral link:", error);
      res.status(500).json({ message: "Failed to generate referral link" });
    }
  });

  // Track referral signup
  app.post('/api/referral/track', async (req, res) => {
    try {
      const { referralCode, newUserId } = req.body;

      if (!referralCode || !newUserId) {
        return res.status(400).json({ message: "Missing referral code or user ID" });
      }

      // Find referrer by referral code
      const referrer = await storage.getUserByReferralCode(referralCode);

      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      // Award 3 CREDA points to referrer
      await storage.awardCredaPoints(referrer.id, 'social', 'referral_successful', 3);

      // Record the referral relationship
      await storage.createReferral(referrer.id, newUserId, referralCode);

      res.json({
        message: "Referral tracked successfully",
        referrerPoints: 3
      });
    } catch (error) {
      console.error("Error tracking referral:", error);
      res.status(500).json({ message: "Failed to track referral" });
    }
  });

  // Process invite code during user registration
  app.post('/api/auth/process-invite', async (req, res) => {
    try {
      const { inviteCode, userId } = req.body;

      if (!inviteCode || !userId) {
        return res.status(400).json({ message: "Missing invite code or user ID" });
      }

      // Validate and use the invite code
      const isValid = await storage.validateInviteCode(inviteCode);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }

      // Mark invite code as used
      await storage.useInviteCode(inviteCode, userId);

      res.json({
        message: "Invite processed successfully"
      });
    } catch (error) {
      console.error("Error processing invite:", error);
      res.status(500).json({ message: "Failed to process invite code" });
    }
  });

  // Get user's referral stats
  app.get('/api/referral/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Invite code routes
  app.post('/api/invite/validate', async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      const isValid = await storage.validateInviteCode(code);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }

      res.json({ message: "Invite code is valid", valid: true });
    } catch (error) {
      console.error("Error validating invite code:", error);
      res.status(500).json({ message: "Failed to validate invite code" });
    }
  });

  app.post('/api/invite/use', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      // Validate invite code first
      const isValid = await storage.validateInviteCode(code);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }

      // Collect metadata for enhanced tracking
      const metadata = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        location: req.get('CF-IPCountry') || 'Unknown', // Cloudflare country header
        deviceFingerprint: req.get('X-Device-Fingerprint')
      };

      // Use the invite code with enhanced tracking
      await storage.useInviteCode(code, userId, metadata);

      res.json({
        message: "Invite code activated successfully",
        xpAwarded: 100 // Let user know they earned XP for their inviter
      });
    } catch (error) {
      console.error("Error using invite code:", error);
      res.status(500).json({ message: "Failed to activate invite code" });
    }
  });

  // Get or create the user's single permanent invite code
  app.get("/api/invite/my-code", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Check if user already has an invite code
      const existingCodes = await storage.getUserInviteCodes(userId);
      
      if (existingCodes && existingCodes.length > 0) {
        // Return the first (and only) code - prioritize unused ones
        const unusedCode = existingCodes.find(c => !c.isUsed);
        const codeToReturn = unusedCode || existingCodes[0];
        
        // Generate invite link
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const inviteLink = `${baseUrl}/?invite=${codeToReturn.code}`;
        
        res.json({
          code: codeToReturn.code,
          inviteLink,
          createdAt: codeToReturn.createdAt
        });
      } else {
        // Generate a new invite code for the user (unlimited uses for their personal code)
        const newCodes = await storage.generateInviteCodesForUser(userId, 1);
        const newCode = newCodes[0];
        
        // Update the code to allow unlimited uses
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const inviteLink = `${baseUrl}/?invite=${newCode.code}`;
        
        res.json({
          code: newCode.code,
          inviteLink,
          createdAt: newCode.createdAt
        });
      }
    } catch (error) {
      console.error("Error getting invite code:", error);
      res.status(500).json({ error: "Failed to get invite code" });
    }
  });

  // Legacy: Create new invite code (kept for backwards compatibility)
  app.post("/api/invite/create", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // Check if user already has an invite code
      const existingCodes = await storage.getUserInviteCodes(userId);
      
      if (existingCodes && existingCodes.length > 0) {
        // Return existing code
        const codeToReturn = existingCodes[0];
        res.json({
          message: "You already have an invite code",
          inviteCode: codeToReturn.code
        });
      } else {
        // Generate a new invite code
        const newCodes = await storage.generateInviteCodesForUser(userId, 1);
        res.json({
          message: "Invite code created successfully",
          inviteCode: newCodes[0].code
        });
      }
    } catch (error) {
      console.error("Error creating invite code:", error);
      res.status(500).json({ error: "Failed to create invite code" });
    }
  });

  // Get user's invite codes (no CREDA requirement)
  app.get("/api/invite/user-codes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const codes = await storage.getUserInviteCodes(userId);
      res.json(codes);
    } catch (error) {
      console.error("Error fetching user invite codes:", error);
      res.status(500).json({ error: "Failed to fetch invite codes" });
    }
  });

  // Get invite statistics (no CREDA requirement)
  app.get("/api/invite/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const stats = await storage.getInviteStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching invite stats:", error);
      res.status(500).json({ error: "Failed to fetch invite statistics" });
    }
  });

  // Get invite chain - all users invited by this user (no CREDA requirement)
  app.get("/api/invite/chain", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const chain = await storage.getInviteChain(userId);
      res.json(chain);
    } catch (error) {
      console.error("Error fetching invite chain:", error);
      res.status(500).json({ error: "Failed to fetch invite chain" });
    }
  });

  app.get("/api/invite/tree/:userId", isAuthenticated, async (req, res) => {
    try {
      const startUserId = req.params.userId;
      const requesterId = req.user.id;

      // Only allow users to view their own tree or admin users
      const requester = await storage.getUser(requesterId);
      if (startUserId !== requesterId && !requester?.isAdmin) {
        return res.status(403).json({ message: "Not authorized to view this invite tree" });
      }

      const inviteTree = await storage.getInviteTree(startUserId);
      res.json(inviteTree);
    } catch (error) {
      console.error("Error fetching invite tree:", error);
      res.status(500).json({ message: "Failed to fetch invite tree" });
    }
  });

  app.get("/api/invite/usage/:userId", isAuthenticated, async (req, res) => {
    try {
      const targetUserId = req.params.userId;
      const requesterId = req.user.id;

      // Only allow users to view their own usage or admin users
      const requester = await storage.getUser(requesterId);
      if (targetUserId !== requesterId && !requester?.isAdmin) {
        return res.status(403).json({ message: "Not authorized to view this user's invite usage" });
      }

      const inviteUsage = await storage.getInviteUsageByUser(targetUserId);
      res.json(inviteUsage);
    } catch (error) {
      console.error("Error fetching invite usage:", error);
      res.status(500).json({ message: "Failed to fetch invite usage" });
    }
  });

  // Invite submission routes (for X-first auth flow)
  app.post('/api/invite/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }

      // Check if user has already submitted an invite code
      const existingSubmission = await storage.getUserInviteSubmission(userId);
      if (existingSubmission) {
        return res.status(409).json({ message: "You have already submitted an invite code" });
      }

      // Submit the invite code
      const submission = await storage.submitInviteCode(userId, code);

      res.json({
        message: "Invite code submitted successfully. We'll review your submission and notify you when approved.",
        submission: { id: submission.id, status: submission.status }
      });
    } catch (error) {
      console.error("Error submitting invite code:", error);
      res.status(500).json({ message: "Failed to submit invite code" });
    }
  });

  app.get('/api/invite/submission', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const submission = await storage.getUserInviteSubmission(userId);
      res.json(submission || null);
    } catch (error) {
      console.error("Error fetching invite submission:", error);
      res.status(500).json({ message: "Failed to fetch invite submission" });
    }
  });

  // Database viewer routes (simplified access)
  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();

      // Get additional stats for each user
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const stats = await storage.getDetailedUserStats(user.id);
          return {
            ...user,
            issuesCreated: stats.issueCount || 0,
            commentsMade: stats.commentsMade || 0,
            votesCast: stats.votesCast || 0,
            daosActiveIn: stats.daosActiveIn || 0,
            daosFollowing: stats.daosFollowing || 0,
            referralsMade: stats.referralsMade || 0,
            referralsReceived: stats.referralsReceived || 0,
          };
        })
      );

      res.json(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/issues', async (req, res) => {
    try {
      const issues = await storage.getRecentGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching governance issues:", error);
      res.status(500).json({ message: "Failed to fetch governance issues" });
    }
  });

  app.get('/api/admin/comments', async (req, res) => {
    try {
      // Get all comments with author and governance issue info
      const result = await db.select({
        id: comments.id,
        content: comments.content,
        authorId: comments.authorId,
        issueId: comments.issueId,
        upvotes: comments.upvotes,
        downvotes: comments.downvotes,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          username: users.username,
        },
        issue: {
          id: governanceIssues.id,
          title: governanceIssues.title,
        },
      })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
        .orderBy(desc(comments.createdAt));

      res.json(result);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.get('/api/admin/votes', async (req, res) => {
    try {
      // Get all votes with user info
      const result = await db.select({
        id: votes.id,
        userId: votes.userId,
        targetType: votes.targetType,
        targetId: votes.targetId,
        createdAt: votes.createdAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
        .from(votes)
        .leftJoin(users, eq(votes.userId, users.id))
        .orderBy(desc(votes.createdAt));

      res.json(result);
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ message: "Failed to fetch votes" });
    }
  });

  // Admin invite submission routes
  app.get('/api/admin/invite-submissions', requireAdminAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllInviteSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching invite submissions:", error);
      res.status(500).json({ message: "Failed to fetch invite submissions" });
    }
  });

  app.post('/api/admin/invite-submissions/:id/approve', requireAdminAuth, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      await storage.approveInviteSubmission(submissionId);
      res.json({ message: "Invite submission approved successfully" });
    } catch (error) {
      console.error("Error approving invite submission:", error);
      res.status(500).json({ message: "Failed to approve invite submission" });
    }
  });

  app.post('/api/admin/invite-submissions/:id/deny', requireAdminAuth, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const { notes } = req.body;
      await storage.denyInviteSubmission(submissionId, notes);
      res.json({ message: "Invite submission denied successfully" });
    } catch (error) {
      console.error("Error denying invite submission:", error);
      res.status(500).json({ message: "Failed to deny invite submission" });
    }
  });

  // Enhanced Admin Invite System Routes
  app.get('/api/admin/invite-analytics', requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getInviteAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching invite analytics:", error);
      res.status(500).json({ message: "Failed to fetch invite analytics" });
    }
  });

  app.get('/api/admin/invite-flags', requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const flags = await storage.getAdminFlags(status as string);
      res.json(flags);
    } catch (error) {
      console.error("Error fetching admin flags:", error);
      res.status(500).json({ message: "Failed to fetch admin flags" });
    }
  });

  app.post('/api/admin/invite-flags/:flagId/update', requireAdminAuth, async (req, res) => {
    try {
      const flagId = parseInt(req.params.flagId);
      const updates = req.body;
      const updatedFlag = await storage.updateAdminFlag(flagId, updates);
      res.json(updatedFlag);
    } catch (error) {
      console.error("Error updating admin flag:", error);
      res.status(500).json({ message: "Failed to update admin flag" });
    }
  });

  app.post('/api/admin/detect-suspicious-activity', requireAdminAuth, async (req, res) => {
    try {
      const flags = await storage.detectSuspiciousInviteActivity();
      res.json({
        message: `Found ${flags.length} suspicious activities`,
        flags
      });
    } catch (error) {
      console.error("Error detecting suspicious activity:", error);
      res.status(500).json({ message: "Failed to detect suspicious activity" });
    }
  });

  app.get('/api/admin/invite-tree/:userId', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const inviteTree = await storage.getInviteTree(userId);
      res.json(inviteTree);
    } catch (error) {
      console.error("Error fetching invite tree for admin:", error);
      res.status(500).json({ message: "Failed to fetch invite tree" });
    }
  });

  app.get('/api/admin/invite-usage/:userId', requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const inviteUsage = await storage.getInviteUsageByUser(userId);
      res.json(inviteUsage);
    } catch (error) {
      console.error("Error fetching invite usage for admin:", error);
      res.status(500).json({ message: "Failed to fetch invite usage" });
    }
  });

  // GRS (Governance Reputation Score) routes
  app.get('/api/grs/score', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const ranking = await storage.getGrsRanking(userId);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching GRS score:", error);
      res.status(500).json({ message: "Failed to fetch GRS score" });
    }
  });

  // Get GRS score for any user by username or user ID (with caching)
  app.get('/api/grs/score/:userIdOrUsername', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      
      // Use cache for individual GRS scores
      const cacheKey = `grs:score:${userIdOrUsername}`;
      const cached = getCachedResponse<any>(cacheKey, CACHE_DURATIONS.grsScore);
      if (cached) {
        return res.json(cached);
      }

      // Try to find user by ID first, then by username
      let user = await storage.getUser(userIdOrUsername);
      if (!user) {
        // If not found by ID, try by username
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const ranking = await storage.getGrsRanking(user.id);
      setCachedResponse(cacheKey, ranking);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching GRS score:", error);
      res.status(500).json({ message: "Failed to fetch GRS score" });
    }
  });

  // Batch GRS scores endpoint - get multiple user scores in one request (PERFORMANCE OPTIMIZATION)
  app.post('/api/grs/scores/batch', async (req, res) => {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "userIds array is required" });
      }

      // Limit batch size to prevent abuse
      const limitedUserIds = userIds.slice(0, 100);
      const scoreMap = await storage.getBatchGrsScores(limitedUserIds);

      // Convert Map to object for JSON serialization
      const scores: Record<string, { score: number; percentile: number }> = {};
      scoreMap.forEach((value, key) => {
        scores[key] = value;
      });

      res.json({ scores });
    } catch (error) {
      console.error("Error fetching batch GRS scores:", error);
      res.status(500).json({ message: "Failed to fetch batch GRS scores" });
    }
  });

  // Batch has-reviewed endpoint - check if current user has reviewed multiple users (PERFORMANCE OPTIMIZATION)
  app.post('/api/users/batch/has-reviewed', isAuthenticated, async (req: any, res) => {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "userIds array is required" });
      }

      // Limit batch size to prevent abuse
      const limitedUserIds = userIds.slice(0, 100);
      const reviewMap = await storage.getBatchHasReviewed(req.user.id, limitedUserIds);

      // Convert Map to object for JSON serialization
      const reviewed: Record<string, boolean> = {};
      reviewMap.forEach((value, key) => {
        reviewed[key] = value;
      });

      res.json({ reviewed });
    } catch (error) {
      console.error("Error fetching batch has-reviewed:", error);
      res.status(500).json({ message: "Failed to fetch batch has-reviewed" });
    }
  });

  app.post('/api/grs/recalculate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      await storage.updateUserGrsScore(userId);
      const ranking = await storage.getGrsRanking(userId);
      res.json({
        message: "GRS score updated successfully",
        ranking
      });
    } catch (error) {
      console.error("Error recalculating GRS score:", error);
      res.status(500).json({ message: "Failed to recalculate GRS score" });
    }
  });

  // Get user's GRS score
  app.get("/api/grs/score/:userId?", async (req, res) => {
    try {
      const userId = req.params.userId || req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const grsData = await storage.getGrsScore(userId);
      res.json(grsData);
    } catch (error) {
      console.error("Error fetching GRS score:", error);
      res.status(500).json({ message: "Failed to fetch GRS score" });
    }
  });

  // Fix missing review GRS impacts (admin only)
  app.post("/api/admin/fix-review-grs", requireAdminAuth, async (req, res) => {
    try {
      console.log("Starting to fix missing review GRS impacts...");

      // Get all reviews that affect platform users but don't have GRS events
      const reviewsToFix = await storage.getReviewsNeedingGrsImpact();

      console.log(`Found ${reviewsToFix.length} reviews without GRS impact`);

      let fixedCount = 0;
      let errorCount = 0;

      for (const review of reviewsToFix) {
        try {
          await storage.updateReviewImpact(review.id);
          fixedCount++;
          console.log(`Fixed GRS impact for review ${review.id}`);
        } catch (error) {
          console.error(`Failed to fix review ${review.id}:`, error);
          errorCount++;
        }
      }

      res.json({
        success: true,
        message: `Fixed GRS impact for reviews`,
        totalReviews: reviewsToFix.length,
        fixedCount,
        errorCount
      });
    } catch (error) {
      console.error("Error fixing review GRS impacts:", error);
      res.status(500).json({ message: "Failed to fix review GRS impacts" });
    }
  });

  // GRS Audit endpoint (admin only)
  app.get("/api/grs/audit/:userId?", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;

      // Run audit
      const auditResults = await storage.auditGrsScores(userId);

      res.json({
        success: true,
        auditResults,
        message: `Audited ${auditResults.length} user(s)`
      });
    } catch (error) {
      console.error("Error in GRS audit:", error);
      res.status(500).json({ message: "Failed to run GRS audit" });
    }
  });

  // Get user's GRS history (authenticated user's own history)
  app.get("/api/grs/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const limit = 50;
      const history = await storage.getGrsHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching GRS history:", error);
      res.status(500).json({ message: "Failed to fetch GRS history" });
    }
  });

  // Get any user's GRS history (public endpoint)
  app.get("/api/grs/history/:userIdOrUsername", async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;

      // Try to find user by ID first, then by username
      let user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const limit = 50;
      const history = await storage.getGrsHistory(user.id, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching user GRS history:", error);
      res.status(500).json({ message: "Failed to fetch user GRS history" });
    }
  });

  // Get user's GRS impact factors (own profile)
  app.get('/api/grs/impact-factors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const impactData = await getGrsImpactFactors(userId);
      res.json(impactData);
    } catch (error) {
      console.error("Error fetching GRS impact factors:", error);
      res.status(500).json({ message: "Failed to fetch GRS impact factors" });
    }
  });

  // Get any user's GRS impact factors (public endpoint)
  app.get('/api/grs/impact-factors/:userIdOrUsername', async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;

      // Try to find user by ID first, then by username
      let user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const impactData = await getGrsImpactFactors(user.id);
      res.json(impactData);
    } catch (error) {
      console.error("Error fetching user GRS impact factors:", error);
      res.status(500).json({ message: "Failed to fetch user GRS impact factors" });
    }
  });

  // Helper function to get GRS impact factors for any user
  async function getGrsImpactFactors(userId: string) {
    // Get stance stats
    const stanceStats = await storage.getUserStanceStats(userId);

    // Get advanced review stats for this user (as reviewed user)
    const advancedReviewStats = await storage.getUserAdvancedReviewStats(userId);

    // Get review stats they've given (for accuracy)
    const givenReviewsStats = await storage.getUserReviewStats(userId);

    // Calculate real impact factors based on actual data
    const impactFactors = [
      {
        id: 'stance_success_rate',
        name: 'Stance Success Rate',
        description: 'How often your stance positions align with community consensus',
        currentImpact: Math.min(250, stanceStats.successful * 50), // 50 points per successful stance, max 250
        maxImpact: 250,
        weight: 25,
        trend: stanceStats.successRate > 50 ? 'up' : stanceStats.successRate < 50 ? 'down' : 'neutral',
        recentChange: stanceStats.successRate - 50, // relative to 50% baseline
        icon: 'Target',
        color: '#4EA8DE',
        scoring: 'Champion/Challenge stance success: +250, Failure: -150'
      },
      {
        id: 'stance_target_impact',
        name: 'Stance Target Impact',
        description: 'How community consensus affects the person being championed/challenged',
        currentImpact: Math.min(200, (stanceStats.championsWon * 90) + (stanceStats.challengesWon * 70)), // Champions worth more
        maxImpact: 200,
        weight: 20,
        trend: stanceStats.championsWon > stanceStats.challengesWon ? 'up' : 'down',
        recentChange: stanceStats.championsWon - stanceStats.challengesWon,
        icon: 'Users',
        color: '#43AA8B',
        scoring: 'Championed & supported: +180, Challenged & agreed: -200'
      },
      {
        id: 'voter_accountability',
        name: 'Voter Accountability',
        description: 'Reward people who vote on the winning side',
        currentImpact: Math.min(50, stanceStats.total * 5), // 5 points per stance participation, max 50
        maxImpact: 50,
        weight: 15,
        trend: stanceStats.total > 5 ? 'up' : 'neutral',
        recentChange: Math.max(-15, Math.min(15, stanceStats.total - 10)), // relative to 10 baseline
        icon: 'ThumbsUp',
        color: '#9D4EDD',
        scoring: 'Winning side: +50, Losing side: -30, No vote: -15'
      },
      {
        id: 'review_quality_received',
        name: 'Review Quality Received',
        description: 'How the community views your contributions',
        currentImpact: Math.min(160, Math.round(advancedReviewStats.averageRating * 32)), // 32 points per star, max 160
        maxImpact: 160,
        weight: 22,
        trend: advancedReviewStats.averageRating >= 4 ? 'up' : advancedReviewStats.averageRating >= 3 ? 'neutral' : 'down',
        recentChange: Math.round((advancedReviewStats.averageRating - 3) * 10), // relative to 3-star baseline
        icon: 'Star',
        color: '#F77F00',
        scoring: 'High GRS positive: +160, Medium: +100, Low: +50'
      },
      {
        id: 'review_accuracy_given',
        name: 'Review Accuracy Given',
        description: 'Whether your reviews of others prove accurate over time',
        currentImpact: Math.min(80, givenReviewsStats.total * 8), // 8 points per review given, max 80
        maxImpact: 80,
        weight: 18,
        trend: givenReviewsStats.total > 5 ? 'up' : 'neutral',
        recentChange: Math.max(-10, Math.min(10, givenReviewsStats.total - 5)), // relative to 5 baseline
        icon: 'MessageSquare',
        color: '#2D6A4F',
        scoring: 'Accurate positive/negative: +70-80, Inaccurate: -50-60'
      }
    ];

    // Calculate total weighted score
    const totalWeightedScore = impactFactors.reduce((total, factor) => {
      return total + (factor.currentImpact * factor.weight / 100);
    }, 0);

    return {
      impactFactors,
      totalWeightedScore: Math.round(totalWeightedScore),
      metadata: {
        stanceStats,
        advancedReviewStats,
        givenReviewsStats
      }
    };
  }

  // ======= NOTIFICATION ROUTES =======

  // Get user notifications
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const unreadOnly = req.query.unreadOnly === 'true';

      // Add caching headers to improve performance
      res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');

      const notifications = await storage.getUserNotifications(userId, limit, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Get unread notification count
  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Add caching headers for better performance
      res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=120');

      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  // Mark notifications as read
  app.post('/api/notifications/mark-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "ids must be an array" });
      }

      // Convert string IDs to numbers
      const notificationIds = ids.map(id => parseInt(id));
      await storage.markNotificationsAsRead(notificationIds);

      res.json({ message: "Notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });

  // Delete notifications
  app.post('/api/notifications/delete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "ids must be an array" });
      }

      // Convert string IDs to numbers
      const notificationIds = ids.map(id => parseInt(id));
      await storage.deleteNotifications(notificationIds);

      res.json({ message: "Notifications deleted" });
    } catch (error) {
      console.error("Error deleting notifications:", error);
      res.status(500).json({ message: "Failed to delete notifications" });
    }
  });

  // Get user notification settings
  app.get('/api/notifications/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.getUserNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  // Update user notification settings
  app.post('/api/notifications/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const updatedSettings = await storage.updateNotificationSettings(userId, updates);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  // Test endpoint to create sample notifications (development only)
  app.post('/api/notifications/test', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Create a few sample notifications
      await NotificationService.createNotification({
        userId,
        type: 'comment',
        title: 'New comment on your post',
        message: 'Someone commented on your governance proposal about DeFi regulations.',
        actionUrl: '/governance/1',
        metadata: { issueId: 1 }
      });

      await NotificationService.createNotification({
        userId,
        type: 'vote',
        title: 'Someone voted on your stance',
        message: 'Alice voted Champion on your stance about Ethereum scalability.',
        actionUrl: '/governance/2',
        metadata: { voteType: 'champion' }
      });

      await NotificationService.createNotification({
        userId,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "Governance Guru" badge for participating in 10 discussions.',
        actionUrl: '/achievements',
        metadata: { achievement: 'governance-guru' }
      });

      res.json({ message: "Test notifications created successfully" });
    } catch (error) {
      console.error("Error creating test notifications:", error);
      res.status(500).json({ message: "Failed to create test notifications" });
    }
  });

  // XP Leaderboard routes
  app.get('/api/leaderboard/xp', async (req, res) => {
    try {
      const timeframe = req.query.timeframe as 'overall' | 'weekly' || 'overall';
      const daoId = req.query.daoId ? parseInt(req.query.daoId as string) : undefined;
      const leaderboard = await storage.getCredaLeaderboard(timeframe, 50, daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching XP leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch XP leaderboard" });
    }
  });

  app.get('/api/leaderboard/overall', async (req, res) => {
    try {
      const leaderboard = await storage.getCredaLeaderboard('overall', 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/leaderboard/weekly', async (req, res) => {
    try {
      const leaderboard = await storage.getCredaLeaderboard('weekly', 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // DAO-specific XP leaderboard routes
  app.get('/api/leaderboard/dao/:daoId/overall', async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoXpLeaderboard(daoId, 'overall', 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO overall leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });

  app.get('/api/leaderboard/dao/:daoId/weekly', async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoXpLeaderboard(daoId, 'weekly', 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO weekly leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });

  // Database backup and monitoring routes
  app.post('/api/admin/backup/create', requireAdminAuth, async (req, res) => {
    try {
      const backupPath = await backupService.createFullBackup();
      res.json({
        message: "Backup created successfully",
        backupPath: backupPath.split('/').pop() // Only return filename for security
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.get('/api/admin/backup/list', requireAdminAuth, async (req, res) => {
    try {
      const backups = backupService.listBackups();
      res.json({ backups });
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  app.get('/api/admin/database/health', requireAdminAuth, async (req, res) => {
    try {
      const health = await databaseMonitor.checkDatabaseHealth();
      res.json(health);
    } catch (error) {
      console.error("Error checking database health:", error);
      res.status(500).json({ message: "Failed to check database health" });
    }
  });

  app.get('/api/admin/database/stats', requireAdminAuth, async (req, res) => {
    try {
      const stats = await backupService.getDatabaseStats();
      res.json({ stats });
    } catch (error) {
      console.error("Error getting database stats:", error);
      res.status(500).json({ message: "Failed to get database stats" });
    }
  });

  app.post('/api/admin/database/validate', requireAdminAuth, async (req, res) => {
    try {
      const isValid = await databaseMonitor.validateDatabaseIntegrity();
      res.json({
        valid: isValid,
        message: isValid ? "Database integrity check passed" : "Database integrity issues found"
      });
    } catch (error) {
      console.error("Error validating database:", error);
      res.status(500).json({ message: "Failed to validate database" });
    }
  });

  // Connection recovery routes
  app.post('/api/admin/database/recover', requireAdminAuth, async (req, res) => {
    try {
      const recovered = await connectionRecovery.triggerManualRecovery();
      res.json({
        recovered,
        message: recovered ? "Connection recovered successfully" : "Recovery failed - check logs"
      });
    } catch (error) {
      console.error("Error during manual recovery:", error);
      res.status(500).json({ message: "Failed to trigger recovery" });
    }
  });

  app.get('/api/admin/database/failures', requireAdminAuth, async (req, res) => {
    try {
      const failures = connectionRecovery.getFailureHistory();
      res.json({ failures });
    } catch (error) {
      console.error("Error getting failure history:", error);
      res.status(500).json({ message: "Failed to get failure history" });
    }
  });

  app.get('/api/admin/database/instructions', requireAdminAuth, async (req, res) => {
    try {
      const instructions = connectionRecovery.getRecoveryInstructions();
      res.json({ instructions });
    } catch (error) {
      console.error("Error getting recovery instructions:", error);
      res.status(500).json({ message: "Failed to get recovery instructions" });
    }
  });

  app.get('/api/admin/database/connection-health', requireAdminAuth, async (req, res) => {
    try {
      const health = await connectionRecovery.checkConnectionHealth();
      res.json(health);
    } catch (error) {
      console.error("Error checking connection health:", error);
      res.status(500).json({ message: "Failed to check connection health" });
    }
  });

  // Data restoration routes
  app.get('/api/admin/backup/detailed-list', requireAdminAuth, async (req, res) => {
    try {
      const backups = await backupRestore.listAvailableBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error listing detailed backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  app.post('/api/admin/backup/validate', requireAdminAuth, async (req, res) => {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ message: "Backup filename is required" });
      }

      const validation = await backupRestore.validateBackup(filename);
      res.json(validation);
    } catch (error) {
      console.error("Error validating backup:", error);
      res.status(500).json({ message: "Failed to validate backup" });
    }
  });

  app.post('/api/admin/backup/restore', requireAdminAuth, async (req, res) => {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ message: "Backup filename is required" });
      }

      console.log(`🔄 Admin requested restoration from: ${filename}`);

      // Create restore point before restoration
      const restorePoint = await backupRestore.createRestorePoint();
      console.log(`💾 Created restore point: ${restorePoint}`);

      // Perform restoration
      const result = await backupRestore.restoreFromFile(filename);

      res.json({
        ...result,
        restorePoint: restorePoint.split('/').pop() // Only return filename
      });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ message: "Failed to restore backup" });
    }
  });

  // GET /api/og-image/:userId - Generate Open Graph image for user
  app.get('/api/og-image/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate SVG-based OG image
      const svgImage = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
          </defs>

          <!-- Background -->
          <rect width="1200" height="630" fill="url(#bgGradient)"/>

          <!-- Profile Card Background -->
          <rect x="50" y="50" width="1100" height="530" rx="20" fill="rgba(255,255,255,0.95)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>

          <!-- Avatar Circle -->
          <circle cx="150" cy="200" r="60" fill="#e5e7eb" stroke="#d1d5db" stroke-width="3"/>
          <text x="150" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#374151">
            ${user.username?.charAt(0)?.toUpperCase() || 'U'}
          </text>

          <!-- Username -->
          <text x="250" y="180" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#1f2937">
            ${user.username || 'User'}
          </text>

          <!-- GRS Score -->
          <text x="250" y="220" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
            GRS Score: ${user.grsScore || 550}
          </text>

          <!-- XP Points -->
          ${user.xpPoints ? `<text x="250" y="250" font-family="Arial, sans-serif" font-size="20" fill="#6b7280">XP Points: ${user.xpPoints}</text>` : ''}

          <!-- DAO AI Branding -->
          <text x="950" y="550" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.8)">
            DAO AI
          </text>

          <!-- Subtitle -->
          <text x="950" y="580" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="end">
            Governance Reputation System
          </text>

          <!-- Decorative elements -->
          <circle cx="950" cy="150" r="40" fill="rgba(255,255,255,0.1)"/>
          <circle cx="1050" cy="250" r="25" fill="rgba(255,255,255,0.08)"/>
        </svg>
      `;

      // Convert SVG to PNG for Twitter/X compatibility
      const pngBuffer = await sharp(Buffer.from(svgImage))
        .png()
        .resize(1200, 630)
        .toBuffer();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(pngBuffer);

    } catch (error) {
      console.error('Error generating OG image:', error);
      res.status(500).json({ message: 'Failed to generate image' });
    }
  });

  // GET /api/og-image - Default OG image
  app.get('/api/og-image', async (req: Request, res: Response) => {
    try {
      // Generate default SVG-based OG image
      const svgImage = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
          </defs>

          <!-- Background -->
          <rect width="1200" height="630" fill="url(#bgGradient)"/>

          <!-- Main Title -->
          <text x="600" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white">
            DAO AI
          </text>

          <!-- Subtitle -->
          <text x="600" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)">
            Governance Reputation System
          </text>

          <!-- Description -->
          <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)">
            Building governance reputation for Web3 communities
          </text>

          <!-- Decorative elements -->
          <circle cx="200" cy="150" r="60" fill="rgba(255,255,255,0.1)"/>
          <circle cx="1000" cy="480" r="40" fill="rgba(255,255,255,0.08)"/>
          <circle cx="150" cy="500" r="30" fill="rgba(255,255,255,0.06)"/>
        </svg>
      `;

      // Convert SVG to PNG for better social media compatibility
      const pngBuffer = await sharp(Buffer.from(svgImage))
        .png()
        .resize(1200, 630)
        .toBuffer();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(pngBuffer);

    } catch (error) {
      console.error('Error generating default OG image:', error);
      res.status(500).json({ message: 'Failed to generate image' });
    }
  });

  // Profile-specific meta tags for social sharing
  app.get('/profile/:username', async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      // Get user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        // Fall back to regular SPA route
        return res.redirect('/');
      }

      // Get the site origin for absolute URLs
      const origin = req.get('host')?.includes('localhost') ?
        `http://${req.get('host')}` :
        `https://${req.get('host')}`;

      const profileUrl = `${origin}/profile/${username}`;
      const imageUrl = `${origin}/api/og-image/${user.id}`;

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
            <title>${user.username} - DAO AI Profile</title>

            <!-- Open Graph / Facebook -->
            <meta property="og:type" content="profile" />
            <meta property="og:url" content="${profileUrl}" />
            <meta property="og:title" content="${user.username}'s Governance Profile - DAO AI" />
            <meta property="og:description" content="GRS Score: ${user.grsScore || 550} • ${user.xpPoints ? `XP Points: ${user.xpPoints} • ` : ''}View ${user.username}'s governance reputation on DAO AI" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="${user.username}'s governance profile card" />

            <!-- Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@daoai" />
            <meta name="twitter:creator" content="@daoai" />
            <meta name="twitter:url" content="${profileUrl}" />
            <meta name="twitter:title" content="${user.username}'s Governance Profile - DAO AI" />
            <meta name="twitter:description" content="GRS Score: ${user.grsScore || 550} • ${user.xpPoints ? `XP Points: ${user.xpPoints} • ` : ''}View ${user.username}'s governance reputation on DAO AI" />
            <meta name="twitter:image" content="${imageUrl}" />
            <meta name="twitter:image:alt" content="${user.username}'s governance profile card with GRS score and XP points" />

            <!-- Additional meta tags -->
            <meta name="description" content="View ${user.username}'s governance reputation profile on DAO AI with GRS Score ${user.grsScore || 550}" />

            <!-- Redirect to React app after meta tags are loaded -->
            <script>
              // Longer delay to allow social media crawlers to read meta tags
              // Twitter/X crawlers need more time to process Open Graph data
              setTimeout(() => {
                window.location.replace('/#/profile/${username}');
              }, 2000);
            </script>
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
              <div style="text-align: center;">
                <h1>${user.username}'s Profile</h1>
                <p>Loading profile...</p>
                <p><a href="/#/profile/${username}">Click here if not redirected automatically</a></p>
              </div>
            </div>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);

    } catch (error) {
      console.error('Error serving profile meta tags:', error);
      // Fall back to regular SPA route
      res.redirect('/');
    }
  });

  // GRS Analytics specific meta tags for social sharing
  app.get('/grs-analytics', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        // Redirect to regular SPA route if no userId provided
        return res.redirect('/');
      }

      // Get user by username or ID
      let user = await storage.getUser(userId as string);
      if (!user) {
        user = await storage.getUserByUsername(userId as string);
      }

      if (!user) {
        // Fall back to regular SPA route
        return res.redirect('/');
      }

      // Get the site origin for absolute URLs
      const origin = req.get('host')?.includes('localhost') ?
        `http://${req.get('host')}` :
        `https://${req.get('host')}`;

      const analyticsUrl = `${origin}/grs-analytics?userId=${userId}`;
      const imageUrl = `${origin}/api/og-image/${user.id}`;

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
            <title>${user.username} - GRS Analytics - DAO AI</title>

            <!-- Open Graph / Facebook -->
            <meta property="og:type" content="article" />
            <meta property="og:url" content="${analyticsUrl}" />
            <meta property="og:title" content="${user.username}'s GRS Analytics - DAO AI" />
            <meta property="og:description" content="GRS Score: ${user.grsScore || 550} • Detailed governance reputation analysis for ${user.username} on DAO AI" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="${user.username}'s GRS analytics dashboard" />

            <!-- Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@daoai" />
            <meta name="twitter:creator" content="@daoai" />
            <meta name="twitter:url" content="${analyticsUrl}" />
            <meta name="twitter:title" content="${user.username}'s GRS Analytics - DAO AI" />
            <meta name="twitter:description" content="GRS Score: ${user.grsScore || 550} • Detailed governance reputation analysis for ${user.username} on DAO AI" />
            <meta name="twitter:image" content="${imageUrl}" />
            <meta name="twitter:image:alt" content="${user.username}'s GRS analytics with detailed breakdown" />

            <!-- Additional meta tags -->
            <meta name="description" content="View ${user.username}'s detailed GRS analytics on DAO AI with score ${user.grsScore || 550} and impact factors breakdown" />

            <!-- Redirect to React app after meta tags are loaded -->
            <script>
              // Longer delay to allow social media crawlers to read meta tags
              setTimeout(() => {
                window.location.replace('/#/grs-analytics?userId=${userId}');
              }, 2000);
            </script>
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
              <div style="text-align: center;">
                <h1>${user.username}'s GRS Analytics</h1>
                <p>Loading analytics dashboard...</p>
                <p><a href="/#/grs-analytics?userId=${userId}">Click here if not redirected automatically</a></p>
              </div>
            </div>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);

    } catch (error) {
      console.error('Error serving GRS analytics meta tags:', error);
      // Fall back to regular SPA route
      res.redirect('/');
    }
  });

  // ==================== GRS API ENDPOINTS ====================

  // Get user's GRS history
  app.get('/api/users/:userId/grs-history', async (req, res) => {
    try {
      const userId = req.params.userId;
      const limit = parseInt(req.query.limit as string) || 50;
      const grsHistory = await storage.getGrsHistory(userId, limit);
      res.json(grsHistory);
    } catch (error) {
      console.error("Error fetching GRS history:", error);
      res.status(500).json({ message: "Failed to fetch GRS history" });
    }
  });

  // Manual GRS calculation endpoint (for testing/admin)
  app.post('/api/stances/:stanceId/calculate-grs', isAuthenticated, async (req: any, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);

      // For testing, allow any authenticated user to trigger calculations
      // In production, you might want to restrict this to admins only
      await storage.calculateStanceResults(stanceId);

      res.json({ message: "GRS calculations completed for stance" });
    } catch (error) {
      console.error("Error calculating stance GRS:", error);
      res.status(500).json({ message: "Failed to calculate stance GRS" });
    }
  });

  // Weekly review accuracy evaluation endpoint (for background jobs)
  app.post('/api/grs/evaluate-review-accuracy', async (req, res) => {
    try {
      await storage.evaluateReviewAccuracy();
      res.json({ message: "Review accuracy evaluation completed" });
    } catch (error) {
      console.error("Error evaluating review accuracy:", error);
      res.status(500).json({ message: "Failed to evaluate review accuracy" });
    }
  });

  // Manual GRS scheduler triggers (for testing/admin)
  app.post('/api/grs/process-expired-stances', async (req, res) => {
    try {
      await storage.processExpiredStances();
      res.json({ message: "Expired stances processing completed" });
    } catch (error) {
      console.error("Error processing expired stances:", error);
      res.status(500).json({ message: "Failed to process expired stances" });
    }
  });

  // Update GRS when reviews are created (hook into existing review creation)
  // This will be automatically called when reviews are created

  // Get recent threads
  app.get("/api/threads/recent", async (req, res) => {
    try {
      const { since, count_only } = req.query;

      if (count_only === 'true' && since) {
        // Return only count of new threads since the given timestamp
        const newThreadsCount = await storage.getNewThreadsCount(since as string);
        res.json({ count: newThreadsCount });
      } else {
        const recentThreads = await storage.getRecentThreads();
        res.json(recentThreads);
      }
    } catch (error) {
      console.error("Error fetching recent threads:", error);
      res.status(500).json({ error: "Failed to fetch recent threads" });
    }
  });

  // Get governance issues
  app.get("/api/governance/issues", async (req, res) => {
    try {
      const { since, count_only } = req.query;

      if (count_only === 'true' && since) {
        // Return only count of new issues since the given timestamp
        const newIssuesCount = await storage.getNewGovernanceIssuesCount(since as string);
        res.json({ count: newIssuesCount });
      } else {
        const issues = await storage.getGovernanceIssues();
        res.json(issues);
      }
    } catch (error) {
      console.error("Error fetching governance issues:", error);
      res.status(500).json({ error: "Failed to fetch governance issues" });
    }
  });


  // Daily Tasks API routes
  app.get('/api/daily-tasks/progress/:date?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const taskDate = req.params.date || new Date().toISOString().split('T')[0];

      const progress = await storage.getDailyTasksProgress(userId, taskDate);
      const resetInfo = await storage.getResetTimeInfo();

      res.json({
        progress: progress || {
          userId,
          taskDate,
          engagementActionsCompleted: 0,
          isStreakEligible: false,
        },
        config: resetInfo,
      });
    } catch (error) {
      console.error("Error fetching daily tasks progress:", error);
      res.status(500).json({ message: "Failed to fetch daily tasks progress" });
    }
  });

  app.get('/api/daily-tasks/engagement-stats/:date?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const date = req.params.date || new Date().toISOString().split('T')[0];

      const engagementActions = await storage.getEngagementActionsForUser(userId, date);

      res.json({
        date,
        actions: engagementActions,
        totalActions: engagementActions.reduce((sum, action) => sum + action.count, 0),
      });
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
      res.status(500).json({ message: "Failed to fetch engagement stats" });
    }
  });

  app.post('/api/daily-tasks/process-streaks', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.profileType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { targetDate } = req.body;
      const date = targetDate || new Date().toISOString().split('T')[0];

      await storage.processStreaksForAllUsers(date);

      res.json({
        message: "Streaks processed successfully",
        processedDate: date,
      });
    } catch (error) {
      console.error("Error processing streaks:", error);
      res.status(500).json({ message: "Failed to process streaks" });
    }
  });

  app.get('/api/daily-tasks/config', isAuthenticated, async (req: any, res) => {
    try {
      const resetInfo = await storage.getResetTimeInfo();
      res.json(resetInfo);
    } catch (error) {
      console.error("Error fetching daily tasks config:", error);
      res.status(500).json({ message: "Failed to fetch daily tasks config" });
    }
  });

  // 0G Storage Verification Endpoints
  // Check 0G Storage service availability
  app.get('/api/0g-storage/status', async (req, res) => {
    try {
      res.json({
        available: ogStorageService.isAvailable(),
        message: ogStorageService.isAvailable()
          ? '0G Storage is configured and ready'
          : '0G Storage is not configured (OG_PRIVATE_KEY not set)'
      });
    } catch (error) {
      console.error("Error checking 0G Storage status:", error);
      res.status(500).json({ message: "Failed to check 0G Storage status" });
    }
  });

  // 0G Storage Metrics - Get comprehensive metrics for the dashboard
  app.get('/api/0g/metrics', async (req, res) => {
    try {
      // Get all activities with 0G storage records
      const allOnChainActivities = await db
        .select()
        .from(credaActivities)
        .where(sql`${credaActivities.ogTxHash} IS NOT NULL`)
        .orderBy(desc(credaActivities.createdAt));

      // Calculate total transactions
      const totalTransactions = allOnChainActivities.length;

      // Estimate storage size (average JSON record ~500 bytes)
      const avgRecordSize = 512;
      const totalStorageBytes = totalTransactions * avgRecordSize;

      // Activity breakdown by type
      const activityTypeCounts: Record<string, number> = {};
      allOnChainActivities.forEach(activity => {
        const type = activity.activityType || 'unknown';
        activityTypeCounts[type] = (activityTypeCounts[type] || 0) + 1;
      });

      const activityBreakdown = Object.entries(activityTypeCounts)
        .map(([type, count]) => ({
          type,
          count,
          percentage: totalTransactions > 0 ? (count / totalTransactions) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      // Daily stats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyStatsMap: Record<string, { transactions: number; bytes: number }> = {};
      
      allOnChainActivities.forEach(activity => {
        const date = activity.createdAt 
          ? new Date(activity.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        
        if (new Date(date) >= thirtyDaysAgo) {
          if (!dailyStatsMap[date]) {
            dailyStatsMap[date] = { transactions: 0, bytes: 0 };
          }
          dailyStatsMap[date].transactions++;
          dailyStatsMap[date].bytes += avgRecordSize;
        }
      });

      const dailyStats = Object.entries(dailyStatsMap)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Weekly growth calculation
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const thisWeekCount = allOnChainActivities.filter(a => 
        a.createdAt && new Date(a.createdAt) >= oneWeekAgo
      ).length;
      const lastWeekCount = allOnChainActivities.filter(a => 
        a.createdAt && new Date(a.createdAt) >= twoWeeksAgo && new Date(a.createdAt) < oneWeekAgo
      ).length;

      const weeklyGrowth = lastWeekCount > 0 
        ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100 
        : thisWeekCount > 0 ? 100 : 0;

      // Monthly growth calculation
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const thisMonthCount = allOnChainActivities.filter(a => 
        a.createdAt && new Date(a.createdAt) >= oneMonthAgo
      ).length;
      const lastMonthCount = allOnChainActivities.filter(a => 
        a.createdAt && new Date(a.createdAt) >= twoMonthsAgo && new Date(a.createdAt) < oneMonthAgo
      ).length;

      const monthlyGrowth = lastMonthCount > 0 
        ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 
        : thisMonthCount > 0 ? 100 : 0;

      // Unique users with on-chain activity
      const uniqueUsers = new Set(allOnChainActivities.map(a => a.userId)).size;

      // Recent transactions
      const recentTransactions = allOnChainActivities.slice(0, 50).map(activity => ({
        id: activity.id,
        activityType: activity.activityType,
        ogTxHash: activity.ogTxHash,
        ogRootHash: activity.ogRootHash,
        ogRecordedAt: activity.ogRecordedAt,
        createdAt: activity.createdAt
      }));

      // Get user growth data
      const allUsers = await db
        .select({
          id: users.id,
          createdAt: users.createdAt
        })
        .from(users)
        .orderBy(asc(users.createdAt));

      // Daily user signups (last 60 days)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const userGrowthDaily: Record<string, number> = {};
      let cumulativeUsers = 0;
      
      // Initialize all days in the last 60 days
      for (let i = 59; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        userGrowthDaily[dateStr] = 0;
      }

      // Count users created before the 60 day window
      allUsers.forEach(user => {
        if (user.createdAt && new Date(user.createdAt) < sixtyDaysAgo) {
          cumulativeUsers++;
        }
      });

      // Count signups per day
      allUsers.forEach(user => {
        if (user.createdAt) {
          const date = new Date(user.createdAt).toISOString().split('T')[0];
          if (userGrowthDaily[date] !== undefined) {
            userGrowthDaily[date]++;
          }
        }
      });

      // Build cumulative user growth array
      const userGrowthData = Object.entries(userGrowthDaily)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, newUsers]) => {
          cumulativeUsers += newUsers;
          return {
            date,
            newUsers,
            totalUsers: cumulativeUsers
          };
        });

      // Weekly aggregation
      const weeklyUserGrowth: { week: string; newUsers: number; totalUsers: number }[] = [];
      for (let i = 0; i < userGrowthData.length; i += 7) {
        const weekData = userGrowthData.slice(i, i + 7);
        if (weekData.length > 0) {
          const weekNewUsers = weekData.reduce((sum, d) => sum + d.newUsers, 0);
          const lastDay = weekData[weekData.length - 1];
          weeklyUserGrowth.push({
            week: weekData[0].date,
            newUsers: weekNewUsers,
            totalUsers: lastDay.totalUsers
          });
        }
      }

      // On-chain interactions chart data (cumulative)
      let cumulativeTxs = 0;
      const onChainGrowthData = Object.entries(dailyStatsMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, stats]) => {
          cumulativeTxs += stats.transactions;
          return {
            date,
            transactions: stats.transactions,
            cumulative: cumulativeTxs
          };
        });

      res.json({
        totalTransactions,
        totalStorageBytes,
        activityBreakdown,
        dailyStats,
        recentTransactions,
        weeklyGrowth,
        monthlyGrowth,
        averageRecordSize: avgRecordSize,
        uniqueUsers,
        userGrowthData,
        weeklyUserGrowth,
        onChainGrowthData,
        totalUsers: allUsers.length
      });
    } catch (error) {
      console.error("Error fetching 0G metrics:", error);
      res.status(500).json({ message: "Failed to fetch 0G metrics" });
    }
  });

  // =============================================
  // SIMULATION CONTROL ENDPOINTS (Admin Protected)
  // =============================================
  
  // Import simulation service at the top-level routes
  const { simulationService } = await import('./services/simulationService');

  // Simulation config validation schema
  const simulationConfigSchema = z.object({
    actionType: z.enum(['votes', 'reviews', 'comments', 'mixed']),
    targetCount: z.number().int().min(1).max(500),
    durationMinutes: z.number().int().min(1).max(1440),
    targetThreshold: z.number().int().min(1).optional()
  });

  // Get simulation status (admin protected)
  app.get('/api/admin/simulation/status', requireAdminAuth, async (req, res) => {
    try {
      const status = simulationService.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting simulation status:", error);
      res.status(500).json({ message: "Failed to get simulation status" });
    }
  });

  // Start a new simulation (admin protected with validation)
  app.post('/api/admin/simulation/start', requireAdminAuth, async (req, res) => {
    try {
      const parsed = simulationConfigSchema.safeParse({
        actionType: req.body.actionType,
        targetCount: parseInt(req.body.targetCount) || 0,
        durationMinutes: parseInt(req.body.durationMinutes) || 0,
        targetThreshold: req.body.targetThreshold ? parseInt(req.body.targetThreshold) : undefined
      });

      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid configuration",
          errors: parsed.error.flatten().fieldErrors
        });
      }

      const result = await simulationService.start(parsed.data);
      res.json(result);
    } catch (error) {
      console.error("Error starting simulation:", error);
      res.status(500).json({ message: "Failed to start simulation" });
    }
  });

  // Stop the current simulation (admin protected)
  app.post('/api/admin/simulation/stop', requireAdminAuth, async (req, res) => {
    try {
      const result = simulationService.stop();
      res.json(result);
    } catch (error) {
      console.error("Error stopping simulation:", error);
      res.status(500).json({ message: "Failed to stop simulation" });
    }
  });

  // Test 0G Storage upload - creates a test record and uploads to 0G Storage
  app.post('/api/0g-storage/test-upload', async (req, res) => {
    try {
      if (!ogStorageService.isAvailable()) {
        return res.status(503).json({
          success: false,
          message: '0G Storage is not configured (OG_PRIVATE_KEY not set)'
        });
      }

      // Check wallet balance first
      const balance = await ogStorageService.getWalletBalance();
      console.log(`[0G Storage Test] Wallet balance: ${balance} 0G`);

      if (parseFloat(balance) < 0.001) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance for upload. Balance: ${balance} 0G`,
          balance
        });
      }

      // Run test upload
      const result = await ogStorageService.testUpload();

      res.json({
        success: result.success,
        txHash: result.txHash,
        rootHash: result.rootHash,
        storagescanUrl: result.storagescanUrl,
        explorerUrl: result.rootHash ? `https://storagescan.0g.ai/file/${result.rootHash}` : null,
        balance,
        error: result.error
      });
    } catch (error) {
      console.error("Error in 0G Storage test upload:", error);
      res.status(500).json({
        success: false,
        message: "Failed to test 0G Storage upload",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Verify an on-chain record
  app.get('/api/0g-storage/verify/:txHash', async (req, res) => {
    try {
      const { txHash } = req.params;

      if (!txHash) {
        return res.status(400).json({ message: "Transaction hash required" });
      }

      // Get the activity with this tx hash
      const activity = await db
        .select()
        .from(credaActivities)
        .where(eq(credaActivities.ogTxHash, txHash))
        .limit(1);

      if (!activity.length) {
        return res.status(404).json({
          verified: false,
          message: "No activity found with this transaction hash"
        });
      }

      const activityData = activity[0];

      // Verify with 0G Storage service
      const verification = await ogStorageService.verifyRecord(
        activityData.ogTxHash || '',
        activityData.ogRootHash || ''
      );

      res.json({
        verified: verification.verified,
        activity: {
          id: activityData.id,
          type: activityData.activityType,
          userId: activityData.userId,
          targetType: activityData.targetType,
          targetId: activityData.targetId,
          ogTxHash: activityData.ogTxHash,
          ogRootHash: activityData.ogRootHash,
          ogRecordedAt: activityData.ogRecordedAt,
          createdAt: activityData.createdAt
        },
        explorerUrl: ogStorageService.getVerificationUrl(txHash),
        details: verification.details
      });
    } catch (error) {
      console.error("Error verifying 0G Storage record:", error);
      res.status(500).json({ message: "Failed to verify record" });
    }
  });

  // Get on-chain proof for a specific activity
  app.get('/api/0g-storage/activity/:activityId/proof', async (req, res) => {
    try {
      const activityId = parseInt(req.params.activityId);

      if (isNaN(activityId)) {
        return res.status(400).json({ message: "Invalid activity ID" });
      }

      const activity = await storage.getCredaActivityById(activityId);

      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      if (!activity.ogTxHash) {
        return res.json({
          recorded: false,
          message: "This activity has not been recorded on-chain yet"
        });
      }

      res.json({
        recorded: true,
        activityId: activity.id,
        activityType: activity.activityType,
        ogTxHash: activity.ogTxHash,
        ogRootHash: activity.ogRootHash,
        ogRecordedAt: activity.ogRecordedAt,
        explorerUrl: ogStorageService.getVerificationUrl(activity.ogTxHash),
        message: "This action is immutably stored on 0G Storage"
      });
    } catch (error) {
      console.error("Error fetching activity proof:", error);
      res.status(500).json({ message: "Failed to fetch activity proof" });
    }
  });

  // Get all on-chain recorded activities for a user
  app.get('/api/users/:userId/on-chain-activities', async (req, res) => {
    try {
      const { userId } = req.params;

      const activities = await db
        .select()
        .from(credaActivities)
        .where(
          and(
            eq(credaActivities.userId, userId),
            sql`${credaActivities.ogTxHash} IS NOT NULL`
          )
        )
        .orderBy(desc(credaActivities.createdAt))
        .limit(100);

      res.json(activities.map(activity => ({
        id: activity.id,
        type: activity.activityType,
        credaAwarded: activity.credaAwarded,
        targetType: activity.targetType,
        targetId: activity.targetId,
        ogTxHash: activity.ogTxHash,
        ogRootHash: activity.ogRootHash,
        ogRecordedAt: activity.ogRecordedAt,
        createdAt: activity.createdAt,
        explorerUrl: activity.ogTxHash ? ogStorageService.getVerificationUrl(activity.ogTxHash) : null
      })));
    } catch (error) {
      console.error("Error fetching user on-chain activities:", error);
      res.status(500).json({ message: "Failed to fetch on-chain activities" });
    }
  });

  app.put('/api/daily-tasks/config', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.profileType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { resetTimeUtc, minActionsForStreak } = req.body;

      if (resetTimeUtc !== undefined) {
        await storage.upsertDailyTasksConfig({
          configKey: 'reset_time_utc',
          configValue: resetTimeUtc,
          description: 'UTC time for daily streak reset (HH:MM format)',
        });
      }

      if (minActionsForStreak !== undefined) {
        await storage.upsertDailyTasksConfig({
          configKey: 'min_actions_for_streak',
          configValue: minActionsForStreak.toString(),
          description: 'Minimum engagement actions required to maintain streak',
        });
      }

      const updatedConfig = await storage.getResetTimeInfo();
      res.json({
        message: "Configuration updated successfully",
        config: updatedConfig,
      });
    } catch (error) {
      console.error("Error updating daily tasks config:", error);
      res.status(500).json({ message: "Failed to update daily tasks config" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}