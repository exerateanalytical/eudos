import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText, CreditCard, IdCard, GraduationCap, Shield, Fingerprint, Cpu, Sparkles, Eye, Scan, Radio, Lock, FileCheck, Database, Filter, X, ShoppingCart } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

// Generate products for each country
const generateCountryProducts = () => {
  const products: any[] = [];
  
  allCountries.forEach((country, index) => {
    // Passport
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
    });

    // Driver's License
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
    });

    // National ID Card
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
      ],
    });
  });

  return products;
};

const products = generateCountryProducts();

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

const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSecurityLevels, setSelectedSecurityLevels] = useState<string[]>([]);
  const [selectedSecurityFeatures, setSelectedSecurityFeatures] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsToShow, setProductsToShow] = useState(15); // 3 rows × 5 columns (max)

  const categories = ["Travel Documents", "Identification Cards"];
  const securityLevels = ["Military-grade", "Maximum security", "High-security"];
  const countries = allCountries;

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSecurityLevel = (level: string) => {
    setSelectedSecurityLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleSecurityFeature = (feature: string) => {
    setSelectedSecurityFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSecurityLevels([]);
    setSelectedSecurityFeatures([]);
    setSelectedCountries([]);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesSecurityLevel = selectedSecurityLevels.length === 0 || selectedSecurityLevels.includes(product.securityLevel);
    const matchesSecurityFeatures = selectedSecurityFeatures.length === 0 || 
      selectedSecurityFeatures.some(feature => 
        product.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
      );
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(product.country);
    return matchesCategory && matchesSecurityLevel && matchesSecurityFeatures && matchesCountry;
  });

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
          <nav className="hidden md:flex gap-4 lg:gap-8">
            <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              Home
            </button>
            <button onClick={() => navigate("/products")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              Products
            </button>
            <button onClick={() => navigate("/shop")} className="text-primary font-medium text-sm lg:text-base">
              Shop
            </button>
            <button onClick={() => navigate("/about")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              About
            </button>
            <button onClick={() => navigate("/apply")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              Apply
            </button>
            <button onClick={() => navigate("/faq")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              FAQ
            </button>
            <button onClick={() => navigate("/testimonials")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              Testimonials
            </button>
            <button onClick={() => navigate("/blog")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base">
              Blog
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Secure Document Shop</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-4">
            Shop Secure Documents
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Browse and purchase government-grade secure documents with instant checkout
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full"
          >
            <Filter className="mr-2 h-4 w-4" />
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-border/50 bg-card backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filters
                    </CardTitle>
                    {(selectedCategories.length > 0 || selectedSecurityLevels.length > 0 || selectedSecurityFeatures.length > 0 || selectedCountries.length > 0) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Document Type</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Level Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Security Level</h3>
                    <div className="space-y-3">
                      {securityLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`level-${level}`}
                            checked={selectedSecurityLevels.includes(level)}
                            onCheckedChange={() => toggleSecurityLevel(level)}
                          />
                          <Label
                            htmlFor={`level-${level}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Features Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Security Features</h3>
                    <div className="space-y-3">
                      {securityIcons.map((feature) => (
                        <div key={feature.label} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature.label}`}
                            checked={selectedSecurityFeatures.includes(feature.label)}
                            onCheckedChange={() => toggleSecurityFeature(feature.label)}
                          />
                          <Label
                            htmlFor={`feature-${feature.label}`}
                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                          >
                            <feature.icon className="h-4 w-4 text-primary" />
                            {feature.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="font-semibold mb-3 text-foreground">Country</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {countries.map((country) => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={selectedCountries.includes(country)}
                            onCheckedChange={() => toggleCountry(country)}
                          />
                          <Label
                            htmlFor={`country-${country}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(selectedCategories.length > 0 || selectedSecurityLevels.length > 0 || selectedSecurityFeatures.length > 0 || selectedCountries.length > 0) && (
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="font-semibold mb-2 text-foreground">Active Filters</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(cat => (
                          <Badge key={cat} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory(cat)}>
                            {cat} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {selectedSecurityLevels.map(level => (
                          <Badge key={level} variant="secondary" className="cursor-pointer" onClick={() => toggleSecurityLevel(level)}>
                            {level} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {selectedSecurityFeatures.map(feature => (
                          <Badge key={feature} variant="secondary" className="cursor-pointer" onClick={() => toggleSecurityFeature(feature)}>
                            {feature} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                        {selectedCountries.map(country => (
                          <Badge key={country} variant="secondary" className="cursor-pointer" onClick={() => toggleCountry(country)}>
                            {country} <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {Math.min(productsToShow, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>

            {/* Products - Square Icon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
              {filteredProducts.slice(0, productsToShow).map((product, index) => {
                const Icon = product.icon;
                return (
                  <div
                    key={product.id}
                    className="group cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Card className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border border-border/50 h-full touch-manipulation active:scale-95">
                      <CardContent className="p-0">
                        {/* Square Icon Container */}
                        <div className="aspect-square relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 md:p-4">
                            <Icon className="h-10 w-10 md:h-12 md:w-12 text-white mb-2 md:mb-3 drop-shadow-lg" />
                            <h3 className="text-white text-xs md:text-sm font-bold text-center line-clamp-2 drop-shadow-md px-1">
                              {product.title}
                            </h3>
                          </div>
                          {/* Price Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge className="text-[10px] md:text-xs font-bold bg-background/90 text-foreground backdrop-blur-sm">
                              {product.price}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Info Section */}
                        <div className="p-2 md:p-3 bg-card">
                          <Badge variant="secondary" className="text-[10px] md:text-xs w-full justify-center truncate">
                            {product.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {productsToShow < filteredProducts.length && (
              <div className="flex justify-center mb-8 md:mb-12">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setProductsToShow(prev => prev + 15)}
                  className="touch-manipulation active:scale-95"
                >
                  Load More Products ({filteredProducts.length - productsToShow} remaining)
                </Button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <Card className="p-12 text-center border-border/50 bg-card/50 mb-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more products
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Card>
            )}

            {/* Security Features Overview */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Advanced Security Features</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-4">
                {securityIcons.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-1.5 md:gap-2 p-2 md:p-4 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-lg animate-scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="p-2 md:p-3 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-center leading-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
              <CardHeader className="text-center p-4 md:p-6">
                <CardTitle className="text-2xl md:text-3xl mb-2 md:mb-3">Need Help Choosing?</CardTitle>
                <CardDescription className="text-sm md:text-base lg:text-lg">
                  Contact our team to find the perfect secure document solution for your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-3 md:gap-4 flex-wrap p-4 md:p-6 pt-0">
                <Button size="default" className="text-sm md:text-base" onClick={() => navigate("/#contact")}>
                  Contact Sales
                </Button>
                <Button size="default" variant="outline" className="text-sm md:text-base" onClick={() => navigate("/apply")}>
                  Application Form
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;
