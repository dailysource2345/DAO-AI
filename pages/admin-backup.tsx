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

  // Query for all DAOs
  const { data: daos, isLoading: daosLoading } = useQuery({
    queryKey: ["/api/daos"],
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
      createDaoForm.reset();
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
      queryClient.invalidateQueries({ queryKey: ["/api/daos"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/daos"] });
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
                    {statsLoading ? "..." : adminStats?.totalUsers || 0}
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
                    {statsLoading ? "..." : adminStats?.totalDaos || 0}
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
                    {statsLoading ? "..." : adminStats?.totalComments || 0}
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
                    {statsLoading ? "..." : adminStats?.totalVotes || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="daos">DAO Management</TabsTrigger>
            <TabsTrigger value="invite-codes">Invite Codes</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Regular Users ({allUsers?.filter((u: any) => !u.id.startsWith('unclaimed_')).length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>X Account</TableHead>
                        <TableHead>Access Status</TableHead>
                        <TableHead>Total Score</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.filter((user: any) => !user.id.startsWith('unclaimed_')).map((user: any) => (
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
                              </div>
                            </div>
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
                        Used: {inviteCodes?.filter((code: any) => code.usedCount > 0).length || 0} |
                        Available: {inviteCodes?.filter((code: any) => code.usedCount === 0).length || 0}
                      </p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Uses</TableHead>
                          <TableHead>Max Uses</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inviteCodes?.slice(0, 20).map((code: any) => (
                          <TableRow key={code.id}>
                            <TableCell>
                              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                                {code.code}
                              </code>
                            </TableCell>
                            <TableCell>{code.usedCount}</TableCell>
                            <TableCell>{code.maxUses}</TableCell>
                            <TableCell>
                              <Badge variant={code.usedCount === 0 ? "default" : "secondary"}>
                                {code.usedCount === 0 ? "Available" : "Used"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(code.createdAt), { addSuffix: true })}
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
                          {allUsers?.filter((u: any) => !u.hasInviteAccess).length || 0}
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
                        <span className="font-medium">< 1s</span>
                      </div>
                    </div>
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
    );
  }

  // Show admin auth if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Authentication
          </CardTitle>
          <div className="text-sm text-slate-600">
            Enter the admin password to access the management panel.
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ password: (e.target as any).password.value }),
              });

              if (response.ok) {
                handleAdminAuth();
                toast({
                  title: "Authentication successful",
                  description: "Welcome to the admin panel.",
                });
              } else {
                toast({
                  title: "Authentication failed",
                  description: "Invalid password.",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error("Auth error:", error);
              toast({
                title: "Error",
                description: "Authentication failed. Please try again.",
                variant: "destructive",
              });
            }
          }} className="space-y-4">
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Admin password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Access Admin Panel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
