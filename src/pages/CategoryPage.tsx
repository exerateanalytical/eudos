import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import ProductsByCategory from "@/components/ProductsByCategory";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  parent_id: string | null;
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as Category;
    },
  });

  const { data: breadcrumbs } = useQuery({
    queryKey: ["breadcrumbs", category?.id],
    enabled: !!category,
    queryFn: async () => {
      const trail: Category[] = [];
      let current = category;

      while (current) {
        trail.unshift(current);
        if (current.parent_id) {
          const { data } = await supabase
            .from("product_categories")
            .select("*")
            .eq("id", current.parent_id)
            .single();
          current = data;
        } else {
          break;
        }
      }
      return trail;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Category not found</div>
      </div>
    );
  }

  const seoTitle = category.seo_title || `${category.name} | Global Citizen Documents`;
  const seoDescription = category.seo_description || category.description || `Browse ${category.name} products`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {category.og_image && <meta property="og:image" content={category.og_image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description,
            url: `${window.location.origin}/category/${category.slug}`,
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 1 && (
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-foreground">Home</a>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-foreground font-medium">{crumb.name}</span>
                  ) : (
                    <a href={`/category/${crumb.slug}`} className="hover:text-foreground">
                      {crumb.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Products Grid */}
          <ProductsByCategory categoryId={category.id} />
        </div>
      </div>
    </>
  );
}