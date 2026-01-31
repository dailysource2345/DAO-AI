import { db } from './server/db.ts';
import { dailyTasksConfig } from './shared/schema.ts';

async function initializeDailyTasksConfig() {
  try {
    console.log("Initializing daily tasks configuration...");

    // Insert default configuration values
    await db.insert(dailyTasksConfig).values([
      {
        configKey: 'reset_time_utc',
        configValue: '00:00',
        description: 'UTC time for daily streak reset (HH:MM format)',
      },
      {
        configKey: 'min_actions_for_streak',
        configValue: '3',
        description: 'Minimum engagement actions required to maintain streak',
      }
    ]).onConflictDoNothing();

    console.log("Daily tasks configuration initialized successfully!");
    console.log("Default settings:");
    console.log("- Reset time: 00:00 UTC (midnight)");
    console.log("- Minimum actions for streak: 3");
    console.log("\nDaily tasks system is now ready!");
    
  } catch (error) {
    console.error("Error initializing daily tasks configuration:", error);
  } finally {
    process.exit(0);
  }
}

initializeDailyTasksConfig();