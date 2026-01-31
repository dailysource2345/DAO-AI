import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Hash,
  HardDrive,
  BarChart3,
  Zap,
  MessageSquare,
  ThumbsUp,
  Star,
  Target,
  Users,
  Eye,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from "recharts";

interface OgMetrics {
  totalTransactions: number;
  totalStorageBytes: number;
  activityBreakdown: {
    type: string;
    count: number;
    percentage: number;
  }[];
  dailyStats: {
    date: string;
    transactions: number;
    bytes: number;
  }[];
  recentTransactions: {
    id: number;
    activityType: string;
    ogTxHash: string;
    ogRootHash: string;
    ogRecordedAt: string;
    createdAt: string;
  }[];
  weeklyGrowth: number;
  monthlyGrowth: number;
  averageRecordSize: number;
  uniqueUsers: number;
  userGrowthData: {
    date: string;
    newUsers: number;
    totalUsers: number;
  }[];
  weeklyUserGrowth: {
    week: string;
    newUsers: number;
    totalUsers: number;
  }[];
  onChainGrowthData: {
    date: string;
    transactions: number;
    cumulative: number;
  }[];
  totalUsers: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toString();
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'stance':
    case 'stance_created':
      return Target;
    case 'comment':
    case 'comment_made':
      return MessageSquare;
    case 'vote':
    case 'vote_cast':
      return ThumbsUp;
    case 'review':
    case 'review_submitted':
      return Star;
    case 'follow':
      return Users;
    default:
      return Activity;
  }
}

function getActivityColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'stance':
    case 'stance_created':
      return 'bg-purple-500';
    case 'comment':
    case 'comment_made':
      return 'bg-blue-500';
    case 'vote':
    case 'vote_cast':
      return 'bg-green-500';
    case 'review':
    case 'review_submitted':
      return 'bg-amber-500';
    case 'follow':
      return 'bg-cyan-500';
    default:
      return 'bg-slate-500';
  }
}

function truncateHash(hash: string): string {
  if (!hash) return 'N/A';
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export default function Metrics() {
  const { data: metrics, isLoading, error } = useQuery<OgMetrics>({
    queryKey: ['/api/0g/metrics'],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              0G Storage Metrics
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            On-chain performance and storage usage analytics for DAO AI CREDA platform
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <p className="text-red-600 dark:text-red-400">Failed to load metrics. Please try again later.</p>
            </CardContent>
          </Card>
        ) : metrics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Zap className="w-4 h-4" />
                    Total Transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {formatNumber(metrics.totalTransactions)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {metrics.weeklyGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                    )}
                    <span className={`text-xs ${metrics.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.weeklyGrowth >= 0 ? '+' : ''}{metrics.weeklyGrowth.toFixed(1)}% this week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <HardDrive className="w-4 h-4" />
                    Total Storage Used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {formatBytes(metrics.totalStorageBytes)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {metrics.monthlyGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                    )}
                    <span className={`text-xs ${metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}% this month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Users className="w-4 h-4" />
                    Total Users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {formatNumber(metrics.totalUsers || 0)}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Registered on platform
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Zap className="w-4 h-4" />
                    On-Chain Users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                    {formatNumber(metrics.uniqueUsers)}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Users with 0G activity
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="user-growth" className="space-y-6">
              <TabsList className="bg-white dark:bg-slate-800 border shadow-sm flex-wrap">
                <TabsTrigger value="user-growth" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User Growth
                </TabsTrigger>
                <TabsTrigger value="onchain-chart" className="flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4" />
                  On-Chain Activity
                </TabsTrigger>
                <TabsTrigger value="breakdown" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Activity Breakdown
                </TabsTrigger>
                <TabsTrigger value="daily" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Daily Stats
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Recent Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user-growth">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Total User Growth
                      </CardTitle>
                      <CardDescription>
                        Cumulative user registrations over the last 60 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={metrics.userGrowthData?.slice(-30) || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fontSize: 11 }}
                              className="fill-slate-600"
                            />
                            <YAxis tick={{ fontSize: 11 }} className="fill-slate-600" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              formatter={(value: number) => [value.toLocaleString(), 'Total Users']}
                            />
                            <Area
                              type="monotone"
                              dataKey="totalUsers"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorUsers)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-center">
                        <span className="text-2xl font-bold text-purple-600">{metrics.totalUsers?.toLocaleString() || 0}</span>
                        <span className="text-slate-500 ml-2">total users</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        New User Signups
                      </CardTitle>
                      <CardDescription>
                        Daily new user registrations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.userGrowthData?.slice(-14) || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              formatter={(value: number) => [value, 'New Users']}
                            />
                            <Bar
                              dataKey="newUsers"
                              fill="#10b981"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Weekly User Growth Summary
                      </CardTitle>
                      <CardDescription>
                        Weekly aggregated user signups with cumulative totals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={metrics.weeklyUserGrowth || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="week" 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                              }}
                              tick={{ fontSize: 10 }}
                            />
                            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                            />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="newUsers"
                              name="New Users"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ fill: '#10b981', strokeWidth: 2 }}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="totalUsers"
                              name="Total Users"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="onchain-chart">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-600" />
                        Cumulative On-Chain Transactions
                      </CardTitle>
                      <CardDescription>
                        Total 0G Storage transactions recorded over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={metrics.onChainGrowthData || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorTxs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              formatter={(value: number) => [value.toLocaleString(), 'Total Transactions']}
                            />
                            <Area
                              type="monotone"
                              dataKey="cumulative"
                              stroke="#10b981"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorTxs)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Daily On-Chain Transactions
                      </CardTitle>
                      <CardDescription>
                        Number of transactions recorded per day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={metrics.onChainGrowthData || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              formatter={(value: number) => [value, 'Transactions']}
                            />
                            <Bar
                              dataKey="transactions"
                              fill="#3b82f6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-teal-600" />
                        Storage Growth Overview
                      </CardTitle>
                      <CardDescription>
                        Combined view of transactions and estimated storage growth
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={metrics.onChainGrowthData?.map(d => ({
                              ...d,
                              storageKB: (d.cumulative * metrics.averageRecordSize) / 1024
                            })) || []}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(value) => `${value.toFixed(1)} KB`} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                              }}
                              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="cumulative"
                              name="Total Transactions"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="storageKB"
                              name="Storage (KB)"
                              stroke="#14b8a6"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      Transaction Breakdown by Activity Type
                    </CardTitle>
                    <CardDescription>
                      Distribution of on-chain records across different platform activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.activityBreakdown.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        const colorClass = getActivityColor(activity.type);
                        return (
                          <div key={activity.type} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <span className="font-medium text-slate-900 dark:text-white capitalize">
                                    {activity.type.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                                    ({formatNumber(activity.count)} records)
                                  </span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="font-mono">
                                {activity.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <Progress 
                              value={activity.percentage} 
                              className="h-2"
                            />
                          </div>
                        );
                      })}
                      {metrics.activityBreakdown.length === 0 && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No activity data available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="daily">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Daily Transaction Volume
                    </CardTitle>
                    <CardDescription>
                      Transaction activity over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.dailyStats.slice(0, 14).map((day) => (
                        <div key={day.date} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 w-32">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded"
                                style={{ 
                                  width: `${Math.max(4, (day.transactions / Math.max(1, ...metrics.dailyStats.map(d => d.transactions))) * 100)}%` 
                                }}
                              />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {day.transactions} txs
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 w-24 text-right">
                            {formatBytes(day.bytes)}
                          </div>
                        </div>
                      ))}
                      {metrics.dailyStats.length === 0 && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No daily statistics available yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-purple-600" />
                      Recent On-Chain Transactions
                    </CardTitle>
                    <CardDescription>
                      Latest records stored on 0G Storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">TX Hash</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Root Hash</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Recorded At</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Verify</th>
                          </tr>
                        </thead>
                        <tbody>
                          {metrics.recentTransactions.map((tx) => {
                            const Icon = getActivityIcon(tx.activityType);
                            return (
                              <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm capitalize text-slate-700 dark:text-slate-300">
                                      {tx.activityType.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                                    {truncateHash(tx.ogTxHash)}
                                  </code>
                                </td>
                                <td className="py-3 px-4">
                                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                                    {truncateHash(tx.ogRootHash)}
                                  </code>
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                  {tx.ogRecordedAt ? formatDate(tx.ogRecordedAt) : formatDate(tx.createdAt)}
                                </td>
                                <td className="py-3 px-4">
                                  {tx.ogRootHash && tx.ogRootHash.startsWith('0x') && (
                                    <a
                                      href={`https://storagescan.0g.ai/file/${tx.ogRootHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                    >
                                      <Eye className="w-3 h-3" />
                                      View
                                    </a>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {metrics.recentTransactions.length === 0 && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No transactions recorded yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    Powered by 0G Storage
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    All platform activities are immutably stored on-chain for transparency and auditability
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
