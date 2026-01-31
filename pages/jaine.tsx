import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Eye, TrendingUp, MessageSquare, Shield, Star, Target, CheckCircle, Gift, Zap } from "lucide-react";
import { Link } from "wouter";
import { UserGRSBadge } from "@/components/user-grs-badge";
import { UserProfilePopup } from "@/components/user-profile-popup";
import { ActivityCard } from "@/components/activity-card";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "@/lib/time-utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SpaceData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  category: string | null;
  bullishVotes: number;
  bearishVotes: number;
  totalVotes: number;
  memberCount: number;
  viewCount: number;
  isActive: boolean;
  isVerified: boolean;
}

interface UserVote {
  id: number;
  userId: string;
  spaceId: number;
  voteType: 'bullish' | 'bearish';
  comment: string | null;
  createdAt: string;
}

interface ActivityAuthor {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  grsScore?: number;
  isUnclaimedProfile?: boolean;
}

interface Activity {
  id: number;
  type: 'review' | 'stance';
  title?: string;
  content: string;
  createdAt: string;
  author: ActivityAuthor;
  reviewType?: string;
  rating?: number;
  stance?: string;
  upvotes?: number;
  spaceSlug?: string;
}

interface DailyTasksProgress {
  currentStreak: number;
  longestStreak: number;
  completedActionsToday: number;
  tasksComplete: boolean;
}

export default function Jaine() {
  const [api, setApi] = useState<CarouselApi>();
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedVoteType, setSelectedVoteType] = useState<'bullish' | 'bearish' | null>(null);
  const [voteComment, setVoteComment] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch Jaine space data
  const { data: space, isLoading: isLoadingSpace } = useQuery<SpaceData>({
    queryKey: ['/api/spaces/jaine'],
  });

  // Fetch user's current vote
  const { data: userVote } = useQuery<UserVote | null>({
    queryKey: ['/api/spaces/jaine/my-vote'],
  });

  // Fetch Jaine activities from the API
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/spaces/jaine/activities'],
  });

  // Fetch daily tasks progress
  const { data: dailyProgress } = useQuery<DailyTasksProgress>({
    queryKey: ['/api/daily-tasks/progress'],
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voteType, comment }: { voteType: 'bullish' | 'bearish', comment?: string }) => {
      return apiRequest("POST", '/api/spaces/jaine/vote', { voteType, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spaces/jaine'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spaces/jaine/my-vote'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spaces/vote-comments'] });
      setShowCommentDialog(false);
      setVoteComment('');
      setSelectedVoteType(null);
      toast({
        title: "Vote recorded",
        description: voteComment ? "Your vote and comment have been recorded." : "Your vote has been successfully recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Vote failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVoteClick = (voteType: 'bullish' | 'bearish') => {
    setSelectedVoteType(voteType);
    setShowCommentDialog(true);
  };

  const handleSubmitVote = () => {
    if (selectedVoteType) {
      voteMutation.mutate({ voteType: selectedVoteType, comment: voteComment || undefined });
    }
  };

  const handleSkipComment = () => {
    if (selectedVoteType) {
      voteMutation.mutate({ voteType: selectedVoteType });
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!api) return;

    const autoplayTimer = setInterval(() => {
      api.scrollNext();
    }, 4000);

    const stopAutoplay = () => clearInterval(autoplayTimer);
    const startAutoplay = () => {
      clearInterval(autoplayTimer);
      const newTimer = setInterval(() => {
        api.scrollNext();
      }, 4000);
      return newTimer;
    };

    api.on('pointerDown', stopAutoplay);
    api.on('pointerUp', () => {
      setTimeout(startAutoplay, 2000); // Resume after 2 seconds
    });

    return () => {
      clearInterval(autoplayTimer);
      api.off('pointerDown', stopAutoplay);
      api.off('pointerUp', startAutoplay);
    };
  }, [api]);

  // Calculate voting statistics from space data
  const totalVotes = space?.totalVotes || 0;
  const bullishVotes = space?.bullishVotes || 0;
  const bearishVotes = space?.bearishVotes || 0;
  const bullishPercentage = totalVotes > 0 ? Math.round((bullishVotes / totalVotes) * 100) : 0;
  const bearishPercentage = totalVotes > 0 ? Math.round((bearishVotes / totalVotes) * 100) : 0;

  // Mock team members data
  const teamMembers = [
    { id: 1, name: "Alice Chen", role: "Founder", avatar: "", grsScore: 2156, username: "alice_chen" },
    { id: 2, name: "Bob Martinez", role: "Tech Lead", avatar: "", grsScore: 1834, username: "bob_tech" },
    { id: 3, name: "Carol Kim", role: "Product Manager", avatar: "", grsScore: 1672, username: "carol_pm" },
    { id: 4, name: "David Park", role: "Community Lead", avatar: "", grsScore: 1543, username: "david_community" },
    { id: 5, name: "Emma Wilson", role: "Designer", avatar: "", grsScore: 1423, username: "emma_design" },
    { id: 6, name: "Frank Liu", role: "Developer", avatar: "", grsScore: 1389, username: "frank_dev" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/spaces" className="hover:text-slate-700 transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Spaces
          </Link>
        </div>

        {/* Space Header */}
        <div className="mb-8">
          <Card className="overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
            <CardContent className="p-8 text-white text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img 
                      src="https://pbs.twimg.com/profile_images/1940378940960284672/2zshWNfT_400x400.jpg" 
                      alt="Jaine Logo" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full"></div>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">Jaine</h1>
              <Badge className="bg-white/20 text-white border-white/30 mb-6">Infrastructure</Badge>

              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                JAINE is an AI native liquidity engine on 0G, an AI operating system; characterised as an "Intelligent AMM".
              </p>

              {/* Space Info Tabs */}
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Created</div>
                    <div className="text-xl font-semibold text-white">09/22/2025</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Status</div>
                    <div className="text-xl font-semibold text-white">Active</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">Chain</div>
                    <div className="text-xl font-semibold text-white">Zero Gravity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Voting Bar */}
        <div className="mb-8">
          <Card className="overflow-hidden bg-gradient-to-r from-green-900 via-slate-800 to-red-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    className={`px-4 py-2 ${
                      userVote?.voteType === 'bullish'
                        ? 'bg-green-700 hover:bg-green-800 text-white ring-2 ring-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    onClick={() => handleVoteClick('bullish')}
                    disabled={voteMutation.isPending || !!userVote}
                    data-testid="button-vote-bullish"
                  >
                    {userVote?.voteType === 'bullish' ? '✓ Your Vote' : '✓ Vote bullish'}
                  </Button>
                  <div className="text-white">
                    <span className="text-2xl font-bold">{bullishPercentage}% bullish</span>
                  </div>
                </div>

                <div className="text-center text-white/80">
                  <div className="text-sm font-medium">{totalVotes.toLocaleString()} {totalVotes === 1 ? 'vote' : 'votes'}</div>
                  {userVote && (
                    <div className="text-xs mt-1 text-white/60">You voted {userVote.voteType}</div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-white text-right">
                    <span className="text-2xl font-bold">{bearishPercentage}% bearish</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`px-4 py-2 ${
                      userVote?.voteType === 'bearish'
                        ? 'bg-red-700 hover:bg-red-800 text-white border-white ring-2 ring-white'
                        : 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                    }`}
                    onClick={() => handleVoteClick('bearish')}
                    disabled={voteMutation.isPending || !!userVote}
                    data-testid="button-vote-bearish"
                  >
                    {userVote?.voteType === 'bearish' ? '✗ Your Vote' : '✗ Vote bearish'}
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${bullishPercentage}%` }}
                />
                <div 
                  className="absolute right-0 top-0 h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${bearishPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Top Row - Team and About */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Details */}
            <div className="flex">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage 
                          src="https://pbs.twimg.com/profile_images/1940378940960284672/2zshWNfT_400x400.jpg" 
                          alt="Jaine" 
                        />
                        <AvatarFallback className="bg-purple-100 text-purple-800 font-bold text-lg">
                          J
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1">
                        <UserGRSBadge 
                          score={2143} 
                          size="sm" 
                          symbolOnly={true}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">Jaine Protocol</h3>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          98% positive (801 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GRS Score Display */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-800 mb-1">2143</div>
                      <div className="text-sm text-green-600 font-medium">GRS Score</div>
                      <div className="text-xs text-green-600/80">Governor I Level</div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    JAINE is an AI native liquidity engine built on 0G Network, functioning as an intelligent automated market maker that optimizes trading efficiency through advanced algorithms.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">AI</Badge>
                    <Badge variant="secondary">Liquidity Engine</Badge>
                    <Badge variant="secondary">AMM</Badge>
                    <Badge variant="secondary">0G Network</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Top Contributors */}
            <div className="flex">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Top Contributors
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Most credible members in the Jaine space</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    {teamMembers.map((member) => (
                      <UserProfilePopup 
                        key={member.id} 
                        username={member.username}
                        userId={member.username}
                      >
                        <div className="text-center cursor-pointer group">
                          <div className="relative mb-3 inline-block">
                            <Avatar className="w-16 h-16 ring-2 ring-slate-200 group-hover:ring-blue-500 transition-all duration-200">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-lg">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1">
                              <UserGRSBadge 
                                score={member.grsScore} 
                                size="sm" 
                                symbolOnly={true}
                                className="w-6 h-6"
                              />
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {member.name}
                          </div>
                        </div>
                      </UserProfilePopup>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Row - Expanded Jaine Reputation Leaderboard */}
          <div>
            <Card className="bg-slate-900 text-white border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                      <img 
                        src="https://pbs.twimg.com/profile_images/1940378940960284672/2zshWNfT_400x400.jpg" 
                        alt="Jaine Logo" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    Jaine Reputation Leaderboard
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-slate-800 border-slate-600 text-white px-4 py-2">
                      7D
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 px-4 py-2">
                      30D
                    </Button>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">Rankings based on GRS (Governance Reputation Score) performance</p>
              </CardHeader>
              <CardContent>
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 text-sm text-slate-400 font-medium mb-4 px-4 py-3 bg-slate-800/50 rounded-lg">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-5">Governor</div>
                  <div className="col-span-2 text-center">GRS Score</div>
                  <div className="col-span-2 text-center">XP Points</div>
                  <div className="col-span-2 text-center">Streak</div>
                </div>

                {/* Extended Leaderboard Entries */}
                <div className="space-y-2">
                  {teamMembers.map((member, index) => {
                    const xpPoints = 1500 - index * 150;
                    const streakDays = 45 - index * 5;

                    return (
                      <div key={member.id} className={`grid grid-cols-12 gap-4 items-center py-4 px-4 rounded-lg transition-colors hover:bg-slate-800/50 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-900/40 to-slate-800/40 border border-yellow-700/50' :
                        index === 1 ? 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border border-slate-600/50' :
                        index === 2 ? 'bg-gradient-to-r from-amber-900/40 to-slate-800/40 border border-amber-700/50' :
                        'bg-slate-800/20 hover:bg-slate-800/40'
                      }`}>
                        {/* Rank */}
                        <div className="col-span-1">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-slate-400 text-black' :
                              'bg-amber-600 text-white'
                            }`}>
                              {index + 1}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        {/* Governor Info */}
                        <div className="col-span-5 flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-slate-600">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-semibold text-white truncate">{member.name}</div>
                            <div className="text-sm text-slate-400 truncate">@{member.username} • {member.role}</div>
                          </div>
                          <div className="flex-shrink-0">
                            <UserGRSBadge 
                              score={member.grsScore} 
                              size="sm" 
                              symbolOnly={true}
                              className="w-6 h-6"
                            />
                          </div>
                        </div>

                        {/* GRS Score */}
                        <div className="col-span-2 text-center">
                          <div className="text-lg font-bold text-white">{member.grsScore.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">Total Score</div>
                        </div>

                        {/* XP Points */}
                        <div className="col-span-2 text-center">
                          <div className="text-lg font-bold text-green-400">{xpPoints.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">Total XP</div>
                        </div>

                        {/* Streak */}
                        <div className="col-span-2 text-center">
                          <div className="text-lg font-bold text-orange-400">{streakDays} days</div>
                          <div className="text-xs text-slate-400">Daily Streak</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View All Button */}
                <div className="pt-6 text-center">
                  <Button 
                    variant="outline" 
                    className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 px-8 py-3 text-base"
                    onClick={() => window.location.href = '/leaderboard'}
                  >
                    View Full Leaderboard →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jaine Quests Section */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-8 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Jaine Quests</h2>
                  <p className="text-purple-200 text-sm">Complete quests to earn XP and climb the leaderboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Gift className="w-3 h-3 mr-1" />
                  100,000 XP Pool
                </Badge>
              </div>
            </div>

            {/* Quest Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Quest 1 - Write a Review */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">+250 XP</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Write a Review</h3>
                  <p className="text-purple-200 text-sm mb-4">Share your experience with Jaine by writing a detailed review</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Progress</span>
                      <span className="text-white font-medium">0/1</span>
                    </div>
                    <Progress value={0} className="h-2 bg-white/20" />
                  </div>
                  <Link href="/review-form">
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      data-testid="button-quest-write-review"
                    >
                      Start Quest
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quest 2 - Vote on Sentiment */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">+100 XP</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cast Your Vote</h3>
                  <p className="text-purple-200 text-sm mb-4">Vote bullish or bearish on Jaine to share your sentiment</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Progress</span>
                      <span className="text-white font-medium">{userVote ? '1/1' : '0/1'}</span>
                    </div>
                    <Progress value={userVote ? 100 : 0} className="h-2 bg-white/20" />
                  </div>
                  <Button 
                    className={`w-full mt-4 ${userVote 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-default' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'} text-white`}
                    disabled={!!userVote}
                    onClick={() => document.querySelector('[data-testid="button-vote-bullish"]')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-quest-vote"
                  >
                    {userVote ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Completed</>
                    ) : (
                      'Start Quest'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Quest 3 - Create a Stance */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">+500 XP</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Create a Stance</h3>
                  <p className="text-purple-200 text-sm mb-4">Champion or challenge Jaine with a detailed stance post</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Progress</span>
                      <span className="text-white font-medium">0/1</span>
                    </div>
                    <Progress value={0} className="h-2 bg-white/20" />
                  </div>
                  <Link href="/create-stance">
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      data-testid="button-quest-create-stance"
                    >
                      Start Quest
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Daily Tasks Progress */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Daily Streak</h3>
                    <p className="text-purple-200 text-sm">
                      Complete 3 actions daily to maintain your streak ({dailyProgress?.completedActionsToday || 0}/3 today)
                    </p>
                  </div>
                </div>
                <Link href="/daily-tasks">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    View All Tasks
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => {
                  const currentStreak = dailyProgress?.currentStreak || 0;
                  const isActive = i < Math.min(currentStreak, 7);
                  return (
                    <div 
                      key={i} 
                      className={`h-3 rounded-full ${isActive ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-white/20'}`}
                    />
                  );
                })}
              </div>
              <p className="text-purple-300 text-sm mt-2">
                {dailyProgress?.currentStreak || 0} day streak 
                {dailyProgress?.currentStreak && dailyProgress.currentStreak > 0 ? ' - Keep it going!' : ' - Start your streak today!'}
                {dailyProgress?.longestStreak && dailyProgress.longestStreak > 0 && (
                  <span className="text-purple-400 ml-2">(Best: {dailyProgress.longestStreak} days)</span>
                )}
              </p>
            </div>
          </div>

          {/* Jaine Activities Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Jaine Activities</h2>
                  <p className="text-slate-600 text-sm">Reviews and stances where community members have tagged Jaine</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Community Tagged
              </Badge>
            </div>

            {/* Activity Cards Carousel */}
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1,
                  loop: true,
                }}
                setApi={setApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {isLoadingActivities ? (
                    <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ) : activities && activities.length > 0 ? (
                    activities.map((activity: any) => (
                      <CarouselItem key={activity.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <ActivityCard activity={activity} />
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="pl-2 md:pl-4">
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-8 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No activities yet</h3>
                        <p className="text-slate-600">
                          Be the first to tag Jaine in a review or stance!
                        </p>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg border-slate-300 hover:bg-slate-50" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg border-slate-300 hover:bg-slate-50" />
              </Carousel>
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-base"
              >
                View All Jaine Activities →
              </Button>
            </div>
          </div>




        </div>
      </main>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={selectedVoteType === 'bullish' ? 'text-green-600' : 'text-red-600'}>
                {selectedVoteType === 'bullish' ? '✓ Bullish' : '✗ Bearish'} Vote
              </span>
            </DialogTitle>
            <DialogDescription>
              Would you like to share why you're {selectedVoteType} on Jaine? (Optional)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={`Share your thoughts on why Jaine is ${selectedVoteType}...`}
              value={voteComment}
              onChange={(e) => setVoteComment(e.target.value)}
              className="min-h-[120px]"
              data-testid="input-vote-comment"
            />
            <p className="text-sm text-slate-500 mt-2">
              Your comment will appear on the main feed for others to see.
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleSkipComment}
              disabled={voteMutation.isPending}
              data-testid="button-skip-comment"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmitVote}
              disabled={voteMutation.isPending}
              className={selectedVoteType === 'bullish' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              data-testid="button-submit-vote-with-comment"
            >
              {voteMutation.isPending ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}