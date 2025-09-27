import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone, Mail, Clock, Navigation } from "lucide-react";
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
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  specialties: string[];
  is_mobile: boolean;
  phone?: string;
  email?: string;
  description?: string;
  distance?: number;
}

const Providers = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();
  const { toast } = useToast();

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
        const maxDistance = 50; // 50 miles radius
        
        providersData = providersData.map(provider => ({
          ...provider,
          distance: calculateDistanceValue(provider.latitude, provider.longitude)
        }))
        .filter(provider => provider.distance <= maxDistance) // Only show providers within 50 miles
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

  useEffect(() => {
    fetchProviders();
  }, []);

  // Refetch providers when location changes
  useEffect(() => {
    fetchProviders();
  }, [location]);

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Service Providers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {location 
              ? `Find trusted automotive service providers within 50 miles of ${location.address}`
              : "Find trusted automotive service providers in your area"
            }
          </p>
          {location && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4" />
              Showing results within 50 miles of your location
            </div>
          )}
        </div>

        <div className="space-y-6">
          {providers.map((provider) => (
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
                  <div className="mt-4 sm:mt-0">
                    <Button>Book Service</Button>
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
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties?.map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {providers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {location 
                ? "No providers found within 50 miles of your location. Try expanding your search area."
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