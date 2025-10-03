import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Eye, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionDetailModal } from "./TransactionDetailModal";

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  completed_at: string | null;
  order_id: string | null;
  metadata: any;
}

export function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
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

  const updateTransactionStatus = async (txId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", txId);

      if (error) throw error;

      toast({ title: "Transaction status updated" });
      fetchTransactions();
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
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "secondary",
    };
    return colors[status] || "secondary";
  };

  const columns = [
    {
      key: "transaction_type",
      label: "Type",
      render: (row: Transaction) => (
        <Badge variant="outline">{row.transaction_type}</Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: Transaction) => `${row.currency} ${row.amount.toFixed(2)}`,
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "status",
      label: "Status",
      render: (row: Transaction) => (
        <Select
          value={row.status}
          onValueChange={(value) => updateTransactionStatus(row.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: Transaction) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Transaction) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedTransaction(row);
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
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  const totalVolume = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Transaction Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all financial transactions
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">
            {transactions.filter((t) => t.status === "completed").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">
            {transactions.filter((t) => t.status === "pending").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Volume</p>
          <p className="text-2xl font-bold">USD {totalVolume.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search transactions..."
        />
      </Card>

      {selectedTransaction && (
        <TransactionDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          transaction={selectedTransaction}
          onTransactionUpdated={fetchTransactions}
        />
      )}
    </div>
  );
}
