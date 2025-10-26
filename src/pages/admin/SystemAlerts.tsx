import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Loader2,
  Bell,
  BellOff,
  Calendar,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface AdminAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  metadata: any;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export default function SystemAlerts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('unresolved');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchAlerts();
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data as AdminAlert[] || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('admin_alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: session?.user.id,
        })
        .eq('id', alertId);

      if (error) throw error;

      toast.success('Alert marked as resolved');
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredAlerts = alerts
    .filter(alert => activeTab === 'unresolved' ? !alert.is_resolved : alert.is_resolved)
    .filter(alert => !filterSeverity || alert.severity === filterSeverity);

  const unresolvedCount = alerts.filter(a => !a.is_resolved).length;
  const criticalCount = alerts.filter(a => !a.is_resolved && a.severity === 'critical').length;
  const warningCount = alerts.filter(a => !a.is_resolved && a.severity === 'warning').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            System Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage system health notifications
          </p>
        </div>
        <Button onClick={fetchAlerts} variant="outline">
          <Loader2 className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unresolved Alerts</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Review recommended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by severity:</span>
            <Button
              variant={filterSeverity === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity(null)}
            >
              All
            </Button>
            <Button
              variant={filterSeverity === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('critical')}
            >
              Critical
            </Button>
            <Button
              variant={filterSeverity === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('warning')}
            >
              Warning
            </Button>
            <Button
              variant={filterSeverity === 'info' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSeverity('info')}
            >
              Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="unresolved">
            Unresolved ({unresolvedCount})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({alerts.filter(a => a.is_resolved).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unresolved' 
                    ? 'All clear! No unresolved alerts at this time.' 
                    : 'No resolved alerts to display.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Alert
                key={alert.id}
                className={`border-2 ${
                  alert.severity === 'critical' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                    : alert.severity === 'warning'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2 mb-2">
                        {alert.title}
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alert.alert_type}</Badge>
                      </AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p>{alert.message}</p>
                        
                        {/* Metadata */}
                        {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                            <span className="font-semibold">Details: </span>
                            {JSON.stringify(alert.metadata, null, 2)}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                          </div>
                          {alert.is_resolved && alert.resolved_at && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              Resolved {formatDistanceToNow(new Date(alert.resolved_at), { addSuffix: true })}
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>

                  {!alert.is_resolved && (
                    <Button
                      onClick={() => resolveAlert(alert.id)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  )}
                </div>
              </Alert>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
