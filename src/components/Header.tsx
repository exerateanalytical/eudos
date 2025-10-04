import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu, User, LayoutDashboard, Home, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch categories dynamically
  const { data: categories } = useQuery({
    queryKey: ["header-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name, slug, display_order")
        .is("parent_id", null)
        .eq("is_visible_in_menu", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="relative">
            <Globe className="h-6 w-6 md:h-8 md:w-8 text-primary transition-transform duration-300 group-hover:scale-110 active:scale-95" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            SecurePrint Labs
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 lg:gap-8 items-center">
          <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95 flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            Home
          </button>
          {categories?.map((category) => (
            <button 
              key={category.id}
              onClick={() => navigate(`/category/${category.slug}`)}
              className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95"
            >
              {category.name}
            </button>
          ))}
          <button onClick={() => navigate("/apply")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95">
            Apply
          </button>
          <button onClick={() => navigate("/escrow")} className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium text-sm lg:text-base active:scale-95 flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Escrow
          </button>
          {session ? (
            <Button onClick={() => navigate("/dashboard")} variant="default" size="sm" className="active:scale-95">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="outline" size="sm" className="active:scale-95 gap-2">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Login</span>
            </Button>
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="active:scale-95">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button onClick={() => { navigate("/"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home
              </button>
              {categories?.map((category) => (
                <button 
                  key={category.id}
                  onClick={() => { navigate(`/category/${category.slug}`); setMobileMenuOpen(false); }}
                  className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95"
                >
                  {category.name}
                </button>
              ))}
              <button onClick={() => { navigate("/apply"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95">
                Apply
              </button>
              <button onClick={() => { navigate("/escrow"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 active:scale-95 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Escrow
              </button>
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {session ? (
                  <Button className="w-full active:scale-95" onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                ) : (
                  <Button className="w-full active:scale-95" onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" />
                    Login / Register
                  </Button>
                )}
                <Button variant="outline" className="w-full active:scale-95" onClick={() => { navigate("/apply"); setMobileMenuOpen(false); }}>
                  Apply Now
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};