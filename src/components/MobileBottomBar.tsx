import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ShoppingBag } from "lucide-react";

export const MobileBottomBar = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-lg pb-safe">
      <div className="container mx-auto px-4 py-3 flex gap-3">
        <Button 
          size="lg" 
          className="flex-1 h-12 text-base font-semibold active:scale-95 touch-manipulation shadow-lg"
          onClick={() => navigate("/apply")}
        >
          <FileText className="mr-2 h-5 w-5" />
          Apply Now
        </Button>
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
