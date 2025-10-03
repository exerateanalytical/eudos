import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Shield, Clock, CheckCircle, Printer, Building2, Award, Users, Sparkles, CreditCard, GraduationCap, Fingerprint, Cpu, Eye, Radio, Lock, Scan, FileCheck, Database, BookOpen, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { SecurityFeaturesSection } from "@/components/SecurityFeaturesSection";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  position: z.string().min(2, "Position is required").max(100),
  agency: z.string().min(2, "Agency is required").max(200),
  department: z.string().min(2, "Department is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  documentType: z.string().min(1, "Please select a document type"),
  quantity: z.string().min(1, "Quantity is required").max(50),
  urgency: z.string().min(1, "Please select urgency level"),
  specifications: z.string().min(10, "Please provide detailed specifications").max(2000),
});

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    agency: "",
    department: "",
    email: "",
    phone: "",
    documentType: "",
    quantity: "",
    urgency: "",
    specifications: ""
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate security features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % securityShowcase.length);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      contactFormSchema.parse(formData);

      // Save to database
      const { error } = await supabase.from("contact_inquiries").insert({
        name: formData.name,
        position: formData.position,
        agency: formData.agency,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        document_type: formData.documentType,
        quantity: formData.quantity,
        urgency: formData.urgency,
        specifications: formData.specifications,
      });

      if (error) throw error;

      toast({
        title: "Inquiry Submitted Successfully",
        description: "Our government liaison team will contact you within 24 hours with a secure communication channel.",
      });
      
      // Reset form
      setFormData({ 
        name: "", 
        position: "", 
        agency: "", 
        department: "", 
        email: "", 
        phone: "", 
        documentType: "",
        quantity: "",
        urgency: "",
        specifications: ""
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit inquiry. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

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
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section - Mobile First */}
      <section className="relative py-8 md:py-12 lg:py-16 px-4 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        {/* Floating elements - hidden on mobile for performance */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6 animate-fade-in">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary">Licensed & Authorized • Government Agencies Only</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 md:mb-4 lg:mb-6 leading-tight animate-fade-in-up">
                Official Government Document
                <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mt-1 md:mt-2">
                  Printing Services
                </span>
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 md:mb-6 lg:mb-8 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Licensed facility serving government agencies worldwide with registered passports, ID cards, driver's licenses, and diplomas featuring military-grade security
              </p>
              
              <div className="flex gap-2 md:gap-3 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="default" 
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm md:text-base active:scale-95 touch-manipulation"
                  onClick={() => navigate("/apply")}
                >
                  <span className="relative z-10">Apply Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                <Button size="default" variant="outline" className="border-2 hover:bg-primary/5 transition-all duration-300 text-xs sm:text-sm md:text-base active:scale-95 touch-manipulation" asChild>
                  <a href="#contact">Get Quote</a>
                </Button>
                <Button size="default" variant="outline" className="border-2 hover:bg-primary/5 transition-all duration-300 text-xs sm:text-sm md:text-base active:scale-95 touch-manipulation hidden sm:inline-flex" onClick={() => navigate("/shop")}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop
                </Button>
              </div>
            </div>

            {/* Right side - Security features showcase - Mobile Optimized */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] mt-6 lg:mt-0">
              {securityShowcase.map((feature, index) => {
                if (currentFeature !== index) return null;
                const Icon = feature.icon;
                return (
                  <Card key={index} className="h-full border-2 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                    <CardContent className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
                      {/* Icon with animated glow */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-40 animate-pulse`} />
                        <div className={`relative p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-2xl`}>
                          <Icon className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-white" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Feature title */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>

                      {/* Feature description */}
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-center max-w-md mb-4 sm:mb-6 px-2 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Security badge */}
                      <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg text-xs sm:text-sm active:scale-95 transition-transform`}>
                        <Shield className="h-4 w-4" />
                        <span>Military-Grade Security</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Progress indicators - Mobile optimized */}
              <div className="absolute -bottom-8 sm:-bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 touch-manipulation">
                {securityShowcase.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-2 rounded-full transition-all duration-300 active:scale-95 ${
                      currentFeature === index 
                        ? 'w-8 sm:w-10 bg-primary shadow-lg' 
                        : 'w-2 bg-primary/30 hover:bg-primary/50'
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
      <section className="py-10 md:py-12 lg:py-16 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in p-4 md:p-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 font-medium text-xs sm:text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar - Mobile Optimized */}
      <section className="py-6 md:py-8 border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 md:gap-3 justify-center group animate-slide-in-right active:scale-95 transition-transform touch-manipulation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                  <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground text-xs sm:text-sm md:text-base">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Optimized */}
      <section id="services" className="py-12 md:py-16 lg:py-24 px-4 bg-background relative">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
              <Building2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary">Government Agencies & Organizations Only</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4">Government Document Services</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Fully registered and verifiable documents with military-grade security features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/50 bg-card hover:-translate-y-1 md:hover:-translate-y-2 animate-fade-in active:scale-95 touch-manipulation cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(service.link)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl md:rounded-2xl bg-card flex items-center justify-center">
                      <service.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300 text-lg md:text-xl">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section - Mobile Optimized */}
      <section className="py-12 md:py-16 lg:py-24 px-4 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4">Advanced Security Features</h2>
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

          {/* Registration & Verification */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Registration & Verification System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every document we produce is registered in secure government databases with real-time verification capabilities. Our authentication system allows instant validation through multiple channels including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Centralized database registration with unique serial numbers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>RFID/NFC chip verification through authorized readers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Machine-readable zones compatible with international standards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Secure API access for government verification systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why We're Different</h2>
            <p className="text-xl text-muted-foreground">Licensed, authorized, and uncompromising on security</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
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
                className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <SecurityFeaturesSection />

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Secure Government Inquiry</span>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Licensed government agencies and authorized organizations only. All inquiries are handled with strict confidentiality.
            </p>
          </div>
          
          <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Person Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Contact Person Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                    <Input
                      placeholder="Official Position/Title *"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="email"
                      placeholder="Official Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                    <Input
                      type="tel"
                      placeholder="Direct Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Agency Details */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Agency Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Government Agency/Organization *"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                    <Input
                      placeholder="Department/Division *"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Document Requirements */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Document Requirements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <select
                        value={formData.documentType}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-md border border-border/50 bg-background text-foreground focus:border-primary focus:outline-none transition-colors duration-300"
                      >
                        <option value="">Select Document Type *</option>
                        <option value="passports">Registered Passports</option>
                        <option value="drivers-license">Driver's Licenses</option>
                        <option value="id-cards">National ID Cards</option>
                        <option value="diplomas">Official Diplomas</option>
                        <option value="multiple">Multiple Document Types</option>
                        <option value="other">Other Government Documents</option>
                      </select>
                    </div>
                    <Input
                      placeholder="Estimated Quantity *"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="border-border/50 focus:border-primary transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-md border border-border/50 bg-background text-foreground focus:border-primary focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Project Urgency *</option>
                      <option value="standard">Standard (4-6 weeks)</option>
                      <option value="expedited">Expedited (2-3 weeks)</option>
                      <option value="urgent">Urgent (1 week)</option>
                      <option value="emergency">Emergency (72 hours)</option>
                    </select>
                  </div>

                  <Textarea
                    placeholder="Detailed specifications, security requirements, and any special considerations... *"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    required
                    rows={6}
                    className="border-border/50 focus:border-primary transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Security Notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Confidential Processing</p>
                    <p>All inquiries are processed through secure channels. Our government liaison team will contact you within 24 hours to establish encrypted communication and verify authorization.</p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" 
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5" />
                    Submit Secure Inquiry
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

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
