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
import { Send, MessageSquare, Clock, User, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContactInquiry {
  id: string;
  name: string;
  position: string;
  agency: string;
  department: string;
  email: string;
  phone: string;
  document_type: string;
  quantity: string;
  urgency: string;
  specifications: string;
  status: string;
  created_at: string;
}

interface InquiryReply {
  id: string;
  inquiry_id: string;
  admin_id: string;
  message: string;
  created_at: string;
}

interface InquiryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ContactInquiry;
  onInquiryUpdated: () => void;
}

export function InquiryDetailModal({
  open,
  onOpenChange,
  inquiry,
  onInquiryUpdated,
}: InquiryDetailModalProps) {
  const [replies, setReplies] = useState<InquiryReply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchReplies();
    }
  }, [open, inquiry.id]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from("inquiry_replies")
        .select("*")
        .eq("inquiry_id", inquiry.id)
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

      const { error } = await supabase.from("inquiry_replies").insert({
        inquiry_id: inquiry.id,
        admin_id: userData.user.id,
        message: replyMessage.trim(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });

      setReplyMessage("");
      fetchReplies();
      onInquiryUpdated();
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "destructive" | "secondary"> = {
      pending: "secondary",
      in_progress: "default",
      resolved: "default",
    };
    return colors[status] || "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Inquiry Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inquiry Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Contact Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{inquiry.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{inquiry.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{inquiry.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">{inquiry.position}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Organization</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agency:</span>
                  <span className="font-medium">{inquiry.agency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{inquiry.department}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Request Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Document:</span>
                  <Badge variant="outline">{inquiry.document_type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{inquiry.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Urgency:</span>
                  <Badge variant={inquiry.urgency === "high" ? "destructive" : "default"}>
                    {inquiry.urgency}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Specifications:</p>
                <div className="bg-accent/30 p-3 rounded text-sm">
                  {inquiry.specifications}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
              </div>
            </Card>
          </div>

          {/* Right Column - Conversation */}
          <div className="flex flex-col space-y-3">
            <Card className="p-4 flex-1">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversation ({replies.length})
              </h3>
              <ScrollArea className="h-[450px] pr-3">
                {replies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No replies yet</p>
                    <p className="text-xs text-muted-foreground">Be the first to respond!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {replies.map((reply) => (
                      <Card key={reply.id} className="p-3 bg-primary/5 border-primary/20">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="default" className="text-xs">
                            Admin Reply
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
                Send Reply
              </Label>
              <Textarea
                id="reply-message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="resize-none mb-3"
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Close
                </Button>
                <Button onClick={handleSubmitReply} disabled={submitting} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? "Sending..." : "Send"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
