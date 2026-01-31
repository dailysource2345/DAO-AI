import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Users, Eye, TrendingUp, ArrowRight, Lock, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SpaceAccessGate } from "@/components/space-access-gate";

export default function Spaces() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SpaceAccessGate>
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Lime Black White Theme */}
        <div className="relative mb-12 overflow-hidden py-16">
          {/* Decorative Shapes - Lime Accents */}
          <div className="absolute top-0 left-0 w-96 h-96 -translate-x-24 -translate-y-24">
            <div className="w-full h-full rounded-full bg-lime-400/10 blur-3xl"></div>
          </div>
          <div className="absolute top-10 right-0 w-72 h-72 translate-x-20 -translate-y-10">
            <div className="w-full h-full rounded-full bg-lime-500/10 blur-3xl"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-80 h-80 translate-x-32 translate-y-32">
            <div className="w-full h-full rounded-full bg-lime-400/10 blur-3xl"></div>
          </div>

          {/* Main Content */}
          <div className="relative max-w-3xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
              Find a space you can <span className="text-lime-500">trust</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover, explore, and engage with DAOs
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search space or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-6 pr-14 text-base rounded-full border border-gray-200 dark:border-gray-700 focus:border-lime-400 dark:focus:border-lime-600 focus:ring-2 focus:ring-lime-200 dark:focus:ring-lime-900/50 shadow-sm transition-all bg-white dark:bg-black"
                  data-testid="input-search-spaces"
                />
                <Button 
                  className="absolute right-2 h-8 w-8 rounded-full bg-lime-500 hover:bg-lime-600 hover:shadow-lg p-0 flex items-center justify-center transition-all"
                  data-testid="button-search"
                >
                  <Search className="w-4 h-4 text-black" />
                </Button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Just joined a new space?{" "}
              <Link href="/review-form">
                <span className="text-lime-600 dark:text-lime-400 font-medium cursor-pointer hover:opacity-80 transition-opacity">
                  Write a review →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* All Spaces Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8">Pre-TGE & Active Spaces</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Space - Abstract (Jaine) */}
            <Link href="/spaces/jaine">
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/60 dark:border-gray-800/60 hover:border-lime-300/40 dark:hover:border-lime-700/40 relative overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                {/* Modern Top Bar Indicator - Lime */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-lime-500"></div>
                
                {/* Top Space Badge - Lime */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-lime-500 text-black font-bold text-xs px-3 py-1 shadow-md border-0">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    TOP SPACE
                  </Badge>
                </div>
                
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3 overflow-hidden relative">
                        <img
                          src="https://pbs.twimg.com/profile_images/1940378940960284672/2zshWNfT_400x400.jpg"
                          alt="Abstract Logo"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full border border-white shadow-sm"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                          Jaine
                        </h3>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Infrastructure</Badge>
                      </div>
                    </div>
                    
                    
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    JAINE is an AI native liquidity engine on 0G, an AI operating system; characterised as an "Intelligent AMM"...
                  </p>

                  {/* Reward Pool Section - Lime Theme */}
                  <div className="mb-4 p-3 bg-lime-500/5 border border-lime-200/40 dark:border-lime-700/40 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reward Pool</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-bold text-lime-600 dark:text-lime-400">100,000 XP</div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">Active</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mb-3">Emerging projects</div>

                  <div className="flex items-center justify-between">
                    {/* Simple User Profiles with Floating Animation */}
                    <div className="flex items-center -space-x-3">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden hover:z-20 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                          alt="User 1" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center text-white text-xs font-bold">
                          U1
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden hover:z-20 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face" 
                          alt="User 2" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 items-center justify-center text-white text-xs font-bold">
                          U2
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden hover:z-20 relative">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" 
                          alt="User 3" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              (target.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gradient-to-br from-pink-400 to-red-500 items-center justify-center text-white text-xs font-bold">
                          U3
                        </div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center text-white text-sm font-medium hover:z-20">
                        +12
                      </div>
                    </div>
                    
                    {/* Bullish Indicator Badge - Lime */}
                    <div className="relative bg-lime-500 rounded-xl px-3 py-1.5 shadow-md">
                      <div className="flex items-center space-x-1.5">
                        <TrendingUp className="w-3 h-3 text-black" />
                        <div className="text-black font-semibold">
                          <span className="text-sm font-bold">93%</span>
                          <span className="text-[10px] font-medium opacity-95 ml-1">BULLISH</span>
                        </div>
                      </div>
                      
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-lime-500 rounded-xl blur-sm opacity-30 -z-10"></div>
                    </div>
                  </div>
                </CardContent>
                
                
              </Card>
            </Link>

            {/* Coming Soon Space 1 - MegaETH */}
            <div className="relative">
              <Card className="opacity-60 cursor-not-allowed border-2 border-dashed border-slate-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                      <div className="w-5 h-5 text-slate-400">Ξ</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-600">MegaETH</h3>
                      <Badge className="bg-slate-100 text-slate-500 text-xs">Infrastructure</Badge>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    MegaETH is real-time Ethereum, streaming transactions at lightning speed. Sub-millisecond...
                  </p>

                  <div className="text-xs text-slate-400 mb-3">Emerging projects</div>

                  <div className="flex items-center justify-between">
                    {/* Simple User Profiles with Floating Animation */}
                    <div className="flex items-center -space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        M1
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        M2
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        M3
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-sm font-medium">
                        +8
                      </div>
                    </div>
                    
                    {/* Orange Bullish Triangle Indicator - Bottom Right */}
                    <div className="absolute bottom-0 right-0 overflow-hidden rounded-br-lg opacity-60">
                      <div className="relative w-20 h-20">
                        {/* Diagonal triangle background */}
                        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-orange-500 via-orange-400 to-amber-400 transform rotate-45 origin-bottom-right translate-x-7 translate-y-7 shadow-lg"></div>
                        
                        {/* Content container */}
                        <div className="absolute bottom-2 right-2 text-white text-xs font-bold flex flex-col items-center leading-tight">
                          <div className="flex items-center mb-0.5">
                            <TrendingUp className="w-3 h-3 mr-0.5" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] font-extrabold">84%</div>
                            <div className="text-[8px] opacity-90 font-medium -mt-0.5">BULL</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">Coming Soon</div>
                  <div className="text-sm text-slate-500">Space in development</div>
                </div>
              </div>
            </div>

            {/* Coming Soon Space 2 - time.fun */}
            <div className="relative">
              <Card className="opacity-60 cursor-not-allowed border-2 border-dashed border-slate-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                      <div className="w-5 h-5 text-slate-400 font-bold">0G</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-600">time.fun</h3>
                      <Badge className="bg-slate-100 text-slate-500 text-xs">DeFi</Badge>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    What's your time worth? Live on @Solana - serpinaks, SanjayWeb3, JPEG_Yakuza, and 1527 others are...
                  </p>

                  <div className="text-xs text-slate-400 mb-3">Emerging projects</div>

                  <div className="flex items-center justify-between">
                    {/* Simple User Profiles with Floating Animation */}
                    <div className="flex items-center -space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        T1
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        T2
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-xs font-bold">
                        T3
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white shadow-sm hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:z-10 flex items-center justify-center text-white text-sm font-medium">
                        +5
                      </div>
                    </div>
                    
                    {/* Yellow-Green Bullish Triangle Indicator - Bottom Right */}
                    <div className="absolute bottom-0 right-0 overflow-hidden rounded-br-lg opacity-60">
                      <div className="relative w-20 h-20">
                        {/* Diagonal triangle background */}
                        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-yellow-500 via-lime-400 to-green-400 transform rotate-45 origin-bottom-right translate-x-7 translate-y-7 shadow-lg"></div>
                        
                        {/* Content container */}
                        <div className="absolute bottom-2 right-2 text-white text-xs font-bold flex flex-col items-center leading-tight">
                          <div className="flex items-center mb-0.5">
                            <TrendingUp className="w-3 h-3 mr-0.5" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] font-extrabold">77%</div>
                            <div className="text-[8px] opacity-90 font-medium -mt-0.5">BULL</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">Coming Soon</div>
                  <div className="text-sm text-slate-500">Space in development</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </SpaceAccessGate>
  );
}