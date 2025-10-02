import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Award, Clock, Shield, CheckCircle, FileCheck, Globe, Bitcoin, Mail, Phone, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";

const CertificationDetail = () => {
  const { certificationName } = useParams<{ certificationName: string }>();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [escrowStep, setEscrowStep] = useState<'terms' | 'payment'>('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Decode the certification name from URL
  const decodedName = certificationName ? decodeURIComponent(certificationName) : "";

  // Price tiers based on certification category
  const getPriceForCertification = (name: string) => {
    const tier1 = ["PMP", "CISSP", "CFA", "CCIE", "OSCP", "AWS Certified Solutions Architect – Professional"];
    const tier2 = ["CCNA", "CCNP", "CompTIA Security+", "CEH", "ACCA", "CPA"];
    
    if (tier1.some(cert => name.includes(cert))) return "$8,500";
    if (tier2.some(cert => name.includes(cert))) return "$5,500";
    return "$3,500";
  };

  const certificationData = {
    name: decodedName,
    price: getPriceForCertification(decodedName),
    deliveryTime: "14-21 Business Days",
    description: "Comprehensive certification package with all documentation, verification support, and lifetime validity.",
    features: [
      "Original certification document with embossed seal",
      "Digital verification code for instant online verification",
      "Apostille certification for international recognition",
      "Registered in issuing organization's official database",
      "Complete security features (holograms, watermarks, UV elements)",
      "Professional credentials wallet card",
      "Digital certificate copy (PDF format)",
      "Lifetime verification support",
      "Express shipping included"
    ],
    benefits: [
      {
        title: "Career Advancement",
        description: "Enhance your professional profile with globally recognized certifications that open doors to new opportunities."
      },
      {
        title: "Instant Credibility",
        description: "Gain immediate recognition from employers and clients with verifiable, authentic certification documentation."
      },
      {
        title: "Global Recognition",
        description: "Apostille certification ensures your credentials are accepted worldwide across borders and jurisdictions."
      },
      {
        title: "Database Registration",
        description: "All certifications are registered in official databases, allowing employers to verify your credentials instantly."
      },
      {
        title: "Complete Security",
        description: "Advanced security features including holograms, watermarks, and UV elements protect against counterfeiting."
      },
      {
        title: "Lifetime Support",
        description: "Ongoing verification support ensures your credentials remain valid and verifiable throughout your career."
      }
    ],
    process: [
      {
        step: 1,
        title: "Submit Application",
        description: "Provide your details and select your desired certification. Our secure checkout process protects your information."
      },
      {
        step: 2,
        title: "Document Preparation",
        description: "Expert team prepares your certification with all required security features and official seals (7-10 days)."
      },
      {
        step: 3,
        title: "Database Registration",
        description: "Your certification is registered in the official database with a unique verification code (2-3 days)."
      },
      {
        step: 4,
        title: "Apostille & Verification",
        description: "Documents are apostilled for international validity and undergo final quality checks (3-5 days)."
      },
      {
        step: 5,
        title: "Secure Delivery",
        description: "Express shipping with tracking to your location. Digital copies provided immediately upon completion."
      }
    ],
    faqs: [
      {
        question: "How can I verify the authenticity of my certification?",
        answer: "Each certification comes with a unique verification code that can be checked on the issuing organization's official database. We also provide apostille certification for international recognition."
      },
      {
        question: "Is this certification registered in official databases?",
        answer: "Yes, all certifications are registered in the official databases of their respective issuing organizations, ensuring full verifiability by employers and institutions worldwide."
      },
      {
        question: "What security features are included?",
        answer: "Our certifications include embossed seals, holographic overlays, UV-reactive elements, microprinting, watermarks, and security threads - the same features found on authentic certifications."
      },
      {
        question: "Can employers verify my certification?",
        answer: "Absolutely. Employers can verify your certification through the official database using your unique verification code, or through the apostille certification for international verification."
      },
      {
        question: "What's included in the package?",
        answer: "You receive the original certification document, apostille certification, digital PDF copy, professional wallet card, verification code, and lifetime support for any verification needs."
      },
      {
        question: "How long is the certification valid?",
        answer: "Our certifications have lifetime validity. The database registration and verification support are permanent, ensuring your credentials remain verifiable throughout your career."
      },
      {
        question: "What if I need expedited processing?",
        answer: "We offer rush processing options that can reduce delivery time to 7-10 business days. Contact our support team for expedited service availability and pricing."
      },
      {
        question: "Is international shipping available?",
        answer: "Yes, we ship worldwide with express courier services. All packages include tracking and signature confirmation for security."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <Link to="/certifications" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Certifications
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="w-3 h-3 mr-1" />
                Professional Certification
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {certificationData.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {certificationData.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{certificationData.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-medium">Worldwide Recognition</span>
                </div>
              </div>
            </div>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">{certificationData.price}</CardTitle>
                <CardDescription>Complete certification package with lifetime support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Apostille certified for international use</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Database registered & verifiable</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">All security features included</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Express shipping worldwide</span>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/apply?type=certification&name=${encodeURIComponent(certificationData.name)}`}>
                      Order Now
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowCryptoEscrow(true)}
                  >
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Pay with Crypto Escrow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crypto Escrow Dialog */}
      <Dialog open={showCryptoEscrow} onOpenChange={(open) => {
        setShowCryptoEscrow(open);
        if (!open) {
          setEscrowStep('terms');
          setTermsAccepted(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bitcoin className="w-5 h-5 text-primary" />
              {escrowStep === 'terms' ? 'Escrow Terms & Conditions' : 'Payment Details'}
            </DialogTitle>
            <DialogDescription>
              {escrowStep === 'terms' 
                ? 'Please review and accept the escrow terms before proceeding'
                : 'Send payment to the escrow address below'}
            </DialogDescription>
          </DialogHeader>
          
          {escrowStep === 'terms' ? (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3 text-sm max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-base">Cryptocurrency Escrow Agreement</h3>
                
                <div>
                  <p className="font-medium mb-1">1. Escrow Process</p>
                  <p className="text-muted-foreground">
                    Your cryptocurrency payment will be held in a secure escrow wallet until you confirm receipt and satisfaction with your certification documents. Funds are protected throughout the entire process.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">2. Payment Security</p>
                  <p className="text-muted-foreground">
                    All payments are held in a multi-signature escrow wallet. Neither party can access the funds without mutual agreement or dispute resolution.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">3. Delivery Timeline</p>
                  <p className="text-muted-foreground">
                    Once payment is confirmed, your certification will be prepared and delivered within {certificationData.deliveryTime}. You will receive tracking information and digital copies immediately upon completion.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">4. Confirmation & Release</p>
                  <p className="text-muted-foreground">
                    After receiving your certification, you have 7 days to inspect and confirm. Once you approve, or after 7 days without dispute, funds are automatically released to us.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">5. Dispute Resolution</p>
                  <p className="text-muted-foreground">
                    If there are any issues with your order, contact our support team within 7 days of delivery. Disputes are resolved through our escrow arbitration service, which reviews all documentation before fund release.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">6. Accepted Cryptocurrencies</p>
                  <p className="text-muted-foreground">
                    We accept Bitcoin (BTC), Ethereum (ETH), USDT (TRC20/ERC20), and USDC. Exchange rate is locked at the time of your payment confirmation.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">7. No Refund After Release</p>
                  <p className="text-muted-foreground">
                    Once you confirm delivery or the 7-day inspection period expires, the escrow funds are released and no refunds can be issued. Ensure you review all documents carefully.
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">8. Transaction Fees</p>
                  <p className="text-muted-foreground">
                    You are responsible for blockchain network fees. Our escrow service fee (2% of transaction) is included in the displayed price.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer select-none">
                  I have read and agree to the Cryptocurrency Escrow Terms & Conditions. I understand that funds will be held securely until I confirm delivery.
                </label>
              </div>

              <Button 
                className="w-full"
                disabled={!termsAccepted}
                onClick={() => setEscrowStep('payment')}
              >
                Continue to Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Escrow Wallet Address:</p>
                  <code className="text-xs break-all bg-background p-3 rounded block font-mono">
                    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9
                  </code>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Amount Due:</p>
                  <p className="text-2xl font-bold text-primary">{certificationData.price} USD</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Convert to your preferred cryptocurrency at current exchange rate
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Accepted Cryptocurrencies:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-mono">BTC</Badge>
                  <Badge variant="outline" className="font-mono">ETH</Badge>
                  <Badge variant="outline" className="font-mono">USDT</Badge>
                  <Badge variant="outline" className="font-mono">USDC</Badge>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <p className="font-medium">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Send exact amount to the escrow address above</li>
                  <li>Email transaction ID to support@secureprintlabs.com</li>
                  <li>Receive confirmation within 1 hour</li>
                  <li>Track your order via email updates</li>
                  <li>Confirm delivery to release escrow funds</li>
                </ol>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEscrowStep('terms')}
                >
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowCryptoEscrow(false);
                    setEscrowStep('terms');
                    setTermsAccepted(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="features">Package Details</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">What's Included</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {certificationData.features.map((feature, index) => (
                    <Card key={index} className="border-primary/10">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <FileCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <p className="text-sm">{feature}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Key Benefits</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {certificationData.benefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Shield className="w-5 h-5 text-primary" />
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 text-foreground">How It Works</h2>
              <div className="space-y-6">
                {certificationData.process.map((step, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                          <CardDescription className="text-base">{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {certificationData.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Our certification specialists are available to answer your questions and guide you through the process.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-medium mb-1">Email</p>
                <a href="mailto:support@secureprintlabs.com" className="text-sm text-primary hover:underline">
                  support@secureprintlabs.com
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-medium mb-1">Phone</p>
                <a href="tel:+1234567890" className="text-sm text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-medium mb-1">Office</p>
                <p className="text-sm text-muted-foreground">
                  123 Business Ave, Suite 100
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Certification?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have advanced their careers with our certified credentials.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={`/apply?type=certification&name=${encodeURIComponent(certificationData.name)}`}>
              Start Your Application
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificationDetail;
