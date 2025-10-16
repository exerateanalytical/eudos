import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LandingTheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  is_active: boolean;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_gradient: string;
  font_family: string;
  layout_style: string;
  config: any;
  created_at: string;
  updated_at: string;
}

export function useThemeManager() {
  const queryClient = useQueryClient();

  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['landing-themes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_themes')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as LandingTheme[];
    },
  });

  const { data: activeTheme } = useQuery({
    queryKey: ['active-theme'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_themes')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as LandingTheme | null;
    },
  });

  const activateTheme = useMutation({
    mutationFn: async (themeId: string) => {
      const { error } = await supabase
        .from('landing_themes')
        .update({ is_active: true })
        .eq('id', themeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-themes'] });
      queryClient.invalidateQueries({ queryKey: ['active-theme'] });
      toast.success('Theme activated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to activate theme: ' + error.message);
    },
  });

  return {
    themes,
    activeTheme,
    isLoading,
    activateTheme: activateTheme.mutate,
    isActivating: activateTheme.isPending,
  };
}
