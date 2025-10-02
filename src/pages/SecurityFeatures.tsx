import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Cpu, Sparkles, Eye, Scan, Radio, FileCheck, Lock, Database } from "lucide-react";

const securityFeatures = [
  {
    id: "biometric",
    icon: Fingerprint,
    name: "Biometric",
    gradient: "from-blue-500 to-cyan-500",
    description: "Advanced biometric authentication",
    details: [
      "High-resolution facial recognition technology captures over 80 unique facial characteristics",
      "Fingerprint scanning with minutiae extraction stores up to 10 fingerprints per document",
      "Iris scanning technology maps over 240 unique iris features",
      "Live detection prevents the use of photos or masks",
      "Encrypted biometric data storage using AES-256 encryption",
      "ISO/IEC 19794 compliant biometric data formats"
    ]
  },
  {
    id: "rfid-chip",
    icon: Cpu,
    name: "RFID Chip",
    gradient: "from-purple-500 to-pink-500",
    description: "Contactless smart chip technology",
    details: [
      "ISO 14443 compliant contactless smart chips with 64KB-144KB memory",
      "Stores digitally signed personal data and biometric information",
      "Basic Access Control (BAC) and Extended Access Control (EAC) protocols",
      "Active Authentication (AA) prevents chip cloning",
      "Supports Public Key Infrastructure (PKI) for secure data verification",
      "Reading range optimized for border control systems (up to 10cm)",
      "Tamper-evident design with chip shutdown on physical attack"
    ]
  },
  {
    id: "hologram",
    icon: Sparkles,
    name: "Hologram",
    gradient: "from-green-500 to-emerald-500",
    description: "Multi-layer holographic security",
    details: [
      "Custom-designed holographic overlays with multiple security levels",
      "Color-shifting elements that change based on viewing angle",
      "Microtext within hologram visible only under magnification",
      "3D depth effects and motion patterns",
      "UV-reactive elements for additional verification",
      "Laser-readable machine codes embedded in hologram",
      "Heat-sensitive inks that reveal hidden patterns"
    ]
  },
  {
    id: "uv-features",
    icon: Eye,
    name: "UV Features",
    gradient: "from-orange-500 to-red-500",
    description: "Ultraviolet security elements",
    details: [
      "Invisible UV-reactive inks that fluoresce under UV light (254nm and 365nm)",
      "Multi-color UV fibers embedded throughout the document",
      "UV-visible microprinting with text as small as 0.1mm",
      "Dual-tone UV elements showing different colors under different wavelengths",
      "UV-active security threads woven into the document substrate",
      "Anti-Stokes inks with upconversion properties",
      "Complex UV patterns matching government databases"
    ]
  },
  {
    id: "microtext",
    icon: Scan,
    name: "Microtext",
    gradient: "from-yellow-500 to-amber-500",
    description: "Microscopic text printing",
    details: [
      "Positive and negative microtext as small as 0.1mm in height",
      "Text legible only under 10x magnification or higher",
      "Multiple layers of microtext at different sizes",
      "Custom text patterns unique to each document",
      "Rainbow printing with color transitions in microtext",
      "Microtext incorporated into background patterns and borders",
      "Cannot be reproduced by standard copying or scanning equipment"
    ]
  },
  {
    id: "laser-engraving",
    icon: Radio,
    name: "Laser Engraved",
    gradient: "from-indigo-500 to-purple-500",
    description: "Permanent laser personalization",
    details: [
      "CO2 or fiber laser engraving penetrates multiple document layers",
      "Tactile raised surface on personalized data fields",
      "Variable laser-readable (VLR) images visible under infrared light",
      "Grayscale portrait images with 256 shades of depth",
      "Laser-engraved ghost images that cannot be altered",
      "Permanent marking that cannot be removed without destroying the document",
      "Machine-readable data codes engraved for automated verification"
    ]
  },
  {
    id: "watermarks",
    icon: FileCheck,
    name: "Watermarks",
    gradient: "from-teal-500 to-cyan-500",
    description: "Embedded watermark protection",
    details: [
      "Multi-tone watermarks visible when held up to light",
      "Electrotype watermarks with high-contrast images",
      "3D watermarks with depth variation",
      "Custom designs specific to issuing authority",
      "Integrated with paper substrate during manufacturing",
      "Contains portrait and text elements",
      "Cannot be reproduced by photocopying or scanning",
      "Verified using transmitted light examination"
    ]
  },
  {
    id: "tamper-proof",
    icon: Lock,
    name: "Tamper-Proof",
    gradient: "from-rose-500 to-pink-500",
    description: "Anti-tampering mechanisms",
    details: [
      "Tamper-evident laminates that show VOID pattern when removed",
      "Security cuts and perforations with custom patterns",
      "Color-shifting inks that are difficult to reproduce",
      "Chemical-reactive substrates that stain when altered",
      "Integrated security threads that break when separation is attempted",
      "Thermochromic inks that respond to temperature changes",
      "Optically variable devices (OVDs) that cannot be scanned",
      "Physical security features detectable by touch"
    ]
  },
  {
    id: "db-registered",
    icon: Database,
    name: "DB Registered",
    gradient: "from-violet-500 to-purple-500",
    description: "Government database registration",
    details: [
      "Real-time registration in government secure databases",
      "Unique identification numbers linked to central verification systems",
      "PKI-based digital signatures for document authentication",
      "Automated background verification during registration",
      "Integration with international verification networks (INTERPOL, ICAO)",
      "Secure API connections for instant verification by authorities",
      "Encrypted data transmission using TLS 1.3",
      "Blockchain-based tamper-proof audit trails",
      "24/7 verification availability for border control systems"
    ]
  }
];

const SecurityFeatures = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Military-Grade Security</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Advanced Security Features
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Our documents incorporate multiple layers of sophisticated security features that make them virtually impossible to counterfeit. Each feature is carefully integrated to ensure authenticity and prevent fraud.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features Detail */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} id={feature.id} className="scroll-mt-20 border-border/50 bg-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shrink-0`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">{feature.name}</CardTitle>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            High-Security
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-4 text-foreground">How We Implement This Feature:</h4>
                    <ul className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Every Document Gets All Security Features
              </h2>
              <p className="text-muted-foreground mb-6">
                We don't compromise on security. Every document we produce includes all nine security features, ensuring maximum authenticity and protection against fraud.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {securityFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Badge key={feature.id} variant="secondary" className="px-3 py-1.5 gap-2">
                      <Icon className="h-3 w-3" />
                      {feature.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityFeatures;