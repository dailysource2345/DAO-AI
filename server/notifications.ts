import { storage } from "./storage";

export interface CreateNotificationData {
  userId: string;
  type: 'comment' | 'vote' | 'review' | 'follow' | 'achievement' | 'system' | 'creda' | 'grs' | 'stance_result' | 'stance' | 'invite_reward' | 'creda_milestone' | 'mention' | 'streak' | 'invite_used' | 'comment_reply';
  title: string;
  message: string;
  actionUrl?: string;
  senderUserId?: string;
  metadata?: any;
}

export class NotificationService {
  /**
   * Create a new notification for a user
   */
  static async createNotification(data: CreateNotificationData): Promise<void> {
    try {
      // Create minimal notification data - only required fields
      const notificationData = {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
      };

      // Add optional fields only if they exist
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
  static async notifyNewComment(
    postOwnerId: string, 
    commenterUserId: string, 
    commenterUsername: string,
    issueTitle: string, 
    issueId: number,
    contentType: 'stance' | 'post' = 'stance',
    commentContent?: string
  ): Promise<void> {
    if (postOwnerId === commenterUserId) {
      return; // Don't notify yourself
    }

    const title = contentType === 'stance' ? 'New comment on your stance' : 'New comment on your post';
    
    // Create a better message with comment preview if available
    let message;
    if (commentContent && commentContent.length > 10) {
      const commentPreview = commentContent.length > 50 
        ? commentContent.substring(0, 50) + '...' 
        : commentContent;
      message = `${commenterUsername}: "${commentPreview}"`;
    } else {
      message = `${commenterUsername} commented on "${issueTitle}"`;
    }

    await this.createNotification({
      userId: postOwnerId,
      type: 'comment',
      title: title,
      message: message,
      actionUrl: `/issue/${issueId}`,
      senderUserId: commenterUserId,
      metadata: { issueId, issueTitle, contentType, commentContent }
    });
  }

  /**
   * Notify user when someone votes on their stance or review
   */
  static async notifyNewVote(
    targetUserId: string, 
    voterUserId: string, 
    voterUsername: string,
    voteType: string, 
    targetType: 'stance' | 'review',
    itemTitle: string,
    itemId: number
  ): Promise<void> {
    if (targetUserId === voterUserId) return; // Don't notify yourself

    const actionUrl = targetType === 'stance' ? `/issue/${itemId}` : `/review/${itemId}`;

    await this.createNotification({
      userId: targetUserId,
      type: 'vote',
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
  static async notifyNewReview(
    revieweeUserId: string, 
    reviewerUserId: string, 
    reviewerUsername: string,
    rating: number,
    reviewText?: string
  ): Promise<void> {
    if (revieweeUserId === reviewerUserId) return; // Don't notify yourself

    await this.createNotification({
      userId: revieweeUserId,
      type: 'review',
      title: 'New review received',
      message: `${reviewerUsername} gave you a ${rating}-star review${reviewText ? `: "${reviewText.substring(0, 50)}..."` : ''}`,
      actionUrl: `/my-reviews`,
      senderUserId: reviewerUserId,
      metadata: { rating, reviewText }
    });
  }

  /**
   * Notify user when someone creates a stance targeting them
   */
  static async notifyStanceCreation(
    targetUserId: string, 
    stanceCreatorUserId: string, 
    stanceCreatorUsername: string,
    stanceType: string,
    stanceTitle: string,
    stanceId: number
  ): Promise<void> {
    if (targetUserId === stanceCreatorUserId) return; // Don't notify yourself

    const stanceAction = stanceType === 'champion' ? 'championed' : stanceType === 'challenge' ? 'challenged' : 'opposed';
    
    await this.createNotification({
      userId: targetUserId,
      type: 'stance',
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
  static async notifyNewFollower(
    followedUserId: string, 
    followerUserId: string, 
    followerUsername: string
  ): Promise<void> {
    await this.createNotification({
      userId: followedUserId,
      type: 'follow',
      title: 'You have a new follower',
      message: `${followerUsername} started following you`,
      actionUrl: `/profile/${followerUsername}`,
      senderUserId: followerUserId,
      metadata: { followerUsername }
    });
  }

  /**
   * Notify user about CREDA gains
   */
  static async notifyCredaGain(
    userId: string, 
    credaAmount: number, 
    activityType: string,
    description?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'creda',
      title: `+${credaAmount} CREDA earned!`,
      message: description || `You earned ${credaAmount} CREDA for ${activityType}`,
      actionUrl: '/rewards',
      metadata: { credaAmount, activityType }
    });
  }

  /**
   * Notify user about GRS score changes
   */
  static async notifyGrsChange(
    userId: string, 
    oldScore: number, 
    newScore: number,
    reason?: string
  ): Promise<void> {
    const change = newScore - oldScore;
    const changeText = change > 0 ? `+${change}` : `${change}`;

    await this.createNotification({
      userId,
      type: 'grs',
      title: `GRS Score ${change > 0 ? 'increased' : 'decreased'}`,
      message: `Your GRS score changed by ${changeText} (now ${newScore})${reason ? ` - ${reason}` : ''}`,
      actionUrl: '/rewards',
      metadata: { oldScore, newScore, change, reason }
    });
  }

  /**
   * Notify user about achievements
   */
  static async notifyAchievement(
    userId: string, 
    achievementTitle: string, 
    achievementDescription: string,
    achievementType?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `You earned "${achievementTitle}" - ${achievementDescription}`,
      actionUrl: '/achievements',
      metadata: { achievementTitle, achievementDescription, achievementType }
    });
  }

  /**
   * Send system-wide notifications
   */
  static async notifySystem(
    userId: string, 
    title: string, 
    message: string,
    actionUrl?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'system',
      title,
      message,
      actionUrl,
      metadata: { isSystem: true }
    });
  }

  /**
   * Send system notification to all users
   */
  static async notifyAllUsers(
    title: string, 
    message: string,
    actionUrl?: string
  ): Promise<void> {
    try {
      const allUsers = await storage.getAllUsers();

      // Create notifications for all users in batches to avoid overwhelming the system
      const batchSize = 50;
      for (let i = 0; i < allUsers.length; i += batchSize) {
        const batch = allUsers.slice(i, i + batchSize);
        await Promise.all(
          batch.map(user => 
            this.notifySystem(user.id, title, message, actionUrl)
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
  static async notifyMention(
    mentionedUserId: string,
    mentionerUserId: string,
    mentionerUsername: string,
    contentType: 'comment' | 'stance',
    contentTitle: string,
    contentId: number,
    contentPreview?: string
  ): Promise<void> {
    if (mentionedUserId === mentionerUserId) return; // Don't notify yourself

    const actionUrl = contentType === 'stance' ? `/issue/${contentId}` : `/issue/${contentId}`;
    const preview = contentPreview ? `: "${contentPreview.substring(0, 50)}..."` : '';

    await this.createNotification({
      userId: mentionedUserId,
      type: 'mention',
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
  static async notifyStreakMilestone(
    userId: string,
    streakDays: number,
    credaBonus?: number
  ): Promise<void> {
    const milestoneText = streakDays === 7 ? 'Week' : streakDays === 30 ? 'Month' : `${streakDays} days`;
    const bonusText = credaBonus ? ` and earned ${credaBonus} bonus CREDA!` : '!';

    await this.createNotification({
      userId,
      type: 'streak',
      title: `🔥 ${streakDays}-Day Streak!`,
      message: `Amazing! You've maintained a ${milestoneText} streak of daily activity${bonusText}`,
      actionUrl: '/rewards',
      metadata: { streakDays, credaBonus }
    });
  }

  /**
   * Notify user when someone uses their invite code
   */
  static async notifyInviteCodeUsed(
    inviterUserId: string,
    newUserUsername: string,
    credaReward: number
  ): Promise<void> {
    await this.createNotification({
      userId: inviterUserId,
      type: 'invite_used',
      title: 'Your invite was used!',
      message: `${newUserUsername} joined using your invite code! You earned ${credaReward} CREDA.`,
      actionUrl: '/invites',
      metadata: { newUserUsername, credaReward }
    });
  }

  /**
   * Notify user when someone replies to their comment
   */
  static async notifyCommentReply(
    originalCommentAuthorId: string,
    replyAuthorUserId: string,
    replyAuthorUsername: string,
    stanceTitle: string,
    stanceId: number,
    replyContent?: string
  ): Promise<void> {
    if (originalCommentAuthorId === replyAuthorUserId) return; // Don't notify yourself

    const replyPreview = replyContent && replyContent.length > 10 
      ? replyContent.substring(0, 50) + '...' 
      : '';

    await this.createNotification({
      userId: originalCommentAuthorId,
      type: 'comment_reply',
      title: 'Someone replied to your comment',
      message: `${replyAuthorUsername} replied to your comment on "${stanceTitle}"${replyPreview ? `: "${replyPreview}"` : ''}`,
      actionUrl: `/issue/${stanceId}`,
      senderUserId: replyAuthorUserId,
      metadata: { stanceId, stanceTitle, replyContent }
    });
  }

  /**
   * Notify user about stance result when it expires
   */
  static async notifyStanceResult(
    stanceAuthorId: string,
    stanceTitle: string,
    stanceId: number,
    result: 'successful' | 'failed',
    championVotes: number,
    challengeVotes: number,
    opposeVotes: number
  ): Promise<void> {
    const resultText = result === 'successful' ? 'succeeded' : 'failed';
    const totalVotes = championVotes + challengeVotes + opposeVotes;

    await this.createNotification({
      userId: stanceAuthorId,
      type: 'stance_result',
      title: `Your stance ${resultText}!`,
      message: `"${stanceTitle}" ${resultText} with ${totalVotes} total votes (${championVotes} champion, ${challengeVotes} challenge, ${opposeVotes} oppose)`,
      actionUrl: `/issue/${stanceId}`,
      metadata: { stanceId, result, championVotes, challengeVotes, opposeVotes, totalVotes }
    });
  }
}

export { NotificationService as notifications };