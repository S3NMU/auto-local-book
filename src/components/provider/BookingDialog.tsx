import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, Car, MapPin, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
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

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerRecord;
  providerId: string;
}

interface SelectedService {
  providerService: ProviderService;
  customPrice: number;
  quantity: number;
}

const BookingDialog = ({ open, onOpenChange, customer, providerId }: BookingDialogProps) => {
  const { toast } = useToast();
  const [providerServices, setProviderServices] = useState<ProviderService[]>([]);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [pickupRequested, setPickupRequested] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffRequested, setDropoffRequested] = useState(false);
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProviderServices();
      fetchProviderProfile();
      // Pre-fill pickup address with customer address
      setPickupAddress(customer.customer_address || "");
    }
  }, [open, providerId]);

  const fetchProviderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('pickup_available, dropoff_available, pickup_fee, dropoff_fee')
        .eq('user_id', providerId)
        .single();

      if (error) throw error;
      setProviderProfile(data);
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    }
  };

  const fetchProviderServices = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          *,
          service:services(*)
        `)
        .eq('provider_id', providerId)
        .eq('is_available', true);

      if (error) throw error;
      setProviderServices(data || []);
    } catch (error) {
      console.error('Error fetching provider services:', error);
      toast({
        title: "Error",
        description: "Failed to load available services",
        variant: "destructive",
      });
    }
  };

  const addService = (providerService: ProviderService) => {
    const existingService = selectedServices.find(s => s.providerService.id === providerService.id);
    if (existingService) {
      setSelectedServices(prev => 
        prev.map(s => 
          s.providerService.id === providerService.id 
            ? { ...s, quantity: s.quantity + 1 }
            : s
        )
      );
    } else {
      setSelectedServices(prev => [...prev, {
        providerService,
        customPrice: providerService.price_min || 0,
        quantity: 1
      }]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.providerService.id !== serviceId));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
      return;
    }
    setSelectedServices(prev => 
      prev.map(s => 
        s.providerService.id === serviceId 
          ? { ...s, quantity }
          : s
      )
    );
  };

  const updateServicePrice = (serviceId: string, price: number) => {
    setSelectedServices(prev => 
      prev.map(s => 
        s.providerService.id === serviceId 
          ? { ...s, customPrice: price }
          : s
      )
    );
  };

  const calculateTotal = () => {
    const serviceTotal = selectedServices.reduce((sum, service) => 
      sum + (service.customPrice * service.quantity), 0
    );
    
    const pickupFee = pickupRequested ? (providerProfile?.pickup_fee || 0) : 0;
    const dropoffFee = dropoffRequested ? (providerProfile?.dropoff_fee || 0) : 0;
    
    return serviceTotal + pickupFee + dropoffFee;
  };

  const getCurrency = () => {
    return selectedServices[0]?.providerService.currency || 'USD';
  };

  const createBooking = async () => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select date, time, and at least one service",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes));

      const totalServiceCost = selectedServices.reduce((sum, service) => 
        sum + (service.customPrice * service.quantity), 0
      );
      
      const pickupFee = pickupRequested ? (providerProfile?.pickup_fee || 0) : 0;
      const dropoffFee = dropoffRequested ? (providerProfile?.dropoff_fee || 0) : 0;
      const additionalFees = pickupFee + dropoffFee;

      const { error } = await supabase
        .from('bookings')
        .insert({
          provider_id: providerId,
          customer_id: null, // Since this is from provider side, customer might not have an account
          customer_name: customer.customer_name,
          customer_email: customer.customer_email,
          customer_phone: customer.customer_phone,
          scheduled_date: scheduledDate.toISOString(),
          service_type: selectedServices.map(s => s.providerService.service?.name).join(', '),
          service_description: selectedServices.map(s => 
            `${s.providerService.service?.name} (${s.quantity}x)`
          ).join(', '),
          service_ids: selectedServices.map(s => s.providerService.service_id),
          total_service_cost: totalServiceCost,
          additional_fees: additionalFees,
          price_quoted: totalServiceCost + additionalFees,
          currency: getCurrency(),
          pickup_requested: pickupRequested,
          pickup_address: pickupRequested ? pickupAddress : null,
          pickup_fee: pickupFee,
          dropoff_requested: dropoffRequested,
          dropoff_address: dropoffRequested ? dropoffAddress : null,
          dropoff_fee: dropoffFee,
          notes: notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Created",
        description: "The booking has been successfully created",
      });

      // Reset form
      setSelectedServices([]);
      setSelectedDate(undefined);
      setSelectedTime("");
      setPickupRequested(false);
      setPickupAddress("");
      setDropoffRequested(false);
      setDropoffAddress("");
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Booking for {customer.customer_name}</DialogTitle>
          <DialogDescription>
            Schedule a service appointment with pricing and options
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Services & Options */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Customer & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {customer.customer_name}</p>
                <p><strong>Email:</strong> {customer.customer_email || 'N/A'}</p>
                <p><strong>Phone:</strong> {customer.customer_phone || 'N/A'}</p>
                <p><strong>Vehicle:</strong> {customer.vehicle_year} {customer.vehicle_make} {customer.vehicle_model}</p>
              </CardContent>
            </Card>

            {/* Available Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {providerServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.service?.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.service?.description}</p>
                      <p className="text-sm">
                        {service.currency} {service.price_min} - {service.price_max}
                        {service.duration_minutes && ` • ${service.duration_minutes} min`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addService(service)}
                      disabled={selectedServices.some(s => s.providerService.id === service.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Vehicle Transportation Options */}
            {(providerProfile?.pickup_available || providerProfile?.dropoff_available) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicle Transportation Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {providerProfile?.pickup_available && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="pickup_requested"
                          checked={pickupRequested}
                          onCheckedChange={(checked) => setPickupRequested(checked as boolean)}
                        />
                        <Label htmlFor="pickup_requested" className="font-medium">
                          Vehicle Pickup Service
                        </Label>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${providerProfile?.pickup_fee || 0}</div>
                        <div className="text-sm text-muted-foreground">Additional fee</div>
                      </div>
                    </div>
                  )}

                  {providerProfile?.dropoff_available && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="dropoff_requested"
                          checked={dropoffRequested}
                          onCheckedChange={(checked) => setDropoffRequested(checked as boolean)}
                        />
                        <Label htmlFor="dropoff_requested" className="font-medium">
                          Vehicle Dropoff Service
                        </Label>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${providerProfile?.dropoff_fee || 0}</div>
                        <div className="text-sm text-muted-foreground">Additional fee</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pickup & Dropoff Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Transport Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServices.length > 0 && selectedServices[0].providerService.pickup_available && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pickup"
                        checked={pickupRequested}
                        onCheckedChange={(checked) => setPickupRequested(checked === true)}
                      />
                      <Label htmlFor="pickup">
                        Vehicle Pickup (+{getCurrency()} {selectedServices[0]?.providerService.pickup_fee})
                      </Label>
                    </div>
                    {pickupRequested && (
                      <Input
                        placeholder="Pickup address"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                      />
                    )}
                  </div>
                )}

                {selectedServices.length > 0 && selectedServices[0].providerService.dropoff_available && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dropoff"
                        checked={dropoffRequested}
                        onCheckedChange={(checked) => setDropoffRequested(checked === true)}
                      />
                      <Label htmlFor="dropoff">
                        Vehicle Dropoff (+{getCurrency()} {selectedServices[0]?.providerService.dropoff_fee})
                      </Label>
                    </div>
                    {dropoffRequested && (
                      <Input
                        placeholder="Dropoff address"
                        value={dropoffAddress}
                        onChange={(e) => setDropoffAddress(e.target.value)}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Services & Scheduling */}
          <div className="space-y-6">
            {/* Selected Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServices.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No services selected</p>
                ) : (
                  selectedServices.map((selectedService) => (
                    <div key={selectedService.providerService.id} className="space-y-3 p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{selectedService.providerService.service?.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {selectedService.providerService.service?.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeService(selectedService.providerService.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Quantity</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateServiceQuantity(
                                selectedService.providerService.id, 
                                selectedService.quantity - 1
                              )}
                            >
                              -
                            </Button>
                            <span className="px-3 py-1 border rounded text-center min-w-12">
                              {selectedService.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateServiceQuantity(
                                selectedService.providerService.id, 
                                selectedService.quantity + 1
                              )}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Price ({getCurrency()})</Label>
                          <Input
                            type="number"
                            min={selectedService.providerService.price_min}
                            max={selectedService.providerService.price_max}
                            value={selectedService.customPrice}
                            onChange={(e) => updateServicePrice(
                              selectedService.providerService.id,
                              parseFloat(e.target.value) || 0
                            )}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Subtotal: {getCurrency()} {(selectedService.customPrice * selectedService.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Total & Create Button */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Services:</span>
                    <span>{getCurrency()} {selectedServices.reduce((sum, service) => 
                      sum + (service.customPrice * service.quantity), 0
                    ).toFixed(2)}</span>
                  </div>
                  {pickupRequested && (
                    <div className="flex justify-between">
                      <span>Pickup Fee:</span>
                      <span>{getCurrency()} {selectedServices[0]?.providerService.pickup_fee?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                  {dropoffRequested && (
                    <div className="flex justify-between">
                      <span>Dropoff Fee:</span>
                      <span>{getCurrency()} {selectedServices[0]?.providerService.dropoff_fee?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{getCurrency()} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={createBooking} 
                  className="w-full" 
                  disabled={loading || selectedServices.length === 0 || !selectedDate || !selectedTime}
                >
                  {loading ? "Creating..." : "Create Booking"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;