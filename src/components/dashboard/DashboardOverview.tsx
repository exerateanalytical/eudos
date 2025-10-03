import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FileText, Bell, Shield, TrendingUp, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalOrders: number;
  activeApplications: number;
  unreadNotifications: number;
  escrowHeld: number;
  securityScore: number;
}

interface DashboardOverviewProps {
  userId: string;
}

export const DashboardOverview = ({ userId }: DashboardOverviewProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeApplications: 0,
    unreadNotifications: 0,
    escrowHeld: 0,
    securityScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // Fetch active applications
      const { count: appsCount } = await supabase
        .from("document_applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("status", ["submitted", "processing"]);

      // Fetch unread notifications
      const { count: notifCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      // Fetch escrow held amount
      const { data: escrowData } = await supabase
        .from("escrow_transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("status", "held");

      const totalEscrow = escrowData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Calculate security score
      const { data: twoFaData } = await supabase
        .from("two_factor_auth")
        .select("is_enabled")
        .eq("user_id", userId)
        .maybeSingle();

      const { data: pgpData } = await supabase
        .from("pgp_keys")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      let securityScore = 40; // Base score
      if (twoFaData?.is_enabled) securityScore += 30;
      if (pgpData) securityScore += 30;

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalOrders: ordersCount || 0,
        activeApplications: appsCount || 0,
        unreadNotifications: notifCount || 0,
        escrowHeld: totalEscrow,
        securityScore,
      });

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeApplications}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.securityScore}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.securityScore < 70 ? "Needs improvement" : "Good"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      {stats.escrowHeld > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Escrow Overview
            </CardTitle>
            <CardDescription>Funds currently held in escrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.escrowHeld.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">Protected by secure escrow</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button onClick={() => navigate("/apply")} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Button>
            <Button onClick={() => navigate("/products/id-card")} variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Order Document
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              View Notifications
            </Button>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{activity.action_description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
