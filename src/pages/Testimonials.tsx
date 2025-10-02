import { useNavigate } from "react-router-dom";
import { Printer, Star, Quote, Building2, Shield, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Testimonials = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      position: "Director of Document Services",
      organization: "U.S. Department of State",
      country: "United States",
      rating: 5,
      testimonial: "SecurePrint Labs has been instrumental in modernizing our passport production system. The integration of biometric data and RFID technology is seamless, and their attention to security detail is unmatched. Over 250,000 passports produced with zero security incidents.",
      initials: "SM"
    },
    {
      name: "Commissioner James Chen",
      position: "Chief of National ID Program",
      organization: "Ministry of Home Affairs",
      country: "Singapore",
      rating: 5,
      testimonial: "The quality and security features of our new national ID cards have set a new standard in the region. SecurePrint Labs' database integration capabilities allowed us to verify 500,000+ cards in real-time. Their professionalism and adherence to deadlines were exceptional.",
      initials: "JC"
    },
    {
      name: "Minister Fatima Al-Rahman",
      position: "Minister of Interior",
      organization: "Ministry of Interior",
      country: "United Arab Emirates",
      rating: 5,
      testimonial: "We needed a partner who could deliver both volume and uncompromising security. SecurePrint Labs exceeded our expectations, producing 1.2 million documents with military-grade features while maintaining a 48-hour turnaround. Their technical support team is outstanding.",
      initials: "FA"
    },
    {
      name: "Colonel Marcus Weber",
      position: "Director of Military Credentials",
      organization: "German Federal Armed Forces",
      country: "Germany",
      rating: 5,
      testimonial: "For military identification, security is paramount. SecurePrint Labs' tamper-proof designs and multi-layer authentication have proven effective in field conditions. Their ISO compliance and quality control processes align perfectly with our stringent requirements.",
      initials: "MW"
    },
    {
      name: "Ambassador Yuki Tanaka",
      position: "Director of Consular Services",
      organization: "Ministry of Foreign Affairs",
      country: "Japan",
      rating: 5,
      testimonial: "The holographic security features and UV elements on our diplomatic documents are stunning and virtually impossible to replicate. SecurePrint Labs' understanding of international standards and cultural sensitivity made the entire process smooth and efficient.",
      initials: "YT"
    },
    {
      name: "Dr. Elizabeth Okonkwo",
      position: "Registrar General",
      organization: "National Identity Management Commission",
      country: "Nigeria",
      rating: 5,
      testimonial: "Implementing a national ID system for over 200 million citizens required a partner with both technical expertise and scalability. SecurePrint Labs delivered beyond expectations, providing training, equipment, and continuous support throughout our rollout.",
      initials: "EO"
    },
    {
      name: "General Pierre Dubois",
      position: "Director of National Security",
      organization: "Ministry of Interior",
      country: "France",
      rating: 5,
      testimonial: "When security breaches are not an option, you need the best. SecurePrint Labs' combination of biometric integration, encrypted chips, and database verification has made our identity documents among the most secure in Europe. Highly recommended.",
      initials: "PD"
    },
    {
      name: "Secretary Maria Rodriguez",
      position: "Secretary of Transportation",
      organization: "Department of Motor Vehicles",
      country: "Mexico",
      rating: 5,
      testimonial: "Our driver's license modernization project required advanced security without sacrificing production speed. SecurePrint Labs achieved both - delivering 3 million licenses with laser engraving, microtext, and UV features on an aggressive timeline.",
      initials: "MR"
    },
    {
      name: "Professor David Thompson",
      position: "Vice Chancellor",
      organization: "National University System",
      country: "United Kingdom",
      rating: 5,
      testimonial: "The security features on our academic diplomas and certificates have eliminated forgery concerns entirely. The watermarks, security threads, and verification system have restored trust in our credentials. SecurePrint Labs' attention to detail is remarkable.",
      initials: "DT"
    },
    {
      name: "Director Anna Kowalski",
      position: "Director of Civil Registration",
      organization: "Ministry of Digital Affairs",
      country: "Poland",
      rating: 5,
      testimonial: "Digital-physical integration was crucial for our e-government initiative. SecurePrint Labs' RFID/NFC technology combined with secure database registration created a seamless verification experience. Their technical team worked closely with ours to ensure perfect integration.",
      initials: "AK"
    },
    {
      name: "Minister Hassan Al-Masri",
      position: "Minister of Justice",
      organization: "Ministry of Justice",
      country: "Jordan",
      rating: 5,
      testimonial: "For legal documents, authenticity is everything. The tamper-proof features and multi-tone watermarks have made our official certificates virtually impossible to forge. SecurePrint Labs' commitment to quality and security is evident in every document.",
      initials: "HM"
    },
    {
      name: "Commissioner Linda Nyström",
      position: "Police Commissioner",
      organization: "Swedish Police Authority",
      country: "Sweden",
      rating: 5,
      testimonial: "Law enforcement credentials require the highest security standards. SecurePrint Labs delivered documents with advanced authentication features that can be verified instantly in the field. Their rapid production capabilities have been crucial for emergency replacements.",
      initials: "LN"
    }
  ];

  const stats = [
    { value: "500+", label: "Government Clients" },
    { value: "50+", label: "Countries Served" },
    { value: "99.9%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <Printer className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SecurePrint Labs
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Home
            </button>
            <button onClick={() => navigate("/products")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Products
            </button>
            <button onClick={() => navigate("/about")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              About
            </button>
            <button onClick={() => navigate("/faq")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              FAQ
            </button>
            <button onClick={() => navigate("/testimonials")} className="text-primary font-medium">
              Testimonials
            </button>
            <button onClick={() => navigate("/blog")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              Blog
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted by Government Agencies Worldwide</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Client Testimonials</h1>
          <p className="text-xl text-muted-foreground">
            Hear from government officials and agencies who trust SecurePrint Labs for their secure document needs
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-primary/10">
                        <AvatarFallback className="text-primary font-semibold">
                          {item.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.position}</p>
                      </div>
                    </div>
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{item.testimonial}"
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{item.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{item.country}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Satisfied Clients</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the same level of quality, security, and service that government agencies worldwide trust
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/apply")}>
                Apply for Documents
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/#contact")}>
                Request Consultation
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
