import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Package } from "lucide-react";
import { format } from "date-fns";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

interface Order {
  id: string;
  order_number: string;
  product_name: string;
  product_type: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  status_history: Array<{
    status: string;
    changed_at: string;
    previous_status: string;
  }> | null;
}

export function UserOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to view your orders",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select("*")
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse status_history from JSON
      const parsedOrders = (data || []).map(order => ({
        ...order,
        status_history: Array.isArray(order.status_history) 
          ? order.status_history 
          : (order.status_history ? JSON.parse(order.status_history as string) : [])
      }));
      
      setOrders(parsedOrders as Order[]);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      processing: "outline",
      completed: "default",
      cancelled: "destructive",
    };
    return colors[status] || "outline";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground text-center">
            Your order history will appear here once you make a purchase.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Orders</h2>
        <p className="text-muted-foreground">View and track your order history</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(order.created_at), "PPpp")}
                  </p>
                </div>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Order Details */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Product</p>
                      <p className="font-medium">{order.product_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{order.product_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">${order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium capitalize">{order.payment_method || 'N/A'}</p>
                    </div>
                  </div>

                </div>

                {/* Order Timeline */}
                <OrderTimeline
                  currentStatus={order.status}
                  statusHistory={order.status_history || []}
                  createdAt={order.created_at}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
