import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import QRCode from "qrcode";

interface BitcoinPaymentProps {
  walletId: string;
  orderId: string;
  amountBTC: number;
  amountFiat?: number;
  onPaymentComplete?: (paymentId: string) => void;
}

export function BitcoinPayment({
  walletId,
  orderId,
  amountBTC,
  amountFiat,
  onPaymentComplete
}: BitcoinPaymentProps) {
  const [payment, setPayment] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    createPayment();
  }, []);

  useEffect(() => {
    if (payment && payment.status === 'pending') {
      const interval = setInterval(() => {
        pollPaymentStatus();
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(interval);
    }
  }, [payment]);

  const createPayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('btc-create-payment', {
        body: {
          wallet_id: walletId,
          order_id: orderId,
          amount_btc: amountBTC,
          amount_fiat: amountFiat,
          user_id: user?.id
        }
      });

      if (error) throw error;

      setPayment(data.payment);
      
      // Generate QR code
      const qr = await QRCode.toDataURL(data.bitcoinURI);
      setQrCodeUrl(qr);

      toast({
        title: "Payment Created",
        description: "Scan the QR code or copy the address to pay",
      });
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

  const pollPaymentStatus = async () => {
    if (!payment || polling) return;
    
    setPolling(true);
    try {
      const { data, error } = await supabase
        .from('btc_payments')
        .select('*')
        .eq('id', payment.id)
        .single();

      if (error) throw error;

      if (data.status !== payment.status) {
        setPayment(data);
        
        if (data.status === 'paid') {
          toast({
            title: "Payment Confirmed!",
            description: "Your Bitcoin payment has been confirmed",
          });
          onPaymentComplete?.(payment.id);
        }
      }
    } catch (error: any) {
      console.error('Error polling payment:', error);
    } finally {
      setPolling(false);
    }
  };

  const copyAddress = () => {
    if (payment?.address) {
      navigator.clipboard.writeText(payment.address);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Creating Bitcoin payment...</p>
        </div>
      </Card>
    );
  }

  if (!payment) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Pay with Bitcoin</h3>
        <div className="flex items-center gap-2">
          <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
            {payment.status}
          </Badge>
          {payment.confirmations > 0 && (
            <span className="text-sm text-muted-foreground">
              {payment.confirmations} confirmation{payment.confirmations !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
          <p className="text-2xl font-bold">{amountBTC} BTC</p>
          {amountFiat && (
            <p className="text-sm text-muted-foreground">≈ ${amountFiat}</p>
          )}
        </div>

        {qrCodeUrl && (
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Bitcoin Address</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
              {payment.address}
            </code>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {payment.txid && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                {payment.txid}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://blockstream.info/tx/${payment.txid}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Send exactly {amountBTC} BTC to the address above. Payment will be confirmed after 1 block confirmation.
        </p>
      </div>
    </Card>
  );
}