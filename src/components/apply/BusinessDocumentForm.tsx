import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessDocumentFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countries: string[];
}

export const BusinessDocumentForm = ({ formData, onInputChange, countries }: BusinessDocumentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessDocumentType">Document Type *</Label>
        <Select value={formData.businessDocumentType || ""} onValueChange={(val) => onInputChange("businessDocumentType", val)}>
          <SelectTrigger id="businessDocumentType">
            <SelectValue placeholder="Select document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business-license">Business License</SelectItem>
            <SelectItem value="incorporation">Certificate of Incorporation</SelectItem>
            <SelectItem value="tax-registration">Tax Registration Certificate</SelectItem>
            <SelectItem value="trade-license">Trade License</SelectItem>
            <SelectItem value="employer-id">Employer Identification (EIN)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Business Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="businessLegalName">Legal Business Name *</Label>
          <Input
            id="businessLegalName"
            placeholder="Official registered name"
            value={formData.businessLegalName || ""}
            onChange={(e) => onInputChange("businessLegalName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dbaName">DBA/Trading Name (if different)</Label>
          <Input
            id="dbaName"
            placeholder="Doing Business As name"
            value={formData.dbaName || ""}
            onChange={(e) => onInputChange("dbaName", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type *</Label>
            <Select value={formData.businessType || ""} onValueChange={(val) => onInputChange("businessType", val)}>
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="s-corp">S Corporation</SelectItem>
                <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                <SelectItem value="cooperative">Cooperative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industryType">Industry/Sector *</Label>
            <Select value={formData.industryType || ""} onValueChange={(val) => onInputChange("industryType", val)}>
              <SelectTrigger id="industryType">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="technology">Technology/IT</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="professional-services">Professional Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessDescription">Business Description *</Label>
          <Input
            id="businessDescription"
            placeholder="Brief description of business activities"
            value={formData.businessDescription || ""}
            onChange={(e) => onInputChange("businessDescription", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="incorporationDate">Incorporation/Start Date *</Label>
            <Input
              id="incorporationDate"
              type="date"
              value={formData.incorporationDate || ""}
              onChange={(e) => onInputChange("incorporationDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
            <Input
              id="fiscalYearEnd"
              placeholder="MM/DD (e.g., 12/31)"
              value={formData.fiscalYearEnd || ""}
              onChange={(e) => onInputChange("fiscalYearEnd", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Registration Details</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration/License Number</Label>
            <Input
              id="registrationNumber"
              placeholder="Business registration number"
              value={formData.registrationNumber || ""}
              onChange={(e) => onInputChange("registrationNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID/EIN</Label>
            <Input
              id="taxId"
              placeholder="Tax identification number"
              value={formData.taxId || ""}
              onChange={(e) => onInputChange("taxId", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationCountry">Country of Registration *</Label>
            <Select value={formData.registrationCountry || ""} onValueChange={(val) => onInputChange("registrationCountry", val)}>
              <SelectTrigger id="registrationCountry">
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

          <div className="space-y-2">
            <Label htmlFor="registrationState">State/Province *</Label>
            <Input
              id="registrationState"
              placeholder="State or province"
              value={formData.registrationState || ""}
              onChange={(e) => onInputChange("registrationState", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Principal Address</h4>
        
        <div className="space-y-2">
          <Label htmlFor="businessAddress">Street Address *</Label>
          <Input
            id="businessAddress"
            placeholder="Street address"
            value={formData.businessAddress || ""}
            onChange={(e) => onInputChange("businessAddress", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessCity">City *</Label>
            <Input
              id="businessCity"
              placeholder="City"
              value={formData.businessCity || ""}
              onChange={(e) => onInputChange("businessCity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessState">State/Province *</Label>
            <Input
              id="businessState"
              placeholder="State"
              value={formData.businessState || ""}
              onChange={(e) => onInputChange("businessState", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPostalCode">Postal Code *</Label>
            <Input
              id="businessPostalCode"
              placeholder="Postal code"
              value={formData.businessPostalCode || ""}
              onChange={(e) => onInputChange("businessPostalCode", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Owner/Director Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="numberOfOwners">Number of Owners/Directors *</Label>
          <Select value={formData.numberOfOwners || ""} onValueChange={(val) => onInputChange("numberOfOwners", val)}>
            <SelectTrigger id="numberOfOwners">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Owner</SelectItem>
              <SelectItem value="2">2 Owners</SelectItem>
              <SelectItem value="3">3 Owners</SelectItem>
              <SelectItem value="4">4 Owners</SelectItem>
              <SelectItem value="5+">5+ Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Principal Owner/Director Name *</Label>
            <Input
              id="ownerName"
              placeholder="Full name"
              value={formData.ownerName || ""}
              onChange={(e) => onInputChange("ownerName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerTitle">Title/Position *</Label>
            <Input
              id="ownerTitle"
              placeholder="e.g., CEO, Managing Director"
              value={formData.ownerTitle || ""}
              onChange={(e) => onInputChange("ownerTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Owner Email *</Label>
            <Input
              id="ownerEmail"
              type="email"
              placeholder="owner@company.com"
              value={formData.ownerEmail || ""}
              onChange={(e) => onInputChange("ownerEmail", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Owner Phone *</Label>
            <Input
              id="ownerPhone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.ownerPhone || ""}
              onChange={(e) => onInputChange("ownerPhone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownershipPercentage">Ownership Percentage</Label>
          <Input
            id="ownershipPercentage"
            type="number"
            placeholder="100"
            min="0"
            max="100"
            value={formData.ownershipPercentage || ""}
            onChange={(e) => onInputChange("ownershipPercentage", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfEmployees">Number of Employees</Label>
        <Select value={formData.numberOfEmployees || ""} onValueChange={(val) => onInputChange("numberOfEmployees", val)}>
          <SelectTrigger id="numberOfEmployees">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 (Just owner)</SelectItem>
            <SelectItem value="1-5">1-5 Employees</SelectItem>
            <SelectItem value="6-10">6-10 Employees</SelectItem>
            <SelectItem value="11-25">11-25 Employees</SelectItem>
            <SelectItem value="26-50">26-50 Employees</SelectItem>
            <SelectItem value="51-100">51-100 Employees</SelectItem>
            <SelectItem value="100+">100+ Employees</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
