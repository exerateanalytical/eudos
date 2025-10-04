import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  display_order: number;
  is_visible_in_menu: boolean;
  icon: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  children?: Category[];
  product_count?: number;
}

export default function CategoryManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "",
    display_order: 0,
    is_visible_in_menu: true,
    icon: "",
    seo_title: "",
    seo_description: "",
    og_image: "",
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("display_order");
      
      if (error) throw error;

      // Build hierarchy and get product counts
      const categoriesWithCounts = await Promise.all(
        data.map(async (cat) => {
          const { count } = await supabase
            .from("cms_products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", cat.id);
          
          return { ...cat, product_count: count || 0 };
        })
      );

      const buildTree = (parentId: string | null): Category[] => {
        return categoriesWithCounts
          .filter((cat) => cat.parent_id === parentId)
          .map((cat) => ({
            ...cat,
            children: buildTree(cat.id),
          }));
      };

      return buildTree(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("product_categories")
        .insert([{ ...data, parent_id: data.parent_id || null }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("product_categories")
        .update({ ...data, parent_id: data.parent_id || null })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parent_id: category.parent_id || "",
      display_order: category.display_order,
      is_visible_in_menu: category.is_visible_in_menu,
      icon: category.icon || "",
      seo_title: category.seo_title || "",
      seo_description: category.seo_description || "",
      og_image: category.og_image || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, category: Category) => {
    if (category.product_count && category.product_count > 0) {
      toast.error(`Cannot delete category with ${category.product_count} products`);
      return;
    }
    if (category.children && category.children.length > 0) {
      toast.error("Cannot delete category with subcategories");
      return;
    }
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parent_id: "",
      display_order: 0,
      is_visible_in_menu: true,
      icon: "",
      seo_title: "",
      seo_description: "",
      og_image: "",
    });
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getAllCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    const traverse = (items: Category[]) => {
      items.forEach((item) => {
        result.push(item);
        if (item.children) traverse(item.children);
      });
    };
    traverse(cats);
    return result;
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="border-b last:border-b-0">
        <div 
          className="flex items-center gap-3 py-3 hover:bg-muted/50"
          style={{ paddingLeft: `${level * 2}rem` }}
        >
          {hasChildren && (
            <button onClick={() => toggleExpand(category.id)} className="p-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <div className="flex-1">
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              {category.slug} • {category.product_count} products
              {!category.is_visible_in_menu && " • Hidden"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(category.id, category)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && category.children?.map((child) => renderCategory(child, level + 1))}
      </div>
    );
  };

  if (isLoading) return <div className="p-6">Loading categories...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Passports"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., passports"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Top Level)</SelectItem>
                      {categories && getAllCategories(categories).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_visible_in_menu}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible_in_menu: checked })}
                />
                <Label>Show in navigation menu</Label>
              </div>

              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={2}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border">
        {categories && categories.length > 0 ? (
          categories.map((category) => renderCategory(category))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No categories yet. Create your first category to get started.
          </div>
        )}
      </div>
    </div>
  );
}