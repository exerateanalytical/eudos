import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewStatsCardProps {
  count: number;
  averageRating: number;
  productName: string;
}

export const ReviewStatsCard = ({ count, averageRating, productName }: ReviewStatsCardProps) => {
  if (count === 0) return null;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {count} verified review{count !== 1 ? "s" : ""}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {count} {count === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
