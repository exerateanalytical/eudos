import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewStats {
  count: number;
  averageRating: number;
}

export const useReviewStats = (productType: string, productId: string) => {
  const [stats, setStats] = useState<ReviewStats>({ count: 0, averageRating: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("rating")
          .eq("product_type", productType)
          .eq("product_id", productId)
          .eq("status", "approved");

        if (error) throw error;

        if (data && data.length > 0) {
          const total = data.reduce((sum, review) => sum + Number(review.rating), 0);
          setStats({
            count: data.length,
            averageRating: total / data.length,
          });
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [productType, productId]);

  return { ...stats, isLoading };
};
