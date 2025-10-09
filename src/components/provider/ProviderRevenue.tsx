import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, Calendar, Edit, Trash2, CreditCard, Archive, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RevenueEntry {
  id: string;
  amount: number;
  description: string;
  entry_date: string;
  payment_method: string;
  is_paid: boolean;
  notes: string;
  booking_id?: string;
  created_at: string;
}

interface CompletedBooking {
  id: string;
  customer_name: string;
  service_type: string;
  service_description: string;
  scheduled_date: string;
  price_final: number;
  price_quoted: number;
  total_service_cost: number;
  status: string;
  created_at: string;
}

interface ProviderRevenueProps {
  onRevenueUpdate: () => void;
}

const ProviderRevenue = ({ onRevenueUpdate }: ProviderRevenueProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [revenues, setRevenues] = useState<RevenueEntry[]>([]);
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<RevenueEntry | null>(null);
  const [newRevenue, setNewRevenue] = useState({
    amount: "",
    description: "",
    entry_date: new Date().toISOString().split('T')[0],
    payment_method: "cash",
    is_paid: true,
    notes: ""
  });

  useEffect(() => {
    if (user) {
      fetchRevenues();
      fetchCompletedBookings();
    }
  }, [user, showDeleted]);

  const fetchRevenues = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('revenue_entries')
        .select('*')
        .eq('provider_id', user.id);

      if (showDeleted) {
        query = query.not('deleted_at', 'is', null);
      } else {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.order('entry_date', { ascending: false });

      if (error) throw error;
      setRevenues(data || []);
    } catch (error) {
      console.error('Error fetching revenues:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue entries",
        variant: "destructive",
      });
    }
  };

  const fetchCompletedBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch completed bookings that don't have revenue entries yet
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user.id)
        .eq('status', 'completed')
        .is('deleted_at', null)
        .order('scheduled_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch existing revenue entries to filter out bookings that already have revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('revenue_entries')
        .select('booking_id')
        .eq('provider_id', user.id)
        .not('booking_id', 'is', null);

      if (revenueError) throw revenueError;

      const revenueBookingIds = new Set(revenueData?.map(r => r.booking_id) || []);
      const unbilledBookings = (bookingsData || []).filter(b => !revenueBookingIds.has(b.id));

      setCompletedBookings(unbilledBookings);
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load completed bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRevenue = async () => {
    if (!user || !newRevenue.amount || !newRevenue.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('revenue_entries')
        .insert({
          provider_id: user.id,
          amount: parseFloat(newRevenue.amount),
          description: newRevenue.description,
          entry_date: newRevenue.entry_date,
          payment_method: newRevenue.payment_method,
          is_paid: newRevenue.is_paid,
          notes: newRevenue.notes
        });

      if (error) throw error;

      toast({
        title: "Revenue Added",
        description: "Revenue entry has been recorded",
      });

      setNewRevenue({
        amount: "",
        description: "",
        entry_date: new Date().toISOString().split('T')[0],
        payment_method: "cash",
        is_paid: true,
        notes: ""
      });
      setIsAddDialogOpen(false);
      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error adding revenue:', error);
      toast({
        title: "Error",
        description: "Failed to add revenue entry",
        variant: "destructive",
      });
    }
  };

  const updateRevenue = async () => {
    if (!editingRevenue) return;

    try {
      const { error } = await supabase
        .from('revenue_entries')
        .update({
          amount: editingRevenue.amount,
          description: editingRevenue.description,
          entry_date: editingRevenue.entry_date,
          payment_method: editingRevenue.payment_method,
          is_paid: editingRevenue.is_paid,
          notes: editingRevenue.notes
        })
        .eq('id', editingRevenue.id);

      if (error) throw error;

      toast({
        title: "Revenue Updated",
        description: "Revenue entry has been updated",
      });

      setIsEditDialogOpen(false);
      setEditingRevenue(null);
      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error updating revenue:', error);
      toast({
        title: "Error",
        description: "Failed to update revenue entry",
        variant: "destructive",
      });
    }
  };

  const deleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revenue_entries')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Revenue Deleted",
        description: "Revenue entry has been moved to archive",
      });

      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error deleting revenue:', error);
      toast({
        title: "Error",
        description: "Failed to delete revenue entry",
        variant: "destructive",
      });
    }
  };

  const restoreRevenue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revenue_entries')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Revenue Restored",
        description: "Revenue entry has been restored",
      });

      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error restoring revenue:', error);
      toast({
        title: "Error",
        description: "Failed to restore revenue entry",
        variant: "destructive",
      });
    }
  };

  const permanentDeleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('revenue_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Revenue Permanently Deleted",
        description: "Revenue entry has been permanently removed",
      });

      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error permanently deleting revenue:', error);
      toast({
        title: "Error",
        description: "Failed to permanently delete revenue entry",
        variant: "destructive",
      });
    }
  };

  const markBookingAsPaid = async (booking: CompletedBooking, paymentMethod: string) => {
    try {
      const amount = booking.total_service_cost || booking.price_final || booking.price_quoted || 0;
      
      const { error } = await supabase
        .from('revenue_entries')
        .insert({
          provider_id: user!.id,
          booking_id: booking.id,
          amount: amount,
          description: `${booking.service_type} - ${booking.customer_name}`,
          entry_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
          is_paid: true,
          notes: booking.service_description || ''
        });

      if (error) throw error;

      toast({
        title: "Payment Recorded",
        description: `Revenue entry created for $${amount.toFixed(2)}`,
      });

      fetchRevenues();
      fetchCompletedBookings();
      onRevenueUpdate();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const paidRevenue = revenues.filter(r => r.is_paid).reduce((sum, revenue) => sum + revenue.amount, 0);
  const unpaidRevenue = revenues.filter(r => !r.is_paid).reduce((sum, revenue) => sum + revenue.amount, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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
          <h2 className="text-2xl font-bold">Revenue Management</h2>
          <p className="text-muted-foreground">Track your income and payments</p>
        </div>
        <div className="flex gap-2">
          <Select value={showDeleted ? "deleted" : "active"} onValueChange={(value) => {
            setShowDeleted(value === "deleted");
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Revenue</SelectItem>
              <SelectItem value="deleted">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Deleted
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Revenue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Revenue Entry</DialogTitle>
              <DialogDescription>
                Record a new income entry for your business
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newRevenue.amount}
                  onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })}
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Input
                  placeholder="Service description"
                  value={newRevenue.description}
                  onChange={(e) => setNewRevenue({ ...newRevenue, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newRevenue.entry_date}
                  onChange={(e) => setNewRevenue({ ...newRevenue, entry_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={newRevenue.payment_method} onValueChange={(value) => setNewRevenue({ ...newRevenue, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_paid"
                  checked={newRevenue.is_paid}
                  onChange={(e) => setNewRevenue({ ...newRevenue, is_paid: e.target.checked })}
                />
                <Label htmlFor="is_paid">Payment received</Label>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={newRevenue.notes}
                  onChange={(e) => setNewRevenue({ ...newRevenue, notes: e.target.value })}
                />
              </div>
              <Button onClick={addRevenue} className="w-full">
                Add Revenue Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${unpaidRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Bookings Awaiting Payment */}
      {completedBookings.length > 0 && !showDeleted && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs - Payment Pending</CardTitle>
            <CardDescription>Mark these completed jobs as paid to track revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedBookings.map((booking) => {
                const amount = booking.total_service_cost || booking.price_final || booking.price_quoted || 0;
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{booking.customer_name}</h4>
                        <Badge variant="outline">{booking.service_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.scheduled_date), 'MMM dd, yyyy')} • ${amount.toFixed(2)}
                      </p>
                      {booking.service_description && (
                        <p className="text-sm text-muted-foreground mt-1">{booking.service_description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(paymentMethod) => markBookingAsPaid(booking, paymentMethod)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Mark as Paid" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Entries */}
      {revenues.length === 0 && completedBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No revenue entries</h3>
            <p className="text-muted-foreground">Start tracking your income by adding revenue entries.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {revenues.map((revenue) => (
            <Card key={revenue.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">${revenue.amount.toFixed(2)}</CardTitle>
                    <CardDescription>{revenue.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={revenue.is_paid ? "default" : "secondary"}>
                      {revenue.is_paid ? "Paid" : "Pending"}
                    </Badge>
                    {!showDeleted ? (
                      <>
                        <Dialog open={isEditDialogOpen && editingRevenue?.id === revenue.id} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingRevenue(revenue)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Revenue Entry</DialogTitle>
                          <DialogDescription>
                            Update revenue entry details
                          </DialogDescription>
                        </DialogHeader>
                        {editingRevenue && (
                          <div className="space-y-4">
                            <div>
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingRevenue.amount}
                                onChange={(e) => setEditingRevenue({
                                  ...editingRevenue,
                                  amount: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Input
                                value={editingRevenue.description}
                                onChange={(e) => setEditingRevenue({
                                  ...editingRevenue,
                                  description: e.target.value
                                })}
                              />
                            </div>
                            <div>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={editingRevenue.entry_date}
                                onChange={(e) => setEditingRevenue({
                                  ...editingRevenue,
                                  entry_date: e.target.value
                                })}
                              />
                            </div>
                            <div>
                              <Label>Payment Method</Label>
                              <Select value={editingRevenue.payment_method} onValueChange={(value) => setEditingRevenue({ ...editingRevenue, payment_method: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                                  <SelectItem value="check">Check</SelectItem>
                                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="edit_is_paid"
                                checked={editingRevenue.is_paid}
                                onChange={(e) => setEditingRevenue({
                                  ...editingRevenue,
                                  is_paid: e.target.checked
                                })}
                              />
                              <Label htmlFor="edit_is_paid">Payment received</Label>
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={editingRevenue.notes}
                                onChange={(e) => setEditingRevenue({
                                  ...editingRevenue,
                                  notes: e.target.value
                                })}
                              />
                            </div>
                            <Button onClick={updateRevenue} className="w-full">
                              Save Changes
                            </Button>
                          </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Revenue Entry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Choose how you want to delete this revenue entry of ${revenue.amount.toFixed(2)}:
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button 
                              variant="outline" 
                              onClick={() => deleteRevenue(revenue.id)}
                            >
                              <Archive className="w-4 h-4 mr-1" />
                              Archive (Soft Delete)
                            </Button>
                            <AlertDialogAction 
                              onClick={() => permanentDeleteRevenue(revenue.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => restoreRevenue(revenue.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Permanently Delete Revenue Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete this archived revenue entry of ${revenue.amount.toFixed(2)}? This action cannot be undone and will not affect your revenue totals.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => permanentDeleteRevenue(revenue.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <p className="font-medium">{format(new Date(revenue.entry_date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Method:</span>
                    <p className="font-medium capitalize">{revenue.payment_method}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <p className="font-medium">{revenue.is_paid ? "Paid" : "Pending"}</p>
                  </div>
                </div>
                {revenue.notes && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-sm">{revenue.notes}</p>
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

export default ProviderRevenue;