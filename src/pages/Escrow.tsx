import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, Lock, AlertCircle, Clock, FileCheck, ArrowRight, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EscrowTransactionForm from "@/components/EscrowTransactionForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Escrow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEscrowForm, setShowEscrowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    
    // If user just logged in and was redirected here, open form
    if (session && location.state?.openForm) {
      setShowEscrowForm(true);
    }
  };

  const handleCreateEscrow = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth', { state: { returnTo: '/escrow', openForm: true } });
      return;
    }
    setShowEscrowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Secure Crypto Escrow</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
            Protect Your Crypto Transactions
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto px-4">
            Our escrow service ensures secure transactions between buyers and sellers. Funds are held safely until both parties fulfill their obligations.
          </p>
          
          {/* Fee Notice */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-6 sm:mb-8 mx-4 sm:mx-0 max-w-md sm:max-w-none">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 text-center sm:text-left">
              Service fee: <span className="font-bold">1.5%</span> added to your payment (buyers pay the fee)
            </p>
          </div>

          <Button size="lg" onClick={handleCreateEscrow} className="gap-2 w-full sm:w-auto px-6 sm:px-8">
            Create Escrow <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* How Escrow Works */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">How Escrow Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              A simple, secure process that protects both buyers and sellers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10" />

            {[
              {
                step: "1",
                title: "Create & Fund",
                description: "Buyer creates escrow and deposits cryptocurrency to secure wallet",
                icon: Wallet,
              },
              {
                step: "2",
                title: "Seller Delivers",
                description: "Seller prepares and delivers the product or service as agreed",
                icon: FileCheck,
              },
              {
                step: "3",
                title: "Buyer Confirms",
                description: "Buyer reviews delivery and confirms satisfaction to release funds",
                icon: CheckCircle,
              },
              {
                step: "4",
                title: "Payment Released",
                description: "Seller receives full payment - buyer paid the 1.5% escrow fee",
                icon: Lock,
              },
            ].map((step) => (
              <Card key={step.step} className="relative animate-fade-in hover-scale">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <CardHeader className="text-center pt-8">
                  <step.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Protection Benefits */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Buyer Protection Benefits</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Multiple layers of security to ensure your funds are safe
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Shield,
                title: "Funds Held Securely",
                description: "Your cryptocurrency stays in escrow until delivery is confirmed and you're satisfied",
              },
              {
                icon: AlertCircle,
                title: "Dispute Resolution",
                description: "Neutral third-party mediation available if issues arise during the transaction",
              },
              {
                icon: FileCheck,
                title: "Verified Transactions",
                description: "All transactions are tracked, verified, and recorded on the blockchain",
              },
              {
                icon: CheckCircle,
                title: "Refund Protection",
                description: "Get your money back if the seller doesn't meet the agreed terms",
              },
              {
                icon: Clock,
                title: "Transparent Process",
                description: "Real-time status updates keep you informed throughout the entire transaction",
              },
              {
                icon: Wallet,
                title: "Crypto-Native",
                description: "Supports BTC, ETH, USDT, USDC and other major cryptocurrencies",
              },
            ].map((benefit, index) => (
              <Card key={index} className="animate-fade-in hover-scale">
                <CardHeader>
                  <benefit.icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Security & Trust</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Enterprise-grade security for your peace of mind
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Military-Grade Encryption", value: "256-bit AES" },
              { label: "Smart Contract Verified", value: "Audited Code" },
              { label: "Transaction Success Rate", value: "99.8%" },
              { label: "Average Resolution Time", value: "24-48 hours" },
            ].map((stat, index) => (
              <Card key={index} className="text-center animate-fade-in">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-2">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure Section */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Simple, Transparent Pricing</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">No hidden fees, just secure transactions</p>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-6 sm:pb-8 p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4 mx-auto">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold mb-2">1.5%</CardTitle>
              <CardDescription className="text-base sm:text-lg">Added to buyer's payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="bg-secondary/50 p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4">
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">How it works:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Buyer pays product price + 1.5% fee</p>
                      <p className="text-sm text-muted-foreground">You pay the total including the escrow service fee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Funds held securely</p>
                      <p className="text-sm text-muted-foreground">Full amount stays in escrow until buyer confirms delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Seller receives full product price</p>
                      <p className="text-sm text-muted-foreground">Seller gets 100% of the product price - no deductions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Example Transaction:</h3>
                <div className="space-y-2 bg-primary/5 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Price:</span>
                    <span className="font-semibold">$1,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Escrow Fee (1.5%):</span>
                    <span className="font-semibold text-primary">+ $15.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between text-lg">
                    <span className="font-bold">Buyer Pays:</span>
                    <span className="font-bold text-primary">$1,015.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">Seller Receives:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">$1,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Escrow Service Fee:</span>
                    <span>$15.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Why buyers pay the fee?</p>
                  <p className="text-blue-600/80 dark:text-blue-400/80">
                    The 1.5% fee covers secure wallet infrastructure, smart contract audits, dispute resolution services, and 24/7 transaction monitoring. This ensures sellers receive their full payment while your transaction remains fully protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">Everything you need to know about our escrow service</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">How does the escrow process work?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                The buyer creates an escrow and deposits funds to our secure wallet. The seller delivers the product/service. Once the buyer confirms receipt and satisfaction, the funds are released to the seller minus a 1.5% service fee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">What are the fees?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                We charge a flat 1.5% escrow service fee that is added to the product price. As a buyer, you pay the product price plus 1.5%. For example, on a $1,000 purchase, you'll pay $1,015 total. The seller receives the full $1,000 product price with no deductions. This ensures sellers get their complete payment while the escrow service is funded by a small buyer fee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">What cryptocurrencies are supported?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                We currently support Bitcoin (BTC), Ethereum (ETH), USDT (Tether), and USDC (USD Coin). More cryptocurrencies will be added based on demand.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">What happens if there's a dispute?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                If a dispute arises, both parties can submit evidence. Our neutral mediation team reviews the case and makes a fair decision within 24-48 hours. The decision is binding and funds are released accordingly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">How long are funds held in escrow?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                Funds remain in escrow until the buyer confirms receipt and satisfaction. If no confirmation is received within the agreed timeframe (typically 7-30 days depending on the product), automatic release procedures may apply.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base">Is my cryptocurrency safe?</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                Yes. We use multi-signature wallets, cold storage for the majority of funds, and implement military-grade encryption. All smart contracts are audited by third-party security firms.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Ready to Secure Your Transaction?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Create an escrow in minutes and experience the peace of mind that comes with protected crypto transactions.
          </p>
          <Button size="lg" onClick={handleCreateEscrow} className="gap-2 w-full sm:w-auto px-6 sm:px-8">
            {isAuthenticated ? "Create Escrow Now" : "Get Started"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Escrow Form Dialog */}
      <EscrowTransactionForm
        open={showEscrowForm}
        onOpenChange={setShowEscrowForm}
      />
    </div>
  );
};

export default Escrow;
