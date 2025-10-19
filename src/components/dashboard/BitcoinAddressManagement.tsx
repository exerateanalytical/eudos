import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BitcoinAddress {
  id: string;
  address: string;
  is_used: boolean;
  assigned_to_order: string | null;
  assigned_at: string | null;
  reserved_until: string | null;
  payment_confirmed: boolean;
  created_at: string;
}

export function BitcoinAddressManagement() {
  const [addresses, setAddresses] = useState<BitcoinAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("bitcoin_addresses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
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

  const releaseAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from("bitcoin_addresses")
        .update({
          is_used: false,
          assigned_to_order: null,
          assigned_at: null,
          reserved_until: null,
        })
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bitcoin address released back to pool",
      });
      
      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmPayment = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from("bitcoin_addresses")
        .update({
          payment_confirmed: true,
        })
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment marked as confirmed",
      });
      
      fetchAddresses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const availableCount = addresses.filter(a => !a.is_used).length;
  const usedCount = addresses.filter(a => a.is_used).length;
  const expiredCount = addresses.filter(a => 
    a.is_used && 
    a.reserved_until && 
    new Date(a.reserved_until) < new Date() && 
    !a.payment_confirmed
  ).length;
  const confirmedCount = addresses.filter(a => a.payment_confirmed).length;

  const columns = [
    {
      key: "address",
      label: "Bitcoin Address",
      render: (row: BitcoinAddress) => (
        <span className="font-mono text-xs">{row.address}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: BitcoinAddress) => {
        const isExpired = row.reserved_until && new Date(row.reserved_until) < new Date();
        
        if (row.payment_confirmed) {
          return <Badge className="bg-green-500">Confirmed</Badge>;
        }
        if (isExpired && !row.payment_confirmed) {
          return <Badge variant="destructive">Expired</Badge>;
        }
        if (row.is_used && row.reserved_until) {
          return <Badge className="bg-blue-500">Reserved</Badge>;
        }
        return <Badge variant="default">Available</Badge>;
      },
    },
    {
      key: "reserved_until",
      label: "Reservation Expires",
      render: (row: BitcoinAddress) => {
        if (!row.reserved_until) return "-";
        const expiry = new Date(row.reserved_until);
        const isExpired = expiry < new Date();
        return (
          <span className={isExpired ? "text-red-500" : "text-muted-foreground"}>
            {expiry.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "assigned_at",
      label: "Assigned Date",
      render: (row: BitcoinAddress) => 
        row.assigned_at ? new Date(row.assigned_at).toLocaleDateString() : "-",
    },
    {
      key: "assigned_to_order",
      label: "Order ID",
      render: (row: BitcoinAddress) => 
        row.assigned_to_order ? (
          <span className="font-mono text-xs">{row.assigned_to_order.slice(0, 8)}...</span>
        ) : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: BitcoinAddress) => (
        <div className="flex gap-2">
          {row.is_used && !row.payment_confirmed && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => releaseAddress(row.id)}
              >
                Release
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => confirmPayment(row.id)}
              >
                Confirm Payment
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading Bitcoin addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bitcoin className="h-8 w-8 text-orange-500" />
            Bitcoin Address Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage Bitcoin payment addresses
          </p>
        </div>
        <Button onClick={fetchAddresses} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Addresses</p>
          <p className="text-2xl font-bold">{addresses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-green-500">{availableCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Reserved</p>
          <p className="text-2xl font-bold text-blue-500">{usedCount - confirmedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-red-500">{expiredCount}</p>
        </Card>
      </div>

      {availableCount < 5 && (
        <Card className="p-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            ⚠️ Low address pool! Only {availableCount} addresses remaining. Please add more addresses soon.
          </p>
        </Card>
      )}

      {expiredCount > 0 && (
        <Card className="p-4 border-red-500 bg-red-50 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            ⚠️ {expiredCount} expired reservations detected! These will be automatically released on next assignment.
          </p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Bitcoin Addresses</h2>
        <AdminDataTable
          data={addresses}
          columns={columns}
          searchPlaceholder="Search addresses..."
        />
      </Card>
    </div>
  );
}
