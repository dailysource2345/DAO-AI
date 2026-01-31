import { ModernNav } from "@/components/modern-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Sparkles, Star, Users, Shield, Calendar, ChevronRight, TrendingUp, Award, Copy, Check, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SEASONS = [
  {
    id: 0,
    name: "Season 0",
    title: "Pioneers",
    description: "Retroactive + 48h after launch. Ends Dec 1, 2025.",
    boost: "4x BOOST",
    startDate: "Nov 12, 2025",
    endDate: "Dec 1, 2025",
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    active: true
  },
  {
    id: 1,
    name: "Season 1",
    title: "Early Adopters",
    description: "Coming Soon - TBA",
    boost: "3x BOOST",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    active: false
  },
  {
    id: 2,
    name: "Season 2",
    title: "Community Builders",
    description: "Coming Soon - TBA",
    boost: "2x BOOST",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    active: false
  },
  {
    id: 3,
    name: "Season 3",
    title: "Last Call",
    description: "Coming Soon - TBA",
    boost: "1x BOOST",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    active: false
  }
];

const EARNING_METHODS = [
  {
    icon: Star,
    title: "Write Reviews",
    description: "Earn Points with every verified review you write. Quality reviews help the community make informed decisions.",
    gradient: "from-lime-500 to-green-500"
  },
  {
    icon: Shield,
    title: "Spam Detection",
    description: "Keep the platform authentic by flagging spam and farmer accounts. Earn Points for protecting the community.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Refer Friends",
    description: "Invite friends to join DAO AI and earn 70 Points for each successful referral. Share on X to earn 100 Points extra!",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Sparkles,
    title: "Daily Engagement",
    description: "Stay active with comments, votes, and community participation to earn Points.",
    gradient: "from-violet-500 to-purple-500"
  }
];

export default function Rewards() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: inviteStats } = useQuery({
    queryKey: ['/api/user/invite-stats'],
    enabled: isAuthenticated && !!user
  });

  const inviteLink = user?.inviteCode ? `${window.location.origin}/signup?invite=${user.inviteCode}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    toast({
      title: "Link copied!",
      description: "Your invite link has been copied to clipboard.",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black dark:bg-white">
      <ModernNav />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <Badge className="bg-lime-500/20 text-lime-400 dark:text-lime-600 border-lime-500/30 px-4 py-1 text-sm">
                  Current season: Pioneers
                </Badge>
              </div>
              
              <h1 className="text-6xl sm:text-7xl font-bold text-white dark:text-black mb-6 leading-tight">
                Earn Pointss.<br />
                Own Points.
              </h1>
              
              <p className="text-xl text-gray-300 dark:text-gray-700 mb-8 max-w-2xl">
                Be rewarded with Pointss for using DAO AI. Users of DAO AI aren't just reviewers, but owners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/business-onboarding">
                  <Button 
                    size="lg"
                    className="bg-lime-500 hover:bg-lime-600 text-black px-8 py-6 text-lg font-semibold rounded-xl"
                    data-testid="button-start-earning"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Earning
                  </Button>
                </Link>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400 dark:text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>Join 5,000+ people earning Points</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Elements */}
            <div className="flex-1 relative min-h-[500px] hidden lg:flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl"></div>
                
                {/* Decorative Elements */}
                {/* Top Left - Star Icon Badge */}
                <div className="absolute top-12 left-12 animate-float">
                  <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Top Right - Shield Icon Badge */}
                <div className="absolute top-20 right-8 animate-float-delay-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Bottom Left - Users Icon Badge */}
                <div className="absolute bottom-32 left-8 animate-float-delay-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Bottom Right - Sparkles Icon Badge */}
                <div className="absolute bottom-20 right-16 animate-float-delay-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-12">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Geometric Shapes */}
                <div className="absolute top-1/3 left-4 animate-float-delay-4">
                  <div className="w-12 h-12 bg-lime-500/20 rounded-lg transform rotate-45"></div>
                </div>

                <div className="absolute bottom-1/3 right-4 animate-float-delay-5">
                  <div className="w-10 h-10 border-2 border-blue-500/30 rounded-full"></div>
                </div>

                <div className="absolute top-2/3 left-24 animate-float-delay-1">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full"></div>
                </div>

                {/* Center Badge - Season 0 */}
                <div className="relative z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-lime-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <Card className="relative bg-black dark:bg-white border-2 border-lime-500 shadow-2xl">
                      <CardContent className="p-10 text-center">
                        <div className="text-lime-500 text-sm font-bold mb-3 tracking-wider">SEASON 0</div>
                        <div className="text-5xl font-bold text-white dark:text-black mb-2">4x</div>
                        <div className="text-gray-400 dark:text-gray-600 text-sm tracking-wide">BOOST ACTIVE</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Get Points */}
      <div className="bg-gray-950 dark:bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white dark:text-black mb-4">How to earn Points</h2>
            <p className="text-gray-400 dark:text-gray-600 max-w-2xl">
              Points are only rewarded to users for the following activities within DAO AI. 
              Participate authentically to build your balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EARNING_METHODS.map((method, index) => (
              <Card 
                key={index}
                className="bg-gray-900 dark:bg-white border-2 border-gray-800 dark:border-gray-200 hover:border-lime-500/50 transition-all group"
                data-testid={`earning-method-${index}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white dark:text-black mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 dark:text-gray-600">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Friends Section */}
      {isAuthenticated && user?.inviteCode && (
        <div className="bg-gradient-to-br from-lime-900/20 via-black to-green-900/20 dark:from-lime-100/30 dark:via-white dark:to-green-100/30 py-20 border-y border-lime-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Badge className="bg-lime-500/20 text-lime-400 dark:text-lime-600 border-lime-500/30 px-4 py-1 text-sm mb-4">
                Invite & Earn
              </Badge>
              <h2 className="text-4xl font-bold text-white dark:text-black mb-4">
                Share Your Invite Link
              </h2>
              <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto">
                Invite friends to join Points and earn <strong className="text-lime-400 dark:text-lime-600">70 Points</strong> for each successful referral. Share on X to earn an extra <strong className="text-lime-400 dark:text-lime-600">100 Points</strong>!
              </p>
            </div>

            <Card className="bg-gray-900 dark:bg-white border-2 border-lime-500/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Invite Link */}
                  <div>
                    <label className="text-sm font-medium text-gray-400 dark:text-gray-600 mb-2 block">
                      Your Invite Link
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-lg px-4 py-3 text-white dark:text-black font-mono text-sm overflow-x-auto">
                        {inviteLink}
                      </div>
                      <Button
                        onClick={handleCopyLink}
                        className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-6"
                        data-testid="button-copy-invite-link"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  {inviteStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-800 dark:border-gray-200">
                      <div className="bg-black dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-lime-400 dark:text-lime-600">
                          {inviteStats.totalInvites || 0}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                          Friends Invited
                        </div>
                      </div>
                      <div className="bg-black dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-lime-400 dark:text-lime-600">
                          {inviteStats.successfulInvites || 0}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                          Joined & Active
                        </div>
                      </div>
                      <div className="bg-black dark:bg-gray-50 border border-gray-800 dark:border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-lime-400 dark:text-lime-600">
                          {inviteStats.credaEarned || 0}
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                          Points Earned
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Share Tip */}
                  <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-4 flex items-start gap-3">
                    <LinkIcon className="w-5 h-5 text-lime-400 dark:text-lime-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-lime-400 dark:text-lime-600 font-semibold mb-1">
                        Pro Tip: Share on X for Maximum Rewards
                      </p>
                      <p className="text-gray-400 dark:text-gray-600">
                        When you share reviews on X (Twitter), include your invite link to earn <strong>100 Points</strong> for the share plus <strong>70 Points</strong> for each friend who joins. Double rewards!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Seasons Section */}
      <div className="bg-black dark:bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white dark:text-black mb-4">Seasons</h2>
            <p className="text-gray-400 dark:text-gray-600 max-w-2xl">
              DAO AI's reward program is divided into several seasons. Every season has a multiplier boost. 
              After each season, multiplier will be reduced, ending with the baseline reward rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEASONS.map((season) => (
              <Card 
                key={season.id}
                className="relative overflow-hidden bg-gray-900 dark:bg-gray-50 border-2 border-gray-800 dark:border-gray-200 hover:border-lime-500/50 transition-all group"
                data-testid={`season-card-${season.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lime-400 dark:text-lime-600 font-semibold">
                      {season.name}
                    </span>
                    <Badge className="bg-lime-500/20 text-lime-400 dark:text-lime-600 border-lime-500/30">
                      {season.boost}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-white dark:text-black mb-2">
                    {season.title}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-600 mb-6">
                    {season.description}
                  </p>

                  {/* Season Badge */}
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${season.gradient} rounded-full blur-xl opacity-50`}></div>
                    <div className="relative w-full h-full rounded-full border-2 border-lime-500/30 bg-gray-800 dark:bg-gray-100 flex items-center justify-center overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${season.gradient} opacity-20`}></div>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-white dark:text-black" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {season.active && (
                    <Badge className="w-full bg-lime-500 text-black hover:bg-lime-600 justify-center font-bold">
                      ACTIVE NOW
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-600">
              The Points rewards program is subject to the{" "}
              <Link href="/terms-of-use">
                <span className="text-lime-400 dark:text-lime-600 hover:underline cursor-pointer">
                  following terms
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 py-20 border-t border-gray-800 dark:border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-black mb-4">
            Ready to start earning?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-700 mb-8">
            Write your first review today and start building your Points balance.
          </p>
          <Link href="/business-onboarding">
            <Button 
              size="lg"
              className="bg-lime-500 hover:bg-lime-600 text-black px-10 py-6 text-lg rounded-full font-semibold"
              data-testid="button-write-first-review"
            >
              Write Your First Review
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
