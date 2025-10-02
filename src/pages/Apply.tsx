import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { FileText, CreditCard, IdCard, GraduationCap, ArrowLeft } from "lucide-react";

const documentTypes = [
  { id: "passport", label: "Registered Passport", icon: FileText },
  { id: "drivers-license", label: "Driver's License", icon: CreditCard },
  { id: "id-card", label: "National ID Card", icon: IdCard },
  { id: "diploma", label: "Educational Diploma", icon: GraduationCap },
];

const Apply = () => {
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
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
    
    // Government Agency Information
    agencyName: "",
    department: "",
    position: "",
    employeeId: "",
    
    // Application Details
    urgency: "",
    quantity: "",
    additionalInfo: "",
  });

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document type to apply for.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: "Your document application has been received. Our team will contact you within 24-48 hours.",
    });

    console.log("Application submitted:", { selectedDocuments, formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

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
                <CardTitle>Select Documents</CardTitle>
                <CardDescription>
                  Choose the document types you wish to apply for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {documentTypes.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocuments.includes(doc.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleDocumentToggle(doc.id)}
                      >
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={() => handleDocumentToggle(doc.id)}
                        />
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
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
                      <SelectContent>
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

            {/* Contact Information */}
            <Card>
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

                <div className="grid md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>

            {/* Government Agency Information */}
            <Card>
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

            {/* Application Details */}
            <Card>
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

            <Button type="submit" size="lg" className="w-full">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;