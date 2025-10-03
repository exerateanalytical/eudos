import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Eye } from "lucide-react";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  user_id: string;
  document_type: string;
  country: string;
  status: string;
  notes: string;
  created_at: string;
}

export function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("document_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
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

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("document_applications")
        .update({ status: newStatus })
        .eq("id", appId);

      if (error) throw error;
      
      toast({ title: "Application status updated successfully" });
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "document_type",
      label: "Document Type",
      render: (row: Application) => (
        <Badge variant="outline">{row.document_type}</Badge>
      ),
    },
    {
      key: "country",
      label: "Country",
    },
    {
      key: "status",
      label: "Status",
      render: (row: Application) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateApplicationStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "created_at",
      label: "Submitted",
      render: (row: Application) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Application) => (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            setSelectedApplication(row);
            setDetailModalOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Review
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Application Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve document applications
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold">{applications.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold">
            {applications.filter((a) => a.status === "submitted").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold">
            {applications.filter((a) => a.status === "approved").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold">
            {applications.filter((a) => a.status === "rejected").length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={applications}
          columns={columns}
          searchPlaceholder="Search applications..."
        />
      </Card>

      {selectedApplication && (
        <ApplicationDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          application={selectedApplication}
        />
      )}
    </div>
  );
}
