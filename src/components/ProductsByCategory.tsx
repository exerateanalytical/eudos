import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  image_url: string | null;
  country: string | null;
  status: string;
}

interface ProductsByCategoryProps {
  categoryId: string;
}

export default function ProductsByCategory({ categoryId }: ProductsByCategoryProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_products")
        .select("*")
        .eq("category_id", categoryId)
        .eq("status", "active")
        .order("name");
      
      if (error) throw error;
      return data as Product[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products available in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {product.image_url && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              {product.country && (
                <Badge variant="secondary" className="shrink-0">
                  {product.country}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {product.description}
            </p>
            {product.price && (
              <p className="text-2xl font-bold mb-4">
                ${product.price.toLocaleString()}
              </p>
            )}
            <Link to={`/p/${product.slug}`}>
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}