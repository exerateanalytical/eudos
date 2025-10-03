import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  status: string;
  description: string;
  created_at: string;
}

interface EscrowTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export function PaymentManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const [txResult, escrowResult] = await Promise.all([
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
        supabase.from("escrow_transactions").select("*").order("created_at", { ascending: false }),
      ]);

      if (txResult.error) throw txResult.error;
      if (escrowResult.error) throw escrowResult.error;

      setTransactions(txResult.data || []);
      setEscrowTransactions(escrowResult.data || []);
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

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const escrowHeld = escrowTransactions
    .filter((e) => e.status === "held")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const transactionColumns = [
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
      render: (row: Transaction) => `${row.currency} ${row.amount}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: Transaction) => (
        <Badge variant={row.status === "completed" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: Transaction) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const escrowColumns = [
    {
      key: "amount",
      label: "Amount",
      render: (row: EscrowTransaction) => `${row.currency} ${row.amount}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: EscrowTransaction) => (
        <Badge variant={row.status === "held" ? "secondary" : "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (row: EscrowTransaction) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Payment Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor transactions and escrow
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Escrow Held</p>
          <p className="text-2xl font-bold">${escrowHeld.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <AdminDataTable
          data={transactions}
          columns={transactionColumns}
          searchPlaceholder="Search transactions..."
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Escrow Transactions</h2>
        <AdminDataTable
          data={escrowTransactions}
          columns={escrowColumns}
          searchPlaceholder="Search escrow..."
        />
      </Card>
    </div>
  );
}
