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
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Contact Inquiry Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusColor(inquiry.status)}>
                  {inquiry.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{inquiry.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agency</p>
                <p className="font-medium">{inquiry.agency}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{inquiry.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <Badge variant="outline">{inquiry.document_type}</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{inquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{inquiry.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{inquiry.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgency</p>
                <Badge variant="outline">{inquiry.urgency}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Specifications</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{inquiry.specifications}</p>
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
                        className="p-3 rounded-lg bg-primary/10"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <Badge variant="default">Admin</Badge>
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
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={handleSubmitReply} disabled={submitting}>
                Send Reply
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
