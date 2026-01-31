import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "@/lib/time-utils";
import { 
  Bell, 
  BellOff, 
  MessageSquare, 
  ThumbsUp, 
  Star, 
  Users, 
  Award,
  Check,
  X,
  Trash2,
  Zap,
  Activity,
  Clock,
  TrendingUp,
  Trophy,
  Target,
  Calendar
} from "lucide-react";

interface Notification {
  id: number;
  type: 'comment' | 'vote' | 'review' | 'follow' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  senderUsername?: string;
  senderAvatar?: string;
}

interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  commentNotifications: boolean;
  voteNotifications: boolean;
  reviewNotifications: boolean;
  followNotifications: boolean;
  achievementNotifications: boolean;
  systemNotifications: boolean;
  weeklyDigest: boolean;
  soundEnabled: boolean;
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  // Fetch notifications with optimized settings
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Fetch notification settings only when needed
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/notifications/settings'],
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch XP activities with pagination and caching
  const { data: xpActivities = [], isLoading: xpActivitiesLoading } = useQuery({
    queryKey: ['/api/users/creda-activities'],
    enabled: isAuthenticated,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationIds: number[]) => 
      apiRequest('POST', '/api/notifications/mark-read', { ids: notificationIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      setSelectedNotifications([]);
      toast({
        title: "Notifications updated",
        description: "Selected notifications marked as read",
      });
    },
  });

  // Delete notifications
  const deleteNotificationsMutation = useMutation({
    mutationFn: (notificationIds: number[]) => 
      apiRequest('POST', '/api/notifications/delete', { ids: notificationIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      setSelectedNotifications([]);
      toast({
        title: "Notifications deleted",
        description: "Selected notifications have been removed",
      });
    },
  });

  // Update notification settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<NotificationSettings>) => 
      apiRequest('POST', '/api/notifications/settings', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/settings'] });
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved",
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
              <p className="text-slate-600">You need to be signed in to view your notifications.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleToggleNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = (notifications as Notification[])
      .filter(n => !n.read)
      .map(n => n.id);
    if (unreadNotifications.length > 0) {
      markAsReadMutation.mutate(unreadNotifications);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'vote': return <ThumbsUp className="w-4 h-4" />;
      case 'review': return <Star className="w-4 h-4" />;
      case 'follow': return <Users className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-100 text-blue-600';
      case 'vote': return 'bg-green-100 text-green-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'follow': return 'bg-purple-100 text-purple-600';
      case 'achievement': return 'bg-orange-100 text-orange-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const unreadCount = (notifications as Notification[]).filter(n => !n.read).length;

  // XP Activities helper functions
  const getXpActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'review_given':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'stance_created':
        return <Trophy className="w-5 h-5 text-purple-500" />;
      case 'vote_cast':
        return <ThumbsUp className="w-5 h-5 text-blue-500" />;
      case 'quality_comment':
      case 'normal_comment':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'upvote_received_stance':
      case 'upvote_received_comment':
      case 'upvote_received_review':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'onboarding_completed':
      case 'welcome_tour_completed':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'daily_streak':
        return <Target className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getXpActivityTitle = (activity: any) => {
    const { activityType, metadata } = activity;
    
    switch (activityType) {
      case 'review_given':
        return metadata?.reviewedUsername 
          ? `Reviewed ${metadata.reviewedUsername}` 
          : 'Review Given';
      case 'stance_created':
        return 'Created Governance Stance';
      case 'vote_cast':
        return `Cast ${metadata?.voteType || ''} Vote`.trim();
      case 'quality_comment':
        return 'Quality Comment Posted';
      case 'normal_comment':
        return 'Comment Posted';
      case 'upvote_received_stance':
        return 'Received Upvote on Stance';
      case 'upvote_received_comment':
        return 'Received Upvote on Comment';
      case 'upvote_received_review':
        return 'Received Upvote on Review';
      case 'onboarding_completed':
        return 'Completed Platform Onboarding';
      case 'welcome_tour_completed':
        return 'Completed Welcome Tour';
      case 'daily_streak':
        return `Daily Streak Bonus (${metadata?.streakDays || 0} days)`;
      default:
        return activityType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-600">Manage your notifications and preferences</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="xp-activities" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>XP Activities</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Recent Notifications</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {selectedNotifications.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => markAsReadMutation.mutate(selectedNotifications)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteNotificationsMutation.mutate(selectedNotifications)}
                        disabled={deleteNotificationsMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || markAsReadMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark All Read
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (notifications as Notification[]).length === 0 ? (
                  <div className="text-center py-12">
                    <BellOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
                    <p className="text-slate-500">You're all caught up! We'll notify you when something new happens.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(notifications as Notification[]).map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                          notification.read 
                            ? 'bg-white border border-slate-200' 
                            : 'bg-blue-50 border border-blue-200'
                        } ${
                          selectedNotifications.includes(notification.id)
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => handleToggleNotification(notification.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`text-sm font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                {notification.title}
                              </h4>
                              <p className={`text-sm mt-1 ${notification.read ? 'text-slate-500' : 'text-slate-700'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* XP Activities Tab */}
          <TabsContent value="xp-activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>XP Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {xpActivitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : xpActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No XP activities yet</h3>
                    <p className="text-slate-500">Start participating on the platform to earn XP points!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {xpActivities.map((activity: any) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          {getXpActivityIcon(activity.activityType)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 truncate">
                                {getXpActivityTitle(activity)}
                              </h4>
                              <p className="text-sm text-slate-600 mb-2">
                                {activity.metadata?.action || activity.metadata?.reason || 'XP earned for platform activity'}
                              </p>
                              <div className="flex items-center text-xs text-slate-500 gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Badge 
                                variant={activity.xpAwarded > 0 ? "default" : "destructive"}
                                className="flex items-center space-x-1 text-sm px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                              >
                                <Zap className="w-4 h-4" />
                                <span>{activity.xpAwarded > 0 ? '+' : ''}{activity.xpAwarded}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
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