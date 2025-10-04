import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Globe, Search, Filter, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";
import { SEO } from "@/components/SEO";
import { seoConfig } from "@/config/seo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// EU Countries list for filtering
const euCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

const Passports = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const baseUrl = window.location.origin;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [passports, setPassports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from database
  useEffect(() => {
    loadPassports();
  }, []);

  // Apply URL filter on load
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setSearchTerm(filter);
    }
  }, [searchParams]);

  const loadPassports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cms_products')
        .select('*')
        .eq('category_type', 'passport')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;

      if (data) {
        setPassports(data);
      }
    } catch (error) {
      console.error('Error loading passports:', error);
      toast.error('Failed to load passports');
    } finally {
      setLoading(false);
    }
  };

  // Get unique regions from products
  const regions = [
    { id: "eu", label: "European Union", count: passports.filter(p => euCountries.includes(p.country || "")).length },
    { id: "other", label: "Other Countries", count: passports.filter(p => !euCountries.includes(p.country || "")).length },
  ];

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const filteredPassports = passports.filter(passport => {
    const matchesSearch = (passport.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (passport.country || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedRegions.length === 0) return matchesSearch;

    const isEU = euCountries.includes(passport.country || "");
    const matchesRegion = 
      (selectedRegions.includes("eu") && isEU) ||
      (selectedRegions.includes("other") && !isEU);

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={seoConfig.passports.title}
        description={seoConfig.passports.description}
        keywords={seoConfig.passports.keywords}
        canonicalUrl={`${baseUrl}/passports`}
      />
      
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
                <span className="text-muted-foreground">Database Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">RFID/NFC Chips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className={`lg:w-64 lg:block ${isSidebarOpen ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24 lg:h-fit`}>
              <div className="space-y-6 p-6 border border-border rounded-lg bg-card">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Search</Label>
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

                {/* Regions */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Regions</Label>
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <div key={region.id} className="flex items-center space-x-2">
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

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPassports.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No passports found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPassports.map((passport) => (
                    <Card key={passport.id} className="border-border/50 bg-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col">
                      <CardHeader>
                        {passport.image_url && (
                          <div className="flex items-center justify-center mb-4 p-6 bg-gradient-to-br from-background to-muted rounded-lg">
                            <img 
                              src={passport.image_url} 
                              alt={passport.name}
                              className="w-32 h-32 object-contain"
                            />
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{passport.name}</CardTitle>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Active
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{passport.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          {passport.price && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Price</span>
                              <span className="text-lg font-bold text-primary">${passport.price}</span>
                            </div>
                          )}
                          {passport.country && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Country</span>
                              <span className="text-sm font-medium">{passport.country}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-4 border-t border-border/50">
                        <Button 
                          className="w-full"
                          onClick={() => navigate(`/passports/${passport.slug || passport.id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <SecurityFeaturesSection />
    </div>
  );
};

export default Passports;