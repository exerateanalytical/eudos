import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";

interface ContentSchedulerProps {
  scheduledDate?: string | null;
  onSchedule: (date: string | null) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

export function ContentScheduler({ 
  scheduledDate, 
  onSchedule,
  status,
  onStatusChange
}: ContentSchedulerProps) {
  const [localDate, setLocalDate] = useState(
    scheduledDate ? format(new Date(scheduledDate), "yyyy-MM-dd'T'HH:mm") : ""
  );

  const handleSchedule = () => {
    if (localDate) {
      onSchedule(new Date(localDate).toISOString());
      onStatusChange('scheduled');
    }
  };

  const handleClearSchedule = () => {
    setLocalDate("");
    onSchedule(null);
    if (status === 'scheduled') {
      onStatusChange('draft');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Publishing Schedule
        </CardTitle>
        <CardDescription>
          Schedule when this content should be published
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schedule-date">Publish Date & Time</Label>
          <div className="flex gap-2">
            <Input
              id="schedule-date"
              type="datetime-local"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            {localDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSchedule}
                title="Clear schedule"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {scheduledDate && (
          <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Scheduled for:</p>
              <p className="text-muted-foreground">
                {format(new Date(scheduledDate), "PPP 'at' p")}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSchedule}
            disabled={!localDate || localDate === scheduledDate}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onStatusChange('draft');
              handleClearSchedule();
            }}
            disabled={status === 'draft'}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              onStatusChange('published');
              handleClearSchedule();
            }}
            disabled={status === 'published'}
          >
            Publish Now
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Current status: <span className="font-medium capitalize">{status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
