import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GovernmentDocumentFormProps {
  documentType: string;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countries: string[];
}

export const GovernmentDocumentForm = ({ 
  documentType, 
  formData, 
  onInputChange, 
  countries 
}: GovernmentDocumentFormProps) => {
  return (
    <div className="space-y-6">
      {documentType === "birth" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="birthCertificateType">Certificate Type *</Label>
            <Select value={formData.birthCertificateType || ""} onValueChange={(val) => onInputChange("birthCertificateType", val)}>
              <SelectTrigger id="birthCertificateType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Birth Certificate</SelectItem>
                <SelectItem value="long-form">Long Form (with parent details)</SelectItem>
                <SelectItem value="short-form">Short Form</SelectItem>
                <SelectItem value="certified-copy">Certified Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital/Place of Birth *</Label>
              <Input
                id="hospitalName"
                placeholder="Hospital or location name"
                value={formData.hospitalName || ""}
                onChange={(e) => onInputChange("hospitalName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeOfBirth">Time of Birth</Label>
              <Input
                id="timeOfBirth"
                type="time"
                value={formData.timeOfBirth || ""}
                onChange={(e) => onInputChange("timeOfBirth", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
              <Input
                id="birthWeight"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={formData.birthWeight || ""}
                onChange={(e) => onInputChange("birthWeight", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthLength">Birth Length (cm)</Label>
              <Input
                id="birthLength"
                type="number"
                placeholder="50"
                value={formData.birthLength || ""}
                onChange={(e) => onInputChange("birthLength", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold">Mother's Information</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherFirstName">Mother's First Name *</Label>
                <Input
                  id="motherFirstName"
                  placeholder="First name"
                  value={formData.motherFirstName || ""}
                  onChange={(e) => onInputChange("motherFirstName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherLastName">Mother's Last Name *</Label>
                <Input
                  id="motherLastName"
                  placeholder="Last name"
                  value={formData.motherLastName || ""}
                  onChange={(e) => onInputChange("motherLastName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherMaidenName">Mother's Maiden Name</Label>
                <Input
                  id="motherMaidenName"
                  placeholder="Maiden name"
                  value={formData.motherMaidenName || ""}
                  onChange={(e) => onInputChange("motherMaidenName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherNationality">Mother's Nationality *</Label>
                <Select value={formData.motherNationality || ""} onValueChange={(val) => onInputChange("motherNationality", val)}>
                  <SelectTrigger id="motherNationality">
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

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold">Father's Information</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherFirstName">Father's First Name *</Label>
                <Input
                  id="fatherFirstName"
                  placeholder="First name"
                  value={formData.fatherFirstName || ""}
                  onChange={(e) => onInputChange("fatherFirstName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherLastName">Father's Last Name *</Label>
                <Input
                  id="fatherLastName"
                  placeholder="Last name"
                  value={formData.fatherLastName || ""}
                  onChange={(e) => onInputChange("fatherLastName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherNationality">Father's Nationality *</Label>
              <Select value={formData.fatherNationality || ""} onValueChange={(val) => onInputChange("fatherNationality", val)}>
                <SelectTrigger id="fatherNationality">
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

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Birth Registration Number (if known)</Label>
            <Input
              id="registrationNumber"
              placeholder="Registration number"
              value={formData.registrationNumber || ""}
              onChange={(e) => onInputChange("registrationNumber", e.target.value)}
            />
          </div>
        </>
      )}

      {documentType === "marriage" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type *</Label>
            <Select value={formData.certificateType || ""} onValueChange={(val) => onInputChange("certificateType", val)}>
              <SelectTrigger id="certificateType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marriage">Marriage Certificate</SelectItem>
                <SelectItem value="divorce">Divorce Certificate</SelectItem>
                <SelectItem value="annulment">Annulment Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.certificateType === "marriage" || !formData.certificateType) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="marriageDate">Marriage Date *</Label>
                <Input
                  id="marriageDate"
                  type="date"
                  value={formData.marriageDate || ""}
                  onChange={(e) => onInputChange("marriageDate", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marriagePlace">Place of Marriage *</Label>
                  <Input
                    id="marriagePlace"
                    placeholder="City, Church/Court name"
                    value={formData.marriagePlace || ""}
                    onChange={(e) => onInputChange("marriagePlace", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marriageCountry">Country *</Label>
                  <Select value={formData.marriageCountry || ""} onValueChange={(val) => onInputChange("marriageCountry", val)}>
                    <SelectTrigger id="marriageCountry">
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

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold">Spouse Information</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spouseFirstName">Spouse's First Name *</Label>
                    <Input
                      id="spouseFirstName"
                      placeholder="First name"
                      value={formData.spouseFirstName || ""}
                      onChange={(e) => onInputChange("spouseFirstName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseLastName">Spouse's Last Name *</Label>
                    <Input
                      id="spouseLastName"
                      placeholder="Last name"
                      value={formData.spouseLastName || ""}
                      onChange={(e) => onInputChange("spouseLastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="spouseDateOfBirth">Spouse's Date of Birth *</Label>
                    <Input
                      id="spouseDateOfBirth"
                      type="date"
                      value={formData.spouseDateOfBirth || ""}
                      onChange={(e) => onInputChange("spouseDateOfBirth", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spouseNationality">Spouse's Nationality *</Label>
                    <Select value={formData.spouseNationality || ""} onValueChange={(val) => onInputChange("spouseNationality", val)}>
                      <SelectTrigger id="spouseNationality">
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

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold">Witness Information</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="witness1Name">Witness 1 Name</Label>
                    <Input
                      id="witness1Name"
                      placeholder="Full name"
                      value={formData.witness1Name || ""}
                      onChange={(e) => onInputChange("witness1Name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="witness2Name">Witness 2 Name</Label>
                    <Input
                      id="witness2Name"
                      placeholder="Full name"
                      value={formData.witness2Name || ""}
                      onChange={(e) => onInputChange("witness2Name", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officiantName">Officiant/Registrar Name</Label>
                <Input
                  id="officiantName"
                  placeholder="Name of person who conducted ceremony"
                  value={formData.officiantName || ""}
                  onChange={(e) => onInputChange("officiantName", e.target.value)}
                />
              </div>
            </>
          )}

          {formData.certificateType === "divorce" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="divorceDate">Divorce Date *</Label>
                <Input
                  id="divorceDate"
                  type="date"
                  value={formData.divorceDate || ""}
                  onChange={(e) => onInputChange("divorceDate", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name *</Label>
                  <Input
                    id="courtName"
                    placeholder="Name of court"
                    value={formData.courtName || ""}
                    onChange={(e) => onInputChange("courtName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    placeholder="Divorce case number"
                    value={formData.caseNumber || ""}
                    onChange={(e) => onInputChange("caseNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spouseFullName">Former Spouse's Full Name *</Label>
                <Input
                  id="spouseFullName"
                  placeholder="Full name"
                  value={formData.spouseFullName || ""}
                  onChange={(e) => onInputChange("spouseFullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalMarriageDate">Original Marriage Date *</Label>
                <Input
                  id="originalMarriageDate"
                  type="date"
                  value={formData.originalMarriageDate || ""}
                  onChange={(e) => onInputChange("originalMarriageDate", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number (if known)</Label>
            <Input
              id="registrationNumber"
              placeholder="Certificate registration number"
              value={formData.registrationNumber || ""}
              onChange={(e) => onInputChange("registrationNumber", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};
