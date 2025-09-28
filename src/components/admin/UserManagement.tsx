import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Users, Shield, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  roles: Array<{
    role: string;
  }>;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editRolesOpen, setEditRolesOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    roles: ['user'] as string[]
  });
  const { toast } = useToast();

  const availableRoles = ['user', 'employee', 'provider', 'admin'];

  const fetchUsers = async () => {
    try {
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

  const createUser = async () => {
    try {
      if (!newUser.email || !newUser.password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email and password are required"
        });
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'create-user',
          email: newUser.email,
          password: newUser.password,
          roles: newUser.roles
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully"
      });

      setCreateUserOpen(false);
      setNewUser({ email: '', password: '', roles: ['user'] });
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create user"
      });
    }
  };

  const updateUserRoles = async (userId: string, newRoles: string[]) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'update-roles',
          userId,
          roles: newRoles
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User roles updated successfully"
      });

      setEditRolesOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user roles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user roles"
      });
    }
  };

  const updateUserProfile = async () => {
    try {
      if (!selectedUser) return;

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'update-profile',
          userId: selectedUser.id,
          email: profileData.email,
          full_name: profileData.full_name,
          phone: profileData.phone
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile updated successfully"
      });

      setEditProfileOpen(false);
      setSelectedUser(null);
      setProfileData({ full_name: '', email: '', phone: '' });
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user profile"
      });
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'delete-user',
          userId: userToDelete.id
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });

      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'provider': return 'default';
      case 'employee': return 'secondary';
      default: return 'outline';
    }
  };

  const openEditRoles = (user: User) => {
    setSelectedUser(user);
    setEditRolesOpen(true);
  };

  const openEditProfile = (user: User) => {
    setSelectedUser(user);
    setProfileData({
      full_name: user.user_metadata?.full_name || '',
      email: user.email,
      phone: user.user_metadata?.phone || ''
    });
    setEditProfileOpen(true);
  };

  const handleRoleToggle = (role: string, checked: boolean) => {
    if (!selectedUser) return;
    
    const currentRoles = selectedUser.roles.map(r => r.role);
    const newRoles = checked 
      ? [...currentRoles, role]
      : currentRoles.filter(r => r !== role);
    
    setSelectedUser({
      ...selectedUser,
      roles: newRoles.map(role => ({ role }))
    });
  };

  const handleNewUserRoleToggle = (role: string, checked: boolean) => {
    const newRoles = checked 
      ? [...newUser.roles, role]
      : newUser.roles.filter(r => r !== role);
    
    setNewUser({ ...newUser, roles: newRoles });
  };

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.user_metadata?.full_name || '-'}</TableCell>
                      <TableCell>{user.user_metadata?.phone || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <Badge key={index} variant={getRoleBadgeVariant(role.role)}>
                                {role.role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">No roles</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditProfile(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Profile
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditRoles(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Roles
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDeleteUser(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>
                Create a new employee account with specified privileges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="employee@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Secure password"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="roles">Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`new-user-${role}`}
                        checked={newUser.roles.includes(role)}
                        onCheckedChange={(checked) => 
                          handleNewUserRoleToggle(role, checked as boolean)
                        }
                      />
                      <Label htmlFor={`new-user-${role}`} className="capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={createUser} className="w-full">
                Create User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update profile information for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditProfileOpen(false);
                setProfileData({ full_name: '', email: '', phone: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateUserProfile}>
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Roles Dialog */}
      <Dialog open={editRolesOpen} onOpenChange={setEditRolesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>
              Update roles for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`edit-${role}`}
                  checked={selectedUser?.roles.some(r => r.role === role) || false}
                  onCheckedChange={(checked) => 
                    handleRoleToggle(role, checked as boolean)
                  }
                />
                <Label htmlFor={`edit-${role}`} className="capitalize">
                  {role}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditRolesOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedUser) {
                  updateUserRoles(
                    selectedUser.id, 
                    selectedUser.roles.map(r => r.role)
                  );
                }
              }}
            >
              Update Roles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user <strong>{userToDelete?.email}</strong>? 
              This action cannot be undone and will permanently remove the user and all their data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};