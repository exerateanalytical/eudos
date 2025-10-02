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
    <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-primary/5 to-background border-y border-border/40">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Advanced Security Features</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Every document includes all security features below. Click to learn how we ensure authenticity.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer active:scale-95"
              >
                <div className="p-1.5 rounded bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
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