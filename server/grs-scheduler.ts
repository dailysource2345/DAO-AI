import { storage } from "./storage";

// GRS Background Job Scheduler
class GrsScheduler {
  private expiredStancesInterval: NodeJS.Timeout | null = null;
  private reviewAccuracyInterval: NodeJS.Timeout | null = null;

  // Start all GRS background jobs
  start() {
    console.log('🤖 Starting GRS background job scheduler...');
    
    // Check for expired stances every 5 minutes
    this.expiredStancesInterval = setInterval(async () => {
      try {
        await storage.processExpiredStances();
      } catch (error) {
        console.error('Error in expired stances job:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Run review accuracy evaluation daily at 2 AM
    this.reviewAccuracyInterval = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 2 && now.getMinutes() === 0) {
        try {
          console.log('🔍 Running daily review accuracy evaluation...');
          await storage.evaluateReviewAccuracy();
        } catch (error) {
          console.error('Error in review accuracy evaluation job:', error);
        }
      }
    }, 60 * 1000); // Check every minute for 2 AM

    console.log('✅ GRS background jobs started');
    console.log('  • Expired stances check: Every 5 minutes');
    console.log('  • Review accuracy evaluation: Daily at 2 AM');
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
    
    console.log('🛑 GRS background jobs stopped');
  }

  // Manual trigger for expired stances (for testing)
  async triggerExpiredStancesCheck() {
    console.log('🔧 Manually triggering expired stances check...');
    await storage.processExpiredStances();
  }

  // Manual trigger for review accuracy evaluation (for testing)
  async triggerReviewAccuracyEvaluation() {
    console.log('🔧 Manually triggering review accuracy evaluation...');
    await storage.evaluateReviewAccuracy();
  }
}

export const grsScheduler = new GrsScheduler();