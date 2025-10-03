import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Shield, User, FileText, Package, DollarSign } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  action_type: string;
  action_description: string;
  ip_address: string | null;
  created_at: string;
  entity_type: string | null;
}

interface ActivityLogProps {
  userId: string;
}

export const ActivityLog = ({ userId }: ActivityLogProps) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchActivityLog();

    // Subscribe to new activity
    const channel = supabase
      .channel("activity-log")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activity_logs",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchActivityLog();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchActivityLog = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activity log:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
      case "logout":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "order":
        return <Package className="h-4 w-4 text-green-500" />;
      case "application":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "payment":
      case "transaction":
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case "profile":
        return <User className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading activity log...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
        </CardTitle>
        <CardDescription>
          Your recent account activity and security events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg border"
                >
                  <div className="mt-1">{getActivityIcon(activity.action_type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action_description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                      {activity.ip_address && (
                        <span>IP: {activity.ip_address}</span>
                      )}
                      {activity.entity_type && (
                        <span className="capitalize">{activity.entity_type}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
