import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigation } from "@/components/navigation";
import { ThreadCard } from "@/components/thread-card";
import ConfidentialIdentityLink from "@/components/ConfidentialIdentityLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { InteractiveGRSGauge } from "@/components/interactive-grs-gauge";
import { ReviewModal } from "@/components/review-modal";
import { ShareProfileCard } from "@/components/share-profile-card";
import { PlatformActivity } from "@/components/platform-activity";
import { SkeletonProfileHeader } from "@/components/skeleton-loader";
import { apiRequest } from "@/lib/queryClient";
import { 
  Lock, 
  ExternalLink, 
  Wallet, 
  Star, 
  TrendingUp,
  Users,
  MessageSquare,
  Award,
  Target,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  FileText,
  UserCheck,
  UserPlus,
  Timer,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Edit,
  AlertCircle,
  CheckCircle,
  Shield,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { XIcon, TelegramIcon, DiscordIcon } from "@/components/social-icons";
import { formatDistanceToNow } from "@/lib/time-utils";

// Profile edit form schema
const profileEditSchema = z.object({
  firstName: z.string().max(50, "First name must be 50 characters or less").optional(),
  lastName: z.string().max(50, "Last name must be 50 characters or less").optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  telegramHandle: z.string().max(50, "Telegram handle must be 50 characters or less").optional(),
  discordHandle: z.string().max(50, "Discord handle must be 50 characters or less").optional(),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("Please enter a valid GitHub URL").or(z.literal("")).optional(),
  governanceInterests: z.string().max(1000, "Governance interests must be 1000 characters or less").optional(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

// GRS Levels constant
const GRS_LEVELS = [
  { name: "Unreliable", range: [0, 800], color: "#D62828", degreeSpan: 51.43 },
  { name: "Unproven", range: [801, 1050], color: "#F77F00", degreeSpan: 16.07 },
  { name: "Neutral", range: [1051, 1300], color: "#E0E0E0", degreeSpan: 16.07 },
  { name: "Contributor", range: [1301, 1550], color: "#4EA8DE", degreeSpan: 16.07 },
  { name: "Trusted", range: [1551, 1800], color: "#0077B6", degreeSpan: 16.07 },
  { name: "Shaper I", range: [1801, 2050], color: "#43AA8B", degreeSpan: 16.07 },
  { name: "Shaper II", range: [2051, 2300], color: "#2D6A4F", degreeSpan: 16.07 },
  { name: "Governor I", range: [2301, 2550], color: "#9D4EDD", degreeSpan: 16.07 },
  { name: "Governor II", range: [2551, 2800], color: "#7209B7", degreeSpan: 16.07 },
];

// Function to determine GRS level based on score
function getGRSLevel(score: number) {
  for (const level of GRS_LEVELS) {
    if (score >= level.range[0] && score <= level.range[1]) {
      return { level: level.name, color: level.color };
    }
  }
  return { level: "Unreliable", color: "#D62828" };
}

// Dummy component for UserReviews (replace with actual implementation if available)
const UserReviews = ({ reviews, canReview, onSubmitReview, isLoading }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Star className="w-5 h-5 text-yellow-500" />
          Community Reviews
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">{reviews.length}</span> reviews
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-semibold text-sm">
              {reviews.length > 0 ? 
                (reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length).toFixed(1) : 
                "0.0"
              }
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review: any) => (
              <Card key={review.id} className="bg-gradient-to-br from-background to-muted/20 hover:border-border transition-all duration-300">
                <CardContent className="p-4">
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 ring-2 ring-background shadow-sm">
                        <AvatarImage src={review.reviewerAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-xs">
                          {review.reviewerUsername?.charAt(0)?.toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{review.reviewerUsername}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-3">
                    {review.title && (
                      <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                        {review.title}
                      </h4>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3 whitespace-pre-line break-words">
                        {review.content}
                      </p>
                    </div>
                  </div>

                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{review.helpfulCount || 0} helpful</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.type === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        review.type === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {review.type}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {reviews.length > 3 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  View All Reviews ({reviews.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No reviews yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();
  const { showPopup, profileStatus } = useProfileCompletion();
  const queryClient = useQueryClient();

  // Use the current user's ID if no userId is provided in the URL
  const profileUserId = userId || (currentUser as any)?.id;
  // Check if this is own profile - compare against both ID and username
  const isOwnProfile = !userId || userId === (currentUser as any)?.id || userId === (currentUser as any)?.username;

  // Check if user has invite access
  const hasInviteAccess = isAuthenticated && (currentUser as any)?.hasInviteAccess;

  // Determine if this is a shared view (e.g., via a link)
  const isSharedView = !!userId && !isOwnProfile;

  // Initialize form with current user data
  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      telegramHandle: "",
      discordHandle: "",
      linkedinUrl: "",
      githubUrl: "",
      governanceInterests: "",
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileEditFormData) => {
      return apiRequest('PUT', '/api/profile/update', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      });
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${(currentUser as any)?.id}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: profileData, isLoading: profileLoading } = useQuery<any>({
    queryKey: [`/api/users/${profileUserId}/profile-data`],
    enabled: !!profileUserId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const user = profileData?.user;
  const grsScore = profileData?.grsScore;
  const userThreads = profileData?.issues || [];
  const userComments = profileData?.comments || [];
  const userReviews = profileData?.reviews || [];
  const platformActivity = profileData?.activity || [];
  const userCreda = profileData?.creda || { credaPoints: 0, level: 1 };

  const userLoading = profileLoading;
  const grsLoading = false;
  const threadsLoading = false;
  const commentsLoading = false;
  const reviewsLoading = false;
  const activityLoading = false;
  const userCredaLoading = false;

  // Update form when user data changes
  useEffect(() => {
    if (user && isOwnProfile) {
      form.reset({
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        bio: (user as any).bio || "",
        telegramHandle: (user as any).telegramHandle || "",
        discordHandle: (user as any).discordHandle || "",
        linkedinUrl: (user as any).linkedinUrl || "",
        githubUrl: (user as any).githubUrl || "",
        governanceInterests: (user as any).governanceInterests || "",
      });
    }
  }, [user, isOwnProfile, form]);




  // Handle loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Loading Skeleton */}
          <div className="space-y-6">
            {/* Header skeleton */}
            <SkeletonProfileHeader />

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="space-y-4">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle user not found
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>User not found</div>
        </div>
      </div>
    );
  }

  // Redirect DAO-type users to their DAO page
  if ((user as any).profileType === 'dao') {
    window.location.href = `/dao/${(user as any).username}`;
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Redirecting to DAO page...</div>
        </div>
      </div>
    );
  }

  // Allow shared profile views for unauthenticated users - only block if user is authenticated but lacks access
  if (isAuthenticated && !hasInviteAccess && !isOwnProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Profile Access Required
              </h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You need an activated invite code to view user profiles. Join our community to get access.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-slate-500">
                  You're signed in but need an invite code to access profiles.
                </div>
                <Button 
                  variant="outline"
                  onClick={() => window.open("https://discord.com/invite/wpduY9QQ6F", "_blank")}
                >
                  Join Discord Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Placeholder for canReview and handleSubmitReview if they are used in UserReviews
  const canReview = !isOwnProfile; // Example: Allow reviewing if not own profile
  const handleSubmitReview = async (data: any) => {
    // Replace with actual review submission logic
    console.log("Submitting review:", data);
    toast({ title: "Review submitted (mock)" });
    queryClient.invalidateQueries({ queryKey: [`/api/users/${profileUserId}/reviews`] });
  };

  // Placeholder for userActivity if it's used in Recent Actions
  const userActivity = platformActivity;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shared Profile Banner */}
        {isSharedView && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    You're viewing {(user as any)?.username}'s governance profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Join DAO AI to build your own governance reputation
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/onboarding'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                size="sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profile Card */}
          {/* Professional Profile Card */}
          <Card className="bg-white border border-slate-200 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {/* Header Section */}
              <div className="relative p-8 bg-gradient-to-br from-slate-50 to-gray-100">
                {/* Incomplete Profile Badge */}
                {isOwnProfile && profileStatus && !profileStatus.hasCompletedProfile && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      <AlertCircle className="w-3 h-3" />
                      <span>Incomplete</span>
                    </div>
                  </div>
                )}

                {/* Profile Info */}

                <div className="flex items-center space-x-3">
                  <Avatar className="w-24 h-24 ring-3 ring-white shadow-lg">
                    <AvatarImage src={(user as any).profileImageUrl} className="object-cover" />
                    <AvatarFallback 
                      className="text-2xl font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600"
                    >
                      {(user as any).username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    {/* Name, Level, and Review Button */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h1 className="text-2xl font-bold text-slate-900 truncate">
                        {(user as any).username || "Anonymous User"}
                      </h1>
                      <Badge 
                        className="px-3 py-1 text-sm font-semibold text-white"
                        style={{
                          backgroundColor: getGRSLevel((grsScore as any)?.score || (user as any).grsScore || 1300).color
                        }}
                      >
                        {getGRSLevel((grsScore as any)?.score || (user as any).grsScore || 1300).level}
                      </Badge>
                      {(user as any).isUnclaimedProfile && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1 text-sm font-semibold">
                          Unclaimed
                        </Badge>
                      )}
                      {(user as any).isVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-semibold">
                            Verified
                        </Badge>
                      )}

                      {/* Review Button - Inline with name */}
                      {!isOwnProfile ? (
                        <ReviewModal>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-yellow-300 hover:text-yellow-600 transition-all duration-200 h-8 px-3 text-sm ml-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>Review</span>
                          </Button>
                        </ReviewModal>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center space-x-1 text-slate-400 border-slate-200 cursor-not-allowed opacity-50 h-8 px-3 text-sm ml-2"
                          disabled
                        >
                          <Star className="w-4 h-4" />
                          <span>Review</span>
                        </Button>
                      )}
                    </div>


                    {/* Social Info */}
                    {(user as any).twitterHandle && (
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <XIcon className="w-4 h-4 text-slate-500" />
                          {(user as any).twitterUrl ? (
                            <a
                              href={(user as any).twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
                            >
                              @{(user as any).twitterHandle}
                            </a>
                          ) : (
                            <span className="text-slate-700 font-medium">@{(user as any).twitterHandle}</span>
                          )}
                        </div>
                        {(user as any).twitterUrl && (
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    )}

                    {/* Full Name */}
                    {((user as any).firstName || (user as any).lastName) && (
                      <div className="text-slate-600 mb-4">
                        {(user as any).firstName} {(user as any).lastName}
                      </div>
                    )}

                    {/* Action Buttons Section - Moved to blue area */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                      {/* Social Links Section */}
                      <div className="flex items-center space-x-2">
                        {(user as any)?.twitterUrl ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                            onClick={() => window.open((user as any).twitterUrl, '_blank')}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-slate-300 cursor-not-allowed rounded-full"
                            disabled
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                        >
                          <TelegramIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                        >
                          <DiscordIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                        >
                          <Wallet className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Profile Action Buttons - Share, Edit */}
                      <div className="flex items-center gap-2">
                        <ShareProfileCard user={user as any} />

                        {isOwnProfile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center space-x-1 bg-white hover:bg-slate-50 border-slate-300 h-8 px-3 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Key Stats Row - Unified Blue Theme */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center space-y-1 p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200/70 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm"></div>
                          <span className="text-blue-800 font-semibold text-sm">
                            {(userReviews as any)?.length > 0 
                              ? `${Math.round(((userReviews as any).filter((r: any) => r.rating >= 4).length / (userReviews as any).length) * 100)}%`
                              : '100%'
                            }
                          </span>
                        </div>
                        <span className="text-blue-700/80 text-xs font-medium text-center leading-tight">
                          Positive Reviews ({(userReviews as any)?.length || 0})
                        </span>
                      </div>

                      <div className="flex flex-col items-center space-y-1 p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200/70 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm"></div>
                          <span className="text-blue-800 font-semibold text-sm">
                            {(userCreda as any)?.credaPoints || (user as any)?.credaPoints || 0}
                          </span>
                        </div>
                        <span className="text-blue-700/80 text-xs font-medium text-center leading-tight">
                          Contributor Points
                        </span>
                      </div>

                      <div className="flex flex-col items-center space-y-1 p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200/70 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm"></div>
                          <span className="text-blue-800 font-semibold text-sm">
                            #{(grsScore as any)?.rank || '101'}
                          </span>
                        </div>
                        <span className="text-blue-700/80 text-xs font-medium text-center leading-tight">
                          Community Rank
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-8 border-t border-slate-100 bg-white">

                {/* Additional Profile Insights */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-lg font-bold text-blue-900 mb-1">
                        {(grsScore as any)?.percentile || 0}%
                      </div>
                      <div className="text-xs font-medium text-blue-700">Score Percentile</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200">
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-lg font-bold text-blue-900 mb-1">
                        {(() => {
                          try {
                            const date = new Date((user as any).createdAt || Date.now());
                            return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                          } catch {
                            return 'Unknown';
                          }
                        })()}
                      </div>
                      <div className="text-xs font-medium text-blue-700">Member Since</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-lg font-bold text-blue-900 mb-1">
                        {Array.isArray(userReviews) ? userReviews.filter((r: any) => r.rating === 5).length : 0}
                      </div>
                      <div className="text-xs font-medium text-blue-700">5-Star Reviews</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200">
                      <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-lg font-bold text-blue-900 mb-1">
                        {Array.isArray(platformActivity) ? platformActivity.filter((a: any) => {
                          try {
                            const activityDate = new Date(a.timestamp || a.createdAt);
                            return !isNaN(activityDate.getTime()) && activityDate.getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
                          } catch {
                            return false;
                          }
                        }).length : 0}
                      </div>
                      <div className="text-xs font-medium text-blue-700">Weekly Actions</div>
                    </div>
                  </div>


                  {/* Activity summary temporarily removed to fix TypeScript errors */}

                  {/* Confidential Identity Verification - Only show on own profile */}
                  {isOwnProfile && (
                    <div className="mt-6">
                      <ConfidentialIdentityLink />
                    </div>
                  )}

                  {/* Recent Achievement - Only show if user has actual GRS data */}
                  {grsScore && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900">Current Status</div>
                          <div className="text-xs text-slate-700">
                            {getGRSLevel((grsScore as any).score).level} level • Score: {(grsScore as any).score} • Rank #{(grsScore as any).rank || 'Unranked'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-600 font-medium">Updated</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GRS Score Card */}
          <InteractiveGRSGauge 
            score={(grsScore as any)?.score || 1300} 
            showDetails={true}
            compact={false}
            userId={profileUserId}
          />
        </div>

        {/* Community Reviews Section - Full Width */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Community Reviews
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">{(userReviews as any)?.length || 0}</span> reviews
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-sm">
                      {(userReviews as any)?.length > 0 ? 
                        ((userReviews as any).reduce((acc: number, review: any) => acc + review.rating, 0) / (userReviews as any).length).toFixed(1) : 
                        "0.0"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(userReviews as any)?.length > 0 ? (
                <div className="space-y-4">
                  {(userReviews as any).slice(0, 3).map((review: any) => (
                    <Card key={review.id} className="bg-gradient-to-br from-background to-muted/20 hover:border-border transition-all duration-300">
                      <CardContent className="p-4">
                        {/* Review Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 ring-2 ring-background shadow-sm">
                              <AvatarImage src={review.reviewerAvatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-xs">
                                {review.reviewerUsername?.charAt(0)?.toUpperCase() || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-sm">{review.reviewerUsername}</div>
                              <div className="text-xs text-muted-foreground">
                                {(() => {
                                  try {
                                    const date = new Date(review.createdAt);
                                    return isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric'
                                    });
                                  } catch {
                                    return 'Unknown date';
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="mb-3">
                          {review.title && (
                            <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                              {review.title}
                            </h4>
                          )}
                          <div className="prose prose-sm max-w-none">
                            <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3 whitespace-pre-line break-words">
                              {review.content}
                            </p>
                          </div>
                        </div>

                        {/* Review Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{review.helpfulCount || 0} helpful</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.type === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              review.type === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {review.type}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {Array.isArray(userReviews) && userReviews.length > 3 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        View All Reviews ({userReviews.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Actions Section - Full Width Table */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Actions
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Track all governance activities and interactions
              </div>
            </CardHeader>
            <CardContent>
              {Array.isArray(userActivity) && userActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Action</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actor</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Target</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">When</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">On-Chain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userActivity.slice(0, 10).map((activity: any, index: number) => (
                        <tr key={`${activity.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                {activity.type === 'review_given' && <Star className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'review_received' && <Star className="w-4 h-4 text-green-600" />}
                                {activity.type === 'governance_issue' && <AlertCircle className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'governance_issue_targeted' && <AlertCircle className="w-4 h-4 text-red-600" />}
                                {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'comment_received' && <MessageSquare className="w-4 h-4 text-green-600" />}
                                {activity.type === 'vote' && <Target className="w-4 h-4 text-blue-600" />}
                                {activity.type === 'vote_received' && <Target className="w-4 h-4 text-green-600" />}
                                {activity.type === 'dao_follow' && <Activity className="w-4 h-4 text-purple-600" />}
                                {!['review_given', 'review_received', 'governance_issue', 'governance_issue_targeted', 'comment', 'comment_received', 'vote', 'vote_received', 'dao_follow'].includes(activity.type) && 
                                  <Activity className="w-4 h-4 text-blue-600" />
                                }
                              </div>
                              <span className="text-sm font-medium capitalize">
                                {activity.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-blue-600 font-medium">
                              {(() => {
                                // For activities where user is the target, show the actor
                                if (activity.metadata?.isTargeted && activity.metadata?.actorUsername) {
                                  return activity.metadata.actorUsername;
                                }
                                // For activities performed by the user
                                return (user as any).username || 'Unknown';
                              })()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-700">
                              {(() => {
                                // For activities where user is the target, the target is the user themselves
                                if (activity.metadata?.isTargeted) {
                                  return `@${(user as any).username}`;
                                }
                                // For activities performed by the user, extract the target
                                if (activity.metadata?.reviewedUsername) {
                                  return `@${activity.metadata.reviewedUsername}`;
                                } else if (activity.metadata?.targetUser) {
                                  return `@${activity.metadata.targetUser}`;
                                } else if (activity.metadata?.daoName) {
                                  return activity.metadata.daoName;
                                } else if (activity.metadata?.reviewerUsername) {
                                  return `@${activity.metadata.reviewerUsername}`;
                                } else if (activity.targetUsername) {
                                  return `@${activity.targetUsername}`;
                                } else {
                                  return 'System';
                                }
                              })()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-500">
                              {(() => {
                                try {
                                  // Use timestamp from activity (more reliable) or fallback to createdAt
                                  const dateValue = activity.timestamp || activity.createdAt;
                                  const date = new Date(dateValue);
                                  return isNaN(date.getTime()) ? 'Unknown time' : formatDistanceToNow(date, { addSuffix: true });
                                } catch {
                                  return 'Unknown time';
                                }
                              })()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {activity.ogTxHash ? (
                              <a
                                href={activity.ogTxHash.startsWith('0g_local_') 
                                  ? '#' 
                                  : `https://chainscan.0g.ai/tx/${activity.ogTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-xs bg-green-50 px-2 py-1 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                                title={`View on 0G Chain: ${activity.ogTxHash}`}
                              >
                                <Shield className="w-3 h-3" />
                                <span>Verified</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-full">
                                <Timer className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}