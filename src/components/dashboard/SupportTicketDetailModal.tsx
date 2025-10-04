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
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, Headphones, Clock, User, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Support Ticket #{ticket.id.slice(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Ticket Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Ticket Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-semibold text-right flex-1 ml-2">{ticket.subject}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{ticket.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={ticket.status === "resolved" ? "secondary" : "default"}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{ticket.user_id.slice(0, 12)}...</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Original Message</h3>
              <div className="bg-accent/30 p-3 rounded text-sm">
                <p className="whitespace-pre-wrap">{ticket.message}</p>
              </div>
            </Card>

            <Button
              variant="outline"
              onClick={handleResolve}
              disabled={ticket.status === "resolved"}
              className="w-full"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {ticket.status === "resolved" ? "Already Resolved" : "Mark as Resolved"}
            </Button>
          </div>

          {/* Right Column - Conversation */}
          <div className="flex flex-col space-y-3">
            <Card className="p-4 flex-1">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Conversation Thread ({replies.length})
              </h3>
              <ScrollArea className="h-[450px] pr-3">
                {replies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Headphones className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No replies yet</p>
                    <p className="text-xs text-muted-foreground">Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <Card
                        key={reply.id}
                        className={`p-3 ${
                          reply.is_staff_reply
                            ? "bg-primary/5 border-primary/20"
                            : "bg-accent/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={reply.is_staff_reply ? "default" : "secondary"}>
                            {reply.is_staff_reply ? "Staff" : "Customer"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>

            <Card className="p-4">
              <Label htmlFor="reply-message" className="text-sm font-medium mb-2 block">
                Send Reply to Customer
              </Label>
              <Textarea
                id="reply-message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="resize-none mb-3"
              />
              <Button onClick={handleSubmitReply} disabled={submitting} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Sending..." : "Send Reply"}
              </Button>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
