import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, ShoppingCart } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { EscrowForm } from "@/components/EscrowForm";

// EU Countries
const euCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

// Other Countries
const otherCountries = ["United States", "United Kingdom", "Canada", "Australia", "Switzerland"];

// All countries combined
const allCountries = [...euCountries, ...otherCountries];

// Generate driver's licenses for each country
const generateDriversLicenses = () => {
  return allCountries.map((country) => ({
    id: `license-${country.toLowerCase().replace(/\s+/g, '-')}`,
    title: `${country} Driver's License`,
    description: `Secure ${country} driver's license with biometric data and tamper-proof features`,
    country: country,
    price: 800,
    processingTime: "5-7 business days",
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
  }));
};

const driversLicenses = generateDriversLicenses();

const DriversLicense = () => {
  const navigate = useNavigate();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);

  const handleOrderClick = (license: any) => {
    setSelectedLicense(license);
    setShowCryptoEscrow(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileNav currentPage="drivers-license" />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Secure Driver's Licenses</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Driver's License Documents
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Secure driver's licenses from around the world with advanced biometric data and tamper-proof security features
            </p>

            <div className="flex flex-wrap gap-6 justify-center items-center text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">High-Security Features</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Polycarbonate Material</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">$800 per License</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver's Licenses Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {driversLicenses.map((license) => (
              <Card key={license.id} className="border-border/50 bg-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      High-Security
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{license.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{license.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold text-primary">${license.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Processing Time</span>
                        <span className="text-sm font-medium">{license.processingTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Security Features:</h4>
                      <ul className="space-y-1">
                        {license.features.slice(0, 4).map((feature: string, idx: number) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {license.features.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{license.features.length - 4} more features
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-border/50">
                  <Button 
                    className="w-full group relative overflow-hidden"
                    onClick={() => handleOrderClick(license)}
                  >
                    <span className="relative z-10">Order Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Escrow Dialog */}
      <EscrowForm
        open={showCryptoEscrow}
        onOpenChange={setShowCryptoEscrow}
        productName={selectedLicense?.title || ""}
        productPrice={selectedLicense?.price || 0}
        deliveryTime={selectedLicense?.processingTime || ""}
      />

      <Footer />
    </div>
  );
};

export default DriversLicense;
