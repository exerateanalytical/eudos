import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Globe, Shield, Clock } from "lucide-react";
import type { LandingTheme } from "@/hooks/useThemeManager";

interface ThemedServicesProps {
  theme: LandingTheme;
}

export function ThemedServices({ theme }: ThemedServicesProps) {
  const services = [
    {
      icon: FileText,
      title: "Passport Services",
      description: "Complete passport printing with security features"
    },
    {
      icon: Globe,
      title: "Visa Documents",
      description: "Official visa documentation processing"
    },
    {
      icon: Shield,
      title: "ID Cards",
      description: "Secure government ID card production"
    },
    {
      icon: Clock,
      title: "Express Processing",
      description: "Fast-track services for urgent requests"
    }
  ];

  const cardStyle = theme.config?.cardStyle || 'elevated';
  
  const getCardClassName = () => {
    switch (cardStyle) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-lg border-white/20';
      case 'bordered':
        return 'border-2';
      case 'shadow':
        return 'shadow-xl';
      case 'minimal':
        return 'border-0 shadow-none';
      default:
        return 'shadow-lg hover:shadow-xl transition-shadow';
    }
  };

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span style={{ color: theme.primary_color }}>Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive document services for all your official needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className={getCardClassName()}>
              <CardHeader>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${theme.primary_color}20` }}
                >
                  <service.icon className="h-6 w-6" style={{ color: theme.primary_color }} />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
