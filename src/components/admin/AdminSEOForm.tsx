import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdminSEOFormProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
}

export function AdminSEOForm({
  seoTitle,
  seoDescription,
  seoKeywords,
  canonicalUrl,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
  onCanonicalUrlChange,
}: AdminSEOFormProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold text-lg">SEO Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="seo-title">SEO Title</Label>
        <Input
          id="seo-title"
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder="Enter SEO title (max 60 characters)"
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground">{seoTitle.length}/60 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-description">SEO Description</Label>
        <Textarea
          id="seo-description"
          value={seoDescription}
          onChange={(e) => onSeoDescriptionChange(e.target.value)}
          placeholder="Enter SEO description (max 160 characters)"
          maxLength={160}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">{seoDescription.length}/160 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-keywords">SEO Keywords</Label>
        <Input
          id="seo-keywords"
          value={seoKeywords}
          onChange={(e) => onSeoKeywordsChange(e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
        />
        <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="canonical-url">Canonical URL</Label>
        <Input
          id="canonical-url"
          value={canonicalUrl}
          onChange={(e) => onCanonicalUrlChange(e.target.value)}
          placeholder="https://example.com/page"
        />
      </div>
    </div>
  );
}
