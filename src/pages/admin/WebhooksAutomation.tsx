import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookManagement } from "@/components/admin/WebhookManagement";
import { ScheduledJobsManagement } from "@/components/admin/ScheduledJobsManagement";

const WebhooksAutomation = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Webhooks & Automation</h1>
        <p className="text-muted-foreground">
          Manage webhook integrations, scheduled jobs, and automated payment workflows
        </p>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="scheduled-jobs">Scheduled Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-6">
          <WebhookManagement />
        </TabsContent>

        <TabsContent value="scheduled-jobs" className="space-y-6">
          <ScheduledJobsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhooksAutomation;
