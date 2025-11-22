import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteListingDialog } from './DeleteListingDialog';

interface VehicleForSale {
  id: string;
  provider_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  condition: string | null;
  location_city: string | null;
  location_state: string | null;
  created_at: string;
}

export const VehiclesForSaleManagement = () => {
  const [vehicles, setVehicles] = useState<VehicleForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleForSale | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles_for_sale')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
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

  const handleDelete = (vehicle: VehicleForSale) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (reason: string, sendEmail: boolean) => {
    if (!selectedVehicle) return;

    try {
      const { error } = await supabase
        .from('vehicles_for_sale')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_reason: reason,
          is_active: false,
        })
        .eq('id', selectedVehicle.id);

      if (error) throw error;

      if (sendEmail) {
        await supabase.functions.invoke('notify-listing-deletion', {
          body: {
            listingId: selectedVehicle.id,
            providerId: selectedVehicle.provider_id,
            listingType: 'sale',
            listingTitle: selectedVehicle.title,
            reason: reason,
          },
        });
      }

      toast({
        title: "Success",
        description: "Vehicle listing deleted successfully",
      });

      fetchVehicles();
      setDeleteDialogOpen(false);
      setSelectedVehicle(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vehicles...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total active listings: {vehicles.length}
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No vehicle listings found
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.title}</TableCell>
                    <TableCell>{vehicle.year} {vehicle.make} {vehicle.model}</TableCell>
                    <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell>{vehicle.mileage?.toLocaleString() || 'N/A'} mi</TableCell>
                    <TableCell>
                      <span className="capitalize">{vehicle.condition || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      {vehicle.location_city}, {vehicle.location_state}
                    </TableCell>
                    <TableCell>{new Date(vehicle.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedVehicle && (
        <DeleteListingDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          listingTitle={selectedVehicle.title}
          listingType="sale"
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};