import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, ShieldCheck, FileText, Package, User as UserIcon, Lock, Home, Bell, Eye } from "lucide-react";
import OrdersModule from "@/components/dashboard/OrdersModule";
import DocumentApplicationsModule from "@/components/dashboard/DocumentApplicationsModule";
import ProfileModule from "@/components/dashboard/ProfileModule";
import SecurityModule from "@/components/dashboard/SecurityModule";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import NotificationBell from "@/components/NotificationBell";
import { ReviewModerationModule } from "@/components/dashboard/ReviewModerationModule";
import { SeedingModule } from "@/components/dashboard/SeedingModule";
import { AdminCreationModule } from "@/components/dashboard/AdminCreationModule";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminsExist, setAdminsExist] = useState<boolean | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
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

    // Realtime subscription for unread count
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
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome back, {user?.user_metadata?.full_name || user?.email}</CardTitle>
            <CardDescription>Manage your account, orders, and applications</CardDescription>
          </CardHeader>
        </Card>

        { !isAdmin && (
          <div className="mb-6">
            <AdminCreationModule onCreated={() => { setAdminsExist(true); }} />
          </div>
        )}

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3 lg:grid-cols-7' : 'grid-cols-2 lg:grid-cols-5'}`}>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="seeding" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Seeding
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="orders">
            <OrdersModule userId={user?.id!} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentApplicationsModule userId={user?.id!} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsPanel userId={user?.id!} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileModule userId={user?.id!} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityModule userId={user?.id!} />
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="reviews">
                <ReviewModerationModule />
              </TabsContent>
              <TabsContent value="seeding">
                <SeedingModule />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;