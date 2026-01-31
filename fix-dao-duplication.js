#!/usr/bin/env node

/**
 * DAO Duplication Fix Script
 * This script fixes the database duplication issue where DAOs were created 
 * in both the users table (as unclaimed profiles) and the daos table.
 * 
 * Run this script with: node fix-dao-duplication.js
 */

import pg from 'pg';
const { Client } = pg;

async function fixDaoDuplication() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🔍 Connected to database, analyzing DAO duplication...');

    // First, let's find all users with profile_type = 'dao'
    const duplicateUsers = await client.query(`
      SELECT id, username, first_name, last_name, twitter_handle, twitter_url, created_by, created_at
      FROM users 
      WHERE profile_type = 'dao' AND is_unclaimed_profile = true
      ORDER BY created_at
    `);

    console.log(`📊 Found ${duplicateUsers.rows.length} duplicate DAO entries in users table`);

    if (duplicateUsers.rows.length === 0) {
      console.log('✅ No duplicate DAO entries found. Database is clean!');
      return;
    }

    // For each duplicate user, check if there's a corresponding DAO entry
    const results = {
      duplicatesFound: 0,
      duplicatesFixed: 0,
      reviewsUpdated: 0,
      userScoresUpdated: 0,
      errorsEncountered: []
    };

    for (const daoUser of duplicateUsers.rows) {
      try {
        console.log(`\n🔍 Processing DAO user: ${daoUser.username} (${daoUser.id})`);
        
        // Look for corresponding DAO entry by name or slug
        const daoName = `${daoUser.first_name || ''} ${daoUser.last_name || ''}`.trim() || daoUser.username;
        const potentialSlug = daoName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        
        const correspondingDao = await client.query(`
          SELECT id, name, slug FROM daos 
          WHERE LOWER(name) = LOWER($1) OR slug = $2
          ORDER BY created_at 
          LIMIT 1
        `, [daoName, potentialSlug]);

        if (correspondingDao.rows.length > 0) {
          const dao = correspondingDao.rows[0];
          console.log(`  ✓ Found corresponding DAO: ${dao.name} (ID: ${dao.id})`);
          results.duplicatesFound++;

          // Update any reviews that reference this user to reference the DAO instead
          const reviewUpdate = await client.query(`
            UPDATE reviews 
            SET reviewed_user_id = NULL, 
                reviewed_dao_id = $1,
                target_type = 'dao'
            WHERE reviewed_user_id = $2
          `, [dao.id, daoUser.id]);

          if (reviewUpdate.rowCount > 0) {
            console.log(`  ✓ Updated ${reviewUpdate.rowCount} reviews to reference DAO instead of user`);
            results.reviewsUpdated += reviewUpdate.rowCount;
          }

          // Update user_dao_scores to remove references to the duplicate user
          const scoreUpdate = await client.query(`
            DELETE FROM user_dao_scores 
            WHERE user_id = $1
          `, [daoUser.id]);

          if (scoreUpdate.rowCount > 0) {
            console.log(`  ✓ Removed ${scoreUpdate.rowCount} user_dao_scores entries for duplicate user`);
            results.userScoresUpdated += scoreUpdate.rowCount;
          }

          // Update DAOs that reference this user as creator to NULL (unclaimed DAOs)
          const daoCreatorUpdate = await client.query(`
            UPDATE daos 
            SET created_by = NULL
            WHERE created_by = $1
          `, [daoUser.id]);

          if (daoCreatorUpdate.rowCount > 0) {
            console.log(`  ✓ Updated ${daoCreatorUpdate.rowCount} DAOs to remove creator reference`);
          }

          // Delete the duplicate user entry
          await client.query(`DELETE FROM users WHERE id = $1`, [daoUser.id]);
          console.log(`  ✓ Removed duplicate user entry: ${daoUser.username}`);
          
          results.duplicatesFixed++;
        } else {
          console.log(`  ⚠️  No corresponding DAO found for user: ${daoUser.username}`);
          console.log(`     This might be a legitimate unclaimed DAO profile that hasn't been converted yet.`);
        }

      } catch (error) {
        console.log(`  ❌ Error processing ${daoUser.username}:`, error.message);
        results.errorsEncountered.push({
          user: daoUser.username,
          error: error.message
        });
      }
    }

    console.log('\n📊 MIGRATION SUMMARY:');
    console.log(`  • Duplicate entries found: ${results.duplicatesFound}`);
    console.log(`  • Duplicates successfully fixed: ${results.duplicatesFixed}`);
    console.log(`  • Reviews updated: ${results.reviewsUpdated}`);
    console.log(`  • User scores cleaned: ${results.userScoresUpdated}`);
    console.log(`  • Errors encountered: ${results.errorsEncountered.length}`);

    if (results.errorsEncountered.length > 0) {
      console.log('\n❌ ERRORS:');
      results.errorsEncountered.forEach(err => {
        console.log(`  • ${err.user}: ${err.error}`);
      });
    }

    if (results.duplicatesFixed > 0) {
      console.log('\n✅ Database duplication issue has been resolved!');
      console.log('   DAOs are now managed in a single location (daos table).');
      console.log('   The admin panel will now show cleaner data.');
    }

  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the migration
fixDaoDuplication()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });

export { fixDaoDuplication };