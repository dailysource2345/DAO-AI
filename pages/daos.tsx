import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Users, Activity, Zap, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define types for DAO data
interface DaoData {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  category?: string;
  chain?: string;
  followers?: number;
  stances?: number;
  sentiment?: string;
  sentimentPercentage?: number;
  trendingScore?: number;
  isVerified?: boolean;
  topContributors?: Array<{
    id: number;
    username: string;
    avatar: string;
    grsScore: number;
  }>;
}

// Enhanced mock data with real-looking information
const ENHANCED_MOCK_DAOS: DaoData[] = [
  {
    id: 1,
    name: "Ethereum Foundation",
    slug: "ethereum-foundation",
    description: "Building infrastructure that supports cross-chain compatibility, powering user- and developer-experiences that make all chains work together like one.",
    logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=80&h=80&fit=crop&crop=center",
    category: "Base apps",
    chain: "Ethereum",
    followers: 12500,
    stances: 89,
    sentiment: "bullish",
    sentimentPercentage: 87,
    trendingScore: 95,
    isVerified: true,
    topContributors: [
      { id: 1, username: "vitalik.eth", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", grsScore: 850 },
      { id: 2, username: "danny_ryan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", grsScore: 780 },
      { id: 3, username: "ethresearch", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", grsScore: 720 }
    ]
  },
  {
    id: 2,
    name: "MakerDAO",
    slug: "makerdao", 
    description: "MakerDAO is real-time Ethereum, streaming transactions at lightning speed: sub-millisecond latency and 700,000+ TPS.",
    logoUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&h=80&fit=crop&crop=center",
    category: "DeFi Protocol",
    chain: "Ethereum",
    followers: 8900,
    stances: 64,
    sentiment: "bullish",
    sentimentPercentage: 92,
    trendingScore: 88,
    isVerified: true,
    topContributors: [
      { id: 4, username: "rune", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face", grsScore: 820 },
      { id: 5, username: "longforwisdom", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face", grsScore: 690 }
    ]
  },
  {
    id: 3,
    name: "Uniswap",
    slug: "uniswap",
    description: "Meet a new kind of crypto app, designed for humans. Uniswap builds decentralized trading infrastructure.",
    logoUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=80&h=80&fit=crop&crop=center",
    category: "DeFi Protocol", 
    chain: "Multi-chain",
    followers: 15200,
    stances: 112,
    sentiment: "bullish",
    sentimentPercentage: 79,
    trendingScore: 94,
    isVerified: true,
    topContributors: [
      { id: 6, username: "haydenz", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", grsScore: 750 },
      { id: 7, username: "ianlapham", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", grsScore: 680 }
    ]
  },
  {
    id: 4,
    name: "Compound",
    slug: "compound",
    description: "Reputation & credibility for crypto, driven by peer-to-peer reviews & secured by staked Ethereum. Meaningful crypto connections.",
    logoUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=80&h=80&fit=crop&crop=center",
    category: "Lending Protocol",
    chain: "Ethereum",
    followers: 6800,
    stances: 45,
    sentiment: "bullish", 
    sentimentPercentage: 84,
    trendingScore: 76,
    isVerified: true,
    topContributors: [
      { id: 8, username: "rleshner", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", grsScore: 780 },
      { id: 9, username: "arr00", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", grsScore: 640 }
    ]
  },
  {
    id: 5,
    name: "Arbitrum",
    slug: "arbitrum",
    description: "Arbitrum builds infrastructure that supports cross-chain compatibility, powering faster and cheaper Ethereum transactions.",
    logoUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&h=80&fit=crop&crop=center",
    category: "Layer 2",
    chain: "Ethereum L2",
    followers: 11400,
    stances: 73,
    sentiment: "bullish",
    sentimentPercentage: 91,
    trendingScore: 89,
    isVerified: true,
    topContributors: [
      { id: 10, username: "offchainlabs", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", grsScore: 790 },
      { id: 11, username: "hkalodner", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face", grsScore: 710 }
    ]
  }
];

const TRENDING_DAO = ENHANCED_MOCK_DAOS[0]; // Featured trending DAO

interface DaoCardProps {
  dao: DaoData;
}

function DaoCard({ dao }: DaoCardProps) {
  const getSentimentColor = (sentiment: string) => {
    return sentiment === "bullish" ? "text-green-500" : "text-red-500";
  };

  const getSentimentBg = (sentiment: string) => {
    return sentiment === "bullish" ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20";
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-border/20">
              <AvatarImage src={dao.logoUrl} alt={dao.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {dao.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {dao.isVerified && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {dao.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {dao.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{dao.chain}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {dao.description}
            </p>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className={`font-medium ${getSentimentColor(dao.sentiment || 'neutral')}`}>
              {dao.sentimentPercentage || 0}% {dao.sentiment || 'neutral'}
            </span>
            <span className="text-muted-foreground">
              Community sentiment
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                dao.sentiment === "bullish" ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${dao.sentimentPercentage}%` }}
            />
          </div>
        </div>

        {/* Top Contributors */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Top contributors:</span>
            <div className="flex -space-x-2">
              {dao.topContributors?.slice(0, 3).map((contributor) => (
                <Avatar key={contributor.id} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={contributor.avatar} alt={contributor.username} />
                  <AvatarFallback className="text-xs">
                    {contributor.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          
          <Link href={`/dao/${dao.slug}`}>
            <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View DAO
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedTrendingSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-border/50 mb-8">
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative p-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
            Most Upvoted
          </Badge>
          <span className="text-sm text-muted-foreground">Trending</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20 ring-4 ring-primary/20">
                <AvatarImage src={TRENDING_DAO.logoUrl} alt={TRENDING_DAO.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {TRENDING_DAO.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">{TRENDING_DAO.name}</h2>
                  {TRENDING_DAO.isVerified && (
                    <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary">{TRENDING_DAO.category}</Badge>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {TRENDING_DAO.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-500">
                {TRENDING_DAO.sentimentPercentage}% bullish
              </span>
              <span className="text-sm text-muted-foreground">
                Community trending
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-3 mb-6">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${TRENDING_DAO.sentimentPercentage}%` }}
              />
            </div>

            <Link href={`/dao/${TRENDING_DAO.slug}`}>
              <Button size="lg" className="w-full md:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Explore {TRENDING_DAO.name}
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Top Contributors</h3>
            {TRENDING_DAO.topContributors?.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contributor.avatar} alt={contributor.username} />
                    <AvatarFallback>
                      {contributor.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{contributor.username}</p>
                    <p className="text-sm text-muted-foreground">GRS: {contributor.grsScore}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Top {index === 0 ? 'Contributor' : index === 1 ? 'Advocate' : 'Member'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DaosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch DAOs from API
  const { data: apiDaos, isLoading, error } = useQuery({
    queryKey: ['/api/daos'],
    queryFn: async () => {
      const response = await fetch('/api/daos');
      if (!response.ok) throw new Error('Failed to fetch DAOs');
      return response.json();
    }
  });

  // Merge API data with enhanced mock data for demonstration
  // In production, this would only use API data
  const allDaos = apiDaos ? [...apiDaos.map((dao: any) => ({
    ...dao,
    category: dao.category || "Protocol",
    chain: dao.chain || "Ethereum", 
    followers: Math.floor(Math.random() * 15000) + 1000,
    stances: Math.floor(Math.random() * 100) + 10,
    sentiment: "bullish",
    sentimentPercentage: Math.floor(Math.random() * 30) + 70,
    trendingScore: Math.floor(Math.random() * 40) + 60,
    isVerified: true,
    topContributors: ENHANCED_MOCK_DAOS[0].topContributors?.slice(0, 2) || []
  })), ...ENHANCED_MOCK_DAOS] : ENHANCED_MOCK_DAOS;
  
  // Filter DAOs based on search query
  const filteredDaos = allDaos.filter((dao: DaoData) => 
    dao.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dao.description && dao.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (dao.category && dao.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Discover DAOs</h1>
              <p className="text-muted-foreground">
                Explore decentralized organizations driving the future of governance
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search DAOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Link href="/create-dao">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Create DAO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

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

        {/* Featured Trending Section */}
        <FeaturedTrendingSection />

        {/* DAO Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">All DAOs</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
{isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Loading DAOs...</span>
                  </div>
                ) : (
                  <span>Showing {filteredDaos.length} of {allDaos.length} DAOs</span>
                )}
            </div>
          </div>

          {filteredDaos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No DAOs found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDaos.map((dao) => (
                <DaoCard key={dao.id} dao={dao} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}