import { ModernNav } from "@/components/modern-nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Shield,
  ExternalLink,
  ThumbsUp,
  Share2,
  Flag,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
  X
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ReportReviewDialog } from "@/components/report-review-dialog";

// Mock project data - this would come from API in production
const MOCK_PROJECTS = {
  "1": {
    id: 1,
    name: "MetaMask",
    slug: "metamask",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop",
    bannerGradient: "from-orange-500 via-orange-400 to-yellow-500",
    rating: 4.7,
    reviewCount: 8542,
    description: "MetaMask is the most popular browser extension wallet for Ethereum and EVM-compatible chains. It allows users to store, send, and receive cryptocurrencies and interact with decentralized applications (dApps) seamlessly. With over 30 million users worldwide, MetaMask has become the gateway to Web3 for millions.",
    verified: true,
    website: "https://metamask.io",
    email: "support@metamask.io",
    founded: "2016",
    ratingBreakdown: {
      5: 88,
      4: 7,
      3: 2,
      2: 1,
      1: 2
    },
    features: ["Multi-chain support", "Browser extension", "Mobile app", "Hardware wallet integration", "NFT support"],
    reviews: []
  },
  "2": {
    id: 2,
    name: "Phantom",
    slug: "phantom",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=200&h=200&fit=crop",
    bannerGradient: "from-purple-500 via-violet-500 to-indigo-500",
    rating: 4.9,
    reviewCount: 6234,
    description: "Phantom is the leading Solana wallet with a beautiful UI and seamless NFT support. Manage your Solana tokens, NFTs, and interact with Solana dApps with ease. Known for its exceptional user experience and innovative features.",
    verified: true,
    website: "https://phantom.app",
    email: "support@phantom.app",
    founded: "2021",
    ratingBreakdown: {
      5: 90,
      4: 6,
      3: 2,
      2: 1,
      1: 1
    },
    features: ["Solana native", "Beautiful UI", "NFT gallery", "In-app swaps", "Multi-chain support"],
    reviews: []
  },
  "3": {
    id: 3,
    name: "Trust Wallet",
    slug: "trust-wallet",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop",
    bannerGradient: "from-blue-500 via-blue-400 to-cyan-500",
    rating: 4.5,
    reviewCount: 12340,
    description: "Trust Wallet is a secure multi-chain wallet trusted by millions worldwide. Support for 70+ blockchains and 4.5 million+ assets makes it one of the most comprehensive wallets available. Your keys, your crypto.",
    verified: true,
    website: "https://trustwallet.com",
    email: "support@trustwallet.com",
    founded: "2017",
    ratingBreakdown: {
      5: 75,
      4: 15,
      3: 5,
      2: 3,
      1: 2
    },
    features: ["70+ blockchains", "DApp browser", "Staking support", "NFT support", "Built-in DEX"],
    reviews: []
  },
  "4": {
    id: 4,
    name: "Ledger Live",
    slug: "ledger-live",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop",
    bannerGradient: "from-gray-700 via-gray-600 to-gray-500",
    rating: 4.6,
    reviewCount: 5678,
    description: "Ledger Live is the companion app for Ledger hardware wallets, providing maximum security for your crypto assets. Manage your portfolio, buy, sell, and stake crypto while keeping your keys secure on your hardware device.",
    verified: true,
    website: "https://ledger.com",
    email: "support@ledger.com",
    founded: "2014",
    ratingBreakdown: {
      5: 82,
      4: 10,
      3: 4,
      2: 2,
      1: 2
    },
    features: ["Hardware wallet integration", "Maximum security", "Staking", "Portfolio tracking", "Buy/Sell crypto"],
    reviews: []
  },
  "5": {
    id: 5,
    name: "Uniswap",
    slug: "uniswap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop",
    bannerGradient: "from-pink-500 via-pink-400 to-rose-500",
    rating: 4.8,
    reviewCount: 15234,
    description: "Uniswap is the leading decentralized exchange for ERC-20 token swaps. Trade directly from your wallet with no registration required. Deep liquidity and fair pricing through automated market making.",
    verified: true,
    website: "https://uniswap.org",
    email: "contact@uniswap.org",
    founded: "2018",
    ratingBreakdown: {
      5: 85,
      4: 9,
      3: 3,
      2: 2,
      1: 1
    },
    features: ["Decentralized", "No KYC required", "Deep liquidity", "AMM protocol", "Multi-chain"],
    reviews: []
  },
  "6": {
    id: 6,
    name: "Jupiter",
    slug: "jupiter",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=200&h=200&fit=crop",
    bannerGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    rating: 4.9,
    reviewCount: 8956,
    description: "Jupiter is the best liquidity aggregator on Solana with optimal routing. Get the best prices for your swaps by automatically routing through multiple DEXs. Fast, efficient, and user-friendly.",
    verified: true,
    website: "https://jup.ag",
    email: "hello@jup.ag",
    founded: "2021",
    ratingBreakdown: {
      5: 93,
      4: 4,
      3: 1,
      2: 1,
      1: 1
    },
    features: ["Liquidity aggregation", "Best price routing", "Limit orders", "DCA", "Fast execution"],
    reviews: []
  },
  "7": {
    id: 7,
    name: "PancakeSwap",
    slug: "pancakeswap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop",
    bannerGradient: "from-amber-500 via-yellow-500 to-orange-500",
    rating: 4.6,
    reviewCount: 11234,
    description: "PancakeSwap is the top DEX on BNB Chain with yield farming and more. Swap tokens, earn rewards through staking and farming, and participate in lotteries and NFTs. Low fees and high APYs.",
    verified: true,
    website: "https://pancakeswap.finance",
    email: "contact@pancakeswap.finance",
    founded: "2020",
    ratingBreakdown: {
      5: 78,
      4: 13,
      3: 5,
      2: 2,
      1: 2
    },
    features: ["Yield farming", "Staking pools", "Lottery", "NFT marketplace", "Low fees"],
    reviews: []
  },
  "8": {
    id: 8,
    name: "Raydium",
    slug: "raydium",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop",
    bannerGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    rating: 4.7,
    reviewCount: 6789,
    description: "Raydium is an automated market maker and liquidity provider on Solana. Trade with minimal slippage, provide liquidity to earn fees, and farm RAY tokens. Seamless integration with Serum's order book.",
    verified: true,
    website: "https://raydium.io",
    email: "hello@raydium.io",
    founded: "2021",
    ratingBreakdown: {
      5: 81,
      4: 11,
      3: 4,
      2: 2,
      1: 2
    },
    features: ["AMM on Solana", "Liquidity pools", "Yield farming", "AcceleRaytor launchpad", "Low fees"],
    reviews: []
  },
  "9": {
    id: 9,
    name: "Coinbase Card",
    slug: "coinbase-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop",
    bannerGradient: "from-blue-600 via-blue-500 to-cyan-500",
    rating: 4.4,
    reviewCount: 7234,
    description: "The Coinbase Card lets you spend your crypto anywhere Visa is accepted. Earn up to 4% back in crypto rewards on every purchase. Seamless integration with your Coinbase account.",
    verified: true,
    website: "https://coinbase.com/card",
    email: "support@coinbase.com",
    founded: "2020",
    ratingBreakdown: {
      5: 68,
      4: 18,
      3: 8,
      2: 4,
      1: 2
    },
    features: ["4% crypto rewards", "Visa accepted worldwide", "Instant spending", "Mobile app", "No annual fee"],
    reviews: []
  },
  "10": {
    id: 10,
    name: "KAST",
    slug: "kast",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop",
    bannerGradient: "from-indigo-600 via-purple-600 to-violet-600",
    rating: 4.8,
    reviewCount: 8234,
    description: "KAST is a revolutionary global money app that combines the best of traditional banking with Web3 innovation. Save, send, and spend stablecoins with a Visa-integrated card that works everywhere. Experience borderless payments with zero fees and instant settlements.",
    verified: true,
    website: "https://kast.xyz",
    email: "hello@kast.xyz",
    founded: "2021",
    ratingBreakdown: {
      5: 92,
      4: 5,
      3: 1,
      2: 1,
      1: 1
    },
    features: ["Visa integration", "Zero fees", "Instant settlements", "Stablecoin savings", "Global acceptance"],
    reviews: []
  },
  "11": {
    id: 11,
    name: "Binance Card",
    slug: "binance-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=200&h=200&fit=crop",
    bannerGradient: "from-yellow-500 via-amber-500 to-orange-500",
    rating: 4.3,
    reviewCount: 5432,
    description: "The Binance Card allows you to spend your crypto with zero fees and instant conversion. Earn cashback on every purchase and manage everything through the Binance app. Available in 40+ countries.",
    verified: true,
    website: "https://binance.com/card",
    email: "card@binance.com",
    founded: "2020",
    ratingBreakdown: {
      5: 65,
      4: 20,
      3: 9,
      2: 4,
      1: 2
    },
    features: ["Zero conversion fees", "Cashback rewards", "Instant conversion", "Global acceptance", "Mobile app"],
    reviews: []
  },
  "12": {
    id: 12,
    name: "BitPay Card",
    slug: "bitpay-card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=200&h=200&fit=crop",
    bannerGradient: "from-slate-600 via-slate-500 to-gray-500",
    rating: 4.2,
    reviewCount: 3456,
    description: "The BitPay Card converts and spends crypto in real-time with Mastercard. Load your card with Bitcoin, Ethereum, or other supported crypto and spend anywhere Mastercard is accepted. Simple, secure, and reliable.",
    verified: true,
    website: "https://bitpay.com/card",
    email: "support@bitpay.com",
    founded: "2020",
    ratingBreakdown: {
      5: 62,
      4: 22,
      3: 10,
      2: 4,
      1: 2
    },
    features: ["Mastercard network", "Multi-crypto support", "Real-time conversion", "Mobile wallet", "Contactless payments"],
    reviews: []
  }
};

// Write Review Dialog Component
interface WriteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: typeof MOCK_PROJECTS[keyof typeof MOCK_PROJECTS];
}

function WriteReviewDialog({ isOpen, onClose, project }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      return await apiRequest("POST", "/api/project-reviews", reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Review submitted!",
        description: "Your review has been published and will appear on the home feed.",
      });
      setRating(0);
      setTitle("");
      setContent("");
      onClose();
      // Invalidate the project reviews cache
      queryClient.invalidateQueries({ queryKey: [`/api/project-reviews/${project.id}`] });
      // Also invalidate the companies cache to update review count
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating for your review.",
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters in your review.",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      projectId: project.id,
      projectName: project.name,
      projectLogo: project.logo,
      projectSlug: project.slug,
      rating,
      title: title.trim() || null,
      content: content.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-write-review">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <img 
              src={project.logo} 
              alt={project.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            Review {project.name}
          </DialogTitle>
          <DialogDescription>
            Share your experience to help others make informed decisions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                  data-testid={`button-rating-${star}`}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-primary text-primary"
                        : "text-gray-300 dark:text-gray-700"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="review-title" className="block text-sm font-semibold text-black dark:text-white mb-2">
              Title (optional)
            </label>
            <Input
              id="review-title"
              type="text"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              data-testid="input-review-title"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="review-content" className="block text-sm font-semibold text-black dark:text-white mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="review-content"
              placeholder="Tell us about your experience with this project..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={1000}
              className="resize-none"
              data-testid="textarea-review-content"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {content.length}/1000 characters (minimum 10)
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitReviewMutation.isPending}
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold"
              disabled={submitReviewMutation.isPending}
              data-testid="button-submit-review"
            >
              {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch company data from database
  const { data: companyData, isLoading: companyLoading, error: companyError } = useQuery({
    queryKey: [`/api/companies/external/${projectId}`],
    enabled: !!projectId,
  });

  // Fallback to mock data if company not found in database or error occurs
  const mockProject = MOCK_PROJECTS[projectId as keyof typeof MOCK_PROJECTS] || MOCK_PROJECTS["10"];
  
  // Map database fields to expected format
  const project = (companyData && !companyError) ? {
    id: (companyData as any).externalId,
    name: (companyData as any).name,
    slug: (companyData as any).slug,
    category: (companyData as any).category || "Uncategorized",
    logo: (companyData as any).logo || mockProject.logo,
    bannerGradient: mockProject.bannerGradient,
    description: (companyData as any).description || "",
    website: (companyData as any).website || "",
    email: (companyData as any).email || "",
    founded: (companyData as any).founded || "",
    features: Array.isArray((companyData as any).keyFeatures) ? (companyData as any).keyFeatures : [],
    verified: (companyData as any).isVerified || false,
    rating: 0,
    reviewCount: 0, // Will be calculated from actual reviews
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: []
  } : mockProject;

  // Fetch real project reviews from database
  const { data: projectReviews = [], isLoading } = useQuery({
    queryKey: [`/api/project-reviews/${projectId}`],
    enabled: !!projectId,
  });

  // Calculate real statistics from database reviews
  const reviewsArray = projectReviews as any[];
  const totalReviews = reviewsArray.length;
  const averageRating = totalReviews > 0
    ? reviewsArray.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
    : project.rating;

  // Calculate rating breakdown
  const ratingBreakdown = {
    5: reviewsArray.filter((r: any) => r.rating === 5).length,
    4: reviewsArray.filter((r: any) => r.rating === 4).length,
    3: reviewsArray.filter((r: any) => r.rating === 3).length,
    2: reviewsArray.filter((r: any) => r.rating === 2).length,
    1: reviewsArray.filter((r: any) => r.rating === 1).length,
  };

  // Filter and sort reviews
  const filteredReviews = reviewsArray
    .filter((review: any) => {
      const matchesSearch = searchQuery === "" || 
        (review.title && review.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
      
      return matchesSearch && matchesRating;
    })
    .sort((a: any, b: any) => {
      // Sort by date (most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <ModernNav />

      {/* Clean Header - No purple banner */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/projects" className="text-primary hover:underline text-sm mb-4 inline-block" data-testid="link-back-to-projects">
            ← Back to Projects
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-24 h-24 rounded-2xl shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-black dark:text-white">
                        {project.name}
                      </h2>
                      {project.verified && (
                        <Shield className="w-6 h-6 fill-primary text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-sm">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-black font-bold"
                        onClick={() => setIsReviewDialogOpen(true)}
                        data-testid="button-write-review"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2"
                        asChild
                        data-testid="button-visit-website"
                      >
                        <a href={project.website} target="_blank" rel="noopener noreferrer">
                          Visit website
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  All reviews are blockchain-verified and cannot be altered or deleted. This ensures complete transparency and authenticity.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 rounded-none h-auto p-0">
                <TabsTrigger
                  value="summary"
                  className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
                  data-testid="tab-summary"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
                  data-testid="tab-about"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
                  data-testid="tab-reviews"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-6 mt-6">
                {/* AI Summary */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-black dark:text-white">Review Summary</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                        AI Generated
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Based on {totalReviews.toLocaleString()} reviews</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Reviewers overwhelmingly praise {project.name} for its exceptional user experience and reliability. 
                      Customers consistently highlight the platform's intuitive interface, robust security features, and 
                      outstanding customer support. The service's ability to provide seamless transactions and innovative 
                      features has earned it strong recommendations from users worldwide.
                    </p>
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                    Recent Reviews
                  </h3>
                  {isLoading ? (
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
                      </CardContent>
                    </Card>
                  ) : filteredReviews.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {filteredReviews.slice(0, 3).map((review: any) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                      {totalReviews > 0 && (
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-2 hover:border-primary"
                          data-testid="button-see-all-reviews"
                          onClick={() => setActiveTab("reviews")}
                        >
                          See all {totalReviews.toLocaleString()} reviews
                        </Button>
                      )}
                    </>
                  ) : (
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                        <Button
                          className="mt-4 bg-primary hover:bg-primary/90 text-black font-bold"
                          onClick={() => setIsReviewDialogOpen(true)}
                          data-testid="button-write-first-review"
                        >
                          Write a Review
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold text-black dark:text-white">About {project.name}</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {project.description || "No description available"}
                    </p>

                    {project.features && project.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {project.features.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                      <h4 className="font-semibold text-black dark:text-white mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        {project.website && (
                          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Globe className="w-5 h-5 text-primary" />
                            <a href={project.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                              {project.website}
                            </a>
                          </div>
                        )}
                        {project.email && (
                          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Mail className="w-5 h-5 text-primary" />
                            <span>{project.email}</span>
                          </div>
                        )}
                        {project.founded && (
                          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>Founded in {project.founded}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search reviews by author, title, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-reviews"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        data-testid="button-clear-search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-full sm:w-[180px] border-2" data-testid="select-filter-rating">
                      <SelectValue placeholder="All ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="5">5 stars</SelectItem>
                      <SelectItem value="4">4 stars</SelectItem>
                      <SelectItem value="3">3 stars</SelectItem>
                      <SelectItem value="2">2 stars</SelectItem>
                      <SelectItem value="1">1 star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results count */}
                {(searchQuery || filterRating !== "all") && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredReviews.length} of {totalReviews} reviews
                  </div>
                )}

                {/* All Reviews */}
                <div className="space-y-4">
                  {isLoading ? (
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
                      </CardContent>
                    </Card>
                  ) : filteredReviews.length > 0 ? (
                    filteredReviews.map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <Card className="border border-gray-200 dark:border-gray-800">
                      <CardContent className="p-12 text-center">
                        <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg text-black dark:text-white mb-2">
                          No reviews found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("");
                            setFilterRating("all");
                          }}
                          data-testid="button-reset-filters"
                        >
                          Reset filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-black dark:text-white mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? "fill-primary text-primary"
                            : "text-gray-300 dark:text-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="inline-block bg-primary text-black px-3 py-1 rounded-full text-sm font-bold mb-2">
                    Excellent
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalReviews.toLocaleString()} reviews
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                        {stars}-star
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: totalReviews > 0 
                              ? `${(ratingBreakdown[stars as keyof typeof ratingBreakdown] / totalReviews) * 100}%` 
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
                        {totalReviews > 0 
                          ? Math.round((ratingBreakdown[stars as keyof typeof ratingBreakdown] / totalReviews) * 100)
                          : 0}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6">
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p>
                      Replied to 100% of reviews
                      <br />
                      <span className="text-xs">Typically responds within 1 day</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-black dark:text-white mb-2">
                  Share your experience
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Help others make informed decisions
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                  onClick={() => setIsReviewDialogOpen(true)}
                  data-testid="button-write-review-sidebar"
                >
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Write Review Dialog */}
      <WriteReviewDialog 
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        project={project}
      />
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Format the date
  const reviewDate = new Date(review.createdAt || review.created_at);
  const formattedDate = reviewDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Get user information
  const user = review.user;
  const displayName = user?.username || user?.twitterHandle || "Anonymous User";
  
  // Generate initials from user's name
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username && user.username.length >= 2) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.username && user.username.length === 1) {
      return user.username[0].toUpperCase();
    }
    if (user?.twitterHandle && user.twitterHandle.length >= 2) {
      return user.twitterHandle.substring(0, 2).toUpperCase();
    }
    if (user?.twitterHandle && user.twitterHandle.length === 1) {
      return user.twitterHandle[0].toUpperCase();
    }
    return "AU";
  };
  
  const initials = getInitials();

  // Mutation to mark review as helpful
  const markHelpfulMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/project-reviews/${review.id}/helpful`);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the project reviews cache
      queryClient.invalidateQueries({ queryKey: [`/api/project-reviews/${review.projectId}`] });
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark review as helpful. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors" data-testid={`review-card-${review.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-black dark:text-white" data-testid={`review-author-${review.id}`}>
                    {displayName}
                  </h4>
                  {review.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs" data-testid={`review-verified-${review.id}`}>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3" data-testid={`review-rating-${review.id}`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "fill-primary text-primary" : "text-gray-300 dark:text-gray-700"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            {review.title && (
              <h5 className="font-semibold text-black dark:text-white mb-2" data-testid={`review-title-${review.id}`}>{review.title}</h5>
            )}
            <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid={`review-content-${review.id}`}>{review.content}</p>

            {/* Company Reply */}
            {review.companyReply && (
              <div className="mt-3 mb-4 bg-white dark:bg-gray-800 border-l-4 border-primary rounded-r-lg p-4" data-testid={`company-reply-${review.id}`}>
                <div className="flex items-start gap-3">
                  {review.projectLogo && (
                    <div className="relative flex-shrink-0">
                      <img 
                        src={review.projectLogo} 
                        alt={review.projectName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-sm text-black dark:text-white">{review.projectName}</span>
                      <Badge className="text-xs bg-black dark:bg-black text-primary border-0">
                        Official Response
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{review.companyReply}</p>
                    {review.companyRepliedAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.companyRepliedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm">
              <button 
                onClick={() => markHelpfulMutation.mutate()}
                disabled={markHelpfulMutation.isPending}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                data-testid={`button-helpful-${review.id}`}
              >
                <ThumbsUp className="w-4 h-4" />
                {markHelpfulMutation.isPending ? "..." : `Helpful (${review.helpful})`}
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" data-testid={`button-share-${review.id}`}>
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={() => setIsReportDialogOpen(true)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors" 
                data-testid={`button-report-${review.id}`}
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <ReportReviewDialog 
        reviewId={review.id}
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </Card>
  );
}
