import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Eye } from "lucide-react";
import { z } from "zod";

const orderSchema = z.object({
  product_type: z.string().min(1, "Product type is required"),
  product_name: z.string().min(1, "Product name is required"),
  country: z.string().optional(),
  payment_method: z.string().optional(),
  total_amount: z.string().optional(),
});

interface Order {
  id: string;
  product_type: string;
  product_name: string;
  country: string | null;
  status: string;
  payment_method: string | null;
  total_amount: number | null;
  escrow_fee: number | null;
  created_at: string;
}

interface OrdersModuleProps {
  userId: string;
}

const OrdersModule = ({ userId }: OrdersModuleProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        toast.error("Error loading orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      product_type: formData.get("product_type") as string,
      product_name: formData.get("product_name") as string,
      country: formData.get("country") as string || null,
      payment_method: formData.get("payment_method") as string || null,
      total_amount: formData.get("total_amount") as string || null,
    };

    try {
      orderSchema.parse(data);

      const { error } = await supabase.from("orders").insert({
        user_id: userId,
        product_type: data.product_type,
        product_name: data.product_name,
        country: data.country,
        payment_method: data.payment_method,
        total_amount: data.total_amount ? parseFloat(data.total_amount) : null,
        status: 'pending',
      });

      if (error) throw error;

      toast.success("Order created successfully");
      setShowNewOrderDialog(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error(error.message || "Error creating order");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading orders...</CardContent></Card>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Track and manage your current and past orders</CardDescription>
            </div>
            <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>Place a new order for documents</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_type">Product Type</Label>
                    <select
                      id="product_type"
                      name="product_type"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="id_card">ID Card</option>
                      <option value="diploma">Diploma</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input id="product_name" name="product_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country (Optional)</Label>
                    <Input id="country" name="country" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method (Optional)</Label>
                    <select
                      id="payment_method"
                      name="payment_method"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select method</option>
                      <option value="cryptocurrency">Cryptocurrency</option>
                      <option value="wire_transfer">Wire Transfer</option>
                      <option value="escrow">Escrow</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_amount">Amount (Optional)</Label>
                    <Input id="total_amount" name="total_amount" type="number" step="0.01" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Create Order</Button>
                    <Button type="button" variant="outline" onClick={() => setShowNewOrderDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{order.product_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.product_type} {order.country && `• ${order.country}`}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    {order.total_amount && (
                      <span className="font-semibold">
                        ${order.total_amount.toFixed(2)}
                        {order.escrow_fee && ` (+$${order.escrow_fee.toFixed(2)} fee)`}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Order Details Dialog */}
    <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete information about this order</DialogDescription>
        </DialogHeader>
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Product</Label>
              <p className="font-semibold">{selectedOrder.product_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p>{selectedOrder.product_type}</p>
            </div>
            {selectedOrder.country && (
              <div>
                <Label className="text-muted-foreground">Country</Label>
                <p>{selectedOrder.country}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Badge variant={getStatusColor(selectedOrder.status)} className="mt-1">
                {selectedOrder.status}
              </Badge>
            </div>
            {selectedOrder.payment_method && (
              <div>
                <Label className="text-muted-foreground">Payment Method</Label>
                <p>{selectedOrder.payment_method}</p>
              </div>
            )}
            {selectedOrder.total_amount && (
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <p className="font-semibold">
                  ${selectedOrder.total_amount.toFixed(2)}
                  {selectedOrder.escrow_fee && ` (+$${selectedOrder.escrow_fee.toFixed(2)} escrow fee)`}
                </p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Order Date</Label>
              <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
};

export default OrdersModule;