import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, CheckCircle, Clock, FileText, Users, TrendingUp, Shield, Award, Globe, Home, Download, Mail, Phone, MapPin, Building, ShoppingCart, Coins } from "lucide-react";
import { EscrowForm } from "@/components/EscrowForm";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { BitcoinCheckout } from "@/components/checkout/BitcoinCheckout";
import { Dialog, DialogContent } from "@/components/ui/dialog";


const CitizenshipDetail = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const [showCryptoEscrow, setShowCryptoEscrow] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showBitcoinCheckout, setShowBitcoinCheckout] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [guestInfo, setGuestInfo] = useState<any>(null);
  const [walletId, setWalletId] = useState<string>("");

  useEffect(() => {
    checkUser();
    fetchWallet();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchWallet = async () => {
    const { data, error } = await supabase
      .from('btc_wallets')
      .select('id, is_active, is_primary, xpub, derivation_path, next_index')
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Wallet fetch error:', error);
      return;
    }
    
    if (data) setWalletId(data.id);
  };

  const handleBuyNow = () => {
    if (!walletId) {
      toast({
        title: "Configuration Error",
        description: "Bitcoin wallet not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    if (user) {
      setShowBitcoinCheckout(true);
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleGuestProceed = (info: any) => {
    setGuestInfo(info);
    setShowBitcoinCheckout(true);
  };

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
  const tempCountryName = country?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Colombia";
  const isPremiumCountry = ["United States", "United Kingdom", "Canada", "USA", "UK"].includes(tempCountryName);
  const programPrice = isPremiumCountry ? "USD 50,000" : "USD 37,000";

  // Country flag mapping
  const countryFlags: Record<string, string> = {
    "Portugal": "🇵🇹",
    "Spain": "🇪🇸",
    "Greece": "🇬🇷",
    "Malta": "🇲🇹",
    "Cyprus": "🇨🇾",
    "Ireland": "🇮🇪",
    "Italy": "🇮🇹",
    "Colombia": "🇨🇴",
    "United States": "🇺🇸",
    "USA": "🇺🇸",
    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",
    "Canada": "🇨🇦",
    "Australia": "🇦🇺",
    "New Zealand": "🇳🇿",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Netherlands": "🇳🇱",
    "Belgium": "🇧🇪",
    "Austria": "🇦🇹",
    "Switzerland": "🇨🇭",
    "Turkey": "🇹🇷",
    "Dubai": "🇦🇪",
    "United Arab Emirates": "🇦🇪",
    "UAE": "🇦🇪",
  };

  const countryFlag = countryFlags[tempCountryName] || "🌍";

  const countryData = {
    flag: countryFlag,
    name: tempCountryName,
    gradient: "from-yellow-400 via-blue-700 to-red-600",
    minInvestment: programPrice,
    processingTime: "1 month",
    visaFreeAccess: "130+ countries",
    residenceType: "Full citizenship with complete documentation package",
    description: `Obtain ${tempCountryName} citizenship with a complete document package including passport, driver's license, and national ID card. Fast processing with no investment requirements.`,
    
    investmentOptions: [
      { 
        type: "Complete Citizenship Package", 
        amount: programPrice, 
        description: "All-inclusive package with no additional investment required. Includes full citizenship documentation and all associated identity documents." 
      },
      { 
        type: "What's Included", 
        amount: "Full Package", 
        description: `• ${tempCountryName} Passport (valid 10 years)\n• National Driver's License\n• National ID Card\n• Citizenship Certificate\n• All official government processing fees` 
      }
    ],
    
    benefits: [
      "Full citizenship status with all rights and privileges",
      `${tempCountryName} passport with visa-free access to 130+ countries`,
      `National driver's license valid throughout ${tempCountryName}`,
      "National ID card for all official transactions",
      `Right to live, work, and study anywhere in ${tempCountryName} permanently`,
      "No investment or capital requirements - simple flat fee",
      "Fast processing - receive all documents within 1 month",
      "Dual citizenship allowed - keep your current citizenship",
      "Complete legal documentation package included in price",
      `Access to ${tempCountryName} banking and financial services`,
      "Ability to purchase property and establish businesses",
      `${tempCountryName} social security and healthcare system access`,
      "No language test or residency requirements",
      "Strategic location with excellent connectivity",
      "High quality of life and modern infrastructure",
      "Favorable cost of living and business opportunities"
    ],
    
    requirements: [
      "Be over 18 years of age at the time of application",
      "Possess a valid passport from your country of origin",
      "Provide passport-style photographs (we'll guide specifications)",
      "Complete application form with accurate information",
      "Pay the program fee: " + programPrice,
      "No criminal background check required for initial application",
      "No minimum investment or capital requirements",
      "No language proficiency requirements",
      "No residency requirements - apply from anywhere in the world"
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
        q: "What documents are included in the package?",
        a: "Your complete citizenship package includes: (1) Colombian Passport valid for 10 years, (2) Colombian National Driver's License, (3) Colombian National ID Card (Cedula de Ciudadania), and (4) Official Citizenship Certificate. All documents are authentic and registered with the Colombian government."
      },
      {
        q: "How long does the entire process take?",
        a: "The complete process takes approximately 1 month from application submission to receiving your documents. This includes document preparation, processing, quality review, and secure international delivery."
      },
      {
        q: "Do I need to invest money or buy property?",
        a: "No investment is required. The only cost is the program fee of " + programPrice + " which covers all citizenship documents, processing fees, and delivery. There are no hidden costs or additional investment requirements."
      },
      {
        q: "Can I keep my current citizenship?",
        a: "Yes! Colombia allows dual citizenship, so you can maintain your current citizenship while also holding Colombian citizenship. You don't need to renounce your current nationality."
      },
      {
        q: "Do I need to speak Spanish?",
        a: "No, there are no language requirements for this program. All application processes can be completed in English, and you don't need to demonstrate Spanish proficiency."
      },
      {
        q: "Do I need to live in Colombia?",
        a: "No residency requirements exist for this program. You can apply from anywhere in the world and are not required to live in Colombia before or after receiving your citizenship."
      },
      {
        q: "What's the difference between US/UK/Canada and other countries?",
        a: "US, UK, and Canada citizenship programs cost USD 50,000 due to additional processing requirements and stronger passport benefits. All other countries cost USD 37,000. All packages include the same documents: passport, driver's license, and national ID card."
      },
      {
        q: "How will I receive my documents?",
        a: "All documents are delivered via secure international courier service with tracking and signature confirmation. You'll receive updates throughout the process and full tracking information for the delivery."
      },
      {
        q: "Is this legal and legitimate?",
        a: "Yes, all documents are authentic, legally registered, and issued through proper government channels. We work with authorized partners to ensure full compliance with all applicable laws and regulations."
      },
      {
        q: "Can I include family members?",
        a: "Each family member requires a separate application and fee. However, we offer family package discounts when multiple family members apply together. Contact us for special family pricing."
      }
    ],
    
    additionalInfo: {
      taxes: [
        "No additional tax obligations from the citizenship program itself",
        "Colombian residents pay income tax on worldwide income",
        "Non-residents only pay tax on Colombian-sourced income",
        "Competitive corporate tax rates for business establishment",
        "Tax treaties with multiple countries to avoid double taxation",
        "Consult with tax professional regarding your specific situation"
      ],
      lifestyle: [
        "Diverse geography from Caribbean beaches to Andean mountains",
        "Year-round warm tropical and subtropical climate",
        "Vibrant culture with rich history and traditions",
        "Affordable cost of living - up to 70% less than US/Europe",
        "Growing expat community especially in major cities",
        "Excellent coffee, cuisine, and hospitality",
        "Modern infrastructure in major urban centers",
        "Safe neighborhoods and gated communities available"
      ],
      businessOpportunities: [
        "Strategic location for trade throughout Latin America",
        "Growing economy with expanding middle class",
        "Free trade agreements with major markets",
        "Competitive labor costs for business operations",
        "Thriving sectors: agriculture, mining, tourism, technology",
        "Government incentives for foreign investment in certain sectors",
        "Access to Pacific and Atlantic ocean ports"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${countryData.name} Citizenship Program - Immigration Services | SecureDoc Solutions`}
        description={`${countryData.description} Processing time: ${countryData.processingTime}. Investment from ${countryData.minInvestment}.`}
        keywords={`${countryData.name} citizenship, immigration services, citizenship by investment, residence permit, ${countryData.name} passport`}
        canonicalUrl={`${baseUrl}/citizenship/${country}`}
      />
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
                onClick={handleBuyNow}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now with Bitcoin
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
                productName={`${countryData.name} Citizenship`}
                productPrice={programPrice}
                deliveryTime="1 month"
              />

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
            <p className="text-sm text-muted-foreground mt-4">
              Choose standard ordering or crypto escrow with buyer protection. Escrow adds a 1.5% fee for secure fund holding until delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="investment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-8 bg-primary/10">
              <TabsTrigger value="investment" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Investment Options</TabsTrigger>
              <TabsTrigger value="benefits" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Benefits</TabsTrigger>
              <TabsTrigger value="requirements" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Requirements</TabsTrigger>
              <TabsTrigger value="process" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Process</TabsTrigger>
              <TabsTrigger value="lifestyle" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Lifestyle</TabsTrigger>
              <TabsTrigger value="business" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">Business</TabsTrigger>
              <TabsTrigger value="faq" className="bg-primary text-primary-foreground data-[state=active]:bg-primary/80">FAQ</TabsTrigger>
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

      {/* Checkout Modals */}
      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onProceed={handleGuestProceed}
      />

      <Dialog open={showBitcoinCheckout} onOpenChange={setShowBitcoinCheckout}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <BitcoinCheckout
            walletId={walletId}
            productName={`${countryData.name} Residence Program`}
            productType="Citizenship"
            amountBTC={parseInt(countryData.minInvestment.replace(/[^0-9]/g, '')) / 50000}
            amountFiat={parseInt(countryData.minInvestment.replace(/[^0-9]/g, ''))}
            guestInfo={guestInfo}
            onPaymentComplete={() => {
              setShowBitcoinCheckout(false);
              navigate('/dashboard/orders');
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitizenshipDetail;
