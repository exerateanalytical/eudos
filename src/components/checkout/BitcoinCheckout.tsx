import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import QRCode from "qrcode";

interface BitcoinCheckoutProps {
  walletId: string;
  productName: string;
  productType: string;
  amountBTC: number;
  amountFiat?: number;
  guestInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  onPaymentComplete?: () => void;
}

export function BitcoinCheckout({
  walletId,
  productName,
  productType,
  amountBTC,
  amountFiat,
  guestInfo,
  onPaymentComplete,
}: BitcoinCheckoutProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [payment, setPayment] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    createPaymentAndOrder();
  }, []);

  useEffect(() => {
    if (payment && payment.status === "pending") {
      setPolling(true);
      const interval = setInterval(pollPaymentStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [payment]);

  const createPaymentAndOrder = async () => {
    try {
      console.log("BitcoinCheckout: Starting payment creation");
      console.log("Wallet ID:", walletId);
      console.log("Amount BTC:", amountBTC);
      console.log("Product:", productName);
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate order number
      const { data: orderNumberData, error: orderNumError } = await supabase
        .rpc('generate_order_number');
      
      if (orderNumError) throw orderNumError;
      const newOrderNumber = orderNumberData as string;
      setOrderNumber(newOrderNumber);

      // Create order first
      const orderData: any = {
        order_number: newOrderNumber,
        product_name: productName,
        product_type: productType,
        total_amount: amountFiat || amountBTC,
        status: 'pending',
        payment_method: 'bitcoin',
      };

      if (user) {
        orderData.user_id = user.id;
      } else if (guestInfo) {
        orderData.guest_name = guestInfo.name;
        orderData.guest_phone = guestInfo.phone;
        orderData.guest_email = guestInfo.email;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create Bitcoin payment
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'btc-create-payment',
        {
          body: {
            wallet_id: walletId,
            order_id: order.id,
            amount_btc: amountBTC,
            amount_fiat: amountFiat,
            user_id: user?.id,
            guest_name: guestInfo?.name,
            guest_phone: guestInfo?.phone,
            guest_email: guestInfo?.email,
            product_name: productName,
            product_type: productType,
          },
        }
      );

      if (paymentError) throw paymentError;

      // Update order with btc_payment_id
      await supabase
        .from('orders')
        .update({ btc_payment_id: paymentData.payment.id })
        .eq('id', order.id);

      setPayment(paymentData.payment);

      // Generate QR code
      const qrCode = await QRCode.toDataURL(paymentData.bitcoinURI);
      setQrCodeUrl(qrCode);

      toast({
        title: "Payment Created",
        description: `Order ${newOrderNumber} created successfully`,
      });
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async () => {
    if (!payment) return;

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
          setPolling(false);
          toast({
            title: "Payment Confirmed!",
            description: "Your Bitcoin payment has been confirmed.",
          });
          onPaymentComplete?.();
        }
      }
    } catch (error) {
      console.error("Error polling payment status:", error);
    }
  };

  const copyAddress = () => {
    if (payment?.address) {
      navigator.clipboard.writeText(payment.address);
      toast({
        title: "Copied!",
        description: "Bitcoin address copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order {orderNumber}</CardTitle>
            <Badge variant={payment?.status === 'paid' ? 'default' : 'secondary'}>
              {payment?.status === 'paid' ? (
                <><CheckCircle2 className="h-4 w-4 mr-1" /> Paid</>
              ) : (
                <><Clock className="h-4 w-4 mr-1" /> Pending</>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Order Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Product:</span> {productName}</p>
              <p><span className="text-muted-foreground">Amount:</span> {amountBTC} BTC</p>
              {amountFiat && (
                <p><span className="text-muted-foreground">≈</span> ${amountFiat.toFixed(2)} USD</p>
              )}
              {guestInfo && (
                <>
                  <p><span className="text-muted-foreground">Name:</span> {guestInfo.name}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {guestInfo.phone}</p>
                  {guestInfo.email && (
                    <p><span className="text-muted-foreground">Email:</span> {guestInfo.email}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {payment && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Payment Instructions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send exactly <span className="font-bold text-foreground">{amountBTC} BTC</span> to the address below:
                </p>
                
                {qrCodeUrl && (
                  <div className="flex justify-center mb-4">
                    <img src={qrCodeUrl} alt="Bitcoin QR Code" className="w-64 h-64" />
                  </div>
                )}

                <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                  <code className="text-sm break-all flex-1">{payment.address}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {payment.txid && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Transaction Details</h3>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                      {payment.txid}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={`https://blockstream.info/tx/${payment.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                  {payment.confirmations !== undefined && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Confirmations: {payment.confirmations}/1
                    </p>
                  )}
                </div>
              )}

              {polling && payment.status === 'pending' && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    ⏳ Waiting for payment... This page will update automatically when payment is detected.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
