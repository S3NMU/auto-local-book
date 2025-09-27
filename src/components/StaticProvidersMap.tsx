import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star, Users, Building2 } from 'lucide-react';

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

interface StateData {
  name: string;
  code: string;
  path: string;
}

const StaticProvidersMap = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateProviders, setStateProviders] = useState<{[key: string]: Provider[]}>({});
  const { toast } = useToast();

  // US States with SVG paths (simplified for major states)
  const states: StateData[] = [
    {
      name: 'California',
      code: 'CA',
      path: 'M158,206 L158,156 L122,156 L110,168 L90,168 L90,180 L70,180 L70,220 L90,220 L90,240 L110,240 L122,252 L158,252 Z'
    },
    {
      name: 'Texas',
      code: 'TX',
      path: 'M300,230 L300,180 L240,180 L220,200 L220,230 L240,250 L280,270 L320,270 L340,250 L340,230 Z'
    },
    {
      name: 'Florida',
      code: 'FL',
      path: 'M520,270 L520,250 L480,250 L460,270 L460,290 L480,310 L520,310 L540,290 L540,270 Z'
    },
    {
      name: 'New York',
      code: 'NY',
      path: 'M480,120 L480,100 L440,100 L420,120 L420,140 L440,160 L480,160 Z'
    },
    {
      name: 'Illinois',
      code: 'IL',
      path: 'M380,150 L380,130 L360,130 L340,150 L340,190 L360,210 L380,210 Z'
    },
    {
      name: 'Pennsylvania',
      code: 'PA',
      path: 'M460,130 L460,110 L420,110 L400,130 L400,150 L420,170 L460,170 Z'
    },
    {
      name: 'Ohio',
      code: 'OH',
      path: 'M420,140 L420,120 L400,120 L380,140 L380,170 L400,190 L420,190 Z'
    },
    {
      name: 'Georgia',
      code: 'GA',
      path: 'M460,220 L460,200 L440,200 L420,220 L420,250 L440,270 L460,270 Z'
    },
    {
      name: 'North Carolina',
      code: 'NC',
      path: 'M480,190 L480,170 L440,170 L420,190 L420,210 L440,230 L480,230 Z'
    },
    {
      name: 'Michigan',
      code: 'MI',
      path: 'M400,100 L400,80 L380,80 L360,100 L360,130 L380,150 L400,150 Z'
    },
    {
      name: 'Washington',
      code: 'WA',
      path: 'M120,60 L120,40 L80,40 L60,60 L60,80 L80,100 L120,100 Z'
    },
    {
      name: 'Arizona',
      code: 'AZ',
      path: 'M180,220 L180,200 L160,200 L140,220 L140,260 L160,280 L180,280 Z'
    },
    {
      name: 'Massachusetts',
      code: 'MA',
      path: 'M500,110 L500,100 L480,100 L470,110 L470,120 L480,130 L500,130 Z'
    }
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
    setSelectedState(selectedState === stateCode ? '' : stateCode);
  };

  const getStateProviderCount = (stateCode: string) => {
    return stateProviders[stateCode]?.length || 0;
  };

  const selectedStateProviders = selectedState ? stateProviders[selectedState] || [] : [];
  const totalProviders = providers.length;
  const statesWithProviders = Object.keys(stateProviders).length;
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
                <p className="text-xs md:text-sm text-muted-foreground">Selected State</p>
                <p className="text-lg md:text-2xl font-bold">
                  {selectedState ? getStateProviderCount(selectedState) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Providers Section */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Interactive Map Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                Provider Locations by State
              </CardTitle>
              {selectedState && (
                <p className="text-sm text-muted-foreground">
                  Showing providers in {states.find(s => s.code === selectedState)?.name} ({getStateProviderCount(selectedState)} providers)
                </p>
              )}
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <div className="relative w-full h-[350px] md:h-[450px] bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden border">
                {/* Instructions */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 text-xs text-muted-foreground bg-white/80 rounded px-2 py-1">
                  Click on states to view providers
                </div>
                
                {/* SVG Map */}
                <svg 
                  viewBox="0 0 600 400" 
                  className="w-full h-full"
                  style={{ background: 'linear-gradient(to bottom, #f0f9ff, #f0fdf4)' }}
                >
                  {/* State paths */}
                  {states.map((state) => {
                    const providerCount = getStateProviderCount(state.code);
                    const isSelected = selectedState === state.code;
                    const hasProviders = providerCount > 0;
                    
                    return (
                      <g key={state.code}>
                        {/* State outline */}
                        <path
                          d={state.path}
                          className={`cursor-pointer transition-all duration-200 ${
                            hasProviders 
                              ? isSelected 
                                ? 'fill-primary stroke-primary-foreground stroke-2' 
                                : 'fill-primary/20 hover:fill-primary/40 stroke-primary stroke-1'
                              : 'fill-gray-100 stroke-gray-300 stroke-1 hover:fill-gray-200'
                          }`}
                          onClick={() => hasProviders && handleStateClick(state.code)}
                          style={{
                            filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
                          }}
                        />
                        
                        {/* State label and count */}
                        {hasProviders && (
                          <g>
                            {/* Background circle for text */}
                            <circle
                              cx={state.path.includes('M158') ? 140 : state.path.includes('M300') ? 280 : state.path.includes('M520') ? 500 : state.path.includes('M480,120') ? 450 : state.path.includes('M380') ? 370 : state.path.includes('M460,130') ? 440 : state.path.includes('M420') ? 410 : state.path.includes('M460,220') ? 450 : state.path.includes('M480,190') ? 460 : state.path.includes('M400,100') ? 380 : state.path.includes('M120') ? 90 : state.path.includes('M180') ? 170 : 490}
                              cy={state.path.includes('M158') ? 180 : state.path.includes('M300') ? 225 : state.path.includes('M520') ? 280 : state.path.includes('M480,120') ? 130 : state.path.includes('M380') ? 170 : state.path.includes('M460,130') ? 150 : state.path.includes('M420') ? 165 : state.path.includes('M460,220') ? 235 : state.path.includes('M480,190') ? 200 : state.path.includes('M400,100') ? 115 : state.path.includes('M120') ? 70 : state.path.includes('M180') ? 240 : 120}
                              r="12"
                              className={`${isSelected ? 'fill-white' : 'fill-primary'} stroke-white stroke-1`}
                            />
                            
                            {/* Provider count */}
                            <text
                              x={state.path.includes('M158') ? 140 : state.path.includes('M300') ? 280 : state.path.includes('M520') ? 500 : state.path.includes('M480,120') ? 450 : state.path.includes('M380') ? 370 : state.path.includes('M460,130') ? 440 : state.path.includes('M420') ? 410 : state.path.includes('M460,220') ? 450 : state.path.includes('M480,190') ? 460 : state.path.includes('M400,100') ? 380 : state.path.includes('M120') ? 90 : state.path.includes('M180') ? 170 : 490}
                              y={state.path.includes('M158') ? 185 : state.path.includes('M300') ? 230 : state.path.includes('M520') ? 285 : state.path.includes('M480,120') ? 135 : state.path.includes('M380') ? 175 : state.path.includes('M460,130') ? 155 : state.path.includes('M420') ? 170 : state.path.includes('M460,220') ? 240 : state.path.includes('M480,190') ? 205 : state.path.includes('M400,100') ? 120 : state.path.includes('M120') ? 75 : state.path.includes('M180') ? 245 : 125}
                              textAnchor="middle"
                              className={`text-xs font-bold ${isSelected ? 'fill-primary' : 'fill-white'}`}
                            >
                              {providerCount}
                            </text>
                            
                            {/* State code */}
                            <text
                              x={state.path.includes('M158') ? 140 : state.path.includes('M300') ? 280 : state.path.includes('M520') ? 500 : state.path.includes('M480,120') ? 450 : state.path.includes('M380') ? 370 : state.path.includes('M460,130') ? 440 : state.path.includes('M420') ? 410 : state.path.includes('M460,220') ? 450 : state.path.includes('M480,190') ? 460 : state.path.includes('M400,100') ? 380 : state.path.includes('M120') ? 90 : state.path.includes('M180') ? 170 : 490}
                              y={state.path.includes('M158') ? 200 : state.path.includes('M300') ? 245 : state.path.includes('M520') ? 300 : state.path.includes('M480,120') ? 150 : state.path.includes('M380') ? 190 : state.path.includes('M460,130') ? 170 : state.path.includes('M420') ? 185 : state.path.includes('M460,220') ? 255 : state.path.includes('M480,190') ? 220 : state.path.includes('M400,100') ? 135 : state.path.includes('M120') ? 90 : state.path.includes('M180') ? 260 : 140}
                              textAnchor="middle"
                              className={`text-xs font-medium ${isSelected ? 'fill-primary' : 'fill-gray-600'}`}
                            >
                              {state.code}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              {/* Map Legend */}
              <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-3 md:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/20 border border-primary rounded"></div>
                  <span>States with providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary border border-primary rounded"></div>
                  <span>Selected state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
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
              <div className="max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
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
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span>{provider.city}, {provider.state}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            <span>{provider.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({provider.review_count})</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="break-all">{provider.phone}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
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
        <div className="text-center">
          <Button variant="outline" onClick={() => setSelectedState('')}>
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaticProvidersMap;