# Admin Content Management Guide

## ✅ Complete Admin Panel Overview

Your admin panel is **fully functional** and ready to manage all site content including:

### 🎯 Product Categories Available
All product types are manageable through `/admin/products`:

1. **Passports** (`category_type: "passport"`)
2. **Driver's Licenses** (`category_type: "license"`)
3. **Citizenship Documents** (`category_type: "citizenship"`)
4. **Diplomas** (`category_type: "diploma"`)
5. **Certifications** (`category_type: "certification"`)

---

## 📍 Access Points

### Admin Panel URL
```
/admin
```

**Requirements:**
- User must be logged in
- User must have `admin` or `moderator` role in `user_roles` table

---

## 🛠️ Available Management Modules

### 1. **Product Management** (`/admin/products`)
**Features:**
- ✅ Create/Edit/Delete products for ALL categories
- ✅ Set pricing and country information
- ✅ Manage product status (Active/Inactive/Draft)
- ✅ Full SEO control (meta titles, descriptions, keywords, canonical URLs)
- ✅ View live products directly from admin panel
- ✅ Automatic slug generation
- ✅ Rich product descriptions

**Product Fields:**
- Category Type (Passport/License/Citizenship/Diploma/Certification)
- Name
- Slug (URL-friendly identifier)
- Description
- Price
- Country
- Status
- SEO metadata (title, description, keywords, canonical URL)

### 2. **Page Management** (`/admin/pages`)
**Features:**
- ✅ Create/Edit/Delete custom pages
- ✅ Rich text editor for page content
- ✅ Full SEO optimization
- ✅ Page status management (Published/Draft)
- ✅ View live pages

**Page Fields:**
- Title
- Slug
- Content (Rich text editor)
- Status
- SEO metadata

### 3. **Blog Management** (`/admin/blog`)
**Features:**
- ✅ Create/Edit/Delete blog posts
- ✅ Rich text editor with formatting
- ✅ Category management
- ✅ Featured images
- ✅ Excerpt & full content
- ✅ Author assignment
- ✅ Publication scheduling
- ✅ Full SEO control

### 4. **User Management** (`/admin/users`)
**Features:**
- ✅ View all users
- ✅ Edit user roles (Admin/Moderator/User)
- ✅ View detailed user profiles
- ✅ Track user orders and applications
- ✅ Delete users
- ✅ User statistics dashboard

### 5. **Order Management** (`/admin/orders`)
- ✅ View all customer orders
- ✅ Update order status
- ✅ Filter by product type
- ✅ Payment tracking

### 6. **Application Management** (`/admin/applications`)
- ✅ Track document applications
- ✅ Update application status
- ✅ Review submitted documents

### 7. **Inquiry Management** (`/admin/inquiries`)
- ✅ View contact form submissions
- ✅ Reply to inquiries
- ✅ Thread-based conversation system
- ✅ Status management

### 8. **Support Tickets** (`/admin/support`)
- ✅ Manage customer support tickets
- ✅ Reply to tickets
- ✅ Mark tickets as resolved
- ✅ Priority management

### 9. **Review Moderation** (`/admin/reviews`)
- ✅ Approve/Reject customer reviews
- ✅ Reply to reviews
- ✅ Manage review visibility

### 10. **Analytics Dashboard** (`/admin`)
- ✅ Overview of all system metrics
- ✅ User statistics
- ✅ Order analytics
- ✅ Revenue tracking

---

## 🎨 Product Management Workflow

### Adding a New Product (e.g., US Passport)

1. **Navigate** to `/admin/products`
2. Click **"Add Product"** button
3. **Fill in details:**
   - Category: Select "Passport"
   - Name: "United States Passport"
   - Slug: "us-passport" (auto-generated)
   - Country: "United States"
   - Price: 299.99
   - Description: Rich text description
   - Status: "Active"
4. **SEO Settings:**
   - SEO Title: "Buy Authentic US Passport | Fast Processing"
   - SEO Description: "Get your US passport quickly..."
   - Keywords: "us passport, american passport, buy passport"
   - Canonical URL: "/product/us-passport"
5. Click **"Create Product"**

### Editing Existing Products

1. Go to `/admin/products`
2. Find the product in the table
3. Click the **Edit (pencil)** icon
4. Modify fields as needed
5. Click **"Update Product"**

### Managing Product Visibility

Products have three statuses:
- **Active**: Visible on the site, purchasable
- **Inactive**: Hidden from public view
- **Draft**: Work in progress, not public

---

## 📄 Page Management Workflow

### Creating Custom Pages

1. Navigate to `/admin/pages`
2. Click **"Add Page"**
3. **Enter details:**
   - Title: "Privacy Policy"
   - Slug: "privacy-policy"
   - Content: Use rich text editor
   - Status: "Published"
4. **Configure SEO**
5. Click **"Create Page"**

---

## 🔐 Security & Permissions

### Role-Based Access
- **Admin**: Full access to all features
- **Moderator**: Limited access (no user deletion, settings modification)
- **User**: No admin panel access

### Database Security
All content management uses Row-Level Security (RLS) policies:
- Admins/Moderators can manage all content
- Public can only view published/active content
- Draft content is hidden from non-admin users

---

## 📊 Database Structure

### Products Table (`cms_products`)
```sql
- id: UUID
- category_type: TEXT (passport|license|citizenship|diploma|certification)
- name: TEXT
- slug: TEXT (unique)
- description: TEXT
- price: NUMERIC
- country: TEXT
- status: TEXT (active|inactive|draft)
- seo_title: TEXT
- seo_description: TEXT
- seo_keywords: TEXT
- canonical_url: TEXT
- image_url: TEXT
- features: JSONB
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Pages Table (`cms_pages`)
```sql
- id: UUID
- title: TEXT
- slug: TEXT (unique)
- content: TEXT
- status: TEXT (published|draft)
- seo_title: TEXT
- seo_description: TEXT
- seo_keywords: TEXT
- canonical_url: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## 🎯 Quick Actions

### View Live Content
Each product/page has an **"Eye"** icon in the admin table:
- Click to open the live page in a new tab
- Only visible for published/active content

### Bulk Operations
Currently, you can:
- Search/filter products by name, category, country
- Sort by any column
- Delete individual items

---

## 🚀 Getting Started Checklist

- [x] Admin routes configured (`/admin/*`)
- [x] Admin sidebar with all modules
- [x] Product management for all 5 categories
- [x] Page management with rich editor
- [x] Blog management
- [x] User role management
- [x] SEO optimization for all content types
- [x] Real-time preview links
- [x] Secure RLS policies

---

## 💡 Tips for Best Results

1. **Always set SEO metadata** - Improves search visibility
2. **Use descriptive slugs** - Better URLs for users and search engines
3. **Keep product descriptions detailed** - Helps customers make decisions
4. **Monitor analytics** - Track which products perform best
5. **Regular content updates** - Keep information current

---

## 🎉 System Status

✅ **FULLY OPERATIONAL** - All content management features are ready to use!

Access your admin panel at: `/admin` (requires admin/moderator role)
