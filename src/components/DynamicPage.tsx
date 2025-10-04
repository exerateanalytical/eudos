import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Skeleton } from "@/components/ui/skeleton";

export const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug || 'home')
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{page.seo_title || page.title}</title>
        <meta name="description" content={page.seo_description || ''} />
        {page.seo_keywords && <meta name="keywords" content={page.seo_keywords} />}
        {page.canonical_url && <link rel="canonical" href={page.canonical_url} />}
        {page.noindex && <meta name="robots" content="noindex,nofollow" />}
        
        {/* Open Graph */}
        <meta property="og:title" content={page.og_title || page.seo_title || page.title} />
        <meta property="og:description" content={page.og_description || page.seo_description || ''} />
        {page.og_image && <meta property="og:image" content={page.og_image} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={page.twitter_card_type || 'summary_large_image'} />
        <meta name="twitter:title" content={page.og_title || page.seo_title || page.title} />
        <meta name="twitter:description" content={page.og_description || page.seo_description || ''} />
        {page.og_image && <meta name="twitter:image" content={page.og_image} />}
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <article 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>
    </>
  );
};
