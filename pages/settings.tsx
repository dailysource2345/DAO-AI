import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Globe,
  Users
} from "lucide-react";

interface UserSettings {
  // Profile Settings
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  isProfilePublic: boolean;
  showEmail: boolean;
  showRealName: boolean;
  
  // Privacy Settings
  allowDirectMessages: boolean;
  showActivity: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  allowProfileIndexing: boolean;
  
  // Notification Settings (basic)
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/user/settings'],
    enabled: isAuthenticated,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) => 
      apiRequest('/api/user/settings', {
        method: 'PATCH',
        body: JSON.stringify(newSettings),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/user/delete-account', {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      });
      window.location.href = "/";
    },
  });

  // Export data mutation
  const exportDataMutation = useMutation({
    mutationFn: () => 
      apiRequest('/api/user/export-data', {
        method: 'POST',
      }),
    onSuccess: (data) => {
      // Create and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dao-ai-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a JSON file",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Sign In Required</h1>
              <p className="text-slate-600">You need to be signed in to access settings.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userProfile = user as any;
  const userSettings = settings as UserSettings;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                      {userProfile?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-900">Profile Picture</h3>
                    <p className="text-sm text-slate-500">Connected through X (Twitter)</p>
                    <Button variant="outline" size="sm" disabled>
                      Change Picture
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={userProfile?.username || ""} 
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500">Username is set by your X account</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={userProfile?.email || "Not provided"} 
                      disabled
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Enter your first name"
                      value={userSettings?.firstName || ""}
                      onChange={(e) => 
                        updateSettingsMutation.mutate({ firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Enter your last name"
                      value={userSettings?.lastName || ""}
                      onChange={(e) => 
                        updateSettingsMutation.mutate({ lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userSettings?.bio || ""}
                    onChange={(e) => 
                      updateSettingsMutation.mutate({ bio: e.target.value })
                    }
                  />
                  <p className="text-xs text-slate-500">Maximum 500 characters</p>
                </div>

                {/* Current Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{userProfile?.xpPoints || 0}</div>
                    <div className="text-xs text-slate-600">XP Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{userProfile?.level || 1}</div>
                    <div className="text-xs text-slate-600">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{userProfile?.rank || 'N/A'}</div>
                    <div className="text-xs text-slate-600">Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{userProfile?.grsScore || 'N/A'}</div>
                    <div className="text-xs text-slate-600">GRS Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Visibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Visibility */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="public-profile" className="text-sm font-medium">Public Profile</Label>
                          <p className="text-xs text-slate-500">Make your profile visible to everyone</p>
                        </div>
                      </div>
                      <Switch 
                        id="public-profile"
                        checked={userSettings?.isProfilePublic !== false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ isProfilePublic: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="show-activity" className="text-sm font-medium">Show Activity</Label>
                          <p className="text-xs text-slate-500">Display your voting and participation history</p>
                        </div>
                      </div>
                      <Switch 
                        id="show-activity"
                        checked={userSettings?.showActivity !== false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ showActivity: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="show-real-name" className="text-sm font-medium">Show Real Name</Label>
                          <p className="text-xs text-slate-500">Display first and last name on profile</p>
                        </div>
                      </div>
                      <Switch 
                        id="show-real-name"
                        checked={userSettings?.showRealName || false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ showRealName: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact & Messaging */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Contact & Messaging</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="allow-messages" className="text-sm font-medium">Allow Direct Messages</Label>
                          <p className="text-xs text-slate-500">Let other users send you messages</p>
                        </div>
                      </div>
                      <Switch 
                        id="allow-messages"
                        checked={userSettings?.allowDirectMessages !== false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ allowDirectMessages: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="show-followers" className="text-sm font-medium">Show Followers</Label>
                          <p className="text-xs text-slate-500">Display your followers list publicly</p>
                        </div>
                      </div>
                      <Switch 
                        id="show-followers"
                        checked={userSettings?.showFollowers !== false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ showFollowers: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Search & Indexing */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Search & Indexing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <div>
                          <Label htmlFor="allow-indexing" className="text-sm font-medium">Allow Search Engine Indexing</Label>
                          <p className="text-xs text-slate-500">Let search engines find your profile</p>
                        </div>
                      </div>
                      <Switch 
                        id="allow-indexing"
                        checked={userSettings?.allowProfileIndexing !== false}
                        onCheckedChange={(checked) => 
                          updateSettingsMutation.mutate({ allowProfileIndexing: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-slate-500">Receive important updates via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={userSettings?.emailNotifications !== false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-slate-500">Browser notifications for real-time updates</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={userSettings?.pushNotifications || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ pushNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-digest" className="text-sm font-medium">Weekly Digest</Label>
                      <p className="text-xs text-slate-500">Get a weekly summary of platform activity</p>
                    </div>
                    <Switch 
                      id="weekly-digest"
                      checked={userSettings?.weeklyDigest || false}
                      onCheckedChange={(checked) => 
                        updateSettingsMutation.mutate({ weeklyDigest: checked })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>For detailed notification settings:</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    Visit the dedicated notifications page to customize specific notification types, 
                    delivery methods, and preferences.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-blue-200 text-blue-700 hover:bg-blue-100"
                    onClick={() => window.open('/notifications', '_blank')}
                  >
                    Open Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Data Export */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Data Export</h3>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Download className="w-5 h-5 text-slate-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">Download Your Data</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Export all your data including profile information, activity history, 
                          votes, reviews, and more.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => exportDataMutation.mutate()}
                          disabled={exportDataMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {exportDataMutation.isPending ? 'Exporting...' : 'Export Data'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Deletion */}
                <div>
                  <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data. 
                          This action cannot be undone.
                        </p>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-red-600">
                            <strong>What gets deleted:</strong>
                          </p>
                          <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
                            <li>Profile information and settings</li>
                            <li>Voting history and reviews</li>
                            <li>Comments and discussions</li>
                            <li>Achievement and XP progress</li>
                            <li>All associated data</li>
                          </ul>
                        </div>
                        <Button 
                          variant="destructive" 
                          className="mt-4"
                          onClick={() => {
                            if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                              deleteAccountMutation.mutate();
                            }
                          }}
                          disabled={deleteAccountMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}