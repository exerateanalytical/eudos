import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, Users, Clock } from "lucide-react";
import { format, subDays } from "date-fns";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1'];

export function BitcoinAnalyticsDashboard() {
  // Fetch daily analytics for last 30 days
  const { data: dailyAnalytics, isLoading: dailyLoading } = useQuery({
    queryKey: ['bitcoin-daily-analytics'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data, error } = await supabase
        .from('bitcoin_payment_analytics')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch hourly analytics for last 24 hours
  const { data: hourlyAnalytics } = useQuery({
    queryKey: ['bitcoin-hourly-analytics'],
    queryFn: async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from('bitcoin_hourly_analytics')
        .select('*')
        .gte('hour_timestamp', twentyFourHoursAgo.toISOString())
        .order('hour_timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000
  });

  // Fetch recent payment events
  const { data: recentEvents } = useQuery({
    queryKey: ['bitcoin-recent-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bitcoin_payment_events')
        .select('*, orders(*)')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  // Calculate summary metrics
  const summaryMetrics = dailyAnalytics?.reduce((acc, day) => ({
    totalRevenue: acc.totalRevenue + Number(day.total_revenue_usd || 0),
    totalOrders: acc.totalOrders + (day.total_orders || 0),
    successfulPayments: acc.successfulPayments + (day.successful_payments || 0),
    failedPayments: acc.failedPayments + (day.failed_payments || 0),
    avgConfirmationTime: acc.avgConfirmationTime + (day.avg_confirmation_time_minutes || 0),
    uniqueUsers: Math.max(acc.uniqueUsers, day.unique_users || 0)
  }), {
    totalRevenue: 0,
    totalOrders: 0,
    successfulPayments: 0,
    failedPayments: 0,
    avgConfirmationTime: 0,
    uniqueUsers: 0
  });

  const successRate = summaryMetrics && summaryMetrics.totalOrders > 0
    ? ((summaryMetrics.successfulPayments / summaryMetrics.totalOrders) * 100).toFixed(1)
    : '0';

  const avgConfTime = summaryMetrics && dailyAnalytics
    ? Math.round(summaryMetrics.avgConfirmationTime / dailyAnalytics.length)
    : 0;

  // Event type distribution
  const eventDistribution = recentEvents?.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = eventDistribution ? Object.entries(eventDistribution).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  })) : [];

  if (dailyLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summaryMetrics?.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics?.totalOrders} total orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {successRate}%
              {Number(successRate) >= 80 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics?.successfulPayments} successful / {summaryMetrics?.failedPayments} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confirmation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfTime} min</div>
            <p className="text-xs text-muted-foreground">
              Average time to payment confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics?.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Customers who paid with Bitcoin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Volume</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Metrics</TabsTrigger>
          <TabsTrigger value="events">Event Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue (USD & BTC)</CardTitle>
              <CardDescription>Revenue trends over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                    formatter={(value: number, name: string) => [
                      name.includes('BTC') 
                        ? value.toFixed(8) 
                        : `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                      name
                    ]}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="total_revenue_usd" stroke="#10b981" name="Revenue (USD)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="total_revenue_btc" stroke="#f59e0b" name="Revenue (BTC)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Order Volume</CardTitle>
              <CardDescription>Order status breakdown over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  />
                  <Legend />
                  <Bar dataKey="successful_payments" stackId="a" fill="#10b981" name="Successful" />
                  <Bar dataKey="failed_payments" stackId="a" fill="#ef4444" name="Failed" />
                  <Bar dataKey="expired_payments" stackId="a" fill="#f59e0b" name="Expired" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Metrics (Last 24h)</CardTitle>
              <CardDescription>Real-time payment activity by hour</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour_timestamp" 
                    tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(timestamp) => format(new Date(timestamp), 'MMM dd, HH:mm')}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="orders_created" stroke="#6366f1" name="Orders Created" strokeWidth={2} />
                  <Line type="monotone" dataKey="payments_confirmed" stroke="#10b981" name="Confirmed" strokeWidth={2} />
                  <Line type="monotone" dataKey="payments_failed" stroke="#ef4444" name="Failed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Payment event types (last 100 events)</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest payment events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {recentEvents?.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-sm border-b pb-2">
                      <div>
                        <p className="font-medium">
                          {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order: {event.orders?.order_number || 'N/A'}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
