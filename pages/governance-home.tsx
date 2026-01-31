import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Search, TrendingUp, Users, MessageSquare, ArrowUp, ArrowDown, Eye, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "@/lib/time-utils";
import { Link } from "wouter";
import { NewPostsBanner } from "@/components/new-posts-banner";
import { useNewPosts } from "@/hooks/useNewPosts";

// Hero Section Component
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Co-founder of Zkasino, who scammed $33M",
      amount: "205",
      status: "slashed",
      votes: "78"
    },
    {
      title: "Solana Foundation's questionable treasury decisions",
      amount: "156",
      status: "slashed", 
      votes: "92"
    },
    {
      title: "Arbitrum's governance token distribution controversy",
      amount: "234",
      status: "slashed",
      votes: "145"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevSlide} className="text-slate-400 hover:text-white transition-colors">
          <ArrowUp className="w-6 h-6 rotate-[-90deg]" />
        </button>
        <button onClick={nextSlide} className="text-slate-400 hover:text-white transition-colors">
          <ArrowUp className="w-6 h-6 rotate-90" />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex -space-x-2">
            <div className="w-12 h-12 bg-red-500 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <span className="text-white font-bold">Z</span>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          "{slides[currentSlide].title}"
        </h2>

        <div className="flex items-center justify-center space-x-4 text-sm">
          <span className="text-red-400">₿ {slides[currentSlide].amount}</span>
          <span className="text-red-400">🔥 {slides[currentSlide].status}</span>
          <span className="text-slate-400">💬 {slides[currentSlide].votes}</span>
        </div>
      </div>

      <div className="text-center">
        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
          View all slashes
        </button>
      </div>
    </div>
  );
}

// Entity Card Component
function EntityCard({ entity, type = "positive" }: { entity: any; type: "positive" | "negative" }) {
  const isPositive = type === "positive";

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
      <CardContent className="p-6">
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '📈' : '📉'} {entity.voteCount}
          </div>
          <div className="text-slate-400 text-sm mb-4">
            {isPositive ? 'positive reviews' : 'negative reviews'}
          </div>

          <div className="w-16 h-16 bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{entity.name.charAt(0)}</span>
          </div>

          <h3 className="text-white font-semibold mb-4">{entity.name}</h3>

          <Button 
            variant="outline" 
            size="sm" 
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            What do you think?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Feed Item Component
function FeedItem({ issue }: { issue: any }) {
  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">{issue.author?.username?.[0] || 'U'}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-slate-400 text-sm">
                {issue.author?.username} vouched for
              </span>
              <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
                {issue.dao?.name || 'DAO'}
              </Badge>
              <span className="text-slate-500 text-sm">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </span>
            </div>

            <Link href={`/issue/${issue.id}`} className="block">
              <h3 className="text-white font-semibold mb-2 hover:text-blue-400 transition-colors">
                "{issue.title}"
              </h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {issue.content}
              </p>
            </Link>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-slate-400">{issue.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ArrowDown className="w-4 h-4 text-red-400" />
                <span className="text-slate-400">{issue.downvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">{issue.commentCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">{issue.activityScore}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GovernanceHome() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedFilter, setFeedFilter] = useState("hot");

  const { data: issues, isLoading: issuesLoading, refetch: refetchIssues } = useQuery({
    queryKey: ["/api/issues/recent"],
  });

    // New posts functionality for issues
    const {
      newPostsCount: newIssuesCount,
      showNewPostsBanner: showNewIssuesBanner,
      loadNewPosts: loadNewIssues,
      dismissNewPosts: dismissNewIssues,
    } = useNewPosts({
      enabled: isAuthenticated,
      queryKey: ["/api/issues/recent"],
      currentData: issues || [],
    });
  
    const handleLoadNewIssues = () => {
      loadNewIssues();
      refetchIssues();
    };

  const { data: daos } = useQuery({
    queryKey: ["/api/daos"],
  });

  // Mock data for entity cards
  const entities = [
    { id: 1, name: "Coin Hunter", voteCount: 13, type: "negative" },
    { id: 2, name: "Publius", voteCount: 3, type: "positive" },
    { id: 3, name: "Bybit", voteCount: 46, type: "positive" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DA</span>
                </div>
                <span className="text-white font-bold text-xl">DAO AI</span>
              </div>

              <nav className="flex space-x-6">
                <Link href="/governance" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Home
                </Link>
                <Link href="/listings" className="text-slate-400 hover:text-white transition-colors">
                  Listings
                </Link>
                <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-10 w-80"
                />
              </div>

              {isAuthenticated ? (
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">{user?.username?.[0] || 'U'}</span>
                </div>
              ) : (
                <Link href="/onboarding">
                  <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* User Status Bar */}
      <div className="bg-slate-800 border-b border-slate-700 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 text-sm">
            {daos?.slice(0, 8).map((dao: any) => (
              <div key={dao.id} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-slate-400">{dao.name}</span>
                <span className="text-slate-500">0.026</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-8">
            {/* Hero Section */}
            <HeroSection />

            {/* Entity Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {entities.map((entity) => (
                <EntityCard 
                  key={entity.id} 
                  entity={entity} 
                  type={entity.type as "positive" | "negative"}
                />
              ))}
            </div>

            {/* Feed Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Feed</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <Button
                      variant={feedFilter === "hot" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFeedFilter("hot")}
                      className="text-slate-400 hover:text-white"
                    >
                      Hot
                    </Button>
                    <Button
                      variant={feedFilter === "today" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFeedFilter("today")}
                      className="text-slate-400 hover:text-white"
                    >
                      Today
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                              {/* New Posts Banner */}
                {showNewIssuesBanner && (
                  <NewPostsBanner
                    newPostsCount={newIssuesCount}
                    onLoadNewPosts={handleLoadNewIssues}
                    onDismiss={dismissNewIssues}
                    variant="inline"
                    label="governance issues"
                  />
                )}

                {issuesLoading ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400">Loading governance issues...</div>
                  </div>
                ) : issues?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400">No governance issues yet</div>
                  </div>
                ) : (
                  issues?.map((issue: any) => (
                    <FeedItem key={issue.id} issue={issue} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">Y</span>
                  </div>
                  <h3 className="text-white font-semibold">YEET</h3>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-sm mb-2">Latest Activity</div>
                    <div className="text-white font-semibold">Governance Discussion</div>
                  </div>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-slate-400 text-sm mb-4">Recent Issues</div>
                    <div className="space-y-2">
                      {issues?.slice(0, 3).map((issue: any) => (
                        <Link key={issue.id} href={`/issue/${issue.id}`}>
                          <div className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                            <div className="text-white text-sm font-medium line-clamp-1">
                              {issue.title}
                            </div>
                            <div className="text-slate-400 text-xs mt-1">
                              {issue.upvotes} upvotes • {issue.commentCount} comments
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}