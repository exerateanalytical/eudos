import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentBulkActions } from "./ContentBulkActions";
import { format } from "date-fns";

interface ContentListProps {
  contentType: 'page' | 'product' | 'blog_post';
  title: string;
  newItemPath: string;
  editItemPath: (id: string) => string;
}

export function ContentList({
  contentType,
  title,
  newItemPath,
  editItemPath,
}: ContentListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const tableName =
    contentType === 'page' ? 'cms_pages' :
    contentType === 'product' ? 'cms_products' :
    'cms_blog_posts';

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: [tableName, search, statusFilter],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*').order('created_at', { ascending: false });

      if (search) {
        const searchColumn = contentType === 'product' ? 'name' : 'title';
        query = query.ilike(searchColumn, `%${search}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async (ids: string[]) => {
    await supabase.from(tableName).delete().in('id', ids);
    setSelectedItems([]);
    refetch();
  };

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    await supabase.from(tableName).update({ status }).in('id', ids);
    setSelectedItems([]);
    refetch();
  };

  const handleBulkExport = (ids: string[]) => {
    // Export functionality placeholder
    console.log('Exporting items:', ids);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            Manage your {title.toLowerCase()}
          </p>
        </div>
        <Link to={newItemPath}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            {contentType === 'product' && (
              <SelectItem value="active">Active</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      <ContentBulkActions
        selectedItems={selectedItems}
        totalItems={items.length}
        allSelected={selectedItems.length === items.length && items.length > 0}
        onSelectAll={handleSelectAll}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkExport={handleBulkExport}
      />

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === items.length && items.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>{contentType === 'product' ? 'Name' : 'Title'}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {contentType === 'product' ? (item as any).name : (item as any).title}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={editItemPath(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
