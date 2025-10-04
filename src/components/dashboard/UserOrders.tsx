import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Package } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  product_name: string;
  product_type: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  btc_payment_id: string | null;
  btc_payments?: {
    address: string;
    txid: string | null;
    confirmations: number;
    status: string;
  };
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
        .select(`
          *,
          btc_payments (
            address,
            txid,
            confirmations,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
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

                {order.btc_payments && (
                  <div className="border-t pt-3 space-y-2">
                    <p className="text-sm font-semibold">Bitcoin Payment Details</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {order.btc_payments.address.substring(0, 20)}...
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={order.btc_payments.status === 'paid' ? 'default' : 'secondary'}>
                          {order.btc_payments.status}
                        </Badge>
                      </div>
                      {order.btc_payments.confirmations !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Confirmations:</span>
                          <span>{order.btc_payments.confirmations}/1</span>
                        </div>
                      )}
                      {order.btc_payments.txid && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          asChild
                        >
                          <a
                            href={`https://blockstream.info/tx/${order.btc_payments.txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Transaction
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
