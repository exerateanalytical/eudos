import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useContentAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['content-analytics-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Aggregate analytics by content type
      const byType = data?.reduce((acc, item) => {
        if (!acc[item.content_type]) {
          acc[item.content_type] = {
            totalViews: 0,
            uniqueViews: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            count: 0,
          };
        }
        acc[item.content_type].totalViews += item.views || 0;
        acc[item.content_type].uniqueViews += item.unique_views || 0;
        acc[item.content_type].avgTimeOnPage += item.avg_time_on_page || 0;
        acc[item.content_type].bounceRate += item.bounce_rate || 0;
        acc[item.content_type].count += 1;
        return acc;
      }, {} as Record<string, any>) || {};

      // Calculate averages
      Object.keys(byType).forEach((type) => {
        byType[type].avgTimeOnPage = Math.round(
          byType[type].avgTimeOnPage / byType[type].count
        );
        byType[type].bounceRate = (
          byType[type].bounceRate / byType[type].count
        ).toFixed(2);
      });

      return {
        raw: data || [],
        byType,
      };
    },
  });

  return { analytics, isLoading };
}
