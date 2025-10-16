import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useThemeManager } from "@/hooks/useThemeManager";
import { Check, Palette, Eye, Loader2 } from "lucide-react";

export function ThemeManager() {
  const { themes, activeTheme, isLoading, activateTheme, isActivating } = useThemeManager();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="h-8 w-8 text-primary" />
          Landing Page Themes
        </h2>
        <p className="text-muted-foreground mt-2">
          Choose from 10 professionally designed themes. Changes apply instantly to your homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isActive = theme.id === activeTheme?.id;
          
          return (
            <Card 
              key={theme.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isActive ? 'ring-2 ring-primary shadow-xl' : ''
              }`}
            >
              {/* Theme Preview */}
              <div 
                className={`h-40 bg-gradient-to-br ${theme.background_gradient} flex items-center justify-center relative`}
              >
                {/* Color Palette Display */}
                <div className="relative flex gap-2 z-10">
                  <div 
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white/50" 
                    style={{ backgroundColor: theme.primary_color }}
                  />
                  <div 
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white/50" 
                    style={{ backgroundColor: theme.secondary_color }}
                  />
                  <div 
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white/50" 
                    style={{ backgroundColor: theme.accent_color }}
                  />
                </div>

                {isActive && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {theme.name}
                  <Badge variant="outline" className="text-xs">
                    {theme.layout_style}
                  </Badge>
                </CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex gap-2">
                <Button
                  onClick={() => activateTheme(theme.id)}
                  disabled={isActive || isActivating}
                  className="flex-1"
                  variant={isActive ? "secondary" : "default"}
                >
                  {isActive ? "Active Theme" : "Activate"}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open('/', '_blank')}
                  title="Preview in new tab"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
