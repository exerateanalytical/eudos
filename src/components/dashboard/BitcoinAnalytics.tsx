import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bitcoin, TrendingUp, Target, DollarSign } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalBTC: number;
  totalOrders: number;
  conversionRate: number;
  avgConfirmationTime: number;
  paymentsByDay: Array<{ date: string; amount: number; count: number }>;
  topProducts: Array<{ product: string; count: number; revenue: number }>;
}

const COLORS = ["#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4"];

export function BitcoinAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBTC: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgConfirmationTime: 0,
    paymentsByDay: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all Bitcoin payments
      const { data: payments, error: paymentsError } = await supabase
        .from("btc_payments")
        .select("*, orders(product_name, created_at)");

      if (paymentsError) throw paymentsError;

      // Calculate metrics
      const paidPayments = payments?.filter((p) => p.status === "paid") || [];
      const totalBTC = paidPayments.reduce((sum, p) => sum + Number(p.amount_btc), 0);
      const totalOrders = payments?.length || 0;
      const conversionRate = totalOrders > 0 ? (paidPayments.length / totalOrders) * 100 : 0;

      // Group by day
      const paymentsByDay = paidPayments.reduce((acc: Record<string, { date: string; amount: number; count: number }>, payment) => {
        const date = new Date(payment.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, amount: 0, count: 0 };
        }
        acc[date].amount += Number(payment.amount_btc);
        acc[date].count += 1;
        return acc;
      }, {});

      // Top products
      const productStats = paidPayments.reduce((acc: Record<string, { product: string; count: number; revenue: number }>, payment) => {
        const product = payment.orders?.product_name || "Unknown";
        if (!acc[product]) {
          acc[product] = { product, count: 0, revenue: 0 };
        }
        acc[product].count += 1;
        acc[product].revenue += Number(payment.amount_btc);
        return acc;
      }, {});

      const topProducts = (Object.values(productStats) as Array<{ product: string; count: number; revenue: number }>)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setAnalytics({
        totalBTC,
        totalOrders,
        conversionRate,
        avgConfirmationTime: 15, // Placeholder - would need actual confirmation time tracking
        paymentsByDay: Object.values(paymentsByDay).slice(-7) as Array<{ date: string; amount: number; count: number }>,
        topProducts: topProducts as Array<{ product: string; count: number; revenue: number }>,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BTC Revenue</CardTitle>
            <Bitcoin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₿{analytics.totalBTC.toFixed(8)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Bitcoin payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Pending to paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confirmation</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgConfirmationTime} min</div>
            <p className="text-xs text-muted-foreground">Average time to confirm</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payments Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Payments Over Time</CardTitle>
            <CardDescription>Last 7 days of Bitcoin payments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.paymentsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>By Bitcoin payment volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product, count }) => `${product.slice(0, 15)}... (${count})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Bitcoin sales by product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topProducts.map((product: any, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{product.product}</p>
                  <p className="text-sm text-muted-foreground">{product.count} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₿{product.revenue.toFixed(8)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
