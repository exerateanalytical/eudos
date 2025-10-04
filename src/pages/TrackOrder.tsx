import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import QRCode from "qrcode";

interface OrderData {
  id: string;
  order_number: string;
  product_name: string;
  product_type: string;
  total_amount: number;
  status: string;
  created_at: string;
  btc_payments: Array<{
    address: string;
    txid: string | null;
    confirmations: number | null;
    status: string;
    amount_btc: number;
  }>;
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const { toast } = useToast();

  const handleTrackOrder = async () => {
    if (!orderNumber.trim() || !contactInfo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both order number and email/phone",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          product_name,
          product_type,
          total_amount,
          status,
          created_at,
          btc_payments (
            address,
            txid,
            confirmations,
            status,
            amount_btc
          )
        `)
        .eq('order_number', orderNumber)
        .or(`guest_phone.eq.${contactInfo},guest_email.eq.${contactInfo}`)
        .single();

      if (error || !data) {
        toast({
          title: "Order Not Found",
          description: "No order found with this order number and contact information.",
          variant: "destructive",
        });
        setOrderData(null);
        return;
      }

      setOrderData(data as any);

      // Generate QR code if payment is pending
      if (data.btc_payments?.[0]?.address && data.btc_payments[0].status === 'pending') {
        const btcUri = `bitcoin:${data.btc_payments[0].address}?amount=${data.btc_payments[0].amount_btc}`;
        const qr = await QRCode.toDataURL(btcUri);
        setQrCode(qr);
      }

      toast({
        title: "Order Found",
        description: "Your order details are displayed below.",
      });
    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order | SecureDocHub</title>
        <meta name="description" content="Track your order status and Bitcoin payment details" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order details to check the status</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>Enter your order number and email or phone number</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    placeholder="ORD-20250104-XXXXX"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactInfo">Email or Phone Number</Label>
                  <Input
                    id="contactInfo"
                    placeholder="email@example.com or +1234567890"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                </div>
                <Button onClick={handleTrackOrder} disabled={loading} className="w-full">
                  {loading ? "Searching..." : "Track Order"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {orderData && (
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Order #{orderData.order_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{orderData.product_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">${orderData.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <Badge className={getStatusColor(orderData.status)}>
                      {orderData.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{new Date(orderData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {orderData.btc_payments?.[0] && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Bitcoin Payment Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                        <Badge className={getStatusColor(orderData.btc_payments[0].status)}>
                          {orderData.btc_payments[0].status === 'paid' ? (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          ) : (
                            <Clock className="h-4 w-4 mr-1" />
                          )}
                          {orderData.btc_payments[0].status.toUpperCase()}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bitcoin Address</p>
                        <code className="text-xs bg-muted p-2 rounded block break-all">
                          {orderData.btc_payments[0].address}
                        </code>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                        <p className="font-mono">{orderData.btc_payments[0].amount_btc} BTC</p>
                      </div>

                      {orderData.btc_payments[0].txid && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                          <a
                            href={`https://blockstream.info/tx/${orderData.btc_payments[0].txid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            {orderData.btc_payments[0].txid.substring(0, 16)}...
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          {orderData.btc_payments[0].confirmations !== null && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {orderData.btc_payments[0].confirmations} confirmations
                            </p>
                          )}
                        </div>
                      )}

                      {qrCode && orderData.btc_payments[0].status === 'pending' && (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Scan to Pay</p>
                          <img src={qrCode} alt="Bitcoin Payment QR Code" className="mx-auto max-w-[200px]" />
                          <Alert className="mt-4">
                            <AlertDescription>
                              Waiting for payment confirmation. This page will update automatically.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      {orderData.btc_payments[0].status === 'paid' && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Payment confirmed! Your order is being processed.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
