
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Star, 
  Info,
  User,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";

const reviewSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  rating: z.number().min(1, "Please select a rating").max(5, "Rating cannot exceed 5 stars"),
  content: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review too long"),
  targetUserId: z.string().min(1, "Please select a user to review"),
  reviewedUserId: z.string().min(1, "User ID is required"),
  reviewedUsername: z.string().min(1, "Username is required"),
  category: z.string().default("general"),
  reviewType: z.enum(["positive", "negative", "neutral"]),
});

function ReviewPreview({ title, rating, content, selectedUser }: { 
  title: string;
  rating: number; 
  content: string; 
  selectedUser?: any;
}) {
  if (!rating && !content && !selectedUser && !title) return null;

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Preview</CardTitle>
        <p className="text-sm text-slate-600">This is how your review will appear</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Review Header */}
        {selectedUser && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedUser.profileImageUrl} />
                <AvatarFallback>
                  {(selectedUser.username || selectedUser.fullName || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2 text-lg font-medium text-slate-900">
                  <span className="text-blue-600 font-semibold">You</span>
                  <span>reviewed</span>
                  <span className="font-bold text-slate-900">
                    @{selectedUser.username || selectedUser.fullName}
                  </span>
                </div>
                {selectedUser.isUnclaimedProfile && (
                  <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    Unclaimed Profile
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {title && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Title:</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {title}
              </h3>
            </div>
          </div>
        )}

        {rating > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Rating:</h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-slate-700 font-medium">{rating}/5 stars</span>
            </div>
          </div>
        )}

        {content && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Your Review:</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 whitespace-pre-line break-words leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            This review will appear on {selectedUser?.username || selectedUser?.fullName || 'the user'}'s profile
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreateReview() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      rating: 0,
      content: "",
      targetUserId: "",
      reviewedUserId: "",
      reviewedUsername: "",
      category: "general",
      reviewType: "positive",
    },
  });

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Search response:", data);
      const results = Array.isArray(data) ? data.filter((result: any) => result.id !== (user as any)?.id) : [];
      console.log("Filtered results:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const createReviewMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof reviewSchema>) => {
      const response = await apiRequest("POST", "/api/reviews", formData);
      return await response.json();
    },
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      const credaEarned = responseData.credaEarned || 200;
      
      toast({
        title: "Review posted successfully!",
        description: `You earned ${credaEarned} Points for your review.`,
      });
      
      navigate("/home");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error posting review",
        description: error?.message || "Failed to post review",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    if (!isAuthenticated || !user?.hasInviteAccess) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in with an active invite to post reviews.",
      });
      return;
    }

    if (!data.targetUserId) {
      toast({
        variant: "destructive",
        title: "User Required",
        description: "Please select a user to review.",
      });
      return;
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please provide a rating between 1 and 5 stars.",
      });
      return;
    }

    createReviewMutation.mutate(data);
  };

  // Only show loading if we're actually loading and don't have user data yet
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // After loading is complete, check authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Sign in to create a review
              </h2>
              <p className="text-slate-600 mb-6">
                You need to be signed in to post reviews
              </p>
              <Link href="/onboarding">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user?.hasInviteAccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Invite access required
              </h2>
              <p className="text-slate-600 mb-6">
                You need an active invite to post reviews
              </p>
              <Link href="/home">
                <Button variant="outline" className="border-slate-300 text-slate-700">
                  Back to Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const watchedValues = form.watch();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/home">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create a Review
          </h1>
          <p className="text-slate-600">
            Share your experience with Web3 projects and help the community make informed decisions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">Your Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Review Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 'Best crypto card for daily spending' or 'Great wallet with easy interface'"
                            className="bg-slate-50 border-slate-200 focus:bg-white"
                          />
                        </FormControl>
                        <p className="text-xs text-slate-500">
                          Give your review a clear, descriptive title
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* User Selection */}
                  <FormField
                    control={form.control}
                    name="targetUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>User to Review</span>
                        </FormLabel>
                        <div className="space-y-3">
                          {selectedUser ? (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={selectedUser.profileImageUrl} />
                                  <AvatarFallback>
                                    {(selectedUser.username || selectedUser.fullName || 'U').charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    @{selectedUser.username || selectedUser.fullName}
                                  </p>
                                  {selectedUser.isUnclaimedProfile && (
                                    <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                      Unclaimed Profile
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(null);
                                  setSearchQuery("");
                                  form.setValue("targetUserId", "");
                                  form.setValue("reviewedUserId", "");
                                  form.setValue("reviewedUsername", "");
                                }}
                                className="text-slate-600 hover:text-slate-900"
                              >
                                Change
                              </Button>
                            </div>
                          ) : (
                            <div className="relative">
                              <FormControl>
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <Input
                                    placeholder="Search for a user to review..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-slate-50 border-slate-200 focus:bg-white pl-10 h-12"
                                  />
                                </div>
                              </FormControl>
                              
                              {/* Search Results Dropdown */}
                              {(searchResults.length > 0 || isSearching) && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {isSearching ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  ) : (
                                    searchResults.map((result) => (
                                      <button
                                        key={result.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedUser(result);
                                          form.setValue("targetUserId", result.id);
                                          form.setValue("reviewedUserId", result.id);
                                          form.setValue("reviewedUsername", result.username || result.fullName || '');
                                          setSearchResults([]);
                                          setSearchQuery("");
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                                      >
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage src={result.profileImageUrl} />
                                          <AvatarFallback>
                                            {(result.username || result.fullName || 'U').charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-slate-900">
                                            @{result.username || result.fullName}
                                          </p>
                                          {result.isUnclaimedProfile && (
                                            <span className="text-xs text-amber-600">Unclaimed Profile</span>
                                          )}
                                        </div>
                                      </button>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Search and select the user you want to review
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Rating */}
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Rating
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  field.onChange(star);
                                  const reviewType = star >= 4 ? "positive" : star <= 2 ? "negative" : "neutral";
                                  form.setValue("reviewType", reviewType);
                                }}
                                className="focus:outline-none"
                              >
                                <Star 
                                  className={`w-8 h-8 transition-colors ${
                                    star <= field.value 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-gray-300 hover:text-yellow-400'
                                  }`}
                                />
                              </button>
                            ))}
                            {field.value > 0 && (
                              <span className="text-slate-600 ml-2">{field.value}/5 stars</span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Your Review
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your experience with this project. What did you like or dislike? How was the user experience, features, and overall quality?"
                            rows={6}
                            className="bg-slate-50 border-slate-200 focus:bg-white resize-none"
                            onChange={(e) => {
                              field.onChange(e);
                              setCharCount(e.target.value.length);
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center mt-1">
                          <FormMessage />
                          <span className="text-sm text-slate-500">
                            {charCount}/1000
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={createReviewMutation.isPending}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 h-12"
                  >
                    {createReviewMutation.isPending ? "Posting..." : "Post Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="space-y-6">
            <ReviewPreview
              title={watchedValues.title}
              rating={watchedValues.rating}
              content={watchedValues.content}
              selectedUser={selectedUser}
            />

            {/* Tips */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Tips for effective reviews
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Be honest and constructive in your feedback</li>
                      <li>• Focus on specific contributions and behaviors</li>
                      <li>• Explain the impact of their work on the community</li>
                      <li>• Stay professional and respectful</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>

    </div>
  );
}
