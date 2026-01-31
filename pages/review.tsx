import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "@/lib/time-utils";
import {
  ArrowLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Award,
  MoreHorizontal,
  Shield,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { GrsScoreCard } from "@/components/grs-score-card";
import { TopGovernorsLeaderboard } from "@/components/top-governors-leaderboard";



export default function ReviewDetail() {
  const [, params] = useRoute("/review/:id");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewId = params?.id;

  // Fetch review data from API
  const { data: review, isLoading, error } = useQuery({
    queryKey: ["/api/reviews", reviewId],
    queryFn: () => apiRequest("GET", `/api/reviews/${reviewId}`),
    enabled: !!reviewId,
  });

  // Fetch review comments
  const { data: comments } = useQuery({
    queryKey: ["/api/reviews", reviewId, "comments"],
    queryFn: () => apiRequest("GET", `/api/reviews/${reviewId}/comments`),
    enabled: !!reviewId,
  });

  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'upvote' | 'downvote' }) => {
      return apiRequest("POST", `/api/reviews/${reviewId}/vote`, { type });
    },
    onSuccess: () => {
      toast({
        title: "Vote recorded",
        description: "Your vote on this review has been recorded!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to record vote",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/reviews/${reviewId}/comments`, { content });
    },
    onSuccess: () => {
      setCommentText("");
      // Invalidate comments cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", reviewId, "comments"] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add comment",
      });
    },
  });

  const handleVote = (type: 'upvote' | 'downvote') => {
    if (!isAuthenticated || !user?.hasInviteAccess) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with an active invite to vote on reviews.",
      });
      return;
    }
    
    voteMutation.mutate({ type });
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    if (!isAuthenticated || !user?.hasInviteAccess) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with an active invite to comment on reviews.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await commentMutation.mutateAsync(commentText);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Review Not Found</h1>
          <p className="text-gray-600 mb-6">The review you're looking for doesn't exist.</p>
          <Link href="/home">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <div className="mb-6">
              <Link href="/home">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Feed
                </Button>
              </Link>
            </div>

            {/* Review Card */}
            <Card className="bg-white border-gray-100 shadow-sm rounded-2xl overflow-hidden mb-6">
              <CardContent className="p-0">
                {/* Header Section */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 shadow-sm ring-2 ring-gray-100">
                        <AvatarImage src={review.reviewer?.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-semibold">
                          {review.reviewer?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-gray-900 font-semibold">
                            {review.reviewer?.username}
                          </span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs">
                            {review.reviewer?.level}
                          </Badge>
                          <span className="text-gray-400 text-sm">reviewed</span>
                          <span className="text-gray-900 font-semibold">
                            {review.reviewedUser?.username}
                          </span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs">
                            {review.reviewedUser?.level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{review.helpfulCount} found helpful</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full text-xs font-medium ml-2">
                        <Star className="w-3 h-3 mr-1" />
                        Review
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Review Content */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {review.content}
                    </p>
                  </div>
                </div>
                
                {/* Voting Section */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote('upvote')}
                          disabled={voteMutation.isPending}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-medium">{review.upvotes}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote('downvote')}
                          disabled={voteMutation.isPending}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="font-medium">{review.downvotes}</span>
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{comments?.length || 0} comments</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 rounded-lg p-2"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comments ({comments?.length || 0})
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Comment Form */}
                {isAuthenticated && user?.hasInviteAccess ? (
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <Avatar className="w-10 h-10 shadow-sm ring-2 ring-gray-100">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                          {user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts on this review..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 rounded-xl"
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim() || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Posting..." : "Post Comment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-600 text-center">
                      <Link href="/onboarding" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in with an active invite
                      </Link>
                      {' '}to join the discussion
                    </p>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={comment.id}>
                        <div className="flex space-x-3">
                          <Avatar className="w-10 h-10 shadow-sm ring-2 ring-gray-100">
                            <AvatarImage src={comment.author?.profileImageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white font-semibold">
                              {comment.author?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-gray-900 font-semibold text-sm">
                                {comment.author?.username}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed mb-2">
                              {comment.content}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-green-600 px-2 py-1 h-auto"
                              >
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {comment.upvotes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-600 px-2 py-1 h-auto"
                              >
                                <ThumbsDown className="w-3 h-3 mr-1" />
                                {comment.downvotes}
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < (comments?.length || 0) - 1 && <Separator className="my-4" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <GrsScoreCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}