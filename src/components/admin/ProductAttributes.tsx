import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductAttributesProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

export function ProductAttributes({ attributes, onChange }: ProductAttributesProps) {
  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });

  const handleAdd = () => {
    if (newAttribute.name && newAttribute.value) {
      onChange([...attributes, newAttribute]);
      setNewAttribute({ name: '', value: '' });
    }
  };

  const handleRemove = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Product Attributes</Label>
      
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="font-medium text-sm">{attr.name}</div>
              <div className="text-sm text-muted-foreground">{attr.value}</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-xs">Attribute Name</Label>
          <Input
            placeholder="e.g., Size, Color"
            value={newAttribute.name}
            onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Value</Label>
          <Input
            placeholder="e.g., Large, Blue"
            value={newAttribute.value}
            onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Attribute
      </Button>

      <p className="text-xs text-muted-foreground">
        Add product variations like size, color, material, etc.
      </p>
    </div>
  );
}
