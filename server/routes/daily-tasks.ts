import { Router } from "express";
import { getDb } from "../db";
import { isAuthenticated } from "../middleware/auth";
import { users, credaActivities } from "../../shared/schema";
import { eq, sql, and } from "drizzle-orm";

const router = Router();

// Get user's daily tasks progress
router.get("/progress", isAuthenticated, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user!.id;

    // Get today's start in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayDateString = todayStart.toISOString().split('T')[0];

    // Get today's XP activities
    const todayActivities = await db
      .select()
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.userId, userId),
          sql`DATE(${credaActivities.createdAt}) = ${todayDateString}`
        )
      );

    // Count unique action types completed today
    const uniqueActionTypes = new Set(todayActivities.map(activity => activity.activityType));
    const completedActionsCount = uniqueActionTypes.size;
    const tasksComplete = completedActionsCount >= 3;

    // Get user data AFTER potentially updating streak
    if (tasksComplete) {
      // Call the storage method to update streak if needed
      await req.storage.checkAndUpdateDailyTasksStreak(userId);
    }

    // Get updated user data
    const user = await db
      .select({
        dailyStreak: users.dailyStreak,
        longestStreak: users.longestStreak,
        lastStreakDate: users.lastStreakDate
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user[0];

    res.json({
      currentStreak: userData.dailyStreak || 0,
      longestStreak: userData.longestStreak || 0,
      lastStreakDate: userData.lastStreakDate,
      completedActionsToday: completedActionsCount,
      tasksComplete,
      todayActivities: todayActivities
    });

  } catch (error) {
    console.error("Error fetching daily tasks progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get today's XP activities for the user
router.get("/today-activities", isAuthenticated, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user!.id;

    // Get today's start in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayDateString = todayStart.toISOString().split('T')[0];

    // Get today's XP activities
    const todayActivities = await db
      .select()
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.userId, userId),
          sql`DATE(${credaActivities.timestamp}) = ${todayDateString}`
        )
      )
      .orderBy(credaActivities.timestamp);

    res.json(todayActivities);

  } catch (error) {
    console.error("Error fetching today's activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user's streak (called by background job or manual trigger)
router.post("/update-streak", isAuthenticated, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.user!.id;

    // Get today's start in UTC  
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayDateString = todayStart.toISOString().split('T')[0];

    // Get today's XP activities
    const todayActivities = await db
      .select()
      .from(credaActivities)
      .where(
        and(
          eq(credaActivities.userId, userId),
          sql`DATE(${credaActivities.timestamp}) = ${todayDateString}`
        )
      );

    // Count unique action types completed today
    const uniqueActionTypes = new Set(todayActivities.map(activity => activity.activityType));
    const completedActionsCount = uniqueActionTypes.size;
    const tasksComplete = completedActionsCount >= 3;

    // Get current user data
    const user = await db
      .select({
        dailyStreak: users.dailyStreak,
        longestStreak: users.longestStreak,
        lastStreakDate: users.lastStreakDate
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user[0];
    let newStreak = userData.dailyStreak || 0;
    let newLongestStreak = userData.longestStreak || 0;

    // Check if we need to update the streak
    const lastStreakDate = userData.lastStreakDate;
    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);

    if (tasksComplete) {
      // User completed tasks today
      if (!lastStreakDate || lastStreakDate.toDateString() === yesterday.toDateString()) {
        // Continue or start streak
        newStreak += 1;
      } else if (lastStreakDate.toDateString() !== todayStart.toDateString()) {
        // Streak was broken, restart at 1
        newStreak = 1;
      }
      // Update longest streak if current is higher
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }
    } else {
      // User didn't complete tasks - check if streak should be reset
      if (lastStreakDate && lastStreakDate.toDateString() !== todayStart.toDateString()) {
        // Check if yesterday was missed
        if (lastStreakDate.toDateString() !== yesterday.toDateString()) {
          newStreak = 0; // Reset streak
        }
      }
    }

    // Update user streak data
    await db
      .update(users)
      .set({
        dailyStreak: newStreak,
        longestStreak: newLongestStreak,
        lastStreakDate: tasksComplete ? todayStart : userData.lastStreakDate,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      tasksComplete,
      completedActionsCount
    });

  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;