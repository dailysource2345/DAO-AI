import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { AdminAuth } from "@/components/admin-auth";

export function Admin2() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if admin is already authenticated by testing server session
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

  const handleAdminAuth = () => {
    setIsAuthenticated(true);
  };

  // Show admin auth if not authenticated
  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAdminAuth} />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage platform features and settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Dashboard Overview</CardTitle>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to the admin dashboard. Admin features can be added here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
