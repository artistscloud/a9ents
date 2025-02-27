
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function UserManagement() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: users, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          created_at,
          auth_users:id (
            email,
            last_sign_in_at
          )
        `);

      if (error) throw error;
      return users;
    }
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">User Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.auth_users.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {user.auth_users.last_sign_in_at
                  ? new Date(user.auth_users.last_sign_in_at).toLocaleDateString()
                  : 'Never'}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleRoleChange(
                    user.id,
                    user.role === 'admin' ? 'user' : 'admin'
                  )}
                >
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
