import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Navigation } from "@/components/navigation";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  profileImageUrl?: string;
  credaPoints: number;
  weeklyCreda?: number;
  lastWeekCreda?: number;
  weeklyChange?: number;
  dailyStreak?: number;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("overall");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Fetch CREDA leaderboard data - only load active tab to improve initial load time
  const { data: overallLeaderboard = [], isLoading: overallLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/creda?timeframe=overall'],
    staleTime: 60000,
    gcTime: 300000,
    refetchInterval: 120000,
    enabled: activeTab === "overall",
  });

  const { data: weeklyLeaderboard = [], isLoading: weeklyLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/creda?timeframe=weekly'],
    staleTime: 60000,
    gcTime: 300000,
    refetchInterval: 120000,
    enabled: activeTab === "weekly",
  });

  const currentLeaderboard = activeTab === "overall" ? overallLeaderboard : weeklyLeaderboard;
  const isLoading = activeTab === "overall" ? overallLoading : weeklyLoading;

  // Pagination logic
  const totalPages = Math.ceil(currentLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeaderboard = currentLeaderboard.slice(startIndex, endIndex);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const formatWeeklyChange = (change: number | undefined) => {
    if (!change) return { icon: Minus, color: "text-muted-foreground", text: "—" };
    if (change > 0) {
      return { 
        icon: TrendingUp, 
        color: "text-green-600 dark:text-green-500", 
        text: `+${change.toLocaleString()}` 
      };
    } else {
      return { 
        icon: TrendingDown, 
        color: "text-red-600 dark:text-red-500", 
        text: change.toLocaleString() 
      };
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Minimal Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-foreground mb-3 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Top contributors ranked by Points
          </p>
        </div>

        {/* Tabs and Pagination */}
        <div className="flex items-center justify-between mb-8 border-b border-border/50">
          {/* Tabs */}
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange("overall")}
              className={`pb-3 text-base font-medium transition-colors relative ${
                activeTab === "overall"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-overall"
            >
              All time
              {activeTab === "overall" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("weekly")}
              className={`pb-3 text-base font-medium transition-colors relative ${
                activeTab === "weekly"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="tab-weekly"
            >
              This week
              {activeTab === "weekly" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          </div>

          {/* Pagination Controls */}
          {!isLoading && currentLeaderboard.length > 0 && (
            <div className="flex items-center gap-3 pb-3">
              <span className="text-sm text-muted-foreground">
                {startIndex + 1}–{Math.min(endIndex, currentLeaderboard.length)} of {currentLeaderboard.length.toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-previous-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clean Table */}
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="text-left py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Week</th>
                <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</th>
                <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
                <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Points</th>
                <th className="text-right py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Streak</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Minimal loading skeleton
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-5">
                      <div className="w-8 h-4 bg-muted/30 rounded animate-pulse"></div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-muted/30 rounded-full animate-pulse"></div>
                        <div className="w-24 h-4 bg-muted/30 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="w-16 h-4 bg-muted/30 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="w-16 h-4 bg-muted/30 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="w-16 h-4 bg-muted/30 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="w-20 h-4 bg-muted/30 rounded animate-pulse ml-auto"></div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="w-12 h-4 bg-muted/30 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : currentLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-muted-foreground text-lg font-light">
                      No rankings yet
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedLeaderboard.map((entry: LeaderboardEntry, globalIndex: number) => {
                  const index = startIndex + globalIndex;
                  const isTopThree = index < 3;
                  
                  return (
                    <tr 
                      key={entry.id}
                      className={`border-b border-border/20 hover:bg-muted/5 transition-colors group ${
                        isTopThree ? 'bg-muted/[0.02]' : ''
                      }`}
                      data-testid={`leaderboard-row-${index + 1}`}
                    >
                      {/* Rank */}
                      <td className="py-5">
                        <span className={`${isTopThree ? 'text-foreground font-semibold' : 'text-muted-foreground'} text-sm`}>
                          {entry.rank}
                        </span>
                      </td>

                      {/* User */}
                      <td className="py-5">
                        <Link href={`/profile/${entry.id}`}>
                          <div className="flex items-center gap-3 cursor-pointer">
                            <Avatar className="w-9 h-9 ring-1 ring-border/50">
                              <AvatarImage src={entry.profileImageUrl} />
                              <AvatarFallback className="text-xs font-medium">
                                {entry.username?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`${isTopThree ? 'font-semibold' : 'font-normal'} text-foreground group-hover:text-foreground/70 transition-colors`}>
                              {entry.username}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Last Week CREDA */}
                      <td className="py-5 text-right">
                        <span className="text-muted-foreground text-sm tabular-nums">
                          {(entry.lastWeekCreda || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* This Week CREDA */}
                      <td className="py-5 text-right">
                        <span className="text-foreground text-sm font-medium tabular-nums">
                          {(entry.weeklyCreda || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Weekly Change */}
                      <td className="py-5 text-right">
                        {(() => {
                          const { icon: ChangeIcon, color, text } = formatWeeklyChange(entry.weeklyChange);
                          return (
                            <div className="flex items-center justify-end gap-1">
                              <ChangeIcon className={`w-3.5 h-3.5 ${color}`} />
                              <span className={`text-sm tabular-nums ${color}`}>{text}</span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Total CREDA */}
                      <td className="py-5 text-right">
                        <span className="text-foreground font-semibold text-sm tabular-nums">
                          {(entry.credaPoints || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-5 text-right">
                        <span className={`text-sm tabular-nums ${(entry.dailyStreak || 0) > 0 ? 'text-orange-600 dark:text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                          {entry.dailyStreak || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
