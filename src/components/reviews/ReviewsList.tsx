import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewCard } from "./ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewsListProps {
  productType: "passport" | "license" | "diploma";
  productId: string;
  refreshTrigger?: number;
}

export const ReviewsList = ({ productType, productId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          id,
          user_id,
          rating,
          review_text,
          created_at,
          profiles!reviews_user_id_fkey (
            full_name
          )
        `)
        .eq("product_type", productType)
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      setReviews(reviewsData || []);

      // Fetch all replies for these reviews
      if (reviewsData && reviewsData.length > 0) {
        const reviewIds = reviewsData.map((r) => r.id);
        const { data: repliesData, error: repliesError } = await supabase
          .from("review_replies")
          .select(`
            id,
            review_id,
            user_id,
            reply_text,
            created_at,
            profiles!review_replies_user_id_fkey (
              full_name
            )
          `)
          .in("review_id", reviewIds)
          .order("created_at", { ascending: true });

        if (repliesError) throw repliesError;

        // Group replies by review_id
        const repliesByReview: Record<string, any[]> = {};
        repliesData?.forEach((reply) => {
          if (!repliesByReview[reply.review_id]) {
            repliesByReview[reply.review_id] = [];
          }
          repliesByReview[reply.review_id].push(reply);
        });

        setReplies(repliesByReview);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productType, productId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          replies={replies[review.id] || []}
          onReplyAdded={fetchReviews}
        />
      ))}
    </div>
  );
};
