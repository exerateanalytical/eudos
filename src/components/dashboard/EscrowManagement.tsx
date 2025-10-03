import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EscrowDetailModal } from "./EscrowDetailModal";

interface EscrowTransaction {
  id: string;
  user_id: string;
  order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  dispute_reason: string | null;
  resolution_notes: string | null;
  held_at: string;
  released_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

export function EscrowManagement() {
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      const { data, error } = await supabase
        .from("escrow_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEscrows(data || []);
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

  const updateEscrowStatus = async (escrowId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === "released") {
        updateData.released_at = new Date().toISOString();
      } else if (newStatus === "refunded") {
        updateData.refunded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("escrow_transactions")
        .update(updateData)
        .eq("id", escrowId);

      if (error) throw error;

      toast({ title: "Escrow status updated" });
      fetchEscrows();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "destructive" | "secondary"> = {
      held: "secondary",
      released: "default",
      refunded: "destructive",
      disputed: "destructive",
    };
    return colors[status] || "secondary";
  };

  const columns = [
    {
      key: "order_id",
      label: "Order ID",
      render: (row: EscrowTransaction) => 
        row.order_id ? row.order_id.slice(0, 8) + "..." : "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: EscrowTransaction) => 
        `${row.currency} ${row.amount.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: EscrowTransaction) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateEscrowStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="held">Held</SelectItem>
            <SelectItem value="released">Released</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "held_at",
      label: "Held Since",
      render: (row: EscrowTransaction) =>
        new Date(row.held_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: EscrowTransaction) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedEscrow(row);
            setDetailModalOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading escrow transactions...</p>
      </div>
    );
  }

  const totalHeld = escrows
    .filter((e) => e.status === "held")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Escrow Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage escrow transactions
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Escrows</p>
          <p className="text-2xl font-bold">{escrows.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Held</p>
          <p className="text-2xl font-bold">
            {escrows.filter((e) => e.status === "held").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Released</p>
          <p className="text-2xl font-bold">
            {escrows.filter((e) => e.status === "released").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Held Amount</p>
          <p className="text-2xl font-bold">USD {totalHeld.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={escrows}
          columns={columns}
          searchPlaceholder="Search escrow transactions..."
        />
      </Card>

      {selectedEscrow && (
        <EscrowDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          escrow={selectedEscrow}
          onEscrowUpdated={fetchEscrows}
        />
      )}
    </div>
  );
}
