import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultServices?: string[];
}

const SearchDialog = ({ open, onOpenChange, defaultServices = [] }: SearchDialogProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(defaultServices);
  const [priceRange, setPriceRange] = useState("");
  const [timePreference, setTimePreference] = useState("");
  const navigate = useNavigate();
  const { location } = useLocation();
  const { toast } = useToast();

  const serviceOptions = [
    "Oil Change", "Brake Service", "Diagnostics", "Tune-Up", 
    "Inspection", "Auto Detailing", "Tire Service", "Battery Replacement",
    "Engine Repair", "Transmission Service", "Air Conditioning", "Electrical Work"
  ];

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const removeService = (service: string) => {
    setSelectedServices(prev => prev.filter(s => s !== service));
  };

  const handleSearch = () => {
    if (!location) {
      toast({
        title: "Location required",
        description: "Please set your location first to find nearby providers.",
        variant: "destructive",
      });
      return;
    }

    // Build search parameters
    const searchParams = new URLSearchParams();
    if (selectedServices.length > 0) {
      searchParams.set('services', selectedServices.join(','));
    }
    if (priceRange) searchParams.set('price', priceRange);
    if (timePreference) searchParams.set('time', timePreference);
    
    // Navigate to providers page with search filters
    navigate(`/providers?${searchParams.toString()}`);
    onOpenChange(false);
    
    const serviceText = selectedServices.length > 0 
      ? selectedServices.join(', ') 
      : 'automotive';
    
    toast({
      title: "Searching providers",
      description: `Finding providers for ${serviceText} services near ${location.address}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Service Providers
          </DialogTitle>
          <DialogDescription>
            {location 
              ? `Searching near ${location.address}`
              : "Set your location to find nearby providers"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Service Types</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label 
                    htmlFor={service} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedServices.map((service) => (
                  <Badge key={service} variant="secondary" className="flex items-center gap-1">
                    {service}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeService(service)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-range">Price Range</Label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget ($25-$75)</SelectItem>
                <SelectItem value="standard">Standard ($75-$150)</SelectItem>
                <SelectItem value="premium">Premium ($150+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-preference">When do you need service?</Label>
            <Select value={timePreference} onValueChange={setTimePreference}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="next-week">Next Week</SelectItem>
                <SelectItem value="flexible">I'm Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!location && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location needed</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Click "Find Location" in the header to set your location first.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSearch} disabled={!location} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Find Providers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;