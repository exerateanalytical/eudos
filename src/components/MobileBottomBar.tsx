import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const MobileBottomBar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-lg pb-safe">
      <div className="container mx-auto px-4 py-3 flex gap-3">
        {session ? (
          <Button 
            size="lg" 
            className="flex-1 h-12 text-base font-semibold active:scale-95 touch-manipulation shadow-lg"
            onClick={() => navigate("/dashboard")}
          >
            <User className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="flex-1 h-12 text-base font-semibold active:scale-95 touch-manipulation shadow-lg"
            onClick={() => navigate("/auth")}
          >
            <User className="mr-2 h-5 w-5" />
            Login
          </Button>
        )}
        <Button 
          size="lg" 
          variant="outline"
          className="flex-1 h-12 text-base font-semibold active:scale-95 touch-manipulation border-2"
          onClick={() => navigate("/products")}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Browse
        </Button>
      </div>
    </div>
  );
};
