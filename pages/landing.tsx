import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Users, Star, TrendingUp, Award, CheckCircle2, Link2, X } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/Black and White Circle Global Tech Logo (1)_1762504013838.png";

interface Review {
  id: number;
  content: string;
  rating: number;
  reviewType: string;
  title?: string;
  reviewer?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  reviewedUser?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
}

function ReviewCard({ review }: { review: Review }) {
  const reviewerName = review.reviewer?.firstName && review.reviewer?.lastName
    ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
    : `@${review.reviewer?.username || 'Anonymous'}`;

  const reviewedName = review.reviewedUser?.firstName && review.reviewedUser?.lastName
    ? `${review.reviewedUser.firstName} ${review.reviewedUser.lastName}`
    : `@${review.reviewedUser?.username || 'User'}`;

  return (
    <Card className="flex-shrink-0 w-[400px] border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-primary text-primary'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-1 text-primary text-xs font-semibold bg-primary/10 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Verified</span>
          </div>
        </div>
        
        {review.title && (
          <h4 className="font-bold text-black dark:text-white mb-2 line-clamp-1">
            {review.title}
          </h4>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          "{review.content}"
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-500">
              {reviewerName}
            </span>
            <span className="text-gray-400 dark:text-gray-600 mx-1">→</span>
            <span className="text-black dark:text-white font-medium">
              {reviewedName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewScroller() {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/recent'],
  });

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="flex-shrink-0 w-[400px] border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex space-x-6 animate-modern-scroll hover:pause">
        {duplicatedReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

interface ProjectReview {
  id: number;
  user_id: string;
  project_id: number;
  project_name: string;
  project_logo: string;
  project_slug: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
}

function ProjectReviewCard({ review }: { review: ProjectReview }) {
  const reviewDate = new Date(review.created_at);
  const formattedDate = reviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card className="flex-shrink-0 w-[400px] border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={review.project_logo} 
            alt={review.project_name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-black dark:text-white truncate">{review.project_name}</h4>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? 'fill-primary text-primary'
                        : 'fill-gray-200 text-gray-200 dark:fill-gray-800 dark:text-gray-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
            </div>
          </div>
        </div>
        
        {review.title && (
          <h5 className="font-bold text-black dark:text-white mb-2 line-clamp-1">
            {review.title}
          </h5>
        )}
        
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          "{review.content}"
        </p>
        
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-1 text-primary text-xs font-semibold bg-primary/10 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Project Review</span>
          </div>
          <Link href={`/projects/${review.project_id}`} className="text-xs text-primary hover:underline">
            View Project →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectReviewScroller() {
  const { data: projectReviews, isLoading } = useQuery<ProjectReview[]>({
    queryKey: ['/api/project-reviews'],
  });

  if (isLoading) {
    return (
      <div className="flex space-x-6 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="flex-shrink-0 w-[400px] border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!projectReviews || projectReviews.length === 0) {
    return null;
  }

  const duplicatedReviews = [...projectReviews, ...projectReviews, ...projectReviews];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex space-x-6 animate-modern-scroll hover:pause">
        {duplicatedReviews.map((review, index) => (
          <ProjectReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('daoai.announcement.dismissed');
    if (!dismissed) {
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 300);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('daoai.announcement.dismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      role="region"
      aria-live="polite"
      className={`relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black border-b border-primary/30 transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-center relative">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-primary" />
            <div className="text-sm font-medium text-white">
              <span className="text-primary font-bold">500,000+</span> governance stances already recorded through DAO AI
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="absolute right-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
            data-testid="button-dismiss-announcement"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none animate-pulse-slow"></div>
    </div>
  );
}

export default function Landing() {
  const [, setLocation] = useState<string>("");
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="DAO AI Logo" 
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
                DAO AI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.hasInviteAccess ? (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 rounded-full"
                  data-testid="button-nav-home"
                  onClick={() => window.location.href = '/home'}
                >
                  Go to Home
                </Button>
              ) : (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 rounded-full"
                  data-testid="button-nav-signin"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Floating Elements - Hidden on Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          {/* Top Left - Review Card */}
          <div className="absolute top-24 left-8 animate-float">
            <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-4 transform rotate-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black dark:text-white">5.0 Rating</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right - Verified Badge */}
          <div className="absolute top-20 right-12 animate-float-delay-1">
            <div className="bg-white dark:bg-black border-2 border-primary/30 rounded-2xl shadow-xl p-5 transform -rotate-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-7 h-7 text-black" />
              </div>
              <div className="text-sm font-bold text-black dark:text-white">On-Chain</div>
              <div className="text-xs text-primary font-semibold">Verified ✓</div>
            </div>
          </div>

          {/* Top Center Left - Verified Check */}
          <div className="absolute top-32 left-1/4 animate-float-delay-2">
            <div className="bg-primary rounded-2xl shadow-xl p-5 transform rotate-3">
              <CheckCircle2 className="w-10 h-10 text-black" />
            </div>
          </div>

          {/* Top Center Right - Stances Count */}
          <div className="absolute top-28 right-1/4 animate-float-delay-3">
            <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-4 transform -rotate-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">2,847</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Stances</div>
              </div>
            </div>
          </div>

          {/* Middle Left - User Badge */}
          <div className="absolute top-1/2 left-12 transform -translate-y-1/2 animate-float-delay-4">
            <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-4 transform rotate-12">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <div className="text-xs font-bold text-black dark:text-white">Active Users</div>
                  <div className="text-lg font-bold text-primary">1,234</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Right - Blockchain Link */}
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 animate-float-delay-5">
            <div className="bg-white dark:bg-black border-2 border-primary/30 rounded-xl shadow-lg p-3 transform -rotate-12">
              <div className="flex items-center space-x-2 mb-2">
                <Link2 className="w-4 h-4 text-primary" />
                <div className="text-xs font-semibold text-black dark:text-white">On-Chain</div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
              </div>
            </div>
          </div>

          {/* Bottom Left - Credibility Badge */}
          <div className="absolute bottom-32 left-16 animate-float">
            <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-4 transform -rotate-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div className="text-sm font-bold text-black dark:text-white">Credibility</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Proven</div>
            </div>
          </div>

          {/* Bottom Right - Check Mark */}
          <div className="absolute bottom-28 right-16 animate-float-delay-1">
            <div className="bg-primary rounded-2xl shadow-xl p-4 transform rotate-12">
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
          </div>

          {/* Additional Decorative Shapes */}
          <div className="absolute top-40 left-1/3 animate-float-delay-3">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl transform rotate-45"></div>
          </div>
          <div className="absolute bottom-40 right-1/3 animate-float-delay-5">
            <div className="w-12 h-12 border-4 border-primary/30 rounded-xl transform -rotate-12"></div>
          </div>
          <div className="absolute top-1/3 right-1/2 transform translate-x-1/2 animate-float-delay-2">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Notification Banner */}
            <div className="flex justify-center mb-8">
              <Link href="/rewards">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-black dark:bg-white rounded-full border border-gray-800 dark:border-gray-200 hover:border-gray-600 dark:hover:border-gray-400 transition-colors cursor-pointer group">
                  <span className="text-lime-500 font-bold text-sm">News</span>
                  <span className="text-white dark:text-black text-sm font-medium">DAO AI Mainnet is now live</span>
                  <ArrowRight className="w-4 h-4 text-white dark:text-black group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
              Build Governance Reputation.<br />
              <span className="text-primary">Prove It On-Chain.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-3xl mx-auto">
              DAO AI helps DAOs, delegates, and governance participants build verifiable on-chain reputation through transparent voting records.
            </p>
            
            <p className="text-lg text-gray-500 dark:text-gray-500 mb-12 leading-relaxed max-w-3xl mx-auto">
              Every governance stance is authentic, transparent, and permanently stored on-chain, creating a public record of participation anyone can verify.
            </p>

            {/* Features List */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-black dark:text-white font-medium">Track governance participation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-black dark:text-white font-medium">Prove voting history</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-black dark:text-white font-medium">Build delegate reputation</span>
              </div>
            </div>

            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black font-bold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="button-start-building"
            >
              <Link href="/home">
                Take a Stance
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Background Gradient Blurs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Live Reviews Scroller */}
      <section className="py-16 bg-white dark:bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Real Stances. Real Trust.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See what delegates are saying with verified on-chain governance records
            </p>
          </div>
        </div>
        <ReviewScroller />
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to build your governance reputation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-black">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">1. Take a Stance</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Participate in governance by voting on proposals and taking clear positions on key decisions that shape your DAO.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-black">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">2. Verify On-Chain</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Every vote and stance is cryptographically signed and stored on-chain, creating an immutable record of your governance participation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-black">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">3. Build Reputation</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Showcase your governance track record across DAOs. Let your participation history speak for itself with transparent, verifiable proof.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-6">
                Why Choose <span className="text-primary">DAO AI?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Traditional delegate profiles lack transparency and accountability. DAO AI leverages blockchain technology to create a permanent, verifiable record of governance participation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-1">Permanent Stance Records</h4>
                    <p className="text-gray-600 dark:text-gray-400">Every stance you take is permanently recorded on-chain, creating a verifiable history of your governance positions.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-1">Immutable Governance Record</h4>
                    <p className="text-gray-600 dark:text-gray-400">Once on-chain, your governance participation cannot be altered or deleted by anyone.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-1">Cross-DAO Reputation</h4>
                    <p className="text-gray-600 dark:text-gray-400">Build a unified governance reputation that follows you across multiple DAOs and protocols.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-1">Earn Rewards for Participation</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get rewarded for actively participating in governance and building your on-chain reputation.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative flex items-center justify-center">
              {/* DAO AI Trust Badge - Company Display Style */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-gray-100 dark:border-gray-800 max-w-md">
                {/* Logo and Brand Header */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <img 
                    src={logoImage} 
                    alt="DAO AI Logo" 
                    className="w-12 h-12"
                  />
                  <span className="text-3xl font-bold text-black dark:text-white">DAO AI</span>
                </div>

                {/* Star Rating - 4.8 out of 5 */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="bg-primary w-14 h-14 rounded-lg flex items-center justify-center shadow-md"
                    >
                      <Star className="w-8 h-8 text-black fill-black" />
                    </div>
                  ))}
                  {/* Partial 5th star for 4.8 rating */}
                  <div className="relative w-14 h-14">
                    <div className="bg-gray-200 dark:bg-gray-700 w-14 h-14 rounded-lg flex items-center justify-center shadow-md">
                      <Star className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <div className="absolute inset-0 overflow-hidden" style={{ width: '80%' }}>
                      <div className="bg-primary w-14 h-14 rounded-lg flex items-center justify-center shadow-md">
                        <Star className="w-8 h-8 text-black fill-black" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-black dark:text-white mb-1">
                    TrustScore <span className="text-primary">4.8</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    2,847 stances
                  </div>
                </div>

                {/* On-Chain Verification */}
                <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/30">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-bold text-black dark:text-white">Verified On-Chain</span>
                  </div>
                </div>
              </div>

              {/* Decorative Background */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black dark:bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white dark:text-black mb-6">
            Ready to Build Your Governance Reputation?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-10">
            Join delegates, DAOs, and governance participants who are building trust with verified, on-chain voting records.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-black font-bold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="button-cta-start"
          >
            <Link href="/home">
              Start Building Reputation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="DAO AI Logo" 
                className="w-10 h-10"
              />
              <div>
                <div className="text-xl font-bold text-black dark:text-white">DAO AI</div>
                <div className="text-sm text-gray-500 dark:text-gray-500">Building governance reputation on-chain</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} DAO AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
