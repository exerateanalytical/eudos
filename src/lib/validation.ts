import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  
  position: z.string()
    .trim()
    .min(2, { message: "Position is required" })
    .max(100, { message: "Position must be less than 100 characters" }),
  
  agency: z.string()
    .trim()
    .min(2, { message: "Agency is required" })
    .max(150, { message: "Agency must be less than 150 characters" }),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  
  phone: z.string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format" }),
  
  document_type: z.string()
    .min(1, { message: "Document type is required" }),
  
  quantity: z.string()
    .min(1, { message: "Quantity is required" }),
  
  urgency: z.string()
    .min(1, { message: "Urgency is required" }),
  
  department: z.string()
    .min(1, { message: "Department is required" }),
  
  specifications: z.string()
    .trim()
    .min(10, { message: "Please provide at least 10 characters of specifications" })
    .max(2000, { message: "Specifications must be less than 2000 characters" }),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  
  phone_number: z.string()
    .trim()
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number format" })
    .optional(),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  
  review_text: z.string()
    .trim()
    .min(10, { message: "Review must be at least 10 characters" })
    .max(1000, { message: "Review must be less than 1000 characters" }),
  
  product_id: z.string()
    .min(1, { message: "Product ID is required" }),
  
  product_type: z.string()
    .min(1, { message: "Product type is required" }),
});

// Support ticket validation schema
export const supportTicketSchema = z.object({
  subject: z.string()
    .trim()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  
  message: z.string()
    .trim()
    .min(20, { message: "Message must be at least 20 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
  
  category: z.string()
    .min(1, { message: "Category is required" }),
  
  priority: z.enum(['low', 'medium', 'high']).refine(
    (val) => ['low', 'medium', 'high'].includes(val),
    { message: "Invalid priority level" }
  ),
});

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password must be less than 72 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  
  full_name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" }),
  
  password: z.string()
    .min(1, { message: "Password is required" }),
});

// URL sanitization helper
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
}

// HTML sanitization helper (basic - for production use DOMPurify)
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
