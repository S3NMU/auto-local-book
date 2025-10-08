import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2 } from 'lucide-react';

interface Provider {
  id: string;
  business_name: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_verified: boolean;
}

export const FeaturedProvidersManagement = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('id, business_name, city, state, rating, review_count, is_featured, is_verified')
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load providers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const toggleFeatured = async (providerId: string, currentStatus: boolean) => {
    setUpdating(providerId);
    try {
      const { error } = await supabase
        .from('providers')
        .update({ is_featured: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;

      // Update local state
      setProviders(providers.map(p =>
        p.id === providerId ? { ...p, is_featured: !currentStatus } : p
      ));

      toast({
        title: 'Success',
        description: `Provider ${!currentStatus ? 'added to' : 'removed from'} featured list`,
      });
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to update provider status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const featuredProviders = providers.filter(p => p.is_featured);
  const nonFeaturedProviders = providers.filter(p => !p.is_featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Featured Providers</h3>
          <p className="text-sm text-muted-foreground">
            {featuredProviders.length} provider{featuredProviders.length !== 1 ? 's' : ''} featured
          </p>
        </div>
      </div>

      {featuredProviders.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Currently Featured</h4>
          {featuredProviders.map((provider) => (
            <Card key={provider.id} className="border-primary/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{provider.business_name}</h4>
                      {provider.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                      <Badge className="text-xs">Featured</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{provider.city}, {provider.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{provider.rating.toFixed(1)} ({provider.review_count})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`featured-${provider.id}`} className="sr-only">
                    Featured
                  </Label>
                  <Switch
                    id={`featured-${provider.id}`}
                    checked={provider.is_featured}
                    onCheckedChange={() => toggleFeatured(provider.id, provider.is_featured)}
                    disabled={updating === provider.id}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Other Providers</h4>
        {nonFeaturedProviders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            All providers are currently featured
          </p>
        ) : (
          nonFeaturedProviders.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{provider.business_name}</h4>
                      {provider.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{provider.city}, {provider.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{provider.rating.toFixed(1)} ({provider.review_count})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`featured-${provider.id}`} className="sr-only">
                    Featured
                  </Label>
                  <Switch
                    id={`featured-${provider.id}`}
                    checked={provider.is_featured}
                    onCheckedChange={() => toggleFeatured(provider.id, provider.is_featured)}
                    disabled={updating === provider.id}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};