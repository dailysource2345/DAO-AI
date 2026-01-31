import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Building, Star, Users, Trash2, Plus, Search, Upload, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AdminAuth } from "@/components/admin-auth";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin4CompanyDetail() {
  const params = useParams();
  const companyId = parseInt(params.id || "");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedWebsite, setEditedWebsite] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedFounded, setEditedFounded] = useState("");
  const [editedKeyFeatures, setEditedKeyFeatures] = useState("");
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  // Fetch company details
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: [`/api/admin/companies/${companyId}`],
    enabled: !!companyId,
  });

  // Fetch company reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: [`/api/admin/companies/${companyId}/reviews`],
    enabled: !!companyId,
  });

  // Fetch company analytics
  const { data: analytics } = useQuery({
    queryKey: [`/api/admin/companies/${companyId}/analytics`],
    enabled: !!companyId,
  });

  // Fetch company admins
  const { data: admins = [], isLoading: adminsLoading } = useQuery<any[]>({
    queryKey: [`/api/admin/companies/${companyId}/admins`],
    enabled: !!companyId,
  });

  // Fetch flagged reviews for this company
  const { data: flaggedReviews = [], isLoading: flaggedReviewsLoading } = useQuery<any[]>({
    queryKey: [`/api/admin/projects/${companyId}/reported-reviews`],
    enabled: !!companyId,
  });

  // Search users for adding admins
  const { data: searchResults = [] } = useQuery({
    queryKey: [`/api/users/search?q=${searchQuery}`],
    enabled: searchQuery.length > 2,
  });

  // Check if admin is already authenticated
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

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: (updates: any) => apiRequest('PATCH', `/api/admin/companies/${companyId}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/companies/${companyId}`] });
      toast({ title: "Success", description: "Company updated successfully" });
      setIsEditingDescription(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update company", 
        variant: "destructive"
      });
    },
  });

  // Add admin mutation
  const addAdminMutation = useMutation({
    mutationFn: (data: { userId: string; role: string }) =>
      apiRequest('POST', `/api/admin/companies/${companyId}/admins`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/companies/${companyId}/admins`] });
      toast({ title: "Success", description: "Admin added successfully" });
      setIsAddAdminOpen(false);
      setSelectedUserId("");
      setSearchQuery("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add admin", 
        variant: "destructive"
      });
    },
  });

  // Remove admin mutation
  const removeAdminMutation = useMutation({
    mutationFn: (adminId: number) =>
      apiRequest('DELETE', `/api/admin/companies/${companyId}/admins/${adminId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/companies/${companyId}/admins`] });
      toast({ title: "Success", description: "Admin removed successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to remove admin", 
        variant: "destructive"
      });
    },
  });

  // Delete flagged review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) =>
      apiRequest('DELETE', `/api/admin/project-reviews/${reviewId}`),
    onSuccess: (_, deletedReviewId) => {
      // Update the flagged reviews cache by removing the deleted review
      queryClient.setQueryData(
        [`/api/admin/projects/${companyId}/reported-reviews`],
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.filter((report: any) => report.reviewId !== deletedReviewId);
        }
      );
      
      // Update the all reviews cache by removing the deleted review
      queryClient.setQueryData(
        [`/api/admin/companies/${companyId}/reviews`],
        (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.filter((review: any) => review.id !== deletedReviewId);
        }
      );
      
      // Invalidate to ensure data consistency on next fetch
      queryClient.invalidateQueries({ queryKey: [`/api/admin/projects/${companyId}/reported-reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/companies/${companyId}/reviews`] });
      
      toast({ title: "Success", description: "Review deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete review", 
        variant: "destructive"
      });
    },
  });

  // Suspend user mutation
  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      apiRequest('POST', `/api/admin/users/${userId}/suspend`, { reason }),
    onSuccess: () => {
      // Invalidate caches so suspended user appears in Suspended Accounts tab
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-users"] });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/projects/${companyId}/reported-reviews`] });
      toast({ title: "Success", description: "User account has been suspended" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to suspend user", 
        variant: "destructive"
      });
    },
  });

  const handleSaveChanges = () => {
    const updates: any = {
      description: editedDescription,
      website: editedWebsite,
      email: editedEmail,
      founded: editedFounded,
    };
    
    if (editedKeyFeatures) {
      updates.keyFeatures = editedKeyFeatures.split('\n').filter(f => f.trim());
    }
    
    updateCompanyMutation.mutate(updates);
  };

  const handleAddAdmin = () => {
    if (!selectedUserId) {
      toast({ 
        title: "Error", 
        description: "Please select a user", 
        variant: "destructive"
      });
      return;
    }
    addAdminMutation.mutate({ userId: selectedUserId, role: selectedRole });
  };

  // Logo upload handlers
  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch('/api/admin/logos/upload-url', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.url,
      };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      toast({
        title: "Error",
        description: "Failed to get upload URL",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleLogoUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const uploadURL = uploadedFile.uploadURL;
      
      // Extract the logo path from the upload URL
      const url = new URL(uploadURL);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const logoPath = `/public-objects/logos/${filename}`;
      
      // Update company with new logo
      updateCompanyMutation.mutate({ logo: logoPath });
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    }
  };

  const handleAdminAuth = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAdminAuth} />;
  }

  if (companyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <Button onClick={() => navigate("/admin4")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin4")}
            data-testid="button-back-to-admin"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Company Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="mt-2">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={5242880}
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleLogoUploadComplete}
                    buttonClassName="text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Logo</span>
                    </div>
                  </ObjectUploader>
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl">{company.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={company.isActive ? "default" : "secondary"}>
                    {company.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {company.isVerified && (
                    <Badge variant="outline" className="text-green-600">
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline">{company.category || "Uncategorized"}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                  <p className="text-3xl font-bold">{analytics?.totalReviews || 0}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-3xl font-bold">{analytics?.averageRating || "N/A"}</p>
                </div>
                <Star className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access Users</p>
                  <p className="text-3xl font-bold">{admins.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Company Info</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="flagged">Flagged ({flaggedReviews.length})</TabsTrigger>
            <TabsTrigger value="access">Access Management ({admins.length})</TabsTrigger>
          </TabsList>

          {/* Company Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Project ID</Label>
                    <p className="font-medium">{company.externalId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Slug</Label>
                    <p className="font-medium">{company.slug}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Website
                  </Label>
                  {isEditingDescription ? (
                    <Input
                      value={editedWebsite}
                      onChange={(e) => setEditedWebsite(e.target.value)}
                      placeholder="https://example.com"
                    />
                  ) : (
                    <p className="font-medium">{company.website || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Email
                  </Label>
                  {isEditingDescription ? (
                    <Input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="contact@example.com"
                      type="email"
                    />
                  ) : (
                    <p className="font-medium">{company.email || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Founded
                  </Label>
                  {isEditingDescription ? (
                    <Input
                      value={editedFounded}
                      onChange={(e) => setEditedFounded(e.target.value)}
                      placeholder="2021"
                    />
                  ) : (
                    <p className="font-medium">{company.founded || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Description
                  </Label>
                  {isEditingDescription ? (
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={4}
                      placeholder="Company description..."
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {company.description || "No description available"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Key Features
                    {isEditingDescription && <span className="text-xs ml-2">(One per line)</span>}
                  </Label>
                  {isEditingDescription ? (
                    <Textarea
                      value={editedKeyFeatures}
                      onChange={(e) => setEditedKeyFeatures(e.target.value)}
                      rows={5}
                      placeholder="Zero fees&#10;Instant settlements&#10;Global acceptance"
                    />
                  ) : (
                    <div className="space-y-1">
                      {company.keyFeatures && company.keyFeatures.length > 0 ? (
                        company.keyFeatures.map((feature: string, idx: number) => (
                          <p key={idx} className="text-gray-700 dark:text-gray-300">• {feature}</p>
                        ))
                      ) : (
                        <p className="text-gray-500">No features listed</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditingDescription ? (
                    <>
                      <Button 
                        onClick={handleSaveChanges}
                        disabled={updateCompanyMutation.isPending}
                        data-testid="button-save-changes"
                      >
                        {updateCompanyMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingDescription(false);
                          setEditedDescription(company.description || "");
                          setEditedWebsite(company.website || "");
                          setEditedEmail(company.email || "");
                          setEditedFounded(company.founded || "");
                          setEditedKeyFeatures((company.keyFeatures || []).join('\n'));
                        }}
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => {
                        setIsEditingDescription(true);
                        setEditedDescription(company.description || "");
                        setEditedWebsite(company.website || "");
                        setEditedEmail(company.email || "");
                        setEditedFounded(company.founded || "");
                        setEditedKeyFeatures((company.keyFeatures || []).join('\n'));
                      }}
                      data-testid="button-edit-description"
                    >
                      Edit Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <Card key={review.id} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {review.user?.profileImageUrl && (
                                <img
                                  src={review.user.profileImageUrl}
                                  alt={review.user.username}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {review.user?.username || "Anonymous"}
                                </p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                          {review.title && (
                            <h4 className="font-semibold mb-1">{review.title}</h4>
                          )}
                          <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flagged Reviews Tab */}
          <TabsContent value="flagged" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {flaggedReviewsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading flagged reviews...</div>
                ) : flaggedReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No flagged reviews</div>
                ) : (
                  <div className="space-y-4">
                    {flaggedReviews.map((report: any) => (
                      <Card key={report.id} className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {report.review?.user?.profileImageUrl && (
                                  <img
                                    src={report.review.user.profileImageUrl}
                                    alt={report.review.user.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {report.review?.user?.username || "Anonymous"}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < report.review?.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="destructive">Flagged</Badge>
                            </div>
                            
                            {/* Review Content */}
                            {report.review?.title && (
                              <h4 className="font-semibold mb-1">{report.review.title}</h4>
                            )}
                            <p className="text-gray-700 dark:text-gray-300">{report.review?.content}</p>
                            
                            {/* Report Info */}
                            <div className="border-t border-red-300 dark:border-red-800 pt-3 mt-3 flex items-center justify-between">
                              <div className="text-sm">
                                <p className="text-red-700 dark:text-red-300">
                                  <span className="font-semibold">Reported by:</span> {report.reportedByUser?.username || "Unknown"}
                                </p>
                                <p className="text-red-700 dark:text-red-300">
                                  <span className="font-semibold">Reason:</span> {report.reason}
                                </p>
                                {report.notes && (
                                  <p className="text-red-700 dark:text-red-300 mt-1">
                                    <span className="font-semibold">Additional notes:</span> {report.notes}
                                  </p>
                                )}
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                  Reported on {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const reason = prompt('Please provide a reason for suspending this user:', `Suspicious review activity - ${report.reason}`);
                                    if (reason && report.review?.userId) {
                                      suspendUserMutation.mutate({ 
                                        userId: report.review.userId, 
                                        reason 
                                      });
                                    }
                                  }}
                                  disabled={suspendUserMutation.isPending || !report.review?.userId}
                                  className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                                  data-testid={`button-suspend-user-${report.reviewId}`}
                                >
                                  <ShieldOff className="w-4 h-4 mr-2" />
                                  {suspendUserMutation.isPending ? "Suspending..." : "Suspend Account"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
                                      deleteReviewMutation.mutate(report.reviewId);
                                    }
                                  }}
                                  disabled={deleteReviewMutation.isPending}
                                  data-testid={`button-delete-review-${report.reviewId}`}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {deleteReviewMutation.isPending ? "Deleting..." : "Delete Review"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Management Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Platform Users with Access</CardTitle>
                  <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-admin">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add User Access</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Search Users</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search by username..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                              data-testid="input-search-users"
                            />
                          </div>
                          {searchResults.length > 0 && (
                            <div className="mt-2 max-h-48 overflow-y-auto border rounded-md">
                              {searchResults.map((user: any) => (
                                <div
                                  key={user.id}
                                  className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    selectedUserId === user.id ? "bg-blue-50 dark:bg-blue-900" : ""
                                  }`}
                                  onClick={() => setSelectedUserId(user.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    {user.profileImageUrl && (
                                      <img
                                        src={user.profileImageUrl}
                                        alt={user.username}
                                        className="w-6 h-6 rounded-full"
                                      />
                                    )}
                                    <span>{user.username}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger data-testid="select-role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleAddAdmin}
                          disabled={!selectedUserId || addAdminMutation.isPending}
                          className="w-full"
                          data-testid="button-confirm-add-admin"
                        >
                          {addAdminMutation.isPending ? "Adding..." : "Add User"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {adminsLoading ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
                ) : admins.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No users with access yet</p>
                ) : (
                  <div className="space-y-2">
                    {admins.map((admin: any) => (
                      <Card key={admin.id} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {admin.user?.profileImageUrl && (
                                <img
                                  src={admin.user.profileImageUrl}
                                  alt={admin.user.username}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div>
                                <p className="font-medium">{admin.user?.username || "Unknown User"}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {admin.user?.email || "No email"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>{admin.role || "admin"}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAdminMutation.mutate(admin.id)}
                                data-testid={`button-remove-admin-${admin.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
