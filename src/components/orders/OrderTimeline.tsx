import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StatusHistoryItem {
  status: string;
  changed_at: string;
  previous_status: string;
}

interface OrderTimelineProps {
  currentStatus: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
}

const statusConfig = {
  pending: { icon: Clock, label: "Pending", color: "bg-yellow-500" },
  paid: { icon: CheckCircle, label: "Paid", color: "bg-green-500" },
  processing: { icon: Package, label: "Processing", color: "bg-blue-500" },
  shipped: { icon: Truck, label: "Shipped", color: "bg-purple-500" },
  completed: { icon: CheckCircle, label: "Completed", color: "bg-green-600" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "bg-red-500" },
};

export function OrderTimeline({ currentStatus, statusHistory, createdAt }: OrderTimelineProps) {
  const allStatuses = ["pending", "paid", "processing", "shipped", "completed"];
  const currentIndex = allStatuses.indexOf(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allStatuses.map((status, index) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = status === currentStatus;
            const historyItem = statusHistory.find((h) => h.status === status);

            return (
              <div key={status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-2 ${
                      isCompleted ? config.color : "bg-muted"
                    } transition-colors`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isCompleted ? "text-white" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  {index < allStatuses.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {config.label}
                    </span>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  {historyItem ? (
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(historyItem.changed_at), {
                        addSuffix: true,
                      })}
                    </p>
                  ) : status === "pending" ? (
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {currentStatus === "cancelled" && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive font-medium">Order Cancelled</p>
            <p className="text-xs text-muted-foreground mt-1">
              This order has been cancelled and will not be processed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
