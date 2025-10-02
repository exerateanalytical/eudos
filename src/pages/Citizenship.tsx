import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Users, TrendingUp, Home, GraduationCap, Building2, Plane, Shield, Award, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

// Import country images
import australiaImg from "@/assets/countries/australia.jpg";
import austriaImg from "@/assets/countries/austria.jpg";
import canadaImg from "@/assets/countries/canada.jpg";
import greeceImg from "@/assets/countries/greece.jpg";
import portugalImg from "@/assets/countries/portugal.jpg";
import spainImg from "@/assets/countries/spain.jpg";
import maltaImg from "@/assets/countries/malta.jpg";
import monacoImg from "@/assets/countries/monaco.jpg";
import uaeImg from "@/assets/countries/uae.jpg";
import singaporeImg from "@/assets/countries/singapore.jpg";
import switzerlandImg from "@/assets/countries/switzerland.jpg";
import italyImg from "@/assets/countries/italy.jpg";
import ukImg from "@/assets/countries/uk.jpg";
import newZealandImg from "@/assets/countries/new-zealand.jpg";
import latviaImg from "@/assets/countries/latvia.jpg";
import cyprusImg from "@/assets/countries/cyprus.jpg";
import irelandImg from "@/assets/countries/ireland.jpg";
import thailandImg from "@/assets/countries/thailand.jpg";
import netherlandsImg from "@/assets/countries/netherlands.jpg";
import turkeyImg from "@/assets/countries/turkey.jpg";
import brazilImg from "@/assets/countries/brazil.jpg";
import luxembourgImg from "@/assets/countries/luxembourg.jpg";
import czechImg from "@/assets/countries/czech.jpg";
import hungaryImg from "@/assets/countries/hungary.jpg";
import bulgariaImg from "@/assets/countries/bulgaria.jpg";
import romaniaImg from "@/assets/countries/romania.jpg";
import montenegroImg from "@/assets/countries/montenegro.jpg";
import panamaImg from "@/assets/countries/panama.jpg";
import costaRicaImg from "@/assets/countries/costa-rica.jpg";
import uruguayImg from "@/assets/countries/uruguay.jpg";
import colombiaImg from "@/assets/countries/colombia.jpg";
import argentinaImg from "@/assets/countries/argentina.jpg";

const Citizenship = () => {
  const navigate = useNavigate();

  const residencePrograms = [
    {
      country: "Australia",
      flag: "🇦🇺",
      image: australiaImg,
      description: "Streamlined pathway to permanent residence for highly skilled individuals and global business innovators.",
      minInvestment: "Varies by pathway",
      benefits: ["Permanent residence", "Business innovation hub", "High quality of life"],
      gradient: "from-yellow-500 to-red-500"
    },
    {
      country: "Austria",
      flag: "🇦🇹",
      image: austriaImg,
      description: "EU residence with visa-free access to Schengen Area for select German-speaking applicants.",
      minInvestment: "EUR 3M+",
      benefits: ["EU residence", "Schengen access", "Central European location"],
      gradient: "from-red-500 to-red-600"
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      image: canadaImg,
      description: "Two residence programs for investors and entrepreneurs seeking access to this thriving North American market.",
      minInvestment: "CAD 1M+",
      benefits: ["Thriving economy", "Quality education", "Healthcare system"],
      gradient: "from-red-500 via-white to-red-500"
    },
    {
      country: "Greece",
      flag: "🇬🇷",
      image: greeceImg,
      description: "Golden Visa Program with minimum specialized real estate investment granting residence permit.",
      minInvestment: "EUR 250,000",
      benefits: ["Real estate investment", "Schengen access", "Mediterranean lifestyle"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      country: "Portugal",
      flag: "🇵🇹",
      image: portugalImg,
      description: "Golden Residence Permit Program offering pathway to EU residence through investment.",
      minInvestment: "EUR 280,000",
      benefits: ["EU residence", "Schengen mobility", "Path to citizenship"],
      gradient: "from-green-600 to-red-600"
    },
    {
      country: "Spain",
      flag: "🇪🇸",
      image: spainImg,
      description: "Golden Visa program with real estate investment options and Schengen Area access.",
      minInvestment: "EUR 500,000",
      benefits: ["Mediterranean climate", "EU access", "Quality lifestyle"],
      gradient: "from-red-600 via-yellow-400 to-red-600"
    },
    {
      country: "Malta",
      flag: "🇲🇹",
      image: maltaImg,
      description: "Permanent Residence Programme with freedom of travel within Schengen Area and EU security.",
      minInvestment: "EUR 100,000",
      benefits: ["EU membership", "English-speaking", "Tax advantages"],
      gradient: "from-white via-red-600 to-white"
    },
    {
      country: "Monaco",
      flag: "🇲🇨",
      image: monacoImg,
      description: "Premium European residence offering unrivalled standard of living for high-net-worth individuals.",
      minInvestment: "EUR 1M+ deposit",
      benefits: ["No income tax", "Premium lifestyle", "Mediterranean location"],
      gradient: "from-red-600 to-white"
    },
    {
      country: "United Arab Emirates",
      flag: "🇦🇪",
      image: uaeImg,
      description: "Golden Visa providing long-term residence for investors, entrepreneurs, and talented professionals.",
      minInvestment: "AED 2M",
      benefits: ["Tax-free income", "Strategic location", "Business hub"],
      gradient: "from-green-600 via-white to-black"
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      image: singaporeImg,
      description: "Global business hub with investor programs for high-net-worth individuals and entrepreneurs.",
      minInvestment: "SGD 2.5M",
      benefits: ["Financial hub", "Low taxes", "Strategic Asian gateway"],
      gradient: "from-red-600 to-white"
    },
    {
      country: "Switzerland",
      flag: "🇨🇭",
      image: switzerlandImg,
      description: "Lump sum taxation program for wealthy foreign nationals seeking Swiss residence.",
      minInvestment: "CHF 250,000/year",
      benefits: ["Political stability", "Quality of life", "Central Europe"],
      gradient: "from-red-600 via-white to-red-600"
    },
    {
      country: "Italy",
      flag: "🇮🇹",
      image: italyImg,
      description: "Two residence options for investors with visa-free travel across Schengen Area. No permanent stay required.",
      minInvestment: "EUR 250,000",
      benefits: ["Cultural heritage", "Schengen access", "Investment options"],
      gradient: "from-green-600 via-white to-red-600"
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      image: ukImg,
      description: "Innovator Founder Visa for experienced businesspeople with innovative business ideas seeking UK residence.",
      minInvestment: "GBP 50,000",
      benefits: ["Global business hub", "World-class education", "Path to settlement"],
      gradient: "from-blue-700 via-white to-red-600"
    },
    {
      country: "New Zealand",
      flag: "🇳🇿",
      image: newZealandImg,
      description: "Investor visa programs for high-net-worth individuals seeking residence in this Pacific nation.",
      minInvestment: "NZD 5M",
      benefits: ["Natural beauty", "Quality lifestyle", "Business opportunities"],
      gradient: "from-blue-900 to-blue-700"
    },
    {
      country: "Latvia",
      flag: "🇱🇻",
      image: latviaImg,
      description: "EU residence through real estate or business investment with access to Schengen Area.",
      minInvestment: "EUR 250,000",
      benefits: ["EU residence", "Affordable program", "Schengen mobility"],
      gradient: "from-red-700 via-white to-red-700"
    },
    {
      country: "Cyprus",
      flag: "🇨🇾",
      image: cyprusImg,
      description: "Permanent residence program through real estate investment with fast-track processing.",
      minInvestment: "EUR 300,000",
      benefits: ["EU member state", "Mediterranean lifestyle", "Fast processing"],
      gradient: "from-orange-500 to-green-700"
    },
    {
      country: "Ireland",
      flag: "🇮🇪",
      image: irelandImg,
      description: "Immigrant Investor Programme offering residence through investment in Irish enterprises or funds.",
      minInvestment: "EUR 1M",
      benefits: ["English-speaking", "EU access", "Thriving economy"],
      gradient: "from-green-700 via-white to-orange-600"
    },
    {
      country: "Thailand",
      flag: "🇹🇭",
      image: thailandImg,
      description: "Elite Residence Program and investment visas for those seeking long-term residence in Southeast Asia.",
      minInvestment: "THB 600,000",
      benefits: ["Tropical lifestyle", "Low cost of living", "Strategic location"],
      gradient: "from-red-600 via-white to-blue-800"
    },
    {
      country: "Netherlands",
      flag: "🇳🇱",
      image: netherlandsImg,
      description: "Self-employed residence permit for entrepreneurs and investors establishing business operations.",
      minInvestment: "EUR 4,500",
      benefits: ["EU gateway", "Business-friendly", "High quality of life"],
      gradient: "from-red-600 via-white to-blue-700"
    },
    {
      country: "Turkey",
      flag: "🇹🇷",
      image: turkeyImg,
      description: "Citizenship by investment through real estate or capital investment with fast processing times.",
      minInvestment: "USD 400,000",
      benefits: ["Dual citizenship allowed", "Strategic location", "Affordable option"],
      gradient: "from-red-700 to-red-600"
    },
    {
      country: "Brazil",
      flag: "🇧🇷",
      image: brazilImg,
      description: "Investor visa for foreign nationals making significant investments in Brazilian companies.",
      minInvestment: "BRL 500,000",
      benefits: ["Large market access", "Natural resources", "Growing economy"],
      gradient: "from-green-600 via-yellow-400 to-blue-700"
    },
    {
      country: "Luxembourg",
      flag: "🇱🇺",
      image: luxembourgImg,
      description: "Residence permit for investors and entrepreneurs in one of Europe's wealthiest nations.",
      minInvestment: "EUR 500,000",
      benefits: ["EU financial center", "High income levels", "Central location"],
      gradient: "from-red-600 via-white to-blue-600"
    },
    {
      country: "Czech Republic",
      flag: "🇨🇿",
      image: czechImg,
      description: "Business residence permit for investors establishing or investing in Czech businesses.",
      minInvestment: "CZK 2.5M",
      benefits: ["Central Europe", "EU membership", "Affordable living"],
      gradient: "from-white via-blue-600 to-red-600"
    },
    {
      country: "Hungary",
      flag: "🇭🇺",
      image: hungaryImg,
      description: "Residence bond program offering Hungarian residence through government bond investment.",
      minInvestment: "EUR 300,000",
      benefits: ["EU access", "Low cost of living", "Cultural heritage"],
      gradient: "from-red-600 via-white to-green-700"
    },
    {
      country: "Bulgaria",
      flag: "🇧🇬",
      image: bulgariaImg,
      description: "Fast-track citizenship program through investment with EU passport benefits.",
      minInvestment: "EUR 512,000",
      benefits: ["EU citizenship path", "Low taxes", "Affordable"],
      gradient: "from-white via-green-700 to-red-600"
    },
    {
      country: "Romania",
      flag: "🇷🇴",
      image: romaniaImg,
      description: "Business investor residence permit for establishing companies or making business investments.",
      minInvestment: "EUR 100,000",
      benefits: ["EU member", "Growing economy", "Low investment threshold"],
      gradient: "from-blue-700 via-yellow-400 to-red-600"
    },
    {
      country: "Montenegro",
      flag: "🇲🇪",
      image: montenegroImg,
      description: "Citizenship by investment program with investment in government-approved projects.",
      minInvestment: "EUR 250,000",
      benefits: ["Adriatic location", "EU candidate", "Tax benefits"],
      gradient: "from-red-700 via-yellow-400 to-red-700"
    },
    {
      country: "Panama",
      flag: "🇵🇦",
      image: panamaImg,
      description: "Friendly Nations Visa and investment residence programs for qualifying nationalities.",
      minInvestment: "USD 200,000",
      benefits: ["Tax advantages", "Strategic location", "USD economy"],
      gradient: "from-blue-600 via-white to-red-600"
    },
    {
      country: "Costa Rica",
      flag: "🇨🇷",
      image: costaRicaImg,
      description: "Investor residence program through investment in Costa Rican real estate or businesses.",
      minInvestment: "USD 200,000",
      benefits: ["Natural beauty", "Stable democracy", "Quality healthcare"],
      gradient: "from-blue-600 via-white to-red-600"
    },
    {
      country: "Uruguay",
      flag: "🇺🇾",
      image: uruguayImg,
      description: "Residence permit for investors in Uruguayan real estate or business ventures.",
      minInvestment: "USD 1.7M",
      benefits: ["Political stability", "High quality of life", "Business-friendly"],
      gradient: "from-blue-700 via-white to-blue-700"
    },
    {
      country: "Colombia",
      flag: "🇨🇴",
      image: colombiaImg,
      description: "Investor visa for those making substantial investments in Colombian businesses or real estate.",
      minInvestment: "COP 350M",
      benefits: ["Growing market", "Strategic location", "Cultural richness"],
      gradient: "from-yellow-400 via-blue-700 to-red-600"
    },
    {
      country: "Argentina",
      flag: "🇦🇷",
      image: argentinaImg,
      description: "Residence permit for investors making capital investments in Argentine enterprises.",
      minInvestment: "ARS 1.5M",
      benefits: ["Large economy", "Cultural capital", "Natural resources"],
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileNav />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-2 text-sm">
              <Globe className="h-4 w-4 mr-2" />
              Global Citizenship & Residence Solutions
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Residence by Investment
              <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mt-2">
                Programs Worldwide
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Secure your global future with residence and citizenship by investment programs. 
              Access top-tier countries offering enhanced mobility, business opportunities, and quality of life for you and your family.
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
              Why Choose Residence by Investment?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your life with strategic residence and citizenship opportunities
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
              Investment Options
            </h2>
            <p className="text-muted-foreground text-lg">
              Multiple pathways to secure your residence and citizenship
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentTypes.map((type, index) => {
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

      {/* Programs Grid */}
      <section id="programs" className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Residence Programs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated selection of the world's most prestigious residence by investment programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residencePrograms.map((program, index) => (
              <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Country Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={`${program.country} landmark`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="text-4xl drop-shadow-lg">{program.flag}</div>
                    <div>
                      <CardTitle className="text-white text-2xl drop-shadow-lg">
                        {program.country}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="absolute top-3 right-3">
                    <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                    Premium
                  </Badge>
                </div>

                <CardHeader>
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

                    <Button 
                      className="w-full group/btn" 
                      variant="outline"
                      onClick={() => navigate("/apply")}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      <Footer />
    </div>
  );
};

export default Citizenship;
