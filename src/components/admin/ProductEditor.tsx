import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_type: "",
    category_id: "",
    country: "",
    price: "",
    sku: "",
    stock_quantity: "",
    stock_status: "in_stock",
    status: "active",
    image_url: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    focus_keyword: "",
    related_keywords: [] as string[],
    tags: [] as string[],
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    schema_type: "Product",
    twitter_card_type: "summary_large_image",
    noindex: false,
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("name");
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const loadProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load product");
      navigate("/admin/products");
    } else if (data) {
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        category_type: data.category_type || "",
        category_id: data.category_id || "",
        country: data.country || "",
        price: data.price?.toString() || "",
        sku: data.sku || "",
        stock_quantity: data.stock_quantity?.toString() || "",
        stock_status: data.stock_status || "in_stock",
        status: data.status || "active",
        image_url: data.image_url || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: data.seo_keywords || "",
        focus_keyword: data.focus_keyword || "",
        related_keywords: data.related_keywords || [],
        tags: data.tags || [],
        og_title: data.og_title || "",
        og_description: data.og_description || "",
        og_image: data.og_image || "",
        canonical_url: data.canonical_url || "",
        schema_type: data.schema_type || "Product",
        twitter_card_type: data.twitter_card_type || "summary_large_image",
        noindex: data.noindex || false,
      });
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.related_keywords.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        related_keywords: [...prev.related_keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      related_keywords: prev.related_keywords.filter((k) => k !== keyword),
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category_type: formData.category_type,
      category_id: formData.category_id || null,
      country: formData.country || null,
      price: formData.price ? parseFloat(formData.price) : null,
      sku: formData.sku || null,
      stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
      stock_status: formData.stock_status,
      status: formData.status,
      image_url: formData.image_url || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      seo_keywords: formData.seo_keywords || null,
      focus_keyword: formData.focus_keyword || null,
      related_keywords: formData.related_keywords,
      tags: formData.tags,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image: formData.og_image || null,
      canonical_url: formData.canonical_url || null,
      schema_type: formData.schema_type,
      twitter_card_type: formData.twitter_card_type,
      noindex: formData.noindex,
    };

    if (id) {
      // Update existing product
      const { error } = await supabase
        .from("cms_products")
        .update(productData)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update product");
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      }
    } else {
      // Create new product
      const { error } = await supabase
        .from("cms_products")
        .insert(productData);

      if (error) {
        toast.error("Failed to create product");
      } else {
        toast.success("Product created successfully");
        navigate("/admin/products");
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {id ? "Edit Product" : "New Product"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="product-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_type">Category Type</Label>
                  <Select
                    value={formData.category_type}
                    onValueChange={(value) => handleInputChange("category_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="citizenship">Citizenship</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Product Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="e.g., USA, UK"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Product SKU"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_status">Stock Status</Label>
                  <Select
                    value={formData.stock_status}
                    onValueChange={(value) => handleInputChange("stock_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      <SelectItem value="on_backorder">On Backorder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => handleInputChange("seo_title", e.target.value)}
                  placeholder="SEO optimized title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange("seo_description", e.target.value)}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus_keyword">Focus Keyword</Label>
                <Input
                  id="focus_keyword"
                  value={formData.focus_keyword}
                  onChange={(e) => handleInputChange("focus_keyword", e.target.value)}
                  placeholder="Main SEO keyword"
                />
              </div>

              <div className="space-y-2">
                <Label>Related Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a related keyword"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.related_keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={formData.canonical_url}
                  onChange={(e) => handleInputChange("canonical_url", e.target.value)}
                  placeholder="https://example.com/product"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="noindex"
                  checked={formData.noindex}
                  onChange={(e) => handleInputChange("noindex", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="noindex" className="cursor-pointer">
                  No Index (Hide from search engines)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Open Graph</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og_title">Open Graph Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title}
                  onChange={(e) => handleInputChange("og_title", e.target.value)}
                  placeholder="Title for social media shares"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_description">Open Graph Description</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description}
                  onChange={(e) => handleInputChange("og_description", e.target.value)}
                  placeholder="Description for social media shares"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og_image">Open Graph Image</Label>
                <Input
                  id="og_image"
                  value={formData.og_image}
                  onChange={(e) => handleInputChange("og_image", e.target.value)}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_card_type">Twitter Card Type</Label>
                <Select
                  value={formData.twitter_card_type}
                  onValueChange={(value) => handleInputChange("twitter_card_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schema_type">Schema Type</Label>
                <Select
                  value={formData.schema_type}
                  onValueChange={(value) => handleInputChange("schema_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}