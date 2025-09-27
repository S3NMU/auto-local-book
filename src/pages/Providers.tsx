import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Star, Phone, Mail, Clock, Navigation, Settings, ExternalLink, Globe, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";

interface Provider {
  id: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  specialties: string[];
  is_mobile: boolean;
  phone?: string;
  email?: string;
  description?: string;
  website_url?: string;
  distance?: number;
}

const Providers = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(50); // Default 50 miles
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [mobileServiceFilter, setMobileServiceFilter] = useState<boolean | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [zipCodeFilter, setZipCodeFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const { location } = useLocation();
  const { toast } = useToast();

  const radiusOptions = [
    { value: 25, label: "25 miles" },
    { value: 50, label: "50 miles" },
    { value: 100, label: "100 miles" },
    { value: 200, label: "200 miles" },
    { value: 1000, label: "Show all" },
  ];

  // Get unique specialties, states, and cities for filter dropdowns
  const allSpecialties = Array.from(new Set(providers.flatMap(p => p.specialties || [])))
    .filter(Boolean)
    .sort();
    
  const allStates = Array.from(new Set(providers.map(p => p.state)))
    .filter(Boolean)
    .sort();
    
  const allCities = Array.from(new Set(
    providers
      .filter(p => selectedState === 'all' || p.state === selectedState)
      .map(p => p.city)
  ))
    .filter(Boolean)
    .sort();

  useEffect(() => {
    // Get session and set up auth listener
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*');

      if (error) throw error;
      
      let providersData = data || [];
      
      // If user has a location, filter by distance and sort by proximity
      if (location) {
        providersData = providersData.map(provider => ({
          ...provider,
          distance: calculateDistanceValue(provider.latitude, provider.longitude)
        }))
        .filter(provider => searchRadius >= 1000 || provider.distance <= searchRadius) // Show all if radius is 1000+
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      setProviders(providersData);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter providers based on search and filter criteria
  const filterProviders = () => {
    let filtered = providers;

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.business_name.toLowerCase().includes(searchLower) ||
        provider.city.toLowerCase().includes(searchLower) ||
        provider.state.toLowerCase().includes(searchLower) ||
        provider.specialties?.some(s => s.toLowerCase().includes(searchLower)) ||
        provider.description?.toLowerCase().includes(searchLower)
      );
    }

    // Location filters
    if (selectedState !== 'all') {
      filtered = filtered.filter(provider => provider.state === selectedState);
    }
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(provider => provider.city === selectedCity);
    }
    
    if (zipCodeFilter) {
      filtered = filtered.filter(provider => 
        provider.zip_code && provider.zip_code.includes(zipCodeFilter)
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(provider => 
        provider.specialties?.includes(selectedSpecialty)
      );
    }

    // Mobile service filter
    if (mobileServiceFilter !== null) {
      filtered = filtered.filter(provider => 
        provider.is_mobile === mobileServiceFilter
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(provider => 
        provider.rating >= minRating
      );
    }

    setFilteredProviders(filtered);
  };

  // Update filtered providers when filters change
  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedSpecialty, mobileServiceFilter, minRating, selectedState, selectedCity, zipCodeFilter]);

  // Reset city when state changes
  useEffect(() => {
    if (selectedState !== 'all') {
      setSelectedCity('all');
    }
  }, [selectedState]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setMobileServiceFilter(null);
    setMinRating(0);
    setSelectedState('all');
    setSelectedCity('all');
    setZipCodeFilter('');
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Refetch providers when location or radius changes
  useEffect(() => {
    fetchProviders();
  }, [location, searchRadius]);

  const handleRadiusChange = (newRadius: string) => {
    const radius = parseInt(newRadius);
    setSearchRadius(radius);
    
    toast({
      title: "Search radius updated",
      description: `Now showing providers within ${radius >= 1000 ? 'unlimited distance' : `${radius} miles`}`,
    });
  };

  const calculateDistanceValue = (providerLat: number, providerLng: number): number => {
    if (!location) return 0;
    
    const R = 3959; // Earth's radius in miles
    const dLat = (providerLat - location.lat) * Math.PI / 180;
    const dLng = (providerLng - location.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.lat * Math.PI / 180) * Math.cos(providerLat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDistance = (providerLat: number, providerLng: number): string => {
    const distance = calculateDistanceValue(providerLat, providerLng);
    if (!location || distance === 0) return "";
    
    return distance < 1 ? 
      `${(distance * 5280).toFixed(0)} ft` : 
      `${distance.toFixed(1)} mi`;
  };

  if (loading) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Service Providers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading providers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Service Providers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {location 
              ? `Find trusted automotive service providers ${searchRadius >= 1000 ? 'anywhere' : `within ${searchRadius} miles of ${location.address}`}. All providers are verified and rated by real customers.`
              : "Find trusted automotive service providers in your area. All providers are verified and rated by real customers for your peace of mind."
            }
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by business name, location, or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(selectedSpecialty !== 'all' || mobileServiceFilter !== null || minRating > 0 || selectedState !== 'all' || selectedCity !== 'all' || zipCodeFilter) && (
                <Badge variant="secondary" className="ml-1">
                  {[
                    selectedSpecialty !== 'all' ? 1 : 0,
                    mobileServiceFilter !== null ? 1 : 0,
                    minRating > 0 ? 1 : 0,
                    selectedState !== 'all' ? 1 : 0,
                    selectedCity !== 'all' ? 1 : 0,
                    zipCodeFilter ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
            
            {(searchTerm || selectedSpecialty !== 'all' || mobileServiceFilter !== null || minRating > 0 || selectedState !== 'all' || selectedCity !== 'all' || zipCodeFilter) && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card rounded-lg p-6 border space-y-6">
              {/* Location Filters Row */}
              <div>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Radius */}
                  {location && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Search Radius</Label>
                      <Select value={searchRadius.toString()} onValueChange={handleRadiusChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border shadow-lg z-50">
                          {radiusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* State Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">State</Label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger>
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="all">All states</SelectItem>
                        {allStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="all">All cities</SelectItem>
                        {allCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ZIP Code Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">ZIP Code</Label>
                    <Input
                      placeholder="Enter ZIP code"
                      value={zipCodeFilter}
                      onChange={(e) => setZipCodeFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Service Filters Row */}
              <div>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Service Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Service Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Service Type</Label>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All services" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="all">All services</SelectItem>
                        {allSpecialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile Service Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Service Location</Label>
                    <Select 
                      value={mobileServiceFilter === null ? "all" : mobileServiceFilter.toString()} 
                      onValueChange={(value) => setMobileServiceFilter(value === "all" ? null : value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="true">Mobile service only</SelectItem>
                        <SelectItem value="false">Shop location only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        <SelectItem value="0">Any rating</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="4.5">4.5+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredProviders.length} of {providers.length} providers
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{provider.business_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{provider.city}, {provider.state}</span>
                        </div>
                        {location && (
                          <div className="flex items-center gap-1 text-primary">
                            <Navigation className="w-3 h-3" />
                            <span>{calculateDistance(provider.latitude, provider.longitude)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-muted-foreground">({provider.review_count} reviews)</span>
                        </div>
                        {provider.is_mobile && (
                          <Badge variant="default" className="bg-blue-500">Mobile Service</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col gap-2">
                    {provider.website_url ? (
                      <Button 
                        onClick={() => window.open(provider.website_url, '_blank', 'noopener,noreferrer')}
                        className="w-full sm:w-auto"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Book Online
                      </Button>
                    ) : (
                      <Button className="w-full sm:w-auto">Book Service</Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{provider.address}</span>
                    </div>
                    
                    {/* Contact Information - Protected for authenticated users */}
                    {session ? (
                      <>
                        {provider.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{provider.phone}</span>
                          </div>
                        )}
                        {provider.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{provider.email}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <Link to="/auth">
                            <Button variant="link" className="p-0 h-auto font-normal text-primary">
                              Sign in to view contact info
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {provider.description && (
                      <div className="text-sm text-muted-foreground">
                        {provider.description}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.specialties?.map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    {provider.website_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(provider.website_url, '_blank', 'noopener,noreferrer')}
                        className="w-full sm:w-auto"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || selectedSpecialty !== 'all' || mobileServiceFilter !== null || minRating > 0
                ? "No providers match your search criteria. Try adjusting your filters or search terms."
                : location 
                  ? `No providers found within ${searchRadius >= 1000 ? 'any distance' : `${searchRadius} miles`} of your location. ${searchRadius < 200 ? 'Try expanding your search radius above.' : ''}`
                  : "No providers found. Please set your location to find nearby services."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;