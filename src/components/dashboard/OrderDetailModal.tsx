import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    user_id: string;
    product_name: string;
    product_type: string;
    country: string;
    total_amount: number;
    status: string;
    payment_method: string | null;
    escrow_fee: number | null;
    created_at: string;
  };
}

export function OrderDetailModal({
  open,
  onOpenChange,
  order,
}: OrderDetailModalProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, "destructive" | "default" | "secondary"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      cancelled: "destructive",
    };
    return colors[status] || "secondary";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Order ID</Label>
            <p className="text-sm font-mono">{order.id}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <p className="font-semibold">{order.product_name}</p>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Badge variant="outline">{order.product_type}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <p>{order.country}</p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Payment Details</Label>
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-semibold">
                  ${(order.total_amount || 0) - (order.escrow_fee || 0)}
                </span>
              </div>
              {order.escrow_fee && (
                <div className="flex justify-between">
                  <span className="text-sm">Escrow Fee</span>
                  <span className="text-sm font-semibold">${order.escrow_fee}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${order.total_amount}</span>
              </div>
              {order.payment_method && (
                <div className="flex justify-between text-sm">
                  <span>Payment Method</span>
                  <span>{order.payment_method}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Order Date</Label>
            <p className="text-sm">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
