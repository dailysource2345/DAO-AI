import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { 
  Zap, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  FileText,
  Award,
  TrendingUp,
  Calendar,
  Activity,
  Shield,
  Flame,
  Target,
  Gift,
  Clock,
  Sparkles,
  Trophy,
  ChevronRight
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

export default function MyActivityPage() {
  const { user, isAuthenticated } = useAuth();
  const [animateBalance, setAnimateBalance] = useState(false);

  // Fetch user's current data
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
    staleTime: 0,
    refetchInterval: 60000,
  });

  // Fetch Points activities
  const { data: credaActivities = [], isLoading } = useQuery<CredaActivity[]>({
    queryKey: ['/api/users/creda-activities'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    setAnimateBalance(true);
    const timer = setTimeout(() => setAnimateBalance(false), 1000);
    return () => clearTimeout(timer);
  }, [currentUser?.credaPoints]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-16 px-4">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Sign In Required</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Sign in to view your rewards and track your Points earnings.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalCreda = currentUser?.credaPoints || 0;
  const weeklyCreda = currentUser?.weeklyCreda || 0;
  const dailyStreak = currentUser?.dailyStreak || 0;
  const longestStreak = currentUser?.longestStreak || 0;

  // Calculate statistics
  const activityStats = {
    reviews: credaActivities.filter((a) => a.activityType.includes('review')).length,
    votes: credaActivities.filter((a) => a.activityType.includes('vote')).length,
    comments: credaActivities.filter((a) => a.activityType.includes('comment')).length,
    stances: credaActivities.filter((a) => a.activityType === 'stance_created').length,
  };

  const totalActivities = activityStats.reviews + activityStats.votes + activityStats.comments + activityStats.stances;

  // Earning opportunities with Points amounts
  const earningOpportunities = [
    { name: 'Reviews', amount: 200, icon: Star, color: 'from-yellow-500 to-orange-500', progress: (activityStats.reviews / 10) * 100 },
    { name: 'Stances', amount: 50, icon: FileText, color: 'from-purple-500 to-pink-500', progress: (activityStats.stances / 10) * 100 },
    { name: 'Comments (Quality)', amount: 20, icon: MessageSquare, color: 'from-blue-500 to-cyan-500', progress: (activityStats.comments / 20) * 100 },
    { name: 'Comments (Normal)', amount: 10, icon: MessageSquare, color: 'from-green-500 to-emerald-500', progress: (activityStats.comments / 20) * 100 },
    { name: 'Votes', amount: 5, icon: ThumbsUp, color: 'from-indigo-500 to-purple-500', progress: (activityStats.votes / 20) * 100 },
    { name: 'Spam Reports', amount: 25, icon: Shield, color: 'from-red-500 to-rose-500', progress: 0 },
  ];

  // Milestones
  const milestones = [
    { amount: 1000, icon: Trophy, color: 'from-bronze-400 to-bronze-600', achieved: totalCreda >= 1000 },
    { amount: 5000, icon: Award, color: 'from-slate-400 to-slate-600', achieved: totalCreda >= 5000 },
    { amount: 10000, icon: Star, color: 'from-yellow-400 to-yellow-600', achieved: totalCreda >= 10000 },
    { amount: 25000, icon: Sparkles, color: 'from-emerald-400 to-emerald-600', achieved: totalCreda >= 25000 },
    { amount: 50000, icon: Flame, color: 'from-orange-400 to-red-600', achieved: totalCreda >= 50000 },
    { amount: 100000, icon: Target, color: 'from-purple-400 to-purple-600', achieved: totalCreda >= 100000 },
  ];

  const getActivityIcon = (activityType: string) => {
    if (activityType.includes('review')) return <Star className="w-5 h-5" />;
    if (activityType.includes('stance')) return <FileText className="w-5 h-5" />;
    if (activityType.includes('vote')) return <ThumbsUp className="w-5 h-5" />;
    if (activityType.includes('comment')) return <MessageSquare className="w-5 h-5" />;
    if (activityType.includes('streak')) return <Flame className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  const getActivityColor = (activityType: string) => {
    if (activityType.includes('review')) return 'from-yellow-500 to-orange-500';
    if (activityType.includes('stance')) return 'from-purple-500 to-pink-500';
    if (activityType.includes('vote')) return 'from-blue-500 to-cyan-500';
    if (activityType.includes('comment')) return 'from-green-500 to-emerald-500';
    if (activityType.includes('streak')) return 'from-orange-500 to-red-500';
    return 'from-slate-500 to-slate-600';
  };

  const getActivityTitle = (activity: CredaActivity) => {
    const { activityType, metadata } = activity;
    if (activityType.includes('review')) return `Review ${metadata?.reviewedUsername ? `for ${metadata.reviewedUsername}` : 'Given'}`;
    if (activityType === 'stance_created') return 'Governance Stance Created';
    if (activityType.includes('vote')) return `Vote Cast`;
    if (activityType.includes('comment')) return 'Comment Posted';
    if (activityType.includes('streak')) return `Daily Streak Bonus`;
    return activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 dark:from-lime-600 dark:via-green-600 dark:to-emerald-700">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-white animate-pulse absolute -top-2 -left-2" />
                <Zap className="w-16 h-16 text-white" />
                <Sparkles className="w-12 h-12 text-white animate-pulse absolute -bottom-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Your Points Balance
            </h1>
            
            <div className={`text-7xl md:text-8xl font-black text-white mb-6 transition-all duration-500 ${animateBalance ? 'scale-110' : 'scale-100'}`} data-testid="creda-balance">
              {totalCreda.toLocaleString()}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg font-semibold">{weeklyCreda.toLocaleString()} this week</span>
              </div>
              <div className="w-1 h-6 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span className="text-lg font-semibold">{dailyStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-lime-50 dark:from-slate-900 dark:to-lime-950" data-testid="stat-total-creda">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-10 h-10 text-lime-600 dark:text-lime-400" />
                <Badge className="bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300">Total</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {totalCreda.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Points</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950" data-testid="stat-weekly-creda">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">7 Days</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {weeklyCreda.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Weekly Points</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-orange-950" data-testid="stat-streak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Record: {longestStreak}</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {dailyStreak}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Streak Days</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950" data-testid="stat-activities">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">All Time</Badge>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {totalActivities}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Activities</div>
            </CardContent>
          </Card>
        </div>

        {/* Earning Opportunities */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ways to Earn Points</h2>
            <Gift className="w-8 h-8 text-lime-600 dark:text-lime-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earningOpportunities.map((opportunity, index) => {
              const Icon = opportunity.icon;
              return (
                <Card 
                  key={index}
                  className="border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden"
                  data-testid={`earning-${opportunity.name.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${opportunity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-black bg-gradient-to-r ${opportunity.color} bg-clip-text text-transparent`}>
                          +{opportunity.amount}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Points</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                      {opportunity.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Your Progress</span>
                        <span className="font-bold text-slate-900 dark:text-white">{Math.min(opportunity.progress, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(opportunity.progress, 100)} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements & Milestones */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Milestones</h2>
            <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <Card 
                  key={index}
                  className={`border-2 transition-all duration-300 ${
                    milestone.achieved 
                      ? 'bg-gradient-to-br from-white to-yellow-50 dark:from-slate-900 dark:to-yellow-950 shadow-xl hover:scale-105' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  data-testid={`milestone-${milestone.amount}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center mb-3 ${milestone.achieved ? 'animate-pulse' : ''}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mb-1">
                      {milestone.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {milestone.achieved ? 'Achieved!' : 'Points'}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Points Activities */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Recent Activity</h2>
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : credaActivities.length === 0 ? (
                <div className="text-center py-16">
                  <Activity className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No activities yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Start participating to earn Points and see your activity here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {credaActivities.slice(0, 10).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      data-testid={`activity-${activity.id}`}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getActivityColor(activity.activityType)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-white`}>
                        {getActivityIcon(activity.activityType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {getActivityTitle(activity)}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white font-bold text-sm px-4 py-1">
                          +{activity.credaAwarded}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
