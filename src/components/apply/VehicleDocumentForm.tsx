import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleDocumentFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export const VehicleDocumentForm = ({ formData, onInputChange }: VehicleDocumentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="documentType">Document Type *</Label>
        <Select value={formData.vehicleDocumentType || ""} onValueChange={(val) => onInputChange("vehicleDocumentType", val)}>
          <SelectTrigger id="documentType">
            <SelectValue placeholder="Select document" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="registration">Vehicle Registration</SelectItem>
            <SelectItem value="title">Vehicle Title</SelectItem>
            <SelectItem value="both">Registration & Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Vehicle Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
          <Input
            id="vin"
            placeholder="17-character VIN"
            maxLength={17}
            value={formData.vin || ""}
            onChange={(e) => onInputChange("vin", e.target.value.toUpperCase())}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleYear">Year *</Label>
            <Input
              id="vehicleYear"
              type="number"
              placeholder="2024"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.vehicleYear || ""}
              onChange={(e) => onInputChange("vehicleYear", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleMake">Make *</Label>
            <Input
              id="vehicleMake"
              placeholder="e.g., Toyota, Ford"
              value={formData.vehicleMake || ""}
              onChange={(e) => onInputChange("vehicleMake", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Model *</Label>
            <Input
              id="vehicleModel"
              placeholder="e.g., Camry, F-150"
              value={formData.vehicleModel || ""}
              onChange={(e) => onInputChange("vehicleModel", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleColor">Color *</Label>
            <Input
              id="vehicleColor"
              placeholder="e.g., Black, Silver"
              value={formData.vehicleColor || ""}
              onChange={(e) => onInputChange("vehicleColor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type *</Label>
            <Select value={formData.vehicleType || ""} onValueChange={(val) => onInputChange("vehicleType", val)}>
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van/Minivan</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="rv">RV/Motorhome</SelectItem>
                <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="e.g., 45000"
              value={formData.mileage || ""}
              onChange={(e) => onInputChange("mileage", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select value={formData.fuelType || ""} onValueChange={(val) => onInputChange("fuelType", val)}>
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="plugin-hybrid">Plug-in Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Ownership Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="ownershipType">Ownership Type *</Label>
          <Select value={formData.ownershipType || ""} onValueChange={(val) => onInputChange("ownershipType", val)}>
            <SelectTrigger id="ownershipType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="joint">Joint Ownership</SelectItem>
              <SelectItem value="business">Business/Company</SelectItem>
              <SelectItem value="leased">Leased</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.ownershipType === "joint" && (
          <div className="space-y-2">
            <Label htmlFor="coOwnerName">Co-Owner Name *</Label>
            <Input
              id="coOwnerName"
              placeholder="Full name of co-owner"
              value={formData.coOwnerName || ""}
              onChange={(e) => onInputChange("coOwnerName", e.target.value)}
            />
          </div>
        )}

        {formData.ownershipType === "business" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              placeholder="Registered business name"
              value={formData.businessName || ""}
              onChange={(e) => onInputChange("businessName", e.target.value)}
            />
          </div>
        )}

        {formData.ownershipType === "leased" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leasingCompany">Leasing Company *</Label>
              <Input
                id="leasingCompany"
                placeholder="Company name"
                value={formData.leasingCompany || ""}
                onChange={(e) => onInputChange("leasingCompany", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaseEndDate">Lease End Date</Label>
              <Input
                id="leaseEndDate"
                type="date"
                value={formData.leaseEndDate || ""}
                onChange={(e) => onInputChange("leaseEndDate", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase/Acquisition Date *</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate || ""}
            onChange={(e) => onInputChange("purchaseDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
          <Input
            id="purchasePrice"
            type="number"
            placeholder="25000"
            value={formData.purchasePrice || ""}
            onChange={(e) => onInputChange("purchasePrice", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-semibold">Insurance & Registration</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceCompany">Insurance Company</Label>
            <Input
              id="insuranceCompany"
              placeholder="Company name"
              value={formData.insuranceCompany || ""}
              onChange={(e) => onInputChange("insuranceCompany", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
            <Input
              id="insurancePolicyNumber"
              placeholder="Insurance policy number"
              value={formData.insurancePolicyNumber || ""}
              onChange={(e) => onInputChange("insurancePolicyNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPlateNumber">Current Plate Number (if any)</Label>
            <Input
              id="currentPlateNumber"
              placeholder="ABC-1234"
              value={formData.currentPlateNumber || ""}
              onChange={(e) => onInputChange("currentPlateNumber", e.target.value.toUpperCase())}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationState">Registration State/Province *</Label>
            <Input
              id="registrationState"
              placeholder="e.g., California, Ontario"
              value={formData.registrationState || ""}
              onChange={(e) => onInputChange("registrationState", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousOwners">Number of Previous Owners</Label>
        <Select value={formData.previousOwners || ""} onValueChange={(val) => onInputChange("previousOwners", val)}>
          <SelectTrigger id="previousOwners">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">New Vehicle (0)</SelectItem>
            <SelectItem value="1">1 Previous Owner</SelectItem>
            <SelectItem value="2">2 Previous Owners</SelectItem>
            <SelectItem value="3">3 Previous Owners</SelectItem>
            <SelectItem value="4+">4+ Previous Owners</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
