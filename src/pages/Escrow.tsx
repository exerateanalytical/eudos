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
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Secure Crypto Escrow</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Protect Your Crypto Transactions
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Our escrow service ensures secure transactions between buyers and sellers. Funds are held safely until both parties fulfill their obligations.
          </p>
          
          {/* Fee Notice */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-8">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Service fee: <span className="font-bold">1.5%</span> deducted from seller upon completion
            </p>
          </div>

          <Button size="lg" onClick={handleCreateEscrow} className="gap-2">
            Create Escrow <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* How Escrow Works */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Escrow Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, secure process that protects both buyers and sellers
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10" />

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
                description: "Seller receives payment minus 1.5% escrow service fee",
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
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Buyer Protection Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of security to ensure your funds are safe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Security & Trust</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security for your peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Military-Grade Encryption", value: "256-bit AES" },
              { label: "Smart Contract Verified", value: "Audited Code" },
              { label: "Transaction Success Rate", value: "99.8%" },
              { label: "Average Resolution Time", value: "24-48 hours" },
            ].map((stat, index) => (
              <Card key={index} className="text-center animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
                  <CardDescription className="text-sm">{stat.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">No hidden fees, just secure transactions</p>
          </div>

          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 mx-auto">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-4xl font-bold mb-2">1.5%</CardTitle>
              <CardDescription className="text-lg">Escrow Service Fee</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg mb-3">How it works:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Buyer pays full amount</p>
                      <p className="text-sm text-muted-foreground">You send the total transaction amount including the 1.5% fee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Funds held securely</p>
                      <p className="text-sm text-muted-foreground">Money stays in escrow until buyer confirms delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Seller receives payment minus fee</p>
                      <p className="text-sm text-muted-foreground">1.5% is deducted when funds are released to the seller</p>
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
                    <span className="font-bold">$1,000.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Why we charge a fee?</p>
                  <p className="text-blue-600/80 dark:text-blue-400/80">
                    The 1.5% fee covers secure wallet infrastructure, smart contract audits, dispute resolution services, and 24/7 transaction monitoring to ensure your funds are always protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our escrow service</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the escrow process work?</AccordionTrigger>
              <AccordionContent>
                The buyer creates an escrow and deposits funds to our secure wallet. The seller delivers the product/service. Once the buyer confirms receipt and satisfaction, the funds are released to the seller minus a 1.5% service fee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What are the fees?</AccordionTrigger>
              <AccordionContent>
                We charge a flat 1.5% escrow service fee on the transaction amount. This fee is added to your total payment as a buyer and deducted when funds are released to the seller. For example, on a $1,000 purchase, you'll pay $1,015 total, and the seller receives $1,000. There are no hidden charges or additional fees.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What cryptocurrencies are supported?</AccordionTrigger>
              <AccordionContent>
                We currently support Bitcoin (BTC), Ethereum (ETH), USDT (Tether), and USDC (USD Coin). More cryptocurrencies will be added based on demand.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What happens if there's a dispute?</AccordionTrigger>
              <AccordionContent>
                If a dispute arises, both parties can submit evidence. Our neutral mediation team reviews the case and makes a fair decision within 24-48 hours. The decision is binding and funds are released accordingly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How long are funds held in escrow?</AccordionTrigger>
              <AccordionContent>
                Funds remain in escrow until the buyer confirms receipt and satisfaction. If no confirmation is received within the agreed timeframe (typically 7-30 days depending on the product), automatic release procedures may apply.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Is my cryptocurrency safe?</AccordionTrigger>
              <AccordionContent>
                Yes. We use multi-signature wallets, cold storage for the majority of funds, and implement military-grade encryption. All smart contracts are audited by third-party security firms.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Secure Your Transaction?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create an escrow in minutes and experience the peace of mind that comes with protected crypto transactions.
          </p>
          <Button size="lg" onClick={handleCreateEscrow} className="gap-2">
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
