import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Search, ExternalLink, Users, UserCheck, UserX, UserMinus, UserPlus, AlertTriangle } from 'lucide-react';

interface Provider {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website_url: string;
  status: string;
  rating: number;
  review_count: number;
}

export const ProviderManagement = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('status', { ascending: false }) // Active first
        .order('business_name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProvider) return;

    try {
      const { error } = await supabase
        .from('providers')
        .update({
          business_name: editingProvider.business_name,
          owner_name: editingProvider.owner_name,
          phone: editingProvider.phone,
          email: editingProvider.email,
          address: editingProvider.address,
          city: editingProvider.city,
          state: editingProvider.state,
          zip_code: editingProvider.zip_code,
          website_url: editingProvider.website_url,
        })
        .eq('id', editingProvider.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider updated successfully",
      });

      setIsEditDialogOpen(false);
      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setProviderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!providerToDelete) return;

    try {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', providerToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider permanently deleted",
      });

      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete provider",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProviderToDelete(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this provider?')) return;

    try {
      const { error } = await supabase
        .from('providers')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider deactivated successfully",
      });

      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate provider",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async (id: string) => {
    if (!confirm('Are you sure you want to reactivate this provider?')) return;

    try {
      const { error } = await supabase
        .from('providers')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider reactivated successfully",
      });

      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate provider",
        variant: "destructive",
      });
    }
  };

  const filterProvidersByStatus = (status?: string) => {
    let filtered = providers.filter(provider =>
      provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status) {
      filtered = filtered.filter(provider => provider.status === status);
    }

    // Sort: active first, then by business name
    return filtered.sort((a, b) => {
      if (a.status === b.status) {
        return a.business_name.localeCompare(b.business_name);
      }
      return a.status === 'active' ? -1 : 1;
    });
  };

  const allProviders = filterProvidersByStatus();
  const activeProviders = filterProvidersByStatus('active');
  const inactiveProviders = filterProvidersByStatus('inactive');

  const renderProvidersTable = (providers: Provider[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No providers match your search.' : 'No providers found.'}
              </TableCell>
            </TableRow>
          ) : (
            providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{provider.business_name}</div>
                    <div className="text-sm text-muted-foreground">{provider.owner_name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{provider.phone}</div>
                    <div>{provider.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {provider.city}, {provider.state} {provider.zip_code}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                    {provider.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    ⭐ {provider.rating.toFixed(1)} ({provider.review_count})
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {provider.website_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(provider.website_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {provider.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(provider.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                    {provider.status === 'inactive' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReactivate(provider.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(provider.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading providers...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs for different statuses */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All ({allProviders.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Active ({activeProviders.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Inactive ({inactiveProviders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderProvidersTable(allProviders)}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {renderProvidersTable(activeProviders)}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {renderProvidersTable(inactiveProviders)}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
          </DialogHeader>
          {editingProvider && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={editingProvider.business_name}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    business_name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input
                  id="owner_name"
                  value={editingProvider.owner_name || ''}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    owner_name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingProvider.phone || ''}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    phone: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingProvider.email || ''}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    email: e.target.value
                  })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editingProvider.address}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    address: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editingProvider.city}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    city: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editingProvider.state}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    state: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={editingProvider.zip_code}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    zip_code: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={editingProvider.website_url || ''}
                  onChange={(e) => setEditingProvider({
                    ...editingProvider,
                    website_url: e.target.value
                  })}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Provider?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to <span className="font-semibold text-destructive">permanently delete</span> this provider? 
              This action cannot be undone and will remove all associated data, including reviews and bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Provider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};