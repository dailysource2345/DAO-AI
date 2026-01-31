import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { GovernanceIssueCard } from "@/components/governance-issue-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";
import { Heart, ChevronRight, Home, MessageSquare, TrendingUp, Users, Calendar, Star } from "lucide-react";
import { Link } from "wouter";
import { showAuthLoading } from "@/components/auth-loading-overlay";

const createIssueSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
});

export default function DaoForum() {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("latest");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const { data: dao, isLoading: daoLoading } = useQuery({
    queryKey: [`/api/daos/${slug}`],
  });

  const daoData = dao as any;
  const { isFollowing, isPending, toggleFollow } = useFollow(daoData?.id || 0);

  const { data: issues, isLoading: issuesLoading } = useQuery({
    queryKey: [`/api/daos/${daoData?.id}/issues`, sortBy],
    enabled: !!daoData?.id,
  });

  // Fetch reviews for this DAO's creator (if it's an unclaimed DAO profile)
  const { data: daoReviews } = useQuery({
    queryKey: [`/api/users/${daoData?.createdBy}/reviews`],
    enabled: !!daoData?.createdBy,
  });

  // Get real reviews for the DAO
  const getDaoReviews = () => {
    if (!daoReviews || !Array.isArray(daoReviews) || daoReviews.length === 0) {
      return [];
    }

    return daoReviews.slice(0, 3).map((review: any) => ({
      id: review.id,
      author: { 
        name: review.reviewerUsername || "Anonymous", 
        avatar: review.reviewerAvatar, 
        username: review.reviewerUsername 
      },
      content: review.content,
      rating: review.rating,
      date: new Date(review.createdAt).toLocaleDateString(),
      helpful: review.upvotes || 0
    }));
  };

  const displayReviews = getDaoReviews();

  const form = useForm<z.infer<typeof createIssueSchema>>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createIssueSchema>) => {
      await apiRequest("POST", "/api/issues", {
        ...data,
        daoId: daoData?.id
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Governance issue created successfully! You earned 5 points.",
      });
      setIsCreateOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: [`/api/daos/${daoData?.id}/issues`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard/global'] });

      const user = queryClient.getQueryData(["/api/auth/user"]) as any;
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/activity`] });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create thread",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof createIssueSchema>) => {
    createIssueMutation.mutate(values);
  };

  if (daoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!daoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">DAO not found</h2>
            <p className="text-slate-600">The DAO you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const issuesData = issues as any[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />

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

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="flex items-center hover:text-slate-700 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/home" className="hover:text-slate-700 transition-colors">
            Active DAOs
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{daoData.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 border border-white/20 backdrop-blur-sm mb-8">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    {daoData.logoUrl ? (
                      <img src={daoData.logoUrl} alt={daoData.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {daoData.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-bold text-slate-900">{daoData.name}</h1>
                    {daoData.creator?.isUnclaimedProfile && daoData.creator?.profileType === 'dao' ? (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Unclaimed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                        <Star className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 text-lg mb-4">{daoData.description}</p>

                  {/* Stats Row */}
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>1.2K followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>42 active stances</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>156 discussions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isAuthenticated && (user as any)?.hasInviteAccess ? (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={toggleFollow}
                    disabled={isPending}
                    className={`${isFollowing ? "text-red-600 hover:text-red-700 bg-white border-red-200" : "bg-primary hover:bg-primary/90"} shadow-sm`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isPending ? "..." : isFollowing ? "Following" : "Follow"}
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-white shadow-sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Authentication Required</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <Heart className="w-8 h-8 text-slate-400" />
                          <div>
                            <h3 className="font-medium text-slate-900">Follow This DAO</h3>
                            <p className="text-sm text-slate-500">
                              Connect your X account to follow DAOs and stay updated.
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => window.location.href = '/onboarding'}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Connect X Account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="flex items-center space-x-3">
                  {isAuthenticated && (user as any)?.hasInviteAccess ? (
                    <Link href="/create-stance">
                      <Button className="bg-primary hover:bg-primary/90 shadow-sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        New Stance
                      </Button>
                    </Link>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 shadow-sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          New Stance
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Authentication Required</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-400" />
                            <div>
                              <h3 className="font-medium text-slate-900">Create Governance Issue</h3>
                              <p className="text-sm text-slate-500">
                                Connect your X account to create stances and earn points.
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              showAuthLoading("Preparing your account...");
                              setTimeout(() => {
                                window.location.href = '/onboarding';
                              }, 300);
                            }}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            Connect X Account
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {isAuthenticated && (user as any)?.hasInviteAccess ? (
                    <Link href="/review-form">
                      <Button variant="outline" className="shadow-sm">
                        <Star className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="shadow-sm">
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Authentication Required</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <Star className="w-8 h-8 text-slate-400" />
                            <div>
                              <h3 className="font-medium text-slate-900">Create Review</h3>
                              <p className="text-sm text-slate-500">
                                Connect your X account to create reviews and earn points.
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              showAuthLoading("Preparing your account...");
                              setTimeout(() => {
                                window.location.href = '/onboarding';
                              }, 300);
                            }}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            Connect X Account
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Stances */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Stances</h2>
              <div className="flex space-x-2">
                <Button
                  variant={sortBy === "latest" ? "default" : "outline"}
                  onClick={() => setSortBy("latest")}
                  size="sm"
                  className="shadow-sm"
                >
                  Latest
                </Button>
                <Button
                  variant={sortBy === "top" ? "default" : "outline"}
                  onClick={() => setSortBy("top")}
                  size="sm"
                  className="shadow-sm"
                >
                  Top Voted
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {issuesLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading governance stances...</p>
                  </div>
                ) : issuesData?.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No stances yet</h3>
                    <p className="text-slate-500">Be the first to share your stance on this DAO!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {issuesData?.map((issue: any) => (
                      <div key={issue.id} className="p-6 hover:bg-slate-50/50 transition-all duration-200">
                        <GovernanceIssueCard issue={issue} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
}