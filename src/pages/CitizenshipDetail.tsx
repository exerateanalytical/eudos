import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Clock, FileText, Users, TrendingUp, Shield, Award, Globe, Home } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

const CitizenshipDetail = () => {
  const { country } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API or data file
  const countryData = {
    flag: "🇵🇹",
    name: "Portugal",
    gradient: "from-green-600 to-red-600",
    minInvestment: "EUR 280,000",
    processingTime: "6-12 months",
    visaFreeAccess: "188 countries",
    description: "Portugal's Golden Residence Permit Program offers one of Europe's most attractive pathways to EU residence through investment, providing visa-free travel across the Schengen Area and a route to Portuguese citizenship.",
    
    investmentOptions: [
      { type: "Real Estate", amount: "EUR 280,000+", description: "Purchase property in designated low-density areas" },
      { type: "Capital Transfer", amount: "EUR 500,000+", description: "Bank deposit or investment in Portuguese companies" },
      { type: "Job Creation", amount: "EUR 500,000+", description: "Create at least 10 permanent jobs" },
      { type: "Cultural Heritage", amount: "EUR 250,000+", description: "Investment in Portuguese cultural heritage or arts" }
    ],
    
    benefits: [
      "Visa-free travel to 188 countries including Schengen Area",
      "Right to live, work, and study anywhere in Portugal",
      "Path to Portuguese citizenship after 5 years",
      "EU residence benefits",
      "No minimum stay requirements in first year",
      "Include spouse, children, and dependent parents",
      "Access to Portuguese healthcare and education systems",
      "Favorable tax regime options available"
    ],
    
    requirements: [
      "Be over 18 years of age",
      "Clean criminal record",
      "Valid health insurance",
      "Proof of investment funds",
      "No illegal stay in Portugal or Schengen area",
      "Investment must be maintained for minimum 5 years"
    ],
    
    process: [
      { step: 1, title: "Initial Consultation", description: "Discuss eligibility and investment options with our advisors", duration: "1-2 weeks" },
      { step: 2, title: "Investment Selection", description: "Choose and complete your qualifying investment", duration: "1-3 months" },
      { step: 3, title: "Document Preparation", description: "Gather and prepare all required documentation", duration: "2-4 weeks" },
      { step: 4, title: "Application Submission", description: "Submit application to Portuguese immigration authorities", duration: "1 week" },
      { step: 5, title: "Biometrics & Interview", description: "Provide biometrics and attend interview if required", duration: "2-4 weeks" },
      { step: 6, title: "Approval & Residence Card", description: "Receive approval and collect residence permit card", duration: "3-6 months" }
    ],
    
    faqs: [
      {
        q: "Can I include my family members?",
        a: "Yes, the program allows you to include your spouse, dependent children (under 26 if studying), and dependent parents or in-laws in your application."
      },
      {
        q: "Do I need to live in Portugal full-time?",
        a: "No, you only need to spend an average of 7 days per year in Portugal to maintain your residence permit."
      },
      {
        q: "Can I work in Portugal with this visa?",
        a: "Yes, the Golden Visa allows you to live, work, and study anywhere in Portugal."
      },
      {
        q: "When can I apply for citizenship?",
        a: "You can apply for Portuguese citizenship after 5 years of legal residence, provided you meet language and other requirements."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />

      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${countryData.gradient} opacity-10`} />
        <div className="container mx-auto relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/citizenship")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-7xl">{countryData.flag}</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {countryData.name} Residence Program
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Golden Visa</Badge>
                  <Badge variant="secondary">EU Access</Badge>
                  <Badge variant="secondary">Path to Citizenship</Badge>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {countryData.description}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-bold text-lg">{countryData.minInvestment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Processing</p>
                      <p className="font-bold text-lg">{countryData.processingTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Visa-free</p>
                      <p className="font-bold text-lg">{countryData.visaFreeAccess}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate(`/apply?type=citizenship&country=${countryData.name}`)}
              >
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="investment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="investment">Investment Options</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="investment">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {countryData.investmentOptions.map((option, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg">{option.type}</h3>
                          <Badge variant="outline">{option.amount}</Badge>
                        </div>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {countryData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {countryData.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{req}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {countryData.process.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            <Badge variant="outline">{step.duration}</Badge>
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
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {countryData.faqs.map((faq, index) => (
                      <div key={index} className="pb-6 border-b last:border-0">
                        <h3 className="font-bold text-lg mb-2 text-foreground">{faq.q}</h3>
                        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Application?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our expert team will guide you through every step of the process
          </p>
          <Button 
            size="lg"
            onClick={() => navigate(`/apply?type=citizenship&country=${countryData.name}`)}
          >
            Begin Application Process
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CitizenshipDetail;
