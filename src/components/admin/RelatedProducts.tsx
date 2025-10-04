import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface RelatedProductsProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  currentProductId?: string;
}

export function RelatedProducts({ selectedIds, onChange, currentProductId }: RelatedProductsProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_products')
        .select('id, name, image_url, price')
        .eq('status', 'active');
      
      if (error) throw error;
      return data.filter(p => p.id !== currentProductId);
    },
  });

  const { data: selectedProducts = [] } = useQuery({
    queryKey: ['selected-products', selectedIds],
    queryFn: async () => {
      if (selectedIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('cms_products')
        .select('id, name, image_url, price')
        .in('id', selectedIds);
      
      if (error) throw error;
      return data;
    },
    enabled: selectedIds.length > 0,
  });

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    !selectedIds.includes(p.id)
  );

  const handleAdd = (productId: string) => {
    onChange([...selectedIds, productId]);
  };

  const handleRemove = (productId: string) => {
    onChange(selectedIds.filter(id => id !== productId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Related Products</Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Related Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Related Products</DialogTitle>
            </DialogHeader>
            
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => {
                        handleAdd(product.id);
                        setOpen(false);
                      }}
                    >
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        {product.price && (
                          <p className="text-sm text-muted-foreground">
                            ${product.price}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(product.id);
                          setOpen(false);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {selectedProducts.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-muted-foreground">
            No related products selected
          </div>
        ) : (
          selectedProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-2 border rounded-lg">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                {product.price && (
                  <p className="text-xs text-muted-foreground">${product.price}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
