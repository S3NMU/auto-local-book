import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Provider {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  specialties: string[];
  website_url: string;
  is_verified: boolean;
}

const FeaturedProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('status', 'active')
          .order('rating', { ascending: false })
          .order('review_count', { ascending: false })
          .limit(6);

        if (error) throw error;
        setProviders(data || []);
      } catch (error) {
        console.error('Error fetching featured providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProviders();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Providers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Providers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our top-rated automotive service providers trusted by thousands of customers
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured providers available at the moment.</p>
            <Link to="/providers">
              <Button variant="outline">Browse All Providers</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {provider.business_name}
                          {provider.is_verified && (
                            <Badge variant="default" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        {provider.owner_name && (
                          <p className="text-sm text-muted-foreground">by {provider.owner_name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({provider.review_count})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.city}, {provider.state}</span>
                    </div>

                    {provider.specialties && provider.specialties.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        {provider.phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${provider.phone}`}>
                              <Phone className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {provider.email && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${provider.email}`}>
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {provider.website_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/providers">
                <Button variant="outline" size="lg">
                  View All Providers
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProviders;