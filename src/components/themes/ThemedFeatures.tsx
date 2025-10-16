import { CheckCircle } from "lucide-react";
import type { LandingTheme } from "@/hooks/useThemeManager";

interface ThemedFeaturesProps {
  theme: LandingTheme;
}

export function ThemedFeatures({ theme }: ThemedFeaturesProps) {
  const features = [
    "ISO 9001 Certified Printing Facility",
    "Advanced Security Features",
    "Global Shipping Available",
    "24/7 Customer Support",
    "Encrypted Data Protection",
    "Fast Processing Times"
  ];

  return (
    <section 
      className={`py-16 px-4 md:px-6 bg-gradient-to-br ${theme.background_gradient}`}
    >
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span style={{ color: theme.primary_color }}>Us</span>
            </h2>
            <p className="text-muted-foreground">
              Trusted by government agencies and organizations worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20"
              >
                <CheckCircle 
                  className="h-5 w-5 flex-shrink-0" 
                  style={{ color: theme.secondary_color }}
                />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
