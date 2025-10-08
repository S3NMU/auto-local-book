import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Wrench, Loader2 } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import mapboxgl from 'mapbox-gl';

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

const Hero = () => {
  const navigate = useNavigate();
  const { location, setLocation } = useLocation();
  const [stats, setStats] = useState({
    providers: 0,
    services: 0,
    rating: 0
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const searchTimeout = useRef<NodeJS.Timeout>();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get Mapbox token
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error calling edge function:', error);
          return;
        }
        
        if (data && data.token) {
          setMapboxToken(data.token);
          mapboxgl.accessToken = data.token;
        }
      } catch (error) {
        console.error('Failed to get Mapbox token:', error);
      }
    };

    getMapboxToken();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get provider count
        const { count: providerCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get unique service categories
        const { data: servicesData } = await supabase
          .from('services')
          .select('category');
        
        const uniqueCategories = [...new Set(servicesData?.map(s => s.category) || [])];

        // Get average rating
        const { data: providersData } = await supabase
          .from('providers')
          .select('rating')
          .eq('status', 'active');

        const avgRating = providersData && providersData.length > 0
          ? providersData.reduce((sum, p) => sum + (p.rating || 0), 0) / providersData.length
          : 0;

        setStats({
          providers: providerCount || 0,
          services: uniqueCategories.length,
          rating: avgRating
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const searchLocations = async (query: string) => {
    if (!query.trim() || !mapboxToken) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=5&types=place,locality,neighborhood,address,postcode&country=US`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.features || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
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
      setShowDropdown(false);
    }
  };

  const handleLocationSelect = (result: SearchResult) => {
    const selectedLocation = {
      address: result.place_name,
      lat: result.center[1],
      lng: result.center[0],
    };
    setLocation(selectedLocation);
    setSearchQuery(result.place_name);
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleFindProviders = () => {
    if (location) {
      navigate('/providers', { state: { location } });
      // Clear search query after navigation
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  return (
    <section className="relative bg-gradient-subtle pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Full-width hero content */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
              Find Trusted
              <span className="block text-primary">Auto Services</span>
              Near You
            </h1>
          </div>

          {/* Location and Search */}
          <div className="bg-card rounded-lg p-6 shadow-elegant max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground z-10" />
                <Input 
                  placeholder="Enter your location or ZIP code"
                  className="pl-10 py-3 text-base"
                  value={searchQuery || location?.address || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                )}
                
                {/* Dropdown Results */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Card
                        key={result.id}
                        className="p-3 cursor-pointer hover:bg-accent transition-colors border-0 rounded-none first:rounded-t-lg last:rounded-b-lg"
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
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full py-3" 
                onClick={handleFindProviders}
                disabled={!location}
              >
                Find Providers Near You
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.providers}+</span>
              </div>
              <p className="text-lg text-muted-foreground">Verified Providers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-primary mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.services}+</span>
              </div>
              <p className="text-lg text-muted-foreground">Service Types</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-accent mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.rating > 0 ? stats.rating.toFixed(1) : '0.0'}</span>
              </div>
              <p className="text-lg text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;