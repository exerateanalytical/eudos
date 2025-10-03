import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { errorTracker } from "@/lib/error-tracking";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application Error:", error, errorInfo);
    errorTracker.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <Card className="max-w-2xl w-full animate-fade-in shadow-lg border-destructive/20 backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 animate-scale-in">
                <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">Something Went Wrong</CardTitle>
                <CardDescription className="text-base">
                  We encountered an unexpected error. Don't worry, we've been notified and are looking into it.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {this.state.error && (
                <div className="p-4 rounded-lg bg-muted border border-border/50 overflow-hidden">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Error Details:</p>
                  <div className="p-3 rounded bg-background text-sm font-mono text-destructive overflow-auto max-h-32 scrollbar-thin">
                    {this.state.error.message}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={this.handleRefresh} className="w-full group hover-scale">
                  <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                  Refresh Page
                </Button>
                <Button onClick={this.handleReset} variant="outline" className="w-full group hover-scale">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-center text-muted-foreground">
                  If this problem persists, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
