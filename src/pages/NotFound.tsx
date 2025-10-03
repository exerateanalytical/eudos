import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, LayoutDashboard, Search, CreditCard, FileText, Globe, GraduationCap, Award } from "lucide-react";
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

  const suggestedContent = [
    { 
      name: "Passports", 
      path: "/passports", 
      description: "Authentic passport documents",
      icon: CreditCard,
      color: "from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20 border-blue-500/30"
    },
    { 
      name: "Driver's License", 
      path: "/drivers-license", 
      description: "Valid driver's licenses",
      icon: FileText,
      color: "from-green-500/20 to-green-600/10 hover:from-green-500/30 hover:to-green-600/20 border-green-500/30"
    },
    { 
      name: "Citizenship", 
      path: "/citizenship", 
      description: "Citizenship documentation",
      icon: Globe,
      color: "from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 border-purple-500/30"
    },
    { 
      name: "Diplomas", 
      path: "/diplomas", 
      description: "Academic certificates",
      icon: GraduationCap,
      color: "from-orange-500/20 to-orange-600/10 hover:from-orange-500/30 hover:to-orange-600/20 border-orange-500/30"
    },
    { 
      name: "Certifications", 
      path: "/certifications", 
      description: "Professional certifications",
      icon: Award,
      color: "from-pink-500/20 to-pink-600/10 hover:from-pink-500/30 hover:to-pink-600/20 border-pink-500/30"
    },
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
              Quick Links
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

          {/* Suggested Content */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <p className="text-sm font-medium text-muted-foreground text-center">
              You Might Be Looking For
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedContent.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`p-4 rounded-xl border bg-gradient-to-br ${item.color} transition-all group hover-scale`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-background/50">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
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
