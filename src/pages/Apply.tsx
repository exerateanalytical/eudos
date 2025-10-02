import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { FileText, CreditCard, IdCard, AlertCircle, Globe, GraduationCap } from "lucide-react";
import { Footer } from "@/components/Footer";

const documentTypes = [
  { id: "passport", label: "Passport", icon: FileText },
  { id: "drivers-license", label: "Driver's License", icon: CreditCard },
  { id: "id-card", label: "National ID Card", icon: IdCard },
  { id: "citizenship", label: "Citizenship by Investment", icon: Globe },
  { id: "diploma", label: "Academic Diploma/Certificate", icon: GraduationCap },
];


const Apply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDocument, setSelectedDocument] = useState("");
  const [applicationType, setApplicationType] = useState<"new" | "replacement">("new");
  const [replacementReason, setReplacementReason] = useState("");
  const [corrections, setCorrections] = useState({
    nameSpelling: false,
    dateOfBirth: false,
    nameChange: false,
  });
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
    postalCode: "",
    country: "",
    
    // Citizenship-specific fields
    citizenshipCountry: "",
    investmentType: "",
    investmentAmount: "",
    sourceOfFunds: "",
    currentCitizenship: "",
    
    // Diploma-specific fields
    institutionName: "",
    degreeType: "",
    fieldOfStudy: "",
    graduationYear: "",
    
    // Government Agency Information
    agencyName: "",
    department: "",
    position: "",
    employeeId: "",
    
    // Document Details
    currentDocumentNumber: "",
    issueDate: "",
    expiryDate: "",
    
    // Correction Details
    correctionDetails: "",
    
    // Application Details
    urgency: "",
    quantity: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const type = searchParams.get("type");
    const country = searchParams.get("country");
    
    if (type === "citizenship") {
      setSelectedDocument("citizenship");
      if (country) {
        setFormData(prev => ({ ...prev, citizenshipCountry: country }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCorrectionToggle = (field: keyof typeof corrections) => {
    setCorrections(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocument) {
      toast({
        title: "No Document Selected",
        description: "Please select a document type to apply for.",
        variant: "destructive",
      });
      return;
    }

    if (applicationType === "replacement" && !replacementReason) {
      toast({
        title: "Replacement Reason Required",
        description: "Please specify why you need a replacement document.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your document application has been received. Our team will contact you within 24-48 hours.",
    });

    console.log("Application submitted:", { 
      selectedDocument, 
      applicationType, 
      replacementReason,
      corrections,
      formData 
    });
  };

  return (
    <div className="min-h-screen bg-background">
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
            <button onClick={() => navigate("/about")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
              About
            </button>
            <button onClick={() => navigate("/apply")} className="text-primary font-medium">
              Apply
            </button>
            <button onClick={() => navigate("/faq")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">
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

      <div className="container mx-auto px-4 py-8">

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Document Application</h1>
            <p className="text-muted-foreground text-lg">
              Apply for official government documents with advanced security features
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Document Type</CardTitle>
                <CardDescription>
                  Choose the type of document you wish to apply for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedDocument} onValueChange={setSelectedDocument}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {documentTypes.map((doc) => {
                      const Icon = doc.icon;
                      return (
                        <div
                          key={doc.id}
                          className={`relative flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedDocument === doc.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedDocument(doc.id)}
                        >
                          <RadioGroupItem value={doc.id} id={doc.id} />
                          <Icon className="h-5 w-5 text-primary" />
                          <Label htmlFor={doc.id} className="font-medium cursor-pointer flex-1">
                            {doc.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Application Type */}
            {selectedDocument && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Application Type</CardTitle>
                  <CardDescription>
                    Specify if this is a new document or a replacement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={applicationType} onValueChange={(value) => setApplicationType(value as "new" | "replacement")}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          applicationType === "new"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setApplicationType("new")}
                      >
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new" className="font-medium cursor-pointer flex-1">
                          New Document
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          applicationType === "replacement"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setApplicationType("replacement")}
                      >
                        <RadioGroupItem value="replacement" id="replacement" />
                        <Label htmlFor="replacement" className="font-medium cursor-pointer flex-1">
                          Replacement Document
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Replacement Reason */}
                  {applicationType === "replacement" && (
                    <div className="space-y-4 animate-fade-in pt-4 border-t">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Reason for Replacement</span>
                      </div>
                      <RadioGroup value={replacementReason} onValueChange={setReplacementReason}>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="stolen" id="stolen" />
                            <Label htmlFor="stolen" className="font-normal cursor-pointer">
                              Document was stolen
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="lost" id="lost" />
                            <Label htmlFor="lost" className="font-normal cursor-pointer">
                              Document was lost
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="damaged" id="damaged" />
                            <Label htmlFor="damaged" className="font-normal cursor-pointer">
                              Document was damaged
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {/* Current Document Details */}
                      <div className="grid md:grid-cols-3 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentDocumentNumber">Current Document Number</Label>
                          <Input
                            id="currentDocumentNumber"
                            placeholder="e.g., P123456"
                            value={formData.currentDocumentNumber}
                            onChange={(e) => handleInputChange("currentDocumentNumber", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            type="date"
                            value={formData.issueDate}
                            onChange={(e) => handleInputChange("issueDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corrections Needed */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Corrections Needed (Optional)</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="nameSpelling"
                          checked={corrections.nameSpelling}
                          onCheckedChange={() => handleCorrectionToggle("nameSpelling")}
                        />
                        <Label htmlFor="nameSpelling" className="font-normal cursor-pointer">
                          Correct name spelling error
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="dateOfBirth"
                          checked={corrections.dateOfBirth}
                          onCheckedChange={() => handleCorrectionToggle("dateOfBirth")}
                        />
                        <Label htmlFor="dateOfBirth" className="font-normal cursor-pointer">
                          Correct date of birth
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="nameChange"
                          checked={corrections.nameChange}
                          onCheckedChange={() => handleCorrectionToggle("nameChange")}
                        />
                        <Label htmlFor="nameChange" className="font-normal cursor-pointer">
                          Legal name change
                        </Label>
                      </div>
                    </div>

                    {(corrections.nameSpelling || corrections.dateOfBirth || corrections.nameChange) && (
                      <div className="space-y-2 animate-fade-in">
                        <Label htmlFor="correctionDetails">Correction Details *</Label>
                        <Textarea
                          id="correctionDetails"
                          rows={3}
                          placeholder="Please provide details about the corrections needed..."
                          value={formData.correctionDetails}
                          onChange={(e) => handleInputChange("correctionDetails", e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Personal Information - Only for standard documents */}
            {selectedDocument && !["citizenship", "diploma"].includes(selectedDocument) && (
              <Card className="animate-fade-in">
                <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Provide your personal details as they should appear on the documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                    <Input
                      id="placeOfBirth"
                      required
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      required
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Citizenship Applicant Information */}
            {selectedDocument === "citizenship" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Primary Applicant Information</CardTitle>
                  <CardDescription>
                    Personal details of the main applicant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name(s)</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
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
                      <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                      <Input
                        id="placeOfBirth"
                        required
                        value={formData.placeOfBirth}
                        onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Current Nationality *</Label>
                      <Input
                        id="nationality"
                        required
                        value={formData.nationality}
                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentCitizenship">Passport Number *</Label>
                      <Input
                        id="currentCitizenship"
                        required
                        value={formData.currentCitizenship}
                        onChange={(e) => handleInputChange("currentCitizenship", e.target.value)}
                        placeholder="Current passport number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {selectedDocument && (
              <Card className="animate-fade-in">
                <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
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
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>


                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Citizenship-Specific Information */}
            {selectedDocument === "citizenship" && (
              <>
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Citizenship Program Details</CardTitle>
                    <CardDescription>
                      Specify your desired citizenship program and investment details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="citizenshipCountry">Desired Citizenship Country *</Label>
                      <Input
                        id="citizenshipCountry"
                        required
                        value={formData.citizenshipCountry}
                        onChange={(e) => handleInputChange("citizenshipCountry", e.target.value)}
                        placeholder="e.g., Portugal, Spain, Greece"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentType">Preferred Investment Type *</Label>
                      <Select value={formData.investmentType} onValueChange={(value) => handleInputChange("investmentType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select investment type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="real-estate">Real Estate Investment</SelectItem>
                          <SelectItem value="government-bonds">Government Bonds</SelectItem>
                          <SelectItem value="business">Business Investment / Job Creation</SelectItem>
                          <SelectItem value="donation">National Development Fund Donation</SelectItem>
                          <SelectItem value="capital-transfer">Capital Transfer / Bank Deposit</SelectItem>
                          <SelectItem value="undecided">Not Sure Yet - Need Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentAmount">Expected Investment Amount (EUR) *</Label>
                      <Input
                        id="investmentAmount"
                        type="number"
                        required
                        value={formData.investmentAmount}
                        onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
                        placeholder="e.g., 280000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sourceOfFunds">Source of Investment Funds *</Label>
                      <Textarea
                        id="sourceOfFunds"
                        required
                        rows={3}
                        value={formData.sourceOfFunds}
                        onChange={(e) => handleInputChange("sourceOfFunds", e.target.value)}
                        placeholder="Please describe the source of your investment funds (e.g., business income, property sale, inheritance, savings, etc.)"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Family & Dependents</CardTitle>
                    <CardDescription>
                      Information about family members to be included in the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="familyMembers">Number of Family Members to Include</Label>
                      <Select value={formData.quantity} onValueChange={(value) => handleInputChange("quantity", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="0">Just me (no family members)</SelectItem>
                          <SelectItem value="1">1 family member</SelectItem>
                          <SelectItem value="2">2 family members</SelectItem>
                          <SelectItem value="3">3 family members</SelectItem>
                          <SelectItem value="4">4 family members</SelectItem>
                          <SelectItem value="5+">5 or more family members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Family Members Details (Optional)</Label>
                      <Textarea
                        id="additionalInfo"
                        rows={4}
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                        placeholder="Please provide details about family members (spouse, children, parents): names, ages, relationship, etc."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Background & Timeline</CardTitle>
                    <CardDescription>
                      Additional information to help us process your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Desired Timeline *</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="urgent">Urgent (within 3 months)</SelectItem>
                          <SelectItem value="standard">Standard (3-6 months)</SelectItem>
                          <SelectItem value="flexible">Flexible (6-12 months)</SelectItem>
                          <SelectItem value="exploring">Just exploring options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="correctionDetails">Previous Citizenship Applications or Rejections</Label>
                      <Textarea
                        id="correctionDetails"
                        rows={3}
                        value={formData.correctionDetails}
                        onChange={(e) => handleInputChange("correctionDetails", e.target.value)}
                        placeholder="Have you previously applied for citizenship by investment in any country? If yes, please provide details..."
                      />
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="consultation"
                          checked={corrections.nameSpelling}
                          onCheckedChange={() => handleCorrectionToggle("nameSpelling")}
                        />
                        <Label htmlFor="consultation" className="font-normal cursor-pointer text-sm">
                          I would like a free consultation call before proceeding
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="visitSchedule"
                          checked={corrections.dateOfBirth}
                          onCheckedChange={() => handleCorrectionToggle("dateOfBirth")}
                        />
                        <Label htmlFor="visitSchedule" className="font-normal cursor-pointer text-sm">
                          I'm interested in scheduling a country visit
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="fullService"
                          checked={corrections.nameChange}
                          onCheckedChange={() => handleCorrectionToggle("nameChange")}
                        />
                        <Label htmlFor="fullService" className="font-normal cursor-pointer text-sm">
                          I need full-service assistance (legal, relocation, etc.)
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Diploma-Specific Information */}
            {selectedDocument === "diploma" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Academic Diploma Details</CardTitle>
                  <CardDescription>
                    Provide information about the academic diploma or certificate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name *</Label>
                    <Input
                      id="institutionName"
                      required
                      value={formData.institutionName}
                      onChange={(e) => handleInputChange("institutionName", e.target.value)}
                      placeholder="e.g., Harvard University"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degreeType">Degree Type *</Label>
                      <Select value={formData.degreeType} onValueChange={(value) => handleInputChange("degreeType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School Diploma</SelectItem>
                          <SelectItem value="associate">Associate Degree</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                          <SelectItem value="certificate">Professional Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        required
                        value={formData.graduationYear}
                        onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                        placeholder="e.g., 2020"
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                    <Input
                      id="fieldOfStudy"
                      required
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                      placeholder="e.g., Computer Science, Business Administration"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Government Agency Information - Only for standard documents */}
            {selectedDocument && !["citizenship", "diploma"].includes(selectedDocument) && (
              <Card className="animate-fade-in">
                <CardHeader>
                <CardTitle>Government Agency Information</CardTitle>
                <CardDescription>
                  Verify your government agency credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agencyName">Agency Name *</Label>
                    <Input
                      id="agencyName"
                      required
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange("agencyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      required
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title *</Label>
                    <Input
                      id="position"
                      required
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      required
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Application Details */}
            {selectedDocument && (
              <Card className="animate-fade-in">
                <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Processing Urgency *</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleInputChange("urgency", value)}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (2-3 weeks)</SelectItem>
                        <SelectItem value="expedited">Expedited (1 week)</SelectItem>
                        <SelectItem value="urgent">Urgent (3-5 days)</SelectItem>
                        <SelectItem value="emergency">Emergency (24-48 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    rows={4}
                    placeholder="Any special requirements or specifications..."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            )}

            {selectedDocument && (
              <Button type="submit" size="lg" className="w-full animate-fade-in">
                Submit Application
              </Button>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Apply;