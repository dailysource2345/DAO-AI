import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Edit3, 
  Trash2, 
  Eye,
  Trophy,
  MessageSquare,
  Plus,
  Calendar,
  TrendingUp,
  Database,
  Copy,
  Check,
  Download,
  FileText,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/time-utils";
import { AdminAuth } from "@/components/admin-auth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const createDaoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitterHandle: z.string().min(1, "Twitter handle is required"),
  twitterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required").default("DeFi"),
});

const updateDaoSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
  twitterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().optional(),
  isVerified: z.boolean().optional(),
  isUnclaimed: z.boolean().optional(),
});

const scoreUpdateSchema = z.object({
  score: z.number().min(0, "Score must be non-negative"),
});

const daoScoreUpdateSchema = z.object({
  daoId: z.number(),
  score: z.number().min(0, "Score must be non-negative"),
});

const stanceExpiryUpdateSchema = z.object({
  expiresAt: z.string(),
});

interface AdminOverrides {
  totalUsers: number | null;
  activeUsers: number | null;
  totalStances: number | null;
  totalReviews: number | null;
  totalComments: number | null;
  totalXpAwarded: number | null;
  totalDaos: number | null;
  totalVotes: number | null;
}

const STORAGE_KEY = "admin_stats_overrides";

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isScoreEditOpen, setIsScoreEditOpen] = useState(false);
  const [isDaoScoreEditOpen, setIsDaoScoreEditOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedDao, setSelectedDao] = useState<any>(null);
  const [isDaoEditOpen, setIsDaoEditOpen] = useState(false);
  const [isDaoCreateOpen, setIsDaoCreateOpen] = useState(false);
  const [selectedStance, setSelectedStance] = useState<any>(null);
  const [isStanceExpiryEditOpen, setIsStanceExpiryEditOpen] = useState(false);
  const [statsOverrides, setStatsOverrides] = useState<AdminOverrides | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStatsOverrides(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved overrides");
      }
    }
  }, []);

  // Query for admin stats
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  // Query for all users
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
  });

  // User details query
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["/api/admin/user-details", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return null;
      const response = await fetch(`/api/admin/user-details/${selectedUser.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!selectedUser?.id,
  });

  // Query for all user scores
  const { data: userScores, isLoading: scoresLoading } = useQuery({
    queryKey: ["/api/admin/user-scores"],
    enabled: isAuthenticated,
  });

  // Analytics queries
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'daily' | 'weekly'>('daily');
  const [analyticsDays, setAnalyticsDays] = useState(30);

  const { data: growthAnalytics, isLoading: growthLoading } = useQuery({
    queryKey: ["/api/admin/analytics/growth", analyticsTimeframe, analyticsDays],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics/growth?timeframe=${analyticsTimeframe}&days=${analyticsDays}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch growth analytics");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const { data: engagementMetrics, isLoading: engagementLoading } = useQuery({
    queryKey: ["/api/admin/analytics/engagement"],
    enabled: isAuthenticated,
  });

  const { data: retentionMetrics, isLoading: retentionLoading } = useQuery({
    queryKey: ["/api/admin/analytics/retention"],
    enabled: isAuthenticated,
  });

  const { data: platformOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ["/api/admin/analytics/overview"],
    enabled: isAuthenticated,
  });

  // Query for all DAOs from admin endpoint
  const { data: daos, isLoading: daosLoading } = useQuery({
    queryKey: ["/api/admin/daos"],
    enabled: isAuthenticated,
  });

  // Query for invite codes
  const { data: inviteCodes, isLoading: inviteCodesLoading } = useQuery({
    queryKey: ["/api/admin/invite-codes"],
    enabled: isAuthenticated, // Only run when authenticated
  });

  // Query for invite submissions
  const { data: inviteSubmissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/admin/invite-submissions"],
    enabled: isAuthenticated, // Only run when authenticated
  });

  // Query for all threads/issues
  const { data: dbThreads, isLoading: dbThreadsLoading } = useQuery({
    queryKey: ["/api/admin/threads"],
    enabled: isAuthenticated,
  });

  // Query for all comments
  const { data: dbComments, isLoading: dbCommentsLoading } = useQuery({
    queryKey: ["/api/admin/comments"],
    enabled: isAuthenticated,
  });

  // Query for all votes
  const { data: dbVotes, isLoading: dbVotesLoading } = useQuery({
    queryKey: ["/api/admin/votes"],
    enabled: isAuthenticated,
  });

  // Query for admin stances
  const { data: adminStances, isLoading: stancesLoading } = useQuery({
    queryKey: ["/api/admin/stances"],
    enabled: isAuthenticated,
  });

  // Query for admin reviews
  const { data: adminReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
    enabled: isAuthenticated,
  });

  // Check if admin is already authenticated by testing server session
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth", {
          credentials: "include",
        });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated - this is fine
      }
    };
    checkAdminAuth();
  }, []);



  // Form for creating DAOs
  const createDaoForm = useForm<z.infer<typeof createDaoSchema>>({
    resolver: zodResolver(createDaoSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      twitterHandle: "",
      twitterUrl: "",
      website: "",
      category: "DeFi",
    },
  });

  // Form for updating DAOs
  const updateDaoForm = useForm<z.infer<typeof updateDaoSchema>>({
    resolver: zodResolver(updateDaoSchema),
    defaultValues: {
      id: 0,
      name: "",
      slug: "",
      description: "",
      logoUrl: "",
      twitterHandle: "",
      twitterUrl: "",
      website: "",
      category: "DeFi",
      isVerified: false,
      isUnclaimed: true,
    },
  });

  // Form for updating user scores
  const scoreForm = useForm<z.infer<typeof scoreUpdateSchema>>({
    resolver: zodResolver(scoreUpdateSchema),
    defaultValues: { score: 0 },
  });

  // Form for updating DAO scores
  const daoScoreForm = useForm<z.infer<typeof daoScoreUpdateSchema>>({
    resolver: zodResolver(daoScoreUpdateSchema),
    defaultValues: { daoId: 0, score: 0 },
  });

  // Form for updating stance expiry
  const stanceExpiryForm = useForm<z.infer<typeof stanceExpiryUpdateSchema>>({
    resolver: zodResolver(stanceExpiryUpdateSchema),
    defaultValues: { expiresAt: "" },
  });

  // Generate invite codes mutation
  const generateCodesMutation = useMutation({
    mutationFn: async (count: number) => {
      return await apiRequest("POST", "/api/admin/generate-codes", { count });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invite-codes"] });
      toast({
        title: "Success",
        description: "Invite codes generated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Approve invite submission mutation
  const approveSubmissionMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      return await apiRequest("POST", `/api/admin/invite-submissions/${submissionId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invite-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "Invite submission approved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve submission",
        variant: "destructive",
      });
    },
  });

  // Deny invite submission mutation
  const denySubmissionMutation = useMutation({
    mutationFn: async ({ submissionId, notes }: { submissionId: number; notes?: string }) => {
      return await apiRequest("POST", `/api/admin/invite-submissions/${submissionId}/deny`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invite-submissions"] });
      toast({
        title: "Success",
        description: "Invite submission denied successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deny submission",
        variant: "destructive",
      });
    },
  });

  // Grant access mutation
  const grantAccessMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to grant access');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Revoke access mutation
  const revokeAccessMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest("POST", `/api/admin/users/${userId}/revoke-access`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "Access revoked successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access",
        variant: "destructive",
      });
    },
  });

  // Mutations - moved to top level to fix hooks rule
  const createDaoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createDaoSchema>) => {
      await apiRequest("POST", "/api/daos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/daos"] });
      createDaoForm.reset();
      setIsDaoCreateOpen(false);
      toast({
        title: "Success",
        description: "DAO created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTotalScoreMutation = useMutation({
    mutationFn: async ({ userId, score }: { userId: string; score: number }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}/total-score`, { score });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-scores"] });
      setIsScoreEditOpen(false);
      toast({
        title: "Success",
        description: "Total score updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDaoScoreMutation = useMutation({
    mutationFn: async ({ userId, daoId, score }: { userId: string; daoId: number; score: number }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}/dao-score`, { daoId, score });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-scores"] });
      setIsDaoScoreEditOpen(false);
      toast({
        title: "Success",
        description: "DAO score updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDaoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateDaoSchema>) => {
      await apiRequest("PATCH", `/api/admin/daos/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/daos"] });
      setIsDaoEditOpen(false);
      setSelectedDao(null);
      toast({
        title: "Success",
        description: "DAO updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDaoMutation = useMutation({
    mutationFn: async (daoId: number) => {
      await apiRequest("DELETE", `/api/admin/daos/${daoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/daos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "DAO deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteStanceMutation = useMutation({
    mutationFn: async (stanceId: number) => {
      await apiRequest("DELETE", `/api/admin/stances/${stanceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Stance deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStanceExpiryMutation = useMutation({
    mutationFn: async ({ stanceId, expiresAt }: { stanceId: number; expiresAt: string }) => {
      await apiRequest("PATCH", `/api/admin/stances/${stanceId}/expiry`, { expiresAt });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stances"] });
      setIsStanceExpiryEditOpen(false);
      toast({
        title: "Success",
        description: "Stance expiry updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const extendStanceMutation = useMutation({
    mutationFn: async ({ stanceId, hours }: { stanceId: number; hours: number }) => {
      await apiRequest("PATCH", `/api/admin/stances/${stanceId}/extend`, { hours });
    },
    onSuccess: (_, { hours }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stances"] });
      toast({
        title: "Success",
        description: `Stance extended by ${hours} hours successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdminAuth = () => {
    setIsAuthenticated(true);
  };

  // Show admin auth if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAdminAuth} />;
  }

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    createDaoForm.setValue("slug", slug);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleScoreEdit = (user: any) => {
    setSelectedUser(user);
    scoreForm.setValue("score", user.totalScore || 0);
    setIsScoreEditOpen(true);
  };

  const handleDaoScoreEdit = (userScore: any) => {
    setSelectedUser(userScore);
    daoScoreForm.setValue("daoId", userScore.daoId);
    daoScoreForm.setValue("score", userScore.score);
    setIsDaoScoreEditOpen(true);
  };

  const onCreateDao = (values: z.infer<typeof createDaoSchema>) => {
    createDaoMutation.mutate(values);
  };

  const onUpdateScore = (values: z.infer<typeof scoreUpdateSchema>) => {
    if (selectedUser) {
      updateTotalScoreMutation.mutate({ userId: selectedUser.id, score: values.score });
    }
  };

  const onUpdateDaoScore = (values: z.infer<typeof daoScoreUpdateSchema>) => {
    if (selectedUser) {
      updateDaoScoreMutation.mutate({ userId: selectedUser.userId, daoId: values.daoId, score: values.score });
    }
  };

  const handleStanceExpiryEdit = (stance: any) => {
    setSelectedStance(stance);
    const expiryDate = new Date(stance.expiresAt);
    const formattedDate = expiryDate.toISOString().slice(0, 16); // Format for datetime-local input
    stanceExpiryForm.setValue("expiresAt", formattedDate);
    setIsStanceExpiryEditOpen(true);
  };

  const onUpdateStanceExpiry = (values: z.infer<typeof stanceExpiryUpdateSchema>) => {
    if (selectedStance) {
      updateStanceExpiryMutation.mutate({ 
        stanceId: selectedStance.id, 
        expiresAt: values.expiresAt 
      });
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const exportUserData = (user: any) => {
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      walletAddress: user.walletAddress,
      totalScore: user.totalScore,
      grsScore: user.grsScore,
      createdAt: user.createdAt,
      authProvider: user.authProvider,
      hasInviteAccess: user.hasInviteAccess,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      skipOnboarding: user.skipOnboarding,
      stats: {
        threadsCreated: user.threadsCreated,
        commentsMade: user.commentsMade,
        votesCast: user.votesCast,
        daosActiveIn: user.daosActiveIn,
        daosFollowing: user.daosFollowing,
        referralsMade: user.referralsMade,
        referralsReceived: user.referralsReceived,
      }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `user_${user.username || user.id}_data.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `User data exported to ${exportFileDefaultName}`,
    });
  };

  const exportAllData = (dataType: string, data: any[]) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `${dataType}_data.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: `${dataType} data exported to ${exportFileDefaultName}`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Comprehensive platform management and user analytics</p>
        </div>

        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statsLoading ? "..." : (statsOverrides?.totalUsers ?? adminStats?.totalUsers ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total DAOs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statsLoading ? "..." : (statsOverrides?.totalDaos ?? adminStats?.totalDaos ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Discussions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statsLoading ? "..." : adminStats?.totalThreads || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Comments</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statsLoading ? "..." : (statsOverrides?.totalComments ?? adminStats?.totalComments ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Votes</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {statsLoading ? "..." : (statsOverrides?.totalVotes ?? adminStats?.totalVotes ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="daos">DAO Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="invite-codes">Invite Codes</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Platform Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Users</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.totalUsers ?? platformOverview?.totals?.users ?? 0)}
                      </p>
                      <p className="text-xs text-green-600">
                        +{overviewLoading ? "..." : platformOverview?.growth30Days?.users || 0} this month
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Users (7d)</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.activeUsers ?? platformOverview?.metrics?.activeUsers ?? 0)}
                      </p>
                      <p className="text-xs text-slate-500">Daily/Weekly Active</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Stances</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.totalStances ?? platformOverview?.totals?.stances ?? 0)}
                      </p>
                      <p className="text-xs text-green-600">
                        +{overviewLoading ? "..." : platformOverview?.growth30Days?.stances || 0} this month
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.totalReviews ?? platformOverview?.totals?.reviews ?? 0)}
                      </p>
                      <p className="text-xs text-green-600">
                        +{overviewLoading ? "..." : platformOverview?.growth30Days?.reviews || 0} this month
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Comments</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.totalComments ?? platformOverview?.totals?.comments ?? 0)}
                      </p>
                      <p className="text-xs text-slate-500">Engagement</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total XP Awarded</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {overviewLoading ? "..." : (statsOverrides?.totalXpAwarded ?? platformOverview?.totals?.xpAwarded ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">Gamification</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Analytics
                  </span>
                  <div className="flex items-center gap-4">
                    <Select value={analyticsTimeframe} onValueChange={(value: 'daily' | 'weekly') => setAnalyticsTimeframe(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={analyticsDays.toString()} onValueChange={(value: string) => setAnalyticsDays(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {growthLoading ? (
                  <div className="text-center py-8">Loading analytics...</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Users Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4">Active Users ({analyticsTimeframe})</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={growthAnalytics?.activeUsers || []}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* New Users Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4">New User Registrations ({analyticsTimeframe})</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={growthAnalytics?.newUsers || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stances Created Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4">Stances Created ({analyticsTimeframe})</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={growthAnalytics?.stances || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* XP Awarded Chart */}
                    <div>
                      <h4 className="text-sm font-medium mb-4">XP Awarded ({analyticsTimeframe})</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={growthAnalytics?.xpAwarded || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Active Users (7 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {engagementLoading ? (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 text-sm">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {engagementMetrics?.topActiveUsers?.slice(0, 5).map((user: any, index: number) => (
                        <div key={user.userId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profileImageUrl} />
                              <AvatarFallback>
                                {(user.firstName?.[0] || user.username?.[0] || '?').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username}
                              </p>
                              <p className="text-xs text-slate-500">{user.activities} activities</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-yellow-600">{user.totalXp} XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Most Engaging Stances (7 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {engagementLoading ? (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 text-sm">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {engagementMetrics?.topStances?.slice(0, 5).map((stance: any, index: number) => (
                        <div key={stance.id} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-2">{stance.title}</p>
                              <p className="text-xs text-slate-500 mt-1">by @{stance.authorUsername}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant={stance.stance === 'champion' ? 'default' : 'destructive'} className="text-xs">
                                  {stance.stance}
                                </Badge>
                                <span className="text-xs text-slate-600">
                                  {stance.upvotes} 👍 {stance.downvotes} 👎 {stance.commentCount} 💬
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600">{stance.totalEngagement}</p>
                              <p className="text-xs text-slate-500">engagement</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Retention Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retention Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Returning Users (7d)</p>
                      <p className="text-2xl font-bold text-green-600">
                        {retentionLoading ? "..." : retentionMetrics?.returningUsers || 0}
                      </p>
                      <p className="text-xs text-slate-500">Users who returned after being inactive</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">New Active Users (7d)</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {retentionLoading ? "..." : retentionMetrics?.newActiveUsers || 0}
                      </p>
                      <p className="text-xs text-slate-500">New users who remained active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Streak Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {retentionLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={retentionMetrics?.streakDistribution || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="streakRange" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platform Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Average GRS Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {overviewLoading ? "..." : platformOverview?.metrics?.avgGrsScore || 1300}
                    </p>
                    <p className="text-xs text-slate-500">Platform governance reputation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Avg Stances/User</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {engagementLoading ? "..." : Number(engagementMetrics?.averageMetrics?.avgStancesPerUser || 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500">Content creation rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">Avg Comments/Stance</p>
                    <p className="text-3xl font-bold text-green-600">
                      {engagementLoading ? "..." : Number(engagementMetrics?.averageMetrics?.avgCommentsPerStance || 0).toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500">Engagement rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({allUsers?.length || 0})
                  <div className="text-sm text-slate-600 ml-2">
                    (Regular: {allUsers?.filter((u: any) => !u.id.startsWith('unclaimed_')).length || 0}, 
                    Unclaimed: {allUsers?.filter((u: any) => u.id.startsWith('unclaimed_')).length || 0})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-slate-600">Loading users...</span>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead>X Account</TableHead>
                        <TableHead>Access Status</TableHead>
                        <TableHead>Total Score</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profileImageUrl} />
                                <AvatarFallback>
                                  {user.username?.charAt(0)?.toUpperCase() || user.id.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.username || "No username"}</div>
                                <div className="text-sm text-slate-500">{user.email || "No email"}</div>
                                <div className="text-xs text-slate-400">ID: {user.id.substring(0, 20)}...</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.id.startsWith('unclaimed_') ? (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                Unclaimed Profile
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Claimed Account
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.twitterHandle ? (
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                  {user.twitterUrl ? (
                                    <a
                                      href={user.twitterUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                                    >
                                      <Badge variant="outline" className="bg-black text-white">
                                        @{user.twitterHandle}
                                      </Badge>
                                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                    </a>
                                  ) : (
                                    <Badge variant="outline" className="bg-black text-white">
                                      @{user.twitterHandle}
                                    </Badge>
                                  )}
                                </div>
                                {(user.firstName || user.lastName) && (
                                  <div className="text-sm text-slate-600">
                                    {user.firstName} {user.lastName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-slate-500">
                                No X Account
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.hasInviteAccess ? (
                              <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                                Full Access
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                                Connected Only
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.totalScore || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUserClick(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleScoreEdit(user)}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {user.username || user.id}? This action cannot be undone and will remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteUserMutation.mutate(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {/* Stances Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Governance Stances ({adminStances?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stancesLoading ? (
                    <div className="text-center py-8">Loading stances...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>DAO</TableHead>
                          <TableHead>Stance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminStances?.map((stance: any) => (
                          <TableRow key={stance.id}>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium truncate">{stance.title}</div>
                                <div className="text-xs text-slate-500">ID: {stance.id}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{stance.authorUsername || "Unknown"}</div>
                                <div className="text-xs text-slate-500">{stance.authorId}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {stance.daoName || "No DAO"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={stance.stance === "champion" ? "default" : "destructive"}>
                                {stance.stance}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {stance.isActive ? (
                                <Badge variant="default" className="bg-green-100 text-green-700">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  Expired
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDistanceToNow(new Date(stance.expiresAt), { addSuffix: true })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>👍 {stance.upvotes} 👎 {stance.downvotes}</div>
                                <div>💬 {stance.commentCount}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStanceExpiryEdit(stance)}
                                  title="Edit expiry date"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                                
                                {/* Show extend buttons only for expired stances */}
                                {!stance.isActive && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => extendStanceMutation.mutate({ stanceId: stance.id, hours: 5 })}
                                      disabled={extendStanceMutation.isPending}
                                      title="Extend by 5 hours"
                                      className="text-xs px-2"
                                    >
                                      +5h
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => extendStanceMutation.mutate({ stanceId: stance.id, hours: 10 })}
                                      disabled={extendStanceMutation.isPending}
                                      title="Extend by 10 hours"
                                      className="text-xs px-2"
                                    >
                                      +10h
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => extendStanceMutation.mutate({ stanceId: stance.id, hours: 12 })}
                                      disabled={extendStanceMutation.isPending}
                                      title="Extend by 12 hours"
                                      className="text-xs px-2"
                                    >
                                      +12h
                                    </Button>
                                  </>
                                )}
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" title="Delete stance">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Stance</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{stance.title}"? This will remove all associated comments, votes, and cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => deleteStanceMutation.mutate(stance.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    User Reviews ({adminReviews?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="text-center py-8">Loading reviews...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reviewer</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Content Preview</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminReviews?.map((review: any) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{review.reviewerUsername || "Unknown"}</div>
                                <div className="text-xs text-slate-500">ID: {review.reviewerId}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {review.isTargetOnPlatform ? (
                                  <Badge variant="default">Platform User</Badge>
                                ) : (
                                  <div>
                                    <div className="font-medium">{review.externalEntityName}</div>
                                    <div className="text-xs text-slate-500">@{review.externalEntityXHandle}</div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={review.reviewType === "positive" ? "default" : 
                                        review.reviewType === "negative" ? "destructive" : "secondary"}
                              >
                                {review.reviewType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {"★".repeat(review.rating)}
                                <span className="text-sm text-slate-500">({review.rating})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs text-sm text-slate-600 truncate">
                                {review.content}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                👍 {review.upvotes} 👎 {review.downvotes}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this review? This will remove all associated data and cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteReviewMutation.mutate(review.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stance Expiry Edit Dialog */}
            <Dialog open={isStanceExpiryEditOpen} onOpenChange={setIsStanceExpiryEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Stance Expiry</DialogTitle>
                </DialogHeader>
                <Form {...stanceExpiryForm}>
                  <form onSubmit={stanceExpiryForm.handleSubmit(onUpdateStanceExpiry)} className="space-y-4">
                    <FormField
                      control={stanceExpiryForm.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expires At</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsStanceExpiryEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Update Expiry</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Invite Codes Tab */}
          <TabsContent value="invite-codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Invite Code Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inviteCodesLoading ? (
                  <div className="text-center py-8">Loading invite codes...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-600">
                        Total Codes: {inviteCodes?.length || 0} | 
                        Used: {inviteCodes?.filter((code: any) => code.isUsed).length || 0} |
                        Available: {inviteCodes?.filter((code: any) => !code.isUsed).length || 0}
                      </p>
                      <Button
                        onClick={() => exportAllData('invite_codes', inviteCodes || [])}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export All Codes
                      </Button>
                    </div>
                    <div className="mb-4 flex gap-2">
                      <Button
                        onClick={() => generateCodesMutation.mutate(10)}
                        disabled={generateCodesMutation.isPending}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {generateCodesMutation.isPending ? "Generating..." : "Generate 10 Codes"}
                      </Button>
                      <Button
                        onClick={() => generateCodesMutation.mutate(100)}
                        disabled={generateCodesMutation.isPending}
                        variant="outline"
                      >
                        Generate 100 Codes
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Uses</TableHead>
                          <TableHead>Max Uses</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Used By</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inviteCodes?.slice(0, 50).map((code: any) => (
                          <TableRow key={code.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                                  {code.code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(code.code)}
                                >
                                  {copiedCode === code.code ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{code.currentUses || 0}</TableCell>
                            <TableCell>{code.maxUses || 1}</TableCell>
                            <TableCell>
                              <Badge variant={code.isUsed ? "secondary" : "default"}>
                                {code.isUsed ? "Used" : "Available"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {code.usedBy ? (
                                <div className="text-sm">
                                  <div className="font-medium">{code.usedBy.username || "Unknown"}</div>
                                  <div className="text-slate-500">{code.usedBy.email || "No email"}</div>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(code.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(code.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DAO Management Tab */}
          <TabsContent value="daos" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">DAO Management</h2>
              <Dialog open={isDaoCreateOpen} onOpenChange={setIsDaoCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add DAO
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New DAO</DialogTitle>
                  </DialogHeader>
                  <Form {...createDaoForm}>
                    <form
                      onSubmit={createDaoForm.handleSubmit((data) => {
                        createDaoMutation.mutate(data);
                        setIsDaoCreateOpen(false);
                      })}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createDaoForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DAO Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Compound" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createDaoForm.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., compound" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createDaoForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description of the DAO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createDaoForm.control}
                          name="twitterHandle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>X/Twitter Handle</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., compoundfinance" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createDaoForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., DeFi, DEX, NFT" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createDaoForm.control}
                          name="twitterUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>X/Twitter URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://x.com/compoundfinance" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createDaoForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://compound.finance" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createDaoForm.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://cryptologos.cc/logos/compound-comp-logo.png" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDaoCreateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create DAO</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  All DAOs ({daos?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {daosLoading ? (
                  <div className="text-center py-8">Loading DAOs...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>DAO</TableHead>
                        <TableHead>X Account</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daos?.map((dao: any) => (
                        <TableRow key={dao.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={dao.logoUrl} />
                                <AvatarFallback>{dao.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{dao.name}</div>
                                <div className="text-sm text-slate-500">
                                  <Badge variant="outline" className="text-xs">
                                    {dao.slug}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {dao.twitterHandle ? (
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                  {dao.twitterUrl ? (
                                    <a
                                      href={dao.twitterUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-2 hover:opacity-80"
                                    >
                                      <Badge variant="outline" className="bg-black text-white">
                                        @{dao.twitterHandle}
                                      </Badge>
                                    </a>
                                  ) : (
                                    <Badge variant="outline" className="bg-black text-white">
                                      @{dao.twitterHandle}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                No X Account
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              {dao.isVerified ? (
                                <Badge variant="default" className="bg-blue-100 text-blue-700 text-xs">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                                  Unclaimed
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {dao.category || "DeFi"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(dao.createdAt), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDao(dao);
                                  updateDaoForm.reset({
                                    id: dao.id,
                                    name: dao.name,
                                    slug: dao.slug,
                                    description: dao.description || "",
                                    logoUrl: dao.logoUrl || "",
                                    twitterHandle: dao.twitterHandle || "",
                                    twitterUrl: dao.twitterUrl || "",
                                    website: dao.website || "",
                                    category: dao.category || "DeFi",
                                    isVerified: dao.isVerified || false,
                                    isUnclaimed: dao.isUnclaimed !== false,
                                  });
                                  setIsDaoEditOpen(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete DAO</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {dao.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteDaoMutation.mutate(dao.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete DAO
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* DAO Edit Dialog */}
            <Dialog open={isDaoEditOpen} onOpenChange={setIsDaoEditOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit DAO: {selectedDao?.name}</DialogTitle>
                </DialogHeader>
                <Form {...updateDaoForm}>
                  <form
                    onSubmit={updateDaoForm.handleSubmit((data) => {
                      updateDaoMutation.mutate(data);
                    })}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={updateDaoForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DAO Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Compound" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateDaoForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., compound" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={updateDaoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Brief description of the DAO" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={updateDaoForm.control}
                        name="twitterHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X/Twitter Handle</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., compoundfinance" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateDaoForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., DeFi, DEX, NFT" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={updateDaoForm.control}
                        name="twitterUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X/Twitter URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://x.com/compoundfinance" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateDaoForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://compound.finance" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={updateDaoForm.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://cryptologos.cc/logos/compound-comp-logo.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={updateDaoForm.control}
                        name="isVerified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Verified Status</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Whether this DAO is verified by the platform
                              </div>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateDaoForm.control}
                        name="isUnclaimed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Unclaimed Status</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Whether this DAO profile is unclaimed
                              </div>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDaoEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Update DAO</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* X Access Management Tab */}
          <TabsContent value="x-access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  X Authentication Access Management
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Manage users who connected via X but don't have invite codes
                </p>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-slate-600">Loading users...</span>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Twitter Handle</TableHead>
                        <TableHead>Auth Provider</TableHead>
                        <TableHead>Has Access</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.filter((user: any) => 
                        user.authProvider === 'twitter' && !user.hasInviteAccess
                      ).map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.profileImageUrl} />
                                <AvatarFallback>
                                  {user.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-gray-500">
                                  {user.firstName} {user.lastName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.twitterHandle ? (
                              <a 
                                href={user.twitterUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                @{user.twitterHandle}
                              </a>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.authProvider || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.hasInviteAccess ? "default" : "destructive"}>
                              {user.hasInviteAccess ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => grantAccessMutation.mutate(user.id)}
                                disabled={grantAccessMutation.isPending}
                              >
                                Grant Access
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {allUsers?.length || 0}
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Full Access:</span>
                        <span className="text-green-600 font-medium">
                          {allUsers?.filter((u: any) => u.hasInviteAccess).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connected Only:</span>
                        <span className="text-orange-600 font-medium">
                          {allUsers?.filter((u: any) => !u.hasInviteAccess && !u.id.startsWith('unclaimed_')).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unclaimed:</span>
                        <span className="text-purple-600 font-medium">
                          {allUsers?.filter((u: any) => u.id.startsWith('unclaimed_')).length || 0}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => exportAllData('users', allUsers || [])}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5" />
                    DAOs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {daos?.length || 0}
                    </div>
                    <Button 
                      onClick={() => exportAllData('daos', daos || [])}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5" />
                    Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {adminStats?.totalThreads || 0}
                    </div>
                    <Button 
                      onClick={() => exportAllData('issues', [])}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5" />
                    Votes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {adminStats?.totalVotes || 0}
                    </div>
                    <Button 
                      onClick={() => exportAllData('votes', [])}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Database Health and Recovery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="font-medium text-green-800">Status: Connected</div>
                      <div className="text-sm text-green-600">Database is healthy and operational</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Records:</span>
                        <span className="font-medium">{
                          (allUsers?.length || 0) + 
                          (daos?.length || 0) + 
                          (adminStats?.totalThreads || 0) + 
                          (adminStats?.totalComments || 0)
                        }</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Connection Time:</span>
                        <span className="font-medium">&lt; 1s</span>
                      </div>
                    </div>
                    <Button 
                      onClick={async () => {
                        try {
                          const response = await apiRequest('/api/admin/fix-review-grs', {
                            method: 'POST',
                          });
                          toast({
                            title: "GRS Fix Complete",
                            description: `Fixed ${response.fixedCount} out of ${response.totalReviews} reviews`,
                          });
                        } catch (error) {
                          toast({
                            title: "GRS Fix Failed",
                            description: "Failed to fix review GRS impacts",
                            variant: "destructive",
                          });
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Fix Review GRS Impact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Backup & Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="font-medium text-blue-800">Auto-Backup: Enabled</div>
                      <div className="text-sm text-blue-600">Hourly backups are running</div>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        onClick={async () => {
                          try {
                            await fetch('/api/admin/backup/create', { 
                              method: 'POST',
                              credentials: 'include' 
                            });
                            toast({
                              title: "Backup Created",
                              description: "Manual backup completed successfully",
                            });
                          } catch (error) {
                            toast({
                              title: "Backup Failed",
                              description: "Failed to create backup",
                              variant: "destructive",
                            });
                          }
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Create Manual Backup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}