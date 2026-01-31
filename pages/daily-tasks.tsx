import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Note: Progress component might not exist, we'll use a simple div instead
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Circle, Flame, Trophy, Clock, Target, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// XP Actions based on the official DAO AI XP POINTS SYSTEM
const XP_ACTIONS = [
  { id: 'create_stance', name: 'Create Governance Stance', xp: 100 },
  { id: 'quality_comment', name: 'Quality Comment (100+ characters)', xp: 20 },
  { id: 'normal_comment', name: 'Comment on a Review', xp: 10 },
  { id: 'cast_vote', name: 'Upvote on a Review', xp: 5 },
  { id: 'give_review', name: 'Give Review', xp: 50 },
  { id: 'complete_onboarding', name: 'Complete Onboarding', xp: 25 },
  { id: 'complete_welcome_tour', name: 'Complete Welcome Tour', xp: 25 },
  { id: 'receive_stance_upvote', name: 'Receive Upvote on Stance', xp: 10 },
  { id: 'receive_stance_downvote', name: 'Receive Downvote on Stance', xp: 3 },
  { id: 'receive_stance_comment', name: 'Receive Comment on Stance', xp: 5 },
  { id: 'receive_comment_upvote', name: 'Receive Upvote on Comment', xp: 5 },
  { id: 'receive_review_upvote', name: 'Receive Upvote on Review', xp: 5 },
];

export default function DailyTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [timeToReset, setTimeToReset] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Fetch user's daily progress
  const { data: dailyProgress, isLoading, refetch: refetchDailyProgress } = useQuery({
    queryKey: ['/api/daily-tasks/progress'],
    enabled: !!user,
    refetchInterval: 120000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      // When tasks are complete, invalidate leaderboard to show updated streak
      if (data?.tasksComplete) {
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    }
  });

  // Fetch user's XP activities for today
  const { data: todayActivities, refetch: refetchTodayActivities } = useQuery({
    queryKey: ['/api/users/creda-activities/today'],
    enabled: !!user,
    refetchInterval: 120000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Calculate countdown to UTC midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0);
      const diff = utc.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeToReset({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if user has completed specific actions today
  const getActionStatus = (actionId: string) => {
    if (!todayActivities || !Array.isArray(todayActivities)) return false;
    
    // Map action IDs to XP activity types
    const activityTypeMap: { [key: string]: string[] } = {
      'create_stance': ['stance_created'],
      'quality_comment': ['quality_comment_created'],
      'normal_comment': ['comment_created', 'review_comment'],
      'cast_vote': ['vote_cast'],
      'give_review': ['review_given'],
      'complete_onboarding': ['onboarding_completed'],
      'complete_welcome_tour': ['welcome_tour_completed'],
      'receive_stance_upvote': ['stance_upvote_received'],
      'receive_stance_downvote': ['stance_downvote_received'],
      'receive_stance_comment': ['stance_comment_received'],
      'receive_comment_upvote': ['comment_upvote_received'],
      'receive_review_upvote': ['review_upvote_received'],
    };

    const activityTypes = activityTypeMap[actionId] || [];
    return todayActivities.some((activity: any) => 
      activityTypes.includes(activity.activityType)
    );
  };

  // Count completed actions
  const completedActions = XP_ACTIONS.filter(action => getActionStatus(action.id));
  const completedCount = completedActions.length;
  const progressPercentage = Math.min((completedCount / 3) * 100, 100);
  const isTasksComplete = completedCount >= 3;

  const currentStreak = (user as any)?.dailyStreak || (dailyProgress as any)?.currentStreak || 0;
  const longestStreak = (dailyProgress as any)?.longestStreak || currentStreak;

  // Manual refresh function
  const handleRefresh = async () => {
    await Promise.all([
      refetchTodayActivities(),
      refetchDailyProgress(),
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/users'] }) // Refresh leaderboard
    ]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 rounded"></div>
              <div className="h-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Daily Tasks</h1>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Refresh Progress
          </Button>
        </div>

        {/* Top Section: Streaks and Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Streak */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className={`h-6 w-6 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="text-lg font-semibold">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-orange-500">
                {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          {/* Longest Streak */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-semibold">Longest Streak</span>
              </div>
              <div className="text-3xl font-bold text-yellow-500">
                {longestStreak} Day{longestStreak !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          {/* Reset Countdown */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold">Reset In</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">
                {String(timeToReset.hours).padStart(2, '0')}h{' '}
                {String(timeToReset.minutes).padStart(2, '0')}m{' '}
                {String(timeToReset.seconds).padStart(2, '0')}s
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section: Progress and Checklist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {completedCount} / 3 tasks completed today
                </span>
                <Badge variant={isTasksComplete ? "default" : "secondary"}>
                  {Math.round(progressPercentage)}%
                </Badge>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Completion Message */}
            {isTasksComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    ✅ You've completed your Daily Tasks! Your streak will update at reset time.
                  </span>
                </div>
              </div>
            )}

            {/* Task Checklist */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-4">XP-Generating Actions</h3>
              <div className="grid gap-3">
                {XP_ACTIONS.map((action) => {
                  const isCompleted = getActionStatus(action.id);
                  return (
                    <div
                      key={action.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="flex-grow">
                        <span className={`font-medium ${isCompleted ? 'text-green-800' : 'text-slate-700'}`}>
                          {action.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {action.xp} XP
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section: Explainer */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">How Daily Tasks Work</h3>
            <p className="text-slate-600 leading-relaxed">
              Complete any 3 XP-generating actions before the daily reset to maintain your streak. 
              Your streak is displayed on the leaderboard. Missing a day resets your streak to zero. 
              The system automatically tracks all your activities and updates your progress in real-time.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}