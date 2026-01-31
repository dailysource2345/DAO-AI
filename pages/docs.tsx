import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, HelpCircle, FileText, DollarSign } from "lucide-react";
import { Link } from "wouter";

export default function DocsHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group interactive-logo">
              <div className="relative logo-glow">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 shimmer overflow-hidden">
                  <img 
                    src="/logo-spiral.svg" 
                    alt="DAO AI Logo" 
                    className="w-6 h-6 text-white relative z-10 spiral-logo"
                    style={{ filter: 'invert(1) brightness(2)' }}
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200 tracking-tight">
                  DAO AI
                </span>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a 
                href="/home" 
                className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Home
              </a>
              <div className="h-5 w-px bg-slate-300"></div>
              <a 
                href="https://medium.com/@DAOAIofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://medium.com/@DAOAIofficial', '_blank', 'noopener,noreferrer');
                }}
                className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Blog
              </a>
              <div className="h-5 w-px bg-slate-300"></div>
              <a 
                href="/docs" 
                className="text-blue-600 font-semibold transition-colors duration-200"
              >
                Docs
              </a>
            </div>
            
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <Link href="/home">
                Launch App <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Documentation Hub
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about DAO AI and our ecosystem all in one place.
          </p>
        </div>

        {/* Documentation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FAQ Card - Clickable */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer bg-white">
            <Link href="/docs/faq" className="block h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Quick answers to your top questions about DAO AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 font-medium">Find it here</p>
              </CardContent>
            </Link>
          </Card>

          {/* DAO AI Litepaper Card - Coming Soon */}
          <Card className="group transition-all duration-300 border-2 bg-gray-50 cursor-not-allowed opacity-75">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-gray-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-600">
                DAO AI Litepaper
              </CardTitle>
              <CardDescription className="text-gray-500">
                A technical overview & overall vision of our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 font-medium italic">Coming soon</p>
            </CardContent>
          </Card>

          {/* DAO AI Tokenomics Card - Coming Soon */}
          <Card className="group transition-all duration-300 border-2 bg-gray-50 cursor-not-allowed opacity-75">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-gray-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-600">
                DAO AI Tokenomics
              </CardTitle>
              <CardDescription className="text-gray-500">
                Architecture, incentives & security of our token system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 font-medium italic">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Join our community or reach out to our team for personalized support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <a 
                  href="https://discord.com/invite/wpduY9QQ6F" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Join Discord <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button 
                variant="outline"
                asChild
                className="border-2 border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-600 px-6 py-2.5 rounded-full transition-all duration-200 font-semibold"
              >
                <a 
                  href="https://medium.com/@DAOAIofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Read Our Blog
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}