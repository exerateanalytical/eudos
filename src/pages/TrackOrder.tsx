import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";
import { countryCodes } from "@/lib/countryCodes";

interface OrderData {
  id: string;
  order_number: string;
  product_name: string;
  product_type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your order number",
        variant: "destructive",
      });
      return;
    }

    const contact = contactType === "email" ? email : `${countryCode}${phoneNumber}`;
    
    if (!contact.trim()) {
      toast({
        title: "Missing Information",
        description: `Please enter your ${contactType}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('track-order-lookup', {
        body: {
          order_number: orderNumber,
          contact,
        },
      });

      if (error || !data?.order) {
        toast({
          title: "Order Not Found",
          description: error?.message || "No order found with this order number and contact information.",
          variant: "destructive",
        });
        setOrderData(null);
        return;
      }

      setOrderData(data.order);

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
      case 'completed':
        return 'bg-green-600';
      case 'processing':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
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
        <meta name="description" content="Track your order status and payment details" />
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
                  <Label>Contact Method</Label>
                  <RadioGroup value={contactType} onValueChange={(v) => setContactType(v as "email" | "phone")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-radio" />
                      <Label htmlFor="email-radio" className="font-normal">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone-radio" />
                      <Label htmlFor="phone-radio" className="font-normal">Phone Number</Label>
                    </div>
                  </RadioGroup>
                </div>

                {contactType === "email" ? (
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="w-32 bg-background z-50">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
                
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
