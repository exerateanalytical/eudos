import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(session !== null);
    };
    
    checkAuth();
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularPages = [
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Apply", path: "/apply" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <Card className="max-w-2xl w-full animate-fade-in shadow-lg border-border/50 backdrop-blur-sm bg-card/95 relative">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-scale-in">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                404
              </span>
              <Search className="h-6 w-6 text-primary/60 mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleGoBack} variant="outline" className="w-full group hover-scale">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="w-full group hover-scale">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/")} className="w-full group hover-scale">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            )}
          </div>

          {/* Helpful Links */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Popular Pages
            </p>
            <div className="grid grid-cols-2 gap-2">
              {popularPages.map((page) => (
                <Button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-muted/50"
                >
                  {page.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
