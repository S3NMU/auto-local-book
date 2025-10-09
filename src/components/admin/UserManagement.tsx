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
import { Textarea } from '@/components/ui/textarea';
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

interface PendingProvider {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  business_name: string;
  business_phone: string;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
    roles: ['user'] as string[],
    fullName: '',
    phone: '',
    city: '',
    zipCode: '',
    preferredComm: [] as ("email" | "sms")[],
    // Customer fields
    ownsVehicle: false,
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleLicensePlate: '',
    // Provider fields
    businessPhone: '',
    businessName: '',
    businessType: '',
    primaryCategory: '',
    serviceRadius: '',
    websiteUrl: '',
    needsApproval: false // Don't require approval for admin-created providers
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
      fetchPendingProviders();
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

  const fetchPendingProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          id,
          user_id,
          business_name,
          business_phone,
          created_at
        `)
        .is('is_approved', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Get all user info from the existing users list
        const userMap = new Map(users.map(u => [u.id, u]));
        
        const providersWithUsers = data.map(profile => {
          const user = userMap.get(profile.user_id);
          return {
            id: profile.id,
            user_id: profile.user_id,
            email: user?.email || 'Unknown',
            full_name: user?.user_metadata?.full_name || 'Unknown',
            business_name: profile.business_name || 'Unknown',
            business_phone: profile.business_phone || 'N/A',
            created_at: profile.created_at || new Date().toISOString()
          };
        });

        setPendingProviders(providersWithUsers);
      } else {
        setPendingProviders([]);
      }
    } catch (error) {
      console.error('Error fetching pending providers:', error);
    }
  };

  const approveProvider = async (userId: string) => {
    try {
      // Update provider profile to approved
      const { error: profileError } = await supabase
        .from('provider_profiles')
        .update({ 
          is_approved: true as any // Temporary type assertion until types regenerate
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Add provider role
      const { data: session } = await supabase.auth.getSession();
      const { error: roleError } = await supabase.functions.invoke('admin-user-management', {
        body: {
          action: 'update-roles',
          userId: userId,
          roles: ['provider']
        },
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      });

      if (roleError) throw roleError;

      toast({
        title: "Provider Approved",
        description: "The provider has been approved and can now access their dashboard"
      });

      fetchPendingProviders();
      fetchUsers();
    } catch (error) {
      console.error('Error approving provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve provider"
      });
    }
  };

  const rejectProvider = async (userId: string) => {
    try {
      // Delete provider profile
      const { error: profileError } = await supabase
        .from('provider_profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      toast({
        title: "Provider Rejected",
        description: "The provider application has been rejected"
      });

      fetchPendingProviders();
    } catch (error) {
      console.error('Error rejecting provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject provider"
      });
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
          roles: newUser.roles,
          full_name: newUser.fullName,
          phone: newUser.phone
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      // If provider role, create provider profile
      if (newUser.roles.includes('provider') && data.user) {
        const { error: profileError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: data.user.id,
            business_name: newUser.businessName,
            business_phone: newUser.businessPhone,
            business_city: newUser.city,
            business_zip_code: newUser.zipCode,
            service_radius_miles: newUser.serviceRadius ? parseInt(newUser.serviceRadius) : 25,
            website_url: newUser.websiteUrl,
            primary_category: newUser.primaryCategory,
            business_type: newUser.businessType
          });

        if (profileError) {
          console.error('Error creating provider profile:', profileError);
        }
      }

      toast({
        title: "Success",
        description: "User created successfully"
      });

      setCreateUserOpen(false);
      setNewUser({
        email: '',
        password: '',
        roles: ['user'],
        fullName: '',
        phone: '',
        city: '',
        zipCode: '',
        preferredComm: [],
        ownsVehicle: false,
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleLicensePlate: '',
        businessPhone: '',
        businessName: '',
        businessType: '',
        primaryCategory: '',
        serviceRadius: '',
        websiteUrl: '',
        needsApproval: false
      });
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

  const toggleNewUserCommPreference = (value: "email" | "sms") => {
    const currentPrefs = newUser.preferredComm;
    if (currentPrefs.includes(value)) {
      setNewUser({ ...newUser, preferredComm: currentPrefs.filter(p => p !== value) });
    } else {
      setNewUser({ ...newUser, preferredComm: [...currentPrefs, value] });
    }
  };

  const isProviderAccount = newUser.roles.includes('provider');
  const isCustomerAccount = !isProviderAccount;

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      user.user_metadata?.full_name?.toLowerCase().includes(query) ||
      user.user_metadata?.phone?.toLowerCase().includes(query) ||
      user.roles.some(r => r.role.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 h-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Pending ({pendingProviders.length})
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
              <div className="mb-4">
                <Input
                  placeholder="Search by email, name, phone, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
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
                  {filteredUsers.map((user) => (
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

        {/* Pending Providers Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pending Provider Applications
              </CardTitle>
              <CardDescription>
                Review and approve or reject provider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingProviders.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No pending applications</p>
                  <p className="text-muted-foreground">All provider applications have been reviewed</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">{provider.business_name}</TableCell>
                        <TableCell>{provider.full_name}</TableCell>
                        <TableCell>{provider.email}</TableCell>
                        <TableCell>{provider.business_phone}</TableCell>
                        <TableCell>
                          {new Date(provider.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => approveProvider(provider.user_id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectProvider(provider.user_id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>
                Create a new user account with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Account Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Secure password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3">
                <Label>User Roles <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`new-user-${role}`}
                        checked={newUser.roles.includes(role)}
                        onCheckedChange={(checked) => 
                          handleNewUserRoleToggle(role, checked as boolean)
                        }
                      />
                      <Label htmlFor={`new-user-${role}`} className="capitalize cursor-pointer">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Preferences (for customers) */}
              {isCustomerAccount && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location & Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newUser.city}
                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                        placeholder="Los Angeles"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={newUser.zipCode}
                        onChange={(e) => setNewUser({ ...newUser, zipCode: e.target.value })}
                        placeholder="90001"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred Communication</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-comm-email"
                          checked={newUser.preferredComm.includes("email")}
                          onCheckedChange={() => toggleNewUserCommPreference("email")}
                        />
                        <Label htmlFor="new-comm-email" className="cursor-pointer font-normal">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new-comm-sms"
                          checked={newUser.preferredComm.includes("sms")}
                          onCheckedChange={() => toggleNewUserCommPreference("sms")}
                        />
                        <Label htmlFor="new-comm-sms" className="cursor-pointer font-normal">SMS</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ownsVehicle"
                      checked={newUser.ownsVehicle}
                      onCheckedChange={(checked) => 
                        setNewUser({ ...newUser, ownsVehicle: checked as boolean })
                      }
                    />
                    <Label htmlFor="ownsVehicle" className="cursor-pointer">I own a vehicle</Label>
                  </div>

                  {newUser.ownsVehicle && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h4 className="font-medium">Vehicle Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vehicleMake">Make</Label>
                          <Input
                            id="vehicleMake"
                            value={newUser.vehicleMake}
                            onChange={(e) => setNewUser({ ...newUser, vehicleMake: e.target.value })}
                            placeholder="Toyota"
                          />
                        </div>
                        <div>
                          <Label htmlFor="vehicleModel">Model</Label>
                          <Input
                            id="vehicleModel"
                            value={newUser.vehicleModel}
                            onChange={(e) => setNewUser({ ...newUser, vehicleModel: e.target.value })}
                            placeholder="Camry"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vehicleYear">Year</Label>
                          <Input
                            id="vehicleYear"
                            value={newUser.vehicleYear}
                            onChange={(e) => setNewUser({ ...newUser, vehicleYear: e.target.value })}
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label htmlFor="vehicleLicensePlate">License Plate (optional)</Label>
                          <Input
                            id="vehicleLicensePlate"
                            value={newUser.vehicleLicensePlate}
                            onChange={(e) => setNewUser({ ...newUser, vehicleLicensePlate: e.target.value })}
                            placeholder="ABC1234"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Business Overview */}
              {isProviderAccount && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="businessName"
                        value={newUser.businessName}
                        onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
                        placeholder="Auto Repair Shop"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone">Business Phone <span className="text-destructive">*</span></Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={newUser.businessPhone}
                        onChange={(e) => setNewUser({ ...newUser, businessPhone: e.target.value })}
                        placeholder="(555) 987-6543"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select 
                        value={newUser.businessType} 
                        onValueChange={(value) => setNewUser({ ...newUser, businessType: value })}
                      >
                        <SelectTrigger id="businessType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="independent">Independent mechanic</SelectItem>
                          <SelectItem value="auto_shop">Auto shop</SelectItem>
                          <SelectItem value="mobile">Mobile service</SelectItem>
                          <SelectItem value="detailing">Detailing</SelectItem>
                          <SelectItem value="specialty">Specialty shop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="primaryCategory">Primary Service Category</Label>
                      <Select 
                        value={newUser.primaryCategory} 
                        onValueChange={(value) => setNewUser({ ...newUser, primaryCategory: value })}
                      >
                        <SelectTrigger id="primaryCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Repair</SelectItem>
                          <SelectItem value="brakes">Brakes</SelectItem>
                          <SelectItem value="tires">Tires</SelectItem>
                          <SelectItem value="diagnostics">Diagnostics</SelectItem>
                          <SelectItem value="detailing">Detailing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="providerCity">City <span className="text-destructive">*</span></Label>
                      <Input
                        id="providerCity"
                        value={newUser.city}
                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                        placeholder="Los Angeles"
                      />
                    </div>
                    <div>
                      <Label htmlFor="providerZipCode">ZIP Code <span className="text-destructive">*</span></Label>
                      <Input
                        id="providerZipCode"
                        value={newUser.zipCode}
                        onChange={(e) => setNewUser({ ...newUser, zipCode: e.target.value })}
                        placeholder="90001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                      <Input
                        id="serviceRadius"
                        type="number"
                        value={newUser.serviceRadius}
                        onChange={(e) => setNewUser({ ...newUser, serviceRadius: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="websiteUrl">Website or Google Maps Link</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        value={newUser.websiteUrl}
                        onChange={(e) => setNewUser({ ...newUser, websiteUrl: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}

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