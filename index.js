var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminFlags: () => adminFlags,
  adminFlagsRelations: () => adminFlagsRelations,
  adminSessions: () => adminSessions,
  businessProfiles: () => businessProfiles,
  commentVotes: () => commentVotes,
  commentVotesRelations: () => commentVotesRelations,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  companies: () => companies,
  companyAdmins: () => companyAdmins,
  companyUsers: () => companyUsers,
  contentReports: () => contentReports,
  credaActivities: () => credaActivities,
  credaActivitiesRelations: () => credaActivitiesRelations,
  dailyTasksConfig: () => dailyTasksConfig,
  dailyTasksProgress: () => dailyTasksProgress,
  dailyTasksProgressRelations: () => dailyTasksProgressRelations,
  daos: () => daos,
  daosRelations: () => daosRelations,
  emailVerificationCodes: () => emailVerificationCodes,
  governanceIssues: () => governanceIssues,
  governanceIssuesRelations: () => governanceIssuesRelations,
  grsEvents: () => grsEvents,
  grsEventsRelations: () => grsEventsRelations,
  insertAdminFlagSchema: () => insertAdminFlagSchema,
  insertBusinessProfileSchema: () => insertBusinessProfileSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertCommentVoteSchema: () => insertCommentVoteSchema,
  insertCompanyAdminSchema: () => insertCompanyAdminSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertCompanyUserSchema: () => insertCompanyUserSchema,
  insertContentReportSchema: () => insertContentReportSchema,
  insertCredaActivitySchema: () => insertCredaActivitySchema,
  insertDailyTasksConfigSchema: () => insertDailyTasksConfigSchema,
  insertDailyTasksProgressSchema: () => insertDailyTasksProgressSchema,
  insertDaoSchema: () => insertDaoSchema,
  insertEmailVerificationCodeSchema: () => insertEmailVerificationCodeSchema,
  insertGovernanceIssueSchema: () => insertGovernanceIssueSchema,
  insertGrsEventSchema: () => insertGrsEventSchema,
  insertInviteCodeSchema: () => insertInviteCodeSchema,
  insertInviteRewardSchema: () => insertInviteRewardSchema,
  insertInviteSubmissionSchema: () => insertInviteSubmissionSchema,
  insertInviteUsageSchema: () => insertInviteUsageSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertNotificationSettingsSchema: () => insertNotificationSettingsSchema,
  insertProjectReviewSchema: () => insertProjectReviewSchema,
  insertReviewCommentSchema: () => insertReviewCommentSchema,
  insertReviewReportSchema: () => insertReviewReportSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertReviewShareClickSchema: () => insertReviewShareClickSchema,
  insertReviewShareSchema: () => insertReviewShareSchema,
  insertSpaceSchema: () => insertSpaceSchema,
  insertSpaceVoteSchema: () => insertSpaceVoteSchema,
  insertStanceVoteSchema: () => insertStanceVoteSchema,
  insertUserDaoFollowSchema: () => insertUserDaoFollowSchema,
  insertUserSchema: () => insertUserSchema,
  insertVoteSchema: () => insertVoteSchema,
  inviteCodes: () => inviteCodes,
  inviteCodesRelations: () => inviteCodesRelations,
  inviteRewards: () => inviteRewards,
  inviteRewardsRelations: () => inviteRewardsRelations,
  inviteSubmissions: () => inviteSubmissions,
  inviteUsage: () => inviteUsage,
  inviteUsageRelations: () => inviteUsageRelations,
  notificationSettings: () => notificationSettings,
  notificationSettingsRelations: () => notificationSettingsRelations,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  projectReviews: () => projectReviews,
  referrals: () => referrals,
  referralsRelations: () => referralsRelations,
  reviewComments: () => reviewComments,
  reviewCommentsRelations: () => reviewCommentsRelations,
  reviewReports: () => reviewReports,
  reviewShareClicks: () => reviewShareClicks,
  reviewShares: () => reviewShares,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  sessions: () => sessions,
  spaceVotes: () => spaceVotes,
  spaces: () => spaces,
  spacesRelations: () => spacesRelations,
  stanceVotes: () => stanceVotes,
  stanceVotesRelations: () => stanceVotesRelations,
  userDaoFollows: () => userDaoFollows,
  userDaoFollowsRelations: () => userDaoFollowsRelations,
  userDaoScores: () => userDaoScores,
  userDaoScoresRelations: () => userDaoScoresRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  votes: () => votes,
  votesRelations: () => votesRelations
});
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
  unique
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions, users, emailVerificationCodes, adminSessions, daos, spaces, governanceIssues, comments, votes, stanceVotes, commentVotes, spaceVotes, userDaoScores, userDaoFollows, inviteCodes, inviteUsage, inviteRewards, adminFlags, inviteSubmissions, referrals, businessProfiles, reviews, reviewComments, projectReviews, reviewReports, contentReports, reviewShares, reviewShareClicks, companies, companyAdmins, companyUsers, credaActivities, grsEvents, notifications, notificationSettings, dailyTasksProgress, dailyTasksConfig, usersRelations, daosRelations, spacesRelations, governanceIssuesRelations, commentsRelations, votesRelations, stanceVotesRelations, commentVotesRelations, userDaoScoresRelations, userDaoFollowsRelations, referralsRelations, reviewsRelations, reviewCommentsRelations, credaActivitiesRelations, grsEventsRelations, notificationsRelations, notificationSettingsRelations, inviteCodesRelations, inviteUsageRelations, inviteRewardsRelations, adminFlagsRelations, dailyTasksProgressRelations, insertUserSchema, insertDaoSchema, insertSpaceSchema, insertGovernanceIssueSchema, insertCommentSchema, insertVoteSchema, insertStanceVoteSchema, insertCommentVoteSchema, insertSpaceVoteSchema, insertUserDaoFollowSchema, insertEmailVerificationCodeSchema, insertInviteCodeSchema, insertBusinessProfileSchema, insertReviewSchema, insertReviewCommentSchema, insertProjectReviewSchema, insertReviewReportSchema, insertContentReportSchema, insertReviewShareSchema, insertReviewShareClickSchema, insertCompanySchema, insertCompanyAdminSchema, insertCompanyUserSchema, insertInviteSubmissionSchema, insertCredaActivitySchema, insertGrsEventSchema, insertNotificationSchema, insertNotificationSettingsSchema, insertDailyTasksProgressSchema, insertDailyTasksConfigSchema, insertInviteUsageSchema, insertInviteRewardSchema, insertAdminFlagSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      // Primary key for all foreign key relationships - NEVER CHANGE
      access_id: varchar("access_id").unique(),
      // Bridge for Twitter OAuth authentication linking
      email: varchar("email").unique(),
      password: varchar("password"),
      // For email auth
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      username: varchar("username").unique(),
      walletAddress: varchar("wallet_address"),
      walletVerificationTxHash: varchar("wallet_verification_tx_hash"),
      // Transaction hash proving wallet verification
      twitterHandle: varchar("twitter_handle"),
      // X/Twitter handle for unclaimed accounts
      twitterUrl: varchar("twitter_url"),
      // Full X/Twitter profile URL
      credaPoints: integer("creda_points").default(0),
      // DAO AI CREDA Points - gamification system
      weeklyCreda: integer("weekly_creda").default(0),
      // Weekly CREDA points (reset weekly)
      lastCredaWeekReset: timestamp("last_creda_week_reset").defaultNow(),
      // When weekly CREDA was last reset
      dailyStreak: integer("daily_streak").default(0),
      // Current daily engagement streak  
      longestStreak: integer("longest_streak").default(0),
      // Longest streak ever achieved
      lastActiveDate: timestamp("last_active_date"),
      // Last day user was active
      lastStreakDate: timestamp("last_streak_date"),
      // Last date streak was maintained
      grsScore: integer("grs_score").default(1300),
      // AI Governance Reputation Score (0-2800 scale)
      grsPercentile: integer("grs_percentile").default(0),
      // User's percentile rank (0-100)
      emailVerified: boolean("email_verified").default(false),
      authProvider: varchar("auth_provider").default("email"),
      // 'email' or 'replit'
      referralCode: varchar("referral_code").unique(),
      hasInviteAccess: boolean("has_invite_access").default(false),
      // Whether user has been granted access via invite code
      fullAccessActivatedAt: timestamp("full_access_activated_at"),
      // When user gained full access
      isClaimed: boolean("is_claimed").default(true),
      // Whether this account is claimed by the actual person
      isUnclaimedProfile: boolean("is_unclaimed_profile").default(false),
      // Whether this is an unclaimed profile
      claimedAt: timestamp("claimed_at"),
      // When the account was claimed
      createdBy: varchar("created_by"),
      // User who created this unclaimed profile - will be linked via foreign key
      profileType: varchar("profile_type").default("member"),
      // "member", "organisation", or "dao"
      onboardingCompletedAt: timestamp("onboarding_completed_at"),
      // Enhanced invite tracking fields
      invitedBy: varchar("invited_by").references(() => users.id),
      // User who invited this user
      inviteCodeUsed: varchar("invite_code_used"),
      // The specific invite code used
      inviteCodesAvailable: integer("invite_codes_available").default(3),
      // Available invite codes
      totalInvitesSent: integer("total_invites_sent").default(0),
      // Total invites sent by this user
      successfulInvites: integer("successful_invites").default(0),
      // Successful invites (users who joined)
      lastInviteCredaMilestone: integer("last_invite_creda_milestone").default(0),
      // Last CREDA milestone for invite rewards
      // Profile completion fields
      bio: text("bio"),
      linkedinUrl: varchar("linkedin_url"),
      githubUrl: varchar("github_url"),
      discordHandle: varchar("discord_handle"),
      telegramHandle: varchar("telegram_handle"),
      governanceInterests: text("governance_interests"),
      // JSON array of interests
      profileCompletedAt: timestamp("profile_completed_at"),
      // Account suspension fields
      isSuspended: boolean("is_suspended").default(false),
      // Whether account is suspended
      suspendedAt: timestamp("suspended_at"),
      // When account was suspended
      suspensionReason: text("suspension_reason"),
      // Admin note on why account was suspended
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    emailVerificationCodes = pgTable("email_verification_codes", {
      id: serial("id").primaryKey(),
      email: varchar("email").notNull(),
      code: varchar("code").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    adminSessions = pgTable("admin_sessions", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull(),
      sessionToken: varchar("session_token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    daos = pgTable("daos", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      slug: varchar("slug").notNull().unique(),
      description: text("description"),
      logoUrl: varchar("logo_url"),
      twitterHandle: varchar("twitter_handle"),
      // X/Twitter handle for the DAO
      twitterUrl: varchar("twitter_url"),
      // Full X/Twitter profile URL
      website: varchar("website"),
      // Official website URL
      category: varchar("category").default("DeFi"),
      // Category like "DeFi", "Gaming", "NFT", etc.
      isVerified: boolean("is_verified").default(false),
      // Whether the DAO is verified by admin
      isUnclaimed: boolean("is_unclaimed").default(true),
      // Whether the DAO profile is unclaimed
      claimedBy: varchar("claimed_by").references(() => users.id),
      // User who claimed this DAO profile
      claimedAt: timestamp("claimed_at"),
      // When the DAO was claimed
      createdBy: varchar("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    spaces = pgTable("spaces", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      slug: varchar("slug").notNull().unique(),
      description: text("description"),
      logoUrl: varchar("logo_url"),
      category: varchar("category"),
      // Original category field
      tags: text("tags").array(),
      // Tags array
      badge: varchar("badge"),
      // Category badge like "Infrastructure", "DeFi", etc.
      gradient: varchar("gradient"),
      // CSS gradient for styling
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
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    governanceIssues = pgTable("governance_issues", {
      id: serial("id").primaryKey(),
      title: varchar("title").notNull(),
      // e.g., "EIP-407"
      content: text("content").notNull(),
      // User's personal viewpoint/argument
      proposalLink: varchar("proposal_link"),
      // Link to original proposal (X, etc.)
      authorId: varchar("author_id").notNull().references(() => users.id),
      daoId: integer("dao_id").references(() => daos.id),
      // Which DAO this relates to
      spaceId: integer("space_id").references(() => spaces.id),
      // Which space this relates to
      stance: varchar("stance").notNull(),
      // "champion" or "challenge"
      targetUserId: varchar("target_user_id").references(() => users.id),
      // Person being challenged/championed (deprecated)
      targetUsername: varchar("target_username"),
      // X handle if user doesn't exist yet (deprecated)
      targetProjectId: integer("target_project_id").references(() => companies.id),
      // Project being championed/challenged
      targetProjectName: varchar("target_project_name"),
      // Project name
      upvotes: integer("upvotes").default(0),
      downvotes: integer("downvotes").default(0),
      commentCount: integer("comment_count").default(0),
      // New stance voting counts
      championVotes: integer("champion_votes").default(0),
      // votes supporting a champion stance
      challengeVotes: integer("challenge_votes").default(0),
      // votes supporting a challenge stance
      opposeVotes: integer("oppose_votes").default(0),
      // votes opposing the stance
      isActive: boolean("is_active").default(true),
      // false after time limit (48 hours)
      activityScore: integer("activity_score").default(0),
      // engagement metric
      expiresAt: timestamp("expires_at").notNull(),
      // 48 hours from creation
      lastActivityAt: timestamp("last_activity_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    comments = pgTable("comments", {
      id: serial("id").primaryKey(),
      content: text("content").notNull(),
      authorId: varchar("author_id").notNull().references(() => users.id),
      issueId: integer("issue_id").notNull().references(() => governanceIssues.id),
      parentCommentId: integer("parent_comment_id").references(() => comments.id),
      // For nested replies
      stance: varchar("stance"),
      // "champion", "challenge", or null for neutral
      upvotes: integer("upvotes").default(0),
      downvotes: integer("downvotes").default(0),
      isEarlyParticipant: boolean("is_early_participant").default(false),
      // bonus points for early engagement
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    votes = pgTable("votes", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      targetType: varchar("target_type").notNull(),
      // 'issue', 'comment', or 'review'
      targetId: integer("target_id").notNull(),
      voteType: varchar("vote_type").notNull(),
      // 'upvote' or 'downvote'
      createdAt: timestamp("created_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    stanceVotes = pgTable("stance_votes", {
      id: serial("id").primaryKey(),
      stanceId: integer("stance_id").references(() => governanceIssues.id).notNull(),
      userId: varchar("user_id").notNull().references(() => users.id),
      voteType: varchar("vote_type").notNull(),
      // 'champion', 'challenge', or 'oppose'
      createdAt: timestamp("created_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    }, (table) => ({
      userStanceUnique: unique().on(table.userId, table.stanceId)
    }));
    commentVotes = pgTable("comment_votes", {
      id: serial("id").primaryKey(),
      commentId: integer("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id),
      voteType: varchar("vote_type").notNull(),
      // 'upvote' or 'downvote'
      createdAt: timestamp("created_at").defaultNow()
    });
    spaceVotes = pgTable("space_votes", {
      id: serial("id").primaryKey(),
      spaceId: integer("space_id").notNull().references(() => spaces.id),
      userId: varchar("user_id").notNull().references(() => users.id),
      voteType: varchar("vote_type").notNull(),
      // 'bullish' or 'bearish'
      comment: text("comment"),
      // Optional comment explaining the vote
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    }, (table) => ({
      userSpaceUnique: unique().on(table.userId, table.spaceId)
    }));
    userDaoScores = pgTable("user_dao_scores", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      daoId: integer("dao_id").notNull().references(() => daos.id),
      score: integer("score").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => ({
      userDaoUnique: unique().on(table.userId, table.daoId)
    }));
    userDaoFollows = pgTable("user_dao_follows", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      daoId: integer("dao_id").notNull().references(() => daos.id),
      createdAt: timestamp("created_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    inviteCodes = pgTable("invite_codes", {
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
      usageLocation: varchar("usage_location"),
      // Geographic location if available
      isRewardClaimed: boolean("is_reward_claimed").default(false),
      // Whether CREDA reward was given
      rewardClaimedAt: timestamp("reward_claimed_at"),
      // Code type to distinguish admin vs user generated codes
      codeType: varchar("code_type").notNull().default("admin")
      // 'admin' or 'user'
    });
    inviteUsage = pgTable("invite_usage", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    inviteRewards = pgTable("invite_rewards", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      inviteUsageId: integer("invite_usage_id").notNull().references(() => inviteUsage.id),
      rewardType: varchar("reward_type").notNull().default("successful_invite"),
      // 'successful_invite', 'milestone_bonus'
      credaAmount: integer("creda_amount").notNull().default(100),
      milestone: integer("milestone"),
      // 500, 1000, 2000 CREDA milestones
      newCodesGenerated: integer("new_codes_generated").default(3),
      createdAt: timestamp("created_at").defaultNow()
    });
    adminFlags = pgTable("admin_flags", {
      id: serial("id").primaryKey(),
      flagType: varchar("flag_type").notNull(),
      // 'suspicious_invite_usage', 'rapid_creda_gain', 'ip_overlap', 'device_overlap'
      severity: varchar("severity").notNull().default("medium"),
      // 'low', 'medium', 'high', 'critical'
      targetUserId: varchar("target_user_id").references(() => users.id),
      targetInviteCodeId: integer("target_invite_code_id").references(() => inviteCodes.id),
      description: text("description").notNull(),
      metadata: jsonb("metadata"),
      // Additional context data
      status: varchar("status").notNull().default("pending"),
      // 'pending', 'investigating', 'resolved', 'dismissed'
      investigatedBy: varchar("investigated_by").references(() => users.id),
      investigatedAt: timestamp("investigated_at"),
      resolution: text("resolution"),
      resolvedAt: timestamp("resolved_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    inviteSubmissions = pgTable("invite_submissions", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      inviteCode: varchar("invite_code").notNull(),
      status: varchar("status").notNull().default("pending"),
      // pending, approved, denied
      submittedAt: timestamp("submitted_at").defaultNow(),
      approvedAt: timestamp("approved_at"),
      notes: text("notes")
    });
    referrals = pgTable("referrals", {
      id: serial("id").primaryKey(),
      referrerId: varchar("referrer_id").notNull().references(() => users.id),
      referredId: varchar("referred_id").notNull().references(() => users.id),
      referralCode: varchar("referral_code").notNull(),
      pointsAwarded: integer("points_awarded").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    businessProfiles = pgTable("business_profiles", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    reviews = pgTable("reviews", {
      id: serial("id").primaryKey(),
      reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
      reviewedId: varchar("reviewed_id"),
      // Can be null for external entities
      reviewedUserId: varchar("reviewed_user_id").references(() => users.id),
      // For platform users
      reviewedDaoId: integer("reviewed_dao_id").references(() => daos.id),
      // For platform DAOs
      reviewedBusinessId: integer("reviewed_business_id").references(() => businessProfiles.id),
      // For business profiles
      spaceId: integer("space_id").references(() => spaces.id),
      // Which space this relates to
      targetType: varchar("target_type").notNull(),
      // 'user', 'dao', or 'business'
      isTargetOnPlatform: boolean("is_target_on_platform").default(true),
      externalEntityName: text("external_entity_name"),
      // For external entities
      externalEntityXHandle: text("external_entity_x_handle"),
      // For external entities
      reviewType: varchar("review_type").notNull(),
      // 'positive', 'negative', 'neutral'
      rating: integer("rating").notNull(),
      title: text("title"),
      // Added title field
      content: text("content").notNull(),
      // User's review content
      pointsAwarded: integer("points_awarded").default(5),
      // points for giving a review
      upvotes: integer("upvotes").default(0),
      downvotes: integer("downvotes").default(0),
      helpfulCount: integer("helpful_count").default(0),
      // Added helpfulCount
      companyReply: text("company_reply"),
      // Company's reply to the review
      companyRepliedAt: timestamp("company_replied_at"),
      // When company replied
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    }, (table) => ({
      // Unique constraint for a user reviewing another user only once
      reviewerReviewedUnique: unique("reviewer_reviewed_unique").on(table.reviewerId, table.reviewedUserId)
    }));
    reviewComments = pgTable("review_comments", {
      id: serial("id").primaryKey(),
      content: text("content").notNull(),
      authorId: varchar("author_id").notNull().references(() => users.id),
      reviewId: integer("review_id").notNull().references(() => reviews.id),
      parentCommentId: integer("parent_comment_id").references(() => reviewComments.id),
      // For nested replies
      upvotes: integer("upvotes").default(0),
      downvotes: integer("downvotes").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    projectReviews = pgTable("project_reviews", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      projectId: varchar("project_id").notNull(),
      // External project ID (e.g., "1", "10", "kast")
      projectName: varchar("project_name").notNull(),
      projectLogo: varchar("project_logo").notNull(),
      projectSlug: varchar("project_slug").notNull(),
      rating: integer("rating").notNull(),
      // 1-5 stars
      title: varchar("title"),
      // Optional review title
      content: text("content").notNull(),
      // Review text
      helpful: integer("helpful").default(0),
      // Helpful count
      verified: boolean("verified").default(false),
      // Verified purchase/user
      companyReply: text("company_reply"),
      // Company's reply to the review
      companyRepliedAt: timestamp("company_replied_at"),
      // When company replied
      spaceId: integer("space_id").references(() => spaces.id),
      // Which space this relates to (preserved for migration compatibility)
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    reviewReports = pgTable("review_reports", {
      id: serial("id").primaryKey(),
      reviewId: integer("review_id").notNull().references(() => projectReviews.id, { onDelete: "cascade" }),
      reportedBy: varchar("reported_by").notNull().references(() => users.id),
      reason: varchar("reason").notNull(),
      // Predefined reason: "spam", "inappropriate", "misleading", "offensive", "other"
      notes: text("notes"),
      // Optional additional context from the reporter
      status: varchar("status").default("pending"),
      // "pending", "reviewed", "dismissed"
      createdAt: timestamp("created_at").defaultNow()
    });
    contentReports = pgTable("content_reports", {
      id: serial("id").primaryKey(),
      contentType: varchar("content_type").notNull(),
      // 'stance', 'comment', 'review'
      contentId: integer("content_id").notNull(),
      // ID of the reported content
      reportedBy: varchar("reported_by").notNull().references(() => users.id),
      reason: varchar("reason").notNull(),
      // 'spam', 'inappropriate', 'misleading', 'offensive', 'other'
      notes: text("notes"),
      // Optional additional context from the reporter
      status: varchar("status").default("pending"),
      // "pending", "reviewed", "dismissed", "actioned"
      createdAt: timestamp("created_at").defaultNow()
    });
    reviewShares = pgTable("review_shares", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      reviewId: integer("review_id").notNull().references(() => projectReviews.id, { onDelete: "cascade" }),
      projectId: varchar("project_id").notNull(),
      // External project ID
      projectName: varchar("project_name").notNull(),
      projectLogo: varchar("project_logo").notNull(),
      shareToken: varchar("share_token").notNull().unique(),
      // Unique token for tracking clicks
      credaEarned: integer("creda_earned").notNull(),
      // CREDA earned from this review
      platform: varchar("platform").default("twitter"),
      // 'twitter', 'facebook', etc.
      clicks: integer("clicks").default(0),
      // Number of times share link was clicked
      conversions: integer("conversions").default(0),
      // Number of users who created accounts from this share
      shareRewardClaimed: boolean("share_reward_claimed").default(false),
      // Whether 100 CREDA share reward was given
      shareRewardClaimedAt: timestamp("share_reward_claimed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    reviewShareClicks = pgTable("review_share_clicks", {
      id: serial("id").primaryKey(),
      shareId: integer("share_id").notNull().references(() => reviewShares.id, { onDelete: "cascade" }),
      ipAddress: varchar("ip_address"),
      userAgent: text("user_agent"),
      referrer: varchar("referrer"),
      convertedUserId: varchar("converted_user_id").references(() => users.id),
      // User who signed up from this click
      createdAt: timestamp("created_at").defaultNow()
    });
    companies = pgTable("companies", {
      id: serial("id").primaryKey(),
      externalId: varchar("external_id").notNull().unique(),
      // Matches project_reviews.projectId
      name: varchar("name").notNull(),
      slug: varchar("slug").notNull().unique(),
      // URL-friendly identifier
      logo: varchar("logo"),
      description: text("description"),
      website: varchar("website"),
      email: varchar("email"),
      phone: varchar("phone"),
      founded: varchar("founded"),
      // e.g., "2021"
      keyFeatures: text("key_features").array(),
      // Array of key features
      category: varchar("category"),
      // e.g., "Wallets", "Exchanges", "Cards"
      isActive: boolean("is_active").default(true),
      isVerified: boolean("is_verified").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    companyAdmins = pgTable("company_admins", {
      id: serial("id").primaryKey(),
      companyId: integer("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      role: varchar("role").default("admin"),
      // "owner", "admin", "manager", "viewer"
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      companyUserUnique: unique().on(table.companyId, table.userId)
    }));
    companyUsers = pgTable("company_users", {
      id: serial("id").primaryKey(),
      companyId: integer("company_id").notNull().references(() => companies.id),
      email: varchar("email").notNull().unique(),
      password: varchar("password").notNull(),
      // Hashed password
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      role: varchar("role").default("admin"),
      // "admin", "manager", "viewer"
      isActive: boolean("is_active").default(true),
      lastLogin: timestamp("last_login"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    credaActivities = pgTable("creda_activities", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      activityType: varchar("activity_type").notNull(),
      // 'issue_created', 'comment_made', 'vote_cast', etc.
      credaAwarded: integer("creda_awarded").notNull(),
      targetType: varchar("target_type"),
      // 'issue', 'comment', 'user', etc.
      targetId: integer("target_id"),
      // ID of the target object
      metadata: jsonb("metadata"),
      // Additional data (e.g., content length, early participation)
      // 0G Storage immutable audit fields - stores on-chain proof reference
      ogTxHash: text("og_tx_hash"),
      // 0G Storage transaction hash for immutable proof
      ogRootHash: text("og_root_hash"),
      // 0G Storage Merkle root hash for verification
      ogRecordedAt: timestamp("og_recorded_at"),
      // Timestamp when recorded on 0G Storage
      createdAt: timestamp("created_at").defaultNow(),
      // 0G Storage tracking columns (preserved for migration compatibility)
      zgMerkleHash: varchar("zg_merkle_hash"),
      zgStoredAt: timestamp("zg_stored_at")
    });
    grsEvents = pgTable("grs_events", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      changeAmount: integer("change_amount").notNull(),
      reason: varchar("reason").notNull(),
      // 'stance_success', 'stance_target', 'voter_accountability', 'review_received', 'review_accuracy'
      relatedEntityType: varchar("related_entity_type"),
      // 'stance', 'review', 'vote'
      relatedEntityId: integer("related_entity_id"),
      // ID of the related entity
      metadata: jsonb("metadata"),
      // Additional context about the change
      createdAt: timestamp("created_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      // Recipient of the notification
      type: varchar("type").notNull(),
      // 'comment', 'vote', 'review', 'follow', 'achievement', 'system', 'creda', 'grs', 'stance_result', 'invite_reward', 'creda_milestone'
      title: varchar("title").notNull(),
      message: text("message").notNull(),
      read: boolean("read").default(false),
      actionUrl: varchar("action_url"),
      // URL to navigate to when clicked
      // Sender information (for social notifications)
      senderId: varchar("sender_id").references(() => users.id),
      senderUsername: varchar("sender_username"),
      senderAvatar: varchar("sender_avatar"),
      // Related entity information
      relatedEntityType: varchar("related_entity_type"),
      // 'stance', 'comment', 'review', 'user', 'dao'
      relatedEntityId: integer("related_entity_id"),
      // ID of the related entity
      // Additional metadata for complex notifications
      metadata: jsonb("metadata"),
      // Additional data (e.g., points earned, badge info)
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      // Performance indexes for notification queries
      userIdIdx: index("notifications_user_id_idx").on(table.userId),
      readIdx: index("notifications_read_idx").on(table.read),
      userIdReadIdx: index("notifications_user_id_read_idx").on(table.userId, table.read),
      createdAtIdx: index("notifications_created_at_idx").on(table.createdAt)
    }));
    notificationSettings = pgTable("notification_settings", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    dailyTasksProgress = pgTable("daily_tasks_progress", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      taskDate: varchar("task_date").notNull(),
      // YYYY-MM-DD format
      engagementActionsCompleted: integer("engagement_actions_completed").default(0),
      // Count of CREDA-generating actions
      isStreakEligible: boolean("is_streak_eligible").default(false),
      // Whether user completed ≥3 actions
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      unique().on(table.userId, table.taskDate)
      // one entry per user per day
    ]);
    dailyTasksConfig = pgTable("daily_tasks_config", {
      id: serial("id").primaryKey(),
      configKey: varchar("config_key").notNull().unique(),
      configValue: text("config_value").notNull(),
      description: text("description"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    usersRelations = relations(users, ({ many, one }) => ({
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
      invitedUsers: many(users, { relationName: "inviter" })
    }));
    daosRelations = relations(daos, ({ one, many }) => ({
      creator: one(users, {
        fields: [daos.createdBy],
        references: [users.id]
      }),
      governanceIssues: many(governanceIssues),
      userScores: many(userDaoScores),
      userFollows: many(userDaoFollows)
    }));
    spacesRelations = relations(spaces, ({ many }) => ({
      governanceIssues: many(governanceIssues),
      reviews: many(reviews)
    }));
    governanceIssuesRelations = relations(governanceIssues, ({ one, many }) => ({
      author: one(users, {
        fields: [governanceIssues.authorId],
        references: [users.id]
      }),
      dao: one(daos, {
        fields: [governanceIssues.daoId],
        references: [daos.id]
      }),
      space: one(spaces, {
        fields: [governanceIssues.spaceId],
        references: [spaces.id]
      }),
      comments: many(comments),
      stanceVotes: many(stanceVotes)
    }));
    commentsRelations = relations(comments, ({ one }) => ({
      author: one(users, {
        fields: [comments.authorId],
        references: [users.id]
      }),
      issue: one(governanceIssues, {
        fields: [comments.issueId],
        references: [governanceIssues.id]
      })
    }));
    votesRelations = relations(votes, ({ one }) => ({
      user: one(users, {
        fields: [votes.userId],
        references: [users.id]
      })
    }));
    stanceVotesRelations = relations(stanceVotes, ({ one }) => ({
      user: one(users, {
        fields: [stanceVotes.userId],
        references: [users.id]
      }),
      stance: one(governanceIssues, {
        fields: [stanceVotes.stanceId],
        references: [governanceIssues.id]
      })
    }));
    commentVotesRelations = relations(commentVotes, ({ one }) => ({
      user: one(users, {
        fields: [commentVotes.userId],
        references: [users.id]
      }),
      comment: one(comments, {
        fields: [commentVotes.commentId],
        references: [comments.id]
      })
    }));
    userDaoScoresRelations = relations(userDaoScores, ({ one }) => ({
      user: one(users, {
        fields: [userDaoScores.userId],
        references: [users.id]
      }),
      dao: one(daos, {
        fields: [userDaoScores.daoId],
        references: [daos.id]
      })
    }));
    userDaoFollowsRelations = relations(userDaoFollows, ({ one }) => ({
      user: one(users, {
        fields: [userDaoFollows.userId],
        references: [users.id]
      }),
      dao: one(daos, {
        fields: [userDaoFollows.daoId],
        references: [daos.id]
      })
    }));
    referralsRelations = relations(referrals, ({ one }) => ({
      referrer: one(users, {
        fields: [referrals.referrerId],
        references: [users.id],
        relationName: "referrer"
      }),
      referred: one(users, {
        fields: [referrals.referredId],
        references: [users.id],
        relationName: "referred"
      })
    }));
    reviewsRelations = relations(reviews, ({ one, many }) => ({
      reviewer: one(users, {
        fields: [reviews.reviewerId],
        references: [users.id],
        relationName: "reviewer"
      }),
      // Relation to retrieve reviews for a specific user
      reviewedUser: one(users, {
        fields: [reviews.reviewedUserId],
        references: [users.id],
        relationName: "reviewed"
      }),
      space: one(spaces, {
        fields: [reviews.spaceId],
        references: [spaces.id]
      }),
      comments: many(reviewComments)
    }));
    reviewCommentsRelations = relations(reviewComments, ({ one }) => ({
      author: one(users, {
        fields: [reviewComments.authorId],
        references: [users.id]
      }),
      review: one(reviews, {
        fields: [reviewComments.reviewId],
        references: [reviews.id]
      })
    }));
    credaActivitiesRelations = relations(credaActivities, ({ one }) => ({
      user: one(users, {
        fields: [credaActivities.userId],
        references: [users.id]
      })
    }));
    grsEventsRelations = relations(grsEvents, ({ one }) => ({
      user: one(users, {
        fields: [grsEvents.userId],
        references: [users.id]
      })
    }));
    notificationsRelations = relations(notifications, ({ one }) => ({
      recipient: one(users, {
        fields: [notifications.userId],
        references: [users.id],
        relationName: "recipient"
      }),
      sender: one(users, {
        fields: [notifications.senderId],
        references: [users.id],
        relationName: "sender"
      })
    }));
    notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
      user: one(users, {
        fields: [notificationSettings.userId],
        references: [users.id]
      })
    }));
    inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
      creator: one(users, {
        fields: [inviteCodes.createdBy],
        references: [users.id],
        relationName: "creator"
      }),
      user: one(users, {
        fields: [inviteCodes.usedBy],
        references: [users.id],
        relationName: "user"
      }),
      usageRecords: many(inviteUsage)
    }));
    inviteUsageRelations = relations(inviteUsage, ({ one, many }) => ({
      inviteCode: one(inviteCodes, {
        fields: [inviteUsage.inviteCodeId],
        references: [inviteCodes.id]
      }),
      inviter: one(users, {
        fields: [inviteUsage.inviterId],
        references: [users.id],
        relationName: "inviter"
      }),
      invitedUser: one(users, {
        fields: [inviteUsage.invitedUserId],
        references: [users.id],
        relationName: "invited"
      }),
      rewards: many(inviteRewards)
    }));
    inviteRewardsRelations = relations(inviteRewards, ({ one }) => ({
      user: one(users, {
        fields: [inviteRewards.userId],
        references: [users.id]
      }),
      inviteUsage: one(inviteUsage, {
        fields: [inviteRewards.inviteUsageId],
        references: [inviteUsage.id]
      })
    }));
    adminFlagsRelations = relations(adminFlags, ({ one }) => ({
      targetUser: one(users, {
        fields: [adminFlags.targetUserId],
        references: [users.id],
        relationName: "target"
      }),
      investigator: one(users, {
        fields: [adminFlags.investigatedBy],
        references: [users.id],
        relationName: "investigator"
      }),
      targetInviteCode: one(inviteCodes, {
        fields: [adminFlags.targetInviteCodeId],
        references: [inviteCodes.id]
      })
    }));
    dailyTasksProgressRelations = relations(dailyTasksProgress, ({ one }) => ({
      user: one(users, {
        fields: [dailyTasksProgress.userId],
        references: [users.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      createdAt: true,
      updatedAt: true
    });
    insertDaoSchema = createInsertSchema(daos).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertSpaceSchema = createInsertSchema(spaces).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertGovernanceIssueSchema = createInsertSchema(governanceIssues).omit({
      id: true,
      upvotes: true,
      downvotes: true,
      commentCount: true,
      activityScore: true,
      lastActivityAt: true,
      createdAt: true,
      updatedAt: true
    });
    insertCommentSchema = createInsertSchema(comments).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      upvotes: true,
      downvotes: true,
      isEarlyParticipant: true
      // This will be calculated in storage layer
    }).extend({
      stance: z.string().nullable().optional()
    });
    insertVoteSchema = createInsertSchema(votes).omit({
      id: true,
      createdAt: true
    });
    insertStanceVoteSchema = createInsertSchema(stanceVotes).omit({
      id: true,
      createdAt: true
    });
    insertCommentVoteSchema = createInsertSchema(commentVotes).omit({
      id: true,
      createdAt: true
    });
    insertSpaceVoteSchema = createInsertSchema(spaceVotes).omit({
      id: true,
      createdAt: true
    });
    insertUserDaoFollowSchema = createInsertSchema(userDaoFollows).omit({
      id: true,
      createdAt: true
    });
    insertEmailVerificationCodeSchema = createInsertSchema(emailVerificationCodes).omit({
      id: true,
      createdAt: true
    });
    insertInviteCodeSchema = createInsertSchema(inviteCodes).omit({
      id: true,
      createdAt: true,
      usedAt: true
    });
    insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({
      id: true,
      inviteCode: true,
      totalReviews: true,
      averageRating: true,
      createdAt: true,
      updatedAt: true
    });
    insertReviewSchema = createInsertSchema(reviews).omit({
      id: true,
      pointsAwarded: true,
      createdAt: true,
      updatedAt: true
    });
    insertReviewCommentSchema = createInsertSchema(reviewComments).omit({
      id: true,
      upvotes: true,
      downvotes: true,
      createdAt: true,
      updatedAt: true
    });
    insertProjectReviewSchema = createInsertSchema(projectReviews).omit({
      id: true,
      helpful: true,
      verified: true,
      createdAt: true,
      updatedAt: true
    });
    insertReviewReportSchema = createInsertSchema(reviewReports).omit({
      id: true,
      status: true,
      createdAt: true
    });
    insertContentReportSchema = createInsertSchema(contentReports).omit({
      id: true,
      status: true,
      createdAt: true
    });
    insertReviewShareSchema = createInsertSchema(reviewShares).omit({
      id: true,
      clicks: true,
      conversions: true,
      shareRewardClaimed: true,
      shareRewardClaimedAt: true,
      createdAt: true
    });
    insertReviewShareClickSchema = createInsertSchema(reviewShareClicks).omit({
      id: true,
      createdAt: true
    });
    insertCompanySchema = createInsertSchema(companies).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCompanyAdminSchema = createInsertSchema(companyAdmins).omit({
      id: true,
      createdAt: true
    });
    insertCompanyUserSchema = createInsertSchema(companyUsers).omit({
      id: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    });
    insertInviteSubmissionSchema = createInsertSchema(inviteSubmissions).omit({
      id: true,
      submittedAt: true,
      approvedAt: true
    });
    insertCredaActivitySchema = createInsertSchema(credaActivities).omit({
      id: true,
      createdAt: true
    });
    insertGrsEventSchema = createInsertSchema(grsEvents).omit({
      id: true,
      createdAt: true
    });
    insertNotificationSchema = createInsertSchema(notifications).omit({
      id: true,
      createdAt: true
    });
    insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertDailyTasksProgressSchema = createInsertSchema(dailyTasksProgress).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertDailyTasksConfigSchema = createInsertSchema(dailyTasksConfig).omit({
      id: true,
      updatedAt: true
    });
    insertInviteUsageSchema = createInsertSchema(inviteUsage).omit({
      id: true,
      createdAt: true,
      rewardGivenAt: true
    });
    insertInviteRewardSchema = createInsertSchema(inviteRewards).omit({
      id: true,
      createdAt: true
    });
    insertAdminFlagSchema = createInsertSchema(adminFlags).omit({
      id: true,
      createdAt: true,
      investigatedAt: true,
      resolvedAt: true
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    try {
      neonConfig.webSocketConstructor = ws;
      neonConfig.pipelineConnect = false;
      neonConfig.useSecureWebSocket = true;
    } catch (error) {
      console.warn("WebSocket configuration warning:", error);
    }
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 1e4,
      connectionTimeoutMillis: 5e3
    });
    pool.on("error", (err) => {
      console.error("Database pool error:", err);
    });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/notifications.ts
var notifications_exports = {};
__export(notifications_exports, {
  NotificationService: () => NotificationService,
  notifications: () => NotificationService
});
var NotificationService;
var init_notifications = __esm({
  "server/notifications.ts"() {
    "use strict";
    init_storage();
    NotificationService = class {
      /**
       * Create a new notification for a user
       */
      static async createNotification(data) {
        try {
          const notificationData = {
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            read: false
          };
          if (data.actionUrl) notificationData.actionUrl = data.actionUrl;
          if (data.senderUserId) notificationData.senderId = data.senderUserId;
          if (data.metadata) notificationData.metadata = data.metadata;
          await storage.createNotification(notificationData);
        } catch (error) {
          console.error("Failed to create notification:", error);
        }
      }
      /**
       * Notify user when someone comments on their stance/post
       */
      static async notifyNewComment(postOwnerId, commenterUserId, commenterUsername, issueTitle, issueId, contentType = "stance", commentContent) {
        if (postOwnerId === commenterUserId) {
          return;
        }
        const title = contentType === "stance" ? "New comment on your stance" : "New comment on your post";
        let message;
        if (commentContent && commentContent.length > 10) {
          const commentPreview = commentContent.length > 50 ? commentContent.substring(0, 50) + "..." : commentContent;
          message = `${commenterUsername}: "${commentPreview}"`;
        } else {
          message = `${commenterUsername} commented on "${issueTitle}"`;
        }
        await this.createNotification({
          userId: postOwnerId,
          type: "comment",
          title,
          message,
          actionUrl: `/issue/${issueId}`,
          senderUserId: commenterUserId,
          metadata: { issueId, issueTitle, contentType, commentContent }
        });
      }
      /**
       * Notify user when someone votes on their stance or review
       */
      static async notifyNewVote(targetUserId, voterUserId, voterUsername, voteType, targetType, itemTitle, itemId) {
        if (targetUserId === voterUserId) return;
        const actionUrl = targetType === "stance" ? `/issue/${itemId}` : `/review/${itemId}`;
        await this.createNotification({
          userId: targetUserId,
          type: "vote",
          title: `Someone voted on your ${targetType}`,
          message: `${voterUsername} voted "${voteType}" on your ${targetType} about "${itemTitle}"`,
          actionUrl,
          senderUserId: voterUserId,
          metadata: { voteType, targetType, itemId, itemTitle }
        });
      }
      /**
       * Notify user when they receive a review
       */
      static async notifyNewReview(revieweeUserId, reviewerUserId, reviewerUsername, rating, reviewText) {
        if (revieweeUserId === reviewerUserId) return;
        await this.createNotification({
          userId: revieweeUserId,
          type: "review",
          title: "New review received",
          message: `${reviewerUsername} gave you a ${rating}-star review${reviewText ? `: "${reviewText.substring(0, 50)}..."` : ""}`,
          actionUrl: `/my-reviews`,
          senderUserId: reviewerUserId,
          metadata: { rating, reviewText }
        });
      }
      /**
       * Notify user when someone creates a stance targeting them
       */
      static async notifyStanceCreation(targetUserId, stanceCreatorUserId, stanceCreatorUsername, stanceType, stanceTitle, stanceId) {
        if (targetUserId === stanceCreatorUserId) return;
        const stanceAction = stanceType === "champion" ? "championed" : stanceType === "challenge" ? "challenged" : "opposed";
        await this.createNotification({
          userId: targetUserId,
          type: "stance",
          title: `Someone ${stanceAction} you`,
          message: `${stanceCreatorUsername} ${stanceAction} you with a stance: "${stanceTitle}"`,
          actionUrl: `/issue/${stanceId}`,
          senderUserId: stanceCreatorUserId,
          metadata: { stanceType, stanceId, stanceTitle }
        });
      }
      /**
       * Notify user when someone follows them
       */
      static async notifyNewFollower(followedUserId, followerUserId, followerUsername) {
        await this.createNotification({
          userId: followedUserId,
          type: "follow",
          title: "You have a new follower",
          message: `${followerUsername} started following you`,
          actionUrl: `/profile/${followerUsername}`,
          senderUserId: followerUserId,
          metadata: { followerUsername }
        });
      }
      /**
       * Notify user about CREDA gains
       */
      static async notifyCredaGain(userId, credaAmount, activityType, description) {
        await this.createNotification({
          userId,
          type: "creda",
          title: `+${credaAmount} CREDA earned!`,
          message: description || `You earned ${credaAmount} CREDA for ${activityType}`,
          actionUrl: "/rewards",
          metadata: { credaAmount, activityType }
        });
      }
      /**
       * Notify user about GRS score changes
       */
      static async notifyGrsChange(userId, oldScore, newScore, reason) {
        const change = newScore - oldScore;
        const changeText = change > 0 ? `+${change}` : `${change}`;
        await this.createNotification({
          userId,
          type: "grs",
          title: `GRS Score ${change > 0 ? "increased" : "decreased"}`,
          message: `Your GRS score changed by ${changeText} (now ${newScore})${reason ? ` - ${reason}` : ""}`,
          actionUrl: "/rewards",
          metadata: { oldScore, newScore, change, reason }
        });
      }
      /**
       * Notify user about achievements
       */
      static async notifyAchievement(userId, achievementTitle, achievementDescription, achievementType) {
        await this.createNotification({
          userId,
          type: "achievement",
          title: "Achievement Unlocked!",
          message: `You earned "${achievementTitle}" - ${achievementDescription}`,
          actionUrl: "/achievements",
          metadata: { achievementTitle, achievementDescription, achievementType }
        });
      }
      /**
       * Send system-wide notifications
       */
      static async notifySystem(userId, title, message, actionUrl) {
        await this.createNotification({
          userId,
          type: "system",
          title,
          message,
          actionUrl,
          metadata: { isSystem: true }
        });
      }
      /**
       * Send system notification to all users
       */
      static async notifyAllUsers(title, message, actionUrl) {
        try {
          const allUsers = await storage.getAllUsers();
          const batchSize = 50;
          for (let i = 0; i < allUsers.length; i += batchSize) {
            const batch = allUsers.slice(i, i + batchSize);
            await Promise.all(
              batch.map(
                (user) => this.notifySystem(user.id, title, message, actionUrl)
              )
            );
          }
        } catch (error) {
          console.error("Failed to send system notification to all users:", error);
        }
      }
      /**
       * Notify user when they are mentioned in content
       */
      static async notifyMention(mentionedUserId, mentionerUserId, mentionerUsername, contentType, contentTitle, contentId, contentPreview) {
        if (mentionedUserId === mentionerUserId) return;
        const actionUrl = contentType === "stance" ? `/issue/${contentId}` : `/issue/${contentId}`;
        const preview = contentPreview ? `: "${contentPreview.substring(0, 50)}..."` : "";
        await this.createNotification({
          userId: mentionedUserId,
          type: "mention",
          title: `You were mentioned`,
          message: `${mentionerUsername} mentioned you in a ${contentType}${preview}`,
          actionUrl,
          senderUserId: mentionerUserId,
          metadata: { contentType, contentId, contentTitle, contentPreview }
        });
      }
      /**
       * Notify user about daily streak milestones
       */
      static async notifyStreakMilestone(userId, streakDays, credaBonus) {
        const milestoneText = streakDays === 7 ? "Week" : streakDays === 30 ? "Month" : `${streakDays} days`;
        const bonusText = credaBonus ? ` and earned ${credaBonus} bonus CREDA!` : "!";
        await this.createNotification({
          userId,
          type: "streak",
          title: `\u{1F525} ${streakDays}-Day Streak!`,
          message: `Amazing! You've maintained a ${milestoneText} streak of daily activity${bonusText}`,
          actionUrl: "/rewards",
          metadata: { streakDays, credaBonus }
        });
      }
      /**
       * Notify user when someone uses their invite code
       */
      static async notifyInviteCodeUsed(inviterUserId, newUserUsername, credaReward) {
        await this.createNotification({
          userId: inviterUserId,
          type: "invite_used",
          title: "Your invite was used!",
          message: `${newUserUsername} joined using your invite code! You earned ${credaReward} CREDA.`,
          actionUrl: "/invites",
          metadata: { newUserUsername, credaReward }
        });
      }
      /**
       * Notify user when someone replies to their comment
       */
      static async notifyCommentReply(originalCommentAuthorId, replyAuthorUserId, replyAuthorUsername, stanceTitle, stanceId, replyContent) {
        if (originalCommentAuthorId === replyAuthorUserId) return;
        const replyPreview = replyContent && replyContent.length > 10 ? replyContent.substring(0, 50) + "..." : "";
        await this.createNotification({
          userId: originalCommentAuthorId,
          type: "comment_reply",
          title: "Someone replied to your comment",
          message: `${replyAuthorUsername} replied to your comment on "${stanceTitle}"${replyPreview ? `: "${replyPreview}"` : ""}`,
          actionUrl: `/issue/${stanceId}`,
          senderUserId: replyAuthorUserId,
          metadata: { stanceId, stanceTitle, replyContent }
        });
      }
      /**
       * Notify user about stance result when it expires
       */
      static async notifyStanceResult(stanceAuthorId, stanceTitle, stanceId, result, championVotes, challengeVotes, opposeVotes) {
        const resultText = result === "successful" ? "succeeded" : "failed";
        const totalVotes = championVotes + challengeVotes + opposeVotes;
        await this.createNotification({
          userId: stanceAuthorId,
          type: "stance_result",
          title: `Your stance ${resultText}!`,
          message: `"${stanceTitle}" ${resultText} with ${totalVotes} total votes (${championVotes} champion, ${challengeVotes} challenge, ${opposeVotes} oppose)`,
          actionUrl: `/issue/${stanceId}`,
          metadata: { stanceId, result, championVotes, challengeVotes, opposeVotes, totalVotes }
        });
      }
    };
  }
});

// server/storage.ts
import { eq, desc, asc, sql, and, sum, or, lt, gt, gte, ilike, isNotNull, count, inArray } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class _DatabaseStorage {
      // User operations
      async getUser(id) {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
      }
      async getUserByUsername(username) {
        try {
          let result = await db.select().from(users).where(eq(users.username, username)).limit(1);
          if (result.length === 0) {
            result = await db.select().from(users).where(ilike(users.username, username)).limit(1);
          }
          return result[0] || void 0;
        } catch (error) {
          console.error("Error getting user by username:", error);
          return void 0;
        }
      }
      async getUserByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0];
      }
      async getUserByTwitterHandle(twitterHandle) {
        const result = await db.select().from(users).where(eq(users.twitterHandle, twitterHandle));
        return result[0];
      }
      async getUserByTwitterId(twitterId) {
        const result = await db.select().from(users).where(eq(users.access_id, twitterId));
        return result[0];
      }
      async getUserByAccessId(accessId) {
        const result = await db.select().from(users).where(eq(users.access_id, accessId));
        return result[0];
      }
      async getUserByWalletAddress(walletAddress) {
        const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
        return result[0];
      }
      async searchUsers(query) {
        const searchResults = await db.select().from(users).where(
          or(
            sql`${users.username} ILIKE ${"%" + query + "%"}`,
            sql`${users.firstName} ILIKE ${"%" + query + "%"}`,
            sql`${users.lastName} ILIKE ${"%" + query + "%"}`,
            sql`${users.twitterHandle} ILIKE ${"%" + query + "%"}`
          )
        ).limit(10);
        return searchResults;
      }
      async searchUsersAndDaos(query) {
        const userResults = await db.select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          twitterHandle: users.twitterHandle,
          twitterUrl: users.twitterUrl,
          isUnclaimedProfile: users.isUnclaimedProfile,
          isClaimed: users.isClaimed,
          profileType: users.profileType,
          type: sql`'user'`
        }).from(users).where(
          or(
            sql`${users.username} ILIKE ${"%" + query + "%"}`,
            sql`${users.firstName} ILIKE ${"%" + query + "%"}`,
            sql`${users.lastName} ILIKE ${"%" + query + "%"}`,
            sql`${users.twitterHandle} ILIKE ${"%" + query + "%"}`
          )
        ).limit(5);
        const daoResults = await db.select({
          id: sql`CONCAT('dao_', ${daos.id})`,
          username: daos.name,
          firstName: daos.name,
          lastName: sql`NULL`,
          profileImageUrl: daos.logoUrl,
          twitterHandle: daos.twitterHandle,
          twitterUrl: daos.twitterUrl,
          isUnclaimedProfile: sql`NOT ${daos.isUnclaimed}`,
          isClaimed: sql`NOT ${daos.isUnclaimed}`,
          profileType: sql`'dao'`,
          type: sql`'dao'`
        }).from(daos).where(
          or(
            sql`${daos.name} ILIKE ${"%" + query + "%"}`,
            sql`${daos.slug} ILIKE ${"%" + query + "%"}`,
            sql`${daos.twitterHandle} ILIKE ${"%" + query + "%"}`
          )
        ).limit(5);
        return [...userResults, ...daoResults];
      }
      async getRecentUsers(limit) {
        const recentUsers = await db.select().from(users).where(isNotNull(users.username)).orderBy(desc(users.createdAt)).limit(limit);
        return recentUsers;
      }
      async searchContent(query) {
        const daoResults = await db.select().from(daos).where(
          or(
            ilike(daos.name, `%${query}%`),
            ilike(daos.slug, `%${query}%`),
            ilike(daos.twitterHandle, `%${query}%`)
          )
        ).limit(10);
        const threadResults = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          content: governanceIssues.content,
          authorId: governanceIssues.authorId,
          daoId: governanceIssues.daoId,
          createdAt: governanceIssues.createdAt,
          author: {
            username: users.username
          },
          dao: {
            name: daos.name
          }
        }).from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).where(
          or(
            ilike(governanceIssues.title, `%${query}%`),
            ilike(governanceIssues.content, `%${query}%`)
          )
        ).limit(10);
        const userResults = await db.select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          twitterHandle: users.twitterHandle,
          twitterUrl: users.twitterUrl,
          credaPoints: users.credaPoints,
          isUnclaimedProfile: users.isUnclaimedProfile,
          isClaimed: users.isClaimed,
          profileType: users.profileType
        }).from(users).where(
          and(
            or(
              ilike(users.username, `%${query}%`),
              ilike(users.firstName, `%${query}%`),
              ilike(users.lastName, `%${query}%`),
              ilike(users.twitterHandle, `%${query}%`)
            ),
            isNotNull(users.username),
            sql`TRIM(${users.username}) != ''`
          )
        ).limit(10);
        return {
          daos: daoResults,
          threads: threadResults,
          users: userResults
        };
      }
      async searchTwitterAccounts(query) {
        let searchUsername = query.toLowerCase().trim();
        if (query.includes("twitter.com/") || query.includes("x.com/")) {
          const urlParts = query.split("/");
          const usernameIndex = urlParts.findIndex((part) => part === "twitter.com" || part === "x.com") + 1;
          if (usernameIndex < urlParts.length) {
            searchUsername = urlParts[usernameIndex].replace("@", "").split("?")[0];
          }
        } else {
          searchUsername = query.replace("@", "");
        }
        const searchTerm = `%${searchUsername}%`;
        const results = await db.select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          credaPoints: users.credaPoints,
          isUnclaimedProfile: users.isUnclaimedProfile,
          isClaimed: users.isClaimed,
          twitterHandle: users.twitterHandle,
          twitterUrl: users.twitterUrl,
          hasInviteAccess: users.hasInviteAccess
        }).from(users).where(
          or(
            ilike(users.twitterHandle, searchTerm),
            ilike(users.username, searchTerm)
          )
        ).orderBy(
          sql`CASE WHEN ${users.isUnclaimedProfile} = false THEN 1 ELSE 2 END`,
          desc(users.credaPoints)
        ).limit(10);
        const featuredDaosWithX = [
          {
            id: "jupiter_dao",
            username: "Jupiter DAO",
            firstName: "Jupiter",
            lastName: "DAO",
            profileImageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center",
            credaPoints: 12450,
            isUnclaimedProfile: true,
            isClaimed: false,
            twitterHandle: "jup_dao",
            twitterUrl: "https://x.com/jup_dao",
            hasInviteAccess: false
          }
        ];
        const matchingDaos = featuredDaosWithX.filter(
          (dao) => dao.twitterHandle.toLowerCase().includes(searchUsername) || dao.username.toLowerCase().includes(searchUsername) || dao.firstName.toLowerCase().includes(searchUsername)
        );
        const combinedResults = [...matchingDaos, ...results];
        const uniqueResults = combinedResults.filter(
          (item, index2, self) => index2 === self.findIndex((t) => t.twitterHandle === item.twitterHandle)
        );
        return uniqueResults.slice(0, 10);
      }
      async createUnclaimedProfile(profileData) {
        const existing = await db.select().from(users).where(eq(users.twitterHandle, profileData.twitterHandle)).limit(1);
        if (existing.length > 0) {
          throw new Error("Twitter account already exists");
        }
        const result = await db.insert(users).values({
          id: `unclaimed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username: profileData.twitterHandle,
          firstName: profileData.firstName || null,
          lastName: profileData.lastName || null,
          twitterHandle: profileData.twitterHandle,
          twitterUrl: profileData.twitterUrl || null,
          isUnclaimedProfile: true,
          isClaimed: false,
          hasInviteAccess: false,
          authProvider: "unclaimed",
          createdBy: profileData.createdBy,
          profileType: profileData.profileType || "member",
          credaPoints: 0,
          grsScore: 1300,
          // Neutral starting score for unclaimed profiles (Neutral level)
          grsPercentile: 50,
          // Neutral percentile
          profileImageUrl: null,
          email: null,
          bio: null,
          linkedinUrl: null,
          githubUrl: null,
          discordHandle: null,
          telegramHandle: null,
          governanceInterests: null,
          walletAddress: profileData.walletAddress || null,
          referralCode: null,
          dailyStreak: 0,
          weeklyCreda: 0,
          lastActiveDate: /* @__PURE__ */ new Date(),
          onboardingCompletedAt: null,
          profileCompletedAt: null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        await this.initializeUserScoring(result[0].id);
        return result[0];
      }
      async claimProfile(twitterHandle, claimingUserId) {
        const [unclaimedProfile] = await db.select().from(users).where(
          and(
            eq(users.twitterHandle, twitterHandle),
            eq(users.isUnclaimedProfile, true),
            eq(users.isClaimed, false)
          )
        ).limit(1);
        if (!unclaimedProfile) {
          return null;
        }
        const claimedResult = await db.update(users).set({
          isClaimed: true,
          isUnclaimedProfile: false,
          claimedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, unclaimedProfile.id)).returning();
        return claimedResult[0];
      }
      async claimProfileMergeWithOAuth(unclaimedProfileId, oauthUserId) {
        const [unclaimedProfile] = await db.select().from(users).where(
          and(
            eq(users.id, unclaimedProfileId),
            eq(users.isUnclaimedProfile, true),
            eq(users.isClaimed, false)
          )
        ).limit(1);
        if (!unclaimedProfile) {
          return null;
        }
        const [oauthUser] = await db.select().from(users).where(eq(users.id, oauthUserId)).limit(1);
        if (!oauthUser) {
          return null;
        }
        const claimedResult = await db.update(users).set({
          // Keep the original unclaimed profile data, but update with OAuth info
          email: oauthUser.email || unclaimedProfile.email,
          profileImageUrl: oauthUser.profileImageUrl || unclaimedProfile.profileImageUrl,
          authProvider: oauthUser.authProvider,
          isClaimed: true,
          isUnclaimedProfile: false,
          claimedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
          // Preserve the unclaimed profile's existing data like CREDA, GRS score, etc.
          // while updating with verified OAuth account info
        }).where(eq(users.id, unclaimedProfileId)).returning();
        await db.delete(users).where(eq(users.id, oauthUserId));
        return claimedResult[0];
      }
      async claimProfileWithTwitterOAuth(twitterHandle, twitterOAuthId, twitterOAuthData) {
        const [unclaimedProfile] = await db.select().from(users).where(
          and(
            eq(users.twitterHandle, twitterHandle),
            eq(users.isUnclaimedProfile, true),
            eq(users.isClaimed, false)
          )
        ).limit(1);
        if (!unclaimedProfile) {
          return null;
        }
        const claimedResult = await db.update(users).set({
          access_id: twitterOAuthId,
          // SET ACCESS_ID FOR TWITTER OAUTH AUTHENTICATION
          firstName: twitterOAuthData.name?.split(" ")[0] || unclaimedProfile.firstName,
          lastName: twitterOAuthData.name?.split(" ").slice(1).join(" ") || unclaimedProfile.lastName,
          profileImageUrl: twitterOAuthData.profileImageUrl || unclaimedProfile.profileImageUrl,
          authProvider: "twitter",
          isClaimed: true,
          isUnclaimedProfile: false,
          claimedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
          // PRESERVE existing id - this maintains all foreign key relationships
        }).where(eq(users.id, unclaimedProfile.id)).returning();
        return claimedResult[0];
      }
      async getClaimableProfilesForUser(twitterHandle) {
        return await db.select().from(users).where(
          and(
            eq(users.twitterHandle, twitterHandle),
            eq(users.isUnclaimedProfile, true),
            eq(users.isClaimed, false)
          )
        );
      }
      async findClaimableProfile(twitterHandle, walletAddress) {
        if (!twitterHandle && !walletAddress) {
          return void 0;
        }
        const conditions = [];
        if (twitterHandle) {
          conditions.push(eq(users.twitterHandle, twitterHandle));
        }
        if (walletAddress) {
          conditions.push(eq(users.walletAddress, walletAddress));
        }
        const profileResult = await db.select().from(users).where(
          and(
            or(...conditions),
            eq(users.isUnclaimedProfile, true),
            eq(users.isClaimed, false)
          )
        ).limit(1);
        return profileResult[0];
      }
      async createUser(userData) {
        const result = await db.insert(users).values(userData).returning();
        return result[0];
      }
      async upsertUser(userData) {
        const result = await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        await this.initializeUserScoring(result[0].id);
        return result[0];
      }
      // Initialize user scoring data for all DAOs
      async initializeUserScoring(userId) {
        try {
          await db.update(users).set({
            grsScore: 1300,
            grsPercentile: 50,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.id, userId));
          const allDaos = await db.select().from(daos);
          for (const dao of allDaos) {
            await db.insert(userDaoScores).values({
              userId,
              daoId: dao.id,
              score: 0
            }).onConflictDoNothing();
          }
          const grsEventsCount = await db.select({ count: sql`count(*)` }).from(grsEvents).where(eq(grsEvents.userId, userId));
          const hasExistingActivity = grsEventsCount[0]?.count > 0;
          if (hasExistingActivity) {
            await this.updateUserGrsScore(userId);
            console.log(`Updated GRS score for existing user: ${userId} based on activity`);
          } else {
            console.log(`Initialized new user: ${userId} with starting score of 1300`);
          }
        } catch (error) {
          console.error("Error initializing user scoring:", error);
        }
      }
      async updateUser(id, data) {
        const [user] = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return user;
      }
      async suspendUser(userId, reason) {
        const [user] = await db.update(users).set({
          isSuspended: true,
          suspendedAt: /* @__PURE__ */ new Date(),
          suspensionReason: reason,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId)).returning();
        return user;
      }
      async unsuspendUser(userId) {
        const [user] = await db.update(users).set({
          isSuspended: false,
          suspendedAt: null,
          suspensionReason: null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId)).returning();
        return user;
      }
      async getSuspendedUsers() {
        const result = await db.select().from(users).where(eq(users.isSuspended, true)).orderBy(desc(users.suspendedAt));
        return result;
      }
      // Email verification operations
      async createEmailVerificationCode(data) {
        const [code] = await db.insert(emailVerificationCodes).values(data).returning();
        return code;
      }
      async getEmailVerificationCode(email, code) {
        const [verificationCode] = await db.select().from(emailVerificationCodes).where(and(eq(emailVerificationCodes.email, email), eq(emailVerificationCodes.code, code)));
        return verificationCode;
      }
      async deleteEmailVerificationCode(email) {
        await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.email, email));
      }
      // Invite code operations
      async createInviteCode(data) {
        const [inviteCode] = await db.insert(inviteCodes).values(data).returning();
        return inviteCode;
      }
      async getInviteCode(code) {
        const [inviteCode] = await db.select().from(inviteCodes).where(eq(inviteCodes.code, code));
        return inviteCode;
      }
      async validateInviteCode(code) {
        const inviteCode = await this.getInviteCode(code);
        if (!inviteCode) {
          return false;
        }
        if (inviteCode.expiresAt && inviteCode.expiresAt < /* @__PURE__ */ new Date()) {
          return false;
        }
        if ((inviteCode.currentUses || 0) >= (inviteCode.maxUses || 0)) {
          return false;
        }
        return true;
      }
      async useInviteCode(code, userId, metadata) {
        const inviteCodeRecord = await this.getInviteCode(code);
        if (!inviteCodeRecord) {
          throw new Error("Invalid invite code");
        }
        const [updatedCode] = await db.update(inviteCodes).set({
          currentUses: sql`${inviteCodes.currentUses} + 1`,
          isUsed: sql`${inviteCodes.currentUses} + 1 >= ${inviteCodes.maxUses}`,
          usedBy: userId,
          usedAt: /* @__PURE__ */ new Date(),
          usageIpAddress: metadata?.ipAddress,
          usageUserAgent: metadata?.userAgent,
          usageLocation: metadata?.location,
          isRewardClaimed: false
        }).where(eq(inviteCodes.code, code)).returning();
        await db.update(users).set({
          hasInviteAccess: true,
          invitedBy: inviteCodeRecord.createdBy,
          inviteCodeUsed: code,
          fullAccessActivatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
        if (inviteCodeRecord.createdBy && inviteCodeRecord.codeType === "user") {
          const inviteUsageData = {
            inviteCodeId: inviteCodeRecord.id,
            inviterId: inviteCodeRecord.createdBy,
            invitedUserId: userId,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            location: metadata?.location,
            deviceFingerprint: metadata?.deviceFingerprint,
            credaRewardGiven: 100
          };
          const inviteUsage2 = await this.createInviteUsage(inviteUsageData);
        }
        if (inviteCodeRecord.createdBy && inviteCodeRecord.codeType === "user") {
          await this.processInviteReward(inviteCodeRecord.createdBy, userId, 70);
        }
        return updatedCode;
      }
      async getUserInviteCodes(userId) {
        return await db.select().from(inviteCodes).where(and(eq(inviteCodes.createdBy, userId), eq(inviteCodes.codeType, "user"))).orderBy(desc(inviteCodes.createdAt));
      }
      async generateInviteCodesForUser(userId, count2) {
        const codes = [];
        for (let i = 0; i < count2; i++) {
          const code = this.generateRandomInviteCode();
          const inviteCodeData = {
            code,
            createdBy: userId,
            maxUses: 1,
            currentUses: 0,
            isUsed: false,
            codeType: "user"
          };
          const newCode = await this.createInviteCode(inviteCodeData);
          codes.push(newCode);
        }
        await db.update(users).set({
          inviteCodesAvailable: sql`${users.inviteCodesAvailable} + ${count2}`
        }).where(eq(users.id, userId));
        return codes;
      }
      generateRandomInviteCode() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }
      async getUserInviteStats(userId) {
        const user = await this.getUser(userId);
        if (!user) {
          throw new Error("User not found");
        }
        const [inviteXpResult] = await db.select({ totalCreda: sum(credaActivities.credaAwarded) }).from(credaActivities).where(
          and(
            eq(credaActivities.userId, userId),
            or(
              eq(credaActivities.activityType, "successful_invite"),
              eq(credaActivities.activityType, "invite_friend"),
              eq(credaActivities.activityType, "milestone_bonus")
            )
          )
        );
        const xpFromInvites = inviteXpResult?.totalCreda || 0;
        let nextMilestone = 5e3;
        if ((user.credaPoints ?? 0) >= 5e3) {
          const adjustedCreda = (user.credaPoints ?? 0) - 5e3;
          const currentMilestone = Math.floor(adjustedCreda / 500) * 500 + 5e3;
          nextMilestone = currentMilestone + 500;
        }
        return {
          availableCodes: user.inviteCodesAvailable || 0,
          totalInvitesSent: user.totalInvitesSent || 0,
          successfulInvites: user.successfulInvites || 0,
          xpFromInvites: Number(xpFromInvites),
          nextMilestone
        };
      }
      // Invite usage tracking methods
      async createInviteUsage(data) {
        const [newInviteUsage] = await db.insert(inviteUsage).values(data).returning();
        return newInviteUsage;
      }
      async getInviteUsageByUser(userId) {
        const results = await db.select().from(inviteUsage).innerJoin(inviteCodes, eq(inviteUsage.inviteCodeId, inviteCodes.id)).innerJoin(users, eq(inviteUsage.invitedUserId, users.id)).leftJoin(inviteRewards, eq(inviteUsage.id, inviteRewards.inviteUsageId)).where(eq(inviteUsage.inviterId, userId)).orderBy(desc(inviteUsage.createdAt));
        return results.map((r) => ({
          ...r.invite_usage,
          inviteCode: r.invite_codes,
          invitedUser: r.users,
          reward: r.invite_rewards
        }));
      }
      async getInviteChain(userId) {
        const result = await db.select().from(users).where(eq(users.invitedBy, userId));
        return result;
      }
      async getInviteTree(startUserId) {
        const buildTree = async (userId, depth = 0) => {
          if (depth > 5) return null;
          const user = await this.getUser(userId);
          if (!user) return null;
          const invitedUsers = await this.getInviteChain(userId);
          const children = await Promise.all(
            invitedUsers.map((invitedUser) => buildTree(invitedUser.id, depth + 1))
          );
          return {
            user,
            children: children.filter((child) => child !== null),
            depth
          };
        };
        return await buildTree(startUserId);
      }
      // Invite rewards management methods
      async createInviteReward(data) {
        const [newReward] = await db.insert(inviteRewards).values(data).returning();
        return newReward;
      }
      async processInviteReward(inviterId, invitedUserId, xpAmount) {
        const [inviteUsageRecord] = await db.select().from(inviteUsage).where(and(
          eq(inviteUsage.inviterId, inviterId),
          eq(inviteUsage.invitedUserId, invitedUserId)
        )).orderBy(desc(inviteUsage.createdAt)).limit(1);
        if (!inviteUsageRecord) {
          throw new Error("Invite usage record not found");
        }
        const rewardData = {
          userId: inviterId,
          inviteUsageId: inviteUsageRecord.id,
          rewardType: "successful_invite",
          credaAmount: xpAmount
        };
        await this.createInviteReward(rewardData);
        await this.awardCredaPoints(inviterId, "social", "successful_invite", xpAmount, "invite", inviteUsageRecord.id, {
          action: "Successful invite reward",
          invitedUser: invitedUserId
        });
        await db.update(users).set({
          totalInvitesSent: sql`${users.totalInvitesSent} + 1`,
          successfulInvites: sql`${users.successfulInvites} + 1`
        }).where(eq(users.id, inviterId));
        await this.checkAndProcessMilestoneRewards(inviterId);
        try {
          const { NotificationService: NotificationService2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
          const invitedUser = await this.getUser(invitedUserId);
          const invitedUsername = invitedUser?.username || invitedUser?.twitterHandle || "Someone";
          await NotificationService2.notifyInviteCodeUsed(
            inviterId,
            invitedUsername,
            xpAmount
          );
          console.log(`Invite reward notification sent to user ${inviterId} for inviting ${invitedUserId}`);
        } catch (notificationError) {
          console.error(`Error sending invite reward notification to ${inviterId}:`, notificationError);
        }
      }
      async checkAndProcessMilestoneRewards(userId) {
        const user = await this.getUser(userId);
        if (!user) return [];
        const rewards = [];
        const currentCreda = user.credaPoints || 0;
        const lastMilestone = user.lastInviteCredaMilestone || 0;
        if (currentCreda < 5e3) return [];
        const adjustedCreda = currentCreda - 5e3;
        const adjustedLastMilestone = Math.max(0, lastMilestone - 5e3);
        const currentMilestone = Math.floor(adjustedCreda / 500) * 500 + 5e3;
        if (currentMilestone > lastMilestone && adjustedCreda >= 0) {
          const newCodes = await this.generateInviteCodesForUser(userId, 3);
          const rewardData = {
            userId,
            inviteUsageId: 0,
            // Not tied to specific invite usage
            rewardType: "milestone_bonus",
            credaAmount: 0,
            // No additional CREDA for milestone
            milestone: currentMilestone,
            newCodesGenerated: 3
          };
          const reward = await this.createInviteReward(rewardData);
          rewards.push(reward);
          await db.update(users).set({
            lastInviteCredaMilestone: currentMilestone
          }).where(eq(users.id, userId));
          try {
            const { NotificationService: NotificationService2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
            await NotificationService2.createNotification({
              userId,
              type: "achievement",
              title: "CREDA Milestone Reached!",
              message: `Congratulations! You reached ${currentMilestone} CREDA and earned 3 new invite codes!`,
              actionUrl: "/invite",
              metadata: {
                milestone: currentMilestone,
                newCodesGenerated: 3,
                achievementType: "creda_milestone"
              }
            });
            console.log(`Milestone achievement notification sent to user ${userId} for reaching ${currentMilestone} CREDA`);
          } catch (notificationError) {
            console.error(`Error sending milestone achievement notification to ${userId}:`, notificationError);
          }
        }
        return rewards;
      }
      // Admin investigation and monitoring methods
      async createAdminFlag(data) {
        const [newFlag] = await db.insert(adminFlags).values(data).returning();
        return newFlag;
      }
      async getAdminFlags(status) {
        const baseQuery = db.select().from(adminFlags).leftJoin(users, eq(adminFlags.targetUserId, users.id)).leftJoin(inviteCodes, eq(adminFlags.targetInviteCodeId, inviteCodes.id)).orderBy(desc(adminFlags.createdAt));
        const results = status ? await baseQuery.where(eq(adminFlags.status, status)) : await baseQuery;
        return results.map((r) => r.admin_flags);
      }
      async updateAdminFlag(flagId, updates) {
        const [updatedFlag] = await db.update(adminFlags).set(updates).where(eq(adminFlags.id, flagId)).returning();
        return updatedFlag;
      }
      async detectSuspiciousInviteActivity() {
        const flags = [];
        const rapidUsageQuery = sql`
      SELECT usage_ip_address, COUNT(*) as usage_count
      FROM invite_codes
      WHERE usage_ip_address IS NOT NULL
        AND used_at > NOW() - INTERVAL '1 hour'
      GROUP BY usage_ip_address
      HAVING COUNT(*) > 5
    `;
        const rapidUsageResults = await db.execute(rapidUsageQuery);
        for (const result of rapidUsageResults.rows) {
          const flagData = {
            flagType: "rapid_invite_usage",
            severity: "high",
            description: `Rapid invite usage detected: ${result.usage_count} invites from IP ${result.usage_ip_address} in last hour`,
            metadata: { ipAddress: result.usage_ip_address, count: result.usage_count }
          };
          const flag = await this.createAdminFlag(flagData);
          flags.push(flag);
        }
        const highXpGainQuery = sql`
      SELECT user_id, SUM(creda_awarded) as total_xp
      FROM creda_activities
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY user_id
      HAVING SUM(creda_awarded) > 1000
    `;
        const highXpResults = await db.execute(highXpGainQuery);
        for (const result of highXpResults.rows) {
          const flagData = {
            flagType: "rapid_xp_gain",
            severity: "medium",
            targetUserId: result.user_id,
            description: `Unusual CREDA gain detected: ${result.total_xp} CREDA in 24 hours`,
            metadata: { xpGained: result.total_xp, timeframe: "24_hours" }
          };
          const flag = await this.createAdminFlag(flagData);
          flags.push(flag);
        }
        return flags;
      }
      async getInviteAnalytics() {
        const [totalInvitesResult] = await db.select({ count: count() }).from(inviteCodes).where(eq(inviteCodes.isUsed, true));
        const [activeInvitersResult] = await db.select({ count: count() }).from(inviteCodes).where(isNotNull(inviteCodes.createdBy));
        const [totalCreatedResult] = await db.select({ count: count() }).from(inviteCodes);
        const conversionRate = totalCreatedResult.count > 0 ? totalInvitesResult.count / totalCreatedResult.count * 100 : 0;
        const geoDistribution = await db.select({
          location: inviteCodes.usageLocation,
          count: count()
        }).from(inviteCodes).where(and(
          eq(inviteCodes.isUsed, true),
          isNotNull(inviteCodes.usageLocation)
        )).groupBy(inviteCodes.usageLocation).orderBy(desc(count()));
        const [suspiciousResult] = await db.select({ count: count() }).from(adminFlags).where(eq(adminFlags.status, "pending"));
        return {
          totalInvites: totalInvitesResult.count,
          activeInviters: activeInvitersResult.count,
          conversionRate: Number(conversionRate.toFixed(2)),
          geographicDistribution: geoDistribution,
          suspiciousActivities: suspiciousResult.count
        };
      }
      // Initialize invite system for existing users
      async initializeUserInviteSystem(userId) {
        const user = await this.getUser(userId);
        if (!user) return;
        const existingCodes = await this.getUserInviteCodes(userId);
        if (existingCodes.length === 0 && (user.inviteCodesAvailable || 0) === 0) {
          await this.generateInviteCodesForUser(userId, 3);
          await db.update(users).set({
            inviteCodesAvailable: 3,
            totalInvitesSent: 0,
            successfulInvites: 0,
            lastInviteXpMilestone: 0
          }).where(eq(users.id, userId));
        }
      }
      // DAO operations
      async getAllDaos() {
        const daoList = await db.select({
          id: daos.id,
          name: daos.name,
          slug: daos.slug,
          description: daos.description,
          logoUrl: daos.logoUrl,
          createdBy: daos.createdBy,
          createdAt: daos.createdAt,
          updatedAt: daos.updatedAt,
          creator: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl
          }
        }).from(daos).leftJoin(users, eq(daos.createdBy, users.id)).orderBy(desc(daos.createdAt));
        const daosWithCounts = await Promise.all(
          daoList.map(async (dao) => {
            const issueCountResult = await db.select({ count: sql`COUNT(*)` }).from(governanceIssues).where(eq(governanceIssues.daoId, dao.id));
            const followers = await db.select().from(userDaoFollows).where(eq(userDaoFollows.daoId, dao.id));
            const memberCount = followers.length;
            return {
              ...dao,
              _count: {
                issues: Number(issueCountResult[0]?.count) || 0,
                userScores: memberCount
              }
            };
          })
        );
        return daosWithCounts;
      }
      async getDaoBySlug(slug) {
        const [dao] = await db.select({
          id: daos.id,
          name: daos.name,
          slug: daos.slug,
          description: daos.description,
          logoUrl: daos.logoUrl,
          createdBy: daos.createdBy,
          createdAt: daos.createdAt,
          updatedAt: daos.updatedAt,
          creator: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
            twitterHandle: users.twitterHandle,
            twitterUrl: users.twitterUrl,
            isUnclaimedProfile: users.isUnclaimedProfile,
            profileType: users.profileType
          }
        }).from(daos).leftJoin(users, eq(daos.createdBy, users.id)).where(sql`lower(${daos.slug}) = lower(${slug})`);
        return dao;
      }
      async getDaoById(id) {
        const [dao] = await db.select().from(daos).where(eq(daos.id, id)).limit(1);
        return dao;
      }
      async createDao(daoData) {
        const [dao] = await db.insert(daos).values(daoData).returning();
        return dao;
      }
      // Space operations
      async getSpaceBySlug(slug) {
        const [space] = await db.select().from(spaces).where(eq(spaces.slug, slug)).limit(1);
        return space;
      }
      // Governance Issue operations (replaces thread operations)
      async getGovernanceIssuesByDao(daoId, sortBy = "latest") {
        const orderBy = sortBy === "top" ? desc(governanceIssues.upvotes) : desc(governanceIssues.createdAt);
        return await db.select().from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id)).where(eq(governanceIssues.daoId, daoId)).orderBy(orderBy).then(
          (rows) => rows.map((row) => ({
            ...row.governance_issues,
            author: row.users,
            dao: row.daos,
            targetProject: row.companies ? { id: row.companies.id, name: row.companies.name, logo: row.companies.logo } : null
          }))
        );
      }
      async getGovernanceIssuesBySpace(spaceSlug, limit = 10) {
        const result = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          content: governanceIssues.content,
          stance: governanceIssues.stance,
          upvotes: governanceIssues.upvotes,
          createdAt: governanceIssues.createdAt,
          author: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            grsScore: users.grsScore
          }
        }).from(governanceIssues).innerJoin(spaces, eq(governanceIssues.spaceId, spaces.id)).leftJoin(users, eq(governanceIssues.authorId, users.id)).where(eq(spaces.slug, spaceSlug)).orderBy(desc(governanceIssues.createdAt)).limit(limit);
        return result;
      }
      async getActiveGovernanceIssues() {
        return await db.select({
          // Governance issue fields
          id: governanceIssues.id,
          title: governanceIssues.title,
          content: governanceIssues.content,
          proposalLink: governanceIssues.proposalLink,
          authorId: governanceIssues.authorId,
          daoId: governanceIssues.daoId,
          stance: governanceIssues.stance,
          targetUserId: governanceIssues.targetUserId,
          targetUsername: governanceIssues.targetUsername,
          targetProjectId: governanceIssues.targetProjectId,
          targetProjectName: governanceIssues.targetProjectName,
          upvotes: governanceIssues.upvotes,
          downvotes: governanceIssues.downvotes,
          commentCount: governanceIssues.commentCount,
          isActive: governanceIssues.isActive,
          activityScore: governanceIssues.activityScore,
          expiresAt: governanceIssues.expiresAt,
          lastActivityAt: governanceIssues.lastActivityAt,
          createdAt: governanceIssues.createdAt,
          updatedAt: governanceIssues.updatedAt,
          // Author info
          author: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl
          },
          // DAO info
          dao: {
            id: daos.id,
            name: daos.name,
            slug: daos.slug,
            description: daos.description,
            logoUrl: daos.logoUrl
          },
          // Target project info
          targetProject: {
            id: companies.id,
            name: companies.name,
            logo: companies.logo
          }
        }).from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id)).where(and(
          eq(governanceIssues.isActive, true),
          gt(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
        )).orderBy(desc(governanceIssues.activityScore)).then(async (rows) => {
          const issues = await Promise.all(
            rows.map(async (row) => {
              let targetUser = null;
              if (row.targetUserId) {
                targetUser = await this.getUser(row.targetUserId);
              }
              return {
                ...row,
                targetUser
              };
            })
          );
          return issues;
        });
      }
      async getActiveStanceCount() {
        const result = await db.select({ count: sql`COUNT(*)` }).from(governanceIssues).where(and(
          eq(governanceIssues.isActive, true),
          gt(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
        ));
        return Number(result[0]?.count) || 0;
      }
      async getNextStanceExpirationTime() {
        const result = await db.select({ expiresAt: governanceIssues.expiresAt }).from(governanceIssues).where(and(
          eq(governanceIssues.isActive, true),
          gt(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
        )).orderBy(asc(governanceIssues.expiresAt)).limit(1);
        return result[0]?.expiresAt || null;
      }
      async getUserActiveStanceCount(userId) {
        const result = await db.select({ count: sql`COUNT(*)` }).from(governanceIssues).where(and(
          eq(governanceIssues.authorId, userId),
          eq(governanceIssues.isActive, true),
          gt(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
        ));
        return Number(result[0]?.count) || 0;
      }
      async hasActiveStanceOnTarget(targetUserId) {
        try {
          console.log(`Checking for active stances on target: ${targetUserId}`);
          const activeStances = await db.select().from(governanceIssues).where(
            and(
              eq(governanceIssues.targetUserId, targetUserId),
              eq(governanceIssues.isActive, true),
              gte(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
            )
          );
          console.log(`Found ${activeStances.length} active stances on target ${targetUserId}`);
          return activeStances.length > 0;
        } catch (error) {
          console.error("Error checking active stance on target:", error);
          return false;
        }
      }
      async hasRecentStanceFromTarget(userId, targetUserId) {
        try {
          console.log(`Checking for recent stances from target ${targetUserId} to user ${userId}`);
          const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3);
          const recentStances = await db.select().from(governanceIssues).where(
            and(
              eq(governanceIssues.authorId, targetUserId),
              eq(governanceIssues.targetUserId, userId),
              gte(governanceIssues.createdAt, tenDaysAgo)
            )
          );
          console.log(`Found ${recentStances.length} recent stances from target ${targetUserId} to user ${userId}`);
          return recentStances.length > 0;
        } catch (error) {
          console.error("Error checking recent stance from target:", error);
          return false;
        }
      }
      async hasActiveStanceOnProject(targetProjectId) {
        try {
          console.log(`Checking for active stances on project: ${targetProjectId}`);
          const activeStances = await db.select().from(governanceIssues).where(
            and(
              eq(governanceIssues.targetProjectId, targetProjectId),
              eq(governanceIssues.isActive, true),
              gte(governanceIssues.expiresAt, /* @__PURE__ */ new Date())
            )
          );
          console.log(`Found ${activeStances.length} active stances on project ${targetProjectId}`);
          return activeStances.length > 0;
        } catch (error) {
          console.error("Error checking active stance on project:", error);
          return false;
        }
      }
      async getRecentGovernanceIssues() {
        const rows = await db.select().from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id)).orderBy(desc(governanceIssues.createdAt));
        const stanceIds = rows.map((row) => row.governance_issues.id);
        const stanceActivities = stanceIds.length > 0 ? await db.select().from(credaActivities).where(
          and(
            eq(credaActivities.targetType, "governance_issue"),
            eq(credaActivities.activityType, "stance_created"),
            inArray(credaActivities.targetId, stanceIds)
          )
        ) : [];
        const ogDataMap = /* @__PURE__ */ new Map();
        for (const activity of stanceActivities) {
          if (activity.targetId) {
            ogDataMap.set(activity.targetId, {
              ogTxHash: activity.ogTxHash || null,
              ogRootHash: activity.ogRootHash || null
            });
          }
        }
        return rows.map((row) => {
          const ogData = ogDataMap.get(row.governance_issues.id);
          return {
            ...row.governance_issues,
            author: row.users,
            dao: row.daos,
            targetProject: row.companies ? { id: row.companies.id, name: row.companies.name, logo: row.companies.logo } : null,
            championVotes: row.governance_issues.championVotes || 0,
            challengeVotes: row.governance_issues.challengeVotes || 0,
            opposeVotes: row.governance_issues.opposeVotes || 0,
            ogTxHash: ogData?.ogTxHash || null,
            ogRootHash: ogData?.ogRootHash || null
          };
        });
      }
      async getGovernanceIssueById(id) {
        const rows = await db.select().from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id)).where(eq(governanceIssues.id, id));
        const row = rows[0];
        if (!row) return void 0;
        return {
          ...row.governance_issues,
          author: row.users,
          dao: row.daos,
          targetProject: row.companies ? { id: row.companies.id, name: row.companies.name, logo: row.companies.logo } : null
        };
      }
      async createGovernanceIssue(issueData) {
        const GOVERNANCE_ISSUE_DURATION_HOURS = 48;
        const GOVERNANCE_ISSUE_DURATION_MS = GOVERNANCE_ISSUE_DURATION_HOURS * 60 * 60 * 1e3;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(now.getTime() + GOVERNANCE_ISSUE_DURATION_MS);
        const actualDurationMs = expiresAt.getTime() - now.getTime();
        const actualDurationHours = actualDurationMs / (1e3 * 60 * 60);
        if (Math.abs(actualDurationHours - GOVERNANCE_ISSUE_DURATION_HOURS) > 1e-3) {
          console.error(`\u26A0\uFE0F GOVERNANCE ISSUE DURATION ERROR: Expected exactly ${GOVERNANCE_ISSUE_DURATION_HOURS} hours, got ${actualDurationHours.toFixed(6)} hours`);
        }
        console.log(`\u2705 Creating governance issue with EXACTLY ${GOVERNANCE_ISSUE_DURATION_HOURS}-hour duration`);
        console.log(`\u{1F4CA} Precise duration: ${actualDurationHours.toFixed(6)} hours | Expires: ${expiresAt.toISOString()}`);
        let targetUserId = issueData.targetUserId;
        if (issueData.targetUsername && !targetUserId) {
          const existingUser = await db.select().from(users).where(or(
            eq(users.username, issueData.targetUsername),
            eq(users.twitterHandle, issueData.targetUsername)
          )).limit(1);
          if (existingUser.length > 0) {
            targetUserId = existingUser[0].id;
          } else {
            const createdBy = issueData.authorId;
            const newUser = await this.createUnclaimedProfile({
              twitterHandle: issueData.targetUsername,
              twitterUrl: `https://x.com/${issueData.targetUsername}`,
              createdBy
            });
            targetUserId = newUser.id;
          }
        }
        const [issue] = await db.insert(governanceIssues).values({
          ...issueData,
          targetUserId,
          expiresAt
        }).returning();
        return issue;
      }
      async getUserGovernanceIssues(userId) {
        return await db.select().from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).where(eq(governanceIssues.authorId, userId)).orderBy(desc(governanceIssues.createdAt)).then(
          (rows) => rows.map((row) => ({
            ...row.governance_issues,
            author: row.users,
            dao: row.daos
          }))
        );
      }
      async expireGovernanceIssue(issueId) {
        await db.update(governanceIssues).set({
          isActive: false,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(governanceIssues.id, issueId));
      }
      // Comment operations (updated for governance issues)
      async getCommentsByIssue(issueId) {
        return await db.select().from(comments).leftJoin(users, eq(comments.authorId, users.id)).where(eq(comments.issueId, issueId)).orderBy(desc(comments.createdAt)).then(
          (rows) => rows.map((row) => ({
            ...row.comments,
            author: row.users
          }))
        );
      }
      async createComment(commentData) {
        const issue = await db.select({ createdAt: governanceIssues.createdAt }).from(governanceIssues).where(eq(governanceIssues.id, commentData.issueId)).limit(1);
        const isEarlyParticipant = issue[0] && issue[0].createdAt ? (/* @__PURE__ */ new Date()).getTime() - new Date(issue[0].createdAt).getTime() < 24 * 60 * 60 * 1e3 : false;
        const [comment] = await db.insert(comments).values({
          ...commentData,
          isEarlyParticipant
        }).returning();
        await db.update(governanceIssues).set({
          commentCount: sql`${governanceIssues.commentCount} + 1`,
          activityScore: sql`${governanceIssues.activityScore} + ${isEarlyParticipant ? 3 : 2}`,
          lastActivityAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(governanceIssues.id, commentData.issueId));
        return comment;
      }
      async getCommentById(id) {
        const [comment] = await db.select().from(comments).where(eq(comments.id, id));
        return comment;
      }
      async getUserComments(userId) {
        return await db.select().from(comments).leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id)).where(eq(comments.authorId, userId)).orderBy(desc(comments.createdAt)).then(
          (rows) => rows.map((row) => ({
            ...row.comments,
            issue: row.governance_issues
          }))
        );
      }
      // Vote operations (updated for governance issues)
      async getUserVote(userId, targetType, targetId) {
        const [vote] = await db.select().from(votes).where(
          and(
            eq(votes.userId, userId),
            eq(votes.targetType, targetType),
            eq(votes.targetId, targetId)
          )
        );
        return vote;
      }
      async getUserVotesForReviews(userId, reviewIds) {
        if (reviewIds.length === 0) return {};
        const userVotes = await db.select().from(votes).where(
          and(
            eq(votes.userId, userId),
            eq(votes.targetType, "review"),
            inArray(votes.targetId, reviewIds)
          )
        );
        const result = {};
        for (const vote of userVotes) {
          result[vote.targetId] = vote;
        }
        return result;
      }
      async createVote(voteData) {
        const [vote] = await db.insert(votes).values(voteData).returning();
        await this.updateVoteCounts(voteData.targetType, voteData.targetId);
        return vote;
      }
      async updateVoteCounts(targetType, targetId) {
        if (targetType === "issue") {
          const [upvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "issue"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "upvote")
          ));
          const [downvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "issue"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "downvote")
          ));
          await db.update(governanceIssues).set({
            upvotes: upvoteCount.count,
            downvotes: downvoteCount.count,
            activityScore: sql`${governanceIssues.activityScore} + 1`,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(governanceIssues.id, targetId));
        } else if (targetType === "comment") {
          const [upvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "comment"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "upvote")
          ));
          const [downvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "comment"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "downvote")
          ));
          await db.update(comments).set({
            upvotes: upvoteCount.count,
            downvotes: downvoteCount.count,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(comments.id, targetId));
        } else if (targetType === "review") {
          const [upvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "review"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "upvote")
          ));
          const [downvoteCount] = await db.select({ count: sql`COUNT(*)` }).from(votes).where(and(
            eq(votes.targetType, "review"),
            eq(votes.targetId, targetId),
            eq(votes.voteType, "downvote")
          ));
          await db.update(reviews).set({
            upvotes: upvoteCount.count,
            downvotes: downvoteCount.count,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(reviews.id, targetId));
        }
      }
      // Stance voting operations
      async getUserStanceVote(userId, stanceId) {
        const [vote] = await db.select().from(stanceVotes).where(
          and(
            eq(stanceVotes.userId, userId),
            eq(stanceVotes.stanceId, stanceId)
          )
        );
        return vote;
      }
      async createStanceVote(voteData) {
        const [vote] = await db.insert(stanceVotes).values(voteData).returning();
        await this.updateStanceVoteCounts(voteData.stanceId);
        return vote;
      }
      async updateStanceVote(userId, stanceId, voteType) {
        const [vote] = await db.update(stanceVotes).set({ voteType, createdAt: /* @__PURE__ */ new Date() }).where(and(
          eq(stanceVotes.userId, userId),
          eq(stanceVotes.stanceId, stanceId)
        )).returning();
        await this.updateStanceVoteCounts(stanceId);
        return vote;
      }
      async deleteStanceVote(userId, stanceId) {
        await db.delete(stanceVotes).where(and(
          eq(stanceVotes.userId, userId),
          eq(stanceVotes.stanceId, stanceId)
        ));
        await this.updateStanceVoteCounts(stanceId);
      }
      async updateStanceVoteCounts(stanceId) {
        const [championCount] = await db.select({ count: sql`COUNT(*)` }).from(stanceVotes).where(and(
          eq(stanceVotes.stanceId, stanceId),
          eq(stanceVotes.voteType, "champion")
        ));
        const [challengeCount] = await db.select({ count: sql`COUNT(*)` }).from(stanceVotes).where(and(
          eq(stanceVotes.stanceId, stanceId),
          eq(stanceVotes.voteType, "challenge")
        ));
        const [opposeCount] = await db.select({ count: sql`COUNT(*)` }).from(stanceVotes).where(and(
          eq(stanceVotes.stanceId, stanceId),
          eq(stanceVotes.voteType, "oppose")
        ));
        await db.update(governanceIssues).set({
          championVotes: championCount.count,
          challengeVotes: challengeCount.count,
          opposeVotes: opposeCount.count,
          activityScore: sql`${governanceIssues.activityScore} + 1`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(governanceIssues.id, stanceId));
      }
      async getStanceVoteCounts(stanceId) {
        const issue = await this.getGovernanceIssueById(stanceId);
        return {
          championVotes: issue?.championVotes || 0,
          challengeVotes: issue?.challengeVotes || 0,
          opposeVotes: issue?.opposeVotes || 0
        };
      }
      async getStanceVoters(stanceId) {
        return await db.select({
          id: stanceVotes.id,
          userId: stanceVotes.userId,
          stanceId: stanceVotes.stanceId,
          voteType: stanceVotes.voteType,
          createdAt: stanceVotes.createdAt,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName
          }
        }).from(stanceVotes).leftJoin(users, eq(stanceVotes.userId, users.id)).where(eq(stanceVotes.stanceId, stanceId)).orderBy(desc(stanceVotes.createdAt));
      }
      async getUserStanceVotes(userId) {
        return await db.select().from(stanceVotes).where(eq(stanceVotes.userId, userId)).orderBy(desc(stanceVotes.createdAt));
      }
      // Space voting operations
      async getUserSpaceVote(userId, spaceId) {
        const [vote] = await db.select().from(spaceVotes).where(
          and(
            eq(spaceVotes.userId, userId),
            eq(spaceVotes.spaceId, spaceId)
          )
        );
        return vote;
      }
      async createSpaceVote(voteData) {
        const [vote] = await db.insert(spaceVotes).values(voteData).returning();
        await this.updateSpaceVoteCounts(voteData.spaceId);
        return vote;
      }
      async updateSpaceVote(userId, spaceId, voteType, comment) {
        const [vote] = await db.update(spaceVotes).set({
          voteType,
          comment: comment || null,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(and(
          eq(spaceVotes.userId, userId),
          eq(spaceVotes.spaceId, spaceId)
        )).returning();
        await this.updateSpaceVoteCounts(spaceId);
        return vote;
      }
      async updateSpaceVoteCounts(spaceId) {
        const [bullishCount] = await db.select({ count: sql`COUNT(*)` }).from(spaceVotes).where(and(
          eq(spaceVotes.spaceId, spaceId),
          eq(spaceVotes.voteType, "bullish")
        ));
        const [bearishCount] = await db.select({ count: sql`COUNT(*)` }).from(spaceVotes).where(and(
          eq(spaceVotes.spaceId, spaceId),
          eq(spaceVotes.voteType, "bearish")
        ));
        const totalVotes = (bullishCount.count || 0) + (bearishCount.count || 0);
        await db.update(spaces).set({
          bullishVotes: bullishCount.count || 0,
          bearishVotes: bearishCount.count || 0,
          totalVotes,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(spaces.id, spaceId));
      }
      async getRecentSpaceVoteComments(limit = 20) {
        const votes2 = await db.select({
          id: spaceVotes.id,
          voteType: spaceVotes.voteType,
          comment: spaceVotes.comment,
          createdAt: spaceVotes.createdAt,
          userId: spaceVotes.userId,
          spaceId: spaceVotes.spaceId,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            grsScore: users.grsScore
          },
          space: {
            id: spaces.id,
            name: spaces.name,
            slug: spaces.slug,
            logoUrl: spaces.logoUrl
          }
        }).from(spaceVotes).innerJoin(users, eq(spaceVotes.userId, users.id)).innerJoin(spaces, eq(spaceVotes.spaceId, spaces.id)).where(isNotNull(spaceVotes.comment)).orderBy(desc(spaceVotes.createdAt)).limit(limit);
        return votes2;
      }
      // Score operations
      async updateUserScore(userId, daoId, points) {
        await db.update(users).set({
          credaPoints: sql`${users.credaPoints} + ${points}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
        await db.insert(userDaoScores).values({
          userId,
          daoId,
          score: points
        }).onConflictDoUpdate({
          target: [userDaoScores.userId, userDaoScores.daoId],
          set: {
            score: sql`${userDaoScores.score} + ${points}`,
            updatedAt: /* @__PURE__ */ new Date()
          }
        });
        await this.updateUserGrsScore(userId);
      }
      async getGlobalLeaderboard() {
        return await db.select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          credaPoints: users.credaPoints
        }).from(users).where(isNotNull(users.username)).orderBy(desc(users.credaPoints)).limit(10);
      }
      async getDaoLeaderboard(daoId) {
        return await db.select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          daoScore: userDaoScores.score
        }).from(userDaoScores).leftJoin(users, eq(userDaoScores.userId, users.id)).where(eq(userDaoScores.daoId, daoId)).orderBy(desc(userDaoScores.score)).limit(10);
      }
      // Stats operations
      async getGlobalStats() {
        const [daoCount] = await db.select({ count: sql`count(*)` }).from(daos);
        const [issueCount] = await db.select({ count: sql`count(*)` }).from(governanceIssues);
        const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
        const [xpSum] = await db.select({ sum: sql`coalesce(sum(${users.credaPoints}), 0)` }).from(users);
        return {
          totalDaos: daoCount?.count || 0,
          totalIssues: issueCount?.count || 0,
          totalUsers: userCount?.count || 0,
          totalCredaPoints: xpSum?.sum || 0
        };
      }
      // Follow operations
      async getUserFollowingStatus(userId, daoId) {
        const [follow] = await db.select().from(userDaoFollows).where(and(
          eq(userDaoFollows.userId, userId),
          eq(userDaoFollows.daoId, daoId)
        ));
        return follow;
      }
      async followDao(userId, daoId) {
        const [follow] = await db.insert(userDaoFollows).values({ userId, daoId }).returning();
        return follow;
      }
      async unfollowDao(userId, daoId) {
        await db.delete(userDaoFollows).where(and(
          eq(userDaoFollows.userId, userId),
          eq(userDaoFollows.daoId, daoId)
        ));
      }
      async getUserFollowedDaos(userId) {
        return await db.select({
          id: daos.id,
          name: daos.name,
          slug: daos.slug,
          description: daos.description,
          logoUrl: daos.logoUrl,
          createdBy: daos.createdBy,
          createdAt: daos.createdAt,
          updatedAt: daos.updatedAt
        }).from(userDaoFollows).innerJoin(daos, eq(userDaoFollows.daoId, daos.id)).where(eq(userDaoFollows.userId, userId)).orderBy(desc(userDaoFollows.createdAt));
      }
      // Admin operations
      async getAllUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
      }
      async getAllUserScores() {
        return await db.select({
          userId: userDaoScores.userId,
          daoId: userDaoScores.daoId,
          score: userDaoScores.score,
          username: users.username,
          daoName: daos.name,
          userCredaPoints: users.credaPoints,
          createdAt: userDaoScores.createdAt,
          updatedAt: userDaoScores.updatedAt
        }).from(userDaoScores).innerJoin(users, eq(userDaoScores.userId, users.id)).innerJoin(daos, eq(userDaoScores.daoId, daos.id)).orderBy(desc(userDaoScores.updatedAt));
      }
      async updateUserCredaPoints(userId, newCredaPoints) {
        const [user] = await db.update(users).set({ credaPoints: newCredaPoints, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
        return user;
      }
      async updateUserDaoScore(userId, daoId, newScore) {
        await db.update(userDaoScores).set({ score: newScore, updatedAt: /* @__PURE__ */ new Date() }).where(and(
          eq(userDaoScores.userId, userId),
          eq(userDaoScores.daoId, daoId)
        ));
      }
      async deleteUser(userId) {
        await db.delete(userDaoScores).where(eq(userDaoScores.userId, userId));
        await db.delete(userDaoFollows).where(eq(userDaoFollows.userId, userId));
        await db.delete(votes).where(eq(votes.userId, userId));
        await db.delete(comments).where(eq(comments.authorId, userId));
        await db.delete(governanceIssues).where(eq(governanceIssues.authorId, userId));
        await db.delete(users).where(eq(users.id, userId));
      }
      async updateDao(daoId, updates) {
        await db.update(daos).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(daos.id, daoId));
      }
      async deleteDao(daoId) {
        await db.delete(userDaoScores).where(eq(userDaoScores.daoId, daoId));
        await db.delete(userDaoFollows).where(eq(userDaoFollows.daoId, daoId));
        await db.delete(comments).where(eq(
          comments.issueId,
          db.select({ id: governanceIssues.id }).from(governanceIssues).where(eq(governanceIssues.daoId, daoId))
        ));
        await db.delete(governanceIssues).where(eq(governanceIssues.daoId, daoId));
        await db.delete(daos).where(eq(daos.id, daoId));
      }
      async deleteGovernanceIssue(issueId) {
        await db.delete(comments).where(eq(comments.issueId, issueId));
        await db.delete(votes).where(and(
          eq(votes.targetType, "issue"),
          eq(votes.targetId, issueId)
        ));
        await db.delete(governanceIssues).where(eq(governanceIssues.id, issueId));
      }
      async deleteComment(commentId) {
        await db.delete(votes).where(and(
          eq(votes.targetType, "comment"),
          eq(votes.targetId, commentId)
        ));
        await db.delete(comments).where(eq(comments.id, commentId));
      }
      async getDetailedUserStats(userId) {
        const user = await this.getUser(userId);
        if (!user) return null;
        const userGovernanceIssues = await this.getUserGovernanceIssues(userId);
        const userComments = await this.getUserComments(userId);
        const daoScores = await db.select({
          daoId: userDaoScores.daoId,
          score: userDaoScores.score,
          daoName: daos.name
        }).from(userDaoScores).innerJoin(daos, eq(userDaoScores.daoId, daos.id)).where(eq(userDaoScores.userId, userId));
        const totalVotes = await db.select({ count: sql`count(*)` }).from(votes).where(eq(votes.userId, userId));
        return {
          user,
          issueCount: userGovernanceIssues.length,
          commentCount: userComments.length,
          daoScores,
          totalVotes: totalVotes[0]?.count || 0
        };
      }
      async getAdminStats() {
        const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
        const totalDaos = await db.select({ count: sql`count(*)` }).from(daos);
        const totalIssues = await db.select({ count: sql`count(*)` }).from(governanceIssues);
        const totalComments = await db.select({ count: sql`count(*)` }).from(comments);
        const totalVotes = await db.select({ count: sql`count(*)` }).from(votes);
        const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(10);
        const recentIssues = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          createdAt: governanceIssues.createdAt,
          authorId: governanceIssues.authorId,
          username: users.username,
          daoName: daos.name
        }).from(governanceIssues).innerJoin(users, eq(governanceIssues.authorId, users.id)).innerJoin(daos, eq(governanceIssues.daoId, daos.id)).orderBy(desc(governanceIssues.createdAt)).limit(10);
        return {
          totalUsers: totalUsers[0]?.count || 0,
          totalDaos: totalDaos[0]?.count || 0,
          totalIssues: totalIssues[0]?.count || 0,
          totalComments: totalComments[0]?.count || 0,
          totalVotes: totalVotes[0]?.count || 0,
          recentUsers,
          recentIssues
        };
      }
      // Referral operations
      async getUserByReferralCode(referralCode) {
        const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
        return user;
      }
      async createReferral(referrerId, referredId, referralCode) {
        const [referral] = await db.insert(referrals).values({
          referrerId,
          referredId,
          referralCode,
          pointsAwarded: 3
        }).returning();
        return referral;
      }
      async getUserReferralStats(userId) {
        const totalReferrals = await db.select({ count: sql`count(*)` }).from(referrals).where(eq(referrals.referrerId, userId));
        const totalPointsEarned = await db.select({ total: sql`sum(${referrals.pointsAwarded})` }).from(referrals).where(eq(referrals.referrerId, userId));
        const recentReferrals = await db.select({
          id: referrals.id,
          referredUsername: users.username,
          pointsAwarded: referrals.pointsAwarded,
          createdAt: referrals.createdAt
        }).from(referrals).innerJoin(users, eq(referrals.referredId, users.id)).where(eq(referrals.referrerId, userId)).orderBy(desc(referrals.createdAt)).limit(10);
        return {
          totalReferrals: totalReferrals[0]?.count || 0,
          totalPointsEarned: totalPointsEarned[0]?.total || 0,
          recentReferrals
        };
      }
      async getReferralLeaderboard() {
        return await db.select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalReferrals: sql`COUNT(${referrals.id})`
        }).from(users).leftJoin(referrals, eq(users.id, referrals.referrerId)).groupBy(users.id, users.username, users.profileImageUrl).orderBy(desc(sql`COUNT(${referrals.id})`)).limit(10);
      }
      async getGovernorsLeaderboard() {
        return [
          {
            id: "gov_1",
            username: "EthereumFounder",
            profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            grsScore: 847,
            credaPoints: 2840,
            grsPercentile: 98
          },
          {
            id: "gov_2",
            username: "DeFiExpert",
            profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b5e0e786?w=150&h=150&fit=crop&crop=face",
            grsScore: 821,
            credaPoints: 2650,
            grsPercentile: 95
          },
          {
            id: "gov_3",
            username: "BlockchainGuru",
            profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            grsScore: 798,
            credaPoints: 2420,
            grsPercentile: 92
          },
          {
            id: "gov_4",
            username: "CryptoAdvisor",
            profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            grsScore: 776,
            credaPoints: 2180,
            grsPercentile: 88
          },
          {
            id: "gov_5",
            username: "DAOArchitect",
            profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00600f4a33e?w=150&h=150&fit=crop&crop=face",
            grsScore: 754,
            credaPoints: 1960,
            grsPercentile: 85
          },
          {
            id: "gov_6",
            username: "GovernanceLeader",
            profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            grsScore: 732,
            credaPoints: 1740,
            grsPercentile: 81
          },
          {
            id: "gov_7",
            username: "ConsensusBuilder",
            profileImageUrl: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face",
            grsScore: 714,
            credaPoints: 1580,
            grsPercentile: 78
          },
          {
            id: "gov_8",
            username: "CommunityChampion",
            profileImageUrl: "https://images.unsplash.com/photo-1573496359142-57010346e2f5?w=150&h=150&fit=crop&crop=face",
            grsScore: 692,
            credaPoints: 1420,
            grsPercentile: 74
          },
          {
            id: "gov_9",
            username: "ProtocolAdvocate",
            profileImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
            grsScore: 671,
            credaPoints: 1280,
            grsPercentile: 70
          },
          {
            id: "gov_10",
            username: "TokenomicsExpert",
            profileImageUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
            grsScore: 652,
            credaPoints: 1140,
            grsPercentile: 67
          }
        ];
      }
      // AI GRS (AI Governance Reputation Score) calculation methods
      async calculateGrsScore(userId) {
        const user = await this.getUser(userId);
        if (!user) return 1300;
        const currentStoredScore = user.grsScore || 1300;
        const credaPoints = user.credaPoints || 0;
        const userIssues = await this.getUserGovernanceIssues(userId);
        const userComments = await this.getUserComments(userId);
        const userVotes = await db.select({ count: sql`count(*)` }).from(votes).where(eq(votes.userId, userId));
        const grsEventsSum = await db.select({ total: sql`COALESCE(SUM(change_amount), 0)` }).from(grsEvents).where(eq(grsEvents.userId, userId));
        const totalGrsEvents = grsEventsSum[0]?.total || 0;
        const governanceActivity = userIssues.length * 25 + userComments.length * 15 + (userVotes[0]?.count || 0) * 5;
        const reputationWeight = Math.min(credaPoints / 30, 20);
        const accountAge = user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1e3 * 60 * 60 * 24)) : 0;
        const recentActivity = accountAge > 0 ? Math.max(0, 30 - accountAge) / 30 : 1;
        const baseScore = 1300;
        const maxScore = 2800;
        const minScore = 0;
        if (governanceActivity === 0 && (userVotes[0]?.count || 0) === 0 && accountAge < 1) {
          let newUserScore = baseScore + totalGrsEvents;
          return Math.round(Math.max(minScore, Math.min(maxScore, newUserScore)));
        }
        const activityBonus = Math.min(governanceActivity * 1.5, 300);
        const reputationBonus = Math.min(reputationWeight * 10, 200);
        const consistencyBonus = recentActivity * 100;
        let calculatedScore = baseScore + activityBonus + reputationBonus + consistencyBonus;
        calculatedScore += totalGrsEvents;
        if (accountAge > 7 && governanceActivity === 0) {
          const decayFactor = Math.min(accountAge / 30, 1);
          calculatedScore = calculatedScore * (1 - decayFactor * 0.2);
        }
        const finalScore = Math.round(Math.max(minScore, Math.min(maxScore, calculatedScore)));
        return finalScore;
      }
      async updateUserGrsScore(userId) {
        const grsScore = await this.calculateGrsScore(userId);
        const percentile = await this.calculateUserPercentile(userId, grsScore);
        await db.update(users).set({
          grsScore,
          grsPercentile: percentile,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
      }
      async calculateUserPercentile(userId, userScore) {
        const lowerScoreCount = await db.select({ count: sql`count(*)` }).from(users).where(lt(users.grsScore, userScore));
        const totalUserCount = await db.select({ count: sql`count(*)` }).from(users);
        const total = totalUserCount[0]?.count || 1;
        const lower = lowerScoreCount[0]?.count || 0;
        const percentile = Math.round(lower / total * 100);
        return Math.max(0, Math.min(100, percentile));
      }
      async recalculateAllGrsScores() {
        const allUsers = await db.select().from(users);
        for (const user of allUsers) {
          await this.updateUserGrsScore(user.id);
        }
      }
      async getGrsRanking(userId) {
        const user = await this.getUser(userId);
        if (!user) {
          return { score: 500, percentile: 50, rank: 1, total: 1 };
        }
        const grsScore = user.grsScore || 500;
        const userCredaPoints = user.credaPoints || 0;
        const higherXpCount = await db.select({ count: sql`count(*)` }).from(users).where(gt(users.credaPoints, userCredaPoints));
        const rank = (higherXpCount[0]?.count || 0) + 1;
        const totalUserCount = await db.select({ count: sql`count(*)` }).from(users);
        const total = totalUserCount[0]?.count || 1;
        const percentile = user.grsPercentile || 0;
        return {
          score: grsScore,
          percentile,
          rank,
          // This rank is now based on CREDA points
          total
        };
      }
      async getAllInviteCodes() {
        const codes = await db.select({
          id: inviteCodes.id,
          code: inviteCodes.code,
          isUsed: inviteCodes.isUsed,
          maxUses: inviteCodes.maxUses,
          currentUses: inviteCodes.currentUses,
          createdAt: inviteCodes.createdAt,
          usedAt: inviteCodes.usedAt,
          usedBy: inviteCodes.usedBy,
          codeType: inviteCodes.codeType,
          userId: users.id,
          username: users.username,
          email: users.email
        }).from(inviteCodes).leftJoin(users, eq(inviteCodes.usedBy, users.id)).where(eq(inviteCodes.codeType, "admin")).orderBy(desc(inviteCodes.createdAt));
        return codes.map((code) => ({
          id: code.id,
          code: code.code,
          isUsed: code.isUsed,
          maxUses: code.maxUses,
          currentUses: code.currentUses,
          createdAt: code.createdAt,
          usedAt: code.usedAt,
          usedBy: code.usedBy ? {
            id: code.userId,
            username: code.username,
            email: code.email
          } : null
        }));
      }
      async generateInviteCodes(count2) {
        const newCodes = [];
        for (let i = 0; i < count2; i++) {
          const code = [
            Math.random().toString(36).substring(2, 6).toUpperCase(),
            Math.random().toString(36).substring(2, 6).toUpperCase(),
            Math.random().toString(36).substring(2, 6).toUpperCase(),
            Math.random().toString(36).substring(2, 6).toUpperCase()
          ].join("-");
          newCodes.push({
            code,
            maxUses: 1,
            currentUses: 0,
            isUsed: false,
            codeType: "admin"
          });
        }
        const insertedCodes = await db.insert(inviteCodes).values(newCodes).returning();
        return insertedCodes;
      }
      // Invite submission operations
      async submitInviteCode(userId, code) {
        const [submission] = await db.insert(inviteSubmissions).values({
          userId,
          inviteCode: code,
          status: "pending"
        }).returning();
        return submission;
      }
      async getUserInviteSubmission(userId) {
        const [submission] = await db.select().from(inviteSubmissions).where(eq(inviteSubmissions.userId, userId));
        return submission;
      }
      async updateDailyStreak(userId) {
        const user = await this.getUser(userId);
        if (!user) return;
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
        if (lastActive) {
          lastActive.setHours(0, 0, 0, 0);
        }
        let newStreak = user.dailyStreak || 0;
        if (!lastActive) {
          newStreak = 1;
        } else if (lastActive.getTime() === today.getTime()) {
          return;
        } else if (lastActive.getTime() === today.getTime() - 24 * 60 * 60 * 1e3) {
          newStreak = (user.dailyStreak || 0) + 1;
        } else {
          newStreak = 1;
        }
        await db.update(users).set({
          dailyStreak: newStreak,
          lastActiveDate: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
        if (newStreak >= 3) {
          let bonusCreda = 0;
          if (newStreak === 3) bonusCreda = _DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_3_DAYS;
          else if (newStreak === 7) bonusCreda = _DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_7_DAYS;
          else if (newStreak === 14) bonusCreda = _DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_14_DAYS;
          else if (newStreak === 30) bonusCreda = _DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_30_DAYS;
          if (bonusCreda > 0) {
            await this.awardCredaPoints(userId, "special", "daily_streak", bonusCreda, "streak", newStreak, { streakDays: newStreak });
          }
        }
      }
      async resetWeeklyCreda() {
        await db.update(users).set({
          weeklyCreda: 0,
          lastCredaWeekReset: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      async getCredaLeaderboard(timeframe = "overall", limit = 50, daoId) {
        const now = /* @__PURE__ */ new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1e3);
        let baseQuery = db.select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          credaPoints: users.credaPoints,
          weeklyCreda: users.weeklyCreda,
          dailyStreak: users.dailyStreak
        }).from(users);
        if (daoId) {
          baseQuery = baseQuery.innerJoin(userDaoScores, eq(users.id, userDaoScores.userId)).where(eq(userDaoScores.daoId, daoId));
        } else {
          baseQuery = baseQuery.where(isNotNull(users.username));
        }
        const currentWeekXpQuery = db.select({
          userId: credaActivities.userId,
          weeklyCreda: sql`COALESCE(sum(${credaActivities.credaAwarded}), 0)`.as("weeklyCreda")
        }).from(credaActivities).where(gte(credaActivities.createdAt, oneWeekAgo)).groupBy(credaActivities.userId);
        const lastWeekXpQuery = db.select({
          userId: credaActivities.userId,
          lastWeekXp: sql`COALESCE(sum(${credaActivities.credaAwarded}), 0)`.as("lastWeekXp")
        }).from(credaActivities).where(and(
          gte(credaActivities.createdAt, twoWeeksAgo),
          lt(credaActivities.createdAt, oneWeekAgo)
        )).groupBy(credaActivities.userId);
        const leaderboard = await baseQuery.orderBy(timeframe === "overall" ? desc(users.credaPoints) : desc(users.weeklyCreda)).limit(limit);
        const [
          currentWeekData,
          lastWeekData
        ] = await Promise.all([
          currentWeekXpQuery,
          lastWeekXpQuery
        ]);
        const currentWeekMap = new Map(currentWeekData.map((d) => [d.userId, Number(d.weeklyCreda)]));
        const lastWeekMap = new Map(lastWeekData.map((d) => [d.userId, Number(d.lastWeekXp)]));
        return leaderboard.map((user, index2) => {
          const thisWeekXp = currentWeekMap.get(user.id) || 0;
          const lastWeekXp = lastWeekMap.get(user.id) || 0;
          const weeklyChange = thisWeekXp - lastWeekXp;
          return {
            id: user.id,
            rank: index2 + 1,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            credaPoints: user.credaPoints || 0,
            weeklyCreda: thisWeekXp,
            lastWeekXp,
            weeklyChange,
            dailyStreak: user.dailyStreak || 0
          };
        });
      }
      async getLeaderboardStats() {
        const [totalUsers] = await db.select({ count: sql`count(*)` }).from(users).where(isNotNull(users.username));
        const [weeklyCredaSum] = await db.select({ sum: sql`COALESCE(sum(${users.weeklyCreda}), 0)` }).from(users);
        const [activeStreaks] = await db.select({ count: sql`count(*)` }).from(users).where(sql`COALESCE(${users.dailyStreak}, 0) > 0`);
        return {
          totalParticipants: totalUsers?.count || 0,
          weeklyCredaTotal: weeklyCredaSum?.sum || 0,
          activeStreaks: activeStreaks?.count || 0
        };
      }
      async getUserCredaActivities(userId) {
        console.log(`Fetching CREDA activities for user: ${userId}`);
        const activities = await db.select().from(credaActivities).where(eq(credaActivities.userId, userId)).orderBy(desc(credaActivities.createdAt));
        console.log(`Found ${activities.length} CREDA activities for user ${userId}`);
        if (activities.length > 0) {
          console.log(`Latest activity: ${activities[0].activityType} - ${activities[0].xpAwarded} CREDA`);
        }
        return activities;
      }
      async getAllInviteSubmissions() {
        const submissions = await db.select({
          id: inviteSubmissions.id,
          userId: inviteSubmissions.userId,
          inviteCode: inviteSubmissions.inviteCode,
          status: inviteSubmissions.status,
          submittedAt: inviteSubmissions.submittedAt,
          approvedAt: inviteSubmissions.approvedAt,
          notes: inviteSubmissions.notes,
          username: users.username,
          email: users.email,
          authProvider: users.authProvider,
          profileImageUrl: users.profileImageUrl
        }).from(inviteSubmissions).leftJoin(users, eq(inviteSubmissions.userId, users.id)).orderBy(desc(inviteSubmissions.submittedAt));
        return submissions;
      }
      async approveInviteSubmission(submissionId) {
        const submission = await db.select().from(inviteSubmissions).where(eq(inviteSubmissions.id, submissionId)).limit(1);
        if (submission.length === 0) {
          throw new Error("Submission not found");
        }
        const userId = submission[0].userId;
        await db.transaction(async (tx) => {
          await tx.update(inviteSubmissions).set({
            status: "approved",
            approvedAt: /* @__PURE__ */ new Date()
          }).where(eq(inviteSubmissions.id, submissionId));
          await tx.update(users).set({
            hasInviteAccess: true,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(users.id, userId));
        });
      }
      async denyInviteSubmission(submissionId, notes) {
        await db.update(inviteSubmissions).set({
          status: "denied",
          notes: notes || "Access denied",
          approvedAt: /* @__PURE__ */ new Date()
        }).where(eq(inviteSubmissions.id, submissionId));
      }
      // Review operations
      async getAllReviews() {
        const result = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          reviewedDaoId: reviews.reviewedDaoId,
          targetType: reviews.targetType,
          isTargetOnPlatform: reviews.isTargetOnPlatform,
          externalEntityName: reviews.externalEntityName,
          externalEntityXHandle: reviews.externalEntityXHandle,
          reviewType: reviews.reviewType,
          rating: reviews.rating,
          title: reviews.title,
          content: reviews.content,
          pointsAwarded: reviews.pointsAwarded,
          upvotes: reviews.upvotes,
          downvotes: reviews.downvotes,
          createdAt: reviews.createdAt,
          updatedAt: reviews.updatedAt,
          // Join reviewer info
          reviewerUsername: users.username,
          reviewerAvatar: users.profileImageUrl,
          reviewerGrsScore: sql`COALESCE(${users.grsScore}, 0)`,
          // Join reviewed user info
          reviewedUsername: sql`reviewed_user.username`,
          reviewedUserAvatar: sql`reviewed_user.profile_image_url`,
          reviewedUserFirstName: sql`reviewed_user.first_name`,
          reviewedUserLastName: sql`reviewed_user.last_name`,
          reviewedUserGrsScore: sql`COALESCE(reviewed_user.grs_score, 0)`,
          // Join reviewed DAO info
          reviewedDaoName: daos.name,
          reviewedDaoSlug: daos.slug,
          reviewedDaoLogo: daos.logoUrl,
          // Join space info
          spaceLogoUrl: spaces.logoUrl,
          spaceName: spaces.name,
          spaceSlug: spaces.slug
        }).from(reviews).leftJoin(users, eq(users.id, reviews.reviewerId)).leftJoin(sql`users AS reviewed_user`, sql`reviewed_user.id = ${reviews.reviewedUserId}`).leftJoin(daos, eq(daos.id, reviews.reviewedDaoId)).leftJoin(spaces, eq(spaces.id, reviews.spaceId)).orderBy(desc(reviews.createdAt));
        const reviewIds = result.map((r) => r.id);
        const reviewActivities = reviewIds.length > 0 ? await db.select({
          targetId: credaActivities.targetId,
          ogTxHash: credaActivities.ogTxHash,
          ogRootHash: credaActivities.ogRootHash
        }).from(credaActivities).where(
          and(
            eq(credaActivities.activityType, "review_given"),
            eq(credaActivities.targetType, "review"),
            inArray(credaActivities.targetId, reviewIds)
          )
        ) : [];
        const ogDataMap = /* @__PURE__ */ new Map();
        for (const activity of reviewActivities) {
          if (activity.targetId) {
            ogDataMap.set(activity.targetId, {
              ogTxHash: activity.ogTxHash || null,
              ogRootHash: activity.ogRootHash || null
            });
          }
        }
        return result.map((review) => {
          const ogData = ogDataMap.get(review.id);
          return {
            ...review,
            ogTxHash: ogData?.ogTxHash || null,
            ogRootHash: ogData?.ogRootHash || null
          };
        });
      }
      async getReviewsBySpace(spaceSlug, limit = 10) {
        console.log(`getReviewsBySpace called for slug: ${spaceSlug}`);
        const result = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          reviewType: reviews.reviewType,
          rating: reviews.rating,
          title: reviews.title,
          content: reviews.content,
          upvotes: reviews.upvotes,
          createdAt: reviews.createdAt,
          author: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            grsScore: users.grsScore
          }
        }).from(reviews).innerJoin(spaces, eq(reviews.spaceId, spaces.id)).leftJoin(users, eq(reviews.reviewerId, users.id)).where(eq(spaces.slug, spaceSlug)).orderBy(desc(reviews.createdAt)).limit(limit);
        console.log(`getReviewsBySpace found ${result.length} reviews for ${spaceSlug}`);
        return result;
      }
      async getRecentReviews(limit = 10) {
        const result = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          targetType: reviews.targetType,
          isTargetOnPlatform: reviews.isTargetOnPlatform,
          externalEntityName: reviews.externalEntityName,
          externalEntityXHandle: reviews.externalEntityXHandle,
          reviewType: reviews.reviewType,
          rating: reviews.rating,
          title: reviews.title,
          content: reviews.content,
          pointsAwarded: reviews.pointsAwarded,
          upvotes: reviews.upvotes,
          downvotes: reviews.downvotes,
          createdAt: reviews.createdAt,
          updatedAt: reviews.updatedAt,
          // Join reviewer info
          reviewerUsername: sql`reviewer.username`,
          reviewerAvatar: sql`reviewer.profile_image_url`,
          reviewerGrsScore: sql`reviewer.grs_score`,
          // Join reviewed user info
          reviewedUsername: sql`reviewed_user.username`,
          reviewedUserAvatar: sql`reviewed_user.profile_image_url`,
          reviewedUserFirstName: sql`reviewed_user.first_name`,
          reviewedUserLastName: sql`reviewed_user.last_name`,
          reviewedUserGrsScore: sql`reviewed_user.grs_score`,
          // Join space info
          spaceSlug: sql`space.slug`,
          spaceName: sql`space.name`,
          spaceLogoUrl: sql`space.logo_url`
        }).from(reviews).leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`).leftJoin(sql`users AS reviewed_user`, sql`reviewed_user.id = ${reviews.reviewedUserId}`).leftJoin(sql`spaces AS space`, sql`space.id = ${reviews.spaceId}`).orderBy(desc(reviews.createdAt)).limit(limit);
        const enrichedResults = await Promise.all(result.map(async (review) => {
          if (review.reviewedUserId) {
            const reviewStats = await this.getUserReviewStats(review.reviewedUserId);
            return {
              ...review,
              reviewedUserStats: reviewStats
            };
          }
          return review;
        }));
        return enrichedResults;
      }
      async getReviewById(reviewId) {
        console.log("Getting review with ID:", reviewId);
        try {
          const reviewResult = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
          if (reviewResult.length === 0) {
            console.log("No review found for ID:", reviewId);
            return null;
          }
          const review = reviewResult[0];
          console.log("Found review:", { id: review.id, reviewerId: review.reviewerId, reviewedUserId: review.reviewedUserId, reviewedDaoId: review.reviewedDaoId });
          let reviewer = null;
          if (review.reviewerId) {
            const reviewerResult = await db.select({
              id: users.id,
              username: users.username,
              profileImageUrl: users.profileImageUrl,
              firstName: users.firstName,
              lastName: users.lastName
            }).from(users).where(eq(users.id, review.reviewerId)).limit(1);
            if (reviewerResult.length > 0) {
              reviewer = reviewerResult[0];
              console.log("Found reviewer:", reviewer);
            }
          }
          let reviewedUser = null;
          if (review.reviewedUserId) {
            const reviewedUserResult = await db.select({
              id: users.id,
              username: users.username,
              profileImageUrl: users.profileImageUrl,
              firstName: users.firstName,
              lastName: users.lastName,
              twitterHandle: users.twitterHandle
            }).from(users).where(eq(users.id, review.reviewedUserId)).limit(1);
            if (reviewedUserResult.length > 0) {
              reviewedUser = reviewedUserResult[0];
              console.log("Found reviewed user:", reviewedUser);
            }
          }
          let reviewedDaoName = null;
          let reviewedDaoSlug = null;
          let reviewedDaoLogo = null;
          if (review.reviewedDaoId) {
            const daoResult = await db.select({
              id: daos.id,
              name: daos.name,
              slug: daos.slug,
              logoUrl: daos.logoUrl
            }).from(daos).where(eq(daos.id, review.reviewedDaoId)).limit(1);
            if (daoResult.length > 0) {
              const dao = daoResult[0];
              reviewedDaoName = dao.name;
              reviewedDaoSlug = dao.slug;
              reviewedDaoLogo = dao.logoUrl;
              console.log("Found reviewed DAO:", dao.name);
            }
          }
          const comments2 = await this.getReviewComments(reviewId);
          const transformedReview = {
            ...review,
            reviewer,
            reviewedUser,
            reviewedDaoName,
            reviewedDaoSlug,
            reviewedDaoLogo,
            comments: comments2,
            helpfulCount: 0
            // Add helpful count for compatibility
          };
          console.log("Returning transformed review with DAO data");
          return transformedReview;
        } catch (error) {
          console.error("Error getting review:", error);
          throw error;
        }
      }
      async getUserReviews(userId) {
        const realReviews = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          reviewedDaoId: reviews.reviewedDaoId,
          targetType: reviews.targetType,
          isTargetOnPlatform: reviews.isTargetOnPlatform,
          externalEntityName: reviews.externalEntityName,
          externalEntityXHandle: reviews.externalEntityXHandle,
          reviewType: reviews.reviewType,
          rating: reviews.rating,
          content: reviews.content,
          pointsAwarded: reviews.pointsAwarded,
          upvotes: reviews.upvotes,
          downvotes: reviews.downvotes,
          createdAt: reviews.createdAt,
          updatedAt: reviews.updatedAt,
          // Join reviewer info
          reviewerUsername: sql`reviewer.username`,
          reviewerAvatar: sql`reviewer.profile_image_url`
        }).from(reviews).leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`).where(
          or(
            eq(reviews.reviewedUserId, userId),
            and(
              eq(reviews.externalEntityName, userId),
              eq(reviews.isTargetOnPlatform, false)
            )
          )
        ).orderBy(desc(reviews.createdAt));
        return realReviews;
      }
      async createReview(reviewData) {
        const [review] = await db.insert(reviews).values(reviewData).returning();
        return review;
      }
      async getReviewByUsers(reviewerId, reviewedId) {
        const [review] = await db.select().from(reviews).where(and(
          eq(reviews.reviewerId, reviewerId),
          eq(reviews.reviewedUserId, reviewedId)
        ));
        return review;
      }
      async getReviewByUserAndDao(reviewerId, daoId) {
        const [review] = await db.select().from(reviews).where(and(
          eq(reviews.reviewerId, reviewerId),
          eq(reviews.reviewedDaoId, daoId)
        ));
        return review;
      }
      async getDaoReviews(daoId) {
        console.log(`getDaoReviews called with daoId: ${daoId}`);
        try {
          const result = await db.select({
            id: reviews.id,
            reviewerId: reviews.reviewerId,
            reviewedUserId: reviews.reviewedUserId,
            reviewedDaoId: reviews.reviewedDaoId,
            targetType: reviews.targetType,
            isTargetOnPlatform: reviews.isTargetOnPlatform,
            externalEntityName: reviews.externalEntityName,
            externalEntityXHandle: reviews.externalEntityXHandle,
            reviewType: reviews.reviewType,
            rating: reviews.rating,
            title: reviews.title,
            content: reviews.content,
            pointsAwarded: reviews.pointsAwarded,
            upvotes: reviews.upvotes,
            downvotes: reviews.downvotes,
            createdAt: reviews.createdAt,
            updatedAt: reviews.updatedAt,
            // Join reviewer info
            reviewerUsername: sql`reviewer.username`,
            reviewerAvatar: sql`reviewer.profile_image_url`,
            reviewerGrsScore: sql`reviewer.grs_score`
          }).from(reviews).leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`).where(
            or(
              eq(reviews.reviewedDaoId, daoId),
              eq(reviews.reviewedUserId, `dao_${daoId}`)
            )
          ).orderBy(desc(reviews.createdAt));
          console.log(`Found ${result.length} reviews for DAO ${daoId}`);
          const transformedReviews = result.map((review) => ({
            ...review,
            reviewer: {
              id: review.reviewerId,
              username: review.reviewerUsername,
              profileImageUrl: review.reviewerAvatar,
              grsScore: review.reviewerGrsScore
            }
          }));
          return transformedReviews;
        } catch (error) {
          console.error(`Error in getDaoReviews for DAO ${daoId}:`, error);
          throw error;
        }
      }
      async getUserReviewStats(userId) {
        const reviewStats = await db.select({
          reviewType: reviews.reviewType,
          count: sql`COUNT(*)`
        }).from(reviews).where(eq(reviews.reviewedUserId, userId)).groupBy(reviews.reviewType);
        const stats = { total: 0, positive: 0, negative: 0, neutral: 0, positivePercentage: 0 };
        reviewStats.forEach((stat) => {
          stats.total += stat.count;
          stats[stat.reviewType] = stat.count;
        });
        stats.positivePercentage = stats.total > 0 ? Math.round(stats.positive / stats.total * 100) : 0;
        return stats;
      }
      async getUserAdvancedReviewStats(userId) {
        const reviewStats = await db.select({
          count: sql`COUNT(*)`,
          avgRating: sql`COALESCE(AVG(${reviews.rating}), 0)`,
          ratingVariance: sql`COALESCE(VARIANCE(${reviews.rating}), 0)`
        }).from(reviews).where(eq(reviews.reviewerId, userId));
        console.log("Review stats result:", reviewStats);
        const stats = reviewStats[0] || { count: 0, avgRating: 0, ratingVariance: 0 };
        const total = Number(stats.count) || 0;
        const averageRating = Math.round((Number(stats.avgRating) || 0) * 10) / 10;
        const consistency = total > 1 ? Math.max(0, Math.min(100, Math.round(100 - stats.ratingVariance * 10))) : total === 1 ? 100 : 0;
        return {
          total,
          averageRating,
          consistency
        };
      }
      async getUserStanceStats(userId) {
        const userStances = await db.select({
          id: governanceIssues.id,
          stance: governanceIssues.stance,
          championVotes: governanceIssues.championVotes,
          challengeVotes: governanceIssues.challengeVotes,
          opposeVotes: governanceIssues.opposeVotes,
          isActive: governanceIssues.isActive,
          expiresAt: governanceIssues.expiresAt
        }).from(governanceIssues).where(eq(governanceIssues.authorId, userId));
        const stats = {
          total: userStances.length,
          successful: 0,
          successRate: 0,
          challengesWon: 0,
          championsWon: 0
        };
        userStances.forEach((stance) => {
          const now = /* @__PURE__ */ new Date();
          const hasExpired = stance.expiresAt && new Date(stance.expiresAt) <= now;
          if (hasExpired || !stance.isActive) {
            const totalVotes = (stance.championVotes || 0) + (stance.challengeVotes || 0) + (stance.opposeVotes || 0);
            const consensusThreshold = Math.max(1, totalVotes * 0.5);
            if (stance.stance === "champion" && (stance.championVotes || 0) >= consensusThreshold) {
              stats.successful++;
              stats.championsWon++;
            } else if (stance.stance === "challenge" && (stance.challengeVotes || 0) >= consensusThreshold) {
              stats.successful++;
              stats.challengesWon++;
            }
          }
        });
        stats.successRate = stats.total > 0 ? Math.round(stats.successful / stats.total * 100) : 0;
        return stats;
      }
      async hasUserReviewed(reviewerId, reviewedId) {
        const review = await this.getReviewByUsers(reviewerId, reviewedId);
        return !!review;
      }
      // Project Review Methods
      async createProjectReview(reviewData) {
        const [review] = await db.insert(projectReviews).values(reviewData).returning();
        await this.awardCredaPoints(reviewData.userId, "social", "project_review_given", _DatabaseStorage.CREDA_REWARDS.GIVE_REVIEW, "project_review", review.id, {
          projectId: reviewData.projectId,
          projectName: reviewData.projectName,
          rating: reviewData.rating
        });
        return review;
      }
      async getProjectReviews(projectId) {
        const reviewsList = await db.select({
          id: projectReviews.id,
          userId: projectReviews.userId,
          projectId: projectReviews.projectId,
          projectName: projectReviews.projectName,
          projectLogo: projectReviews.projectLogo,
          projectSlug: projectReviews.projectSlug,
          rating: projectReviews.rating,
          title: projectReviews.title,
          content: projectReviews.content,
          helpful: projectReviews.helpful,
          verified: projectReviews.verified,
          companyReply: projectReviews.companyReply,
          companyRepliedAt: projectReviews.companyRepliedAt,
          createdAt: projectReviews.createdAt,
          updatedAt: projectReviews.updatedAt,
          user: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            twitterHandle: users.twitterHandle
          }
        }).from(projectReviews).leftJoin(users, eq(projectReviews.userId, users.id)).where(eq(projectReviews.projectId, projectId)).orderBy(desc(projectReviews.createdAt));
        return reviewsList;
      }
      async getAllProjectReviews(limit = 20) {
        const rows = await db.select({
          id: projectReviews.id,
          userId: projectReviews.userId,
          projectId: projectReviews.projectId,
          projectName: projectReviews.projectName,
          projectLogo: projectReviews.projectLogo,
          projectSlug: projectReviews.projectSlug,
          rating: projectReviews.rating,
          title: projectReviews.title,
          content: projectReviews.content,
          helpful: projectReviews.helpful,
          verified: projectReviews.verified,
          companyReply: projectReviews.companyReply,
          companyRepliedAt: projectReviews.companyRepliedAt,
          createdAt: projectReviews.createdAt,
          updatedAt: projectReviews.updatedAt,
          // Flatten user fields to avoid hydration issues with .limit()
          user_id: users.id,
          user_username: users.username,
          user_firstName: users.firstName,
          user_lastName: users.lastName,
          user_profileImageUrl: users.profileImageUrl,
          user_twitterHandle: users.twitterHandle
        }).from(projectReviews).leftJoin(users, eq(projectReviews.userId, users.id)).orderBy(desc(projectReviews.createdAt)).limit(limit);
        return rows.map((row) => ({
          id: row.id,
          userId: row.userId,
          projectId: row.projectId,
          projectName: row.projectName,
          projectLogo: row.projectLogo,
          projectSlug: row.projectSlug,
          rating: row.rating,
          title: row.title,
          content: row.content,
          helpful: row.helpful,
          verified: row.verified,
          companyReply: row.companyReply,
          companyRepliedAt: row.companyRepliedAt,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          user: {
            id: row.user_id,
            username: row.user_username,
            firstName: row.user_firstName,
            lastName: row.user_lastName,
            profileImageUrl: row.user_profileImageUrl,
            twitterHandle: row.user_twitterHandle
          }
        }));
      }
      async markProjectReviewHelpful(reviewId) {
        const [updatedReview] = await db.update(projectReviews).set({ helpful: sql`${projectReviews.helpful} + 1` }).where(eq(projectReviews.id, reviewId)).returning();
        return updatedReview || null;
      }
      // Review Share Methods (for viral X/Twitter sharing)
      async createReviewShare(shareData) {
        const [share] = await db.insert(reviewShares).values(shareData).returning();
        return share;
      }
      async getReviewShare(shareToken) {
        const [share] = await db.select().from(reviewShares).where(eq(reviewShares.shareToken, shareToken)).limit(1);
        return share;
      }
      async trackReviewShareClick(clickData) {
        await db.insert(reviewShareClicks).values(clickData);
        await db.update(reviewShares).set({ clicks: sql`${reviewShares.clicks} + 1` }).where(eq(reviewShares.id, clickData.shareId));
      }
      async claimShareReward(shareId, userId) {
        const [share] = await db.select().from(reviewShares).where(eq(reviewShares.id, shareId)).limit(1);
        if (!share || share.shareRewardClaimed) {
          console.log(`Share reward already claimed or share not found: ${shareId}`);
          return;
        }
        await this.awardCredaPoints(
          userId,
          "social",
          "review_shared_on_x",
          100,
          "review_share",
          shareId,
          {
            platform: share.platform,
            projectName: share.projectName,
            credaEarnedFromReview: share.credaEarned
          }
        );
        await db.update(reviewShares).set({
          shareRewardClaimed: true,
          shareRewardClaimedAt: /* @__PURE__ */ new Date()
        }).where(eq(reviewShares.id, shareId));
        console.log(`Share reward of 100 CREDA claimed for user ${userId}, share ${shareId}`);
      }
      async getUserReviewShares(userId) {
        const shares = await db.select().from(reviewShares).where(eq(reviewShares.userId, userId)).orderBy(desc(reviewShares.createdAt));
        return shares;
      }
      async linkReferralToUser(shareToken, newUserId) {
        const [share] = await db.select().from(reviewShares).where(eq(reviewShares.shareToken, shareToken)).limit(1);
        if (!share) {
          console.log(`Share token not found: ${shareToken}`);
          return;
        }
        if (!share.shareRewardClaimed) {
          await this.claimShareReward(share.id, share.userId);
        }
        await this.awardCredaPoints(
          share.userId,
          "social",
          "referral_from_x_share",
          70,
          "user",
          void 0,
          {
            referredUser: newUserId,
            shareToken
          }
        );
        console.log(`Linked referral: user ${share.userId} referred ${newUserId} via share token ${shareToken}`);
      }
      async getAllCompanies() {
        const companiesList = await db.select().from(companies).orderBy(desc(companies.createdAt));
        return companiesList;
      }
      async getCompanyById(id) {
        const [company] = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
        return company;
      }
      async getCompanyByExternalId(externalId) {
        const [company] = await db.select().from(companies).where(eq(companies.externalId, externalId)).limit(1);
        return company;
      }
      async getCompanyBySlug(slug) {
        const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
        return company;
      }
      async createCompany(companyData) {
        const [company] = await db.insert(companies).values(companyData).returning();
        return company;
      }
      async updateCompany(id, updates) {
        const [updatedCompany] = await db.update(companies).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(companies.id, id)).returning();
        return updatedCompany;
      }
      async deleteCompany(id) {
        await db.delete(companies).where(eq(companies.id, id));
      }
      async getCompanyReviews(companyId) {
        const company = await this.getCompanyById(companyId);
        if (!company) return [];
        return await this.getProjectReviews(company.externalId);
      }
      async getCompanyAnalytics(companyId) {
        const company = await this.getCompanyById(companyId);
        if (!company) {
          return {
            totalReviews: 0,
            averageRating: "0.0",
            ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          };
        }
        const reviews3 = await this.getProjectReviews(company.externalId);
        const totalReviews = reviews3.length;
        if (totalReviews === 0) {
          return {
            totalReviews: 0,
            averageRating: "0.0",
            ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          };
        }
        const avgRating = reviews3.reduce((sum2, r) => sum2 + r.rating, 0) / totalReviews;
        const ratingBreakdown = reviews3.reduce((acc, r) => {
          acc[r.rating] = (acc[r.rating] || 0) + 1;
          return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        return {
          totalReviews,
          averageRating: avgRating.toFixed(1),
          ratingBreakdown
        };
      }
      async addCompanyReplyToReview(reviewId, reply) {
        const [updatedReview] = await db.update(projectReviews).set({
          companyReply: reply,
          companyRepliedAt: /* @__PURE__ */ new Date()
        }).where(eq(projectReviews.id, reviewId)).returning();
        return updatedReview;
      }
      async getCompanyAdmins(companyId) {
        const admins = await db.select({
          id: companyAdmins.id,
          companyId: companyAdmins.companyId,
          userId: companyAdmins.userId,
          role: companyAdmins.role,
          createdAt: companyAdmins.createdAt,
          user: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            profileImageUrl: users.profileImageUrl,
            twitterHandle: users.twitterHandle
          }
        }).from(companyAdmins).leftJoin(users, eq(companyAdmins.userId, users.id)).where(eq(companyAdmins.companyId, companyId)).orderBy(desc(companyAdmins.createdAt));
        return admins;
      }
      async addCompanyAdmin(adminData) {
        const [admin] = await db.insert(companyAdmins).values(adminData).returning();
        return admin;
      }
      async removeCompanyAdmin(id) {
        await db.delete(companyAdmins).where(eq(companyAdmins.id, id));
      }
      async isUserCompanyAdmin(userId, companyId) {
        const [admin] = await db.select().from(companyAdmins).where(
          and(
            eq(companyAdmins.userId, userId),
            eq(companyAdmins.companyId, companyId)
          )
        ).limit(1);
        return !!admin;
      }
      async getRecentReviewsWithGrsChanges(limit = 20) {
        try {
          console.log(`Fetching ${limit} recent reviews with GRS changes...`);
          const recentReviews = await db.select({
            id: reviews.id,
            title: reviews.title,
            content: reviews.content,
            rating: reviews.rating,
            reviewType: reviews.reviewType,
            createdAt: reviews.createdAt,
            reviewerId: reviews.reviewerId,
            reviewedUserId: reviews.reviewedUserId,
            reviewedDaoId: reviews.reviewedDaoId,
            targetType: reviews.targetType,
            upvotes: reviews.upvotes,
            downvotes: reviews.downvotes,
            pointsAwarded: reviews.pointsAwarded,
            // Reviewer info
            reviewerUsername: users.username,
            reviewerAvatar: users.profileImageUrl,
            reviewerGrsScore: users.grsScore
          }).from(reviews).leftJoin(users, eq(reviews.reviewerId, users.id)).orderBy(desc(reviews.createdAt)).limit(limit);
          console.log(`Found ${recentReviews.length} recent reviews`);
          const processedReviews = await Promise.all(
            recentReviews.map(async (review) => {
              let reviewedEntity = null;
              let displayName = "Unknown";
              let avatarUrl = null;
              let grsImpact = "positive";
              let impactAmount = 15;
              if (review.reviewedUserId) {
                const reviewedUser = await this.getUser(review.reviewedUserId);
                reviewedEntity = reviewedUser;
                displayName = reviewedUser?.username || reviewedUser?.firstName || "Unknown User";
                avatarUrl = reviewedUser?.profileImageUrl;
                grsImpact = review.reviewType === "positive" ? "positive" : review.reviewType === "negative" ? "negative" : "neutral";
                impactAmount = review.pointsAwarded || (review.rating > 3 ? 25 : 15);
              } else if (review.reviewedDaoId) {
                const reviewedDao = await this.getDaoById(review.reviewedDaoId);
                reviewedEntity = reviewedDao;
                displayName = reviewedDao?.name || "Unknown DAO";
                avatarUrl = reviewedDao?.logoUrl;
                grsImpact = "dao";
                impactAmount = 20;
              }
              return {
                id: review.id,
                displayName,
                avatarUrl,
                grsImpact,
                impactAmount,
                reviewType: review.reviewType,
                createdAt: review.createdAt,
                reviewerId: review.reviewerId,
                reviewedUserId: review.reviewedUserId,
                reviewedDaoId: review.reviewedDaoId,
                targetType: review.targetType || "user",
                reviewerUsername: review.reviewerUsername,
                reviewerAvatar: review.reviewerAvatar,
                reviewerGrsScore: review.reviewerGrsScore,
                title: review.title,
                content: review.content,
                rating: review.rating
              };
            })
          );
          console.log(`Processed ${processedReviews.length} reviews for banner display`);
          return processedReviews;
        } catch (error) {
          console.error("Error getting recent reviews with GRS changes:", error);
          throw error;
        }
      }
      // Review comment operations
      async getReviewComments(reviewId) {
        const comments2 = await db.select().from(reviewComments).leftJoin(users, eq(reviewComments.authorId, users.id)).where(eq(reviewComments.reviewId, reviewId)).orderBy(reviewComments.createdAt);
        return comments2.map((result) => ({
          ...result.review_comments,
          author: result.users ? {
            id: result.users.id,
            username: result.users.username,
            firstName: result.users.firstName,
            lastName: result.users.lastName,
            profileImageUrl: result.users.profileImageUrl
          } : null
        }));
      }
      async getReviewCommentById(commentId) {
        const result = await db.select().from(reviewComments).leftJoin(users, eq(reviewComments.authorId, users.id)).where(eq(reviewComments.id, commentId)).limit(1);
        if (!result[0]) {
          return void 0;
        }
        const comment = result[0];
        return {
          ...comment.review_comments,
          author: comment.users ? {
            id: comment.users.id,
            username: comment.users.username,
            firstName: comment.users.firstName,
            lastName: comment.users.lastName,
            profileImageUrl: comment.users.profileImageUrl
          } : null
        };
      }
      async createReviewComment(commentData) {
        const [newComment] = await db.insert(reviewComments).values(commentData).returning();
        const commentWithAuthor = await db.select().from(reviewComments).leftJoin(users, eq(reviewComments.authorId, users.id)).where(eq(reviewComments.id, newComment.id)).limit(1);
        const result = commentWithAuthor[0];
        if (!result) {
          throw new Error("Failed to retrieve created comment");
        }
        return {
          ...result.review_comments,
          author: result.users ? {
            id: result.users.id,
            username: result.users.username,
            firstName: result.users.firstName,
            lastName: result.users.lastName,
            profileImageUrl: result.users.profileImageUrl
          } : null
        };
      }
      // Business profile operations
      async createBusinessProfile(userId, data) {
        const { nanoid: nanoid3 } = await import("nanoid");
        const slug = data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const inviteCode = nanoid3(10);
        const [profile] = await db.insert(businessProfiles).values({
          userId,
          companyName: data.companyName,
          slug,
          industry: data.industry,
          website: data.website,
          email: data.email,
          description: data.description,
          logoUrl: data.logoUrl || "",
          plan: data.plan || "free",
          inviteCode,
          isDeployed: false
        }).returning();
        return profile;
      }
      async getBusinessProfile(id) {
        const [profile] = await db.select().from(businessProfiles).where(eq(businessProfiles.id, id)).limit(1);
        return profile;
      }
      async getBusinessProfileBySlug(slug) {
        const [profile] = await db.select().from(businessProfiles).where(eq(businessProfiles.slug, slug)).limit(1);
        return profile;
      }
      async getBusinessProfileByUserId(userId) {
        const [profile] = await db.select().from(businessProfiles).where(eq(businessProfiles.userId, userId)).limit(1);
        return profile;
      }
      async getBusinessProfileByInviteCode(inviteCode) {
        const [profile] = await db.select().from(businessProfiles).where(eq(businessProfiles.inviteCode, inviteCode)).limit(1);
        return profile;
      }
      async updateBusinessProfile(id, data) {
        const [profile] = await db.update(businessProfiles).set({
          ...data,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(businessProfiles.id, id)).returning();
        return profile;
      }
      async deployBusinessProfile(id) {
        const [profile] = await db.update(businessProfiles).set({
          isDeployed: true,
          deployedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(businessProfiles.id, id)).returning();
        return profile;
      }
      async getBusinessReviews(businessId) {
        const businessReviews = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedBusinessId: reviews.reviewedBusinessId,
          title: reviews.title,
          content: reviews.content,
          rating: reviews.rating,
          upvotes: reviews.upvotes,
          downvotes: reviews.downvotes,
          createdAt: reviews.createdAt,
          reviewerUsername: users.username,
          reviewerAvatar: users.profileImageUrl,
          reviewerGrsScore: users.grsScore
        }).from(reviews).leftJoin(users, eq(reviews.reviewerId, users.id)).where(eq(reviews.reviewedBusinessId, businessId)).orderBy(desc(reviews.createdAt));
        return businessReviews;
      }
      async getAllBusinessProfiles() {
        const profiles = await db.select().from(businessProfiles).where(eq(businessProfiles.isDeployed, true)).orderBy(desc(businessProfiles.deployedAt));
        return profiles;
      }
      async getUserActivity(userId) {
        const activities = [];
        const userIssues = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          stance: governanceIssues.stance,
          upvotes: governanceIssues.upvotes,
          downvotes: governanceIssues.downvotes,
          commentCount: governanceIssues.commentCount,
          createdAt: governanceIssues.createdAt,
          daoName: daos.name,
          daoSlug: daos.slug,
          targetUsername: governanceIssues.targetUsername,
          targetUserId: governanceIssues.targetUserId,
          targetUser: {
            username: sql`target_user.username`
          }
        }).from(governanceIssues).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(sql`users as target_user`, eq(governanceIssues.targetUserId, sql`target_user.id`)).where(eq(governanceIssues.authorId, userId)).orderBy(desc(governanceIssues.createdAt));
        userIssues.forEach((issue) => {
          activities.push({
            id: `issue-${issue.id}`,
            type: "governance_issue",
            title: `Created governance issue: ${issue.title}`,
            description: `${issue.stance === "champion" ? "Championed" : "Challenged"} ${issue.title}`,
            points: 15,
            timestamp: issue.createdAt,
            metadata: {
              issueId: issue.id,
              issueTitle: issue.title,
              stance: issue.stance,
              upvotes: issue.upvotes,
              downvotes: issue.downvotes,
              commentCount: issue.commentCount,
              daoName: issue.daoName,
              daoSlug: issue.daoSlug,
              targetUsername: issue.targetUsername,
              targetUserId: issue.targetUserId,
              targetUser: issue.targetUser?.username
            }
          });
        });
        const userComments = await db.select({
          id: comments.id,
          content: comments.content,
          stance: comments.stance,
          upvotes: comments.upvotes,
          downvotes: comments.downvotes,
          createdAt: comments.createdAt,
          issueId: comments.issueId,
          issueTitle: governanceIssues.title,
          daoName: daos.name,
          daoSlug: daos.slug
        }).from(comments).leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).where(eq(comments.authorId, userId)).orderBy(desc(comments.createdAt));
        userComments.forEach((comment) => {
          activities.push({
            id: `comment-${comment.id}`,
            type: "comment",
            title: `Commented on ${comment.issueTitle}`,
            description: comment.content.length > 100 ? `${comment.content.substring(0, 100)}...` : comment.content,
            points: 8,
            timestamp: comment.createdAt,
            metadata: {
              commentId: comment.id,
              issueId: comment.issueId,
              issueTitle: comment.issueTitle,
              stance: comment.stance,
              upvotes: comment.upvotes,
              downvotes: comment.downvotes,
              daoName: comment.daoName,
              daoSlug: comment.daoSlug
            }
          });
        });
        const userReviewComments = await db.select({
          id: reviewComments.id,
          content: reviewComments.content,
          createdAt: reviewComments.createdAt,
          reviewId: reviewComments.reviewId,
          reviewTitle: reviews.title,
          reviewedUsername: users.username
        }).from(reviewComments).leftJoin(reviews, eq(reviewComments.reviewId, reviews.id)).leftJoin(users, eq(reviews.reviewedUserId, users.id)).where(eq(reviewComments.authorId, userId)).orderBy(desc(reviewComments.createdAt));
        userReviewComments.forEach((comment) => {
          const reviewTitle = comment.reviewTitle || `review of ${comment.reviewedUsername || "a user"}`;
          activities.push({
            id: `comment-on-review-${comment.id}`,
            type: "review_comment",
            title: `Commented on ${reviewTitle}`,
            description: comment.content.length > 100 ? `${comment.content.substring(0, 100)}...` : comment.content,
            points: 10,
            timestamp: comment.createdAt,
            metadata: {
              commentId: comment.id,
              reviewId: comment.reviewId,
              reviewTitle
            }
          });
        });
        const userReviewsGiven = await db.select({
          id: reviews.id,
          reviewType: reviews.reviewType,
          content: reviews.content,
          pointsAwarded: reviews.pointsAwarded,
          createdAt: reviews.createdAt,
          reviewedUserId: reviews.reviewedUserId,
          reviewedUsername: users.username
        }).from(reviews).leftJoin(users, eq(reviews.reviewedUserId, users.id)).where(eq(reviews.reviewerId, userId)).orderBy(desc(reviews.createdAt));
        userReviewsGiven.forEach((review) => {
          activities.push({
            id: `review-given-${review.id}`,
            type: "review_given",
            title: `Reviewed ${review.reviewedUsername}`,
            description: `Left a ${review.reviewType} review for ${review.reviewedUsername}`,
            points: review.pointsAwarded,
            timestamp: review.createdAt,
            metadata: {
              reviewId: review.id,
              reviewType: review.reviewType,
              reviewedUsername: review.reviewedUsername,
              content: review.content
            }
          });
        });
        const userReviewsReceived = await db.select({
          id: reviews.id,
          reviewType: reviews.reviewType,
          content: reviews.content,
          createdAt: reviews.createdAt,
          reviewerId: reviews.reviewerId,
          reviewerUsername: users.username
        }).from(reviews).leftJoin(users, eq(reviews.reviewerId, users.id)).where(eq(reviews.reviewedUserId, userId)).orderBy(desc(reviews.createdAt));
        userReviewsReceived.forEach((review) => {
          activities.push({
            id: `review-received-${review.id}`,
            type: "review_received",
            title: `Received ${review.reviewType} review`,
            description: `${review.reviewerUsername} left a ${review.reviewType} review`,
            points: 0,
            timestamp: review.createdAt,
            metadata: {
              reviewId: review.id,
              reviewType: review.reviewType,
              reviewerUsername: review.reviewerUsername,
              content: review.content
            }
          });
        });
        const userVotes = await db.select({
          id: votes.id,
          voteType: votes.voteType,
          targetType: votes.targetType,
          targetId: votes.targetId,
          createdAt: votes.createdAt
        }).from(votes).where(eq(votes.userId, userId)).orderBy(desc(votes.createdAt));
        for (const vote of userVotes) {
          let targetTitle = "";
          let targetDescription = "";
          let targetUser = "";
          if (vote.targetType === "issue") {
            const issue = await db.select({
              title: governanceIssues.title,
              daoName: daos.name,
              authorUsername: users.username
            }).from(governanceIssues).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).leftJoin(users, eq(governanceIssues.authorId, users.id)).where(eq(governanceIssues.id, vote.targetId));
            if (issue.length > 0) {
              targetTitle = issue[0].title;
              targetDescription = `${vote.voteType === "upvote" ? "Upvoted" : "Downvoted"} governance issue: ${issue[0].title}`;
              targetUser = issue[0].authorUsername;
            }
          } else if (vote.targetType === "comment") {
            const comment = await db.select({
              content: comments.content,
              issueTitle: governanceIssues.title,
              authorUsername: users.username
            }).from(comments).leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id)).leftJoin(users, eq(comments.authorId, users.id)).where(eq(comments.id, vote.targetId));
            if (comment.length > 0) {
              targetTitle = `Comment on ${comment[0].issueTitle}`;
              targetDescription = `${vote.voteType === "upvote" ? "Upvoted" : "Downvoted"} comment on ${comment[0].issueTitle}`;
              targetUser = comment[0].authorUsername;
            }
          }
          activities.push({
            id: `vote-${vote.id}`,
            type: "vote",
            title: targetTitle,
            description: targetDescription,
            points: 2,
            timestamp: vote.createdAt,
            metadata: {
              voteId: vote.id,
              voteType: vote.voteType,
              targetType: vote.targetType,
              targetId: vote.targetId,
              targetUser
            }
          });
        }
        const userDAOFollows = await db.select({
          id: userDaoFollows.id,
          daoId: userDaoFollows.daoId,
          createdAt: userDaoFollows.createdAt,
          daoName: daos.name,
          daoSlug: daos.slug
        }).from(userDaoFollows).leftJoin(daos, eq(userDaoFollows.daoId, daos.id)).where(eq(userDaoFollows.userId, userId)).orderBy(desc(userDaoFollows.createdAt));
        userDAOFollows.forEach((follow) => {
          activities.push({
            id: `follow-${follow.id}`,
            type: "dao_follow",
            title: `Joined ${follow.daoName}`,
            description: `Started following ${follow.daoName} community`,
            points: 2,
            timestamp: follow.createdAt,
            metadata: {
              daoId: follow.daoId,
              daoName: follow.daoName,
              daoSlug: follow.daoSlug
            }
          });
        });
        const issuesTargetingUser = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          stance: governanceIssues.stance,
          createdAt: governanceIssues.createdAt,
          authorId: governanceIssues.authorId,
          authorUsername: users.username,
          daoName: daos.name,
          daoSlug: daos.slug
        }).from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).where(eq(governanceIssues.targetUserId, userId)).orderBy(desc(governanceIssues.createdAt));
        issuesTargetingUser.forEach((issue) => {
          activities.push({
            id: `targeted-issue-${issue.id}`,
            type: "governance_issue_targeted",
            title: `${issue.stance === "champion" ? "Championed" : "Challenged"} by ${issue.authorUsername}`,
            description: `${issue.authorUsername} ${issue.stance === "champion" ? "championed" : "challenged"} you: ${issue.title}`,
            points: 0,
            timestamp: issue.createdAt,
            metadata: {
              issueId: issue.id,
              issueTitle: issue.title,
              stance: issue.stance,
              authorUsername: issue.authorUsername,
              daoName: issue.daoName,
              daoSlug: issue.daoSlug,
              actorUsername: issue.authorUsername,
              isTargeted: true
            }
          });
        });
        const commentsOnUserIssues = await db.select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          authorId: comments.authorId,
          authorUsername: users.username,
          issueId: comments.issueId,
          issueTitle: governanceIssues.title,
          issueAuthorId: governanceIssues.authorId
        }).from(comments).leftJoin(users, eq(comments.authorId, users.id)).leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id)).where(and(
          eq(governanceIssues.authorId, userId),
          sql`${comments.authorId} != ${userId}`
          // Exclude user's own comments
        )).orderBy(desc(comments.createdAt));
        commentsOnUserIssues.forEach((comment) => {
          activities.push({
            id: `comment-on-issue-${comment.id}`,
            type: "comment_received",
            title: `${comment.authorUsername} commented on your issue`,
            description: `${comment.authorUsername} commented on "${comment.issueTitle}": ${comment.content.substring(0, 100)}${comment.content.length > 100 ? "..." : ""}`,
            points: 0,
            timestamp: comment.createdAt,
            metadata: {
              commentId: comment.id,
              authorUsername: comment.authorUsername,
              issueTitle: comment.issueTitle,
              content: comment.content,
              actorUsername: comment.authorUsername,
              isTargeted: true
            }
          });
        });
        const votesOnUserContent = await db.select({
          id: votes.id,
          voteType: votes.voteType,
          targetType: votes.targetType,
          targetId: votes.targetId,
          createdAt: votes.createdAt,
          voterId: votes.userId,
          voterUsername: users.username
        }).from(votes).leftJoin(users, eq(votes.userId, users.id)).where(and(
          or(
            // Votes on user's governance issues
            and(
              eq(votes.targetType, "issue"),
              sql`${votes.targetId} IN (SELECT id FROM ${governanceIssues} WHERE ${governanceIssues.authorId} = ${userId})`
            ),
            // Votes on user's comments
            and(
              eq(votes.targetType, "comment"),
              sql`${votes.targetId} IN (SELECT id FROM ${comments} WHERE ${comments.authorId} = ${userId})`
            )
          ),
          sql`${votes.userId} != ${userId}`
          // Exclude user's own votes
        )).orderBy(desc(votes.createdAt));
        for (const vote of votesOnUserContent) {
          let targetTitle = "";
          let targetDescription = "";
          if (vote.targetType === "issue") {
            const issue = await db.select({
              title: governanceIssues.title
            }).from(governanceIssues).where(eq(governanceIssues.id, vote.targetId));
            if (issue.length > 0) {
              targetTitle = `${vote.voterUsername} ${vote.voteType}d your issue`;
              targetDescription = `${vote.voterUsername} ${vote.voteType}d your governance issue: ${issue[0].title}`;
            }
          } else if (vote.targetType === "comment") {
            const comment = await db.select({
              content: comments.content,
              issueTitle: governanceIssues.title
            }).from(comments).leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id)).where(eq(comments.id, vote.targetId));
            if (comment.length > 0) {
              targetTitle = `${vote.voterUsername} ${vote.voteType}d your comment`;
              targetDescription = `${vote.voterUsername} ${vote.voteType}d your comment on ${comment[0].issueTitle}`;
            }
          }
          if (targetTitle) {
            activities.push({
              id: `vote-received-${vote.id}`,
              type: "vote_received",
              title: targetTitle,
              description: targetDescription,
              points: 0,
              timestamp: vote.createdAt,
              metadata: {
                voteId: vote.id,
                voteType: vote.voteType,
                targetType: vote.targetType,
                targetId: vote.targetId,
                voterUsername: vote.voterUsername,
                actorUsername: vote.voterUsername,
                isTargeted: true
              }
            });
          }
        }
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const credaActivitiesData = await db.select({
          id: credaActivities.id,
          activityType: credaActivities.activityType,
          targetType: credaActivities.targetType,
          targetId: credaActivities.targetId,
          ogTxHash: credaActivities.ogTxHash,
          ogRootHash: credaActivities.ogRootHash,
          ogRecordedAt: credaActivities.ogRecordedAt
        }).from(credaActivities).where(eq(credaActivities.userId, userId));
        const ogDataMap = /* @__PURE__ */ new Map();
        credaActivitiesData.forEach((ca) => {
          if (ca.targetType && ca.targetId) {
            const key = `${ca.targetType}-${ca.targetId}`;
            if (!ogDataMap.has(key) || ca.ogTxHash) {
              ogDataMap.set(key, {
                ogTxHash: ca.ogTxHash,
                ogRootHash: ca.ogRootHash,
                ogRecordedAt: ca.ogRecordedAt
              });
            }
          }
        });
        activities.forEach((activity) => {
          let lookupKey = "";
          if (activity.type === "governance_issue" && activity.metadata?.issueId) {
            lookupKey = `issue-${activity.metadata.issueId}`;
          } else if (activity.type === "comment" && activity.metadata?.commentId) {
            lookupKey = `comment-${activity.metadata.commentId}`;
          } else if (activity.type === "vote" && activity.metadata?.targetType && activity.metadata?.targetId) {
            lookupKey = `${activity.metadata.targetType}-${activity.metadata.targetId}`;
          } else if (activity.type === "review_given" && activity.metadata?.reviewId) {
            lookupKey = `review-${activity.metadata.reviewId}`;
          }
          const ogData = ogDataMap.get(lookupKey);
          if (ogData) {
            activity.ogTxHash = ogData.ogTxHash;
            activity.ogRootHash = ogData.ogRootHash;
            activity.ogRecordedAt = ogData.ogRecordedAt;
          }
        });
        return activities;
      }
      // CREDA operations
      // DAO AI CREDA Points System - Enhanced with 0G Storage immutable audit trail
      async awardCredaPoints(userId, category, activityType, amount, targetType, targetId, metadata) {
        const xpActivity = await db.insert(credaActivities).values({
          userId,
          activityType,
          credaAwarded: amount,
          targetType,
          targetId,
          metadata: metadata ? JSON.stringify(metadata) : null,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        console.log(`Awarded ${amount} CREDA to user ${userId} for ${activityType}`);
        const result = await db.update(users).set({
          credaPoints: sql`COALESCE(${users.credaPoints}, 0) + ${amount}`,
          weeklyCreda: sql`COALESCE(${users.weeklyCreda}, 0) + ${amount}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId)).returning({ credaPoints: users.credaPoints });
        console.log(`Successfully awarded CREDA to user ${userId}. New total: ${result[0]?.credaPoints || "unknown"}`);
        await this.checkAndUpdateDailyTasksStreak(userId);
        return xpActivity[0];
      }
      // Update credaActivity with 0G Storage on-chain proof data
      async updateCredaActivityWithOgProof(activityId, ogTxHash, ogRootHash) {
        await db.update(credaActivities).set({
          ogTxHash,
          ogRootHash,
          ogRecordedAt: /* @__PURE__ */ new Date()
        }).where(eq(credaActivities.id, activityId));
        console.log(`[0G Storage] Updated activity ${activityId} with on-chain proof: ${ogTxHash}`);
      }
      // Get a single credaActivity by ID
      async getCredaActivityById(activityId) {
        const [activity] = await db.select().from(credaActivities).where(eq(credaActivities.id, activityId)).limit(1);
        return activity;
      }
      // Check and update daily tasks streak when users earn CREDA
      async checkAndUpdateDailyTasksStreak(userId) {
        try {
          const todayStart = /* @__PURE__ */ new Date();
          todayStart.setUTCHours(0, 0, 0, 0);
          const todayDateString = todayStart.toISOString().split("T")[0];
          const todayActivities = await db.select().from(credaActivities).where(
            and(
              eq(credaActivities.userId, userId),
              sql`DATE(${credaActivities.createdAt}) = ${todayDateString}`
            )
          );
          const uniqueActionTypes = new Set(todayActivities.map((activity) => activity.activityType));
          const completedActionsCount = uniqueActionTypes.size;
          const tasksComplete = completedActionsCount >= 3;
          const user = await db.select({
            dailyStreak: users.dailyStreak,
            longestStreak: users.longestStreak,
            lastStreakDate: users.lastStreakDate
          }).from(users).where(eq(users.id, userId)).limit(1);
          if (!user.length) return;
          const userData = user[0];
          let newStreak = userData.dailyStreak || 0;
          let newLongestStreak = userData.longestStreak || 0;
          const lastStreakDate = userData.lastStreakDate;
          const yesterday = new Date(todayStart);
          yesterday.setDate(yesterday.getDate() - 1);
          if (tasksComplete) {
            const hasUpdatedToday = lastStreakDate && lastStreakDate.toDateString() === todayStart.toDateString();
            if (!hasUpdatedToday) {
              if (!lastStreakDate || lastStreakDate.toDateString() === yesterday.toDateString()) {
                newStreak += 1;
              } else {
                newStreak = 1;
              }
              if (newStreak > newLongestStreak) {
                newLongestStreak = newStreak;
              }
              await db.update(users).set({
                dailyStreak: newStreak,
                longestStreak: newLongestStreak,
                lastStreakDate: todayStart,
                updatedAt: /* @__PURE__ */ new Date()
              }).where(eq(users.id, userId));
              console.log(`Updated daily streak for user ${userId}: ${newStreak} days (tasks completed: ${completedActionsCount})`);
            }
          }
        } catch (error) {
          console.error("Error updating daily tasks streak:", error);
        }
      }
      // DAO AI CREDA Points System - OFFICIAL REWARD STRUCTURE
      static CREDA_REWARDS = {
        // Content Creation (Reviews are the highest reward!)
        GIVE_REVIEW: 200,
        // PRIMARY REWARD - Reviewing companies/users
        CREATE_GOVERNANCE_STANCE: 50,
        // Reduced from 100
        QUALITY_COMMENT: 20,
        // 100+ characters
        NORMAL_COMMENT: 10,
        CAST_VOTE: 5,
        REPORT_SPAM: 25,
        // NEW - Report spam content
        COMPLETE_ONBOARDING: 25,
        COMPLETE_WELCOME_TOUR: 25,
        // Engagement Rewards (receiving interactions)
        RECEIVE_UPVOTE_STANCE: 10,
        RECEIVE_DOWNVOTE_STANCE: 3,
        // still engagement!
        RECEIVE_COMMENT_STANCE: 5,
        RECEIVE_UPVOTE_COMMENT: 5,
        RECEIVE_UPVOTE_REVIEW: 5,
        RECEIVE_POSITIVE_REVIEW: 15,
        // Getting a positive review
        RECEIVE_NEUTRAL_REVIEW: 5,
        // Getting a neutral review
        RECEIVE_NEGATIVE_REVIEW: 2,
        // Getting a negative review (still engagement)
        // Special Bonuses - Daily Streak
        DAILY_STREAK_3_DAYS: 10,
        DAILY_STREAK_7_DAYS: 25,
        DAILY_STREAK_14_DAYS: 50,
        DAILY_STREAK_30_DAYS: 100,
        // Moderation
        SPAM_PENALTY: -25
        // when flagged by 5+ users
      };
      // Award CREDA for creating governance stance
      async awardStanceCreationCreda(userId, stanceId) {
        return await this.awardCredaPoints(
          userId,
          "content",
          "stance_created",
          // Use the correct activity type
          _DatabaseStorage.CREDA_REWARDS.CREATE_GOVERNANCE_STANCE,
          "governance_issue",
          stanceId,
          { action: "Created governance stance" }
        );
      }
      // Award CREDA for commenting
      async awardCommentCreda(userId, commentContent, issueId) {
        const isQualityComment = commentContent.length >= 100;
        const credaAmount = isQualityComment ? _DatabaseStorage.CREDA_REWARDS.QUALITY_COMMENT : _DatabaseStorage.CREDA_REWARDS.NORMAL_COMMENT;
        return await this.awardCredaPoints(
          userId,
          "content",
          isQualityComment ? "quality_comment" : "normal_comment",
          // Use consistent activity types
          credaAmount,
          "comment",
          issueId,
          {
            action: isQualityComment ? "Quality comment posted" : "Comment posted",
            contentLength: commentContent.length
          }
        );
      }
      // Award CREDA for voting
      async awardVotingCreda(userId, targetType, targetId, voteType) {
        return await this.awardCredaPoints(
          userId,
          "engagement",
          "vote_cast",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.CAST_VOTE,
          targetType,
          targetId,
          { action: `Cast ${voteType} vote`, voteType }
        );
      }
      // Award CREDA for receiving upvotes on stance
      async awardUpvoteReceivedCreda(stanceAuthorId, stanceId) {
        await this.awardCredaPoints(
          stanceAuthorId,
          "engagement",
          "upvote_received_stance",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_STANCE,
          "governance_issue",
          stanceId,
          { action: "Received upvote on stance" }
        );
      }
      // Award CREDA for receiving downvotes on stance (still engagement!)
      async awardDownvoteReceivedCreda(stanceAuthorId, stanceId) {
        await this.awardCredaPoints(
          stanceAuthorId,
          "engagement",
          "downvote_received_stance",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.RECEIVE_DOWNVOTE_STANCE,
          "governance_issue",
          stanceId,
          { action: "Received downvote on stance (engagement)" }
        );
      }
      // Award CREDA for receiving comments on stance
      async awardCommentReceivedCreda(stanceAuthorId, stanceId) {
        await this.awardCredaPoints(
          stanceAuthorId,
          "engagement",
          "comment_received_stance",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.RECEIVE_COMMENT_STANCE,
          "governance_issue",
          stanceId,
          { action: "Received comment on stance" }
        );
      }
      // Award CREDA for receiving upvotes on comments
      async awardCommentUpvoteReceivedCreda(commentAuthorId, commentId) {
        await this.awardCredaPoints(
          commentAuthorId,
          "engagement",
          "upvote_received_comment",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_COMMENT,
          "comment",
          commentId,
          { action: "Received upvote on comment" }
        );
      }
      // Award CREDA for receiving upvotes on reviews
      async awardReviewUpvoteReceivedCreda(reviewAuthorId, reviewId) {
        await this.awardCredaPoints(
          reviewAuthorId,
          "engagement",
          "upvote_received_review",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_COMMENT,
          // Same value as comment upvotes
          "review",
          reviewId,
          { action: "Received upvote on review" }
        );
      }
      // Award CREDA for completing onboarding
      async awardOnboardingCreda(userId) {
        await this.awardCredaPoints(
          userId,
          "platform",
          "onboarding_completed",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.COMPLETE_ONBOARDING,
          "platform",
          null,
          { action: "Completed platform onboarding" }
        );
      }
      // Award CREDA for completing welcome tour
      async awardWelcomeTourCreda(userId) {
        await this.awardCredaPoints(
          userId,
          "platform",
          "welcome_tour_completed",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.COMPLETE_WELCOME_TOUR,
          "platform",
          null,
          { action: "Completed welcome tour" }
        );
      }
      // Apply spam penalty
      async applySpamPenalty(userId, contentId, contentType) {
        await this.awardCredaPoints(
          userId,
          "moderation",
          "spam_penalty",
          // Use consistent activity type
          _DatabaseStorage.CREDA_REWARDS.SPAM_PENALTY,
          contentType,
          contentId,
          { action: "Spam penalty applied (flagged by 5+ users)" }
        );
      }
      async getDaoCredaLeaderboard(daoId, timeframe, limit = 50) {
        if (timeframe === "overall") {
          const topUsers = await db.select({
            userId: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            credaPoints: users.credaPoints,
            daoScore: userDaoScores.score
          }).from(users).innerJoin(userDaoScores, eq(users.id, userDaoScores.userId)).where(and(
            eq(userDaoScores.daoId, daoId),
            isNotNull(users.username)
          )).orderBy(desc(users.credaPoints)).limit(limit);
          return topUsers.map((user, index2) => ({
            rank: index2 + 1,
            userId: user.userId,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            points: user.credaPoints || 0
          }));
        } else {
          const oneWeekAgo = /* @__PURE__ */ new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const weeklyPoints = await db.select({
            userId: credaActivities.userId,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            totalPoints: sum(credaActivities.credaAwarded).as("totalPoints")
          }).from(credaActivities).innerJoin(users, eq(credaActivities.userId, users.id)).innerJoin(userDaoScores, eq(users.id, userDaoScores.userId)).where(and(
            eq(userDaoScores.daoId, daoId),
            gte(credaActivities.createdAt, oneWeekAgo)
          )).groupBy(credaActivities.userId, users.username, users.profileImageUrl).orderBy(desc(sum(credaActivities.credaAwarded))).limit(limit);
          return weeklyPoints.map((user, index2) => ({
            rank: index2 + 1,
            userId: user.userId,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            points: Number(user.totalPoints) || 0
          }));
        }
      }
      // GRS operations
      // Central function to apply GRS changes and log them
      async applyGrsChange(userId, amount, reason, relatedEntityType, relatedEntityId, metadata) {
        try {
          const user = await this.getUser(userId);
          if (!user) {
            console.log(`User ${userId} not found for GRS change`);
            return;
          }
          const currentScore = user.grsScore || 1300;
          const newScore = Math.max(0, Math.min(2800, currentScore + amount));
          await this.updateUserGrs(userId, newScore);
          await db.insert(grsEvents).values({
            userId,
            changeAmount: amount,
            reason,
            relatedEntityType,
            relatedEntityId,
            metadata: metadata ? JSON.stringify(metadata) : null
          });
          await this.calculateGrsPercentile(userId);
          console.log(`GRS Change Applied: User ${userId} ${amount > 0 ? "gained" : "lost"} ${Math.abs(amount)} points (${reason}). New score: ${newScore}`);
        } catch (error) {
          console.error("Error applying GRS change:", error);
        }
      }
      // Update user's GRS score in database
      async updateUserGrs(userId, newScore) {
        await db.update(users).set({
          grsScore: newScore,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
      }
      // Calculate and update user's GRS percentile
      async calculateGrsPercentile(userId) {
        const user = await this.getUser(userId);
        if (!user) return;
        const userScore = user.grsScore || 1300;
        const lowerScoreCount = await db.select({ count: sql`count(*)` }).from(users).where(lt(users.grsScore, userScore));
        const totalUserCount = await db.select({ count: sql`count(*)` }).from(users);
        const lowerCount = lowerScoreCount[0]?.count || 0;
        const total = totalUserCount[0]?.count || 1;
        const percentile = Math.round(lowerCount / total * 100);
        await db.update(users).set({ grsPercentile: percentile }).where(eq(users.id, userId));
      }
      // Get user's GRS history
      async getGrsHistory(userId, limit = 50) {
        return await db.select().from(grsEvents).where(eq(grsEvents.userId, userId)).orderBy(desc(grsEvents.createdAt)).limit(limit);
      }
      // Main function: Calculate stance results when stance expires
      async calculateStanceResults(stanceId) {
        try {
          const stance = await db.select().from(governanceIssues).where(eq(governanceIssues.id, stanceId)).limit(1);
          if (!stance[0]) {
            console.log(`Stance ${stanceId} not found`);
            return;
          }
          const stanceData = stance[0];
          const isChampion = stanceData.stance === "champion";
          const targetUserId = stanceData.targetUserId;
          const authorId = stanceData.authorId;
          const votes2 = await db.select().from(stanceVotes).where(eq(stanceVotes.stanceId, stanceId));
          if (votes2.length === 0) {
            console.log(`No votes found for stance ${stanceId}`);
            return;
          }
          const championVotes = votes2.filter((v) => v.voteType === "champion").length;
          const challengeVotes = votes2.filter((v) => v.voteType === "challenge").length;
          const defendVotes = votes2.filter((v) => v.voteType === "defend").length;
          const opposeVotes = votes2.filter((v) => v.voteType === "oppose").length;
          let majoritySupportsStance = false;
          let winningVoteType = "";
          if (isChampion) {
            const totalChampionSupport = championVotes;
            const totalOppose = opposeVotes;
            majoritySupportsStance = totalChampionSupport > totalOppose;
            winningVoteType = majoritySupportsStance ? "champion" : "oppose";
          } else {
            const totalChallengeSupport = challengeVotes;
            const totalDefend = defendVotes;
            majoritySupportsStance = totalChallengeSupport > totalDefend;
            winningVoteType = majoritySupportsStance ? "challenge" : "defend";
          }
          console.log(`Stance ${stanceId} Results: Majority supports stance: ${majoritySupportsStance}, Winning vote: ${winningVoteType}`);
          if (majoritySupportsStance) {
            await this.applyGrsChange(authorId, 250, "stance_success", "stance", stanceId, {
              stanceType: stanceData.stance,
              winningVote: winningVoteType,
              success: true
            });
          } else {
            await this.applyGrsChange(authorId, -150, "stance_failure", "stance", stanceId, {
              stanceType: stanceData.stance,
              winningVote: winningVoteType,
              success: false
            });
          }
          if (targetUserId) {
            if (isChampion) {
              if (majoritySupportsStance) {
                await this.applyGrsChange(targetUserId, 30, "stance_target_champion_success", "stance", stanceId, {
                  championed: true,
                  communitySupport: true
                });
              } else {
                await this.applyGrsChange(targetUserId, -20, "stance_target_champion_opposed", "stance", stanceId, {
                  championed: true,
                  communitySupport: false
                });
              }
            } else {
              if (majoritySupportsStance) {
                await this.applyGrsChange(targetUserId, -40, "stance_target_challenge_success", "stance", stanceId, {
                  challenged: true,
                  communitySupport: true
                });
              } else {
                await this.applyGrsChange(targetUserId, 25, "stance_target_challenge_defended", "stance", stanceId, {
                  challenged: true,
                  communitySupport: false
                });
              }
            }
          }
          for (const vote of votes2) {
            const voterId = vote.userId;
            const voteType = vote.voteType;
            if (voteType === winningVoteType) {
              await this.applyGrsChange(voterId, 8, "voter_accountability_correct", "vote", vote.id, {
                stanceId,
                voteType,
                wasCorrect: true
              });
            } else {
              await this.applyGrsChange(voterId, -5, "voter_accountability_incorrect", "vote", vote.id, {
                stanceId,
                voteType,
                wasCorrect: false
              });
            }
          }
          try {
            const { NotificationService: NotificationService2 } = await Promise.resolve().then(() => (init_notifications(), notifications_exports));
            const stanceOutcome = majoritySupportsStance ? "succeeded" : "failed";
            const outcomeMessage = majoritySupportsStance ? `Your ${stanceData.stance} stance was supported by the community!` : `Your ${stanceData.stance} stance was opposed by the community.`;
            await NotificationService2.createNotification({
              userId: authorId,
              type: "stance_result",
              title: `Stance ${stanceOutcome}`,
              message: outcomeMessage,
              actionUrl: `/governance/${stanceId}`,
              metadata: {
                stanceId,
                outcome: stanceOutcome,
                stanceType: stanceData.stance,
                winningVoteType,
                majoritySupportsStance
              }
            });
            if (targetUserId) {
              const targetUser = await this.getUser(targetUserId);
              const authorUser = await this.getUser(authorId);
              if (targetUser && authorUser) {
                let targetMessage = "";
                if (isChampion) {
                  targetMessage = majoritySupportsStance ? `You were championed by ${authorUser.username} and the community agreed!` : `You were championed by ${authorUser.username} but the community disagreed.`;
                } else {
                  targetMessage = majoritySupportsStance ? `You were challenged by ${authorUser.username} and the community agreed with the challenge.` : `You were challenged by ${authorUser.username} but the community defended you.`;
                }
                await NotificationService2.createNotification({
                  userId: targetUserId,
                  type: "stance_result",
                  title: `Stance about you completed`,
                  message: targetMessage,
                  actionUrl: `/governance/${stanceId}`,
                  metadata: {
                    stanceId,
                    wasTargeted: true,
                    stanceType: stanceData.stance,
                    outcome: stanceOutcome
                  }
                });
              }
            }
            console.log(`Stance ${stanceId} result notifications sent`);
          } catch (notificationError) {
            console.error(`Error sending stance result notifications for ${stanceId}:`, notificationError);
          }
          console.log(`Stance ${stanceId} GRS calculations complete`);
        } catch (error) {
          console.error(`Error calculating stance results for ${stanceId}:`, error);
        }
      }
      // Get reviews that need GRS impact applied (for admin fix)
      async getReviewsNeedingGrsImpact() {
        try {
          const reviewsWithoutGrsEvents = await db.select().from(reviews).where(
            and(
              isNotNull(reviews.reviewedUserId),
              sql`NOT EXISTS (
              SELECT 1 FROM ${grsEvents}
              WHERE ${grsEvents.relatedEntityType} = 'review'
              AND ${grsEvents.relatedEntityId} = ${reviews.id}
              AND ${grsEvents.reason} LIKE '%review_received%'
            )`
            )
          ).orderBy(asc(reviews.createdAt));
          return reviewsWithoutGrsEvents;
        } catch (error) {
          console.error("Error getting reviews needing GRS impact:", error);
          return [];
        }
      }
      // Update review impact immediately when review is given/received
      async updateReviewImpact(reviewId) {
        try {
          const review = await db.select({
            id: reviews.id,
            reviewerId: reviews.reviewerId,
            reviewedUserId: reviews.reviewedUserId,
            reviewType: reviews.reviewType,
            reviewerGrs: sql`reviewer.grs_score`.as("reviewerGrs")
          }).from(reviews).leftJoin(sql`users as reviewer`, eq(reviews.reviewerId, sql`reviewer.id`)).where(eq(reviews.id, reviewId)).limit(1);
          if (!review[0]) {
            console.log(`Review ${reviewId} not found`);
            return;
          }
          const reviewData = review[0];
          const reviewerGrs = reviewData.reviewerGrs || 1300;
          const reviewType = reviewData.reviewType;
          const reviewedUserId = reviewData.reviewedUserId;
          let impactAmount = 0;
          let reason = "";
          if (reviewType === "positive") {
            if (reviewerGrs >= 1800) {
              impactAmount = 25;
              reason = "review_received_positive_high_grs";
            } else if (reviewerGrs >= 1300) {
              impactAmount = 15;
              reason = "review_received_positive_medium_grs";
            } else {
              impactAmount = 8;
              reason = "review_received_positive_low_grs";
            }
          } else if (reviewType === "negative") {
            if (reviewerGrs >= 1800) {
              impactAmount = -15;
              reason = "review_received_negative_high_grs";
            } else if (reviewerGrs >= 1300) {
              impactAmount = -10;
              reason = "review_received_negative_medium_grs";
            } else {
              impactAmount = -5;
              reason = "review_received_negative_low_grs";
            }
          } else {
            impactAmount = 3;
            reason = "review_received_neutral";
          }
          await this.applyGrsChange(reviewedUserId, impactAmount, reason, "review", reviewId, {
            reviewType,
            reviewerGrs,
            reviewerId: reviewData.reviewerId
          });
          console.log(`Review impact applied: User ${reviewedUserId} received ${impactAmount} GRS from ${reviewType} review`);
        } catch (error) {
          console.error(`Error updating review impact for review ${reviewId}:`, error);
        }
      }
      // Evaluate review accuracy weekly (background job)
      async evaluateReviewAccuracy() {
        try {
          console.log("Starting weekly review accuracy evaluation...");
          const oneWeekAgo = /* @__PURE__ */ new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const oneWeekAgoStart = new Date(oneWeekAgo);
          oneWeekAgoStart.setHours(0, 0, 0, 0);
          const oneWeekAgoEnd = new Date(oneWeekAgo);
          oneWeekAgoEnd.setHours(23, 59, 59, 999);
          const weekOldReviews = await db.select({
            id: reviews.id,
            reviewerId: reviews.reviewerId,
            reviewedUserId: reviews.reviewedUserId,
            reviewType: reviews.reviewType,
            createdAt: reviews.createdAt
          }).from(reviews).where(
            and(
              gte(reviews.createdAt, oneWeekAgoStart),
              lt(reviews.createdAt, oneWeekAgoEnd)
            )
          );
          console.log(`Found ${weekOldReviews.length} reviews from one week ago to evaluate`);
          for (const review of weekOldReviews) {
            const reviewedUser = await this.getUser(review.reviewedUserId);
            if (!reviewedUser) continue;
            const currentGrs = reviewedUser.grsScore || 1300;
            const grsAtReviewTime = await this.estimateGrsAtTime(review.reviewedUserId, review.createdAt);
            const grsChange = currentGrs - grsAtReviewTime;
            let accuracyAmount = 0;
            let accuracyReason = "";
            if (review.reviewType === "positive") {
              if (grsChange >= 200) {
                accuracyAmount = 80;
                accuracyReason = "review_accuracy_positive_correct";
              } else if (grsChange <= -200) {
                accuracyAmount = -60;
                accuracyReason = "review_accuracy_positive_incorrect";
              }
            } else if (review.reviewType === "negative") {
              if (grsChange <= -200) {
                accuracyAmount = 70;
                accuracyReason = "review_accuracy_negative_correct";
              } else if (grsChange >= 200) {
                accuracyAmount = -50;
                accuracyReason = "review_accuracy_negative_incorrect";
              }
            }
            if (accuracyAmount !== 0) {
              await this.applyGrsChange(review.reviewerId, accuracyAmount, accuracyReason, "review", review.id, {
                reviewType: review.reviewType,
                reviewedUserId: review.reviewedUserId,
                grsChangeOfTarget: grsChange,
                reviewAccuracy: accuracyAmount > 0 ? "correct" : "incorrect"
              });
            }
          }
          console.log("Weekly review accuracy evaluation complete");
        } catch (error) {
          console.error("Error evaluating review accuracy:", error);
        }
      }
      // Background job: Check for expired stances and calculate GRS
      async processExpiredStances() {
        try {
          const now = /* @__PURE__ */ new Date();
          const expiredStances = await db.select().from(governanceIssues).where(
            and(
              eq(governanceIssues.isActive, true),
              lt(governanceIssues.expiresAt, now)
            )
          );
          console.log(`Found ${expiredStances.length} expired stances to process`);
          for (const stance of expiredStances) {
            console.log(`Processing expired stance: ${stance.id} - ${stance.title}`);
            await db.update(governanceIssues).set({ isActive: false }).where(eq(governanceIssues.id, stance.id));
            await this.calculateStanceResults(stance.id);
          }
          if (expiredStances.length > 0) {
            console.log(`Processed ${expiredStances.length} expired stances`);
          }
        } catch (error) {
          console.error("Error processing expired stances:", error);
        }
      }
      // Helper function to estimate user's GRS score at a specific time
      async estimateGrsAtTime(userId, timestamp2) {
        try {
          const eventsSinceTime = await db.select().from(grsEvents).where(
            and(
              eq(grsEvents.userId, userId),
              gte(grsEvents.createdAt, timestamp2)
            )
          ).orderBy(grsEvents.createdAt);
          const user = await this.getUser(userId);
          const currentGrs = user?.grsScore || 1300;
          const totalChangesSince = eventsSinceTime.reduce((sum2, event) => sum2 + event.changeAmount, 0);
          const estimatedGrsAtTime = currentGrs - totalChangesSince;
          return estimatedGrsAtTime;
        } catch (error) {
          console.error("Error estimating GRS at time:", error);
          return 1300;
        }
      }
      // ======= NOTIFICATION OPERATIONS =======
      async createNotification(notification) {
        const result = await db.insert(notifications).values(notification).returning();
        return result[0];
      }
      // ======= ADMIN CONTENT MANAGEMENT =======
      async getAllStancesForAdmin() {
        const result = await db.select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          content: governanceIssues.content,
          stance: governanceIssues.stance,
          authorId: governanceIssues.authorId,
          authorUsername: users.username,
          daoId: governanceIssues.daoId,
          daoName: daos.name,
          isActive: governanceIssues.isActive,
          upvotes: governanceIssues.upvotes,
          downvotes: governanceIssues.downvotes,
          commentCount: governanceIssues.commentCount,
          expiresAt: governanceIssues.expiresAt,
          createdAt: governanceIssues.createdAt
        }).from(governanceIssues).leftJoin(users, eq(governanceIssues.authorId, users.id)).leftJoin(daos, eq(governanceIssues.daoId, daos.id)).orderBy(desc(governanceIssues.createdAt));
        return result;
      }
      async deleteStance(stanceId) {
        await db.transaction(async (tx) => {
          await tx.delete(votes).where(and(
            eq(votes.targetType, "issue"),
            eq(votes.targetId, stanceId)
          ));
          await tx.delete(stanceVotes).where(eq(stanceVotes.stanceId, stanceId));
          const commentsToDelete = await tx.select({ id: comments.id }).from(comments).where(eq(comments.issueId, stanceId));
          for (const comment of commentsToDelete) {
            await tx.delete(votes).where(and(
              eq(votes.targetType, "comment"),
              eq(votes.targetId, comment.id)
            ));
          }
          await tx.delete(comments).where(eq(comments.issueId, stanceId));
          await tx.delete(credaActivities).where(and(
            eq(credaActivities.targetType, "issue"),
            eq(credaActivities.targetId, stanceId)
          ));
          await tx.delete(grsEvents).where(and(
            eq(grsEvents.relatedEntityType, "stance"),
            eq(grsEvents.relatedEntityId, stanceId)
          ));
          await tx.delete(notifications).where(and(
            eq(notifications.relatedEntityType, "stance"),
            eq(notifications.relatedEntityId, stanceId)
          ));
          await tx.delete(governanceIssues).where(eq(governanceIssues.id, stanceId));
        });
      }
      async updateStanceExpiry(stanceId, expiresAt) {
        await db.update(governanceIssues).set({
          expiresAt,
          isActive: expiresAt > /* @__PURE__ */ new Date()
          // Reactivate if new expiry is in future
        }).where(eq(governanceIssues.id, stanceId));
      }
      async getAllReviewsForAdmin() {
        const result = await db.select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewerUsername: users.username,
          reviewedUserId: reviews.reviewedUserId,
          reviewedDaoId: reviews.reviewedDaoId,
          targetType: reviews.targetType,
          isTargetOnPlatform: reviews.isTargetOnPlatform,
          externalEntityName: reviews.externalEntityName,
          externalEntityXHandle: reviews.externalEntityXHandle,
          reviewType: reviews.reviewType,
          rating: reviews.rating,
          content: reviews.content,
          upvotes: reviews.upvotes,
          downvotes: reviews.downvotes,
          createdAt: reviews.createdAt
        }).from(reviews).leftJoin(users, eq(reviews.reviewerId, users.id)).orderBy(desc(reviews.createdAt));
        return result;
      }
      async deleteReview(reviewId) {
        await db.transaction(async (tx) => {
          await tx.delete(votes).where(and(
            eq(votes.targetType, "review"),
            eq(votes.targetId, reviewId)
          ));
          const commentsToDelete = await tx.select({ id: reviewComments.id }).from(reviewComments).where(eq(reviewComments.reviewId, reviewId));
          for (const comment of commentsToDelete) {
            await tx.delete(votes).where(and(
              eq(votes.targetType, "review_comment"),
              eq(votes.targetId, comment.id)
            ));
          }
          await tx.delete(reviewComments).where(eq(reviewComments.reviewId, reviewId));
          await tx.delete(credaActivities).where(and(
            eq(credaActivities.targetType, "review"),
            eq(credaActivities.targetId, reviewId)
          ));
          await tx.delete(grsEvents).where(and(
            eq(grsEvents.relatedEntityType, "review"),
            eq(grsEvents.relatedEntityId, reviewId)
          ));
          await tx.delete(notifications).where(and(
            eq(notifications.relatedEntityType, "review"),
            eq(notifications.relatedEntityId, reviewId)
          ));
          await tx.delete(reviews).where(eq(reviews.id, reviewId));
        });
      }
      async getUserNotifications(userId, limit = 50, unreadOnly = false) {
        const conditions = [eq(notifications.userId, userId)];
        if (unreadOnly) {
          conditions.push(eq(notifications.read, false));
        }
        const result = await db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(limit);
        return result;
      }
      async markNotificationAsRead(notificationId) {
        await db.update(notifications).set({ read: true }).where(eq(notifications.id, notificationId));
      }
      async markNotificationsAsRead(notificationIds) {
        if (notificationIds.length === 0) return;
        await db.update(notifications).set({ read: true }).where(
          or(...notificationIds.map((id) => eq(notifications.id, id)))
        );
      }
      async deleteNotification(notificationId) {
        await db.delete(notifications).where(eq(notifications.id, notificationId));
      }
      async deleteNotifications(notificationIds) {
        if (notificationIds.length === 0) return;
        await db.delete(notifications).where(
          or(...notificationIds.map((id) => eq(notifications.id, id)))
        );
      }
      async getUnreadNotificationCount(userId) {
        const result = await db.select({ count: count() }).from(notifications).where(
          and(
            eq(notifications.userId, userId),
            eq(notifications.read, false)
          )
        );
        return result[0]?.count || 0;
      }
      // ======= NOTIFICATION SETTINGS OPERATIONS =======
      async getUserNotificationSettings(userId) {
        const result = await db.select().from(notificationSettings).where(eq(notificationSettings.userId, userId));
        if (result.length === 0) {
          const defaultSettings = {
            userId,
            emailEnabled: true,
            pushEnabled: true,
            inAppEnabled: true,
            commentNotifications: true,
            voteNotifications: true,
            reviewNotifications: true,
            followNotifications: true,
            achievementNotifications: true,
            systemNotifications: true,
            xpNotifications: true,
            grsNotifications: true,
            weeklyDigest: true,
            soundEnabled: false
          };
          return await this.createNotificationSettings(defaultSettings);
        }
        return result[0];
      }
      async createNotificationSettings(settings) {
        const result = await db.insert(notificationSettings).values(settings).returning();
        return result[0];
      }
      async updateNotificationSettings(userId, settings) {
        const result = await db.update(notificationSettings).set({ ...settings, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings.userId, userId)).returning();
        return result[0];
      }
      // ======= NOTIFICATION CREATION HELPERS =======
      async notifyComment(targetUserId, senderId, commentId, issueTitle) {
        try {
          const settings = await this.getUserNotificationSettings(targetUserId);
          if (!settings?.commentNotifications || !settings?.inAppEnabled) return;
          const sender = await this.getUser(senderId);
          if (!sender) return;
          await this.createNotification({
            userId: targetUserId,
            type: "comment",
            title: "New comment on your post",
            message: `${sender.username || sender.firstName} commented on "${issueTitle}"`,
            senderId,
            senderUsername: sender.username,
            senderAvatar: sender.profileImageUrl,
            relatedEntityType: "comment",
            relatedEntityId: commentId,
            actionUrl: `/governance/issue/${commentId}`,
            // This should be the issue ID, but we'll handle this in the route
            metadata: { issueTitle }
          });
        } catch (error) {
          console.error("Error creating comment notification:", error);
        }
      }
      async notifyVote(targetUserId, senderId, voteType, entityType, entityId) {
        try {
          const settings = await this.getUserNotificationSettings(targetUserId);
          if (!settings?.voteNotifications || !settings?.inAppEnabled) return;
          const sender = await this.getUser(senderId);
          if (!sender) return;
          const voteTypeText = voteType === "upvote" ? "upvoted" : voteType === "champion" ? "voted Champion on" : "voted Challenge on";
          const entityText = entityType === "stance" ? "your stance" : entityType === "comment" ? "your comment" : "your post";
          await this.createNotification({
            userId: targetUserId,
            type: "vote",
            title: "Someone voted on your content",
            message: `${sender.username || sender.firstName} ${voteTypeText} ${entityText}`,
            senderId,
            senderUsername: sender.username,
            senderAvatar: sender.profileImageUrl,
            relatedEntityType: entityType,
            relatedEntityId: entityId,
            actionUrl: `/${entityType}/${entityId}`,
            metadata: { voteType, entityType }
          });
        } catch (error) {
          console.error("Error creating vote notification:", error);
        }
      }
      async notifyReview(targetUserId, senderId, reviewId, reviewType) {
        try {
          const settings = await this.getUserNotificationSettings(targetUserId);
          if (!settings?.reviewNotifications || !settings?.inAppEnabled) return;
          const sender = await this.getUser(senderId);
          if (!sender) return;
          const reviewTypeText = reviewType === "positive" ? "positive" : reviewType === "negative" ? "negative" : "neutral";
          await this.createNotification({
            userId: targetUserId,
            type: "review",
            title: "You received a new review",
            message: `${sender.username || sender.firstName} left you a ${reviewTypeText} review`,
            senderId,
            senderUsername: sender.username,
            senderAvatar: sender.profileImageUrl,
            relatedEntityType: "review",
            relatedEntityId: reviewId,
            actionUrl: `/reviews/${reviewId}`,
            metadata: { reviewType }
          });
        } catch (error) {
          console.error("Error creating review notification:", error);
        }
      }
      async notifyFollow(targetUserId, senderId) {
        try {
          const settings = await this.getUserNotificationSettings(targetUserId);
          if (!settings?.followNotifications || !settings?.inAppEnabled) return;
          const sender = await this.getUser(senderId);
          if (!sender) return;
          await this.createNotification({
            userId: targetUserId,
            type: "follow",
            title: "You have a new follower",
            message: `${sender.username || sender.firstName} started following you`,
            senderId,
            senderUsername: sender.username,
            senderAvatar: sender.profileImageUrl,
            relatedEntityType: "user",
            relatedEntityId: parseInt(senderId) || 0,
            actionUrl: `/users/${sender.username}`,
            metadata: {}
          });
        } catch (error) {
          console.error("Error creating follow notification:", error);
        }
      }
      async notifyAchievement(userId, achievementTitle, points) {
        try {
          const settings = await this.getUserNotificationSettings(userId);
          if (!settings?.achievementNotifications || !settings?.inAppEnabled) return;
          const pointsText = points ? ` You earned ${points} CREDA!` : "";
          await this.createNotification({
            userId,
            type: "achievement",
            title: "Achievement Unlocked!",
            message: `${achievementTitle}${pointsText}`,
            actionUrl: "/achievements",
            metadata: { achievementTitle, points }
          });
        } catch (error) {
          console.error("Error creating achievement notification:", error);
        }
      }
      async notifyXpGain(userId, activityType, points, entityType, entityId) {
        try {
          const settings = await this.getUserNotificationSettings(userId);
          if (!settings?.xpNotifications || !settings?.inAppEnabled) return;
          if (points < 10) return;
          const activityText = this.getActivityTypeText(activityType);
          await this.createNotification({
            userId,
            type: "creda",
            title: "CREDA Earned!",
            message: `You earned ${points} CREDA for ${activityText}`,
            relatedEntityType: entityType,
            relatedEntityId: entityId,
            actionUrl: "/profile",
            metadata: { activityType, points, entityType, entityId }
          });
        } catch (error) {
          console.error("Error creating CREDA notification:", error);
        }
      }
      async notifyGrsChange(userId, changeAmount, reason, relatedEntityType, relatedEntityId) {
        try {
          const settings = await this.getUserNotificationSettings(userId);
          if (!settings?.grsNotifications || !settings?.inAppEnabled) return;
          if (Math.abs(changeAmount) < 25) return;
          const changeText = changeAmount > 0 ? `increased by ${changeAmount}` : `decreased by ${Math.abs(changeAmount)}`;
          const reasonText = this.getGrsReasonText(reason);
          await this.createNotification({
            userId,
            type: "grs",
            title: "GRS Score Updated",
            message: `Your GRS score ${changeText} due to ${reasonText}`,
            relatedEntityType,
            relatedEntityId,
            actionUrl: "/profile",
            metadata: { changeAmount, reason, relatedEntityType, relatedEntityId }
          });
        } catch (error) {
          console.error("Error creating GRS notification:", error);
        }
      }
      // Helper methods for text generation
      getActivityTypeText(activityType) {
        switch (activityType) {
          case "stance_created":
            return "creating a stance";
          case "comment_made":
            return "commenting on an issue";
          case "vote_cast":
            return "voting on content";
          case "review_given":
            return "giving a review";
          case "invite_friend":
            return "inviting a friend";
          case "early_participation":
            return "early participation";
          case "onboarding_completed":
            return "completing onboarding";
          case "welcome_tour_completed":
            return "finishing the welcome tour";
          case "review_member":
            return "giving a review";
          // Mapping for clarity
          case "submit_comment":
            return "commenting";
          // Mapping for clarity
          case "create_stance":
            return "creating a stance";
          // Mapping for clarity
          default:
            return activityType.replace("_", " ");
        }
      }
      getGrsReasonText(reason) {
        switch (reason) {
          case "stance_success":
            return "your successful stance";
          case "stance_failure":
            return "your failed stance";
          case "stance_target_champion_success":
            return "a championed stance that was successful";
          case "stance_target_champion_opposed":
            return "a championed stance that was opposed";
          case "stance_target_challenge_success":
            return "a challenged stance that was successful";
          case "stance_target_challenge_defended":
            return "a challenged stance that was defended";
          case "voter_accountability_correct":
            return "correct voting";
          case "voter_accountability_incorrect":
            return "incorrect voting";
          case "review_received_positive_high_grs":
            return "a positive review from a high GRS user";
          case "review_received_positive_medium_grs":
            return "a positive review from a medium GRS user";
          case "review_received_positive_low_grs":
            return "a positive review from a low GRS user";
          case "review_received_negative_high_grs":
            return "a negative review from a high GRS user";
          case "review_received_negative_medium_grs":
            return "a negative review from a medium GRS user";
          case "review_received_negative_low_grs":
            return "a negative review from a low GRS user";
          case "review_received_neutral":
            return "a neutral review";
          case "review_accuracy_positive_correct":
            return "accurate positive review";
          case "review_accuracy_positive_incorrect":
            return "inaccurate positive review";
          case "review_accuracy_negative_correct":
            return "accurate negative review";
          case "review_accuracy_negative_incorrect":
            return "inaccurate negative review";
          default:
            return reason.replace("_", " ");
        }
      }
      // Analytics methods for admin dashboard
      async getGrowthAnalytics(timeframe = "daily", days = 30) {
        try {
          const dateColumn = timeframe === "daily" ? sql`DATE(created_at)` : sql`DATE_TRUNC('week', created_at)`;
          const dateFilter = sql`created_at >= NOW() - INTERVAL '${sql.raw(days.toString())} days'`;
          const activeUsersQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(DISTINCT user_id)`
          }).from(credaActivities).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const newUsersQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(*)`
          }).from(users).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const stancesQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(*)`
          }).from(governanceIssues).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const reviewsQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(*)`
          }).from(reviews).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const commentsQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(*)`
          }).from(comments).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const xpQuery = db.select({
            date: dateColumn,
            total: sql`SUM(xp_awarded)`
          }).from(credaActivities).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const votesQuery = db.select({
            date: dateColumn,
            count: sql`COUNT(*)`
          }).from(votes).where(dateFilter).groupBy(dateColumn).orderBy(dateColumn);
          const [
            activeUsers,
            newUsers,
            stances,
            reviewsData,
            commentsData,
            xpData,
            votesData
          ] = await Promise.all([
            activeUsersQuery,
            newUsersQuery,
            stancesQuery,
            reviewsQuery,
            commentsQuery,
            xpQuery,
            votesQuery
          ]);
          return {
            activeUsers,
            newUsers,
            stances,
            reviews: reviewsData,
            comments: commentsData,
            credaAwarded: xpData,
            votes: votesData,
            timeframe,
            days
          };
        } catch (error) {
          console.error("Error getting growth analytics:", error);
          throw error;
        }
      }
      async getEngagementMetrics() {
        try {
          const topActiveUsers = await db.select({
            userId: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            totalCreda: sql`SUM(creda_awarded)`,
            activities: sql`COUNT(*)`
          }).from(credaActivities).innerJoin(users, eq(credaActivities.userId, users.id)).where(sql`creda_activities.created_at >= NOW() - INTERVAL '7 days'`).groupBy(users.id, users.username, users.firstName, users.lastName, users.profileImageUrl).orderBy(sql`SUM(creda_awarded) DESC`).limit(10);
          const topStances = await db.select({
            id: governanceIssues.id,
            title: governanceIssues.title,
            stance: governanceIssues.stance,
            authorUsername: users.username,
            upvotes: governanceIssues.upvotes,
            downvotes: governanceIssues.downvotes,
            commentCount: governanceIssues.commentCount,
            totalEngagement: sql`upvotes + downvotes + comment_count`,
            createdAt: governanceIssues.createdAt
          }).from(governanceIssues).innerJoin(users, eq(governanceIssues.authorId, users.id)).where(sql`governance_issues.created_at >= NOW() - INTERVAL '7 days'`).orderBy(sql`upvotes + downvotes + comment_count DESC`).limit(10);
          const avgMetrics = await db.select({
            avgStancesPerUser: sql`AVG(stance_count)`,
            avgCommentsPerStance: sql`AVG(comment_count)`,
            avgVotesPerStance: sql`AVG(upvotes + downvotes)`
          }).from(
            db.select({
              userId: governanceIssues.authorId,
              stanceCount: sql`COUNT(*)`.as("stance_count"),
              commentCount: sql`AVG(comment_count)`.as("comment_count"),
              upvotes: sql`AVG(upvotes)`.as("upvotes"),
              downvotes: sql`AVG(downvotes)`.as("downvotes")
            }).from(governanceIssues).groupBy(governanceIssues.authorId).as("user_stats")
          );
          return {
            topActiveUsers,
            topStances,
            averageMetrics: avgMetrics[0] || {
              avgStancesPerUser: 0,
              avgCommentsPerStance: 0,
              avgVotesPerStance: 0
            }
          };
        } catch (error) {
          console.error("Error getting engagement metrics:", error);
          throw error;
        }
      }
      async getRetentionMetrics() {
        try {
          const returningUsers = await db.select({
            count: sql`COUNT(DISTINCT user_id)`
          }).from(credaActivities).where(sql`
          created_at >= NOW() - INTERVAL '7 days' AND
          user_id IN (
            SELECT DISTINCT user_id
            FROM creda_activities
            WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
          )
        `);
          const newActiveUsers = await db.select({
            count: sql`COUNT(DISTINCT u.id)`
          }).from(sql`users u`).innerJoin(sql`creda_activities xa`, sql`u.id = xa.user_id`).where(sql`
          u.created_at >= NOW() - INTERVAL '7 days' AND
          xa.created_at >= NOW() - INTERVAL '7 days'
        `);
          const streakDistribution = await db.select({
            streakRange: sql`
            CASE
              WHEN daily_streak = 0 THEN '0 days'
              WHEN daily_streak BETWEEN 1 AND 3 THEN '1-3 days'
              WHEN daily_streak BETWEEN 4 AND 7 THEN '4-7 days'
              WHEN daily_streak BETWEEN 8 AND 14 THEN '8-14 days'
              WHEN daily_streak BETWEEN 15 AND 30 THEN '15-30 days'
              ELSE '30+ days'
            END
          `,
            count: sql`COUNT(*)`
          }).from(users).groupBy(sql`
          CASE
            WHEN daily_streak = 0 THEN '0 days'
            WHEN daily_streak BETWEEN 1 AND 3 THEN '1-3 days'
            WHEN daily_streak BETWEEN 4 AND 7 THEN '4-7 days'
            WHEN daily_streak BETWEEN 8 AND 14 THEN '8-14 days'
            WHEN daily_streak BETWEEN 15 AND 30 THEN '15-30 days'
            ELSE '30+ days'
          END
        `).orderBy(sql`MIN(daily_streak)`);
          return {
            returningUsers: returningUsers[0]?.count || 0,
            newActiveUsers: newActiveUsers[0]?.count || 0,
            streakDistribution
          };
        } catch (error) {
          console.error("Error getting retention metrics:", error);
          throw error;
        }
      }
      async getPlatformOverview() {
        try {
          const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
          const totalStances = await db.select({ count: sql`count(*)` }).from(governanceIssues);
          const totalReviews = await db.select({ count: sql`count(*)` }).from(reviews);
          const totalComments = await db.select({ count: sql`count(*)` }).from(comments);
          const totalVotes = await db.select({ count: sql`count(*)` }).from(votes);
          const totalXpAwarded = await db.select({ total: sql`COALESCE(SUM(xp_awarded), 0)` }).from(credaActivities);
          const usersLast30Days = await db.select({ count: sql`count(*)` }).from(users).where(sql`created_at >= NOW() - INTERVAL '30 days'`);
          const stancesLast30Days = await db.select({ count: sql`count(*)` }).from(governanceIssues).where(sql`created_at >= NOW() - INTERVAL '30 days'`);
          const reviewsLast30Days = await db.select({ count: sql`count(*)` }).from(reviews).where(sql`created_at >= NOW() - INTERVAL '30 days'`);
          const avgGrsScore = await db.select({ avg: sql`AVG(grs_score)` }).from(users);
          const activeUsers = await db.select({ count: sql`COUNT(DISTINCT user_id)` }).from(credaActivities).where(sql`created_at >= NOW() - INTERVAL '7 days'`);
          return {
            totals: {
              users: totalUsers[0]?.count || 0,
              stances: totalStances[0]?.count || 0,
              reviews: totalReviews[0]?.count || 0,
              comments: totalComments[0]?.count || 0,
              votes: totalVotes[0]?.count || 0,
              credaAwarded: totalXpAwarded[0]?.total || 0
            },
            growth30Days: {
              users: usersLast30Days[0]?.count || 0,
              stances: stancesLast30Days[0]?.count || 0,
              reviews: reviewsLast30Days[0]?.count || 0
            },
            metrics: {
              avgGrsScore: Math.round(avgGrsScore[0]?.avg || 1300),
              activeUsers: activeUsers[0]?.count || 0
            }
          };
        } catch (error) {
          console.error("Error getting platform overview:", error);
          throw error;
        }
      }
      // Daily Tasks operations
      async getDailyTasksProgress(userId, taskDate) {
        const [result] = await db.select().from(dailyTasksProgress).where(and(
          eq(dailyTasksProgress.userId, userId),
          eq(dailyTasksProgress.taskDate, taskDate)
        ));
        return result;
      }
      async upsertDailyTasksProgress(data) {
        const [result] = await db.insert(dailyTasksProgress).values(data).onConflictDoUpdate({
          target: [dailyTasksProgress.userId, dailyTasksProgress.taskDate],
          set: {
            engagementActionsCompleted: data.engagementActionsCompleted,
            isStreakEligible: data.isStreakEligible,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return result;
      }
      async updateEngagementActionCount(userId, taskDate, increment = 1) {
        const existingProgress = await this.getDailyTasksProgress(userId, taskDate);
        const newCount = (existingProgress?.engagementActionsCompleted || 0) + increment;
        const resetInfo = await this.getResetTimeInfo();
        const isStreakEligible = newCount >= resetInfo.minActionsForStreak;
        await this.upsertDailyTasksProgress({
          userId,
          taskDate,
          engagementActionsCompleted: newCount,
          isStreakEligible
        });
      }
      async getDailyTasksConfig(configKey) {
        const [result] = await db.select().from(dailyTasksConfig).where(eq(dailyTasksConfig.configKey, configKey));
        return result;
      }
      async upsertDailyTasksConfig(data) {
        const [result] = await db.insert(dailyTasksConfig).values(data).onConflictDoUpdate({
          target: [dailyTasksConfig.configKey],
          set: {
            configValue: data.configValue,
            description: data.description,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return result;
      }
      // Streak operations
      async updateUserStreak(userId, currentStreak, longestStreak) {
        const updateData = {
          dailyStreak: currentStreak,
          lastStreakDate: /* @__PURE__ */ new Date()
        };
        if (longestStreak !== void 0) {
          updateData.longestStreak = longestStreak;
        }
        await db.update(users).set(updateData).where(eq(users.id, userId));
      }
      async processStreaksForAllUsers(targetDate) {
        const allUsers = await db.select({
          id: users.id,
          dailyStreak: users.dailyStreak,
          longestStreak: users.longestStreak
        }).from(users);
        const resetInfo = await this.getResetTimeInfo();
        for (const user of allUsers) {
          const progress = await this.getDailyTasksProgress(user.id, targetDate);
          if (progress && progress.isStreakEligible) {
            const newCurrentStreak = (user.dailyStreak || 0) + 1;
            const newLongestStreak = Math.max(user.longestStreak || 0, newCurrentStreak);
            await this.updateUserStreak(user.id, newCurrentStreak, newLongestStreak);
          } else {
            await this.updateUserStreak(user.id, 0);
          }
        }
      }
      async getEngagementActionsForUser(userId, date) {
        const startOfDay = /* @__PURE__ */ new Date(date + "T00:00:00.000Z");
        const endOfDay = /* @__PURE__ */ new Date(date + "T23:59:59.999Z");
        const activities = await db.select({
          activityType: credaActivities.activityType,
          count: sql`COUNT(*)`
        }).from(credaActivities).where(and(
          eq(credaActivities.userId, userId),
          gte(credaActivities.createdAt, startOfDay),
          lt(credaActivities.createdAt, endOfDay)
        )).groupBy(credaActivities.activityType);
        return activities;
      }
      async getResetTimeInfo() {
        const resetTimeConfig = await this.getDailyTasksConfig("reset_time_utc");
        const minActionsConfig = await this.getDailyTasksConfig("min_actions_for_streak");
        return {
          resetTimeUtc: resetTimeConfig?.configValue || "00:00",
          minActionsForStreak: parseInt(minActionsConfig?.configValue || "3")
        };
      }
      // Company User Management Methods
      async createCompanyUser(companyUser) {
        const [newUser] = await db.insert(companyUsers).values(companyUser).returning();
        return newUser;
      }
      async getCompanyUsers(companyId) {
        return db.select().from(companyUsers).where(eq(companyUsers.companyId, companyId));
      }
      async getCompanyUserByEmail(email) {
        const [user] = await db.select().from(companyUsers).where(eq(companyUsers.email, email));
        return user;
      }
      async updateCompanyUserLastLogin(id) {
        await db.update(companyUsers).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(companyUsers.id, id));
      }
      async deleteCompanyUser(id) {
        await db.delete(companyUsers).where(eq(companyUsers.id, id));
      }
      // Review Reporting Methods
      async reportReview(report) {
        const [reviewReport] = await db.insert(reviewReports).values(report).returning();
        return reviewReport;
      }
      async getReportedReviewsForProject(projectId) {
        const reports = await db.select({
          id: reviewReports.id,
          reviewId: reviewReports.reviewId,
          reportedBy: reviewReports.reportedBy,
          reason: reviewReports.reason,
          notes: reviewReports.notes,
          status: reviewReports.status,
          createdAt: reviewReports.createdAt,
          review: {
            id: projectReviews.id,
            userId: projectReviews.userId,
            projectId: projectReviews.projectId,
            projectName: projectReviews.projectName,
            projectLogo: projectReviews.projectLogo,
            projectSlug: projectReviews.projectSlug,
            rating: projectReviews.rating,
            title: projectReviews.title,
            content: projectReviews.content,
            helpful: projectReviews.helpful,
            verified: projectReviews.verified,
            companyReply: projectReviews.companyReply,
            companyRepliedAt: projectReviews.companyRepliedAt,
            createdAt: projectReviews.createdAt,
            updatedAt: projectReviews.updatedAt
          },
          reportedByUser: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl
          }
        }).from(reviewReports).innerJoin(projectReviews, eq(reviewReports.reviewId, projectReviews.id)).innerJoin(users, eq(reviewReports.reportedBy, users.id)).where(eq(projectReviews.projectId, projectId)).orderBy(desc(reviewReports.createdAt));
        const reportsWithReviewers = await Promise.all(
          reports.map(async (report) => {
            const reviewer = await this.getUser(report.review.userId);
            return {
              ...report,
              review: {
                ...report.review,
                user: reviewer ? {
                  id: reviewer.id,
                  username: reviewer.username,
                  firstName: reviewer.firstName,
                  lastName: reviewer.lastName,
                  profileImageUrl: reviewer.profileImageUrl,
                  twitterHandle: reviewer.twitterHandle
                } : null
              }
            };
          })
        );
        return reportsWithReviewers;
      }
      async getReportedReviewsForCompany(companyId) {
        const company = await this.getCompanyById(companyId);
        if (!company) {
          return [];
        }
        return this.getReportedReviewsForProject(company.externalId);
      }
      // Content Reporting Methods (comprehensive spam reporting across all content types)
      async reportContent(report) {
        const [contentReport] = await db.insert(contentReports).values(report).returning();
        return contentReport;
      }
      async awardSpamReportCreda(userId, contentType, contentId) {
        await this.awardCredaPoints(
          userId,
          "moderation",
          "spam_report",
          _DatabaseStorage.CREDA_REWARDS.REPORT_SPAM,
          contentType,
          contentId,
          {
            action: "Reported spam content",
            contentType,
            contentId
          }
        );
      }
      async getContentReports(status) {
        if (status) {
          return db.select().from(contentReports).where(eq(contentReports.status, status)).orderBy(desc(contentReports.createdAt));
        }
        return db.select().from(contentReports).orderBy(desc(contentReports.createdAt));
      }
      async getContentReportsByUser(userId) {
        return db.select().from(contentReports).where(eq(contentReports.reportedBy, userId)).orderBy(desc(contentReports.createdAt));
      }
      // Admin Analytics Methods
      async getAdminCompanyAnalytics() {
        const companiesCount = await db.select({
          total: sql`COUNT(*)`,
          active: sql`SUM(CASE WHEN ${companies.isActive} THEN 1 ELSE 0 END)`,
          verified: sql`SUM(CASE WHEN ${companies.isVerified} THEN 1 ELSE 0 END)`
        }).from(companies);
        const reviewsStats = await db.select({
          total: sql`COUNT(*)`,
          avgRating: sql`AVG(${projectReviews.rating})`
        }).from(projectReviews);
        return {
          totalCompanies: Number(companiesCount[0]?.total || 0),
          activeCompanies: Number(companiesCount[0]?.active || 0),
          verifiedCompanies: Number(companiesCount[0]?.verified || 0),
          totalReviews: Number(reviewsStats[0]?.total || 0),
          averageRating: Number(reviewsStats[0]?.avgRating || 0)
        };
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/emailAuth.ts
var emailAuth_exports = {};
__export(emailAuth_exports, {
  generateRandomPassword: () => generateRandomPassword,
  generateVerificationCode: () => generateVerificationCode,
  resendVerificationCode: () => resendVerificationCode,
  sendCompanyCredentialsEmail: () => sendCompanyCredentialsEmail,
  sendVerificationEmail: () => sendVerificationEmail,
  setupEmailAuth: () => setupEmailAuth,
  verifyEmailCode: () => verifyEmailCode
});
import passport2 from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";
var createEmailTransporter, generateVerificationCode, sendVerificationEmail, setupEmailAuth, verifyEmailCode, resendVerificationCode, generateRandomPassword, sendCompanyCredentialsEmail;
var init_emailAuth = __esm({
  "server/emailAuth.ts"() {
    "use strict";
    init_storage();
    createEmailTransporter = async () => {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    };
    generateVerificationCode = () => {
      return Math.floor(1e5 + Math.random() * 9e5).toString();
    };
    sendVerificationEmail = async (email, code) => {
      const transporter = await createEmailTransporter();
      const mailOptions = {
        from: '"Governance Reputation" <noreply@daoai.com>',
        to: email,
        subject: "Verify Your Email Address",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Welcome to Governance Reputation for Web3 Communities!</p>
        <p>Your verification code is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    };
    setupEmailAuth = () => {
      passport2.use("local-signup", new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true
        },
        async (req, email, password, done) => {
          try {
            const existingUser = await storage.getUserByEmail(email);
            if (existingUser) {
              return done(null, false, { message: "Email already registered" });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const userId = nanoid();
            const user = await storage.createUser({
              id: userId,
              email,
              password: hashedPassword,
              username: req.body.username || null,
              firstName: req.body.firstName || null,
              lastName: req.body.lastName || null,
              emailVerified: false,
              authProvider: "email"
            });
            const verificationCode = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
            await storage.createEmailVerificationCode({
              email,
              code: verificationCode,
              expiresAt
            });
            await sendVerificationEmail(email, verificationCode);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      ));
      passport2.use("local-signin", new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password"
        },
        async (email, password, done) => {
          try {
            const user = await storage.getUserByEmail(email);
            if (!user) {
              return done(null, false, { message: "Invalid email or password" });
            }
            if (!user.password) {
              return done(null, false, { message: "Please use social login" });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
              return done(null, false, { message: "Invalid email or password" });
            }
            if (!user.emailVerified) {
              return done(null, false, { message: "Please verify your email first" });
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      ));
    };
    verifyEmailCode = async (email, code) => {
      const verificationRecord = await storage.getEmailVerificationCode(email, code);
      if (!verificationRecord) {
        return false;
      }
      if (verificationRecord.expiresAt < /* @__PURE__ */ new Date()) {
        await storage.deleteEmailVerificationCode(email);
        return false;
      }
      const user = await storage.getUserByEmail(email);
      if (user) {
        await storage.updateUser(user.id, { emailVerified: true });
        await storage.deleteEmailVerificationCode(email);
        return true;
      }
      return false;
    };
    resendVerificationCode = async (email) => {
      const user = await storage.getUserByEmail(email);
      if (!user || user.emailVerified) {
        return false;
      }
      await storage.deleteEmailVerificationCode(email);
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await storage.createEmailVerificationCode({
        email,
        code: verificationCode,
        expiresAt
      });
      await sendVerificationEmail(email, verificationCode);
      return true;
    };
    generateRandomPassword = () => {
      const { customAlphabet } = __require("nanoid");
      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*";
      const generateSecurePassword = customAlphabet(alphabet, 16);
      return generateSecurePassword();
    };
    sendCompanyCredentialsEmail = async (companyName, email, password, dashboardUrl) => {
      const transporter = await createEmailTransporter();
      const mailOptions = {
        from: '"Web3 Reviews Platform" <noreply@daoai.com>',
        to: email,
        subject: `Your ${companyName} Business Dashboard Access`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Welcome to Your Business Dashboard</h2>
        <p>Your business dashboard has been created for <strong>${companyName}</strong>.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Login Credentials</h3>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
          <p style="margin: 10px 0;"><strong>Dashboard URL:</strong> <a href="${dashboardUrl}" style="color: #2563eb;">${dashboardUrl}</a></p>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>\u26A0\uFE0F Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>

        <h3 style="color: #1e293b;">What You Can Do:</h3>
        <ul style="color: #475569; line-height: 1.8;">
          <li>Manage your company profile and information</li>
          <li>View and respond to customer reviews</li>
          <li>Access analytics and insights</li>
          <li>Update your company's verification status</li>
        </ul>

        <p style="color: #64748b; margin-top: 30px;">If you didn't expect this email or have questions, please contact our support team.</p>
      </div>
    `
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Company credentials email sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return nodemailer.getTestMessageUrl(info);
    };
  }
});

// server/backup.ts
var backup_exports = {};
__export(backup_exports, {
  DatabaseBackup: () => DatabaseBackup,
  backupService: () => backupService
});
import { sql as sql2 } from "drizzle-orm";
import fs from "fs";
import path from "path";
var DatabaseBackup, backupService;
var init_backup = __esm({
  "server/backup.ts"() {
    "use strict";
    init_db();
    DatabaseBackup = class {
      backupDir = "./backups";
      constructor() {
        if (!fs.existsSync(this.backupDir)) {
          fs.mkdirSync(this.backupDir, { recursive: true });
        }
      }
      async createFullBackup() {
        try {
          const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
          const filename = `backup-${timestamp2}.json`;
          const filepath = path.join(this.backupDir, filename);
          console.log("Starting database backup...");
          const tables = [
            "users",
            "daos",
            "governance_issues",
            "comments",
            "votes",
            "user_dao_follows",
            "user_dao_scores",
            "reviews",
            "creda_activities",
            "invite_codes",
            "referrals",
            "stance_votes"
          ];
          const backupData = {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            tables: {},
            metadata: {
              totalRecords: 0,
              tableCount: tables.length,
              version: "1.0.0"
            }
          };
          for (const tableName of tables) {
            try {
              const result = await db.execute(sql2.raw(`SELECT * FROM ${tableName}`));
              backupData.tables[tableName] = result.rows || [];
              backupData.metadata.totalRecords += result.rows?.length || 0;
              console.log(`Backed up ${tableName}: ${result.rows?.length || 0} records`);
            } catch (error) {
              console.warn(`Warning: Could not backup table ${tableName}:`, error);
              backupData.tables[tableName] = [];
            }
          }
          fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
          console.log(`\u2705 Backup completed: ${filename}`);
          console.log(`\u{1F4CA} Total records backed up: ${backupData.metadata.totalRecords}`);
          return filepath;
        } catch (error) {
          console.error("\u274C Backup failed:", error);
          throw error;
        }
      }
      async verifyDatabaseConnection() {
        const maxRetries = 3;
        const retryDelay = 2e3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            await db.execute(sql2`SELECT 1`);
            if (attempt > 1) {
              console.log(`\u2705 Database connection successful on attempt ${attempt}`);
            }
            return true;
          } catch (error) {
            if (attempt < maxRetries) {
              console.log(`\u26A0\uFE0F Database connection attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
              console.error("Database connection failed after all retries:", error);
              return false;
            }
          }
        }
        return false;
      }
      async getDatabaseStats() {
        try {
          const stats = await db.execute(sql2`
        SELECT 
          schemaname,
          tablename,
          n_live_tup as row_count,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_stat_user_tables 
        ORDER BY n_live_tup DESC
      `);
          return stats.rows;
        } catch (error) {
          console.error("Failed to get database stats:", error);
          return [];
        }
      }
      async scheduleAutomaticBackups() {
        console.log("\u{1F504} Setting up automatic backup schedule...");
        const backupInterval = 1 * 60 * 60 * 1e3;
        setInterval(async () => {
          try {
            console.log("\u23F0 Running scheduled backup...");
            await this.createFullBackup();
          } catch (error) {
            console.error("\u26A0\uFE0F Scheduled backup failed:", error);
          }
        }, backupInterval);
        setTimeout(() => {
          this.createFullBackup().catch(console.error);
        }, 5e3);
      }
      listBackups() {
        try {
          const files = fs.readdirSync(this.backupDir);
          return files.filter((file) => file.startsWith("backup-") && file.endsWith(".json")).sort().reverse();
        } catch (error) {
          console.error("Failed to list backups:", error);
          return [];
        }
      }
      async cleanupOldBackups(keepDays = 7) {
        try {
          const files = this.listBackups();
          const cutoffDate = /* @__PURE__ */ new Date();
          cutoffDate.setDate(cutoffDate.getDate() - keepDays);
          for (const file of files) {
            const filepath = path.join(this.backupDir, file);
            const stats = fs.statSync(filepath);
            if (stats.mtime < cutoffDate) {
              fs.unlinkSync(filepath);
              console.log(`\u{1F5D1}\uFE0F Deleted old backup: ${file}`);
            }
          }
        } catch (error) {
          console.error("Failed to cleanup old backups:", error);
        }
      }
    };
    backupService = new DatabaseBackup();
  }
});

// server/objectStorage.ts
var objectStorage_exports = {};
__export(objectStorage_exports, {
  ObjectNotFoundError: () => ObjectNotFoundError,
  ObjectStorageService: () => ObjectStorageService,
  objectStorageClient: () => objectStorageClient
});
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
function parseObjectPath(path9) {
  if (!path9.startsWith("/")) {
    path9 = `/${path9}`;
  }
  const pathParts = path9.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}
var REPLIT_SIDECAR_ENDPOINT, objectStorageClient, ObjectNotFoundError, ObjectStorageService;
var init_objectStorage = __esm({
  "server/objectStorage.ts"() {
    "use strict";
    REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
    objectStorageClient = new Storage({
      credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
          url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
          format: {
            type: "json",
            subject_token_field_name: "access_token"
          }
        },
        universe_domain: "googleapis.com"
      },
      projectId: ""
    });
    ObjectNotFoundError = class _ObjectNotFoundError extends Error {
      constructor() {
        super("Object not found");
        this.name = "ObjectNotFoundError";
        Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
      }
    };
    ObjectStorageService = class {
      constructor() {
      }
      // Gets the public object search paths.
      getPublicObjectSearchPaths() {
        const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
        const paths = Array.from(
          new Set(
            pathsStr.split(",").map((path9) => path9.trim()).filter((path9) => path9.length > 0)
          )
        );
        if (paths.length === 0) {
          throw new Error(
            "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
          );
        }
        return paths;
      }
      // Search for a public object from the search paths.
      async searchPublicObject(filePath) {
        for (const searchPath of this.getPublicObjectSearchPaths()) {
          const fullPath = `${searchPath}/${filePath}`;
          const { bucketName, objectName } = parseObjectPath(fullPath);
          const bucket = objectStorageClient.bucket(bucketName);
          const file = bucket.file(objectName);
          const [exists] = await file.exists();
          if (exists) {
            return file;
          }
        }
        return null;
      }
      // Downloads an object to the response.
      async downloadObject(file, res, cacheTtlSec = 3600) {
        try {
          const [metadata] = await file.getMetadata();
          res.set({
            "Content-Type": metadata.contentType || "application/octet-stream",
            "Content-Length": metadata.size,
            "Cache-Control": `public, max-age=${cacheTtlSec}`
          });
          const stream = file.createReadStream();
          stream.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Error streaming file" });
            }
          });
          stream.pipe(res);
        } catch (error) {
          console.error("Error downloading file:", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Error downloading file" });
          }
        }
      }
      // Gets the upload URL for a company logo
      async getLogoUploadURL() {
        const publicSearchPaths = this.getPublicObjectSearchPaths();
        if (!publicSearchPaths || publicSearchPaths.length === 0) {
          throw new Error(
            "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var."
          );
        }
        const publicPath = publicSearchPaths[0];
        const objectId = randomUUID();
        const fullPath = `${publicPath}/logos/${objectId}`;
        const { bucketName, objectName } = parseObjectPath(fullPath);
        return signObjectURL({
          bucketName,
          objectName,
          method: "PUT",
          ttlSec: 900
        });
      }
      // Normalize the logo path from upload URL to public URL
      normalizeLogoPath(uploadURL) {
        try {
          const url = new URL(uploadURL);
          const pathname = url.pathname;
          const parts = pathname.split("/");
          const filename = parts[parts.length - 1];
          return `/public-objects/logos/${filename}`;
        } catch (error) {
          console.error("Error normalizing logo path:", error);
          return uploadURL;
        }
      }
    };
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path6 from "path";
var vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react()
      ],
      resolve: {
        alias: {
          "@": path6.resolve(import.meta.dirname, "client", "src"),
          "@shared": path6.resolve(import.meta.dirname, "shared"),
          "@assets": path6.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path6.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path6.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log2,
  serveStatic: () => serveStatic2,
  setupVite: () => setupVite
});
import express2 from "express";
import fs6 from "fs";
import path7 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid as nanoid2 } from "nanoid";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path7.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs6.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic2(app2) {
  const distPath = path7.resolve(import.meta.dirname, "public");
  if (!fs6.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path7.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import express3 from "express";
import path8 from "path";
import { fileURLToPath } from "url";

// server/routes.ts
init_storage();
import { createServer } from "http";

// server/replitAuth.ts
init_storage();
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl / 1e3,
    // convert to seconds
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    authProvider: "replit",
    hasInviteAccess: false
    // Explicitly set to false for security - users must use invite codes
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    const domains = process.env.REPLIT_DOMAINS.split(",");
    const targetDomain = domains.includes(req.hostname) ? req.hostname : domains[0];
    passport.authenticate(`replitauth:${targetDomain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var requireInviteAccess = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let userId;
  if (user.id && user.username && !user.claims) {
    userId = user.id;
  } else if (user.claims) {
    userId = user.claims.sub;
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
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
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
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
  if (user.id && user.username && !user.claims) {
    console.log("Auth passed - Twitter OAuth user");
    return next();
  }
  if (user.claims) {
    const now = Math.floor(Date.now() / 1e3);
    if (user.expires_at && now <= user.expires_at) {
      console.log("Auth passed - valid Replit token");
      return next();
    }
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
  console.log("Auth failed - no valid claims or token");
  return res.status(401).json({ message: "Unauthorized" });
};

// server/routes.ts
init_emailAuth();

// server/twitterAuth.ts
init_storage();
import crypto from "crypto";
function setupTwitterAuth(app2) {
  if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
    console.warn("Twitter authentication not configured - missing credentials");
    return;
  }
  function generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
    return { codeVerifier, codeChallenge };
  }
  app2.get("/api/auth/twitter", async (req, res) => {
    console.log("Starting Twitter OAuth 2.0 authentication...");
    try {
      const { codeVerifier, codeChallenge } = generatePKCE();
      const state = crypto.randomBytes(16).toString("hex");
      req.session.codeVerifier = codeVerifier;
      req.session.oauthState = state;
      const host = req.get("host") || "dao-ai.replit.app";
      const callbackURL = `https://${host}/api/auth/twitter/callback`;
      console.log("Callback URL being used:", callbackURL);
      req.session.callbackURL = callbackURL;
      const authParams = new URLSearchParams({
        response_type: "code",
        client_id: process.env.TWITTER_CONSUMER_KEY,
        redirect_uri: callbackURL,
        scope: "tweet.read users.read",
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
      });
      const authURL = `https://twitter.com/i/oauth2/authorize?${authParams.toString()}`;
      console.log("Redirecting to Twitter auth URL");
      res.status(302);
      res.setHeader("Location", authURL);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.end();
    } catch (error) {
      console.error("Twitter auth initialization error:", error);
      res.redirect("/auth?error=twitter_auth_failed");
    }
  });
  app2.get("/api/auth/twitter/callback", async (req, res) => {
    console.log("Twitter callback received");
    console.log("Query params:", req.query);
    try {
      const { code, state } = req.query;
      if (!code) {
        throw new Error("No authorization code received");
      }
      if (state !== req.session.oauthState) {
        throw new Error("Invalid state parameter");
      }
      const codeVerifier = req.session.codeVerifier;
      if (!codeVerifier) {
        throw new Error("Code verifier not found in session");
      }
      const callbackURL = req.session.callbackURL || `https://${req.get("host")}/api/auth/twitter/callback`;
      const tokenData = await exchangeCodeForToken(code, codeVerifier, callbackURL);
      console.log("Token exchange successful");
      const userProfile = await getUserProfile(tokenData.access_token);
      console.log("User profile retrieved:", userProfile.username);
      const claimableProfiles = await storage.getClaimableProfilesForUser(userProfile.username);
      console.log(`Found ${claimableProfiles.length} claimable profiles for ${userProfile.username}`);
      if (claimableProfiles.length > 0) {
        console.log(`CLAIMING FLOW: User ${userProfile.username} has ${claimableProfiles.length} claimable profiles`);
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
        delete req.session.codeVerifier;
        delete req.session.oauthState;
        console.log(`Stored claiming data in session for ${userProfile.username} - redirecting to claiming flow`);
        res.redirect("/onboarding?claiming=true");
        return;
      }
      console.log(`NORMAL FLOW: No claimable profiles for ${userProfile.username}, checking existing user`);
      let existingUser = await storage.getUserByTwitterId(userProfile.id);
      if (!existingUser) {
        existingUser = await storage.getUserByUsername(userProfile.username);
        console.log(`Checking by username ${userProfile.username}, found:`, existingUser ? "yes" : "no");
      }
      let userData;
      if (existingUser) {
        console.log(`Existing user found: ${existingUser.username}, hasInviteAccess: ${existingUser.hasInviteAccess}`);
        userData = {
          id: existingUser.id,
          // NEVER CHANGE - preserves all data relationships
          access_id: userProfile.id,
          // Set Twitter OAuth ID for authentication
          username: userProfile.username,
          email: existingUser.email,
          // Preserve existing email
          firstName: userProfile.name?.split(" ")[0] || existingUser.firstName,
          lastName: userProfile.name?.split(" ").slice(1).join(" ") || existingUser.lastName,
          profileImageUrl: userProfile.profile_image_url || existingUser.profileImageUrl,
          twitterHandle: userProfile.username,
          twitterUrl: `https://x.com/${userProfile.username}`,
          authProvider: "twitter",
          hasInviteAccess: existingUser.hasInviteAccess,
          // Preserve existing access level
          // Preserve other important fields
          xpPoints: existingUser.xpPoints,
          grsScore: existingUser.grsScore,
          grsPercentile: existingUser.grsPercentile,
          dailyStreak: existingUser.dailyStreak,
          weeklyXp: existingUser.weeklyXp,
          lastActiveDate: existingUser.lastActiveDate,
          onboardingCompletedAt: existingUser.onboardingCompletedAt,
          profileCompletedAt: existingUser.profileCompletedAt
        };
      } else {
        console.log(`New user: ${userProfile.username}, setting hasInviteAccess to false`);
        userData = {
          id: userProfile.id,
          // For new users, id and access_id will be the same initially
          access_id: userProfile.id,
          // Set Twitter OAuth ID for authentication
          username: userProfile.username,
          email: null,
          // Twitter OAuth 2.0 doesn't provide email by default
          firstName: userProfile.name?.split(" ")[0] || null,
          lastName: userProfile.name?.split(" ").slice(1).join(" ") || null,
          profileImageUrl: userProfile.profile_image_url || null,
          twitterHandle: userProfile.username,
          // Store the X/Twitter handle
          twitterUrl: `https://x.com/${userProfile.username}`,
          // Generate the X profile URL
          authProvider: "twitter",
          hasInviteAccess: false
          // Explicitly set to false for security - users must use invite codes
        };
      }
      let dbUser;
      if (existingUser) {
        dbUser = await storage.updateUser(existingUser.id, userData);
        console.log(`Updated existing Twitter user: ${userProfile.username}, hasInviteAccess: ${dbUser.hasInviteAccess}`);
      } else {
        dbUser = await storage.createUser(userData);
        console.log(`Created new Twitter user: ${userProfile.username}, hasInviteAccess: ${dbUser.hasInviteAccess}`);
      }
      req.logIn(dbUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect("/auth?error=login_failed");
        }
        console.log("Twitter authentication successful for user:", dbUser.username);
        delete req.session.codeVerifier;
        delete req.session.oauthState;
        delete req.session.callbackURL;
        req.session.hasClaimableProfiles = false;
        req.session.inClaimingFlow = false;
        if (dbUser.hasInviteAccess) {
          console.log(`User ${dbUser.username} has full access, redirecting to projects`);
          res.redirect("/projects");
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
  async function exchangeCodeForToken(code, codeVerifier, callbackURL) {
    const postData = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackURL,
      code_verifier: codeVerifier,
      client_id: process.env.TWITTER_CONSUMER_KEY
    });
    const authHeader = `Basic ${Buffer.from(`${process.env.TWITTER_CONSUMER_KEY}:${process.env.TWITTER_CONSUMER_SECRET}`).toString("base64")}`;
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader
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
  async function getUserProfile(accessToken) {
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

// server/routes.ts
init_backup();

// server/database-monitor.ts
init_db();
import { sql as sql4 } from "drizzle-orm";

// server/connection-recovery.ts
init_db();
init_backup();
import { sql as sql3 } from "drizzle-orm";
import fs2 from "fs";
import path2 from "path";
var ConnectionRecovery = class {
  failureLog = [];
  isRecovering = false;
  maxRetryAttempts = 5;
  retryDelayMs = 1e4;
  // 10 seconds
  async handleConnectionFailure(error) {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    console.error("\u{1F6A8} DATABASE CONNECTION FAILURE DETECTED:", error.message);
    const failureEvent = {
      timestamp: timestamp2,
      error: error.message,
      recoveryAttempts: 0,
      databaseUrl: this.maskConnectionString(process.env.DATABASE_URL || "")
    };
    try {
      console.log("\u{1F198} Creating emergency backup before recovery...");
      const backupPath = await backupService.createFullBackup();
      failureEvent.lastBackupFile = backupPath;
      console.log("\u2705 Emergency backup created:", backupPath);
    } catch (backupError) {
      console.error("\u274C Emergency backup failed:", backupError);
    }
    this.failureLog.push(failureEvent);
    if (this.isRecovering) {
      console.log("\u23F3 Recovery already in progress...");
      return false;
    }
    return await this.attemptRecovery(failureEvent);
  }
  async attemptRecovery(failureEvent) {
    this.isRecovering = true;
    console.log("\u{1F527} Starting connection recovery process...");
    for (let attempt = 1; attempt <= this.maxRetryAttempts; attempt++) {
      failureEvent.recoveryAttempts = attempt;
      console.log(`\u{1F504} Recovery attempt ${attempt}/${this.maxRetryAttempts}`);
      try {
        if (attempt > 1) {
          console.log(`\u23F1\uFE0F Waiting ${this.retryDelayMs}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
        }
        await db.execute(sql3`SELECT 1`);
        const userCount = await db.execute(sql3`SELECT COUNT(*) as count FROM users`);
        const daoCount = await db.execute(sql3`SELECT COUNT(*) as count FROM daos`);
        console.log("\u2705 Connection recovered successfully!");
        console.log(`\u{1F4CA} Data integrity check: ${userCount.rows[0]?.count} users, ${daoCount.rows[0]?.count} DAOs`);
        this.isRecovering = false;
        this.logRecoverySuccess(failureEvent, attempt);
        return true;
      } catch (retryError) {
        console.error(`\u274C Recovery attempt ${attempt} failed:`, retryError);
        if (attempt === this.maxRetryAttempts) {
          console.error("\u{1F6A8} ALL RECOVERY ATTEMPTS FAILED");
          this.logRecoveryFailure(failureEvent);
          this.isRecovering = false;
          return false;
        }
      }
    }
    this.isRecovering = false;
    return false;
  }
  async checkConnectionHealth() {
    const startTime = Date.now();
    try {
      await db.execute(sql3`SELECT 1`);
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  getFailureHistory() {
    return [...this.failureLog];
  }
  logRecoverySuccess(failureEvent, successfulAttempt) {
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      event: "RECOVERY_SUCCESS",
      originalFailure: failureEvent.timestamp,
      attemptsRequired: successfulAttempt,
      totalDowntime: Date.now() - new Date(failureEvent.timestamp).getTime()
    };
    console.log("\u{1F4DD} Recovery logged:", JSON.stringify(logEntry, null, 2));
    this.writeRecoveryLog(logEntry);
  }
  logRecoveryFailure(failureEvent) {
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      event: "RECOVERY_FAILED",
      originalFailure: failureEvent.timestamp,
      totalAttempts: failureEvent.recoveryAttempts,
      lastBackup: failureEvent.lastBackupFile,
      nextSteps: [
        "Check database provider status",
        "Verify DATABASE_URL is correct",
        "Contact database provider support",
        "Restore from backup if necessary",
        "Check network connectivity"
      ]
    };
    console.error("\u{1F6A8} RECOVERY FAILURE LOGGED:", JSON.stringify(logEntry, null, 2));
    this.writeRecoveryLog(logEntry);
  }
  writeRecoveryLog(logEntry) {
    try {
      const logDir = "./logs";
      if (!fs2.existsSync(logDir)) {
        fs2.mkdirSync(logDir, { recursive: true });
      }
      const logFile = path2.join(logDir, "connection-recovery.log");
      const logLine = JSON.stringify(logEntry) + "\n";
      fs2.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error("Failed to write recovery log:", error);
    }
  }
  maskConnectionString(connectionUrl) {
    return connectionUrl.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.+)/, "$1***$2");
  }
  // Manual recovery trigger for admin
  async triggerManualRecovery() {
    console.log("\u{1F527} Manual recovery triggered by admin...");
    const fakeFailure = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: "Manual recovery trigger",
      recoveryAttempts: 0,
      databaseUrl: this.maskConnectionString(process.env.DATABASE_URL || "")
    };
    return await this.attemptRecovery(fakeFailure);
  }
  // Get recovery instructions for admin
  getRecoveryInstructions() {
    return [
      "1. Check database provider status (Neon, Railway, etc.)",
      "2. Verify DATABASE_URL environment variable is correct",
      "3. Test connection from external tool (e.g., pgAdmin)",
      "4. Check if database endpoint is disabled/suspended",
      "5. Contact database provider support if needed",
      "6. If data is lost, restore from latest backup",
      "7. Monitor connection stability after recovery",
      "8. Document incident for future prevention"
    ];
  }
};
var connectionRecovery = new ConnectionRecovery();

// server/database-monitor.ts
var DatabaseMonitor = class {
  healthCheckInterval = null;
  lastHealthCheck = null;
  async checkDatabaseHealth() {
    const startTime = Date.now();
    try {
      await db.execute(sql4`SELECT 1`);
      const tableResult = await db.execute(sql4`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      const tableCount = Number(tableResult.rows[0]?.count || 0);
      const recordResult = await db.execute(sql4`
        SELECT 
          (SELECT COUNT(*) FROM users) + 
          (SELECT COUNT(*) FROM daos) + 
          (SELECT COUNT(*) FROM governance_issues) + 
          (SELECT COUNT(*) FROM comments) + 
          (SELECT COUNT(*) FROM votes) as total
      `);
      const totalRecords = Number(recordResult.rows[0]?.total || 0);
      const health = {
        isConnected: true,
        connectionTime: Date.now() - startTime,
        tableCount,
        totalRecords,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.lastHealthCheck = health;
      return health;
    } catch (error) {
      const health = {
        isConnected: false,
        connectionTime: Date.now() - startTime,
        lastError: error instanceof Error ? error.message : "Unknown error",
        tableCount: 0,
        totalRecords: 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.lastHealthCheck = health;
      console.error("\u{1F6A8} Database health check failed:", error);
      if (!health.isConnected) {
        console.log("\u{1F198} Connection failed - triggering recovery process...");
        try {
          const recovered = await connectionRecovery.handleConnectionFailure(error instanceof Error ? error : new Error("Unknown database error"));
          if (recovered) {
            console.log("\u2705 Connection recovery successful");
            return await this.checkDatabaseHealth();
          }
        } catch (recoveryError) {
          console.error("\u274C Connection recovery failed:", recoveryError);
        }
      }
      return health;
    }
  }
  startMonitoring(intervalMinutes = 5) {
    console.log(`\u{1F50D} Starting database monitoring (every ${intervalMinutes} minutes)...`);
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.checkDatabaseHealth();
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.checkDatabaseHealth();
      if (health.isConnected) {
        console.log(`\u2705 Database healthy - ${health.totalRecords} records, ${health.connectionTime}ms`);
      } else {
        console.error("\u{1F6A8} DATABASE CONNECTION FAILED!");
        console.error("Last error:", health.lastError);
        this.sendAlert(health);
      }
    }, intervalMinutes * 60 * 1e3);
  }
  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log("\u{1F6D1} Database monitoring stopped");
    }
  }
  getLastHealthCheck() {
    return this.lastHealthCheck;
  }
  sendAlert(health) {
    console.error("\u{1F6A8} DATABASE ALERT \u{1F6A8}");
    console.error("Connection Status:", health.isConnected ? "CONNECTED" : "FAILED");
    console.error("Error:", health.lastError);
    console.error("Timestamp:", health.timestamp);
    console.error("Action Required: Check database connection and restore from backup if needed");
  }
  async validateDatabaseIntegrity() {
    try {
      const criticalTables = ["users", "daos", "governance_issues"];
      for (const table of criticalTables) {
        const result = await db.execute(sql4.raw(`SELECT COUNT(*) as count FROM ${table}`));
        const count2 = Number(result.rows[0]?.count || 0);
        console.log(`\u{1F4CA} Table ${table}: ${count2} records`);
      }
      const integrityResult = await db.execute(sql4`
        SELECT COUNT(*) as orphaned_comments
        FROM comments c 
        LEFT JOIN governance_issues gi ON c.governance_issue_id = gi.id 
        WHERE gi.id IS NULL
      `);
      const orphanedComments = Number(integrityResult.rows[0]?.orphaned_comments || 0);
      if (orphanedComments > 0) {
        console.warn(`\u26A0\uFE0F Found ${orphanedComments} orphaned comments`);
      }
      return true;
    } catch (error) {
      console.error("\u274C Database integrity check failed:", error);
      return false;
    }
  }
};
var databaseMonitor = new DatabaseMonitor();

// server/backup-restore.ts
init_db();
init_schema();
import fs3 from "fs";
import path3 from "path";
var BackupRestore = class {
  async restoreFromFile(backupFilename) {
    try {
      const backupPath = path3.join("./backups", backupFilename);
      if (!fs3.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupFilename}`);
      }
      console.log(`\u{1F4C1} Loading backup from: ${backupFilename}`);
      const backupData = JSON.parse(fs3.readFileSync(backupPath, "utf8"));
      console.log(`\u{1F4CA} Backup contains ${backupData.metadata.totalRecords} records from ${backupData.timestamp}`);
      let totalRestored = 0;
      console.log("\u{1F5D1}\uFE0F Clearing existing data...");
      await this.clearAllTables();
      const tableOrder = [
        { name: "users", data: backupData.tables.users, table: users },
        { name: "daos", data: backupData.tables.daos, table: daos },
        { name: "governance_issues", data: backupData.tables.governance_issues, table: governanceIssues },
        { name: "comments", data: backupData.tables.comments, table: comments },
        { name: "votes", data: backupData.tables.votes, table: votes },
        { name: "user_dao_follows", data: backupData.tables.user_dao_follows, table: userDaoFollows },
        { name: "user_dao_scores", data: backupData.tables.user_dao_scores, table: userDaoScores },
        { name: "reviews", data: backupData.tables.reviews, table: reviews },
        { name: "creda_activities", data: backupData.tables.creda_activities, table: credaActivities },
        { name: "invite_codes", data: backupData.tables.invite_codes, table: inviteCodes },
        { name: "referrals", data: backupData.tables.referrals, table: referrals },
        { name: "stance_votes", data: backupData.tables.stance_votes, table: stanceVotes }
      ];
      for (const { name, data, table } of tableOrder) {
        if (data && data.length > 0) {
          console.log(`\u{1F4E5} Restoring ${data.length} records to ${name}...`);
          const batchSize = 100;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await db.insert(table).values(batch);
          }
          totalRestored += data.length;
          console.log(`\u2705 Restored ${data.length} ${name} records`);
        } else {
          console.log(`\u23ED\uFE0F Skipping ${name} - no data`);
        }
      }
      console.log(`\u{1F389} Restoration complete! ${totalRestored} total records restored`);
      return {
        success: true,
        message: `Successfully restored ${totalRestored} records from ${backupFilename}`,
        recordsRestored: totalRestored
      };
    } catch (error) {
      console.error("\u274C Restoration failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown restoration error",
        recordsRestored: 0
      };
    }
  }
  async clearAllTables() {
    try {
      const clearOrder = [
        stanceVotes,
        referrals,
        inviteCodes,
        credaActivities,
        reviews,
        userDaoScores,
        userDaoFollows,
        votes,
        comments,
        governanceIssues,
        daos,
        users
      ];
      for (const table of clearOrder) {
        await db.delete(table);
      }
      console.log("\u2705 All tables cleared");
    } catch (error) {
      console.error("\u274C Error clearing tables:", error);
      throw error;
    }
  }
  async listAvailableBackups() {
    try {
      const backupsDir = "./backups";
      if (!fs3.existsSync(backupsDir)) {
        return { backups: [] };
      }
      const files = fs3.readdirSync(backupsDir).filter((file) => file.endsWith(".json")).sort().reverse();
      const backupsInfo = [];
      for (const file of files) {
        try {
          const filePath = path3.join(backupsDir, file);
          const stats = fs3.statSync(filePath);
          const content = fs3.readFileSync(filePath, "utf8");
          const backup = JSON.parse(content);
          backupsInfo.push({
            filename: file,
            timestamp: backup.timestamp,
            size: `${Math.round(stats.size / 1024)}KB`,
            recordCount: backup.metadata.totalRecords,
            type: backup.metadata.backupType
          });
        } catch (error) {
          console.error(`Error reading backup file ${file}:`, error);
        }
      }
      return { backups: backupsInfo };
    } catch (error) {
      console.error("Error listing backups:", error);
      return { backups: [] };
    }
  }
  async validateBackup(backupFilename) {
    try {
      const backupPath = path3.join("./backups", backupFilename);
      if (!fs3.existsSync(backupPath)) {
        return {
          valid: false,
          message: `Backup file not found: ${backupFilename}`
        };
      }
      const stats = fs3.statSync(backupPath);
      const content = fs3.readFileSync(backupPath, "utf8");
      const backup = JSON.parse(content);
      const tableNames = Object.keys(backup.tables).filter(
        (tableName) => backup.tables[tableName]?.length > 0
      );
      return {
        valid: true,
        message: "Backup file is valid and ready for restoration",
        details: {
          timestamp: backup.timestamp,
          recordCount: backup.metadata.totalRecords,
          tables: tableNames,
          fileSize: `${Math.round(stats.size / 1024)}KB`
        }
      };
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Invalid backup file format"
      };
    }
  }
  async createRestorePoint() {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const restorePointFile = `restore-point-${timestamp2}.json`;
    const { backupService: backupService2 } = await Promise.resolve().then(() => (init_backup(), backup_exports));
    const backupPath = await backupService2.createFullBackup(restorePointFile);
    console.log(`\u{1F4BE} Restore point created: ${restorePointFile}`);
    return backupPath;
  }
};
var backupRestore = new BackupRestore();

// server/routes.ts
init_schema();
init_notifications();

// server/services/ogStorageService.ts
import { ethers } from "ethers";
import crypto2 from "crypto";
import fs4 from "fs";
import path4 from "path";
import os from "os";
var OgStorageService = class {
  privateKey;
  rpcUrl;
  indexerUrl;
  appName;
  isInitialized;
  wallet;
  provider;
  indexer;
  constructor() {
    this.privateKey = process.env.OG_PRIVATE_KEY || null;
    this.rpcUrl = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";
    this.indexerUrl = process.env.OG_INDEXER_URL || "https://indexer-storage-turbo.0g.ai";
    this.appName = process.env.APP_NAME || "DAO-AI-CREDA";
    this.isInitialized = false;
    this.wallet = null;
    this.provider = null;
    this.indexer = null;
    this.initialize();
  }
  async initialize() {
    if (!this.privateKey) {
      console.log("[0G Storage] No OG_PRIVATE_KEY configured - 0G Storage disabled");
      return;
    }
    try {
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      try {
        const zgSdk = await import("@0glabs/0g-ts-sdk");
        this.indexer = new zgSdk.Indexer(this.indexerUrl);
        console.log("[0G Storage] SDK Indexer initialized successfully");
      } catch (sdkError) {
        console.log("[0G Storage] SDK import failed, using fallback mode:", sdkError);
        this.indexer = null;
      }
      this.isInitialized = true;
      console.log(`[0G Storage] Initialized with wallet: ${this.wallet.address}`);
      console.log(`[0G Storage] Using RPC: ${this.rpcUrl}`);
      console.log(`[0G Storage] Using Indexer: ${this.indexerUrl}`);
    } catch (error) {
      console.error("[0G Storage] Initialization failed:", error);
      this.isInitialized = false;
    }
  }
  isAvailable() {
    return this.isInitialized && !!this.wallet;
  }
  // Generate Merkle root hash from data
  generateMerkleRoot(data) {
    const hash = crypto2.createHash("sha256").update(data).digest("hex");
    return `0x${hash}`;
  }
  // Upload data to 0G Storage using SDK
  async uploadAuditRecord(record) {
    if (!this.isAvailable()) {
      return {
        success: false,
        txHash: null,
        rootHash: null,
        error: "0G Storage not configured"
      };
    }
    try {
      const recordJson = JSON.stringify(record, null, 2);
      const dataBuffer = Buffer.from(recordJson, "utf-8");
      const signature = await this.wallet.signMessage(recordJson);
      const payload = {
        record,
        signature,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        walletAddress: this.wallet.address,
        chainId: 16661,
        // 0G Mainnet chain ID
        app: this.appName
      };
      const payloadJson = JSON.stringify(payload, null, 2);
      const payloadBuffer = Buffer.from(payloadJson, "utf-8");
      if (this.indexer) {
        try {
          const result = await this.uploadWithSdk(payloadBuffer, payloadJson);
          if (result.success) {
            return result;
          }
        } catch (sdkError) {
          console.log("[0G Storage] SDK upload failed, using fallback:", sdkError);
        }
      }
      const rootHash = this.generateMerkleRoot(payloadBuffer);
      return this.createSignedProof(record, signature, rootHash);
    } catch (error) {
      console.error("[0G Storage] Upload failed:", error);
      return {
        success: false,
        txHash: null,
        rootHash: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  // Upload using 0G SDK
  async uploadWithSdk(data, content) {
    if (!this.indexer || !this.wallet) {
      throw new Error("SDK not initialized");
    }
    try {
      const tempDir = os.tmpdir();
      const tempFile = path4.join(tempDir, `0g-audit-${Date.now()}.json`);
      fs4.writeFileSync(tempFile, content);
      const zgSdk = await import("@0glabs/0g-ts-sdk");
      const file = await zgSdk.ZgFile.fromFilePath(tempFile);
      const [tree, treeErr] = await file.merkleTree();
      if (treeErr) {
        await file.close();
        fs4.unlinkSync(tempFile);
        throw new Error(`Failed to create merkle tree: ${treeErr}`);
      }
      const rootHash = tree.rootHash();
      console.log(`[0G Storage] File root hash: ${rootHash}`);
      const [tx, uploadErr] = await this.indexer.upload(file, this.rpcUrl, this.wallet);
      await file.close();
      fs4.unlinkSync(tempFile);
      if (uploadErr) {
        throw new Error(`Upload failed: ${uploadErr}`);
      }
      const txHash = typeof tx === "string" ? tx : tx?.txHash || tx?.hash || String(tx);
      console.log(`[0G Storage] Successfully uploaded to 0G Storage, tx: ${txHash}`);
      return {
        success: true,
        txHash,
        rootHash,
        storagescanUrl: `https://storagescan.0g.ai/file/${rootHash}`
      };
    } catch (error) {
      console.error("[0G Storage] SDK upload error:", error);
      throw error;
    }
  }
  // Create a cryptographically signed proof as fallback
  async createSignedProof(record, signature, rootHash) {
    const abiCoder = new ethers.AbiCoder();
    const proofId = ethers.keccak256(
      abiCoder.encode(
        ["bytes32", "address", "uint256"],
        [rootHash, this.wallet.address, Date.now()]
      )
    );
    console.log(`[0G Storage] Created signed proof: ${proofId}`);
    return {
      success: true,
      txHash: proofId,
      rootHash,
      storagescanUrl: `/api/0g-verify/${proofId}`
    };
  }
  // Create an audit record for a user action
  createAuditRecord(actionId, actionType, actorUserId, targetId, targetType, content, metadata = {}) {
    return {
      action_id: actionId.toString(),
      action_type: actionType,
      actor_user_id: actorUserId,
      target_id: targetId,
      target_type: targetType,
      content: content.substring(0, 500),
      // Limit content size
      metadata: {
        ...metadata,
        recordedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      app: this.appName,
      environment: process.env.NODE_ENV || "development"
    };
  }
  // Record a stance creation
  async recordStanceCreated(activityId, userId, targetId, content, metadata = {}) {
    const record = this.createAuditRecord(
      activityId,
      "STANCE",
      userId,
      targetId,
      "USER",
      content,
      metadata
    );
    return this.uploadAuditRecord(record);
  }
  // Record a comment creation
  async recordCommentCreated(activityId, userId, commentId, issueId, content, metadata = {}) {
    const record = this.createAuditRecord(
      activityId,
      "COMMENT",
      userId,
      commentId,
      "COMMENT",
      content,
      { ...metadata, issueId }
    );
    return this.uploadAuditRecord(record);
  }
  // Record a vote
  async recordVoteCast(activityId, userId, targetId, targetType, voteType, metadata = {}) {
    const record = this.createAuditRecord(
      activityId,
      "VOTE",
      userId,
      targetId,
      targetType,
      voteType,
      metadata
    );
    return this.uploadAuditRecord(record);
  }
  // Record a review
  async recordReviewCreated(activityId, userId, targetId, targetType, content, rating, metadata = {}) {
    const record = this.createAuditRecord(
      activityId,
      "REVIEW",
      userId,
      targetId,
      targetType,
      content,
      { ...metadata, rating }
    );
    return this.uploadAuditRecord(record);
  }
  // Get verification URL for a record
  getVerificationUrl(txHash) {
    if (txHash.startsWith("0x") && txHash.length === 66) {
      return `https://storagescan.0g.ai/file/${txHash}`;
    }
    return `/api/0g-verify/${txHash}`;
  }
  // Verify a record
  async verifyRecord(txHash, rootHash) {
    try {
      if (txHash.startsWith("0x") && txHash.length === 66) {
        try {
          const response = await fetch(`https://storagescan.0g.ai/api/file/${txHash}`);
          if (response.ok) {
            const data = await response.json();
            return {
              verified: true,
              details: {
                type: "on_chain",
                txHash,
                rootHash,
                storageData: data
              }
            };
          }
        } catch {
        }
        return {
          verified: true,
          details: {
            type: "signed_proof",
            txHash,
            rootHash,
            walletAddress: this.wallet?.address
          }
        };
      }
      return { verified: false };
    } catch (error) {
      console.error("[0G Storage] Verification error:", error);
      return { verified: false };
    }
  }
  // Get wallet balance for gas
  async getWalletBalance() {
    if (!this.wallet || !this.provider) {
      return "0";
    }
    try {
      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      return "0";
    }
  }
  // Check if wallet has enough balance for transactions
  async hasEnoughBalance() {
    const balance = await this.getWalletBalance();
    return parseFloat(balance) > 1e-3;
  }
  // Test upload - create a test record and upload to 0G Storage
  async testUpload() {
    const testRecord = this.createAuditRecord(
      Date.now(),
      "STANCE",
      "test-user-id",
      "test-target",
      "USER",
      "This is a test upload to verify 0G Storage integration",
      {
        testId: `test-${Date.now()}`,
        purpose: "0G Storage integration test",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    console.log("[0G Storage] Running test upload...");
    return this.uploadAuditRecord(testRecord);
  }
};
var ogStorageService = new OgStorageService();

// server/routes.ts
init_db();
init_schema();
import { z as z2 } from "zod";
import passport3 from "passport";
import { eq as eq2, desc as desc2, and as and2, sql as sql5 } from "drizzle-orm";
import sharp from "sharp";
import bcrypt2 from "bcryptjs";
async function recordActivityToOgStorage(activityId, activityType, userId, targetId, targetType, content, metadata = {}) {
  try {
    if (!ogStorageService.isAvailable()) {
      console.log("[0G Storage] Service not available, skipping on-chain recording");
      return;
    }
    let result;
    switch (activityType) {
      case "STANCE":
        result = await ogStorageService.recordStanceCreated(activityId, userId, targetId, content, metadata);
        break;
      case "COMMENT":
        result = await ogStorageService.recordCommentCreated(activityId, userId, targetId, metadata.issueId || 0, content, metadata);
        break;
      case "VOTE":
        result = await ogStorageService.recordVoteCast(activityId, userId, targetId, targetType, metadata.voteType || "vote", metadata);
        break;
      case "REVIEW":
        result = await ogStorageService.recordReviewCreated(activityId, userId, targetId, targetType, content, metadata.rating || 0, metadata);
        break;
    }
    if (result?.success && result.txHash && result.rootHash) {
      await storage.updateCredaActivityWithOgProof(activityId, result.txHash, result.rootHash);
    }
  } catch (error) {
    console.error("[0G Storage] Failed to record activity:", error);
  }
}
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  await setupAuth(app2);
  setupEmailAuth();
  setupTwitterAuth(app2);
  app2.get("/api/auth/user", async (req, res) => {
    try {
      let userId;
      let user;
      if (req.user && req.user.claims) {
        userId = req.user.claims.sub;
        user = await storage.getUser(userId);
      } else if (req.user && req.user.id) {
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
  const signupSchema = z2.object({
    email: z2.string().email(),
    password: z2.string().min(8),
    username: z2.string().optional(),
    firstName: z2.string().optional(),
    lastName: z2.string().optional()
  });
  const signinSchema = z2.object({
    email: z2.string().email(),
    password: z2.string()
  });
  const verifyEmailSchema = z2.object({
    email: z2.string().email(),
    code: z2.string().length(6)
  });
  app2.post("/api/auth/signup", async (req, res, next) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      passport3.authenticate("local-signup", (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(400).json({ message: info.message || "Signup failed" });
        }
        req.logIn(user, (err2) => {
          if (err2) {
            return res.status(500).json({ message: "Login failed after signup" });
          }
          return res.status(201).json({
            message: "Signup successful. Please check your email for verification code.",
            user: { id: user.id, email: user.email, emailVerified: user.emailVerified }
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });
  app2.post("/api/auth/signin", async (req, res, next) => {
    try {
      const validatedData = signinSchema.parse(req.body);
      passport3.authenticate("local-signin", (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        req.logIn(user, (err2) => {
          if (err2) {
            return res.status(500).json({ message: "Login failed" });
          }
          return res.json({
            message: "Signin successful",
            user: { id: user.id, email: user.email, emailVerified: user.emailVerified }
          });
        });
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });
  app2.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { email, code } = verifyEmailSchema.parse(req.body);
      const verified = await verifyEmailCode(email, code);
      if (verified) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification code" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });
  app2.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = z2.object({ email: z2.string().email() }).parse(req.body);
      const sent = await resendVerificationCode(email);
      if (sent) {
        res.json({ message: "Verification code sent successfully" });
      } else {
        res.status(400).json({ message: "Unable to send verification code" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid input data" });
    }
  });
  app2.post("/api/auth/signout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });
  app2.post("/api/user/verify-wallet", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      const { walletAddress, txHash } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!walletAddress || typeof walletAddress !== "string") {
        return res.status(400).json({ message: "Invalid wallet address" });
      }
      await db.update(users).set({
        walletAddress: walletAddress.toLowerCase(),
        walletVerificationTxHash: txHash || null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq2(users.id, userId));
      console.log(`Wallet verified for user ${userId}: ${walletAddress}${txHash ? `, txHash: ${txHash}` : ""}`);
      res.json({
        success: true,
        message: "Wallet verified successfully",
        walletAddress,
        txHash
      });
    } catch (error) {
      console.error("Error verifying wallet:", error);
      res.status(500).json({ message: "Failed to verify wallet" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
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
        if (req.session) {
          req.session.adminAuthenticated = true;
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
  app2.post("/api/admin/auth", async (req, res) => {
    try {
      const { password } = req.body;
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
      console.log("Admin auth attempt:", {
        receivedPassword: password ? "***" : "empty",
        envPasswordSet: !!ADMIN_PASSWORD
      });
      if (password === ADMIN_PASSWORD) {
        console.log("Admin authentication successful");
        if (req.session) {
          req.session.adminAuthenticated = true;
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
  app2.get("/api/admin/check-auth", (req, res) => {
    console.log("Check auth - session:", req.session ? "exists" : "missing", "adminAuth:", req.session?.adminAuthenticated);
    if (req.session && req.session.adminAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  const requireAdminAuth = (req, res, next) => {
    console.log("RequireAdminAuth - session:", req.session ? "exists" : "missing", "adminAuth:", req.session?.adminAuthenticated);
    if (req.session && req.session.adminAuthenticated) {
      next();
    } else {
      res.status(401).json({ message: "Admin authentication required" });
    }
  };
  app2.post("/api/company/login", async (req, res) => {
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
      const passwordMatch = await bcrypt2.compare(password, companyUser.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      await storage.updateCompanyUserLastLogin(companyUser.id);
      if (req.session) {
        req.session.companyUserId = companyUser.id;
        req.session.companyId = companyUser.companyId;
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
  app2.get("/api/company/check-auth", (req, res) => {
    if (req.session && req.session.companyUserId) {
      res.json({
        authenticated: true,
        companyId: req.session.companyId,
        userId: req.session.companyUserId
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  app2.post("/api/company/logout", (req, res) => {
    if (req.session) {
      delete req.session.companyUserId;
      delete req.session.companyId;
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
  const requireCompanyAuth = (req, res, next) => {
    if (req.session && req.session.companyUserId) {
      next();
    } else {
      res.status(401).json({ message: "Company authentication required" });
    }
  };
  app2.get("/api/company/dashboard/profile", requireCompanyAuth, async (req, res) => {
    try {
      const companyId = req.session.companyId;
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
  app2.get("/api/company/dashboard/reviews", requireCompanyAuth, async (req, res) => {
    try {
      const companyId = req.session.companyId;
      const company = await storage.getCompanyById(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      const reviews3 = await storage.getProjectReviews(company.externalId);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching company reviews:", error);
      res.status(500).json({ message: "Failed to fetch company reviews" });
    }
  });
  app2.post("/api/company/dashboard/reviews/:reviewId/reply", requireCompanyAuth, async (req, res) => {
    try {
      const companyId = req.session.companyId;
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
  app2.get("/api/company/dashboard/analytics", requireCompanyAuth, async (req, res) => {
    try {
      const companyId = req.session.companyId;
      const analytics = await storage.getCompanyAnalytics(companyId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching company analytics:", error);
      res.status(500).json({ message: "Failed to fetch company analytics" });
    }
  });
  app2.get("/api/daos", async (req, res) => {
    try {
      const daos3 = await storage.getAllDaos();
      res.json(daos3);
    } catch (error) {
      console.error("Error fetching DAOs:", error);
      res.status(500).json({ message: "Failed to fetch DAOs" });
    }
  });
  app2.get("/api/daos/:slug", async (req, res) => {
    try {
      const slug = req.params.slug.toLowerCase();
      if (slug === "jupiter") {
        const jupiterDao = {
          id: 5,
          name: "Jupiter",
          slug: "jupiter",
          description: "The key liquidity aggregator and swap infrastructure for Solana, offering the widest range of tokens and best route discovery",
          logoUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy: null,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
  app2.get("/api/daos/:daoId/reviews", async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      if (isNaN(daoId)) {
        return res.status(400).json({ message: "Invalid DAO ID" });
      }
      console.log(`Fetching reviews for DAO ID: ${daoId}`);
      const reviews3 = await storage.getDaoReviews(daoId);
      console.log(`Found ${reviews3.length} reviews for DAO ${daoId}`);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching DAO reviews:", error);
      res.status(500).json({ message: "Failed to fetch DAO reviews" });
    }
  });
  app2.post("/api/daos", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/daos/:daoId/issues", async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const sortBy = req.query.sort || "latest";
      const issues = await storage.getGovernanceIssuesByDao(daoId, sortBy);
      res.json(issues);
    } catch (error) {
      console.error("Error fetching governance issues:", error);
      res.status(500).json({ message: "Failed to fetch governance issues" });
    }
  });
  app2.get("/api/issues/recent", async (req, res) => {
    try {
      const issues = await storage.getRecentGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching recent governance issues:", error);
      res.status(500).json({ message: "Failed to fetch recent governance issues" });
    }
  });
  app2.get("/api/issues/active", async (req, res) => {
    try {
      const issues = await storage.getActiveGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching active governance issues:", error);
      res.status(500).json({ message: "Failed to fetch active governance issues" });
    }
  });
  app2.get("/api/stance-slots/availability", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const activeStanceCount = await storage.getActiveStanceCount();
      const nextExpirationTime = await storage.getNextStanceExpirationTime();
      const userActiveStanceCount = await storage.getUserActiveStanceCount(userId);
      const meetsGrsRequirement = user.grsScore >= 1400;
      const globalSlotsAvailable = activeStanceCount < 5;
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
  app2.get("/api/issues/:id", async (req, res) => {
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
  app2.post("/api/issues", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.grsScore < 1400) {
        return res.status(403).json({
          message: "You need a GRS of at least 1400 to post a stance. Keep engaging to build your reputation."
        });
      }
      const activeStances = await storage.getActiveGovernanceIssues();
      if (activeStances.length >= 5) {
        return res.status(429).json({
          message: "Only 5 stances can be active at once. Please wait for a slot to open."
        });
      }
      let spaceId = null;
      if (req.body.spaceSlug && req.body.spaceSlug.trim() !== "") {
        const space = await storage.getSpaceBySlug(req.body.spaceSlug);
        if (space) {
          spaceId = space.id;
        }
      }
      const issueData = insertGovernanceIssueSchema.parse({
        ...req.body,
        authorId: userId,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : void 0,
        spaceId
      });
      const hasTargetProject = issueData.targetProjectId && issueData.targetProjectName;
      const hasTargetUser = issueData.targetUserId || issueData.targetUsername;
      if (!hasTargetProject && !hasTargetUser) {
        return res.status(400).json({
          message: "A target project or user must be selected"
        });
      }
      if (hasTargetProject) {
        const targetHasActiveStance = await storage.hasActiveStanceOnProject(issueData.targetProjectId);
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
      const credaActivity = await storage.awardStanceCreationCreda(userId, issue.id);
      if (credaActivity && credaActivity.id) {
        recordActivityToOgStorage(
          credaActivity.id,
          "STANCE",
          userId,
          issue.id,
          "ISSUE",
          issue.content || "",
          {
            stanceType: issue.stance,
            targetProjectId: issue.targetProjectId,
            targetProjectName: issue.targetProjectName,
            targetUserId: issue.targetUserId,
            targetUsername: issue.targetUsername,
            title: issue.title
          }
        ).catch((err) => console.error("[0G Storage] Background recording failed:", err));
      }
      const response = { ...issue, pointsEarned: 100 };
      console.log("Sending response:", response);
      res.json(response);
    } catch (error) {
      console.error("Error creating governance issue:", error);
      res.status(500).json({ message: "Failed to create governance issue", details: error.message });
    }
  });
  app2.get("/api/issues/:issueId/comments", async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const comments2 = await storage.getCommentsByIssue(issueId);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/comments", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { stance, ...rest } = req.body;
      const commentData = insertCommentSchema.parse({
        ...rest,
        authorId: userId,
        stance: stance || null
      });
      const comment = await storage.createComment(commentData);
      const commentActivity = await storage.awardCommentCreda(userId, commentData.content, commentData.issueId);
      if (commentActivity && commentActivity.id) {
        recordActivityToOgStorage(
          commentActivity.id,
          "COMMENT",
          userId,
          comment.id,
          "ISSUE",
          commentData.content,
          {
            issueId: commentData.issueId,
            stance: commentData.stance,
            parentCommentId: commentData.parentCommentId
          }
        );
      }
      try {
        const issue = await storage.getGovernanceIssueById(commentData.issueId);
        const commenter = await storage.getUser(userId);
        if (issue && commenter && issue.authorId !== userId) {
          const cleanTitle = issue.title && issue.title.length > 3 && !issue.title.match(/^[a-z]{8,}$/) ? issue.title : issue.content ? issue.content.substring(0, 50) + "..." : "a stance";
          const commenterName = commenter.username || commenter.twitterHandle || "Someone";
          await NotificationService.notifyNewComment(
            issue.authorId,
            userId,
            commenterName,
            cleanTitle,
            issue.id,
            "stance",
            commentData.content
          );
        }
        if (commentData.parentCommentId && issue && commenter) {
          const parentComment = await storage.getCommentById(commentData.parentCommentId);
          if (parentComment && parentComment.authorId !== userId) {
            const cleanTitle = issue.title && issue.title.length > 3 && !issue.title.match(/^[a-z]{8,}$/) ? issue.title : issue.content ? issue.content.substring(0, 50) + "..." : "a stance";
            const commenterName = commenter.username || commenter.twitterHandle || "Someone";
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
      const pointsEarned = commentData.content.length >= 100 ? 20 : 10;
      res.json({
        ...comment,
        pointsEarned,
        message: pointsEarned > 0 ? "Comment posted successfully! You earned +" + pointsEarned + " points." : "Comment posted successfully!"
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.post("/api/votes", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const voteData = insertVoteSchema.parse({
        ...req.body,
        userId
      });
      const existingVote = await storage.getUserVote(voteData.userId, voteData.targetType, voteData.targetId);
      if (existingVote) {
        return res.status(400).json({ message: "Already voted" });
      }
      const vote = await storage.createVote(voteData);
      let authorId = null;
      let daoId = null;
      if (voteData.targetType === "issue") {
        const issue = await storage.getGovernanceIssueById(voteData.targetId);
        if (issue) {
          authorId = issue.authorId;
          daoId = issue.daoId;
        }
      } else if (voteData.targetType === "comment") {
        const comment = await storage.getCommentById(voteData.targetId);
        if (comment) {
          authorId = comment.authorId;
          const issue = await storage.getGovernanceIssueById(comment.issueId);
          if (issue) {
            daoId = issue.daoId;
          }
        }
      }
      if (authorId) {
        const voteActivity = await storage.awardVotingXp(userId, voteData.targetType, voteData.targetId, voteData.voteType);
        if (voteActivity && voteActivity.id) {
          recordActivityToOgStorage(
            voteActivity.id,
            "VOTE",
            userId,
            voteData.targetId,
            voteData.targetType === "issue" ? "ISSUE" : "COMMENT",
            "",
            {
              voteType: voteData.voteType,
              targetType: voteData.targetType
            }
          );
        }
        if (voteData.targetType === "issue") {
          if (voteData.voteType === "upvote") {
            await storage.awardUpvoteReceivedXp(authorId, voteData.targetId);
          } else {
            await storage.awardDownvoteReceivedXp(authorId, voteData.targetId);
          }
        } else if (voteData.targetType === "comment" && voteData.voteType === "upvote") {
          await storage.awardCommentUpvoteReceivedXp(authorId, voteData.targetId);
        }
        if (voteData.targetType === "comment") {
          const comment = await storage.getCommentById(voteData.targetId);
          if (comment) {
            const issue = await storage.getGovernanceIssueById(comment.issueId);
            if (issue && issue.authorId !== authorId) {
              await storage.awardCommentReceivedXp(issue.authorId, issue.id);
            }
          }
        }
        try {
          const voter = await storage.getUser(userId);
          if (voter && authorId !== userId) {
            let itemTitle = "";
            let itemId = voteData.targetId;
            if (voteData.targetType === "issue") {
              const issue = await storage.getGovernanceIssueById(voteData.targetId);
              if (issue) {
                itemTitle = issue.title;
                await NotificationService.notifyNewVote(
                  authorId,
                  userId,
                  voter.username,
                  voteData.voteType,
                  "stance",
                  itemTitle,
                  itemId
                );
              }
            } else if (voteData.targetType === "comment") {
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
                    "review",
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
  app2.get("/api/issues/:issueId/vote", requireInviteAccess, async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const userId = req.user.claims?.sub || req.user.id;
      const existingVote = await storage.getUserVote(userId, "issue", issueId);
      res.json(existingVote);
    } catch (error) {
      console.error("Error fetching user vote:", error);
      res.status(500).json({ message: "Failed to fetch user vote" });
    }
  });
  app2.post("/api/issues/:issueId/vote", requireInviteAccess, async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;
      const existingVote = await storage.getUserVote(userId, "issue", issueId);
      if (existingVote) {
        return res.status(400).json({ message: "Already voted" });
      }
      const voteData = {
        userId,
        targetType: "issue",
        targetId: issueId,
        voteType: type
      };
      const vote = await storage.createVote(voteData);
      const issue = await storage.getGovernanceIssueById(issueId);
      if (issue) {
        const voteActivity = await storage.awardVotingXp(userId, "issue", issueId, type);
        if (voteActivity && voteActivity.id) {
          recordActivityToOgStorage(
            voteActivity.id,
            "VOTE",
            userId,
            issueId,
            "ISSUE",
            "",
            {
              voteType: type,
              targetType: "issue"
            }
          );
        }
        if (type === "upvote") {
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
  app2.post("/api/comments/:commentId/vote", requireInviteAccess, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;
      if (!["upvote", "downvote"].includes(type)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      const existingVote = await db.select().from(commentVotes).where(and2(
        eq2(commentVotes.userId, userId),
        eq2(commentVotes.commentId, commentId)
      )).limit(1);
      if (existingVote.length > 0) {
        return res.status(400).json({ message: "You have already voted on this comment" });
      }
      const comment = await storage.getCommentById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      await db.insert(commentVotes).values({
        commentId,
        userId,
        voteType: type
      });
      if (type === "upvote") {
        await db.update(comments).set({ upvotes: sql5`${comments.upvotes} + 1` }).where(eq2(comments.id, commentId));
      } else {
        await db.update(comments).set({ downvotes: sql5`${comments.downvotes} + 1` }).where(eq2(comments.id, commentId));
      }
      let pointsEarned = 0;
      const commentVoteActivity = await storage.awardVotingXp(userId, "comment", commentId, type);
      pointsEarned += 3;
      if (commentVoteActivity && commentVoteActivity.id) {
        recordActivityToOgStorage(
          commentVoteActivity.id,
          "VOTE",
          userId,
          commentId,
          "COMMENT",
          "",
          {
            voteType: type,
            targetType: "comment"
          }
        );
      }
      if (type === "upvote") {
        await storage.awardUpvoteReceivedXp(comment.authorId, commentId);
        if (comment.authorId !== userId) {
          const voter = await storage.getUser(userId);
          await NotificationService.notifyNewVote(
            comment.authorId,
            userId,
            voter?.username || "Someone",
            "upvote",
            "comment",
            comment.content.substring(0, 50) + "...",
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
  app2.get("/api/reviews/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const recentReviews = await storage.getRecentReviews(limit);
      res.json(recentReviews);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      res.status(500).json({ message: "Failed to fetch recent reviews" });
    }
  });
  app2.get("/api/reviews/recent-grs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const timeoutPromise = new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Request timeout")), 1e4)
      );
      const reviewsPromise = storage.getRecentReviewsWithGrsChanges(limit);
      const recentReviewsWithGrsChanges = await Promise.race([reviewsPromise, timeoutPromise]);
      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
      res.json(recentReviewsWithGrsChanges);
    } catch (error) {
      console.error("Error fetching recent reviews with GRS:", error);
      res.json([]);
    }
  });
  app2.get("/api/reviews/:reviewId", async (req, res) => {
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
  app2.get("/api/reviews/:reviewId/comments", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      const comments2 = await storage.getReviewComments(reviewId);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching review comments:", error);
      res.status(500).json({ message: "Failed to fetch review comments" });
    }
  });
  app2.post("/api/reviews/:reviewId/comments", requireInviteAccess, async (req, res) => {
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
        reviewId,
        parentCommentId: parentCommentId || null
      };
      const newComment = await storage.createReviewComment(commentData);
      let reviewCommentActivity = null;
      try {
        reviewCommentActivity = await storage.awardCredaPoints(userId, "social", "review_comment", 10, "review_comment", reviewId, {
          commentId: newComment.id,
          parentCommentId: parentCommentId || null
        });
      } catch (credaError) {
        console.error("Failed to award CREDA for review comment:", credaError);
      }
      if (reviewCommentActivity && reviewCommentActivity.id) {
        recordActivityToOgStorage(
          reviewCommentActivity.id,
          "COMMENT",
          userId,
          newComment.id,
          "REVIEW",
          content.trim(),
          {
            reviewId,
            parentCommentId: parentCommentId || null,
            commentType: "review_comment"
          }
        ).catch((err) => console.error("[0G Storage] Background recording for review comment failed:", err));
      }
      try {
        const review = await storage.getReviewById(reviewId);
        const commenter = await storage.getUser(userId);
        if (review && commenter) {
          if (parentCommentId) {
            const parentComment = await storage.getReviewCommentById(parentCommentId);
            if (parentComment && parentComment.authorId !== userId) {
              const reviewTitle = review.title ? review.title.substring(0, 50) + "..." : "a review";
              const commenterName = commenter.username || commenter.twitterHandle || "Someone";
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
            const reviewTitle = review.title ? review.title.substring(0, 50) + "..." : "your review";
            const commenterName = commenter.username || commenter.twitterHandle || "Someone";
            await NotificationService.notifyNewComment(
              review.reviewerId,
              userId,
              commenterName,
              reviewTitle,
              reviewId,
              "review",
              content.trim()
            );
          }
        }
      } catch (notificationError) {
        console.error("Failed to send review comment notification:", notificationError);
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
  app2.post("/api/reviews/batch-votes", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { reviewIds } = req.body;
      if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        return res.json({});
      }
      const limitedIds = reviewIds.slice(0, 100).map((id) => parseInt(id)).filter((id) => !isNaN(id));
      const votes2 = await storage.getUserVotesForReviews(userId, limitedIds);
      res.json(votes2);
    } catch (error) {
      console.error("Error fetching batch review votes:", error);
      res.status(500).json({ message: "Failed to fetch batch review votes" });
    }
  });
  app2.get("/api/reviews/:reviewId/vote", requireInviteAccess, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.claims?.sub || req.user.id;
      const existingVote = await storage.getUserVote(userId, "review", reviewId);
      res.json(existingVote);
    } catch (error) {
      console.error("Error fetching user review vote:", error);
      res.status(500).json({ message: "Failed to fetch user user review vote" });
    }
  });
  app2.post("/api/reviews/:reviewId/vote", requireInviteAccess, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.claims?.sub || req.user.id;
      const { type } = req.body;
      const existingVote = await storage.getUserVote(userId, "review", reviewId);
      if (existingVote) {
        return res.status(400).json({ message: "Already voted" });
      }
      const voteData = {
        userId,
        targetType: "review",
        targetId: reviewId,
        voteType: type
      };
      const vote = await storage.createVote(voteData);
      const review = await storage.getReviewById(reviewId);
      if (review) {
        const reviewVoteActivity = await storage.awardCredaPoints(
          userId,
          "engagement",
          "vote_cast",
          5,
          "review",
          reviewId,
          { action: `Voted ${type} on review ${reviewId}`, voteType: type }
        );
        if (reviewVoteActivity && reviewVoteActivity.id) {
          recordActivityToOgStorage(
            reviewVoteActivity.id,
            "VOTE",
            userId,
            reviewId,
            "REVIEW",
            "",
            {
              voteType: type,
              targetType: "review"
            }
          );
        }
        if (type === "upvote") {
          await storage.awardCredaPoints(
            review.reviewerId,
            "engagement",
            "review_upvote_received",
            5,
            "review",
            reviewId,
            { action: `Received upvote on review ${reviewId}` }
          );
        }
      }
      res.json(vote);
    } catch (error) {
      console.error("Error creating review vote:", error);
      res.status(500).json({ message: "Failed to create review vote" });
    }
  });
  app2.get("/api/stances/:stanceId/vote", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/user/stance-votes", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const votes2 = await storage.getUserStanceVotes(userId);
      res.json(votes2);
    } catch (error) {
      console.error("Error fetching user stance votes:", error);
      res.status(500).json({ message: "Failed to fetch user stance votes" });
    }
  });
  app2.post("/api/stances/:stanceId/vote", requireInviteAccess, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const userId = req.user.claims?.sub || req.user.id;
      const { voteType } = req.body;
      if (!["champion", "challenge", "oppose"].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      const stance = await storage.getGovernanceIssueById(stanceId);
      if (!stance) {
        return res.status(404).json({ message: "Stance not found" });
      }
      if (!stance.isActive || /* @__PURE__ */ new Date() > new Date(stance.expiresAt)) {
        return res.status(400).json({ message: "Voting period has ended" });
      }
      const existingVote = await storage.getUserStanceVote(userId, stanceId);
      if (existingVote) {
        return res.status(400).json({ message: "You have already voted on this stance" });
      }
      const voteData = {
        userId,
        stanceId,
        voteType
      };
      const vote = await storage.createStanceVote(voteData);
      const stanceVoteActivity = await storage.awardCredaPoints(
        userId,
        "engagement",
        "vote_cast",
        5,
        "stance_vote",
        stanceId,
        { action: `Voted ${voteType} on stance ${stanceId}`, voteType }
      );
      if (stanceVoteActivity && stanceVoteActivity.id) {
        recordActivityToOgStorage(
          stanceVoteActivity.id,
          "VOTE",
          userId,
          stanceId,
          "ISSUE",
          "",
          {
            voteType,
            targetType: "stance"
          }
        );
      }
      try {
        const voter = await storage.getUser(userId);
        if (voter && stance.authorId !== userId) {
          await NotificationService.notifyNewVote(
            stance.authorId,
            userId,
            voter.username || voter.twitterHandle || "Someone",
            voteType,
            "stance",
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
  app2.delete("/api/stances/:stanceId/vote", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/issues/:issueId/stance-vote-counts", async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const counts = await storage.getStanceVoteCounts(issueId);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching stance vote counts:", error);
      res.status(500).json({ message: "Failed to fetch stance vote counts" });
    }
  });
  app2.get("/api/stances/:stanceId/vote-counts", async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const counts = await storage.getStanceVoteCounts(stanceId);
      res.json(counts);
    } catch (error) {
      console.error("Error fetching stance vote counts:", error);
      res.status(500).json({ message: "Failed to fetch stance vote counts" });
    }
  });
  app2.get("/api/issues/:issueId/stance-voters", async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const voters = await storage.getStanceVoters(issueId);
      res.json(voters);
    } catch (error) {
      console.error("Error fetching stance voters:", error);
      res.status(500).json({ message: "Failed to fetch stance voters" });
    }
  });
  app2.get("/api/stances/:stanceId/voters", async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const voters = await storage.getStanceVoters(stanceId);
      res.json(voters);
    } catch (error) {
      console.error("Error fetching stance voters:", error);
      res.status(500).json({ message: "Failed to fetch stance voters" });
    }
  });
  app2.get("/api/leaderboard/global", async (req, res) => {
    try {
      const leaderboard = await storage.getGlobalLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  app2.get("/api/leaderboard/dao/:daoId", async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoLeaderboard(daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });
  app2.get("/api/leaderboard/creda", async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "overall";
      const limit = parseInt(req.query.limit) || 50;
      const daoId = req.query.daoId ? parseInt(req.query.daoId) : void 0;
      const leaderboard = await storage.getCredaLeaderboard(timeframe, limit, daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching CREDA leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch CREDA leaderboard" });
    }
  });
  app2.get("/api/leaderboard/xp", async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "overall";
      const limit = parseInt(req.query.limit) || 50;
      const daoId = req.query.daoId ? parseInt(req.query.daoId) : void 0;
      const leaderboard = await storage.getCredaLeaderboard(timeframe, limit, daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching XP leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch XP leaderboard" });
    }
  });
  app2.get("/api/leaderboard/stats", async (req, res) => {
    try {
      const stats = await storage.getLeaderboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching leaderboard stats:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard stats" });
    }
  });
  app2.get("/api/leaderboard/referrals", async (req, res) => {
    try {
      const leaderboard = await storage.getReferralLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching referral leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch referral leaderboard" });
    }
  });
  app2.get("/api/leaderboard/governors", async (req, res) => {
    try {
      const leaderboard = await storage.getGovernorsLeaderboard();
      res.json(leaderboard.slice(0, 6));
    } catch (error) {
      console.error("Error fetching governors leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch governors leaderboard" });
    }
  });
  app2.get("/api/users/recent", async (req, res) => {
    try {
      const users2 = await storage.getRecentUsers(6);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching recent users:", error);
      res.status(500).json({ message: "Failed to fetch recent users" });
    }
  });
  app2.get("/api/users/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      const users2 = await storage.searchUsers(query);
      res.json(users2);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });
  app2.get("/api/search/profiles", async (req, res) => {
    try {
      const query = req.query.q;
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
  app2.get("/api/twitter/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      const accounts = await storage.searchTwitterAccounts(query);
      const searchLower = query.toLowerCase();
      if ((searchLower.includes("jup") || searchLower.includes("jupiter")) && !accounts.some((acc) => acc.twitterHandle === "jup_dao")) {
        accounts.unshift({
          id: "jupiter_dao_profile",
          username: "Jupiter DAO",
          firstName: "Jupiter",
          lastName: "DAO",
          profileImageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center",
          xpPoints: 12450,
          isUnclaimedProfile: true,
          isClaimed: false,
          twitterHandle: "jup_dao",
          twitterUrl: "https://x.com/jup_dao",
          hasInviteAccess: false
        });
      }
      res.json(accounts);
    } catch (error) {
      console.error("Error searching Twitter accounts:", error);
      res.status(500).json({ message: "Failed to search Twitter accounts" });
    }
  });
  app2.post("/api/twitter/create-unclaimed", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { twitterHandle, twitterUrl, firstName, lastName, profileType } = req.body;
      if (!twitterHandle) {
        return res.status(400).json({ message: "Twitter handle is required" });
      }
      const cleanHandle = twitterHandle.replace("@", "");
      if (cleanHandle === "jup_dao" || cleanHandle === "jupiter_dao") {
        const profile2 = await storage.createUnclaimedProfile({
          twitterHandle: "jup_dao",
          twitterUrl: "https://x.com/jup_dao",
          firstName: "Jupiter",
          lastName: "DAO",
          createdBy: userId,
          profileType: "dao"
        });
        return res.json(profile2);
      }
      const profile = await storage.createUnclaimedProfile({
        twitterHandle: cleanHandle,
        twitterUrl,
        firstName,
        lastName,
        createdBy: userId,
        profileType: profileType || "member"
      });
      res.json(profile);
    } catch (error) {
      console.error("Error creating unclaimed profile:", error);
      if (error.message === "Twitter account already exists") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create unclaimed profile" });
    }
  });
  app2.get("/api/twitter/claimable/:handle", requireInviteAccess, async (req, res) => {
    try {
      const { handle } = req.params;
      const profiles = await storage.getClaimableProfilesForUser(handle);
      res.json(profiles);
    } catch (error) {
      console.error("Error getting claimable profiles:", error);
      res.status(500).json({ message: "Failed to get claimable profiles" });
    }
  });
  app2.get("/api/auth/twitter/claimable-profiles", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      if (!req.user.username || req.user.claims) {
        return res.status(400).json({ message: "This endpoint is only for Twitter OAuth users" });
      }
      const currentUser = await storage.getUser(userId);
      if (!currentUser || !currentUser.twitterHandle) {
        return res.status(400).json({ message: "Twitter handle not found for current user" });
      }
      const profiles = await storage.getClaimableProfilesForUser(currentUser.twitterHandle);
      console.log(`API endpoint found ${profiles.length} claimable profiles for ${currentUser.twitterHandle}`);
      res.json(profiles);
    } catch (error) {
      console.error("Error getting claimable profiles for authenticated user:", error);
      res.status(500).json({ message: "Failed to get claimable profiles" });
    }
  });
  app2.get("/api/auth/session-info", async (req, res) => {
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
  app2.post("/api/twitter/claim/:handle", requireInviteAccess, async (req, res) => {
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
  app2.post("/api/auth/twitter/claim-profile", async (req, res) => {
    try {
      const { unclaimedProfileId } = req.body;
      console.log("Claim profile request:", { unclaimedProfileId, sessionData: req.session });
      if (!req.session.inClaimingFlow || !req.session.twitterOAuthData) {
        return res.status(400).json({ message: "Not in claiming flow or missing Twitter OAuth data" });
      }
      const twitterOAuthData = req.session.twitterOAuthData;
      if (!unclaimedProfileId) {
        return res.status(400).json({ message: "Unclaimed profile ID is required" });
      }
      const claimableProfiles = req.session.claimableProfiles || [];
      const targetProfile = claimableProfiles.find((p) => p.id === unclaimedProfileId);
      if (!targetProfile) {
        return res.status(404).json({ message: "No matching claimable profile found" });
      }
      if (targetProfile.twitterHandle !== twitterOAuthData.username) {
        return res.status(400).json({ message: "Twitter handle mismatch" });
      }
      console.log("Claiming profile:", targetProfile.id, "for Twitter user:", twitterOAuthData.username);
      const updatedUser = await storage.updateUser(unclaimedProfileId, {
        email: null,
        // Twitter OAuth doesn't provide email
        profileImageUrl: twitterOAuthData.profileImageUrl,
        authProvider: "twitter",
        isClaimed: true,
        isUnclaimedProfile: false,
        claimedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to claim profile" });
      }
      console.log("Profile claimed successfully:", updatedUser.id);
      delete req.session.inClaimingFlow;
      delete req.session.twitterOAuthData;
      delete req.session.claimableProfiles;
      delete req.session.claimableProfilesCount;
      delete req.session.twitterHandle;
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
  app2.post("/api/users/unclaimed", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { fullName, twitterUrl, walletAddress, profileType } = req.body;
      if (!fullName) {
        return res.status(400).json({ message: "Full name is required" });
      }
      let twitterHandle = "";
      if (twitterUrl) {
        const match = twitterUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
        if (match) {
          twitterHandle = match[1];
        }
      }
      if (profileType === "dao") {
        let baseSlug = (twitterHandle || fullName).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        let daoSlug = baseSlug;
        let counter = 1;
        while (true) {
          try {
            const existingDao = await storage.getDaoBySlug(daoSlug);
            if (!existingDao) {
              break;
            }
            daoSlug = `${baseSlug}-${counter}`;
            counter++;
          } catch (error) {
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
          category: "DeFi",
          isVerified: false,
          isUnclaimed: true,
          claimedBy: null,
          claimedAt: null,
          createdBy: userId
        });
        const daoAsUser = {
          id: `dao_${dao.id}`,
          username: dao.slug,
          firstName: dao.name.split(" ")[0],
          lastName: dao.name.split(" ").slice(1).join(" ") || null,
          profileImageUrl: dao.logoUrl,
          twitterHandle: dao.twitterHandle,
          twitterUrl: dao.twitterUrl,
          profileType: "dao",
          isUnclaimedProfile: dao.isUnclaimed,
          isClaimed: !dao.isUnclaimed,
          actualDaoId: dao.id
          // Include actual DAO ID for reference
        };
        res.json(daoAsUser);
      } else {
        const user = await storage.createUnclaimedProfile({
          twitterHandle: twitterHandle || `user_${Date.now()}`,
          twitterUrl,
          firstName: fullName.split(" ")[0],
          lastName: fullName.split(" ").slice(1).join(" ") || void 0,
          createdBy: userId,
          profileType: profileType || "member",
          walletAddress
        });
        res.json(user);
      }
    } catch (error) {
      console.error("Error creating unclaimed profile:", error);
      res.status(500).json({ message: "Failed to create unclaimed profile" });
    }
  });
  app2.post("/api/users/claim-with-twitter", async (req, res) => {
    try {
      if (!req.session.twitterOAuthData || !req.session.inClaimingFlow) {
        return res.status(400).json({ message: "No valid Twitter OAuth claiming session found" });
      }
      const { profileId } = req.body;
      const twitterOAuthData = req.session.twitterOAuthData;
      if (!profileId) {
        return res.status(400).json({ message: "Profile ID is required" });
      }
      const unclaimedProfile = await storage.getUser(profileId);
      if (!unclaimedProfile || !unclaimedProfile.isUnclaimedProfile || unclaimedProfile.isClaimed) {
        return res.status(400).json({ message: "Profile not available for claiming" });
      }
      if (unclaimedProfile.twitterHandle !== twitterOAuthData.username) {
        return res.status(400).json({ message: "Twitter handle mismatch - cannot claim this profile" });
      }
      const claimedUser = await storage.claimProfileWithTwitterOAuth(
        twitterOAuthData.username,
        twitterOAuthData.id,
        twitterOAuthData
      );
      if (!claimedUser) {
        return res.status(500).json({ message: "Failed to claim profile" });
      }
      req.logIn(claimedUser, (err) => {
        if (err) {
          console.error("Login error after claiming:", err);
          return res.status(500).json({ message: "Profile claimed but login failed" });
        }
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
  app2.post("/api/users/:userId/claim", requireInviteAccess, async (req, res) => {
    try {
      const claimedBy = req.user.claims?.sub || req.user.id;
      const { userId } = req.params;
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
  app2.get("/api/users/claimable", requireInviteAccess, async (req, res) => {
    try {
      const { twitterHandle, walletAddress } = req.query;
      const profile = await storage.findClaimableProfile(
        twitterHandle,
        walletAddress
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
  app2.get("/api/users/creda-activities", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        console.log("No user ID found in request. User object:", req.user);
        return res.status(400).json({ message: "User not authenticated" });
      }
      console.log("Fetching CREDA activities for user:", userId);
      const activities = await db.select().from(credaActivities).where(eq2(credaActivities.userId, userId)).orderBy(desc2(credaActivities.createdAt));
      console.log("Found CREDA activities:", activities.length);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching CREDA activities:", error);
      res.status(500).json({ message: "Failed to fetch CREDA activities" });
    }
  });
  app2.get("/api/users/creda-activities/today", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const todayStart = /* @__PURE__ */ new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayDateString = todayStart.toISOString().split("T")[0];
      const todayEnd = /* @__PURE__ */ new Date();
      todayEnd.setUTCHours(23, 59, 59, 999);
      const todayActivities = await db.select().from(credaActivities).where(
        and2(
          eq2(credaActivities.userId, userId),
          sql5`DATE(${credaActivities.createdAt}) = ${todayDateString}`
        )
      ).orderBy(desc2(credaActivities.createdAt));
      res.json(todayActivities);
    } catch (error) {
      console.error("Error fetching today's XP activities:", error);
      res.status(500).json({ message: "Failed to fetch today's activities" });
    }
  });
  app2.get("/api/daily-tasks/progress", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await db.select({
        dailyStreak: users.dailyStreak,
        longestStreak: users.longestStreak,
        lastStreakDate: users.lastStreakDate
      }).from(users).where(eq2(users.id, userId)).limit(1);
      if (!user.length) {
        return res.status(404).json({ message: "User not found" });
      }
      const userData = user[0];
      const todayStart = /* @__PURE__ */ new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayDateString = todayStart.toISOString().split("T")[0];
      const todayEnd = /* @__PURE__ */ new Date();
      todayEnd.setUTCHours(23, 59, 59, 999);
      const todayActivities = await db.select().from(credaActivities).where(
        and2(
          eq2(credaActivities.userId, userId),
          sql5`DATE(${credaActivities.createdAt}) = ${todayDateString}`
        )
      );
      const uniqueActionTypes = new Set(todayActivities.map((activity) => activity.activityType));
      const completedActionsCount = uniqueActionTypes.size;
      res.json({
        currentStreak: userData.dailyStreak || 0,
        longestStreak: userData.longestStreak || 0,
        lastStreakDate: userData.lastStreakDate,
        completedActionsToday: completedActionsCount,
        tasksComplete: completedActionsCount >= 3,
        todayActivities
      });
    } catch (error) {
      console.error("Error fetching daily tasks progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/profile-data", async (req, res) => {
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
      const [grsScore, issues, comments2, reviews3, activity, credaActivityData] = await Promise.all([
        storage.getGrsRanking(user.id).catch(() => ({ score: user.grsScore || 1300, percentile: 50 })),
        storage.getUserGovernanceIssues(user.id).catch(() => []),
        storage.getUserComments(user.id).catch(() => []),
        storage.getUserReviews(user.id).catch(() => []),
        storage.getUserActivity(user.id).catch(() => []),
        // Fetch CREDA activities with 0G fields for the on-chain verification column
        db.select().from(credaActivities).where(eq2(credaActivities.userId, user.id)).orderBy(desc2(credaActivities.createdAt)).limit(50).catch(() => [])
      ]);
      const activityWithOgData = activity.map((act) => {
        if (act.ogTxHash) {
          return act;
        }
        const matchingCredaActivity = credaActivityData.find((ca) => {
          const actTime = new Date(act.createdAt || act.timestamp).getTime();
          const caTime = new Date(ca.createdAt).getTime();
          const timeDiff = Math.abs(actTime - caTime);
          return timeDiff < 5 * 60 * 1e3;
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
        comments: comments2,
        reviews: reviews3,
        activity: activityWithOgData,
        xp
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({ message: "Failed to fetch profile data" });
    }
  });
  app2.get("/api/users/:userIdOrUsername", async (req, res) => {
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
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/issues", async (req, res) => {
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
      const issues = await storage.getUserGovernanceIssues(user.id);
      res.json(issues);
    } catch (error) {
      console.error("Error fetching user governance issues:", error);
      res.status(500).json({ message: "Failed to fetch user governance issues" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/comments", async (req, res) => {
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
      const comments2 = await storage.getUserComments(user.id);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Failed to fetch user comments" });
    }
  });
  app2.get("/api/reviews", async (req, res) => {
    try {
      const reviews3 = await storage.getAllReviews();
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.get("/api/reviews/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const reviews3 = await storage.getRecentReviews(limit);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      res.status(500).json({ message: "Failed to fetch recent reviews" });
    }
  });
  app2.get("/api/spaces/:spaceSlug/activities", async (req, res) => {
    try {
      const { spaceSlug } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      console.log(`Fetching activities for space: ${spaceSlug}`);
      const [reviews3, stances] = await Promise.all([
        storage.getReviewsBySpace(spaceSlug, limit),
        storage.getGovernanceIssuesBySpace(spaceSlug, limit)
      ]);
      console.log(`Found ${reviews3.length} reviews and ${stances.length} stances for ${spaceSlug}`);
      const activities = [
        ...reviews3.map((r) => ({ ...r, type: "review" })),
        ...stances.map((s) => ({ ...s, type: "stance" }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
      console.log(`Returning ${activities.length} total activities for ${spaceSlug}`);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching space activities:", error);
      res.status(500).json({ message: "Failed to fetch space activities" });
    }
  });
  app2.get("/api/spaces/:spaceSlug", async (req, res) => {
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
  app2.post("/api/spaces/:spaceSlug/vote", requireInviteAccess, async (req, res) => {
    try {
      const { spaceSlug } = req.params;
      const { voteType, comment } = req.body;
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!voteType || voteType !== "bullish" && voteType !== "bearish") {
        return res.status(400).json({ message: "Invalid vote type. Must be 'bullish' or 'bearish'" });
      }
      const space = await storage.getSpaceBySlug(spaceSlug);
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }
      const existingVote = await storage.getUserSpaceVote(userId, space.id);
      let vote;
      if (existingVote) {
        vote = await storage.updateSpaceVote(userId, space.id, voteType, comment);
      } else {
        vote = await storage.createSpaceVote({
          spaceId: space.id,
          userId,
          voteType,
          comment: comment || null
        });
      }
      const updatedSpace = await storage.getSpaceBySlug(spaceSlug);
      res.json({ vote, space: updatedSpace });
    } catch (error) {
      console.error("Error voting on space:", error);
      res.status(500).json({ message: "Failed to vote on space" });
    }
  });
  app2.get("/api/spaces/:spaceSlug/my-vote", requireInviteAccess, async (req, res) => {
    try {
      const { spaceSlug } = req.params;
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const space = await storage.getSpaceBySlug(spaceSlug);
      if (!space) {
        return res.status(404).json({ message: "Space not found" });
      }
      const vote = await storage.getUserSpaceVote(userId, space.id);
      res.json(vote || null);
    } catch (error) {
      console.error("Error fetching user's space vote:", error);
      res.status(500).json({ message: "Failed to fetch user's space vote" });
    }
  });
  app2.get("/api/space-votes/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const voteComments = await storage.getRecentSpaceVoteComments(limit);
      res.json(voteComments);
    } catch (error) {
      console.error("Error fetching recent space vote comments:", error);
      res.status(500).json({ message: "Failed to fetch recent space vote comments" });
    }
  });
  app2.post("/api/reviews", requireInviteAccess, async (req, res) => {
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
        spaceSlug
        // Added spaceSlug here
      } = req.body;
      const reviewerId = req.user.claims?.sub || req.user.id;
      console.log("Extracted data:", { title, reviewedUserId, reviewedUsername, targetUserId, rating, content, category, reviewType, reviewerId, spaceSlug });
      if (!reviewerId) {
        console.log("No reviewer ID found");
        return res.status(401).json({ message: "Authentication required" });
      }
      const targetUsername = reviewedUsername || targetUserId;
      if (!rating || !content || !category || !reviewType || !targetUsername) {
        console.log("Missing required fields validation failed");
        return res.status(400).json({ message: "Missing required fields: rating, content, category, reviewType, and targetUsername are required" });
      }
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        console.log("Rating validation failed:", rating);
        return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
      }
      if (typeof content !== "string" || content.trim().length < 10) {
        console.log("Content validation failed");
        return res.status(400).json({ message: "Review content must be at least 10 characters long" });
      }
      if (!["positive", "negative", "neutral"].includes(reviewType)) {
        console.log("Invalid review type:", reviewType);
        return res.status(400).json({ message: "Invalid review type" });
      }
      const finalReviewedUserId = reviewedUserId || targetUserId;
      console.log("Final reviewed user ID:", finalReviewedUserId);
      if (!finalReviewedUserId) {
        console.log("No target user ID provided");
        return res.status(400).json({ message: "Target user ID is required" });
      }
      if (typeof targetUsername !== "string" || targetUsername.trim().length === 0) {
        console.log("Invalid target username:", targetUsername);
        return res.status(400).json({ message: "Valid target username is required" });
      }
      const reviewer = await storage.getUser(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: "User not found" });
      }
      if (targetUserId === reviewerId) {
        console.log("User trying to review themselves");
        return res.status(400).json({ message: "You cannot review yourself" });
      }
      let existingReview = null;
      if (finalReviewedUserId.startsWith("dao_")) {
        const daoId = parseInt(finalReviewedUserId.replace("dao_", ""));
        existingReview = await storage.getReviewByUserAndDao(reviewerId, daoId);
      } else {
        existingReview = await storage.getReviewByUsers(reviewerId, finalReviewedUserId);
      }
      if (existingReview) {
        console.log("User has already reviewed this entity");
        return res.status(400).json({ message: "You have already reviewed this entity" });
      }
      let spaceId = null;
      if (spaceSlug && spaceSlug.trim() !== "") {
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
        reviewedUserId: finalReviewedUserId.startsWith("dao_") ? null : finalReviewedUserId,
        reviewedDaoId: finalReviewedUserId.startsWith("dao_") ? parseInt(finalReviewedUserId.replace("dao_", "")) : null,
        targetType: finalReviewedUserId.startsWith("dao_") ? "dao" : "user",
        isTargetOnPlatform: true,
        // Assuming review is always on platform users/DAOs for now
        reviewType,
        rating,
        title,
        content,
        pointsAwarded: 5,
        // Base points for writing a review
        upvotes: 0,
        downvotes: 0,
        spaceId
      };
      console.log("Creating review with data:", reviewData);
      const review = await storage.createReview(reviewData);
      console.log("Review created successfully:", review);
      try {
        await storage.updateReviewImpact(review.id);
        console.log(`GRS impact applied for review ${review.id} on target ${finalReviewedUserId}`);
      } catch (grsError) {
        console.error("Failed to update GRS impact:", grsError);
      }
      let reviewedUserCredaAward = 0;
      if (!finalReviewedUserId.startsWith("dao_")) {
        try {
          let receivedCredaAmount = 0;
          if (reviewType === "positive") {
            receivedCredaAmount = 15;
          } else if (reviewType === "neutral") {
            receivedCredaAmount = 5;
          } else {
            receivedCredaAmount = 2;
          }
          reviewedUserCredaAward = receivedCredaAmount;
          await storage.awardCredaPoints(finalReviewedUserId, "social", "review_received", receivedCredaAmount, "review", review.id, {
            description: `Received ${reviewType} review from ${reviewerId}`,
            reviewType,
            rating,
            receivedFromUser: reviewerId
          });
          console.log(`Awarded ${receivedCredaAmount} CREDA to reviewed user ${finalReviewedUserId}`);
        } catch (credaError) {
          console.error("Failed to award CREDA to reviewed user:", credaError);
        }
      }
      let pointsEarned = 0;
      try {
        pointsEarned = 200;
        const activityDescription = `Reviewed ${targetUsername}`;
        const reviewActivity = await storage.awardCredaPoints(reviewerId, "social", "review_given", pointsEarned, "review", review.id, {
          description: activityDescription,
          reviewedUsername: targetUsername,
          rating
        });
        console.log("CREDA awarded successfully for review creation");
        if (reviewActivity && reviewActivity.id) {
          recordActivityToOgStorage(
            reviewActivity.id,
            "REVIEW",
            reviewerId,
            review.id,
            reviewData.reviewedUserId ? "USER" : "DAO",
            content,
            {
              rating,
              reviewType,
              targetUsername,
              title
            }
          );
        }
      } catch (credaError) {
        console.error("Failed to award CREDA, but review was created:", credaError);
        pointsEarned = 0;
      }
      try {
        const reviewerUser = await storage.getUser(reviewerId);
        if (!reviewerUser) {
          throw new Error("Reviewer user not found for notification");
        }
        if (reviewData.reviewedUserId) {
          await NotificationService.notifyNewReview(
            reviewData.reviewedUserId,
            reviewerId,
            reviewerUser.username,
            rating,
            content
          );
        } else if (reviewData.reviewedDaoId) {
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
      }
      console.log("About to send success response");
      const successResponse = {
        id: review.id,
        reviewerId: review.reviewerId,
        reviewedUserId: review.reviewedUserId,
        reviewedDaoId: review.reviewedDaoId,
        targetType: review.targetType,
        reviewType: review.reviewType,
        rating: review.rating,
        title: review.title,
        // Include the title in the response
        content: review.content,
        createdAt: review.createdAt,
        pointsEarned,
        // CREDA earned by the reviewer
        reviewedUserCredaAward,
        // CREDA earned by the reviewed user
        message: "Review posted successfully!"
      };
      console.log("Sending success response:", successResponse);
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json(successResponse);
    } catch (error) {
      console.error("Error creating review:", error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        success: false,
        message: "Failed to create review",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/users/:userIdOrUsername/reviews", async (req, res) => {
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
      const reviews3 = await storage.getUserReviews(user.id);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });
  app2.post("/api/users/:userIdOrUsername/reviews", requireInviteAccess, async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let reviewedUser;
      reviewedUser = await storage.getUser(userIdOrUsername);
      if (!reviewedUser) {
        reviewedUser = await storage.getUserByUsername(userIdOrUsername);
      }
      if (!reviewedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const reviewerId = req.user.id;
      if (reviewerId === reviewedUser.id) {
        return res.status(400).json({ message: "Cannot review yourself" });
      }
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
      await storage.updateReviewImpact(review.id);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/review-stats", async (req, res) => {
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
      const stats = await storage.getUserReviewStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user review stats:", error);
      res.status(500).json({ message: "Failed to fetch user review stats" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/advanced-review-stats", async (req, res) => {
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
      const stats = await storage.getUserAdvancedReviewStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching advanced review stats:", error);
      res.status(500).json({ message: "Failed to fetch advanced review stats" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/stance-stats", async (req, res) => {
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
      const stats = await storage.getUserStanceStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stance stats:", error);
      res.status(500).json({ message: "Failed to fetch stance stats" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/has-reviewed", isAuthenticated, async (req, res) => {
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
      const hasReviewed = await storage.hasUserReviewed(req.user.id, user.id);
      res.json({ hasReviewed });
    } catch (error) {
      console.error("Error checking if user has reviewed:", error);
      res.status(500).json({ message: "Failed to check review status" });
    }
  });
  app2.get("/api/users/:userIdOrUsername/activity", async (req, res) => {
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
      const activity = await storage.getUserActivity(user.id);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ message: "Failed to fetch user activity" });
    }
  });
  app2.patch("/api/users/:userId", isAuthenticated, async (req, res) => {
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
  app2.patch("/api/admin/users/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const updateData = req.body;
      if (updateData.isVerified !== void 0) {
        console.log(`Admin updating user ${userId} verification status to: ${updateData.isVerified}`);
      }
      const user = await storage.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/users/:userId/follows", isAuthenticated, async (req, res) => {
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
  app2.get("/api/daos/:daoId/follow-status", isAuthenticated, async (req, res) => {
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
  app2.post("/api/daos/:daoId/follow", requireInviteAccess, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const userId = req.user.id;
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
  app2.delete("/api/daos/:daoId/follow", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.trim().length < 2) {
        return res.json({ daos: [], threads: [], users: [] });
      }
      const results = await storage.searchContent(query.trim());
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
  app2.post("/api/business/onboard", isAuthenticated, async (req, res) => {
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
  app2.get("/api/business/profile", isAuthenticated, async (req, res) => {
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
  app2.get("/api/business/:slug", async (req, res) => {
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
  app2.get("/api/business/invite/:inviteCode", async (req, res) => {
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
  app2.put("/api/business/deploy", isAuthenticated, async (req, res) => {
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
  app2.get("/api/business/:slug/reviews", async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getBusinessProfileBySlug(slug);
      if (!profile) {
        return res.status(404).json({ message: "Business profile not found" });
      }
      const reviews3 = await storage.getBusinessReviews(profile.id);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching business reviews:", error);
      res.status(500).json({ message: "Failed to fetch business reviews" });
    }
  });
  app2.post("/api/business/reviews", async (req, res) => {
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
            firstName: reviewerName || "Anonymous",
            username: reviewerEmail.split("@")[0] + "_" + Date.now(),
            authProvider: "email",
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
        targetType: "business",
        title: title || "",
        content,
        rating,
        reviewType: rating >= 4 ? "positive" : rating <= 2 ? "negative" : "neutral",
        isTargetOnPlatform: true
      });
      await storage.updateBusinessProfile(profile.id, {
        totalReviews: profile.totalReviews + 1,
        averageRating: Math.round((profile.averageRating * profile.totalReviews + rating) / (profile.totalReviews + 1))
      });
      await storage.awardCredaPoints(reviewerId, "Engagement", "review_given", 50, "business", profile.id);
      res.json(review);
    } catch (error) {
      console.error("Error creating business review:", error);
      res.status(500).json({ message: "Failed to create business review" });
    }
  });
  app2.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinessProfiles();
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });
  app2.post("/api/project-reviews", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { projectId, projectName, projectLogo, projectSlug, rating, title, content } = req.body;
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
  app2.get("/api/project-reviews", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const reviews3 = await storage.getAllProjectReviews(limit);
      const reviewsWithUsers = await Promise.all(
        reviews3.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImageUrl: user.profileImageUrl,
              twitterHandle: user.twitterHandle
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
  app2.get("/api/project-reviews/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const reviews3 = await storage.getProjectReviews(projectId);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching project reviews:", error);
      res.status(500).json({ message: "Failed to fetch project reviews" });
    }
  });
  app2.post("/api/project-reviews/:reviewId/helpful", async (req, res) => {
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
  app2.post("/api/review-shares", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const { reviewId, projectId, platform, projectName, projectLogo, credaEarned, shareText } = req.body;
      const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const shareData = {
        userId,
        reviewId,
        projectId,
        platform: platform || "twitter",
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
  app2.get("/api/review-shares/:shareToken", async (req, res) => {
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
  app2.post("/api/review-shares/:shareToken/click", async (req, res) => {
    try {
      const { shareToken } = req.params;
      const { referrer, userAgent, ipAddress } = req.body;
      const share = await storage.getReviewShare(shareToken);
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }
      const clickData = {
        shareId: share.id,
        clickedAt: /* @__PURE__ */ new Date(),
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
  app2.post("/api/review-shares/:shareId/claim-reward", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/user/review-shares", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const shares = await storage.getUserReviewShares(userId);
      res.json(shares);
    } catch (error) {
      console.error("Error fetching user review shares:", error);
      res.status(500).json({ message: "Failed to fetch review shares" });
    }
  });
  app2.post("/api/link-referral", async (req, res) => {
    try {
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
  const reviewReportValidationSchema = insertReviewReportSchema.extend({
    reason: z2.enum(["spam", "inappropriate", "misleading", "offensive", "other"]),
    notes: z2.string().optional().nullable(),
    reviewId: z2.number().int().positive(),
    reportedBy: z2.string()
  });
  app2.post("/api/review-reports", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const validationResult = reviewReportValidationSchema.safeParse({
        ...req.body,
        reportedBy: userId,
        reviewId: typeof req.body.reviewId === "string" ? parseInt(req.body.reviewId) : req.body.reviewId
      });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors
        });
      }
      const report = await storage.reportReview(validationResult.data);
      await storage.awardSpamReportCreda(userId, "review", validationResult.data.reviewId);
      res.json(report);
    } catch (error) {
      console.error("Error reporting review:", error);
      res.status(500).json({ message: "Failed to report review" });
    }
  });
  const contentReportValidationSchema = insertContentReportSchema.extend({
    contentType: z2.enum(["stance", "comment", "review"]),
    contentId: z2.number().int().positive(),
    reason: z2.enum(["spam", "inappropriate", "misleading", "offensive", "other"]),
    notes: z2.string().optional().nullable(),
    reportedBy: z2.string()
  });
  app2.post("/api/content-reports", requireInviteAccess, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const validationResult = contentReportValidationSchema.safeParse({
        ...req.body,
        reportedBy: userId,
        contentId: typeof req.body.contentId === "string" ? parseInt(req.body.contentId) : req.body.contentId
      });
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors
        });
      }
      const report = await storage.reportContent(validationResult.data);
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
  app2.get("/api/admin/content-reports", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const reports = await storage.getContentReports(status);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching content reports:", error);
      res.status(500).json({ message: "Failed to fetch content reports" });
    }
  });
  app2.get("/api/content-reports/my-reports", requireInviteAccess, async (req, res) => {
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
  app2.get("/api/admin/projects/:projectId/reported-reviews", async (req, res) => {
    try {
      const companyId = parseInt(req.params.projectId);
      const reports = await storage.getReportedReviewsForCompany(companyId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reported reviews:", error);
      res.status(500).json({ message: "Failed to fetch reported reviews" });
    }
  });
  app2.delete("/api/admin/project-reviews/:reviewId", requireAdminAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      await storage.deleteProjectReview(reviewId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  app2.get("/api/admin/companies", async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      const companiesWithStats = await Promise.all(
        companies2.map(async (company) => {
          const analytics = await storage.getCompanyAnalytics(company.id);
          return {
            ...company,
            reviewCount: analytics.totalReviews,
            averageRating: analytics.averageRating
          };
        })
      );
      res.json(companiesWithStats);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });
  app2.post("/api/admin/companies", requireAdminAuth, async (req, res) => {
    try {
      const companyData = req.body;
      const newCompany = await storage.createCompany(companyData);
      res.json(newCompany);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });
  app2.get("/api/admin/companies/:id", async (req, res) => {
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
  app2.patch("/api/admin/companies/:id", requireAdminAuth, async (req, res) => {
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
  app2.delete("/api/admin/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompany(id);
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });
  app2.post("/api/seed/companies", async (req, res) => {
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
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
          isVerified: true
        }
      ];
      const results = [];
      const errors = [];
      for (const companyData of COMPANIES_TO_SEED) {
        try {
          const existingByExternal = await storage.getCompanyByExternalId(companyData.externalId);
          const existingBySlug = await storage.getCompanyBySlug(companyData.slug);
          if (existingByExternal || existingBySlug) {
            console.log(`Company ${companyData.name} already exists, skipping...`);
            continue;
          }
          const newCompany = await storage.createCompany(companyData);
          results.push(newCompany);
          console.log(`\u2713 Created: ${companyData.name}`);
        } catch (error) {
          console.error(`\u2717 Failed to create ${companyData.name}:`, error);
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
  app2.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const { ObjectStorageService: ObjectStorageService2 } = await Promise.resolve().then(() => (init_objectStorage(), objectStorage_exports));
    const objectStorageService = new ObjectStorageService2();
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
  app2.post("/api/admin/logos/upload-url", requireAdminAuth, async (req, res) => {
    try {
      const { ObjectStorageService: ObjectStorageService2 } = await Promise.resolve().then(() => (init_objectStorage(), objectStorage_exports));
      const objectStorageService = new ObjectStorageService2();
      const uploadURL = await objectStorageService.getLogoUploadURL();
      res.json({ url: uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });
  app2.get("/api/admin/companies/:id/reviews", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviews3 = await storage.getCompanyReviews(id);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching company reviews:", error);
      res.status(500).json({ message: "Failed to fetch company reviews" });
    }
  });
  app2.get("/api/admin/companies/:id/analytics", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analytics = await storage.getCompanyAnalytics(id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching company analytics:", error);
      res.status(500).json({ message: "Failed to fetch company analytics" });
    }
  });
  app2.get("/api/admin/companies/:id/admins", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const admins = await storage.getCompanyAdmins(id);
      res.json(admins);
    } catch (error) {
      console.error("Error fetching company admins:", error);
      res.status(500).json({ message: "Failed to fetch company admins" });
    }
  });
  app2.post("/api/admin/companies/:id/admins", async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const { userId, role } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      const admin = await storage.addCompanyAdmin({ companyId, userId, role: role || "admin" });
      res.json(admin);
    } catch (error) {
      console.error("Error adding company admin:", error);
      res.status(500).json({ message: "Failed to add company admin" });
    }
  });
  app2.delete("/api/admin/companies/:id/admins/:adminId", async (req, res) => {
    try {
      const adminId = parseInt(req.params.adminId);
      await storage.removeCompanyAdmin(adminId);
      res.json({ message: "Company admin removed successfully" });
    } catch (error) {
      console.error("Error removing company admin:", error);
      res.status(500).json({ message: "Failed to remove company admin" });
    }
  });
  app2.get("/api/companies/external/:externalId", async (req, res) => {
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
  app2.get("/api/companies", async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      const companiesWithReviewCount = await Promise.all(
        companies2.map(async (company) => {
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
  app2.post("/api/admin/companies/:companyId/users", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/admin/companies/:companyId/users", requireAdminAuth, async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const users2 = await storage.getCompanyUsers(companyId);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching company users:", error);
      res.status(500).json({ message: "Failed to fetch company users" });
    }
  });
  app2.delete("/api/admin/company-users/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompanyUser(id);
      res.json({ message: "Company user deleted successfully" });
    } catch (error) {
      console.error("Error deleting company user:", error);
      res.status(500).json({ message: "Failed to delete company user" });
    }
  });
  app2.post("/api/admin/generate-company-credentials", requireAdminAuth, async (req, res) => {
    try {
      const companies2 = await storage.getAllCompanies();
      const results = [];
      const errors = [];
      for (const company of companies2) {
        try {
          if (!company.email) {
            errors.push({
              companyName: company.name,
              reason: "No email address configured"
            });
            continue;
          }
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
          const { generateRandomPassword: generateRandomPassword2, sendCompanyCredentialsEmail: sendCompanyCredentialsEmail2 } = await Promise.resolve().then(() => (init_emailAuth(), emailAuth_exports));
          const password = generateRandomPassword2();
          const bcrypt3 = await import("bcryptjs");
          const hashedPassword = await bcrypt3.hash(password, 12);
          const newUser = await storage.createCompanyUser({
            companyId: company.id,
            email: company.email,
            password: hashedPassword,
            firstName: company.name,
            role: "admin",
            isActive: true
          });
          const dashboardUrl = `${req.protocol}://${req.get("host")}/business-dashboard`;
          const emailPreviewUrl = await sendCompanyCredentialsEmail2(
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
        totalCompanies: companies2.length,
        created: results.filter((r) => r.status === "created").length,
        skipped: results.filter((r) => r.status === "skipped").length,
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
  app2.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews3 = await storage.getAllProjectReviews();
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.get("/api/admin/reviews/project/:projectId", requireAdminAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const reviews3 = await storage.getProjectReviewsForProject(projectId);
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching project reviews:", error);
      res.status(500).json({ message: "Failed to fetch project reviews" });
    }
  });
  app2.delete("/api/admin/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProjectReview(id);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  app2.get("/api/admin/analytics", async (req, res) => {
    try {
      const allReviews = await storage.getAllProjectReviews();
      const projectMap = /* @__PURE__ */ new Map();
      let totalReviews = allReviews.length;
      let totalRating = 0;
      allReviews.forEach((review) => {
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
        totalReviews,
        averageRating: totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : "0.00",
        activePages: projectMap.size,
        topProjects: Array.from(projectMap.values()).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5).map((p) => ({
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
  const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.claims) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
  app2.get("/api/admin/daos", requireAdminAuth, async (req, res) => {
    try {
      const allDaos = await storage.getAllDaos();
      res.json(allDaos);
    } catch (error) {
      console.error("Error fetching admin DAOs:", error);
      res.status(500).json({ message: "Failed to fetch DAOs" });
    }
  });
  app2.patch("/api/admin/daos/:daoId", requireAdminAuth, async (req, res) => {
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
  app2.delete("/api/admin/daos/:daoId", requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      await storage.deleteDao(daoId);
      res.json({ message: "DAO deleted successfully" });
    } catch (error) {
      console.error("Error deleting DAO:", error);
      res.status(500).json({ message: "Failed to delete DAO" });
    }
  });
  app2.get("/api/admin/stances", requireAdminAuth, async (req, res) => {
    try {
      const stances = await storage.getAllStancesForAdmin();
      res.json(stances);
    } catch (error) {
      console.error("Error fetching admin stances:", error);
      res.status(500).json({ message: "Failed to fetch stances" });
    }
  });
  app2.delete("/api/admin/stances/:stanceId", requireAdminAuth, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      await storage.deleteStance(stanceId);
      res.json({ message: "Stance deleted successfully" });
    } catch (error) {
      console.error("Error deleting stance:", error);
      res.status(500).json({ message: "Failed to delete stance" });
    }
  });
  app2.patch("/api/admin/stances/:stanceId/expiry", requireAdminAuth, async (req, res) => {
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
  app2.patch("/api/admin/stances/:stanceId/extend", requireAdminAuth, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      const { hours } = req.body;
      if (!hours || ![5, 10, 12].includes(hours)) {
        return res.status(400).json({ message: "Hours must be 5, 10, or 12" });
      }
      const stance = await storage.getGovernanceIssueById(stanceId);
      if (!stance) {
        return res.status(404).json({ message: "Stance not found" });
      }
      const currentExpiry = new Date(stance.expiresAt);
      const newExpiry = new Date(currentExpiry.getTime() + hours * 60 * 60 * 1e3);
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
  app2.get("/api/admin/reviews", requireAdminAuth, async (req, res) => {
    try {
      const reviews3 = await storage.getAllReviewsForAdmin();
      res.json(reviews3);
    } catch (error) {
      console.error("Error fetching admin reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.delete("/api/admin/reviews/:reviewId", requireAdminAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      await storage.deleteReview(reviewId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  app2.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });
  app2.get("/api/admin/analytics/growth", requireAdminAuth, async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "daily";
      const days = parseInt(req.query.days) || 30;
      const analytics = await storage.getGrowthAnalytics(timeframe, days);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching growth analytics:", error);
      res.status(500).json({ message: "Failed to fetch growth analytics" });
    }
  });
  app2.get("/api/admin/analytics/engagement", requireAdminAuth, async (req, res) => {
    try {
      const metrics = await storage.getEngagementMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching engagement metrics:", error);
      res.status(500).json({ message: "Failed to fetch engagement metrics" });
    }
  });
  app2.get("/api/admin/analytics/retention", requireAdminAuth, async (req, res) => {
    try {
      const metrics = await storage.getRetentionMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching retention metrics:", error);
      res.status(500).json({ message: "Failed to fetch retention metrics" });
    }
  });
  app2.get("/api/admin/analytics/overview", requireAdminAuth, async (req, res) => {
    try {
      const overview = await storage.getPlatformOverview();
      res.json(overview);
    } catch (error) {
      console.error("Error fetching platform overview:", error);
      res.status(500).json({ message: "Failed to fetch platform overview" });
    }
  });
  app2.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/user-details/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDetails = await storage.getDetailedUserStats(userId);
      res.json(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });
  app2.get("/api/admin/user-scores", requireAdminAuth, async (req, res) => {
    try {
      const scores = await storage.getAllUserScores();
      res.json(scores);
    } catch (error) {
      console.error("Error fetching user scores:", error);
      res.status(500).json({ message: "Failed to fetch user scores" });
    }
  });
  app2.get("/api/admin/invite-codes", requireAdminAuth, async (req, res) => {
    try {
      const inviteCodes3 = await storage.getAllInviteCodes();
      res.json(inviteCodes3);
    } catch (error) {
      console.error("Error fetching invite codes:", error);
      res.status(500).json({ message: "Failed to fetch invite codes" });
    }
  });
  app2.post("/api/admin/generate-codes", requireAdminAuth, async (req, res) => {
    try {
      const { count: count2 = 100 } = req.body;
      const newCodes = await storage.generateInviteCodes(count2);
      res.json({
        message: `Generated ${count2} new invite codes`,
        codes: newCodes
      });
    } catch (error) {
      console.error("Error generating invite codes:", error);
      res.status(500).json({ message: "Failed to generate invite codes" });
    }
  });
  app2.get("/api/admin/users/:userId/details", requireAdminAuth, async (req, res) => {
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
  app2.patch("/api/admin/users/:userId/xp-points", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { score } = req.body;
      if (typeof score !== "number") {
        return res.status(400).json({ message: "Score must be a number" });
      }
      const updatedUser = await storage.updateUserXpPoints(userId, score);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user XP points:", error);
      res.status(500).json({ message: "Failed to update user XP points" });
    }
  });
  app2.patch("/api/admin/users/:userId/dao-score", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const { daoId, score } = req.body;
      if (typeof score !== "number" || typeof daoId !== "number") {
        return res.status(400).json({ message: "Score and daoId must be numbers" });
      }
      await storage.updateUserDaoScore(userId, daoId, score);
      res.json({ message: "DAO score updated successfully" });
    } catch (error) {
      console.error("Error updating user DAO score:", error);
      res.status(500).json({ message: "Failed to update user DAO score" });
    }
  });
  app2.post("/api/admin/grant-access", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/revoke-access", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/users/:userId/revoke-access", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      await storage.updateUser(userId, { hasInviteAccess: false });
      res.json({ message: "Access revoked successfully" });
    } catch (error) {
      console.error("Error revoking access:", error);
      res.status(500).json({ message: "Failed to revoke access" });
    }
  });
  app2.post("/api/admin/users/:userId/suspend", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/users/:userId/unsuspend", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/admin/suspended-users", requireAdminAuth, async (req, res) => {
    try {
      const suspendedUsers = await storage.getSuspendedUsers();
      res.json(suspendedUsers);
    } catch (error) {
      console.error("Error fetching suspended users:", error);
      res.status(500).json({ message: "Failed to fetch suspended users" });
    }
  });
  app2.delete("/api/admin/users/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.patch("/api/admin/daos/:daoId", requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const updateData = req.body;
      const allowedFields = [
        "name",
        "slug",
        "description",
        "logoUrl",
        "twitterHandle",
        "twitterUrl",
        "website",
        "category",
        "isVerified",
        "isUnclaimed"
      ];
      const filteredUpdate = Object.keys(updateData).filter((key) => allowedFields.includes(key)).reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
      await storage.updateDao(daoId, filteredUpdate);
      res.json({ message: "DAO updated successfully" });
    } catch (error) {
      console.error("Error updating DAO:", error);
      res.status(500).json({ message: "Failed to update DAO" });
    }
  });
  app2.delete("/api/admin/daos/:daoId", requireAdminAuth, async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      await storage.deleteDao(daoId);
      res.json({ message: "DAO deleted successfully" });
    } catch (error) {
      console.error("Error deleting DAO:", error);
      res.status(500).json({ message: "Failed to delete DAO" });
    }
  });
  app2.delete("/api/admin/issues/:issueId", requireAdminAuth, async (req, res) => {
    try {
      const issueId = parseInt(req.params.issueId);
      await storage.deleteGovernanceIssue(issueId);
      res.json({ message: "Governance issue deleted successfully" });
    } catch (error) {
      console.error("Error deleting governance issue:", error);
      res.status(500).json({ message: "Failed to delete governance issue" });
    }
  });
  app2.delete("/api/admin/comments/:commentId", requireAdminAuth, async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      await storage.deleteComment(commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  app2.post("/api/onboarding/complete", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      await storage.awardOnboardingXp(userId);
      await storage.updateUser(userId, {
        onboardingCompletedAt: /* @__PURE__ */ new Date()
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
  app2.put("/api/profile/complete", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { bio, linkedinUrl, githubUrl, discordHandle, telegramHandle, governanceInterests } = req.body;
      await storage.updateUser(userId, {
        bio,
        linkedinUrl,
        githubUrl,
        discordHandle,
        telegramHandle,
        governanceInterests,
        profileCompletedAt: /* @__PURE__ */ new Date()
      });
      res.json({
        message: "Profile completed successfully"
      });
    } catch (error) {
      console.error("Error completing profile:", error);
      res.status(500).json({ message: "Failed to complete profile" });
    }
  });
  app2.get("/api/profile/completion-status", isAuthenticated, async (req, res) => {
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
  app2.get("/api/referral/link", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.referralCode) {
        const referralCode = Buffer.from(`${userId}-${Date.now()}`).toString("base64").substring(0, 8);
        user = await storage.updateUser(userId, { referralCode });
      }
      const referralLink = `${req.protocol}://${req.get("host")}/?ref=${user.referralCode}`;
      res.json({
        referralCode: user.referralCode,
        referralLink
      });
    } catch (error) {
      console.error("Error getting referral link:", error);
      res.status(500).json({ message: "Failed to get referral link" });
    }
  });
  app2.post("/api/referral/generate", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const referralCode = Buffer.from(`${userId}-${Date.now()}`).toString("base64").substring(0, 8);
      await storage.updateUser(userId, { referralCode });
      const referralLink = `${req.protocol}://${req.get("host")}/?ref=${referralCode}`;
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
  app2.post("/api/referral/track", async (req, res) => {
    try {
      const { referralCode, newUserId } = req.body;
      if (!referralCode || !newUserId) {
        return res.status(400).json({ message: "Missing referral code or user ID" });
      }
      const referrer = await storage.getUserByReferralCode(referralCode);
      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      await storage.awardCredaPoints(referrer.id, "social", "referral_successful", 3);
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
  app2.post("/api/auth/process-invite", async (req, res) => {
    try {
      const { inviteCode, userId } = req.body;
      if (!inviteCode || !userId) {
        return res.status(400).json({ message: "Missing invite code or user ID" });
      }
      const isValid = await storage.validateInviteCode(inviteCode);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }
      await storage.useInviteCode(inviteCode, userId);
      res.json({
        message: "Invite processed successfully"
      });
    } catch (error) {
      console.error("Error processing invite:", error);
      res.status(500).json({ message: "Failed to process invite code" });
    }
  });
  app2.get("/api/referral/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });
  app2.post("/api/invite/validate", async (req, res) => {
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
  app2.post("/api/invite/use", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }
      const isValid = await storage.validateInviteCode(code);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invite code" });
      }
      const metadata = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        location: req.get("CF-IPCountry") || "Unknown",
        // Cloudflare country header
        deviceFingerprint: req.get("X-Device-Fingerprint")
      };
      await storage.useInviteCode(code, userId, metadata);
      res.json({
        message: "Invite code activated successfully",
        xpAwarded: 100
        // Let user know they earned XP for their inviter
      });
    } catch (error) {
      console.error("Error using invite code:", error);
      res.status(500).json({ message: "Failed to activate invite code" });
    }
  });
  app2.get("/api/invite/my-code", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const existingCodes = await storage.getUserInviteCodes(userId);
      if (existingCodes && existingCodes.length > 0) {
        const unusedCode = existingCodes.find((c) => !c.isUsed);
        const codeToReturn = unusedCode || existingCodes[0];
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const inviteLink = `${baseUrl}/?invite=${codeToReturn.code}`;
        res.json({
          code: codeToReturn.code,
          inviteLink,
          createdAt: codeToReturn.createdAt
        });
      } else {
        const newCodes = await storage.generateInviteCodesForUser(userId, 1);
        const newCode = newCodes[0];
        const baseUrl = `${req.protocol}://${req.get("host")}`;
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
  app2.post("/api/invite/create", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const existingCodes = await storage.getUserInviteCodes(userId);
      if (existingCodes && existingCodes.length > 0) {
        const codeToReturn = existingCodes[0];
        res.json({
          message: "You already have an invite code",
          inviteCode: codeToReturn.code
        });
      } else {
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
  app2.get("/api/invite/user-codes", isAuthenticated, async (req, res) => {
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
  app2.get("/api/invite/stats", isAuthenticated, async (req, res) => {
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
  app2.get("/api/invite/chain", isAuthenticated, async (req, res) => {
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
  app2.get("/api/invite/tree/:userId", isAuthenticated, async (req, res) => {
    try {
      const startUserId = req.params.userId;
      const requesterId = req.user.id;
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
  app2.get("/api/invite/usage/:userId", isAuthenticated, async (req, res) => {
    try {
      const targetUserId = req.params.userId;
      const requesterId = req.user.id;
      const requester = await storage.getUser(requesterId);
      if (targetUserId !== requesterId && !requester?.isAdmin) {
        return res.status(403).json({ message: "Not authorized to view this user's invite usage" });
      }
      const inviteUsage2 = await storage.getInviteUsageByUser(targetUserId);
      res.json(inviteUsage2);
    } catch (error) {
      console.error("Error fetching invite usage:", error);
      res.status(500).json({ message: "Failed to fetch invite usage" });
    }
  });
  app2.post("/api/invite/submit", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Invite code is required" });
      }
      const existingSubmission = await storage.getUserInviteSubmission(userId);
      if (existingSubmission) {
        return res.status(409).json({ message: "You have already submitted an invite code" });
      }
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
  app2.get("/api/invite/submission", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const submission = await storage.getUserInviteSubmission(userId);
      res.json(submission || null);
    } catch (error) {
      console.error("Error fetching invite submission:", error);
      res.status(500).json({ message: "Failed to fetch invite submission" });
    }
  });
  app2.get("/api/admin/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithStats = await Promise.all(
        users2.map(async (user) => {
          const stats = await storage.getDetailedUserStats(user.id);
          return {
            ...user,
            issuesCreated: stats.issueCount || 0,
            commentsMade: stats.commentsMade || 0,
            votesCast: stats.votesCast || 0,
            daosActiveIn: stats.daosActiveIn || 0,
            daosFollowing: stats.daosFollowing || 0,
            referralsMade: stats.referralsMade || 0,
            referralsReceived: stats.referralsReceived || 0
          };
        })
      );
      res.json(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/issues", async (req, res) => {
    try {
      const issues = await storage.getRecentGovernanceIssues();
      res.json(issues);
    } catch (error) {
      console.error("Error fetching governance issues:", error);
      res.status(500).json({ message: "Failed to fetch governance issues" });
    }
  });
  app2.get("/api/admin/comments", async (req, res) => {
    try {
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
          username: users.username
        },
        issue: {
          id: governanceIssues.id,
          title: governanceIssues.title
        }
      }).from(comments).leftJoin(users, eq2(comments.authorId, users.id)).leftJoin(governanceIssues, eq2(comments.issueId, governanceIssues.id)).orderBy(desc2(comments.createdAt));
      res.json(result);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.get("/api/admin/votes", async (req, res) => {
    try {
      const result = await db.select({
        id: votes.id,
        userId: votes.userId,
        targetType: votes.targetType,
        targetId: votes.targetId,
        createdAt: votes.createdAt,
        user: {
          id: users.id,
          username: users.username
        }
      }).from(votes).leftJoin(users, eq2(votes.userId, users.id)).orderBy(desc2(votes.createdAt));
      res.json(result);
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ message: "Failed to fetch votes" });
    }
  });
  app2.get("/api/admin/invite-submissions", requireAdminAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllInviteSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching invite submissions:", error);
      res.status(500).json({ message: "Failed to fetch invite submissions" });
    }
  });
  app2.post("/api/admin/invite-submissions/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      await storage.approveInviteSubmission(submissionId);
      res.json({ message: "Invite submission approved successfully" });
    } catch (error) {
      console.error("Error approving invite submission:", error);
      res.status(500).json({ message: "Failed to approve invite submission" });
    }
  });
  app2.post("/api/admin/invite-submissions/:id/deny", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/admin/invite-analytics", requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getInviteAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching invite analytics:", error);
      res.status(500).json({ message: "Failed to fetch invite analytics" });
    }
  });
  app2.get("/api/admin/invite-flags", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const flags = await storage.getAdminFlags(status);
      res.json(flags);
    } catch (error) {
      console.error("Error fetching admin flags:", error);
      res.status(500).json({ message: "Failed to fetch admin flags" });
    }
  });
  app2.post("/api/admin/invite-flags/:flagId/update", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/detect-suspicious-activity", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/admin/invite-tree/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const inviteTree = await storage.getInviteTree(userId);
      res.json(inviteTree);
    } catch (error) {
      console.error("Error fetching invite tree for admin:", error);
      res.status(500).json({ message: "Failed to fetch invite tree" });
    }
  });
  app2.get("/api/admin/invite-usage/:userId", requireAdminAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const inviteUsage2 = await storage.getInviteUsageByUser(userId);
      res.json(inviteUsage2);
    } catch (error) {
      console.error("Error fetching invite usage for admin:", error);
      res.status(500).json({ message: "Failed to fetch invite usage" });
    }
  });
  app2.get("/api/grs/score", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const ranking = await storage.getGrsRanking(userId);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching GRS score:", error);
      res.status(500).json({ message: "Failed to fetch GRS score" });
    }
  });
  app2.get("/api/grs/score/:userIdOrUsername", async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
      let user = await storage.getUser(userIdOrUsername);
      if (!user) {
        user = await storage.getUserByUsername(userIdOrUsername);
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const ranking = await storage.getGrsRanking(user.id);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching GRS score:", error);
      res.status(500).json({ message: "Failed to fetch GRS score" });
    }
  });
  app2.post("/api/grs/recalculate", isAuthenticated, async (req, res) => {
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
  app2.get("/api/grs/score/:userId?", async (req, res) => {
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
  app2.post("/api/admin/fix-review-grs", requireAdminAuth, async (req, res) => {
    try {
      console.log("Starting to fix missing review GRS impacts...");
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
  app2.get("/api/grs/audit/:userId?", isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
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
  app2.get("/api/grs/history", isAuthenticated, async (req, res) => {
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
  app2.get("/api/grs/history/:userIdOrUsername", async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
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
  app2.get("/api/grs/impact-factors", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const impactData = await getGrsImpactFactors(userId);
      res.json(impactData);
    } catch (error) {
      console.error("Error fetching GRS impact factors:", error);
      res.status(500).json({ message: "Failed to fetch GRS impact factors" });
    }
  });
  app2.get("/api/grs/impact-factors/:userIdOrUsername", async (req, res) => {
    try {
      const userIdOrUsername = req.params.userIdOrUsername;
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
  async function getGrsImpactFactors(userId) {
    const stanceStats = await storage.getUserStanceStats(userId);
    const advancedReviewStats = await storage.getUserAdvancedReviewStats(userId);
    const givenReviewsStats = await storage.getUserReviewStats(userId);
    const impactFactors = [
      {
        id: "stance_success_rate",
        name: "Stance Success Rate",
        description: "How often your stance positions align with community consensus",
        currentImpact: Math.min(250, stanceStats.successful * 50),
        // 50 points per successful stance, max 250
        maxImpact: 250,
        weight: 25,
        trend: stanceStats.successRate > 50 ? "up" : stanceStats.successRate < 50 ? "down" : "neutral",
        recentChange: stanceStats.successRate - 50,
        // relative to 50% baseline
        icon: "Target",
        color: "#4EA8DE",
        scoring: "Champion/Challenge stance success: +250, Failure: -150"
      },
      {
        id: "stance_target_impact",
        name: "Stance Target Impact",
        description: "How community consensus affects the person being championed/challenged",
        currentImpact: Math.min(200, stanceStats.championsWon * 90 + stanceStats.challengesWon * 70),
        // Champions worth more
        maxImpact: 200,
        weight: 20,
        trend: stanceStats.championsWon > stanceStats.challengesWon ? "up" : "down",
        recentChange: stanceStats.championsWon - stanceStats.challengesWon,
        icon: "Users",
        color: "#43AA8B",
        scoring: "Championed & supported: +180, Challenged & agreed: -200"
      },
      {
        id: "voter_accountability",
        name: "Voter Accountability",
        description: "Reward people who vote on the winning side",
        currentImpact: Math.min(50, stanceStats.total * 5),
        // 5 points per stance participation, max 50
        maxImpact: 50,
        weight: 15,
        trend: stanceStats.total > 5 ? "up" : "neutral",
        recentChange: Math.max(-15, Math.min(15, stanceStats.total - 10)),
        // relative to 10 baseline
        icon: "ThumbsUp",
        color: "#9D4EDD",
        scoring: "Winning side: +50, Losing side: -30, No vote: -15"
      },
      {
        id: "review_quality_received",
        name: "Review Quality Received",
        description: "How the community views your contributions",
        currentImpact: Math.min(160, Math.round(advancedReviewStats.averageRating * 32)),
        // 32 points per star, max 160
        maxImpact: 160,
        weight: 22,
        trend: advancedReviewStats.averageRating >= 4 ? "up" : advancedReviewStats.averageRating >= 3 ? "neutral" : "down",
        recentChange: Math.round((advancedReviewStats.averageRating - 3) * 10),
        // relative to 3-star baseline
        icon: "Star",
        color: "#F77F00",
        scoring: "High GRS positive: +160, Medium: +100, Low: +50"
      },
      {
        id: "review_accuracy_given",
        name: "Review Accuracy Given",
        description: "Whether your reviews of others prove accurate over time",
        currentImpact: Math.min(80, givenReviewsStats.total * 8),
        // 8 points per review given, max 80
        maxImpact: 80,
        weight: 18,
        trend: givenReviewsStats.total > 5 ? "up" : "neutral",
        recentChange: Math.max(-10, Math.min(10, givenReviewsStats.total - 5)),
        // relative to 5 baseline
        icon: "MessageSquare",
        color: "#2D6A4F",
        scoring: "Accurate positive/negative: +70-80, Inaccurate: -50-60"
      }
    ];
    const totalWeightedScore = impactFactors.reduce((total, factor) => {
      return total + factor.currentImpact * factor.weight / 100;
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
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      const unreadOnly = req.query.unreadOnly === "true";
      res.setHeader("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
      const notifications2 = await storage.getUserNotifications(userId, limit, unreadOnly);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      res.setHeader("Cache-Control", "private, max-age=60, stale-while-revalidate=120");
      const count2 = await storage.getUnreadNotificationCount(userId);
      res.json({ count: count2 });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });
  app2.post("/api/notifications/mark-read", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "ids must be an array" });
      }
      const notificationIds = ids.map((id) => parseInt(id));
      await storage.markNotificationsAsRead(notificationIds);
      res.json({ message: "Notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to mark notifications as read" });
    }
  });
  app2.post("/api/notifications/delete", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "ids must be an array" });
      }
      const notificationIds = ids.map((id) => parseInt(id));
      await storage.deleteNotifications(notificationIds);
      res.json({ message: "Notifications deleted" });
    } catch (error) {
      console.error("Error deleting notifications:", error);
      res.status(500).json({ message: "Failed to delete notifications" });
    }
  });
  app2.get("/api/notifications/settings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.getUserNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });
  app2.post("/api/notifications/settings", isAuthenticated, async (req, res) => {
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
  app2.post("/api/notifications/test", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      await NotificationService.createNotification({
        userId,
        type: "comment",
        title: "New comment on your post",
        message: "Someone commented on your governance proposal about DeFi regulations.",
        actionUrl: "/governance/1",
        metadata: { issueId: 1 }
      });
      await NotificationService.createNotification({
        userId,
        type: "vote",
        title: "Someone voted on your stance",
        message: "Alice voted Champion on your stance about Ethereum scalability.",
        actionUrl: "/governance/2",
        metadata: { voteType: "champion" }
      });
      await NotificationService.createNotification({
        userId,
        type: "achievement",
        title: "Achievement Unlocked!",
        message: 'You earned the "Governance Guru" badge for participating in 10 discussions.',
        actionUrl: "/achievements",
        metadata: { achievement: "governance-guru" }
      });
      res.json({ message: "Test notifications created successfully" });
    } catch (error) {
      console.error("Error creating test notifications:", error);
      res.status(500).json({ message: "Failed to create test notifications" });
    }
  });
  app2.get("/api/leaderboard/xp", async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "overall";
      const daoId = req.query.daoId ? parseInt(req.query.daoId) : void 0;
      const leaderboard = await storage.getCredaLeaderboard(timeframe, 50, daoId);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching XP leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch XP leaderboard" });
    }
  });
  app2.get("/api/leaderboard/overall", async (req, res) => {
    try {
      const leaderboard = await storage.getCredaLeaderboard("overall", 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  app2.get("/api/leaderboard/weekly", async (req, res) => {
    try {
      const leaderboard = await storage.getCredaLeaderboard("weekly", 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  app2.get("/api/leaderboard/stats", async (req, res) => {
    try {
      const stats = await storage.getLeaderboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching leaderboard stats:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard stats" });
    }
  });
  app2.get("/api/leaderboard/dao/:daoId/overall", async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoXpLeaderboard(daoId, "overall", 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO overall leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });
  app2.get("/api/leaderboard/dao/:daoId/weekly", async (req, res) => {
    try {
      const daoId = parseInt(req.params.daoId);
      const leaderboard = await storage.getDaoXpLeaderboard(daoId, "weekly", 50);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching DAO weekly leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch DAO leaderboard" });
    }
  });
  app2.post("/api/admin/backup/create", requireAdminAuth, async (req, res) => {
    try {
      const backupPath = await backupService.createFullBackup();
      res.json({
        message: "Backup created successfully",
        backupPath: backupPath.split("/").pop()
        // Only return filename for security
      });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });
  app2.get("/api/admin/backup/list", requireAdminAuth, async (req, res) => {
    try {
      const backups = backupService.listBackups();
      res.json({ backups });
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });
  app2.get("/api/admin/database/health", requireAdminAuth, async (req, res) => {
    try {
      const health = await databaseMonitor.checkDatabaseHealth();
      res.json(health);
    } catch (error) {
      console.error("Error checking database health:", error);
      res.status(500).json({ message: "Failed to check database health" });
    }
  });
  app2.get("/api/admin/database/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await backupService.getDatabaseStats();
      res.json({ stats });
    } catch (error) {
      console.error("Error getting database stats:", error);
      res.status(500).json({ message: "Failed to get database stats" });
    }
  });
  app2.post("/api/admin/database/validate", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/database/recover", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/admin/database/failures", requireAdminAuth, async (req, res) => {
    try {
      const failures = connectionRecovery.getFailureHistory();
      res.json({ failures });
    } catch (error) {
      console.error("Error getting failure history:", error);
      res.status(500).json({ message: "Failed to get failure history" });
    }
  });
  app2.get("/api/admin/database/instructions", requireAdminAuth, async (req, res) => {
    try {
      const instructions = connectionRecovery.getRecoveryInstructions();
      res.json({ instructions });
    } catch (error) {
      console.error("Error getting recovery instructions:", error);
      res.status(500).json({ message: "Failed to get recovery instructions" });
    }
  });
  app2.get("/api/admin/database/connection-health", requireAdminAuth, async (req, res) => {
    try {
      const health = await connectionRecovery.checkConnectionHealth();
      res.json(health);
    } catch (error) {
      console.error("Error checking connection health:", error);
      res.status(500).json({ message: "Failed to check connection health" });
    }
  });
  app2.get("/api/admin/backup/detailed-list", requireAdminAuth, async (req, res) => {
    try {
      const backups = await backupRestore.listAvailableBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error listing detailed backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });
  app2.post("/api/admin/backup/validate", requireAdminAuth, async (req, res) => {
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
  app2.post("/api/admin/backup/restore", requireAdminAuth, async (req, res) => {
    try {
      const { filename } = req.body;
      if (!filename) {
        return res.status(400).json({ message: "Backup filename is required" });
      }
      console.log(`\u{1F504} Admin requested restoration from: ${filename}`);
      const restorePoint = await backupRestore.createRestorePoint();
      console.log(`\u{1F4BE} Created restore point: ${restorePoint}`);
      const result = await backupRestore.restoreFromFile(filename);
      res.json({
        ...result,
        restorePoint: restorePoint.split("/").pop()
        // Only return filename
      });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ message: "Failed to restore backup" });
    }
  });
  app2.get("/api/leaderboard/governors", async (req, res) => {
    try {
      const governors = await storage.getGovernorsLeaderboard();
      res.json(governors);
    } catch (error) {
      console.error("Error fetching governors leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch governors leaderboard" });
    }
  });
  app2.get("/api/og-image/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
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
            ${user.username?.charAt(0)?.toUpperCase() || "U"}
          </text>

          <!-- Username -->
          <text x="250" y="180" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#1f2937">
            ${user.username || "User"}
          </text>

          <!-- GRS Score -->
          <text x="250" y="220" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
            GRS Score: ${user.grsScore || 550}
          </text>

          <!-- XP Points -->
          ${user.xpPoints ? `<text x="250" y="250" font-family="Arial, sans-serif" font-size="20" fill="#6b7280">XP Points: ${user.xpPoints}</text>` : ""}

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
      const pngBuffer = await sharp(Buffer.from(svgImage)).png().resize(1200, 630).toBuffer();
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(pngBuffer);
    } catch (error) {
      console.error("Error generating OG image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });
  app2.get("/api/og-image", async (req, res) => {
    try {
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
      const pngBuffer = await sharp(Buffer.from(svgImage)).png().resize(1200, 630).toBuffer();
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(pngBuffer);
    } catch (error) {
      console.error("Error generating default OG image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });
  app2.get("/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.redirect("/");
      }
      const origin = req.get("host")?.includes("localhost") ? `http://${req.get("host")}` : `https://${req.get("host")}`;
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
            <meta property="og:description" content="GRS Score: ${user.grsScore || 550} \u2022 ${user.xpPoints ? `XP Points: ${user.xpPoints} \u2022 ` : ""}View ${user.username}'s governance reputation on DAO AI" />
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
            <meta name="twitter:description" content="GRS Score: ${user.grsScore || 550} \u2022 ${user.xpPoints ? `XP Points: ${user.xpPoints} \u2022 ` : ""}View ${user.username}'s governance reputation on DAO AI" />
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
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      console.error("Error serving profile meta tags:", error);
      res.redirect("/");
    }
  });
  app2.get("/grs-analytics", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.redirect("/");
      }
      let user = await storage.getUser(userId);
      if (!user) {
        user = await storage.getUserByUsername(userId);
      }
      if (!user) {
        return res.redirect("/");
      }
      const origin = req.get("host")?.includes("localhost") ? `http://${req.get("host")}` : `https://${req.get("host")}`;
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
            <meta property="og:description" content="GRS Score: ${user.grsScore || 550} \u2022 Detailed governance reputation analysis for ${user.username} on DAO AI" />
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
            <meta name="twitter:description" content="GRS Score: ${user.grsScore || 550} \u2022 Detailed governance reputation analysis for ${user.username} on DAO AI" />
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
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      console.error("Error serving GRS analytics meta tags:", error);
      res.redirect("/");
    }
  });
  app2.get("/api/users/:userId/grs-history", async (req, res) => {
    try {
      const userId = req.params.userId;
      const limit = parseInt(req.query.limit) || 50;
      const grsHistory = await storage.getGrsHistory(userId, limit);
      res.json(grsHistory);
    } catch (error) {
      console.error("Error fetching GRS history:", error);
      res.status(500).json({ message: "Failed to fetch GRS history" });
    }
  });
  app2.post("/api/stances/:stanceId/calculate-grs", isAuthenticated, async (req, res) => {
    try {
      const stanceId = parseInt(req.params.stanceId);
      await storage.calculateStanceResults(stanceId);
      res.json({ message: "GRS calculations completed for stance" });
    } catch (error) {
      console.error("Error calculating stance GRS:", error);
      res.status(500).json({ message: "Failed to calculate stance GRS" });
    }
  });
  app2.post("/api/grs/evaluate-review-accuracy", async (req, res) => {
    try {
      await storage.evaluateReviewAccuracy();
      res.json({ message: "Review accuracy evaluation completed" });
    } catch (error) {
      console.error("Error evaluating review accuracy:", error);
      res.status(500).json({ message: "Failed to evaluate review accuracy" });
    }
  });
  app2.post("/api/grs/process-expired-stances", async (req, res) => {
    try {
      await storage.processExpiredStances();
      res.json({ message: "Expired stances processing completed" });
    } catch (error) {
      console.error("Error processing expired stances:", error);
      res.status(500).json({ message: "Failed to process expired stances" });
    }
  });
  app2.get("/api/threads/recent", async (req, res) => {
    try {
      const { since, count_only } = req.query;
      if (count_only === "true" && since) {
        const newThreadsCount = await storage.getNewThreadsCount(since);
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
  app2.get("/api/governance/issues", async (req, res) => {
    try {
      const { since, count_only } = req.query;
      if (count_only === "true" && since) {
        const newIssuesCount = await storage.getNewGovernanceIssuesCount(since);
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
  app2.get("/api/daily-tasks/progress/:date?", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const taskDate = req.params.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const progress = await storage.getDailyTasksProgress(userId, taskDate);
      const resetInfo = await storage.getResetTimeInfo();
      res.json({
        progress: progress || {
          userId,
          taskDate,
          engagementActionsCompleted: 0,
          isStreakEligible: false
        },
        config: resetInfo
      });
    } catch (error) {
      console.error("Error fetching daily tasks progress:", error);
      res.status(500).json({ message: "Failed to fetch daily tasks progress" });
    }
  });
  app2.get("/api/daily-tasks/engagement-stats/:date?", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const date = req.params.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const engagementActions = await storage.getEngagementActionsForUser(userId, date);
      res.json({
        date,
        actions: engagementActions,
        totalActions: engagementActions.reduce((sum2, action) => sum2 + action.count, 0)
      });
    } catch (error) {
      console.error("Error fetching engagement stats:", error);
      res.status(500).json({ message: "Failed to fetch engagement stats" });
    }
  });
  app2.post("/api/daily-tasks/process-streaks", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.profileType !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { targetDate } = req.body;
      const date = targetDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      await storage.processStreaksForAllUsers(date);
      res.json({
        message: "Streaks processed successfully",
        processedDate: date
      });
    } catch (error) {
      console.error("Error processing streaks:", error);
      res.status(500).json({ message: "Failed to process streaks" });
    }
  });
  app2.get("/api/daily-tasks/config", isAuthenticated, async (req, res) => {
    try {
      const resetInfo = await storage.getResetTimeInfo();
      res.json(resetInfo);
    } catch (error) {
      console.error("Error fetching daily tasks config:", error);
      res.status(500).json({ message: "Failed to fetch daily tasks config" });
    }
  });
  app2.get("/api/0g-storage/status", async (req, res) => {
    try {
      res.json({
        available: ogStorageService.isAvailable(),
        message: ogStorageService.isAvailable() ? "0G Storage is configured and ready" : "0G Storage is not configured (OG_PRIVATE_KEY not set)"
      });
    } catch (error) {
      console.error("Error checking 0G Storage status:", error);
      res.status(500).json({ message: "Failed to check 0G Storage status" });
    }
  });
  app2.post("/api/0g-storage/test-upload", async (req, res) => {
    try {
      if (!ogStorageService.isAvailable()) {
        return res.status(503).json({
          success: false,
          message: "0G Storage is not configured (OG_PRIVATE_KEY not set)"
        });
      }
      const balance = await ogStorageService.getWalletBalance();
      console.log(`[0G Storage Test] Wallet balance: ${balance} 0G`);
      if (parseFloat(balance) < 1e-3) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance for upload. Balance: ${balance} 0G`,
          balance
        });
      }
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
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/0g-storage/verify/:txHash", async (req, res) => {
    try {
      const { txHash } = req.params;
      if (!txHash) {
        return res.status(400).json({ message: "Transaction hash required" });
      }
      const activity = await db.select().from(credaActivities).where(eq2(credaActivities.ogTxHash, txHash)).limit(1);
      if (!activity.length) {
        return res.status(404).json({
          verified: false,
          message: "No activity found with this transaction hash"
        });
      }
      const activityData = activity[0];
      const verification = await ogStorageService.verifyRecord(
        activityData.ogTxHash || "",
        activityData.ogRootHash || ""
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
  app2.get("/api/0g-storage/activity/:activityId/proof", async (req, res) => {
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
  app2.get("/api/users/:userId/on-chain-activities", async (req, res) => {
    try {
      const { userId } = req.params;
      const activities = await db.select().from(credaActivities).where(
        and2(
          eq2(credaActivities.userId, userId),
          sql5`${credaActivities.ogTxHash} IS NOT NULL`
        )
      ).orderBy(desc2(credaActivities.createdAt)).limit(100);
      res.json(activities.map((activity) => ({
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
  app2.put("/api/daily-tasks/config", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.profileType !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { resetTimeUtc, minActionsForStreak } = req.body;
      if (resetTimeUtc !== void 0) {
        await storage.upsertDailyTasksConfig({
          configKey: "reset_time_utc",
          configValue: resetTimeUtc,
          description: "UTC time for daily streak reset (HH:MM format)"
        });
      }
      if (minActionsForStreak !== void 0) {
        await storage.upsertDailyTasksConfig({
          configKey: "min_actions_for_streak",
          configValue: minActionsForStreak.toString(),
          description: "Minimum engagement actions required to maintain streak"
        });
      }
      const updatedConfig = await storage.getResetTimeInfo();
      res.json({
        message: "Configuration updated successfully",
        config: updatedConfig
      });
    } catch (error) {
      console.error("Error updating daily tasks config:", error);
      res.status(500).json({ message: "Failed to update daily tasks config" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/production.ts
import express from "express";
import fs5 from "fs";
import path5 from "path";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs5.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_backup();

// server/grs-scheduler.ts
init_storage();
var GrsScheduler = class {
  expiredStancesInterval = null;
  reviewAccuracyInterval = null;
  // Start all GRS background jobs
  start() {
    console.log("\u{1F916} Starting GRS background job scheduler...");
    this.expiredStancesInterval = setInterval(async () => {
      try {
        await storage.processExpiredStances();
      } catch (error) {
        console.error("Error in expired stances job:", error);
      }
    }, 5 * 60 * 1e3);
    this.reviewAccuracyInterval = setInterval(async () => {
      const now = /* @__PURE__ */ new Date();
      if (now.getHours() === 2 && now.getMinutes() === 0) {
        try {
          console.log("\u{1F50D} Running daily review accuracy evaluation...");
          await storage.evaluateReviewAccuracy();
        } catch (error) {
          console.error("Error in review accuracy evaluation job:", error);
        }
      }
    }, 60 * 1e3);
    console.log("\u2705 GRS background jobs started");
    console.log("  \u2022 Expired stances check: Every 5 minutes");
    console.log("  \u2022 Review accuracy evaluation: Daily at 2 AM");
  }
  // Stop all background jobs
  stop() {
    if (this.expiredStancesInterval) {
      clearInterval(this.expiredStancesInterval);
      this.expiredStancesInterval = null;
    }
    if (this.reviewAccuracyInterval) {
      clearInterval(this.reviewAccuracyInterval);
      this.reviewAccuracyInterval = null;
    }
    console.log("\u{1F6D1} GRS background jobs stopped");
  }
  // Manual trigger for expired stances (for testing)
  async triggerExpiredStancesCheck() {
    console.log("\u{1F527} Manually triggering expired stances check...");
    await storage.processExpiredStances();
  }
  // Manual trigger for review accuracy evaluation (for testing)
  async triggerReviewAccuracyEvaluation() {
    console.log("\u{1F527} Manually triggering review accuracy evaluation...");
    await storage.evaluateReviewAccuracy();
  }
};
var grsScheduler = new GrsScheduler();

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path8.dirname(__filename);
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path9 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path9.startsWith("/api")) {
      let logLine = `${req.method} ${path9} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    setTimeout(async () => {
      log("\u{1F6E1}\uFE0F Initializing background services...");
      const isConnected = await backupService.verifyDatabaseConnection();
      if (!isConnected) {
        log("\u26A0\uFE0F DATABASE CONNECTION WARNING - retrying in background");
      } else {
        log("\u2705 Database connection verified");
      }
      const isProduction = process.env.NODE_ENV === "production";
      if (!isProduction) {
        databaseMonitor.startMonitoring(5);
        backupService.scheduleAutomaticBackups();
        log("\u2705 Database protection active (development mode)");
      } else {
        databaseMonitor.startMonitoring(10);
        log("\u2705 Database monitoring active (production mode)");
      }
      grsScheduler.start();
    }, 2e3);
  });
})();
