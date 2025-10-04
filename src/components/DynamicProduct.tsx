import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const DynamicProduct = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['cms-product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{product.seo_title || product.name}</title>
        <meta name="description" content={product.seo_description || product.description} />
        {product.seo_keywords && <meta name="keywords" content={product.seo_keywords} />}
        {product.canonical_url && <link rel="canonical" href={product.canonical_url} />}
        {product.noindex && <meta name="robots" content="noindex,nofollow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={product.og_title || product.seo_title || product.name} />
        <meta property="og:description" content={product.og_description || product.seo_description || product.description} />
        {product.og_image && <meta property="og:image" content={product.og_image} />}
        <meta property="og:type" content="product" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={product.twitter_card_type || 'summary_large_image'} />
        <meta name="twitter:title" content={product.og_title || product.seo_title || product.name} />
        <meta name="twitter:description" content={product.og_description || product.seo_description || product.description} />
        {product.og_image && <meta name="twitter:image" content={product.og_image} />}
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": product.stock_status === 'in_stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4">
                {product.category_type}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-6">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            <div 
              className="prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {product.features && Array.isArray(product.features) && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Features:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature: any, index: number) => (
                    <li key={index}>{typeof feature === 'string' ? feature : feature.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button size="lg" className="w-full md:w-auto">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Order Now
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};
