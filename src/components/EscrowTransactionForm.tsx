import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check, Copy, Shield, ArrowRight, Search, CheckCircle, Info, Lock, AlertTriangle, Clock, FileCheck, Package, Headphones, Loader2, QrCode, RefreshCw } from "lucide-react";
import { generateBitcoinQR } from "@/lib/bitcoinUtils";
import { escrowProducts, searchProducts, getProductById, type EscrowProduct } from "@/lib/escrowProducts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";


interface EscrowTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EscrowTransactionForm = ({ open, onOpenChange }: EscrowTransactionFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "review" | "payment">("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [whyEscrowOpen, setWhyEscrowOpen] = useState(false);
  const [assignedBtcAddress, setAssignedBtcAddress] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    verified: boolean;
    confirmations: number;
    message: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    selectedProduct: null as EscrowProduct | null,
    quantity: 1,
    specifications: "",
    escrowTerms: "standard",
    customTerms: "",
    deliveryAddress: "",
    additionalInstructions: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
  });

  const escrowFeePercentage = 1.5;

  useEffect(() => {
    if (open) {
      loadUserProfile();
    }
  }, [open]);

  const loadUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to create an escrow");
      navigate('/auth', { state: { returnTo: '/escrow', openForm: true } });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setUserProfile(profile);
      setFormData(prev => ({
        ...prev,
        buyerName: profile.full_name || "",
        buyerEmail: profile.email || session.user.email || "",
        buyerPhone: profile.phone_number || "",
      }));
    }
  };

  const calculateTotal = () => {
    if (!formData.selectedProduct) return { subtotal: 0, fee: 0, total: 0 };
    const subtotal = formData.selectedProduct.price * formData.quantity;
    const fee = subtotal * (escrowFeePercentage / 100);
    const total = subtotal + fee;
    return { subtotal, fee, total };
  };

  const assignBitcoinAddress = async (orderId: string) => {
    setLoadingAddress(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('assign-bitcoin-address', {
        body: { orderId }
      });

      if (error) throw error;

      if (data?.address) {
        setAssignedBtcAddress(data.address);
        // Generate QR code
        const qrCode = await generateBitcoinQR(data.address);
        setQrCodeDataUrl(qrCode);
      } else {
        throw new Error('No address returned');
      }
    } catch (error: any) {
      console.error('Error assigning Bitcoin address:', error);
      const errorMessage = error.message || "Unable to assign Bitcoin address. Please contact support.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (!formData.buyerName || !formData.buyerEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (step === "form") {
      setStep("review");
      return;
    }

    if (step === "review") {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Create order in database FIRST
        const orderData = {
          user_id: userProfile?.id,
          product_type: 'escrow',
          product_name: formData.selectedProduct.name,
          total_amount: total,
          escrow_fee: fee,
          payment_method: 'bitcoin',
          status: 'pending', // Fixed: using valid status value
          guest_name: formData.buyerName,
          guest_email: formData.buyerEmail,
          guest_phone: formData.buyerPhone,
        };
        
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();
        
        if (orderError) throw orderError;
        
        // Store the order ID
        setOrderId(order.id);
        
        // Step 2: Assign Bitcoin address using real order ID
        await assignBitcoinAddress(order.id);
        
        // Step 3: Move to payment step
        setStep("payment");
      } catch (error: any) {
        console.error('Error creating order:', error);
        const errorMessage = error.message || "Failed to create order. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Create transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userProfile?.id,
          order_id: orderId,
          amount: total,
          transaction_type: 'escrow_payment',
          status: 'pending',
          currency: 'BTC',
          description: `Escrow payment for ${formData.selectedProduct?.name}`,
        });
      
      if (txError) throw txError;
      
      // Create escrow transaction record
      const { error: escrowError } = await supabase
        .from('escrow_transactions')
        .insert({
          user_id: userProfile?.id,
          order_id: orderId,
          amount: total,
          status: 'held',
          currency: 'USD',
        });
      
      if (escrowError) throw escrowError;
      
      toast.success("Order created! Please send payment to the displayed address.");
      navigate('/dashboard');
      onOpenChange(false);
      setStep("form");
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      const errorMessage = error.message || "Failed to confirm order. Please contact support.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!orderId) return;

    setVerifyingPayment(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('verify-bitcoin-payment', {
        body: { orderId }
      });

      if (error) throw error;

      setPaymentStatus(data);
      
      if (data.verified) {
        toast.success("Payment verified! Your order is being processed.");
        setTimeout(() => {
          navigate('/dashboard');
          onOpenChange(false);
        }, 2000);
      } else {
        toast.info(data.message || "Payment not yet detected. Please wait a few moments after sending.");
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      const errorMessage = error.message || "Unable to verify payment. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingPayment(false);
    }
  };

  const copyToClipboard = () => {
    if (assignedBtcAddress) {
      navigator.clipboard.writeText(assignedBtcAddress);
      setCopied(true);
      toast.success("Bitcoin address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : [];

  const { subtotal, fee, total } = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-6 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg border-b border-primary/20">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">
                {step === "form" && "Create Secure Escrow"}
                {step === "review" && "Review Escrow Details"}
                {step === "payment" && "Payment Instructions"}
                {step === "payment" && "Payment Instructions"}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {step === "form" && "Protected by blockchain escrow technology"}
                {step === "review" && "Verify all details before proceeding"}
                {step === "payment" && "Secure your funds in escrow"}
                {step === "payment" && "Secure your funds in escrow"}
              </span>
            </div>
          </DialogTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                step === "form" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" : "bg-primary/20 text-primary"
              )}>
                1
              </div>
              <span className={cn("text-xs font-medium", step === "form" ? "text-primary" : "text-muted-foreground")}>Form</span>
            </div>
            <div className={cn("h-0.5 w-8 transition-all", step !== "form" ? "bg-primary" : "bg-muted")} />
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                step === "review" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" : step === "payment" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <span className={cn("text-xs font-medium", step === "review" ? "text-primary" : "text-muted-foreground")}>Review</span>
            </div>
            <div className={cn("h-0.5 w-8 transition-all", step === "payment" ? "bg-primary" : "bg-muted")} />
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                step === "payment" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" : "bg-muted text-muted-foreground"
              )}>
                3
              </div>
              <span className={cn("text-xs font-medium", step === "payment" ? "text-primary" : "text-muted-foreground")}>Payment</span>
            </div>
          </div>
        </DialogHeader>

        {/* Universal Escrow Protection Notice */}
        <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 mt-4">
          <Shield className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-bold flex items-center gap-2">
            🔒 Your Payment is Protected
          </AlertTitle>
          <AlertDescription className="text-sm space-y-2">
            <p className="font-medium">Funds held securely in blockchain escrow until you confirm delivery.</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs"><CheckCircle className="w-3 h-3 mr-1" />Seller Verified</Badge>
              <Badge variant="secondary" className="text-xs"><Lock className="w-3 h-3 mr-1" />Encrypted</Badge>
              <Badge variant="secondary" className="text-xs"><Shield className="w-3 h-3 mr-1" />Dispute Protection</Badge>
            </div>
          </AlertDescription>
        </Alert>

        {step === "form" && (
          <div className="space-y-6 py-4">
            {/* Transaction Parties */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                Escrow Transaction Parties
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-background p-3 rounded-md border">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Seller</Label>
                  <Input value="SecurePrint Labs" readOnly className="font-semibold" />
                  <p className="text-xs text-muted-foreground">Platform verified seller</p>
                </div>
                <div className="space-y-2 bg-background p-3 rounded-md border">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Buyer</Label>
                  <Input value={formData.buyerName || "Loading your info..."} readOnly className="font-semibold" />
                  <p className="text-xs text-muted-foreground">{formData.buyerEmail}</p>
                </div>
              </div>
            </div>

            {/* Fee Information Alert */}
            <Alert className="border-primary/30 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">Escrow Service Fee</AlertTitle>
              <AlertDescription className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="font-semibold">1.5% Fee</Badge>
                  <span className="text-sm">added to your total payment</span>
                </div>
                <p className="text-sm">The 1.5% fee covers secure escrow services. The seller receives the full product price - you pay the protection fee.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-1" />Secure Holding</Badge>
                  <Badge variant="outline" className="text-xs"><Shield className="w-3 h-3 mr-1" />Fraud Protection</Badge>
                  <Badge variant="outline" className="text-xs"><Headphones className="w-3 h-3 mr-1" />24/7 Support</Badge>
                </div>
              </AlertDescription>
            </Alert>

            {/* Product Selection */}
            <div className="space-y-2">
              <Label>Select Product / Service *</Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !formData.selectedProduct && "text-muted-foreground"
                    )}
                  >
                    {formData.selectedProduct
                      ? formData.selectedProduct.name
                      : "Search and select a product..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search products..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      {escrowProducts.map((category) => (
                        <CommandGroup key={category.category} heading={category.category}>
                          {category.items
                            .filter(item => 
                              !searchQuery || 
                              item.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                  setFormData(prev => ({ ...prev, selectedProduct: product }));
                                  setComboboxOpen(false);
                                  setSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.selectedProduct?.id === product.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{product.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ${product.price} • {product.delivery}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formData.selectedProduct && (
                <p className="text-sm text-muted-foreground">
                  ${formData.selectedProduct.price} • Delivery: {formData.selectedProduct.delivery}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              />
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <Label htmlFor="specifications">Product Specifications</Label>
              <Textarea
                id="specifications"
                placeholder="Any specific requirements or customizations..."
                value={formData.specifications}
                onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Escrow Terms */}
            <div className="space-y-2">
              <Label htmlFor="terms">Escrow Terms *</Label>
              <Select
                value={formData.escrowTerms}
                onValueChange={(value) => setFormData(prev => ({ ...prev, escrowTerms: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Release upon delivery confirmation)</SelectItem>
                  <SelectItem value="milestone">Milestone-based (Release in stages)</SelectItem>
                  <SelectItem value="custom">Custom Terms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.escrowTerms === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customTerms">Custom Terms *</Label>
                <Textarea
                  id="customTerms"
                  placeholder="Describe your custom escrow terms..."
                  value={formData.customTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, customTerms: e.target.value }))}
                  rows={3}
                />
              </div>
            )}

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Additional Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any other information or requirements..."
                value={formData.additionalInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Enhanced Price Summary */}
            {formData.selectedProduct && (
              <Card className="border-primary/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Price Summary
                    </h4>
                    <Badge variant="secondary" className="text-xs">Secure Payment</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-muted-foreground" />
                        Subtotal ({formData.quantity}x ${formData.selectedProduct.price})
                      </span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between text-sm text-muted-foreground cursor-help">
                            <span className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Escrow Fee ({escrowFeePercentage}%)
                              <Info className="w-3 h-3" />
                            </span>
                            <span>${fee.toFixed(2)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs font-semibold mb-1">What's included:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Secure fund holding</li>
                            <li>• Dispute resolution</li>
                            <li>• 24/7 transaction monitoring</li>
                            <li>• Fraud protection</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total Payment:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Use Escrow Collapsible */}
            {formData.selectedProduct && (
              <Collapsible open={whyEscrowOpen} onOpenChange={setWhyEscrowOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Why Use Escrow?
                    </span>
                    <ArrowRight className={cn("w-4 h-4 transition-transform", whyEscrowOpen && "rotate-90")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">No Auto-release</p>
                            <p className="text-xs text-muted-foreground">You control when funds are released</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Full Refund Protection</p>
                            <p className="text-xs text-muted-foreground">100% money back if terms not met</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Encrypted Transactions</p>
                            <p className="text-xs text-muted-foreground">Military-grade security</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Verified Seller</p>
                            <p className="text-xs text-muted-foreground">Platform-verified merchants only</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            )}

            <Button onClick={handleSubmit} className="w-full gap-2" disabled={!formData.selectedProduct}>
              Review Details <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6 py-4">
            {/* Enhanced Escrow Protection Notice */}
            <Card className="border-2 border-green-500/30 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="space-y-3 flex-1">
                    <h3 className="font-bold text-green-700 dark:text-green-300">Escrow Protection Active</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your payment will be held in escrow until you confirm delivery. The vendor will only receive payment after successful completion.
                    </p>
                    
                    {/* Timeline */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 space-y-2">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Escrow Process Timeline:</p>
                      <div className="space-y-2 text-xs text-green-700 dark:text-green-300">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center text-white dark:text-black font-bold text-xs">1</div>
                          <span>Payment secured in escrow (0-30 min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center text-white dark:text-black font-bold text-xs">2</div>
                          <span>Seller prepares your order ({formData.selectedProduct?.delivery})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center text-white dark:text-black font-bold text-xs">3</div>
                          <span>You verify delivery and confirm receipt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center text-white dark:text-black font-bold text-xs">4</div>
                          <span>Funds released to seller</span>
                        </div>
                      </div>
                    </div>

                    {/* Your Rights */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Your Rights:</p>
                      <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>Right to verify product before release</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>Right to dispute if issues arise</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>Right to full refund if terms not met</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-600/20 text-green-700 dark:text-green-300 border-green-600/30">
                        <Lock className="w-3 h-3 mr-1" />
                        No Auto-release
                      </Badge>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-700 dark:text-green-300 border-green-600/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Dispute Protection
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Reminders */}
            <Alert className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-700 dark:text-amber-300 font-semibold">Important Reminders</AlertTitle>
              <AlertDescription>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Never release funds</strong> before confirming delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Verify product</strong> matches description exactly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Contact support</strong> immediately if any issues arise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Keep all communication</strong> documented for protection</span>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Transaction Details */}
            <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-semibold">{formData.selectedProduct?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{formData.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-semibold">SecurePrint Labs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p className="font-semibold">{formData.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{formData.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Time</p>
                  <p className="font-semibold">{formData.selectedProduct?.delivery}</p>
                </div>
              </div>

              {formData.specifications && (
                <div>
                  <p className="text-sm text-muted-foreground">Specifications</p>
                  <p className="text-sm">{formData.specifications}</p>
                </div>
              )}

              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between text-sm text-muted-foreground cursor-help">
                        <span className="flex items-center gap-1">
                          Escrow Fee (1.5%)
                          <Info className="w-3 h-3" />
                        </span>
                        <span>${fee.toFixed(2)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-semibold mb-1">Fee Breakdown:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Security & encryption: 40%</li>
                        <li>• Dispute handling: 30%</li>
                        <li>• Platform maintenance: 20%</li>
                        <li>• 24/7 support: 10%</li>
                      </ul>
                      <p className="text-xs mt-2 pt-2 border-t">Much lower than traditional payment processors while providing superior protection.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Payment:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 gap-2">
                Proceed to Payment <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6 py-4">
            {/* Security Warnings */}
            <Alert className="border-red-500/30 bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-700 dark:text-red-300 font-semibold">Critical Security Warning</AlertTitle>
              <AlertDescription>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Only send payment</strong> to the displayed address below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Verify the address carefully</strong> before sending</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>SecurePrint Labs will never</strong> ask for payment elsewhere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Screenshot this address</strong> for your records</span>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Send Payment to Escrow Wallet</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Transfer <span className="font-bold text-primary">${total.toFixed(2)}</span> worth of cryptocurrency to the address below
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline"><Lock className="w-3 h-3 mr-1" />Encrypted</Badge>
                  <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Blockchain Secured</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {loadingAddress ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Assigning your unique Bitcoin address...</p>
                </div>
              ) : assignedBtcAddress ? (
                <>
                  {/* QR Code Section */}
                  <div className="flex flex-col items-center space-y-4 p-6 bg-muted/50 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Shield className="w-4 h-4" />
                      <span>Unique Address Assigned</span>
                    </div>
                    {qrCodeDataUrl && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <img 
                          src={qrCodeDataUrl} 
                          alt="Bitcoin Payment QR Code" 
                          className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                        />
                      </div>
                    )}
                    <p className="text-xs text-center text-muted-foreground max-w-xs">
                      Scan this QR code with your Bitcoin wallet to pay
                    </p>
                  </div>

                  {/* Bitcoin Address Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Your Unique Bitcoin Address
                    </Label>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs md:text-sm break-all">{assignedBtcAddress}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={copyToClipboard} 
                        className="ml-2 shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <QrCode className="w-4 h-4 text-primary" />
                      <span className="font-medium">Amount to Send: ${total.toFixed(2)} USD in BTC</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Accepted: Bitcoin (BTC) only
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <p className="font-semibold flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        Payment Instructions:
                      </p>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>Scan the QR code above OR copy the Bitcoin address</li>
                        <li>Open your Bitcoin wallet app</li>
                        <li>Send exactly <strong>${total.toFixed(2)}</strong> worth of BTC to the address</li>
                        <li>Click "I've Sent Payment" below</li>
                        <li>Wait for blockchain confirmation (typically 10-60 minutes)</li>
                        <li>You'll receive a confirmation email once verified</li>
                      </ol>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Unable to assign Bitcoin address. Please try again or contact support.</p>
                </div>
              )}
            </div>

            {/* What Happens Next */}
            <Card className="border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What Happens Next
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">1</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Blockchain Confirmation</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">5-30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">2</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Order Processing Begins</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Seller is notified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">3</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Seller Prepares Product</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">{formData.selectedProduct?.delivery}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">4</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Delivery Tracking Provided</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">You'll receive updates via email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">5</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">You Confirm Delivery</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Verify and release funds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center text-white dark:text-black font-bold text-xs flex-shrink-0">✓</div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Funds Released to Seller</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Transaction complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support & Protection Notice */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Support & Protection</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>24/7 Support Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Escrow Guarantee Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>~24hr Dispute Resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Full Refund Protection</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Security Reminder */}
            <Alert className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
              <Lock className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">Final Security Checklist</AlertTitle>
              <AlertDescription>
                <ul className="text-xs space-y-1 mt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>✓ Payment address verified and copied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>✓ Sending exact amount: <strong>${total.toFixed(2)}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-600" />
                    <span>✓ Funds will be held in escrow until you confirm delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-3 h-3 flex-shrink-0 mt-0.5 text-primary" />
                    <span><strong>Remember:</strong> Never release funds before confirming product receipt</span>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Payment Status Display */}
            {paymentStatus && (
              <Alert className={paymentStatus.verified ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-blue-500 bg-blue-50 dark:bg-blue-950/20"}>
                {paymentStatus.verified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-blue-600" />}
                <AlertTitle className={paymentStatus.verified ? "text-green-700 dark:text-green-300" : "text-blue-700 dark:text-blue-300"}>
                  {paymentStatus.message}
                </AlertTitle>
                <AlertDescription>
                  <p className="text-sm mt-1">
                    Confirmations: {paymentStatus.confirmations}/6 (1 required for processing)
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={verifyPayment} 
                variant="outline"
                className="flex-1 gap-2" 
                disabled={verifyingPayment || loadingAddress || !!error}
              >
                {verifyingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking Blockchain...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Verify Payment
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleConfirmPayment} 
                className="flex-1 gap-2" 
                disabled={loading || !assignedBtcAddress || loadingAddress || !!error}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming Payment...
                  </>
                ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  I've Sent the Payment
                </>
              )}
            </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Your order will be tracked in your dashboard once payment is confirmed
            </p>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default EscrowTransactionForm;
