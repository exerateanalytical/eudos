import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react";
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
  created_at: string;
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "guides",
    status: "draft",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    canonical_url: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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
      const dataToSave = {
        ...formData,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("cms_blog_posts")
          .update(dataToSave)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast({ title: "Blog post updated successfully" });
      } else {
        const { error } = await supabase.from("cms_blog_posts").insert([dataToSave]);

        if (error) throw error;
        toast({ title: "Blog post created successfully" });
      }

      setDialogOpen(false);
      setEditingPost(null);
      fetchPosts();
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
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase.from("cms_blog_posts").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Blog post deleted successfully" });
      fetchPosts();
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
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "guides",
      status: "draft",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      canonical_url: "",
    });
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "guides",
      status: post.status,
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      seo_keywords: post.seo_keywords || "",
      canonical_url: post.canonical_url || "",
    });
    setDialogOpen(true);
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "category",
      label: "Category",
      render: (row: BlogPost) => (
        <Badge variant="outline">{row.category || "Uncategorized"}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: BlogPost) => (
        <Badge variant={row.status === "published" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row: BlogPost) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: BlogPost) => (
        <div className="flex gap-2">
          {row.status === "published" && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open(`/blog/${row.slug}`, '_blank')}
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
        <p className="text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage blog posts with SEO
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(90vh-140px)] pr-4">
                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '');
                          setFormData({ ...formData, title, slug });
                        }}
                        placeholder="Enter post title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="url-friendly-slug"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guides">Guides</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="tips">Tips</SelectItem>
                          <SelectItem value="updates">Updates</SelectItem>
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Brief summary of the post (shown in previews)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.excerpt.length}/200 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <WYSIWYGEditor
                      value={formData.content}
                      onChange={(value) =>
                        setFormData({ ...formData, content: value })
                      }
                      placeholder="Write your blog post content here..."
                      minHeight="400px"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
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
                </TabsContent>
              </ScrollArea>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingPost(null);
                    resetForm();
                  }} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={posts}
          columns={columns}
          searchPlaceholder="Search blog posts..."
        />
      </Card>
    </div>
  );
}
