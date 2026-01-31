import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown, 
  Target, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Users, 
  Activity, 
  Calendar, 
  Zap,
  BarChart3,
  RefreshCw,
  Info,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";

// GRS Levels matching other components
const GRS_LEVELS = [
  { name: "Unreliable", range: [0, 800], color: "#D62828", bgColor: "#fef2f2" },
  { name: "Unproven", range: [801, 1050], color: "#F77F00", bgColor: "#fff7ed" },
  { name: "Neutral", range: [1051, 1300], color: "#E0E0E0", bgColor: "#f8fafc" },
  { name: "Contributor", range: [1301, 1550], color: "#4EA8DE", bgColor: "#f0f9ff" },
  { name: "Trusted", range: [1551, 1800], color: "#0077B6", bgColor: "#eff6ff" },
  { name: "Shaper I", range: [1801, 2050], color: "#43AA8B", bgColor: "#f0fdf4" },
  { name: "Shaper II", range: [2051, 2300], color: "#2D6A4F", bgColor: "#f0fdf4" },
  { name: "Governor I", range: [2301, 2550], color: "#9D4EDD", bgColor: "#faf5ff" },
  { name: "Governor II", range: [2551, 2800], color: "#7209B7", bgColor: "#f3e8ff" },
];

function getGRSLevel(score: number) {
  return GRS_LEVELS.find(level => score >= level.range[0] && score <= level.range[1]) || GRS_LEVELS[0];
}

// Actual GRS Impact Measures based on the system specification
const SCORE_IMPACT_FACTORS = [
  {
    id: 'stance_success_rate',
    name: 'Stance Success Rate',
    description: 'How often your stance positions align with community consensus',
    currentImpact: 145,
    maxImpact: 250,
    weight: 25,
    trend: 'up',
    recentChange: +12,
    icon: Target,
    color: '#4EA8DE',
    scoring: 'Champion/Challenge stance success: +250, Failure: -150'
  },
  {
    id: 'stance_target_impact',
    name: 'Stance Target Impact',
    description: 'How community consensus affects the person being championed/challenged',
    currentImpact: 89,
    maxImpact: 200,
    weight: 20,
    trend: 'down',
    recentChange: -8,
    icon: Users,
    color: '#43AA8B',
    scoring: 'Championed & supported: +180, Challenged & agreed: -200'
  },
  {
    id: 'voter_accountability',
    name: 'Voter Accountability',
    description: 'Reward people who vote on the winning side',
    currentImpact: 132,
    maxImpact: 50,
    weight: 15,
    trend: 'up',
    recentChange: +18,
    icon: ThumbsUp,
    color: '#9D4EDD',
    scoring: 'Winning side: +50, Losing side: -30, No vote: -15'
  },
  {
    id: 'review_quality_received',
    name: 'Review Quality Received',
    description: 'How the community views your contributions',
    currentImpact: 78,
    maxImpact: 160,
    weight: 22,
    trend: 'neutral',
    recentChange: +2,
    icon: Star,
    color: '#F77F00',
    scoring: 'High GRS positive: +160, Medium: +100, Low: +50'
  },
  {
    id: 'review_accuracy_given',
    name: 'Review Accuracy Given',
    description: 'Whether your reviews of others prove accurate over time',
    currentImpact: 94,
    maxImpact: 80,
    weight: 18,
    trend: 'up',
    recentChange: +7,
    icon: MessageSquare,
    color: '#2D6A4F',
    scoring: 'Accurate positive/negative: +70-80, Inaccurate: -50-60'
  }
];

// Helper function to get icon for GRS history event type
function getIconForEventType(reason: string) {
  if (reason.toLowerCase().includes('review')) return Star;
  if (reason.toLowerCase().includes('stance')) return Target;
  if (reason.toLowerCase().includes('vote')) return ThumbsUp;
  if (reason.toLowerCase().includes('champion')) return Users;
  return Activity;
}

export default function GRSAnalytics() {
  const { user } = useAuth();
  const search = useSearch();
  const queryParams = new URLSearchParams(search);
  const userIdParam = queryParams.get('userId');
  const targetUserId = userIdParam || (user as any)?.id;
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  // Redirect only if not authenticated AND no userId parameter is provided
  if (!user && !userIdParam) {
    window.location.href = '/auth';
    return null;
  }

  // If no target user is identified at all, redirect
  if (!targetUserId) {
    window.location.href = '/auth';
    return null;
  }

  // Fetch target user data if viewing someone else's profile
  const { data: targetUser } = useQuery({
    queryKey: [`/api/users/${targetUserId}`],
    enabled: !!targetUserId && targetUserId !== (user as any)?.id,
  });

  const isOwnProfile = user && targetUserId === (user as any)?.id;
  const displayUser = isOwnProfile ? user : targetUser;

  // Fetch GRS score and history
  const { data: grsScore, isLoading: grsLoading } = useQuery({
    queryKey: [isOwnProfile ? "/api/grs/score" : `/api/grs/score/${targetUserId}`],
    enabled: !!targetUserId,
  });

  const { data: grsHistory, isLoading: historyLoading } = useQuery({
    queryKey: [isOwnProfile ? "/api/grs/history" : `/api/grs/history/${targetUserId}`],
    enabled: !!targetUserId,
  });

  // Fetch advanced review stats for score metrics
  const { data: advancedReviewStats, isLoading: reviewStatsLoading } = useQuery({
    queryKey: [isOwnProfile ? `/api/users/${user?.id}/advanced-review-stats` : `/api/users/${targetUserId}/advanced-review-stats`],
    enabled: !!targetUserId,
  });

  const currentScore = (grsScore as any)?.score ?? 1300;
  const currentLevel = getGRSLevel(currentScore);
  const percentile = Math.min(Math.round((currentScore / 2800) * 100), 100);

  // Calculate total weighted score from factors
  const impactFactorsData = useQuery({
    queryKey: [isOwnProfile ? "/api/grs/impact-factors" : `/api/grs/impact-factors/${targetUserId}`],
    enabled: !!targetUserId,
  });
  const impactFactors = impactFactorsData?.data?.impactFactors || [];
  const totalWeightedScore = impactFactorsData?.data?.totalWeightedScore || 0;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
                  Early Development Notice
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                  DAO AI credibility scores are still early in development and subject to change. We are actively working on improving them as we gather feedback from our community and observe data/usage patterns. Our primary objective is to always ensure credibility scores are fraud and sybil resistant.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              GRS Analytics
            </h1>
            <p className="text-slate-600">
              {isOwnProfile 
                ? "Your Governance Reputation Score breakdown and insights"
                : `${(displayUser as any)?.username || 'User'}'s Governance Reputation Score breakdown and insights`
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Refetch logic might need adjustment if the user ID changes
                // For now, we refresh based on the currently viewed user
                const queryKeyPrefix = isOwnProfile ? "/api/grs/score" : `/api/grs/score/${targetUserId}`;
                // This is a simplified refetch. In a real app, you'd likely manage queryClient and specific keys.
                window.location.reload(); 
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Current Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Score Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Current GRS Score
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                  BETA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-black gradient-text mb-2">
                    {currentScore}
                  </div>
                  <div 
                    className="inline-flex items-center px-3 py-1 rounded-lg text-white font-semibold text-sm"
                    style={{ backgroundColor: currentLevel.color }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/40 mr-2"></div>
                    {currentLevel.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {percentile}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Percentile Rank
                  </div>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progress to next level</span>
                  <span className="font-medium">
                    {currentLevel.range[1] - currentScore} points needed
                  </span>
                </div>
                <Progress 
                  value={((currentScore - currentLevel.range[0]) / (currentLevel.range[1] - currentLevel.range[0])) * 100}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{currentLevel.range[0]}</span>
                  <span>{currentLevel.range[1]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Circular GRS Score */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-blue-600" />
                Governance Reputation Score
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  BETA
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4 pb-6">
              {/* Circular Progress Ring */}
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  {/* Background Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                    className="opacity-20"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#grsGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${((currentScore - currentLevel.range[0]) / (currentLevel.range[1] - currentLevel.range[0])) * 440} 440`}
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="grsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {currentScore}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    GRS Score
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div 
                className="px-6 py-3 rounded-full text-white font-semibold text-base mb-6 flex items-center gap-2"
                style={{ backgroundColor: currentLevel.color }}
              >
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                {currentLevel.name} | {currentLevel.range[0]}-{currentLevel.range[1]}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {percentile}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Percentile
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {currentLevel.range[1] - currentScore}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    To Next Level
                  </div>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="mt-6 w-full">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="text-sm text-orange-800 font-medium">
                      GRS in early development
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="impact-factors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="impact-factors" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Impact Factors
            </TabsTrigger>
          </TabsList>

          {/* Impact Factors Tab */}
          <TabsContent value="impact-factors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  GRS Score Impact Summary
                </CardTitle>
                <CardDescription>
                  Track how your governance activities are affecting your reputation score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* GRS Impact Factors */}
                  <div>
                    <h4 className="font-semibold mb-6 text-slate-700 dark:text-slate-300">Governance Reputation Elements</h4>
                    <div className="space-y-4">
                      {impactFactorsData.isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-slate-500">Loading impact factors...</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Base Score */}
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                                  <Award className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">Base Score</div>
                                  <div className="text-xs text-muted-foreground">Your foundation governance score</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">1300</div>
                                <div className="text-xs text-green-600">(baseline)</div>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>

                          {impactFactors.map((factor: any, index: number) => {
                            const getFactorIcon = (factorId: string) => {
                              if (factorId.includes('stance')) return Target;
                              if (factorId.includes('review_accuracy')) return Star;
                              if (factorId.includes('review_consistency')) return Activity;
                              if (factorId.includes('review_helpfulness')) return ThumbsUp;
                              if (factorId.includes('champion')) return Users;
                              return Activity;
                            };

                            const getFactorTitle = (factorId: string) => {
                              if (factorId === 'stance_success_rate') return 'Stance Success Rate';
                              if (factorId === 'review_accuracy') return 'Review Accuracy';
                              if (factorId === 'review_consistency') return 'Review Consistency';
                              if (factorId === 'review_helpfulness') return 'Review Helpfulness';
                              if (factorId === 'champion_endorsements') return 'Champion Endorsements';
                              return factor.name;
                            };

                            const getFactorDescription = (factorId: string) => {
                              if (factorId === 'stance_success_rate') return 'Accuracy of your governance predictions';
                              if (factorId === 'review_accuracy') return 'Quality of your user evaluations';
                              if (factorId === 'review_consistency') return 'Consistency in review standards';
                              if (factorId === 'review_helpfulness') return 'Community value of your reviews';
                              if (factorId === 'champion_endorsements') return 'Recognition from governance leaders';
                              return factor.description || 'Impact on your governance reputation';
                            };

                            const getImpactRange = (impact: number) => {
                              if (impact >= 200) return 'Major Boost (+200-300)';
                              if (impact >= 100) return 'Strong Boost (+100-200)';
                              if (impact >= 50) return 'Moderate Boost (+50-100)';
                              if (impact >= 20) return 'Minor Boost (+20-50)';
                              if (impact >= 5) return 'Small Boost (+5-20)';
                              if (impact > 0) return 'Slight Boost (+1-5)';
                              if (impact === 0) return 'Neutral (0)';
                              if (impact >= -20) return 'Minor Penalty (-1 to -20)';
                              if (impact >= -50) return 'Moderate Penalty (-20 to -50)';
                              if (impact >= -100) return 'Strong Penalty (-50 to -100)';
                              return 'Major Penalty (-100+)';
                            };

                            const getImpactColor = (impact: number) => {
                              if (impact > 50) return 'text-green-600';
                              if (impact > 0) return 'text-green-500';
                              if (impact === 0) return 'text-slate-500';
                              if (impact > -20) return 'text-orange-500';
                              return 'text-red-500';
                            };

                            const getProgressColor = (impact: number) => {
                              if (impact > 50) return 'bg-green-600';
                              if (impact > 0) return 'bg-green-500';
                              if (impact === 0) return 'bg-slate-400';
                              if (impact > -20) return 'bg-orange-500';
                              return 'bg-red-500';
                            };

                            const getProgressWidth = (current: number, max: number) => {
                              return Math.min(Math.abs(current) / max * 100, 100);
                            };

                            const Icon = getFactorIcon(factor.id);
                            const maxValue = factor.maxImpact || 100;
                            const progressWidth = getProgressWidth(factor.currentImpact, maxValue);

                            return (
                              <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                                      <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{getFactorTitle(factor.id)}</div>
                                      <div className="text-xs text-muted-foreground">{getFactorDescription(factor.id)}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold">{Math.round(factor.currentImpact)}</div>
                                    <div className={`text-xs ${getImpactColor(factor.currentImpact)}`}>
                                      (max: {maxValue})
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-2">
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${getProgressColor(factor.currentImpact)}`}
                                      style={{ width: `${progressWidth}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <div className={`text-xs font-medium ${getImpactColor(factor.currentImpact)}`}>
                                    {getImpactRange(factor.currentImpact)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Total: {Math.round(factor.currentImpact * factor.weight / 100)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Total Score Display */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                  <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="font-semibold text-lg">Current GRS Score</div>
                                  <div className="text-sm text-muted-foreground">Your total governance reputation</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-black gradient-text">{currentScore}</div>
                                <div className="text-sm text-muted-foreground">
                                  {currentLevel.name} • {percentile}th percentile
                                </div>
                              </div>
                            </div>
                            {/* Score Breakdown */}
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                              <div className="text-xs text-muted-foreground mb-2">Score Breakdown:</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                  <span>Base Score:</span>
                                  <span className="font-medium">1300</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Impact Factors:</span>
                                  <span className={`font-medium ${(totalWeightedScore) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {(totalWeightedScore) >= 0 ? '+' : ''}{Math.round(totalWeightedScore)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-1 col-span-2">
                                  <span>Total:</span>
                                  <span>{1300 + Math.round(totalWeightedScore)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          </TabsContent>




        </Tabs>


      </div>
    </div>
  );
}