import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, Edit, Trash2, Clock, Car, MapPin } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  base_price_min: number;
  base_price_max: number;
  is_mobile_available: boolean;
}

interface ProviderService {
  id: string;
  service_id: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  currency: string;
  pickup_available: boolean;
  pickup_fee: number;
  dropoff_available: boolean;
  dropoff_fee: number;
  is_available: boolean;
  notes: string;
  service?: Service;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

const ServicePricing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [providerServices, setProviderServices] = useState<ProviderService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderService | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    service_id: "",
    price_min: 0,
    price_max: 0,
    duration_minutes: 60,
    currency: "USD",
    is_available: true,
    notes: ""
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch available services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (servicesError) throw servicesError;
      setAvailableServices(servicesData || []);

      // Fetch provider services with improved error handling
      const { data: providerData, error: providerError } = await supabase
        .from('provider_services')
        .select(`
          *,
          services!inner(*)
        `)
        .eq('provider_id', user!.id);

      if (providerError) throw providerError;
      setProviderServices(providerData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load services data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProviderService = async () => {
    if (!user || !newServiceForm.service_id) {
      toast({
        title: "Validation Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    // Check if service already exists for this provider
    const existingService = providerServices.find(ps => ps.service_id === newServiceForm.service_id);
    if (existingService) {
      toast({
        title: "Service Already Added",
        description: "You have already configured pricing for this service",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('provider_services')
        .insert({
          provider_id: user.id,
          ...newServiceForm
        });

      if (error) throw error;

      toast({
        title: "Service Added",
        description: "Service pricing has been configured",
      });

      setNewServiceForm({
        service_id: "",
        price_min: 0,
        price_max: 0,
        duration_minutes: 60,
        currency: "USD",
        is_available: true,
        notes: ""
      });
      setIsAddDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const updateProviderService = async () => {
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from('provider_services')
        .update({
          price_min: editingService.price_min,
          price_max: editingService.price_max,
          duration_minutes: editingService.duration_minutes,
          currency: editingService.currency,
          is_available: editingService.is_available,
          notes: editingService.notes
        })
        .eq('id', editingService.id);

      if (error) throw error;

      toast({
        title: "Service Updated",
        description: "Service pricing has been updated",
      });

      setIsEditDialogOpen(false);
      setEditingService(null);
      fetchData();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const deleteProviderService = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service from your offerings?')) return;

    try {
      const { error } = await supabase
        .from('provider_services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Service Removed",
        description: "Service has been removed from your offerings",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to remove service",
        variant: "destructive",
      });
    }
  };

  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || currencyCode;
  };

  const getAvailableServicesForAdd = () => {
    const usedServiceIds = providerServices.map(ps => ps.service_id);
    return availableServices.filter(service => !usedServiceIds.includes(service.id));
  };

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
          <h2 className="text-2xl font-bold">Service Pricing</h2>
          <p className="text-muted-foreground">Configure pricing and options for your services</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Service Pricing</DialogTitle>
              <DialogDescription>
                Configure pricing and options for a new service
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label>Service</Label>
                <Select value={newServiceForm.service_id} onValueChange={(value) => 
                  setNewServiceForm({ ...newServiceForm, service_id: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableServicesForAdd().map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.category}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={newServiceForm.currency} onValueChange={(value) => 
                    setNewServiceForm({ ...newServiceForm, currency: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Min Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newServiceForm.price_min}
                    onChange={(e) => setNewServiceForm({ 
                      ...newServiceForm, 
                      price_min: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>
                <div>
                  <Label>Max Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newServiceForm.price_max}
                    onChange={(e) => setNewServiceForm({ 
                      ...newServiceForm, 
                      price_max: parseFloat(e.target.value) || 0 
                    })}
                  />
                </div>
              </div>

              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newServiceForm.duration_minutes}
                  onChange={(e) => setNewServiceForm({ 
                    ...newServiceForm, 
                    duration_minutes: parseInt(e.target.value) || 60 
                  })}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Special instructions or service details..."
                  value={newServiceForm.notes}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, notes: e.target.value })}
                />
              </div>

              <Button onClick={addProviderService} className="w-full">
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service List */}
      {providerServices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No services configured</h3>
            <p className="text-muted-foreground">Start by adding pricing for your services.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providerServices.map((providerService) => (
            <Card key={providerService.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{providerService.service?.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {providerService.service?.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={providerService.is_available ? "default" : "secondary"}>
                      {providerService.is_available ? "Available" : "Unavailable"}
                    </Badge>
                    <Dialog open={isEditDialogOpen && editingService?.id === providerService.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingService(providerService)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Service Pricing</DialogTitle>
                          <DialogDescription>
                            Update pricing and options for {providerService.service?.name}
                          </DialogDescription>
                        </DialogHeader>
                        {editingService && (
                          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label>Currency</Label>
                                <Select value={editingService.currency} onValueChange={(value) => 
                                  setEditingService({ ...editingService, currency: value })
                                }>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currencies.map((currency) => (
                                      <SelectItem key={currency.code} value={currency.code}>
                                        {currency.symbol} {currency.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Min Price</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingService.price_min}
                                  onChange={(e) => setEditingService({ 
                                    ...editingService, 
                                    price_min: parseFloat(e.target.value) || 0 
                                  })}
                                />
                              </div>
                              <div>
                                <Label>Max Price</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingService.price_max}
                                  onChange={(e) => setEditingService({ 
                                    ...editingService, 
                                    price_max: parseFloat(e.target.value) || 0 
                                  })}
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Duration (minutes)</Label>
                              <Input
                                type="number"
                                value={editingService.duration_minutes}
                                onChange={(e) => setEditingService({ 
                                  ...editingService, 
                                  duration_minutes: parseInt(e.target.value) || 60 
                                })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label>Service Available</Label>
                                <p className="text-sm text-muted-foreground">Enable this service for bookings</p>
                              </div>
                              <Switch
                                checked={editingService.is_available}
                                onCheckedChange={(checked) => setEditingService({ 
                                  ...editingService, 
                                  is_available: checked 
                                })}
                              />
                            </div>

                            <div className="space-y-4 border-t pt-4">
                              <h4 className="font-medium">Transport Options</h4>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <Label>Pickup Service</Label>
                                  <p className="text-sm text-muted-foreground">Offer vehicle pickup</p>
                                </div>
                                <Switch
                                  checked={editingService.pickup_available}
                                  onCheckedChange={(checked) => setEditingService({ 
                                    ...editingService, 
                                    pickup_available: checked 
                                  })}
                                />
                              </div>

                              {editingService.pickup_available && (
                                <div>
                                  <Label>Pickup Fee</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingService.pickup_fee}
                                    onChange={(e) => setEditingService({ 
                                      ...editingService, 
                                      pickup_fee: parseFloat(e.target.value) || 0 
                                    })}
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <Label>Dropoff Service</Label>
                                  <p className="text-sm text-muted-foreground">Offer vehicle dropoff</p>
                                </div>
                                <Switch
                                  checked={editingService.dropoff_available}
                                  onCheckedChange={(checked) => setEditingService({ 
                                    ...editingService, 
                                    dropoff_available: checked 
                                  })}
                                />
                              </div>

                              {editingService.dropoff_available && (
                                <div>
                                  <Label>Dropoff Fee</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingService.dropoff_fee}
                                    onChange={(e) => setEditingService({ 
                                      ...editingService, 
                                      dropoff_fee: parseFloat(e.target.value) || 0 
                                    })}
                                  />
                                </div>
                              )}
                            </div>

                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                placeholder="Special instructions or service details..."
                                value={editingService.notes || ""}
                                onChange={(e) => setEditingService({ 
                                  ...editingService, 
                                  notes: e.target.value 
                                })}
                              />
                            </div>

                            <Button onClick={updateProviderService} className="w-full">
                              Update Service
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProviderService(providerService.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {getCurrencySymbol(providerService.currency)} {providerService.price_min} - {providerService.price_max}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{providerService.duration_minutes} min</span>
                    </div>
                  </div>

                  {(providerService.pickup_available || providerService.dropoff_available) && (
                    <div className="flex items-center gap-4 text-sm">
                      {providerService.pickup_available && (
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>Pickup: {getCurrencySymbol(providerService.currency)}{providerService.pickup_fee}</span>
                        </div>
                      )}
                      {providerService.dropoff_available && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Dropoff: {getCurrencySymbol(providerService.currency)}{providerService.dropoff_fee}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {providerService.service?.description && (
                    <p className="text-sm text-muted-foreground">
                      {providerService.service.description}
                    </p>
                  )}

                  {providerService.notes && (
                    <p className="text-sm text-muted-foreground italic">
                      Note: {providerService.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicePricing;