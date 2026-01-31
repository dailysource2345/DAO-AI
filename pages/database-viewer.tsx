import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Building, 
  Database,
  Activity,
  UserCheck,
  Share2
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/time-utils";

interface User {
  id: string;
  username: string;
  email: string;
  totalScore: number;
  grsScore: number;
  grsPercentile: number;
  authProvider: string;
  createdAt: string;
  onboardingCompletedAt: string;
  threadsCreated: number;
  commentsMade: number;
  votesCast: number;
  daosActiveIn: number;
  daosFollowing: number;
  referralsMade: number;
  referralsReceived: number;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  authorId: string;
  daoId: number;
  upvotes: number;
  commentCount: number;
  createdAt: string;
  author: { username: string };
  dao: { name: string };
}

interface Comment {
  id: number;
  content: string;
  authorId: string;
  threadId: number;
  upvotes: number;
  createdAt: string;
  author: { username: string };
  thread: { title: string };
}

interface Vote {
  id: number;
  userId: string;
  targetType: string;
  targetId: number;
  createdAt: string;
  user: { username: string };
}

interface Dao {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdBy: string;
  createdAt: string;
  creator: { username: string };
}

export default function DatabaseViewer() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ["/api/admin/threads"],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["/api/admin/comments"],
  });

  const { data: votes, isLoading: votesLoading } = useQuery({
    queryKey: ["/api/admin/votes"],
  });

  const { data: daos, isLoading: daosLoading } = useQuery({
    queryKey: ["/api/daos"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Database Viewer</h1>
          </div>
          <p className="text-slate-600">
            View all your governance data and user activity in one place
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total DAOs</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalDaos || 0}</p>
                </div>
                <Building className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Threads</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalThreads || 0}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Comments</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalComments || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="daos">DAOs</TabsTrigger>
            <TabsTrigger value="threads">Threads</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="votes">Votes</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Users & Their Governance Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user: User) => (
                      <div key={user.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {user.username || 'No username'}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {user.email || 'No email'}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {user.id}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {user.authProvider}
                            </Badge>
                            <Badge variant="secondary">
                              GRS: {user.grsScore}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-slate-600">Total Score</p>
                            <p className="text-slate-900">{user.totalScore}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">Threads Created</p>
                            <p className="text-slate-900">{user.threadsCreated}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">Comments Made</p>
                            <p className="text-slate-900">{user.commentsMade}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">Votes Cast</p>
                            <p className="text-slate-900">{user.votesCast}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">DAOs Active</p>
                            <p className="text-slate-900">{user.daosActiveIn}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">DAOs Following</p>
                            <p className="text-slate-900">{user.daosFollowing}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">Referrals Made</p>
                            <p className="text-slate-900">{user.referralsMade}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-600">Account Age</p>
                            <p className="text-slate-900">
                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  DAOs in Your Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                {daosLoading ? (
                  <div>Loading DAOs...</div>
                ) : (
                  <div className="space-y-4">
                    {daos?.map((dao: Dao) => (
                      <div key={dao.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{dao.name}</h3>
                            <p className="text-sm text-slate-600">/{dao.slug}</p>
                            <p className="text-xs text-slate-500">
                              Created {formatDistanceToNow(new Date(dao.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge variant="outline">ID: {dao.id}</Badge>
                        </div>
                        
                        <p className="text-sm text-slate-700 mb-3">
                          {dao.description || 'No description'}
                        </p>
                        
                        {dao.creator && (
                          <p className="text-xs text-slate-500">
                            Created by: {dao.creator.username}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Governance Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {threadsLoading ? (
                  <div>Loading threads...</div>
                ) : (
                  <div className="space-y-4">
                    {threads?.map((thread: Thread) => (
                      <div key={thread.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{thread.title}</h3>
                            <p className="text-sm text-slate-600">
                              by {thread.author?.username} in {thread.dao?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {thread.upvotes}
                            </Badge>
                            <Badge variant="secondary">
                              {thread.commentCount} comments
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-700 line-clamp-3">
                          {thread.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  User Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {commentsLoading ? (
                  <div>Loading comments...</div>
                ) : (
                  <div className="space-y-4">
                    {comments?.map((comment: Comment) => (
                      <div key={comment.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Comment on: {comment.thread?.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              by {comment.author?.username}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge variant="outline">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.upvotes}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-700">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  Voting Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {votesLoading ? (
                  <div>Loading votes...</div>
                ) : (
                  <div className="space-y-4">
                    {votes?.map((vote: Vote) => (
                      <div key={vote.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              Vote on {vote.targetType}
                            </h3>
                            <p className="text-sm text-slate-600">
                              by {vote.user?.username}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Target ID: {vote.targetId}
                          </Badge>
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