import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Shield, 
  Download,
  Filter,
  Search,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle2,
  LayoutDashboard,
  Settings,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function BusinessDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [copiedLink, setCopiedLink] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: authCheck, isLoading: authLoading } = useQuery({
    queryKey: ['/api/company/check-auth'],
    retry: false,
  });

  const { data: businessProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/company/dashboard/profile'],
    enabled: !!authCheck?.authenticated,
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/company/dashboard/analytics'],
    enabled: !!authCheck?.authenticated,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/company/dashboard/reviews'],
    enabled: !!authCheck?.authenticated,
  });

  useEffect(() => {
    if (!authLoading && !authCheck?.authenticated) {
      setLocation('/company/login');
    }
  }, [authLoading, authCheck, setLocation]);

  const deployMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PUT", "/api/business/deploy", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/business/profile'] });
      toast({
        title: "Success!",
        description: "Your business page has been deployed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deploy business page",
        variant: "destructive",
      });
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: number; reply: string }) => {
      return await apiRequest("POST", `/api/company/dashboard/reviews/${reviewId}/reply`, { reply });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/company/dashboard/reviews'] });
      setReplyingTo(null);
      setReplyText("");
      toast({
        title: "Reply Posted!",
        description: "Your reply has been posted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive",
      });
    }
  });

  const handleDeploy = () => {
    deployMutation.mutate();
  };

  const handleReplySubmit = (reviewId: number) => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }
    replyMutation.mutate({ reviewId, reply: replyText });
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/projects/${businessProfile?.slug}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast({
      title: "Copied!",
      description: "Review link copied to clipboard",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!businessProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="text-2xl font-bold text-black dark:text-white">
                DAO AI
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Business
              </Badge>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-medium"
            data-testid="link-dashboard"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-medium"
            data-testid="link-reviews"
          >
            <FileText className="w-5 h-5 mr-3" />
            Reviews
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-medium"
            data-testid="link-analytics"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-medium"
            data-testid="link-settings"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            {businessProfile?.logo ? (
              <img 
                src={businessProfile.logo} 
                alt={businessProfile.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-black">
                  {businessProfile?.name?.[0] || 'B'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-black dark:text-white truncate">
                {businessProfile?.name || 'Business'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Business Account
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Welcome back, {businessProfile?.name || 'Business Owner'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your reviews today
            </p>
          </div>
          {!businessProfile?.isDeployed && (
            <Button 
              onClick={handleDeploy}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black font-bold"
              disabled={deployMutation.isPending}
              data-testid="button-deploy-page"
            >
              {deployMutation.isPending ? 'Deploying...' : 'Deploy Review Page'}
            </Button>
          )}
        </div>

        {/* Review Invite Widget */}
        {businessProfile?.slug && (
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 mb-8" data-testid="card-invite-widget">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-black dark:text-white">
                <Shield className="w-5 h-5 text-primary" />
                <span>Customer Review Link</span>
              </CardTitle>
              <CardDescription>Share this link with customers to collect verified reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input 
                  value={`${window.location.origin}/projects/${businessProfile.slug}`}
                  readOnly
                  className="font-mono text-sm bg-white dark:bg-gray-950"
                  data-testid="input-invite-link"
                />
                <Button 
                  onClick={handleCopyInviteLink}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  data-testid="button-copy-invite"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200 dark:border-gray-800" data-testid="card-total-reviews">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">{analytics?.totalReviews || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-800" data-testid="card-avg-rating">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="text-3xl font-bold text-black dark:text-white">{analytics?.averageRating || '0.0'}</div>
                <Star className="w-5 h-5 fill-primary text-primary" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-800" data-testid="card-rating-breakdown">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-600 dark:text-gray-400 w-6">{stars}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full" 
                        style={{ 
                          width: `${analytics?.ratingBreakdown?.[stars] 
                            ? (analytics.ratingBreakdown[stars] / (analytics.totalReviews || 1)) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 w-6">{analytics?.ratingBreakdown?.[stars] || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-800" data-testid="card-verified">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <span className="text-sm font-semibold">100%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">{analytics?.totalReviews || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified On-Chain</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reviews */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-black dark:text-white">Recent Reviews</CardTitle>
                    <CardDescription>Latest customer feedback from your verified reviews</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-export">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No reviews yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Share your review link to start collecting feedback</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review: any) => (
                      <div 
                        key={review.id} 
                        className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary/30 transition-colors"
                        data-testid={`review-${review.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          {review.user?.profileImageUrl ? (
                            <img 
                              src={review.user.profileImageUrl} 
                              alt={review.user.username}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-black">{(review.user?.username?.[0] || 'U').toUpperCase()}</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-bold text-black dark:text-white">{review.user?.username || 'Anonymous'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-gray-300 dark:text-gray-700'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.title && (
                              <h4 className="font-semibold text-black dark:text-white mb-1">{review.title}</h4>
                            )}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {review.content}
                            </p>
                            
                            {/* Company Reply Section */}
                            {review.companyReply && (
                              <div className="mt-3 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-3 rounded">
                                <div className="flex items-start space-x-2">
                                  {businessProfile?.logo ? (
                                    <img 
                                      src={businessProfile.logo} 
                                      alt={businessProfile.name}
                                      className="w-6 h-6 rounded-full flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-black">{businessProfile?.name?.[0]}</span>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-sm text-black dark:text-white">{businessProfile?.name}</span>
                                      <Badge variant="outline" className="text-xs">Company</Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.companyReply}</p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(review.companyRepliedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === review.id && (
                              <div className="mt-3 space-y-2">
                                <textarea
                                  className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                  placeholder={`Reply as ${businessProfile?.name}...`}
                                  rows={3}
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  autoFocus
                                />
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    onClick={() => handleReplySubmit(review.id)}
                                    disabled={replyMutation.isPending}
                                    size="sm"
                                  >
                                    {replyMutation.isPending ? "Posting..." : "Post Reply"}
                                  </Button>
                                  <Button 
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3 text-primary" />
                                <span className="text-xs text-primary font-semibold">Verified On-Chain</span>
                              </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              data-testid={`button-respond-${review.id}`}
                              onClick={() => {
                                if (review.companyReply) {
                                  toast({
                                    title: "Already Replied",
                                    description: "You've already replied to this review",
                                  });
                                } else {
                                  setReplyingTo(review.id);
                                  setReplyText("");
                                }
                              }}
                            >
                              {review.companyReply ? "Replied" : "Respond"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-primary hover:bg-primary/90 text-black font-semibold"
                  data-testid="button-deploy-fud-shield"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Deploy FUD Shield
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-request-reviews"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Reviews
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-view-analytics"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-embed-widget"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Embed Widget
                </Button>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percentage = stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 1 : 1;
                  return (
                    <div key={stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-semibold text-black dark:text-white">{stars}</span>
                        <Star className="w-3 h-3 fill-primary text-primary" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{percentage}%</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Activity This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Reviews</span>
                  <span className="text-lg font-bold text-primary">+142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Responses Sent</span>
                  <span className="text-lg font-bold text-black dark:text-white">98</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Widget Views</span>
                  <span className="text-lg font-bold text-black dark:text-white">12.4K</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
