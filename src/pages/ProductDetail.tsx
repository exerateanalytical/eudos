import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { EscrowForm } from "@/components/EscrowForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  FileText, CreditCard, IdCard, ArrowLeft, ShoppingCart, Shield, 
  Fingerprint, Cpu, Sparkles, Eye, Scan, Radio, Lock, FileCheck, 
  Database, CheckCircle2, Package, Truck, HeadphonesIcon, Globe,
  Calendar, Award, Star, Coins
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { BitcoinCheckout } from "@/components/checkout/BitcoinCheckout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBitcoinWallet } from "@/hooks/useBitcoinWallet";

// Product data (same as Shop page)
const euCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

const otherCountries = ["United States", "United Kingdom", "Canada", "Australia", "Switzerland"];
const allCountries = [...euCountries, ...otherCountries];

const generateCountryProducts = () => {
  const products: any[] = [];
  
  allCountries.forEach((country) => {
    products.push({
      id: `passport-${country.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${country} Passport`,
      description: `Fully registered biometric ${country} passport with embedded chips and advanced security features`,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      category: "Travel Documents",
      country: country,
      securityLevel: "Military-grade",
      price: "$2,500",
      priceNumeric: 2500,
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
        { label: "Material", value: "Polycarbonate data page" },
        { label: "Dimensions", value: "125mm × 88mm" },
        { label: "Processing Time", value: "7-14 business days" },
      ],
    });

    products.push({
      id: `license-${country.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${country} Driver's License`,
      description: `Secure ${country} driver's license with biometric data and tamper-proof features`,
      icon: CreditCard,
      gradient: "from-purple-500 to-pink-500",
      category: "Identification Cards",
      country: country,
      securityLevel: "High-security",
      price: "$800",
      priceNumeric: 800,
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
        { label: "Dimensions", value: "85.6mm × 53.98mm" },
        { label: "Thickness", value: "0.76mm" },
        { label: "Processing Time", value: "5-10 business days" },
      ],
    });

    products.push({
      id: `id-${country.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${country} National ID`,
      description: `Government-issued ${country} ID card with RFID technology and holographic security`,
      icon: IdCard,
      gradient: "from-green-500 to-emerald-500",
      category: "Identification Cards",
      country: country,
      securityLevel: "Maximum security",
      price: "$1,200",
      priceNumeric: 1200,
      features: [
        "RFID chip with encrypted data",
        "Biometric facial recognition",
        "Fingerprint storage",
        "Holographic security overlay",
        "Invisible UV features",
        "Microtext & guilloche patterns",
        "Laser-etched details",
        "Database verification system",
      ],
      specifications: [
        { label: "Country", value: country },
        { label: "Format", value: "ID-1 card (CR80)" },
        { label: "Validity", value: "5-15 years" },
        { label: "Chip Type", value: "Contactless smart chip" },
        { label: "Security Level", value: "Maximum security" },
        { label: "Dimensions", value: "85.6mm × 53.98mm" },
        { label: "Thickness", value: "0.76mm" },
        { label: "Processing Time", value: "10-15 business days" },
      ],
    });
  });

  return products;
};

const products = generateCountryProducts();

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseUrl = window.location.origin;
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showBitcoinCheckout, setShowBitcoinCheckout] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const { walletId, verifyWallet } = useBitcoinWallet();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleBuyNow = async () => {
    if (!walletId || walletId === "") {
      toast({
        title: "Configuration Required",
        description: "Bitcoin wallet is not configured. Please contact administrator to set up Bitcoin payments.",
        variant: "destructive",
      });
      return;
    }
    
    const isValid = await verifyWallet();
    if (!isValid) {
      return;
    }
    
    if (user) {
      setShowBitcoinCheckout(true);
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleGuestProceed = (info: any) => {
    setGuestInfo(info);
    setShowBitcoinCheckout(true);
  };
  
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  const Icon = product.icon;
  
  // Get related products (same category, different country)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const faqs = [
    {
      question: "How long does processing take?",
      answer: `Standard processing time is ${product.specifications.find(s => s.label === "Processing Time")?.value}. Express options are available for urgent orders.`
    },
    {
      question: "Is this document registered in government databases?",
      answer: "Yes, all our documents are fully registered in the respective government databases and pass all verification checks."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cryptocurrency (Bitcoin, Ethereum), wire transfers, and other secure payment methods. Full details provided during checkout."
    },
    {
      question: "Do you offer worldwide shipping?",
      answer: "Yes, we ship worldwide using secure, tracked shipping methods. Delivery times vary by location."
    },
    {
      question: "What if my document is damaged during shipping?",
      answer: "All products are fully insured. We will replace any damaged items at no additional cost."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={`${product.title} - ${product.category} | SecureDoc Solutions`}
        description={`${product.description} Professional document verification with advanced security. Price: ${product.price}.`}
        keywords={`${product.title}, ${product.category}, document verification, security features`}
        canonicalUrl={`${baseUrl}/product/${productId}`}
      />
      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/products")}
          className="mb-6 touch-manipulation active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        {/* Product Hero Section */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
          {/* Product Image/Icon */}
          <Card className="overflow-hidden border-2 animate-fade-in">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Icon className="h-32 w-32 md:h-48 md:w-48 text-white mb-6 drop-shadow-2xl" />
                  <h2 className="text-white text-2xl md:text-3xl font-bold text-center drop-shadow-lg">
                    {product.title}
                  </h2>
                  <Badge className="mt-4 text-lg font-bold bg-background/90 text-foreground backdrop-blur-sm px-4 py-2">
                    {product.price}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.securityLevel}</Badge>
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  In Stock
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {product.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-primary">{product.price}</span>
                <span className="text-muted-foreground line-through">$3,500</span>
                <Badge variant="destructive">Save 29%</Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Security</p>
                    <p className="font-bold text-sm">{product.securityLevel}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Validity</p>
                    <p className="font-bold text-sm">{product.specifications.find(s => s.label === "Validity")?.value}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quantity & Purchase */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="touch-manipulation active:scale-95"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="touch-manipulation active:scale-95"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    size="lg" 
                    className="w-full touch-manipulation active:scale-95"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now with Bitcoin
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full touch-manipulation active:scale-95"
                    onClick={() => setShowCryptoEscrow(true)}
                  >
                    <Coins className="mr-2 h-5 w-5" />
                    Pay with Crypto Escrow
                  </Button>
                </div>

                <EscrowForm
                  open={showCryptoEscrow}
                  onOpenChange={setShowCryptoEscrow}
                  productName={product.title}
                  productPrice={product.price}
                  deliveryTime={product.specifications.find(s => s.label === "Processing Time")?.value}
                />

                <div className="pt-4 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <HeadphonesIcon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">24/7 Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Card className="mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
                <TabsTrigger value="specs" className="text-xs sm:text-sm">Specifications</TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-3">
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <div className="grid gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-3">
                <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                <div className="grid gap-3">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                      <span className="font-semibold text-sm md:text-base">{spec.label}</span>
                      <span className="text-muted-foreground text-sm md:text-base">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Advanced Security Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    { icon: Fingerprint, label: "Biometric Data" },
                    { icon: Cpu, label: "RFID Chip" },
                    { icon: Sparkles, label: "Hologram" },
                    { icon: Eye, label: "UV Features" },
                    { icon: Scan, label: "Microtext" },
                    { icon: Radio, label: "Laser Engraved" },
                    { icon: FileCheck, label: "Watermarks" },
                    { icon: Lock, label: "Tamper-Proof" },
                  ].map((item, idx) => {
                    const SecurityIcon = item.icon;
                    return (
                      <Card key={idx} className="hover:shadow-lg transition-all animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                          <div className="p-3 rounded-full bg-primary/10">
                            <SecurityIcon className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-xs font-medium">{item.label}</span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/5 border border-primary/20">
                  <div className="flex items-start gap-4">
                    <Database className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-2">Government Database Registration</h4>
                      <p className="text-sm text-muted-foreground">
                        All documents are registered in official government databases and pass all verification systems including border control, airport security, and online verification portals.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8 md:mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Get answers to common questions about this product</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              {relatedProducts.map((relProduct, idx) => {
                const RelIcon = relProduct.icon;
                return (
                  <div
                    key={relProduct.id}
                    className="group cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    onClick={() => navigate(`/product/${relProduct.id}`)}
                  >
                    <Card className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-border/50 h-full touch-manipulation active:scale-95">
                      <CardContent className="p-0">
                        <div className="aspect-square relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${relProduct.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 md:p-4">
                            <RelIcon className="h-10 w-10 md:h-12 md:w-12 text-white mb-2 md:mb-3 drop-shadow-lg" />
                            <h3 className="text-white text-xs md:text-sm font-bold text-center line-clamp-2 drop-shadow-md px-1">
                              {relProduct.title}
                            </h3>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="text-[10px] md:text-xs font-bold bg-background/90 text-foreground backdrop-blur-sm">
                              {relProduct.price}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-2 md:p-3 bg-card">
                          <Badge variant="secondary" className="text-[10px] md:text-xs w-full justify-center truncate">
                            {relProduct.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust & Support Section */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                Worldwide Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We ship to over 180 countries worldwide using secure, tracked shipping methods. All packages are discreetly packaged and fully insured.
              </p>
              <Button variant="outline" onClick={() => navigate("/faq")}>
                Shipping Info
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
                Expert Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to answer your questions and assist with your order. Contact us anytime via secure channels.
              </p>
              <Button variant="outline" onClick={() => navigate("/#contact")}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modals */}
      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onProceed={handleGuestProceed}
      />

      <Dialog open={showBitcoinCheckout} onOpenChange={setShowBitcoinCheckout}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bitcoin Payment</DialogTitle>
          </DialogHeader>
          <BitcoinCheckout
            walletId={walletId}
            productName={product.title}
            productType={product.category}
            amountBTC={product.priceNumeric / 50000} // Example conversion
            amountFiat={product.priceNumeric}
            guestInfo={guestInfo}
            onPaymentComplete={() => {
              setShowBitcoinCheckout(false);
              navigate('/dashboard/orders');
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
