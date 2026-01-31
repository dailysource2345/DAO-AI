import { ModernNav } from "@/components/modern-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  ChevronRight,
  Shield,
  TrendingUp,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DUMMY_PROJECTS = [
  // Wallets
  {
    id: 1,
    name: "MetaMask",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    rating: 4.7,
    reviewCount: 8542,
    description: "Most popular browser extension wallet for Ethereum and EVM chains",
    verified: true,
    featured: true,
    tags: ["Ethereum", "Browser Extension", "DeFi"]
  },
  {
    id: 2,
    name: "Phantom",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
    rating: 4.9,
    reviewCount: 6234,
    description: "Leading Solana wallet with beautiful UI and seamless NFT support",
    verified: true,
    featured: true,
    tags: ["Solana", "NFT", "Mobile"]
  },
  {
    id: 3,
    name: "Trust Wallet",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    rating: 4.5,
    reviewCount: 12340,
    description: "Secure multi-chain wallet trusted by millions worldwide",
    verified: true,
    tags: ["Multi-chain", "Mobile", "DeFi"]
  },
  {
    id: 4,
    name: "Ledger Live",
    category: "Wallets",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    rating: 4.6,
    reviewCount: 5678,
    description: "Hardware wallet companion app for maximum security",
    verified: true,
    tags: ["Hardware", "Security", "Bitcoin"]
  },
  
  // Exchanges
  {
    id: 5,
    name: "Uniswap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    rating: 4.8,
    reviewCount: 15234,
    description: "Leading decentralized exchange for ERC-20 token swaps",
    verified: true,
    featured: true,
    tags: ["Ethereum", "DEX", "DeFi"]
  },
  {
    id: 6,
    name: "Jupiter",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
    rating: 4.9,
    reviewCount: 8956,
    description: "Best liquidity aggregator on Solana with optimal routing",
    verified: true,
    featured: true,
    tags: ["Solana", "Aggregator", "Trading"]
  },
  {
    id: 7,
    name: "PancakeSwap",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    rating: 4.6,
    reviewCount: 11234,
    description: "Top DEX on BNB Chain with yield farming and more",
    verified: true,
    tags: ["BSC", "DEX", "Yield Farming"]
  },
  {
    id: 8,
    name: "Raydium",
    category: "Exchanges",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    rating: 4.7,
    reviewCount: 6789,
    description: "Automated market maker and liquidity provider on Solana",
    verified: true,
    tags: ["Solana", "AMM", "Liquidity"]
  },
  
  // Cards
  {
    id: 9,
    name: "Coinbase Card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=120&h=120&fit=crop",
    rating: 4.4,
    reviewCount: 7234,
    description: "Spend crypto anywhere with cashback rewards",
    verified: true,
    website: "https://coinbase.com",
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    tags: ["Visa", "Cashback", "Crypto"]
  },
  {
    id: 10,
    name: "KAST",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=120&fit=crop",
    rating: 4.8,
    reviewCount: 8234,
    description: "Global money app for saving, sending, and spending stablecoins with Visa integration",
    verified: true,
    website: "https://kast.xyz",
    gradient: "from-indigo-600 via-purple-600 to-violet-600",
    featured: true,
    tags: ["Stablecoins", "Visa", "Global"]
  },
  {
    id: 11,
    name: "Binance Card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=120&h=120&fit=crop",
    rating: 4.3,
    reviewCount: 5432,
    description: "Spend your crypto with zero fees and instant conversion",
    verified: true,
    tags: ["Zero Fees", "Instant", "Crypto"]
  },
  {
    id: 12,
    name: "BitPay Card",
    category: "Cards",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=120&h=120&fit=crop",
    rating: 4.2,
    reviewCount: 3456,
    description: "Convert and spend crypto in real-time with Mastercard",
    verified: true,
    tags: ["Mastercard", "Real-time", "Bitcoin"]
  },
];

export default function BrowseProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [minRating, setMinRating] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Track referral clicks from X share links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refToken = urlParams.get('ref');
    
    if (refToken) {
      // Store ref token in localStorage for later use during signup/review
      localStorage.setItem('referralToken', refToken);
      
      // Track the click
      apiRequest('POST', `/api/review-shares/${refToken}/click`, {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        ipAddress: null
      }).catch(err => {
        console.error('Failed to track referral click:', err);
      });
    }
  }, []);

  // Fetch real companies from database
  const { data: dbCompanies = [], isLoading } = useQuery({
    queryKey: ['/api/companies'],
  });

  // Merge database companies with dummy projects
  const allProjects = useMemo(() => {
    const dbProjectsMap = new Map(
      (dbCompanies as any[]).map((company: any) => [company.externalId, {
        id: parseInt(company.externalId),
        name: company.name,
        category: company.category || "Uncategorized",
        logo: company.logo || DUMMY_PROJECTS.find((p: any) => p.id === parseInt(company.externalId))?.logo || "",
        rating: parseFloat(company.averageRating) || 4.8,
        reviewCount: company.reviewCount || 0,
        description: company.description || "",
        verified: company.isVerified || false,
        website: company.website || "",
        gradient: company.gradient || "",
        featured: DUMMY_PROJECTS.find((p: any) => p.id === parseInt(company.externalId))?.featured || false,
        tags: DUMMY_PROJECTS.find((p: any) => p.id === parseInt(company.externalId))?.tags || []
      }])
    );

    return DUMMY_PROJECTS.map((dummyProject: any) => {
      const dbProject = dbProjectsMap.get(String(dummyProject.id));
      return dbProject || dummyProject;
    });
  }, [dbCompanies]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = [
    { name: "Wallets", icon: Wallet, color: "from-purple-500 to-indigo-500", count: 4 },
    { name: "Exchanges", icon: ArrowRightLeft, color: "from-blue-500 to-cyan-500", count: 4 },
    { name: "Cards", icon: CreditCard, color: "from-green-500 to-emerald-500", count: 4 },
  ];

  const filteredProjects = useMemo(() => {
    let filtered = allProjects.filter(project => {
      const matchesSearch = !debouncedSearch || 
        project.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (project.tags && project.tags.some((tag: string) => tag.toLowerCase().includes(debouncedSearch.toLowerCase())));
      
      const matchesCategory = !selectedCategory || project.category === selectedCategory;
      const matchesRating = project.rating >= minRating;
      
      return matchesSearch && matchesCategory && matchesRating;
    });

    // Sort projects
    if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [allProjects, debouncedSearch, selectedCategory, minRating, sortBy]);

  const featuredProjects = useMemo(() => {
    return filteredProjects.filter(p => p.featured).slice(0, 3);
  }, [filteredProjects]);

  const totalReviews = allProjects.reduce((sum, p) => sum + p.reviewCount, 0);
  const avgRating = allProjects.reduce((sum, p) => sum + p.rating, 0) / allProjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-black dark:via-gray-950/30 dark:to-black">
      <ModernNav />

      {/* Advanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Stats Banner */}
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-bold text-black dark:text-white">{allProjects.length}</span> verified projects
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-bold text-black dark:text-white">{totalReviews.toLocaleString()}</span> community reviews
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-bold text-black dark:text-white">{avgRating.toFixed(1)}</span> average rating
              </span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-black dark:text-white">Discover the best Web3 projects</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-black dark:text-white mb-6 tracking-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Trusted Project
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore community-reviewed Web3 wallets, exchanges, and crypto cards. 
              Make informed decisions with real user experiences.
            </p>
          </div>

          {/* Advanced Search Section */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-4 py-7 text-lg bg-gray-50 dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary rounded-2xl"
                  data-testid="input-search-projects"
                />
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters:</span>
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? null : val)}>
                  <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800" data-testid="select-category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Wallets">Wallets</SelectItem>
                    <SelectItem value="Exchanges">Exchanges</SelectItem>
                    <SelectItem value="Cards">Cards</SelectItem>
                  </SelectContent>
                </Select>

                {/* Rating Filter */}
                <Select value={minRating.toString()} onValueChange={(val) => setMinRating(parseFloat(val))}>
                  <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800" data-testid="select-rating">
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.8">4.8+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-10 w-10"
                    data-testid="view-grid"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-10 w-10"
                    data-testid="view-list"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || minRating > 0) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-2">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500" data-testid="button-clear-category-filter">×</button>
                    </Badge>
                  )}
                  {minRating > 0 && (
                    <Badge variant="secondary" className="gap-2">
                      {minRating}+ stars
                      <button onClick={() => setMinRating(0)} className="hover:text-red-500" data-testid="button-clear-rating-filter">×</button>
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedCategory(null);
                      setMinRating(0);
                    }}
                    className="ml-auto text-xs"
                    data-testid="button-clear-all-filters"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:scale-105 hover:shadow-lg'
                }`}
                data-testid={`pill-${category.name.toLowerCase()}`}
              >
                <category.icon className={`w-4 h-4 ${selectedCategory === category.name ? 'text-white' : ''}`} />
                <span>{category.name}</span>
                <Badge 
                  variant={selectedCategory === category.name ? "secondary" : "outline"}
                  className={`text-xs ${selectedCategory === category.name ? 'bg-white/20 text-white border-white/30' : ''}`}
                >
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && !selectedCategory && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white">Featured Projects</h2>
              <p className="text-gray-600 dark:text-gray-400">Handpicked by our community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard key={project.id} project={project} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Main Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
              {selectedCategory ? `${selectedCategory} Projects` : 'All Projects'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </p>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setMinRating(0);
              }}
              data-testid="button-clear-filters-empty"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProjects.map((project) => (
              viewMode === "grid" ? (
                <ProjectCard key={project.id} project={project} />
              ) : (
                <ProjectListItem key={project.id} project={project} />
              )
            ))}
          </div>
        )}
      </div>

      {/* Business CTA Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black dark:from-white dark:via-gray-50 dark:to-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white dark:text-black">For Businesses</span>
              </div>
              
              <h2 className="text-4xl font-bold text-white dark:text-black mb-4">
                Grow Your Web3 Project with Community Trust
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-600 mb-8">
                Join leading Web3 projects on DAO AI. Build reputation, gain visibility, and connect with your users.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300 dark:text-gray-600">Verified badge and enhanced profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300 dark:text-gray-600">Direct user feedback and insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300 dark:text-gray-600">Improved search visibility</span>
                </div>
              </div>

              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-bold px-10 py-6 text-lg rounded-full shadow-xl"
                data-testid="button-get-started"
              >
                <Link href="/for-business">Get Started Free</Link>
              </Button>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-black/20 rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white dark:text-black mb-1">12+</div>
                      <div className="text-sm text-gray-300 dark:text-gray-600">Projects</div>
                    </div>
                    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white dark:text-black mb-1">{totalReviews.toLocaleString()}</div>
                      <div className="text-sm text-gray-300 dark:text-gray-600">Reviews</div>
                    </div>
                    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white dark:text-black mb-1">{avgRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-300 dark:text-gray-600">Avg Rating</div>
                    </div>
                    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold text-white dark:text-black mb-1">100%</div>
                      <div className="text-sm text-gray-300 dark:text-gray-600">Verified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project, rank }: { project: typeof DUMMY_PROJECTS[0], rank: number }) {
  return (
    <Link href={`/projects/${project.id}`} data-testid={`link-featured-project-${project.id}`}>
      <Card className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full">
        {/* Rank Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">#{rank}</span>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <CardContent className="p-6 relative">
          <div className="flex flex-col items-center text-center pt-8">
            {/* Logo */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img 
                src={project.logo} 
                alt={project.name}
                className="relative w-24 h-24 rounded-2xl object-cover shadow-xl ring-4 ring-white dark:ring-gray-900 group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Name & Verified */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-xl text-black dark:text-white group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              {project.verified && (
                <Shield className="w-5 h-5 fill-primary text-primary" />
              )}
            </div>

            {/* Category */}
            <Badge variant="secondary" className="mb-4">
              {project.category}
            </Badge>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(project.rating) 
                        ? 'fill-primary text-primary' 
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-black dark:text-white">{project.rating}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({project.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
              {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {project.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectCard({ project }: { project: typeof DUMMY_PROJECTS[0] }) {
  return (
    <Link href={`/projects/${project.id}`} data-testid={`link-project-card-${project.id}`}>
      <Card className="group relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-blue-500/0 group-hover:from-primary/5 group-hover:to-blue-500/5 transition-all duration-300"></div>

        <CardContent className="p-6 relative">
          {/* Logo & Name */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img 
                src={project.logo} 
                alt={project.name}
                className="relative w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-black dark:text-white truncate group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                {project.verified && (
                  <Shield className="w-4 h-4 fill-primary text-primary flex-shrink-0" />
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {project.category}
              </Badge>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.floor(project.rating) 
                      ? 'fill-primary text-primary' 
                      : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-black dark:text-white">{project.rating}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({project.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 2).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectListItem({ project }: { project: typeof DUMMY_PROJECTS[0] }) {
  return (
    <Link href={`/projects/${project.id}`} data-testid={`link-project-list-${project.id}`}>
      <Card className="group border-2 border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img 
                src={project.logo} 
                alt={project.name}
                className="relative w-20 h-20 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-xl text-black dark:text-white group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                {project.verified && (
                  <Shield className="w-5 h-5 fill-primary text-primary" />
                )}
                <Badge variant="secondary">{project.category}</Badge>
                {project.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-blue-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                {project.description}
              </p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Rating & CTA */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(project.rating) 
                          ? 'fill-primary text-primary' 
                          : 'text-gray-300 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-lg text-black dark:text-white">{project.rating}</span>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.reviewCount.toLocaleString()} reviews
              </p>

              <Button 
                variant="outline" 
                size="sm"
                className="group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all"
              >
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
