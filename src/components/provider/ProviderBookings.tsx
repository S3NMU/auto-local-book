import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Phone, Mail, MapPin, Edit, Check, X, Plus } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  service_description: string;
  scheduled_date: string;
  duration_minutes: number;
  price_quoted: number;
  price_final: number;
  status: string;
  notes: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zip_code: string;
  created_at: string;
}

interface ProviderBookingsProps {
  onBookingUpdate: () => void;
}

const ProviderBookings = ({ onBookingUpdate }: ProviderBookingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${status}`,
      });

      onBookingUpdate();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const updateBooking = async (booking: Booking) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          price_final: booking.price_final,
          notes: booking.notes,
          duration_minutes: booking.duration_minutes
        })
        .eq('id', booking.id);

      if (error) throw error;

      setBookings(prev => 
        prev.map(b => b.id === booking.id ? booking : b)
      );

      toast({
        title: "Booking Updated",
        description: "Booking details have been saved",
      });

      setIsEditDialogOpen(false);
      setEditingBooking(null);
      onBookingUpdate();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    statusFilter === "all" || booking.status === statusFilter
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Manage your service appointments</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {statusFilter === "all" 
                ? "You don't have any bookings yet." 
                : `No ${statusFilter} bookings found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{booking.customer_name}</CardTitle>
                      <CardDescription>{booking.service_type}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={isEditDialogOpen && editingBooking?.id === booking.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingBooking(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Booking</DialogTitle>
                          <DialogDescription>
                            Update booking details and pricing
                          </DialogDescription>
                        </DialogHeader>
                        {editingBooking && (
                          <div className="space-y-4">
                            <div>
                              <Label>Final Price</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingBooking.price_final || ""}
                                onChange={(e) => setEditingBooking({
                                  ...editingBooking,
                                  price_final: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                            <div>
                              <Label>Duration (minutes)</Label>
                              <Input
                                type="number"
                                value={editingBooking.duration_minutes || ""}
                                onChange={(e) => setEditingBooking({
                                  ...editingBooking,
                                  duration_minutes: parseInt(e.target.value) || 0
                                })}
                              />
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={editingBooking.notes || ""}
                                onChange={(e) => setEditingBooking({
                                  ...editingBooking,
                                  notes: e.target.value
                                })}
                                placeholder="Add service notes..."
                              />
                            </div>
                            <Button onClick={() => updateBooking(editingBooking)} className="w-full">
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(booking.scheduled_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(booking.scheduled_date), 'h:mm a')}
                    </span>
                  </div>
                  {booking.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{booking.customer_phone}</span>
                    </div>
                  )}
                  {booking.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{booking.customer_email}</span>
                    </div>
                  )}
                </div>
                
                {booking.location_address && (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {booking.location_address}, {booking.location_city}, {booking.location_state} {booking.location_zip_code}
                    </span>
                  </div>
                )}
                
                {booking.service_description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {booking.service_description}
                  </p>
                )}
                
                {(booking.price_quoted || booking.price_final) && (
                  <div className="flex items-center gap-4 mt-2">
                    {booking.price_quoted && (
                      <span className="text-sm">
                        Quoted: <span className="font-medium">${booking.price_quoted}</span>
                      </span>
                    )}
                    {booking.price_final && (
                      <span className="text-sm">
                        Final: <span className="font-medium">${booking.price_final}</span>
                      </span>
                    )}
                  </div>
                )}
                
                {booking.notes && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;