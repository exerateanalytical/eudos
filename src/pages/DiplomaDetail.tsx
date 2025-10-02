import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, GraduationCap, Clock, FileText, CheckCircle, Shield, Award, Download, Mail, ShoppingCart, Coins, IdCard, BookOpen, Database } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const DiplomaDetail = () => {
  const { university } = useParams();
  const navigate = useNavigate();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [escrowConfirmed, setEscrowConfirmed] = useState(false);

  const universityName = university?.replace(/-/g, ' ') || "Harvard University";

  // Determine pricing based on university tier
  const tier1Unis = ["Harvard University", "Stanford University", "Massachusetts Institute of Technology (MIT)", "Princeton University", "Yale University", "Columbia University", "California Institute of Technology (Caltech)"];
  const tier2Unis = ["University of California, Berkeley", "University of Chicago", "Johns Hopkins University", "University of Pennsylvania", "Cornell University", "Northwestern University", "Duke University"];
  
  let diplomaPrice = "$10,000";
  if (tier1Unis.includes(universityName)) {
    diplomaPrice = "$15,000";
  } else if (tier2Unis.includes(universityName)) {
    diplomaPrice = "$12,000";
  }

  const diplomaData = {
    universityName,
    price: diplomaPrice,
    deliveryTime: "2 weeks",
    description: `Obtain an authentic ${universityName} diploma with a complete documentation package. Includes official transcript, thesis/project, student ID, and database registration.`,
    
    packageIncludes: [
      {
        title: "Official Diploma",
        description: "Authentic university diploma with official seal, signatures, and security features on premium paper stock"
      },
      {
        title: "Academic Transcript",
        description: "Complete official transcript with course listings, grades, GPA, and registrar seal"
      },
      {
        title: "Thesis/Project Documentation",
        description: "School project or thesis documentation appropriate to your field of study"
      },
      {
        title: "Student ID Card",
        description: "Official student identification card with photo, student number, and security features"
      },
      {
        title: "Database Registration",
        description: "Student records registered in university alumni database with verifiable information"
      },
      {
        title: "Verification Letter",
        description: "Official letter from registrar's office confirming degree completion and graduation"
      }
    ],
    
    benefits: [
      "100% authentic documentation with all security features",
      "Registered in official university systems and databases",
      "Worldwide recognition and acceptance",
      "Complete package - everything you need in one order",
      "Fast 2-week processing and delivery",
      "Secure international shipping with tracking",
      "Full customer support throughout the process",
      "Money-back guarantee for quality assurance"
    ],
    
    process: [
      {
        step: 1,
        title: "Order Placement",
        description: "Complete your order with personal details and field of study",
        duration: "Day 1"
      },
      {
        step: 2,
        title: "Information Verification",
        description: "We verify your information and prepare documentation details",
        duration: "Days 2-3"
      },
      {
        step: 3,
        title: "Document Creation",
        description: "Professional creation of all documents with authentic materials",
        duration: "Days 4-8"
      },
      {
        step: 4,
        title: "Database Registration",
        description: "Your records are registered in the university system",
        duration: "Days 9-10"
      },
      {
        step: 5,
        title: "Quality Review",
        description: "Final quality check and authentication of all materials",
        duration: "Day 11"
      },
      {
        step: 6,
        title: "Shipping",
        description: "Secure international shipping to your address with tracking",
        duration: "Days 12-14"
      }
    ],
    
    faqs: [
      {
        q: "What exactly is included in the package?",
        a: "Your complete package includes: (1) Official diploma with seal and signatures, (2) Complete academic transcript, (3) Thesis or school project documentation, (4) Student ID card with photo, (5) Database registration in university records, and (6) Verification letter from registrar. All documents are authentic and properly formatted."
      },
      {
        q: "How long does the entire process take?",
        a: "The complete process takes exactly 2 weeks from order to delivery. This includes document creation, quality review, database registration, and international shipping with tracking."
      },
      {
        q: "Will my information be in the university database?",
        a: "Yes, your student information will be registered in the university's alumni database with verifiable records. This allows for legitimate verification if needed."
      },
      {
        q: "Can I choose my major and graduation year?",
        a: "Absolutely! You can specify your field of study, major, graduation year, and other relevant academic details when placing your order."
      },
      {
        q: "Is the diploma authentic and verifiable?",
        a: "Yes, all diplomas are created with authentic materials, include proper security features, and are registered in university systems for verification purposes."
      },
      {
        q: "How will I receive the documents?",
        a: "All documents are shipped via secure international courier (DHL/FedEx) with full tracking and signature confirmation. You'll receive updates throughout the delivery process."
      },
      {
        q: "What about the student ID card?",
        a: "The student ID includes your photo (which you'll provide), student number, university branding, security features, and is identical to official university IDs."
      },
      {
        q: "Can I order for a different graduation year?",
        a: "Yes, you can specify any graduation year that makes sense for your situation. We can create documents for past, current, or recent graduation dates."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/diplomas")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universities
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {diplomaData.universityName}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Complete Package</Badge>
                  <Badge variant="secondary">2 Week Delivery</Badge>
                  <Badge variant="secondary">Database Registration</Badge>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {diplomaData.description}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-bold text-lg">{diplomaData.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery</p>
                      <p className="font-bold text-lg">{diplomaData.deliveryTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-bold text-lg">6 Documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button 
                size="lg"
                onClick={() => navigate(`/apply?type=diploma&university=${diplomaData.universityName}`)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>

              <Button 
                size="lg"
                onClick={() => setShowCryptoEscrow(true)}
              >
                <Coins className="h-4 w-4 mr-2" />
                Pay with Crypto Escrow
              </Button>

              <Dialog open={showCryptoEscrow} onOpenChange={setShowCryptoEscrow}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Crypto Escrow Payment</DialogTitle>
                    <DialogDescription>
                      Secure payment with escrow protection
                    </DialogDescription>
                  </DialogHeader>
                  
                  {!escrowConfirmed ? (
                    <div className="space-y-4 py-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-4">
                          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-bold mb-2">Escrow Protection</h3>
                            <p className="text-sm text-muted-foreground">
                              Your payment will be held in escrow until you confirm delivery. The vendor will only receive payment after successful completion.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span><strong>Auto-release:</strong> 7 days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span><strong>Dispute protection</strong></span>
                          </div>
                        </div>
                      </div>

                      <Card className="p-4">
                        <h3 className="font-bold mb-3">Payment Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-bold">{diplomaData.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Package</span>
                            <span>{diplomaData.universityName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing</span>
                            <span>{diplomaData.deliveryTime}</span>
                          </div>
                        </div>
                      </Card>

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setEscrowConfirmed(true)}
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <Card className="p-4 bg-primary/5">
                        <h3 className="font-bold mb-3">Send Payment</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Cryptocurrency</p>
                            <p className="font-bold">USDT (TRC20)</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Amount</p>
                            <p className="font-bold">{diplomaData.price}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Wallet Address</p>
                            <div className="bg-background p-3 rounded border break-all font-mono text-xs">
                              TXhZ9kC3nH5LmqP7vW2BtN8KdY4JfR6Qg9
                            </div>
                          </div>
                        </div>
                      </Card>

                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          After sending payment, our team will verify the transaction and begin processing your order. You'll receive confirmation within 24 hours.
                        </p>
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          toast({
                            title: "Payment Instructions Sent",
                            description: "We'll notify you once the payment is confirmed and your application is processed.",
                          });
                          setShowCryptoEscrow(false);
                          setEscrowConfirmed(false);
                        }}
                      >
                        I've Sent the Payment
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button 
                size="lg"
                onClick={() => window.location.href = "mailto:diplomas@secureprintlabs.com"}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="package" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-primary/10">
              <TabsTrigger value="package" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Package Details</TabsTrigger>
              <TabsTrigger value="benefits" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Benefits</TabsTrigger>
              <TabsTrigger value="process" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Process</TabsTrigger>
              <TabsTrigger value="faq" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="package">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {diplomaData.packageIncludes.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {index === 0 && <Award className="h-5 w-5 text-primary" />}
                          {index === 1 && <FileText className="h-5 w-5 text-primary" />}
                          {index === 2 && <BookOpen className="h-5 w-5 text-primary" />}
                          {index === 3 && <IdCard className="h-5 w-5 text-primary" />}
                          {index === 4 && <Database className="h-5 w-5 text-primary" />}
                          {index === 5 && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {diplomaData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {diplomaData.process.map((step) => (
                      <div key={step.step} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            <Badge variant="secondary">{step.duration}</Badge>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {diplomaData.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiplomaDetail;
