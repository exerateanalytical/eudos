import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Shield, Clock, CheckCircle, ArrowLeft, ShoppingCart, Coins, Mail, Globe } from "lucide-react";
import { EscrowForm } from "@/components/EscrowForm";

const PassportDetail = () => {
  const { passportId } = useParams();
  const navigate = useNavigate();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);

  // Extract country from passportId (format: "passport-united-states")
  const country = passportId?.replace('passport-', '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  const passportData = {
    country: country,
    title: `${country} Passport`,
    price: "$2,500",
    processingTime: "7-10 business days",
    description: `Fully registered biometric ${country} passport with embedded RFID chips, advanced security features, and government database registration. Valid for international travel.`,
    
    features: [
      "Biometric data integration",
      "RFID/NFC embedded chip",
      "Multi-layer holograms",
      "UV security features",
      "Machine-readable zone (MRZ)",
      "Laser engraved personalization",
      "Watermarks & security threads",
      "Government database registration",
    ],

    specifications: [
      { label: "Country", value: country },
      { label: "Pages", value: "32 or 64 pages" },
      { label: "Validity", value: "5 or 10 years" },
      { label: "Chip Type", value: "RFID contactless" },
      { label: "Security Level", value: "Military-grade" },
    ],

    benefits: [
      "Valid for international travel",
      "Biometric chip with encrypted data",
      "Registered in government databases",
      "Military-grade security features",
      "Machine-readable for border control",
      "Multi-layer holographic protection",
      "Tamper-proof design",
      "Express worldwide shipping",
    ],

    process: [
      {
        step: "1",
        title: "Submit Order",
        description: "Choose your payment method (standard or crypto escrow) and complete purchase",
      },
      {
        step: "2",
        title: "Provide Documents",
        description: "Submit required documents including biometric photo, signature, and personal information",
      },
      {
        step: "3",
        title: "Biometric Processing",
        description: "Your biometric data is encrypted and programmed into the RFID chip",
      },
      {
        step: "4",
        title: "Production",
        description: "Passport book is manufactured with all security features, holograms, and personalization",
      },
      {
        step: "5",
        title: "Database Registration",
        description: "Your passport is registered in the official government verification system",
      },
      {
        step: "6",
        title: "Quality Assurance",
        description: "Comprehensive inspection of all security features and chip functionality",
      },
      {
        step: "7",
        title: "Secure Delivery",
        description: "Express courier delivery with tracking and signature confirmation (7-10 business days)",
      },
    ],

    faqs: [
      {
        question: "Is this a real passport?",
        answer: "Yes, this is a fully functional biometric passport with RFID chip, government database registration, and all required security features for the issuing country.",
      },
      {
        question: "Can I use this for international travel?",
        answer: "Yes, the passport is designed for international travel and includes all necessary security features and database registration.",
      },
      {
        question: "What documents do I need to provide?",
        answer: "You'll need to provide a biometric passport photo, signature sample, fingerprints (if applicable), and personal information. Specific requirements will be provided after order confirmation.",
      },
      {
        question: "How long is the passport valid?",
        answer: "Standard validity is 10 years for adults and 5 years for minors, depending on the issuing country's requirements.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept standard payment methods and cryptocurrency via our secure escrow service (adds 1.5% fee for buyer protection).",
      },
      {
        question: "Can I track my order?",
        answer: "Yes, you'll receive tracking information once your passport ships. You can monitor the delivery status in real-time.",
      },
      {
        question: "What if there's an error in my passport?",
        answer: "We offer free replacements for any manufacturing errors. Contact support within 30 days of delivery for corrections.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <Link to="/passports" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Passports
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <FileText className="w-3 h-3 mr-1" />
                Biometric Passport
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {passportData.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {passportData.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{passportData.processingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-medium">Military-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-medium">International Travel</span>
                </div>
              </div>
            </div>

            <Card className="border-primary/20 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">{passportData.price}</p>
                  <p className="text-sm text-muted-foreground">Includes chip, registration & shipping</p>
                </div>

                <div className="space-y-2 mb-6">
                  {passportData.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate(`/apply?type=passport&name=${encodeURIComponent(passportData.title)}`)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setShowCryptoEscrow(true)}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Pay with Crypto Escrow (+1.5% fee)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => window.location.href = "mailto:support@secureprintlabs.com"}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Crypto escrow provides buyer protection with secure fund holding until delivery
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crypto Escrow Form */}
      <EscrowForm
        open={showCryptoEscrow}
        onOpenChange={setShowCryptoEscrow}
        productName={passportData.title}
        productPrice={passportData.price}
        deliveryTime={passportData.processingTime}
      />

      {/* Detailed Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Security Features & Specifications</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Security Features</h3>
                      <div className="space-y-3">
                        {passportData.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Specifications</h3>
                      <div className="space-y-3">
                        {passportData.specifications.map((spec, idx) => (
                          <div key={idx} className="flex justify-between py-2 border-b border-border/50">
                            <span className="text-muted-foreground">{spec.label}</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {passportData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Order Process</h2>
                  <div className="space-y-6">
                    {passportData.process.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{item.step}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {passportData.faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order Your Passport?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get your biometric {passportData.country} passport with RFID chip and database registration
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              onClick={() => navigate(`/apply?type=passport&name=${encodeURIComponent(passportData.title)}`)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowCryptoEscrow(true)}
            >
              <Coins className="w-4 h-4 mr-2" />
              Pay with Crypto Escrow
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PassportDetail;