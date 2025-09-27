import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Star } from 'lucide-react';

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
  const [providers, setProviders] = useState<Provider[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { toast } = useToast();

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(data.token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        toast({
          title: "Map not available",
          description: "Unable to load map. Please contact support.",
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
        setProviders(data || []);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || providers.length === 0) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for providers
    providers.forEach((provider) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xIDIgNSA1LjEgNSA5QzUgMTQuMjUgMTIgMjIgMTIgMjJTMTkgMTQuMjUgMTkgOUMxOSA1LjEgMTUuOSAyIDEyIDJaTTEyIDExLjVDMTAuNjIgMTEuNSA5LjUgMTAuMzggOS41IDlTMTAuNjIgNi41IDEyIDYuNVMxNC41IDcuNjIgMTQuNSA5UzEzLjM4IDExLjUgMTIgMTEuNVoiIGZpbGw9IiNmNjc2MTYiLz4KPHN2Zz4K)';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        setSelectedProvider(provider);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([provider.longitude, provider.latitude])
        .addTo(map.current!);

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25
      });

      el.addEventListener('mouseenter', () => {
        popup
          .setLngLat([provider.longitude, provider.latitude])
          .setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${provider.business_name}</h3>
              <p class="text-sm text-gray-600">${provider.city}, ${provider.state}</p>
              <div class="flex items-center mt-1">
                <span class="text-yellow-500">★</span>
                <span class="text-sm ml-1">${provider.rating.toFixed(1)} (${provider.review_count})</span>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, providers]);

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
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Provider Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapContainer} className="h-96 w-full rounded-b-lg" />
            </CardContent>
          </Card>
        </div>
        
        {selectedProvider && (
          <div className="lg:col-span-1">
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
                      {selectedProvider.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                      {selectedProvider.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded">
                          +{selectedProvider.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersMap;