import { z } from "zod";

// User validation schemas
export const userProfileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone_number: z.string().optional(),
});

export const userRoleSchema = z.object({
  role: z.enum(["admin", "moderator", "user"]),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category_type: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive").optional(),
  status: z.enum(["active", "inactive", "draft"]),
  seo_title: z.string().max(60, "SEO title should be less than 60 characters").optional(),
  seo_description: z.string().max(160, "SEO description should be less than 160 characters").optional(),
  seo_keywords: z.string().optional(),
});

// Order validation schemas
export const orderSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_type: z.string().min(1, "Product type is required"),
  total_amount: z.number().positive("Amount must be positive"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
});

// Application validation schemas
export const applicationSchema = z.object({
  document_type: z.string().min(1, "Document type is required"),
  country: z.string().min(1, "Country is required"),
  status: z.enum(["submitted", "under_review", "approved", "rejected"]),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

// Inquiry validation schemas
export const inquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  position: z.string().min(1, "Position is required"),
  agency: z.string().min(1, "Agency is required"),
  department: z.string().min(1, "Department is required"),
  document_type: z.string().min(1, "Document type is required"),
  quantity: z.string().min(1, "Quantity is required"),
  urgency: z.string().min(1, "Urgency is required"),
  specifications: z.string().min(10, "Specifications must be at least 10 characters"),
  status: z.enum(["pending", "contacted", "quoted", "closed"]),
});

// Support ticket validation schemas
export const supportTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  category: z.enum(["technical", "billing", "general", "feature_request"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "waiting", "resolved", "closed"]),
});

// Blog post validation schemas
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
  seo_keywords: z.string().optional(),
});

// Page validation schemas
export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["draft", "published", "archived"]),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
  seo_keywords: z.string().optional(),
});

// Review validation schemas
export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review_text: z.string().min(10, "Review must be at least 10 characters").max(1000),
  status: z.enum(["pending", "approved", "rejected"]),
});

// Email notification schema
export const emailNotificationSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  recipientType: z.enum(["all", "role", "specific"]),
  recipientEmail: z.string().email().optional(),
  selectedRole: z.enum(["admin", "moderator", "user"]).optional(),
});

// Payment/Transaction validation
export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters (e.g., USD)"),
  transaction_type: z.string().min(1, "Transaction type is required"),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
