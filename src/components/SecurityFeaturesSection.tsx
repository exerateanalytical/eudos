import { useNavigate } from "react-router-dom";
import { Fingerprint, Cpu, Sparkles, Eye, Scan, Radio, FileCheck, Lock, Database } from "lucide-react";

const securityFeatures = [
  { icon: Fingerprint, label: "Biometric", id: "biometric" },
  { icon: Cpu, label: "RFID Chip", id: "rfid-chip" },
  { icon: Sparkles, label: "Hologram", id: "hologram" },
  { icon: Eye, label: "UV Features", id: "uv-features" },
  { icon: Scan, label: "Microtext", id: "microtext" },
  { icon: Radio, label: "Laser Engraved", id: "laser-engraving" },
  { icon: FileCheck, label: "Watermarks", id: "watermarks" },
  { icon: Lock, label: "Tamper-Proof", id: "tamper-proof" },
  { icon: Database, label: "DB Registered", id: "db-registered" },
];

export const SecurityFeaturesSection = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (featureId: string) => {
    navigate(`/security-features#${featureId}`);
    // Scroll to the feature after navigation
    setTimeout(() => {
      const element = document.getElementById(featureId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-primary/5 to-background border-y border-border/40">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Advanced Security Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every document includes all security features below. Click to learn how we ensure authenticity.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer active:scale-95"
              >
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                  {feature.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};