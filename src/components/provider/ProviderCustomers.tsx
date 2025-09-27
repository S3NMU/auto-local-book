import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Search, Phone, Mail, Calendar, DollarSign, Car, Edit, Trash2, CalendarPlus, RotateCcw, Archive } from "lucide-react";
import BookingDialog from "./BookingDialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_vin: string;
  notes: string;
  last_service_date: string;
  total_services: number;
  total_spent: number;
  created_at: string;
}

const ProviderCustomers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [bookingCustomer, setBookingCustomer] = useState<CustomerRecord | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_vin: "",
    notes: ""
  });

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user, showDeleted]);

  const fetchCustomers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('customer_records')
        .select('*')
        .eq('provider_id', user.id);

      if (showDeleted) {
        query = query.not('deleted_at', 'is', null);
      } else {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customer records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async () => {
    if (!user || !newCustomer.customer_name) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('customer_records')
        .insert({
          provider_id: user.id,
          customer_name: newCustomer.customer_name,
          customer_email: newCustomer.customer_email || null,
          customer_phone: newCustomer.customer_phone || null,
          customer_address: newCustomer.customer_address || null,
          vehicle_make: newCustomer.vehicle_make || null,
          vehicle_model: newCustomer.vehicle_model || null,
          vehicle_year: newCustomer.vehicle_year ? parseInt(newCustomer.vehicle_year) : null,
          vehicle_vin: newCustomer.vehicle_vin || null,
          notes: newCustomer.notes || null
        });

      if (error) throw error;

      toast({
        title: "Customer Added",
        description: "Customer record has been created",
      });

      setNewCustomer({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        vehicle_vin: "",
        notes: ""
      });
      setIsAddDialogOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer record",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const { error } = await supabase
        .from('customer_records')
        .update({
          customer_name: editingCustomer.customer_name,
          customer_email: editingCustomer.customer_email || null,
          customer_phone: editingCustomer.customer_phone || null,
          customer_address: editingCustomer.customer_address || null,
          vehicle_make: editingCustomer.vehicle_make || null,
          vehicle_model: editingCustomer.vehicle_model || null,
          vehicle_year: editingCustomer.vehicle_year || null,
          vehicle_vin: editingCustomer.vehicle_vin || null,
          notes: editingCustomer.notes || null
        })
        .eq('id', editingCustomer.id);

      if (error) throw error;

      toast({
        title: "Customer Updated",
        description: "Customer record has been updated",
      });

      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer record",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_records')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Customer Deleted",
        description: "Customer record has been moved to archive",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer record",
        variant: "destructive",
      });
    }
  };

  const restoreCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_records')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Customer Restored",
        description: "Customer record has been restored",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error restoring customer:', error);
      toast({
        title: "Error",
        description: "Failed to restore customer record",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.vehicle_make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Manage your customer database and vehicle records</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer record with vehicle information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={newCustomer.customer_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="customer@email.com"
                    value={newCustomer.customer_email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, customer_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={newCustomer.customer_phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, customer_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    placeholder="Street address"
                    value={newCustomer.customer_address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, customer_address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Vehicle Make</Label>
                  <Input
                    placeholder="Toyota"
                    value={newCustomer.vehicle_make}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicle_make: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Vehicle Model</Label>
                  <Input
                    placeholder="Camry"
                    value={newCustomer.vehicle_model}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicle_model: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    placeholder="2020"
                    value={newCustomer.vehicle_year}
                    onChange={(e) => setNewCustomer({ ...newCustomer, vehicle_year: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>VIN</Label>
                <Input
                  placeholder="Vehicle Identification Number"
                  value={newCustomer.vehicle_vin}
                  onChange={(e) => setNewCustomer({ ...newCustomer, vehicle_vin: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Customer preferences, vehicle history, etc."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                />
              </div>
              <Button onClick={addCustomer} className="w-full">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search customers by name, email, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={showDeleted ? "deleted" : "active"} onValueChange={(value) => {
          setShowDeleted(value === "deleted");
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Customers</SelectItem>
            <SelectItem value="deleted">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Deleted
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Customer records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, customer) => sum + customer.total_services, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Services completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customers.reduce((sum, customer) => sum + customer.total_spent, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total from customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No customers found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No customers match your search criteria." : "Start building your customer database."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{customer.customer_name}</CardTitle>
                    <CardDescription>
                      {customer.vehicle_make && customer.vehicle_model && 
                        `${customer.vehicle_year || ''} ${customer.vehicle_make} ${customer.vehicle_model}`.trim()
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {customer.total_services} service{customer.total_services !== 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setBookingCustomer(customer);
                        setIsBookingDialogOpen(true);
                      }}
                    >
                      <CalendarPlus className="w-4 h-4 mr-1" />
                      Book Service
                    </Button>
                    {!showDeleted ? (
                      <>
                        <Dialog open={isEditDialogOpen && editingCustomer?.id === customer.id} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCustomer(customer)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Customer</DialogTitle>
                          <DialogDescription>
                            Update customer and vehicle information
                          </DialogDescription>
                        </DialogHeader>
                        {editingCustomer && (
                          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Customer Name</Label>
                                <Input
                                  value={editingCustomer.customer_name}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    customer_name: e.target.value
                                  })}
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={editingCustomer.customer_email || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    customer_email: e.target.value
                                  })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Phone</Label>
                                <Input
                                  value={editingCustomer.customer_phone || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    customer_phone: e.target.value
                                  })}
                                />
                              </div>
                              <div>
                                <Label>Address</Label>
                                <Input
                                  value={editingCustomer.customer_address || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    customer_address: e.target.value
                                  })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Vehicle Make</Label>
                                <Input
                                  value={editingCustomer.vehicle_make || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    vehicle_make: e.target.value
                                  })}
                                />
                              </div>
                              <div>
                                <Label>Vehicle Model</Label>
                                <Input
                                  value={editingCustomer.vehicle_model || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    vehicle_model: e.target.value
                                  })}
                                />
                              </div>
                              <div>
                                <Label>Year</Label>
                                <Input
                                  type="number"
                                  value={editingCustomer.vehicle_year || ""}
                                  onChange={(e) => setEditingCustomer({
                                    ...editingCustomer,
                                    vehicle_year: parseInt(e.target.value) || 0
                                  })}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>VIN</Label>
                              <Input
                                value={editingCustomer.vehicle_vin || ""}
                                onChange={(e) => setEditingCustomer({
                                  ...editingCustomer,
                                  vehicle_vin: e.target.value
                                })}
                              />
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                value={editingCustomer.notes || ""}
                                onChange={(e) => setEditingCustomer({
                                  ...editingCustomer,
                                  notes: e.target.value
                                })}
                              />
                            </div>
                            <Button onClick={updateCustomer} className="w-full">
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
                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {customer.customer_name}? This action will move the customer to the archive. You can restore it later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCustomer(customer.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => restoreCustomer(customer.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {customer.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{customer.customer_email}</span>
                    </div>
                  )}
                  {customer.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{customer.customer_phone}</span>
                    </div>
                  )}
                  {customer.last_service_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Last service: {format(new Date(customer.last_service_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total: ${customer.total_spent.toFixed(2)}</span>
                  </div>
                </div>
                
                {customer.vehicle_vin && (
                  <div className="flex items-center gap-2 mt-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">VIN: {customer.vehicle_vin}</span>
                  </div>
                )}
                
                {customer.notes && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-sm">{customer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      {bookingCustomer && user && (
        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          customer={bookingCustomer}
          providerId={user.id}
        />
      )}
    </div>
  );
};

export default ProviderCustomers;