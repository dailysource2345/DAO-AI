import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { quests, questTasks } from './shared/schema.ts';

async function initializeWelcomeQuest() {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  console.log('🎯 Initializing Welcome Quest...');

  try {
    // Check if welcome quest already exists
    const existingQuest = await db
      .select()
      .from(quests)
      .where(eq(quests.questType, 'welcome'))
      .limit(1);

    if (existingQuest.length > 0) {
      console.log('✅ Welcome quest already exists:', existingQuest[0].title);
      return;
    }

    // Create welcome quest
    const [welcomeQuest] = await db
      .insert(quests)
      .values({
        title: "Governance Explorer Welcome",
        description: "Welcome to DAO AI! Complete these tasks within 24 hours to learn the platform and earn your first XP rewards.",
        questType: "welcome",
        status: "active",
        durationHours: 24,
        xpReward: 525,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    console.log('✅ Created welcome quest:', welcomeQuest.title);

    // Add welcome quest tasks
    const welcomeTasks = [
      {
        questId: welcomeQuest.id,
        taskType: "create_stance",
        description: "Share your first stance on a governance issue",
        targetValue: 1,
        sortOrder: 0
      },
      {
        questId: welcomeQuest.id,
        taskType: "submit_comment",
        description: "Add your first comment to a discussion",
        targetValue: 1,
        sortOrder: 1
      },
      {
        questId: welcomeQuest.id,
        taskType: "cast_vote",
        description: "Cast your first vote on a governance proposal",
        targetValue: 1,
        sortOrder: 2
      },
      {
        questId: welcomeQuest.id,
        taskType: "follow_dao",
        description: "Follow a DAO to stay updated on their governance",
        targetValue: 1,
        sortOrder: 3
      }
    ];

    for (const task of welcomeTasks) {
      await db.insert(questTasks).values(task);
      console.log(`✅ Added task: ${task.description}`);
    }

    console.log('🎉 Welcome quest initialization completed successfully!');
    console.log('Quest ID:', welcomeQuest.id);
    console.log('Tasks created:', welcomeTasks.length);
    
  } catch (error) {
    console.error('❌ Error initializing welcome quest:', error);
  }
}

// Run initialization
initializeWelcomeQuest().then(() => process.exit(0));