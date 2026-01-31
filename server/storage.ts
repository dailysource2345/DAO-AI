import {
  users,
  daos,
  spaces,
  governanceIssues,
  comments,
  votes,
  stanceVotes,
  commentVotes,
  spaceVotes,
  userDaoScores,
  userDaoFollows,
  referrals,
  businessProfiles,
  reviews,
  reviewComments,
  projectReviews,
  reviewReports,
  contentReports,
  reviewShares,
  reviewShareClicks,
  companies,
  companyAdmins,
  companyUsers,
  emailVerificationCodes,
  inviteCodes,
  inviteSubmissions,
  inviteUsage,
  inviteRewards,
  adminFlags,
  credaActivities,
  grsEvents,
  notifications,
  notificationSettings,
  dailyTasksProgress,
  dailyTasksConfig,
  // 0G Storage type imports
  type SelectCredaActivity as CredaActivity,
  type SelectUser as User,
  type InsertUser as UpsertUser,
  type SelectDao as Dao,
  type InsertDao,
  type SelectSpace as Space,
  type InsertSpace,
  type SelectGovernanceIssue as GovernanceIssue,
  type InsertGovernanceIssue,
  type SelectComment as Comment,
  type InsertComment,
  type SelectVote as Vote,
  type InsertVote,
  type SelectStanceVote as StanceVote,
  type InsertStanceVote,
  type SelectSpaceVote as SpaceVote,
  type InsertSpaceVote,
  type SelectUserDaoFollow as UserDaoFollow,
  type InsertUserDaoFollow,
  type SelectBusinessProfile as BusinessProfile,
  type InsertBusinessProfile,
  type SelectReview as Review,
  type InsertReview,
  type SelectReviewComment as ReviewComment,
  type InsertReviewComment,
  type SelectProjectReview as ProjectReview,
  type InsertProjectReview,
  type ProjectReviewWithUser,
  type SelectReviewReport as ReviewReport,
  type InsertReviewReport,
  type SelectContentReport as ContentReport,
  type InsertContentReport,
  type SelectReviewShare as ReviewShare,
  type InsertReviewShare,
  type SelectReviewShareClick as ReviewShareClick,
  type InsertReviewShareClick,
  type SelectCompany as Company,
  type InsertCompany,
  type SelectCompanyAdmin as CompanyAdmin,
  type InsertCompanyAdmin,
  type SelectCompanyUser as CompanyUser,
  type InsertCompanyUser,
  type EmailVerificationCode,
  type InsertEmailVerificationCode,
  type InviteCode,
  type InsertInviteCode,
  type InviteSubmission,
  type InsertInviteSubmission,
  type Referral,
  type InsertReferral,
  type SelectGrsEvent as GrsEvent,
  type InsertGrsEvent,
  type SelectNotification as Notification,
  type InsertNotification,
  type SelectNotificationSettings as NotificationSettings,
  type InsertNotificationSettings,
  type GovernanceIssueWithAuthorAndDao,
  type CommentWithAuthor,
  type SelectInviteUsage as InviteUsage,
  type InsertInviteUsage,
  type SelectInviteReward as InviteReward,
  type InsertInviteReward,
  type AdminFlagWithDetails,
  type UserWithInviteData,
  type DailyTasksProgress,
  type InsertDailyTasksProgress,
  type DailyTasksConfig,
  type InsertDailyTasksConfig,
  type AdminFlag,
  type InsertAdminFlag,
  type InviteUsageWithDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, and, sum, or, lt, gt, gte, like, ilike, isNotNull, count, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByTwitterHandle(twitterHandle: string): Promise<User | undefined>;
  getUserByTwitterId(twitterId: string): Promise<User | undefined>; // Now uses access_id for Twitter OAuth lookups
  getUserByAccessId(accessId: string): Promise<User | undefined>; // New method for Twitter OAuth authentication
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  searchUsers(query: string): Promise<User[]>;
  searchUsersAndDaos(query: string): Promise<any[]>;
  getRecentUsers(limit: number): Promise<User[]>;
  suspendUser(userId: string, reason: string): Promise<User>;
  unsuspendUser(userId: string): Promise<User>;
  getSuspendedUsers(): Promise<User[]>;
  createUnclaimedProfile(profileData: {
    twitterHandle: string;
    twitterUrl?: string;
    firstName?: string;
    lastName?: string;
    createdBy: string;
    profileType?: string;
    walletAddress?: string;
  }): Promise<User>;
  claimProfile(twitterHandle: string, claimingUserId: string): Promise<User | null>;
  claimProfileMergeWithOAuth(unclaimedProfileId: string, oauthUserId: string): Promise<User | null>;
  claimProfileWithTwitterOAuth(twitterHandle: string, twitterOAuthId: string, twitterOAuthData: any): Promise<User | null>; // New method for access_id claiming
  findClaimableProfile(twitterHandle?: string, walletAddress?: string): Promise<User | undefined>;

  // Email verification operations
  createEmailVerificationCode(data: InsertEmailVerificationCode): Promise<EmailVerificationCode>;
  getEmailVerificationCode(email: string, code: string): Promise<EmailVerificationCode | undefined>;
  deleteEmailVerificationCode(email: string): Promise<void>;

  // Enhanced invite system operations
  createInviteCode(data: InsertInviteCode): Promise<InviteCode>;
  getInviteCode(code: string): Promise<InviteCode | undefined>;
  validateInviteCode(code: string): Promise<boolean>;
  useInviteCode(code: string, userId: string, metadata?: any): Promise<InviteCode>;
  getUserInviteCodes(userId: string): Promise<InviteCode[]>;
  generateInviteCodesForUser(userId: string, count: number): Promise<InviteCode[]>;
  getUserInviteStats(userId: string): Promise<{
    availableCodes: number;
    totalInvitesSent: number;
    successfulInvites: number;
    xpFromInvites: number;
    nextMilestone: number;
  }>;

  // Invite usage tracking
  createInviteUsage(data: InsertInviteUsage): Promise<InviteUsage>;
  getInviteUsageByUser(userId: string): Promise<InviteUsageWithDetails[]>;
  getInviteChain(userId: string): Promise<UserWithInviteData[]>;
  getInviteTree(startUserId: string): Promise<any>;

  // Invite rewards management
  createInviteReward(data: InsertInviteReward): Promise<InviteReward>;
  processInviteReward(inviterId: string, invitedUserId: string, xpAmount: number): Promise<void>;
  checkAndProcessMilestoneRewards(userId: string): Promise<InviteReward[]>;

  // Admin investigation and monitoring
  createAdminFlag(data: InsertAdminFlag): Promise<AdminFlag>;
  getAdminFlags(status?: string): Promise<AdminFlagWithDetails[]>;
  updateAdminFlag(flagId: number, updates: Partial<AdminFlag>): Promise<AdminFlag>;
  detectSuspiciousInviteActivity(): Promise<AdminFlag[]>;
  getInviteAnalytics(): Promise<{
    totalInvites: number;
    activeInviters: number;
    conversionRate: number;
    geographicDistribution: any[];
    suspiciousActivities: number;
  }>;

  // DAO operations
  getAllDaos(): Promise<Dao[]>;
  getDaoBySlug(slug: string): Promise<Dao | undefined>;
  getDaoById(id: number): Promise<Dao | undefined>;
  createDao(dao: InsertDao): Promise<Dao>;

  // Governance Issue operations (replaces thread operations)
  getGovernanceIssuesByDao(daoId: number, sortBy: string): Promise<GovernanceIssueWithAuthorAndDao[]>;
  getGovernanceIssuesBySpace(spaceSlug: string, limit?: number): Promise<any[]>;
  getActiveGovernanceIssues(): Promise<GovernanceIssueWithAuthorAndDao[]>;
  
  // Space operations
  getSpaceBySlug(slug: string): Promise<any | undefined>;
  getActiveStanceCount(): Promise<number>;
  getNextStanceExpirationTime(): Promise<Date | null>;
  getUserActiveStanceCount(userId: string): Promise<number>;
  hasActiveStanceOnTarget(targetUserId: string): Promise<boolean>;
  hasRecentStanceFromTarget(userId: string, targetUserId: string): Promise<boolean>;
  hasActiveStanceOnProject(targetProjectId: number): Promise<boolean>;
  getRecentGovernanceIssues(): Promise<GovernanceIssueWithAuthorAndDao[]>;
  getGovernanceIssueById(id: number): Promise<GovernanceIssueWithAuthorAndDao | undefined>;
  createGovernanceIssue(issue: InsertGovernanceIssue): Promise<GovernanceIssue>;
  getUserGovernanceIssues(userId: string): Promise<GovernanceIssueWithAuthorAndDao[]>;
  expireGovernanceIssue(issueId: number): Promise<void>;

  // Comment operations (updated for governance issues)
  getCommentsByIssue(issueId: number): Promise<CommentWithAuthor[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentById(id: number): Promise<Comment | undefined>;
  getUserComments(userId: string): Promise<any[]>;

  // Vote operations (updated for governance issues)
  getUserVote(userId: string, targetType: string, targetId: number): Promise<Vote | undefined>;
  getUserVotesForReviews(userId: string, reviewIds: number[]): Promise<Record<number, Vote>>;
  createVote(vote: InsertVote): Promise<Vote>;
  updateVote(userId: string, targetType: string, targetId: number, voteType: string): Promise<Vote>;
  deleteVote(userId: string, targetType: string, targetId: number): Promise<void>;
  updateVoteCounts(targetType: string, targetId: number): Promise<void>;

  // Stance voting operations
  getUserStanceVote(userId: string, stanceId: number): Promise<StanceVote | undefined>;
  getUserStanceVotes(userId: string): Promise<StanceVote[]>;
  createStanceVote(vote: InsertStanceVote): Promise<StanceVote>;
  updateStanceVote(userId: string, stanceId: number, voteType: string): Promise<StanceVote>;
  deleteStanceVote(userId: string, stanceId: number): Promise<void>;
  updateStanceVoteCounts(stanceId: number): Promise<void>;
  getStanceVoteCounts(stanceId: number): Promise<{ championVotes: number; challengeVotes: number; opposeVotes: number }>;
  getStanceVoters(stanceId: number): Promise<any[]>;
  getUserStanceStats(userId: string): Promise<{ total: number; successful: number; successRate: number; challengesWon: number; championsWon: number }>;

  // Space voting operations
  getUserSpaceVote(userId: string, spaceId: number): Promise<SpaceVote | undefined>;
  createSpaceVote(vote: InsertSpaceVote): Promise<SpaceVote>;
  updateSpaceVote(userId: string, spaceId: number, voteType: string, comment?: string): Promise<SpaceVote>;
  updateSpaceVoteCounts(spaceId: number): Promise<void>;
  getRecentSpaceVoteComments(limit?: number): Promise<any[]>;

  // Score operations
  updateUserScore(userId: string, daoId: number, points: number): Promise<void>;
  initializeUserScoring(userId: string): Promise<void>;
  getGlobalLeaderboard(): Promise<any[]>;
  getDaoLeaderboard(daoId: number): Promise<any[]>;

  // GRS (Governance Reputation Score) operations
  calculateGrsScore(userId: string): Promise<number>;
  updateUserGrsScore(userId: string): Promise<void>;
  recalculateAllGrsScores(): Promise<void>;
  getGrsRanking(userId: string): Promise<{ score: number; percentile: number; rank: number; total: number }>;
  getBatchGrsScores(userIds: string[]): Promise<Map<string, { score: number; percentile: number }>>;
  getBatchHasReviewed(reviewerId: string, targetUserIds: string[]): Promise<Map<string, boolean>>;

  // Stats operations
  getGlobalStats(): Promise<any>;

  // Search operations
  searchContent(query: string): Promise<{
    daos: Dao[];
    threads: any[];
    users: any[];
  }>;
  searchTwitterAccounts(query: string): Promise<User[]>;

  // Follow operations
  getUserFollowingStatus(userId: string, daoId: number): Promise<UserDaoFollow | undefined>;
  followDao(userId: string, daoId: number): Promise<UserDaoFollow>;
  unfollowDao(userId: string, daoId: number): Promise<void>;
  getUserFollowedDaos(userId: string): Promise<Dao[]>;

  // Referral operations
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createReferral(referrerId: string, referredId: string, referralCode: string): Promise<Referral>;
  getUserReferralStats(userId: string): Promise<any>;
  getReferralLeaderboard(): Promise<any[]>;
  getGovernorsLeaderboard(): Promise<any[]>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllUserScores(): Promise<any[]>;
  updateUserCredaPoints(userId: string, newCredaPoints: number): Promise<User>;
  updateUserDaoScore(userId: string, daoId: number, newScore: number): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  updateDao(daoId: number, updates: Partial<Dao>): Promise<void>;
  deleteDao(daoId: number): Promise<void>;
  deleteGovernanceIssue(issueId: number): Promise<void>;
  deleteComment(commentId: number): Promise<void>;
  getDetailedUserStats(userId: string): Promise<any>;
  getAdminStats(): Promise<any>;

  // Invite code admin operations
  getAllInviteCodes(): Promise<any[]>;
  generateInviteCodes(count: number): Promise<any[]>;

  // Invite submission operations
  submitInviteCode(userId: string, code: string): Promise<InviteSubmission>;
  getUserInviteSubmission(userId: string): Promise<InviteSubmission | undefined>;
  getAllInviteSubmissions(): Promise<any[]>;
  approveInviteSubmission(submissionId: number): Promise<void>;
  denyInviteSubmission(submissionId: number, notes?: string): Promise<void>;

  // Review operations
  getUserReviews(userId: string): Promise<Review[]>;
  getReviewsBySpace(spaceSlug: string, limit?: number): Promise<any[]>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewBasic(id: number): Promise<{ id: number; reviewerId: string } | null>;
  getReviewByUsers(reviewerId: string, reviewedId: string): Promise<Review | undefined>;
  getReviewByUserAndDao(reviewerId: string, daoId: number): Promise<Review | undefined>;
  getDaoReviews(daoId: number): Promise<any[]>;
  getAllReviews(): Promise<any[]>;
  getRecentReviews(limit?: number): Promise<any[]>;
  getUserReviewStats(userId: string): Promise<{ total: number; positive: number; negative: number; neutral: number; positivePercentage: number }>;
  getUserAdvancedReviewStats(userId: string): Promise<{ total: number; averageRating: number; consistency: number }>;

  // Review comment operations
  getReviewComments(reviewId: number): Promise<ReviewComment[]>;
  getReviewCommentById(commentId: number): Promise<ReviewComment | undefined>;
  createReviewComment(comment: InsertReviewComment): Promise<ReviewComment>;
  hasUserReviewed(reviewerId: string, reviewedId: string): Promise<boolean>;

  // Project review operations (for /projects page)
  createProjectReview(review: InsertProjectReview): Promise<ProjectReview>;
  getProjectReviews(projectId: string): Promise<ProjectReview[]>;
  getAllProjectReviews(limit?: number): Promise<ProjectReview[]>;

  // Review reporting operations
  reportReview(report: InsertReviewReport): Promise<ReviewReport>;
  getReportedReviewsForProject(projectId: string): Promise<any[]>;
  getReportedReviewsForCompany(companyId: number): Promise<any[]>;
  deleteProjectReview(id: number): Promise<void>;

  // Review share operations (for viral X/Twitter sharing)
  createReviewShare(share: InsertReviewShare): Promise<ReviewShare>;
  getReviewShare(shareToken: string): Promise<ReviewShare | undefined>;
  trackReviewShareClick(click: InsertReviewShareClick): Promise<void>;
  claimShareReward(shareId: number, userId: string): Promise<void>;
  getUserReviewShares(userId: string): Promise<ReviewShare[]>;
  linkReferralToUser(shareToken: string, newUserId: string): Promise<void>;

  // Content reporting operations (for all content types)
  reportContent(report: InsertContentReport): Promise<ContentReport>;
  awardSpamReportCreda(userId: string, contentType: string, contentId: number): Promise<void>;
  getContentReports(status?: string): Promise<ContentReport[]>;
  getContentReportsByUser(userId: string): Promise<ContentReport[]>;

  // Company operations (for admin4 project management)
  getAllCompanies(): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | undefined>;
  getCompanyByExternalId(externalId: string): Promise<Company | undefined>;
  getCompanyBySlug(slug: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, updates: Partial<Company>): Promise<Company>;
  deleteCompany(id: number): Promise<void>;
  getCompanyReviews(companyId: number): Promise<any[]>;
  getCompanyAnalytics(companyId: number): Promise<any>;
  addCompanyReplyToReview(reviewId: number, reply: string): Promise<any>;
  
  // Company admin operations
  getCompanyAdmins(companyId: number): Promise<any[]>;
  addCompanyAdmin(admin: InsertCompanyAdmin): Promise<CompanyAdmin>;
  removeCompanyAdmin(id: number): Promise<void>;
  isUserCompanyAdmin(userId: string, companyId: number): Promise<boolean>;

  // Business profile operations
  createBusinessProfile(userId: string, data: any): Promise<any>;
  getBusinessProfile(id: number): Promise<any | undefined>;
  getBusinessProfileBySlug(slug: string): Promise<any | undefined>;
  getBusinessProfileByUserId(userId: string): Promise<any | undefined>;
  getBusinessProfileByInviteCode(inviteCode: string): Promise<any | undefined>;
  updateBusinessProfile(id: number, data: any): Promise<any>;
  deployBusinessProfile(id: number): Promise<any>;
  getBusinessReviews(businessId: number): Promise<any[]>;
  getAllBusinessProfiles(): Promise<any[]>;

  // Activity operations
  getUserActivity(userId: string): Promise<any[]>;

  // CREDA operations
  // DAO AI CREDA Points System
  awardCredaPoints(userId: string, category: string, activityType: string, amount: number, targetType?: string, targetId?: number, metadata?: any): Promise<any>;
  awardStanceCreationCreda(userId: string, stanceId: number): Promise<any>;
  awardCommentCreda(userId: string, commentContent: string, issueId: number): Promise<void>;
  awardVotingCreda(userId: string, targetType: string, targetId: number, voteType: string): Promise<void>;
  awardUpvoteReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void>;
  awardDownvoteReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void>;
  awardCommentReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void>;
  awardCommentUpvoteReceivedCreda(commentAuthorId: string, commentId: number): Promise<void>;
  awardReviewUpvoteReceivedCreda(reviewAuthorId: string, reviewId: number): Promise<void>;
  awardOnboardingCreda(userId: string): Promise<void>;
  awardWelcomeTourCreda(userId: string): Promise<void>;
  applySpamPenalty(userId: string, contentId: number, contentType: string): Promise<void>;
  getCredaLeaderboard(timeframe: 'overall' | 'weekly', limit?: number, daoId?: number): Promise<any[]>;
  getDaoCredaLeaderboard(daoId: number, timeframe: 'overall' | 'weekly', limit?: number): Promise<any[]>;
  getLeaderboardStats(): Promise<any>;
  getUserCredaActivities(userId: string): Promise<any[]>;

  // GRS operations
  applyGrsChange(userId: string, amount: number, reason: string, relatedEntityType?: string, relatedEntityId?: number, metadata?: any): Promise<void>;
  calculateStanceResults(stanceId: number): Promise<void>;
  updateReviewImpact(reviewId: number): Promise<void>;
  evaluateReviewAccuracy(): Promise<void>;
  getGrsHistory(userId: string, limit?: number): Promise<GrsEvent[]>;
  updateUserGrs(userId: string, newScore: number): Promise<void>;
  calculateGrsPercentile(userId: string): Promise<void>;
  processExpiredStances(): Promise<void>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, limit?: number, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  markNotificationsAsRead(notificationIds: number[]): Promise<void>;
  deleteNotification(notificationId: number): Promise<void>;
  deleteNotifications(notificationIds: number[]): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Notification settings operations
  getUserNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;
  createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings>;

  // Notification creation helpers - these will automatically check user preferences
  notifyComment(targetUserId: string, senderId: string, commentId: number, issueTitle: string): Promise<void>;
  notifyVote(targetUserId: string, senderId: string, voteType: string, entityType: string, entityId: number): Promise<void>;
  notifyReview(targetUserId: string, senderId: string, reviewId: number, reviewType: string): Promise<void>;
  notifyFollow(targetUserId: string, senderId: string): Promise<void>;
  notifyAchievement(userId: string, achievementTitle: string, points?: number): Promise<void>;
  notifyCredaGain(userId: string, activityType: string, points: number, entityType?: string, entityId?: number): Promise<void>;
  notifyGrsChange(userId: string, changeAmount: number, reason: string, relatedEntityType?: string, relatedEntityId?: number): Promise<void>;

  // Daily Tasks operations
  getDailyTasksProgress(userId: string, taskDate: string): Promise<DailyTasksProgress | undefined>;
  upsertDailyTasksProgress(data: InsertDailyTasksProgress): Promise<DailyTasksProgress>;
  updateEngagementActionCount(userId: string, taskDate: string, increment?: number): Promise<void>;
  getDailyTasksConfig(configKey: string): Promise<DailyTasksConfig | undefined>;
  upsertDailyTasksConfig(data: InsertDailyTasksConfig): Promise<DailyTasksConfig>;

  // Streak operations
  updateUserStreak(userId: string, currentStreak: number, longestStreak?: number): Promise<void>;
  processStreaksForAllUsers(targetDate: string): Promise<void>;
  getEngagementActionsForUser(userId: string, date: string): Promise<{ activityType: string; count: number; }[]>;
  getResetTimeInfo(): Promise<{ resetTimeUtc: string; minActionsForStreak: number; }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // First try exact match
      let result = await db.select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      // If no exact match, try case-insensitive match
      if (result.length === 0) {
        result = await db.select()
          .from(users)
          .where(ilike(users.username, username))
          .limit(1);
      }

      return result[0] || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined; // Handle the error gracefully by returning undefined
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByTwitterHandle(twitterHandle: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.twitterHandle, twitterHandle));
    return result[0];
  }

  async getUserByTwitterId(twitterId: string): Promise<User | undefined> {
    // Updated to use access_id for Twitter OAuth lookups
    const result = await db.select().from(users).where(eq(users.access_id, twitterId));
    return result[0];
  }

  async getUserByAccessId(accessId: string): Promise<User | undefined> {
    // New method for Twitter OAuth authentication using access_id
    const result = await db.select().from(users).where(eq(users.access_id, accessId));
    return result[0];
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return result[0];
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchResults = await db.select().from(users).where(
      or(
        sql`${users.username} ILIKE ${'%' + query + '%'}`,
        sql`${users.firstName} ILIKE ${'%' + query + '%'}`,
        sql`${users.lastName} ILIKE ${'%' + query + '%'}`,
        sql`${users.twitterHandle} ILIKE ${'%' + query + '%'}`
      )
    ).limit(10);
    return searchResults;
  }

  async searchUsersAndDaos(query: string): Promise<any[]> {
    // Search users
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
      type: sql<string>`'user'`
    }).from(users).where(
      or(
        sql`${users.username} ILIKE ${'%' + query + '%'}`,
        sql`${users.firstName} ILIKE ${'%' + query + '%'}`,
        sql`${users.lastName} ILIKE ${'%' + query + '%'}`,
        sql`${users.twitterHandle} ILIKE ${'%' + query + '%'}`
      )
    ).limit(5);

    // Search DAOs
    const daoResults = await db.select({
      id: sql<string>`CONCAT('dao_', ${daos.id})`,
      username: daos.name,
      firstName: daos.name,
      lastName: sql<string>`NULL`,
      profileImageUrl: daos.logoUrl,
      twitterHandle: daos.twitterHandle,
      twitterUrl: daos.twitterUrl,
      isUnclaimedProfile: sql<boolean>`NOT ${daos.isUnclaimed}`,
      isClaimed: sql<boolean>`NOT ${daos.isUnclaimed}`,
      profileType: sql<string>`'dao'`,
      type: sql<string>`'dao'`
    }).from(daos).where(
      or(
        sql`${daos.name} ILIKE ${'%' + query + '%'}`,
        sql`${daos.slug} ILIKE ${'%' + query + '%'}`,
        sql`${daos.twitterHandle} ILIKE ${'%' + query + '%'}`
      )
    ).limit(5);

    // Combine and return results
    return [...userResults, ...daoResults];
  }

  async getRecentUsers(limit: number): Promise<User[]> {
    const recentUsers = await db
      .select()
      .from(users)
      .where(isNotNull(users.username))
      .orderBy(desc(users.createdAt))
      .limit(limit);
    return recentUsers;
  }

  async searchContent(query: string): Promise<{
    daos: any[];
    threads: any[];
    users: any[];
  }> {
    // Search DAOs
    const daoResults = await db.select().from(daos).where(
      or(
        ilike(daos.name, `%${query}%`),
        ilike(daos.slug, `%${query}%`),
        ilike(daos.twitterHandle, `%${query}%`)
      )
    ).limit(10);

    // Search governance issues/threads
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
    })
    .from(governanceIssues)
    .leftJoin(users, eq(governanceIssues.authorId, users.id))
    .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
    .where(
      or(
        ilike(governanceIssues.title, `%${query}%`),
        ilike(governanceIssues.content, `%${query}%`)
      )
    ).limit(10);

    // Search users - improved query with better filtering
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

  async searchTwitterAccounts(query: string): Promise<any[]> {
    // Extract username from X/Twitter URL if provided
    let searchUsername = query.toLowerCase().trim();
    if (query.includes('twitter.com/') || query.includes('x.com/')) {
      const urlParts = query.split('/');
      const usernameIndex = urlParts.findIndex(part => part === 'twitter.com' || part === 'x.com') + 1;
      if (usernameIndex < urlParts.length) {
        searchUsername = urlParts[usernameIndex].replace('@', '').split('?')[0]; // Remove query params
      }
    } else {
      searchUsername = query.replace('@', '');
    }

    const searchTerm = `%${searchUsername}%`;

    const results = await db
      .select({
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
      })
      .from(users)
      .where(
        or(
          ilike(users.twitterHandle, searchTerm),
          ilike(users.username, searchTerm)
        )
      )
      .orderBy(
        sql`CASE WHEN ${users.isUnclaimedProfile} = false THEN 1 ELSE 2 END`,
        desc(users.credaPoints)
      )
      .limit(10);

    // Add featured DAOs with X accounts to search results if they match the query
    const featuredDaosWithX = [
      {
        id: 'jupiter_dao',
        username: 'Jupiter DAO',
        firstName: 'Jupiter',
        lastName: 'DAO',
        profileImageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=80&h=80&fit=crop&crop=center',
        credaPoints: 12450,
        isUnclaimedProfile: true,
        isClaimed: false,
        twitterHandle: 'jup_dao',
        twitterUrl: 'https://x.com/jup_dao',
        hasInviteAccess: false
      }
    ];

    // Filter DAOs that match the search term
    const matchingDaos = featuredDaosWithX.filter(dao =>
      dao.twitterHandle.toLowerCase().includes(searchUsername) ||
      dao.username.toLowerCase().includes(searchUsername) ||
      dao.firstName.toLowerCase().includes(searchUsername)
    );

    // Combine and deduplicate results
    const combinedResults = [...matchingDaos, ...results];
    const uniqueResults = combinedResults.filter((item, index, self) =>
      index === self.findIndex(t => t.twitterHandle === item.twitterHandle)
    );

    return uniqueResults.slice(0, 10);
  }

  async createUnclaimedProfile(profileData: {
    twitterHandle: string;
    twitterUrl?: string;
    firstName?: string;
    lastName?: string;
    createdBy: string;
    profileType?: string;
    walletAddress?: string;
  }): Promise<User> {
    // Check if Twitter handle already exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.twitterHandle, profileData.twitterHandle))
      .limit(1);

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
      authProvider: 'unclaimed',
      createdBy: profileData.createdBy,
      profileType: profileData.profileType || 'member',
      credaPoints: 0,
      grsScore: 1300, // Neutral starting score for unclaimed profiles (Neutral level)
      grsPercentile: 50, // Neutral percentile
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
      lastActiveDate: new Date(),
      onboardingCompletedAt: null,
      profileCompletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Initialize user scoring data for all DAOs
    await this.initializeUserScoring(result[0].id);

    return result[0];
  }

  async claimProfile(twitterHandle: string, claimingUserId: string): Promise<User | null> {
    // Find unclaimed profile with matching Twitter handle
    const [unclaimedProfile] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.twitterHandle, twitterHandle),
          eq(users.isUnclaimedProfile, true),
          eq(users.isClaimed, false)
        )
      )
      .limit(1);

    if (!unclaimedProfile) {
      return null;
    }

    // Update the unclaimed profile to be claimed
    const claimedResult = await db
      .update(users)
      .set({
        isClaimed: true,
        isUnclaimedProfile: false,
        claimedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, unclaimedProfile.id))
      .returning();

    return claimedResult[0];
  }

  async claimProfileMergeWithOAuth(unclaimedProfileId: string, oauthUserId: string): Promise<User | null> {
    // Get the unclaimed profile
    const [unclaimedProfile] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, unclaimedProfileId),
          eq(users.isUnclaimedProfile, true),
          eq(users.isClaimed, false)
        )
      )
      .limit(1);

    if (!unclaimedProfile) {
      return null;
    }

    // Get the OAuth user to merge data
    const [oauthUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, oauthUserId))
      .limit(1);

    if (!oauthUser) {
      return null;
    }

    // Merge OAuth user data into the unclaimed profile and mark as claimed
    const claimedResult = await db
      .update(users)
      .set({
        // Keep the original unclaimed profile data, but update with OAuth info
        email: oauthUser.email || unclaimedProfile.email,
        profileImageUrl: oauthUser.profileImageUrl || unclaimedProfile.profileImageUrl,
        authProvider: oauthUser.authProvider,
        isClaimed: true,
        isUnclaimedProfile: false,
        claimedAt: new Date(),
        updatedAt: new Date(),
        // Preserve the unclaimed profile's existing data like CREDA, GRS score, etc.
        // while updating with verified OAuth account info
      })
      .where(eq(users.id, unclaimedProfileId))
      .returning();

    // Delete the temporary OAuth user since we've merged it into the claimed profile
    await db
      .delete(users)
      .where(eq(users.id, oauthUserId));

    return claimedResult[0];
  }

  async claimProfileWithTwitterOAuth(twitterHandle: string, twitterOAuthId: string, twitterOAuthData: any): Promise<User | null> {
    // Find unclaimed profile with matching Twitter handle
    const [unclaimedProfile] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.twitterHandle, twitterHandle),
          eq(users.isUnclaimedProfile, true),
          eq(users.isClaimed, false)
        )
      )
      .limit(1);

    if (!unclaimedProfile) {
      return null;
    }

    // Update the unclaimed profile with Twitter OAuth data and set access_id
    const claimedResult = await db
      .update(users)
      .set({
        access_id: twitterOAuthId, // SET ACCESS_ID FOR TWITTER OAUTH AUTHENTICATION
        firstName: twitterOAuthData.name?.split(' ')[0] || unclaimedProfile.firstName,
        lastName: twitterOAuthData.name?.split(' ').slice(1).join(' ') || unclaimedProfile.lastName,
        profileImageUrl: twitterOAuthData.profileImageUrl || unclaimedProfile.profileImageUrl,
        authProvider: "twitter",
        isClaimed: true,
        isUnclaimedProfile: false,
        claimedAt: new Date(),
        updatedAt: new Date()
        // PRESERVE existing id - this maintains all foreign key relationships
      })
      .where(eq(users.id, unclaimedProfile.id))
      .returning();

    return claimedResult[0];
  }

  async getClaimableProfilesForUser(twitterHandle: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.twitterHandle, twitterHandle),
          eq(users.isUnclaimedProfile, true),
          eq(users.isClaimed, false)
        )
      );
  }

  async findClaimableProfile(twitterHandle?: string, walletAddress?: string): Promise<User | undefined> {
    if (!twitterHandle && !walletAddress) {
      return undefined;
    }

    const conditions = [];
    if (twitterHandle) {
      conditions.push(eq(users.twitterHandle, twitterHandle));
    }
    if (walletAddress) {
      conditions.push(eq(users.walletAddress, walletAddress));
    }

    const profileResult = await db
      .select()
      .from(users)
      .where(
        and(
          or(...conditions),
          eq(users.isUnclaimedProfile, true),
          eq(users.isClaimed, false)
        )
      )
      .limit(1);

    return profileResult[0];
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Initialize user's scoring data if this is a new user
    await this.initializeUserScoring(result[0].id);

    return result[0];
  }

  // Initialize user scoring data for all DAOs
  async initializeUserScoring(userId: string): Promise<void> {
    try {
      // Initialize user with starting GRS score (1300 - average starting point)
      await db
        .update(users)
        .set({
          grsScore: 1300,
          grsPercentile: 50,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // Get all DAOs
      const allDaos = await db.select().from(daos);

      // Create initial score records for each DAO (0 points)
      for (const dao of allDaos) {
        await db
          .insert(userDaoScores)
          .values({
            userId,
            daoId: dao.id,
            score: 0
          })
          .onConflictDoNothing(); // Don't overwrite existing scores
      }

      // For brand new users, don't call updateUserGrsScore as it might override the correct starting score
      // Only update GRS score if user has existing activity (GRS events, votes, comments, etc.)
      const grsEventsCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(grsEvents)
        .where(eq(grsEvents.userId, userId));

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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async suspendUser(userId: string, reason: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isSuspended: true, 
        suspendedAt: new Date(), 
        suspensionReason: reason,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async unsuspendUser(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isSuspended: false, 
        suspendedAt: null, 
        suspensionReason: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getSuspendedUsers(): Promise<User[]> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.isSuspended, true))
      .orderBy(desc(users.suspendedAt));
    return result;
  }

  // Email verification operations
  async createEmailVerificationCode(data: InsertEmailVerificationCode): Promise<EmailVerificationCode> {
    const [code] = await db.insert(emailVerificationCodes).values(data).returning();
    return code;
  }

  async getEmailVerificationCode(email: string, code: string): Promise<EmailVerificationCode | undefined> {
    const [verificationCode] = await db
      .select()
      .from(emailVerificationCodes)
      .where(and(eq(emailVerificationCodes.email, email), eq(emailVerificationCodes.code, code)));
    return verificationCode;
  }

  async deleteEmailVerificationCode(email: string): Promise<void> {
    await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.email, email));
  }

  // Invite code operations
  async createInviteCode(data: InsertInviteCode): Promise<InviteCode> {
    const [inviteCode] = await db.insert(inviteCodes).values(data).returning();
    return inviteCode;
  }

  async getInviteCode(code: string): Promise<InviteCode | undefined> {
    const [inviteCode] = await db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.code, code));
    return inviteCode;
  }

  async validateInviteCode(code: string): Promise<boolean> {
    const inviteCode = await this.getInviteCode(code);

    if (!inviteCode) {
      return false;
    }

    // Check if code is expired
    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      return false;
    }

    // Check if code has reached max uses
    if ((inviteCode.currentUses || 0) >= (inviteCode.maxUses || 0)) {
      return false;
    }

    return true;
  }

  async useInviteCode(code: string, userId: string, metadata?: any): Promise<InviteCode> {
    const inviteCodeRecord = await this.getInviteCode(code);
    if (!inviteCodeRecord) {
      throw new Error("Invalid invite code");
    }

    const [updatedCode] = await db
      .update(inviteCodes)
      .set({
        currentUses: sql`${inviteCodes.currentUses} + 1`,
        isUsed: sql`${inviteCodes.currentUses} + 1 >= ${inviteCodes.maxUses}`,
        usedBy: userId,
        usedAt: new Date(),
        usageIpAddress: metadata?.ipAddress,
        usageUserAgent: metadata?.userAgent,
        usageLocation: metadata?.location,
        isRewardClaimed: false
      })
      .where(eq(inviteCodes.code, code))
      .returning();

    // Update user with invite information
    await db
      .update(users)
      .set({
        hasInviteAccess: true,
        invitedBy: inviteCodeRecord.createdBy,
        inviteCodeUsed: code,
        fullAccessActivatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Create invite usage record for detailed tracking (only for user codes)
    if (inviteCodeRecord.createdBy && inviteCodeRecord.codeType === 'user') {
      const inviteUsageData: InsertInviteUsage = {
        inviteCodeId: inviteCodeRecord.id,
        inviterId: inviteCodeRecord.createdBy!,
        invitedUserId: userId,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        location: metadata?.location,
        deviceFingerprint: metadata?.deviceFingerprint,
        credaRewardGiven: 100
      };

      const inviteUsage = await this.createInviteUsage(inviteUsageData);
    }

    // Process invite reward for the inviter (only for user-generated codes)
    if (inviteCodeRecord.createdBy && inviteCodeRecord.codeType === 'user') {
      await this.processInviteReward(inviteCodeRecord.createdBy, userId, 70);
    }

    return updatedCode;
  }

  async getUserInviteCodes(userId: string): Promise<InviteCode[]> {
    return await db
      .select()
      .from(inviteCodes)
      .where(and(eq(inviteCodes.createdBy, userId), eq(inviteCodes.codeType, "user")))
      .orderBy(desc(inviteCodes.createdAt));
  }

  async generateInviteCodesForUser(userId: string, count: number): Promise<InviteCode[]> {
    const codes: InviteCode[] = [];

    for (let i = 0; i < count; i++) {
      const code = this.generateRandomInviteCode();
      const inviteCodeData: InsertInviteCode = {
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

    // Update user's available invite codes count
    await db
      .update(users)
      .set({
        inviteCodesAvailable: sql`${users.inviteCodesAvailable} + ${count}`
      })
      .where(eq(users.id, userId));

    return codes;
  }

  private generateRandomInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getUserInviteStats(userId: string): Promise<{
    availableCodes: number;
    totalInvitesSent: number;
    successfulInvites: number;
    xpFromInvites: number;
    nextMilestone: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get CREDA from invite-related activities from the main CREDA activities table
    const [inviteXpResult] = await db
      .select({ totalCreda: sum(credaActivities.credaAwarded) })
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.userId, userId),
          or(
            eq(credaActivities.activityType, 'successful_invite'),
            eq(credaActivities.activityType, 'invite_friend'),
            eq(credaActivities.activityType, 'milestone_bonus')
          )
        )
      );

    const xpFromInvites = inviteXpResult?.totalCreda || 0;

    // Calculate next milestone (every 500 CREDA after 5,000 CREDA)
    let nextMilestone = 5000; // Default to the unlock threshold
    if ((user.credaPoints ?? 0) >= 5000) {
      const adjustedCreda = (user.credaPoints ?? 0) - 5000;
      const currentMilestone = Math.floor(adjustedCreda / 500) * 500 + 5000;
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
  async createInviteUsage(data: InsertInviteUsage): Promise<InviteUsage> {
    const [newInviteUsage] = await db
      .insert(inviteUsage)
      .values(data)
      .returning();

    return newInviteUsage;
  }

  async getInviteUsageByUser(userId: string): Promise<InviteUsageWithDetails[]> {
    const results = await db
      .select()
      .from(inviteUsage)
      .innerJoin(inviteCodes, eq(inviteUsage.inviteCodeId, inviteCodes.id))
      .innerJoin(users, eq(inviteUsage.invitedUserId, users.id))
      .leftJoin(inviteRewards, eq(inviteUsage.id, inviteRewards.inviteUsageId))
      .where(eq(inviteUsage.inviterId, userId))
      .orderBy(desc(inviteUsage.createdAt));
    
    return results.map(r => ({
      ...r.invite_usage,
      inviteCode: r.invite_codes,
      invitedUser: r.users,
      reward: r.invite_rewards
    })) as InviteUsageWithDetails[];
  }

  async getInviteChain(userId: string): Promise<UserWithInviteData[]> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.invitedBy, userId));

    return result as UserWithInviteData[];
  }

  async getInviteTree(startUserId: string): Promise<any> {
    // Recursive function to build invite tree
    const buildTree = async (userId: string, depth: number = 0): Promise<any> => {
      if (depth > 5) return null; // Prevent infinite recursion

      const user = await this.getUser(userId);
      if (!user) return null;

      const invitedUsers = await this.getInviteChain(userId);
      const children = await Promise.all(
        invitedUsers.map(invitedUser => buildTree(invitedUser.id, depth + 1))
      );

      return {
        user,
        children: children.filter(child => child !== null),
        depth
      };
    };

    return await buildTree(startUserId);
  }

  // Invite rewards management methods
  async createInviteReward(data: InsertInviteReward): Promise<InviteReward> {
    const [newReward] = await db
      .insert(inviteRewards)
      .values(data)
      .returning();

    return newReward;
  }

  async processInviteReward(inviterId: string, invitedUserId: string, xpAmount: number): Promise<void> {
    // Get the invite usage record
    const [inviteUsageRecord] = await db
      .select()
      .from(inviteUsage)
      .where(and(
        eq(inviteUsage.inviterId, inviterId),
        eq(inviteUsage.invitedUserId, invitedUserId)
      ))
      .orderBy(desc(inviteUsage.createdAt))
      .limit(1);

    if (!inviteUsageRecord) {
      throw new Error("Invite usage record not found");
    }

    // Create reward record
    const rewardData: InsertInviteReward = {
      userId: inviterId,
      inviteUsageId: inviteUsageRecord.id,
      rewardType: "successful_invite",
      credaAmount: xpAmount
    };

    await this.createInviteReward(rewardData);

    // Award CREDA to inviter
    await this.awardCredaPoints(inviterId, 'social', 'successful_invite', xpAmount, 'invite', inviteUsageRecord.id, {
      action: "Successful invite reward",
      invitedUser: invitedUserId
    });

    // Update inviter's invite stats
    await db
      .update(users)
      .set({
        totalInvitesSent: sql`${users.totalInvitesSent} + 1`,
        successfulInvites: sql`${users.successfulInvites} + 1`
      })
      .where(eq(users.id, inviterId));

    // Check for milestone rewards
    await this.checkAndProcessMilestoneRewards(inviterId);

    // Send invite reward notification to the inviter
    try {
      const { NotificationService } = await import('./notifications');

      // Get invited user's information for the notification
      const invitedUser = await this.getUser(invitedUserId);
      const invitedUsername = invitedUser?.username || invitedUser?.twitterHandle || 'Someone';

      await NotificationService.notifyInviteCodeUsed(
        inviterId,
        invitedUsername,
        xpAmount
      );

      console.log(`Invite reward notification sent to user ${inviterId} for inviting ${invitedUserId}`);
    } catch (notificationError) {
      console.error(`Error sending invite reward notification to ${inviterId}:`, notificationError);
    }
  }

  async checkAndProcessMilestoneRewards(userId: string): Promise<InviteReward[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const rewards: InviteReward[] = [];
    const currentCreda = user.credaPoints || 0;
    const lastMilestone = user.lastInviteCredaMilestone || 0;

    // Only process milestones if user has 5,000+ CREDA
    if (currentCreda < 5000) return [];

    // Check for 500 CREDA milestones starting from 5,000 CREDA
    const adjustedCreda = currentCreda - 5000; // Subtract the 5,000 CREDA requirement
    const adjustedLastMilestone = Math.max(0, lastMilestone - 5000);
    const currentMilestone = Math.floor(adjustedCreda / 500) * 500 + 5000;

    if (currentMilestone > lastMilestone && adjustedCreda >= 0) {
      // Generate 3 new invite codes
      const newCodes = await this.generateInviteCodesForUser(userId, 3);

      // Create milestone reward record
      const rewardData: InsertInviteReward = {
        userId,
        inviteUsageId: 0, // Not tied to specific invite usage
        rewardType: "milestone_bonus",
        credaAmount: 0, // No additional CREDA for milestone
        milestone: currentMilestone,
        newCodesGenerated: 3
      };

      const reward = await this.createInviteReward(rewardData);
      rewards.push(reward);

      // Update user's last milestone
      await db
        .update(users)
        .set({
          lastInviteCredaMilestone: currentMilestone
        })
        .where(eq(users.id, userId));

      // Send milestone achievement notification
      try {
        const { NotificationService } = await import('./notifications');

        await NotificationService.createNotification({
          userId,
          type: 'achievement',
          title: 'CREDA Milestone Reached!',
          message: `Congratulations! You reached ${currentMilestone} CREDA and earned 3 new invite codes!`,
          actionUrl: '/invite',
          metadata: {
            milestone: currentMilestone,
            newCodesGenerated: 3,
            achievementType: 'creda_milestone'
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
  async createAdminFlag(data: InsertAdminFlag): Promise<AdminFlag> {
    const [newFlag] = await db
      .insert(adminFlags)
      .values(data)
      .returning();

    return newFlag;
  }

  async getAdminFlags(status?: string): Promise<AdminFlagWithDetails[]> {
    const baseQuery = db
      .select()
      .from(adminFlags)
      .leftJoin(users, eq(adminFlags.targetUserId, users.id))
      .leftJoin(inviteCodes, eq(adminFlags.targetInviteCodeId, inviteCodes.id))
      .orderBy(desc(adminFlags.createdAt));

    const results = status 
      ? await baseQuery.where(eq(adminFlags.status, status))
      : await baseQuery;

    return results.map(r => r.admin_flags) as AdminFlagWithDetails[];
  }

  async updateAdminFlag(flagId: number, updates: Partial<AdminFlag>): Promise<AdminFlag> {
    const [updatedFlag] = await db
      .update(adminFlags)
      .set(updates)
      .where(eq(adminFlags.id, flagId))
      .returning();

    return updatedFlag;
  }

  async detectSuspiciousInviteActivity(): Promise<AdminFlag[]> {
    const flags: AdminFlag[] = [];

    // Detect rapid invite usage (more than 5 invites from same IP in 1 hour)
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
      const flagData: InsertAdminFlag = {
        flagType: "rapid_invite_usage",
        severity: "high",
        description: `Rapid invite usage detected: ${result.usage_count} invites from IP ${result.usage_ip_address} in last hour`,
        metadata: { ipAddress: result.usage_ip_address, count: result.usage_count }
      };

      const flag = await this.createAdminFlag(flagData);
      flags.push(flag);
    }

    // Detect unusual CREDA gains (more than 1000 CREDA in 24 hours)
    const highXpGainQuery = sql`
      SELECT user_id, SUM(creda_awarded) as total_xp
      FROM creda_activities
      WHERE created_at > NOW() - INTERVAL '24 hours'
      GROUP BY user_id
      HAVING SUM(creda_awarded) > 1000
    `;

    const highXpResults = await db.execute(highXpGainQuery);

    for (const result of highXpResults.rows) {
      const flagData: InsertAdminFlag = {
        flagType: "rapid_xp_gain",
        severity: "medium",
        targetUserId: result.user_id as string,
        description: `Unusual CREDA gain detected: ${result.total_xp} CREDA in 24 hours`,
        metadata: { xpGained: result.total_xp, timeframe: "24_hours" }
      };

      const flag = await this.createAdminFlag(flagData);
      flags.push(flag);
    }

    return flags;
  }

  async getInviteAnalytics(): Promise<{
    totalInvites: number;
    activeInviters: number;
    conversionRate: number;
    geographicDistribution: any[];
    suspiciousActivities: number;
  }> {
    // Total invites used
    const [totalInvitesResult] = await db
      .select({ count: count() })
      .from(inviteCodes)
      .where(eq(inviteCodes.isUsed, true));

    // Active inviters (users who have created invite codes)
    const [activeInvitersResult] = await db
      .select({ count: count() })
      .from(inviteCodes)
      .where(isNotNull(inviteCodes.createdBy));

    // Conversion rate (invites used vs created)
    const [totalCreatedResult] = await db
      .select({ count: count() })
      .from(inviteCodes);

    const conversionRate = totalCreatedResult.count > 0
      ? (totalInvitesResult.count / totalCreatedResult.count) * 100
      : 0;

    // Geographic distribution
    const geoDistribution = await db
      .select({
        location: inviteCodes.usageLocation,
        count: count()
      })
      .from(inviteCodes)
      .where(and(
        eq(inviteCodes.isUsed, true),
        isNotNull(inviteCodes.usageLocation)
      ))
      .groupBy(inviteCodes.usageLocation)
      .orderBy(desc(count()));

    // Suspicious activities count
    const [suspiciousResult] = await db
      .select({ count: count() })
      .from(adminFlags)
      .where(eq(adminFlags.status, "pending"));

    return {
      totalInvites: totalInvitesResult.count,
      activeInviters: activeInvitersResult.count,
      conversionRate: Number(conversionRate.toFixed(2)),
      geographicDistribution: geoDistribution,
      suspiciousActivities: suspiciousResult.count
    };
  }

  // Initialize invite system for existing users
  async initializeUserInviteSystem(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    // Check if user already has invite codes
    const existingCodes = await this.getUserInviteCodes(userId);

    // If user has no codes and their invite codes available is 0, give them initial 3 codes
    if (existingCodes.length === 0 && (user.inviteCodesAvailable || 0) === 0) {
      await this.generateInviteCodesForUser(userId, 3);

      // Update user's invite fields if they're null
      await db
        .update(users)
        .set({
          inviteCodesAvailable: 3,
          totalInvitesSent: 0,
          successfulInvites: 0,
          lastInviteXpMilestone: 0
        })
        .where(eq(users.id, userId));
    }
  }

  // DAO operations
  async getAllDaos(): Promise<any[]> {
    // Get basic DAO data with creator information
    const daoList = await db
      .select({
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
        }
      })
      .from(daos)
      .leftJoin(users, eq(daos.createdBy, users.id))
      .orderBy(desc(daos.createdAt));

    // Get counts for each DAO
    const daosWithCounts = await Promise.all(
      daoList.map(async (dao) => {
        // Get governance issues count for this DAO
        const issueCountResult = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(governanceIssues)
          .where(eq(governanceIssues.daoId, dao.id));

        // Get member count for this DAO (distinct followers)
        const followers = await db
          .select()
          .from(userDaoFollows)
          .where(eq(userDaoFollows.daoId, dao.id));

        const memberCount = followers.length;

        return {
          ...dao,
          _count: {
            issues: Number(issueCountResult[0]?.count) || 0,
            userScores: memberCount,
          }
        };
      })
    );

    return daosWithCounts;
  }

  async getDaoBySlug(slug: string): Promise<any | undefined> {
    const [dao] = await db
      .select({
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
          profileType: users.profileType,
        }
      })
      .from(daos)
      .leftJoin(users, eq(daos.createdBy, users.id))
      .where(sql`lower(${daos.slug}) = lower(${slug})`);
    return dao;
  }

  async getDaoById(id: number): Promise<Dao | undefined> {
    const [dao] = await db
      .select()
      .from(daos)
      .where(eq(daos.id, id))
      .limit(1);
    return dao;
  }

  async createDao(daoData: InsertDao): Promise<Dao> {
    const [dao] = await db.insert(daos).values(daoData).returning();
    return dao;
  }

  // Space operations
  async getSpaceBySlug(slug: string): Promise<any | undefined> {
    const [space] = await db
      .select()
      .from(spaces)
      .where(eq(spaces.slug, slug))
      .limit(1);
    return space;
  }

  // Governance Issue operations (replaces thread operations)
  async getGovernanceIssuesByDao(daoId: number, sortBy: string = 'latest'): Promise<GovernanceIssueWithAuthorAndDao[]> {
    const orderBy = sortBy === 'top' ? desc(governanceIssues.upvotes) : desc(governanceIssues.createdAt);

    return await db
      .select()
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id))
      .where(eq(governanceIssues.daoId, daoId))
      .orderBy(orderBy)
      .then(rows =>
        rows.map(row => ({
          ...row.governance_issues,
          author: row.users!,
          dao: row.daos,
          targetProject: row.companies ? { id: row.companies.id, name: row.companies.name, logo: row.companies.logo } : null
        }))
      );
  }

  async getGovernanceIssuesBySpace(spaceSlug: string, limit: number = 10): Promise<any[]> {
    const result = await db
      .select({
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
          grsScore: users.grsScore,
        },
      })
      .from(governanceIssues)
      .innerJoin(spaces, eq(governanceIssues.spaceId, spaces.id))
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .where(eq(spaces.slug, spaceSlug))
      .orderBy(desc(governanceIssues.createdAt))
      .limit(limit);
    
    return result;
  }

  async getActiveGovernanceIssues(): Promise<GovernanceIssueWithAuthorAndDao[]> {
    return await db
      .select({
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
          profileImageUrl: users.profileImageUrl,
        },
        // DAO info
        dao: {
          id: daos.id,
          name: daos.name,
          slug: daos.slug,
          description: daos.description,
          logoUrl: daos.logoUrl,
        },
        // Target project info
        targetProject: {
          id: companies.id,
          name: companies.name,
          logo: companies.logo,
        }
      })
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id))
      .where(and(
        eq(governanceIssues.isActive, true),
        gt(governanceIssues.expiresAt, new Date())
      ))
      .orderBy(desc(governanceIssues.activityScore))
      .then(async rows => {
        // Fetch target user info for each issue
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

  async getActiveStanceCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(governanceIssues)
      .where(and(
        eq(governanceIssues.isActive, true),
        gt(governanceIssues.expiresAt, new Date())
      ));

    return Number(result[0]?.count) || 0;
  }

  async getNextStanceExpirationTime(): Promise<Date | null> {
    const result = await db
      .select({ expiresAt: governanceIssues.expiresAt })
      .from(governanceIssues)
      .where(and(
        eq(governanceIssues.isActive, true),
        gt(governanceIssues.expiresAt, new Date())
      ))
      .orderBy(asc(governanceIssues.expiresAt))
      .limit(1);

    return result[0]?.expiresAt || null;
  }

  async getUserActiveStanceCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(governanceIssues)
      .where(and(
        eq(governanceIssues.authorId, userId),
        eq(governanceIssues.isActive, true),
        gt(governanceIssues.expiresAt, new Date())
      ));

    return Number(result[0]?.count) || 0;
  }

  async hasActiveStanceOnTarget(targetUserId: string): Promise<boolean> {
    try {
      console.log(`Checking for active stances on target: ${targetUserId}`);

      const activeStances = await db
        .select()
        .from(governanceIssues)
        .where(
          and(
            eq(governanceIssues.targetUserId, targetUserId),
            eq(governanceIssues.isActive, true),
            gte(governanceIssues.expiresAt, new Date())
          )
        );

      console.log(`Found ${activeStances.length} active stances on target ${targetUserId}`);
      return activeStances.length > 0;
    } catch (error) {
      console.error("Error checking active stance on target:", error);
      return false; // Allow on error to not block user
    }
  }

  async hasRecentStanceFromTarget(userId: string, targetUserId: string): Promise<boolean> {
    try {
      console.log(`Checking for recent stances from target ${targetUserId} to user ${userId}`);

      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

      const recentStances = await db
        .select()
        .from(governanceIssues)
        .where(
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
      return false; // Allow on error to not block user
    }
  }

  async hasActiveStanceOnProject(targetProjectId: number): Promise<boolean> {
    try {
      console.log(`Checking for active stances on project: ${targetProjectId}`);

      const activeStances = await db
        .select()
        .from(governanceIssues)
        .where(
          and(
            eq(governanceIssues.targetProjectId, targetProjectId),
            eq(governanceIssues.isActive, true),
            gte(governanceIssues.expiresAt, new Date())
          )
        );

      console.log(`Found ${activeStances.length} active stances on project ${targetProjectId}`);
      return activeStances.length > 0;
    } catch (error) {
      console.error("Error checking active stance on project:", error);
      return false; // Allow on error to not block user
    }
  }

  async getRecentGovernanceIssues(): Promise<GovernanceIssueWithAuthorAndDao[]> {
    const rows = await db
      .select()
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id))
      .orderBy(desc(governanceIssues.createdAt));
    
    // Get all stance IDs
    const stanceIds = rows.map(row => row.governance_issues.id);
    
    // Batch fetch all on-chain data in a single query
    const stanceActivities = stanceIds.length > 0 ? await db
      .select()
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.targetType, 'governance_issue'),
          eq(credaActivities.activityType, 'stance_created'),
          inArray(credaActivities.targetId, stanceIds)
        )
      ) : [];
    
    // Create a map for fast lookup
    const ogDataMap = new Map<number, { ogTxHash: string | null; ogRootHash: string | null }>();
    for (const activity of stanceActivities) {
      if (activity.targetId) {
        ogDataMap.set(activity.targetId, {
          ogTxHash: activity.ogTxHash || null,
          ogRootHash: activity.ogRootHash || null
        });
      }
    }
    
    // Map results without additional queries
    return rows.map(row => {
      const ogData = ogDataMap.get(row.governance_issues.id);
      return {
        ...row.governance_issues,
        author: row.users!,
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

  async getGovernanceIssueById(id: number): Promise<GovernanceIssueWithAuthorAndDao | undefined> {
    const rows = await db
      .select()
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .leftJoin(companies, eq(governanceIssues.targetProjectId, companies.id))
      .where(eq(governanceIssues.id, id));

    const row = rows[0];
    if (!row) return undefined;

    return {
      ...row.governance_issues,
      author: row.users!,
      dao: row.daos,
      targetProject: row.companies ? { id: row.companies.id, name: row.companies.name, logo: row.companies.logo } : null
    };
  }

  async createGovernanceIssue(issueData: InsertGovernanceIssue): Promise<GovernanceIssue> {
    // GOVERNANCE ISSUE DURATION: ALWAYS EXACTLY 48 HOURS - NO EXCEPTIONS
    const GOVERNANCE_ISSUE_DURATION_HOURS = 48;
    const GOVERNANCE_ISSUE_DURATION_MS = GOVERNANCE_ISSUE_DURATION_HOURS * 60 * 60 * 1000; // 48 hours in milliseconds

    // Use precise calculation to ensure exactly 48 hours
    const now = new Date();
    const expiresAt = new Date(now.getTime() + GOVERNANCE_ISSUE_DURATION_MS);

    // Validation: Ensure the duration is exactly 48 hours
    const actualDurationMs = expiresAt.getTime() - now.getTime();
    const actualDurationHours = actualDurationMs / (1000 * 60 * 60);

    if (Math.abs(actualDurationHours - GOVERNANCE_ISSUE_DURATION_HOURS) > 0.001) {
      console.error(`⚠️ GOVERNANCE ISSUE DURATION ERROR: Expected exactly ${GOVERNANCE_ISSUE_DURATION_HOURS} hours, got ${actualDurationHours.toFixed(6)} hours`);
    }

    console.log(`✅ Creating governance issue with EXACTLY ${GOVERNANCE_ISSUE_DURATION_HOURS}-hour duration`);
    console.log(`📊 Precise duration: ${actualDurationHours.toFixed(6)} hours | Expires: ${expiresAt.toISOString()}`)

    // If targetUsername is provided, check if user exists or create them
    let targetUserId = issueData.targetUserId;
    if (issueData.targetUsername && !targetUserId) {
      // Check if user exists by username or twitterHandle
      const existingUser = await db
        .select()
        .from(users)
        .where(or(
          eq(users.username, issueData.targetUsername),
          eq(users.twitterHandle, issueData.targetUsername)
        ))
        .limit(1);

      if (existingUser.length > 0) {
        targetUserId = existingUser[0].id;
      } else {
        // Create unclaimed profile using the proper method
        const createdBy = issueData.authorId;
        const newUser = await this.createUnclaimedProfile({
          twitterHandle: issueData.targetUsername,
          twitterUrl: `https://x.com/${issueData.targetUsername}`,
          createdBy: createdBy
        });

        targetUserId = newUser.id;
      }
    }

    const [issue] = await db.insert(governanceIssues).values({
      title: issueData.title,
      content: issueData.content,
      proposalLink: issueData.proposalLink,
      authorId: issueData.authorId,
      daoId: issueData.daoId,
      spaceId: issueData.spaceId,
      stance: issueData.stance,
      targetUserId,
      targetUsername: issueData.targetUsername,
      targetProjectId: issueData.targetProjectId,
      targetProjectName: issueData.targetProjectName,
      expiresAt
    }).returning();

    return issue;
  }

  async getUserGovernanceIssues(userId: string): Promise<GovernanceIssueWithAuthorAndDao[]> {
    return await db
      .select()
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .where(eq(governanceIssues.authorId, userId))
      .orderBy(desc(governanceIssues.createdAt))
      .then(rows =>
        rows.map(row => ({
          ...row.governance_issues,
          author: row.users!,
          dao: row.daos
        }))
      );
  }

  async expireGovernanceIssue(issueId: number): Promise<void> {
    await db
      .update(governanceIssues)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(governanceIssues.id, issueId));
  }

  // Comment operations (updated for governance issues)
  async getCommentsByIssue(issueId: number): Promise<CommentWithAuthor[]> {
    return await db
      .select()
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.issueId, issueId))
      .orderBy(desc(comments.createdAt))
      .then(rows =>
        rows.map(row => ({
          ...row.comments,
          author: row.users!
        }))
      );
  }

  async createComment(commentData: InsertComment): Promise<Comment> {
    // Check if this is early participation (within first 24 hours)
    const issue = await db
      .select({ createdAt: governanceIssues.createdAt })
      .from(governanceIssues)
      .where(eq(governanceIssues.id, commentData.issueId))
      .limit(1);

    const isEarlyParticipant = issue[0] && issue[0].createdAt ?
      (new Date().getTime() - new Date(issue[0].createdAt).getTime()) < 24 * 60 * 60 * 1000 :
      false;

    const [comment] = await db.insert(comments).values({
      content: commentData.content,
      authorId: commentData.authorId,
      issueId: commentData.issueId,
      parentCommentId: commentData.parentCommentId,
      stance: commentData.stance,
      isEarlyParticipant
    }).returning();

    // Update governance issue comment count and activity score
    await db
      .update(governanceIssues)
      .set({
        commentCount: sql`${governanceIssues.commentCount} + 1`,
        activityScore: sql`${governanceIssues.activityScore} + ${isEarlyParticipant ? 3 : 2}`,
        lastActivityAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(governanceIssues.id, commentData.issueId));

    return comment;
  }

  async getCommentById(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  }

  async getUserComments(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(comments)
      .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
      .where(eq(comments.authorId, userId))
      .orderBy(desc(comments.createdAt))
      .then(rows =>
        rows.map(row => ({
          ...row.comments,
          issue: row.governance_issues
        }))
      );
  }

  // Vote operations (updated for governance issues)
  async getUserVote(userId: string, targetType: string, targetId: number): Promise<Vote | undefined> {
    const [vote] = await db
      .select({
        id: votes.id,
        userId: votes.userId,
        targetType: votes.targetType,
        targetId: votes.targetId,
        voteType: votes.voteType,
        createdAt: votes.createdAt,
      })
      .from(votes)
      .where(
        and(
          eq(votes.userId, userId),
          eq(votes.targetType, targetType),
          eq(votes.targetId, targetId)
        )
      );
    return vote as Vote | undefined;
  }

  async getUserVotesForReviews(userId: string, reviewIds: number[]): Promise<Record<number, Vote>> {
    if (reviewIds.length === 0) return {};
    
    const userVotes = await db
      .select({
        id: votes.id,
        userId: votes.userId,
        targetType: votes.targetType,
        targetId: votes.targetId,
        voteType: votes.voteType,
        createdAt: votes.createdAt,
      })
      .from(votes)
      .where(
        and(
          eq(votes.userId, userId),
          eq(votes.targetType, 'review'),
          inArray(votes.targetId, reviewIds)
        )
      );
    
    const result: Record<number, Vote> = {};
    for (const vote of userVotes) {
      result[vote.targetId] = vote as Vote;
    }
    return result;
  }

  async createVote(voteData: InsertVote): Promise<Vote> {
    // Only insert columns that exist in the database (exclude zgMerkleHash, zgStoredAt)
    const [vote] = await db.insert(votes).values({
      userId: voteData.userId,
      targetType: voteData.targetType,
      targetId: voteData.targetId,
      voteType: voteData.voteType,
    }).returning({
      id: votes.id,
      userId: votes.userId,
      targetType: votes.targetType,
      targetId: votes.targetId,
      voteType: votes.voteType,
      createdAt: votes.createdAt,
    });

    // Update vote counts after creating vote
    await this.updateVoteCounts(voteData.targetType, voteData.targetId);

    return vote as Vote;
  }

  async updateVote(userId: string, targetType: string, targetId: number, voteType: string): Promise<Vote> {
    const [vote] = await db
      .update(votes)
      .set({ voteType })
      .where(
        and(
          eq(votes.userId, userId),
          eq(votes.targetType, targetType),
          eq(votes.targetId, targetId)
        )
      )
      .returning({
        id: votes.id,
        userId: votes.userId,
        targetType: votes.targetType,
        targetId: votes.targetId,
        voteType: votes.voteType,
        createdAt: votes.createdAt,
      });

    // Update vote counts after updating vote
    await this.updateVoteCounts(targetType, targetId);

    return vote as Vote;
  }

  async deleteVote(userId: string, targetType: string, targetId: number): Promise<void> {
    await db
      .delete(votes)
      .where(
        and(
          eq(votes.userId, userId),
          eq(votes.targetType, targetType),
          eq(votes.targetId, targetId)
        )
      );

    // Update vote counts after deleting vote
    await this.updateVoteCounts(targetType, targetId);
  }

  async updateVoteCounts(targetType: string, targetId: number): Promise<void> {
    if (targetType === 'issue') {
      // Count upvotes and downvotes for this issue
      const [upvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'issue'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'upvote')
        ));

      const [downvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'issue'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'downvote')
        ));

      await db
        .update(governanceIssues)
        .set({
          upvotes: upvoteCount.count,
          downvotes: downvoteCount.count,
          activityScore: sql`${governanceIssues.activityScore} + 1`,
          updatedAt: new Date()
        })
        .where(eq(governanceIssues.id, targetId));
    } else if (targetType === 'comment') {
      // Count upvotes and downvotes for this comment
      const [upvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'comment'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'upvote')
        ));

      const [downvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'comment'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'downvote')
        ));

      await db
        .update(comments)
        .set({
          upvotes: upvoteCount.count,
          downvotes: downvoteCount.count,
          updatedAt: new Date()
        })
        .where(eq(comments.id, targetId));
    } else if (targetType === 'review') {
      // Count upvotes and downvotes for this review
      const [upvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'review'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'upvote')
        ));

      const [downvoteCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .where(and(
          eq(votes.targetType, 'review'),
          eq(votes.targetId, targetId),
          eq(votes.voteType, 'downvote')
        ));

      await db
        .update(reviews)
        .set({
          upvotes: upvoteCount.count,
          downvotes: downvoteCount.count,
          updatedAt: new Date()
        })
        .where(eq(reviews.id, targetId));
    }
  }

  // Stance voting operations
  async getUserStanceVote(userId: string, stanceId: number): Promise<StanceVote | undefined> {
    const [vote] = await db
      .select()
      .from(stanceVotes)
      .where(
        and(
          eq(stanceVotes.userId, userId),
          eq(stanceVotes.stanceId, stanceId)
        )
      );
    return vote;
  }

  async createStanceVote(voteData: InsertStanceVote): Promise<StanceVote> {
    const [vote] = await db.insert(stanceVotes).values(voteData).returning();

    // Update stance vote counts after creating vote
    await this.updateStanceVoteCounts(voteData.stanceId);

    return vote;
  }

  async updateStanceVote(userId: string, stanceId: number, voteType: string): Promise<StanceVote> {
    const [vote] = await db
      .update(stanceVotes)
      .set({ voteType, createdAt: new Date() })
      .where(and(
        eq(stanceVotes.userId, userId),
        eq(stanceVotes.stanceId, stanceId)
      ))
      .returning();

    // Update stance vote counts after updating vote
    await this.updateStanceVoteCounts(stanceId);

    return vote;
  }

  async deleteStanceVote(userId: string, stanceId: number): Promise<void> {
    await db
      .delete(stanceVotes)
      .where(and(
        eq(stanceVotes.userId, userId),
        eq(stanceVotes.stanceId, stanceId)
      ));

    // Update stance vote counts after deleting vote
    await this.updateStanceVoteCounts(stanceId);
  }

  async updateStanceVoteCounts(stanceId: number): Promise<void> {
    // Count champion votes
    const [championCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(stanceVotes)
      .where(and(
        eq(stanceVotes.stanceId, stanceId),
        eq(stanceVotes.voteType, 'champion')
      ));

    // Count challenge votes
    const [challengeCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(stanceVotes)
      .where(and(
        eq(stanceVotes.stanceId, stanceId),
        eq(stanceVotes.voteType, 'challenge')
      ));

    // Count oppose votes
    const [opposeCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(stanceVotes)
      .where(and(
        eq(stanceVotes.stanceId, stanceId),
        eq(stanceVotes.voteType, 'oppose')
      ));

    await db
      .update(governanceIssues)
      .set({
        championVotes: championCount.count,
        challengeVotes: challengeCount.count,
        opposeVotes: opposeCount.count,
        activityScore: sql`${governanceIssues.activityScore} + 1`,
        updatedAt: new Date()
      })
      .where(eq(governanceIssues.id, stanceId));
  }

  async getStanceVoteCounts(stanceId: number): Promise<{ championVotes: number; challengeVotes: number; opposeVotes: number }> {
    const issue = await this.getGovernanceIssueById(stanceId);
    return {
      championVotes: issue?.championVotes || 0,
      challengeVotes: issue?.challengeVotes || 0,
      opposeVotes: issue?.opposeVotes || 0
    };
  }

  async getStanceVoters(stanceId: number): Promise<any[]> {
    return await db
      .select({
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
      })
      .from(stanceVotes)
      .leftJoin(users, eq(stanceVotes.userId, users.id))
      .where(eq(stanceVotes.stanceId, stanceId))
      .orderBy(desc(stanceVotes.createdAt));
  }

  async getUserStanceVotes(userId: string): Promise<StanceVote[]> {
    return await db
      .select()
      .from(stanceVotes)
      .where(eq(stanceVotes.userId, userId))
      .orderBy(desc(stanceVotes.createdAt));
  }

  // Space voting operations
  async getUserSpaceVote(userId: string, spaceId: number): Promise<SpaceVote | undefined> {
    const [vote] = await db
      .select()
      .from(spaceVotes)
      .where(
        and(
          eq(spaceVotes.userId, userId),
          eq(spaceVotes.spaceId, spaceId)
        )
      );
    return vote;
  }

  async createSpaceVote(voteData: InsertSpaceVote): Promise<SpaceVote> {
    const [vote] = await db.insert(spaceVotes).values(voteData).returning();

    // Update space vote counts after creating vote
    await this.updateSpaceVoteCounts(voteData.spaceId);

    return vote;
  }

  async updateSpaceVote(userId: string, spaceId: number, voteType: string, comment?: string): Promise<SpaceVote> {
    const [vote] = await db
      .update(spaceVotes)
      .set({ 
        voteType, 
        comment: comment || null,
        updatedAt: new Date() 
      })
      .where(and(
        eq(spaceVotes.userId, userId),
        eq(spaceVotes.spaceId, spaceId)
      ))
      .returning();

    // Update space vote counts after updating vote
    await this.updateSpaceVoteCounts(spaceId);

    return vote;
  }

  async updateSpaceVoteCounts(spaceId: number): Promise<void> {
    // Count bullish votes
    const [bullishCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(spaceVotes)
      .where(and(
        eq(spaceVotes.spaceId, spaceId),
        eq(spaceVotes.voteType, 'bullish')
      ));

    // Count bearish votes
    const [bearishCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(spaceVotes)
      .where(and(
        eq(spaceVotes.spaceId, spaceId),
        eq(spaceVotes.voteType, 'bearish')
      ));

    const totalVotes = (bullishCount.count || 0) + (bearishCount.count || 0);

    await db
      .update(spaces)
      .set({
        bullishVotes: bullishCount.count || 0,
        bearishVotes: bearishCount.count || 0,
        totalVotes: totalVotes,
        updatedAt: new Date()
      })
      .where(eq(spaces.id, spaceId));
  }

  async getRecentSpaceVoteComments(limit: number = 20): Promise<any[]> {
    const votes = await db
      .select({
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
      })
      .from(spaceVotes)
      .innerJoin(users, eq(spaceVotes.userId, users.id))
      .innerJoin(spaces, eq(spaceVotes.spaceId, spaces.id))
      .where(isNotNull(spaceVotes.comment))
      .orderBy(desc(spaceVotes.createdAt))
      .limit(limit);

    return votes;
  }

  // Score operations
  async updateUserScore(userId: string, daoId: number, points: number): Promise<void> {
    // Update user's total score
    await db
      .update(users)
      .set({
        credaPoints: sql`${users.credaPoints} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Update or create user's DAO-specific score
    await db
      .insert(userDaoScores)
      .values({
        userId,
        daoId,
        score: points
      })
      .onConflictDoUpdate({
        target: [userDaoScores.userId, userDaoScores.daoId],
        set: {
          score: sql`${userDaoScores.score} + ${points}`,
          updatedAt: new Date()
        }
      });

    // Update GRS score after scoring change
    await this.updateUserGrsScore(userId);
  }

  async getGlobalLeaderboard(): Promise<any[]> {
    return await db
      .select({
        id: users.id,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        credaPoints: users.credaPoints
      })
      .from(users)
      .where(isNotNull(users.username))
      .orderBy(desc(users.credaPoints))
      .limit(10);
  }

  async getDaoLeaderboard(daoId: number): Promise<any[]> {
    return await db
      .select({
        id: users.id,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        daoScore: userDaoScores.score
      })
      .from(userDaoScores)
      .leftJoin(users, eq(userDaoScores.userId, users.id))
      .where(eq(userDaoScores.daoId, daoId))
      .orderBy(desc(userDaoScores.score))
      .limit(10);
  }

  // Stats operations
  async getGlobalStats(): Promise<any> {
    // Get counts separately to avoid Cartesian product issues
    const [daoCount] = await db.select({ count: sql<number>`count(*)` }).from(daos);
    const [issueCount] = await db.select({ count: sql<number>`count(*)` }).from(governanceIssues);
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [xpSum] = await db.select({ sum: sql<number>`coalesce(sum(${users.credaPoints}), 0)` }).from(users);

    return {
      totalDaos: daoCount?.count || 0,
      totalIssues: issueCount?.count || 0,
      totalUsers: userCount?.count || 0,
      totalCredaPoints: xpSum?.sum || 0
    };
  }



  // Follow operations
  async getUserFollowingStatus(userId: string, daoId: number): Promise<UserDaoFollow | undefined> {
    const [follow] = await db
      .select()
      .from(userDaoFollows)
      .where(and(
        eq(userDaoFollows.userId, userId),
        eq(userDaoFollows.daoId, daoId)
      ));
    return follow;
  }

  async followDao(userId: string, daoId: number): Promise<UserDaoFollow> {
    const [follow] = await db
      .insert(userDaoFollows)
      .values({ userId, daoId })
      .returning();

    return follow;
  }

  async unfollowDao(userId: string, daoId: number): Promise<void> {
    await db
      .delete(userDaoFollows)
      .where(and(
        eq(userDaoFollows.userId, userId),
        eq(userDaoFollows.daoId, daoId)
      ));
  }

  async getUserFollowedDaos(userId: string): Promise<Dao[]> {
    return await db
      .select({
        id: daos.id,
        name: daos.name,
        slug: daos.slug,
        description: daos.description,
        logoUrl: daos.logoUrl,
        createdBy: daos.createdBy,
        createdAt: daos.createdAt,
        updatedAt: daos.updatedAt
      })
      .from(userDaoFollows)
      .innerJoin(daos, eq(userDaoFollows.daoId, daos.id))
      .where(eq(userDaoFollows.userId, userId))
      .orderBy(desc(userDaoFollows.createdAt));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getAllUserScores(): Promise<any[]> {
    return await db
      .select({
        userId: userDaoScores.userId,
        daoId: userDaoScores.daoId,
        score: userDaoScores.score,
        username: users.username,
        daoName: daos.name,
        userCredaPoints: users.credaPoints,
        createdAt: userDaoScores.createdAt,
        updatedAt: userDaoScores.updatedAt
      })
      .from(userDaoScores)
      .innerJoin(users, eq(userDaoScores.userId, users.id))
      .innerJoin(daos, eq(userDaoScores.daoId, daos.id))
      .orderBy(desc(userDaoScores.updatedAt));
  }

  async updateUserCredaPoints(userId: string, newCredaPoints: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credaPoints: newCredaPoints, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserDaoScore(userId: string, daoId: number, newScore: number): Promise<void> {
    await db
      .update(userDaoScores)
      .set({ score: newScore, updatedAt: new Date() })
      .where(and(
        eq(userDaoScores.userId, userId),
        eq(userDaoScores.daoId, daoId)
      ));
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete related data first
    await db.delete(userDaoScores).where(eq(userDaoScores.userId, userId));
    await db.delete(userDaoFollows).where(eq(userDaoFollows.userId, userId));
    await db.delete(votes).where(eq(votes.userId, userId));
    await db.delete(comments).where(eq(comments.authorId, userId));
    await db.delete(governanceIssues).where(eq(governanceIssues.authorId, userId));
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async updateDao(daoId: number, updates: Partial<Dao>): Promise<void> {
    await db
      .update(daos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(daos.id, daoId));
  }

  async deleteDao(daoId: number): Promise<void> {
    // Delete related data first
    await db.delete(userDaoScores).where(eq(userDaoScores.daoId, daoId));
    await db.delete(userDaoFollows).where(eq(userDaoFollows.daoId, daoId));
    await db.delete(comments).where(eq(comments.issueId,
      db.select({ id: governanceIssues.id }).from(governanceIssues).where(eq(governanceIssues.daoId, daoId))
    ));
    await db.delete(governanceIssues).where(eq(governanceIssues.daoId, daoId));
    // Finally delete the DAO
    await db.delete(daos).where(eq(daos.id, daoId));
  }

  async deleteGovernanceIssue(issueId: number): Promise<void> {
    // Delete related data first
    await db.delete(comments).where(eq(comments.issueId, issueId));
    await db.delete(votes).where(and(
      eq(votes.targetType, 'issue'),
      eq(votes.targetId, issueId)
    ));
    // Finally delete the governance issue
    await db.delete(governanceIssues).where(eq(governanceIssues.id, issueId));
  }

  async deleteComment(commentId: number): Promise<void> {
    // Delete related votes first
    await db.delete(votes).where(and(
      eq(votes.targetType, 'comment'),
      eq(votes.targetId, commentId)
    ));
    // Finally delete the comment
    await db.delete(comments).where(eq(comments.id, commentId));
  }

  async getDetailedUserStats(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const userGovernanceIssues = await this.getUserGovernanceIssues(userId);
    const userComments = await this.getUserComments(userId);

    const daoScores = await db
      .select({
        daoId: userDaoScores.daoId,
        score: userDaoScores.score,
        daoName: daos.name
      })
      .from(userDaoScores)
      .innerJoin(daos, eq(userDaoScores.daoId, daos.id))
      .where(eq(userDaoScores.userId, userId));

    const totalVotes = await db
      .select({ count: sql<number>`count(*)` })
      .from(votes)
      .where(eq(votes.userId, userId));

    return {
      user,
      issueCount: userGovernanceIssues.length,
      commentCount: userComments.length,
      daoScores,
      totalVotes: totalVotes[0]?.count || 0
    };
  }

  async getAdminStats(): Promise<any> {
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalDaos = await db.select({ count: sql<number>`count(*)` }).from(daos);
    const totalIssues = await db.select({ count: sql<number>`count(*)` }).from(governanceIssues);
    const totalComments = await db.select({ count: sql<number>`count(*)` }).from(comments);
    const totalVotes = await db.select({ count: sql<number>`count(*)` }).from(votes);

    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);

    const recentIssues = await db
      .select({
        id: governanceIssues.id,
        title: governanceIssues.title,
        createdAt: governanceIssues.createdAt,
        authorId: governanceIssues.authorId,
        username: users.username,
        daoName: daos.name
      })
      .from(governanceIssues)
      .innerJoin(users, eq(governanceIssues.authorId, users.id))
      .innerJoin(daos, eq(governanceIssues.daoId, daos.id))
      .orderBy(desc(governanceIssues.createdAt))
      .limit(10);

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
  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
    return user;
  }

  async createReferral(referrerId: string, referredId: string, referralCode: string): Promise<Referral> {
    const [referral] = await db.insert(referrals).values({
      referrerId,
      referredId,
      referralCode,
      pointsAwarded: 3
    }).returning();
    return referral;
  }

  async getUserReferralStats(userId: string): Promise<any> {
    const totalReferrals = await db
      .select({ count: sql<number>`count(*)` })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const totalPointsEarned = await db
      .select({ total: sql<number>`sum(${referrals.pointsAwarded})` })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const recentReferrals = await db
      .select({
        id: referrals.id,
        referredUsername: users.username,
        pointsAwarded: referrals.pointsAwarded,
        createdAt: referrals.createdAt
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt))
      .limit(10);

    return {
      totalReferrals: totalReferrals[0]?.count || 0,
      totalPointsEarned: totalPointsEarned[0]?.total || 0,
      recentReferrals
    };
  }

  async getReferralLeaderboard(): Promise<any[]> {
    return await db
      .select({
        id: users.id,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        totalReferrals: sql<number>`COUNT(${referrals.id})`
      })
      .from(users)
      .leftJoin(referrals, eq(users.id, referrals.referrerId))
      .groupBy(users.id, users.username, users.profileImageUrl)
      .orderBy(desc(sql<number>`COUNT(${referrals.id})`))
      .limit(10);
  }

  async getGovernorsLeaderboard(): Promise<any[]>{
    // Return dummy data for now - replace with real data when more users are active
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
  async calculateGrsScore(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user) return 1300; // Start at average (1300/2800)

    // Get user's current stored GRS score (from GRS events)
    const currentStoredScore = user.grsScore || 1300;

    // Get user's total activity metrics
    const credaPoints = user.credaPoints || 0;
    const userIssues = await this.getUserGovernanceIssues(userId);
    const userComments = await this.getUserComments(userId);
    const userVotes = await db
      .select({ count: sql<number>`count(*)` }).from(votes)
      .where(eq(votes.userId, userId));

    // Get sum of all GRS events for this user
    const grsEventsSum = await db
      .select({ total: sql<number>`COALESCE(SUM(change_amount), 0)` })
      .from(grsEvents)
      .where(eq(grsEvents.userId, userId));

    const totalGrsEvents = grsEventsSum[0]?.total || 0;

    // Calculate AI-powered governance factors
    const governanceActivity = userIssues.length * 25 + userComments.length * 15 + (userVotes[0]?.count || 0) * 5;
    const reputationWeight = Math.min(credaPoints / 30, 20); // More impactful reputation scaling

    // Calculate days since user creation for decay system
    const accountAge = user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const recentActivity = accountAge > 0 ? Math.max(0, 30 - accountAge) / 30 : 1; // Decay over 30 days of inactivity

    // AI Governance Score Algorithm (0-2800 scale)
    const baseScore = 1300; // Average starting point (middle of 0-2800)
    const maxScore = 2800;
    const minScore = 0;

    // For new users with minimal activity, start at base score
    if (governanceActivity === 0 && (userVotes[0]?.count || 0) === 0 && accountAge < 1) {
      let newUserScore = baseScore + totalGrsEvents;
      return Math.round(Math.max(minScore, Math.min(maxScore, newUserScore)));
    }

    // Advanced AI scoring factors (reduced multipliers to prevent inflation)
    const activityBonus = Math.min(governanceActivity * 1.5, 300); // Reduced from 3x to 1.5x, max 300
    const reputationBonus = Math.min(reputationWeight * 10, 200); // Reduced from 25x to 10x, max 200
    const consistencyBonus = recentActivity * 100; // Reduced from 200 to 100

    // Start with base score and add bonuses
    let calculatedScore = baseScore + activityBonus + reputationBonus + consistencyBonus;

    // Add GRS events (reviews, stance outcomes, etc.)
    calculatedScore += totalGrsEvents;

    // Apply AI-powered decay for inactive users
    if (accountAge > 7 && governanceActivity === 0) {
      const decayFactor = Math.min(accountAge / 30, 1); // Decay over 30 days
      calculatedScore = calculatedScore * (1 - decayFactor * 0.2); // Up to 20% decay
    }

    // Remove random variance for consistency
    // const aiVariance = (Math.random() - 0.5) * 30;
    // calculatedScore += aiVariance;

    // Ensure score stays within bounds
    const finalScore = Math.round(Math.max(minScore, Math.min(maxScore, calculatedScore)));

    return finalScore;
  }

  async updateUserGrsScore(userId: string): Promise<void> {
    const grsScore = await this.calculateGrsScore(userId);
    const percentile = await this.calculateUserPercentile(userId, grsScore);

    await db
      .update(users)
      .set({
        grsScore: grsScore,
        grsPercentile: percentile,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  private async calculateUserPercentile(userId: string, userScore: number): Promise<number> {
    // Get count of users with lower scores
    const lowerScoreCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(lt(users.grsScore, userScore));

    // Get total user count
    const totalUserCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const total = totalUserCount[0]?.count || 1;
    const lower = lowerScoreCount[0]?.count || 0;

    // Calculate percentile (0-100)
    const percentile = Math.round((lower / total) * 100);
    return Math.max(0, Math.min(100, percentile));
  }

  async recalculateAllGrsScores(): Promise<void> {
    // Get all users
    const allUsers = await db.select().from(users);

    // Update each user's GRS score
    for (const user of allUsers) {
      await this.updateUserGrsScore(user.id);
    }
  }

  async getGrsRanking(userId: string): Promise<{ score: number; percentile: number; rank: number; total: number }> {
    const user = await this.getUser(userId);
    if (!user) {
      return { score: 500, percentile: 50, rank: 1, total: 1 };
    }

    // Get user's current AI GRS score
    const grsScore = user.grsScore || 500;

    // Get user's rank based on CREDA points (count of users with higher CREDA + 1)
    const userCredaPoints = user.credaPoints || 0;
    const higherXpCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gt(users.credaPoints, userCredaPoints));

    const rank = (higherXpCount[0]?.count || 0) + 1;

    // Get total user count
    const totalUserCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const total = totalUserCount[0]?.count || 1;
    const percentile = user.grsPercentile || 0;

    return {
      score: grsScore,
      percentile: percentile,
      rank: rank, // This rank is now based on CREDA points
      total: total
    };
  }

  async getBatchGrsScores(userIds: string[]): Promise<Map<string, { score: number; percentile: number }>> {
    if (userIds.length === 0) {
      return new Map();
    }

    const userScores = await db
      .select({
        id: users.id,
        grsScore: users.grsScore,
        grsPercentile: users.grsPercentile,
      })
      .from(users)
      .where(inArray(users.id, userIds));

    const scoreMap = new Map<string, { score: number; percentile: number }>();
    for (const user of userScores) {
      scoreMap.set(user.id, {
        score: user.grsScore || 1300,
        percentile: user.grsPercentile || 50,
      });
    }

    // Add defaults for missing users
    for (const userId of userIds) {
      if (!scoreMap.has(userId)) {
        scoreMap.set(userId, { score: 1300, percentile: 50 });
      }
    }

    return scoreMap;
  }

  async getBatchHasReviewed(reviewerId: string, targetUserIds: string[]): Promise<Map<string, boolean>> {
    if (targetUserIds.length === 0) {
      return new Map();
    }

    const existingReviews = await db
      .select({
        reviewedId: reviews.reviewedId,
      })
      .from(reviews)
      .where(
        and(
          eq(reviews.reviewerId, reviewerId),
          inArray(reviews.reviewedId, targetUserIds)
        )
      );

    const reviewedSet = new Set(existingReviews.map(r => r.reviewedId));
    const resultMap = new Map<string, boolean>();

    for (const targetId of targetUserIds) {
      resultMap.set(targetId, reviewedSet.has(targetId));
    }

    return resultMap;
  }

  async getAllInviteCodes(): Promise<any[]> {
    const codes = await db
      .select({
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
      })
      .from(inviteCodes)
      .leftJoin(users, eq(inviteCodes.usedBy, users.id))
      .where(eq(inviteCodes.codeType, "admin"))
      .orderBy(desc(inviteCodes.createdAt));

    return codes.map(code => ({
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

  async generateInviteCodes(count: number): Promise<any[]> {
    const newCodes = [];

    for (let i = 0; i < count; i++) {
      const code = [
        Math.random().toString(36).substring(2, 6).toUpperCase(),
        Math.random().toString(36).substring(2, 6).toUpperCase(),
        Math.random().toString(36).substring(2, 6).toUpperCase(),
        Math.random().toString(36).substring(2, 6).toUpperCase()
      ].join('-');

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
  async submitInviteCode(userId: string, code: string): Promise<InviteSubmission> {
    const [submission] = await db.insert(inviteSubmissions).values({
      userId,
      inviteCode: code,
      status: 'pending'
    }).returning();
    return submission;
  }

  async getUserInviteSubmission(userId: string): Promise<InviteSubmission | undefined> {
    const [submission] = await db.select().from(inviteSubmissions).where(eq(inviteSubmissions.userId, userId));
    return submission;
  }



  async updateDailyStreak(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let newStreak = user.dailyStreak || 0;

    if (!lastActive) {
      // First time active
      newStreak = 1;
    } else if (lastActive.getTime() === today.getTime()) {
      // Already active today, no change
      return;
    } else if (lastActive.getTime() === today.getTime() - (24 * 60 * 60 * 1000)) {
      // Active yesterday, continue streak
      newStreak = (user.dailyStreak || 0) + 1;
    } else {
      // Gap in activity, reset streak
      newStreak = 1;
    }

    await db
      .update(users)
      .set({
        dailyStreak: newStreak,
        lastActiveDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Award streak bonus CREDA based on DAO AI CREDA POINTS SYSTEM
    if (newStreak >= 3) {
      let bonusCreda = 0;
      if (newStreak === 3) bonusCreda = DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_3_DAYS;
      else if (newStreak === 7) bonusCreda = DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_7_DAYS;
      else if (newStreak === 14) bonusCreda = DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_14_DAYS;
      else if (newStreak === 30) bonusCreda = DatabaseStorage.CREDA_REWARDS.DAILY_STREAK_30_DAYS;

      if (bonusCreda > 0) {
        await this.awardCredaPoints(userId, 'special', 'daily_streak', bonusCreda, 'streak', newStreak, { streakDays: newStreak });
      }
    }
  }

  async resetWeeklyCreda(): Promise<void> {
    await db
      .update(users)
      .set({
        weeklyCreda: 0,
        lastCredaWeekReset: new Date(),
        updatedAt: new Date()
      });
  }

  async getCredaLeaderboard(timeframe: 'overall' | 'weekly' = 'overall', limit: number = 50, daoId?: number): Promise<any[]> {
    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    let baseQuery = db
      .select({
        id: users.id,
        username: users.username,
        profileImageUrl: users.profileImageUrl,
        credaPoints: users.credaPoints,
        weeklyCreda: users.weeklyCreda,
        dailyStreak: users.dailyStreak,
        grsScore: users.grsScore,
        grsPercentile: users.grsPercentile,
      })
      .from(users);

    // Add DAO filtering if specified
    if (daoId) {
      baseQuery = baseQuery
        .innerJoin(userDaoScores, eq(users.id, userDaoScores.userId))
        .where(eq(userDaoScores.daoId, daoId));
    } else {
      // Show all users with usernames (claimed profiles)
      baseQuery = baseQuery.where(isNotNull(users.username));
    }

    // Get current week CREDA for each user
    const currentWeekXpQuery = db
      .select({
        userId: credaActivities.userId,
        weeklyCreda: sql<number>`COALESCE(sum(${credaActivities.credaAwarded}), 0)`.as('weeklyCreda')
      })
      .from(credaActivities)
      .where(gte(credaActivities.createdAt, oneWeekAgo))
      .groupBy(credaActivities.userId);

    // Get last week CREDA for each user
    const lastWeekXpQuery = db
      .select({
        userId: credaActivities.userId,
        lastWeekXp: sql<number>`COALESCE(sum(${credaActivities.credaAwarded}), 0)`.as('lastWeekXp')
      })
      .from(credaActivities)
      .where(and(
        gte(credaActivities.createdAt, twoWeeksAgo),
        lt(credaActivities.createdAt, oneWeekAgo)
      ))
      .groupBy(credaActivities.userId);

    // Execute base query
    const leaderboard = await baseQuery
      .orderBy(timeframe === 'overall' ? desc(users.credaPoints) : desc(users.weeklyCreda))
      .limit(limit);

    // Get CREDA data for all users in parallel
    const [
      currentWeekData,
      lastWeekData
    ] = await Promise.all([
      currentWeekXpQuery,
      lastWeekXpQuery
    ]);

    // Create lookup maps
    const currentWeekMap = new Map(currentWeekData.map(d => [d.userId, Number(d.weeklyCreda)]));
    const lastWeekMap = new Map(lastWeekData.map(d => [d.userId, Number(d.lastWeekXp)]));

    // Combine data and calculate weekly change
    return leaderboard.map((user, index) => {
      const thisWeekXp = currentWeekMap.get(user.id) || 0;
      const lastWeekXp = lastWeekMap.get(user.id) || 0;
      const weeklyChange = thisWeekXp - lastWeekXp;

      return {
        id: user.id,
        rank: index + 1,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        credaPoints: user.credaPoints || 0,
        weeklyCreda: thisWeekXp,
        lastWeekXp: lastWeekXp,
        weeklyChange: weeklyChange,
        dailyStreak: user.dailyStreak || 0,
        grsScore: user.grsScore || 1300,
        grsPercentile: user.grsPercentile || 50,
      };
    });
  }

  async getLeaderboardStats(): Promise<any> {
    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users).where(isNotNull(users.username));
    const [weeklyCredaSum] = await db.select({ sum: sql<number>`COALESCE(sum(${users.weeklyCreda}), 0)` }).from(users);
    const [activeStreaks] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`COALESCE(${users.dailyStreak}, 0) > 0`);

    return {
      totalParticipants: totalUsers?.count || 0,
      weeklyCredaTotal: weeklyCredaSum?.sum || 0,
      activeStreaks: activeStreaks?.count || 0,
    };
  }

  async getUserCredaActivities(userId: string): Promise<any[]> {
    console.log(`Fetching CREDA activities for user: ${userId}`);
    const activities = await db
      .select()
      .from(credaActivities)
      .where(eq(credaActivities.userId, userId))
      .orderBy(desc(credaActivities.createdAt));

    console.log(`Found ${activities.length} CREDA activities for user ${userId}`);
    if (activities.length > 0) {
      console.log(`Latest activity: ${activities[0].activityType} - ${activities[0].xpAwarded} CREDA`);
    }

    return activities;
  }

  async getAllInviteSubmissions(): Promise<any[]> {
    const submissions = await db
      .select({
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
      })
      .from(inviteSubmissions)
      .leftJoin(users, eq(inviteSubmissions.userId, users.id))
      .orderBy(desc(inviteSubmissions.submittedAt));

    return submissions;
  }

  async approveInviteSubmission(submissionId: number): Promise<void> {
    const submission = await db
      .select()
      .from(inviteSubmissions)
      .where(eq(inviteSubmissions.id, submissionId))
      .limit(1);

    if (submission.length === 0) {
      throw new Error('Submission not found');
    }

    const userId = submission[0].userId;

    await db.transaction(async (tx) => {
      // Update submission status
      await tx
        .update(inviteSubmissions)
        .set({
          status: 'approved',
          approvedAt: new Date()
        })
        .where(eq(inviteSubmissions.id, submissionId));

      // Grant invite access to user
      await tx
        .update(users)
        .set({
          hasInviteAccess: true,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    });
  }

  async denyInviteSubmission(submissionId: number, notes?: string): Promise<void> {
    await db
      .update(inviteSubmissions)
      .set({
        status: 'denied',
        notes: notes || 'Access denied',
        approvedAt: new Date()
      })
      .where(eq(inviteSubmissions.id, submissionId));
  }

  // Review operations

  async getAllReviews(): Promise<any[]> {
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
      reviewerGrsScore: sql<number>`COALESCE(${users.grsScore}, 0)`,
      // Join reviewed user info
      reviewedUsername: sql<string>`reviewed_user.username`,
      reviewedUserAvatar: sql<string>`reviewed_user.profile_image_url`,
      reviewedUserFirstName: sql<string>`reviewed_user.first_name`,
      reviewedUserLastName: sql<string>`reviewed_user.last_name`,
      reviewedUserGrsScore: sql<number>`COALESCE(reviewed_user.grs_score, 0)`,
      // Join reviewed DAO info
      reviewedDaoName: daos.name,
      reviewedDaoSlug: daos.slug,
      reviewedDaoLogo: daos.logoUrl,
      // Join space info
      spaceLogoUrl: spaces.logoUrl,
      spaceName: spaces.name,
      spaceSlug: spaces.slug
    })
    .from(reviews)
    .leftJoin(users, eq(users.id, reviews.reviewerId))
    .leftJoin(sql`users AS reviewed_user`, sql`reviewed_user.id = ${reviews.reviewedUserId}`)
    .leftJoin(daos, eq(daos.id, reviews.reviewedDaoId))
    .leftJoin(spaces, eq(spaces.id, reviews.spaceId))
    .orderBy(desc(reviews.createdAt));

    // Fetch 0G Storage proof data for reviews from credaActivities
    const reviewIds = result.map(r => r.id);
    const reviewActivities = reviewIds.length > 0 ? await db
      .select({
        targetId: credaActivities.targetId,
        ogTxHash: credaActivities.ogTxHash,
        ogRootHash: credaActivities.ogRootHash
      })
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.activityType, 'review_given'),
          eq(credaActivities.targetType, 'review'),
          inArray(credaActivities.targetId, reviewIds)
        )
      ) : [];

    // Create a map for fast lookup
    const ogDataMap = new Map<number, { ogTxHash: string | null; ogRootHash: string | null }>();
    for (const activity of reviewActivities) {
      if (activity.targetId) {
        ogDataMap.set(activity.targetId, {
          ogTxHash: activity.ogTxHash || null,
          ogRootHash: activity.ogRootHash || null
        });
      }
    }

    // Enrich results with 0G data
    return result.map(review => {
      const ogData = ogDataMap.get(review.id);
      return {
        ...review,
        ogTxHash: ogData?.ogTxHash || null,
        ogRootHash: ogData?.ogRootHash || null
      };
    });
  }

  async getReviewsBySpace(spaceSlug: string, limit: number = 10): Promise<any[]> {
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
        grsScore: users.grsScore,
      }
    })
    .from(reviews)
    .innerJoin(spaces, eq(reviews.spaceId, spaces.id))
    .leftJoin(users, eq(reviews.reviewerId, users.id))
    .where(eq(spaces.slug, spaceSlug))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);

    console.log(`getReviewsBySpace found ${result.length} reviews for ${spaceSlug}`);
    return result;
  }

  async getRecentReviews(limit: number = 10): Promise<any[]> {
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
      reviewerUsername: sql<string>`reviewer.username`,
      reviewerAvatar: sql<string>`reviewer.profile_image_url`,
      reviewerGrsScore: sql<number>`reviewer.grs_score`,
      // Join reviewed user info
      reviewedUsername: sql<string>`reviewed_user.username`,
      reviewedUserAvatar: sql<string>`reviewed_user.profile_image_url`,
      reviewedUserFirstName: sql<string>`reviewed_user.first_name`,
      reviewedUserLastName: sql<string>`reviewed_user.last_name`,
      reviewedUserGrsScore: sql<number>`reviewed_user.grs_score`,
      // Join space info
      spaceSlug: sql<string>`space.slug`,
      spaceName: sql<string>`space.name`,
      spaceLogoUrl: sql<string>`space.logo_url`
    })
    .from(reviews)
    .leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`)
    .leftJoin(sql`users AS reviewed_user`, sql`reviewed_user.id = ${reviews.reviewedUserId}`)
    .leftJoin(sql`spaces AS space`, sql`space.id = ${reviews.spaceId}`)
    .orderBy(desc(reviews.createdAt))
    .limit(limit);

    // Calculate review stats for each reviewed user
    const enrichedResults = await Promise.all(result.map(async (review) => {
      if (review.reviewedUserId) {
        // Get review statistics for the reviewed user
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

  async getReviewBasic(reviewId: number): Promise<{ id: number; reviewerId: string } | null> {
    const result = await db
      .select({
        id: reviews.id,
        reviewerId: reviews.reviewerId,
      })
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async getReviewById(reviewId: number) {
    console.log("Getting review with ID:", reviewId);

    try {
      // First get the basic review data
      const reviewResult = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1);

      if (reviewResult.length === 0) {
        console.log("No review found for ID:", reviewId);
        return null;
      }

      const review = reviewResult[0];
      console.log("Found review:", { id: review.id, reviewerId: review.reviewerId, reviewedUserId: review.reviewedUserId, reviewedDaoId: review.reviewedDaoId });

      // Get reviewer info
      let reviewer = null;
      if (review.reviewerId) {
        const reviewerResult = await db
          .select({
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          })
          .from(users)
          .where(eq(users.id, review.reviewerId))
          .limit(1);

        if (reviewerResult.length > 0) {
          reviewer = reviewerResult[0];
          console.log("Found reviewer:", reviewer);
        }
      }

      // Get reviewed user info if applicable
      let reviewedUser = null;
      if (review.reviewedUserId) {
        const reviewedUserResult = await db
          .select({
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
            twitterHandle: users.twitterHandle,
          })
          .from(users)
          .where(eq(users.id, review.reviewedUserId))
          .limit(1);

        if (reviewedUserResult.length > 0) {
          reviewedUser = reviewedUserResult[0];
          console.log("Found reviewed user:", reviewedUser);
        }
      }

      // Get DAO info if this is a DAO review
      let reviewedDaoName = null;
      let reviewedDaoSlug = null;
      let reviewedDaoLogo = null;
      if (review.reviewedDaoId) {
        const daoResult = await db
          .select({
            id: daos.id,
            name: daos.name,
            slug: daos.slug,
            logoUrl: daos.logoUrl,
          })
          .from(daos)
          .where(eq(daos.id, review.reviewedDaoId))
          .limit(1);

        if (daoResult.length > 0) {
          const dao = daoResult[0];
          reviewedDaoName = dao.name;
          reviewedDaoSlug = dao.slug;
          reviewedDaoLogo = dao.logoUrl;
          console.log("Found reviewed DAO:", dao.name);
        }
      }

      // Get comments for this review
      const comments = await this.getReviewComments(reviewId);

      // Transform the result to match expected structure
      const transformedReview = {
        ...review,
        reviewer: reviewer,
        reviewedUser: reviewedUser,
        reviewedDaoName: reviewedDaoName,
        reviewedDaoSlug: reviewedDaoSlug,
        reviewedDaoLogo: reviewedDaoLogo,
        comments: comments,
        helpfulCount: 0 // Add helpful count for compatibility
      };

      console.log("Returning transformed review with DAO data");
      return transformedReview;
    } catch (error) {
      console.error("Error getting review:", error);
      throw error;
    }
  }

  async getUserReviews(userId: string): Promise<any[]> {
    // Get real reviews from database
    const realReviews = await db
      .select({
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
        reviewerUsername: sql<string>`reviewer.username`,
        reviewerAvatar: sql<string>`reviewer.profile_image_url`
      })
      .from(reviews)
      .leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`)
      .where(
        or(
          eq(reviews.reviewedUserId, userId),
          and(
            eq(reviews.externalEntityName, userId),
            eq(reviews.isTargetOnPlatform, false)
          )
        )
      )
      .orderBy(desc(reviews.createdAt));

    return realReviews;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    // Note: CREDA rewards are handled in routes.ts to enable 0G Storage recording
    return review;
  }



  async getReviewByUsers(reviewerId: string, reviewedId: string): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.reviewerId, reviewerId),
        eq(reviews.reviewedUserId, reviewedId)
      ));
    return review;
  }

  async getReviewByUserAndDao(reviewerId: string, daoId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.reviewerId, reviewerId),
        eq(reviews.reviewedDaoId, daoId)
      ));
    return review;
  }

  async getDaoReviews(daoId: number): Promise<any[]> {
    console.log(`getDaoReviews called with daoId: ${daoId}`);

    try {
      // Get all reviews that target this DAO ID
      const result = await db
        .select({
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
          reviewerUsername: sql<string>`reviewer.username`,
          reviewerAvatar: sql<string>`reviewer.profile_image_url`,
          reviewerGrsScore: sql<number>`reviewer.grs_score`
        })
        .from(reviews)
        .leftJoin(sql`users AS reviewer`, sql`reviewer.id = ${reviews.reviewerId}`)
        .where(
          or(
            eq(reviews.reviewedDaoId, daoId),
            eq(reviews.reviewedUserId, `dao_${daoId}`)
          )
        )
        .orderBy(desc(reviews.createdAt));

      console.log(`Found ${result.length} reviews for DAO ${daoId}`);

      // Transform results to include reviewer info in expected format
      const transformedReviews = result.map(review => ({
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

  async getUserReviewStats(userId: string): Promise<{ total: number; positive: number; negative: number; neutral: number; positivePercentage: number }> {
    const reviewStats = await db
      .select({
        reviewType: reviews.reviewType,
        count: sql<number>`COUNT(*)`
      })
      .from(reviews)
      .where(eq(reviews.reviewedUserId, userId))
      .groupBy(reviews.reviewType);

    const stats = { total: 0, positive: 0, negative: 0, neutral: 0, positivePercentage: 0 };

    reviewStats.forEach(stat => {
      stats.total += stat.count;
      stats[stat.reviewType as 'positive' | 'negative' | 'neutral'] = stat.count;
    });

    stats.positivePercentage = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0;

    return stats;
  }

  async getUserAdvancedReviewStats(userId: string): Promise<{ total: number; averageRating: number; consistency: number }> {
    const reviewStats = await db
      .select({
        count: sql<number>`COUNT(*)`,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        ratingVariance: sql<number>`COALESCE(VARIANCE(${reviews.rating}), 0)`
      })
      .from(reviews)
      .where(eq(reviews.reviewerId, userId));

    console.log('Review stats result:', reviewStats);
    const stats = reviewStats[0] || { count: 0, avgRating: 0, ratingVariance: 0 };
    const total = Number(stats.count) || 0;
    const averageRating = Math.round((Number(stats.avgRating) || 0) * 10) / 10;

    // Calculate consistency score based on rating variance (lower variance = higher consistency)
    // Max consistency is 100%, decreases as variance increases
    const consistency = total > 1
      ? Math.max(0, Math.min(100, Math.round(100 - (stats.ratingVariance * 10))))
      : total === 1 ? 100 : 0;

    return {
      total,
      averageRating,
      consistency
    };
  }

  async getUserStanceStats(userId: string): Promise<{ total: number; successful: number; successRate: number; challengesWon: number; championsWon: number }> {
    // Get all stances created by this user from governance issues
    const userStances = await db
      .select({
        id: governanceIssues.id,
        stance: governanceIssues.stance,
        championVotes: governanceIssues.championVotes,
        challengeVotes: governanceIssues.challengeVotes,
        opposeVotes: governanceIssues.opposeVotes,
        isActive: governanceIssues.isActive,
        expiresAt: governanceIssues.expiresAt
      })
      .from(governanceIssues)
      .where(eq(governanceIssues.authorId, userId));

    const stats = {
      total: userStances.length,
      successful: 0,
      successRate: 0,
      challengesWon: 0,
      championsWon: 0
    };

    // Count successful stances based on vote outcomes for expired stances
    userStances.forEach(stance => {
      const now = new Date();
      const hasExpired = stance.expiresAt && new Date(stance.expiresAt) <= now;

      if (hasExpired || !stance.isActive) {
        const totalVotes = (stance.championVotes || 0) + (stance.challengeVotes || 0) + (stance.opposeVotes || 0);
        const consensusThreshold = Math.max(1, totalVotes * 0.5); // 50% consensus needed

        if (stance.stance === 'champion' && (stance.championVotes || 0) >= consensusThreshold) {
          stats.successful++;
          stats.championsWon++;
        } else if (stance.stance === 'challenge' && (stance.challengeVotes || 0) >= consensusThreshold) {
          stats.successful++;
          stats.challengesWon++;
        }
      }
    });

    stats.successRate = stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0;

    return stats;
  }

  async hasUserReviewed(reviewerId: string, reviewedId: string): Promise<boolean> {
    const review = await this.getReviewByUsers(reviewerId, reviewedId);
    return !!review;
  }

  // Project Review Methods
  async createProjectReview(reviewData: InsertProjectReview): Promise<ProjectReview> {
    const [review] = await db.insert(projectReviews).values(reviewData).returning();
    
    // Award CREDA for project review
    await this.awardCredaPoints(reviewData.userId, 'social', 'project_review_given', DatabaseStorage.CREDA_REWARDS.GIVE_REVIEW, 'project_review', review.id, {
      projectId: reviewData.projectId,
      projectName: reviewData.projectName,
      rating: reviewData.rating
    });
    
    return review;
  }

  async getProjectReviews(projectId: string): Promise<ProjectReviewWithUser[]> {
    const reviewsList = await db
      .select({
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
          twitterHandle: users.twitterHandle,
        }
      })
      .from(projectReviews)
      .leftJoin(users, eq(projectReviews.userId, users.id))
      .where(eq(projectReviews.projectId, projectId))
      .orderBy(desc(projectReviews.createdAt));
    
    return reviewsList as any;
  }

  async getAllProjectReviews(limit: number = 20): Promise<ProjectReviewWithUser[]> {
    // Due to Drizzle ORM limitation: .limit() drops nested object hydration
    // We must flatten user fields and manually rebuild the nested object
    const rows = await db
      .select({
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
        user_twitterHandle: users.twitterHandle,
      })
      .from(projectReviews)
      .leftJoin(users, eq(projectReviews.userId, users.id))
      .orderBy(desc(projectReviews.createdAt))
      .limit(limit);
    
    // Manually rebuild the user object from flattened fields
    return rows.map(row => ({
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
        twitterHandle: row.user_twitterHandle,
      }
    })) as any;
  }

  async markProjectReviewHelpful(reviewId: string): Promise<ProjectReview | null> {
    const [updatedReview] = await db
      .update(projectReviews)
      .set({ helpful: sql`${projectReviews.helpful} + 1` })
      .where(eq(projectReviews.id, reviewId))
      .returning();
    
    return updatedReview || null;
  }

  // Review Share Methods (for viral X/Twitter sharing)
  async createReviewShare(shareData: InsertReviewShare): Promise<ReviewShare> {
    const [share] = await db.insert(reviewShares).values(shareData).returning();
    return share;
  }

  async getReviewShare(shareToken: string): Promise<ReviewShare | undefined> {
    const [share] = await db
      .select()
      .from(reviewShares)
      .where(eq(reviewShares.shareToken, shareToken))
      .limit(1);
    
    return share;
  }

  async trackReviewShareClick(clickData: InsertReviewShareClick): Promise<void> {
    // Insert click record
    await db.insert(reviewShareClicks).values(clickData);
    
    // Increment click count on the share
    await db
      .update(reviewShares)
      .set({ clicks: sql`${reviewShares.clicks} + 1` })
      .where(eq(reviewShares.id, clickData.shareId));
  }

  async claimShareReward(shareId: number, userId: string): Promise<void> {
    // Check if reward already claimed
    const [share] = await db
      .select()
      .from(reviewShares)
      .where(eq(reviewShares.id, shareId))
      .limit(1);
    
    if (!share || share.shareRewardClaimed) {
      console.log(`Share reward already claimed or share not found: ${shareId}`);
      return;
    }
    
    // Award 100 CREDA for sharing on X
    await this.awardCredaPoints(
      userId,
      'social',
      'review_shared_on_x',
      100,
      'review_share',
      shareId,
      {
        platform: share.platform,
        projectName: share.projectName,
        credaEarnedFromReview: share.credaEarned
      }
    );
    
    // Mark reward as claimed
    await db
      .update(reviewShares)
      .set({
        shareRewardClaimed: true,
        shareRewardClaimedAt: new Date()
      })
      .where(eq(reviewShares.id, shareId));
    
    console.log(`Share reward of 100 CREDA claimed for user ${userId}, share ${shareId}`);
  }

  async getUserReviewShares(userId: string): Promise<ReviewShare[]> {
    const shares = await db
      .select()
      .from(reviewShares)
      .where(eq(reviewShares.userId, userId))
      .orderBy(desc(reviewShares.createdAt));
    
    return shares;
  }

  async linkReferralToUser(shareToken: string, newUserId: string): Promise<void> {
    // Get the share record
    const [share] = await db
      .select()
      .from(reviewShares)
      .where(eq(reviewShares.shareToken, shareToken))
      .limit(1);
    
    if (!share) {
      console.log(`Share token not found: ${shareToken}`);
      return;
    }
    
    // Award 100 CREDA to the sharer if not already rewarded
    if (!share.shareRewardClaimed) {
      await this.claimShareReward(share.id, share.userId);
    }
    
    // Award referral bonus (70 CREDA) to the sharer for successful signup
    await this.awardCredaPoints(
      share.userId,
      'social',
      'referral_from_x_share',
      70,
      'user',
      undefined,
      {
        referredUser: newUserId,
        shareToken
      }
    );
    
    console.log(`Linked referral: user ${share.userId} referred ${newUserId} via share token ${shareToken}`);
  }

  async getAllCompanies(): Promise<Company[]> {
    const companiesList = await db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));
    
    return companiesList;
  }

  async getCompanyById(id: number): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);
    
    return company;
  }

  async getCompanyByExternalId(externalId: string): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.externalId, externalId))
      .limit(1);
    
    return company;
  }

  async getCompanyBySlug(slug: string): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);
    
    return company;
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(companyData)
      .returning();
    
    return company;
  }

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    
    return updatedCompany;
  }

  async deleteCompany(id: number): Promise<void> {
    await db.delete(companies).where(eq(companies.id, id));
  }

  async getCompanyReviews(companyId: number): Promise<any[]> {
    const company = await this.getCompanyById(companyId);
    if (!company) return [];
    
    return await this.getProjectReviews(company.externalId);
  }

  async getCompanyAnalytics(companyId: number): Promise<any> {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      return {
        totalReviews: 0,
        averageRating: "0.0",
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const reviews = await this.getProjectReviews(company.externalId);
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: "0.0",
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const ratingBreakdown = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    return {
      totalReviews,
      averageRating: avgRating.toFixed(1),
      ratingBreakdown
    };
  }

  async addCompanyReplyToReview(reviewId: number, reply: string): Promise<any> {
    const [updatedReview] = await db
      .update(projectReviews)
      .set({ 
        companyReply: reply,
        companyRepliedAt: new Date()
      })
      .where(eq(projectReviews.id, reviewId))
      .returning();
    
    return updatedReview;
  }

  async getCompanyAdmins(companyId: number): Promise<any[]> {
    const admins = await db
      .select({
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
          twitterHandle: users.twitterHandle,
        }
      })
      .from(companyAdmins)
      .leftJoin(users, eq(companyAdmins.userId, users.id))
      .where(eq(companyAdmins.companyId, companyId))
      .orderBy(desc(companyAdmins.createdAt));
    
    return admins;
  }

  async addCompanyAdmin(adminData: InsertCompanyAdmin): Promise<CompanyAdmin> {
    const [admin] = await db
      .insert(companyAdmins)
      .values(adminData)
      .returning();
    
    return admin;
  }

  async removeCompanyAdmin(id: number): Promise<void> {
    await db.delete(companyAdmins).where(eq(companyAdmins.id, id));
  }

  async isUserCompanyAdmin(userId: string, companyId: number): Promise<boolean> {
    const [admin] = await db
      .select()
      .from(companyAdmins)
      .where(
        and(
          eq(companyAdmins.userId, userId),
          eq(companyAdmins.companyId, companyId)
        )
      )
      .limit(1);
    
    return !!admin;
  }

  async getRecentReviewsWithGrsChanges(limit: number = 20): Promise<any[]> {
    try {
      console.log(`Fetching ${limit} recent reviews with GRS changes...`);

      // Simplified query - get recent reviews first
      const recentReviews = await db
        .select({
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
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.reviewerId, users.id))
        .orderBy(desc(reviews.createdAt))
        .limit(limit);

      console.log(`Found ${recentReviews.length} recent reviews`);

      // Process and enhance the results
      const processedReviews = await Promise.all(
        recentReviews.map(async (review) => {
          let reviewedEntity = null;
          let displayName = 'Unknown';
          let avatarUrl = null;
          let grsImpact = 'positive'; // Default impact
          let impactAmount = 15; // Default amount

          // Get reviewed entity details (user or DAO)
          if (review.reviewedUserId) {
            const reviewedUser = await this.getUser(review.reviewedUserId);
            reviewedEntity = reviewedUser;
            displayName = reviewedUser?.username || reviewedUser?.firstName || 'Unknown User';
            avatarUrl = reviewedUser?.profileImageUrl;
            // Determine impact based on review type
            grsImpact = review.reviewType === 'positive' ? 'positive' :
                       review.reviewType === 'negative' ? 'negative' : 'neutral';
            impactAmount = review.pointsAwarded || (review.rating > 3 ? 25 : 15);
          } else if (review.reviewedDaoId) {
            const reviewedDao = await this.getDaoById(review.reviewedDaoId);
            reviewedEntity = reviewedDao;
            displayName = reviewedDao?.name || 'Unknown DAO';
            avatarUrl = reviewedDao?.logoUrl;
            grsImpact = 'dao';
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
            targetType: review.targetType || 'user',
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
  async getReviewComments(reviewId: number): Promise<ReviewComment[]> {
    const comments = await db
      .select({
        review_comments: {
          id: reviewComments.id,
          content: reviewComments.content,
          authorId: reviewComments.authorId,
          reviewId: reviewComments.reviewId,
          parentCommentId: reviewComments.parentCommentId,
          upvotes: reviewComments.upvotes,
          downvotes: reviewComments.downvotes,
          createdAt: reviewComments.createdAt,
          updatedAt: reviewComments.updatedAt,
        },
        users: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        }
      })
      .from(reviewComments)
      .leftJoin(users, eq(reviewComments.authorId, users.id))
      .where(eq(reviewComments.reviewId, reviewId))
      .orderBy(reviewComments.createdAt);

    return comments.map(result => ({
      ...result.review_comments,
      author: result.users ? {
        id: result.users.id,
        username: result.users.username,
        firstName: result.users.firstName,
        lastName: result.users.lastName,
        profileImageUrl: result.users.profileImageUrl
      } : null
    })) as ReviewComment[];
  }

  async getReviewCommentById(commentId: number): Promise<ReviewComment | undefined> {
    const result = await db
      .select({
        review_comments: {
          id: reviewComments.id,
          content: reviewComments.content,
          authorId: reviewComments.authorId,
          reviewId: reviewComments.reviewId,
          parentCommentId: reviewComments.parentCommentId,
          upvotes: reviewComments.upvotes,
          downvotes: reviewComments.downvotes,
          createdAt: reviewComments.createdAt,
          updatedAt: reviewComments.updatedAt,
        },
        users: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        }
      })
      .from(reviewComments)
      .leftJoin(users, eq(reviewComments.authorId, users.id))
      .where(eq(reviewComments.id, commentId))
      .limit(1);

    if (!result[0]) {
      return undefined;
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
    } as ReviewComment;
  }

  async createReviewComment(commentData: InsertReviewComment): Promise<ReviewComment> {
    const [newComment] = await db
      .insert(reviewComments)
      .values(commentData)
      .returning({
        id: reviewComments.id,
        content: reviewComments.content,
        authorId: reviewComments.authorId,
        reviewId: reviewComments.reviewId,
        parentCommentId: reviewComments.parentCommentId,
        upvotes: reviewComments.upvotes,
        downvotes: reviewComments.downvotes,
        createdAt: reviewComments.createdAt,
        updatedAt: reviewComments.updatedAt,
      });

    // Get the comment with author info
    const commentWithAuthor = await db
      .select({
        review_comments: {
          id: reviewComments.id,
          content: reviewComments.content,
          authorId: reviewComments.authorId,
          reviewId: reviewComments.reviewId,
          parentCommentId: reviewComments.parentCommentId,
          upvotes: reviewComments.upvotes,
          downvotes: reviewComments.downvotes,
          createdAt: reviewComments.createdAt,
          updatedAt: reviewComments.updatedAt,
        },
        users: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        }
      })
      .from(reviewComments)
      .leftJoin(users, eq(reviewComments.authorId, users.id))
      .where(eq(reviewComments.id, newComment.id))
      .limit(1);

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
    } as ReviewComment;
  }

  // Business profile operations
  async createBusinessProfile(userId: string, data: any): Promise<any> {
    const { nanoid } = await import('nanoid');
    const slug = data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inviteCode = nanoid(10);

    const [profile] = await db
      .insert(businessProfiles)
      .values({
        userId,
        companyName: data.companyName,
        slug,
        industry: data.industry,
        website: data.website,
        email: data.email,
        description: data.description,
        logoUrl: data.logoUrl || '',
        plan: data.plan || 'free',
        inviteCode,
        isDeployed: false,
      })
      .returning();

    return profile;
  }

  async getBusinessProfile(id: number): Promise<any | undefined> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, id))
      .limit(1);

    return profile;
  }

  async getBusinessProfileBySlug(slug: string): Promise<any | undefined> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.slug, slug))
      .limit(1);

    return profile;
  }

  async getBusinessProfileByUserId(userId: string): Promise<any | undefined> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, userId))
      .limit(1);

    return profile;
  }

  async getBusinessProfileByInviteCode(inviteCode: string): Promise<any | undefined> {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.inviteCode, inviteCode))
      .limit(1);

    return profile;
  }

  async updateBusinessProfile(id: number, data: any): Promise<any> {
    const [profile] = await db
      .update(businessProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(businessProfiles.id, id))
      .returning();

    return profile;
  }

  async deployBusinessProfile(id: number): Promise<any> {
    const [profile] = await db
      .update(businessProfiles)
      .set({
        isDeployed: true,
        deployedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(businessProfiles.id, id))
      .returning();

    return profile;
  }

  async getBusinessReviews(businessId: number): Promise<any[]> {
    const businessReviews = await db
      .select({
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
        reviewerGrsScore: users.grsScore,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.reviewedBusinessId, businessId))
      .orderBy(desc(reviews.createdAt));

    return businessReviews;
  }

  async getAllBusinessProfiles(): Promise<any[]> {
    const profiles = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.isDeployed, true))
      .orderBy(desc(businessProfiles.deployedAt));

    return profiles;
  }

  async getUserActivity(userId: string): Promise<any[]> {
    const activities: any[] = [];

    // Get governance issues created by user
    const userIssues = await db
      .select({
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
          username: sql<string>`target_user.username`
        }
      })
      .from(governanceIssues)
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .leftJoin(sql`users as target_user`, eq(governanceIssues.targetUserId, sql`target_user.id`))
      .where(eq(governanceIssues.authorId, userId))
      .orderBy(desc(governanceIssues.createdAt));

    // Add governance issues to activities
    userIssues.forEach(issue => {
      activities.push({
        id: `issue-${issue.id}`,
        type: 'governance_issue',
        title: `Created governance issue: ${issue.title}`,
        description: `${issue.stance === 'champion' ? 'Championed' : 'Challenged'} ${issue.title}`,
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

    // Get comments by user
    const userComments = await db
      .select({
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
      })
      .from(comments)
      .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .where(eq(comments.authorId, userId))
      .orderBy(desc(comments.createdAt));

    // Add comments to activities
    userComments.forEach(comment => {
      activities.push({
        id: `comment-${comment.id}`,
        type: 'comment',
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

    // Get review comments by user
    const userReviewComments = await db
      .select({
        id: reviewComments.id,
        content: reviewComments.content,
        createdAt: reviewComments.createdAt,
        reviewId: reviewComments.reviewId,
        reviewTitle: reviews.title,
        reviewedUsername: users.username
      })
      .from(reviewComments)
      .leftJoin(reviews, eq(reviewComments.reviewId, reviews.id))
      .leftJoin(users, eq(reviews.reviewedUserId, users.id))
      .where(eq(reviewComments.authorId, userId))
      .orderBy(desc(reviewComments.createdAt));

    // Add review comments to activities
    userReviewComments.forEach(comment => {
      const reviewTitle = comment.reviewTitle || `review of ${comment.reviewedUsername || 'a user'}`;
      activities.push({
        id: `comment-on-review-${comment.id}`,
        type: 'review_comment',
        title: `Commented on ${reviewTitle}`,
        description: comment.content.length > 100 ? `${comment.content.substring(0, 100)}...` : comment.content,
        points: 10,
        timestamp: comment.createdAt,
        metadata: {
          commentId: comment.id,
          reviewId: comment.reviewId,
          reviewTitle: reviewTitle
        }
      });
    });

    // Get reviews given by user
    const userReviewsGiven = await db
      .select({
        id: reviews.id,
        reviewType: reviews.reviewType,
        content: reviews.content,
        pointsAwarded: reviews.pointsAwarded,
        createdAt: reviews.createdAt,
        reviewedUserId: reviews.reviewedUserId,
        reviewedUsername: users.username
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewedUserId, users.id))
      .where(eq(reviews.reviewerId, userId))
      .orderBy(desc(reviews.createdAt));

    // Add reviews given to activities
    userReviewsGiven.forEach(review => {
      activities.push({
        id: `review-given-${review.id}`,
        type: 'review_given',
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

    // Get reviews received by user
    const userReviewsReceived = await db
      .select({
        id: reviews.id,
        reviewType: reviews.reviewType,
        content: reviews.content,
        createdAt: reviews.createdAt,
        reviewerId: reviews.reviewerId,
        reviewerUsername: users.username
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.reviewedUserId, userId))
      .orderBy(desc(reviews.createdAt));

    // Add reviews received to activities
    userReviewsReceived.forEach(review => {
      activities.push({
        id: `review-received-${review.id}`,
        type: 'review_received',
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

    // Get votes by user
    const userVotes = await db
      .select({
        id: votes.id,        voteType: votes.voteType,
        targetType: votes.targetType,
        targetId: votes.targetId,
        createdAt: votes.createdAt
      })
      .from(votes)
      .where(eq(votes.userId, userId))
      .orderBy(desc(votes.createdAt));

    // Add votes to activities (we'll need to look up the target details)
    for (const vote of userVotes) {
      let targetTitle = '';
      let targetDescription = '';
      let targetUser = '';

      if (vote.targetType === 'issue') {
        const issue = await db
          .select({
            title: governanceIssues.title,
            daoName: daos.name,
            authorUsername: users.username
          })
          .from(governanceIssues)
          .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
          .leftJoin(users, eq(governanceIssues.authorId, users.id))
          .where(eq(governanceIssues.id, vote.targetId));

        if (issue.length > 0) {
          targetTitle = issue[0].title;
          targetDescription = `${vote.voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} governance issue: ${issue[0].title}`;
          targetUser = issue[0].authorUsername;
        }
      } else if (vote.targetType === 'comment') {
        const comment = await db
          .select({
            content: comments.content,
            issueTitle: governanceIssues.title,
            authorUsername: users.username
          })
          .from(comments)
          .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
          .leftJoin(users, eq(comments.authorId, users.id))
          .where(eq(comments.id, vote.targetId));

        if (comment.length > 0) {
          targetTitle = `Comment on ${comment[0].issueTitle}`;
          targetDescription = `${vote.voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} comment on ${comment[0].issueTitle}`;
          targetUser = comment[0].authorUsername;
        }
      }

      activities.push({
        id: `vote-${vote.id}`,
        type: 'vote',
        title: targetTitle,
        description: targetDescription,
        points: 2,
        timestamp: vote.createdAt,
        metadata: {
          voteId: vote.id,
          voteType: vote.voteType,
          targetType: vote.targetType,
          targetId: vote.targetId,
          targetUser: targetUser
        }
      });
    }

    // Get DAO follows by user
    const userDAOFollows = await db
      .select({
        id: userDaoFollows.id,
        daoId: userDaoFollows.daoId,
        createdAt: userDaoFollows.createdAt,
        daoName: daos.name,
        daoSlug: daos.slug
      })
      .from(userDaoFollows)
      .leftJoin(daos, eq(userDaoFollows.daoId, daos.id))
      .where(eq(userDaoFollows.userId, userId))
      .orderBy(desc(userDaoFollows.createdAt));

    // Add DAO follows to activities
    userDAOFollows.forEach(follow => {
      activities.push({
        id: `follow-${follow.id}`,
        type: 'dao_follow',
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

    // === ACTIVITIES WHERE USER IS THE TARGET ===

    // Get governance issues that target this user
    const issuesTargetingUser = await db
      .select({
        id: governanceIssues.id,
        title: governanceIssues.title,
        stance: governanceIssues.stance,
        createdAt: governanceIssues.createdAt,
        authorId: governanceIssues.authorId,
        authorUsername: users.username,
        daoName: daos.name,
        daoSlug: daos.slug
      })
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .where(eq(governanceIssues.targetUserId, userId))
      .orderBy(desc(governanceIssues.createdAt));

    // Add governance issues targeting user to activities
    issuesTargetingUser.forEach(issue => {
      activities.push({
        id: `targeted-issue-${issue.id}`,
        type: 'governance_issue_targeted',
        title: `${issue.stance === 'champion' ? 'Championed' : 'Challenged'} by ${issue.authorUsername}`,
        description: `${issue.authorUsername} ${issue.stance === 'champion' ? 'championed' : 'challenged'} you: ${issue.title}`,
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

    // Get comments on user's governance issues
    const commentsOnUserIssues = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        authorUsername: users.username,
        issueId: comments.issueId,
        issueTitle: governanceIssues.title,
        issueAuthorId: governanceIssues.authorId
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
      .where(and(
        eq(governanceIssues.authorId, userId),
        sql`${comments.authorId} != ${userId}` // Exclude user's own comments
      ))
      .orderBy(desc(comments.createdAt));

    // Add comments on user's issues to activities
    commentsOnUserIssues.forEach(comment => {
      activities.push({
        id: `comment-on-issue-${comment.id}`,
        type: 'comment_received',
        title: `${comment.authorUsername} commented on your issue`,
        description: `${comment.authorUsername} commented on "${comment.issueTitle}": ${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}`,
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

    // Get votes on user's content (issues and comments)
    const votesOnUserContent = await db
      .select({
        id: votes.id,
        voteType: votes.voteType,
        targetType: votes.targetType,
        targetId: votes.targetId,
        createdAt: votes.createdAt,
        voterId: votes.userId,
        voterUsername: users.username
      })
      .from(votes)
      .leftJoin(users, eq(votes.userId, users.id))
      .where(and(
        or(
          // Votes on user's governance issues
          and(
            eq(votes.targetType, 'issue'),
            sql`${votes.targetId} IN (SELECT id FROM ${governanceIssues} WHERE ${governanceIssues.authorId} = ${userId})`
          ),
          // Votes on user's comments
          and(
            eq(votes.targetType, 'comment'),
            sql`${votes.targetId} IN (SELECT id FROM ${comments} WHERE ${comments.authorId} = ${userId})`
          )
        ),
        sql`${votes.userId} != ${userId}` // Exclude user's own votes
      ))
      .orderBy(desc(votes.createdAt));

    // Add votes on user's content to activities
    for (const vote of votesOnUserContent) {
      let targetTitle = '';
      let targetDescription = '';

      if (vote.targetType === 'issue') {
        const issue = await db
          .select({
            title: governanceIssues.title
          })
          .from(governanceIssues)
          .where(eq(governanceIssues.id, vote.targetId));

        if (issue.length > 0) {
          targetTitle = `${vote.voterUsername} ${vote.voteType}d your issue`;
          targetDescription = `${vote.voterUsername} ${vote.voteType}d your governance issue: ${issue[0].title}`;
        }
      } else if (vote.targetType === 'comment') {
        const comment = await db
          .select({
            content: comments.content,
            issueTitle: governanceIssues.title
          })
          .from(comments)
          .leftJoin(governanceIssues, eq(comments.issueId, governanceIssues.id))
          .where(eq(comments.id, vote.targetId));

        if (comment.length > 0) {
          targetTitle = `${vote.voterUsername} ${vote.voteType}d your comment`;
          targetDescription = `${vote.voterUsername} ${vote.voteType}d your comment on ${comment[0].issueTitle}`;
        }
      }

      if (targetTitle) {
        activities.push({
          id: `vote-received-${vote.id}`,
          type: 'vote_received',
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

    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Fetch on-chain proof data from credaActivities and merge with activities
    const credaActivitiesData = await db
      .select({
        id: credaActivities.id,
        activityType: credaActivities.activityType,
        targetType: credaActivities.targetType,
        targetId: credaActivities.targetId,
        ogTxHash: credaActivities.ogTxHash,
        ogRootHash: credaActivities.ogRootHash,
        ogRecordedAt: credaActivities.ogRecordedAt,
      })
      .from(credaActivities)
      .where(eq(credaActivities.userId, userId));

    // Create lookup map for on-chain data (targetType-targetId -> ogData)
    const ogDataMap = new Map<string, { ogTxHash: string | null; ogRootHash: string | null; ogRecordedAt: Date | null }>();
    credaActivitiesData.forEach(ca => {
      if (ca.targetType && ca.targetId) {
        const key = `${ca.targetType}-${ca.targetId}`;
        // Keep the one with ogTxHash if multiple entries exist
        if (!ogDataMap.has(key) || ca.ogTxHash) {
          ogDataMap.set(key, {
            ogTxHash: ca.ogTxHash,
            ogRootHash: ca.ogRootHash,
            ogRecordedAt: ca.ogRecordedAt
          });
        }
      }
    });

    // Merge on-chain data into activities
    activities.forEach(activity => {
      let lookupKey = '';
      
      // Match activity types to credaActivity targetTypes
      if (activity.type === 'governance_issue' && activity.metadata?.issueId) {
        lookupKey = `issue-${activity.metadata.issueId}`;
      } else if (activity.type === 'comment' && activity.metadata?.commentId) {
        lookupKey = `comment-${activity.metadata.commentId}`;
      } else if (activity.type === 'vote' && activity.metadata?.targetType && activity.metadata?.targetId) {
        lookupKey = `${activity.metadata.targetType}-${activity.metadata.targetId}`;
      } else if (activity.type === 'review_given' && activity.metadata?.reviewId) {
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
  async awardCredaPoints(userId: string, category: string, activityType: string, amount: number, targetType?: string, targetId?: number, metadata?: any): Promise<any> {
    // Insert CREDA activity record
    const xpActivity = await db.insert(credaActivities).values({
      userId,
      activityType,
      credaAwarded: amount,
      targetType,
      targetId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date(),
    }).returning();

    console.log(`Awarded ${amount} CREDA to user ${userId} for ${activityType}`);

    // Update user's total CREDA points
    const result = await db
      .update(users)
      .set({
        credaPoints: sql`COALESCE(${users.credaPoints}, 0) + ${amount}`,
        weeklyCreda: sql`COALESCE(${users.weeklyCreda}, 0) + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({ credaPoints: users.credaPoints });

    console.log(`Successfully awarded CREDA to user ${userId}. New total: ${result[0]?.credaPoints || 'unknown'}`);

    // Check and update daily tasks streak immediately after awarding CREDA
    await this.checkAndUpdateDailyTasksStreak(userId);

    // Return the created activity for 0G Storage recording
    return xpActivity[0];
  }

  // Update credaActivity with 0G Storage on-chain proof data
  async updateCredaActivityWithOgProof(activityId: number, ogTxHash: string, ogRootHash: string): Promise<void> {
    await db
      .update(credaActivities)
      .set({
        ogTxHash,
        ogRootHash,
        ogRecordedAt: new Date()
      })
      .where(eq(credaActivities.id, activityId));
    
    console.log(`[0G Storage] Updated activity ${activityId} with on-chain proof: ${ogTxHash}`);
  }

  // Get a single credaActivity by ID
  async getCredaActivityById(activityId: number): Promise<any> {
    const [activity] = await db
      .select()
      .from(credaActivities)
      .where(eq(credaActivities.id, activityId))
      .limit(1);
    return activity;
  }

  // Check and update daily tasks streak when users earn CREDA
  async checkAndUpdateDailyTasksStreak(userId: string): Promise<void> {
    try {
      // Get today's start in UTC
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayDateString = todayStart.toISOString().split('T')[0];

      // Get today's CREDA activities to count unique action types
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
      const tasksComplete = completedActionsCount >= 3;

      // Get current user data
      const user = await db
        .select({
          dailyStreak: users.dailyStreak,
          longestStreak: users.longestStreak,
          lastStreakDate: users.lastStreakDate
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) return;

      const userData = user[0];
      let newStreak = userData.dailyStreak || 0;
      let newLongestStreak = userData.longestStreak || 0;

      // Check if we need to update the streak
      const lastStreakDate = userData.lastStreakDate;
      const yesterday = new Date(todayStart);
      yesterday.setDate(yesterday.getDate() - 1);

      if (tasksComplete) {
        // Check if we've already updated the streak for today
        const hasUpdatedToday = lastStreakDate && lastStreakDate.toDateString() === todayStart.toDateString();

        if (!hasUpdatedToday) {
          // User completed tasks today and we haven't updated streak yet
          if (!lastStreakDate || lastStreakDate.toDateString() === yesterday.toDateString()) {
            // Continue or start streak
            newStreak += 1;
          } else {
            // Streak was broken, restart at 1
            newStreak = 1;
          }

          // Update longest streak if current is higher
          if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
          }

          // Update user streak data
          await db
            .update(users)
            .set({
              dailyStreak: newStreak,
              longestStreak: newLongestStreak,
              lastStreakDate: todayStart,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));

          console.log(`Updated daily streak for user ${userId}: ${newStreak} days (tasks completed: ${completedActionsCount})`);
        }
      }
    } catch (error) {
      console.error("Error updating daily tasks streak:", error);
      // Don't throw error to avoid breaking CREDA awarding
    }
  }

  // DAO AI CREDA Points System - OFFICIAL REWARD STRUCTURE
  static readonly CREDA_REWARDS = {
    // Content Creation (Reviews are the highest reward!)
    GIVE_REVIEW: 200, // PRIMARY REWARD - Reviewing companies/users
    CREATE_GOVERNANCE_STANCE: 50, // Reduced from 100
    QUALITY_COMMENT: 20, // 100+ characters
    NORMAL_COMMENT: 10,
    CAST_VOTE: 5,
    REPORT_SPAM: 25, // NEW - Report spam content
    COMPLETE_ONBOARDING: 25,
    COMPLETE_WELCOME_TOUR: 25,

    // Engagement Rewards (receiving interactions)
    RECEIVE_UPVOTE_STANCE: 10,
    RECEIVE_DOWNVOTE_STANCE: 3, // still engagement!
    RECEIVE_COMMENT_STANCE: 5,
    RECEIVE_UPVOTE_COMMENT: 5,
    RECEIVE_UPVOTE_REVIEW: 5,
    RECEIVE_POSITIVE_REVIEW: 15, // Getting a positive review
    RECEIVE_NEUTRAL_REVIEW: 5, // Getting a neutral review
    RECEIVE_NEGATIVE_REVIEW: 2, // Getting a negative review (still engagement)

    // Special Bonuses - Daily Streak
    DAILY_STREAK_3_DAYS: 10,
    DAILY_STREAK_7_DAYS: 25,
    DAILY_STREAK_14_DAYS: 50,
    DAILY_STREAK_30_DAYS: 100,

    // Moderation
    SPAM_PENALTY: -25, // when flagged by 5+ users
  };

  // Award CREDA for creating governance stance
  async awardStanceCreationCreda(userId: string, stanceId: number): Promise<any> {
    return await this.awardCredaPoints(
      userId,
      'content',
      'stance_created', // Use the correct activity type
      DatabaseStorage.CREDA_REWARDS.CREATE_GOVERNANCE_STANCE,
      'governance_issue',
      stanceId,
      { action: 'Created governance stance' }
    );
  }

  // Award CREDA for commenting
  async awardCommentCreda(userId: string, commentContent: string, issueId: number): Promise<any> {
    const isQualityComment = commentContent.length >= 100;
    const credaAmount = isQualityComment ?
      DatabaseStorage.CREDA_REWARDS.QUALITY_COMMENT :
      DatabaseStorage.CREDA_REWARDS.NORMAL_COMMENT;

    return await this.awardCredaPoints(
      userId,
      'content',
      isQualityComment ? 'quality_comment' : 'normal_comment', // Use consistent activity types
      credaAmount,
      'comment',
      issueId,
      {
        action: isQualityComment ? 'Quality comment posted' : 'Comment posted',
        contentLength: commentContent.length
      }
    );
  }

  // Award CREDA for voting
  async awardVotingCreda(userId: string, targetType: string, targetId: number, voteType: string): Promise<any> {
    return await this.awardCredaPoints(
      userId,
      'engagement',
      'vote_cast', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.CAST_VOTE,
      targetType,
      targetId,
      { action: `Cast ${voteType} vote`, voteType }
    );
  }

  // Award CREDA for receiving upvotes on stance
  async awardUpvoteReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void> {
    await this.awardCredaPoints(
      stanceAuthorId,
      'engagement',
      'upvote_received_stance', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_STANCE,
      'governance_issue',
      stanceId,
      { action: 'Received upvote on stance' }
    );
  }

  // Award CREDA for receiving downvotes on stance (still engagement!)
  async awardDownvoteReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void> {
    await this.awardCredaPoints(
      stanceAuthorId,
      'engagement',
      'downvote_received_stance', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.RECEIVE_DOWNVOTE_STANCE,
      'governance_issue',
      stanceId,
      { action: 'Received downvote on stance (engagement)' }
    );
  }

  // Award CREDA for receiving comments on stance
  async awardCommentReceivedCreda(stanceAuthorId: string, stanceId: number): Promise<void> {
    await this.awardCredaPoints(
      stanceAuthorId,
      'engagement',
      'comment_received_stance', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.RECEIVE_COMMENT_STANCE,
      'governance_issue',
      stanceId,
      { action: 'Received comment on stance' }
    );
  }

  // Award CREDA for receiving upvotes on comments
  async awardCommentUpvoteReceivedCreda(commentAuthorId: string, commentId: number): Promise<void> {
    await this.awardCredaPoints(
      commentAuthorId,
      'engagement',
      'upvote_received_comment', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_COMMENT,
      'comment',
      commentId,
      { action: 'Received upvote on comment' }
    );
  }

  // Award CREDA for receiving upvotes on reviews
  async awardReviewUpvoteReceivedCreda(reviewAuthorId: string, reviewId: number): Promise<void> {
    await this.awardCredaPoints(
      reviewAuthorId,
      'engagement',
      'upvote_received_review', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.RECEIVE_UPVOTE_COMMENT, // Same value as comment upvotes
      'review',
      reviewId,
      { action: 'Received upvote on review' }
    );
  }

  // Award CREDA for completing onboarding
  async awardOnboardingCreda(userId: string): Promise<void> {
    await this.awardCredaPoints(
      userId,
      'platform',
      'onboarding_completed', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.COMPLETE_ONBOARDING,
      'platform',
      null,
      { action: 'Completed platform onboarding' }
    );
  }

  // Award CREDA for completing welcome tour
  async awardWelcomeTourCreda(userId: string): Promise<void> {
    await this.awardCredaPoints(
      userId,
      'platform',
      'welcome_tour_completed', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.COMPLETE_WELCOME_TOUR,
      'platform',
      null,
      { action: 'Completed welcome tour' }
    );
  }

  // Apply spam penalty
  async applySpamPenalty(userId: string, contentId: number, contentType: string): Promise<void> {
    await this.awardCredaPoints(
      userId,
      'moderation',
      'spam_penalty', // Use consistent activity type
      DatabaseStorage.CREDA_REWARDS.SPAM_PENALTY,
      contentType,
      contentId,
      { action: 'Spam penalty applied (flagged by 5+ users)' }
    );
  }

  async getDaoCredaLeaderboard(daoId: number, timeframe: 'overall' | 'weekly', limit: number = 50): Promise<any[]> {
    if (timeframe === 'overall') {
      // Get overall CREDA for DAO members based on user_dao_scores
      const topUsers = await db
        .select({
          userId: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          credaPoints: users.credaPoints,
          daoScore: userDaoScores.score
        })
        .from(users)
        .innerJoin(userDaoScores, eq(users.id, userDaoScores.userId))
        .where(and(
          eq(userDaoScores.daoId, daoId),
          isNotNull(users.username)
        ))
        .orderBy(desc(users.credaPoints))
        .limit(limit);

      return topUsers.map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        points: user.credaPoints || 0
      }));
    } else {
      // Get weekly CREDA for DAO members from activities
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyPoints = await db
        .select({
          userId: credaActivities.userId,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalPoints: sum(credaActivities.credaAwarded).as('totalPoints')
        })
        .from(credaActivities)
        .innerJoin(users, eq(credaActivities.userId, users.id))
        .innerJoin(userDaoScores, eq(users.id, userDaoScores.userId))
        .where(and(
          eq(userDaoScores.daoId, daoId),
          gte(credaActivities.createdAt, oneWeekAgo)
        ))
        .groupBy(credaActivities.userId, users.username, users.profileImageUrl)
        .orderBy(desc(sum(credaActivities.credaAwarded)))
        .limit(limit);

      return weeklyPoints.map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        points: Number(user.totalPoints) || 0
      }));
    }
  }

  // GRS operations
  // Central function to apply GRS changes and log them
  async applyGrsChange(userId: string, amount: number, reason: string, relatedEntityType?: string, relatedEntityId?: number, metadata?: any): Promise<void> {
    try {
      // Get current user GRS score
      const user = await this.getUser(userId);
      if (!user) {
        console.log(`User ${userId} not found for GRS change`);
        return;
      }

      const currentScore = user.grsScore || 1300;
      const newScore = Math.max(0, Math.min(2800, currentScore + amount)); // Clamp between 0-2800

      // Update user's GRS score
      await this.updateUserGrs(userId, newScore);

      // Log the GRS change
      await db.insert(grsEvents).values({
        userId,
        changeAmount: amount,
        reason,
        relatedEntityType,
        relatedEntityId,
        metadata: metadata ? JSON.stringify(metadata) : null
      });

      // Update user's percentile
      await this.calculateGrsPercentile(userId);

      console.log(`GRS Change Applied: User ${userId} ${amount > 0 ? 'gained' : 'lost'} ${Math.abs(amount)} points (${reason}). New score: ${newScore}`);
    } catch (error) {
      console.error('Error applying GRS change:', error);
    }
  }

  // Update user's GRS score in database
  async updateUserGrs(userId: string, newScore: number): Promise<void> {
    await db.update(users)
      .set({
        grsScore: newScore,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Calculate and update user's GRS percentile
  async calculateGrsPercentile(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const userScore = user.grsScore || 1300;

    // Count users with lower scores
    const lowerScoreCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(lt(users.grsScore, userScore));

    // Get total user count
    const totalUserCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const lowerCount = lowerScoreCount[0]?.count || 0;
    const total = totalUserCount[0]?.count || 1;
    const percentile = Math.round((lowerCount / total) * 100);

    // Update user's percentile
    await db.update(users)
      .set({ grsPercentile: percentile })
      .where(eq(users.id, userId));
  }

  // Get user's GRS history
  async getGrsHistory(userId: string, limit: number = 50): Promise<GrsEvent[]> {
    return await db
      .select()
      .from(grsEvents)
      .where(eq(grsEvents.userId, userId))
      .orderBy(desc(grsEvents.createdAt))
      .limit(limit);
  }

  // Main function: Calculate stance results when stance expires
  async calculateStanceResults(stanceId: number): Promise<void> {
    try {
      // Get the stance details
      const stance = await db
        .select()
        .from(governanceIssues)
        .where(eq(governanceIssues.id, stanceId))
        .limit(1);

      if (!stance[0]) {
        console.log(`Stance ${stanceId} not found`);
        return;
      }

      const stanceData = stance[0];
      const isChampion = stanceData.stance === 'champion';
      const targetUserId = stanceData.targetUserId;
      const authorId = stanceData.authorId;

      // Get all votes for this stance
      const votes = await db
        .select()
        .from(stanceVotes)
        .where(eq(stanceVotes.stanceId, stanceId));

      if (votes.length === 0) {
        console.log(`No votes found for stance ${stanceId}`);
        return;
      }

      // Count votes by type
      const championVotes = votes.filter(v => v.voteType === 'champion').length;
      const challengeVotes = votes.filter(v => v.voteType === 'challenge').length;
      const defendVotes = votes.filter(v => v.voteType === 'defend').length;
      const opposeVotes = votes.filter(v => v.voteType === 'oppose').length;

      let majoritySupportsStance = false;
      let winningVoteType = '';

      if (isChampion) {
        // For Champion stances: Champion vs Oppose votes
        const totalChampionSupport = championVotes;
        const totalOppose = opposeVotes;
        majoritySupportsStance = totalChampionSupport > totalOppose;
        winningVoteType = majoritySupportsStance ? 'champion' : 'oppose';
      } else {
        // For Challenge stances: Challenge vs Defend votes
        const totalChallengeSupport = challengeVotes;
        const totalDefend = defendVotes;
        majoritySupportsStance = totalChallengeSupport > totalDefend;
        winningVoteType = majoritySupportsStance ? 'challenge' : 'defend';
      }

      console.log(`Stance ${stanceId} Results: Majority supports stance: ${majoritySupportsStance}, Winning vote: ${winningVoteType}`);

      // ===== IMPACT MEASURE 1: Stance Success Rate (Creator) =====
      if (majoritySupportsStance) {
        // Stance creator was correct
        await this.applyGrsChange(authorId, 250, 'stance_success', 'stance', stanceId, {
          stanceType: stanceData.stance,
          winningVote: winningVoteType,
          success: true
        });
      } else {
        // Stance creator was wrong
        await this.applyGrsChange(authorId, -150, 'stance_failure', 'stance', stanceId, {
          stanceType: stanceData.stance,
          winningVote: winningVoteType,
          success: false
        });
      }

      // ===== IMPACT MEASURE 2: Stance Target Impact =====
      if (targetUserId) {
        if (isChampion) {
          if (majoritySupportsStance) {
            // Championed and community agreed
            await this.applyGrsChange(targetUserId, 30, 'stance_target_champion_success', 'stance', stanceId, {
              championed: true,
              communitySupport: true
            });
          } else {
            // Championed but community opposed
            await this.applyGrsChange(targetUserId, -20, 'stance_target_champion_opposed', 'stance', stanceId, {
              championed: true,
              communitySupport: false
            });
          }
        } else {
          // Challenge stance
          if (majoritySupportsStance) {
            // Challenged and community agreed with challenge
            await this.applyGrsChange(targetUserId, -40, 'stance_target_challenge_success', 'stance', stanceId, {
              challenged: true,
              communitySupport: true
            });
          } else {
            // Challenged but community defended
            await this.applyGrsChange(targetUserId, 25, 'stance_target_challenge_defended', 'stance', stanceId, {
              challenged: true,
              communitySupport: false
            });
          }
        }
      }

      // ===== IMPACT MEASURE 3: Voter Accountability =====
      for (const vote of votes) {
        const voterId = vote.userId;
        const voteType = vote.voteType;

        if (voteType === winningVoteType) {
          // Voter was on winning side
          await this.applyGrsChange(voterId, 8, 'voter_accountability_correct', 'vote', vote.id, {
            stanceId,
            voteType,
            wasCorrect: true
          });
        } else {
          // Voter was on losing side
          await this.applyGrsChange(voterId, -5, 'voter_accountability_incorrect', 'vote', vote.id, {
            stanceId,
            voteType,
            wasCorrect: false
          });
        }
      }

      // Apply penalty for users who didn't vote (if we track this)
      // This would require a separate system to track who should have voted

      // ===== STANCE COMPLETION NOTIFICATIONS =====
      try {
        // Import NotificationService dynamically to avoid circular imports
        const { NotificationService } = await import('./notifications');

        // Notify stance author about the outcome
        const stanceOutcome = majoritySupportsStance ? 'succeeded' : 'failed';
        const outcomeMessage = majoritySupportsStance
          ? `Your ${stanceData.stance} stance was supported by the community!`
          : `Your ${stanceData.stance} stance was opposed by the community.`;

        await NotificationService.createNotification({
          userId: authorId,
          type: 'stance_result',
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

        // Notify target user if they exist
        if (targetUserId) {
          const targetUser = await this.getUser(targetUserId);
          const authorUser = await this.getUser(authorId);
          if (targetUser && authorUser) {
            let targetMessage = '';
            if (isChampion) {
              targetMessage = majoritySupportsStance
                ? `You were championed by ${authorUser.username} and the community agreed!`
                : `You were championed by ${authorUser.username} but the community disagreed.`;
            } else {
              targetMessage = majoritySupportsStance
                ? `You were challenged by ${authorUser.username} and the community agreed with the challenge.`
                : `You were challenged by ${authorUser.username} but the community defended you.`;
            }

            await NotificationService.createNotification({
              userId: targetUserId,
              type: 'stance_result',
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
  async getReviewsNeedingGrsImpact(): Promise<Review[]> {
    try {
      // Get all reviews that target this DAO ID
      const reviewsWithoutGrsEvents = await db
        .select()
        .from(reviews)
        .where(
          and(
            isNotNull(reviews.reviewedUserId),
            sql`NOT EXISTS (
              SELECT 1 FROM ${grsEvents}
              WHERE ${grsEvents.relatedEntityType} = 'review'
              AND ${grsEvents.relatedEntityId} = ${reviews.id}
              AND ${grsEvents.reason} LIKE '%review_received%'
            )`
          )
        )
        .orderBy(asc(reviews.createdAt));

      return reviewsWithoutGrsEvents;
    } catch (error) {
      console.error('Error getting reviews needing GRS impact:', error);
      return [];
    }
  }

  // Update review impact immediately when review is given/received
  async updateReviewImpact(reviewId: number): Promise<void> {
    try {
      // Get review details
      const review = await db
        .select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          reviewType: reviews.reviewType,
          reviewerGrs: sql<number>`reviewer.grs_score`.as('reviewerGrs')
        })
        .from(reviews)
        .leftJoin(sql`users as reviewer`, eq(reviews.reviewerId, sql`reviewer.id`))
        .where(eq(reviews.id, reviewId))
        .limit(1);

      if (!review[0]) {
        console.log(`Review ${reviewId} not found`);
        return;
      }

      const reviewData = review[0];
      const reviewerGrs = reviewData.reviewerGrs || 1300;
      const reviewType = reviewData.reviewType;
      const reviewedUserId = reviewData.reviewedUserId;

      // ===== IMPACT MEASURE 4: Review Quality Received =====
      let impactAmount = 0;
      let reason = '';

      if (reviewType === 'positive') {
        if (reviewerGrs >= 1800) {
          impactAmount = 25;
          reason = 'review_received_positive_high_grs';
        } else if (reviewerGrs >= 1300) {
          impactAmount = 15;
          reason = 'review_received_positive_medium_grs';
        } else {          impactAmount = 8;
          reason = 'review_received_positive_low_grs';
        }
      } else if (reviewType === 'negative') {
        if (reviewerGrs >= 1800) {
          impactAmount = -15;
          reason = 'review_received_negative_high_grs';
        } else if (reviewerGrs >= 1300) {
          impactAmount = -10;
          reason = 'review_received_negative_medium_grs';
        } else {
          impactAmount = -5;
          reason = 'review_received_negative_low_grs';
        }
      } else {
        // Neutral review
        impactAmount = 3;
        reason = 'review_received_neutral';
      }

      await this.applyGrsChange(reviewedUserId, impactAmount, reason, 'review', reviewId, {
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
  async evaluateReviewAccuracy(): Promise<void> {
    try {
      console.log('Starting weekly review accuracy evaluation...');

      // Get all reviews from exactly 1 week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoStart = new Date(oneWeekAgo);
      oneWeekAgoStart.setHours(0, 0, 0, 0);
      const oneWeekAgoEnd = new Date(oneWeekAgo);
      oneWeekAgoEnd.setHours(23, 59, 59, 999);

      const weekOldReviews = await db
        .select({
          id: reviews.id,
          reviewerId: reviews.reviewerId,
          reviewedUserId: reviews.reviewedUserId,
          reviewType: reviews.reviewType,
          createdAt: reviews.createdAt
        })
        .from(reviews)
        .where(
          and(
            gte(reviews.createdAt, oneWeekAgoStart),
            lt(reviews.createdAt, oneWeekAgoEnd)
          )
        );

      console.log(`Found ${weekOldReviews.length} reviews from one week ago to evaluate`);

      for (const review of weekOldReviews) {
        // Get the reviewed user's GRS at time of review and current GRS
        const reviewedUser = await this.getUser(review.reviewedUserId);
        if (!reviewedUser) continue;

        const currentGrs = reviewedUser.grsScore || 1300;

        // Get user's GRS at the time of review (approximately)
        const grsAtReviewTime = await this.estimateGrsAtTime(review.reviewedUserId, review.createdAt);
        const grsChange = currentGrs - grsAtReviewTime;

        // ===== IMPACT MEASURE 5: Review Accuracy Given =====
        let accuracyAmount = 0;
        let accuracyReason = '';

        if (review.reviewType === 'positive') {
          if (grsChange >= 200) {
            // Positive review and person improved significantly
            accuracyAmount = 80;
            accuracyReason = 'review_accuracy_positive_correct';
          } else if (grsChange <= -200) {
            // Positive review but person declined significantly
            accuracyAmount = -60;
            accuracyReason = 'review_accuracy_positive_incorrect';
          }
        } else if (review.reviewType === 'negative') {
          if (grsChange <= -200) {
            // Negative review and person declined significantly
            accuracyAmount = 70;
            accuracyReason = 'review_accuracy_negative_correct';
          } else if (grsChange >= 200) {
            // Negative review but person improved significantly
            accuracyAmount = -50;
            accuracyReason = 'review_accuracy_negative_incorrect';
          }
        }

        if (accuracyAmount !== 0) {
          await this.applyGrsChange(review.reviewerId, accuracyAmount, accuracyReason, 'review', review.id, {
            reviewType: review.reviewType,
            reviewedUserId: review.reviewedUserId,
            grsChangeOfTarget: grsChange,
            reviewAccuracy: accuracyAmount > 0 ? 'correct' : 'incorrect'
          });
        }
      }

      console.log('Weekly review accuracy evaluation complete');
    } catch (error) {
      console.error('Error evaluating review accuracy:', error);
    }
  }

  // Background job: Check for expired stances and calculate GRS
  async processExpiredStances(): Promise<void> {
    try {
      // Get all active stances that have expired
      const now = new Date();
      const expiredStances = await db
        .select()
        .from(governanceIssues)
        .where(
          and(
            eq(governanceIssues.isActive, true),
            lt(governanceIssues.expiresAt, now)
          )
        );

      console.log(`Found ${expiredStances.length} expired stances to process`);

      for (const stance of expiredStances) {
        console.log(`Processing expired stance: ${stance.id} - ${stance.title}`);

        // Mark stance as inactive
        await db.update(governanceIssues)
          .set({ isActive: false })
          .where(eq(governanceIssues.id, stance.id));

        // Calculate GRS results for this stance
        await this.calculateStanceResults(stance.id);
      }

      if (expiredStances.length > 0) {
        console.log(`Processed ${expiredStances.length} expired stances`);
      }
    } catch (error) {
      console.error('Error processing expired stances:', error);
    }
  }

  // Helper function to estimate user's GRS score at a specific time
  private async estimateGrsAtTime(userId: string, timestamp: Date): Promise<number> {
    try {
      // Get all GRS events for this user since the timestamp
      const eventsSinceTime = await db
        .select()
        .from(grsEvents)
        .where(
          and(
            eq(grsEvents.userId, userId),
            gte(grsEvents.createdAt, timestamp)
          )
        )
        .orderBy(grsEvents.createdAt);

      // Get current GRS
      const user = await this.getUser(userId);
      const currentGrs = user?.grsScore || 1300;

      // Subtract all changes since that timestamp
      const totalChangesSince = eventsSinceTime.reduce((sum, event) => sum + event.changeAmount, 0);
      const estimatedGrsAtTime = currentGrs - totalChangesSince;

      return estimatedGrsAtTime;
    } catch (error) {
      console.error('Error estimating GRS at time:', error);
      return 1300; // Default to neutral score
    }
  }

  // ======= NOTIFICATION OPERATIONS =======

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  // ======= ADMIN CONTENT MANAGEMENT =======

  async getAllStancesForAdmin(): Promise<any[]> {
    const result = await db
      .select({
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
        createdAt: governanceIssues.createdAt,
      })
      .from(governanceIssues)
      .leftJoin(users, eq(governanceIssues.authorId, users.id))
      .leftJoin(daos, eq(governanceIssues.daoId, daos.id))
      .orderBy(desc(governanceIssues.createdAt));

    return result;
  }

  async deleteStance(stanceId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete related votes first
      await tx.delete(votes).where(and(
        eq(votes.targetType, 'issue'),
        eq(votes.targetId, stanceId)
      ));

      // Delete related stance votes
      await tx.delete(stanceVotes).where(eq(stanceVotes.stanceId, stanceId));

      // Delete related comments and their votes
      const commentsToDelete = await tx
        .select({ id: comments.id })
        .from(comments)
        .where(eq(comments.issueId, stanceId));

      for (const comment of commentsToDelete) {
        await tx.delete(votes).where(and(
          eq(votes.targetType, 'comment'),
          eq(votes.targetId, comment.id)
        ));
      }

      await tx.delete(comments).where(eq(comments.issueId, stanceId));

      // Delete CREDA activities related to this stance
      await tx.delete(credaActivities).where(and(
        eq(credaActivities.targetType, 'issue'),
        eq(credaActivities.targetId, stanceId)
      ));

      // Delete GRS events related to this stance
      await tx.delete(grsEvents).where(and(
        eq(grsEvents.relatedEntityType, 'stance'),
        eq(grsEvents.relatedEntityId, stanceId)
      ));

      // Delete notifications related to this stance
      await tx.delete(notifications).where(and(
        eq(notifications.relatedEntityType, 'stance'),
        eq(notifications.relatedEntityId, stanceId)
      ));

      // Finally, delete the stance itself
      await tx.delete(governanceIssues).where(eq(governanceIssues.id, stanceId));
    });
  }

  async updateStanceExpiry(stanceId: number, expiresAt: Date): Promise<void> {
    await db
      .update(governanceIssues)
      .set({
        expiresAt,
        isActive: expiresAt > new Date() // Reactivate if new expiry is in future
      })
      .where(eq(governanceIssues.id, stanceId));
  }

  async getAllReviewsForAdmin(): Promise<any[]> {
    const result = await db
      .select({
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
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .orderBy(desc(reviews.createdAt));

    return result;
  }

  async deleteReview(reviewId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete related votes first
      await tx.delete(votes).where(and(
        eq(votes.targetType, 'review'),
        eq(votes.targetId, reviewId)
      ));

      // Delete related review comments and their votes
      const commentsToDelete = await tx
        .select({ id: reviewComments.id })
        .from(reviewComments)
        .where(eq(reviewComments.reviewId, reviewId));

      for (const comment of commentsToDelete) {
        await tx.delete(votes).where(and(
          eq(votes.targetType, 'review_comment'),
          eq(votes.targetId, comment.id)
        ));
      }

      await tx.delete(reviewComments).where(eq(reviewComments.reviewId, reviewId));

      // Delete CREDA activities related to this review
      await tx.delete(credaActivities).where(and(
        eq(credaActivities.targetType, 'review'),
        eq(credaActivities.targetId, reviewId)
      ));

      // Delete GRS events related to this review
      await tx.delete(grsEvents).where(and(
        eq(grsEvents.relatedEntityType, 'review'),
        eq(grsEvents.relatedEntityId, reviewId)
      ));

      // Delete notifications related to this review
      await tx.delete(notifications).where(and(
        eq(notifications.relatedEntityType, 'review'),
        eq(notifications.relatedEntityId, reviewId)
      ));

      // Finally, delete the review itself
      await tx.delete(reviews).where(eq(reviews.id, reviewId));
    });
  }

  async getUserNotifications(userId: string, limit = 50, unreadOnly = false): Promise<Notification[]> {
    const conditions = [eq(notifications.userId, userId)];
    if (unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }

    const result = await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return result;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, notificationId));
  }

  async markNotificationsAsRead(notificationIds: number[]): Promise<void> {
    if (notificationIds.length === 0) return;

    await db
      .update(notifications)
      .set({ read: true })
      .where(
        or(...notificationIds.map(id => eq(notifications.id, id)))
      );
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, notificationId));
  }

  async deleteNotifications(notificationIds: number[]): Promise<void> {
    if (notificationIds.length === 0) return;

    await db
      .delete(notifications)
      .where(
        or(...notificationIds.map(id => eq(notifications.id, id)))
      );
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.read, false)
        )
      );

    return result[0]?.count || 0;
  }

  // ======= NOTIFICATION SETTINGS OPERATIONS =======

  async getUserNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    const result = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));

    if (result.length === 0) {
      // Create default settings if none exist
      const defaultSettings: InsertNotificationSettings = {
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
        soundEnabled: false,
      };
      return await this.createNotificationSettings(defaultSettings);
    }

    return result[0];
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const result = await db.insert(notificationSettings).values(settings).returning();
    return result[0];
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const result = await db
      .update(notificationSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(settings.userId, userId))
      .returning();

    return result[0];
  }

  // ======= NOTIFICATION CREATION HELPERS =======

  async notifyComment(targetUserId: string, senderId: string, commentId: number, issueTitle: string): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(targetUserId);
      if (!settings?.commentNotifications || !settings?.inAppEnabled) return;

      const sender = await this.getUser(senderId);
      if (!sender) return;

      await this.createNotification({
        userId: targetUserId,
        type: 'comment',
        title: 'New comment on your post',
        message: `${sender.username || sender.firstName} commented on "${issueTitle}"`,
        senderId,
        senderUsername: sender.username,
        senderAvatar: sender.profileImageUrl,
        relatedEntityType: 'comment',
        relatedEntityId: commentId,
        actionUrl: `/governance/issue/${commentId}`, // This should be the issue ID, but we'll handle this in the route
        metadata: { issueTitle }
      });
    } catch (error) {
      console.error('Error creating comment notification:', error);
    }
  }

  async notifyVote(targetUserId: string, senderId: string, voteType: string, entityType: string, entityId: number): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(targetUserId);
      if (!settings?.voteNotifications || !settings?.inAppEnabled) return;

      const sender = await this.getUser(senderId);
      if (!sender) return;

      const voteTypeText = voteType === 'upvote' ? 'upvoted' : voteType === 'champion' ? 'voted Champion on' : 'voted Challenge on';
      const entityText = entityType === 'stance' ? 'your stance' : entityType === 'comment' ? 'your comment' : 'your post';

      await this.createNotification({
        userId: targetUserId,
        type: 'vote',
        title: 'Someone voted on your content',
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
      console.error('Error creating vote notification:', error);
    }
  }

  async notifyReview(targetUserId: string, senderId: string, reviewId: number, reviewType: string): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(targetUserId);
      if (!settings?.reviewNotifications || !settings?.inAppEnabled) return;

      const sender = await this.getUser(senderId);
      if (!sender) return;

      const reviewTypeText = reviewType === 'positive' ? 'positive' : reviewType === 'negative' ? 'negative' : 'neutral';

      await this.createNotification({
        userId: targetUserId,
        type: 'review',
        title: 'You received a new review',
        message: `${sender.username || sender.firstName} left you a ${reviewTypeText} review`,
        senderId,
        senderUsername: sender.username,
        senderAvatar: sender.profileImageUrl,
        relatedEntityType: 'review',
        relatedEntityId: reviewId,
        actionUrl: `/reviews/${reviewId}`,
        metadata: { reviewType }
      });
    } catch (error) {
      console.error('Error creating review notification:', error);
    }
  }

  async notifyFollow(targetUserId: string, senderId: string): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(targetUserId);
      if (!settings?.followNotifications || !settings?.inAppEnabled) return;

      const sender = await this.getUser(senderId);
      if (!sender) return;

      await this.createNotification({
        userId: targetUserId,
        type: 'follow',
        title: 'You have a new follower',
        message: `${sender.username || sender.firstName} started following you`,
        senderId,
        senderUsername: sender.username,
        senderAvatar: sender.profileImageUrl,
        relatedEntityType: 'user',
        relatedEntityId: parseInt(senderId) || 0,
        actionUrl: `/users/${sender.username}`,
        metadata: {}
      });
    } catch (error) {
      console.error('Error creating follow notification:', error);
    }
  }

  async notifyAchievement(userId: string, achievementTitle: string, points?: number): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(userId);
      if (!settings?.achievementNotifications || !settings?.inAppEnabled) return;

      const pointsText = points ? ` You earned ${points} CREDA!` : '';

      await this.createNotification({
        userId,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `${achievementTitle}${pointsText}`,
        actionUrl: '/achievements',
        metadata: { achievementTitle, points }
      });
    } catch (error) {
      console.error('Error creating achievement notification:', error);
    }
  }

  async notifyXpGain(userId: string, activityType: string, points: number, entityType?: string, entityId?: number): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(userId);
      if (!settings?.xpNotifications || !settings?.inAppEnabled) return;

      // Only notify for significant CREDA gains (10+ points) to avoid spam
      if (points < 10) return;

      const activityText = this.getActivityTypeText(activityType);

      await this.createNotification({
        userId,
        type: 'creda',
        title: 'CREDA Earned!',
        message: `You earned ${points} CREDA for ${activityText}`,
        relatedEntityType: entityType,
        relatedEntityId: entityId,
        actionUrl: '/profile',
        metadata: { activityType, points, entityType, entityId }
      });
    } catch (error) {
      console.error('Error creating CREDA notification:', error);
    }
  }

  async notifyGrsChange(userId: string, changeAmount: number, reason: string, relatedEntityType?: string, relatedEntityId?: number): Promise<void> {
    try {
      const settings = await this.getUserNotificationSettings(userId);
      if (!settings?.grsNotifications || !settings?.inAppEnabled) return;

      // Only notify for significant changes (absolute value > 25)
      if (Math.abs(changeAmount) < 25) return;

      const changeText = changeAmount > 0 ? `increased by ${changeAmount}` : `decreased by ${Math.abs(changeAmount)}`;
      const reasonText = this.getGrsReasonText(reason);

      await this.createNotification({
        userId,
        type: 'grs',
        title: 'GRS Score Updated',
        message: `Your GRS score ${changeText} due to ${reasonText}`,
        relatedEntityType,
        relatedEntityId,
        actionUrl: '/profile',
        metadata: { changeAmount, reason, relatedEntityType, relatedEntityId }
      });
    } catch (error) {
      console.error('Error creating GRS notification:', error);
    }
  }

  // Helper methods for text generation
  private getActivityTypeText(activityType: string): string {
    switch (activityType) {
      case 'stance_created': return 'creating a stance';
      case 'comment_made': return 'commenting on an issue';
      case 'vote_cast': return 'voting on content';
      case 'review_given': return 'giving a review';
      case 'invite_friend': return 'inviting a friend';
      case 'early_participation': return 'early participation';
      case 'onboarding_completed': return 'completing onboarding';
      case 'welcome_tour_completed': return 'finishing the welcome tour';
      case 'review_member': return 'giving a review'; // Mapping for clarity
      case 'submit_comment': return 'commenting'; // Mapping for clarity
      case 'create_stance': return 'creating a stance'; // Mapping for clarity
      default: return activityType.replace('_', ' ');
    }
  }

  private getGrsReasonText(reason: string): string {
    switch (reason) {
      case 'stance_success': return 'your successful stance';
      case 'stance_failure': return 'your failed stance';
      case 'stance_target_champion_success': return 'a championed stance that was successful';
      case 'stance_target_champion_opposed': return 'a championed stance that was opposed';
      case 'stance_target_challenge_success': return 'a challenged stance that was successful';
      case 'stance_target_challenge_defended': return 'a challenged stance that was defended';
      case 'voter_accountability_correct': return 'correct voting';
      case 'voter_accountability_incorrect': return 'incorrect voting';
      case 'review_received_positive_high_grs': return 'a positive review from a high GRS user';
      case 'review_received_positive_medium_grs': return 'a positive review from a medium GRS user';
      case 'review_received_positive_low_grs': return 'a positive review from a low GRS user';
      case 'review_received_negative_high_grs': return 'a negative review from a high GRS user';
      case 'review_received_negative_medium_grs': return 'a negative review from a medium GRS user';
      case 'review_received_negative_low_grs': return 'a negative review from a low GRS user';
      case 'review_received_neutral': return 'a neutral review';
      case 'review_accuracy_positive_correct': return 'accurate positive review';
      case 'review_accuracy_positive_incorrect': return 'inaccurate positive review';
      case 'review_accuracy_negative_correct': return 'accurate negative review';
      case 'review_accuracy_negative_incorrect': return 'inaccurate negative review';
      default: return reason.replace('_', ' ');
    }
  }

  // Analytics methods for admin dashboard
  async getGrowthAnalytics(timeframe: 'daily' | 'weekly' = 'daily', days: number = 30): Promise<any> {
    try {
      const dateColumn = timeframe === 'daily'
        ? sql<string>`DATE(created_at)`
        : sql<string>`DATE_TRUNC('week', created_at)`;

      const dateFilter = sql`created_at >= NOW() - INTERVAL '${sql.raw(days.toString())} days'`;

      // Daily/Weekly Active Users (users who performed any action in last 7 days)
      const activeUsersQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(DISTINCT user_id)`
        })
        .from(credaActivities)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // New User Registrations
      const newUsersQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(*)`
        })
        .from(users)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // Stances Created
      const stancesQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(*)`
        })
        .from(governanceIssues)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // Reviews Created
      const reviewsQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(*)`
        })
        .from(reviews)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // Comments Created
      const commentsQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(*)`
        })
        .from(comments)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // CREDA Awarded
      const xpQuery = db
        .select({
          date: dateColumn,
          total: sql<number>`SUM(xp_awarded)`
        })
        .from(credaActivities)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // Votes Cast
      const votesQuery = db
        .select({
          date: dateColumn,
          count: sql<number>`COUNT(*)`
        })
        .from(votes)
        .where(dateFilter)
        .groupBy(dateColumn)
        .orderBy(dateColumn);

      // Execute all queries in parallel
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

  async getEngagementMetrics(): Promise<any> {
    try {
      // Top engaged users by CREDA in last 7 days
      const topActiveUsers = await db
        .select({
          userId: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          totalCreda: sql<number>`SUM(creda_awarded)`,
          activities: sql<number>`COUNT(*)`
        })
        .from(credaActivities)
        .innerJoin(users, eq(credaActivities.userId, users.id))
        .where(sql`creda_activities.created_at >= NOW() - INTERVAL '7 days'`)
        .groupBy(users.id, users.username, users.firstName, users.lastName, users.profileImageUrl)
        .orderBy(sql`SUM(creda_awarded) DESC`)
        .limit(10);

      // Most active stances by engagement
      const topStances = await db
        .select({
          id: governanceIssues.id,
          title: governanceIssues.title,
          stance: governanceIssues.stance,
          authorUsername: users.username,
          upvotes: governanceIssues.upvotes,
          downvotes: governanceIssues.downvotes,
          commentCount: governanceIssues.commentCount,
          totalEngagement: sql<number>`upvotes + downvotes + comment_count`,
          createdAt: governanceIssues.createdAt
        })
        .from(governanceIssues)
        .innerJoin(users, eq(governanceIssues.authorId, users.id))
        .where(sql`governance_issues.created_at >= NOW() - INTERVAL '7 days'`)
        .orderBy(sql`upvotes + downvotes + comment_count DESC`)
        .limit(10);

      // Average session metrics
      const avgMetrics = await db
        .select({
          avgStancesPerUser: sql<number>`AVG(stance_count)`,
          avgCommentsPerStance: sql<number>`AVG(comment_count)`,
          avgVotesPerStance: sql<number>`AVG(upvotes + downvotes)`
        })
        .from(
          db.select({
            userId: governanceIssues.authorId,
            stanceCount: sql<number>`COUNT(*)`.as('stance_count'),
            commentCount: sql<number>`AVG(comment_count)`.as('comment_count'),
            upvotes: sql<number>`AVG(upvotes)`.as('upvotes'),
            downvotes: sql<number>`AVG(downvotes)`.as('downvotes')
          })
          .from(governanceIssues)
          .groupBy(governanceIssues.authorId)
          .as('user_stats')
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

  async getRetentionMetrics(): Promise<any> {
    try {
      // Users who returned in the last 7 days after being inactive
      const returningUsers = await db
        .select({
          count: sql<number>`COUNT(DISTINCT user_id)`
        })
        .from(credaActivities)
        .where(sql`
          created_at >= NOW() - INTERVAL '7 days' AND
          user_id IN (
            SELECT DISTINCT user_id
            FROM creda_activities
            WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
          )
        `);

      // New users in last 7 days who are still active
      const newActiveUsers = await db
        .select({
          count: sql<number>`COUNT(DISTINCT u.id)`
        })
        .from(sql`users u`)
        .innerJoin(sql`creda_activities xa`, sql`u.id = xa.user_id`)
        .where(sql`
          u.created_at >= NOW() - INTERVAL '7 days' AND
          xa.created_at >= NOW() - INTERVAL '7 days'
        `);

      // Daily streak distribution
      const streakDistribution = await db
        .select({
          streakRange: sql<string>`
            CASE
              WHEN daily_streak = 0 THEN '0 days'
              WHEN daily_streak BETWEEN 1 AND 3 THEN '1-3 days'
              WHEN daily_streak BETWEEN 4 AND 7 THEN '4-7 days'
              WHEN daily_streak BETWEEN 8 AND 14 THEN '8-14 days'
              WHEN daily_streak BETWEEN 15 AND 30 THEN '15-30 days'
              ELSE '30+ days'
            END
          `,
          count: sql<number>`COUNT(*)`
        })
        .from(users)
        .groupBy(sql`
          CASE
            WHEN daily_streak = 0 THEN '0 days'
            WHEN daily_streak BETWEEN 1 AND 3 THEN '1-3 days'
            WHEN daily_streak BETWEEN 4 AND 7 THEN '4-7 days'
            WHEN daily_streak BETWEEN 8 AND 14 THEN '8-14 days'
            WHEN daily_streak BETWEEN 15 AND 30 THEN '15-30 days'
            ELSE '30+ days'
          END
        `)
        .orderBy(sql`MIN(daily_streak)`);

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

  async getPlatformOverview(): Promise<any> {
    try {
      // Total counts
      const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
      const totalStances = await db.select({ count: sql<number>`count(*)` }).from(governanceIssues);
      const totalReviews = await db.select({ count: sql<number>`count(*)` }).from(reviews);
      const totalComments = await db.select({ count: sql<number>`count(*)` }).from(comments);
      const totalVotes = await db.select({ count: sql<number>`count(*)` }).from(votes);
      const totalXpAwarded = await db.select({ total: sql<number>`COALESCE(SUM(xp_awarded), 0)` }).from(credaActivities);

      // 30-day growth rates
      const usersLast30Days = await db.select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`created_at >= NOW() - INTERVAL '30 days'`);

      const stancesLast30Days = await db.select({ count: sql<number>`count(*)` })
        .from(governanceIssues)
        .where(sql`created_at >= NOW() - INTERVAL '30 days'`);

      const reviewsLast30Days = await db.select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(sql`created_at >= NOW() - INTERVAL '30 days'`);

      // Average GRS score
      const avgGrsScore = await db.select({ avg: sql<number>`AVG(grs_score)` }).from(users);

      // Active users (users who performed any action in last 7 days)
      const activeUsers = await db.select({ count: sql<number>`COUNT(DISTINCT user_id)` })
        .from(credaActivities)
        .where(sql`created_at >= NOW() - INTERVAL '7 days'`);

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
  async getDailyTasksProgress(userId: string, taskDate: string): Promise<DailyTasksProgress | undefined> {
    const [result] = await db
      .select()
      .from(dailyTasksProgress)
      .where(and(
        eq(dailyTasksProgress.userId, userId),
        eq(dailyTasksProgress.taskDate, taskDate)
      ));
    return result;
  }

  async upsertDailyTasksProgress(data: InsertDailyTasksProgress): Promise<DailyTasksProgress> {
    const [result] = await db
      .insert(dailyTasksProgress)
      .values(data)
      .onConflictDoUpdate({
        target: [dailyTasksProgress.userId, dailyTasksProgress.taskDate],
        set: {
          engagementActionsCompleted: data.engagementActionsCompleted,
          isStreakEligible: data.isStreakEligible,
          updatedAt: new Date(),
        }
      })
      .returning();
    return result;
  }

  async updateEngagementActionCount(userId: string, taskDate: string, increment = 1): Promise<void> {
    const existingProgress = await this.getDailyTasksProgress(userId, taskDate);

    const newCount = (existingProgress?.engagementActionsCompleted || 0) + increment;
    const resetInfo = await this.getResetTimeInfo();
    const isStreakEligible = newCount >= resetInfo.minActionsForStreak;

    await this.upsertDailyTasksProgress({
      userId,
      taskDate,
      engagementActionsCompleted: newCount,
      isStreakEligible,
    });
  }

  async getDailyTasksConfig(configKey: string): Promise<DailyTasksConfig | undefined> {
    const [result] = await db
      .select()
      .from(dailyTasksConfig)
      .where(eq(dailyTasksConfig.configKey, configKey));
    return result;
  }

  async upsertDailyTasksConfig(data: InsertDailyTasksConfig): Promise<DailyTasksConfig> {
    const [result] = await db
      .insert(dailyTasksConfig)
      .values(data)
      .onConflictDoUpdate({
        target: [dailyTasksConfig.configKey],
        set: {
          configValue: data.configValue,
          description: data.description,
          updatedAt: new Date(),
        }
      })
      .returning();
    return result;
  }

  // Streak operations
  async updateUserStreak(userId: string, currentStreak: number, longestStreak?: number): Promise<void> {
    const updateData: any = {
      dailyStreak: currentStreak,
      lastStreakDate: new Date(),
    };

    if (longestStreak !== undefined) {
      updateData.longestStreak = longestStreak;
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));
  }

  async processStreaksForAllUsers(targetDate: string): Promise<void> {
    // Get all users with their current streak data
    const allUsers = await db
      .select({
        id: users.id,
        dailyStreak: users.dailyStreak,
        longestStreak: users.longestStreak,
      })
      .from(users);

    const resetInfo = await this.getResetTimeInfo();

    for (const user of allUsers) {
      const progress = await this.getDailyTasksProgress(user.id, targetDate);

      if (progress && progress.isStreakEligible) {
        // User maintained streak - increment
        const newCurrentStreak = (user.dailyStreak || 0) + 1;
        const newLongestStreak = Math.max(user.longestStreak || 0, newCurrentStreak);

        await this.updateUserStreak(user.id, newCurrentStreak, newLongestStreak);
      } else {
        // User broke streak - reset to 0
        await this.updateUserStreak(user.id, 0);
      }
    }
  }

  async getEngagementActionsForUser(userId: string, date: string): Promise<{ activityType: string; count: number; }[]> {
    // Get all CREDA activities for the user on the specific date
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    const activities = await db
      .select({
        activityType: credaActivities.activityType,
        count: sql<number>`COUNT(*)`
      })
      .from(credaActivities)
      .where(and(
        eq(credaActivities.userId, userId),
        gte(credaActivities.createdAt, startOfDay),
        lt(credaActivities.createdAt, endOfDay)
      ))
      .groupBy(credaActivities.activityType);

    return activities;
  }

  async getResetTimeInfo(): Promise<{ resetTimeUtc: string; minActionsForStreak: number; }> {
    const resetTimeConfig = await this.getDailyTasksConfig('reset_time_utc');
    const minActionsConfig = await this.getDailyTasksConfig('min_actions_for_streak');

    return {
      resetTimeUtc: resetTimeConfig?.configValue || '00:00',
      minActionsForStreak: parseInt(minActionsConfig?.configValue || '3'),
    };
  }

  // Company User Management Methods
  async createCompanyUser(companyUser: InsertCompanyUser): Promise<SelectCompanyUser> {
    const [newUser] = await db.insert(companyUsers).values(companyUser).returning();
    return newUser;
  }

  async getCompanyUsers(companyId: number): Promise<SelectCompanyUser[]> {
    return db.select().from(companyUsers).where(eq(companyUsers.companyId, companyId));
  }

  async getCompanyUserByEmail(email: string): Promise<SelectCompanyUser | undefined> {
    const [user] = await db.select().from(companyUsers).where(eq(companyUsers.email, email));
    return user;
  }

  async updateCompanyUserLastLogin(id: number): Promise<void> {
    await db.update(companyUsers)
      .set({ lastLogin: new Date() })
      .where(eq(companyUsers.id, id));
  }

  async deleteCompanyUser(id: number): Promise<void> {
    await db.delete(companyUsers).where(eq(companyUsers.id, id));
  }

  // Review Reporting Methods
  async reportReview(report: InsertReviewReport): Promise<ReviewReport> {
    const [reviewReport] = await db.insert(reviewReports).values(report).returning();
    return reviewReport;
  }

  async getReportedReviewsForProject(projectId: string): Promise<any[]> {
    const reports = await db
      .select({
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
          updatedAt: projectReviews.updatedAt,
        },
        reportedByUser: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        }
      })
      .from(reviewReports)
      .innerJoin(projectReviews, eq(reviewReports.reviewId, projectReviews.id))
      .innerJoin(users, eq(reviewReports.reportedBy, users.id))
      .where(eq(projectReviews.projectId, projectId))
      .orderBy(desc(reviewReports.createdAt));

    // Manually fetch reviewer data for each review
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
              twitterHandle: reviewer.twitterHandle,
            } : null
          }
        };
      })
    );

    return reportsWithReviewers;
  }

  async getReportedReviewsForCompany(companyId: number): Promise<any[]> {
    const company = await this.getCompanyById(companyId);
    if (!company) {
      return [];
    }
    return this.getReportedReviewsForProject(company.externalId);
  }

  // Content Reporting Methods (comprehensive spam reporting across all content types)
  async reportContent(report: InsertContentReport): Promise<ContentReport> {
    const [contentReport] = await db.insert(contentReports).values(report).returning();
    return contentReport;
  }

  async awardSpamReportCreda(userId: string, contentType: string, contentId: number): Promise<void> {
    await this.awardCredaPoints(
      userId,
      'moderation',
      'spam_report',
      DatabaseStorage.CREDA_REWARDS.REPORT_SPAM,
      contentType,
      contentId,
      {
        action: 'Reported spam content',
        contentType,
        contentId
      }
    );
  }

  async getContentReports(status?: string): Promise<ContentReport[]> {
    if (status) {
      return db.select().from(contentReports)
        .where(eq(contentReports.status, status))
        .orderBy(desc(contentReports.createdAt));
    }
    return db.select().from(contentReports).orderBy(desc(contentReports.createdAt));
  }

  async getContentReportsByUser(userId: string): Promise<ContentReport[]> {
    return db.select().from(contentReports)
      .where(eq(contentReports.reportedBy, userId))
      .orderBy(desc(contentReports.createdAt));
  }

  // Admin Analytics Methods
  async getAdminCompanyAnalytics(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    verifiedCompanies: number;
    totalReviews: number;
    averageRating: number;
  }> {
    const companiesCount = await db.select({
      total: sql<number>`COUNT(*)`,
      active: sql<number>`SUM(CASE WHEN ${companies.isActive} THEN 1 ELSE 0 END)`,
      verified: sql<number>`SUM(CASE WHEN ${companies.isVerified} THEN 1 ELSE 0 END)`,
    }).from(companies);

    const reviewsStats = await db.select({
      total: sql<number>`COUNT(*)`,
      avgRating: sql<number>`AVG(${projectReviews.rating})`,
    }).from(projectReviews);

    return {
      totalCompanies: Number(companiesCount[0]?.total || 0),
      activeCompanies: Number(companiesCount[0]?.active || 0),
      verifiedCompanies: Number(companiesCount[0]?.verified || 0),
      totalReviews: Number(reviewsStats[0]?.total || 0),
      averageRating: Number(reviewsStats[0]?.avgRating || 0),
    };
  }
}

export const storage = new DatabaseStorage();