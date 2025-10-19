import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CreditCard, Shield, Clock, CheckCircle, ArrowLeft, ShoppingCart, Coins, Mail } from "lucide-react";
import EscrowTransactionForm from "@/components/EscrowTransactionForm";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewStatsCard } from "@/components/reviews/ReviewStatsCard";
import { useReviewStats } from "@/hooks/useReviewStats";
import { SEO } from "@/components/SEO";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Import EU logo images
import euAT from "@/assets/drivers-license/eu-at.png";
import euBE from "@/assets/drivers-license/eu-be.png";
import euBG from "@/assets/drivers-license/eu-bg.png";
import euHR from "@/assets/drivers-license/eu-hr.png";
import euCY from "@/assets/drivers-license/eu-cy.png";
import euCZ from "@/assets/drivers-license/eu-cz.png";
import euDK from "@/assets/drivers-license/eu-dk.png";
import euEE from "@/assets/drivers-license/eu-ee.png";
import euFI from "@/assets/drivers-license/eu-fi.png";
import euFR from "@/assets/drivers-license/eu-fr.png";
import euDE from "@/assets/drivers-license/eu-de.png";
import euGR from "@/assets/drivers-license/eu-gr.png";
import euHU from "@/assets/drivers-license/eu-hu.png";
import euIE from "@/assets/drivers-license/eu-ie.png";
import euIT from "@/assets/drivers-license/eu-it.png";
import euLV from "@/assets/drivers-license/eu-lv.png";
import euLT from "@/assets/drivers-license/eu-lt.png";
import euLU from "@/assets/drivers-license/eu-lu.png";
import euMT from "@/assets/drivers-license/eu-mt.png";
import euNL from "@/assets/drivers-license/eu-nl.png";
import euPL from "@/assets/drivers-license/eu-pl.png";
import euPT from "@/assets/drivers-license/eu-pt.png";
import euRO from "@/assets/drivers-license/eu-ro.png";
import euSK from "@/assets/drivers-license/eu-sk.png";
import euSI from "@/assets/drivers-license/eu-si.png";
import euES from "@/assets/drivers-license/eu-es.png";
import euSE from "@/assets/drivers-license/eu-se.png";

const DriverLicenseDetail = () => {
  const { licenseId } = useParams();
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState("features");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const reviewStats = useReviewStats("license", licenseId || "");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleBuyNow = () => {
    setShowCheckoutModal(true);
  };

  // Check for ?tab=reviews query param and scroll to reviews
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "reviews") {
      setActiveTab("reviews");
      setTimeout(() => {
        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  // Extract country from licenseId (format: "license-united-states")
  const country = licenseId?.replace('license-', '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  // Country to EU logo mapping
  const euLogoMap: Record<string, string> = {
    "Austria": euAT,
    "Belgium": euBE,
    "Bulgaria": euBG,
    "Croatia": euHR,
    "Cyprus": euCY,
    "Czech Republic": euCZ,
    "Denmark": euDK,
    "Estonia": euEE,
    "Finland": euFI,
    "France": euFR,
    "Germany": euDE,
    "Greece": euGR,
    "Hungary": euHU,
    "Ireland": euIE,
    "Italy": euIT,
    "Latvia": euLV,
    "Lithuania": euLT,
    "Luxembourg": euLU,
    "Malta": euMT,
    "Netherlands": euNL,
    "Poland": euPL,
    "Portugal": euPT,
    "Romania": euRO,
    "Slovakia": euSK,
    "Slovenia": euSI,
    "Spain": euES,
    "Sweden": euSE,
  };

  const licenseImage = euLogoMap[country];

  const licenseData = {
    country: country,
    title: `${country} Driver's License`,
    price: "$800",
    processingTime: "5-7 business days",
    description: `Obtain your premium ${country} driver's license featuring cutting-edge security technology and authentic government-specification materials. Manufactured using advanced polycarbonate card stock with integrated security features including biometric photo integration, ghost image technology, precision microtext printing, and sophisticated UV-reactive ink patterns. Our high-security licenses incorporate laser engraving for permanent data protection, dual-technology barcode and magnetic stripe encoding, and multi-layered holographic overlays displaying official emblems. The tamper-evident construction immediately reveals any alteration attempts, protecting your identity and credentials. We employ the exact production standards and security protocols used by official government facilities, ensuring your license passes all authentication checks and verification systems. The durable polycarbonate material resists wear and environmental factors while maintaining pristine appearance for years. Streamlined processing delivers your license in 5-7 business days with secure express shipping worldwide and rigorous quality control inspection.`,
    
    features: [
      "Biometric photo & fingerprint",
      "Ghost image technology",
      "Microtext printing",
      "UV ink patterns",
      "Laser engraving",
      "Barcode & magnetic stripe",
      "Holographic overlay",
      "Tamper-evident design",
    ],

    specifications: [
      { label: "Country", value: country },
      { label: "Format", value: "ID-1 card (CR80)" },
      { label: "Validity", value: "3-10 years" },
      { label: "Material", value: "Polycarbonate" },
      { label: "Security Level", value: "High-security" },
    ],

    benefits: [
      "Valid government-issued identification",
      "Accepted for official purposes",
      "High-security polycarbonate material",
      "Advanced biometric integration",
      "Tamper-proof security features",
      "Quick processing and delivery",
      "Worldwide express shipping included",
      "Full database registration",
    ],

    process: [
      {
        step: "1",
        title: "Submit Order",
        description: "Choose standard order or crypto escrow payment method and complete your purchase",
      },
      {
        step: "2",
        title: "Provide Documents",
        description: "Submit required documentation including photo, signature, and personal information",
      },
      {
        step: "3",
        title: "Production",
        description: "Your driver's license is manufactured with all security features and biometric data",
      },
      {
        step: "4",
        title: "Quality Check",
        description: "Comprehensive inspection to ensure all security features and data are correct",
      },
      {
        step: "5",
        title: "Secure Delivery",
        description: "Express courier delivery with tracking and signature confirmation (5-7 business days)",
      },
    ],


    faqs: [
      {
        question: "Is this a real driver's license?",
        answer: "Yes, this is a fully functional driver's license with all required security features, biometric data, and official formatting. It meets all specifications for the issuing country.",
      },
      {
        question: "What documents do I need to provide?",
        answer: "You'll need to provide a high-quality passport-style photo, signature sample, and personal information. Specific requirements will be provided after order confirmation.",
      },
      {
        question: "How long does processing take?",
        answer: "Standard processing takes 5-7 business days from document submission. Express options may be available for faster delivery.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept standard payment methods and cryptocurrency via our secure escrow service (adds 1.5% fee for buyer protection).",
      },
      {
        question: "Can I track my order?",
        answer: "Yes, you'll receive tracking information once your license ships. You can monitor the delivery status in real-time.",
      },
      {
        question: "What if there's an error in my license?",
        answer: "We offer free replacements for any manufacturing errors. Contact support within 30 days of delivery for corrections.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${licenseData.title} - Driver's License Verification | SecureDoc Solutions`}
        description={`${licenseData.description} Professional license verification with security features. Price: ${licenseData.price}.`}
        keywords={`${licenseData.country} driver's license, license verification, DMV verification, driving credentials`}
        canonicalUrl={`${baseUrl}/drivers-license/${licenseId}`}
      />
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <Link to="/drivers-license" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Driver's Licenses
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <CreditCard className="w-3 h-3 mr-1" />
                High-Security Driver's License
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {licenseData.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {licenseData.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{licenseData.processingTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-medium">High-Security Features</span>
                </div>
              </div>
            </div>

            <Card className="border-primary/20 shadow-lg">
              <CardContent className="pt-6">
                {licenseImage && (
                  <div className="mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 p-6">
                    <img 
                      src={licenseImage} 
                      alt={`${country} EU Driver's License`}
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">{licenseData.price}</p>
                  <p className="text-sm text-muted-foreground">Includes all security features & shipping</p>
                </div>

                <div className="space-y-2 mb-6">
                  {licenseData.features.slice(0, 4).map((feature, idx) => (
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
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Order Now
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
      <EscrowTransactionForm
        open={showCryptoEscrow}
        onOpenChange={setShowCryptoEscrow}
      />

      {/* Detailed Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                        {licenseData.features.map((feature, idx) => (
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
                        {licenseData.specifications.map((spec, idx) => (
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
                    {licenseData.benefits.map((benefit, idx) => (
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
                    {licenseData.process.map((item, idx) => (
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

            <TabsContent value="reviews" id="reviews-section">
              <div className="space-y-6">
            <ReviewStatsCard
              count={reviewStats.count}
              averageRating={reviewStats.averageRating}
            />
                <ReviewForm
                  productType="license"
                  productId={licenseId || ""}
                  onReviewSubmitted={() => setReviewsRefresh(prev => prev + 1)}
                />
                <ReviewsList
                  productType="license"
                  productId={licenseId || ""}
                  refreshTrigger={reviewsRefresh}
                />
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {licenseData.faqs.map((faq, idx) => (
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

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The premier choice for high-security identification documents worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Materials</h3>
                <p className="text-muted-foreground">
                  Manufactured with genuine polycarbonate card stock and advanced security features identical to government-issued licenses. Every element meets or exceeds official specifications for durability and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Security</h3>
                <p className="text-muted-foreground">
                  Integrated biometric technology, ghost images, UV patterns, microtext, and holographic overlays ensure your license withstands scrutiny from all verification systems and detection equipment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rapid Processing</h3>
                <p className="text-muted-foreground">
                  Your license is ready in just 5-7 business days with priority manufacturing and express worldwide shipping. Track your order every step of the way from production to your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
                <p className="text-muted-foreground">
                  Multiple payment options including cryptocurrency escrow service providing ultimate buyer protection. Your payment is secured until you receive and verify your license meets all specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Professional Support</h3>
                <p className="text-muted-foreground">
                  Our experienced team provides personalized assistance throughout your order. Available 24/7 via email, chat, or phone to answer questions and ensure a smooth, hassle-free experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Error-Free Guarantee</h3>
                <p className="text-muted-foreground">
                  Comprehensive quality inspection before delivery ensures accuracy. We provide free corrections for any manufacturing defects within 30 days, guaranteeing your complete satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order Your Driver's License?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get your secure {licenseData.country} driver's license with all modern security features
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              onClick={() => navigate(`/apply?type=license&name=${encodeURIComponent(licenseData.title)}`)}
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

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
      />

    </div>
  );
};

export default DriverLicenseDetail;