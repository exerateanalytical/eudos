import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, ArrowLeft, FileText, CreditCard, IdCard, GraduationCap, Shield, Fingerprint, Cpu, Sparkles, Eye, Scan, Radio, Lock, FileCheck, Database } from "lucide-react";
import { Footer } from "@/components/Footer";

const products = [
  {
    id: "passport",
    title: "Registered Passport",
    description: "Fully registered biometric passports with embedded chips and advanced security features",
    icon: FileText,
    gradient: "from-blue-500 to-cyan-500",
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
      { label: "Pages", value: "32 or 64 pages" },
      { label: "Validity", value: "5 or 10 years" },
      { label: "Chip Type", value: "RFID contactless" },
      { label: "Security Level", value: "Military-grade" },
    ],
  },
  {
    id: "drivers-license",
    title: "Driver's License",
    description: "Secure driver's licenses with biometric data and tamper-proof features",
    icon: CreditCard,
    gradient: "from-purple-500 to-pink-500",
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
      { label: "Format", value: "ID-1 card (CR80)" },
      { label: "Validity", value: "3-10 years" },
      { label: "Material", value: "Polycarbonate" },
      { label: "Security Level", value: "High-security" },
    ],
  },
  {
    id: "id-card",
    title: "National ID Card",
    description: "Government-issued ID cards with RFID technology and holographic security",
    icon: IdCard,
    gradient: "from-green-500 to-emerald-500",
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
      { label: "Format", value: "ID-1 card (CR80)" },
      { label: "Validity", value: "5-15 years" },
      { label: "Chip Type", value: "Contactless smart chip" },
      { label: "Security Level", value: "Maximum security" },
    ],
  },
  {
    id: "diploma",
    title: "Official Diploma",
    description: "Authenticated educational certificates with advanced anti-forgery protection",
    icon: GraduationCap,
    gradient: "from-orange-500 to-red-500",
    features: [
      "Multi-tone watermarks",
      "Security threads",
      "UV reactive elements",
      "Embossed seals",
      "Microtext printing",
      "Intaglio printing",
      "Serial numbering",
      "Verification QR codes",
    ],
    specifications: [
      { label: "Size", value: "A4 or custom" },
      { label: "Material", value: "Security paper" },
      { label: "Printing", value: "Offset & intaglio" },
      { label: "Security Level", value: "Anti-forgery" },
    ],
  },
];

const securityIcons = [
  { icon: Fingerprint, label: "Biometric" },
  { icon: Cpu, label: "RFID Chip" },
  { icon: Sparkles, label: "Hologram" },
  { icon: Eye, label: "UV Features" },
  { icon: Scan, label: "Microtext" },
  { icon: Radio, label: "Laser Engraved" },
  { icon: FileCheck, label: "Watermarks" },
  { icon: Lock, label: "Tamper-Proof" },
  { icon: Database, label: "DB Registered" },
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <Printer className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SecurePrint Labs
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Home
            </button>
            <button onClick={() => navigate("/products")} className="text-primary font-medium">
              Products
            </button>
            <button onClick={() => navigate("/about")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              About
            </button>
            <button onClick={() => navigate("/apply")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Apply
            </button>
            <button onClick={() => navigate("/faq")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              FAQ
            </button>
            <button onClick={() => navigate("/testimonials")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Testimonials
            </button>
            <button onClick={() => navigate("/blog")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Blog
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Government-Grade Security Documents</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Product Catalog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our range of secure government documents featuring military-grade security features and biometric technology
          </p>
        </div>

        {/* Security Features Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Advanced Security Features</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {securityIcons.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="relative overflow-hidden pb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-10`} />
                  <div className="relative flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${product.gradient}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                      <CardDescription className="text-base">
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Security Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="font-semibold mb-3">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-xs text-muted-foreground">{spec.label}</div>
                          <Badge variant="outline" className="font-normal">
                            {spec.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/30 flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => navigate("/apply")}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/#contact")}
                  >
                    Request Quote
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-3">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Our licensed facility is ready to serve your government agency with the highest quality secure documents
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/apply")}>
              Start Application
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/#contact")}>
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
