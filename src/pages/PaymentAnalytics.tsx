import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatUsd, formatBtc } from "@/lib/btcPriceService";

interface PaymentStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  pendingAmount: number;
  completedOrders: number;
  completedAmount: number;
  avgOrderValue: number;
  conversionRate: number;
}

export default function PaymentAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchAnalytics();
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch orders with Bitcoin payment method
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_method', 'bitcoin')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed' || o.status === 'processing').length || 0;

      const totalAmount = orders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
      const pendingAmount = orders?.filter(o => o.status === 'pending').reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
      const completedAmount = orders?.filter(o => o.status === 'completed' || o.status === 'processing').reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;

      setStats({
        totalOrders,
        totalAmount,
        pendingOrders,
        pendingAmount,
        completedOrders,
        completedAmount,
        avgOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
        conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      });

      setRecentPayments(orders?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Analytics</h1>
        <Badge variant="outline">Bitcoin Payments</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUsd(stats?.totalAmount || 0)}</div>
            <p className="text-xs text-muted-foreground">{stats?.totalOrders} total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUsd(stats?.pendingAmount || 0)}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingOrders} pending orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUsd(stats?.completedAmount || 0)}</div>
            <p className="text-xs text-muted-foreground">{stats?.completedOrders} completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Avg: {formatUsd(stats?.avgOrderValue || 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex-1">
                  <div className="font-medium">{payment.order_number}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.product_name} • {new Date(payment.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatUsd(payment.total_amount)}</div>
                    {payment.btc_price_at_order && (
                      <div className="text-xs text-muted-foreground">
                        {formatBtc(payment.total_amount / payment.btc_price_at_order)}
                      </div>
                    )}
                  </div>
                  <Badge variant={
                    payment.status === 'completed' ? 'default' :
                    payment.status === 'processing' ? 'secondary' :
                    payment.status === 'pending' ? 'outline' : 'destructive'
                  }>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
