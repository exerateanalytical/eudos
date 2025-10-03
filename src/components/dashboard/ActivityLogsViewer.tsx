import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Activity, Download } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  action_description: string;
  entity_type: string | null;
  entity_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function ActivityLogsViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User ID", "Action", "Description", "Entity Type", "IP Address"],
      ...logs.map((log) => [
        new Date(log.created_at).toISOString(),
        log.user_id,
        log.action_type,
        log.action_description,
        log.entity_type || "",
        log.ip_address || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString()}.csv`;
    a.click();

    toast({ title: "Logs exported successfully" });
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, "default" | "destructive" | "secondary"> = {
      create: "default",
      update: "secondary",
      delete: "destructive",
      login: "default",
      logout: "secondary",
    };
    return colors[actionType.toLowerCase()] || "secondary";
  };

  const columns = [
    {
      key: "created_at",
      label: "Time",
      render: (row: ActivityLog) => (
        <div className="text-sm">
          <p className="font-medium">
            {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: "action_type",
      label: "Action",
      render: (row: ActivityLog) => (
        <Badge variant={getActionColor(row.action_type)}>{row.action_type}</Badge>
      ),
    },
    {
      key: "action_description",
      label: "Description",
    },
    {
      key: "entity_type",
      label: "Entity",
      render: (row: ActivityLog) => (
        row.entity_type ? (
          <Badge variant="outline">{row.entity_type}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      key: "user_id",
      label: "User ID",
      render: (row: ActivityLog) => (
        <span className="font-mono text-xs">{row.user_id.slice(0, 8)}...</span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      render: (row: ActivityLog) => (
        <span className="text-sm">{row.ip_address || "-"}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading activity logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system activity and user actions
          </p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Logs</p>
          <p className="text-2xl font-bold">{logs.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">
            {
              logs.filter(
                (l) =>
                  new Date(l.created_at).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Unique Users</p>
          <p className="text-2xl font-bold">
            {new Set(logs.map((l) => l.user_id)).size}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Actions</p>
          <p className="text-2xl font-bold">
            {new Set(logs.map((l) => l.action_type)).size}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={logs}
          columns={columns}
          searchPlaceholder="Search logs..."
        />
      </Card>
    </div>
  );
}
