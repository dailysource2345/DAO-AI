import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (supports both Replit Auth and email auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Primary key for all foreign key relationships - NEVER CHANGE
  access_id: varchar("access_id").unique(), // Bridge for Twitter OAuth authentication linking
  email: varchar("email").unique(),
  password: varchar("password"), // For email auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  walletAddress: varchar("wallet_address"),
  walletVerificationTxHash: varchar("wallet_verification_tx_hash"), // Transaction hash proving wallet verification
  twitterHandle: varchar("twitter_handle"), // X/Twitter handle for unclaimed accounts
  twitterUrl: varchar("twitter_url"), // Full X/Twitter profile URL
  credaPoints: integer("creda_points").default(0), // DAO AI CREDA Points - gamification system
  weeklyCreda: integer("weekly_creda").default(0), // Weekly CREDA points (reset weekly)
  lastCredaWeekReset: timestamp("last_creda_week_reset").defaultNow(), // When weekly CREDA was last reset
  dailyStreak: integer("daily_streak").default(0), // Current daily engagement streak  
  longestStreak: integer("longest_streak").default(0), // Longest streak ever achieved
  lastActiveDate: timestamp("last_active_date"), // Last day user was active
  lastStreakDate: timestamp("last_streak_date"), // Last date streak was maintained
  grsScore: integer("grs_score").default(1300), // AI Governance Reputation Score (0-2800 scale)
  grsPercentile: integer("grs_percentile").default(0), // User's percentile rank (0-100)
  emailVerified: boolean("email_verified").default(false),
  authProvider: varchar("auth_provider").default("email"), // 'email' or 'replit'
  referralCode: varchar("referral_code").unique(),
  hasInviteAccess: boolean("has_invite_access").default(false), // Whether user has been granted access via invite code
  fullAccessActivatedAt: timestamp("full_access_activated_at"), // When user gained full access
  isClaimed: boolean("is_claimed").default(true), // Whether this account is claimed by the actual person
  isUnclaimedProfile: boolean("is_unclaimed_profile").default(false), // Whether this is an unclaimed profile
  claimedAt: timestamp("claimed_at"), // When the account was claimed
  createdBy: varchar("created_by"), // User who created this unclaimed profile - will be linked via foreign key
  profileType: varchar("profile_type").default("member"), // "member", "organisation", or "dao"
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  // Enhanced invite tracking fields
  invitedBy: varchar("invited_by").references(() => users.id), // User who invited this user
  inviteCodeUsed: varchar("invite_code_used"), // The specific invite code used
  inviteCodesAvailable: integer("invite_codes_available").default(3), // Available invite codes
  totalInvitesSent: integer("total_invites_sent").default(0), // Total invites sent by this user
  successfulInvites: integer("successful_invites").default(0), // Successful invites (users who joined)
  lastInviteCredaMilestone: integer("last_invite_creda_milestone").default(0), // Last CREDA milestone for invite rewards
  // Profile completion fields
  bio: text("bio"),
  linkedinUrl: varchar("linkedin_url"),
  githubUrl: varchar("github_url"),
  discordHandle: varchar("discord_handle"),
  telegramHandle: varchar("telegram_handle"),
  governanceInterests: text("governance_interests"), // JSON array of interests
  profileCompletedAt: timestamp("profile_completed_at"),
  // Account suspension fields
  isSuspended: boolean("is_suspended").default(false), // Whether account is suspended
  suspendedAt: timestamp("suspended_at"), // When account was suspended
  suspensionReason: text("suspension_reason"), // Admin note on why account was suspended
  // 0G Storage immutable audit fields
  ogTxHash: text("og_tx_hash"),
  ogRootHash: text("og_root_hash"),
  ogRecordedAt: timestamp("og_recorded_at"),
  zgMerkleHash: text("zg_merkle_hash"),
  zgStoredAt: timestamp("zg_stored_at"),
  // ROFL Confidential Compute attestation fields
  roflReputationScore: integer("rofl_reputation_score"), // ROFL-computed reputation score (0-1000)
  roflConfidenceScore: integer("rofl_confidence_score"), // ROFL confidence * 100 (0-100 for 0.00-1.00)
  roflEnclaveId: text("rofl_enclave_id"), // ROFL enclave identifier
  roflAppHash: text("rofl_app_hash"), // ROFL app measurement hash
  roflAttestationHash: text("rofl_attestation_hash"), // ROFL attestation hash
  roflAttestationSignature: text("rofl_attestation_signature"), // ROFL attestation signature
  roflComputedAt: timestamp("rofl_computed_at"), // When ROFL computed the score
  roflOgTxHash: text("rofl_og_tx_hash"), // 0G Storage tx hash for ROFL attestation
  roflOgRootHash: text("rofl_og_root_hash"), // 0G Storage root hash for ROFL attestation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email verification codes table
export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin sessions table for password protection
export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  sessionToken: varchar("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// DAOs table
export const daos = pgTable("daos", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  twitterHandle: varchar("twitter_handle"), // X/Twitter handle for the DAO
  twitterUrl: varchar("twitter_url"), // Full X/Twitter profile URL
  website: varchar("website"), // Official website URL
  category: varchar("category").default("DeFi"), // Category like "DeFi", "Gaming", "NFT", etc.
  isVerified: boolean("is_verified").default(false), // Whether the DAO is verified by admin
  isUnclaimed: boolean("is_unclaimed").default(true), // Whether the DAO profile is unclaimed
  claimedBy: varchar("claimed_by").references(() => users.id), // User who claimed this DAO profile
  claimedAt: timestamp("claimed_at"), // When the DAO was claimed
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Spaces table (project-specific areas)
export const spaces = pgTable("spaces", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  category: varchar("category"), // Original category field
  tags: text("tags").array(), // Tags array
  badge: varchar("badge"), // Category badge like "Infrastructure", "DeFi", etc.
  gradient: varchar("gradient"), // CSS gradient for styling
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  memberCount: integer("member_count").default(0),
  bullishVotes: integer("bullish_votes").default(0),
  bearishVotes: integer("bearish_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  viewCount: integer("view_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Governance Issues table (replaces threads/forum system)
export const governanceIssues = pgTable("governance_issues", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(), // e.g., "EIP-407"
  content: text("content").notNull(), // User's personal viewpoint/argument
  proposalLink: varchar("proposal_link"), // Link to original proposal (X, etc.)
  authorId: varchar("author_id").notNull().references(() => users.id),
  daoId: integer("dao_id").references(() => daos.id), // Which DAO this relates to
  spaceId: integer("space_id").references(() => spaces.id), // Which space this relates to
  stance: varchar("stance").notNull(), // "champion" or "challenge"
  targetUserId: varchar("target_user_id").references(() => users.id), // Person being challenged/championed (deprecated)
  targetUsername: varchar("target_username"), // X handle if user doesn't exist yet (deprecated)
  targetProjectId: integer("target_project_id").references(() => companies.id), // Project being championed/challenged
  targetProjectName: varchar("target_project_name"), // Project name
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  commentCount: integer("comment_count").default(0),
  // New stance voting counts
  championVotes: integer("champion_votes").default(0), // votes supporting a champion stance
  challengeVotes: integer("challenge_votes").default(0), // votes supporting a challenge stance
  opposeVotes: integer("oppose_votes").default(0), // votes opposing the stance
  isActive: boolean("is_active").default(true), // false after time limit (48 hours)
  activityScore: integer("activity_score").default(0), // engagement metric
  expiresAt: timestamp("expires_at").notNull(), // 48 hours from creation
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  // 0G Storage immutable audit fields
  ogTxHash: text("og_tx_hash"),
  ogRootHash: text("og_root_hash"),
  ogRecordedAt: timestamp("og_recorded_at"),
  zgMerkleHash: text("zg_merkle_hash"),
  zgStoredAt: timestamp("zg_stored_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table (now for governance issues)
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  issueId: integer("issue_id").notNull().references(() => governanceIssues.id),
  parentCommentId: integer("parent_comment_id").references(() => comments.id), // For nested replies
  stance: varchar("stance"), // "champion", "challenge", or null for neutral
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isEarlyParticipant: boolean("is_early_participant").default(false), // bonus points for early engagement
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User votes table (to track what users have voted on)
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetType: varchar("target_type").notNull(), // 'issue', 'comment', or 'review'
  targetId: integer("target_id").notNull(),
  voteType: varchar("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("created_at").defaultNow(),
});

// Stance votes table (new voting system for stances)
export const stanceVotes = pgTable("stance_votes", {
  id: serial("id").primaryKey(),
  stanceId: integer("stance_id").references(() => governanceIssues.id).notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  voteType: varchar("vote_type").notNull(), // 'champion', 'challenge', or 'oppose'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userStanceUnique: unique().on(table.userId, table.stanceId)
}));

// Comment votes table
export const commentVotes = pgTable("comment_votes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  voteType: varchar("vote_type").notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp("created_at").defaultNow(),
});

// Space votes table (to track user sentiment votes on spaces)
export const spaceVotes = pgTable("space_votes", {
  id: serial("id").primaryKey(),
  spaceId: integer("space_id").notNull().references(() => spaces.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  voteType: varchar("vote_type").notNull(), // 'bullish' or 'bearish'
  comment: text("comment"), // Optional comment explaining the vote
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userSpaceUnique: unique().on(table.userId, table.spaceId)
}));

// User DAO scores table (per-DAO reputation)
export const userDaoScores = pgTable("user_dao_scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  daoId: integer("dao_id").notNull().references(() => daos.id),
  score: integer("score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userDaoUnique: unique().on(table.userId, table.daoId)
}));

// User DAO follows table (to track which DAOs users follow)
export const userDaoFollows = pgTable("user_dao_follows", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  daoId: integer("dao_id").notNull().references(() => daos.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Invite codes table (to control access to the platform)
export const inviteCodes = pgTable("invite_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  createdBy: varchar("created_by").references(() => users.id),
  usedBy: varchar("used_by").references(() => users.id),
  isUsed: boolean("is_used").default(false),
  maxUses: integer("max_uses").default(1),
  currentUses: integer("current_uses").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at"),
  // Enhanced tracking fields
  usageIpAddress: varchar("usage_ip_address"),
  usageUserAgent: text("usage_user_agent"),
  usageLocation: varchar("usage_location"), // Geographic location if available
  isRewardClaimed: boolean("is_reward_claimed").default(false), // Whether CREDA reward was given
  rewardClaimedAt: timestamp("reward_claimed_at"),
  // Code type to distinguish admin vs user generated codes
  codeType: varchar("code_type").notNull().default("admin"), // 'admin' or 'user'
});

// New table: Invite usage tracking for detailed analytics
export const inviteUsage = pgTable("invite_usage", {
  id: serial("id").primaryKey(),
  inviteCodeId: integer("invite_code_id").notNull().references(() => inviteCodes.id),
  inviterId: varchar("inviter_id").notNull().references(() => users.id),
  invitedUserId: varchar("invited_user_id").notNull().references(() => users.id),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  location: varchar("location"),
  deviceFingerprint: text("device_fingerprint"),
  credaRewardGiven: integer("creda_reward_given").default(100),
  rewardGivenAt: timestamp("reward_given_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table: Invite rewards tracking
export const inviteRewards = pgTable("invite_rewards", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  inviteUsageId: integer("invite_usage_id").notNull().references(() => inviteUsage.id),
  rewardType: varchar("reward_type").notNull().default("successful_invite"), // 'successful_invite', 'milestone_bonus'
  credaAmount: integer("creda_amount").notNull().default(100),
  milestone: integer("milestone"), // 500, 1000, 2000 CREDA milestones
  newCodesGenerated: integer("new_codes_generated").default(3),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table: Admin investigation flags
export const adminFlags = pgTable("admin_flags", {
  id: serial("id").primaryKey(),
  flagType: varchar("flag_type").notNull(), // 'suspicious_invite_usage', 'rapid_creda_gain', 'ip_overlap', 'device_overlap'
  severity: varchar("severity").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  targetUserId: varchar("target_user_id").references(() => users.id),
  targetInviteCodeId: integer("target_invite_code_id").references(() => inviteCodes.id),
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // Additional context data
  status: varchar("status").notNull().default("pending"), // 'pending', 'investigating', 'resolved', 'dismissed'
  investigatedBy: varchar("investigated_by").references(() => users.id),
  investigatedAt: timestamp("investigated_at"),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invite submissions table (to track who has submitted codes)
export const inviteSubmissions = pgTable("invite_submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  inviteCode: varchar("invite_code").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, approved, denied
  submittedAt: timestamp("submitted_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
});

// Referrals table (to track user referrals)
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  referredId: varchar("referred_id").notNull().references(() => users.id),
  referralCode: varchar("referral_code").notNull(),
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Profiles table (for business accounts collecting reviews)
export const businessProfiles = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  companyName: varchar("company_name").notNull(),
  slug: varchar("slug").notNull().unique(),
  industry: varchar("industry"),
  website: varchar("website"),
  email: varchar("email"),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  plan: varchar("plan").notNull().default("free"),
  inviteCode: varchar("invite_code").notNull().unique(),
  isDeployed: boolean("is_deployed").default(false),
  deployedAt: timestamp("deployed_at"),
  totalReviews: integer("total_reviews").default(0),
  averageRating: integer("average_rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table (to track user reviews of other users)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  reviewedId: varchar("reviewed_id"), // Can be null for external entities
  reviewedUserId: varchar("reviewed_user_id").references(() => users.id), // For platform users
  reviewedDaoId: integer("reviewed_dao_id").references(() => daos.id), // For platform DAOs
  reviewedBusinessId: integer("reviewed_business_id").references(() => businessProfiles.id), // For business profiles
  spaceId: integer("space_id").references(() => spaces.id), // Which space this relates to
  targetType: varchar("target_type").notNull(), // 'user', 'dao', or 'business'
  isTargetOnPlatform: boolean("is_target_on_platform").default(true),
  externalEntityName: text("external_entity_name"), // For external entities
  externalEntityXHandle: text("external_entity_x_handle"), // For external entities
  reviewType: varchar("review_type").notNull(), // 'positive', 'negative', 'neutral'
  rating: integer("rating").notNull(),
  title: text("title"), // Added title field
  content: text("content").notNull(), // User's review content
  pointsAwarded: integer("points_awarded").default(5), // points for giving a review
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  helpfulCount: integer("helpful_count").default(0), // Added helpfulCount
  companyReply: text("company_reply"), // Company's reply to the review
  companyRepliedAt: timestamp("company_replied_at"), // When company replied
  // 0G Storage immutable audit fields
  ogTxHash: text("og_tx_hash"),
  ogRootHash: text("og_root_hash"),
  ogRecordedAt: timestamp("og_recorded_at"),
  zgMerkleHash: text("zg_merkle_hash"),
  zgStoredAt: timestamp("zg_stored_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Unique constraint for a user reviewing another user only once
  reviewerReviewedUnique: unique("reviewer_reviewed_unique").on(table.reviewerId, table.reviewedUserId)
}));

// Review Comments table
export const reviewComments = pgTable("review_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  reviewId: integer("review_id").notNull().references(() => reviews.id),
  parentCommentId: integer("parent_comment_id").references(() => reviewComments.id), // For nested replies
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project Reviews table (for Web3 project reviews on /projects page)
export const projectReviews = pgTable("project_reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: varchar("project_id").notNull(), // External project ID (e.g., "1", "10", "kast")
  projectName: varchar("project_name").notNull(),
  projectLogo: varchar("project_logo").notNull(),
  projectSlug: varchar("project_slug").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"), // Optional review title
  content: text("content").notNull(), // Review text
  helpful: integer("helpful").default(0), // Helpful count
  verified: boolean("verified").default(false), // Verified purchase/user
  companyReply: text("company_reply"), // Company's reply to the review
  companyRepliedAt: timestamp("company_replied_at"), // When company replied
  spaceId: integer("space_id").references(() => spaces.id), // Which space this relates to (preserved for migration compatibility)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Review Reports table (for flagging/reporting project reviews)
export const reviewReports = pgTable("review_reports", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull().references(() => projectReviews.id, { onDelete: "cascade" }),
  reportedBy: varchar("reported_by").notNull().references(() => users.id),
  reason: varchar("reason").notNull(), // Predefined reason: "spam", "inappropriate", "misleading", "offensive", "other"
  notes: text("notes"), // Optional additional context from the reporter
  status: varchar("status").default("pending"), // "pending", "reviewed", "dismissed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Content Reports table (for reporting any content type - stances, comments, reviews)
export const contentReports = pgTable("content_reports", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type").notNull(), // 'stance', 'comment', 'review'
  contentId: integer("content_id").notNull(), // ID of the reported content
  reportedBy: varchar("reported_by").notNull().references(() => users.id),
  reason: varchar("reason").notNull(), // 'spam', 'inappropriate', 'misleading', 'offensive', 'other'
  notes: text("notes"), // Optional additional context from the reporter
  status: varchar("status").default("pending"), // "pending", "reviewed", "dismissed", "actioned"
  createdAt: timestamp("created_at").defaultNow(),
});

// Review Shares table (for tracking when users share their reviews on X/Twitter)
export const reviewShares = pgTable("review_shares", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  reviewId: integer("review_id").notNull().references(() => projectReviews.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull(), // External project ID
  projectName: varchar("project_name").notNull(),
  projectLogo: varchar("project_logo").notNull(),
  shareToken: varchar("share_token").notNull().unique(), // Unique token for tracking clicks
  credaEarned: integer("creda_earned").notNull(), // CREDA earned from this review
  platform: varchar("platform").default("twitter"), // 'twitter', 'facebook', etc.
  clicks: integer("clicks").default(0), // Number of times share link was clicked
  conversions: integer("conversions").default(0), // Number of users who created accounts from this share
  shareRewardClaimed: boolean("share_reward_claimed").default(false), // Whether 100 CREDA share reward was given
  shareRewardClaimedAt: timestamp("share_reward_claimed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Review Share Clicks table (detailed tracking of each click on shared reviews)
export const reviewShareClicks = pgTable("review_share_clicks", {
  id: serial("id").primaryKey(),
  shareId: integer("share_id").notNull().references(() => reviewShares.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  referrer: varchar("referrer"),
  convertedUserId: varchar("converted_user_id").references(() => users.id), // User who signed up from this click
  createdAt: timestamp("created_at").defaultNow(),
});

// Companies table (for company review pages)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id").notNull().unique(), // Matches project_reviews.projectId
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(), // URL-friendly identifier
  logo: varchar("logo"),
  description: text("description"),
  website: varchar("website"),
  email: varchar("email"),
  phone: varchar("phone"),
  founded: varchar("founded"), // e.g., "2021"
  keyFeatures: text("key_features").array(), // Array of key features
  category: varchar("category"), // e.g., "Wallets", "Exchanges", "Cards"
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  // 0G Storage immutable audit fields
  ogTxHash: text("og_tx_hash"),
  ogRootHash: text("og_root_hash"),
  ogRecordedAt: timestamp("og_recorded_at"),
  zgMerkleHash: text("zg_merkle_hash"),
  zgStoredAt: timestamp("zg_stored_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Admins table (links platform users to companies they can manage)
export const companyAdmins = pgTable("company_admins", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role").default("admin"), // "owner", "admin", "manager", "viewer"
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  companyUserUnique: unique().on(table.companyId, table.userId)
}));

// Company Users table (login credentials for company page owners)
export const companyUsers = pgTable("company_users", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(), // Hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").default("admin"), // "admin", "manager", "viewer"
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CREDA Activities table (to track CREDA-earning activities for detailed analytics)
// Also serves as the audit table for 0G Storage immutable on-chain records
export const credaActivities = pgTable("creda_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityType: varchar("activity_type").notNull(), // 'issue_created', 'comment_made', 'vote_cast', etc.
  credaAwarded: integer("creda_awarded").notNull(),
  targetType: varchar("target_type"), // 'issue', 'comment', 'user', etc.
  targetId: integer("target_id"), // ID of the target object
  metadata: jsonb("metadata"), // Additional data (e.g., content length, early participation)
  // 0G Storage immutable audit fields - stores on-chain proof reference
  ogTxHash: text("og_tx_hash"), // 0G Storage transaction hash for immutable proof
  ogRootHash: text("og_root_hash"), // 0G Storage Merkle root hash for verification
  ogRecordedAt: timestamp("og_recorded_at"), // Timestamp when recorded on 0G Storage
  zgMerkleHash: text("zg_merkle_hash"), // Legacy 0G merkle hash field
  zgStoredAt: timestamp("zg_stored_at"), // Legacy 0G storage timestamp
  createdAt: timestamp("created_at").defaultNow(),
});

// GRS Events table (to track all GRS score changes with reasons)
export const grsEvents = pgTable("grs_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  changeAmount: integer("change_amount").notNull(),
  reason: varchar("reason").notNull(), // 'stance_success', 'stance_target', 'voter_accountability', 'review_received', 'review_accuracy'
  relatedEntityType: varchar("related_entity_type"), // 'stance', 'review', 'vote'
  relatedEntityId: integer("related_entity_id"), // ID of the related entity
  metadata: jsonb("metadata"), // Additional context about the change
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table (comprehensive notification system)
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id), // Recipient of the notification
  type: varchar("type").notNull(), // 'comment', 'vote', 'review', 'follow', 'achievement', 'system', 'creda', 'grs', 'stance_result', 'invite_reward', 'creda_milestone'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  actionUrl: varchar("action_url"), // URL to navigate to when clicked
  // Sender information (for social notifications)
  senderId: varchar("sender_id").references(() => users.id),
  senderUsername: varchar("sender_username"),
  senderAvatar: varchar("sender_avatar"),
  // Related entity information
  relatedEntityType: varchar("related_entity_type"), // 'stance', 'comment', 'review', 'user', 'dao'
  relatedEntityId: integer("related_entity_id"), // ID of the related entity
  // Additional metadata for complex notifications
  metadata: jsonb("metadata"), // Additional data (e.g., points earned, badge info)
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Performance indexes for notification queries
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
  readIdx: index("notifications_read_idx").on(table.read),
  userIdReadIdx: index("notifications_user_id_read_idx").on(table.userId, table.read),
  createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
}));

// Notification settings table (user preferences)
export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  // Delivery methods
  emailEnabled: boolean("email_enabled").default(true),
  pushEnabled: boolean("push_enabled").default(true),
  inAppEnabled: boolean("in_app_enabled").default(true),
  // Notification types
  commentNotifications: boolean("comment_notifications").default(true),
  voteNotifications: boolean("vote_notifications").default(true),
  reviewNotifications: boolean("review_notifications").default(true),
  followNotifications: boolean("follow_notifications").default(true),
  achievementNotifications: boolean("achievement_notifications").default(true),
  systemNotifications: boolean("system_notifications").default(true),
  credaNotifications: boolean("creda_notifications").default(true),
  grsNotifications: boolean("grs_notifications").default(true),
  // Additional settings
  weeklyDigest: boolean("weekly_digest").default(true),
  soundEnabled: boolean("sound_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Tasks Progress table (for tracking daily engagement actions)
export const dailyTasksProgress = pgTable("daily_tasks_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskDate: varchar("task_date").notNull(), // YYYY-MM-DD format
  engagementActionsCompleted: integer("engagement_actions_completed").default(0), // Count of CREDA-generating actions
  isStreakEligible: boolean("is_streak_eligible").default(false), // Whether user completed ≥3 actions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.userId, table.taskDate), // one entry per user per day
]);

// Daily Tasks Config table (for global reset time and other settings)
export const dailyTasksConfig = pgTable("daily_tasks_config", {
  id: serial("id").primaryKey(),
  configKey: varchar("config_key").notNull().unique(),
  configValue: text("config_value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  governanceIssues: many(governanceIssues),
  comments: many(comments),
  votes: many(votes),
  stanceVotes: many(stanceVotes),
  daoScores: many(userDaoScores),
  daoFollows: many(userDaoFollows),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  reviewsGiven: many(reviews, { relationName: "reviewer" }),
  reviewsReceived: many(reviews, { relationName: "reviewed" }),
  reviewComments: many(reviewComments),
  credaActivities: many(credaActivities),
  grsEvents: many(grsEvents),
  notifications: many(notifications, { relationName: "recipient" }),
  sentNotifications: many(notifications, { relationName: "sender" }),
  notificationSettings: one(notificationSettings),
  dailyTasksProgress: many(dailyTasksProgress),
  // Invite system relations
  inviteCodesCreated: many(inviteCodes, { relationName: "creator" }),
  inviteCodesUsed: many(inviteCodes, { relationName: "user" }),
  inviteUsageAsInviter: many(inviteUsage, { relationName: "inviter" }),
  inviteUsageAsInvited: many(inviteUsage, { relationName: "invited" }),
  inviteRewards: many(inviteRewards),
  adminFlagsCreated: many(adminFlags, { relationName: "target" }),
  adminFlagsInvestigated: many(adminFlags, { relationName: "investigator" }),
  inviterUser: one(users, { 
    fields: [users.invitedBy], 
    references: [users.id],
    relationName: "inviter"
  }),
  invitedUsers: many(users, { relationName: "inviter" }),
}));

export const daosRelations = relations(daos, ({ one, many }) => ({
  creator: one(users, {
    fields: [daos.createdBy],
    references: [users.id],
  }),
  governanceIssues: many(governanceIssues),
  userScores: many(userDaoScores),
  userFollows: many(userDaoFollows),
}));

export const spacesRelations = relations(spaces, ({ many }) => ({
  governanceIssues: many(governanceIssues),
  reviews: many(reviews),
}));

export const governanceIssuesRelations = relations(governanceIssues, ({ one, many }) => ({
  author: one(users, {
    fields: [governanceIssues.authorId],
    references: [users.id],
  }),
  dao: one(daos, {
    fields: [governanceIssues.daoId],
    references: [daos.id],
  }),
  space: one(spaces, {
    fields: [governanceIssues.spaceId],
    references: [spaces.id],
  }),
  comments: many(comments),
  stanceVotes: many(stanceVotes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  issue: one(governanceIssues, {
    fields: [comments.issueId],
    references: [governanceIssues.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export const stanceVotesRelations = relations(stanceVotes, ({ one }) => ({
  user: one(users, {
    fields: [stanceVotes.userId],
    references: [users.id],
  }),
  stance: one(governanceIssues, {
    fields: [stanceVotes.stanceId],
    references: [governanceIssues.id],
  }),
}));

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
}));

export const userDaoScoresRelations = relations(userDaoScores, ({ one }) => ({
  user: one(users, {
    fields: [userDaoScores.userId],
    references: [users.id],
  }),
  dao: one(daos, {
    fields: [userDaoScores.daoId],
    references: [daos.id],
  }),
}));

export const userDaoFollowsRelations = relations(userDaoFollows, ({ one }) => ({
  user: one(users, {
    fields: [userDaoFollows.userId],
    references: [users.id],
  }),
  dao: one(daos, {
    fields: [userDaoFollows.daoId],
    references: [daos.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  // Relation to retrieve reviews for a specific user
  reviewedUser: one(users, {
    fields: [reviews.reviewedUserId],
    references: [users.id],
    relationName: "reviewed",
  }),
  space: one(spaces, {
    fields: [reviews.spaceId],
    references: [spaces.id],
  }),
  comments: many(reviewComments),
}));

export const reviewCommentsRelations = relations(reviewComments, ({ one }) => ({
  author: one(users, {
    fields: [reviewComments.authorId],
    references: [users.id],
  }),
  review: one(reviews, {
    fields: [reviewComments.reviewId],
    references: [reviews.id],
  }),
}));

export const credaActivitiesRelations = relations(credaActivities, ({ one }) => ({
  user: one(users, {
    fields: [credaActivities.userId],
    references: [users.id],
  }),
}));

export const grsEventsRelations = relations(grsEvents, ({ one }) => ({
  user: one(users, {
    fields: [grsEvents.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.userId],
    references: [users.id],
    relationName: "recipient",
  }),
  sender: one(users, {
    fields: [notifications.senderId],
    references: [users.id],
    relationName: "sender",
  }),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

// New invite system relations
export const inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
  creator: one(users, {
    fields: [inviteCodes.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  user: one(users, {
    fields: [inviteCodes.usedBy],
    references: [users.id],
    relationName: "user",
  }),
  usageRecords: many(inviteUsage),
}));

export const inviteUsageRelations = relations(inviteUsage, ({ one, many }) => ({
  inviteCode: one(inviteCodes, {
    fields: [inviteUsage.inviteCodeId],
    references: [inviteCodes.id],
  }),
  inviter: one(users, {
    fields: [inviteUsage.inviterId],
    references: [users.id],
    relationName: "inviter",
  }),
  invitedUser: one(users, {
    fields: [inviteUsage.invitedUserId],
    references: [users.id],
    relationName: "invited",
  }),
  rewards: many(inviteRewards),
}));

export const inviteRewardsRelations = relations(inviteRewards, ({ one }) => ({
  user: one(users, {
    fields: [inviteRewards.userId],
    references: [users.id],
  }),
  inviteUsage: one(inviteUsage, {
    fields: [inviteRewards.inviteUsageId],
    references: [inviteUsage.id],
  }),
}));

export const adminFlagsRelations = relations(adminFlags, ({ one }) => ({
  targetUser: one(users, {
    fields: [adminFlags.targetUserId],
    references: [users.id],
    relationName: "target",
  }),
  investigator: one(users, {
    fields: [adminFlags.investigatedBy],
    references: [users.id],
    relationName: "investigator",
  }),
  targetInviteCode: one(inviteCodes, {
    fields: [adminFlags.targetInviteCodeId],
    references: [inviteCodes.id],
  }),
}));

export const dailyTasksProgressRelations = relations(dailyTasksProgress, ({ one }) => ({
  user: one(users, {
    fields: [dailyTasksProgress.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertDaoSchema = createInsertSchema(daos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpaceSchema = createInsertSchema(spaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGovernanceIssueSchema = createInsertSchema(governanceIssues).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  commentCount: true,
  activityScore: true,
  lastActivityAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  upvotes: true,
  downvotes: true,
  isEarlyParticipant: true, // This will be calculated in storage layer
}).extend({
  stance: z.string().nullable().optional(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertStanceVoteSchema = createInsertSchema(stanceVotes).omit({
  id: true,
  createdAt: true,
});

export const insertCommentVoteSchema = createInsertSchema(commentVotes).omit({
  id: true,
  createdAt: true,
});

export const insertSpaceVoteSchema = createInsertSchema(spaceVotes).omit({
  id: true,
  createdAt: true,
});

export const insertUserDaoFollowSchema = createInsertSchema(userDaoFollows).omit({
  id: true,
  createdAt: true,
});

export const insertEmailVerificationCodeSchema = createInsertSchema(emailVerificationCodes).omit({
  id: true,
  createdAt: true,
});

export const insertInviteCodeSchema = createInsertSchema(inviteCodes).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({
  id: true,
  inviteCode: true,
  totalReviews: true,
  averageRating: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  pointsAwarded: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewCommentSchema = createInsertSchema(reviewComments).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectReviewSchema = createInsertSchema(projectReviews).omit({
  id: true,
  helpful: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewReportSchema = createInsertSchema(reviewReports).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertContentReportSchema = createInsertSchema(contentReports).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertReviewShareSchema = createInsertSchema(reviewShares).omit({
  id: true,
  clicks: true,
  conversions: true,
  shareRewardClaimed: true,
  shareRewardClaimedAt: true,
  createdAt: true,
});

export const insertReviewShareClickSchema = createInsertSchema(reviewShareClicks).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanyAdminSchema = createInsertSchema(companyAdmins).omit({
  id: true,
  createdAt: true,
});

export const insertCompanyUserSchema = createInsertSchema(companyUsers).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInviteSubmissionSchema = createInsertSchema(inviteSubmissions).omit({
  id: true,
  submittedAt: true,
  approvedAt: true,
});

export const insertCredaActivitySchema = createInsertSchema(credaActivities).omit({
  id: true,
  createdAt: true,
});

export const insertGrsEventSchema = createInsertSchema(grsEvents).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDailyTasksProgressSchema = createInsertSchema(dailyTasksProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDailyTasksConfigSchema = createInsertSchema(dailyTasksConfig).omit({
  id: true,
  updatedAt: true,
});

// Type exports
export type DailyTasksProgress = typeof dailyTasksProgress.$inferSelect;
export type DailyTasksConfig = typeof dailyTasksConfig.$inferSelect;
export type InsertDailyTasksProgress = z.infer<typeof insertDailyTasksProgressSchema>;
export type InsertDailyTasksConfig = z.infer<typeof insertDailyTasksConfigSchema>;

// New invite system schemas
export const insertInviteUsageSchema = createInsertSchema(inviteUsage).omit({
  id: true,
  createdAt: true,
  rewardGivenAt: true,
});

export const insertInviteRewardSchema = createInsertSchema(inviteRewards).omit({
  id: true,
  createdAt: true,
});

export const insertAdminFlagSchema = createInsertSchema(adminFlags).omit({
  id: true,
  createdAt: true,
  investigatedAt: true,
  resolvedAt: true,
});

// Type exports for notifications
export type Notification = typeof notifications.$inferSelect;
export type SelectNotification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Dao = typeof daos.$inferSelect;
export type SelectDao = typeof daos.$inferSelect;
export type InsertDao = z.infer<typeof insertDaoSchema>;

export type Space = typeof spaces.$inferSelect;
export type SelectSpace = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof insertSpaceSchema>;

export type GovernanceIssue = typeof governanceIssues.$inferSelect;
export type SelectGovernanceIssue = typeof governanceIssues.$inferSelect;
export type InsertGovernanceIssue = z.infer<typeof insertGovernanceIssueSchema>;

export type Comment = typeof comments.$inferSelect;
export type SelectComment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Vote = typeof votes.$inferSelect;
export type SelectVote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type StanceVote = typeof stanceVotes.$inferSelect;
export type SelectStanceVote = typeof stanceVotes.$inferSelect;
export type InsertStanceVote = z.infer<typeof insertStanceVoteSchema>;

export type CommentVote = typeof commentVotes.$inferSelect;
export type SelectCommentVote = typeof commentVotes.$inferSelect;
export type InsertCommentVote = z.infer<typeof insertCommentVoteSchema>;

export type SpaceVote = typeof spaceVotes.$inferSelect;
export type SelectSpaceVote = typeof spaceVotes.$inferSelect;
export type InsertSpaceVote = z.infer<typeof insertSpaceVoteSchema>;

export type UserDaoScore = typeof userDaoScores.$inferSelect;
export type UserDaoFollow = typeof userDaoFollows.$inferSelect;
export type SelectUserDaoFollow = typeof userDaoFollows.$inferSelect;
export type InsertUserDaoFollow = z.infer<typeof insertUserDaoFollowSchema>;

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type SelectBusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;

export type Review = typeof reviews.$inferSelect;
export type SelectReview = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type ReviewComment = typeof reviewComments.$inferSelect;
export type SelectReviewComment = typeof reviewComments.$inferSelect;
export type InsertReviewComment = z.infer<typeof insertReviewCommentSchema>;

export type ProjectReview = typeof projectReviews.$inferSelect;
export type SelectProjectReview = typeof projectReviews.$inferSelect;
export type InsertProjectReview = z.infer<typeof insertProjectReviewSchema>;

export type ProjectReviewWithUser = ProjectReview & {
  user: {
    id: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    twitterHandle: string | null;
  } | null;
};

export type ReviewReport = typeof reviewReports.$inferSelect;
export type SelectReviewReport = typeof reviewReports.$inferSelect;
export type InsertReviewReport = z.infer<typeof insertReviewReportSchema>;

export type ContentReport = typeof contentReports.$inferSelect;
export type SelectContentReport = typeof contentReports.$inferSelect;
export type InsertContentReport = z.infer<typeof insertContentReportSchema>;

export type ReviewShare = typeof reviewShares.$inferSelect;
export type SelectReviewShare = typeof reviewShares.$inferSelect;
export type InsertReviewShare = z.infer<typeof insertReviewShareSchema>;

export type ReviewShareClick = typeof reviewShareClicks.$inferSelect;
export type SelectReviewShareClick = typeof reviewShareClicks.$inferSelect;
export type InsertReviewShareClick = z.infer<typeof insertReviewShareClickSchema>;

export type EmailVerificationCode = typeof emailVerificationCodes.$inferSelect;
export type InsertEmailVerificationCode = z.infer<typeof insertEmailVerificationCodeSchema>;
export type InviteCode = typeof inviteCodes.$inferSelect;
export type InsertInviteCode = z.infer<typeof insertInviteCodeSchema>;
export type InviteSubmission = typeof inviteSubmissions.$inferSelect;
export type InsertInviteSubmission = z.infer<typeof insertInviteSubmissionSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

export type CredaActivity = typeof credaActivities.$inferSelect;
export type SelectCredaActivity = typeof credaActivities.$inferSelect;
export type InsertCredaActivity = z.infer<typeof insertCredaActivitySchema>;

export type GrsEvent = typeof grsEvents.$inferSelect;
export type SelectGrsEvent = typeof grsEvents.$inferSelect;
export type InsertGrsEvent = z.infer<typeof insertGrsEventSchema>;

export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type SelectNotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;

// New invite system types
export type InviteUsage = typeof inviteUsage.$inferSelect;
export type SelectInviteUsage = typeof inviteUsage.$inferSelect;
export type InsertInviteUsage = z.infer<typeof insertInviteUsageSchema>;

export type InviteReward = typeof inviteRewards.$inferSelect;
export type SelectInviteReward = typeof inviteRewards.$inferSelect;
export type InsertInviteReward = z.infer<typeof insertInviteRewardSchema>;

export type AdminFlag = typeof adminFlags.$inferSelect;
export type SelectAdminFlag = typeof adminFlags.$inferSelect;
export type InsertAdminFlag = z.infer<typeof insertAdminFlagSchema>;

// Company types
export type Company = typeof companies.$inferSelect;
export type SelectCompany = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type CompanyAdmin = typeof companyAdmins.$inferSelect;
export type SelectCompanyAdmin = typeof companyAdmins.$inferSelect;
export type InsertCompanyAdmin = z.infer<typeof insertCompanyAdminSchema>;

export type CompanyUser = typeof companyUsers.$inferSelect;
export type SelectCompanyUser = typeof companyUsers.$inferSelect;
export type InsertCompanyUser = z.infer<typeof insertCompanyUserSchema>;

// Governance Issue with relations
export type GovernanceIssueWithAuthorAndDao = GovernanceIssue & {
  author: User;
  dao?: Dao;
  targetProject?: { id: number; name: string; logo: string | null } | null;
};

// Comment with author
export type CommentWithAuthor = Comment & {
  author: User;
};

// Invite system complex types
export type InviteCodeWithUsage = InviteCode & {
  creator?: User;
  user?: User;
  usageRecords: InviteUsage[];
};

export type InviteUsageWithDetails = InviteUsage & {
  inviteCode: InviteCode;
  inviter: User;
  invitedUser: User;
  rewards: InviteReward[];
};

export type AdminFlagWithDetails = AdminFlag & {
  targetUser?: User;
  investigator?: User;
  targetInviteCode?: InviteCode;
};

export type UserWithInviteData = User & {
  inviterUser?: User;
  invitedUsers: User[];
  inviteCodesCreated: InviteCode[];
  inviteUsageAsInviter: InviteUsage[];
  inviteRewards: InviteReward[];
};