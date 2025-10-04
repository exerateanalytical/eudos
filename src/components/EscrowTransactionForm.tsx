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
import { Check, Copy, Shield, ArrowRight, Search, CheckCircle, Info, Lock, AlertTriangle, Clock, FileCheck, Package, Headphones } from "lucide-react";
import { escrowProducts, searchProducts, getProductById, type EscrowProduct } from "@/lib/escrowProducts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BitcoinCheckout } from "@/components/checkout/BitcoinCheckout";

interface EscrowTransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EscrowTransactionForm = ({ open, onOpenChange }: EscrowTransactionFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "review" | "payment" | "bitcoin">("form");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [whyEscrowOpen, setWhyEscrowOpen] = useState(false);
  
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

  const escrowWalletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
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
      setStep("payment");
      return;
    }
  };

  const handleConfirmPayment = async () => {
    console.log("Confirming payment, moving to bitcoin step");
    console.log("Selected product:", formData.selectedProduct);
    console.log("Total amount:", total);
    setStep("bitcoin");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(escrowWalletAddress);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
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
                {step === "bitcoin" && "Bitcoin Payment"}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {step === "form" && "Protected by blockchain escrow technology"}
                {step === "review" && "Verify all details before proceeding"}
                {step === "payment" && "Secure your funds in escrow"}
                {step === "bitcoin" && "Complete your Bitcoin payment"}
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
                step === "review" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" : (step === "payment" || step === "bitcoin") ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <span className={cn("text-xs font-medium", step === "review" ? "text-primary" : "text-muted-foreground")}>Review</span>
            </div>
            <div className={cn("h-0.5 w-8 transition-all", (step === "payment" || step === "bitcoin") ? "bg-primary" : "bg-muted")} />
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                (step === "payment" || step === "bitcoin") ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" : "bg-muted text-muted-foreground"
              )}>
                3
              </div>
              <span className={cn("text-xs font-medium", (step === "payment" || step === "bitcoin") ? "text-primary" : "text-muted-foreground")}>Payment</span>
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Escrow Wallet Address
              </Label>
              <div className="flex gap-2">
                <Input value={escrowWalletAddress} readOnly className="font-mono text-sm font-semibold" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Accepted: BTC, ETH, USDT, USDC</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Payment Instructions:
                </p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Copy the escrow wallet address above</li>
                  <li>Open your crypto wallet (BTC, ETH, USDT, or USDC)</li>
                  <li>Send exactly <strong>${total.toFixed(2)}</strong> worth of crypto to the address</li>
                  <li>Click "Confirm Payment Sent" below</li>
                  <li>Wait for blockchain confirmation (5-30 minutes)</li>
                </ol>
              </CardContent>
            </Card>

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

            <Button onClick={handleConfirmPayment} className="w-full gap-2 h-12 text-base font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Creating Escrow...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment Sent
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your order will be tracked in your dashboard once payment is confirmed
            </p>
          </div>
        )}

        {step === "bitcoin" && formData.selectedProduct && (
          <div className="py-4">
            <BitcoinCheckout
              walletId="0b7d759f-d8c2-414e-9798-f2a18846e034"
              productName={`${formData.selectedProduct.name} (x${formData.quantity}) - ESCROW`}
              productType={formData.selectedProduct.category}
              amountBTC={parseFloat((total / 50000).toFixed(8))}
              amountFiat={total}
              guestInfo={userProfile ? undefined : {
                name: formData.buyerName,
                phone: formData.buyerPhone,
                email: formData.buyerEmail,
              }}
              onPaymentComplete={() => {
                toast.success("Escrow order created! Waiting for Bitcoin payment confirmation.");
                onOpenChange(false);
                setStep("form");
                setFormData({
                  selectedProduct: null,
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
                navigate("/dashboard");
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EscrowTransactionForm;
