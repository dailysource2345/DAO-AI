import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Shield, 
  Flame, 
  Link as LinkIcon, 
  Users, 
  Info,
  ChevronDown,
  Search,
  User,
  Plus,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { UserBadge } from "@/components/ui/user-badge";
import { Navigation } from "@/components/navigation";

const stanceSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200, "Title too long"),
  content: z.string().min(50, "Content must be at least 50 characters").max(2000, "Content too long"),
  stance: z.enum(["champion", "challenge"]),
  daoId: z.number().min(1).optional(),
  proposalLink: z.string().url().optional().or(z.literal("")),
  targetUsername: z.string().min(1, "Please enter a target username").max(50, "Username too long"),
  targetUserId: z.string().optional(),
  spaceSlug: z.string().optional(),
});

const unclaimedProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100, "Name too long"),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  walletAddress: z.string().optional().or(z.literal("")),
});

function ModernNavigation() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/stances" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Feed</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <span className="text-slate-900 font-bold text-xl">DAO AI</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function StancePreview({ stance, title, content, targetUsername, selectedUser }: { 
  stance: string; 
  title: string; 
  content: string; 
  targetUsername: string;
  selectedUser?: any;
}) {
  if (!title && !content && !targetUsername) return null;

  const getTargetDisplayName = () => {
    if (selectedUser?.firstName && selectedUser?.lastName) {
      return `${selectedUser.firstName} ${selectedUser.lastName}`;
    }
    if (selectedUser?.username) {
      return selectedUser.username;
    }
    return targetUsername;
  };

  const displayName = getTargetDisplayName();

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Preview</CardTitle>
        <p className="text-sm text-slate-600">This is how your stance will appear in the feed</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {targetUsername && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-slate-900">
              <span className="text-blue-600 font-semibold">You</span>
              <span>took a</span>
              <Badge className={`${
                stance === 'champion' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {stance === 'champion' ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Champion
                  </>
                ) : (
                  <>
                    <Flame className="w-3 h-3 mr-1" />
                    Challenge
                  </>
                )}
              </Badge>
              <span>stance on</span>
              <span className="font-bold text-slate-900">
                {displayName}
              </span>
            </div>

            <div className="mt-3 flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-black text-white">
                  @{targetUsername}
                </Badge>
                {selectedUser?.isUnclaimedProfile && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                    Unclaimed Profile
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {title && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Stance Title:</h4>
            <h3 className="text-xl font-semibold text-slate-900 border-l-4 border-blue-500 pl-4">
              {title}
            </h3>
          </div>
        )}

        {content && (
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2">Your Argument:</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        )}

        {(title || content || targetUsername) && (
          <div className="border-t border-slate-200 pt-4 mt-4">
            <p className="text-xs text-slate-500 flex items-center space-x-2">
              <Info className="w-3 h-3" />
              <span>This stance will be live for 48 hours and visible to all platform users</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CreateStance() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserNotFound, setShowUserNotFound] = useState(false);
  const [showConfirmProfile, setShowConfirmProfile] = useState(false);
  const [newlyCreatedProfile, setNewlyCreatedProfile] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const { data: allProjects } = useQuery<any[]>({
    queryKey: ["/api/companies"],
  });

  const { data: stanceAvailability, refetch: refetchAvailability } = useQuery<any>({
    queryKey: ["/api/stance-slots/availability"],
    enabled: isAuthenticated && !!(user as any)?.hasInviteAccess,
    refetchInterval: 120000,
  });

  const form = useForm<z.infer<typeof stanceSchema>>({
    resolver: zodResolver(stanceSchema),
    defaultValues: {
      title: "",
      content: "",
      stance: "champion",
      daoId: undefined,
      proposalLink: "",
      targetUsername: "",
      targetUserId: undefined,
    },
  });

  const unclaimedForm = useForm<z.infer<typeof unclaimedProfileSchema>>({
    resolver: zodResolver(unclaimedProfileSchema),
    defaultValues: {
      fullName: "",
      twitterUrl: "",
      walletAddress: "",
    },
  });

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowUserNotFound(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await apiRequest("GET", `/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      const results = Array.isArray(data) ? data.filter((result: any) => result.id !== (user as any)?.id) : [];

      setSearchResults(results);
      setShowUserNotFound(results.length === 0 && query.length >= 2);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowUserNotFound(query.length >= 2);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers(searchQuery);
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowUserNotFound(false);
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (stanceAvailability?.slotsAreFull && stanceAvailability?.nextExpirationTime) {
      const updateTimer = () => {
        const expirationTime = new Date(stanceAvailability.nextExpirationTime);
        const now = new Date();
        const timeDiff = expirationTime.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          setTimeRemaining(Math.ceil(timeDiff / 1000));
        } else {
          setTimeRemaining(0);
          refetchAvailability();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [stanceAvailability, refetchAvailability]);

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "0m 0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  const createUnclaimedProfileMutation = useMutation({
    mutationFn: async (data: { twitterHandle: string; twitterUrl?: string; firstName?: string; lastName?: string }) => {
      const response = await apiRequest("POST", "/api/twitter/create-unclaimed", data);
      const profileData = await response.json();
      console.log("Create unclaimed profile response:", profileData);
      return profileData;
    },
    onSuccess: (response) => {
      console.log("Profile creation success:", response);
      setNewlyCreatedProfile(response);
      setShowCreateProfile(false);
      setShowConfirmProfile(true);
      setSearchQuery("");
      setSearchResults([]);
      setShowUserNotFound(false);
      unclaimedForm.reset();
    },
    onError: (error: any) => {
      console.error("Profile creation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create unclaimed profile",
      });
    },
  });

  const handleConfirmProfile = () => {
    if (newlyCreatedProfile) {
      console.log("Confirming profile:", newlyCreatedProfile);
      const username = newlyCreatedProfile.username || newlyCreatedProfile.twitterHandle;
      console.log("Setting username to:", username);

      setSelectedUser(newlyCreatedProfile);
      form.setValue("targetUserId", newlyCreatedProfile.id);
      form.setValue("targetUsername", username);
      setShowConfirmProfile(false);
      setNewlyCreatedProfile(null);
      toast({
        title: "Profile confirmed!",
        description: "You can now take a stance on this newly created profile.",
      });
    }
  };

  const createStanceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof stanceSchema>) => {
      const response = await apiRequest("POST", "/api/issues", {
        ...data,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      });
      console.log("API Response:", response);
      return response;
    },
    onSuccess: async (response) => {
      console.log("Success response:", response);

      const data = await response.json();
      console.log("Parsed response data:", data);

      queryClient.invalidateQueries({ queryKey: ["/api/issues/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      const userData = queryClient.getQueryData(["/api/auth/user"]) as any;
      if (userData?.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${userData.id}/activity`] });
      }

      toast({
        title: "Stance posted successfully!",
        description: `You earned +${data.pointsEarned || 0} points for this stance.`,
      });

      if (data && data.id) {
        console.log("Navigating to:", `/issue/${data.id}`);
        navigate(`/issue/${data.id}`);
      } else {
        console.error("No valid ID in response:", data);
        navigate("/home");
        toast({
          title: "Stance posted!",
          description: "Your stance was created successfully. Check the feed to see it.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Create stance error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post stance",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof stanceSchema>) => {
    if (!isAuthenticated || !(user as any)?.hasInviteAccess) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in with an active invite to post stances.",
      });
      return;
    }

    if (!selectedUser || !data.targetUsername) {
      toast({
        variant: "destructive",
        title: "Target Required",
        description: "Please select a target person before posting your stance.",
      });
      return;
    }

    console.log("Submitting stance with data:", data);
    createStanceMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Sign in to take a stance
              </h2>
              <p className="text-slate-600 mb-6">
                You need to be signed in to post stances and start discussions
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

  if (!(user as any)?.hasInviteAccess) {
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
                You need an active invite to post stances and start discussions
              </p>
              <Link href="/stances">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Take a Stance
          </h1>
          <p className="text-slate-600">
            Champion or challenge a Web3 personality to share your perspective and start a discussion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">Your Stance</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="stance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Stance Type
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              type="button"
                              variant={field.value === 'champion' ? 'default' : 'outline'}
                              onClick={() => field.onChange('champion')}
                              className={`h-12 ${
                                field.value === 'champion' 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'border-green-200 text-green-700 hover:bg-green-50'
                              }`}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Champion
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 'challenge' ? 'default' : 'outline'}
                              onClick={() => field.onChange('challenge')}
                              className={`h-12 ${
                                field.value === 'challenge' 
                                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                                  : 'border-red-200 text-red-700 hover:bg-red-50'
                              }`}
                            >
                              <Flame className="w-4 h-4 mr-2" />
                              Challenge
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., The future of decentralized social media"
                            className="bg-slate-50 border-slate-200 focus:bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium flex items-center space-x-2">
                      <span>Target Person</span>
                      <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </FormLabel>
                    <div className="space-y-3">
                      {selectedUser ? (
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {selectedUser.firstName?.[0] || selectedUser.username?.[0] || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {selectedUser.firstName && selectedUser.lastName 
                                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                                  : selectedUser.username}
                              </p>
                              <div className="flex items-center space-x-2">
                                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                <span className="text-sm text-blue-600">@{selectedUser.username || selectedUser.twitterHandle}</span>
                                {selectedUser.isUnclaimedProfile && (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                    Unclaimed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(null);
                              form.setValue("targetUserId", "");
                              form.setValue("targetUsername", "");
                            }}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                            <Input
                              placeholder="Search for a person (e.g., @VitalikButerin, Elon Musk)..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-white border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pl-12 pr-12 h-14 text-slate-900 placeholder:text-slate-500 text-base rounded-lg shadow-sm"
                            />
                            {isSearching && (
                              <Loader2 className="w-5 h-5 text-blue-500 absolute right-4 top-1/2 transform -translate-y-1/2 animate-spin" />
                            )}
                          </div>

                          {searchResults.length > 0 && (
                            <div className="border-2 border-blue-200 rounded-xl bg-white shadow-lg max-h-80 overflow-y-auto">
                              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-blue-900">
                                    People Found
                                  </p>
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {searchResults.length} results
                                  </Badge>
                                </div>
                              </div>
                              <div className="divide-y divide-slate-100">
                                {searchResults.map((result) => (
                                  <button
                                    key={result.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedUser(result);
                                      form.setValue("targetUserId", result.id);
                                      form.setValue("targetUsername", result.username || result.twitterHandle);
                                      setSearchQuery("");
                                      setSearchResults([]);
                                      setShowUserNotFound(false);
                                    }}
                                    className="w-full flex items-center space-x-4 p-4 hover:bg-blue-50 transition-all duration-200 group"
                                  >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                      <span className="text-white font-bold text-sm">
                                        {result.firstName?.[0] || result.username?.[0] || 'U'}
                                      </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className="font-semibold text-slate-900 group-hover:text-blue-900">
                                        {result.firstName && result.lastName 
                                          ? `${result.firstName} ${result.lastName}`
                                          : result.username}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.080l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                        <span className="text-sm text-blue-600">@{result.username || result.twitterHandle}</span>
                                        {result.isUnclaimedProfile && (
                                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                            Unclaimed
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 transform rotate-[-90deg] group-hover:text-blue-500" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {showUserNotFound && !isSearching && (
                            <div className="border-2 border-amber-200 rounded-xl bg-amber-50 p-6">
                              <div className="flex items-start space-x-3">
                                <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5" />
                                <div className="flex-1">
                                  <h3 className="text-amber-900 font-semibold mb-1">Person not found</h3>
                                  <p className="text-amber-800 text-sm mb-4">
                                    We couldn't find "{searchQuery}" in our system. Would you like to create a new profile for this person?
                                  </p>
                                  <Button
                                    type="button"
                                    onClick={() => setShowCreateProfile(true)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Profile
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-slate-600 flex items-center space-x-2">
                        <Info className="w-4 h-4 text-slate-600" />
                        <span>Search for the Web3 personality you're {form.watch('stance') === 'champion' ? 'championing' : 'challenging'}</span>
                      </p>
                    </div>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="spaceSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Tag a Project (Optional)
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white">
                              <SelectValue placeholder="None - General stance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None - General stance</SelectItem>
                              {allProjects?.map((project: any) => (
                                <SelectItem key={project.id} value={project.slug}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <p className="text-xs text-slate-500 mt-1">
                          Tag this stance to a specific project if relevant
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proposalLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Reference Link (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="bg-slate-50 border-slate-200 focus:bg-white pl-10"
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-slate-500 mt-1">
                          Link to an article, post, or discussion related to your stance
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Your Argument
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Explain your stance with evidence, reasoning, and specific examples..."
                            rows={8}
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
                            {charCount}/2000
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {stanceAvailability && (
                    <div className="space-y-3">
                      {!stanceAvailability.meetsGrsRequirement && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <p className="font-medium">GRS Requirement Not Met</p>
                              <p className="text-sm">
                                You need a GRS of at least 1400 to post a stance. Your current GRS: {stanceAvailability.userGrsScore}. Keep engaging to build your reputation.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {stanceAvailability.slotsAreFull && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-amber-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <div className="w-full">
                              <p className="font-medium">All Stance Slots Full</p>
                              <p className="text-sm">
                                Only 5 stances can be active at once ({stanceAvailability.activeStanceCount}/5). Please wait for a slot to open.
                              </p>
                              {timeRemaining > 0 && (
                                <div className="mt-2 p-2 bg-amber-100 rounded text-center">
                                  <p className="text-sm font-medium">Next slot opens in:</p>
                                  <p className="text-lg font-mono">{formatTimeRemaining(timeRemaining)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {stanceAvailability.canCreateStance && !stanceAvailability.slotsAreFull && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-green-800">
                            <Check className="w-4 h-4 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Ready to Post</p>
                              <p className="text-sm">
                                {stanceAvailability.slotsAvailable} stance slot{stanceAvailability.slotsAvailable !== 1 ? 's' : ''} available. You meet all requirements.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={createStanceMutation.isPending || !selectedUser || !stanceAvailability?.canCreateStance}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 disabled:opacity-50"
                    data-testid="button-submit-stance"
                  >
                    {createStanceMutation.isPending ? "Posting..." : "Post Stance"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <StancePreview
              stance={watchedValues.stance}
              title={watchedValues.title}
              content={watchedValues.content}
              targetUsername={watchedValues.targetUsername}
              selectedUser={selectedUser}
            />

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">
                      Tips for effective stances
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>- Be specific and provide concrete examples</li>
                      <li>- Link to relevant sources when possible</li>
                      <li>- Explain the context and impact of your perspective</li>
                      <li>- Stay professional and constructive</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Create New Profile</DialogTitle>
          </DialogHeader>
          <Form {...unclaimedForm}>
            <form onSubmit={unclaimedForm.handleSubmit((data) => {
              let twitterHandle = '';
              const twitterUrl = data.twitterUrl;
              
              if (twitterUrl && (twitterUrl.includes('twitter.com/') || twitterUrl.includes('x.com/'))) {
                const urlMatch = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
                if (urlMatch) {
                  twitterHandle = urlMatch[1].replace('@', '');
                }
              }

              if (!twitterHandle) {
                twitterHandle = searchQuery.replace('@', '').trim();

                if (searchQuery.includes('twitter.com/') || searchQuery.includes('x.com/')) {
                  const urlMatch = searchQuery.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
                  if (urlMatch) {
                    twitterHandle = urlMatch[1].replace('@', '');
                  }
                } else if (searchQuery.startsWith('@')) {
                  twitterHandle = searchQuery.slice(1);
                }
              }

              twitterHandle = twitterHandle.split('?')[0].split('#')[0];

              const [firstName, ...lastNameParts] = data.fullName.split(' ');
              const lastName = lastNameParts.join(' ');

              console.log("Creating profile with handle:", twitterHandle, "from URL:", twitterUrl);

              createUnclaimedProfileMutation.mutate({
                twitterHandle,
                twitterUrl: twitterUrl || `https://x.com/${twitterHandle}`,
                firstName: firstName || undefined,
                lastName: lastName || undefined
              });
            })} className="space-y-5">
              <FormField
                control={unclaimedForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Vitalik Buterin" 
                        className="h-12 border-slate-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={unclaimedForm.control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Twitter/X URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., https://x.com/VitalikButerin" 
                        className="h-12 border-slate-300 focus:border-blue-500"
                      />
                    </FormControl>
                    <p className="text-xs text-slate-500 mt-1">
                      If provided, this will be used to identify the person
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateProfile(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createUnclaimedProfileMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createUnclaimedProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmProfile} onOpenChange={setShowConfirmProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Profile Created!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {newlyCreatedProfile && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {newlyCreatedProfile.firstName} {newlyCreatedProfile.lastName}
                    </p>
                    <p className="text-sm text-green-700">
                      @{newlyCreatedProfile.username || newlyCreatedProfile.twitterHandle}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <p className="text-slate-600 text-sm">
              The profile has been created successfully. Click confirm to use this profile as your stance target.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmProfile(false);
                setNewlyCreatedProfile(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmProfile}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Confirm & Use Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
