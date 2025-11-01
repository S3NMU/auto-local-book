import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/pages/Rentals";
import { useToast } from "@/hooks/use-toast";

interface BookingCalendarProps {
  vehicle: Vehicle;
}

const BookingCalendar = ({ vehicle }: BookingCalendarProps) => {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>("09:00");
  const [returnTime, setReturnTime] = useState<string>("09:00");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const calculateTotal = () => {
    if (!pickupDate || !returnDate) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    if (days <= 0) return 0;
    
    // Calculate weekly and daily rates
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    return (weeks * vehicle.price_per_week) + (remainingDays * vehicle.price_per_day);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupDate || !returnDate) {
      toast({
        title: "Missing dates",
        description: "Please select both pickup and return dates.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the booking data to your backend
    toast({
      title: "Booking request submitted!",
      description: `We'll contact you at ${customerEmail} to confirm your reservation.`,
    });
  };

  const total = calculateTotal();
  const rentalDays = pickupDate && returnDate ? differenceInDays(returnDate, pickupDate) : 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dates and Times */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pickup Date */}
            <div className="space-y-2">
              <Label>Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !pickupDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Pickup Time */}
            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => !pickupDate || date <= pickupDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Time */}
            <div className="space-y-2">
              <Label>Return Time</Label>
              <Select value={returnTime} onValueChange={setReturnTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+252 XX XXX XXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Price Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rentalDays > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rental Duration:</span>
                <span className="font-medium">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Rate:</span>
                <span className="font-medium">${vehicle.price_per_day}/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weekly Rate:</span>
                <span className="font-medium">${vehicle.price_per_week}/week</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </>
          )}
          {rentalDays <= 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Select pickup and return dates to see pricing
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size="lg" disabled={!pickupDate || !returnDate || rentalDays <= 0}>
            Submit Booking Request
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BookingCalendar;
