import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Shield } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardLoadingSkeleton } from "@/components/dashboard/DashboardLoadingSkeleton";

const UserManagement = lazy(() => import("@/components/dashboard/UserManagement").then(m => ({ default: m.UserManagement })));
const ProductManagement = lazy(() => import("@/components/dashboard/ProductManagement").then(m => ({ default: m.ProductManagement })));
const CategoryManagement = lazy(() => import("@/components/dashboard/CategoryManagement").then(m => ({ default: m.CategoryManagement })));
const OrderManagement = lazy(() => import("@/components/dashboard/OrderManagement").then(m => ({ default: m.OrderManagement })));
const ApplicationManagement = lazy(() => import("@/components/dashboard/ApplicationManagement").then(m => ({ default: m.ApplicationManagement })));
const PaymentManagement = lazy(() => import("@/components/dashboard/PaymentManagement").then(m => ({ default: m.PaymentManagement })));
const BitcoinWalletManagement = lazy(() => import("@/components/dashboard/BitcoinWalletManagement").then(m => ({ default: m.BitcoinWalletManagement })));
const InquiryManagement = lazy(() => import("@/components/dashboard/InquiryManagement").then(m => ({ default: m.InquiryManagement })));
const BlogManagement = lazy(() => import("@/components/dashboard/BlogManagement").then(m => ({ default: m.BlogManagement })));
const ReviewModerationModule = lazy(() => import("@/components/dashboard/ReviewModerationModule").then(m => ({ default: m.ReviewModerationModule })));
const AdminAnalytics = lazy(() => import("@/components/dashboard/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })));
const SupportTicketManagement = lazy(() => import("@/components/dashboard/SupportTicketManagement").then(m => ({ default: m.SupportTicketManagement })));
const ActivityLogsViewer = lazy(() => import("@/components/dashboard/ActivityLogsViewer").then(m => ({ default: m.ActivityLogsViewer })));
const PageManagement = lazy(() => import("@/components/dashboard/PageManagement").then(m => ({ default: m.PageManagement })));
const EmailNotificationSystem = lazy(() => import("@/components/dashboard/EmailNotificationSystem").then(m => ({ default: m.EmailNotificationSystem })));
const SystemSettings = lazy(() => import("@/components/dashboard/SystemSettings").then(m => ({ default: m.SystemSettings })));
const ContentList = lazy(() => import("@/components/admin/ContentList").then(m => ({ default: m.ContentList })));
const ProductEditor = lazy(() => import("@/components/admin/ProductEditor").then(m => ({ default: m.ProductEditor })));

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
      } else {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

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
    const pageName = paths[paths.length - 1] || "Admin Panel";
    const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.title = `${formattedName} - Admin Panel`;
  }, [location.pathname]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-cyan-50/50 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/20">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b-2 border-primary/20 bg-gradient-to-r from-card/95 via-primary/5 to-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg animate-pulse">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">Admin Panel</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="hover-scale border-primary/20">
                  <LayoutDashboard className="mr-0 md:mr-2 h-4 w-4" />
                  <span className="hidden md:inline">User Dashboard</span>
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleLogout} className="hover-scale border-destructive/20 hover:bg-destructive/10">
                  <LogOut className="mr-0 md:mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 md:px-6 py-6 overflow-auto">
            <Suspense fallback={<DashboardLoadingSkeleton />}>
              <div className="animate-fade-in space-y-6">
                <Routes>
                  <Route path="/" element={<AdminAnalytics userId={user?.id!} />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route 
                    path="products" 
                    element={
                      <ContentList
                        contentType="product"
                        title="Products"
                        newItemPath="/admin/products/new"
                        editItemPath={(id) => `/admin/products/edit/${id}`}
                      />
                    } 
                  />
                  <Route path="products/new" element={<ProductEditor />} />
                  <Route path="products/edit/:id" element={<ProductEditor />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="applications" element={<ApplicationManagement />} />
                  <Route path="payments" element={<PaymentManagement />} />
                  <Route path="bitcoin" element={<BitcoinWalletManagement />} />
                  <Route path="inquiries" element={<InquiryManagement />} />
                  <Route path="support" element={<SupportTicketManagement />} />
                  <Route 
                    path="blog" 
                    element={
                      <ContentList
                        contentType="blog_post"
                        title="Blog Posts"
                        newItemPath="/admin/blog/new"
                        editItemPath={(id) => `/admin/blog/edit/${id}`}
                      />
                    } 
                  />
                  <Route path="reviews" element={<ReviewModerationModule />} />
                  <Route 
                    path="pages" 
                    element={
                      <ContentList
                        contentType="page"
                        title="Pages"
                        newItemPath="/admin/pages/new"
                        editItemPath={(id) => `/admin/pages/edit/${id}`}
                      />
                    } 
                  />
                  <Route path="activity" element={<ActivityLogsViewer />} />
                  <Route path="notifications" element={<EmailNotificationSystem />} />
                  <Route path="settings" element={<SystemSettings />} />
                </Routes>
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
