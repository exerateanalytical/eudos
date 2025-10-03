import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EducationalDocumentFormProps {
  documentType: string;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countries: string[];
}

export const EducationalDocumentForm = ({ 
  documentType, 
  formData, 
  onInputChange, 
  countries 
}: EducationalDocumentFormProps) => {
  return (
    <div className="space-y-6">
      {(documentType === "diploma" || documentType === "certification") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="institutionName">Institution/Organization Name *</Label>
            <Input
              id="institutionName"
              placeholder="e.g., Harvard University, AWS, CompTIA"
              value={formData.institutionName || ""}
              onChange={(e) => onInputChange("institutionName", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institutionCountry">Institution Country *</Label>
              <Select value={formData.institutionCountry || ""} onValueChange={(val) => onInputChange("institutionCountry", val)}>
                <SelectTrigger id="institutionCountry">
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
              <Label htmlFor="institutionCity">Institution City *</Label>
              <Input
                id="institutionCity"
                placeholder="City name"
                value={formData.institutionCity || ""}
                onChange={(e) => onInputChange("institutionCity", e.target.value)}
              />
            </div>
          </div>

          {documentType === "diploma" && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degreeType">Degree Type *</Label>
                  <Select value={formData.degreeType || ""} onValueChange={(val) => onInputChange("degreeType", val)}>
                    <SelectTrigger id="degreeType">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School Diploma</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                      <SelectItem value="professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study *</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Computer Science"
                    value={formData.major || ""}
                    onChange={(e) => onInputChange("major", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minor">Minor (if applicable)</Label>
                <Input
                  id="minor"
                  placeholder="e.g., Mathematics"
                  value={formData.minor || ""}
                  onChange={(e) => onInputChange("minor", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA/Grade</Label>
                  <Input
                    id="gpa"
                    placeholder="e.g., 3.8/4.0 or First Class"
                    value={formData.gpa || ""}
                    onChange={(e) => onInputChange("gpa", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="honors">Honors/Distinctions</Label>
                  <Input
                    id="honors"
                    placeholder="e.g., Summa Cum Laude"
                    value={formData.honors || ""}
                    onChange={(e) => onInputChange("honors", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate || ""}
                    onChange={(e) => onInputChange("enrollmentDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationDate">Graduation Date *</Label>
                  <Input
                    id="graduationDate"
                    type="date"
                    value={formData.graduationDate || ""}
                    onChange={(e) => onInputChange("graduationDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID Number</Label>
                <Input
                  id="studentId"
                  placeholder="Your student identification number"
                  value={formData.studentId || ""}
                  onChange={(e) => onInputChange("studentId", e.target.value)}
                />
              </div>
            </>
          )}

          {documentType === "certification" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="certificationType">Certification Type *</Label>
                <Select value={formData.certificationType || ""} onValueChange={(val) => onInputChange("certificationType", val)}>
                  <SelectTrigger id="certificationType">
                    <SelectValue placeholder="Select certification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pmp">PMP (Project Management Professional)</SelectItem>
                    <SelectItem value="cpa">CPA (Certified Public Accountant)</SelectItem>
                    <SelectItem value="cisco">Cisco Certification (CCNA, CCNP)</SelectItem>
                    <SelectItem value="aws">AWS Certification</SelectItem>
                    <SelectItem value="comptia">CompTIA (A+, Security+, Network+)</SelectItem>
                    <SelectItem value="six-sigma">Six Sigma (Green/Black Belt)</SelectItem>
                    <SelectItem value="cfa">CFA (Chartered Financial Analyst)</SelectItem>
                    <SelectItem value="cism">CISM (Certified Information Security Manager)</SelectItem>
                    <SelectItem value="other">Other Professional Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.certificationType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="certificationName">Certification Name *</Label>
                  <Input
                    id="certificationName"
                    placeholder="Specify certification name"
                    value={formData.certificationName || ""}
                    onChange={(e) => onInputChange("certificationName", e.target.value)}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificationLevel">Certification Level</Label>
                  <Select value={formData.certificationLevel || ""} onValueChange={(val) => onInputChange("certificationLevel", val)}>
                    <SelectTrigger id="certificationLevel">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foundation">Foundation/Entry Level</SelectItem>
                      <SelectItem value="associate">Associate</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="expert">Expert/Advanced</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificationNumber">Certification Number</Label>
                  <Input
                    id="certificationNumber"
                    placeholder="Certification ID/Number"
                    value={formData.certificationNumber || ""}
                    onChange={(e) => onInputChange("certificationNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam/Completion Date *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={formData.examDate || ""}
                    onChange={(e) => onInputChange("examDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate || ""}
                    onChange={(e) => onInputChange("expiryDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificationScore">Certification Score/Result</Label>
                <Input
                  id="certificationScore"
                  placeholder="e.g., 850/1000 or Pass with Distinction"
                  value={formData.certificationScore || ""}
                  onChange={(e) => onInputChange("certificationScore", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="specialNotes">Special Notes/Requirements</Label>
            <Textarea
              id="specialNotes"
              placeholder="Any special requirements or additional information"
              value={formData.specialNotes || ""}
              onChange={(e) => onInputChange("specialNotes", e.target.value)}
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};
