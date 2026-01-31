import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, RotateCcw, Users, Activity, MessageSquare, Star, Trophy, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { AdminAuth } from "@/components/admin-auth";

interface AdminOverrides {
  totalUsers: number | null;
  activeUsers: number | null;
  totalStances: number | null;
  totalReviews: number | null;
  totalComments: number | null;
  totalXpAwarded: number | null;
  totalDaos: number | null;
  totalVotes: number | null;
}

const STORAGE_KEY = "admin_stats_overrides";

export default function Admin5() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [overrides, setOverrides] = useState<AdminOverrides>({
    totalUsers: null,
    activeUsers: null,
    totalStances: null,
    totalReviews: null,
    totalComments: null,
    totalXpAwarded: null,
    totalDaos: null,
    totalVotes: null,
  });

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
        // Not authenticated
      }
    };
    checkAdminAuth();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setOverrides(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved overrides");
      }
    }
  }, []);

  const handleChange = (field: keyof AdminOverrides, value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    setOverrides(prev => ({
      ...prev,
      [field]: isNaN(numValue as number) ? null : numValue
    }));
  };

  const saveOverrides = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    toast({
      title: "Saved!",
      description: "Admin stats overrides have been saved. Refresh the main admin page to see changes.",
    });
  };

  const resetToReal = () => {
    const emptyOverrides: AdminOverrides = {
      totalUsers: null,
      activeUsers: null,
      totalStances: null,
      totalReviews: null,
      totalComments: null,
      totalXpAwarded: null,
      totalDaos: null,
      totalVotes: null,
    };
    setOverrides(emptyOverrides);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Reset Complete",
      description: "All overrides cleared. Admin page will now show real data.",
    });
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Stats Override</h1>
              <p className="text-slate-600">Manually set dashboard statistics for display purposes</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Override Dashboard Numbers
            </CardTitle>
            <p className="text-sm text-slate-500">
              Leave fields empty to show real data. Enter a number to override.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Total Users
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalUsers ?? ""}
                  onChange={(e) => handleChange("totalUsers", e.target.value)}
                  data-testid="input-total-users"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  Active Users (7d)
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.activeUsers ?? ""}
                  onChange={(e) => handleChange("activeUsers", e.target.value)}
                  data-testid="input-active-users"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  Total Stances
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalStances ?? ""}
                  onChange={(e) => handleChange("totalStances", e.target.value)}
                  data-testid="input-total-stances"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-600" />
                  Total Reviews
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalReviews ?? ""}
                  onChange={(e) => handleChange("totalReviews", e.target.value)}
                  data-testid="input-total-reviews"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Total Comments
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalComments ?? ""}
                  onChange={(e) => handleChange("totalComments", e.target.value)}
                  data-testid="input-total-comments"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  Total XP Awarded
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalXpAwarded ?? ""}
                  onChange={(e) => handleChange("totalXpAwarded", e.target.value)}
                  data-testid="input-total-xp"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Total DAOs
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalDaos ?? ""}
                  onChange={(e) => handleChange("totalDaos", e.target.value)}
                  data-testid="input-total-daos"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-pink-600" />
                  Total Votes
                </Label>
                <Input
                  type="number"
                  placeholder="Leave empty for real data"
                  value={overrides.totalVotes ?? ""}
                  onChange={(e) => handleChange("totalVotes", e.target.value)}
                  data-testid="input-total-votes"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={saveOverrides} className="gap-2 bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4" />
                Save Overrides
              </Button>
              <Button onClick={resetToReal} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <RotateCcw className="h-4 w-4" />
                Reset to Real Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> These overrides only affect the display on the admin dashboard. 
              They do not modify actual database records. Changes are stored in your browser's local storage.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
