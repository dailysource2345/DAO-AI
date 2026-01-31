/**
 * Script to generate initial invite codes for existing users
 * This is a one-time setup script for the enhanced invite system
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "./shared/schema.js";
import { eq } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

function generateRandomInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateInitialInviteCodes() {
  try {
    console.log('Starting initial invite codes generation...');
    
    // Get all users
    const users = await db.select().from(schema.users);
    console.log(`Found ${users.length} users`);
    
    let totalCodesGenerated = 0;
    
    for (const user of users) {
      // Check if user already has invite codes
      const existingCodes = await db
        .select()
        .from(schema.inviteCodes)
        .where(eq(schema.inviteCodes.createdBy, user.id));
      
      if (existingCodes.length === 0) {
        // Generate 3 initial codes for this user
        for (let i = 0; i < 3; i++) {
          const code = generateRandomInviteCode();
          await db.insert(schema.inviteCodes).values({
            code,
            createdBy: user.id,
            maxUses: 1,
            currentUses: 0,
            isUsed: false
          });
          totalCodesGenerated++;
        }
        console.log(`Generated 3 invite codes for user ${user.id} (${user.username || 'no username'})`);
      } else {
        console.log(`User ${user.id} already has ${existingCodes.length} invite codes`);
      }
    }
    
    console.log(`\n✅ Initial invite codes generation complete!`);
    console.log(`📊 Total codes generated: ${totalCodesGenerated}`);
    console.log(`👥 Users processed: ${users.length}`);
    
  } catch (error) {
    console.error('Error generating initial invite codes:', error);
  } finally {
    await pool.end();
  }
}

generateInitialInviteCodes();