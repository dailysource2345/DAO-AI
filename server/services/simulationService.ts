import { storage } from '../storage';
import { ogStorageService } from './ogStorageService';

interface SimulationConfig {
  actionType: 'votes' | 'reviews' | 'comments' | 'mixed';
  targetCount: number;
  durationMinutes: number;
  targetThreshold?: number;
}

interface SimulationStatus {
  isRunning: boolean;
  actionType: string;
  targetCount: number;
  completedCount: number;
  durationMinutes: number;
  startedAt: Date | null;
  estimatedEndAt: Date | null;
  actions: Array<{
    type: string;
    userId: string;
    timestamp: Date;
    onChainTxHash?: string;
  }>;
}

class SimulationService {
  private isRunning = false;
  private currentConfig: SimulationConfig | null = null;
  private completedActions: SimulationStatus['actions'] = [];
  private startedAt: Date | null = null;
  private timeouts: NodeJS.Timeout[] = [];
  private actionQueue: Array<() => Promise<void>> = [];

  getStatus(): SimulationStatus {
    return {
      isRunning: this.isRunning,
      actionType: this.currentConfig?.actionType || 'none',
      targetCount: this.currentConfig?.targetCount || 0,
      completedCount: this.completedActions.length,
      durationMinutes: this.currentConfig?.durationMinutes || 0,
      startedAt: this.startedAt,
      estimatedEndAt: this.startedAt && this.currentConfig 
        ? new Date(this.startedAt.getTime() + this.currentConfig.durationMinutes * 60 * 1000)
        : null,
      actions: this.completedActions.slice(-50),
    };
  }

  async start(config: SimulationConfig): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return { success: false, message: 'Simulation already running' };
    }

    this.isRunning = true;
    this.currentConfig = config;
    this.completedActions = [];
    this.startedAt = new Date();
    this.timeouts = [];

    console.log(`[Simulation] Starting ${config.actionType} simulation: ${config.targetCount} actions over ${config.durationMinutes} minutes`);

    try {
      await this.scheduleActions(config);
      return { success: true, message: `Started simulation: ${config.targetCount} ${config.actionType} over ${config.durationMinutes} minutes` };
    } catch (error) {
      this.stop();
      return { success: false, message: `Failed to start simulation: ${error}` };
    }
  }

  stop(): { success: boolean; message: string } {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.isRunning = false;
    
    const completed = this.completedActions.length;
    console.log(`[Simulation] Stopped. Completed ${completed} actions.`);
    
    return { 
      success: true, 
      message: `Simulation stopped. Completed ${completed} of ${this.currentConfig?.targetCount || 0} actions.` 
    };
  }

  private async scheduleActions(config: SimulationConfig) {
    const totalDurationMs = config.durationMinutes * 60 * 1000;
    const intervalMs = totalDurationMs / config.targetCount;
    
    const users = await this.getActiveUsers(Math.min(config.targetCount * 2, 100));
    if (users.length === 0) {
      throw new Error('No users available for simulation');
    }

    const contentPool = await this.getContentPool();
    if (contentPool.issues.length === 0 && contentPool.reviews.length === 0) {
      throw new Error('No content available for simulation');
    }

    for (let i = 0; i < config.targetCount; i++) {
      const randomDelay = intervalMs * i + (Math.random() - 0.5) * intervalMs * 0.5;
      const user = users[Math.floor(Math.random() * users.length)];
      
      const timeout = setTimeout(async () => {
        if (!this.isRunning) return;
        
        try {
          await this.executeAction(config.actionType, user, contentPool);
        } catch (error) {
          console.error(`[Simulation] Action failed:`, error);
        }
      }, Math.max(0, randomDelay));
      
      this.timeouts.push(timeout);
    }

    const endTimeout = setTimeout(() => {
      if (this.isRunning) {
        console.log(`[Simulation] Completed all scheduled actions`);
        this.isRunning = false;
      }
    }, totalDurationMs + 5000);
    
    this.timeouts.push(endTimeout);
  }

  private async getActiveUsers(limit: number): Promise<Array<{ id: string; username: string }>> {
    try {
      const allUsers = await storage.getAllUsers();
      const activeUsers = allUsers
        .filter(u => u.hasInviteAccess && !u.isSuspended && !u.isUnclaimedProfile)
        .slice(0, limit)
        .map(u => ({ id: u.id, username: u.username || 'user' }));
      
      console.log(`[Simulation] Found ${activeUsers.length} active users for simulation`);
      return activeUsers;
    } catch (error) {
      console.error('[Simulation] Error fetching users:', error);
      return [];
    }
  }

  private async getContentPool(): Promise<{
    issues: Array<{ id: number; title: string }>;
    reviews: Array<{ id: number; content: string; reviewedUserId: string | null }>;
    comments: Array<{ id: number; content: string; issueId: number }>;
  }> {
    try {
      const issues = await storage.getActiveGovernanceIssues();
      let activeIssues = issues.filter((i: any) => !i.isExpired && i.status === 'active');
      
      if (activeIssues.length === 0) {
        activeIssues = issues.slice(0, 50);
        console.log(`[Simulation] No active issues found, using ${activeIssues.length} recent issues`);
      }
      
      let reviews: any[] = [];
      let comments: any[] = [];
      
      try {
        for (const issue of activeIssues.slice(0, 10)) {
          const issueComments = await storage.getCommentsByIssue(issue.id);
          comments.push(...issueComments.map((c: any) => ({ ...c, issueId: issue.id })));
        }
      } catch (e) {
        comments = [];
      }

      console.log(`[Simulation] Content pool: ${activeIssues.length} issues, ${reviews.length} reviews, ${comments.length} comments`);

      return {
        issues: activeIssues.map((i: any) => ({ id: i.id, title: i.title })),
        reviews: reviews.map((r: any) => ({ id: r.id, content: r.content, reviewedUserId: r.reviewedUserId })),
        comments: comments.slice(0, 100),
      };
    } catch (error) {
      console.error('[Simulation] Error fetching content pool:', error);
      return { issues: [], reviews: [], comments: [] };
    }
  }

  private async executeAction(
    actionType: SimulationConfig['actionType'],
    user: { id: string; username: string },
    contentPool: Awaited<ReturnType<typeof this.getContentPool>>
  ) {
    let type = actionType;
    if (actionType === 'mixed') {
      const types: Array<'votes' | 'comments'> = ['votes', 'votes', 'votes', 'comments'];
      type = types[Math.floor(Math.random() * types.length)];
    }

    let result: { type: string; txHash?: string } | null = null;

    switch (type) {
      case 'votes':
        result = await this.createSimulatedVote(user, contentPool);
        break;
      case 'comments':
        result = await this.createSimulatedComment(user, contentPool);
        break;
      case 'reviews':
        result = await this.createSimulatedReview(user, contentPool);
        break;
    }

    if (result) {
      this.completedActions.push({
        type: result.type,
        userId: user.id,
        timestamp: new Date(),
        onChainTxHash: result.txHash,
      });
      console.log(`[Simulation] Action completed: ${result.type} by ${user.username} (${this.completedActions.length}/${this.currentConfig?.targetCount})`);
    }
  }

  private async createSimulatedVote(
    user: { id: string; username: string },
    contentPool: Awaited<ReturnType<typeof this.getContentPool>>
  ): Promise<{ type: string; txHash?: string } | null> {
    const targetTypes = ['issue', 'comment'];
    const targetType = targetTypes[Math.floor(Math.random() * targetTypes.length)] as 'issue' | 'comment';
    
    let targetId: number;
    let targetContent: string;
    
    if (targetType === 'issue' && contentPool.issues.length > 0) {
      const issue = contentPool.issues[Math.floor(Math.random() * contentPool.issues.length)];
      targetId = issue.id;
      targetContent = issue.title;
    } else if (contentPool.comments.length > 0) {
      const comment = contentPool.comments[Math.floor(Math.random() * contentPool.comments.length)];
      targetId = comment.id;
      targetContent = comment.content?.slice(0, 50) || 'comment';
    } else if (contentPool.issues.length > 0) {
      const issue = contentPool.issues[Math.floor(Math.random() * contentPool.issues.length)];
      targetId = issue.id;
      targetContent = issue.title;
    } else {
      return null;
    }

    try {
      const existingVote = await storage.getUserVote(user.id, targetType, targetId);
      if (existingVote) {
        return null;
      }

      const vote = await storage.createVote({
        userId: user.id,
        targetType,
        targetId,
        voteType: 'up',
      });

      let txHash: string | undefined;
      if (ogStorageService.isAvailable()) {
        try {
          const ogTargetType = targetType === 'issue' ? 'ISSUE' : 'COMMENT';
          const result = await ogStorageService.recordVoteCast(
            vote.id,
            user.id,
            targetId,
            ogTargetType as 'ISSUE' | 'COMMENT' | 'REVIEW',
            'up',
            { simulated: true, username: user.username }
          );
          txHash = result?.txHash || undefined;
        } catch (e) {
          console.error('[Simulation] 0G recording failed:', e);
        }
      }

      return { type: 'vote', txHash };
    } catch (error) {
      console.error('[Simulation] Vote creation failed:', error);
      return null;
    }
  }

  private async createSimulatedComment(
    user: { id: string; username: string },
    contentPool: Awaited<ReturnType<typeof this.getContentPool>>
  ): Promise<{ type: string; txHash?: string } | null> {
    if (contentPool.issues.length === 0) return null;

    const issue = contentPool.issues[Math.floor(Math.random() * contentPool.issues.length)];
    
    const commentTemplates = [
      "Great governance proposal! Looking forward to seeing this implemented.",
      "I support this initiative. The community benefits are clear.",
      "This aligns well with our long-term vision for the platform.",
      "Interesting perspective. Would love to see more details.",
      "Strong proposal. The technical approach seems solid.",
      "I think this could really benefit the ecosystem.",
      "Well thought out proposal with clear objectives.",
      "This addresses an important community concern.",
      "Good direction for the project. Let's move forward.",
      "Thoughtful analysis of the current situation.",
    ];
    
    const content = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];

    try {
      const comment = await storage.createComment({
        content,
        authorId: user.id,
        issueId: issue.id,
        stance: Math.random() > 0.3 ? 'for' : 'neutral',
      });

      let txHash: string | undefined;
      if (ogStorageService.isAvailable()) {
        try {
          const result = await ogStorageService.recordCommentCreated(
            comment.id,
            user.id,
            comment.id,
            issue.id,
            content,
            { simulated: true, username: user.username }
          );
          txHash = result?.txHash || undefined;
        } catch (e) {
          console.error('[Simulation] 0G recording failed:', e);
        }
      }

      return { type: 'comment', txHash };
    } catch (error) {
      console.error('[Simulation] Comment creation failed:', error);
      return null;
    }
  }

  private async createSimulatedReview(
    user: { id: string; username: string },
    contentPool: Awaited<ReturnType<typeof this.getContentPool>>
  ): Promise<{ type: string; txHash?: string } | null> {
    const allUsers = await storage.getAllUsers();
    const reviewableUsers = allUsers.filter(u => 
      u.id !== user.id && 
      !u.isUnclaimedProfile && 
      u.hasInviteAccess
    );

    if (reviewableUsers.length === 0) return null;

    const targetUser = reviewableUsers[Math.floor(Math.random() * reviewableUsers.length)];
    
    const reviewTemplates = [
      { title: "Great collaborator", content: "Really enjoyed working with this person. Very professional and knowledgeable." },
      { title: "Excellent community member", content: "Always provides thoughtful contributions to governance discussions." },
      { title: "Reliable and trustworthy", content: "Consistently delivers quality work and maintains high standards." },
      { title: "Valuable team player", content: "Great at coordinating efforts and bringing people together." },
      { title: "Insightful contributor", content: "Their perspectives always add value to discussions." },
    ];
    
    const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    const rating = Math.floor(Math.random() * 2) + 4;

    try {
      const review = await storage.createReview({
        reviewerId: user.id,
        reviewedUserId: targetUser.id,
        title: template.title,
        content: template.content,
        rating,
        targetType: 'user',
        reviewType: 'positive',
      });

      let txHash: string | undefined;
      if (ogStorageService.isAvailable()) {
        try {
          const result = await ogStorageService.recordReviewCreated(
            review.id,
            user.id,
            targetUser.id,
            'USER',
            template.content,
            { simulated: true, username: user.username, reviewedUsername: targetUser.username, rating }
          );
          txHash = result?.txHash || undefined;
        } catch (e) {
          console.error('[Simulation] 0G recording failed:', e);
        }
      }

      return { type: 'review', txHash };
    } catch (error) {
      console.error('[Simulation] Review creation failed:', error);
      return null;
    }
  }
}

export const simulationService = new SimulationService();
