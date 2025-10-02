import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface Reply {
  id: string;
  user_id: string;
  reply_text: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ReviewCardProps {
  review: Review;
  replies: Reply[];
  onReplyAdded: () => void;
}

export const ReviewCard = ({ review, replies, onReplyAdded }: ReviewCardProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to reply to reviews",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("review_replies")
        .insert({
          review_id: review.id,
          user_id: user.id,
          reply_text: replyText.trim(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reply has been posted",
      });

      setReplyText("");
      setShowReplyForm(false);
      onReplyAdded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold">{review.profiles.full_name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(review.rating)
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  }
                >
                  ★
                </span>
              ))}
              <span className="ml-1 text-sm font-medium">{review.rating}</span>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-muted-foreground">{review.review_text}</p>

          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="ml-6 space-y-3 border-l-2 border-border pl-4">
              {replies.map((reply) => (
                <div key={reply.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {reply.profiles.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{reply.reply_text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Reply
            </Button>
            {replies.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="space-y-2">
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={1000}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {replyText.length}/1000 characters
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={isSubmitting || !replyText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
