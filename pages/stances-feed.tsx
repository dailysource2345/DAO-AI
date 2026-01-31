import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  TrendingUp, 
  TrendingDown,
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Clock, 
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Shield,
  Flame,
  Timer,
  Star,
  Award,
  ThumbsUp,
  ThumbsDown,
  User,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "@/lib/time-utils";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { GrsScoreCard } from "@/components/grs-score-card";
import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { HelpCircle } from "lucide-react";
import { 
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TopGovernorsLeaderboard } from "@/components/top-governors-leaderboard";
import { NewUsers } from "@/components/new-users";
import { StancesSidebar } from "@/components/stances-sidebar";
import { UserWithLevel, UserWithLevelCompact } from "@/components/user-with-level";
import { UserBadge } from "@/components/ui/user-badge";
import { StanceVoting } from "@/components/stance-voting";
import { UserProfilePopup } from "@/components/user-profile-popup";
import { DaoHoverPopup } from "@/components/dao-hover-popup";
// import { DaoCarousel } from "@/components/dao-carousel";
import { Navigation } from "@/components/navigation";
import { getSimpleStanceStatus, getStanceStatusText } from "@/utils/stance-status";
import { ReportReviewDialog } from "@/components/report-review-dialog";

// Live Indicator Dot Component
function LiveIndicator({ isActive }: { isActive: boolean }) {
  const status = getSimpleStanceStatus(isActive);

  return (
    <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border ${
      isActive 
        ? 'bg-lime-50 dark:bg-lime-950/30 border-lime-200 dark:border-lime-900/50' 
        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
    }`}>
      {isActive && (
        <div className="relative">
          <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 bg-lime-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}
      <span className={`text-xs font-semibold ${
        isActive ? 'text-lime-700 dark:text-lime-300' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {status}
      </span>
    </div>
  );
}

// Modern Thin Review Banner Component with GRS Changes
function RecentReviewsBanner() {
  const { data: reviewsWithGrs, isLoading } = useQuery({
    queryKey: ["/api/reviews/recent-grs"],
    refetchInterval: 120000, // Refresh every 30 seconds
  });

  const apiReviews = Array.isArray(reviewsWithGrs) ? reviewsWithGrs : [];

  // Use only the most recent 6 reviews
  const allReviews = apiReviews.slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <div className="py-2">
          <div className="animate-pulse flex justify-center space-x-6">
            <div className="h-3 bg-gray-100 rounded-full w-24"></div>
            <div className="h-3 bg-gray-100 rounded-full w-32"></div>
            <div className="h-3 bg-gray-100 rounded-full w-28"></div>
          </div>
        </div>
      </div>
    );
  }

  // Only show banner if there are real reviews
  if (allReviews.length === 0) {
    return null;
  }

  // Create "LIVE REWARDS" label item
  const topReviewsItem = {
    id: 'top-reviews-label',
    isLabel: true,
    displayName: 'LIVE REWARDS',
  };

  // Create array with LIVE REWARDS label every 5 items
  const createScrollingArray = () => {
    const result = [];
    const reviewsCopy = [...allReviews, ...allReviews, ...allReviews]; // Triple for seamless scroll

    for (let i = 0; i < reviewsCopy.length; i++) {
      if (i % 5 === 0) {
        result.push(topReviewsItem);
      }
      result.push(reviewsCopy[i]);
    }

    return result;
  };

  const scrollingReviews = createScrollingArray();

  return (
    <div className="border-b border-lime-300 dark:border-lime-700 backdrop-blur-sm relative overflow-hidden" style={{ height: '40px', backgroundColor: '#c1ff72' }}>
      {/* Subtle gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-lime-400/95 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-lime-400/95 to-transparent z-10 pointer-events-none"></div>

      <div className="flex items-center h-full">
        <div className="relative overflow-hidden flex-1">
          <div className="flex items-center space-x-8 animate-modern-scroll" style={{ width: 'fit-content', minWidth: '200%' }}>
            {scrollingReviews.map((review: any, index: number) => {
              // Handle the "LIVE REWARDS" label item
              if (review.isLabel) {
                return (
                  <div 
                    key={`${review.id}-${index}`}
                    className="flex items-center gap-2 px-4 py-1 bg-black dark:bg-gray-900 rounded-full whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-2 h-2 bg-lime-400 rounded-full animate-ping"></div>
                      <div className="relative w-2 h-2 bg-lime-400 rounded-full"></div>
                    </div>
                    <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                      {review.displayName}
                    </span>
                  </div>
                );
              }

              // Handle regular review items
              const isPositiveGrs = review.grsImpact === 'positive' || review.reviewType === 'positive';
              const isNegativeGrs = review.grsImpact === 'negative' || review.reviewType === 'negative';
              const isDaoReview = review.grsImpact === 'dao' || review.targetType === 'dao';

              // Use the displayName from the processed review data
              const displayName = review.displayName || 'Unknown';
              const avatarUrl = review.avatarUrl;

              return (
                <Link 
                  key={`${review.id}-${index}`} 
                  href={`/reviews/${review.id}`}
                  className="flex items-center space-x-2 hover:scale-105 transition-all duration-200 group px-3 py-1 rounded-full hover:bg-lime-500/30 dark:hover:bg-lime-600/30 whitespace-nowrap min-w-0"
                >
                  {/* Compact Avatar */}
                  <Avatar className="w-6 h-6 ring-1 ring-black/20 dark:ring-black/40 flex-shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-black text-lime-400 font-medium text-xs">
                      {displayName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* GRS Impact Color Indicator */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isPositiveGrs
                      ? 'bg-green-400'
                      : isNegativeGrs
                      ? 'bg-red-400'
                      : isDaoReview
                      ? 'bg-lime-400'
                      : 'bg-gray-400'
                  } opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                  {/* Compact Name */}
                  <span className="text-xs font-medium text-black dark:text-gray-900 group-hover:text-gray-900 dark:group-hover:text-black transition-colors truncate max-w-20">
                    {displayName}
                  </span>

                  {/* GRS Impact Amount Indicator */}
                  <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    isPositiveGrs
                      ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                      : isNegativeGrs
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                      : isDaoReview
                      ? 'bg-lime-50 text-lime-600 dark:bg-lime-950/20 dark:text-lime-400'
                      : 'bg-gray-50 text-gray-600 dark:bg-gray-950/20 dark:text-gray-400'
                  } opacity-70 group-hover:opacity-100 transition-opacity`}>
                    {isPositiveGrs 
                      ? `+${review.impactAmount || 15}` 
                      : isNegativeGrs 
                      ? `-${Math.abs(review.impactAmount || 15)}` 
                      : isDaoReview
                      ? 'DAO'
                      : '○'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Countdown Timer Component - FIXED TO PREVENT 100+ HOUR DISPLAY
function CountdownTimer({ createdAt, expiresAt }: { createdAt: string; expiresAt?: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      // GOVERNANCE ISSUE TIMER FIX: Use expiresAt when available, fallback to createdAt + 48h
      const endTime = expiresAt 
        ? new Date(expiresAt)
        : new Date(new Date(createdAt).getTime() + 48 * 60 * 60 * 1000);
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      // Debug logging to catch 100+ hour anomalies
      const hoursRemaining = diff / (1000 * 60 * 60);
      if (hoursRemaining > 48.5) {
        console.error(`⚠️ STANCES FEED TIMER ANOMALY: ${hoursRemaining.toFixed(2)} hours remaining`);
        console.error(`ExpiresAt: ${expiresAt || 'MISSING'}, CreatedAt: ${createdAt}, Now: ${now.toISOString()}`);
      }

      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const isExpired = timeLeft === 'EXPIRED';
  const isLastHour = timeLeft.includes('h') && parseInt(timeLeft.split('h')[0]) < 1;

  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
      isExpired 
        ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
        : isLastHour 
          ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 animate-pulse' 
          : 'bg-lime-100 dark:bg-lime-950/30 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-900/50'
    }`}>
      <Timer className="w-3 h-3" />
      <span className="font-semibold">{timeLeft}</span>
    </div>
  );
}



// Active Stances Carousel Component
function ActiveStancesCarousel({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { data: activeStances } = useQuery({
    queryKey: ["/api/issues/recent"],
  });

  // Ensure activeStances is always an array and limit to 5 most recent
  const stancesArray = Array.isArray(activeStances) ? activeStances.slice(0, 5) : [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stancesArray.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stancesArray.length) % stancesArray.length);
  };

  // Auto-advance carousel logic with hover pause
  useEffect(() => {
    if (isHovered || stancesArray.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stancesArray.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [stancesArray, isHovered]);

  if (stancesArray.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white dark:bg-black rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100/20 to-gray-200/20 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-100/20 to-gray-200/20 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full translate-y-8 -translate-x-8"></div>

        <div className="text-center relative z-10">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-md flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-800">
            <MessageSquare className="w-7 h-7 text-black dark:text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            No active stances yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
            Be the first to take a stance on important governance issues and shape the future of Web3
          </p>
        </div>
      </div>
    );
  }

  const currentStance = stancesArray[currentIndex];
  const created = new Date(currentStance.createdAt);
  const endTime = new Date(created.getTime() + 48 * 60 * 60 * 1000);
  const now = new Date();
  const isExpired = endTime.getTime() - now.getTime() <= 0;

  return (
    <div 
      className="relative overflow-hidden bg-white dark:bg-black rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100/20 to-gray-200/20 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-gray-100/20 to-gray-200/20 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full translate-y-10 -translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>

      {/* Navigation buttons with enhanced styling */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="w-8 h-8 rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="w-8 h-8 rounded-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Main content with compact layout */}
      <div className="text-center relative z-10 pt-4">
        {/* Smaller avatar stack */}
        <div className="flex justify-center mb-4">
          <div className="flex -space-x-2">
            {stancesArray.slice(0, 3).map((stance: any, index: number) => (
              <div 
                key={stance.id} 
                className="relative group/avatar"
                style={{ zIndex: 10 - index }}
              >
                <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 group-hover/avatar:scale-105 transition-transform duration-200">
                  <AvatarImage src={stance.author?.profileImageUrl} />
                  <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black font-bold text-sm">
                    {stance.author?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator for first avatar */}
                {index === 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-black dark:bg-white border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compact title section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight max-w-xl mx-auto group-hover:text-slate-800 dark:group-hover:text-gray-200 transition-colors duration-300">
            "{currentStance.title}"
          </h2>

          {/* Author info */}
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-600 dark:text-gray-400 mb-3">
            <span>by</span>
            <span className="font-semibold text-slate-700 dark:text-gray-300">{currentStance.author?.username}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(currentStance.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Compact stats row */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-4">
          {/* Vote stats with smaller styling */}
          <div className="flex items-center space-x-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ArrowUp className="w-3 h-3 text-gray-700 dark:text-gray-300" />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">{currentStance.upvotes}</span>
            </div>
            <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ArrowDown className="w-3 h-3 text-gray-700 dark:text-gray-300" />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-bold text-sm">{currentStance.downvotes}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="flex items-center space-x-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{currentStance.commentCount}</span>
          </div>

          {/* Compact stance type badge */}
          <Badge className={`px-3 py-1 rounded-full font-semibold text-xs border ${
            currentStance.stance === 'champion' 
              ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800'
          }`}>
            {currentStance.stance === 'champion' ? (
              <>
                <Shield className="w-3 h-3 mr-1" />
                Championing
              </>
            ) : (
              <>
                <Flame className="w-3 h-3 mr-1" />
                Challenging
              </>
            )}
          </Badge>

          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            <LiveIndicator isActive={!isExpired} />
            <CountdownTimer createdAt={currentStance.createdAt} />
          </div>
        </div>

        {/* Compact CTA button */}
        <div className="mb-4">
          <Button 
            onClick={onOpenSidebar}
            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            data-testid="button-view-active-stances"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Active Stances
          </Button>
        </div>

        {/* Compact pagination dots */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
            {stancesArray.slice(0, 5).map((stance: any, index: number) => (
              <button
                key={`carousel-indicator-${stance.id || index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-black dark:bg-white scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




// Mock Review Data for Feed - Using actual database IDs
const mockFeedReviews = [
  {
    id: 5,
    type: 'review',
    reviewer: {
      username: 'CryptoGovExpert',
      profileImageUrl: '',
    },
    reviewedUser: {
      username: 'DeFiAnalyst',
      profileImageUrl: '',
    },
    reviewType: 'positive',
    rating: 5,
    content: 'Excellent contributor with deep understanding of governance mechanisms. Always provides thoughtful analysis on complex DeFi proposals.',
    upvotes: 12,
    downvotes: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 8,
  },
  {
    id: 6,
    type: 'review',
    reviewer: {
      username: 'DeFiAnalyst',
      profileImageUrl: '',
    },
    reviewedUser: {
      username: 'BlockchainDev',
      profileImageUrl: '',
    },
    reviewType: 'positive',
    rating: 4,
    content: 'Outstanding work on the treasury management proposal. Very thorough research and well-presented arguments.',
    upvotes: 15,
    downvotes: 0,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 11,
  },
  {
    id: 7,
    type: 'review',
    reviewer: {
      username: 'BlockchainDev',
      profileImageUrl: '',
    },
    reviewedUser: {
      username: 'TokenEconomist',
      profileImageUrl: '',
    },
    reviewType: 'neutral',
    rating: 3,
    content: 'Good technical knowledge but sometimes takes too long to respond to governance discussions.',
    upvotes: 6,
    downvotes: 2,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 4,
  },
  {
    id: 8,
    type: 'review',
    reviewer: {
      username: 'CryptoGovExpert',
      profileImageUrl: '',
    },
    reviewedUser: {
      username: 'BlockchainDev',
      profileImageUrl: '',
    },
    reviewType: 'negative',
    rating: 2,
    content: 'Consistently provides low-quality contributions and often disagrees just to be contrarian without substantive reasoning.',
    upvotes: 3,
    downvotes: 8,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 2,
  },
];

// Helper function to get review badge styling
function getReviewBadgeStyle(reviewType: string) {
  switch (reviewType) {
    case 'positive':
      return {
        className: 'bg-lime-100 dark:bg-lime-950/30 text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-900/50',
        label: 'Positive Review',
        icon: ThumbsUp
      };
    case 'negative':
      return {
        className: 'bg-lime-200 dark:bg-lime-950/40 text-lime-800 dark:text-lime-400 border-lime-300 dark:border-lime-800/50',
        label: 'Negative Review',
        icon: ThumbsDown
      };
    case 'neutral':
      return {
        className: 'bg-lime-50 dark:bg-lime-950/20 text-lime-600 dark:text-lime-500 border-lime-100 dark:border-lime-900/30',
        label: 'Neutral Review',
        icon: Star
      };
    default:
      return {
        className: 'bg-lime-50 dark:bg-lime-950/30 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-900/50',
        label: 'Review',
        icon: Star
      };
  }
}

// Review Card Component
function ReviewCard({ review, userVote }: { review: any; userVote?: any }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  // Use passed vote from batch fetch (much more efficient)
  const currentVote = userVote;

  // Determine review target display info
  let reviewTarget;
  let isExternalEntity = false;
  let targetXHandle = null;

  if (review.targetType === 'dao' && review.reviewedDaoId) {
    reviewTarget = {
      username: review.reviewedDaoName || 'DAO',
      id: `dao_${review.reviewedDaoId}`,
      profileImageUrl: review.reviewedDaoLogo,
      isDao: true,
      daoSlug: review.reviewedDaoSlug
    };
    isExternalEntity = false;
    targetXHandle = null;
  } else if (review.reviewedUser) {
    reviewTarget = review.reviewedUser;
    isExternalEntity = false;
    targetXHandle = review.reviewedUser.xHandle;
  } else if (review.externalEntityName) {
    reviewTarget = {
      username: review.externalEntityName,
      id: null,
      profileImageUrl: null
    };
    isExternalEntity = true;
    targetXHandle = review.externalEntityXHandle;
  } else if (review.reviewedUserId) {
    const displayName = review.reviewedUsername || 
                        (review.reviewedUserFirstName && review.reviewedUserLastName ? 
                          `${review.reviewedUserFirstName} ${review.reviewedUserLastName}` :
                          review.reviewedUserFirstName) ||
                        (review.reviewedUserId.startsWith('unclaimed_') && review.reviewedUserId.includes('_') ? 
                          review.reviewedUserId.split('_')[2] || `User_${review.reviewedUserId.slice(-4)}` :
                          `User_${review.reviewedUserId.slice(-4)}`);

    reviewTarget = {
      username: displayName,
      id: review.reviewedUserId,
      profileImageUrl: review.reviewedUserAvatar || null,
      firstName: review.reviewedUserFirstName,
      lastName: review.reviewedUserLastName
    };

    isExternalEntity = false;
    targetXHandle = review.reviewedUserXHandle || null;
  } else {
    reviewTarget = {
      username: 'Unknown User',
      id: null,
      profileImageUrl: null
    };
    isExternalEntity = false;
    targetXHandle = null;
  }

  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'upvote' | 'downvote' }) => {
      return apiRequest("POST", `/api/reviews/${review.id}/vote`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/batch-votes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/recent-grs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });

      if ((user as any)?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${(user as any).id}/activity`] });
      }

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

  return (
    <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg" style={{ backgroundColor: '#c1ff72' }}>
              {review.reviewer?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  {review.reviewer?.username}
                </span>
                {(() => {
                  const badgeStyle = getReviewBadgeStyle(review.reviewType);
                  return (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                          style={{ color: i < review.rating ? '#c1ff72' : '#e5e7eb' }}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center space-x-2 mt-1 text-gray-500 text-sm">
                <span>reviewed</span>
                {isExternalEntity ? (
                  <span className="font-medium text-gray-700 dark:text-gray-300">{reviewTarget.username}</span>
                ) : reviewTarget.isDao ? (
                  <span className="font-medium text-gray-700 dark:text-gray-300">{reviewTarget.username}</span>
                ) : (
                  <span className="font-medium text-gray-700 dark:text-gray-300">{reviewTarget.username}</span>
                )}
                <span>•</span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-5">
          {review.title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
              "{review.title}"
            </h3>
          )}
          
          <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {(() => {
              const content = review.content || '';
              const isLongContent = content.length > 200;
              const shouldTruncate = isLongContent && !isExpanded;
              const displayContent = shouldTruncate 
                ? content.substring(0, 200) + '...' 
                : content;

              return (
                <>
                  <p className="whitespace-pre-wrap">{displayContent}</p>
                  {isLongContent && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="font-medium mt-2 inline-flex items-center text-sm hover:underline"
                      style={{ color: '#c1ff72' }}
                    >
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Verified On-Chain Badge */}
        {review.ogTxHash && !review.ogTxHash.startsWith('0g_local_') && (
          <div className="flex items-center space-x-2 mb-5">
            <a
              href={`https://chainscan.0g.ai/tx/${review.ogTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#c1ff72', color: '#000' }}
              title={`View on 0G Chain: ${review.ogTxHash}`}
            >
              <Shield className="w-3.5 h-3.5" />
              Verified On-Chain
            </a>
          </div>
        )}

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('upvote')}
              disabled={voteMutation.isPending}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                (currentVote as any)?.voteType === 'upvote' 
                  ? 'text-black border' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
              style={(currentVote as any)?.voteType === 'upvote' ? { backgroundColor: '#c1ff72', borderColor: '#c1ff72' } : {}}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{review.upvotes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('downvote')}
              disabled={voteMutation.isPending}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                (currentVote as any)?.voteType === 'downvote' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{review.downvotes}</span>
            </Button>

            <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 text-sm">
              <Award className="w-4 h-4" />
              <span>{review.helpfulCount}</span>
            </div>
          </div>

          <Link href={`/reviews/${review.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-xl px-3 py-1.5 text-sm font-medium"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Stance Card Component
function StanceCard({ stance }: { stance: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewText = stance.content?.length > 150 
    ? stance.content.substring(0, 150) + "..."
    : stance.content;

  const shouldShowReadMore = stance.content?.length > 150;

  const created = new Date(stance.createdAt);
  const endTime = new Date(created.getTime() + 48 * 60 * 60 * 1000);
  const now = new Date();
  const isExpired = endTime.getTime() - now.getTime() <= 0;

  return (
    <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="w-12 h-12 ring-2 ring-gray-200 dark:ring-gray-700">
              {stance.author?.profileImageUrl ? (
                <AvatarImage src={stance.author.profileImageUrl} alt={stance.author.username} />
              ) : (
                <AvatarFallback className="text-black font-bold text-lg" style={{ backgroundColor: '#c1ff72' }}>
                  {stance.author?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  {stance.author?.username}
                </span>
                <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-0 ${
                  stance.stance === 'champion' 
                    ? 'bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400'
                }`}>
                  {stance.stance === 'champion' ? 'Championing' : 'Challenging'}
                </Badge>
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {formatDistanceToNow(new Date(stance.createdAt), { addSuffix: true })}
                {!isExpired && <span className="ml-2 text-xs" style={{ color: '#c1ff72' }}>● Live</span>}
              </div>
            </div>
          </div>

          {!isExpired && (
            <div className="flex-shrink-0 ml-4">
              <CountdownTimer createdAt={stance.createdAt} />
            </div>
          )}
        </div>

        {/* Target Display */}
        {(stance.targetProjectName || stance.targetUsername) && (
          <div className="mb-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5">
            <div className="flex items-center space-x-2 text-sm flex-wrap">
              {stance.targetProject?.logo ? (
                <img 
                  src={stance.targetProject.logo} 
                  alt={stance.targetProjectName} 
                  className="w-6 h-6 rounded object-cover"
                />
              ) : stance.targetUsername ? (
                <User className="w-4 h-4 text-gray-500" />
              ) : (
                <User className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-semibold text-gray-900 dark:text-white">
                {stance.author?.username}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                is {stance.stance === 'champion' ? 'championing' : 'challenging'}
              </span>
              {stance.targetUsername ? (
                <Link href={`/profile/${stance.targetUsername}`}>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    @{stance.targetUsername}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  {stance.targetProject?.logo && (
                    <img 
                      src={stance.targetProject.logo} 
                      alt={stance.targetProjectName} 
                      className="w-5 h-5 rounded object-cover"
                    />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stance.targetProjectName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <Link href={`/issue/${stance.id}`} className="block mb-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-bold text-base hover:underline transition-colors line-clamp-2 leading-snug">
            "{stance.title}"
          </h3>
        </Link>

        {/* Content Preview */}
        {stance.content && (
          <div className="mb-5">
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
              {isExpanded ? stance.content : previewText}
            </p>
            {shouldShowReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium mt-2 hover:underline"
                style={{ color: '#c1ff72' }}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        )}

        {/* DAO Badge */}
        {stance.dao && (
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border" style={{ backgroundColor: '#c1ff72', borderColor: '#c1ff72', color: '#000' }}>
              {stance.dao.name}
            </div>
          </div>
        )}

        {/* Verified On-Chain Badge */}
        {stance.ogTxHash && !stance.ogTxHash.startsWith('0g_local_') && (
          <div className="flex items-center space-x-2 mb-5">
            <a
              href={`https://chainscan.0g.ai/tx/${stance.ogTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: '#c1ff72', color: '#000' }}
              title={`View on 0G Chain: ${stance.ogTxHash}`}
            >
              <Shield className="w-3.5 h-3.5" />
              Verified On-Chain
            </a>
          </div>
        )}

        {/* Stance Voting */}
        <div className="mb-4">
          <StanceVoting 
            stanceId={stance.id}
            stanceType={stance.stance as 'champion' | 'challenge'}
            isActive={!isExpired}
            expiresAt={endTime.toISOString()}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <Link href={`/issue/${stance.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{stance.commentCount}</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{stance.activityScore}</span>
            </div>
          </div>

          <Link href={`/issue/${stance.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-xl px-3 py-1.5 text-sm font-medium"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StancesFeed() {
  const [feedFilter, setFeedFilter] = useState("hot");
  const [timeFilter, setTimeFilter] = useState("today");
  const [contentFilter, setContentFilter] = useState("all"); // all, stances, reviews
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionCarouselIndex, setActionCarouselIndex] = useState(0);
  const [isActionCarouselHovered, setIsActionCarouselHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null);

  const { user, isAuthenticated } = useAuth();
  const { triggerOnboarding } = useOnboardingContext();

  // Auto-advance carousel every 6 seconds (different from DAO carousel)
  useEffect(() => {
    if (!isAuthenticated || isActionCarouselHovered) return;

    const interval = setInterval(() => {
      setActionCarouselIndex((prev) => (prev + 1) % 2);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isActionCarouselHovered]);

  const { data: stances, isLoading: stancesLoading } = useQuery({
    queryKey: ["/api/issues/recent"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/reviews"],
  });

  // Fetch project reviews
  const { data: projectReviews, isLoading: projectReviewsLoading } = useQuery({
    queryKey: ["/api/project-reviews"],
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Ensure stances is always an array
  const stancesArray = Array.isArray(stances) ? stances : [];
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const projectReviewsArray = Array.isArray(projectReviews) ? projectReviews : [];

  // Batch fetch all review votes to prevent N+1 API calls
  const reviewIds = useMemo(() => reviewsArray.map((r: any) => r.id), [reviewsArray]);
  const { data: batchVotes } = useQuery({
    queryKey: ["/api/reviews/batch-votes", reviewIds],
    queryFn: async () => {
      if (reviewIds.length === 0) return {};
      const response = await fetch("/api/reviews/batch-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewIds }),
      });
      if (!response.ok) return {};
      return response.json();
    },
    enabled: isAuthenticated && reviewIds.length > 0,
  });

  // Fetch user data for reviews
  const { data: allUsers } = useQuery({
    queryKey: ["/api/users"],
    enabled: reviewsArray.length > 0
  });

  const usersMap = useMemo(() => {
    if (!Array.isArray(allUsers)) return new Map();
    return new Map(allUsers.map((user: any) => [user.id, user]));
  }, [allUsers]);

  // Transform reviews to match the expected structure
  const transformedReviews = Array.isArray(reviews) ? reviews.map((review: any) => {
    const reviewer = usersMap.get(review.reviewerId);
    const reviewedUser = usersMap.get(review.reviewedUserId);

    return {
      ...review,
      type: 'review',
      reviewer: reviewer || {
        id: review.reviewerId,
        username: review.reviewerUsername || `User_${review.reviewerId.slice(-4)}`,
        profileImageUrl: review.reviewerAvatar || null
      },
      reviewedUser: reviewedUser || (review.reviewedUserId ? {
        id: review.reviewedUserId,
        username: review.reviewedUsername || `User_${review.reviewedUserId?.slice(-4) || ''}`,
        profileImageUrl: review.reviewedUserAvatar || null,
        firstName: review.reviewedUserFirstName,
        lastName: review.reviewedUserLastName
      } : null)
    };
  }) : [];

  // Transform project reviews to match the expected structure
  const transformedProjectReviews = projectReviewsArray.map((review: any) => ({
    ...review,
    type: 'project_review'
  }));

  // Combine stances, reviews, and project reviews into a single feed
  const combinedFeed = [...stancesArray, ...transformedReviews, ...transformedProjectReviews]
    .filter(item => {
      if (contentFilter === "stances") return !item.type;
      if (contentFilter === "reviews") return item.type === "review" || item.type === "project_review";
      return true; // all
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredStances = combinedFeed.filter((item: any) => item.type !== 'review');

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <RecentReviewsBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Active Stances Carousel */}
            <ActiveStancesCarousel onOpenSidebar={() => setSidebarOpen(true)} />

            {/* Feed Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Feed</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={contentFilter === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setContentFilter("all")}
                    className={`rounded-xl ${
                      contentFilter === "all" 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    data-testid="button-filter-all"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    All
                  </Button>
                  <Button
                    variant={contentFilter === "stances" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setContentFilter("stances")}
                    className={`rounded-xl ${
                      contentFilter === "stances" 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    data-testid="button-filter-stances"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Stances
                  </Button>
                  <Button
                    variant={contentFilter === "reviews" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setContentFilter("reviews")}
                    className={`rounded-xl ${
                      contentFilter === "reviews" 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    data-testid="button-filter-reviews"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Reviews
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={feedFilter === "hot" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFeedFilter("hot")}
                    className={`rounded-xl ${
                      feedFilter === "hot" 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    data-testid="button-filter-hot"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Hot
                  </Button>
                  <Button
                    variant={timeFilter === "today" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("today")}
                    className={`rounded-xl ${
                      timeFilter === "today" 
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    data-testid="button-filter-today"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Today
                  </Button>
                </div>
              </div>
            </div>

            {/* Feed Content */}
            <div className="space-y-4">
              {(stancesLoading || reviewsLoading || projectReviewsLoading) ? (
                <div className="flex justify-center py-12">
                  <div className="text-gray-500">Loading feed...</div>
                </div>
              ) : combinedFeed?.length === 0 ? (
                <Card className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {contentFilter === "reviews" ? "No reviews yet" : contentFilter === "stances" ? "No stances yet" : "No content yet"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {contentFilter === "reviews" 
                        ? "Be the first to review a community member" 
                        : contentFilter === "stances" 
                        ? "Be the first to take a stance on important governance issues"
                        : "Be the first to contribute content to the platform"
                      }
                    </p>
                    <Link href="/create-stance">
                      <Button className="bg-lime-500 hover:bg-lime-600 text-black rounded-xl shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {contentFilter === "reviews" ? "Write First Review" : "Create First Stance"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                combinedFeed?.map((item: any, index: number) => {
                    if (item.type === "review") {
                      return <ReviewCard key={`review-${item.id}-${index}`} review={item} userVote={batchVotes?.[item.id]} />;
                    } else if (item.type === "project_review") {
                      const reviewer = item.user;
                      const reviewerName = reviewer?.firstName 
                        ? `${reviewer.firstName} ${reviewer.lastName || ''}`.trim() 
                        : reviewer?.username || 'Anonymous';
                      const reviewerAvatar = reviewer?.profileImageUrl;
                      
                      return (
                        <Card 
                          key={`project-review-${item.id}-${index}`}
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
                              <Link href={`/projects/${item.projectId}`}>
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
                                
                                <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-3">
                                    <span>
                                      {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>•</span>
                                    <Link href={`/projects/${item.projectId}`} className="hover:underline hover:text-black dark:hover:text-white">
                                      View Project
                                    </Link>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                    onClick={() => setReportingReviewId(item.id)}
                                    data-testid={`button-report-review-${item.id}`}
                                  >
                                    <Flag className="w-3.5 h-3.5 mr-1" />
                                    Report
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    } else {
                        const created = new Date(item.createdAt);
                        const endTime = new Date(created.getTime() + 48 * 60 * 60 * 1000);
                        const now = new Date();
                        const isExpired = endTime.getTime() - now.getTime() <= 0;
                        return <StanceCard key={`stance-${item.id}-${index}`} stance={item} />;
                    }
                  })
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">

{/* Create New Content - Carousel */}
              {isAuthenticated && (
                <div 
                  className="relative overflow-hidden"
                  onMouseEnter={() => setIsActionCarouselHovered(true)}
                  onMouseLeave={() => setIsActionCarouselHovered(false)}
                >
                  <div className="overflow-hidden rounded-2xl">
                    <div className="flex transition-transform duration-300 ease-in-out w-[200%]" style={{ transform: `translateX(-${actionCarouselIndex * 50}%)` }}>
                      {/* Slide 1: New Stance */}
                      <div className="w-1/2 flex-shrink-0 pl-[4px] pr-[4px]">
                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border-gray-200 dark:border-gray-800 shadow-sm h-full relative">
                          {/* Navigation chevron in top right */}
                          <button
                            onClick={() => setActionCarouselIndex(actionCarouselIndex === 0 ? 1 : 0)}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm border border-white/50 dark:border-gray-700/50 z-10"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <CardContent className="p-6 text-center flex flex-col justify-between min-h-[200px]">
                            <div>
                              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-5 h-5 text-white dark:text-black" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Take a Stance
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                                Champion or challenge governance positions in the Web3 ecosystem
                              </p>
                            </div>
                            <Link href="/create-stance">
                              <Button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                New Stance
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Slide 2: New Review */}
                      <div className="w-1/2 flex-shrink-0 pl-[4px] pr-[4px]">
                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border-gray-200 dark:border-gray-800 shadow-sm h-full relative">
                          {/* Navigation chevron in top right */}
                          <button
                            onClick={() => setActionCarouselIndex(actionCarouselIndex === 0 ? 1 : 0)}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm border border-white/50 dark:border-gray-700/50 z-10"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <CardContent className="p-6 text-center flex flex-col justify-between min-h-[200px]">
                            <div>
                              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-5 h-5 text-white dark:text-black" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Leave a Review
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                                Discover and review projects across web3
                              </p>
                            </div>
                            <div className="mt-auto">
                              <Link href="/review-form">
                                <Button className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                  New Review
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => setActionCarouselIndex(0)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        actionCarouselIndex === 0 ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                    <button
                      onClick={() => setActionCarouselIndex(1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        actionCarouselIndex === 1 ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  </div>
                </div>
              )}

              <GrsScoreCard />





              <NewUsers />
            </div>
          </div>
        </div>
      </div>
      {/* Stances Sidebar */}
      <StancesSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Report Review Dialog */}
      {reportingReviewId && (
        <ReportReviewDialog
          reviewId={reportingReviewId}
          open={reportingReviewId !== null}
          onOpenChange={(open) => !open && setReportingReviewId(null)}
        />
      )}
    </div>
  );
}