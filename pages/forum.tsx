import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Search,
  Plus,
  Pin,
  Lock,
  Eye,
  MessageSquare,
  Calendar,
  User,
  ArrowRight,
  ChevronRight,
  Tag,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { ThreadCreationForm } from "@/components/thread-creation-form";

export default function Forum() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/forum/categories"],
  });

  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ["/api/forum/threads", { sort: sortBy }],
    queryFn: async () => {
      const response = await fetch(`/api/forum/threads?sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch threads');
      return response.json();
    }
  });

  const filteredCategories = categories?.filter(category => 
    !searchQuery || category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThreads = threads?.filter(thread => 
    (!selectedCategory || thread.categoryId?.toString() === selectedCategory) &&
    (!searchQuery || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      'MessageCircle': MessageCircle,
      'Lightbulb': TrendingUp,
      'Code': MessageSquare,
      'HelpCircle': Users,
      'Megaphone': MessageCircle,
      'Coffee': MessageCircle,
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || MessageCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Open Discussion Forum</h1>
              <p className="text-slate-600 mt-1">
                Connect, share ideas, and build together with the community
              </p>
            </div>
            {isAuthenticated && (
              <ThreadCreationForm>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Discussion
                </Button>
              </ThreadCreationForm>
            )}
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search discussions, topics, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "latest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("latest")}
              >
                <Clock className="w-4 h-4 mr-1" />
                Latest
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors ${
                      !selectedCategory ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">All Categories</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {threads?.length || 0}
                    </Badge>
                  </button>
                  
                  {categoriesLoading ? (
                    <div className="p-4 text-center text-slate-500">Loading categories...</div>
                  ) : (
                    filteredCategories?.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className={`w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors ${
                          selectedCategory === category.id.toString() ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div style={{ color: category.color }}>
                            {getIconComponent(category.icon)}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                              {category.description}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.threadCount || 0}
                        </Badge>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <CardTitle>
                      {selectedCategory 
                        ? categories?.find(c => c.id.toString() === selectedCategory)?.name 
                        : 'All Discussions'
                      }
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {filteredThreads?.length || 0} discussions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {threadsLoading ? (
                  <div className="p-6 text-center text-slate-500">Loading discussions...</div>
                ) : !filteredThreads?.length ? (
                  <div className="p-6 text-center text-slate-500">
                    {selectedCategory 
                      ? "No discussions in this category yet. Be the first to start one!"
                      : "No discussions found. Start a new conversation!"
                    }
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredThreads.map((thread) => (
                      <Link key={thread.id} href={`/thread/${thread.id}`}>
                        <div className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {thread.author?.username?.[0]?.toUpperCase() || 'U'}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                {thread.isPinned && (
                                  <Pin className="w-4 h-4 text-blue-500" />
                                )}
                                {thread.isLocked && (
                                  <Lock className="w-4 h-4 text-red-500" />
                                )}
                                <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                                  {thread.title}
                                </h3>
                              </div>
                              
                              <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                {thread.content}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{thread.author?.username || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{thread.commentCount || 0} replies</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{thread.upvotes || 0} upvotes</span>
                                </div>
                              </div>
                              
                              {/* Tags */}
                              {thread.tags && thread.tags.length > 0 && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Tag className="w-3 h-3 text-slate-400" />
                                  <div className="flex flex-wrap gap-1">
                                    {thread.tags.slice(0, 3).map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {thread.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{thread.tags.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Category Badge */}
                            {thread.category && (
                              <div className="flex-shrink-0">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: `${thread.category.color}20`,
                                    color: thread.category.color 
                                  }}
                                >
                                  {thread.category.name}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}