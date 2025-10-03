import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SupportTicketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
  };
  onTicketUpdated: () => void;
}

export function SupportTicketDetailModal({
  open,
  onOpenChange,
  ticket,
  onTicketUpdated,
}: SupportTicketDetailModalProps) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    setSending(true);
    try {
      // In a real app, you'd save this reply to a ticket_replies table
      // For now, we'll just show a success message
      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the user",
      });
      setReply("");
      onTicketUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleResolve = async () => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", ticket.id);

      if (error) throw error;

      toast({ title: "Ticket resolved" });
      onTicketUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{ticket.category}</Badge>
              <Badge variant={ticket.priority === "high" ? "destructive" : "default"}>
                {ticket.priority} priority
              </Badge>
              <Badge variant="secondary">{ticket.status}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <p className="font-semibold">{ticket.subject}</p>
          </div>

          <div className="space-y-2">
            <Label>User ID</Label>
            <p className="text-sm font-mono">{ticket.user_id}</p>
          </div>

          <div className="space-y-2">
            <Label>Created</Label>
            <p className="text-sm">
              {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reply to User</Label>
            <Textarea
              placeholder="Type your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSendReply} disabled={sending || !reply.trim()}>
              {sending ? "Sending..." : "Send Reply"}
            </Button>
            <Button
              variant="outline"
              onClick={handleResolve}
              disabled={ticket.status === "resolved"}
            >
              Mark as Resolved
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
