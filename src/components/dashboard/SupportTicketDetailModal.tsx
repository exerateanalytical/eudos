import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
}

interface SupportTicketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket;
  onTicketUpdated: () => void;
}

export function SupportTicketDetailModal({
  open,
  onOpenChange,
  ticket,
  onTicketUpdated,
}: SupportTicketDetailModalProps) {
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchReplies();
    }
  }, [open, ticket.id]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from("ticket_replies")
        .select("*")
        .eq("ticket_id", ticket.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading replies",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Reply message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase.from("ticket_replies").insert({
        ticket_id: ticket.id,
        user_id: userData.user.id,
        message: replyMessage.trim(),
        is_staff_reply: true,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });

      setReplyMessage("");
      fetchReplies();
      onTicketUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return colors[priority] || "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium">{ticket.subject}</p>
            </div>
            <div className="flex gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{ticket.status}</Badge>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">{ticket.category}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-2">Original Message</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(ticket.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Replies ({replies.length})</p>
            <ScrollArea className="h-[200px] rounded-lg border p-4">
              {replies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No replies yet
                </p>
              ) : (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 rounded-lg ${
                        reply.is_staff_reply
                          ? "bg-primary/10 ml-4"
                          : "bg-muted mr-4"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant={reply.is_staff_reply ? "default" : "secondary"}>
                          {reply.is_staff_reply ? "Staff" : "User"}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm whitespace-pre-wrap mt-2">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply-message">Add Reply</Label>
            <Textarea
              id="reply-message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleResolve}
              disabled={ticket.status === "resolved"}
            >
              Mark as Resolved
            </Button>
            <Button onClick={handleSubmitReply} disabled={submitting}>
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
