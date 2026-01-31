import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Award, 
  Shield, 
  Star, 
  TrendingUp, 
  Users, 
  BarChart3,
  MessageSquare,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import logoImage from "@assets/Black and White Circle Global Tech Logo (1)_1762504013838.png";

export default function ForBusiness() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="DAO AI Logo" 
                  className="w-12 h-12"
                />
                <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
                  DAO AI
                </span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/for-business">
                <Button 
                  variant="ghost"
                  className="text-black dark:text-white font-medium hover:text-primary dark:hover:text-primary"
                  data-testid="button-nav-business"
                >
                  For Businesses
                </Button>
              </Link>
              
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 rounded-full"
                data-testid="button-nav-launch"
              >
                <Link href="/home">
                  Launch App
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="text-left lg:pt-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                The world's most trusted on-chain review platform
              </h1>
              <p className="text-xl sm:text-2xl text-black/80 mb-10 leading-relaxed">
                Attract and keep customers with DAO AI's blockchain-verified review platform and powerful reputation tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-black hover:bg-black/90 text-white font-bold px-10 py-7 text-lg rounded-full shadow-xl"
                  data-testid="button-book-demo"
                >
                  <Link href="/business-onboarding">
                    Book a Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black hover:text-white font-bold px-10 py-7 text-lg rounded-full"
                  data-testid="button-start-free"
                >
                  <Link href="/business-onboarding">
                    Start for Free
                  </Link>
                </Button>
              </div>
            </div>

            {/* Visual Elements Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-6">
                {/* Business Platform Teaser */}
                <Card className="border-2 border-black/20 shadow-lg bg-white/90 backdrop-blur">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-xs font-bold text-black">Business Dashboard</div>
                      </div>
                      <div className="text-xs text-gray-600">Live</div>
                    </div>
                    
                    {/* Mini Dashboard Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                        <span className="text-xs font-semibold text-black">Reviews</span>
                        <span className="text-sm font-bold text-primary">2,847</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-black/5 rounded">
                        <span className="text-xs font-semibold text-black">Avg Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-sm font-bold text-black">4.8</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 h-12 bg-primary/20 rounded flex items-end p-1">
                          <div className="w-full bg-primary rounded" style={{ height: '60%' }}></div>
                        </div>
                        <div className="flex-1 h-12 bg-primary/20 rounded flex items-end p-1">
                          <div className="w-full bg-primary rounded" style={{ height: '85%' }}></div>
                        </div>
                        <div className="flex-1 h-12 bg-primary/20 rounded flex items-end p-1">
                          <div className="w-full bg-primary rounded" style={{ height: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Review Example */}
                <Card className="border-2 border-black/20 shadow-lg bg-white/90 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-black">SM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-bold text-black">Sarah M.</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">
                          "Excellent service! The team was professional and delivered beyond expectations."
                        </p>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-3 h-3 text-primary" />
                          <span className="text-xs text-primary font-semibold">Verified On-Chain</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 lg:space-y-6 pt-8">
                {/* TrustScore Card */}
                <Card className="border-2 border-black/20 shadow-xl bg-white/95 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <img src={logoImage} alt="DAO AI" className="w-10 h-10" />
                      <span className="text-2xl font-bold text-black">DAO AI</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 fill-black text-black" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center mb-2">
                      <div className="text-3xl font-bold text-black mb-1">
                        TrustScore <span className="text-primary">4.8</span>
                      </div>
                      <div className="text-gray-600 text-sm">2,847 reviews</div>
                    </div>
                    
                    <div className="mt-4 p-3 border-2 border-gray-200 rounded-xl text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-black">Verified On-Chain</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FUD Shield Element */}
                <Card className="border-2 border-primary/30 shadow-lg bg-gradient-to-br from-black to-gray-900">
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">FUD Shield</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">
                      Deploy verified testimonials when it matters most
                    </p>
                    <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                      <span className="text-xs text-white font-semibold">Ready to Deploy</span>
                      <div className="px-2 py-1 bg-primary rounded">
                        <span className="text-xs font-bold text-black">2,847</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500K+</div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Reviews Verified On-Chain</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Active Businesses</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Tamper-Proof Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-2xl border-2 border-gray-100 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                      <Star className="w-16 h-16 text-primary fill-primary" />
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                      <BarChart3 className="w-16 h-16 text-primary" />
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-center">
                      <MessageSquare className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-6">
                Go further with DAO AI solutions
              </h2>
              <ul className="space-y-5 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      Build a more accurate representation of your business by{" "}
                      <span className="font-bold text-black dark:text-white">inviting all your customers</span>{" "}
                      to review your business.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      Let them know you're listening by{" "}
                      <span className="font-bold text-black dark:text-white">engaging with feedback</span>.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      Use customer testimonials as social proof to help{" "}
                      <span className="font-bold text-black dark:text-white">accelerate conversions</span>{" "}
                      at every stage of the purchasing journey.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      Inform your strategy with{" "}
                      <span className="font-bold text-black dark:text-white">insights and data</span>{" "}
                      to navigate to success.
                    </span>
                  </div>
                </li>
              </ul>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Want to learn more?
              </div>
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-6 text-lg rounded-full"
                data-testid="button-book-demo-bottom"
              >
                <Link href="/business-onboarding">
                  Book a Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* White Label Widget Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-black dark:bg-white px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-bold text-white dark:text-black uppercase tracking-wide">White Label</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-6">
                Seamlessly integrate reviews into your platform
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Embed DAO AI's blockchain-verified reviews directly on your website with our customizable white label widget. Collect and display authentic customer feedback without ever leaving your brand experience.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">Display Reviews Widget</h3>
                    <p className="text-gray-600 dark:text-gray-400">Showcase your verified reviews with a customizable widget that matches your brand perfectly. Full control over colors, fonts, and layout.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">Collection Forms</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gather customer feedback with white label forms that blend seamlessly into your platform. Every review is verified on-chain automatically.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">Blockchain Verified</h3>
                    <p className="text-gray-600 dark:text-gray-400">All reviews collected through your forms are automatically verified on-chain, ensuring authenticity and building trust with your customers.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                asChild
                size="lg"
                className="bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black font-bold px-8 py-6 text-lg rounded-full"
                data-testid="button-widget-demo"
              >
                <Link href="/business-onboarding">
                  Get Your Widget
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Visual Preview */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border-2 border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-800">
                  <div className="text-xl font-bold text-black dark:text-white">Customer Reviews</div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="text-lg font-bold text-black dark:text-white">4.8</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-black dark:text-white">U{i}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-bold text-black dark:text-white">Customer {i}</div>
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              Great experience! Highly recommended.
                            </p>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary font-semibold">Verified</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Powered by</span>
                    <img src={logoImage} alt="DAO AI" className="w-5 h-5" />
                    <span className="text-sm font-bold text-black dark:text-white">DAO AI</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-primary px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold text-black">White Label</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUD Shield Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 bg-primary/20 dark:bg-primary/30 px-6 py-3 rounded-full mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">FUD Shield</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white dark:text-black mb-6">
              Combat FUD with Verifiable Social Proof
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-600 max-w-3xl mx-auto">
              Deploy an arsenal of verified customer testimonials to counter fear, uncertainty, and doubt when it matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left side - Visual */}
            <div className="relative">
              <Card className="border-2 border-primary/30 shadow-2xl bg-white dark:bg-black">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-black dark:text-white">FUD Alert Detected</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Deploy verified testimonials</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/20 rounded-full">
                      <span className="text-xs font-bold text-primary">ACTIVE</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Verified Review 1 */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border-l-4 border-primary">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-black">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-bold text-black dark:text-white">John D.</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                            "Best decision I made. The platform delivers exactly what they promise."
                          </p>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary font-semibold">Verified On-Chain</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verified Review 2 */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border-l-4 border-primary">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-black">MK</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-bold text-black dark:text-white">Maria K.</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                            "Exceptional experience from start to finish. Highly recommend!"
                          </p>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3 text-primary" />
                            <span className="text-xs text-primary font-semibold">Verified On-Chain</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                        data-testid="button-deploy-shield"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Deploy Shield
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Content */}
            <div className="text-white dark:text-black space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Instant Credibility Deployment</h4>
                  <p className="text-gray-300 dark:text-gray-600 leading-relaxed">
                    When rumors spread or competitors attack, instantly showcase hundreds of verified, on-chain customer testimonials that prove people love your product.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Real Users, Real Voices</h4>
                  <p className="text-gray-300 dark:text-gray-600 leading-relaxed">
                    Every testimonial is cryptographically verified and linked to real blockchain addresses. No bots, no fake reviews, just authentic customer experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Unbreakable Trust</h4>
                  <p className="text-gray-300 dark:text-gray-600 leading-relaxed">
                    Because reviews are permanently stored on the blockchain, they can't be deleted, altered, or censored—even during your toughest moments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is DAO AI Section */}
      <section className="py-24 bg-black dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 bg-primary/20 px-6 py-3 rounded-full mb-6">
              <img src={logoImage} alt="DAO AI" className="w-5 h-5" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">What is DAO AI</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              The Web3 Review Platform Built for Trust
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              DAO AI combines blockchain technology with review systems to create tamper-proof customer testimonials that build unshakeable credibility for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary/30 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Blockchain-Verified Reviews</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Every review is cryptographically secured on the blockchain, making them permanent and impossible to alter or delete. Your customers' voices are preserved forever.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary/30 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">CREDA Token Rewards</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Incentivize authentic reviews with CREDA token rewards. Customers earn tokens for sharing their experiences, creating a win-win ecosystem where quality feedback is valued.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-primary/30 rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Build Lasting Credibility</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Your reputation becomes portable across platforms. Reviews on DAO AI can't be censored, giving you a permanent record of customer satisfaction that follows your brand everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - How It Works */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">How DAO AI Works</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-black">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Create Your Business Profile</h4>
                      <p className="text-gray-300 text-sm">
                        Set up your profile in minutes with your company info, branding, and review collection preferences. Customize how you want to collect feedback.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-black">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Send Review Invitations</h4>
                      <p className="text-gray-300 text-sm">
                        Share a simple link with customers via email, SMS, or QR code. They can leave reviews instantly without creating an account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-black">3</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Reviews Get Blockchain-Verified</h4>
                      <p className="text-gray-300 text-sm">
                        Each review is cryptographically signed and stored on the blockchain, ensuring authenticity and permanence. No one can manipulate or delete them.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-black">4</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Deploy Anywhere</h4>
                      <p className="text-gray-300 text-sm">
                        Display your verified reviews on your website, social media, marketing materials, or activate the FUD Shield when you need instant credibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-black">5</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Customers Earn CREDA Tokens</h4>
                      <p className="text-gray-300 text-sm">
                        Reviewers earn CREDA tokens as rewards, incentivizing quality feedback while building a community of engaged customers around your brand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-6 text-lg rounded-full"
                  data-testid="button-get-started-creda"
                >
                  <Link href="/business-onboarding">
                    Get Started with DAO AI
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
              Why businesses choose DAO AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Blockchain-verified reviews you can trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Tamper-Proof Trust
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Every review is cryptographically secured on the blockchain. Once published, reviews cannot be altered or deleted by anyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Boost Conversions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Display verified customer testimonials at every touchpoint to accelerate purchasing decisions and increase sales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Powerful Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Get actionable insights from customer feedback data to improve your products, services, and overall customer experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Build Credibility
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Combat FUD with verifiable proof of customer satisfaction. Your reputation becomes portable across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Engage Customers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Respond to reviews, show you're listening, and build stronger relationships with your customer base.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow bg-white dark:bg-black">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                  Invite All Customers
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Create a complete picture of your business by making it easy for every customer to share their experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black dark:bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white dark:text-black mb-6">
            Ready to transform your web3 Project
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-10">
            Join thousands of businesses building trust with blockchain-verified reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-black font-bold px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="button-cta-demo"
            >
              <Link href="/business-onboarding">
                Book a Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white font-bold px-10 py-6 text-lg rounded-full"
              data-testid="button-cta-free"
            >
              <Link href="/business-onboarding">
                Start for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src={logoImage} 
                  alt="DAO AI Logo" 
                  className="w-10 h-10"
                />
                <div>
                  <div className="text-xl font-bold text-black dark:text-white">DAO AI</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">Building trust on-chain</div>
                </div>
              </div>
            </Link>
            
            <div className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} DAO AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
