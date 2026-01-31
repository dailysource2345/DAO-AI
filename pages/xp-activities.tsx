
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { 
  Trophy, 
  Star, 
  MessageCircle,
  ThumbsUp,
  Users,
  Zap,
  RefreshCw,
  Activity,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Timer,
  BarChart3
} from "lucide-react";

interface CredaActivity {
  id: number;
  activityType: string;
  credaAwarded: number;
  targetType?: string;
  targetId?: number;
  metadata?: any;
  createdAt: string;
}

export default function CredaActivitiesPage() {
  const { user, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { data: credaActivities = [], isLoading, refetch, error } = useQuery({
    queryKey: ['/api/users/creda-activities'],
    enabled: isAuthenticated,
    staleTime: 0, // Always refetch when component mounts
    retry: 3,
  });

  // Get user's current Points from the user object instead of calculating from activities
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 5000, // Cache for 5 seconds only
    refetchInterval: 60000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Sign In Required</h1>
              <p className="text-slate-600">You need to be signed in to view your Points activities.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'review_given':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'stance_created':
        return <Trophy className="w-5 h-5 text-purple-500" />;
      case 'vote_cast':
        return <ThumbsUp className="w-5 h-5 text-blue-500" />;
      case 'quality_comment':
      case 'normal_comment':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'upvote_received_stance':
      case 'upvote_received_comment':
      case 'upvote_received_review':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'onboarding_completed':
      case 'welcome_tour_completed':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'daily_streak':
        return <Target className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActivityTitle = (activity: CredaActivity) => {
    const { activityType, metadata } = activity;
    
    switch (activityType) {
      case 'review_given':
        return metadata?.reviewedUsername 
          ? `Reviewed ${metadata.reviewedUsername}` 
          : 'Review Given';
      case 'stance_created':
        return 'Created Governance Stance';
      case 'vote_cast':
        return `Cast ${metadata?.voteType || ''} Vote`.trim();
      case 'quality_comment':
        return 'Quality Comment Posted';
      case 'normal_comment':
        return 'Comment Posted';
      case 'upvote_received_stance':
        return 'Received Upvote on Stance';
      case 'upvote_received_comment':
        return 'Received Upvote on Comment';
      case 'upvote_received_review':
        return 'Received Upvote on Review';
      case 'onboarding_completed':
        return 'Completed Platform Onboarding';
      case 'welcome_tour_completed':
        return 'Completed Welcome Tour';
      case 'daily_streak':
        return `Daily Streak Bonus (${metadata?.streakDays || 0} days)`;
      default:
        return activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getActivityDescription = (activity: CredaActivity) => {
    const { metadata } = activity;
    return metadata?.action || metadata?.reason || 'Points earned for platform activity';
  };

  const getActivityCategory = (activityType: string) => {
    if (['review_given', 'upvote_received_review'].includes(activityType)) {
      return { name: 'Reviews', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (['stance_created', 'upvote_received_stance'].includes(activityType)) {
      return { name: 'Governance', color: 'bg-purple-100 text-purple-800' };
    }
    if (['vote_cast'].includes(activityType)) {
      return { name: 'Voting', color: 'bg-blue-100 text-blue-800' };
    }
    if (['quality_comment', 'normal_comment', 'upvote_received_comment'].includes(activityType)) {
      return { name: 'Engagement', color: 'bg-green-100 text-green-800' };
    }
    if (['onboarding_completed', 'welcome_tour_completed'].includes(activityType)) {
      return { name: 'Onboarding', color: 'bg-indigo-100 text-indigo-800' };
    }
    if (['daily_streak'].includes(activityType)) {
      return { name: 'Streak', color: 'bg-orange-100 text-orange-800' };
    }
    return { name: 'Activity', color: 'bg-slate-100 text-slate-800' };
  };

  // Use current user's Points instead of calculating from activities
  const totalCreda = currentUser?.credaPoints || user?.credaPoints || 0;
  const weeklyCreda = currentUser?.weeklyCreda || 0;

  // Calculate activity stats
  const activityStats = {
    reviews: credaActivities.filter((a: CredaActivity) => a.activityType.includes('review')).length,
    votes: credaActivities.filter((a: CredaActivity) => a.activityType.includes('vote')).length,
    comments: credaActivities.filter((a: CredaActivity) => a.activityType.includes('comment')).length,
    stances: credaActivities.filter((a: CredaActivity) => a.activityType === 'stance_created').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Points Activities</h1>
              <p className="text-slate-600">Track all your Points-earning activities on the platform</p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Points Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Points Card */}
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalCreda}</div>
                  <div className="text-yellow-100">Total Points</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Weekly Points Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{weeklyCreda}</div>
                  <div className="text-blue-100">Weekly Points</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Activities Count Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{credaActivities.length}</div>
                  <div className="text-purple-100">Activities</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>

          {/* Average Points Card */}
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {credaActivities.length > 0 ? Math.round(totalCreda / credaActivities.length) : 0}
                  </div>
                  <div className="text-green-100">Avg per Activity</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{activityStats.reviews}</div>
                <div className="text-sm text-yellow-700">Reviews</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activityStats.votes}</div>
                <div className="text-sm text-blue-700">Votes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activityStats.comments}</div>
                <div className="text-sm text-green-700">Comments</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{activityStats.stances}</div>
                <div className="text-sm text-purple-700">Stances</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <Zap className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Points Activities</h3>
                  <p className="text-slate-500 mb-4">
                    We couldn't load your Points activities. Please try refreshing the page.
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="grid gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                          </div>
                          <div className="w-16 h-6 bg-slate-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : credaActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Points activities yet</h3>
                  <p className="text-slate-500">
                    Start participating on the platform to earn Points points!
                  </p>
                </div>
              ) : (
                credaActivities.map((activity: CredaActivity) => {
                  const category = getActivityCategory(activity.activityType);
                  return (
                    <Card key={activity.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-slate-900 truncate">
                                    {getActivityTitle(activity)}
                                  </h3>
                                  <Badge variant="secondary" className={`text-xs ${category.color}`}>
                                    {category.name}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">
                                  {getActivityDescription(activity)}
                                </p>
                                <div className="flex items-center text-xs text-slate-500 gap-4">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge 
                                  variant={activity.credaAwarded > 0 ? "default" : "destructive"}
                                  className="flex items-center space-x-1 text-sm px-3 py-1"
                                >
                                  <Zap className="w-4 h-4" />
                                  <span>{activity.credaAwarded > 0 ? '+' : ''}{activity.credaAwarded}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
