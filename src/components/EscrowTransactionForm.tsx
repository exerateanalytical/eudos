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
import { Check, Copy, Shield, ArrowRight, Search } from "lucide-react";
import { escrowProducts, searchProducts, getProductById, type EscrowProduct } from "@/lib/escrowProducts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to complete the transaction");
        return;
      }

      const { subtotal, fee, total } = calculateTotal();
      const terms = formData.escrowTerms === "custom" ? formData.customTerms : formData.escrowTerms;

      const { error } = await supabase.from("orders").insert({
        user_id: session.user.id,
        product_type: formData.selectedProduct?.category || "Product",
        product_name: `${formData.selectedProduct?.name} (x${formData.quantity})`,
        country: formData.selectedProduct?.category,
        total_amount: total,
        escrow_fee: fee,
        payment_method: "crypto_escrow",
        status: "pending",
        escrow_terms: terms,
        escrow_wallet_address: escrowWalletAddress,
        seller_name: "SecurePrint Labs",
        additional_instructions: `${formData.specifications}\n${formData.additionalInstructions}`.trim(),
      });

      if (error) throw error;

      toast.success("Escrow created successfully! Please send payment to the wallet address.");
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
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast.error("Failed to create escrow. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {step === "form" && "Create Secure Escrow"}
            {step === "review" && "Review Escrow Details"}
            {step === "payment" && "Payment Instructions"}
          </DialogTitle>
        </DialogHeader>

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

            {/* Price Summary */}
            {formData.selectedProduct && (
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({formData.quantity}x ${formData.selectedProduct.price}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Escrow Fee ({escrowFeePercentage}%):</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full gap-2" disabled={!formData.selectedProduct}>
              Review Details <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6 py-4">
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
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Escrow Fee:</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
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
            <div className="bg-primary/10 p-4 rounded-lg space-y-2">
              <p className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Send Payment to Escrow Wallet
              </p>
              <p className="text-sm text-muted-foreground">
                Transfer ${total.toFixed(2)} worth of cryptocurrency to the address below
              </p>
            </div>

            <div className="space-y-2">
              <Label>Escrow Wallet Address</Label>
              <div className="flex gap-2">
                <Input value={escrowWalletAddress} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <p className="font-semibold">Payment Instructions:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Copy the escrow wallet address above</li>
                <li>Open your crypto wallet (BTC, ETH, USDT, or USDC)</li>
                <li>Send exactly ${total.toFixed(2)} worth of crypto to the address</li>
                <li>Click "Confirm Payment Sent" below</li>
                <li>Wait for blockchain confirmation (5-30 minutes)</li>
              </ol>
            </div>

            <Button onClick={handleConfirmPayment} className="w-full" disabled={loading}>
              {loading ? "Creating Escrow..." : "Confirm Payment Sent"}
            </Button>

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
