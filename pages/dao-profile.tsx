import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Star, Users, Activity, TrendingUp, MessageSquare, 
  ThumbsUp, ThumbsDown, Globe, ExternalLink, Heart, Share2,
  Calendar, Zap, Award, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "@/lib/time-utils";

// Mock data for individual DAO - in production this would come from API
const MOCK_DAO_DETAIL = {
  id: 1,
  name: "Ethereum Foundation",
  slug: "ethereum-foundation",
  description: "Building infrastructure that supports cross-chain compatibility, powering user- and developer-experiences that make all chains work together like one.",
  longDescription: "The Ethereum Foundation is a non-profit organization dedicated to supporting Ethereum and related technologies. We manage the Ethereum protocol development, fund research, and work with a global community of developers to push the boundaries of what's possible with decentralized technology.",
  logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop&crop=center",
  bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop",
  category: "Base apps",
  chain: "Ethereum",
  followers: 12500,
  stances: 89,
  totalVotes: 2847,
  sentiment: "bullish",
  sentimentPercentage: 87,
  isVerified: true,
  isFollowing: false,
  website: "https://ethereum.org",
  twitter: "@ethereum",
  discord: "ethereum.org/discord",
  createdAt: "2015-07-30",
  stats: {
    totalStances: 89,
    totalVotes: 2847,
    weeklyActivity: 156,
    topReputation: 850
  },
  topContributors: [
    { 
      id: 1, 
      username: "vitalik.eth", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", 
      grsScore: 850,
      contributions: 45,
      role: "Core Developer"
    },
    { 
      id: 2, 
      username: "danny_ryan", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", 
      grsScore: 780,
      contributions: 38,
      role: "Researcher"
    },
    { 
      id: 3, 
      username: "ethresearch", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", 
      grsScore: 720,
      contributions: 32,
      role: "Community Manager"
    },
    { 
      id: 4, 
      username: "trent_vanepps", 
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face", 
      grsScore: 680,
      contributions: 28,
      role: "Developer"
    },
    { 
      id: 5, 
      username: "tim_beiko", 
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face", 
      grsScore: 650,
      contributions: 25,
      role: "Protocol Coordinator"
    }
  ]
};

// Mock stances data
const MOCK_STANCES = [
  {
    id: 101,
    title: "EIP-4844: Proto-Danksharding Implementation",
    content: "This proposal would significantly reduce transaction costs on Ethereum L2s by introducing blob transactions. The technical implementation is sound and addresses one of the biggest scalability concerns.",
    author: { username: "vitalik.eth", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
    stance: "champion",
    championVotes: 234,
    challengeVotes: 45,
    opposeVotes: 12,
    commentCount: 67,
    createdAt: "2024-01-15",
    isActive: true
  },
  {
    id: 102,
    title: "Ethereum Staking Withdrawal Delays",
    content: "The recent delays in withdrawal processing are concerning for validators. We need better communication and technical solutions to address these bottlenecks in the system.",
    author: { username: "danny_ryan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
    stance: "challenge",
    championVotes: 89,
    challengeVotes: 156,
    opposeVotes: 23,
    commentCount: 43,
    createdAt: "2024-01-12",
    isActive: true
  },
  {
    id: 103,
    title: "MEV-Boost Centralization Concerns",
    content: "The current MEV-Boost infrastructure is becoming increasingly centralized with only a few major operators. This goes against Ethereum's decentralization principles and needs addressing.",
    author: { username: "ethresearch", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
    stance: "challenge",
    championVotes: 67,
    challengeVotes: 178,
    opposeVotes: 34,
    commentCount: 89,
    createdAt: "2024-01-08",
    isActive: true
  }
];

function StanceCard({ stance }: { stance: typeof MOCK_STANCES[0] }) {
  const totalVotes = stance.championVotes + stance.challengeVotes + stance.opposeVotes;
  const getStanceColor = (stanceType: string) => {
    return stanceType === "champion" ? "text-green-500" : "text-orange-500";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={stance.author.avatar} alt={stance.author.username} />
            <AvatarFallback>{stance.author.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">{stance.author.username}</span>
              <Badge variant={stance.stance === "champion" ? "default" : "secondary"} className="text-xs">
                {stance.stance}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(stance.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-3 text-foreground">
          {stance.title}
        </h3>

        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {stance.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">{stance.championVotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-medium">{stance.challengeVotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-medium">{stance.opposeVotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span>{stance.commentCount}</span>
            </div>
          </div>

          <Link href={`/issue/${stance.id}`}>
            <Button variant="outline" size="sm">
              View Stance
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DaoProfile() {
  const [match, params] = useRoute("/dao/:slug");
  const [isFollowing, setIsFollowing] = useState(false);

  if (!match) return null;

  // Fetch DAO data from API
  const { data: dao, isLoading, error } = useQuery({
    queryKey: ['/api/daos', params?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/daos/${params?.slug}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('DAO not found');
        throw new Error('Failed to fetch DAO');
      }
      return response.json();
    },
    enabled: !!params?.slug
  });

  // Fetch stances for this DAO
  const { data: stances } = useQuery({
    queryKey: ['/api/stances', dao?.id],
    queryFn: async () => {
      const response = await fetch(`/api/search?dao=${dao.slug}&type=issues`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.issues || [];
    },
    enabled: !!dao?.id
  });

  

  // Use mock data as fallback for demonstration
  const displayDao = dao ? {
    ...MOCK_DAO_DETAIL,
    ...dao,
    // Enhanced with mock data for features not yet in API
    longDescription: dao.description || MOCK_DAO_DETAIL.longDescription,
    bannerUrl: MOCK_DAO_DETAIL.bannerUrl,
    category: dao.category || "Protocol",
    chain: "Ethereum",
    followers: Math.floor(Math.random() * 15000) + 1000,
    stances: Math.floor(Math.random() * 100) + 10,
    totalVotes: Math.floor(Math.random() * 3000) + 500,
    sentiment: "bullish",
    sentimentPercentage: Math.floor(Math.random() * 30) + 70,
    isVerified: !dao.createdBy, // Only verified if not user-created
    website: dao.creator?.twitterUrl || "https://ethereum.org",
    twitter: dao.creator?.twitterHandle || "@ethereum",
    stats: MOCK_DAO_DETAIL.stats,
    topContributors: MOCK_DAO_DETAIL.topContributors
  } : MOCK_DAO_DETAIL;

  const displayStances = stances || MOCK_STANCES;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading DAO...</h3>
          <p className="text-muted-foreground">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl text-red-500">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">DAO Not Found</h3>
          <p className="text-muted-foreground mb-4">The DAO you're looking for doesn't exist or has been removed.</p>
          <Link href="/daos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DAOs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow DAO
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // TODO: Show toast notification
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Banner */}
      <div className="relative">
        {/* Banner Image */}
        <div 
          className="h-64 bg-gradient-to-br from-primary/20 to-primary/10 relative overflow-hidden"
          style={{
            backgroundImage: `url(${dao.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link href="/daos">
            <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DAOs
            </Button>
          </Link>
        </div>

        {/* DAO Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                <AvatarImage src={displayDao.logoUrl} alt={displayDao.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {displayDao.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{displayDao.name}</h1>
                  {displayDao.isVerified && (
                    <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
                  )}
                  <Badge variant="secondary" className="bg-background/80 text-foreground">
                    {displayDao.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-white/90">
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {displayDao.chain}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Since {new Date(displayDao.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pb-2">
                <Button 
                  variant={isFollowing ? "secondary" : "default"}
                  onClick={handleFollow}
                  className="bg-background/90 hover:bg-background text-foreground"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="secondary" size="icon" onClick={handleShare} className="bg-background/90 hover:bg-background">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Beta Development Notice */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">β</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Beta Development
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  DAO pages are currently in beta development. We're actively working on enhancing features and functionality. Your feedback helps us improve the experience!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  About {displayDao.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {displayDao.longDescription}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  {displayDao.website && (
                    <a href={displayDao.website} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-1 text-primary hover:underline">
                      <Globe className="w-4 h-4" />
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {(dao.twitterUrl || dao.creator?.twitterUrl) && (
                    <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <a 
                        href={dao.twitterUrl || dao.creator?.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline"
                      >
                        @{dao.twitterHandle || dao.creator?.twitterHandle}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Community Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-green-500">
                    {displayDao.sentimentPercentage}% bullish
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Based on {displayDao.totalVotes} votes
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-4 mb-4">
                  <div 
                    className="h-4 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                    style={{ width: `${displayDao.sentimentPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">{Math.round(displayDao.totalVotes * 0.87)}</div>
                    <div className="text-sm text-muted-foreground">Bullish</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{Math.round(displayDao.totalVotes * 0.10)}</div>
                    <div className="text-sm text-muted-foreground">Neutral</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{Math.round(displayDao.totalVotes * 0.03)}</div>
                    <div className="text-sm text-muted-foreground">Bearish</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            

            {/* Stances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Stances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {displayStances.slice(0, 3).map((stance: any) => (
                    <StanceCard key={stance.id} stance={stance} />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href={`/search?dao=${displayDao.slug}`}>
                    <Button variant="outline">
                      View All Stances
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Stances</span>
                  <span className="font-bold">{displayDao.stats.totalStances}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Votes</span>
                  <span className="font-bold">{displayDao.stats.totalVotes.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weekly Activity</span>
                  <span className="font-bold text-green-500">+{displayDao.stats.weeklyActivity}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Top Rep Score</span>
                  <span className="font-bold">{displayDao.stats.topReputation}</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayDao.topContributors.map((contributor: any, index: number) => (
                    <div key={contributor.id} className="flex items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-bold text-muted-foreground w-4">#{index + 1}</span>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={contributor.avatar} alt={contributor.username} />
                          <AvatarFallback>
                            {contributor.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contributor.username}</p>
                          <p className="text-xs text-muted-foreground">{contributor.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{contributor.grsScore}</div>
                        <div className="text-xs text-muted-foreground">GRS</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link href={`/dao/${displayDao.slug}/contributors`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Contributors
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/create-stance" className="block">
                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Stance
                  </Button>
                </Link>
                <Link href={`/search?dao=${displayDao.slug}`} className="block">
                  <Button variant="outline" className="w-full">
                    Browse Discussions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}