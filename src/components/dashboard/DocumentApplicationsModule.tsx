import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DocumentApplication {
  id: string;
  document_type: string;
  country: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface DocumentApplicationsModuleProps {
  userId: string;
}

const DocumentApplicationsModule = ({ userId }: DocumentApplicationsModuleProps) => {
  const [applications, setApplications] = useState<DocumentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("document_applications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (error: any) {
        toast.error("Error loading applications");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "approved":
        return "default";
      case "under_review":
        return "secondary";
      case "submitted":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading applications...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Applications</CardTitle>
        <CardDescription>Track the status of your document requests</CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{app.document_type}</h3>
                      <p className="text-sm text-muted-foreground">{app.country}</p>
                    </div>
                    <Badge variant={getStatusColor(app.status)}>
                      {app.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {app.notes && (
                    <p className="text-sm text-muted-foreground mb-2">{app.notes}</p>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentApplicationsModule;