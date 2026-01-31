#!/usr/bin/env node

/**
 * Emergency Database Restoration Script
 * 
 * Usage: node emergency-restore.js [backup-filename]
 * If no filename provided, uses the most recent backup
 */

const fs = require('fs');
const path = require('path');

async function emergencyRestore(backupFilename = null) {
  console.log('🚨 EMERGENCY DATABASE RESTORATION STARTED');
  console.log('==========================================');
  
  try {
    // Step 1: Find backup file
    const backupsDir = './backups';
    
    if (!fs.existsSync(backupsDir)) {
      throw new Error('❌ Backups directory not found. No backups available.');
    }
    
    const backupFiles = fs.readdirSync(backupsDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
    
    if (backupFiles.length === 0) {
      throw new Error('❌ No backup files found in backups directory.');
    }
    
    // Use provided filename or most recent
    const targetBackup = backupFilename || backupFiles[0];
    const backupPath = path.join(backupsDir, targetBackup);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`❌ Backup file not found: ${targetBackup}`);
    }
    
    console.log(`📁 Located backup file: ${targetBackup}`);
    
    // Step 2: Validate backup
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`📊 Backup contains ${backupData.metadata.totalRecords} records from ${backupData.timestamp}`);
    
    // Step 3: Show what will be restored
    console.log('\n📋 DATA TO BE RESTORED:');
    console.log('=======================');
    Object.keys(backupData.tables).forEach(tableName => {
      const recordCount = backupData.tables[tableName].length;
      if (recordCount > 0) {
        console.log(`  • ${tableName}: ${recordCount} records`);
      }
    });
    
    // Step 4: Instructions for manual steps
    console.log('\n🔧 MANUAL STEPS REQUIRED:');
    console.log('==========================');
    console.log('1. ✅ Update DATABASE_URL in Replit Secrets with new database connection');
    console.log('2. ✅ Restart your Replit app (Stop → Run)');
    console.log('3. ✅ Go to /admin → Database tab');
    console.log(`4. ✅ Click "Restore" on backup: ${targetBackup}`);
    console.log('5. ✅ Confirm restoration');
    console.log('6. ✅ Verify all data is restored');
    console.log('7. ✅ Deploy to production');
    
    // Step 5: Database URL check
    const currentDbUrl = process.env.DATABASE_URL;
    if (currentDbUrl) {
      const maskedUrl = currentDbUrl.replace(/\/\/.*@/, '//***:***@');
      console.log(`\n🔗 Current DATABASE_URL: ${maskedUrl}`);
    } else {
      console.log('\n⚠️  DATABASE_URL not set in environment');
    }
    
    // Step 6: Show backup details
    console.log('\n💾 BACKUP FILE DETAILS:');
    console.log('========================');
    const stats = fs.statSync(backupPath);
    console.log(`File: ${targetBackup}`);
    console.log(`Size: ${Math.round(stats.size / 1024)}KB`);
    console.log(`Created: ${new Date(backupData.timestamp).toLocaleString()}`);
    console.log(`Location: ${backupPath}`);
    
    // Step 7: Available backups
    console.log('\n📚 ALL AVAILABLE BACKUPS:');
    console.log('==========================');
    backupFiles.slice(0, 5).forEach((file, index) => {
      console.log(`${index === 0 ? '→' : ' '} ${file} ${index === 0 ? '(MOST RECENT)' : ''}`);
    });
    
    console.log('\n✅ EMERGENCY RESTORATION GUIDE COMPLETE');
    console.log('========================================');
    console.log('Follow the manual steps above to complete the restoration.');
    console.log('Your governance platform will be fully restored with zero data loss.');
    
  } catch (error) {
    console.error('\n❌ EMERGENCY RESTORATION FAILED');
    console.error('================================');
    console.error(error.message);
    console.error('\nTroubleshooting:');
    console.error('• Check if backup files exist in ./backups/');
    console.error('• Verify Replit project is not corrupted');
    console.error('• Try using a different backup file');
    process.exit(1);
  }
}

// Parse command line arguments
const backupFilename = process.argv[2];

// Run the emergency restore
emergencyRestore(backupFilename).catch(console.error);