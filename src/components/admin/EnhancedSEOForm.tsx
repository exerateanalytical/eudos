import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Eye, Globe, Twitter, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhancedSEOFormProps {
  // Basic SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  
  // Advanced SEO
  focusKeyword?: string;
  relatedKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCardType?: string;
  schemaType?: string;
  noindex?: boolean;
  
  // Handlers
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
  onFocusKeywordChange?: (value: string) => void;
  onRelatedKeywordsChange?: (value: string[]) => void;
  onOgTitleChange?: (value: string) => void;
  onOgDescriptionChange?: (value: string) => void;
  onOgImageChange?: (value: string) => void;
  onTwitterCardTypeChange?: (value: string) => void;
  onSchemaTypeChange?: (value: string) => void;
  onNoindexChange?: (value: boolean) => void;
  
  // Content for analysis
  content?: string;
  title?: string;
}

export function EnhancedSEOForm(props: EnhancedSEOFormProps) {
  const [seoScore, setSeoScore] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);

  useEffect(() => {
    calculateSEOScore();
  }, [
    props.seoTitle,
    props.seoDescription,
    props.focusKeyword,
    props.content,
    props.ogTitle,
    props.ogImage,
  ]);

  const calculateSEOScore = () => {
    let score = 0;
    const maxScore = 100;

    // Title check (20 points)
    if (props.seoTitle && props.seoTitle.length >= 30 && props.seoTitle.length <= 60) {
      score += 20;
    } else if (props.seoTitle && props.seoTitle.length > 0) {
      score += 10;
    }

    // Description check (20 points)
    if (props.seoDescription && props.seoDescription.length >= 120 && props.seoDescription.length <= 160) {
      score += 20;
    } else if (props.seoDescription && props.seoDescription.length > 0) {
      score += 10;
    }

    // Focus keyword in title (15 points)
    if (props.focusKeyword && props.seoTitle?.toLowerCase().includes(props.focusKeyword.toLowerCase())) {
      score += 15;
    }

    // Focus keyword in description (15 points)
    if (props.focusKeyword && props.seoDescription?.toLowerCase().includes(props.focusKeyword.toLowerCase())) {
      score += 15;
    }

    // OG tags (15 points)
    if (props.ogTitle && props.ogDescription && props.ogImage) {
      score += 15;
    } else if (props.ogTitle || props.ogDescription || props.ogImage) {
      score += 8;
    }

    // Canonical URL (10 points)
    if (props.canonicalUrl) {
      score += 10;
    }

    // Schema markup (5 points)
    if (props.schemaType) {
      score += 5;
    }

    setSeoScore(Math.min(score, maxScore));

    // Calculate keyword density
    if (props.focusKeyword && props.content) {
      const keywordRegex = new RegExp(props.focusKeyword, 'gi');
      const matches = props.content.match(keywordRegex);
      const wordCount = props.content.split(/\s+/).length;
      const density = matches ? (matches.length / wordCount) * 100 : 0;
      setKeywordDensity(Math.round(density * 10) / 10);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                SEO Analysis
              </CardTitle>
              <CardDescription>Overall SEO health score</CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(seoScore)}`}>
                {seoScore}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
              {getScoreBadge(seoScore)}
            </div>
          </div>
        </CardHeader>
        {props.focusKeyword && (
          <CardContent>
            <div className="text-sm">
              <strong>Keyword Density:</strong> {keywordDensity}%
              {keywordDensity > 0 && keywordDensity < 0.5 && (
                <span className="text-yellow-600 ml-2">(Too low - aim for 0.5-2.5%)</span>
              )}
              {keywordDensity > 2.5 && (
                <span className="text-red-600 ml-2">(Too high - may be considered spam)</span>
              )}
              {keywordDensity >= 0.5 && keywordDensity <= 2.5 && (
                <span className="text-green-600 ml-2">(Optimal range)</span>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Basic SEO Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Basic SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title *</Label>
                <Input
                  id="seo-title"
                  value={props.seoTitle}
                  onChange={(e) => props.onSeoTitleChange(e.target.value)}
                  placeholder="Enter SEO title (30-60 characters recommended)"
                  maxLength={60}
                />
                <div className="flex justify-between text-xs">
                  <span className={props.seoTitle.length >= 30 && props.seoTitle.length <= 60 ? "text-green-600" : "text-muted-foreground"}>
                    {props.seoTitle.length}/60 characters
                  </span>
                  {props.seoTitle.length < 30 && props.seoTitle.length > 0 && (
                    <span className="text-yellow-600">Too short (min 30 recommended)</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description">SEO Description *</Label>
                <Textarea
                  id="seo-description"
                  value={props.seoDescription}
                  onChange={(e) => props.onSeoDescriptionChange(e.target.value)}
                  placeholder="Enter SEO description (120-160 characters recommended)"
                  maxLength={160}
                  rows={3}
                />
                <div className="flex justify-between text-xs">
                  <span className={props.seoDescription.length >= 120 && props.seoDescription.length <= 160 ? "text-green-600" : "text-muted-foreground"}>
                    {props.seoDescription.length}/160 characters
                  </span>
                  {props.seoDescription.length < 120 && props.seoDescription.length > 0 && (
                    <span className="text-yellow-600">Too short (min 120 recommended)</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus-keyword">Focus Keyword</Label>
                <Input
                  id="focus-keyword"
                  value={props.focusKeyword || ''}
                  onChange={(e) => props.onFocusKeywordChange?.(e.target.value)}
                  placeholder="Main keyword to target"
                />
                <p className="text-xs text-muted-foreground">Primary keyword this content should rank for</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="related-keywords">Related Keywords</Label>
                <Input
                  id="related-keywords"
                  value={props.relatedKeywords?.join(', ') || ''}
                  onChange={(e) => props.onRelatedKeywordsChange?.(e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground">Comma-separated related keywords</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical-url">Canonical URL</Label>
                <Input
                  id="canonical-url"
                  value={props.canonicalUrl}
                  onChange={(e) => props.onCanonicalUrlChange(e.target.value)}
                  placeholder="https://example.com/page"
                />
                <p className="text-xs text-muted-foreground">Preferred URL to avoid duplicate content issues</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced SEO Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schema-type">Schema Type</Label>
                <Select 
                  value={props.schemaType || 'WebPage'} 
                  onValueChange={props.onSchemaTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WebPage">Web Page</SelectItem>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="BlogPosting">Blog Post</SelectItem>
                    <SelectItem value="Organization">Organization</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Structured data type for search engines</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="noindex">No Index</Label>
                  <p className="text-xs text-muted-foreground">
                    Prevent search engines from indexing this page
                  </p>
                </div>
                <Switch
                  id="noindex"
                  checked={props.noindex || false}
                  onCheckedChange={props.onNoindexChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Open Graph (Facebook)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og-title">OG Title</Label>
                <Input
                  id="og-title"
                  value={props.ogTitle || props.seoTitle}
                  onChange={(e) => props.onOgTitleChange?.(e.target.value)}
                  placeholder="Title for social media sharing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-description">OG Description</Label>
                <Textarea
                  id="og-description"
                  value={props.ogDescription || props.seoDescription}
                  onChange={(e) => props.onOgDescriptionChange?.(e.target.value)}
                  placeholder="Description for social media sharing"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">OG Image URL</Label>
                <Input
                  id="og-image"
                  value={props.ogImage || ''}
                  onChange={(e) => props.onOgImageChange?.(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">Image shown when shared on social media (1200x630px recommended)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter-card">Card Type</Label>
                <Select 
                  value={props.twitterCardType || 'summary_large_image'} 
                  onValueChange={props.onTwitterCardTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Google Search Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{props.canonicalUrl || 'https://example.com'}</div>
                <div className="text-lg text-primary font-medium hover:underline cursor-pointer">
                  {props.seoTitle || 'Page Title'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {props.seoDescription || 'Page description will appear here...'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {props.ogImage && (
                  <img 
                    src={props.ogImage} 
                    alt="OG preview" 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">
                    {props.canonicalUrl || 'example.com'}
                  </div>
                  <div className="font-semibold">
                    {props.ogTitle || props.seoTitle || 'Page Title'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {props.ogDescription || props.seoDescription || 'Description'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}