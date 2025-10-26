import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateBitcoinQR } from '@/lib/bitcoinUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface BitcoinPaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  onPaymentVerified?: () => void;
}

interface PaymentDetails {
  address: string;
  amountBtc: number;
  amountUsd: number;
  reservedUntil: string;
}

export function BitcoinPaymentModal({ 
  open, 
  onClose, 
  orderId,
  onPaymentVerified 
}: BitcoinPaymentModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verified' | 'expired'>('pending');

  useEffect(() => {
    if (open && orderId) {
      fetchPaymentDetails();
      const interval = setInterval(checkPaymentStatus, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [open, orderId]);

  useEffect(() => {
    if (paymentDetails?.reservedUntil) {
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentDetails]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, bitcoin_addresses(*)')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      if (!order.bitcoin_addresses?.[0]) {
        throw new Error('Bitcoin address not assigned');
      }

      const btcAddress = order.bitcoin_addresses[0];
      const amountBtc = order.btc_price_at_order 
        ? order.total_amount / order.btc_price_at_order 
        : 0;

      const details: PaymentDetails = {
        address: btcAddress.address,
        amountBtc,
        amountUsd: order.total_amount,
        reservedUntil: btcAddress.reserved_until || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };

      setPaymentDetails(details);

      // Generate QR code
      const qr = await generateBitcoinQR(details.address, details.amountBtc);
      setQrCode(qr);

      updateTimeLeft();
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTimeLeft = () => {
    if (!paymentDetails) return;
    
    const now = new Date().getTime();
    const expiry = new Date(paymentDetails.reservedUntil).getTime();
    const diff = Math.max(0, expiry - now);
    
    setTimeLeft(Math.floor(diff / 1000));
    
    if (diff === 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId || verifying) return;

    try {
      setVerifying(true);
      
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (order?.status === 'processing' || order?.status === 'completed') {
        setPaymentStatus('verified');
        toast({
          title: 'Payment Confirmed!',
          description: 'Your Bitcoin payment has been verified.',
        });
        onPaymentVerified?.();
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setVerifying(false);
    }
  };

  const copyAddress = async () => {
    if (!paymentDetails) return;
    
    await navigator.clipboard.writeText(paymentDetails.address);
    toast({
      title: 'Copied!',
      description: 'Bitcoin address copied to clipboard',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (paymentStatus === 'verified') return 'text-success';
    if (paymentStatus === 'expired') return 'text-destructive';
    if (timeLeft < 300) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bitcoin Payment</DialogTitle>
          <DialogDescription>
            Send the exact amount to the address below
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : paymentStatus === 'expired' ? (
          <div className="text-center space-y-4 py-8">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Payment Address Expired</h3>
              <p className="text-sm text-muted-foreground mt-2">
                The reservation time has expired. Please create a new order.
              </p>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : paymentStatus === 'verified' ? (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="w-16 h-16 mx-auto text-success" />
            <div>
              <h3 className="text-lg font-semibold">Payment Confirmed!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your Bitcoin payment has been verified successfully.
              </p>
            </div>
            <Button onClick={onClose}>Continue</Button>
          </div>
        ) : (
          paymentDetails && (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <img src={qrCode} alt="Bitcoin QR Code" className="w-64 h-64 border rounded-lg" />
              </div>

              {/* Amount */}
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold">
                  {paymentDetails.amountBtc.toFixed(8)} BTC
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${paymentDetails.amountUsd.toFixed(2)} USD
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bitcoin Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={paymentDetails.address}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted font-mono"
                  />
                  <Button size="icon" variant="outline" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className={`w-5 h-5 ${getStatusColor()}`} />
                <span className={`font-semibold ${getStatusColor()}`}>
                  {formatTime(timeLeft)} remaining
                </span>
              </div>

              {/* Status */}
              <div className="text-center text-sm text-muted-foreground">
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    Checking for payment...
                  </span>
                ) : (
                  'Waiting for payment confirmation...'
                )}
              </div>

              {/* Warning */}
              <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                <p className="text-xs text-warning-foreground">
                  <strong>Important:</strong> Send the exact amount to this address. 
                  The address is reserved for 15 minutes.
                </p>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
