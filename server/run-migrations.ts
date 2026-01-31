import { pool } from "./db";

export async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log("Running database migrations...");
    
    const migrations = [
      // Users table
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS og_tx_hash TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS og_root_hash TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS og_recorded_at TIMESTAMP",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS zg_merkle_hash VARCHAR",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS zg_stored_at TIMESTAMP",
      
      // Governance issues table
      "ALTER TABLE governance_issues ADD COLUMN IF NOT EXISTS og_tx_hash TEXT",
      "ALTER TABLE governance_issues ADD COLUMN IF NOT EXISTS og_root_hash TEXT",
      "ALTER TABLE governance_issues ADD COLUMN IF NOT EXISTS og_recorded_at TIMESTAMP",
      "ALTER TABLE governance_issues ADD COLUMN IF NOT EXISTS zg_merkle_hash VARCHAR",
      "ALTER TABLE governance_issues ADD COLUMN IF NOT EXISTS zg_stored_at TIMESTAMP",
      
      // Reviews table
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS og_tx_hash TEXT",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS og_root_hash TEXT",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS og_recorded_at TIMESTAMP",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS zg_merkle_hash VARCHAR",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS zg_stored_at TIMESTAMP",
      
      // Companies table
      "ALTER TABLE companies ADD COLUMN IF NOT EXISTS og_tx_hash TEXT",
      "ALTER TABLE companies ADD COLUMN IF NOT EXISTS og_root_hash TEXT",
      "ALTER TABLE companies ADD COLUMN IF NOT EXISTS og_recorded_at TIMESTAMP",
      "ALTER TABLE companies ADD COLUMN IF NOT EXISTS zg_merkle_hash VARCHAR",
      "ALTER TABLE companies ADD COLUMN IF NOT EXISTS zg_stored_at TIMESTAMP",
      
      // Creda activities table
      "ALTER TABLE creda_activities ADD COLUMN IF NOT EXISTS og_tx_hash TEXT",
      "ALTER TABLE creda_activities ADD COLUMN IF NOT EXISTS og_root_hash TEXT",
      "ALTER TABLE creda_activities ADD COLUMN IF NOT EXISTS og_recorded_at TIMESTAMP",
      "ALTER TABLE creda_activities ADD COLUMN IF NOT EXISTS zg_merkle_hash VARCHAR",
      "ALTER TABLE creda_activities ADD COLUMN IF NOT EXISTS zg_stored_at TIMESTAMP",
      
      // ROFL Confidential Compute attestation fields for users table
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_reputation_score INTEGER",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_confidence_score INTEGER",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_enclave_id TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_app_hash TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_attestation_hash TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_attestation_signature TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_computed_at TIMESTAMP",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_og_tx_hash TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS rofl_og_root_hash TEXT",
    ];
    
    for (const sql of migrations) {
      try {
        await client.query(sql);
      } catch (err: any) {
        if (!err.message?.includes("already exists")) {
          console.error(`Migration warning: ${err.message}`);
        }
      }
    }
    
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    client.release();
  }
}
