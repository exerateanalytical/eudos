import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Eye, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportTicketDetailModal } from "./SupportTicketDetailModal";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

export function SupportTicketManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
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

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus })
        .eq("id", ticketId);

      if (error) throw error;

      toast({ title: "Ticket status updated" });
      fetchTickets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return colors[priority] || "secondary";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      open: "destructive",
      in_progress: "default",
      resolved: "secondary",
      closed: "secondary",
    };
    return colors[status] || "secondary";
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDetailModalOpen(true);
  };

  const handleDeleteTicket = async (ticketId: string, subject: string) => {
    if (!confirm(`Are you sure you want to delete ticket "${subject}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("support_tickets")
        .delete()
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support ticket deleted successfully",
      });

      fetchTickets();
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
      key: "subject",
      label: "Subject",
    },
    {
      key: "user_id",
      label: "User ID",
      render: (row: SupportTicket) => row.user_id.slice(0, 8) + "...",
    },
    {
      key: "category",
      label: "Category",
      render: (row: SupportTicket) => (
        <Badge variant="outline">{row.category}</Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (row: SupportTicket) => (
        <Badge variant={getPriorityColor(row.priority)}>{row.priority}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: SupportTicket) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateTicketStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: SupportTicket) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SupportTicket) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewTicket(row)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => handleDeleteTicket(row.id, row.subject)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Headphones className="h-8 w-8" />
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer support requests
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Tickets</p>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Open</p>
          <p className="text-2xl font-bold">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold">
            {tickets.filter((t) => t.status === "in_progress").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold">
            {tickets.filter((t) => t.status === "resolved").length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={tickets}
          columns={columns}
          searchPlaceholder="Search tickets..."
        />
      </Card>

      {selectedTicket && (
        <SupportTicketDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          ticket={selectedTicket}
          onTicketUpdated={fetchTickets}
        />
      )}
    </div>
  );
}
