import { useState } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Shield } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/Black and White Circle Global Tech Logo (1)_1762504013838.png";

export default function BusinessReviewForm() {
  const { inviteCode } = useParams();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    content: "",
    reviewerName: "",
    reviewerEmail: ""
  });

  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['/api/business/invite', inviteCode],
    enabled: !!inviteCode
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/business/reviews", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your review has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  });

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content || formData.content.length < 10) {
      toast({
        title: "Review required",
        description: "Please write at least 10 characters for your review",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      inviteCode,
      ...formData
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-950 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              Thank you!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your blockchain-verified review has been submitted for {businessProfile?.companyName}.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-black font-bold" data-testid="button-home">
                Return to DAO AI
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-950">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <div className="text-2xl font-bold text-black dark:text-white cursor-pointer">
              DAO AI
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Blockchain Verified</span>
            </div>
            <CardTitle className="text-2xl text-black dark:text-white">
              Review {businessProfile?.companyName}
            </CardTitle>
            <CardDescription>
              Share your experience and help others make informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-black dark:text-white mb-2 block">Rating *</Label>
                <div className="flex items-center space-x-2" data-testid="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                      data-testid={`star-${star}`}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= formData.rating
                            ? 'fill-primary text-primary'
                            : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title" className="text-black dark:text-white">
                  Review Title (Optional)
                </Label>
                <Input
                  id="title"
                  placeholder="Sum up your experience..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2"
                  data-testid="input-title"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-black dark:text-white">
                  Your Review *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Tell us about your experience..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-2 min-h-[120px]"
                  data-testid="textarea-content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-black dark:text-white">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.reviewerName}
                    onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                    className="mt-2"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-black dark:text-white">
                    Your Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.reviewerEmail}
                    onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                    className="mt-2"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                disabled={submitReviewMutation.isPending}
                data-testid="button-submit-review"
              >
                {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>

            {/* Powered by DAO AI Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-600">
              <span className="text-sm">Powered by</span>
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <img 
                    src={logoImage} 
                    alt="DAO AI Logo" 
                    className="w-6 h-6 group-hover:scale-105 transition-transform"
                  />
                  <span className="font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                    DAO AI
                  </span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
