import { db } from './db';
import { sql } from 'drizzle-orm';
import { backupService } from './backup';
import { connectionRecovery } from './connection-recovery';

interface DatabaseHealth {
  isConnected: boolean;
  connectionTime: number;
  lastError?: string;
  tableCount: number;
  totalRecords: number;
  timestamp: string;
}

export class DatabaseMonitor {
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastHealthCheck: DatabaseHealth | null = null;

  async checkDatabaseHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now();
    
    try {
      // Test basic connection
      await db.execute(sql`SELECT 1`);
      
      // Get table count
      const tableResult = await db.execute(sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      const tableCount = Number(tableResult.rows[0]?.count || 0);
      
      // Get total record count from main tables
      const recordResult = await db.execute(sql`
        SELECT 
          (SELECT COUNT(*) FROM users) + 
          (SELECT COUNT(*) FROM daos) + 
          (SELECT COUNT(*) FROM governance_issues) + 
          (SELECT COUNT(*) FROM comments) + 
          (SELECT COUNT(*) FROM votes) as total
      `);
      
      const totalRecords = Number(recordResult.rows[0]?.total || 0);
      
      const health: DatabaseHealth = {
        isConnected: true,
        connectionTime: Date.now() - startTime,
        tableCount,
        totalRecords,
        timestamp: new Date().toISOString()
      };
      
      this.lastHealthCheck = health;
      return health;
      
    } catch (error) {
      const health: DatabaseHealth = {
        isConnected: false,
        connectionTime: Date.now() - startTime,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        tableCount: 0,
        totalRecords: 0,
        timestamp: new Date().toISOString()
      };
      
      this.lastHealthCheck = health;
      console.error('🚨 Database health check failed:', error);
      
      // Trigger connection recovery if connection fails
      if (!health.isConnected) {
        console.log('🆘 Connection failed - triggering recovery process...');
        try {
          const recovered = await connectionRecovery.handleConnectionFailure(error instanceof Error ? error : new Error('Unknown database error'));
          if (recovered) {
            console.log('✅ Connection recovery successful');
            // Re-check health after recovery
            return await this.checkDatabaseHealth();
          }
        } catch (recoveryError) {
          console.error('❌ Connection recovery failed:', recoveryError);
        }
      }
      
      return health;
    }
  }

  startMonitoring(intervalMinutes: number = 5) {
    console.log(`🔍 Starting database monitoring (every ${intervalMinutes} minutes)...`);
    
    // Clear existing interval if any
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Run initial check
    this.checkDatabaseHealth();
    
    // Set up regular monitoring
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.checkDatabaseHealth();
      
      if (health.isConnected) {
        console.log(`✅ Database healthy - ${health.totalRecords} records, ${health.connectionTime}ms`);
      } else {
        console.error('🚨 DATABASE CONNECTION FAILED!');
        console.error('Last error:', health.lastError);
        
        // Send alert (in production, this could be email/Slack/etc.)
        this.sendAlert(health);
      }
    }, intervalMinutes * 60 * 1000);
  }

  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('🛑 Database monitoring stopped');
    }
  }

  getLastHealthCheck(): DatabaseHealth | null {
    return this.lastHealthCheck;
  }

  private sendAlert(health: DatabaseHealth) {
    // In production, integrate with your alerting system
    console.error('🚨 DATABASE ALERT 🚨');
    console.error('Connection Status:', health.isConnected ? 'CONNECTED' : 'FAILED');
    console.error('Error:', health.lastError);
    console.error('Timestamp:', health.timestamp);
    console.error('Action Required: Check database connection and restore from backup if needed');
  }

  async validateDatabaseIntegrity(): Promise<boolean> {
    try {
      // Check critical tables exist and have data
      const criticalTables = ['users', 'daos', 'governance_issues'];
      
      for (const table of criticalTables) {
        const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM ${table}`));
        const count = Number(result.rows[0]?.count || 0);
        console.log(`📊 Table ${table}: ${count} records`);
      }
      
      // Check for foreign key integrity
      const integrityResult = await db.execute(sql`
        SELECT COUNT(*) as orphaned_comments
        FROM comments c 
        LEFT JOIN governance_issues gi ON c.governance_issue_id = gi.id 
        WHERE gi.id IS NULL
      `);
      
      const orphanedComments = Number(integrityResult.rows[0]?.orphaned_comments || 0);
      if (orphanedComments > 0) {
        console.warn(`⚠️ Found ${orphanedComments} orphaned comments`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Database integrity check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const databaseMonitor = new DatabaseMonitor();