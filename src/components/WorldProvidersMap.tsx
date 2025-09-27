import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star, Users, Building2, Globe, ArrowLeft, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

interface CountryData {
  name: string;
  code: string;
  path: string;
  states?: StateData[];
}

interface StateData {
  name: string;
  code: string;
  path: string;
}

const WorldProvidersMap = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [countryProviders, setCountryProviders] = useState<{[key: string]: Provider[]}>({});
  const [stateProviders, setStateProviders] = useState<{[key: string]: Provider[]}>({});
  const [customMapUrl, setCustomMapUrl] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const { toast } = useToast();

  // World countries with SVG paths (major countries)
  const countries: CountryData[] = [
    {
      name: 'United States',
      code: 'US',
      path: 'M200,150 L250,150 L280,120 L320,120 L350,140 L380,130 L400,150 L420,140 L450,160 L480,150 L500,170 L480,200 L450,190 L400,200 L350,190 L320,200 L280,180 L250,190 L200,180 Z',
      states: [
        { name: 'California', code: 'CA', path: 'M210,170 L210,150 L190,150 L180,160 L180,180 L190,190 L210,190 Z' },
        { name: 'Texas', code: 'TX', path: 'M300,180 L300,160 L270,160 L260,170 L260,180 L270,190 L300,190 Z' },
        { name: 'Florida', code: 'FL', path: 'M420,190 L420,180 L400,180 L390,190 L390,200 L400,210 L420,210 Z' },
        { name: 'New York', code: 'NY', path: 'M400,140 L400,130 L380,130 L370,140 L370,150 L380,160 L400,160 Z' },
        { name: 'Illinois', code: 'IL', path: 'M340,150 L340,140 L330,140 L320,150 L320,170 L330,180 L340,180 Z' }
      ]
    },
    {
      name: 'Canada',
      code: 'CA',
      path: 'M200,80 L500,80 L520,100 L500,120 L200,120 L180,100 Z'
    },
    {
      name: 'United Kingdom',
      code: 'GB',
      path: 'M520,140 L540,140 L545,150 L540,160 L520,160 L515,150 Z'
    },
    {
      name: 'Germany',
      code: 'DE',
      path: 'M550,150 L570,150 L575,160 L570,170 L550,170 L545,160 Z'
    },
    {
      name: 'France',
      code: 'FR',
      path: 'M530,160 L550,160 L555,170 L550,180 L530,180 L525,170 Z'
    },
    {
      name: 'Australia',
      code: 'AU',
      path: 'M680,280 L750,280 L760,300 L750,320 L680,320 L670,300 Z'
    },
    {
      name: 'Japan',
      code: 'JP',
      path: 'M780,180 L800,180 L805,190 L800,200 L780,200 L775,190 Z'
    },
    {
      name: 'Brazil',
      code: 'BR',
      path: 'M350,250 L400,250 L420,270 L400,320 L350,320 L330,300 L330,270 Z'
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
        
        // Group providers by country (assuming US for now)
        const countryGrouped = { 'US': providerData };
        setCountryProviders(countryGrouped);
        
        // Group providers by state
        const stateGrouped = providerData.reduce((acc, provider) => {
          const state = provider.state;
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(provider);
          return acc;
        }, {} as {[key: string]: Provider[]});
        
        setStateProviders(stateGrouped);
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

  const handleCountryClick = (countryCode: string) => {
    if (selectedCountry === countryCode) {
      setSelectedCountry('');
      setSelectedState('');
    } else {
      setSelectedCountry(countryCode);
      setSelectedState('');
    }
  };

  const handleStateClick = (stateCode: string) => {
    setSelectedState(selectedState === stateCode ? '' : stateCode);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        toast({
          title: "Map uploaded",
          description: "Your custom map has been uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCountryProviderCount = (countryCode: string) => {
    return countryProviders[countryCode]?.length || 0;
  };

  const getStateProviderCount = (stateCode: string) => {
    return stateProviders[stateCode]?.length || 0;
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const selectedStateProviders = selectedState ? stateProviders[selectedState] || [] : [];
  const selectedCountryProviders = selectedCountry ? countryProviders[selectedCountry] || [] : [];
  
  const totalProviders = providers.length;
  const countriesWithProviders = Object.keys(countryProviders).length;
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
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Countries</p>
                <p className="text-lg md:text-2xl font-bold">{countriesWithProviders}</p>
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
                <p className="text-xs md:text-sm text-muted-foreground">Selected</p>
                <p className="text-lg md:text-2xl font-bold">
                  {selectedState 
                    ? getStateProviderCount(selectedState) 
                    : selectedCountry 
                    ? getCountryProviderCount(selectedCountry) 
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Custom Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Custom World Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Upload your own world map image to use as background
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Map and Providers Section */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Interactive World Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Globe className="w-4 h-4 md:w-5 md:h-5" />
                  {selectedCountry ? (
                    <span className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCountry('');
                          setSelectedState('');
                        }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      {selectedCountryData?.name} States
                    </span>
                  ) : (
                    'World Provider Locations'
                  )}
                </CardTitle>
              </div>
              {selectedCountry && !selectedState && (
                <p className="text-sm text-muted-foreground">
                  Click on a state in {selectedCountryData?.name} to view providers
                </p>
              )}
              {selectedState && (
                <p className="text-sm text-muted-foreground">
                  Showing providers in {selectedCountryData?.states?.find(s => s.code === selectedState)?.name} ({getStateProviderCount(selectedState)} providers)
                </p>
              )}
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <div className="relative w-full h-[350px] md:h-[450px] bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden border">
                {/* Custom Map Background */}
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Custom world map"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                
                {/* Instructions */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 text-xs text-muted-foreground bg-white/80 rounded px-2 py-1">
                  {selectedCountry ? 'Click on states to view providers' : 'Click on countries to explore'}
                </div>
                
                {/* SVG Map */}
                <svg 
                  viewBox="0 0 900 400" 
                  className="w-full h-full"
                  style={{ background: uploadedImage ? 'transparent' : 'linear-gradient(to bottom, #e0f2fe, #e8f5e8)' }}
                >
                  {!selectedCountry ? (
                    // World view - show countries
                    countries.map((country) => {
                      const providerCount = getCountryProviderCount(country.code);
                      const hasProviders = providerCount > 0;
                      
                      return (
                        <g key={country.code}>
                          <path
                            d={country.path}
                            className={`cursor-pointer transition-all duration-200 ${
                              hasProviders 
                                ? 'fill-primary/30 hover:fill-primary/50 stroke-primary stroke-1'
                                : 'fill-gray-100 stroke-gray-300 stroke-1 hover:fill-gray-200'
                            }`}
                            onClick={() => hasProviders && handleCountryClick(country.code)}
                          />
                          {hasProviders && (
                            <text
                              x={country.path.includes('M200,150') ? 350 : country.path.includes('M200,80') ? 350 : country.path.includes('M520,140') ? 532 : country.path.includes('M550,150') ? 562 : country.path.includes('M530,160') ? 542 : country.path.includes('M680,280') ? 715 : country.path.includes('M780,180') ? 792 : 375}
                              y={country.path.includes('M200,150') ? 175 : country.path.includes('M200,80') ? 100 : country.path.includes('M520,140') ? 155 : country.path.includes('M550,150') ? 165 : country.path.includes('M530,160') ? 175 : country.path.includes('M680,280') ? 300 : country.path.includes('M780,180') ? 195 : 285}
                              textAnchor="middle"
                              className="text-xs font-bold fill-primary pointer-events-none"
                            >
                              {providerCount}
                            </text>
                          )}
                        </g>
                      );
                    })
                  ) : (
                    // Country view - show states
                    selectedCountryData?.states?.map((state) => {
                      const providerCount = getStateProviderCount(state.code);
                      const isSelected = selectedState === state.code;
                      const hasProviders = providerCount > 0;
                      
                      return (
                        <g key={state.code}>
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
                          {hasProviders && (
                            <g>
                              <circle
                                cx={state.path.includes('M210') ? 200 : state.path.includes('M300') ? 285 : state.path.includes('M420') ? 405 : state.path.includes('M400') ? 385 : 335}
                                cy={state.path.includes('M210') ? 170 : state.path.includes('M300') ? 175 : state.path.includes('M420') ? 195 : state.path.includes('M400') ? 145 : 165}
                                r="12"
                                className={`${isSelected ? 'fill-white' : 'fill-primary'} stroke-white stroke-1`}
                              />
                              <text
                                x={state.path.includes('M210') ? 200 : state.path.includes('M300') ? 285 : state.path.includes('M420') ? 405 : state.path.includes('M400') ? 385 : 335}
                                y={state.path.includes('M210') ? 175 : state.path.includes('M300') ? 180 : state.path.includes('M420') ? 200 : state.path.includes('M400') ? 150 : 170}
                                textAnchor="middle"
                                className={`text-xs font-bold ${isSelected ? 'fill-primary' : 'fill-white'}`}
                              >
                                {providerCount}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })
                  )}
                </svg>
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
                    ? `${selectedCountryData?.states?.find(s => s.code === selectedState)?.name} Providers`
                    : selectedCountry 
                    ? `${selectedCountryData?.name} Providers`
                    : 'Select Location'
                  }
                </span>
                {(selectedState || selectedCountry) && (
                  <span className="text-xs md:text-sm font-normal text-muted-foreground">
                    {selectedState ? selectedStateProviders.length : selectedCountryProviders.length} found
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                {!selectedCountry ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <Globe className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">Click on a country to explore providers</p>
                  </div>
                ) : selectedCountry && !selectedState ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">Click on a state to view providers</p>
                  </div>
                ) : selectedStateProviders.length === 0 ? (
                  <div className="p-4 md:p-6 text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">No providers found in selected area</p>
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
    </div>
  );
};

export default WorldProvidersMap;