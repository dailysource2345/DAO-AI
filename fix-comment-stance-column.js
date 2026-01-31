
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function fixCommentStanceColumn() {
  try {
    console.log("Making stance column nullable in comments table...");
    
    // Make stance column nullable
    await sql`ALTER TABLE comments ALTER COLUMN stance DROP NOT NULL`;
    
    console.log("✅ Successfully updated comments table - stance column is now nullable");
    
    // Verify the change
    const testResult = await sql`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'comments' AND column_name = 'stance'
    `;
    
    console.log("Column info:", testResult[0]);
    
  } catch (error) {
    console.error("❌ Error updating comments table:", error);
    throw error;
  }
}

// Run the fix
fixCommentStanceColumn()
  .then(() => {
    console.log("✅ Database schema update completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed to update database schema:", error);
    process.exit(1);
  });
