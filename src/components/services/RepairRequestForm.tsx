import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RepairRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const services = [
  { id: "oil-change", name: "Oil Change" },
  { id: "brake-service", name: "Brake Service" },
  { id: "diagnostics", name: "Computer Diagnostics" },
  { id: "tire-service", name: "Tire Service" },
  { id: "battery", name: "Battery & Electrical" },
  { id: "air-conditioning", name: "Air Conditioning" },
  { id: "engine-repair", name: "Engine Repair" },
  { id: "transmission", name: "Transmission Service" },
  { id: "other", name: "Other Service" },
];

const RepairRequestForm = ({ open, onOpenChange }: RepairRequestFormProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Step 1: Contact Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Vehicle Info
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [vin, setVin] = useState("");

  // Step 3: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceNotes, setServiceNotes] = useState("");

  // Step 4: Appointment
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [pickupRequested, setPickupRequested] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && (!name || !email || !phone)) {
      toast({
        title: "Missing information",
        description: "Please fill in all contact details.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && (!make || !model || !year)) {
      toast({
        title: "Missing information",
        description: "Please provide vehicle make, model, and year.",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service.",
        variant: "destructive",
      });
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!appointmentDate) {
      toast({
        title: "Missing appointment date",
        description: "Please select your preferred appointment date.",
        variant: "destructive",
      });
      return;
    }

    if (pickupRequested && !pickupAddress) {
      toast({
        title: "Missing pickup address",
        description: "Please provide your pickup address.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log({
      contact: { name, email, phone },
      vehicle: { make, model, year, mileage, vin },
      services: selectedServices,
      serviceNotes,
      appointment: { date: appointmentDate, pickupRequested, pickupAddress },
    });

    toast({
      title: "Request submitted!",
      description: "We'll contact you soon to confirm your appointment.",
    });

    // Reset form and close
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setMake("");
    setModel("");
    setYear("");
    setMileage("");
    setVin("");
    setSelectedServices([]);
    setServiceNotes("");
    setAppointmentDate(undefined);
    setPickupRequested(false);
    setPickupAddress("");
    onOpenChange(false);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Schedule a Repair Service</DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}: {
              step === 1 ? "Contact Information" :
              step === 2 ? "Vehicle Information" :
              step === 3 ? "Select Services" :
              "Choose Appointment"
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+252 XX XXX XXXX"
              />
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="Toyota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Camry"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => 2025 - i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Optional)</Label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="1HGBH41JXMN109186"
              />
            </div>
          </div>
        )}

        {/* Step 3: Select Services */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Select Services Needed *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border transition-smooth cursor-pointer hover:bg-muted",
                      selectedServices.includes(service.id) && "bg-primary/10 border-primary"
                    )}
                    onClick={() => toggleService(service.id)}
                  >
                    <Checkbox
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <Label htmlFor={service.id} className="cursor-pointer flex-1">
                      {service.name}
                    </Label>
                    {selectedServices.includes(service.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceNotes">Additional Notes</Label>
              <Textarea
                id="serviceNotes"
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Describe any specific issues or concerns..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 4: Appointment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appointmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate ? format(appointmentDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border">
              <Checkbox
                id="pickup"
                checked={pickupRequested}
                onCheckedChange={(checked) => setPickupRequested(checked as boolean)}
              />
              <Label htmlFor="pickup" className="cursor-pointer flex-1">
                Request vehicle pickup service
              </Label>
            </div>

            {pickupRequested && (
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address *</Label>
                <Input
                  id="pickupAddress"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="123 Main St, Mogadishu"
                />
              </div>
            )}

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold mb-3">Request Summary</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Contact:</span> {name} ({email})</p>
                <p><span className="text-muted-foreground">Vehicle:</span> {year} {make} {model}</p>
                <p><span className="text-muted-foreground">Services:</span> {selectedServices.length} selected</p>
                {appointmentDate && (
                  <p><span className="text-muted-foreground">Date:</span> {format(appointmentDate, "PPP")}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Request
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepairRequestForm;
