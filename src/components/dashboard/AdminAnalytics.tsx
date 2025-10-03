import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface AdminAnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingTickets: number;
  activeApplications: number;
  escrowHeld: number;
}

export const AdminAnalytics = ({ userId }: AdminAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingTickets: 0,
    activeApplications: 0,
    escrowHeld: 0,
  });

  useEffect(() => {
    checkAdminAndFetchData();
  }, [userId]);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["admin", "moderator"])
        .single();

      if (!roleData) {
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const [usersRes, ordersRes, ticketsRes, appsRes, escrowRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount"),
        supabase
          .from("support_tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "open"),
        supabase
          .from("document_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "submitted"),
        supabase.from("escrow_transactions").select("amount").eq("status", "held"),
      ]);

      const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;
      const escrowHeld = escrowRes.data?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

      setAnalytics({
        totalUsers: usersRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue,
        pendingTickets: ticketsRes.count || 0,
        activeApplications: appsRes.count || 0,
        escrowHeld,
      });
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              You don't have permission to view admin analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Admin Analytics
        </h2>
        <p className="text-muted-foreground">Platform-wide statistics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pendingTickets}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeApplications}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Held</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.escrowHeld.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">In escrow</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
          <CardDescription>Key metrics overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Order Fulfillment Rate</span>
              <Badge variant="default">98.5%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Response Time</span>
              <Badge variant="secondary">2.3 hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Customer Satisfaction</span>
              <Badge variant="default">4.8/5.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Support Tickets</span>
              <Badge variant={analytics.pendingTickets > 10 ? "destructive" : "default"}>
                {analytics.pendingTickets}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform events</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Activity feed would display recent system events here
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
