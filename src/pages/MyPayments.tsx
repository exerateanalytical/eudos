import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, Check, Bitcoin, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatBtc, formatUsd } from '@/lib/btcPriceService';
import { format } from 'date-fns';

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  bitcoin_tx_hash: string | null;
  created_at: string;
  completed_at: string | null;
  metadata: any;
  order: {
    order_number: string;
    product_name: string;
    btc_price_at_order: number;
  };
  bitcoin_address?: {
    address: string;
    payment_confirmed: boolean;
  };
}

export const MyPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          order:orders(order_number, product_name, btc_price_at_order)
        `)
        .eq('user_id', user.id)
        .eq('transaction_type', 'escrow_payment')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch Bitcoin addresses for each order
      const paymentsWithAddresses = await Promise.all(
        (data || []).map(async (payment) => {
          const { data: addressData } = await supabase
            .from('bitcoin_addresses')
            .select('address, payment_confirmed')
            .eq('assigned_to_order', payment.order_id)
            .maybeSingle();

          return {
            ...payment,
            bitcoin_address: addressData
          };
        })
      );

      setPayments(paymentsWithAddresses as Payment[]);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    toast.success(`${type} copied to clipboard`);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStatusBadge = (status: string, paymentConfirmed?: boolean) => {
    if (status === 'completed' || paymentConfirmed) {
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Confirmed</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400">Pending</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getConfirmations = (metadata: any) => {
    return metadata?.confirmations || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">My Bitcoin Payments</h1>
        <p className="text-muted-foreground mt-2">View all your Bitcoin payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bitcoin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No payment history yet</p>
            <Button onClick={() => navigate('/escrow')} className="mt-4">
              Create Your First Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bitcoin className="h-5 w-5 text-orange-500" />
                      Order #{payment.order?.order_number}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {payment.order?.product_name}
                    </CardDescription>
                  </div>
                  {getStatusBadge(payment.status, payment.bitcoin_address?.payment_confirmed)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount (USD)</p>
                    <p className="text-lg font-semibold">{formatUsd(payment.amount)}</p>
                  </div>
                  {payment.order?.btc_price_at_order && (
                    <div>
                      <p className="text-sm text-muted-foreground">Amount (BTC)</p>
                      <p className="text-lg font-semibold font-mono">
                        {formatBtc(payment.amount / payment.order.btc_price_at_order)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">
                      {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Bitcoin Address */}
                {payment.bitcoin_address && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Payment Address</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-background p-2 rounded border">
                        {payment.bitcoin_address.address}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(payment.bitcoin_address!.address, 'Address')}
                      >
                        {copiedAddress === payment.bitcoin_address.address ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Transaction Hash */}
                {payment.bitcoin_tx_hash && (
                  <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Transaction Hash</p>
                      <Badge variant="outline" className="text-xs">
                        {getConfirmations(payment.metadata)} Confirmations
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-background p-2 rounded border font-mono">
                        {payment.bitcoin_tx_hash}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(payment.bitcoin_tx_hash!, 'TX Hash')}
                      >
                        {copiedAddress === payment.bitcoin_tx_hash ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a
                          href={`https://blockchair.com/bitcoin/transaction/${payment.bitcoin_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Completed Date */}
                {payment.completed_at && (
                  <div className="text-sm text-muted-foreground">
                    Completed on {format(new Date(payment.completed_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
