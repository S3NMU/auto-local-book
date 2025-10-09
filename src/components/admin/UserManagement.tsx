import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Store, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
  };
  roles: Array<{
    role: string;
  }>;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    action: 'grant' | 'revoke';
    role: 'admin' | 'provider';
  } | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: { action: 'list-users' },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) {
        console.error('Function invoke error:', error);
        throw error;
      }

      if (data?.users) {
        setUsers(data.users);
      } else {
        throw new Error('No users data returned');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId: string, userName: string, role: 'admin' | 'provider', action: 'grant' | 'revoke') => {
    setConfirmDialog({
      open: true,
      userId,
      userName,
      action,
      role
    });
  };

  const confirmRoleChange = async () => {
    if (!confirmDialog) return;

    try {
      const { userId, role, action } = confirmDialog;

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: action === 'grant' ? 'grant-role' : 'revoke-role',
          userId,
          role
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: action === 'grant' ? "Access Granted" : "Access Revoked",
        description: `Successfully ${action === 'grant' ? 'granted' : 'revoked'} ${role} access`,
      });

      // Refresh users list
      await fetchUsers();
      setConfirmDialog(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${confirmDialog.action} ${confirmDialog.role} access`
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'provider': return 'default';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-3 h-3" />;
      case 'provider': return <Store className="w-3 h-3" />;
      default: return <UserIcon className="w-3 h-3" />;
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_metadata?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full system access';
      case 'provider': return 'Provider dashboard access';
      default: return 'Customer access';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View users and manage their dashboard access
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Access</TableHead>
                    <TableHead>Admin Access</TableHead>
                    <TableHead>Provider Access</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const roles = user.roles.map(r => r.role);
                      const hasAdmin = roles.includes('admin');
                      const hasProvider = roles.includes('provider');
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.user_metadata?.full_name || 'No name'}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {roles.length > 0 ? (
                                roles.map((role) => (
                                  <Badge 
                                    key={role} 
                                    variant={getRoleBadgeVariant(role)}
                                    className="flex items-center gap-1"
                                  >
                                    {getRoleIcon(role)}
                                    <span className="capitalize">{role}</span>
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3" />
                                  Customer
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {hasAdmin ? (
                                <>
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRoleChange(
                                      user.id,
                                      user.user_metadata?.full_name || user.email,
                                      'admin',
                                      'revoke'
                                    )}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Revoke
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRoleChange(
                                    user.id,
                                    user.user_metadata?.full_name || user.email,
                                    'admin',
                                    'grant'
                                  )}
                                >
                                  <Shield className="w-4 h-4 mr-1" />
                                  Grant Access
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {hasProvider ? (
                                <>
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRoleChange(
                                      user.id,
                                      user.user_metadata?.full_name || user.email,
                                      'provider',
                                      'revoke'
                                    )}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Revoke
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRoleChange(
                                    user.id,
                                    user.user_metadata?.full_name || user.email,
                                    'provider',
                                    'grant'
                                  )}
                                >
                                  <Store className="w-4 h-4 mr-1" />
                                  Grant Access
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmDialog?.open || false} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {confirmDialog?.action === 'grant' ? 'Grant' : 'Revoke'} Access
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.action === 'grant' ? (
                <>
                  Are you sure you want to grant <strong>{confirmDialog?.role}</strong> access to{' '}
                  <strong>{confirmDialog?.userName}</strong>?
                  <br /><br />
                  This will allow them to access the{' '}
                  <strong>{confirmDialog?.role === 'admin' ? 'Admin Dashboard' : 'Provider Dashboard'}</strong>
                  {' '}with {getRoleDescription(confirmDialog?.role || '')}.
                </>
              ) : (
                <>
                  Are you sure you want to revoke <strong>{confirmDialog?.role}</strong> access from{' '}
                  <strong>{confirmDialog?.userName}</strong>?
                  <br /><br />
                  They will no longer be able to access the{' '}
                  <strong>{confirmDialog?.role === 'admin' ? 'Admin Dashboard' : 'Provider Dashboard'}</strong>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              {confirmDialog?.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
