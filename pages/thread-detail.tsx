import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { CommentForm } from "@/components/comment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, MessageSquare, ChevronRight, Home } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { Link } from "wouter";

export default function ThreadDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);

  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: [`/api/threads/${id}`],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: [`/api/threads/${id}/comments`],
    enabled: !!id,
  });

  const voteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/votes", {
        targetType: "thread",
        targetId: parseInt(id!),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${id}`] });
      setHasVoted(true);
      toast({
        title: "Vote recorded",
        description: "Thanks for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const voteOnComment = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("POST", "/api/votes", {
        targetType: "comment",
        targetId: commentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${id}/comments`] });
      toast({
        title: "Vote recorded",
        description: "Thanks for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (threadLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading thread...</div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Thread not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="flex items-center hover:text-slate-700 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/home" className="hover:text-slate-700 transition-colors">
            Active DAOs
          </Link>
          {thread.dao && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/dao/${thread.dao.slug}`} className="hover:text-slate-700 transition-colors">
                {thread.dao.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{thread.title}</span>
        </div>

        {/* Thread Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar>
                <AvatarImage src={thread.author?.profileImageUrl} />
                <AvatarFallback>
                  {thread.author?.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-slate-900">
                  {thread.author?.username || "Anonymous"}
                </div>
                <div className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-4">
                {isAuthenticated && user?.hasInviteAccess ? (
                  <Button
                    variant={hasVoted ? "default" : "outline"}
                    size="sm"
                    onClick={() => voteMutation.mutate()}
                    disabled={voteMutation.isPending || hasVoted}
                    className="vote-button"
                  >
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {thread.upvotes}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = "/onboarding"}
                    className="vote-button"
                  >
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {thread.upvotes} {isAuthenticated ? "(Invite Required)" : "(Login to Vote)"}
                  </Button>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              {thread.title}
            </h1>

            <div className="prose prose-slate max-w-none">
              {thread.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-900">
                Comments ({thread.commentCount})
              </h2>
            </div>

            {/* Add Comment Form */}
            <CommentForm threadId={parseInt(id!)} />

            {/* Comments List */}
            <div className="space-y-6 mt-8">
              {commentsLoading ? (
                <div>Loading comments...</div>
              ) : comments?.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                comments?.map((comment: any) => (
                  <div key={comment.id} className="border-l-2 border-slate-200 pl-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={comment.author?.profileImageUrl} />
                        <AvatarFallback>
                          {comment.author?.username?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-slate-900">
                            {comment.author?.username || "Anonymous"}
                          </span>
                          <span className="text-sm text-slate-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                          {isAuthenticated && user?.hasInviteAccess ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => voteOnComment.mutate(comment.id)}
                              disabled={voteOnComment.isPending}
                              className="vote-button"
                            >
                              <ArrowUp className="w-4 h-4 mr-1" />
                              {comment.upvotes}
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="vote-button opacity-50 cursor-not-allowed"
                            >
                              <ArrowUp className="w-4 h-4 mr-1" />
                              {comment.upvotes}
                            </Button>
                          )}
                        </div>
                        <div className="text-slate-700">
                          {comment.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
