import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, FileText, Globe, GraduationCap, Award, Shield, ArrowRight, 
  Sparkles, Lock, CheckCircle, Clock, Users, Star, TrendingUp,
  Zap, Target, MessageCircle, Phone, Mail
} from "lucide-react";

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
    processingTime: "7-14 days",
    rating: 4.9,
    orders: "10,000+",
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
    processingTime: "3-7 days",
    rating: 4.8,
    orders: "8,500+",
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
    processingTime: "14-30 days",
    rating: 4.9,
    orders: "5,000+",
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
    processingTime: "5-10 days",
    rating: 4.7,
    orders: "12,000+",
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
    processingTime: "3-5 days",
    rating: 4.8,
    orders: "7,500+",
  },
];

const stats = [
  { icon: Users, value: "50,000+", label: "Satisfied Clients" },
  { icon: CheckCircle, value: "99.8%", label: "Success Rate" },
  { icon: Globe, value: "150+", label: "Countries Served" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const securityFeatures = [
  { icon: Shield, label: "Military-Grade Security", description: "Bank-level encryption" },
  { icon: Lock, label: "Tamper-Proof Technology", description: "Advanced protection" },
  { icon: CheckCircle, label: "Government Standards", description: "Fully compliant" },
  { icon: Sparkles, label: "Premium Materials", description: "Highest quality" },
];

const processSteps = [
  {
    number: "01",
    title: "Choose Your Document",
    description: "Select from our range of secure documents",
    icon: Target,
  },
  {
    number: "02",
    title: "Submit Application",
    description: "Fill out our secure online form",
    icon: FileText,
  },
  {
    number: "03",
    title: "Verification Process",
    description: "We verify and process your request",
    icon: CheckCircle,
  },
  {
    number: "04",
    title: "Receive Your Document",
    description: "Secure delivery to your location",
    icon: Zap,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Executive",
    content: "Exceptional service! The passport was delivered exactly as promised with all security features intact.",
    rating: 5,
    image: "SJ",
  },
  {
    name: "Michael Chen",
    role: "International Consultant",
    content: "Fast, reliable, and professional. The driver's license exceeded my expectations in quality.",
    rating: 5,
    image: "MC",
  },
  {
    name: "Emma Williams",
    role: "Academic Professional",
    content: "The diploma certification was perfect. Verified by multiple institutions without any issues.",
    rating: 5,
    image: "EW",
  },
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 50,000+ Clients Worldwide</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Premium Document
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Services You Can Trust
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Industry-leading security features, government-grade quality, and unmatched reliability 
              for all your documentation needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => navigate("/apply")} className="group text-base">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")} className="text-base">
                Learn More
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-16 md:py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Military-Grade Security Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every document includes advanced security measures that meet or exceed government standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-primary/50 transition-all hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.label}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Document Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive range of secure, government-grade documents
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="fast">Fast Track</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.path}
                      className={`overflow-hidden border-2 ${category.borderColor} bg-gradient-to-br ${category.gradient} transition-all duration-300 hover:shadow-2xl hover-scale animate-fade-in group cursor-pointer`}
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
                          <CardDescription className="text-sm leading-relaxed line-clamp-2">
                            {category.description}
                          </CardDescription>
                        </div>

                        {/* Rating and Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">{category.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{category.orders}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{category.processingTime}</span>
                          </div>
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
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.filter(c => c.badge === "Most Popular" || c.badge === "In Demand").map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.path}
                      className={`overflow-hidden border-2 ${category.borderColor} bg-gradient-to-br ${category.gradient} transition-all duration-300 hover:shadow-2xl hover-scale group cursor-pointer`}
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
                          <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                          <CardDescription className="text-sm">{category.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate(category.path); }}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="fast" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.filter(c => c.badge === "Fast Processing").map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.path}
                      className={`overflow-hidden border-2 ${category.borderColor} bg-gradient-to-br ${category.gradient} transition-all duration-300 hover:shadow-2xl hover-scale group cursor-pointer`}
                      onClick={() => navigate(category.path)}
                    >
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-xl ${category.iconBg} shadow-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={`${category.badgeColor} border`}>
                            {category.badge}
                          </Badge>
                        </div>
                        
                        <div>
                          <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                          <CardDescription className="text-sm">{category.description}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate(category.path); }}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From application to delivery, we make it easy and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all hover-scale h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold text-primary/20">{step.number}</div>
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-primary/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied clients worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.image}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Documents?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your application today and experience our premium service. Our team is available 24/7 
              to assist you with any questions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => navigate("/apply")} className="group text-base">
                Start Application
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/faq")} className="text-base">
                View FAQ
              </Button>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Live Chat</div>
                <div className="text-xs text-muted-foreground">Available 24/7</div>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Phone Support</div>
                <div className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM</div>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Email Support</div>
                <div className="text-xs text-muted-foreground">Response within 2 hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
