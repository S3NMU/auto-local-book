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
import { Trash2, Eye } from 'lucide-react';
import { DeleteListingDialog } from './DeleteListingDialog';

interface RentalVehicle {
  id: string;
  provider_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  availability_status: string;
  location_city: string | null;
  location_state: string | null;
  created_at: string;
}

export const RentalsManagement = () => {
  const [rentals, setRentals] = useState<RentalVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<RentalVehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rental_vehicles')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRentals(data || []);
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

  const handleDelete = (rental: RentalVehicle) => {
    setSelectedRental(rental);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (reason: string, sendEmail: boolean) => {
    if (!selectedRental) return;

    try {
      const { error } = await supabase
        .from('rental_vehicles')
        .update({
          deleted_at: new Date().toISOString(),
          deletion_reason: reason,
          is_active: false,
        })
        .eq('id', selectedRental.id);

      if (error) throw error;

      if (sendEmail) {
        await supabase.functions.invoke('notify-listing-deletion', {
          body: {
            listingId: selectedRental.id,
            providerId: selectedRental.provider_id,
            listingType: 'rental',
            listingTitle: selectedRental.title,
            reason: reason,
          },
        });
      }

      toast({
        title: "Success",
        description: "Rental listing deleted successfully",
      });

      fetchRentals();
      setDeleteDialogOpen(false);
      setSelectedRental(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading rentals...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total active listings: {rentals.length}
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No rental listings found
                  </TableCell>
                </TableRow>
              ) : (
                rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.title}</TableCell>
                    <TableCell>{rental.year} {rental.make} {rental.model}</TableCell>
                    <TableCell>${rental.daily_rate}/day</TableCell>
                    <TableCell>
                      {rental.location_city}, {rental.location_state}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rental.availability_status === 'available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {rental.availability_status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(rental.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(rental)}
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

      {selectedRental && (
        <DeleteListingDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          listingTitle={selectedRental.title}
          listingType="rental"
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};