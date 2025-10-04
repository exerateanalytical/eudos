import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, ShoppingBag, Newspaper, Eye, TrendingUp } from "lucide-react";
import { useContentAnalytics } from "@/hooks/useContentAnalytics";

export function Dashboard() {
  const { analytics } = useContentAnalytics();

  const { data: counts } = useQuery({
    queryKey: ['admin-dashboard-counts'],
    queryFn: async () => {
      const [pages, products, blogPosts, reviews] = await Promise.all([
        supabase.from('cms_pages').select('*', { count: 'exact', head: true }),
        supabase.from('cms_products').select('*', { count: 'exact', head: true }),
        supabase.from('cms_blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ]);

      return {
        pages: pages.count || 0,
        products: products.count || 0,
        blogPosts: blogPosts.count || 0,
        reviews: reviews.count || 0,
      };
    },
  });

  const { data: recentContent } = useQuery({
    queryKey: ['admin-recent-content'],
    queryFn: async () => {
      const [pages, products, posts] = await Promise.all([
        supabase
          .from('cms_pages')
          .select('id, title, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('cms_products')
          .select('id, name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('cms_blog_posts')
          .select('id, title, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      return {
        pages: pages.data || [],
        products: products.data || [],
        posts: posts.data || [],
      };
    },
  });

  const statCards = [
    {
      title: "Pages",
      value: counts?.pages || 0,
      icon: FileText,
      description: "Total pages",
      trend: "+12%",
    },
    {
      title: "Products",
      value: counts?.products || 0,
      icon: ShoppingBag,
      description: "Active products",
      trend: "+8%",
    },
    {
      title: "Blog Posts",
      value: counts?.blogPosts || 0,
      icon: Newspaper,
      description: "Published posts",
      trend: "+15%",
    },
    {
      title: "Total Views",
      value: Object.values(analytics?.byType || {}).reduce(
        (sum: number, type: any) => sum + (type.totalViews || 0),
        0
      ),
      icon: Eye,
      description: "This month",
      trend: "+23%",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{stat.description}</span>
                  <span className="flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
            <CardDescription>Latest page updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentContent?.pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-2 rounded hover:bg-muted"
              >
                <span className="text-sm truncate">{page.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  page.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {page.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest product updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentContent?.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 rounded hover:bg-muted"
              >
                <span className="text-sm truncate">{product.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentContent?.posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-2 rounded hover:bg-muted"
              >
                <span className="text-sm truncate">{post.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      {analytics?.byType && Object.keys(analytics.byType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Analytics</CardTitle>
            <CardDescription>Performance by content type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(analytics.byType).map(([type, data]: [string, any]) => (
                <div key={type} className="p-4 border rounded-lg">
                  <h3 className="font-medium capitalize mb-2">{type.replace('_', ' ')}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">{data.totalViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unique:</span>
                      <span className="font-medium">{data.uniqueViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Time:</span>
                      <span className="font-medium">{data.avgTimeOnPage}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
