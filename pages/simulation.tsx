import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Activity, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Star,
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface SimulationStatus {
  isRunning: boolean;
  actionType: string;
  targetCount: number;
  completedCount: number;
  durationMinutes: number;
  startedAt: string | null;
  estimatedEndAt: string | null;
  actions: Array<{
    type: string;
    userId: string;
    timestamp: string;
    onChainTxHash?: string;
  }>;
}

export default function SimulationPage() {
  const [actionType, setActionType] = useState<string>('votes');
  const [targetCount, setTargetCount] = useState<string>('50');
  const [durationMinutes, setDurationMinutes] = useState<string>('120');

  const { data: status, isLoading, refetch } = useQuery<SimulationStatus>({
    queryKey: ['/api/admin/simulation/status'],
    refetchInterval: (query) => query.state.data?.isRunning ? 2000 : 10000,
  });

  const startMutation = useMutation({
    mutationFn: async (config: { actionType: string; targetCount: number; durationMinutes: number }) => {
      const response = await apiRequest('POST', '/api/admin/simulation/start', config);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/simulation/status'] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/simulation/stop');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/simulation/status'] });
    },
  });

  const handleStart = () => {
    startMutation.mutate({
      actionType,
      targetCount: parseInt(targetCount),
      durationMinutes: parseInt(durationMinutes),
    });
  };

  const handleStop = () => {
    stopMutation.mutate();
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'votes': return <ThumbsUp className="w-4 h-4" />;
      case 'comments': return <MessageSquare className="w-4 h-4" />;
      case 'reviews': return <Star className="w-4 h-4" />;
      case 'mixed': return <Activity className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const progress = status && status.targetCount > 0
    ? (status.completedCount / status.targetCount) * 100
    : 0;

  const timeRemaining = status?.estimatedEndAt
    ? Math.max(0, Math.round((new Date(status.estimatedEndAt).getTime() - Date.now()) / 60000))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Activity Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create real platform activity using existing user accounts - all actions appear live in the app and are recorded on-chain via 0G Storage
          </p>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> This creates actual votes, comments, and reviews in the database. 
              They will appear throughout the platform as real user activity.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Generator Configuration
              </CardTitle>
              <CardDescription>
                Configure and launch activity generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="actionType">Action Type</Label>
                <Select 
                  value={actionType} 
                  onValueChange={setActionType}
                  disabled={status?.isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="votes">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Votes (Upvotes on issues/comments)
                      </div>
                    </SelectItem>
                    <SelectItem value="comments">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Comments (On governance issues)
                      </div>
                    </SelectItem>
                    <SelectItem value="reviews">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Reviews (User reviews)
                      </div>
                    </SelectItem>
                    <SelectItem value="mixed">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Mixed (Random combination)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCount">Target Actions</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    placeholder="50"
                    disabled={status?.isRunning}
                    min="1"
                    max="1000"
                  />
                  <p className="text-xs text-slate-500">Number of actions to generate</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="120"
                    disabled={status?.isRunning}
                    min="1"
                    max="1440"
                  />
                  <p className="text-xs text-slate-500">Spread actions over this time</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span>Estimated rate:</span>
                  <span className="font-medium">
                    ~{(parseInt(targetCount) / parseInt(durationMinutes) || 0).toFixed(2)} actions/min
                  </span>
                </div>

                {status?.isRunning ? (
                  <Button 
                    onClick={handleStop}
                    disabled={stopMutation.isPending}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    {stopMutation.isPending ? 'Stopping...' : 'Stop Generation'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStart}
                    disabled={startMutation.isPending || !targetCount || !durationMinutes}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {startMutation.isPending ? 'Starting...' : 'Start Generation'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Live Activity Status
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={status?.isRunning ? 'default' : 'secondary'}
                  className={status?.isRunning ? 'bg-emerald-500 animate-pulse' : ''}
                >
                  {status?.isRunning ? 'RUNNING' : 'IDLE'}
                </Badge>
                {status?.isRunning && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {getActionIcon(status.actionType)}
                    <span className="capitalize">{status.actionType}</span>
                  </div>
                )}
              </div>

              {status?.isRunning && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {status.completedCount} / {status.targetCount}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{timeRemaining} min remaining
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-emerald-600">
                        {status.completedCount}
                      </div>
                      <div className="text-xs text-slate-500">Actions Completed</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {status.targetCount - status.completedCount}
                      </div>
                      <div className="text-xs text-slate-500">Remaining</div>
                    </div>
                  </div>
                </>
              )}

              {!status?.isRunning && (status?.completedCount ?? 0) > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-emerald-700 dark:text-emerald-400">
                      Activity generation completed
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-500">
                      {status.completedCount} real actions created in database
                    </div>
                  </div>
                </div>
              )}

              {!status?.isRunning && (status?.completedCount ?? 0) === 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-slate-600 dark:text-slate-400">
                    No simulation running
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Configure and start a simulation to generate activity
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Recent Actions
              </CardTitle>
              <CardDescription>
                Latest simulated actions (recorded on 0G Storage)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status?.actions && status.actions.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {status.actions.slice().reverse().map((action, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          action.type === 'vote' ? 'bg-blue-100 text-blue-600' :
                          action.type === 'comment' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {action.type === 'vote' && <ThumbsUp className="w-4 h-4" />}
                          {action.type === 'comment' && <MessageSquare className="w-4 h-4" />}
                          {action.type === 'review' && <Star className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{action.type}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.onChainTxHash && (
                          <a
                            href={`https://storagescan.0g.ai/tx/${action.onChainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            On-chain
                          </a>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {action.userId.slice(0, 8)}...
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No actions generated yet</p>
                  <p className="text-sm mt-1">Start a simulation to see activity here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Quick Presets
              </CardTitle>
              <CardDescription>
                One-click configurations for common scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-start"
                  disabled={status?.isRunning}
                  onClick={() => {
                    setActionType('votes');
                    setTargetCount('24');
                    setDurationMinutes('120');
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ThumbsUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Light Activity</span>
                  </div>
                  <span className="text-xs text-slate-500">24 votes over 2 hours</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-start"
                  disabled={status?.isRunning}
                  onClick={() => {
                    setActionType('mixed');
                    setTargetCount('50');
                    setDurationMinutes('180');
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">Demo Mode</span>
                  </div>
                  <span className="text-xs text-slate-500">50 mixed actions over 3 hours</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col items-start"
                  disabled={status?.isRunning}
                  onClick={() => {
                    setActionType('votes');
                    setTargetCount('100');
                    setDurationMinutes('360');
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">Growth Burst</span>
                  </div>
                  <span className="text-xs text-slate-500">100 votes over 6 hours</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
