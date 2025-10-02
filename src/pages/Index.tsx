import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Shield, Clock, CheckCircle, Printer, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "Thank you for your inquiry. We'll contact you within 24 hours.",
    });
    setFormData({ name: "", organization: "", email: "", phone: "", message: "" });
  };

  const services = [
    {
      icon: FileText,
      title: "Government Documents",
      description: "Certificates, licenses, permits, and official forms with security features"
    },
    {
      icon: Building2,
      title: "Corporate Materials",
      description: "Letterheads, certificates, contracts, and branded official documents"
    },
    {
      icon: Shield,
      title: "Secure Printing",
      description: "Watermarks, holograms, microtext, and other security printing features"
    },
    {
      icon: Printer,
      title: "High-Volume Printing",
      description: "Large-scale production with consistent quality and quick turnaround"
    }
  ];

  const features = [
    { icon: Shield, text: "ISO 9001 Certified" },
    { icon: Clock, text: "24-48 Hour Turnaround" },
    { icon: CheckCircle, text: "Quality Guaranteed" },
    { icon: FileText, text: "Secure Handling" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">SecurePrint Labs</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Official Document Printing Solutions
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Trusted by government agencies and organizations worldwide for secure, high-quality printing of official documents
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <a href="#contact">Request Quote</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#services">Our Services</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 justify-center">
                <feature.icon className="h-5 w-5" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive printing solutions for official documents with advanced security features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Industry Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Over 20 years serving government agencies and corporations with secure document printing solutions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  State-of-the-art security features including watermarks, holograms, and specialized inks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ISO certified processes ensuring consistent quality and compliance with international standards
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Confidentiality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strict data protection protocols and secure facilities for handling sensitive documents
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              Request a quote or learn more about our services
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tell us about your printing needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 SecurePrint Labs. All rights reserved.</p>
          <p className="mt-2 text-sm">Professional printing services for government and corporate clients</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
