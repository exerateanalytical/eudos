import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle, Clock, FileText, Users, TrendingUp, Shield, Award, Globe, Home, Download, Mail, Phone, MapPin, Building } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { toast } from "@/hooks/use-toast";


const CitizenshipDetail = () => {
  const { country } = useParams();
  const navigate = useNavigate();

  const generateBrochure = () => {
    const brochureContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${countryData.name} Residence by Investment Program - SecurePrint Labs</title>
  <style>
    @page { margin: 2cm; }
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 10px;
    }
    .tagline {
      color: #666;
      font-style: italic;
    }
    .country-header {
      background: linear-gradient(135deg, #0066cc 0%, #004999 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .country-flag {
      font-size: 48px;
      margin-bottom: 10px;
    }
    h1 { color: #0066cc; margin-top: 30px; }
    h2 { color: #004999; margin-top: 25px; border-bottom: 2px solid #0066cc; padding-bottom: 5px; }
    h3 { color: #666; margin-top: 20px; }
    .highlight-box {
      background: #f0f8ff;
      border-left: 4px solid #0066cc;
      padding: 15px;
      margin: 20px 0;
    }
    .benefit-list li {
      margin-bottom: 10px;
      padding-left: 10px;
    }
    .investment-option {
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #0066cc;
      text-align: center;
    }
    .contact-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .contact-item {
      margin: 10px 0;
      display: flex;
      align-items: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #0066cc;
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🔒 SecurePrint Labs</div>
    <div class="tagline">Global Citizenship & Investment Migration Solutions</div>
  </div>

  <div class="country-header">
    <div class="country-flag">${countryData.flag}</div>
    <h1 style="color: white; margin: 0;">${countryData.name} Residence by Investment Program</h1>
    <p style="margin-top: 10px; font-size: 18px;">${countryData.description}</p>
  </div>

  <div class="highlight-box">
    <h3 style="margin-top: 0;">Program Overview</h3>
    <table>
      <tr><th>Minimum Investment</th><td><strong>${countryData.minInvestment}</strong></td></tr>
      <tr><th>Processing Time</th><td>${countryData.processingTime}</td></tr>
      <tr><th>Visa-Free Access</th><td>${countryData.visaFreeAccess}</td></tr>
      <tr><th>Family Inclusion</th><td>Spouse, Children & Dependent Parents</td></tr>
    </table>
  </div>

  <h2>Investment Options</h2>
  ${countryData.investmentOptions.map(option => `
    <div class="investment-option">
      <h3>${option.type} - ${option.amount}</h3>
      <p>${option.description}</p>
    </div>
  `).join('')}

  <h2>Key Benefits</h2>
  <ul class="benefit-list">
    ${countryData.benefits.map(benefit => `<li>✓ ${benefit}</li>`).join('')}
  </ul>

  <h2>Eligibility Requirements</h2>
  <ul class="benefit-list">
    ${countryData.requirements.map(req => `<li>• ${req}</li>`).join('')}
  </ul>

  <h2>Application Process Timeline</h2>
  ${countryData.process.map(step => `
    <div class="investment-option">
      <h3>Step ${step.step}: ${step.title} (${step.duration})</h3>
      <p>${step.description}</p>
    </div>
  `).join('')}

  <h2>Why Choose ${countryData.name}?</h2>
  <div class="highlight-box">
    <ul class="benefit-list">
      <li><strong>Strategic Location:</strong> Gateway to European markets and beyond</li>
      <li><strong>Quality of Life:</strong> Excellent healthcare, education, and infrastructure</li>
      <li><strong>Business Opportunities:</strong> Thriving economy with investment potential</li>
      <li><strong>Family Benefits:</strong> Secure future for your family with EU access</li>
      <li><strong>Tax Advantages:</strong> Favorable tax regime for residents</li>
    </ul>
  </div>

  <h2>Frequently Asked Questions</h2>
  ${countryData.faqs.map(faq => `
    <div style="margin: 20px 0;">
      <h3>${faq.q}</h3>
      <p>${faq.a}</p>
    </div>
  `).join('')}

  <div class="contact-info">
    <h2 style="margin-top: 0;">Contact Information</h2>
    <div class="contact-item">
      <strong>📧 Email:</strong> citizenship@secureprintlabs.com
    </div>
    <div class="contact-item">
      <strong>📞 Phone:</strong> +1 (555) 123-4567
    </div>
    <div class="contact-item">
      <strong>🏢 Address:</strong> 123 Global Tower, Business District, New York, NY 10001
    </div>
    <div class="contact-item">
      <strong>🌐 Website:</strong> www.secureprintlabs.com
    </div>
  </div>

  <div class="footer">
    <p><strong>SecurePrint Labs</strong> - Your Trusted Partner in Global Mobility</p>
    <p style="font-size: 12px; color: #666;">
      This brochure is for informational purposes only. Investment requirements and program details are subject to change.
      Please consult with our advisors for the most current information and personalized guidance.
    </p>
    <p style="margin-top: 20px; color: #0066cc; font-weight: bold;">
      Schedule your free consultation today!
    </p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([brochureContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${countryData.name.replace(/ /g, '-')}-Residence-Program-Brochure.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Brochure Downloaded",
      description: `${countryData.name} program brochure has been downloaded. Open it in your browser and print to PDF for best results.`,
    });
  };

  // Mock data - in a real app, this would come from an API or data file
  const countryData = {
    flag: "🇵🇹",
    name: "Portugal",
    gradient: "from-green-600 to-red-600",
    minInvestment: "EUR 280,000",
    processingTime: "6-12 months",
    visaFreeAccess: "188 countries",
    residenceType: "Temporary residence permit (renewable)",
    description: "Portugal's Golden Residence Permit Program offers one of Europe's most attractive pathways to EU residence through investment, providing visa-free travel across the Schengen Area and a route to Portuguese citizenship.",
    
    investmentOptions: [
      { type: "Real Estate", amount: "EUR 280,000+", description: "Purchase property in designated low-density areas or properties over 30 years old requiring renovation" },
      { type: "Capital Transfer", amount: "EUR 500,000+", description: "Bank deposit or investment in Portuguese companies, research activities, or venture capital funds" },
      { type: "Job Creation", amount: "EUR 500,000+", description: "Create at least 10 permanent full-time jobs in Portugal" },
      { type: "Cultural Heritage", amount: "EUR 250,000+", description: "Investment in Portuguese cultural heritage, arts production, or national cultural patrimony" },
      { type: "Scientific Research", amount: "EUR 500,000+", description: "Capital transfer for research activities conducted by public or private scientific institutions" }
    ],
    
    benefits: [
      "Visa-free travel to 188 countries including all Schengen Area nations",
      "Right to live, work, and study anywhere in Portugal and access EU opportunities",
      "Path to Portuguese citizenship and EU passport after 5 years of legal residence",
      "EU residence benefits including access to healthcare and education systems",
      "No minimum stay requirements in first year (only 7 days per year average after)",
      "Include spouse, children under 26, and dependent parents or in-laws in application",
      "Access to high-quality Portuguese healthcare and world-class education",
      "Favorable tax regime options including Non-Habitual Resident (NHR) status",
      "Property ownership with potential rental income and capital appreciation",
      "Political and economic stability within the European Union",
      "Beautiful Mediterranean climate and exceptional quality of life",
      "No language requirement for residence permit (only for citizenship)"
    ],
    
    requirements: [
      "Be over 18 years of age at the time of application",
      "Possess a clean criminal record from country of origin and residence",
      "Hold valid health insurance covering medical expenses in Portugal",
      "Provide proof of legal origin of investment funds with supporting documentation",
      "No history of illegal stay in Portugal or Schengen area",
      "Investment must be maintained for minimum 5 years from date of approval",
      "Visit Portugal at least once per year (average 7 days annually)",
      "Have valid passport with minimum 6 months validity",
      "Demonstrate financial self-sufficiency for yourself and dependents"
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
        a: "Yes, the program allows you to include your spouse or partner, dependent children (under 18, or under 26 if studying and financially dependent), and dependent parents or parents-in-law (over 55 years old or incapacitated) in your application. All family members receive the same residence benefits."
      },
      {
        q: "Do I need to live in Portugal full-time?",
        a: "No, you only need to spend an average of 7 days per year in Portugal to maintain your residence permit. This makes it ideal for investors who want European residence flexibility while maintaining their business and life elsewhere."
      },
      {
        q: "Can I work in Portugal with this visa?",
        a: "Yes, the Golden Visa allows you to live, work, and study anywhere in Portugal. You have the same rights as Portuguese residents, including the ability to start a business or seek employment."
      },
      {
        q: "When can I apply for citizenship?",
        a: "You can apply for Portuguese citizenship after 5 years of legal residence, provided you meet the requirements including basic Portuguese language proficiency (A2 level), no serious criminal record, and sufficient ties to Portugal."
      },
      {
        q: "What are the tax implications?",
        a: "Portugal offers the Non-Habitual Resident (NHR) tax regime, which can provide significant tax advantages for new residents for up to 10 years. However, tax implications vary based on individual circumstances - we recommend consulting with a qualified tax advisor."
      },
      {
        q: "Can I sell the property after obtaining residence?",
        a: "You must maintain your qualifying investment for at least 5 years. After this period, you may sell the property while still maintaining your residence status, provided you continue to meet the minimum stay requirements."
      },
      {
        q: "Is Portuguese language required?",
        a: "No language requirement exists for obtaining or maintaining the Golden Visa residence permit. Language proficiency (A2 level) is only required if you wish to apply for Portuguese citizenship after 5 years."
      },
      {
        q: "How long does the application process take?",
        a: "The typical timeline is 6-12 months from initial investment to receiving your residence card. This includes property purchase/investment completion, document gathering, application submission, and approval. Expedited processing may be available in some cases."
      }
    ],
    
    additionalInfo: {
      taxes: [
        "Non-Habitual Resident (NHR) tax regime available for first 10 years",
        "Potential exemptions on foreign-sourced income",
        "Property tax (IMI) ranges from 0.3% to 0.8% annually",
        "Capital gains tax on property sales (may be exempt under certain conditions)",
        "Standard VAT rate of 23% (reduced rates for essential goods)"
      ],
      lifestyle: [
        "300+ days of sunshine per year in most regions",
        "Affordable cost of living compared to other Western European countries",
        "Excellent healthcare system ranked among Europe's best",
        "Safe country with very low crime rates",
        "Rich culture, history, and UNESCO World Heritage sites",
        "Growing expat community and English widely spoken in major cities",
        "Easy access to beaches, mountains, and countryside",
        "Thriving startup ecosystem and digital nomad scene"
      ],
      businessOpportunities: [
        "Strategic location for trade with EU, Africa, and Americas",
        "Competitive corporate tax rates (21% standard rate)",
        "EU single market access for businesses",
        "Growing tech and innovation sectors",
        "Strong tourism industry with investment opportunities",
        "Government incentives for job creation and innovation",
        "Simplified business registration processes"
      ]
    }
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

            <div className="flex gap-4 flex-wrap">
              <Button 
                size="lg" 
                onClick={() => navigate(`/apply?type=citizenship&country=${countryData.name}`)}
              >
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={generateBrochure}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Brochure
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:citizenship@secureprintlabs.com">Contact Advisor</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="investment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-8">
              <TabsTrigger value="investment">Investment Options</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
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

            <TabsContent value="lifestyle">
              <Card>
                <CardHeader>
                  <CardTitle>Lifestyle & Quality of Life</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-foreground">Why Choose {countryData.name} for Your New Life?</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {countryData.additionalInfo.lifestyle.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border">
                            <Home className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                      <h3 className="font-bold text-lg mb-3">Tax Information</h3>
                      <ul className="space-y-2">
                        {countryData.additionalInfo.taxes.map((tax, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                            <span className="text-muted-foreground">{tax}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-muted-foreground mt-4 italic">
                        * Tax advice should be sought from qualified professionals. Individual circumstances vary.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business & Investment Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-foreground">Why Invest in {countryData.name}?</h3>
                      <div className="grid gap-4">
                        {countryData.additionalInfo.businessOpportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start gap-3 p-5 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
                            <Building className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-muted-foreground">{opportunity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card/50 rounded-lg p-6 border-2 border-primary/20">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Investment Strategy Consultation
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Our expert advisors can help you identify the best investment opportunities aligned with your goals and the Golden Visa requirements.
                      </p>
                      <Button onClick={() => navigate(`/apply?type=citizenship&country=${countryData.name}`)}>
                        Schedule Consultation
                      </Button>
                    </div>
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
                  <Accordion type="single" collapsible className="w-full">
                    {countryData.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-bold">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
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

      {/* Contact Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">Our citizenship advisors are ready to assist you</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-semibold mb-2">Email</p>
                <a href="mailto:citizenship@secureprintlabs.com" className="text-sm text-muted-foreground hover:text-primary">
                  citizenship@secureprintlabs.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-semibold mb-2">Phone</p>
                <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-primary">
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-semibold mb-2">Address</p>
                <p className="text-sm text-muted-foreground">
                  123 Global Tower<br />New York, NY 10001
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-semibold mb-2">Website</p>
                <a href="/" className="text-sm text-muted-foreground hover:text-primary">
                  secureprintlabs.com
                </a>
              </CardContent>
            </Card>
          </div>
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
