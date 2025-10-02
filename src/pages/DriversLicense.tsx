import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, ShoppingCart, Search, Filter, X } from "lucide-react";
import { EscrowForm } from "@/components/EscrowForm";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const regions = [
    { id: "eu", label: "European Union", count: euCountries.length },
    { id: "other", label: "Other Countries", count: otherCountries.length },
  ];

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const filteredLicenses = driversLicenses.filter(license => {
    const matchesSearch = license.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedRegions.length === 0) return matchesSearch;

    const isEU = euCountries.includes(license.country);
    const matchesRegion = 
      (selectedRegions.includes("eu") && isEU) ||
      (selectedRegions.includes("other") && !isEU);

    return matchesSearch && matchesRegion;
  });

  const handleOrderClick = (license: any) => {
    setSelectedLicense(license);
    setShowCryptoEscrow(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Security Features Section */}
      <SecurityFeaturesSection />

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
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
              <div className="sticky top-4 space-y-6">
                {/* Search */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search licenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Region</h3>
                  <div className="space-y-3">
                    {regions.map((region) => (
                      <div key={region.id} className="flex items-center gap-2">
                        <Checkbox
                          id={region.id}
                          checked={selectedRegions.includes(region.id)}
                          onCheckedChange={() => toggleRegion(region.id)}
                        />
                        <Label
                          htmlFor={region.id}
                          className="text-sm cursor-pointer flex items-center justify-between flex-1"
                        >
                          <span>{region.label}</span>
                          <Badge variant="secondary" className="ml-2">
                            {region.count}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedRegions.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegions([]);
                    }}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredLicenses.length} license{filteredLicenses.length !== 1 ? 's' : ''} found
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLicenses.map((license) => (
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
                
                <CardFooter className="pt-4 border-t border-border/50 flex-col gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/drivers-license/${license.id}`)}
                  >
                    View Details
                  </Button>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/apply?type=license&name=${encodeURIComponent(license.title)}`)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleOrderClick(license)}
                    >
                      Escrow
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Escrow adds 1.5% fee for buyer protection
                  </p>
                </CardFooter>
                </Card>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crypto Escrow Dialog */}
      <EscrowForm
        open={showCryptoEscrow}
        onOpenChange={setShowCryptoEscrow}
        productName={selectedLicense?.title || ""}
        productPrice={selectedLicense ? `$${selectedLicense.price}` : "$0"}
        deliveryTime={selectedLicense?.processingTime || ""}
      />
    </div>
  );
};

export default DriversLicense;
