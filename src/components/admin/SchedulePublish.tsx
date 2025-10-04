import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface SchedulePublishProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function SchedulePublish({ value, onChange }: SchedulePublishProps) {
  const [enabled, setEnabled] = useState(!!value);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) {
      onChange(null);
    } else {
      // Set to 1 hour from now by default
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      onChange(defaultDate.toISOString().slice(0, 16));
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="schedule-toggle">Schedule Publishing</Label>
        </div>
        <Switch
          id="schedule-toggle"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {enabled && (
        <div className="space-y-2">
          <Label htmlFor="publish-date">Publish Date & Time</Label>
          <Input
            id="publish-date"
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-muted-foreground">
            Content will automatically publish at the scheduled time
          </p>
        </div>
      )}
    </div>
  );
}
