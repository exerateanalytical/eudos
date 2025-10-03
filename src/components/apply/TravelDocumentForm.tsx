import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TravelDocumentFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  countries: string[];
}

export const TravelDocumentForm = ({ formData, onInputChange, countries }: TravelDocumentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="travelDocumentType">Document Type *</Label>
        <Select value={formData.travelDocumentType || ""} onValueChange={(val) => onInputChange("travelDocumentType", val)}>
          <SelectTrigger id="travelDocumentType">
            <SelectValue placeholder="Select document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tourist-visa">Tourist Visa</SelectItem>
            <SelectItem value="business-visa">Business Visa</SelectItem>
            <SelectItem value="student-visa">Student Visa</SelectItem>
            <SelectItem value="work-permit">Work Permit</SelectItem>
            <SelectItem value="residence-permit">Residence Permit</SelectItem>
            <SelectItem value="transit-visa">Transit Visa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destinationCountry">Destination Country *</Label>
          <Select value={formData.destinationCountry || ""} onValueChange={(val) => onInputChange("destinationCountry", val)}>
            <SelectTrigger id="destinationCountry">
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
          <Label htmlFor="visaDuration">Intended Duration *</Label>
          <Select value={formData.visaDuration || ""} onValueChange={(val) => onInputChange("visaDuration", val)}>
            <SelectTrigger id="visaDuration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-week">1 Week</SelectItem>
              <SelectItem value="2-weeks">2 Weeks</SelectItem>
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-months">3 Months</SelectItem>
              <SelectItem value="6-months">6 Months</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
              <SelectItem value="2-years">2 Years</SelectItem>
              <SelectItem value="5-years">5 Years (Multiple Entry)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plannedArrivalDate">Planned Arrival Date *</Label>
          <Input
            id="plannedArrivalDate"
            type="date"
            value={formData.plannedArrivalDate || ""}
            onChange={(e) => onInputChange("plannedArrivalDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plannedDepartureDate">Planned Departure Date</Label>
          <Input
            id="plannedDepartureDate"
            type="date"
            value={formData.plannedDepartureDate || ""}
            onChange={(e) => onInputChange("plannedDepartureDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purposeOfVisit">Purpose of Visit *</Label>
        <Textarea
          id="purposeOfVisit"
          placeholder="Describe the purpose of your visit in detail"
          value={formData.purposeOfVisit || ""}
          onChange={(e) => onInputChange("purposeOfVisit", e.target.value)}
          rows={3}
        />
      </div>

      {(formData.travelDocumentType === "business-visa" || formData.travelDocumentType === "work-permit") && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-semibold">Employment/Business Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="employerName">Employer/Sponsor Name *</Label>
            <Input
              id="employerName"
              placeholder="Company or organization name"
              value={formData.employerName || ""}
              onChange={(e) => onInputChange("employerName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title/Position *</Label>
            <Input
              id="jobTitle"
              placeholder="Your position"
              value={formData.jobTitle || ""}
              onChange={(e) => onInputChange("jobTitle", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employerAddress">Employer Address</Label>
              <Input
                id="employerAddress"
                placeholder="Business address"
                value={formData.employerAddress || ""}
                onChange={(e) => onInputChange("employerAddress", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerPhone">Employer Phone</Label>
              <Input
                id="employerPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.employerPhone || ""}
                onChange={(e) => onInputChange("employerPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryRange">Expected Salary Range (Annual)</Label>
            <Input
              id="salaryRange"
              placeholder="e.g., $50,000 - $75,000"
              value={formData.salaryRange || ""}
              onChange={(e) => onInputChange("salaryRange", e.target.value)}
            />
          </div>
        </div>
      )}

      {formData.travelDocumentType === "student-visa" && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-semibold">Educational Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="educationalInstitution">Educational Institution *</Label>
            <Input
              id="educationalInstitution"
              placeholder="University or school name"
              value={formData.educationalInstitution || ""}
              onChange={(e) => onInputChange("educationalInstitution", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseOfStudy">Course of Study *</Label>
              <Input
                id="courseOfStudy"
                placeholder="Program or major"
                value={formData.courseOfStudy || ""}
                onChange={(e) => onInputChange("courseOfStudy", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyLevel">Study Level *</Label>
              <Select value={formData.studyLevel || ""} onValueChange={(val) => onInputChange("studyLevel", val)}>
                <SelectTrigger id="studyLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="language-course">Language Course</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate/Masters</SelectItem>
                  <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseStartDate">Course Start Date *</Label>
              <Input
                id="courseStartDate"
                type="date"
                value={formData.courseStartDate || ""}
                onChange={(e) => onInputChange("courseStartDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseDuration">Course Duration</Label>
              <Input
                id="courseDuration"
                placeholder="e.g., 2 years, 4 semesters"
                value={formData.courseDuration || ""}
                onChange={(e) => onInputChange("courseDuration", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admissionNumber">Admission/Student Number</Label>
            <Input
              id="admissionNumber"
              placeholder="Student ID or admission number"
              value={formData.admissionNumber || ""}
              onChange={(e) => onInputChange("admissionNumber", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Accommodation Details</h4>
        
        <div className="space-y-2">
          <Label htmlFor="accommodationType">Accommodation Type</Label>
          <Select value={formData.accommodationType || ""} onValueChange={(val) => onInputChange("accommodationType", val)}>
            <SelectTrigger id="accommodationType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="rental">Rental Apartment/House</SelectItem>
              <SelectItem value="friend-family">Friend/Family</SelectItem>
              <SelectItem value="company-provided">Company Provided</SelectItem>
              <SelectItem value="student-housing">Student Housing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accommodationAddress">Accommodation Address</Label>
          <Input
            id="accommodationAddress"
            placeholder="Full address where you'll stay"
            value={formData.accommodationAddress || ""}
            onChange={(e) => onInputChange("accommodationAddress", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Financial Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="financialSupport">Source of Financial Support *</Label>
          <Select value={formData.financialSupport || ""} onValueChange={(val) => onInputChange("financialSupport", val)}>
            <SelectTrigger id="financialSupport">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal-savings">Personal Savings</SelectItem>
              <SelectItem value="employer">Employer</SelectItem>
              <SelectItem value="sponsor">Family/Sponsor</SelectItem>
              <SelectItem value="scholarship">Scholarship</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="multiple">Multiple Sources</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableFunds">Available Funds (USD)</Label>
          <Input
            id="availableFunds"
            type="number"
            placeholder="Estimated funds available"
            value={formData.availableFunds || ""}
            onChange={(e) => onInputChange("availableFunds", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousVisas">Previous Visas to This Country</Label>
        <Textarea
          id="previousVisas"
          placeholder="List any previous visas with dates (if applicable)"
          value={formData.previousVisas || ""}
          onChange={(e) => onInputChange("previousVisas", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="criminalRecord">Criminal Record Disclosure</Label>
        <Select value={formData.criminalRecord || ""} onValueChange={(val) => onInputChange("criminalRecord", val)}>
          <SelectTrigger id="criminalRecord">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No Criminal Record</SelectItem>
            <SelectItem value="yes">Yes - Will Provide Details</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
