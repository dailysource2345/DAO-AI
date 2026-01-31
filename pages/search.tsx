import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Search, Users, MessageSquare, ChevronRight, Home, User } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { DaoCard } from "@/components/dao-card";
import { GovernanceIssueCard } from "@/components/governance-issue-card";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', query],
    queryFn: () => fetch(`/api/search?q=${encodeURIComponent(query)}`).then(res => res.json()),
    enabled: query.length >= 2,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="flex items-center hover:text-slate-700 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/home" className="hover:text-slate-700 transition-colors">
            Active DAOs
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Search Results</span>
        </div>

        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-slate-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-slate-600">
              Results for "<span className="font-medium">{query}</span>"
            </p>
          )}
        </div>

        {!query || query.length < 2 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                Start Your Search
              </h3>
              <p className="text-slate-500">
                Enter at least 2 characters to search for DAOs and governance issues
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Search className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Searching...</h3>
              <p className="text-slate-600 mb-4">Finding the best results for you</p>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* DAOs Results */}
            {searchResults?.daos && searchResults.daos.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    DAOs ({searchResults.daos.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {searchResults.daos.map((dao: any) => (
                    <DaoCard key={dao.id} dao={dao} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {searchResults?.users && searchResults.users.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Users ({searchResults.users.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.users.map((user: any) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link href={`/profile/${user.username}`}>
                          <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-sm">
                                {user.firstName?.[0] || user.username?.[0] || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username
                                }
                              </p>
                              <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Governance Issues Results */}
            {searchResults?.threads && searchResults.threads.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Governance Issues ({searchResults.threads.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {searchResults.threads.map((thread: any) => (
                    <Card key={thread.id}>
                      <CardContent className="p-6">
                        <GovernanceIssueCard issue={thread} showDao />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults && 
             (!searchResults.daos || searchResults.daos.length === 0) && 
             (!searchResults.threads || searchResults.threads.length === 0) &&
             (!searchResults.users || searchResults.users.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-slate-500 mb-4">
                    No DAOs or governance issues match your search for "{query}"
                  </p>
                  <div className="text-sm text-slate-400">
                    <p>Try searching for:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• DAO names (e.g., "Jupiter", "Solana")</li>
                      <li>• Usernames (e.g., "@username")</li>
                      <li>• Governance topics (e.g., "proposal", "voting")</li>
                      <li>• Keywords from issue titles or content</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}