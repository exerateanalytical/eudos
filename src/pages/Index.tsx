import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, CheckCircle, Printer, Building2, Award, Sparkles, CreditCard, GraduationCap, Fingerprint, Cpu, Eye, Radio, Lock, Scan, FileCheck, Database, BookOpen, ShoppingBag, ArrowRight, Phone, Mail, MapPin, HelpCircle } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { SEO } from "@/components/SEO";
import { seoConfig } from "@/config/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Lazy load heavy components for better mobile performance
const SecurityFeaturesSection = lazy(() => import("@/components/SecurityFeaturesSection").then(module => ({ default: module.SecurityFeaturesSection })));

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const baseUrl = window.location.origin;

  useEffect(() => {
    // Defer visibility animation for better initial load
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-rotate security features (only on desktop for performance)
    const interval = window.innerWidth >= 768 ? setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % securityShowcase.length);
    }, 4000) : null;

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const securityShowcase = [
    {
      icon: Fingerprint,
      title: "Biometric Data",
      description: "Fingerprint and facial recognition integration with 256-bit encryption on embedded chips",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
    {
      icon: Cpu,
      title: "RFID/NFC Chips",
      description: "Embedded contactless smart chips with encrypted data storage for secure authentication",
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
    },
    {
      icon: Sparkles,
      title: "Multi-Layer Holograms",
      description: "3D holographic security overlays with rainbow iridescent effects and micro-patterns",
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
    },
    {
      icon: Eye,
      title: "UV Security Features",
      description: "Invisible UV ink patterns and elements only visible under ultraviolet light",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    },
    {
      icon: Scan,
      title: "Microtext Printing",
      description: "Microscopic text printing impossible to replicate with standard equipment",
      gradient: "from-orange-500 via-red-500 to-pink-500",
    },
    {
      icon: Radio,
      title: "Laser Engraving",
      description: "Permanent laser-etched personalization that cannot be altered or removed",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      icon: Lock,
      title: "Tamper-Proof Design",
      description: "Self-destructing security features that activate if document alteration is attempted",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
    },
    {
      icon: Database,
      title: "Database Registration",
      description: "Real-time verification through secure government databases for instant authentication",
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    },
  ];

  const services = [
    {
      icon: BookOpen,
      title: "Registered Passports",
      description: "Fully registered biometric passports with embedded chips, holograms, UV features, and machine-readable zones",
      color: "from-blue-500 to-cyan-500",
      link: "/passports"
    },
    {
      icon: CreditCard,
      title: "Driver's Licenses",
      description: "Secure driver's licenses with biometric data, microtext, ghost images, and laser engraving",
      color: "from-purple-500 to-pink-500",
      link: "/drivers-license"
    },
    {
      icon: Shield,
      title: "National ID Cards",
      description: "Government-issued ID cards with RFID chips, holographic overlays, and advanced security printing",
      color: "from-green-500 to-emerald-500",
      link: "/citizenship"
    },
    {
      icon: GraduationCap,
      title: "Official Diplomas",
      description: "Authenticated educational certificates with watermarks, security threads, and tamper-proof features",
      color: "from-orange-500 to-red-500",
      link: "/diplomas"
    },
    {
      icon: Award,
      title: "Professional Certifications",
      description: "Verified professional certificates and credentials with anti-forgery security elements",
      color: "from-indigo-500 to-violet-500",
      link: "/certifications"
    },
    {
      icon: FileText,
      title: "Official Documents",
      description: "Wide range of government-authorized documents with advanced security features",
      color: "from-teal-500 to-cyan-500",
      link: "/products"
    }
  ];

  const securityFeatures = [
    { icon: Fingerprint, title: "Biometric Data", description: "Fingerprint and facial recognition integration" },
    { icon: Cpu, title: "Embedded Chips", description: "RFID/NFC contactless smart chips with encrypted data" },
    { icon: Sparkles, title: "Holograms", description: "Multi-layer holographic security overlays" },
    { icon: Eye, title: "UV Features", description: "Invisible UV ink patterns visible under black light" },
    { icon: Scan, title: "Microtext", description: "Microscopic text printing impossible to replicate" },
    { icon: Radio, title: "Laser Engraving", description: "Permanent laser-etched personalization" },
    { icon: FileCheck, title: "Watermarks", description: "Multi-tone watermarks with security threads" },
    { icon: Lock, title: "Tamper-Proof", description: "Self-destructing security features if altered" },
    { icon: Database, title: "Database Registration", description: "Real-time verification through secure government databases" }
  ];

  const features = [
    { icon: Shield, text: "ISO 9001 Certified" },
    { icon: Clock, text: "24-48 Hour Turnaround" },
    { icon: CheckCircle, text: "Quality Guaranteed" },
    { icon: Award, text: "Secure Handling" }
  ];

  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "500+", label: "Clients Served" },
    { value: "1M+", label: "Documents Printed" },
    { value: "99.9%", label: "Quality Rate" }
  ];

  return (
    <div className="bg-background overflow-x-hidden pb-20 md:pb-0">
      <SEO 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        canonicalUrl={baseUrl}
      />
      {/* Hero Section - Mobile First */}
      <section className="relative py-12 md:py-16 lg:py-20 px-4 md:px-6 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        {/* Floating elements - hidden on mobile for performance */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
            {/* Left side - Text content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6 animate-fade-in">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium text-primary">Licensed & Authorized • Gov Agencies Only</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 md:mb-6 lg:mb-8 leading-[1.1] animate-fade-in-up">
                Buy Passports, Driver's Licenses, Diplomas, Certificates, Citizenship
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 lg:mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Licensed facility serving government agencies worldwide with registered passports, ID cards, driver's licenses, and diplomas featuring military-grade security
              </p>
              
              <div className="flex gap-3 md:gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg h-12 md:h-14 px-6 md:px-8 active:scale-95 touch-manipulation"
                  onClick={() => navigate("/apply")}
                >
                  <span className="relative z-10">Apply Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 transition-all duration-300 text-base md:text-lg h-12 md:h-14 px-6 md:px-8 active:scale-95 touch-manipulation hidden sm:inline-flex" onClick={() => navigate("/products")}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Button>
              </div>
            </div>

            {/* Right side - Security features showcase - Mobile Optimized */}
            <div className="relative h-[340px] sm:h-[380px] md:h-[420px] lg:h-[460px] mt-8 lg:mt-0">
              {securityShowcase.map((feature, index) => {
                if (currentFeature !== index) return null;
                const Icon = feature.icon;
                return (
                  <Card key={index} className="h-full border-2 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                    <CardContent className="h-full flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 relative">
                      {/* Icon with animated glow */}
                      <div className="relative mb-6 sm:mb-8">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-40 hidden md:block md:animate-pulse`} />
                        <div className={`relative p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-2xl`}>
                          <Icon className="h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 text-white" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Feature title */}
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>

                      {/* Feature description */}
                      <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-md mb-6 sm:mb-8 px-2 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Security badge - Unique per feature */}
                      <div className={`inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg text-sm sm:text-base active:scale-95 transition-transform touch-manipulation`}>
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>
                          {index === 0 && "Certified Biometric"}
                          {index === 1 && "Encrypted Technology"}
                          {index === 2 && "Anti-Counterfeit"}
                          {index === 3 && "Invisible Protection"}
                          {index === 4 && "Microscopic Defense"}
                          {index === 5 && "Permanent Security"}
                          {index === 6 && "Self-Protecting"}
                          {index === 7 && "Verified Authentic"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Progress indicators - Mobile optimized */}
              <div className="absolute -bottom-10 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 sm:gap-3 touch-manipulation">
                {securityShowcase.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 active:scale-95 ${
                      currentFeature === index 
                        ? 'w-10 sm:w-12 bg-primary shadow-lg' 
                        : 'w-2.5 sm:w-3 bg-primary/30 hover:bg-primary/50'
                    }`}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <section className="py-12 md:py-16 lg:py-20 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in p-4 md:p-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-3">{stat.value}</div>
                <div className="text-primary-foreground/90 font-medium text-sm sm:text-base md:text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar - Mobile Optimized */}
      <section className="py-8 md:py-10 border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2.5 md:gap-3 justify-center group animate-slide-in-right active:scale-95 transition-transform touch-manipulation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-2 md:p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="font-medium text-foreground text-sm sm:text-base md:text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Optimized */}
      <section id="services" className="py-16 md:py-20 lg:py-28 px-4 bg-background relative">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-14 lg:mb-18">
            <div className="inline-flex items-center gap-2 md:gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-sm md:text-base font-medium text-primary">Government Agencies & Organizations Only</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 px-4 leading-tight">Government Document Services</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              Fully registered and verifiable documents with military-grade security features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/50 bg-card hover:-translate-y-1 md:hover:-translate-y-2 animate-fade-in active:scale-95 touch-manipulation cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(service.link)}
              >
                <CardHeader className="pb-4 p-6 md:p-6">
                  <div className={`w-14 h-14 md:w-18 md:h-18 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl md:rounded-2xl bg-card flex items-center justify-center">
                      <service.icon className="h-7 w-7 md:h-9 md:w-9 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300 text-xl md:text-2xl">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-6 pt-0">
                  <CardDescription className="text-base md:text-lg leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section - Mobile Optimized */}
      <section className="py-16 md:py-20 lg:py-28 px-4 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14 lg:mb-18">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 px-4 leading-tight">Advanced Security Features</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              What sets our documents apart from other printing laboratories - every document includes multiple layers of protection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {securityFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card animate-scale-in active:scale-95 touch-manipulation"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration & Verification - Mobile Optimized */}
          <div className="mt-12 md:mt-16 max-w-4xl mx-auto px-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Database className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">Registration & Verification System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                  Every document we produce is registered in secure government databases with real-time verification capabilities. Our authentication system allows instant validation through multiple channels including:
                </p>
                <ul className="space-y-2 md:space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Centralized database registration with unique serial numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">RFID/NFC chip verification through authorized readers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Machine-readable zones compatible with international standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Secure API access for government verification systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section - Mobile Optimized */}
      <section id="about" className="py-12 md:py-16 lg:py-24 px-4 bg-background relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">Why We're Different</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">Licensed, authorized, and uncompromising on security</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                title: "Licensed & Authorized",
                description: "Officially licensed by government authorities to produce registered documents. We hold all necessary certifications and operate under strict regulatory oversight",
                icon: Award
              },
              {
                title: "Military-Grade Security",
                description: "Security features exceed international standards - combining physical, digital, and biometric layers that are virtually impossible to replicate or forge",
                icon: Shield
              },
              {
                title: "Database Integration",
                description: "Direct integration with government verification systems ensures every document is traceable, verifiable, and can be authenticated in real-time globally",
                icon: Database
              },
              {
                title: "Government-Only Service",
                description: "We exclusively serve government agencies and authorized organizations. Strict vetting processes and secure facilities ensure confidentiality and compliance",
                icon: Building2
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card animate-slide-in-left active:scale-95 touch-manipulation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-2">
                    <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section - Lazy loaded */}
      <Suspense fallback={
        <div className="py-16 flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      }>
        <SecurityFeaturesSection />
      </Suspense>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 lg:py-28 px-4 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-14 lg:mb-18">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 px-4 leading-tight">How It Works</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Simple, secure process from application to delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" style={{ top: '4rem' }} />
            
            {[
              {
                step: "1",
                title: "Submit Application",
                description: "Complete our secure online application form with required documentation",
                icon: FileText,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "Verification",
                description: "Our team verifies your credentials and authorizes your request",
                icon: Shield,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Production",
                description: "Documents are produced with military-grade security features",
                icon: Printer,
                color: "from-orange-500 to-red-500"
              },
              {
                step: "4",
                title: "Delivery",
                description: "Secure delivery with tracking to your verified address",
                icon: CheckCircle,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <Card 
                key={index}
                className="relative group hover:shadow-xl transition-all duration-300 border-border/50 bg-card hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${item.color} p-0.5 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-20">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 md:py-16 px-4 bg-background border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Trusted By Government Agencies Worldwide</h2>
            <p className="text-base md:text-lg text-muted-foreground">Certified and compliant with international standards</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "ISO 9001", subtitle: "Quality Management" },
              { label: "ISO 27001", subtitle: "Security Certified" },
              { label: "ICAO", subtitle: "Compliant" },
              { label: "Government", subtitle: "Authorized" }
            ].map((cert, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Award className="h-10 w-10 md:h-12 md:w-12 text-primary mb-3" />
                <div className="text-center">
                  <div className="font-bold text-lg text-foreground">{cert.label}</div>
                  <div className="text-sm text-muted-foreground">{cert.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-28 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Common Questions</h2>
            <p className="text-base md:text-lg text-muted-foreground">Everything you need to know about our services</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "Who can use your services?",
                answer: "Our services are exclusively available to government agencies, authorized organizations, and licensed entities. We require proper credentials and authorization before processing any requests."
              },
              {
                question: "How long does the production process take?",
                answer: "Standard production time is 24-48 hours after verification. Expedited services are available for urgent requests. Delivery time depends on your location and chosen shipping method."
              },
              {
                question: "What security features are included?",
                answer: "Every document includes multiple layers of security: biometric data, RFID/NFC chips, holograms, UV features, microtext, laser engraving, watermarks, and database registration. All features meet or exceed international standards."
              },
              {
                question: "Are documents registered in government databases?",
                answer: "Yes, all documents are registered in secure government databases with unique serial numbers. This enables real-time verification and authentication through multiple channels."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept various payment methods including bank transfers, cryptocurrency, and authorized government payment systems. All transactions are encrypted and secure."
              },
              {
                question: "How do I verify a document's authenticity?",
                answer: "Documents can be verified through RFID/NFC chip reading, database lookup using the serial number, UV light examination, and machine-readable zone scanning. We provide verification tools to authorized agencies."
              }
            ].map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 lg:py-28 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">Get In Touch</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                For authorized agencies and organizations. Contact our team for inquiries, support, or to begin the application process.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    title: "Phone Support",
                    content: "+1 (555) 123-4567",
                    subtitle: "Mon-Fri, 9AM-6PM EST"
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    content: "info@eudocs.com",
                    subtitle: "24-hour response time"
                  },
                  {
                    icon: MapPin,
                    title: "Secure Facility",
                    content: "Licensed Production Center",
                    subtitle: "Location disclosed to authorized clients"
                  }
                ].map((contact, index) => (
                  <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <contact.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{contact.title}</h3>
                          <p className="text-foreground font-medium">{contact.content}</p>
                          <p className="text-sm text-muted-foreground mt-1">{contact.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
              <CardContent className="p-8 md:p-10">
                <div className="mb-6">
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to Get Started?</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Begin your secure application process today. Our team will verify your credentials and guide you through each step.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full group bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-base h-14"
                    onClick={() => navigate("/apply")}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Start Application
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-2 hover:bg-primary/5 transition-all duration-300 text-base h-14"
                    onClick={() => navigate("/contact")}
                  >
                    Contact Our Team
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground text-center">
                    Authorized government agencies & organizations only
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-12 md:py-16 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Military-Grade Security You Can Trust</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of government agencies worldwide who trust us for their secure document needs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 shadow-lg h-14 px-8 text-base"
              onClick={() => navigate("/apply")}
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8 text-base"
              onClick={() => navigate("/products")}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Action Bar */}
      <MobileBottomBar />

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>
    </div>
  );
};

export default Index;
