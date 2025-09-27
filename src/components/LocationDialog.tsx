import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
}

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

const LocationDialog = ({ open, onOpenChange, onLocationSelect }: LocationDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const searchTimeout = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Get Mapbox token from edge function
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const response = await fetch('/api/get-mapbox-token');
        if (response.ok) {
          const data = await response.json();
          setMapboxToken(data.token);
          mapboxgl.accessToken = data.token;
        }
      } catch (error) {
        console.error('Failed to get Mapbox token:', error);
      }
    };

    if (open) {
      getMapboxToken();
    }
  }, [open]);

  const searchLocations = async (query: string) => {
    if (!query.trim() || !mapboxToken) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.features || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Unable to search locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    if (value.trim()) {
      searchTimeout.current = setTimeout(() => {
        searchLocations(value);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&limit=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.features[0]?.place_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            
            onLocationSelect({
              address,
              lat: latitude,
              lng: longitude,
            });
            onOpenChange(false);
            
            toast({
              title: "Location found",
              description: `Using your current location: ${address}`,
            });
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          onLocationSelect({
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            lat: latitude,
            lng: longitude,
          });
          onOpenChange(false);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        let message = "Unable to get your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleLocationSelect = (result: SearchResult) => {
    onLocationSelect({
      address: result.place_name,
      lat: result.center[1],
      lng: result.center[0],
    });
    onOpenChange(false);
    setSearchQuery("");
    setSearchResults([]);
    
    toast({
      title: "Location selected",
      description: `Using location: ${result.place_name}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Your Location
          </DialogTitle>
          <DialogDescription>
            Search for an address or use your current location to find nearby service providers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Location Button */}
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation || !mapboxToken}
            className="w-full"
            variant="outline"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4 mr-2" />
            )}
            Use Current Location
          </Button>

          <div className="relative">
            <Label htmlFor="location-search">Or search for an address</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="location-search"
                placeholder="Enter city, address, or ZIP code..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                disabled={!mapboxToken}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Label className="text-sm text-muted-foreground">Search Results</Label>
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleLocationSelect(result)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{result.place_name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !isSearching && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No locations found. Try a different search term.
            </p>
          )}

          {!mapboxToken && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading location services...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;