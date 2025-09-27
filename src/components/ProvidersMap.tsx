import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Star, Filter } from 'lucide-react';

interface Provider {
  id: string;
  business_name: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  specialties: string[];
}

const ProvidersMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          throw new Error('No token received');
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast({
          title: "Map not available",
          description: "Unable to load map. Please check your Mapbox token configuration.",
          variant: "destructive",
        });
      }
    };

    fetchMapboxToken();
  }, [toast]);

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('status', 'active')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (error) throw error;
        const providerData = data || [];
        setProviders(providerData);
        setFilteredProviders(providerData);
        
        // Extract unique states for filtering
        const states = [...new Set(providerData.map(p => p.state))].filter(Boolean).sort();
        setAvailableStates(states);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  // Filter providers by state
  useEffect(() => {
    if (selectedState) {
      const filtered = providers.filter(p => p.state === selectedState);
      setFilteredProviders(filtered);
    } else {
      setFilteredProviders(providers);
    }
    setSelectedProvider(null);
  }, [selectedState, providers]);

  // Clear all markers
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || filteredProviders.length === 0) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Updated to a more reliable style
      center: [-98.5795, 39.8283], // Center of US
      zoom: 4,
      attributionControl: false, // Remove attribution to reduce clutter
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clear existing markers and add new ones
    clearMarkers();
    
    // Add markers for filtered providers
    filteredProviders.forEach((provider) => {
      // Create a custom marker element with proper anchoring
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.transition = 'transform 0.15s ease-out';
      el.style.position = 'relative';
      el.style.zIndex = '1';
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
        el.style.zIndex = '10';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });
      
      // Create the crispy pin icon with proper SVG optimization
      el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25)); image-rendering: crisp-edges; shape-rendering: geometricPrecision;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                fill="#f97316" 
                stroke="#ffffff" 
                stroke-width="1.5" 
                vector-effect="non-scaling-stroke"/>
          <circle cx="12" cy="9" r="1.5" fill="#ffffff"/>
        </svg>
      `;

      el.addEventListener('click', () => {
        setSelectedProvider(provider);
        // Center the map on the clicked provider
        map.current?.flyTo({
          center: [provider.longitude, provider.latitude],
          zoom: 10,
          duration: 1000
        });
      });

      // Create marker with proper anchor point (bottom center of the pin)
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([provider.longitude, provider.latitude])
        .addTo(map.current!);
      
      // Store marker reference for cleanup
      markers.current.push(marker);

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -40] // Offset above the pin
      });

      // Add information popup on hover
      el.addEventListener('mouseenter', () => {
        // Scale effect (already handled above)
        // Show popup
        popup
          .setLngLat([provider.longitude, provider.latitude])
          .setHTML(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="font-weight: 600; margin: 0 0 4px 0; color: #1f2937;">${provider.business_name}</h3>
              <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${provider.city}, ${provider.state}</p>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="color: #f59e0b;">★</span>
                <span style="font-size: 14px; color: #374151;">${provider.rating.toFixed(1)} (${provider.review_count} reviews)</span>
              </div>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Click for details</p>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        // Scale reset (already handled above)
        // Remove popup
        popup.remove();
      });
    });

    // Fit map to show all filtered providers
    if (filteredProviders.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredProviders.forEach(provider => {
        bounds.extend([provider.longitude, provider.latitude]);
      });
      map.current?.fitBounds(bounds, { 
        padding: 50,
        maxZoom: 10
      });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, filteredProviders]);

  if (!mapboxToken) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading map...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full">
      <div className="grid lg:grid-cols-3 gap-6 h-full">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Provider Locations
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All States</SelectItem>
                      {availableStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div ref={mapContainer} className="h-full w-full rounded-b-lg min-h-[400px]" />
            </CardContent>
          </Card>
        </div>
        
        {/* Providers List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Providers</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredProviders.length} found
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[450px] overflow-y-auto">
                {filteredProviders.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No providers found{selectedState ? ` in ${selectedState}` : ''}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedProvider?.id === provider.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => {
                          setSelectedProvider(provider);
                          map.current?.flyTo({
                            center: [provider.longitude, provider.latitude],
                            zoom: 12,
                            duration: 1000
                          });
                        }}
                      >
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm leading-tight">{provider.business_name}</h3>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{provider.city}, {provider.state}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{provider.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({provider.review_count})</span>
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
      
      {/* Selected Provider Details - Mobile */}
      {selectedProvider && (
        <div className="lg:hidden mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{selectedProvider.business_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedProvider.city}, {selectedProvider.state}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{selectedProvider.rating.toFixed(1)} ({selectedProvider.review_count} reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedProvider.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedProvider.email}</span>
              </div>

              {selectedProvider.specialties && selectedProvider.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProvider.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProvidersMap;