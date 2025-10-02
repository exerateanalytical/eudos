import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Users, TrendingUp, Home, GraduationCap, Building2, Plane, Shield, Award, CheckCircle, ArrowRight, Star, FileText, CreditCard, IdCard, Search, Filter, X } from "lucide-react";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Citizenship = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const residencePrograms = [
    {
      country: "Australia",
      flag: "🇦🇺",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-yellow-500 to-red-500"
    },
    {
      country: "Austria",
      flag: "🇦🇹",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-500 to-red-600"
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      description: "Premium citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 50,000",
      benefits: ["Complete documentation package", "Premium country", "1 month processing"],
      gradient: "from-red-500 via-white to-red-500"
    },
    {
      country: "Greece",
      flag: "🇬🇷",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      country: "Portugal",
      flag: "🇵🇹",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-green-600 to-red-600"
    },
    {
      country: "Spain",
      flag: "🇪🇸",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-yellow-400 to-red-600"
    },
    {
      country: "Malta",
      flag: "🇲🇹",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-white via-red-600 to-white"
    },
    {
      country: "Monaco",
      flag: "🇲🇨",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 to-white"
    },
    {
      country: "United Arab Emirates",
      flag: "🇦🇪",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-green-600 via-white to-black"
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 to-white"
    },
    {
      country: "Switzerland",
      flag: "🇨🇭",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-white to-red-600"
    },
    {
      country: "Italy",
      flag: "🇮🇹",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-green-600 via-white to-red-600"
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      description: "Premium citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 50,000",
      benefits: ["Complete documentation package", "Premium country", "1 month processing"],
      gradient: "from-blue-700 via-white to-red-600"
    },
    {
      country: "New Zealand",
      flag: "🇳🇿",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-900 to-blue-700"
    },
    {
      country: "Latvia",
      flag: "🇱🇻",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-700 via-white to-red-700"
    },
    {
      country: "Cyprus",
      flag: "🇨🇾",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-orange-500 to-green-700"
    },
    {
      country: "Ireland",
      flag: "🇮🇪",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-green-700 via-white to-orange-600"
    },
    {
      country: "Thailand",
      flag: "🇹🇭",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-white to-blue-800"
    },
    {
      country: "Netherlands",
      flag: "🇳🇱",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-white to-blue-700"
    },
    {
      country: "Turkey",
      flag: "🇹🇷",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-700 to-red-600"
    },
    {
      country: "Brazil",
      flag: "🇧🇷",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-green-600 via-yellow-400 to-blue-700"
    },
    {
      country: "Luxembourg",
      flag: "🇱🇺",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-white to-blue-600"
    },
    {
      country: "Czech Republic",
      flag: "🇨🇿",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-white via-blue-600 to-red-600"
    },
    {
      country: "Hungary",
      flag: "🇭🇺",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-600 via-white to-green-700"
    },
    {
      country: "Bulgaria",
      flag: "🇧🇬",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-white via-green-700 to-red-600"
    },
    {
      country: "Romania",
      flag: "🇷🇴",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-700 via-yellow-400 to-red-600"
    },
    {
      country: "Montenegro",
      flag: "🇲🇪",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-red-700 via-yellow-400 to-red-700"
    },
    {
      country: "Panama",
      flag: "🇵🇦",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-600 via-white to-red-600"
    },
    {
      country: "Costa Rica",
      flag: "🇨🇷",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-600 via-white to-red-600"
    },
    {
      country: "Uruguay",
      flag: "🇺🇾",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-700 via-white to-blue-700"
    },
    {
      country: "Colombia",
      flag: "🇨🇴",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-yellow-400 via-blue-700 to-red-600"
    },
    {
      country: "Argentina",
      flag: "🇦🇷",
      description: "Full citizenship package with passport, driver's license, and national ID. Fast 1-month processing.",
      minInvestment: "USD 37,000",
      benefits: ["Complete documentation package", "No investment required", "1 month processing"],
      gradient: "from-blue-600 via-white to-blue-600"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Mobility",
      description: "Visa-free travel to multiple countries and unrestricted access to regional economic zones",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Security & Stability",
      description: "Political and economic stability with strong legal frameworks protecting your rights",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Business Opportunities",
      description: "Access to thriving markets, favorable tax structures, and international business networks",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: GraduationCap,
      title: "World-Class Education",
      description: "Top-tier educational institutions and universities for your family members",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Home,
      title: "Quality of Life",
      description: "Superior healthcare systems, infrastructure, and overall living standards",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Family Inclusion",
      description: "Most programs include spouse, children, and sometimes extended family members",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const investmentTypes = [
    { icon: Building2, title: "Real Estate Investment", description: "Property purchases in designated areas" },
    { icon: TrendingUp, title: "Government Bonds", description: "Investment in national development bonds" },
    { icon: Award, title: "Business Investment", description: "Job-creating business ventures" },
    { icon: Users, title: "Donation Programs", description: "Contributions to national development funds" }
  ];

  const regions = [
    { id: "europe", label: "Europe", count: residencePrograms.filter(p => ["Austria", "Belgium", "Cyprus", "Greece", "Ireland", "Italy", "Malta", "Netherlands", "Portugal", "Spain", "Switzerland", "United Kingdom"].includes(p.country)).length },
    { id: "americas", label: "Americas", count: residencePrograms.filter(p => ["United States", "Canada", "Brazil", "Argentina"].includes(p.country)).length },
    { id: "asia-pacific", label: "Asia-Pacific", count: residencePrograms.filter(p => ["Australia", "New Zealand", "Singapore"].includes(p.country)).length },
  ];

  const types = [
    { id: "investment", label: "Investment Program" },
    { id: "golden-visa", label: "Golden Visa" },
    { id: "skilled-migration", label: "Skilled Migration" },
  ];

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev =>
      prev.includes(regionId)
        ? prev.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const filteredPrograms = residencePrograms.filter(program => {
    const matchesSearch = program.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedRegions.length === 0 && selectedTypes.length === 0) return matchesSearch;

    let matchesRegion = selectedRegions.length === 0;
    if (selectedRegions.includes("europe")) {
      matchesRegion = matchesRegion || ["Austria", "Belgium", "Cyprus", "Greece", "Ireland", "Italy", "Malta", "Netherlands", "Portugal", "Spain", "Switzerland", "United Kingdom"].includes(program.country);
    }
    if (selectedRegions.includes("americas")) {
      matchesRegion = matchesRegion || ["United States", "Canada", "Brazil", "Argentina"].includes(program.country);
    }
    if (selectedRegions.includes("asia-pacific")) {
      matchesRegion = matchesRegion || ["Australia", "New Zealand", "Singapore", "United Arab Emirates"].includes(program.country);
    }

    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => {
      if (type === "investment") return program.minInvestment.includes("€") || program.minInvestment.includes("$");
      if (type === "golden-visa") return program.description.toLowerCase().includes("golden") || program.description.toLowerCase().includes("citizenship");
      if (type === "skilled-migration") return program.description.toLowerCase().includes("skilled");
      return true;
    });

    return matchesSearch && matchesRegion && matchesType;
  });


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Reduced by 1/2 */}
      <section className="relative py-10 md:py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Global Citizenship & Residence Solutions
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Global Citizenship Program
              <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mt-2">
                Complete Documentation Package
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Obtain citizenship with a complete documentation package including passport, driver's license, and national ID card. 
              Fast 1-month processing. No investment required - simple flat fee. Available for 32 countries worldwide.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="group" onClick={() => navigate("/apply")}>
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#programs">Explore Programs</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Citizenship Program?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete citizenship package with all essential documents in just 1 month
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Types */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Included in Your Package
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for complete citizenship documentation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Passport", description: "Valid 10-year international passport" },
              { icon: CreditCard, title: "Driver's License", description: "National driver's license" },
              { icon: IdCard, title: "National ID Card", description: "Official government ID card" },
              { icon: Award, title: "Citizenship Certificate", description: "Official citizenship documentation" }
            ].map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="text-center hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section id="programs" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Available Citizenship Programs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from 32 countries - US, UK & Canada at USD 50,000, all others at USD 37,000
            </p>
          </div>

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
                      placeholder="Search countries..."
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

                {/* Program Type Filter */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Program Type</h3>
                  <div className="space-y-3">
                    {types.map((type) => (
                      <div key={type.id} className="flex items-center gap-2">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={() => toggleType(type.id)}
                        />
                        <Label
                          htmlFor={type.id}
                          className="text-sm cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedRegions.length > 0 || selectedTypes.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRegions([]);
                      setSelectedTypes([]);
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
                  {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
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

              {/* Programs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPrograms.map((program, index) => (
                  <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    {/* Country Header with Gradient */}
                    <div className={`relative h-32 bg-gradient-to-br ${program.gradient} flex items-center justify-center`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10 text-center">
                        <div className="text-6xl mb-2 drop-shadow-lg">{program.flag}</div>
                        <Shield className="h-8 w-8 text-white/80 mx-auto" />
                      </div>
                      <Badge variant="secondary" className="absolute top-3 right-3">
                        <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                        Premium
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors text-center">
                        {program.country}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {program.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">Minimum Investment</p>
                          <p className="text-lg font-bold text-primary">{program.minInvestment}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Key Benefits:</p>
                          {program.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 group/btn" 
                            onClick={() => navigate(`/apply?type=citizenship&country=${program.country}`)}
                          >
                            Apply Now
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(`/citizenship/${program.country.toLowerCase().replace(/ /g, '-')}`)}
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple Application Process
            </h2>
            <p className="text-muted-foreground text-lg">
              Your journey to global citizenship in four straightforward steps
            </p>
          </div>

          <div className="space-y-6">
            {[
              { step: "01", title: "Initial Consultation", description: "Discuss your goals and explore the best program options for your needs" },
              { step: "02", title: "Document Preparation", description: "Gather required documents with guidance from our expert team" },
              { step: "03", title: "Application Submission", description: "Submit your complete application with all supporting documentation" },
              { step: "04", title: "Approval & Residence", description: "Receive approval and begin your new life in your chosen destination" }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="flex gap-6 p-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <Plane className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Expand Your Global Horizons?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our expert team is ready to guide you through the residence by investment process. 
            Start your application today and unlock a world of opportunities.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/apply")}>
              Start Application
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#programs">View All Programs</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <SecurityFeaturesSection />
    </div>
  );
};

export default Citizenship;
