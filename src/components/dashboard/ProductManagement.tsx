import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WYSIWYGEditor } from "@/components/admin/WYSIWYGEditor";
import { FeaturedImagePicker } from "@/components/admin/FeaturedImagePicker";
import { ImageGalleryManager } from "@/components/admin/ImageGalleryManager";
import { ProductAttributes } from "@/components/admin/ProductAttributes";
import { InventoryManagement } from "@/components/admin/InventoryManagement";
import { RelatedProducts } from "@/components/admin/RelatedProducts";
import { AdminSEOForm } from "@/components/admin/AdminSEOForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  category_type: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  country: string;
  status: string;
  image_url?: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category_type: "passport",
    name: "",
    slug: "",
    description: "",
    price: 0,
    country: "",
    status: "active",
    image_url: "",
    gallery_images: [] as string[],
    stock_quantity: 0,
    stock_status: "in_stock",
    sku: "",
    attributes: [] as Array<{ name: string; value: string }>,
    related_products: [] as string[],
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    canonical_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("cms_products")
          .update(formData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: "Product updated successfully" });
      } else {
        const { error } = await supabase.from("cms_products").insert([formData]);

        if (error) throw error;
        toast({ title: "Product created successfully" });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("cms_products").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Product deleted successfully" });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      category_type: "passport",
      name: "",
      slug: "",
      description: "",
      price: 0,
      country: "",
      status: "active",
      image_url: "",
      gallery_images: [],
      stock_quantity: 0,
      stock_status: "in_stock",
      sku: "",
      attributes: [],
      related_products: [],
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      canonical_url: "",
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category_type: product.category_type,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price || 0,
      country: product.country || "",
      status: product.status,
      image_url: product.image_url || "",
      gallery_images: (product as any).gallery_images || [],
      stock_quantity: (product as any).stock_quantity || 0,
      stock_status: (product as any).stock_status || "in_stock",
      sku: (product as any).sku || "",
      attributes: [],
      related_products: (product as any).related_products || [],
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
      seo_keywords: product.seo_keywords || "",
      canonical_url: product.canonical_url || "",
    });
    setDialogOpen(true);
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "category_type",
      label: "Category",
      render: (row: Product) => (
        <Badge variant="outline">{row.category_type}</Badge>
      ),
    },
    { key: "country", label: "Country" },
    {
      key: "price",
      label: "Price",
      render: (row: Product) => `$${row.price}`,
    },
    {
      key: "status",
      label: "Status",
      render: (row: Product) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Product) => (
        <div className="flex gap-2">
          {row.status === "active" && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(`/product/${row.slug}`, '_blank')}
              title="View Live"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Product Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage products and services with SEO
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="license">Driver License</SelectItem>
                      <SelectItem value="citizenship">Citizenship</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
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
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <FeaturedImagePicker
                value={formData.image_url || ''}
                onChange={(value) => setFormData({ ...formData, image_url: value })}
                label="Featured Image"
              />

              <ImageGalleryManager
                images={formData.gallery_images}
                onChange={(images) => setFormData({ ...formData, gallery_images: images })}
              />

              <div className="space-y-2">
                <Label>Description</Label>
                <WYSIWYGEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Write product description..."
                />
              </div>

              <InventoryManagement
                stockQuantity={formData.stock_quantity}
                stockStatus={formData.stock_status}
                sku={formData.sku}
                onStockQuantityChange={(value) => setFormData({ ...formData, stock_quantity: value })}
                onStockStatusChange={(value) => setFormData({ ...formData, stock_status: value })}
                onSkuChange={(value) => setFormData({ ...formData, sku: value })}
              />

              <ProductAttributes
                attributes={formData.attributes}
                onChange={(attrs) => setFormData({ ...formData, attributes: attrs })}
              />

              <RelatedProducts
                selectedIds={formData.related_products}
                onChange={(ids) => setFormData({ ...formData, related_products: ids })}
                currentProductId={editingProduct?.id}
              />

              <AdminSEOForm
                seoTitle={formData.seo_title}
                seoDescription={formData.seo_description}
                seoKeywords={formData.seo_keywords}
                canonicalUrl={formData.canonical_url}
                onSeoTitleChange={(value) =>
                  setFormData({ ...formData, seo_title: value })
                }
                onSeoDescriptionChange={(value) =>
                  setFormData({ ...formData, seo_description: value })
                }
                onSeoKeywordsChange={(value) =>
                  setFormData({ ...formData, seo_keywords: value })
                }
                onCanonicalUrlChange={(value) =>
                  setFormData({ ...formData, canonical_url: value })
                }
              />

              <Button onClick={handleSave} className="w-full">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={products}
          columns={columns}
          searchPlaceholder="Search products..."
        />
      </Card>
    </div>
  );
}
