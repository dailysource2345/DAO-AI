
import React, { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  ArrowLeft,
  MoreHorizontal,
  Award
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/time-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { UserWithLevel } from "@/components/user-with-level";
import { Navigation } from "@/components/navigation";
import { DaoHoverPopup } from "@/components/dao-hover-popup";

// Helper function to get review badge styling
function getReviewBadgeStyle(reviewType: string) {
  switch (reviewType) {
    case 'positive':
      return {
        className: 'bg-green-50 text-green-700 border-green-200',
        label: 'Positive Review',
        icon: ThumbsUp
      };
    case 'negative':
      return {
        className: 'bg-red-50 text-red-700 border-red-200',
        label: 'Negative Review',
        icon: ThumbsDown
      };
    case 'neutral':
      return {
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        label: 'Neutral Review',
        icon: Star
      };
    default:
      return {
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        label: 'Review',
        icon: Star
      };
  }
}

export default function ReviewDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch review data
  const { data: review, isLoading, error } = useQuery({
    queryKey: [`/api/reviews/${id}`],
    enabled: !!id,
  });

  // Fetch reviewed user data if not included in review
  const { data: reviewedUser } = useQuery({
    queryKey: [`/api/users/${review?.reviewedUserId}`],
    enabled: !!review?.reviewedUserId && !review?.reviewedUser,
  });

  // Get user's current vote on this review
  const { data: currentVote } = useQuery({
    queryKey: [`/api/reviews/${id}/vote`],
    enabled: isAuthenticated && !!id,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'upvote' | 'downvote' }) => {
      return apiRequest("POST", `/api/reviews/${id}/vote`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${id}/vote`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });

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

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/reviews/${id}/comments`, { content });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create comment");
      }
      return response.json();
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/${id}`] });
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
    if (!isAuthenticated || !(user as any)?.hasInviteAccess) {
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
    
    if (!isAuthenticated || !(user as any)?.hasInviteAccess) {
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Review Not Found</h2>
              <p className="text-gray-600 mb-4">The review you're looking for doesn't exist or has been removed.</p>
              <Link href="/home">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Determine review target display info
  let reviewTarget;
  let isExternalEntity = false;
  let targetXHandle = null;

  if (review.reviewedUser) {
    // User is on platform (included in review response)
    reviewTarget = review.reviewedUser;
    isExternalEntity = false;
    targetXHandle = review.reviewedUser.xHandle;
  } else if (review.targetType === 'dao' && review.reviewedDaoId) {
    // DAO is on platform - use DAO data from review or fetch it
    reviewTarget = {
      username: review.reviewedDaoName || 'DAO',
      id: `dao_${review.reviewedDaoId}`,
      profileImageUrl: review.reviewedDaoLogo,
      isDao: true
    };
    isExternalEntity = false;
    targetXHandle = null; // DAOs don't have xHandle in this context
  } else if (review.reviewedDaoName) {
    // DAO is on platform (legacy check)
    reviewTarget = {
      username: review.reviewedDaoName,
      id: `dao_${review.reviewedDaoId}`,
      profileImageUrl: review.reviewedDaoLogo,
      isDao: true
    };
    isExternalEntity = false;
    targetXHandle = null; // DAOs don't have xHandle in this context
  } else if (reviewedUser) {
    // User is on platform (fetched separately)
    reviewTarget = reviewedUser;
    isExternalEntity = false;
    targetXHandle = reviewedUser.xHandle;
  } else if (review.externalEntityName) {
    // External entity
    reviewTarget = {
      username: review.externalEntityName,
      id: null,
      profileImageUrl: null
    };
    isExternalEntity = true;
    targetXHandle = review.externalEntityXHandle;
  } else {
    // Fallback
    reviewTarget = {
      username: review.reviewedUserId || 'Unknown User',
      id: review.reviewedUserId,
      profileImageUrl: null
    };
    isExternalEntity = false;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/home">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>

        {/* Review Content */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl mb-6">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="w-12 h-12 shadow-sm ring-2 ring-gray-100">
                    <AvatarImage src={review.reviewer?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-semibold text-lg">
                      {review.reviewer?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserWithLevel 
                        username={review.reviewer?.username} 
                        userId={review.reviewer?.id}
                        className="text-base font-medium"
                      />
                      <span className="text-gray-500">reviewed</span>
                      {isExternalEntity ? (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-gray-900">{reviewTarget.username}</span>
                          {targetXHandle && (
                            <span className="text-sm text-gray-500">@{targetXHandle}</span>
                          )}
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                            External
                          </Badge>
                        </div>
                      ) : reviewTarget.isDao ? (
                        <DaoHoverPopup 
                          daoId={review.reviewedDaoId} 
                          daoName={reviewTarget.username}
                          daoSlug={review.reviewedDaoSlug}
                          daoLogo={reviewTarget.profileImageUrl}
                        >
                          <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors">
                            <span className="text-base font-medium text-gray-900">{reviewTarget.username}</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                              DAO
                            </Badge>
                          </div>
                        </DaoHoverPopup>
                      ) : (
                        <UserWithLevel 
                          username={reviewTarget.username} 
                          userId={reviewTarget.id}
                          className="text-base font-medium"
                        />
                      )}
                      {(() => {
                        const badgeStyle = getReviewBadgeStyle(review.reviewType);
                        const IconComponent = badgeStyle.icon;
                        return (
                          <Badge variant="outline" className={`${badgeStyle.className} rounded-full text-sm font-medium`}>
                            <IconComponent className="w-4 h-4 mr-1" />
                            {badgeStyle.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Review Content */}
              <div className="mb-6">
                {review.title && (
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {review.title}
                  </h2>
                )}
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Voting Section */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('upvote')}
                      disabled={voteMutation.isPending}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        (currentVote as any)?.voteType === 'upvote' 
                          ? 'text-green-600 bg-green-100 border border-green-200' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-medium">{review.upvotes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('downvote')}
                      disabled={voteMutation.isPending}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        (currentVote as any)?.voteType === 'downvote' 
                          ? 'text-red-600 bg-red-100 border border-red-200' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="font-medium">{review.downvotes}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-500 px-3 py-2">
                    <Award className="w-4 h-4" />
                    <span className="font-medium text-sm">{review.helpfulCount} helpful</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-500 px-3 py-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium text-sm">{review.comments?.length || 0} comments</span>
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
                Comments ({review.comments?.length || 0})
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            {isAuthenticated && (user as any)?.hasInviteAccess ? (
              <div className="mb-6">
                <div className="flex space-x-3">
                  <Avatar className="w-10 h-10 shadow-sm ring-2 ring-gray-100">
                    <AvatarImage src={(user as any)?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                      {(user as any)?.username?.[0]?.toUpperCase() || 'U'}
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
                        {isSubmitting ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-600 text-sm text-center">
                  {isAuthenticated 
                    ? "You need an active invite to comment on reviews." 
                    : "Please sign in to comment on reviews."
                  }
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {review.comments && review.comments.length > 0 ? (
                review.comments.map((comment: any) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex space-x-3">
                      <Avatar className="w-8 h-8 shadow-sm ring-2 ring-gray-100">
                        <AvatarImage src={comment.author?.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
                          {comment.author?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserWithLevel 
                            username={comment.author?.username} 
                            userId={comment.author?.id}
                            className="text-sm font-medium"
                          />
                          <span className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No comments yet</p>
                  <p className="text-gray-400 text-sm">Be the first to share your thoughts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
