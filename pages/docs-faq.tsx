import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 sm:py-6 text-left hover:bg-slate-50/50 transition-colors duration-200 flex items-center justify-between"
      >
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg pr-4">{question}</h3>
        <div className="flex-shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-slate-500" />
          ) : (
            <Plus className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-4 sm:pb-6">
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function DocsFAQ() {
  const faqData = [
    {
      question: "What is Governance Reputation?",
      answer: "Governance Reputation is a score that measures the quality and impact of your participation in DAO governance. It's not about how often you vote, but how thoughtfully you engage. Using AI, we analyze proposals, comments, and discussions to reward meaningful contributions that help DAOs thrive."
    },
    {
      question: "Why does building Governance Reputation matter?",
      answer: "In DAOs, it's hard to know who to trust during key discussions. Anyone can join, but not everyone adds value. Governance Reputation provides a visible track record of contributors who consistently make thoughtful, impactful decisions—helping cut through noise, reduce manipulation, and build real-time trust."
    },
    {
      question: "How Governance Stances Work",
      answer: "In DAO AI, stances are positions you take on people's views—either championing or challenging them. This allows users to actively participate by voting and adding their own perspectives, fostering open dialogue around governance issues. By focusing on individual views, the platform builds true individual reputation based on community consensus, uplifting the most respected voices and holding people accountable in a transparent and meaningful way."
    },
    {
      question: "Why do DAO governance systems need reputation?",
      answer: "DAO decisions today often involve millions or even billions of dollars—and as crypto grows, that number could reach trillions. Yet most DAOs rely on token-weighted voting, which favors whales and ignores quality input. Reputation systems surface the best voices—those who add real value—making governance fairer, more efficient, and better aligned for long-term success."
    },
    {
      question: "Who is DAO AI for?",
      answer: "DAO AI is for everyone involved in DAOs—contributors, delegates, voters, and protocol teams. Whether you're a seasoned core member or just starting out, you can build your reputation from the ground up and have your quality input recognized and rewarded beyond just token holdings."
    }
  ];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-slate-600 hover:text-blue-600">
            <Link href="/docs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation Hub
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Quick answers to your top questions about DAO AI.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {faqData.map((faq, index) => (
              <div key={index} className="px-6 sm:px-8">
                <FAQItem question={faq.question} answer={faq.answer} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join our community to get help from other users and our team members.
            </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}