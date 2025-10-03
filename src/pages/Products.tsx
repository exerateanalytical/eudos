import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, Globe, GraduationCap, Award, Shield, ArrowRight, Sparkles, Lock, CheckCircle } from "lucide-react";

const categories = [
  {
    name: "Passports",
    path: "/passports",
    description: "Authentic biometric passports with embedded chips and advanced security features",
    icon: CreditCard,
    gradient: "from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20",
    borderColor: "border-blue-500/30 hover:border-blue-500/50",
    iconBg: "bg-blue-500",
    features: ["Biometric Integration", "RFID Chip", "Global Recognition", "10-Year Validity"],
    badge: "Most Popular",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    name: "Driver's License",
    path: "/drivers-license",
    description: "Valid driver's licenses with biometric data and tamper-proof security features",
    icon: FileText,
    gradient: "from-green-500/20 to-green-600/10 hover:from-green-500/30 hover:to-green-600/20",
    borderColor: "border-green-500/30 hover:border-green-500/50",
    iconBg: "bg-green-500",
    features: ["Holographic Overlay", "UV Security", "Magnetic Stripe", "Laser Engraving"],
    badge: "Fast Processing",
    badgeColor: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  {
    name: "Citizenship",
    path: "/citizenship",
    description: "Complete citizenship documentation packages for various countries worldwide",
    icon: Globe,
    gradient: "from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20",
    borderColor: "border-purple-500/30 hover:border-purple-500/50",
    iconBg: "bg-purple-500",
    features: ["Legal Documentation", "Government Approved", "Multiple Countries", "Full Support"],
    badge: "Premium Service",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    name: "Diplomas",
    path: "/diplomas",
    description: "Authenticated academic certificates from recognized universities and institutions",
    icon: GraduationCap,
    gradient: "from-orange-500/20 to-orange-600/10 hover:from-orange-500/30 hover:to-orange-600/20",
    borderColor: "border-orange-500/30 hover:border-orange-500/50",
    iconBg: "bg-orange-500",
    features: ["Official Seals", "Watermarks", "Verification Codes", "Accredited Institutions"],
    badge: "Verified",
    badgeColor: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  {
    name: "Certifications",
    path: "/certifications",
    description: "Professional certifications and licenses for various industries and specializations",
    icon: Award,
    gradient: "from-pink-500/20 to-pink-600/10 hover:from-pink-500/30 hover:to-pink-600/20",
    borderColor: "border-pink-500/30 hover:border-pink-500/50",
    iconBg: "bg-pink-500",
    features: ["Industry Standard", "Professional Grade", "Quick Turnaround", "Authentic Credentials"],
    badge: "In Demand",
    badgeColor: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  },
];

const securityFeatures = [
  { icon: Shield, label: "Military-Grade Security" },
  { icon: Lock, label: "Tamper-Proof Technology" },
  { icon: CheckCircle, label: "Government Standards" },
  { icon: Sparkles, label: "Premium Quality Materials" },
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Document Services</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Explore Our Document Categories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our comprehensive range of secure government documents and certifications, 
            all featuring advanced security features and biometric technology.
          </p>
        </div>

        {/* Security Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-border/50 bg-muted/20 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">{feature.label}</p>
              </div>
            );
          })}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.path}
                className={`overflow-hidden border-2 ${category.borderColor} bg-gradient-to-br ${category.gradient} transition-all duration-300 hover:shadow-xl hover-scale animate-fade-in group cursor-pointer`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(category.path)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${category.iconBg} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={`${category.badgeColor} border`}>
                      {category.badge}
                    </Badge>
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features List */}
                  <div className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full group-hover:shadow-lg transition-shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(category.path);
                    }}
                  >
                    Explore {category.name}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-8 md:p-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team is ready to help you with your document needs. Start your application process today 
            or contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/apply")} className="group">
              Start Your Application
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
              Learn More About Us
            </Button>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Have questions?{" "}
            <button
              onClick={() => navigate("/faq")}
              className="text-primary hover:underline font-medium"
            >
              Visit our FAQ page
            </button>
            {" "}or{" "}
            <button
              onClick={() => navigate("/about")}
              className="text-primary hover:underline font-medium"
            >
              contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
