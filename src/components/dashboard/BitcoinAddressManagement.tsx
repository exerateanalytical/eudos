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

  const availableCount = addresses.filter(a => !a.is_used).length;
  const usedCount = addresses.filter(a => a.is_used).length;

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
      render: (row: BitcoinAddress) => (
        <Badge variant={row.is_used ? "secondary" : "default"}>
          {row.is_used ? "Used" : "Available"}
        </Badge>
      ),
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Addresses</p>
          <p className="text-2xl font-bold">{addresses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-green-500">{availableCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Used</p>
          <p className="text-2xl font-bold text-orange-500">{usedCount}</p>
        </Card>
      </div>

      {availableCount < 5 && (
        <Card className="p-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            ⚠️ Low address pool! Only {availableCount} addresses remaining. Please add more addresses soon.
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
