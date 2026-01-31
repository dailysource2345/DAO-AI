import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { ModernNav } from "@/components/modern-nav";
import { ThreadCard } from "@/components/thread-card";
import { SpaceVoteCard } from "@/components/space-vote-card";
import { Leaderboard } from "@/components/leaderboard";
import { WelcomeOnboarding } from "@/components/welcome-onboarding";
import { SuccessToast } from "@/components/success-toast";
import { GrsScoreCard } from "@/components/grs-score-card";
import { AuthLoginCard } from "@/components/auth-login-card";
import { NewPostsBanner } from "@/components/new-posts-banner";
import { useNewPosts } from "@/hooks/useNewPosts";

import { SkeletonCard, SkeletonThreadCard, SkeletonLeaderboard, SkeletonStatsCard } from "@/components/skeleton-loader";
import { EmptyThreadsState } from "@/components/empty-state";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/Black and White Circle Global Tech Logo (1)_1762504013838.png";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { showOnboarding, completeOnboarding, triggerOnboarding, skipOnboarding, hasSkippedOnboarding } = useOnboardingContext();
  const [, setLocation] = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);

  // Consume referral token from X share links
  useEffect(() => {
    const linkReferral = async () => {
      // Only proceed if user is fully authenticated and session is established
      if (isAuthenticated && user && user.id) {
        const referralToken = localStorage.getItem('referralToken');
        
        if (referralToken) {
          try {
            await apiRequest('POST', '/api/link-referral', { referralToken });
            localStorage.removeItem('referralToken');
            console.log('Referral linked successfully');
          } catch (error) {
            console.error('Failed to link referral:', error);
            // Keep token in localStorage to retry later if auth failed
          }
        }
      }
    };
    
    linkReferral();
  }, [isAuthenticated, user]);

  const handleXConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setLocation("/onboarding");
    }, 200);
  };

  const handleLoadNewThreads = () => {
    loadNewThreads();
    refetchThreads();
  };

  // Fetch deployed business profiles (projects)
  const { data: projects = [], isLoading: projectsLoading } = useQuery<any[]>({
    queryKey: ["/api/businesses"],
  });

  // Fetch recent reviews
  const { data: recentReviews = [], isLoading: reviewsLoading } = useQuery<any[]>({
    queryKey: ["/api/reviews/recent"],
  });

  // Fetch recent project reviews
  const { data: projectReviews = [], isLoading: projectReviewsLoading } = useQuery<any[]>({
    queryKey: ["/api/project-reviews"],
    staleTime: 30000, // 30 seconds - allow fresh data
    refetchOnMount: true, // Always refetch when component mounts
  });

  const { data: recentThreads = [], isLoading: threadsLoading, refetch: refetchThreads } = useQuery<any[]>({
    queryKey: ["/api/threads/recent"],
  });

  const { data: spaceVoteComments = [], isLoading: voteCommentsLoading } = useQuery<any[]>({
    queryKey: ["/api/spaces/vote-comments"],
  });

  // Combine threads, space votes, reviews, and project reviews into a single feed
  const combinedFeed = [
    ...recentThreads.map((thread: any) => ({ ...thread, type: 'thread' })),
    ...spaceVoteComments.map((vote: any) => ({ ...vote, type: 'space_vote' })),
    ...recentReviews.map((review: any) => ({ ...review, type: 'review' })),
    ...projectReviews.map((review: any) => ({ ...review, type: 'project_review' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // New posts functionality for threads
  const {
    newPostsCount: newThreadsCount,
    showNewPostsBanner: showNewThreadsBanner,
    loadNewPosts: loadNewThreads,
    dismissNewPosts: dismissNewThreads,
  } = useNewPosts({
    enabled: isAuthenticated,
    queryKey: ["/api/threads/recent"],
    currentData: recentThreads,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/stats"],
  });

  const { data: userReferrals, isLoading: referralsLoading } = useQuery({
    queryKey: ["/api/referral/stats"],
    enabled: !!(user && (user as any).hasInviteAccess),
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<any[]>({
    queryKey: ["/api/leaderboard/global"],
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <ModernNav />

      {/* Success Toast for New Users */}
      <SuccessToast />

      {/* Welcome Onboarding Modal */}
      <WelcomeOnboarding
        isOpen={showOnboarding}
        onClose={completeOnboarding}
        onSkip={skipOnboarding}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Banner */}
        <div className="flex justify-center mb-8">
          <Link href="/rewards">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black dark:bg-white rounded-full border border-gray-800 dark:border-gray-200 hover:border-gray-600 dark:hover:border-gray-400 transition-colors cursor-pointer group">
              <span className="text-lime-500 font-bold text-sm">News</span>
              <span className="text-white dark:text-black text-sm font-medium">DAO AI Rewards are now live</span>
              <ArrowRight className="w-4 h-4 text-white dark:text-black group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Hero Section - Clean Minimalist Theme */}
        <div className="relative mb-16 py-16">
          {/* Main Content */}
          <div className="relative text-center px-4">
            <div className="flex items-center justify-center mb-8">
              <img src={logoImage} alt="DAO AI" className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight tracking-tight">
              Verified Reviews.{" "}
              <span className="text-black dark:text-white">
                On-Chain Trust.
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Discover trusted Web3 projects through blockchain-verified reviews. Share your experiences, build reputation, and help the community make informed decisions.
            </p>
            
            {!isAuthenticated && (
              <div className="flex items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-semibold px-8 rounded-md transition-colors" data-testid="button-get-started">
                  <Link href="/auth">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border border-gray-300 dark:border-gray-700 text-black dark:text-white font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" data-testid="button-browse-projects">
                  <Link href="/projects">Browse Projects</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Only show for authenticated users */}
        {isAuthenticated && user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-14">
            {statsLoading ? (
              <>
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
                <SkeletonStatsCard />
              </>
            ) : (
              <>
                <Card className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <TrendingUp className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-black dark:text-white">
                      {projects?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Active Projects</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <Star className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-black dark:text-white">
                      {stats?.totalThreads || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Reviews & Stances</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <Shield className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-black dark:text-white">
                      {(user as any)?.grsScore || 1300}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">GRS Score</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <Sparkles className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-black dark:text-white">
                      {(user as any)?.xpPoints || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">XP Points</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Projects to Review Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Web3 Projects to Review</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and review trusted blockchain projects
              </p>
            </div>
            <Button asChild variant="outline" className="border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md font-medium transition-colors">
              <Link href="/projects">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : projects && projects.length > 0 ? (
              projects.slice(0, 6).map((project: any) => (
                <Card 
                  key={project.id} 
                  className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group cursor-pointer bg-white dark:bg-black"
                  data-testid={`project-card-${project.id}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-800">
                        {project.logoUrl ? (
                          <img src={project.logoUrl} alt={project.companyName} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-lg font-bold text-black dark:text-white">{project.companyName[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-base text-black dark:text-white truncate">
                            {project.companyName}
                          </h3>
                          {project.averageRating > 0 && (
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded flex-shrink-0">
                              <Star className="w-3 h-3 fill-black dark:fill-white text-black dark:text-white" />
                              <span className="text-xs font-bold text-black dark:text-white">{(project.averageRating / 10).toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        {project.industry && (
                          <Badge variant="secondary" className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 border-0 text-gray-700 dark:text-gray-300">
                            {project.industry}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-200 dark:border-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.totalReviews || 0} {project.totalReviews === 1 ? 'review' : 'reviews'}
                      </span>
                      <Button asChild size="sm" variant="ghost" className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 h-8 -mr-2">
                        <Link href={`/business/${project.slug}`}>
                          View <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No projects available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-2">

            {/* Recent Activity Section */}
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Community Activity</h2>

              {/* New Posts Banner */}
              {showNewThreadsBanner && (
                <NewPostsBanner
                  newPostsCount={newThreadsCount}
                  onLoadNewPosts={handleLoadNewThreads}
                  onDismiss={dismissNewThreads}
                  variant="inline"
                  label="discussions"
                />
              )}

              <div className="space-y-4">
                {threadsLoading || voteCommentsLoading || reviewsLoading || projectReviewsLoading ? (
                  <div className="space-y-4">
                    <SkeletonThreadCard />
                    <SkeletonThreadCard />
                    <SkeletonThreadCard />
                  </div>
                ) : combinedFeed.length === 0 ? (
                  <EmptyThreadsState />
                ) : (
                  combinedFeed.map((item: any) => {
                    if (item.type === 'project_review') {
                      const reviewer = item.user;
                      const reviewerName = reviewer?.firstName 
                        ? `${reviewer.firstName} ${reviewer.lastName || ''}`.trim() 
                        : reviewer?.username || 'Anonymous';
                      const reviewerAvatar = reviewer?.profileImageUrl;
                      
                      return (
                        <Card 
                          key={`project-review-${item.id}`} 
                          className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black"
                          data-testid={`project-review-feed-${item.id}`}
                        >
                          <CardContent className="p-5">
                            {/* Reviewer Info */}
                            <div className="flex items-center gap-3 mb-4">
                              {reviewerAvatar ? (
                                <img 
                                  src={reviewerAvatar} 
                                  alt={reviewerName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                  <span className="text-sm font-bold text-black dark:text-white">
                                    {reviewerName[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-black dark:text-white">
                                    {reviewerName}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                          i < item.rating
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  reviewed <span className="font-medium text-black dark:text-white">{item.projectName}</span>
                                </p>
                              </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex items-start gap-4">
                              <Link href={`/business/${item.projectSlug}`}>
                                <img 
                                  src={item.projectLogo} 
                                  alt={item.projectName}
                                  className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 dark:border-gray-800"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                {item.title && (
                                  <h4 className="font-bold text-base text-black dark:text-white mb-2">
                                    "{item.title}"
                                  </h4>
                                )}
                                
                                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 text-sm leading-relaxed">
                                  {item.content}
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </span>
                                  <span>•</span>
                                  <Link href={`/business/${item.projectSlug}`} className="hover:underline hover:text-black dark:hover:text-white">
                                    View Project
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    if (item.type === 'review') {
                      return (
                        <Card 
                          key={`review-${item.id}`} 
                          className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors bg-white dark:bg-black"
                          data-testid={`review-feed-${item.id}`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-0">
                                    Review
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < (item.rating || 0) / 10
                                            ? 'fill-black dark:fill-white text-black dark:text-white'
                                            : 'fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                {item.title && (
                                  <h3 className="font-bold text-base text-black dark:text-white mb-2">
                                    {item.title}
                                  </h3>
                                )}
                                
                                <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 text-sm">
                                  {item.content}
                                </p>
                                
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    by {item.reviewer?.firstName ? `${item.reviewer.firstName} ${item.reviewer.lastName || ''}`.trim() : `@${item.reviewer?.username || 'Anonymous'}`}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    if (item.type === 'space_vote') {
                      return (
                        <SpaceVoteCard key={`vote-${item.id}`} vote={item} />
                      );
                    }
                    return (
                      <ThreadCard key={`thread-${item.id}`} thread={item} showDao />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: GRS Score, Leaderboard & Quick Actions */}
          <div className="space-y-6">
            {/* GRS Score Card - Only for authenticated users, AuthLoginCard for unauthenticated */}
            {isAuthenticated && user ? (
              <>
                <GrsScoreCard />
              </>
            ) : (
              <AuthLoginCard />
            )}

            <Leaderboard
              data={leaderboard}
              isLoading={leaderboardLoading}
              title="Top Contributors"
            />

            {/* Quick Actions - Only for authenticated users with invite access */}
            {isAuthenticated && (user as any)?.hasInviteAccess && (
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-5">Quick Actions</h3>
                  <div className="flex flex-col gap-2.5">
                    <Button asChild variant="outline" className="w-full border border-gray-300 dark:border-gray-700 h-10 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-sm">
                      <Link href={`/profile/${(user as any)?.username || (user as any)?.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border border-gray-300 dark:border-gray-700 h-10 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-sm">
                      <Link href="/projects">
                        Browse Projects
                      </Link>
                    </Button>
                    {!hasSkippedOnboarding && (
                      <Button
                        variant="outline"
                        className="w-full border border-gray-300 dark:border-gray-700 h-10 hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-sm"
                        onClick={() => triggerOnboarding()}
                      >
                        Retake Tour
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action for Unauthenticated Users */}
            {!isAuthenticated && (
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">Join DAO AI Today</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm leading-relaxed">
                    Share verified reviews, discover trusted Web3 projects, and build your on-chain reputation.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black h-10 font-semibold rounded-md transition-colors"
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}