import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LandingTheme } from "@/hooks/useThemeManager";

interface ThemedHeroProps {
  theme: LandingTheme;
}

export function ThemedHero({ theme }: ThemedHeroProps) {
  const navigate = useNavigate();
  
  return (
    <section 
      className={`relative py-12 md:py-20 lg:py-28 px-4 md:px-6 overflow-hidden bg-gradient-to-br ${theme.background_gradient}`}
    >
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Shield className="h-5 w-5" style={{ color: theme.primary_color }} />
            <span className="text-sm font-medium">Licensed & Authorized</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Official Government Document
            <span 
              className="block mt-2"
              style={{ color: theme.primary_color }}
            >
              Printing Services
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Licensed facility serving government agencies worldwide with registered documents
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              style={{ backgroundColor: theme.primary_color }}
              className="hover:opacity-90"
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/shop")}>
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
