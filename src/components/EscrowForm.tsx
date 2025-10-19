import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EscrowFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productPrice: string;
  deliveryTime?: string;
}

export const EscrowForm = ({ open, onOpenChange, productName, productPrice, deliveryTime }: EscrowFormProps) => {
  const [step, setStep] = useState<'form'>('form');
  
  // Form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [escrowTerms, setEscrowTerms] = useState("");
  const [instructions, setInstructions] = useState("");

  // Calculate escrow fee (1.5%)
  const productPriceNum = parseFloat(productPrice.replace(/[^0-9.]/g, '')) || 0;
  const escrowFee = productPriceNum * 0.015;
  const totalAmount = productPriceNum + escrowFee;

  const sellerName = "SecurePrint Labs";


  const handleProceedToPayment = () => {
    if (!buyerName || !buyerEmail || !buyerPhone || !escrowTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Escrow Setup Complete",
      description: "Your escrow terms have been saved. Please contact support to proceed with payment.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crypto Escrow Payment</DialogTitle>
          <DialogDescription>
            {step === 'form' ? 'Set your escrow terms and conditions' : 'Complete your secure payment'}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-6 py-4">
            {/* Escrow Protection Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-2">Escrow Protection</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your payment is held securely until you confirm delivery. The seller only receives payment after successful completion.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      <span>Buyer Protection</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      <span>Dispute Resolution</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <Card className="p-4">
              <h3 className="font-bold mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">{sellerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{productName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Product Amount</span>
                  <span className="font-medium">{productPrice}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Escrow Fee (1.5%)</span>
                  <span className="font-medium">${escrowFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
                {deliveryTime && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Est. Delivery</span>
                    <span className="font-medium">{deliveryTime}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="font-bold">Your Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-name">Full Name *</Label>
                  <Input
                    id="buyer-name"
                    placeholder="John Doe"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-email">Email Address *</Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    placeholder="john@example.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-phone">Phone Number *</Label>
                  <Input
                    id="buyer-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Custom Escrow Terms */}
            <div className="space-y-2">
              <Label htmlFor="escrow-terms">Your Escrow Terms *</Label>
              <Textarea
                id="escrow-terms"
                placeholder="Define your conditions for release of funds. Example: Payment to be released upon receipt of documents, verification of authenticity, and confirmation that all items match the order description..."
                value={escrowTerms}
                onChange={(e) => setEscrowTerms(e.target.value)}
                rows={5}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Specify conditions that must be met before funds are released to the seller
              </p>
            </div>

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Any special delivery instructions, preferred shipping method, communication preferences, etc..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProceedToPayment}
                className="flex-1"
                size="lg"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        ) : walletId ? (
          <div className="py-4">
            <DialogHeader className="mb-4">
              <DialogTitle>Bitcoin Payment</DialogTitle>
              <DialogDescription>Complete your secure Bitcoin payment</DialogDescription>
            </DialogHeader>
            <BitcoinCheckout
              walletId={walletId}
              productName={`${productName} - ESCROW`}
              productType="escrow"
              amountBTC={parseFloat((totalAmount / 50000).toFixed(8))}
              amountFiat={totalAmount}
              guestInfo={{
                name: buyerName,
                phone: buyerPhone,
                email: buyerEmail,
              }}
              onPaymentComplete={() => {
                toast({
                  title: "Escrow order created!",
                  description: "Waiting for Bitcoin payment confirmation.",
                });
                onOpenChange(false);
                // Reset form
                setTimeout(() => {
                  setStep('form');
                  setBuyerName("");
                  setBuyerEmail("");
                  setBuyerPhone("");
                  setEscrowTerms("");
                  setInstructions("");
                }, 300);
              }}
            />
          </div>
        ) : (
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {walletError || "Failed to load Bitcoin wallet configuration."}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
