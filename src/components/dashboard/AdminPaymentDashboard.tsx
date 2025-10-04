import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, TrendingUp, Clock, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PaymentStats {
  totalReceived: number;
  pendingCount: number;
  paidCount: number;
  conversionRate: number;
}

interface RecentPayment {
  id: string;
  address: string;
  amount_btc: number;
  status: string;
  created_at: string;
  txid: string | null;
  confirmations: number;
  order_number: string;
}

export function AdminPaymentDashboard() {
  const [stats, setStats] = useState<PaymentStats>({
    totalReceived: 0,
    pendingCount: 0,
    paidCount: 0,
    conversionRate: 0,
  });
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [oldPendingPayments, setOldPendingPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch payment stats
      const { data: payments, error: paymentsError } = await supabase
        .from("btc_payments")
        .select("*");

      if (paymentsError) throw paymentsError;

      const paid = payments?.filter((p) => p.status === "paid") || [];
      const pending = payments?.filter((p) => p.status === "pending") || [];
      const totalBTC = paid.reduce((sum, p) => sum + Number(p.amount_btc), 0);

      // Calculate conversion rate
      const totalOrders = payments?.length || 0;
      const conversionRate = totalOrders > 0 ? (paid.length / totalOrders) * 100 : 0;

      setStats({
        totalReceived: totalBTC,
        pendingCount: pending.length,
        paidCount: paid.length,
        conversionRate,
      });

      // Fetch recent payments with order info
      const { data: recentData, error: recentError } = await supabase
        .from("btc_payments")
        .select(`
          id,
          address,
          amount_btc,
          status,
          created_at,
          txid,
          confirmations,
          order_id,
          orders!inner (order_number)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (recentError) throw recentError;

      const formattedPayments = recentData?.map((p: any) => ({
        id: p.id,
        address: p.address,
        amount_btc: p.amount_btc,
        status: p.status,
        created_at: p.created_at,
        txid: p.txid,
        confirmations: p.confirmations,
        order_number: p.orders?.order_number || "N/A",
      })) || [];

      setRecentPayments(formattedPayments);

      // Find payments pending > 30 minutes
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const oldPending = formattedPayments.filter(
        (p) => p.status === "pending" && new Date(p.created_at) < thirtyMinsAgo
      );
      setOldPendingPayments(oldPending);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualRetryCheck = async () => {
    try {
      setRetrying(true);
      
      const { data, error } = await supabase.functions.invoke("btc-check-payments");

      if (error) throw error;

      toast({
        title: "Payment Check Triggered",
        description: `Checked ${data.checked} payments, updated ${data.updated}`,
      });

      // Refresh dashboard
      await fetchDashboardData();
    } catch (error) {
      console.error("Error triggering payment check:", error);
      toast({
        title: "Error",
        description: "Failed to trigger payment check",
        variant: "destructive",
      });
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up realtime subscription
    const channel = supabase
      .channel("btc_payments_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "btc_payments",
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const paymentColumns = [
    {
      key: "order_number",
      label: "Order #",
      render: (payment: RecentPayment) => (
        <span className="font-mono text-sm">{payment.order_number}</span>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (payment: RecentPayment) => (
        <span className="font-mono text-xs">
          {payment.address.slice(0, 12)}...{payment.address.slice(-8)}
        </span>
      ),
    },
    {
      key: "amount_btc",
      label: "Amount",
      render: (payment: RecentPayment) => (
        <span className="font-semibold">₿{payment.amount_btc.toFixed(8)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (payment: RecentPayment) => (
        <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
          {payment.status}
        </Badge>
      ),
    },
    {
      key: "confirmations",
      label: "Confirmations",
      render: (payment: RecentPayment) => (
        <span className="text-sm">{payment.confirmations || 0}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (payment: RecentPayment) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "txid",
      label: "Transaction",
      render: (payment: RecentPayment) => (
        payment.txid ? (
          <a
            href={`https://blockstream.info/tx/${payment.txid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs"
          >
            View TX
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Pending</span>
        )
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert for old pending payments */}
      {oldPendingPayments.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {oldPendingPayments.length} payment(s) have been pending for over 30 minutes.
            Consider checking manually.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BTC Received</CardTitle>
            <Bitcoin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₿{stats.totalReceived.toFixed(8)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidCount}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Pending to paid ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Retry Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleManualRetryCheck}
          disabled={retrying}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
          {retrying ? "Checking..." : "Manual Payment Check"}
        </Button>
      </div>

      {/* Recent Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bitcoin Payments</CardTitle>
          <CardDescription>Last 20 payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataTable data={recentPayments} columns={paymentColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
