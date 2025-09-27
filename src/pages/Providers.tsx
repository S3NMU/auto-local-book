import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const Providers = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      
      // Only select non-sensitive columns for anonymous users
      // Contact info (phone, email) is only available to authenticated users
      const columns = session 
        ? `id, business_name, address, city, state, rating, review_count, specialties, is_mobile, phone, email, description`
        : `id, business_name, address, city, state, rating, review_count, specialties, is_mobile, description`;

      const { data, error } = await supabase
        .from('providers')
        .select(columns)
        .limit(10);

      if (error) {
        console.error('Error fetching providers:', error);
      } else {
        setProviders(data || []);
      }
      setLoading(false);
    };

    fetchProviders();
  }, [session]);

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
            Trusted automotive professionals in your area
          </p>
        </div>

        <div className="space-y-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-2">
                      <span>{provider.business_name}</span>
                      {provider.is_mobile && (
                        <Badge variant="default" className="bg-blue-500">Mobile Service</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.review_count} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.city}, {provider.state}</span>
                      </div>
                    </CardDescription>
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
                    {session && provider.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{provider.phone}</span>
                      </div>
                    )}
                    {!session && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          <Button variant="link" className="p-0 h-auto font-normal">
                            Sign in to view contact info
                          </Button>
                        </span>
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
      </div>
    </div>
  );
};

export default Providers;