import { useNavigate } from "react-router-dom";
import { ServerCrash, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ServerError = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const troubleshootingSteps = [
    "Refresh the page",
    "Clear your browser cache",
    "Check your internet connection",
    "Try again in a few minutes",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-orange-500/5 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <Card className="max-w-2xl w-full animate-fade-in shadow-lg border-orange-500/20 backdrop-blur-sm bg-card/95 relative">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 animate-scale-in relative">
            <ServerCrash className="h-16 w-16 text-orange-500" />
            <AlertTriangle className="h-6 w-6 text-orange-500/60 absolute top-2 right-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Server Error</CardTitle>
            <CardDescription className="text-base">
              We're experiencing technical difficulties. Our team has been notified.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Box */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <p className="text-sm text-muted-foreground text-center">
              This is a temporary issue and we're working to resolve it as quickly as possible.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleRefresh} className="w-full group hover-scale">
              <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
              Refresh Page
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full group hover-scale">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Troubleshooting Steps */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Troubleshooting Steps
            </p>
            <div className="space-y-2">
              {troubleshootingSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-sm"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Help */}
          <div className="pt-2">
            <Button
              onClick={() => navigate("/about")}
              variant="ghost"
              className="w-full hover:bg-muted/50"
            >
              Contact Support for Help
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              Error Code: 500 - Internal Server Error
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerError;
