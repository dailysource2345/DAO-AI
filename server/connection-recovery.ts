import { db, pool } from './db';
import { sql } from 'drizzle-orm';
import { backupService } from './backup';
import fs from 'fs';
import path from 'path';

interface ConnectionFailureEvent {
  timestamp: string;
  error: string;
  recoveryAttempts: number;
  lastBackupFile?: string;
  databaseUrl: string;
}

export class ConnectionRecovery {
  private failureLog: ConnectionFailureEvent[] = [];
  private isRecovering = false;
  private maxRetryAttempts = 5;
  private retryDelayMs = 10000; // 10 seconds

  async handleConnectionFailure(error: Error): Promise<boolean> {
    const timestamp = new Date().toISOString();
    console.error('🚨 DATABASE CONNECTION FAILURE DETECTED:', error.message);
    
    // Log the failure
    const failureEvent: ConnectionFailureEvent = {
      timestamp,
      error: error.message,
      recoveryAttempts: 0,
      databaseUrl: this.maskConnectionString(process.env.DATABASE_URL || ''),
    };

    // Create emergency backup before attempting recovery
    try {
      console.log('🆘 Creating emergency backup before recovery...');
      const backupPath = await backupService.createFullBackup();
      failureEvent.lastBackupFile = backupPath;
      console.log('✅ Emergency backup created:', backupPath);
    } catch (backupError) {
      console.error('❌ Emergency backup failed:', backupError);
    }

    this.failureLog.push(failureEvent);
    
    if (this.isRecovering) {
      console.log('⏳ Recovery already in progress...');
      return false;
    }

    return await this.attemptRecovery(failureEvent);
  }

  private async attemptRecovery(failureEvent: ConnectionFailureEvent): Promise<boolean> {
    this.isRecovering = true;
    console.log('🔧 Starting connection recovery process...');

    for (let attempt = 1; attempt <= this.maxRetryAttempts; attempt++) {
      failureEvent.recoveryAttempts = attempt;
      console.log(`🔄 Recovery attempt ${attempt}/${this.maxRetryAttempts}`);

      try {
        // Wait before retry
        if (attempt > 1) {
          console.log(`⏱️ Waiting ${this.retryDelayMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelayMs));
        }

        // Test connection
        await db.execute(sql`SELECT 1`);
        
        // If successful, verify data integrity
        const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
        const daoCount = await db.execute(sql`SELECT COUNT(*) as count FROM daos`);
        
        console.log('✅ Connection recovered successfully!');
        console.log(`📊 Data integrity check: ${userCount.rows[0]?.count} users, ${daoCount.rows[0]?.count} DAOs`);
        
        this.isRecovering = false;
        
        // Log successful recovery
        this.logRecoverySuccess(failureEvent, attempt);
        return true;

      } catch (retryError) {
        console.error(`❌ Recovery attempt ${attempt} failed:`, retryError);
        
        if (attempt === this.maxRetryAttempts) {
          console.error('🚨 ALL RECOVERY ATTEMPTS FAILED');
          this.logRecoveryFailure(failureEvent);
          this.isRecovering = false;
          return false;
        }
      }
    }

    this.isRecovering = false;
    return false;
  }

  async checkConnectionHealth(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await db.execute(sql`SELECT 1`);
      return {
        isHealthy: true,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getFailureHistory(): ConnectionFailureEvent[] {
    return [...this.failureLog];
  }

  private logRecoverySuccess(failureEvent: ConnectionFailureEvent, successfulAttempt: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'RECOVERY_SUCCESS',
      originalFailure: failureEvent.timestamp,
      attemptsRequired: successfulAttempt,
      totalDowntime: Date.now() - new Date(failureEvent.timestamp).getTime()
    };

    console.log('📝 Recovery logged:', JSON.stringify(logEntry, null, 2));
    this.writeRecoveryLog(logEntry);
  }

  private logRecoveryFailure(failureEvent: ConnectionFailureEvent) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'RECOVERY_FAILED',
      originalFailure: failureEvent.timestamp,
      totalAttempts: failureEvent.recoveryAttempts,
      lastBackup: failureEvent.lastBackupFile,
      nextSteps: [
        'Check database provider status',
        'Verify DATABASE_URL is correct',
        'Contact database provider support',
        'Restore from backup if necessary',
        'Check network connectivity'
      ]
    };

    console.error('🚨 RECOVERY FAILURE LOGGED:', JSON.stringify(logEntry, null, 2));
    this.writeRecoveryLog(logEntry);
  }

  private writeRecoveryLog(logEntry: any) {
    try {
      const logDir = './logs';
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const logFile = path.join(logDir, 'connection-recovery.log');
      const logLine = JSON.stringify(logEntry) + '\n';
      
      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error('Failed to write recovery log:', error);
    }
  }

  private maskConnectionString(connectionUrl: string): string {
    return connectionUrl.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.+)/, '$1***$2');
  }

  // Manual recovery trigger for admin
  async triggerManualRecovery(): Promise<boolean> {
    console.log('🔧 Manual recovery triggered by admin...');
    
    const fakeFailure: ConnectionFailureEvent = {
      timestamp: new Date().toISOString(),
      error: 'Manual recovery trigger',
      recoveryAttempts: 0,
      databaseUrl: this.maskConnectionString(process.env.DATABASE_URL || ''),
    };

    return await this.attemptRecovery(fakeFailure);
  }

  // Get recovery instructions for admin
  getRecoveryInstructions(): string[] {
    return [
      '1. Check database provider status (Neon, Railway, etc.)',
      '2. Verify DATABASE_URL environment variable is correct',
      '3. Test connection from external tool (e.g., pgAdmin)',
      '4. Check if database endpoint is disabled/suspended',
      '5. Contact database provider support if needed',
      '6. If data is lost, restore from latest backup',
      '7. Monitor connection stability after recovery',
      '8. Document incident for future prevention'
    ];
  }
}

// Export singleton instance
export const connectionRecovery = new ConnectionRecovery();