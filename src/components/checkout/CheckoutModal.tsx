import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { countryCodes } from "@/lib/countryCodes";

const guestCheckoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone_e164: z.string().regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number. Must be in E.164 format"),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
});

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: (guestInfo: { name: string; phone: string; email?: string }) => void;
}

export function CheckoutModal({ open, onClose, onProceed }: CheckoutModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+1",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const phone_e164 = `${formData.countryCode}${formData.phoneNumber}`;
      const validated = guestCheckoutSchema.parse({
        name: formData.name,
        phone_e164,
        email: formData.email,
      });
      
      onProceed({
        name: validated.name,
        phone: validated.phone_e164,
        email: validated.email || undefined,
      });
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form fields and try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="checkout-description">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription id="checkout-description">
            Enter your details to proceed with your order
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => {
                  setFormData({ ...formData, countryCode: value });
                  setErrors({ ...errors, phone_e164: "" });
                }}
              >
                <SelectTrigger className="w-32 bg-background z-50">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phoneNumber: value });
                  setErrors({ ...errors, phone_e164: "" });
                }}
                placeholder="1234567890"
                required
                className="flex-1"
              />
            </div>
            {errors.phone_e164 && (
              <p className="text-sm text-destructive mt-1">{errors.phone_e164}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Proceed to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
