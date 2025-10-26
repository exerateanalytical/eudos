import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, PlayCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export function BulkPaymentOperations() {
  const queryClient = useQueryClient();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<string>("verify_payments");

  // Fetch pending Bitcoin orders
  const { data: pendingOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['pending-bitcoin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, bitcoin_addresses(*), transactions(*)')
        .eq('payment_method', 'bitcoin')
        .eq('status', 'pending_payment')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch bulk operation history
  const { data: operations, isLoading: opsLoading } = useQuery({
    queryKey: ['bulk-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_payment_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Execute bulk operation
  const executeBulkOperation = useMutation({
    mutationFn: async ({ type, orderIds }: { type: string; orderIds?: string[] }) => {
      const { data, error } = await supabase.functions.invoke('bulk-payment-operations', {
        body: {
          operationType: type,
          orderIds: orderIds || selectedOrders,
          metadata: {
            totalSelected: orderIds?.length || selectedOrders.length,
            initiatedAt: new Date().toISOString()
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Bulk operation completed: ${data.operation.successful_items} succeeded`);
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
      queryClient.invalidateQueries({ queryKey: ['pending-bitcoin-orders'] });
      setSelectedOrders([]);
    },
    onError: (error: any) => {
      toast.error(`Bulk operation failed: ${error.message}`);
    }
  });

  const handleSelectAll = () => {
    if (selectedOrders.length === pendingOrders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pendingOrders?.map(o => o.id) || []);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Operation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Payment Operations</CardTitle>
          <CardDescription>
            Process multiple Bitcoin payments simultaneously for efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select operation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verify_payments">Verify Payments</SelectItem>
                <SelectItem value="release_escrow">Release Escrow</SelectItem>
                <SelectItem value="refund_batch">Batch Refunds</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => executeBulkOperation.mutate({ type: operationType })}
              disabled={selectedOrders.length === 0 || executeBulkOperation.isPending}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Execute on {selectedOrders.length} Selected
            </Button>

            <Badge variant="outline">
              {selectedOrders.length} / {pendingOrders?.length || 0} selected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Bitcoin Orders</CardTitle>
          <CardDescription>Select orders for bulk processing</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrders.length === pendingOrders?.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Bitcoin Address</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.bitcoin_addresses?.[0]?.address?.substring(0, 20)}...
                    </TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM dd, HH:mm')}</TableCell>
                    <TableCell>
                      {order.bitcoin_addresses?.[0]?.reserved_until ? (
                        <span className={
                          new Date(order.bitcoin_addresses[0].reserved_until) < new Date()
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        }>
                          {format(new Date(order.bitcoin_addresses[0].reserved_until), 'MMM dd, HH:mm')}
                        </span>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Operation History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bulk Operations</CardTitle>
          <CardDescription>History of bulk payment operations</CardDescription>
        </CardHeader>
        <CardContent>
          {opsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Operation Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations?.map((op) => {
                  const successRate = op.processed_items > 0
                    ? ((op.successful_items / op.processed_items) * 100).toFixed(0)
                    : '0';
                  const duration = op.started_at && op.completed_at
                    ? Math.round((new Date(op.completed_at).getTime() - new Date(op.started_at).getTime()) / 1000)
                    : null;

                  return (
                    <TableRow key={op.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(op.status)}
                          <span className="capitalize">{op.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {op.operation_type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>
                        {op.processed_items} / {op.total_items}
                      </TableCell>
                      <TableCell>
                        <Badge variant={Number(successRate) >= 80 ? 'default' : 'destructive'}>
                          {successRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(op.created_at), 'MMM dd, HH:mm')}</TableCell>
                      <TableCell>
                        {duration ? `${duration}s` : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
