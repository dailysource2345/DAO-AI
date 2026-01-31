import { db } from './db';
import { users, daos, governanceIssues, comments, votes, userDaoFollows, userDaoScores, reviews, credaActivities, inviteCodes, referrals, stanceVotes } from '@shared/schema';
import fs from 'fs';
import path from 'path';

interface BackupData {
  timestamp: string;
  tables: {
    users: any[];
    daos: any[];
    governance_issues: any[];
    comments: any[];
    votes: any[];
    user_dao_follows: any[];
    user_dao_scores: any[];
    reviews: any[];
    creda_activities: any[];
    invite_codes: any[];
    referrals: any[];
    stance_votes: any[];
  };
  metadata: {
    totalRecords: number;
    backupType: string;
    databaseUrl?: string;
  };
}

export class BackupRestore {
  
  async restoreFromFile(backupFilename: string): Promise<{
    success: boolean;
    message: string;
    recordsRestored: number;
  }> {
    try {
      const backupPath = path.join('./backups', backupFilename);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupFilename}`);
      }

      console.log(`📁 Loading backup from: ${backupFilename}`);
      const backupData: BackupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      console.log(`📊 Backup contains ${backupData.metadata.totalRecords} records from ${backupData.timestamp}`);
      
      let totalRestored = 0;
      
      // Clear existing data (careful!)
      console.log('🗑️ Clearing existing data...');
      await this.clearAllTables();
      
      // Restore data in dependency order
      const tableOrder = [
        { name: 'users', data: backupData.tables.users, table: users },
        { name: 'daos', data: backupData.tables.daos, table: daos },
        { name: 'governance_issues', data: backupData.tables.governance_issues, table: governanceIssues },
        { name: 'comments', data: backupData.tables.comments, table: comments },
        { name: 'votes', data: backupData.tables.votes, table: votes },
        { name: 'user_dao_follows', data: backupData.tables.user_dao_follows, table: userDaoFollows },
        { name: 'user_dao_scores', data: backupData.tables.user_dao_scores, table: userDaoScores },
        { name: 'reviews', data: backupData.tables.reviews, table: reviews },
        { name: 'creda_activities', data: backupData.tables.creda_activities, table: credaActivities },
        { name: 'invite_codes', data: backupData.tables.invite_codes, table: inviteCodes },
        { name: 'referrals', data: backupData.tables.referrals, table: referrals },
        { name: 'stance_votes', data: backupData.tables.stance_votes, table: stanceVotes },
      ];

      for (const { name, data, table } of tableOrder) {
        if (data && data.length > 0) {
          console.log(`📥 Restoring ${data.length} records to ${name}...`);
          
          // Insert data in batches to avoid memory issues
          const batchSize = 100;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await db.insert(table).values(batch);
          }
          
          totalRestored += data.length;
          console.log(`✅ Restored ${data.length} ${name} records`);
        } else {
          console.log(`⏭️ Skipping ${name} - no data`);
        }
      }

      console.log(`🎉 Restoration complete! ${totalRestored} total records restored`);

      return {
        success: true,
        message: `Successfully restored ${totalRestored} records from ${backupFilename}`,
        recordsRestored: totalRestored
      };

    } catch (error) {
      console.error('❌ Restoration failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown restoration error',
        recordsRestored: 0
      };
    }
  }

  private async clearAllTables(): Promise<void> {
    try {
      // Clear in reverse dependency order to avoid foreign key issues
      const clearOrder = [
        stanceVotes, referrals, inviteCodes, credaActivities, 
        reviews, userDaoScores, userDaoFollows, votes, 
        comments, governanceIssues, daos, users
      ];

      for (const table of clearOrder) {
        await db.delete(table);
      }
      
      console.log('✅ All tables cleared');
    } catch (error) {
      console.error('❌ Error clearing tables:', error);
      throw error;
    }
  }

  async listAvailableBackups(): Promise<{
    backups: Array<{
      filename: string;
      timestamp: string;
      size: string;
      recordCount: number;
      type: string;
    }>;
  }> {
    try {
      const backupsDir = './backups';
      
      if (!fs.existsSync(backupsDir)) {
        return { backups: [] };
      }

      const files = fs.readdirSync(backupsDir)
        .filter(file => file.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first

      const backupsInfo = [];

      for (const file of files) {
        try {
          const filePath = path.join(backupsDir, file);
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          const backup: BackupData = JSON.parse(content);

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
      console.error('Error listing backups:', error);
      return { backups: [] };
    }
  }

  async validateBackup(backupFilename: string): Promise<{
    valid: boolean;
    message: string;
    details?: {
      timestamp: string;
      recordCount: number;
      tables: string[];
      fileSize: string;
    };
  }> {
    try {
      const backupPath = path.join('./backups', backupFilename);
      
      if (!fs.existsSync(backupPath)) {
        return {
          valid: false,
          message: `Backup file not found: ${backupFilename}`
        };
      }

      const stats = fs.statSync(backupPath);
      const content = fs.readFileSync(backupPath, 'utf8');
      const backup: BackupData = JSON.parse(content);

      const tableNames = Object.keys(backup.tables).filter(
        tableName => backup.tables[tableName as keyof typeof backup.tables]?.length > 0
      );

      return {
        valid: true,
        message: 'Backup file is valid and ready for restoration',
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
        message: error instanceof Error ? error.message : 'Invalid backup file format'
      };
    }
  }

  async createRestorePoint(): Promise<string> {
    // Create a restore point before doing restoration
    // This allows rolling back if restoration fails
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const restorePointFile = `restore-point-${timestamp}.json`;
    
    // This would use the same backup logic
    const { backupService } = await import('./backup');
    const backupPath = await backupService.createFullBackup(restorePointFile);
    
    console.log(`💾 Restore point created: ${restorePointFile}`);
    return backupPath;
  }
}

// Export singleton instance
export const backupRestore = new BackupRestore();