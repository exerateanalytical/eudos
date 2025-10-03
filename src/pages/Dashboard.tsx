import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { LogOut, Home, Bell } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardBreadcrumbs } from "@/components/dashboard/DashboardBreadcrumbs";
import { DashboardErrorBoundary } from "@/components/dashboard/DashboardErrorBoundary";
import { DashboardLoadingSkeleton } from "@/components/dashboard/DashboardLoadingSkeleton";
import { AdminCreationModule } from "@/components/dashboard/AdminCreationModule";

// Lazy load route components for better performance
const DashboardOverview = lazy(() => import("@/components/dashboard/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const OrdersModule = lazy(() => import("@/components/dashboard/OrdersModule"));
const DocumentApplicationsModule = lazy(() => import("@/components/dashboard/DocumentApplicationsModule"));
const WalletModule = lazy(() => import("@/components/dashboard/WalletModule").then(m => ({ default: m.WalletModule })));
const DocumentWallet = lazy(() => import("@/components/dashboard/DocumentWallet").then(m => ({ default: m.DocumentWallet })));
const ActivityLog = lazy(() => import("@/components/dashboard/ActivityLog").then(m => ({ default: m.ActivityLog })));
const SupportCenter = lazy(() => import("@/components/dashboard/SupportCenter").then(m => ({ default: m.SupportCenter })));
const LoyaltyProgram = lazy(() => import("@/components/dashboard/LoyaltyProgram").then(m => ({ default: m.LoyaltyProgram })));
const ReferralSystem = lazy(() => import("@/components/dashboard/ReferralSystem").then(m => ({ default: m.ReferralSystem })));
const SettingsHub = lazy(() => import("@/components/dashboard/SettingsHub").then(m => ({ default: m.SettingsHub })));
const NotificationsPanel = lazy(() => import("@/components/dashboard/NotificationsPanel"));
const ProfileModule = lazy(() => import("@/components/dashboard/ProfileModule"));
const SecurityModule = lazy(() => import("@/components/dashboard/SecurityModule"));
const SeedingModule = lazy(() => import("@/components/dashboard/SeedingModule").then(m => ({ default: m.SeedingModule })));

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    const pageName = paths[paths.length - 1] || "Dashboard";
    const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.title = `${formattedName} - Dashboard`;
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/20">
        <DashboardSidebar isAdmin={isAdmin} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger />
                <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/dashboard/notifications")}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                  <Home className="mr-0 md:mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Home</span>
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-0 md:mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-6 py-6 overflow-auto">
            {location.pathname === "/dashboard" && (
              <Card className="mb-6 animate-fade-in">
                <CardHeader>
                  <CardTitle>Welcome back, {user?.user_metadata?.full_name || user?.email}</CardTitle>
                  <CardDescription>Manage your account, orders, and applications</CardDescription>
                </CardHeader>
              </Card>
            )}

            {!isAdmin && adminsExist === false && (
              <div className="mb-6 animate-fade-in">
                <AdminCreationModule onCreated={() => { setAdminsExist(true); }} />
              </div>
            )}

            <DashboardBreadcrumbs />
            
            <DashboardErrorBoundary>
              <Suspense fallback={<DashboardLoadingSkeleton />}>
                <div className="animate-fade-in">
                  <Routes>
                    <Route path="/" element={<DashboardOverview userId={user?.id!} />} />
                    <Route path="orders" element={<OrdersModule userId={user?.id!} />} />
                    <Route path="applications" element={<DocumentApplicationsModule userId={user?.id!} />} />
                    <Route path="wallet" element={<WalletModule userId={user?.id!} />} />
                    <Route path="documents" element={<DocumentWallet userId={user?.id!} />} />
                    <Route path="activity" element={<ActivityLog userId={user?.id!} />} />
                    <Route path="support" element={<SupportCenter userId={user?.id!} />} />
                    <Route path="loyalty" element={<LoyaltyProgram userId={user?.id!} />} />
                    <Route path="referrals" element={<ReferralSystem userId={user?.id!} />} />
                    <Route path="settings" element={<SettingsHub userId={user?.id!} />} />
                    <Route path="notifications" element={<NotificationsPanel userId={user?.id!} />} />
                    <Route path="profile" element={<ProfileModule userId={user?.id!} />} />
                    <Route path="security" element={<SecurityModule userId={user?.id!} />} />
                    {isAdmin && (
                      <>
                        <Route path="seeding" element={<SeedingModule />} />
                      </>
                    )}
                  </Routes>
                </div>
              </Suspense>
            </DashboardErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
