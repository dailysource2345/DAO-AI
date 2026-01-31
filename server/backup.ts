import { db } from './db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface BackupData {
  timestamp: string;
  tables: Record<string, any[]>;
  metadata: {
    totalRecords: number;
    tableCount: number;
    version: string;
  };
}

export class DatabaseBackup {
  private backupDir = './backups';

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createFullBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;
      const filepath = path.join(this.backupDir, filename);

      console.log('Starting database backup...');

      // Get all table data
      const tables = [
        'users', 'daos', 'governance_issues', 'comments', 'votes', 
        'user_dao_follows', 'user_dao_scores', 'reviews', 'creda_activities',
        'invite_codes', 'referrals', 'stance_votes'
      ];

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        tables: {},
        metadata: {
          totalRecords: 0,
          tableCount: tables.length,
          version: '1.0.0'
        }
      };

      // Backup each table
      for (const tableName of tables) {
        try {
          const result = await db.execute(sql.raw(`SELECT * FROM ${tableName}`));
          backupData.tables[tableName] = result.rows || [];
          backupData.metadata.totalRecords += (result.rows?.length || 0);
          console.log(`Backed up ${tableName}: ${result.rows?.length || 0} records`);
        } catch (error) {
          console.warn(`Warning: Could not backup table ${tableName}:`, error);
          backupData.tables[tableName] = [];
        }
      }

      // Write backup to file
      fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
      
      console.log(`✅ Backup completed: ${filename}`);
      console.log(`📊 Total records backed up: ${backupData.metadata.totalRecords}`);

      return filepath;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  async verifyDatabaseConnection(): Promise<boolean> {
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await db.execute(sql`SELECT 1`);
        if (attempt > 1) {
          console.log(`✅ Database connection successful on attempt ${attempt}`);
        }
        return true;
      } catch (error) {
        if (attempt < maxRetries) {
          console.log(`⚠️ Database connection attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.error('Database connection failed after all retries:', error);
          return false;
        }
      }
    }
    return false;
  }

  async getDatabaseStats() {
    try {
      const stats = await db.execute(sql`
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
      console.error('Failed to get database stats:', error);
      return [];
    }
  }

  async scheduleAutomaticBackups() {
    console.log('🔄 Setting up automatic backup schedule...');
    
    // Backup every 1 hour
    const backupInterval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    
    setInterval(async () => {
      try {
        console.log('⏰ Running scheduled backup...');
        await this.createFullBackup();
      } catch (error) {
        console.error('⚠️ Scheduled backup failed:', error);
      }
    }, backupInterval);

    // Initial backup
    setTimeout(() => {
      this.createFullBackup().catch(console.error);
    }, 5000); // Wait 5 seconds after startup
  }

  listBackups(): string[] {
    try {
      const files = fs.readdirSync(this.backupDir);
      return files
        .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  async cleanupOldBackups(keepDays: number = 7) {
    try {
      const files = this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - keepDays);

      for (const file of files) {
        const filepath = path.join(this.backupDir, file);
        const stats = fs.statSync(filepath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath);
          console.log(`🗑️ Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }
}

// Export singleton instance
export const backupService = new DatabaseBackup();