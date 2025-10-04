import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface InventoryManagementProps {
  stockQuantity: number;
  stockStatus: string;
  sku: string;
  onStockQuantityChange: (value: number) => void;
  onStockStatusChange: (value: string) => void;
  onSkuChange: (value: string) => void;
}

export function InventoryManagement({
  stockQuantity,
  stockStatus,
  sku,
  onStockQuantityChange,
  onStockStatusChange,
  onSkuChange,
}: InventoryManagementProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      in_stock: 'default',
      low_stock: 'secondary',
      out_of_stock: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Inventory Management</Label>
        <Badge variant={getStatusBadge(stockStatus)}>
          {stockStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="e.g., PROD-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock-quantity">Stock Quantity</Label>
          <Input
            id="stock-quantity"
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(e) => onStockQuantityChange(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock-status">Stock Status</Label>
          <Select value={stockStatus} onValueChange={onStockStatusChange}>
            <SelectTrigger id="stock-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {stockQuantity === 0 && "⚠️ Product is out of stock"}
        {stockQuantity > 0 && stockQuantity <= 10 && "⚠️ Low stock warning"}
        {stockQuantity > 10 && "✓ Stock levels are healthy"}
      </div>
    </div>
  );
}
