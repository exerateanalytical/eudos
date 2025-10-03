import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IdentityDocumentFormProps {
  documentType: string;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countries: string[];
}

export const IdentityDocumentForm = ({ 
  documentType, 
  formData, 
  onInputChange, 
  countries 
}: IdentityDocumentFormProps) => {
  return (
    <div className="space-y-6">
      {/* Document-specific fields based on type */}
      {documentType === "passport" && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportType">Passport Type *</Label>
              <Select value={formData.passportType || ""} onValueChange={(val) => onInputChange("passportType", val)}>
                <SelectTrigger id="passportType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinary">Ordinary/Tourist</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="diplomatic">Diplomatic</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookletPages">Passport Pages *</Label>
              <Select value={formData.bookletPages || ""} onValueChange={(val) => onInputChange("bookletPages", val)}>
                <SelectTrigger id="bookletPages">
                  <SelectValue placeholder="Select pages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="32">32 Pages (Standard)</SelectItem>
                  <SelectItem value="48">48 Pages (Frequent Traveler)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousPassportNumber">Previous Passport Number (if renewal)</Label>
              <Input
                id="previousPassportNumber"
                placeholder="P12345678"
                value={formData.previousPassportNumber || ""}
                onChange={(e) => onInputChange("previousPassportNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousPassportIssueDate">Previous Issue Date</Label>
              <Input
                id="previousPassportIssueDate"
                type="date"
                value={formData.previousPassportIssueDate || ""}
                onChange={(e) => onInputChange("previousPassportIssueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelPurpose">Primary Travel Purpose *</Label>
            <Select value={formData.travelPurpose || ""} onValueChange={(val) => onInputChange("travelPurpose", val)}>
              <SelectTrigger id="travelPurpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tourism">Tourism</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="work">Work/Employment</SelectItem>
                <SelectItem value="family">Family Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {documentType === "drivers-license" && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licenseClass">License Class *</Label>
              <Select value={formData.licenseClass || ""} onValueChange={(val) => onInputChange("licenseClass", val)}>
                <SelectTrigger id="licenseClass">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classA">Class A - Commercial</SelectItem>
                  <SelectItem value="classB">Class B - Heavy Vehicle</SelectItem>
                  <SelectItem value="classC">Class C - Standard</SelectItem>
                  <SelectItem value="classD">Class D - Passenger</SelectItem>
                  <SelectItem value="classM">Class M - Motorcycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endorsements">Endorsements</Label>
              <Input
                id="endorsements"
                placeholder="e.g., Motorcycle, Hazmat"
                value={formData.endorsements || ""}
                onChange={(e) => onInputChange("endorsements", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="previousLicenseNumber">Previous License Number (if renewal)</Label>
              <Input
                id="previousLicenseNumber"
                placeholder="DL123456789"
                value={formData.previousLicenseNumber || ""}
                onChange={(e) => onInputChange("previousLicenseNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousLicenseExpiry">Previous Expiry Date</Label>
              <Input
                id="previousLicenseExpiry"
                type="date"
                value={formData.previousLicenseExpiry || ""}
                onChange={(e) => onInputChange("previousLicenseExpiry", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={formData.height || ""}
                onChange={(e) => onInputChange("height", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eyeColor">Eye Color *</Label>
              <Select value={formData.eyeColor || ""} onValueChange={(val) => onInputChange("eyeColor", val)}>
                <SelectTrigger id="eyeColor">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="hazel">Hazel</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restrictions">Restrictions</Label>
              <Input
                id="restrictions"
                placeholder="e.g., Glasses required"
                value={formData.restrictions || ""}
                onChange={(e) => onInputChange("restrictions", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organDonor">Organ Donor Status</Label>
            <Select value={formData.organDonor || ""} onValueChange={(val) => onInputChange("organDonor", val)}>
              <SelectTrigger id="organDonor">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes - Registered Donor</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {documentType === "id-card" && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idCardType">ID Card Type *</Label>
              <Select value={formData.idCardType || ""} onValueChange={(val) => onInputChange("idCardType", val)}>
                <SelectTrigger id="idCardType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard National ID</SelectItem>
                  <SelectItem value="electronic">Electronic ID (e-ID)</SelectItem>
                  <SelectItem value="biometric">Biometric ID</SelectItem>
                  <SelectItem value="voter">Voter ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousIDNumber">Previous ID Number (if renewal)</Label>
              <Input
                id="previousIDNumber"
                placeholder="ID123456789"
                value={formData.previousIDNumber || ""}
                onChange={(e) => onInputChange("previousIDNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select value={formData.bloodType || ""} onValueChange={(val) => onInputChange("bloodType", val)}>
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select value={formData.maritalStatus || ""} onValueChange={(val) => onInputChange("maritalStatus", val)}>
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation *</Label>
            <Input
              id="occupation"
              placeholder="Your profession"
              value={formData.occupation || ""}
              onChange={(e) => onInputChange("occupation", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
            <Input
              id="emergencyContact"
              placeholder="Full name of emergency contact"
              value={formData.emergencyContact || ""}
              onChange={(e) => onInputChange("emergencyContact", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyPhone"
              placeholder="+1 (555) 123-4567"
              value={formData.emergencyPhone || ""}
              onChange={(e) => onInputChange("emergencyPhone", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};
