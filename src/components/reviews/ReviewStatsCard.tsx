import { Star } from "lucide-react";

interface ReviewStatsCardProps {
  averageRating: number;
  count: number;
}

export const ReviewStatsCard = ({ averageRating, count }: ReviewStatsCardProps) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(averageRating)
                ? "fill-primary text-primary"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
      <div className="text-sm">
        <span className="font-semibold">{averageRating.toFixed(1)}</span>
        <span className="text-muted-foreground"> ({count} {count === 1 ? 'review' : 'reviews'})</span>
      </div>
    </div>
  );
};
