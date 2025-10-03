import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  department: string;
  document_type: string;
  status: string;
  created_at: string;
}

export function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
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

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .update({ status: newStatus })
        .eq("id", inquiryId);

      if (error) throw error;
      
      toast({ title: "Inquiry status updated successfully" });
      fetchInquiries();
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
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "agency",
      label: "Agency",
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "document_type",
      label: "Document Type",
      render: (row: Inquiry) => (
        <Badge variant="outline">{row.document_type}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Inquiry) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateInquiryStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: Inquiry) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Inquiry) => (
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Inquiry Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Respond to customer inquiries
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
          <p className="text-2xl font-bold">{inquiries.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">
            {inquiries.filter((i) => i.status === "pending").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold">
            {inquiries.filter((i) => i.status === "resolved").length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={inquiries}
          columns={columns}
          searchPlaceholder="Search inquiries..."
        />
      </Card>
    </div>
  );
}
