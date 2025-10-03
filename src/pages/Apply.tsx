import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  CreditCard, 
  IdCard, 
  Globe, 
  GraduationCap,
  Shield,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Upload,
  Info,
  AlertTriangle,
  Baby,
  Heart,
  Car,
  Briefcase,
  Plane,
  Award,
  DollarSign,
  ChevronRight
} from "lucide-react";

const documentCategories = [
  { 
    id: "passport", 
    label: "Passport", 
    icon: FileText,
    description: "International travel document",
    processingTime: "7-10 business days",
    basePrice: 2500
  },
  { 
    id: "drivers-license", 
    label: "Driver's License", 
    icon: CreditCard,
    description: "State-issued driving permit",
    processingTime: "5-7 business days",
    basePrice: 800
  },
  { 
    id: "id-card", 
    label: "National ID Card", 
    icon: IdCard,
    description: "Government identification",
    processingTime: "5-7 business days",
    basePrice: 700
  },
  { 
    id: "diploma", 
    label: "Academic Diploma", 
    icon: GraduationCap,
    description: "Educational certificates",
    processingTime: "10-14 business days",
    basePrice: 1500
  },
  { 
    id: "certification", 
    label: "Professional Certification", 
    icon: Award,
    description: "Industry certifications",
    processingTime: "7-10 business days",
    basePrice: 1400
  },
  { 
    id: "birth", 
    label: "Birth Certificate", 
    icon: Baby,
    description: "Official birth record",
    processingTime: "5-7 business days",
    basePrice: 500
  },
  { 
    id: "marriage", 
    label: "Marriage Certificate", 
    icon: Heart,
    description: "Marriage & divorce records",
    processingTime: "5-7 business days",
    basePrice: 600
  },
  { 
    id: "vehicle", 
    label: "Vehicle Documents", 
    icon: Car,
    description: "Registration & title",
    processingTime: "3-5 business days",
    basePrice: 400
  },
  { 
    id: "business", 
    label: "Business Documents", 
    icon: Briefcase,
    description: "License & incorporation",
    processingTime: "7-10 business days",
    basePrice: 800
  },
  { 
    id: "travel", 
    label: "Visa/Work Permit", 
    icon: Plane,
    description: "Travel authorization",
    processingTime: "10-14 business days",
    basePrice: 1500
  },
  { 
    id: "citizenship", 
    label: "Citizenship by Investment", 
    icon: Globe,
    description: "Investment programs",
    processingTime: "30-90 business days",
    basePrice: 5000
  },
];

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Belgium", "Switzerland",
  "Austria", "Sweden", "Norway", "Denmark", "Finland", "Ireland",
  "New Zealand", "Japan", "Singapore", "Hong Kong", "South Korea"
];

const urgencyOptions = [
  { value: "standard", label: "Standard (No rush)", multiplier: 1 },
  { value: "expedited", label: "Expedited (+50%)", multiplier: 1.5 },
  { value: "rush", label: "Rush (+100%)", multiplier: 2 },
  { value: "emergency", label: "Emergency (+200%)", multiplier: 3 },
];

type Step = "document" | "details" | "upload" | "review" | "payment";

const Apply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>("document");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",
    gender: "",
    
    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    
    // Document-specific
    documentSubType: "",
    quantity: "1",
    urgency: "standard",
    additionalInfo: "",
    
    // Supporting files
    uploadedFiles: [] as File[],
  });

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("apply-form-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      setSelectedDocument(parsed.selectedDocument || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("apply-form-data", JSON.stringify({ ...formData, selectedDocument }));
  }, [formData, selectedDocument]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setSelectedDocument(type);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCategory = documentCategories.find(cat => cat.id === selectedDocument);
  const urgencyMultiplier = urgencyOptions.find(opt => opt.value === formData.urgency)?.multiplier || 1;
  const quantity = parseInt(formData.quantity) || 1;
  const basePrice = selectedCategory?.basePrice || 0;
  const subtotal = basePrice * quantity * urgencyMultiplier;
  const escrowFee = subtotal * 0.015;
  const total = subtotal + escrowFee;

  const getStepNumber = (step: Step): number => {
    const steps: Step[] = ["document", "details", "upload", "review", "payment"];
    return steps.indexOf(step) + 1;
  };

  const currentStepNumber = getStepNumber(currentStep);
  const totalSteps = 5;
  const progress = (currentStepNumber / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === "document" && !selectedDocument) {
      toast({
        title: "Selection Required",
        description: "Please select a document type to continue",
        variant: "destructive",
      });
      return;
    }

    const steps: Step[] = ["document", "details", "upload", "review", "payment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["document", "details", "upload", "review", "payment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "Your document application has been received. Our team will contact you within 24-48 hours.",
    });
    console.log("Application submitted:", { selectedDocument, formData, total });
    localStorage.removeItem("apply-form-data");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <FileText className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
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
            <button onClick={() => navigate("/apply")} className="text-primary font-medium">
              Apply
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-primary/20">
        <div className="absolute inset-0 bg-grid-primary/5" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="outline" className="bg-background/50 backdrop-blur">
                <Shield className="h-3 w-3 mr-1" />
                Secure Application
              </Badge>
              <Badge variant="outline" className="bg-background/50 backdrop-blur">
                <Lock className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
              <Badge variant="outline" className="bg-background/50 backdrop-blur">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              Professional Document Application
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Apply for official documents with advanced security features and escrow protection
            </p>
            
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Fast Processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Bar */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Application Progress</h3>
                  <span className="text-sm text-muted-foreground">Step {currentStepNumber} of {totalSteps}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className={currentStep === "document" ? "text-primary font-medium" : "text-muted-foreground"}>Document</span>
                  <span className={currentStep === "details" ? "text-primary font-medium" : "text-muted-foreground"}>Details</span>
                  <span className={currentStep === "upload" ? "text-primary font-medium" : "text-muted-foreground"}>Upload</span>
                  <span className={currentStep === "review" ? "text-primary font-medium" : "text-muted-foreground"}>Review</span>
                  <span className={currentStep === "payment" ? "text-primary font-medium" : "text-muted-foreground"}>Payment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert className="mb-8 border-primary/50 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Your data is protected:</strong> All information is encrypted and stored securely. We use escrow protection for all payments.
            </AlertDescription>
          </Alert>

          {/* Step 1: Document Selection */}
          {currentStep === "document" && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Select Document Type
                </CardTitle>
                <CardDescription>Choose the type of document you wish to apply for</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentCategories.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <Card
                        key={doc.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                          selectedDocument === doc.id
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedDocument(doc.id)}
                      >
                        <CardContent className="p-6 space-y-3">
                          <div className="flex items-start justify-between">
                            <Icon className={`h-10 w-10 ${selectedDocument === doc.id ? "text-primary" : "text-muted-foreground"}`} />
                            {selectedDocument === doc.id && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{doc.label}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {doc.processingTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                From ${doc.basePrice}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedDocument && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-semibold">What's Included:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Advanced security features and holograms</li>
                          <li>• Escrow payment protection</li>
                          <li>• 24/7 customer support</li>
                          <li>• Tracked delivery with insurance</li>
                          <li>• Quality guarantee or money back</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Details */}
          {currentStep === "details" && (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <IdCard className="h-6 w-6 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Provide your details as they should appear on the document</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        placeholder="Michael"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placeOfBirth">Place of Birth</Label>
                      <Input
                        id="placeOfBirth"
                        placeholder="City, Country"
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        required
                        placeholder="123 Main Street, Apt 4B"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          required
                          placeholder="10001"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Application Options</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max="10"
                          required
                          value={formData.quantity}
                          onChange={(e) => handleInputChange("quantity", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="urgency">Processing Speed *</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                          <SelectTrigger id="urgency">
                            <SelectValue placeholder="Select processing speed" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        rows={4}
                        placeholder="Any special instructions or requirements..."
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Price Calculator */}
              <Card className="shadow-lg border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-background">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Price Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Price ({formData.quantity}x ${basePrice})</span>
                      <span className="font-medium">${(basePrice * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Speed ({formData.urgency})</span>
                      <span className="font-medium">×{urgencyMultiplier}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Escrow Protection Fee (1.5%)</span>
                      <span className="font-medium">${escrowFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Upload Documents */}
          {currentStep === "upload" && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Upload className="h-6 w-6 text-primary" />
                  Supporting Documents
                </CardTitle>
                <CardDescription>Upload photos and supporting documents (optional but recommended)</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Uploading clear photos and documents will speed up processing. Accepted formats: JPG, PNG, PDF (max 10MB each)
                  </AlertDescription>
                </Alert>

                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Drag and drop files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {formData.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Uploaded Files:</h4>
                    <div className="space-y-2">
                      {formData.uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm">Recommended Documents:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Passport photo or existing ID</li>
                        <li>• Proof of address (utility bill)</li>
                        <li>• Birth certificate or supporting ID</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-semibold text-sm">Photo Guidelines:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Clear, well-lit images</li>
                        <li>• No filters or editing</li>
                        <li>• All text must be readable</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {currentStep === "review" && (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    Review Your Application
                  </CardTitle>
                  <CardDescription>Please verify all information before proceeding to payment</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Document Type
                    </h3>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="font-medium">{selectedCategory?.label}</p>
                      <p className="text-sm text-muted-foreground">{selectedCategory?.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <IdCard className="h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{formData.firstName} {formData.middleName} {formData.lastName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{formData.dateOfBirth || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {formData.address}, {formData.city}, {formData.state} {formData.postalCode}, {formData.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Order Summary
                    </h3>
                    <div className="space-y-3 p-4 bg-primary/5 rounded-lg">
                      <div className="flex justify-between">
                        <span>Quantity</span>
                        <span className="font-medium">{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Speed</span>
                        <span className="font-medium">{urgencyOptions.find(o => o.value === formData.urgency)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Escrow Fee (1.5%)</span>
                        <span className="font-medium">${escrowFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {formData.uploadedFiles.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Upload className="h-5 w-5 text-primary" />
                          Uploaded Documents
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{formData.uploadedFiles.length} file(s) uploaded</p>
                      </div>
                    </>
                  )}

                  <Alert className="border-primary/50 bg-primary/5">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      <strong>Escrow Protection Active:</strong> Your payment will be held securely until you confirm receipt and satisfaction with your documents.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === "payment" && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  Secure Payment
                </CardTitle>
                <CardDescription>Complete your payment to submit the application</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription>
                    <strong>Important:</strong> This application will proceed to escrow payment. Funds will be held securely until document delivery is confirmed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Summary</h3>
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold">Total Amount</span>
                      <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Protected by Escrow</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-primary/20">
                      <CardContent className="p-4 text-center">
                        <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Secure Holding</p>
                        <p className="text-xs text-muted-foreground mt-1">Funds held safely</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Confirm Receipt</p>
                        <p className="text-xs text-muted-foreground mt-1">You verify delivery</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="p-4 text-center">
                        <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold text-sm">Release Payment</p>
                        <p className="text-xs text-muted-foreground mt-1">After confirmation</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <Button 
                  size="lg" 
                  className="w-full text-lg h-14"
                  onClick={handleSubmit}
                >
                  Proceed to Escrow Payment
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === "document"}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep !== "payment" && (
              <Button
                size="lg"
                onClick={handleNext}
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
