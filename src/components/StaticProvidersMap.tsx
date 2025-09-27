import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star } from 'lucide-react';

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
}

const StaticProvidersMap = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateProviders, setStateProviders] = useState<{[key: string]: Provider[]}>({});
  const { toast } = useToast();

  // US States with their coordinates for positioning
  const states = [
    { name: 'California', code: 'CA', x: 8, y: 60 },
    { name: 'Texas', code: 'TX', x: 35, y: 75 },
    { name: 'Florida', code: 'FL', x: 78, y: 85 },
    { name: 'New York', code: 'NY', x: 78, y: 35 },
    { name: 'Illinois', code: 'IL', x: 55, y: 45 },
    { name: 'Pennsylvania', code: 'PA', x: 75, y: 42 },
    { name: 'Ohio', code: 'OH', x: 70, y: 45 },
    { name: 'Georgia', code: 'GA', x: 72, y: 70 },
    { name: 'North Carolina', code: 'NC', x: 75, y: 62 },
    { name: 'Michigan', code: 'MI', x: 65, y: 35 },
    { name: 'New Jersey', code: 'NJ', x: 78, y: 45 },
    { name: 'Virginia', code: 'VA', x: 75, y: 55 },
    { name: 'Washington', code: 'WA', x: 15, y: 15 },
    { name: 'Arizona', code: 'AZ', x: 20, y: 68 },
    { name: 'Massachusetts', code: 'MA', x: 82, y: 35 },
    { name: 'Tennessee', code: 'TN', x: 65, y: 62 },
    { name: 'Indiana', code: 'IN', x: 65, y: 48 },
    { name: 'Missouri', code: 'MO', x: 50, y: 55 },
    { name: 'Maryland', code: 'MD', x: 77, y: 50 },
    { name: 'Wisconsin', code: 'WI', x: 55, y: 32 },
    { name: 'Colorado', code: 'CO', x: 35, y: 55 },
    { name: 'Minnesota', code: 'MN', x: 50, y: 25 },
    { name: 'South Carolina', code: 'SC', x: 74, y: 68 },
    { name: 'Alabama', code: 'AL', x: 65, y: 72 },
    { name: 'Louisiana', code: 'LA', x: 48, y: 78 },
    { name: 'Kentucky', code: 'KY', x: 68, y: 55 },
    { name: 'Oregon', code: 'OR', x: 12, y: 28 },
    { name: 'Oklahoma', code: 'OK', x: 42, y: 68 },
    { name: 'Connecticut', code: 'CT', x: 80, y: 40 },
    { name: 'Utah', code: 'UT', x: 28, y: 50 },
    { name: 'Iowa', code: 'IA', x: 48, y: 42 },
    { name: 'Nevada', code: 'NV', x: 15, y: 52 },
    { name: 'Arkansas', code: 'AR', x: 50, y: 68 },
    { name: 'Mississippi', code: 'MS', x: 55, y: 75 },
    { name: 'Kansas', code: 'KS', x: 42, y: 58 },
    { name: 'New Mexico', code: 'NM', x: 32, y: 68 },
    { name: 'Nebraska', code: 'NE', x: 42, y: 48 },
    { name: 'West Virginia', code: 'WV', x: 72, y: 52 },
    { name: 'Idaho', code: 'ID', x: 25, y: 35 },
    { name: 'Hawaii', code: 'HI', x: 20, y: 88 },
    { name: 'New Hampshire', code: 'NH', x: 82, y: 30 },
    { name: 'Maine', code: 'ME', x: 85, y: 25 },
    { name: 'Montana', code: 'MT', x: 35, y: 25 },
    { name: 'Rhode Island', code: 'RI', x: 83, y: 38 },
    { name: 'Delaware', code: 'DE', x: 78, y: 48 },
    { name: 'South Dakota', code: 'SD', x: 42, y: 35 },
    { name: 'North Dakota', code: 'ND', x: 42, y: 25 },
    { name: 'Alaska', code: 'AK', x: 5, y: 82 },
    { name: 'Vermont', code: 'VT', x: 80, y: 32 },
    { name: 'Wyoming', code: 'WY', x: 35, y: 42 }
  ];

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
        
        // Group providers by state
        const grouped = providerData.reduce((acc, provider) => {
          const state = provider.state;
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(provider);
          return acc;
        }, {} as {[key: string]: Provider[]});
        
        setStateProviders(grouped);
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

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
  };

  const getStateProviderCount = (stateCode: string) => {
    return stateProviders[stateCode]?.length || 0;
  };

  const selectedStateProviders = selectedState ? stateProviders[selectedState] || [] : [];

  return (
    <div className="h-full">
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 h-full">
        {/* Static Map Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                Provider Locations by State
              </CardTitle>
              {selectedState && (
                <p className="text-sm text-muted-foreground">
                  Showing providers in {states.find(s => s.code === selectedState)?.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <div className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden">
                {/* USA Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
                  <div className="absolute top-4 left-4 text-xs text-muted-foreground">
                    Click on a state to view providers
                  </div>
                  
                  {/* State markers */}
                  {states.map((state) => {
                    const providerCount = getStateProviderCount(state.code);
                    const isSelected = selectedState === state.code;
                    
                    return (
                      <button
                        key={state.code}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                          isSelected ? 'z-10' : 'z-5'
                        }`}
                        style={{
                          left: `${state.x}%`,
                          top: `${state.y}%`,
                        }}
                        onClick={() => handleStateClick(state.code)}
                        title={`${state.name} - ${providerCount} providers`}
                      >
                        <div className={`relative ${isSelected ? 'scale-125' : ''}`}>
                          {/* State circle */}
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                            providerCount > 0 
                              ? isSelected 
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                                : 'bg-white text-primary border-primary hover:bg-primary hover:text-primary-foreground shadow-md'
                              : 'bg-gray-200 text-gray-400 border-gray-300'
                          }`}>
                            {providerCount > 0 ? providerCount : '•'}
                          </div>
                          
                          {/* State label */}
                          <div className={`absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                            isSelected ? 'font-medium text-primary' : 'text-muted-foreground'
                          }`}>
                            {state.code}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span>States with providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span>No providers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Providers List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                <span>
                  {selectedState 
                    ? `${states.find(s => s.code === selectedState)?.name} Providers`
                    : 'Select a State'
                  }
                </span>
                {selectedState && (
                  <span className="text-xs md:text-sm font-normal text-muted-foreground">
                    {selectedStateProviders.length} found
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[200px] md:max-h-[300px] lg:max-h-[450px] overflow-y-auto">
                {!selectedState ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">Click on a state to view providers</p>
                  </div>
                ) : selectedStateProviders.length === 0 ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">No providers found in {states.find(s => s.code === selectedState)?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {selectedStateProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="p-3 md:p-4 border-b hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm md:text-base leading-tight">{provider.business_name}</h3>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{provider.city}, {provider.state}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{provider.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({provider.review_count})</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{provider.phone}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="truncate">{provider.email}</span>
                          </div>

                          {provider.specialties && provider.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {provider.specialties.slice(0, 2).map((specialty, index) => (
                                <span key={index} className="px-1.5 py-0.5 bg-muted text-xs rounded">
                                  {specialty}
                                </span>
                              ))}
                              {provider.specialties.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-muted text-xs rounded">
                                  +{provider.specialties.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Clear Selection Button */}
      {selectedState && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => setSelectedState('')}>
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaticProvidersMap;