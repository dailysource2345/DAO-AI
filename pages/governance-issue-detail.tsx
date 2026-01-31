import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { CommentForm } from "@/components/comment-form";
import { CommentsList } from "@/components/comments-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MessageSquare, ChevronRight, Home, Shield, Clock, Trophy, X, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flame, Users } from "lucide-react";
import { UserWithLevel } from "@/components/user-with-level";
import { StanceVoting } from "@/components/stance-voting";
import { UserProfilePopup } from "@/components/user-profile-popup";
import type { GovernanceIssueWithAuthorAndDao, CommentWithAuthor, User as UserType } from "../../../shared/schema";

export default function GovernanceIssueDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: issue, isLoading: issueLoading } = useQuery<GovernanceIssueWithAuthorAndDao>({
    queryKey: [`/api/issues/${id}`],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: [`/api/issues/${id}/comments`],
    enabled: !!id,
  });

  const { data: currentVote } = useQuery<{ voteType: string } | null>({
    queryKey: [`/api/issues/${id}/vote`],
    enabled: isAuthenticated,
  });

  const { data: stanceVoteCounts } = useQuery<{
    championVotes: number;
    challengeVotes: number;
    opposeVotes: number;
  }>({
    queryKey: [`/api/issues/${id}/stance-vote-counts`],
    enabled: !!id,
  });

  const { data: stanceVoters } = useQuery<UserType[]>({
    queryKey: [`/api/issues/${id}/stance-voters`],
    enabled: !!id,
  });


  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'upvote' | 'downvote' }) => {
      return apiRequest("POST", `/api/issues/${id}/vote`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${id}/vote`] });

      // Invalidate user activity cache to show new vote immediately
      const user = queryClient.getQueryData(["/api/auth/user"]) as any;
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/activity`] });
      }

      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully!",
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

  const commentVoteMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'upvote' | 'downvote' }) => {
      return apiRequest("POST", `/api/comments/${commentId}/vote`, { type });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${id}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      // Invalidate user activity cache
      const user = queryClient.getQueryData(["/api/auth/user"]) as any;
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}/activity`] });
      }

      const pointsEarned = (response as any)?.pointsEarned || 0;
      toast({
        title: "Vote recorded",
        description: pointsEarned > 0
          ? `Vote recorded! You earned +${pointsEarned} points.`
          : "Your vote has been recorded successfully!",
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

  const handleVote = (type: 'upvote' | 'downvote') => {
    if (!isAuthenticated || !(user as any)?.hasInviteAccess) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with an active invite to vote on governance issues.",
      });
      return;
    }

    // Don't allow voting on expired stances
    if (isStanceExpired()) {
      toast({
        title: "Stance Expired",
        description: "This stance has expired. Voting is no longer allowed.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({ type });
  };

  // Check if stance is expired
  const isStanceExpired = () => {
    if (!issue?.expiresAt) return false;
    return new Date() > new Date(issue.expiresAt);
  };

  // Check if stance is active (not expired and still accepting votes)
  const isStanceActive = () => {
    if (!issue) return false;
    return issue.isActive && !isStanceExpired();
  };



  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'champion':
        return 'bg-green-100 text-green-800';
      case 'challenge':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (issueLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading governance issue...</div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Governance issue not found</div>
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
          {issue.dao && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/dao/${issue.dao.slug}`} className="hover:text-slate-700 transition-colors">
                {issue.dao.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{issue.title}</span>
        </div>

        {/* Issue Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {/* Issue Meta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Badge className={`${getStanceColor(issue.stance)}`}>
                  {issue.stance === 'champion' ? 'Championing' : 'Challenging'}
                </Badge>
                <Badge className={`${getStatusColor(issue.status)}`}>
                  {issue.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Issue Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {issue.title}
            </h1>

            {/* Head-to-Head Stance Display */}
            {issue.targetUsername ? (
              <div className="mb-6">
                {/* Modern Battle Arena Layout - Reduced Size */}
                <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-md overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
                  </div>

                  {/* DAO Badge */}
                  {issue.dao && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-700">{issue.dao.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Stance Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2.5 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <UserProfilePopup username={issue.author?.username} userId={issue.author?.id}>
                        <span className="font-bold text-slate-900 text-base cursor-pointer hover:text-slate-700 transition-colors">{issue.author?.username}</span>
                      </UserProfilePopup>

                      {/* Action Arrow/Icon */}
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          issue.stance === 'champion'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}>
                          {issue.stance === 'champion' ? (
                            <Shield className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Flame className="w-3.5 h-3.5 text-red-600" />
                          )}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          issue.stance === 'champion'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {issue.stance === 'champion' ? 'CHAMPIONED' : 'CHALLENGED'}
                        </span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-100">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                      </div>
                      <UserProfilePopup username={issue.targetUsername} userId={issue.targetUserId}>
                        <span className="font-bold text-slate-900 text-base cursor-pointer hover:text-slate-700 transition-colors">{issue.targetUsername}</span>
                      </UserProfilePopup>
                    </div>
                  </div>

                  {/* Battle Arena */}
                  <div className="grid grid-cols-3 gap-6 items-center">
                    {/* Stance Creator */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group cursor-pointer">
                        <UserProfilePopup username={issue.author?.username} userId={issue.author?.id}>
                          <Avatar className="w-16 h-16 ring-3 ring-green-400 shadow-md transition-all duration-300 group-hover:ring-green-500 group-hover:ring-4 group-hover:shadow-lg group-hover:scale-105">
                            <AvatarImage src={issue.author?.profileImageUrl} className="object-cover" />
                            <AvatarFallback className="text-lg bg-green-100 text-green-800 font-bold">
                              {issue.author?.username?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfilePopup>
                        {/* Status indicator for stance creator */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                          issue.stance === 'champion' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {issue.stance === 'champion' ? (
                            <Shield className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <Flame className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center Battle Result */}
                    <div className="flex flex-col items-center space-y-3">
                      {(() => {
                        const expired = isStanceExpired();
                        const voteCounts = stanceVoteCounts || { championVotes: 0, challengeVotes: 0, opposeVotes: 0 };
                        const favorVotes = issue.stance === 'champion' ? (voteCounts.championVotes || 0) : (voteCounts.challengeVotes || 0);
                        const opposeVotes = voteCounts.opposeVotes || 0;
                        const totalVotes = favorVotes + opposeVotes;
                        const stanceWon = favorVotes > opposeVotes;

                        if (expired && totalVotes > 0) {
                          return (
                            <div className="text-center flex flex-col items-center">
                              {/* Victory/Defeat Icon */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mb-2 ${
                                stanceWon
                                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                  : 'bg-gradient-to-br from-slate-400 to-slate-600'
                              }`}>
                                {stanceWon ? (
                                  <Trophy className="w-6 h-6 text-white" />
                                ) : (
                                  <X className="w-6 h-6 text-white" />
                                )}
                              </div>

                              {/* Result Text */}
                              <div className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm ${
                                stanceWon
                                  ? issue.stance === 'champion'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {stanceWon
                                  ? issue.stance === 'champion' ? 'CHAMPIONED' : 'CHALLENGED'
                                  : issue.stance === 'champion' ? 'OPPOSED' : 'DEFENDED'
                                }
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="text-center flex flex-col items-center">
                            {/* Active Battle Icon */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md mb-2 animate-pulse">
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                              </div>
                            </div>

                            <Badge className={`border rounded-full text-xs font-semibold px-3 py-1 ${
                              isStanceActive()
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {isStanceActive() ? 'ACTIVE STANCE' : 'EXPIRED STANCE'}
                            </Badge>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Target User */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group cursor-pointer">
                        <UserProfilePopup username={issue.targetUsername} userId={issue.targetUserId}>
                          <Avatar className="w-16 h-16 ring-3 ring-orange-400 shadow-md transition-all duration-300 group-hover:ring-orange-500 group-hover:ring-4 group-hover:shadow-lg group-hover:scale-105">
                            <AvatarFallback className="text-lg bg-orange-100 text-orange-800 font-bold">
                              {issue.targetUsername?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfilePopup>
                        {/* Status indicator for target */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-white shadow-sm bg-orange-500 flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Completed Stances */}
                  {(() => {
                    const expired = isStanceExpired();
                    const voteCounts = stanceVoteCounts || { championVotes: 0, challengeVotes: 0, opposeVotes: 0 };
                    const favorVotes = issue.stance === 'champion' ? (voteCounts.championVotes || 0) : (voteCounts.challengeVotes || 0);
                    const opposeVotes = voteCounts.opposeVotes || 0;
                    const totalVotes = favorVotes + opposeVotes;
                    const favorPercentage = totalVotes > 0 ? (favorVotes / totalVotes) * 100 : 0;

                    if (expired && totalVotes > 0) {
                      return (
                        <div className="mt-6">
                          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                            {/* Left side (stance author votes) */}
                            <div
                              className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-out ${
                                issue.stance === 'champion'
                                  ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
                                  : 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                              }`}
                              style={{ width: `${favorPercentage}%` }}
                            />
                            {/* Right side (oppose votes) */}
                            <div
                              className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-400 via-orange-500 to-orange-600 transition-all duration-1000 ease-out"
                              style={{ width: `${100 - favorPercentage}%` }}
                            />

                            {/* Center divider */}
                            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-0.5 opacity-50"></div>
                          </div>

                          {/* Vote labels */}
                          <div className="flex justify-between mt-1.5 text-xs font-medium">
                            <span className={issue.stance === 'champion' ? 'text-green-600' : 'text-red-600'}>
                              {favorVotes} {issue.stance === 'champion' ? 'Champion' : 'Challenge'}
                            </span>
                            <span className="text-orange-600">
                              {opposeVotes} Oppose
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            ) : (
              /* Fallback for stances without target users */
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src={issue.author?.profileImageUrl} className="object-cover" />
                  <AvatarFallback>
                    {issue.author?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-900">{issue.author?.username}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm text-slate-500">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {issue.dao && (
                    <div className="text-sm text-slate-500">
                      in <Link href={`/dao/${issue.dao.slug}`} className="text-blue-600 hover:text-blue-800">{issue.dao.name}</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Proposal Link */}
            {issue.proposalLink && (
              <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Original Proposal</p>
                  <a
                    href={issue.proposalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View proposal on external platform
                  </a>
                </div>
              </div>
            )}

            {/* Issue Content */}
            <div className="prose prose-slate max-w-none mb-6">
              {issue.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* Comments Info */}
            <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 text-slate-500">
              <MessageSquare className="w-4 h-4" />
              <span>{issue.commentCount} comments</span>
            </div>

            {/* Enhanced Stance Voting Results - Only show when expired */}
            {(() => {
              const expired = isStanceExpired();
              if (!expired) return null;

              // Use fake data for testing, fallback to real data if available
              const voteCounts = stanceVoteCounts || { championVotes: 0, challengeVotes: 0, opposeVotes: 0 };
              const voters = stanceVoters || [];

              const favorVoteType = issue.stance === 'champion' ? 'champion' : 'challenge';
              const favorVotes = issue.stance === 'champion' ? (voteCounts.championVotes || 0) : (voteCounts.challengeVotes || 0);
              const opposeVotes = voteCounts.opposeVotes || 0;
              const totalVotes = favorVotes + opposeVotes;

              if (totalVotes === 0) return null;

              const favorPercentage = totalVotes > 0 ? (favorVotes / totalVotes) * 100 : 0;
              const opposePercentage = totalVotes > 0 ? (opposeVotes / totalVotes) * 100 : 0;

              const getVotersByType = (voteType: string) => {
                if (!voters) return [];
                return voters.filter((voter: any) => voter.voteType === voteType);
              };

              const favorVoters = getVotersByType(favorVoteType);
              const opposeVoters = getVotersByType('oppose');

              return (
                <div className="mt-6 bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  {/* Voting Results Bars */}
                  <div className="space-y-6">
                    {/* Favor Vote Result Bar */}
                    <div className="w-full group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {issue.stance === 'champion' ? (
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Shield className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Flame className="w-5 h-5 text-red-600" />
                            </div>
                          )}
                          <div>
                            <UserProfilePopup username={issue.author?.username} userId={issue.author?.id}>
                              <span className={`text-lg font-semibold cursor-pointer hover:underline ${
                                issue.stance === 'champion' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {issue.stance === 'champion' ? 'Champion' : 'Challenge'}
                              </span>
                            </UserProfilePopup>
                            <div className="text-sm text-slate-500">
                              Supporting the stance
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            issue.stance === 'champion' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {favorPercentage.toFixed(0)}%
                          </div>
                          <div className="text-sm text-slate-500">
                            {favorVotes} vote{favorVotes !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            issue.stance === 'champion'
                              ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600'
                              : 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                          }`}
                          style={{ width: `${favorPercentage}%` }}
                        />
                      </div>

                      {favorVoters.length > 0 && (
                        <div className="flex items-center justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex items-center space-x-2 cursor-pointer group/voters hover:bg-slate-100 rounded-lg p-2 transition-colors">
                                <div className="flex -space-x-2">
                                  {favorVoters.slice(0, 6).map((voter: any) => (
                                    <Avatar key={voter.id} className="w-7 h-7 border-2 border-white ring-1 ring-slate-200 group-hover/voters:ring-slate-300 transition-all hover:scale-110">
                                      <AvatarImage src={voter.user?.profileImageUrl} />
                                      <AvatarFallback className="text-xs">
                                        {voter.user?.username?.charAt(0)?.toUpperCase() || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {favorVotes > 6 && (
                                    <div className="w-7 h-7 bg-slate-100 border-2 border-white ring-1 ring-slate-200 group-hover/voters:ring-slate-300 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 transition-all">
                                      +{favorVotes - 6}
                                    </div>
                                  )}
                                </div>
                                <span className="text-sm text-slate-600 font-medium">View supporters</span>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  {issue.stance === 'champion' ? (
                                    <Shield className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Flame className="w-5 h-5 text-red-600" />
                                  )}
                                  <span>{issue.stance === 'champion' ? 'Champion' : 'Challenge'} Supporters ({favorVotes})</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3 max-h-80 overflow-y-auto">
                                {favorVoters.map((voter: any) => (
                                  <div key={voter.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={voter.user?.profileImageUrl} />
                                      <AvatarFallback>
                                        {voter.user?.username?.charAt(0)?.toUpperCase() || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-900">{voter.user?.username}</div>
                                      <div className="text-xs text-slate-500">
                                        Voted {formatDistanceToNow(new Date(voter.createdAt), { addSuffix: true })}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>

                    {/* Oppose Vote Result Bar */}
                    <div className="w-full group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-lg font-semibold text-orange-800">
                              {issue.stance === 'champion' ? 'Opposition' : 'Defender'}
                            </span>
                            <div className="text-sm text-slate-500">
                              Opposing the stance
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-800">
                            {opposePercentage.toFixed(0)}%
                          </div>
                          <div className="text-sm text-slate-500">
                            {opposeVotes} vote{opposeVotes !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
                          style={{ width: `${opposePercentage}%` }}
                        />
                      </div>

                      {opposeVoters.length > 0 && (
                        <div className="flex items-center justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="flex items-center space-x-2 cursor-pointer group/voters hover:bg-slate-100 rounded-lg p-2 transition-colors">
                                <div className="flex -space-x-2">
                                  {opposeVoters.slice(0, 6).map((voter: any) => (
                                    <Avatar key={voter.id} className="w-7 h-7 border-2 border-white ring-1 ring-slate-200 group-hover/voters:ring-slate-300 transition-all hover:scale-110">
                                      <AvatarImage src={voter.user?.profileImageUrl} />
                                      <AvatarFallback className="text-xs">
                                        {voter.user?.username?.charAt(0)?.toUpperCase() || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {opposeVotes > 6 && (
                                    <div className="w-7 h-7 bg-slate-100 border-2 border-white ring-1 ring-slate-200 group-hover/voters:ring-slate-300 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 transition-all">
                                      +{opposeVotes - 6}
                                    </div>
                                  )}
                                </div>
                                <span className="text-sm text-slate-600 font-medium">View opponents</span>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <User className="w-5 h-5 text-orange-600" />
                                  <span>{issue.stance === 'champion' ? 'Opposition' : 'Defender'} Voters ({opposeVotes})</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3 max-h-80 overflow-y-auto">
                                {opposeVoters.map((voter: any) => (
                                  <div key={voter.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={voter.user?.profileImageUrl} />
                                      <AvatarFallback>
                                        {voter.user?.username?.charAt(0)?.toUpperCase() || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="font-medium text-slate-900">{voter.user?.username}</div>
                                      <div className="text-xs text-slate-500">
                                        Voted {formatDistanceToNow(new Date(voter.createdAt), { addSuffix: true })}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>



        {/* Comments Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="w-5 h-5 text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-900">
                Discussion ({issue.commentCount})
              </h2>
            </div>

            {/* Add Comment Form */}
            <CommentForm issueId={parseInt(id!)} isStanceExpired={isStanceExpired()} />

            {/* Comments List */}
            {commentsLoading ? (
              <div className="mt-8 text-center text-slate-500">Loading comments...</div>
            ) : (
              <CommentsList 
                comments={comments || []}
                isExpired={isStanceExpired()}
                type="stance"
                targetId={parseInt(id!)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}