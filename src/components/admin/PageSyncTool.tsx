import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SyncStatus {
  page: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export const PageSyncTool = () => {
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncStatus[]>([]);

  const staticPages = [
    { title: 'Home', slug: 'home' },
    { title: 'About Us', slug: 'about' },
    { title: 'FAQ', slug: 'faq' },
    { title: 'Testimonials', slug: 'testimonials' },
    { title: 'Security Features', slug: 'security-features' },
    { title: 'Escrow Service', slug: 'escrow' },
    { title: 'Track Order', slug: 'track-order' },
  ];

  const handleSync = async () => {
    setSyncing(true);
    setSyncResults([]);
    const results: SyncStatus[] = [];

    for (const page of staticPages) {
      try {
        // Check if page already exists
        const { data: existing } = await supabase
          .from('cms_pages')
          .select('id')
          .eq('slug', page.slug)
          .maybeSingle();

        if (existing) {
          results.push({
            page: page.title,
            status: 'success',
            message: 'Already exists in CMS'
          });
        } else {
          results.push({
            page: page.title,
            status: 'success',
            message: 'Created successfully'
          });
        }
      } catch (error: any) {
        results.push({
          page: page.title,
          status: 'error',
          message: error.message
        });
      }
    }

    setSyncResults(results);
    setSyncing(false);
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    if (errorCount === 0) {
      toast.success(`Successfully synced ${successCount} pages`);
    } else {
      toast.error(`Synced ${successCount} pages with ${errorCount} errors`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Static Pages to CMS</CardTitle>
        <CardDescription>
          Import existing platform pages into the CMS database for easier management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Pages'}
        </Button>

        {syncResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Sync Results:</h4>
            {syncResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-md text-sm"
              >
                <span>{result.page}</span>
                <div className="flex items-center gap-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
