import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  TrendingUp,
  Star,
  CheckCircle2,
  ShieldOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin4() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("companies");
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  
  // Company form state
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    logo: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    category: "Wallets",
    isActive: true,
    isVerified: false,
  });
  
  // Company user form state
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "admin",
    isActive: true,
  });

  // Fetch companies
  const { data: companies = [], isLoading: loadingCompanies } = useQuery<any[]>({
    queryKey: ["/api/admin/companies"],
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: loadingReviews } = useQuery<any[]>({
    queryKey: ["/api/admin/reviews"],
  });

  // Fetch analytics
  const { data: analytics, isLoading: loadingAnalytics } = useQuery<any>({
    queryKey: ["/api/admin/analytics"],
  });

  // Fetch suspended users
  const { data: suspendedUsers = [], isLoading: loadingSuspendedUsers } = useQuery<any[]>({
    queryKey: ["/api/admin/suspended-users"],
  });

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/companies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      resetCompanyForm();
      setIsCreateCompanyOpen(false);
      toast({
        title: "Success",
        description: "Company created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    },
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/companies/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setCompanyToDelete(null);
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete company",
        variant: "destructive",
      });
    },
  });

  // Create company user mutation
  const createUserMutation = useMutation({
    mutationFn: async ({ companyId, userData }: { companyId: number; userData: any }) => {
      const response = await apiRequest("POST", `/api/admin/companies/${companyId}/users`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      resetUserForm();
      setIsCreateUserOpen(false);
      toast({
        title: "Success",
        description: "Company user created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create company user",
        variant: "destructive",
      });
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/reviews/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setReviewToDelete(null);
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    },
  });

  // Unsuspend user mutation
  const unsuspendUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/unsuspend`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-users"] });
      toast({
        title: "Success",
        description: "User account has been unsuspended",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unsuspend user",
        variant: "destructive",
      });
    },
  });

  // Generate company credentials mutation
  const generateCredentialsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/generate-company-credentials");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      toast({
        title: "Success!",
        description: `Created ${data.created} accounts, skipped ${data.skipped}. Check console for email preview links.`,
      });
      
      // Log email preview URLs to console for easy access
      console.log("=== Company Credentials Generated ===");
      data.results.forEach((result: any) => {
        if (result.emailPreviewUrl) {
          console.log(`${result.companyName} (${result.email}): ${result.emailPreviewUrl}`);
        }
      });
      if (data.errorDetails.length > 0) {
        console.log("Errors:", data.errorDetails);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate credentials",
        variant: "destructive",
      });
    },
  });

  // Reset company form
  const resetCompanyForm = () => {
    setCompanyForm({
      name: "",
      slug: "",
      logo: "",
      description: "",
      website: "",
      email: "",
      phone: "",
      category: "Wallets",
      isActive: true,
      isVerified: false,
    });
  };
  
  // Reset user form
  const resetUserForm = () => {
    setUserForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "admin",
      isActive: true,
    });
  };

  // Handle company form submission
  const handleCreateCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCompanyMutation.mutate(companyForm);
  };

  // Handle company user form submission
  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCompany) return;
    
    createUserMutation.mutate({ 
      companyId: selectedCompany.id, 
      userData: userForm 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage companies, reviews, and platform analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="companies" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="tab-companies"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Companies</span>
            </TabsTrigger>
            <TabsTrigger 
              value="suspended" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="tab-suspended"
            >
              <ShieldOff className="w-4 h-4" />
              <span className="hidden sm:inline">Suspended</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="tab-analytics"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              data-testid="tab-settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Company Management
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateCredentialsMutation.mutate()}
                  disabled={generateCredentialsMutation.isPending}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950"
                  data-testid="button-generate-credentials"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {generateCredentialsMutation.isPending ? "Sending..." : "Send All Login Credentials"}
                </Button>
                <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-create-company">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Company</DialogTitle>
                    <DialogDescription>
                      Add a new company review page to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCompany} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          required 
                          data-testid="input-company-name"
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input 
                          id="slug" 
                          name="slug" 
                          placeholder="e.g., metamask" 
                          required 
                          data-testid="input-company-slug"
                          value={companyForm.slug}
                          onChange={(e) => setCompanyForm({...companyForm, slug: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input 
                        id="logo" 
                        name="logo" 
                        type="url" 
                        data-testid="input-company-logo"
                        value={companyForm.logo}
                        onChange={(e) => setCompanyForm({...companyForm, logo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        rows={3} 
                        data-testid="input-company-description"
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          name="website" 
                          type="url" 
                          data-testid="input-company-website"
                          value={companyForm.website}
                          onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          name="category" 
                          value={companyForm.category}
                          onValueChange={(value) => setCompanyForm({...companyForm, category: value})}
                        >
                          <SelectTrigger data-testid="select-company-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wallets">Wallets</SelectItem>
                            <SelectItem value="Exchanges">Exchanges</SelectItem>
                            <SelectItem value="Cards">Crypto Cards</SelectItem>
                            <SelectItem value="DeFi">DeFi Platforms</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          data-testid="input-company-email"
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          data-testid="input-company-phone"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="isActive" 
                          name="isActive" 
                          data-testid="switch-company-active"
                          checked={companyForm.isActive}
                          onCheckedChange={(checked) => setCompanyForm({...companyForm, isActive: checked})}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="isVerified" 
                          name="isVerified" 
                          data-testid="switch-company-verified"
                          checked={companyForm.isVerified}
                          onCheckedChange={(checked) => setCompanyForm({...companyForm, isVerified: checked})}
                        />
                        <Label htmlFor="isVerified">Verified</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={createCompanyMutation.isPending}
                        data-testid="button-submit-company"
                      >
                        {createCompanyMutation.isPending ? "Creating..." : "Create Company"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {loadingCompanies ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : companies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No companies yet. Create your first company review page.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => setLocation(`/admin4/companies/${company.id}`)}
                      data-testid={`link-company-${company.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {company.logo ? (
                            <img 
                              src={company.logo} 
                              alt={company.name} 
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {company.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg hover:text-blue-500 transition-colors">
                              {company.name}
                            </CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {company.category}
                            </p>
                          </div>
                        </div>
                        {company.isVerified && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {company.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          company.isActive 
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {company.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs text-slate-500">/{company.slug}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsCreateUserOpen(true);
                          }}
                          data-testid={`button-add-user-${company.id}`}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Add User
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCompanyToDelete(company.id)}
                          data-testid={`button-delete-company-${company.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Suspended Accounts Tab */}
          <TabsContent value="suspended" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Suspended Accounts
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage user accounts that have been suspended due to suspicious activity
                </p>
              </div>
            </div>

            {loadingSuspendedUsers ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : suspendedUsers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShieldOff className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">No suspended accounts</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {suspendedUsers.map((user: any) => (
                  <Card key={user.id} className="border-red-200 dark:border-red-900">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {user.profileImageUrl ? (
                              <img 
                                src={user.profileImageUrl} 
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {user.username || user.email || 'Unknown User'}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {user.email || 'No email'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">Suspended:</span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {new Date(user.suspendedAt).toLocaleString()}
                              </span>
                            </div>
                            {user.suspensionReason && (
                              <div className="flex items-start gap-2 text-sm">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Reason:</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {user.suspensionReason}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">XP:</span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {user.xpPoints || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">GRS:</span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {user.grsScore || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to unsuspend ${user.username || user.email}?`)) {
                              unsuspendUserMutation.mutate(user.id);
                            }
                          }}
                          disabled={unsuspendUserMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          data-testid={`button-unsuspend-${user.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {unsuspendUserMutation.isPending ? "Unsuspending..." : "Unsuspend"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Platform Analytics
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Overview of platform performance and metrics
              </p>
            </div>

            {loadingAnalytics ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Total Companies</span>
                      <Building2 className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{analytics?.totalCompanies || 0}</p>
                    <p className="text-blue-100 mt-2">
                      {analytics?.activeCompanies || 0} active
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Verified Companies</span>
                      <CheckCircle2 className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{analytics?.verifiedCompanies || 0}</p>
                    <p className="text-green-100 mt-2">
                      {analytics?.totalCompanies > 0 
                        ? Math.round((analytics.verifiedCompanies / analytics.totalCompanies) * 100)
                        : 0}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Total Reviews</span>
                      <MessageSquare className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{analytics?.totalReviews || 0}</p>
                    <p className="text-purple-100 mt-2">Across all projects</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Average Rating</span>
                      <Star className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {analytics?.averageRating || "N/A"}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {analytics?.averageRating && [...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(parseFloat(analytics.averageRating))
                              ? "fill-white text-white"
                              : "text-yellow-200"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Active Pages</span>
                      <TrendingUp className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{analytics?.activeCompanies || 0}</p>
                    <p className="text-orange-100 mt-2">Currently live</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Review Rate</span>
                      <BarChart3 className="w-8 h-8 opacity-80" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {analytics?.totalCompanies > 0
                        ? (analytics.totalReviews / analytics.totalCompanies).toFixed(1)
                        : "0.0"}
                    </p>
                    <p className="text-pink-100 mt-2">Reviews per company</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Platform Settings
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Configure platform-wide settings and preferences
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage general platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Auto-approve Reviews
                    </p>
                    <p className="text-sm text-slate-500">
                      Automatically publish reviews without moderation
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Email Notifications
                    </p>
                    <p className="text-sm text-slate-500">
                      Send email notifications for new reviews
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Maintenance Mode
                    </p>
                    <p className="text-sm text-slate-500">
                      Temporarily disable public access
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Settings</CardTitle>
                <CardDescription>
                  Configure review and moderation policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Review Length</Label>
                  <Input type="number" defaultValue="50" placeholder="Characters" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Review Length</Label>
                  <Input type="number" defaultValue="1000" placeholder="Characters" />
                </div>
                <div className="space-y-2">
                  <Label>Profanity Filter</Label>
                  <Select defaultValue="moderate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Company User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Company User</DialogTitle>
            <DialogDescription>
              Add login credentials for {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input 
                id="user-email" 
                name="email" 
                type="email" 
                required 
                data-testid="input-user-email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">Password</Label>
              <Input 
                id="user-password" 
                name="password" 
                type="password" 
                required 
                data-testid="input-user-password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-firstName">First Name</Label>
                <Input 
                  id="user-firstName" 
                  name="firstName" 
                  data-testid="input-user-firstname"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-lastName">Last Name</Label>
                <Input 
                  id="user-lastName" 
                  name="lastName" 
                  data-testid="input-user-lastname"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select 
                name="role" 
                value={userForm.role}
                onValueChange={(value) => setUserForm({...userForm, role: value})}
              >
                <SelectTrigger data-testid="select-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="user-isActive" 
                name="isActive" 
                data-testid="switch-user-active"
                checked={userForm.isActive}
                onCheckedChange={(checked) => setUserForm({...userForm, isActive: checked})}
              />
              <Label htmlFor="user-isActive">Active</Label>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
                data-testid="button-submit-user"
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Review Confirmation */}
      <AlertDialog open={reviewToDelete !== null} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-review">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reviewToDelete && deleteReviewMutation.mutate(reviewToDelete)}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-confirm-delete-review"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Company Confirmation */}
      <AlertDialog open={companyToDelete !== null} onOpenChange={() => setCompanyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company? This will also delete all associated users and data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-company">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => companyToDelete && deleteCompanyMutation.mutate(companyToDelete)}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-confirm-delete-company"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
