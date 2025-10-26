import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  message: string;
  details?: any;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  checks: HealthCheck[];
  summary: {
    total_checks: number;
    healthy: number;
    degraded: number;
    down: number;
  };
}

export function SystemHealthDashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('system-health');
      
      if (error) {
        toast.error('Failed to fetch system health');
        return;
      }

      setHealth(data as HealthResponse);
    } catch (error) {
      console.error('Health check error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    checkHealth();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Down</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <XCircle className="h-12 w-12 text-red-600 mb-4" />
          <p className="text-muted-foreground">Unable to fetch system health</p>
          <Button onClick={handleRefresh} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <CardTitle>System Health</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(health.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{health.summary.total_checks}</div>
            <div className="text-xs text-muted-foreground">Total Checks</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{health.summary.healthy}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{health.summary.degraded}</div>
            <div className="text-xs text-muted-foreground">Degraded</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{health.summary.down}</div>
            <div className="text-xs text-muted-foreground">Down</div>
          </div>
        </div>

        {/* Individual Service Checks */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Service Status</h4>
          {health.checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium text-sm capitalize">
                    {check.service.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">{check.message}</div>
                </div>
              </div>
              {check.details && (
                <div className="text-xs text-muted-foreground font-mono">
                  {JSON.stringify(check.details).substring(0, 50)}...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2">
          Last updated: {new Date(health.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
