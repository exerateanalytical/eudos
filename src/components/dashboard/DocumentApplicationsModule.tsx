import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Eye } from "lucide-react";
import { z } from "zod";

const applicationSchema = z.object({
  document_type: z.string().min(1, "Document type is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
});

interface DocumentApplication {
  id: string;
  document_type: string;
  country: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface DocumentApplicationsModuleProps {
  userId: string;
}

const DocumentApplicationsModule = ({ userId }: DocumentApplicationsModuleProps) => {
  const [applications, setApplications] = useState<DocumentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewApplicationDialog, setShowNewApplicationDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<DocumentApplication | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("document_applications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (error: any) {
        toast.error("Error loading applications");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Set up realtime subscription
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_applications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleCreateApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      document_type: formData.get("document_type") as string,
      country: formData.get("country") as string,
      notes: formData.get("notes") as string || null,
    };

    try {
      applicationSchema.parse(data);

      const { error } = await supabase.from("document_applications").insert({
        user_id: userId,
        document_type: data.document_type,
        country: data.country,
        notes: data.notes,
        status: 'submitted',
      });

      if (error) throw error;

      toast.success("Application submitted successfully");
      setShowNewApplicationDialog(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error(error.message || "Error creating application");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "approved":
        return "default";
      case "under_review":
        return "secondary";
      case "submitted":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading applications...</CardContent></Card>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Document Applications</CardTitle>
              <CardDescription>Track the status of your document requests</CardDescription>
            </div>
            <Dialog open={showNewApplicationDialog} onOpenChange={setShowNewApplicationDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit New Application</DialogTitle>
                  <DialogDescription>Apply for a new document</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateApplication} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document_type">Document Type</Label>
                    <select
                      id="document_type"
                      name="document_type"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="National ID">National ID</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Certification">Certification</option>
                      <option value="Citizenship">Citizenship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea id="notes" name="notes" rows={4} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Submit Application</Button>
                    <Button type="button" variant="outline" onClick={() => setShowNewApplicationDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{app.document_type}</h3>
                        <p className="text-sm text-muted-foreground">{app.country}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={getStatusColor(app.status)}>
                          {app.status.replace("_", " ")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {app.notes && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{app.notes}</p>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Complete information about this application</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Document Type</Label>
                <p className="font-semibold">{selectedApplication.document_type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Country</Label>
                <p>{selectedApplication.country}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={getStatusColor(selectedApplication.status)} className="mt-1">
                  {selectedApplication.status.replace("_", " ")}
                </Badge>
              </div>
              {selectedApplication.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.notes}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Application Date</Label>
                <p>{new Date(selectedApplication.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentApplicationsModule;
