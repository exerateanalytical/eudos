import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Eye, CheckCircle, Archive, Clock } from "lucide-react";

interface StatusWorkflowProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const statusConfig = {
  draft: {
    label: "Draft",
    icon: FileText,
    variant: "secondary" as const,
    description: "Work in progress, not visible to public",
  },
  review: {
    label: "In Review",
    icon: Eye,
    variant: "outline" as const,
    description: "Ready for review by moderators",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    variant: "default" as const,
    description: "Scheduled for future publishing",
  },
  published: {
    label: "Published",
    icon: CheckCircle,
    variant: "default" as const,
    description: "Live and visible to public",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    variant: "destructive" as const,
    description: "Hidden from public, kept for records",
  },
};

export function StatusWorkflow({ 
  currentStatus, 
  onStatusChange,
  disabled = false 
}: StatusWorkflowProps) {
  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select
            value={currentStatus}
            onValueChange={onStatusChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, value]) => {
                const StatusIcon = value.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      {value.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Badge variant={config.variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{config.description}</p>

      {currentStatus === 'draft' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange('review')}
            disabled={disabled}
          >
            Submit for Review
          </Button>
          <Button
            size="sm"
            onClick={() => onStatusChange('published')}
            disabled={disabled}
          >
            Publish Now
          </Button>
        </div>
      )}

      {currentStatus === 'review' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange('draft')}
            disabled={disabled}
          >
            Back to Draft
          </Button>
          <Button
            size="sm"
            onClick={() => onStatusChange('published')}
            disabled={disabled}
          >
            Approve & Publish
          </Button>
        </div>
      )}

      {currentStatus === 'published' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange('draft')}
            disabled={disabled}
          >
            Unpublish
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange('archived')}
            disabled={disabled}
          >
            Archive
          </Button>
        </div>
      )}

      {currentStatus === 'archived' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatusChange('draft')}
          disabled={disabled}
        >
          Restore to Draft
        </Button>
      )}
    </div>
  );
}
