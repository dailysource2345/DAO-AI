import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "@/lib/time-utils";
import { 
  Award, 
  Star, 
  Trophy, 
  Crown,
  Target,
  Zap,
  Lock,
  CheckCircle
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'voting' | 'engagement' | 'reputation' | 'milestone' | 'special';
  iconType: 'award' | 'star' | 'trophy' | 'crown' | 'target' | 'zap';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface AchievementCategory {
  name: string;
  description: string;
  achievements: Achievement[];
}

export default function AchievementsPage() {
  const { user, isAuthenticated } = useAuth();

  // Fetch user achievements
  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['/api/user/achievements'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold text-slate-900 mb-2">Sign In Required</h1>
              <p className="text-slate-600">You need to be signed in to view your achievements.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case 'award': return <Award className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  // Group achievements by category
  const achievementCategories: AchievementCategory[] = [
    {
      name: "Voting & Participation",
      description: "Achievements for active participation in governance",
      achievements: (achievements as Achievement[]).filter(a => a.category === 'voting')
    },
    {
      name: "Community Engagement",
      description: "Achievements for building community connections",
      achievements: (achievements as Achievement[]).filter(a => a.category === 'engagement')
    },
    {
      name: "Reputation Building",
      description: "Achievements for establishing credibility",
      achievements: (achievements as Achievement[]).filter(a => a.category === 'reputation')
    },
    {
      name: "Milestones",
      description: "Major platform milestones and progress markers",
      achievements: (achievements as Achievement[]).filter(a => a.category === 'milestone')
    },
    {
      name: "Special Events",
      description: "Limited time and special occasion achievements",
      achievements: (achievements as Achievement[]).filter(a => a.category === 'special')
    }
  ].filter(category => category.achievements.length > 0);

  const totalAchievements = (achievements as Achievement[]).length;
  const unlockedAchievements = (achievements as Achievement[]).filter(a => a.isUnlocked).length;
  const totalXpEarned = (achievements as Achievement[])
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Achievements</h1>
          <p className="text-slate-600">Track your progress and unlock rewards for your contributions</p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {unlockedAchievements}/{totalAchievements}
                  </div>
                  <div className="text-sm text-slate-600">Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {Math.round((unlockedAchievements / totalAchievements) * 100)}%
                  </div>
                  <div className="text-sm text-slate-600">Completion</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{totalXpEarned}</div>
                  <div className="text-sm text-slate-600">XP Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(achievements as Achievement[]).filter(a => a.isUnlocked && a.rarity === 'rare').length}
                  </div>
                  <div className="text-sm text-slate-600">Rare+ Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : achievementCategories.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No achievements yet</h3>
                <p className="text-slate-500">
                  Start participating in governance activities to unlock your first achievements!
                </p>
              </CardContent>
            </Card>
          ) : (
            achievementCategories.map((category) => (
              <div key={category.name}>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">{category.name}</h2>
                  <p className="text-slate-600">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.achievements.map((achievement) => (
                    <Card 
                      key={achievement.id} 
                      className={`relative overflow-hidden transition-all duration-200 ${
                        achievement.isUnlocked 
                          ? 'border-2 border-transparent bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-xl' 
                          : 'opacity-75 hover:opacity-90'
                      }`}
                    >
                      {achievement.isUnlocked && (
                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${getRarityGradient(achievement.rarity)} opacity-10`} />
                      )}
                      
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            achievement.isUnlocked 
                              ? `bg-gradient-to-br ${getRarityGradient(achievement.rarity)} text-white` 
                              : 'bg-slate-200 text-slate-400'
                          }`}>
                            {achievement.isUnlocked ? getAchievementIcon(achievement.iconType) : <Lock className="w-6 h-6" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-medium ${achievement.isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                                  {achievement.name}
                                </h3>
                                <p className={`text-sm mt-1 ${achievement.isUnlocked ? 'text-slate-600' : 'text-slate-500'}`}>
                                  {achievement.description}
                                </p>
                              </div>
                              
                              {achievement.isUnlocked && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <Badge className={getRarityColor(achievement.rarity)}>
                                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                              </Badge>
                              
                              <div className="flex items-center space-x-2">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-slate-600">+{achievement.xpReward} XP</span>
                              </div>
                            </div>

                            {/* Progress Bar for Unlocked Achievements */}
                            {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-500">Progress</span>
                                  <span className="text-xs text-slate-500">
                                    {achievement.progress}/{achievement.maxProgress}
                                  </span>
                                </div>
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
                                  className="h-2"
                                />
                              </div>
                            )}

                            {/* Unlock Date */}
                            {achievement.isUnlocked && achievement.unlockedAt && (
                              <div className="mt-3 text-xs text-slate-500">
                                Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}