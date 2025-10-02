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

      // Fetch reviews with user data
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_type", productType)
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Reviews fetch error:", reviewsError);
        throw reviewsError;
      }

      // Fetch profile data separately for each review
      const reviewsWithProfiles = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", review.user_id)
            .maybeSingle();
          
          return {
            ...review,
            profiles: profileData || { full_name: "Anonymous User" },
          };
        })
      );

      setReviews(reviewsWithProfiles);

      // Fetch all replies for these reviews
      if (reviewsData && reviewsData.length > 0) {
        const reviewIds = reviewsData.map((r) => r.id);
        const { data: repliesData, error: repliesError } = await supabase
          .from("review_replies")
          .select("*")
          .in("review_id", reviewIds)
          .order("created_at", { ascending: true });

        if (repliesError) {
          console.error("Replies fetch error:", repliesError);
          throw repliesError;
        }

        // Fetch profile data for each reply
        const repliesWithProfiles = await Promise.all(
          (repliesData || []).map(async (reply) => {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", reply.user_id)
              .maybeSingle();
            
            return {
              ...reply,
              profiles: profileData || { full_name: "Anonymous User" },
            };
          })
        );

        // Group replies by review_id
        const repliesByReview: Record<string, any[]> = {};
        repliesWithProfiles.forEach((reply) => {
          if (!repliesByReview[reply.review_id]) {
            repliesByReview[reply.review_id] = [];
          }
          repliesByReview[reply.review_id].push(reply);
        });

        setReplies(repliesByReview);
      }
    } catch (err: any) {
      console.error("Fetch reviews error:", err);
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
