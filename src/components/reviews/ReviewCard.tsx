import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-foreground">{review.profiles.full_name}</div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < Math.floor(review.rating)
                    ? "text-primary"
                    : "text-muted-foreground/30"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-foreground/90 leading-relaxed">{review.review_text}</p>
      </CardContent>
    </Card>
  );
};
