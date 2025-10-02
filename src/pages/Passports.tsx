import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Globe, Search, Filter, X } from "lucide-react";
import { EscrowForm } from "@/components/EscrowForm";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";

// Import coat of arms images
import austriaCoA from "@/assets/coat-of-arms/austria.png";
import belgiumCoA from "@/assets/coat-of-arms/belgium.png";
import bulgariaCoA from "@/assets/coat-of-arms/bulgaria.png";
import croatiaCoA from "@/assets/coat-of-arms/croatia.png";
import cyprusCoA from "@/assets/coat-of-arms/cyprus.png";
import czechRepublicCoA from "@/assets/coat-of-arms/czech-republic.png";
import denmarkCoA from "@/assets/coat-of-arms/denmark.png";
import estoniaCoA from "@/assets/coat-of-arms/estonia.png";
import finlandCoA from "@/assets/coat-of-arms/finland.png";
import franceCoA from "@/assets/coat-of-arms/france.png";
import germanyCoA from "@/assets/coat-of-arms/germany.png";
import greeceCoA from "@/assets/coat-of-arms/greece.png";
import hungaryCoA from "@/assets/coat-of-arms/hungary.png";
import irelandCoA from "@/assets/coat-of-arms/ireland.png";
import italyCoA from "@/assets/coat-of-arms/italy.png";
import latviaCoA from "@/assets/coat-of-arms/latvia.png";
import lithuaniaCoA from "@/assets/coat-of-arms/lithuania.png";
import luxembourgCoA from "@/assets/coat-of-arms/luxembourg.png";
import maltaCoA from "@/assets/coat-of-arms/malta.png";
import netherlandsCoA from "@/assets/coat-of-arms/netherlands.png";
import polandCoA from "@/assets/coat-of-arms/poland.png";
import portugalCoA from "@/assets/coat-of-arms/portugal.png";
import romaniaCoA from "@/assets/coat-of-arms/romania.png";
import slovakiaCoA from "@/assets/coat-of-arms/slovakia.png";
import sloveniaCoA from "@/assets/coat-of-arms/slovenia.png";
import spainCoA from "@/assets/coat-of-arms/spain.png";
import swedenCoA from "@/assets/coat-of-arms/sweden.png";
import unitedStatesCoA from "@/assets/coat-of-arms/united-states.png";
import unitedKingdomCoA from "@/assets/coat-of-arms/united-kingdom.png";
import canadaCoA from "@/assets/coat-of-arms/canada.png";
import australiaCoA from "@/assets/coat-of-arms/australia.png";
import switzerlandCoA from "@/assets/coat-of-arms/switzerland.png";

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

// Mapping of country names to coat of arms images
const coatOfArmsMap: Record<string, string> = {
  "Austria": austriaCoA,
  "Belgium": belgiumCoA,
  "Bulgaria": bulgariaCoA,
  "Croatia": croatiaCoA,
  "Cyprus": cyprusCoA,
  "Czech Republic": czechRepublicCoA,
  "Denmark": denmarkCoA,
  "Estonia": estoniaCoA,
  "Finland": finlandCoA,
  "France": franceCoA,
  "Germany": germanyCoA,
  "Greece": greeceCoA,
  "Hungary": hungaryCoA,
  "Ireland": irelandCoA,
  "Italy": italyCoA,
  "Latvia": latviaCoA,
  "Lithuania": lithuaniaCoA,
  "Luxembourg": luxembourgCoA,
  "Malta": maltaCoA,
  "Netherlands": netherlandsCoA,
  "Poland": polandCoA,
  "Portugal": portugalCoA,
  "Romania": romaniaCoA,
  "Slovakia": slovakiaCoA,
  "Slovenia": sloveniaCoA,
  "Spain": spainCoA,
  "Sweden": swedenCoA,
  "United States": unitedStatesCoA,
  "United Kingdom": unitedKingdomCoA,
  "Canada": canadaCoA,
  "Australia": australiaCoA,
  "Switzerland": switzerlandCoA,
};

// Generate passports for each country
const generatePassports = () => {
  return allCountries.map((country) => ({
    id: `passport-${country.toLowerCase().replace(/\s+/g, '-')}`,
    title: `${country} Passport`,
    description: `Fully registered biometric ${country} passport with embedded chips and advanced security features`,
    country: country,
    image: coatOfArmsMap[country],
    price: 2500,
    processingTime: "7-10 business days",
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
  }));
};

const passports = generatePassports();

const Passports = () => {
  const navigate = useNavigate();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState<any>(null);
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

  const filteredPassports = passports.filter(passport => {
    const matchesSearch = passport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         passport.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedRegions.length === 0) return matchesSearch;

    const isEU = euCountries.includes(passport.country);
    const matchesRegion = 
      (selectedRegions.includes("eu") && isEU) ||
      (selectedRegions.includes("other") && !isEU);

    return matchesSearch && matchesRegion;
  });

  const handleOrderClick = (passport: any) => {
    setSelectedPassport(passport);
    setShowCryptoEscrow(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Registered Passports</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Biometric Passport Documents
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Fully registered biometric passports from around the world with embedded RFID chips and military-grade security features
            </p>

            <div className="flex flex-wrap gap-6 justify-center items-center text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Military-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">32 or 64 Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">$2,500 per Passport</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Passports Grid */}
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
                      placeholder="Search passports..."
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
                  {filteredPassports.length} passport{filteredPassports.length !== 1 ? 's' : ''} found
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
            {filteredPassports.map((passport) => (
              <Card key={passport.id} className="border-border/50 bg-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4 p-6 bg-gradient-to-br from-background to-muted rounded-lg">
                    <img 
                      src={passport.image} 
                      alt={`${passport.country} coat of arms`}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{passport.title}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Military-Grade
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{passport.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold text-primary">${passport.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Processing Time</span>
                        <span className="text-sm font-medium">{passport.processingTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Security Features:</h4>
                      <ul className="space-y-1">
                        {passport.features.slice(0, 4).map((feature: string, idx: number) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {passport.features.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{passport.features.length - 4} more features
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-border/50 flex-col gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/passports/${passport.id}`)}
                  >
                    View Details
                  </Button>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/apply?type=passport&name=${encodeURIComponent(passport.title)}`)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleOrderClick(passport)}
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

      {/* Security Features Section */}
      <SecurityFeaturesSection />

      {/* Crypto Escrow Dialog */}
      <EscrowForm
        open={showCryptoEscrow}
        onOpenChange={setShowCryptoEscrow}
        productName={selectedPassport?.title || ""}
        productPrice={selectedPassport ? `$${selectedPassport.price}` : "$0"}
        deliveryTime={selectedPassport?.processingTime || ""}
      />
    </div>
  );
};

export default Passports;
