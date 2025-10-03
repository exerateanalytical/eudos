import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home, Lock, CreditCard, FileText, Globe, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const publicContent = [
    { 
      name: "Passports", 
      path: "/passports", 
      description: "Browse options",
      icon: CreditCard,
      color: "from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20 border-blue-500/30"
    },
    { 
      name: "Driver's License", 
      path: "/drivers-license", 
      description: "Explore types",
      icon: FileText,
      color: "from-green-500/20 to-green-600/10 hover:from-green-500/30 hover:to-green-600/20 border-green-500/30"
    },
    { 
      name: "Citizenship", 
      path: "/citizenship", 
      description: "Our services",
      icon: Globe,
      color: "from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 border-purple-500/30"
    },
    { 
      name: "Diplomas", 
      path: "/diplomas", 
      description: "Academic docs",
      icon: GraduationCap,
      color: "from-orange-500/20 to-orange-600/10 hover:from-orange-500/30 hover:to-orange-600/20 border-orange-500/30"
    },
    { 
      name: "Certifications", 
      path: "/certifications", 
      description: "Professional certs",
      icon: Award,
      color: "from-pink-500/20 to-pink-600/10 hover:from-pink-500/30 hover:to-pink-600/20 border-pink-500/30"
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <Card className="max-w-2xl w-full animate-fade-in shadow-lg border-destructive/20 backdrop-blur-sm bg-card/95 relative">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 animate-scale-in relative">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <Lock className="h-6 w-6 text-destructive/60 absolute bottom-4 right-4" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Access Forbidden</CardTitle>
            <CardDescription className="text-base">
              You don't have permission to access this resource.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Reason Box */}
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-muted-foreground text-center">
              This area requires special permissions or you may need to sign in with a different account.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleGoBack} variant="outline" className="w-full group hover-scale">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            <Button onClick={() => navigate("/")} className="w-full group hover-scale">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Need Access?
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => navigate("/auth")}
                variant="ghost"
                className="w-full hover:bg-muted/50"
              >
                Sign In with Different Account
              </Button>
              <Button
                onClick={() => navigate("/about")}
                variant="ghost"
                className="w-full hover:bg-muted/50"
              >
                Contact Support
              </Button>
            </div>
          </div>

          {/* Public Content Available */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Or Explore Our Public Pages
            </p>
            <div className="grid grid-cols-2 gap-3">
              {publicContent.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`p-3 rounded-xl border bg-gradient-to-br ${item.color} transition-all group hover-scale`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="p-2 rounded-lg bg-background/50">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
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
              Error Code: 403 - Forbidden Access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Forbidden;
