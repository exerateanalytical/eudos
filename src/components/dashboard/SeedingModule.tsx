import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminCreationModule } from "./AdminCreationModule";

export const SeedingModule = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{ usersCreated: number; reviewsCreated: number } | null>(null);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('seed-reviews', {
        body: {}
      });

      if (error) throw error;

      setResult(data);
      toast.success(`Database seeded! Created ${data.usersCreated} users and ${data.reviewsCreated} reviews`);
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast.error(error.message || 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminCreationModule />
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Seeding
        </CardTitle>
        <CardDescription>
          Populate the database with test data (300 users and realistic reviews)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will create 300 user accounts and distribute 7-13 reviews per product.
            This action may take a few minutes to complete.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleSeedDatabase} 
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Seed Database
            </>
          )}
        </Button>

        {result && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ✅ Successfully created {result.usersCreated} users and {result.reviewsCreated} reviews
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
    </div>
  );
};
