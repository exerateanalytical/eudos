import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, CheckCircle, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EscrowFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productPrice: string;
  deliveryTime?: string;
}

export const EscrowForm = ({ open, onOpenChange, productName, productPrice, deliveryTime }: EscrowFormProps) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [copied, setCopied] = useState(false);
  
  // Form state - auto-populate with user data (editable)
  const [buyerName, setBuyerName] = useState("John Doe");
  const [buyerEmail, setBuyerEmail] = useState("john.doe@example.com");
  const [escrowTerms, setEscrowTerms] = useState("");
  const [instructions, setInstructions] = useState("");

  // Calculate escrow fee (1.5%)
  const productPriceNum = parseFloat(productPrice.replace(/[^0-9.]/g, '')) || 0;
  const escrowFee = productPriceNum * 0.015;
  const totalAmount = productPriceNum + escrowFee;

  const sellerName = "SecurePrint Labs";
  const escrowWallet = "0x1234...5678"; // Example wallet

  const handleCopyWallet = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Wallet Address Copied",
      description: "Escrow wallet address copied to clipboard",
    });
  };

  const handleProceedToPayment = () => {
    if (!buyerName || !buyerEmail || !escrowTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setStep('payment');
  };

  const handleSubmitPayment = () => {
    toast({
      title: "Escrow Created",
      description: "Your escrow payment has been initiated. You'll receive confirmation via email.",
    });
    onOpenChange(false);
    // Reset form
    setTimeout(() => {
      setStep('form');
      setBuyerName("");
      setBuyerEmail("");
      setEscrowTerms("");
      setInstructions("");
    }, 300);
  };

  const handleBack = () => {
    setStep('form');
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
        ) : (
          <div className="space-y-6 py-4">
            {/* Payment Summary */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-bold mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <span className="font-medium">{buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">{sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Amount</span>
                  <span className="font-medium">{productPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escrow Fee (1.5%)</span>
                  <span className="font-medium">${escrowFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-primary text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Escrow Terms Summary */}
            <Card className="p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Your Escrow Terms
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{escrowTerms}</p>
              {instructions && (
                <>
                  <h4 className="font-semibold mt-3 mb-1 text-sm">Additional Instructions:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{instructions}</p>
                </>
              )}
            </Card>

            {/* Payment Instructions */}
            <Card className="p-4">
              <h3 className="font-bold mb-3">Payment Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Send the exact amount to the escrow wallet address below</li>
                <li>Accepted cryptocurrencies: BTC, ETH, USDT, USDC</li>
                <li>Funds will be held in escrow until your terms are met</li>
                <li>You'll receive email confirmations at each step</li>
              </ol>
            </Card>

            {/* Escrow Wallet Address */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <Label className="text-xs text-muted-foreground mb-2 block">Escrow Wallet Address</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background px-3 py-2 rounded text-sm font-mono break-all">
                  {escrowWallet}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyWallet}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Send payment to this address. Do not send directly to the seller.
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitPayment}
                className="flex-1"
                size="lg"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Payment Sent
              </Button>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                ⚠️ Only click "Confirm Payment Sent" after you've transferred the funds to the escrow wallet. 
                Do not close this window until your payment is confirmed.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
