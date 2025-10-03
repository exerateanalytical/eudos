import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Eye, Trash2 } from "lucide-react";
import { OrderDetailModal } from "./OrderDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  user_id: string;
  product_name: string;
  product_type: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  escrow_fee: number | null;
  created_at: string;
  country: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      
      toast({ title: "Order status updated successfully" });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete the order for "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      cancelled: "destructive",
    };
    return colors[status] || "secondary";
  };

  const columns = [
    {
      key: "product_name",
      label: "Product",
    },
    {
      key: "product_type",
      label: "Type",
      render: (row: Order) => (
        <Badge variant="outline">{row.product_type}</Badge>
      ),
    },
    {
      key: "country",
      label: "Country",
    },
    {
      key: "total_amount",
      label: "Amount",
      render: (row: Order) => `$${row.total_amount}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: Order) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateOrderStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: Order) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Order) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setSelectedOrder(row);
              setDetailModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => handleDeleteOrder(row.id, row.product_name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Order Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Process and track customer orders
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Processing</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={orders}
          columns={columns}
          searchPlaceholder="Search orders..."
        />
      </Card>

      {selectedOrder && (
        <OrderDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
