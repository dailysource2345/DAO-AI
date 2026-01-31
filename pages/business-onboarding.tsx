import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Mail, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Star,
  Users
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BusinessOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    email: "",
    description: "",
    logo: "",
    selectedPlan: "free"
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/business/onboard", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your business profile has been created successfully.",
      });
      setLocation("/business-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create business profile",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (step === 3) {
      createProfileMutation.mutate({
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        email: formData.email,
        description: formData.description,
        plan: formData.selectedPlan
      });
      setStep(step + 1);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLocation("/business-dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <div className="text-2xl font-bold text-black dark:text-white cursor-pointer">
              DAO AI
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Company Information */}
        {step === 1 && (
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Let's get started
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Tell us about your business
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName" className="text-black dark:text-white">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-2"
                    data-testid="input-company-name"
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="text-black dark:text-white">
                    Industry *
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, E-commerce, SaaS"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="mt-2"
                    data-testid="input-industry"
                  />
                </div>

                <div>
                  <Label htmlFor="website" className="text-black dark:text-white">
                    Website URL *
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-2"
                    data-testid="input-website"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-black dark:text-white">
                    Business Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-black font-bold"
                  data-testid="button-next-step-1"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Business Description */}
        {step === 2 && (
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Tell your story
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Help customers understand what makes your business unique
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="description" className="text-black dark:text-white">
                    Company Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your business does, your mission, and what sets you apart..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 min-h-[150px]"
                    data-testid="input-description"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This will be displayed on your public review page
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  data-testid="button-back-step-2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-black font-bold"
                  data-testid="button-next-step-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Choose Your Plan */}
        {step === 3 && (
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Choose your plan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Start free, upgrade anytime
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card 
                  className={`border-2 ${formData.selectedPlan === 'free' ? 'border-primary ring-4 ring-primary/20' : 'border-gray-300 dark:border-gray-700'} hover:border-primary/50 transition-all cursor-pointer`}
                  onClick={() => setFormData({ ...formData, selectedPlan: 'free' })}
                  data-testid="card-plan-free"
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Free</h3>
                      <div className="text-4xl font-bold text-black dark:text-white mb-1">$0</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Forever free</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Up to 100 reviews</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Basic analytics</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Review widget</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Blockchain verification</span>
                      </li>
                    </ul>
                    <Button 
                      className={`w-full border-2 ${formData.selectedPlan === 'free' ? 'bg-primary text-black' : 'border-primary bg-transparent text-primary hover:bg-primary/10'} font-bold`}
                      data-testid="button-select-free"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, selectedPlan: 'free' });
                      }}
                    >
                      {formData.selectedPlan === 'free' ? 'Selected' : 'Start Free'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card 
                  className={`border-2 ${formData.selectedPlan === 'pro' ? 'border-primary ring-4 ring-primary/20' : 'border-primary'} shadow-lg relative cursor-pointer transition-all`}
                  onClick={() => setFormData({ ...formData, selectedPlan: 'pro' })}
                  data-testid="card-plan-pro"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full">
                    <span className="text-xs font-bold text-black">RECOMMENDED</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Pro</h3>
                      <div className="text-4xl font-bold text-black dark:text-white mb-1">$99</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">per month</p>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Unlimited reviews</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Advanced analytics</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">FUD Shield deployment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Custom branding</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Priority support</span>
                      </li>
                    </ul>
                    <Button 
                      className={`w-full ${formData.selectedPlan === 'pro' ? 'bg-primary text-black' : 'bg-primary hover:bg-primary/90 text-black'} font-bold`}
                      data-testid="button-select-pro"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, selectedPlan: 'pro' });
                      }}
                    >
                      {formData.selectedPlan === 'pro' ? 'Selected' : 'Start Pro Trial'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  data-testid="button-back-step-3"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-black font-bold"
                  data-testid="button-next-step-3"
                >
                  Continue with {formData.selectedPlan === 'free' ? 'Free' : 'Pro'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Setup Complete */}
        {step === 4 && (
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-3xl font-bold text-black dark:text-white mb-3">
                  You're all set!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Your business account is ready. Let's start collecting verified reviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-black dark:text-white mb-2">Verified Reviews</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All reviews are blockchain-verified
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-black dark:text-white mb-2">Request Reviews</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invite customers to leave feedback
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-black dark:text-white mb-2">Build Trust</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showcase social proof everywhere
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-black font-bold px-12"
                  data-testid="button-go-to-dashboard"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
