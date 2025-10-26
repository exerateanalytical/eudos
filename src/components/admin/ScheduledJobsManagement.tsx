import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export function ScheduledJobsManagement() {
  const queryClient = useQueryClient();

  // Fetch scheduled jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['scheduled-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent executions
  const { data: executions } = useQuery({
    queryKey: ['job-execution-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_execution_log')
        .select('*, scheduled_jobs(job_name)')
        .order('started_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Toggle job active status
  const toggleJob = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('scheduled_jobs')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-jobs'] });
      toast.success('Job status updated');
    },
  });

  // Run job manually
  const runJob = useMutation({
    mutationFn: async (jobName: string) => {
      const { error } = await supabase.functions.invoke('scheduled-jobs-runner', {
        body: { jobName },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Job started successfully');
      queryClient.invalidateQueries({ queryKey: ['job-execution-log'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to run job: ${error.message}`);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'timeout':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      analytics_aggregation: 'Analytics',
      address_pool_check: 'Address Pool',
      payment_reminder: 'Payment Reminders',
      cleanup: 'Cleanup',
      health_check: 'Health Check',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Scheduled Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Jobs</CardTitle>
          <CardDescription>
            Automated jobs running on schedule to maintain system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Active</TableHead>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Switch
                        checked={job.is_active}
                        onCheckedChange={(checked) =>
                          toggleJob.mutate({ id: job.id, isActive: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{job.job_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getJobTypeLabel(job.job_type)}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{job.schedule_cron}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {job.last_run_at
                        ? format(new Date(job.last_run_at), 'MMM dd, HH:mm:ss')
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {job.last_status && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.last_status)}
                          <span className="capitalize text-sm">{job.last_status}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {job.last_duration_ms ? `${job.last_duration_ms}ms` : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runJob.mutate(job.job_name)}
                        disabled={runJob.isPending}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Executions</CardTitle>
          <CardDescription>Last 50 job execution logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Job Name</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Items Processed</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions?.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.status)}
                      <span className="capitalize text-sm">{execution.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {execution.scheduled_jobs?.job_name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(execution.started_at), 'MMM dd, HH:mm:ss')}
                  </TableCell>
                  <TableCell className="text-xs">
                    {execution.duration_ms ? `${execution.duration_ms}ms` : '-'}
                  </TableCell>
                  <TableCell>{execution.items_processed || 0}</TableCell>
                  <TableCell>
                    {execution.error_message ? (
                      <Badge variant="destructive" className="text-xs">
                        Error
                      </Badge>
                    ) : execution.result ? (
                      <Badge variant="default" className="text-xs">
                        Success
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
