import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield } from "lucide-react";
import { UserRoleDialog } from "./UserRoleDialog";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface UserRole {
  role: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    return data?.role || "user";
  };

  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "created_at",
      label: "Joined",
      render: (row: Profile) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "role",
      label: "Role",
      render: (row: Profile) => {
        const [role, setRole] = useState<string>("user");

        useEffect(() => {
          getUserRole(row.id).then(setRole);
        }, []);

        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Profile) => {
        const [role, setRole] = useState<string>("user");

        useEffect(() => {
          getUserRole(row.id).then(setRole);
        }, []);

        return (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedUser({ id: row.id, name: row.full_name, role });
                setRoleDialogOpen(true);
              }}
            >
              <Shield className="h-4 w-4 mr-1" />
              Edit Role
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and roles
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <AdminDataTable
          data={users}
          columns={columns}
          searchPlaceholder="Search users by name or email..."
        />
      </Card>

      {selectedUser && (
        <UserRoleDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          userId={selectedUser.id}
          userName={selectedUser.name}
          currentRole={selectedUser.role}
          onRoleUpdated={fetchUsers}
        />
      )}
    </div>
  );
}
