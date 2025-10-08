import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [payment, setPayment] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [polling, setPolling] = useState(false);
  const [configError, setConfigError] = useState<string>("");

  // Verify wallet configuration
  useEffect(() => {
    verifyWalletConfig();
  }, [walletId]);

  useEffect(() => {
    if (payment && payment.status === "pending") {
      setPolling(true);
      const interval = setInterval(pollPaymentStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [payment]);

  const verifyWalletConfig = async () => {
    try {
      const { data: wallet, error } = await supabase
        .from('btc_wallets')
        .select('*')
        .eq('id', walletId)
        .single();

      if (error || !wallet) {
        setConfigError("Bitcoin wallet not configured. Please contact support.");
        setLoading(false);
        return;
      }

      // Enhanced validation checks
      if (!wallet.is_active) {
        setConfigError("Bitcoin wallet is currently disabled. Please contact support.");
        setLoading(false);
        return;
      }

      if (!wallet.xpub || wallet.xpub.length < 100) {
        setConfigError("Invalid wallet configuration (xpub). Please contact support.");
        setLoading(false);
        return;
      }

      // Validate derivation path format (BIP32/BIP44/BIP84)
      if (!wallet.derivation_path || !wallet.derivation_path.match(/^m(\/\d+'?)+$/)) {
        setConfigError("Invalid wallet derivation path format. Please contact support.");
        setLoading(false);
        return;
      }

      console.log("✓ Bitcoin wallet verified:", wallet.name);
      // If wallet is valid, proceed with payment creation
      createPaymentAndOrder();
    } catch (error: any) {
      console.error("Wallet verification error:", error);
      setConfigError("Failed to verify payment configuration.");
      setLoading(false);
    }
  };

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
      
      setOrderId(order.id);
      console.log("✓ Order created:", order.order_number);

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
      console.log("✓ Bitcoin payment created:", paymentData.payment.address);

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

      if (data.status !== payment.status || data.txid !== payment.txid) {
        setPayment(data);
        
        if (data.status === 'paid' && data.txid) {
          setPolling(false);
          
          toast({
            title: "Payment Confirmed!",
            description: "Redirecting to your order details...",
          });
          
          // Redirect to order details after 2 seconds
          setTimeout(() => {
            if (onPaymentComplete) {
              onPaymentComplete();
            }
            navigate(`/dashboard/orders?order=${orderId}`);
          }, 2000);
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

  if (configError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {configError}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <DialogHeader>
        <DialogTitle>Bitcoin Payment - Order {orderNumber}</DialogTitle>
      </DialogHeader>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="sr-only">Order {orderNumber}</CardTitle>
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
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                    <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                      ✓ Transaction ID: {payment.txid.substring(0, 8)}...{payment.txid.substring(payment.txid.length - 8)}
                    </p>
                  </div>
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

              {payment.status === 'paid' && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                    ✓ Payment confirmed! You will be redirected to your order details shortly...
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
