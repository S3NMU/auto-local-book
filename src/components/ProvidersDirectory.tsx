import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Star, Users, Building2, Search, Filter } from 'lucide-react';

interface Provider {
  id: string;
  business_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  specialties: string[];
  description?: string;
}

const ProvidersDirectory = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;
        const providerData = data || [];
        setProviders(providerData);
        setFilteredProviders(providerData);
        
        // Extract unique states and cities
        const states = [...new Set(providerData.map(p => p.state))].filter(Boolean).sort();
        const cities = [...new Set(providerData.map(p => p.city))].filter(Boolean).sort();
        setAvailableStates(states);
        setAvailableCities(cities);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: "Error",
          description: "Failed to load providers data",
          variant: "destructive",
        });
      }
    };

    fetchProviders();
  }, [toast]);

  // Filter providers based on search and location filters
  useEffect(() => {
    let filtered = providers;

    // Filter by state
    if (selectedState && selectedState !== 'all') {
      filtered = filtered.filter(p => p.state === selectedState);
    }

    // Filter by city
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.business_name.toLowerCase().includes(searchLower) ||
        p.city.toLowerCase().includes(searchLower) ||
        p.state.toLowerCase().includes(searchLower) ||
        p.specialties?.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    setFilteredProviders(filtered);
  }, [providers, selectedState, selectedCity, searchTerm]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState && selectedState !== 'all') {
      const citiesInState = [...new Set(
        providers
          .filter(p => p.state === selectedState)
          .map(p => p.city)
      )].filter(Boolean).sort();
      setAvailableCities(citiesInState);
      setSelectedCity(''); // Reset city selection when state changes
    } else {
      const allCities = [...new Set(providers.map(p => p.city))].filter(Boolean).sort();
      setAvailableCities(allCities);
    }
  }, [selectedState, providers]);

  const clearFilters = () => {
    setSelectedState('');
    setSelectedCity('');
    setSearchTerm('');
  };

  const totalProviders = providers.length;
  const statesWithProviders = availableStates.length;
  const averageRating = providers.length > 0 
    ? providers.reduce((sum, p) => sum + p.rating, 0) / providers.length 
    : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Providers</p>
                <p className="text-lg md:text-2xl font-bold">{totalProviders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">States Covered</p>
                <p className="text-lg md:text-2xl font-bold">{statesWithProviders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-lg md:text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-lg md:text-2xl font-bold">{filteredProviders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search providers, cities, specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* State Filter */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {availableStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProviders.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No providers found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing the filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{provider.business_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{provider.city}, {provider.state}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span>{provider.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({provider.review_count} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="break-all">{provider.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{provider.email}</span>
                </div>

                {provider.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {provider.description}
                  </p>
                )}

                {provider.specialties && provider.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {provider.specialties.slice(0, 3).map((specialty, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {provider.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{provider.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredProviders.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredProviders.length} of {totalProviders} providers
          {(selectedState || selectedCity || searchTerm) && (
            <span> with current filters</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProvidersDirectory;