import { useNavigate } from "react-router-dom";
import { Printer, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const navigate = useNavigate();

  const faqCategories = [
    {
      category: "General Questions",
      questions: [
        {
          q: "Who can use your services?",
          a: "Our services are exclusively available to government agencies, authorized organizations, and official institutions. We require proper verification and authorization before accepting any orders. Individual requests are not accepted."
        },
        {
          q: "What makes your documents different from others?",
          a: "Our documents feature military-grade security including biometric data integration, RFID/NFC chips, multi-layer holograms, UV features, microtext printing, laser engraving, tamper-proof designs, and real-time database registration. Each document is fully registered and verifiable through secure government systems."
        },
        {
          q: "Are your documents legally registered?",
          a: "Yes, absolutely. Every document we produce is registered in secure government databases with unique serial numbers and full verification capabilities. This ensures instant authentication and compliance with international standards."
        },
        {
          q: "How long have you been in business?",
          a: "SecurePrint Labs has been serving government agencies worldwide for over 20 years, producing more than 1 million secure documents with a 99.9% accuracy rate."
        }
      ]
    },
    {
      category: "Security & Authentication",
      questions: [
        {
          q: "What security features do your documents include?",
          a: "Our documents incorporate 9+ security layers: (1) Biometric data with 256-bit encryption, (2) Embedded RFID/NFC chips, (3) Multi-layer 3D holograms, (4) UV invisible ink patterns, (5) Microscopic text printing, (6) Permanent laser engraving, (7) Multi-tone watermarks, (8) Tamper-proof materials, and (9) Real-time database registration."
        },
        {
          q: "How can documents be verified?",
          a: "Documents can be verified through multiple methods: RFID/NFC chip scanning, machine-readable zone readers, UV light inspection, database queries via secure API, and visual inspection of security features. We provide verification training and equipment to authorized agencies."
        },
        {
          q: "Are your documents ICAO compliant?",
          a: "Yes, all our passports and travel documents meet or exceed ICAO (International Civil Aviation Organization) standards, including biometric data pages, contactless chips, and machine-readable zones."
        },
        {
          q: "Can your documents be forged or duplicated?",
          a: "Our multi-layer security approach makes forgery virtually impossible. The combination of biometric integration, encrypted chips, specialized materials, and database registration creates barriers that cannot be replicated with standard or even advanced equipment."
        }
      ]
    },
    {
      category: "Ordering & Production",
      questions: [
        {
          q: "What is the typical production time?",
          a: "Standard production is 24-48 hours after receiving complete specifications and data. Expedited services are available for urgent government requirements, with production possible in as little as 12 hours for qualifying orders."
        },
        {
          q: "What information do you need to process an order?",
          a: "We require: official government authorization documentation, complete applicant data (biometrics if applicable), document specifications, quantity needed, delivery address, and contact information for the responsible official. All data must be transmitted through secure channels."
        },
        {
          q: "How do you ensure data security during production?",
          a: "Our facility operates under ISO 27001 Information Security standards. All data is encrypted end-to-end, stored in secure servers with multi-factor authentication, and accessed only by authorized personnel in controlled environments. Data is purged after production completion per government protocols."
        },
        {
          q: "Can you handle bulk orders?",
          a: "Yes, we regularly process bulk orders for government agencies ranging from hundreds to thousands of documents. Our scalable production facility can accommodate any volume while maintaining quality and security standards."
        },
        {
          q: "What is your minimum order quantity?",
          a: "We accept orders of any size, from single documents for special circumstances to large-scale production runs of 10,000+ documents. There is no minimum order requirement for authorized agencies."
        }
      ]
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          q: "How is pricing determined?",
          a: "Pricing depends on document type, quantity, security features required, turnaround time, and any customization needs. We provide detailed quotes after reviewing specifications. Volume discounts are available for larger orders."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept wire transfers, government purchase orders, ACH transfers, and approved invoicing arrangements. Payment terms are typically net 30 days for established government clients."
        },
        {
          q: "Are there rush fees for expedited service?",
          a: "Yes, expedited production (12-24 hours) incurs additional fees based on urgency and volume. Emergency services are available 24/7 for critical government needs."
        },
        {
          q: "Do you offer quotes or estimates?",
          a: "Yes, we provide detailed quotes at no cost after reviewing your requirements. Simply submit an official inquiry through our contact form or reach out to your dedicated liaison officer."
        }
      ]
    },
    {
      category: "Technical & Compliance",
      questions: [
        {
          q: "What certifications do you hold?",
          a: "We maintain ISO 9001:2015 (Quality Management), ISO 27001 (Information Security), ICAO compliance for travel documents, and government-issued production licenses for secure document manufacturing."
        },
        {
          q: "How do you stay compliant with changing regulations?",
          a: "We maintain a dedicated compliance team that monitors regulatory changes worldwide, participates in industry working groups, and updates our processes and security features quarterly to meet evolving standards."
        },
        {
          q: "Can you integrate with our existing systems?",
          a: "Yes, we offer API integration with government verification databases, population registries, and document management systems. Our technical team works with your IT department to ensure seamless integration."
        },
        {
          q: "What countries do you serve?",
          a: "We serve government agencies worldwide across 50+ countries. Our documents comply with regional and international standards, including specific country requirements."
        },
        {
          q: "Do you provide training for verification equipment?",
          a: "Yes, we offer comprehensive training for government officials on document verification, authentication procedures, and proper use of verification equipment. Training can be conducted on-site or at our facility."
        }
      ]
    },
    {
      category: "Support & Services",
      questions: [
        {
          q: "What if there's an error in a produced document?",
          a: "Quality is our top priority. If an error occurs, we will reproduce the document at no charge within 24 hours. Our 99.9% accuracy rate reflects our commitment to excellence."
        },
        {
          q: "Do you offer ongoing support?",
          a: "Yes, all clients receive dedicated liaison support, 24/7 emergency assistance, regular updates on security enhancements, and access to our technical support team."
        },
        {
          q: "Can you handle special customization requests?",
          a: "Absolutely. We work with agencies to incorporate specific security features, custom designs, additional data fields, or unique authentication requirements. Our R&D team can develop custom solutions."
        },
        {
          q: "What happens to sensitive data after production?",
          a: "All applicant data, biometric information, and production files are securely deleted from our systems within 30 days of delivery per government data protection protocols. Audit trails are maintained separately for compliance."
        }
      ]
    }
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
            <button onClick={() => navigate("/faq")} className="text-primary font-medium">
              FAQ
            </button>
            <button onClick={() => navigate("/testimonials")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
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
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Frequently Asked Questions</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">How Can We Help You?</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our secure document production services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl space-y-12">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-3xl font-bold mb-6 text-foreground">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`${catIndex}-${qIndex}`} className="border border-border/50 rounded-lg px-6 bg-card/50">
                    <AccordionTrigger className="text-left hover:text-primary">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our team is ready to assist with any inquiries about our secure document services
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/#contact")}>
                Contact Us
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/apply")}>
                Submit Application
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
