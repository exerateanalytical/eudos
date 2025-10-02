import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, GraduationCap, Clock, FileText, CheckCircle, Shield, Award, Download, Mail, ShoppingCart, Coins, IdCard, BookOpen, Database } from "lucide-react";
import { EscrowForm } from "@/components/EscrowForm";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewStatsCard } from "@/components/reviews/ReviewStatsCard";
import { useReviewStats } from "@/hooks/useReviewStats";
import { useState, useEffect } from "react";

const DiplomaDetail = () => {
  const { university } = useParams();
  const navigate = useNavigate();
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState("package");
  
  const universityName = university?.replace(/-/g, ' ') || "Harvard University";
  const reviewStats = useReviewStats("diploma", university || "");

  // Check for ?tab=reviews query param and scroll to reviews
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "reviews") {
      setActiveTab("reviews");
      setTimeout(() => {
        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);


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
    description: `Obtain an authentic ${universityName} diploma with comprehensive documentation package featuring premium parchment paper, embossed university seal, holographic security strip, and authorized signatures from the President and Registrar. Your complete package includes an official academic transcript showing all coursework, grades, and GPA on security paper with university letterhead; a professionally written 50-100 page thesis or capstone project tailored to your field of study; a laminated student ID card with photo, barcode, magnetic strip, and holographic seal; permanent registration in the university's alumni database for official verification; and a notarized verification letter on university letterhead. Fully customizable with your choice of degree type (Bachelor's, Master's, PhD), major, graduation year, GPA, and honors. All documents feature authentic security elements including watermarks, microprint borders, and raised seals. Professional processing completed in 2 weeks with secure international delivery via DHL or FedEx with full tracking and insurance.`,
    
    packageIncludes: [
      {
        title: "Official Diploma",
        description: "Authentic university diploma printed on premium parchment paper with official seal, embossed university logo, authorized signatures (President & Registrar), holographic security strip, watermark patterns, and raised seal imprint. Measures standard 11x14 inches with ornate border design matching university specifications."
      },
      {
        title: "Academic Transcript",
        description: "Complete official transcript showing all coursework, grades, credit hours, semester-by-semester breakdown, cumulative GPA (customizable), honors/distinctions, and registrar certification. Printed on security paper with university letterhead, microprint borders, and official seal."
      },
      {
        title: "Thesis/Project Documentation",
        description: "Professional thesis or capstone project documentation (50-100 pages) tailored to your field of study, including abstract, research methodology, findings, bibliography, and faculty approval signatures. Bound with university cover page and approval sheets."
      },
      {
        title: "Student ID Card",
        description: "Official laminated student ID card with your photo, student number, barcode, magnetic strip, holographic university seal, issue/expiry dates, and department information. Identical to authentic university IDs with all security features."
      },
      {
        title: "Database Registration",
        description: "Your complete student profile registered in the university's alumni database including enrollment dates, degree information, contact details, and graduation status. Enables verification through official university channels."
      },
      {
        title: "Verification Letter",
        description: "Official notarized letter on university letterhead from the Office of the Registrar confirming your degree completion, graduation date, major, and academic standing. Includes registrar signature, official seal, and contact information for verification."
      }
    ],
    
    benefits: [
      "100% authentic documentation with all security features including holograms, watermarks, and raised seals",
      "Premium quality parchment paper identical to official university stock",
      "Registered in official university systems and verifiable through alumni database",
      "Customizable degree type (Bachelor's, Master's, PhD), major, GPA, honors, and graduation year",
      "Worldwide recognition and acceptance by employers and institutions",
      "Complete package includes all supporting documents - nothing else needed",
      "Professional thesis/project specifically tailored to your chosen field of study",
      "Official student ID with photo that matches university security standards",
      "Fast 2-week processing with rush options available",
      "Secure international shipping via DHL/FedEx with full tracking and insurance",
      "Dedicated customer support team available 24/7 throughout the process",
      "Quality guarantee - we ensure all documents meet exact specifications",
      "Confidential service with secure handling of all personal information",
      "Money-back guarantee if not completely satisfied with quality"
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
        a: "Your complete package includes: (1) Official diploma (11x14\") on premium parchment with seal, signatures, and security features, (2) Complete academic transcript with all coursework and grades, (3) Thesis or school project documentation (50-100 pages) tailored to your field, (4) Laminated student ID card with photo and security features, (5) Database registration in university's alumni system, and (6) Notarized verification letter from registrar. All documents are authentic and properly formatted to match current university standards."
      },
      {
        q: "What security features are included on the diploma?",
        a: "The diploma includes multiple security features: embossed university seal with raised texture, holographic security strip that changes color, watermark patterns visible when held to light, microprint text around borders, official signatures (President and Registrar), serial number, premium parchment paper with anti-copy features, and ornate border design. These match the exact security features used by the university."
      },
      {
        q: "Can I customize my degree details?",
        a: "Yes! You can fully customize: degree type (Associate, Bachelor's, Master's, PhD, JD, MD, etc.), major/field of study, minor (if applicable), graduation date (month and year), GPA (we recommend 3.0-3.9 range), honors/distinctions (Cum Laude, Magna Cum Laude, Summa Cum Laude), and any special programs or certificates. We'll work with you to ensure everything is appropriate and realistic."
      },
      {
        q: "How does the database registration work?",
        a: "Your student information is registered in the university's alumni database with a complete student profile including: personal details, enrollment dates, degree information, major, graduation date, and contact information. This allows your degree to be verified through official university channels. The registration is permanent and can be confirmed by potential employers or institutions."
      },
      {
        q: "What about the thesis/project - how is it created?",
        a: "Based on your field of study and interests, our team of academic writers creates a professional 50-100 page thesis or capstone project. It includes: title page with university branding, abstract, table of contents, introduction, literature review, methodology, findings/results, discussion, conclusion, bibliography, and faculty approval signatures. The content is original, properly researched, and formatted according to university standards."
      },
      {
        q: "How long does the entire process take?",
        a: "Standard processing is exactly 2 weeks (14 days) from order confirmation to delivery at your door. This includes: 2-3 days for information verification and customization, 4-5 days for document creation, 2 days for database registration, 1 day for quality review, and 3-4 days for international shipping. Rush processing (7-10 days) is available for an additional fee."
      },
      {
        q: "Will my information be in the university database?",
        a: "Yes, your complete student profile will be permanently registered in the university's alumni database. This includes your name, student ID number, dates of enrollment, degree earned, major, graduation date, and current contact information. This allows your credentials to be verified if an employer or institution contacts the university's registrar office."
      },
      {
        q: "Can I choose my graduation year and transcript details?",
        a: "Absolutely! You can specify: graduation year (we recommend within the last 1-10 years for realism), semester/quarter system, number of years attended, specific courses taken (or let us create an appropriate course list for your major), grades for each course, cumulative GPA, any honors or awards, and transfer credits if applicable. The transcript will show a complete academic history."
      },
      {
        q: "How will I receive the documents?",
        a: "All documents are carefully packaged in a protective portfolio and shipped via secure international courier (DHL Express or FedEx International Priority) with full tracking, insurance, and signature confirmation. The diploma comes in a professional presentation folder, transcript is sealed in an official envelope, thesis is properly bound, and ID card is in a protective sleeve. You'll receive tracking information and delivery updates throughout the shipping process."
      },
      {
        q: "Is this legal and will it be accepted?",
        a: "The documents we provide are authentic replicas with all proper security features and database registration. They are designed for personal use, replacement of lost documents, or situations where you need official-looking documentation. Many clients use them successfully. However, you should be aware of local laws regarding document use and make informed decisions about how you use these materials."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
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
                variant="outline"
                onClick={() => setShowCryptoEscrow(true)}
              >
                <Coins className="h-4 w-4 mr-2" />
                Pay with Crypto Escrow (+1.5% fee)
              </Button>

              <EscrowForm
                open={showCryptoEscrow}
                onOpenChange={setShowCryptoEscrow}
                productName={diplomaData.universityName}
                productPrice={diplomaData.price}
                deliveryTime={diplomaData.deliveryTime}
              />

              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "mailto:support@secureprintlabs.com"}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Choose standard ordering or crypto escrow with buyer protection. Escrow adds a 1.5% fee for secure fund holding until delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-primary/10">
              <TabsTrigger value="package" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Package Details</TabsTrigger>
              <TabsTrigger value="benefits" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Benefits</TabsTrigger>
              <TabsTrigger value="process" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Process</TabsTrigger>
              <TabsTrigger value="reviews" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Reviews</TabsTrigger>
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

            <TabsContent value="reviews" id="reviews-section">
              <div className="space-y-6">
                <ReviewStatsCard
                  count={reviewStats.count}
                  averageRating={reviewStats.averageRating}
                  productName={diplomaData.universityName}
                />
                <ReviewForm
                  productType="diploma"
                  productId={university || ""}
                  onReviewSubmitted={() => setReviewsRefresh(prev => prev + 1)}
                />
                <ReviewsList
                  productType="diploma"
                  productId={university || ""}
                  refreshTrigger={reviewsRefresh}
                />
              </div>
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

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for premium educational credentials
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Authentic Materials</h3>
                <p className="text-muted-foreground">
                  Premium parchment paper, embossed seals, holographic security features, and watermarks identical to genuine university documents. Every detail matches official specifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Database Registration</h3>
                <p className="text-muted-foreground">
                  Complete student profile registered in university alumni databases, enabling verification through official channels. Your credentials can be confirmed by employers and institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Complete Package</h3>
                <p className="text-muted-foreground">
                  Six essential documents including diploma, transcript, thesis, student ID, verification letter, and database registration. Everything you need in one comprehensive package.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Tailored</h3>
                <p className="text-muted-foreground">
                  Fully customizable degree type, major, GPA, honors, graduation date, and thesis topic. Professional academic writers create content specifically for your field of study.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Two Week Delivery</h3>
                <p className="text-muted-foreground">
                  Fast turnaround with complete package delivered in exactly 2 weeks via secure international courier with tracking and insurance. Rush options available.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Assured</h3>
                <p className="text-muted-foreground">
                  Rigorous quality control ensures every document meets exact university standards. Money-back guarantee if not completely satisfied with the final product.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiplomaDetail;
