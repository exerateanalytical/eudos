import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Award, Building2, Database, Clock, CheckCircle, Users, Globe, Lock, Sparkles, Fingerprint, Cpu, Eye, Radio, FileCheck, Scan, Printer } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const achievements = [
    { value: "20+", label: "Years of Excellence" },
    { value: "500+", label: "Government Clients" },
    { value: "1M+", label: "Documents Produced" },
    { value: "99.9%", label: "Accuracy Rate" }
  ];

  const securityFeatures = [
    { icon: Fingerprint, title: "Biometric Integration", description: "Advanced fingerprint and facial recognition with 256-bit encryption" },
    { icon: Cpu, title: "RFID/NFC Chips", description: "Embedded contactless smart chips with encrypted data storage" },
    { icon: Sparkles, title: "Multi-Layer Holograms", description: "3D holographic overlays with rainbow iridescent effects" },
    { icon: Eye, title: "UV Security", description: "Invisible UV ink patterns visible only under ultraviolet light" },
    { icon: Scan, title: "Microtext Printing", description: "Microscopic text impossible to replicate with standard equipment" },
    { icon: Radio, title: "Laser Engraving", description: "Permanent laser-etched personalization that cannot be altered" },
    { icon: FileCheck, title: "Advanced Watermarks", description: "Multi-tone watermarks with embedded security threads" },
    { icon: Lock, title: "Tamper-Proof Design", description: "Self-destructing features if alteration is attempted" },
    { icon: Database, title: "Database Registration", description: "Real-time verification through secure government databases" }
  ];

  const services = [
    {
      title: "Registered Passports",
      features: [
        "ICAO-compliant biometric data pages",
        "Embedded contactless chips with encrypted information",
        "Multi-layer security holograms and UV features",
        "Machine-readable zones for instant verification",
        "Full database registration and tracking"
      ]
    },
    {
      title: "National ID Cards",
      features: [
        "Government-issued identification with RFID technology",
        "Holographic overlays and laser engraving",
        "Advanced security printing with microtext",
        "Biometric data integration capabilities",
        "Real-time database verification"
      ]
    },
    {
      title: "Driver's Licenses",
      features: [
        "State-compliant with all security features",
        "Ghost images and laser-etched personalization",
        "UV ink patterns and microprinting",
        "Tamper-evident materials and designs",
        "Database integration for instant validation"
      ]
    },
    {
      title: "Official Diplomas",
      features: [
        "Authenticated educational certificates",
        "Security threads and watermarks",
        "Tamper-proof materials and features",
        "Official seals and signatures",
        "Verification database registration"
      ]
    }
  ];

  const certifications = [
    { title: "ISO 9001:2015", description: "Quality Management Systems" },
    { title: "ISO 27001", description: "Information Security Management" },
    { title: "ICAO Compliance", description: "International Civil Aviation Organization Standards" },
    { title: "Government Licensed", description: "Authorized Document Production Facility" }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Licensed & Authorized",
      description: "Officially licensed by government authorities worldwide. We hold all necessary certifications and operate under strict regulatory oversight to ensure every document meets international standards."
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Our security features exceed international standards, combining physical, digital, and biometric layers. Each document incorporates multiple authentication methods that are virtually impossible to replicate or forge."
    },
    {
      icon: Database,
      title: "Real-Time Database Integration",
      description: "Direct integration with government verification systems ensures every document is traceable, verifiable, and can be authenticated in real-time anywhere in the world through secure API access."
    },
    {
      icon: Building2,
      title: "Government-Only Service",
      description: "We exclusively serve government agencies and authorized organizations. Our strict vetting processes, secure facilities, and confidential handling ensure the highest level of trust and compliance."
    },
    {
      icon: Clock,
      title: "Rapid Turnaround",
      description: "Despite our rigorous security protocols, we maintain industry-leading turnaround times. Standard production is 24-48 hours, with expedited services available for urgent government requirements."
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Our documents comply with international standards including ICAO, ISO, and country-specific regulations. We stay updated with evolving security requirements worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative py-10 md:py-16 lg:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8">
            <Award className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Licensed Government Document Production Facility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent px-4">
            About SecurePrint Labs
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed px-4">
            With over two decades of excellence, we are the trusted partner for government agencies worldwide, delivering secure, registered documents with unmatched precision and military-grade security.
          </p>
        </div>
      </section>

      {/* Stats - Mobile Optimized */}
      <section className="py-8 md:py-10 lg:py-12 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {achievements.map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 md:mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 font-medium text-xs sm:text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Mobile Optimized */}
      <section className="py-12 md:py-16 lg:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-4">Why Choose SecurePrint Labs</h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-4">The industry's most trusted government document production facility</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {whyChooseUs.map((item, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm active:scale-95 touch-manipulation"
              >
                <CardHeader className="pb-4">
                  <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 w-fit mb-2 md:mb-3">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Advanced Security Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Security Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every document incorporates multiple layers of cutting-edge security features, making forgery virtually impossible
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
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
        </div>
      </section>

      {/* Our Services */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Document Services</h2>
            <p className="text-xl text-muted-foreground">Comprehensive solutions for all government document needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Certifications & Compliance</h2>
            <p className="text-xl text-muted-foreground">Meeting and exceeding international standards</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of government agencies worldwide who trust SecurePrint Labs for their secure document needs
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/apply")}>
                Apply for Documents
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/#contact")}>
                Contact Us
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
