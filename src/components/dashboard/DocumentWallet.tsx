import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface UserDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  verification_status: string;
  expires_at: string | null;
  uploaded_at: string;
  file_size: number | null;
}

interface DocumentWalletProps {
  userId: string;
}

export const DocumentWallet = ({ userId }: DocumentWalletProps) => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("user_documents")
        .select("*")
        .eq("user_id", userId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("user_documents").insert({
        user_id: userId,
        document_name: file.name,
        document_type: fileExt || "unknown",
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Document downloaded");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("user_documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Wallet
        </CardTitle>
        <CardDescription>Manage your uploaded documents and certificates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex justify-end">
          <label htmlFor="document-upload">
            <Button disabled={uploading} asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Document"}
              </span>
            </Button>
          </label>
          <input
            id="document-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <p className="font-medium">{doc.document_name}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(doc.verification_status)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                        {doc.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {(doc.file_size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                      {doc.expires_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(doc.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc.file_path, doc.document_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
