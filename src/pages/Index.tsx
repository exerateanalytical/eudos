import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, CheckCircle, Printer, Building2, Award, Sparkles, CreditCard, GraduationCap, Fingerprint, Cpu, Eye, Radio, Lock, Scan, FileCheck, Database, BookOpen, ShoppingBag } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { SEO } from "@/components/SEO";
import { seoConfig } from "@/config/seo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemedHero } from "@/components/themes/ThemedHero";
import { ThemedServices } from "@/components/themes/ThemedServices";
import { ThemedFeatures } from "@/components/themes/ThemedFeatures";

// Lazy load heavy components for better mobile performance
const SecurityFeaturesSection = lazy(() => import("@/components/SecurityFeaturesSection").then(module => ({ default: module.SecurityFeaturesSection })));

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Fetch active theme
  const { data: activeTheme } = useQuery({
    queryKey: ['active-theme'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_themes')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error || !data) {
        // Return default Modern Blue theme
        return {
          id: 'default',
          name: 'Modern Blue',
          slug: 'modern-blue',
          description: 'Clean and professional design with blue accents',
          thumbnail: null,
          is_active: true,
          primary_color: 'hsl(217, 91%, 60%)',
          secondary_color: 'hsl(188, 94%, 43%)',
          accent_color: 'hsl(250, 82%, 60%)',
          background_gradient: 'from-blue-50/50 via-cyan-50/30 to-purple-50/50',
          font_family: 'Inter',
          layout_style: 'modern',
          config: { heroStyle: 'gradient', cardStyle: 'elevated' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return data;
    },
  });

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

  if (!activeTheme) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading theme...</div>
    </div>;
  }

  return (
    <div 
      className="bg-background overflow-x-hidden pb-20 md:pb-0"
      style={{
        '--theme-primary': activeTheme.primary_color,
        '--theme-secondary': activeTheme.secondary_color,
        '--theme-accent': activeTheme.accent_color,
      } as React.CSSProperties}
    >
      <SEO 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        canonicalUrl={baseUrl}
      />

      {/* Themed Hero Section */}
      <ThemedHero theme={activeTheme} />

      {/* Themed Services Section */}
      <ThemedServices theme={activeTheme} />

      {/* Themed Features Section */}
      <ThemedFeatures theme={activeTheme} />

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

      {/* Additional Content Section */}
      <section className="py-16 md:py-20 lg:py-28 px-4 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="container mx-auto relative z-10">

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
