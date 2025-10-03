import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, CreditCard, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface EscrowTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  held_at: string;
  released_at: string | null;
}

interface WalletModuleProps {
  userId: string;
}

export const WalletModule = ({ userId }: WalletModuleProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchWalletData();
  }, [userId]);

  const fetchWalletData = async () => {
    try {
      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (txError) throw txError;

      // Fetch escrow transactions
      const { data: escrowData, error: escrowError } = await supabase
        .from("escrow_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("held_at", { ascending: false });

      if (escrowError) throw escrowError;

      setTransactions(txData || []);
      setEscrowTransactions(escrowData || []);

      // Calculate total spent
      const total = txData
        ?.filter((tx) => tx.status === "completed" && tx.transaction_type === "payment")
        .reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      setTotalSpent(total);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      held: "secondary",
      released: "default",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading wallet...</div>;
  }

  const activeEscrow = escrowTransactions
    .filter((e) => e.status === "held")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Held</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${activeEscrow.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Protected funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">Payment history</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </CardTitle>
          <CardDescription>View your transactions and escrow activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="escrow">Escrow</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <ScrollArea className="h-[400px] pr-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-muted">
                            {tx.transaction_type === "payment" ? (
                              <ArrowUpRight className="h-4 w-4 text-red-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.description || tx.transaction_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {tx.transaction_type === "payment" ? "-" : "+"}$
                            {Number(tx.amount).toFixed(2)}
                          </p>
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="escrow">
              <ScrollArea className="h-[400px] pr-4">
                {escrowTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No escrow transactions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {escrowTransactions.map((escrow) => (
                      <div
                        key={escrow.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">Escrow Transaction</p>
                          <p className="text-xs text-muted-foreground">
                            Held: {new Date(escrow.held_at).toLocaleDateString()}
                          </p>
                          {escrow.released_at && (
                            <p className="text-xs text-muted-foreground">
                              Released: {new Date(escrow.released_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${Number(escrow.amount).toFixed(2)}</p>
                          {getStatusBadge(escrow.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
