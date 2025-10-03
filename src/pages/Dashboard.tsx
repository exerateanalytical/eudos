import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { LogOut, Home } from "lucide-react";
import OrdersModule from "@/components/dashboard/OrdersModule";
import DocumentApplicationsModule from "@/components/dashboard/DocumentApplicationsModule";
import ProfileModule from "@/components/dashboard/ProfileModule";
import SecurityModule from "@/components/dashboard/SecurityModule";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import NotificationBell from "@/components/NotificationBell";
import { ReviewModerationModule } from "@/components/dashboard/ReviewModerationModule";
import { SeedingModule } from "@/components/dashboard/SeedingModule";
import { AdminCreationModule } from "@/components/dashboard/AdminCreationModule";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DocumentWallet } from "@/components/dashboard/DocumentWallet";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { WalletModule } from "@/components/dashboard/WalletModule";
import { SupportCenter } from "@/components/dashboard/SupportCenter";
import { SettingsHub } from "@/components/dashboard/SettingsHub";
import { LoyaltyProgram } from "@/components/dashboard/LoyaltyProgram";
import { ReferralSystem } from "@/components/dashboard/ReferralSystem";
import { AdminAnalytics } from "@/components/dashboard/AdminAnalytics";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminsExist, setAdminsExist] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const checkAdminStatus = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "moderator"])
        .maybeSingle();

      if (!error && data) {
        setIsAdmin(true);
      }
    };

    const checkAdminsExist = async () => {
      const { count } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .in("role", ["admin", "moderator"]);
      setAdminsExist((count || 0) > 0);
    };

    checkAdminStatus();
    checkAdminsExist();

    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('notifications-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/20">
        <DashboardSidebar isAdmin={isAdmin} />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </div>
              <div className="flex gap-2 items-center">
                {user && <NotificationBell userId={user.id} />}
                <Button variant="outline" onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome back, {user?.user_metadata?.full_name || user?.email}</CardTitle>
                <CardDescription>Manage your account, orders, and applications</CardDescription>
              </CardHeader>
            </Card>

            {!isAdmin && (
              <div className="mb-6">
                <AdminCreationModule onCreated={() => { setAdminsExist(true); }} />
              </div>
            )}

            <Routes>
              <Route path="/" element={<DashboardOverview userId={user?.id!} />} />
              <Route path="/orders" element={<OrdersModule userId={user?.id!} />} />
              <Route path="/applications" element={<DocumentApplicationsModule userId={user?.id!} />} />
              <Route path="/wallet" element={<WalletModule userId={user?.id!} />} />
              <Route path="/documents" element={<DocumentWallet userId={user?.id!} />} />
              <Route path="/activity" element={<ActivityLog userId={user?.id!} />} />
              <Route path="/support" element={<SupportCenter userId={user?.id!} />} />
              <Route path="/loyalty" element={<LoyaltyProgram userId={user?.id!} />} />
              <Route path="/referrals" element={<ReferralSystem userId={user?.id!} />} />
              <Route path="/settings" element={<SettingsHub userId={user?.id!} />} />
              <Route path="/notifications" element={<NotificationsPanel userId={user?.id!} />} />
              <Route path="/profile" element={<ProfileModule userId={user?.id!} />} />
              <Route path="/security" element={<SecurityModule userId={user?.id!} />} />
              {isAdmin && (
                <>
                  <Route path="/reviews" element={<ReviewModerationModule />} />
                  <Route path="/analytics" element={<AdminAnalytics userId={user?.id!} />} />
                  <Route path="/seeding" element={<SeedingModule />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
