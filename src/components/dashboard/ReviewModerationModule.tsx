import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export const ReviewModerationModule = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const { toast } = useToast();

  const fetchReviews = async (status: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          user_id,
          product_type,
          product_id,
          rating,
          review_text,
          status,
          created_at,
          profiles!reviews_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(activeTab);
  }, [activeTab]);

  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: "approved" })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review approved",
      });

      fetchReviews(activeTab);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status: "rejected" })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review rejected",
      });

      fetchReviews(activeTab);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review deleted",
      });

      fetchReviews(activeTab);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getProductTypeBadge = (type: string) => {
    const colors = {
      passport: "bg-blue-500/10 text-blue-500",
      license: "bg-green-500/10 text-green-500",
      diploma: "bg-purple-500/10 text-purple-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Review Moderation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No {activeTab} reviews
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{review.profiles.full_name}</span>
                            <Badge className={getProductTypeBadge(review.product_type)}>
                              {review.product_type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.profiles.email} • {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
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

                      <p className="text-muted-foreground">{review.review_text}</p>

                      <div className="flex gap-2">
                        {activeTab === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(review.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {activeTab === "rejected" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
