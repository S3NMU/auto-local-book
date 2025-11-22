import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Loader2, Search, X, Building2, Car, DollarSign } from 'lucide-react';

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

interface RentalVehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  location_city: string | null;
  location_state: string | null;
  is_featured: boolean;
}

interface VehicleForSale {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location_city: string | null;
  location_state: string | null;
  is_featured: boolean;
}

export const FeaturedProvidersManagement = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [rentals, setRentals] = useState<RentalVehicle[]>([]);
  const [sales, setSales] = useState<VehicleForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch providers
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select('id, business_name, city, state, rating, review_count, is_featured, is_verified')
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (providersError) throw providersError;

      // Fetch rentals
      const { data: rentalsData, error: rentalsError } = await supabase
        .from('rental_vehicles')
        .select('*')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (rentalsError) throw rentalsError;

      // Fetch vehicles for sale
      const { data: salesData, error: salesError } = await supabase
        .from('vehicles_for_sale')
        .select('*')
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      setProviders(providersData || []);
      setRentals(rentalsData || []);
      setSales(salesData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load featured items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleProviderFeatured = async (providerId: string, currentStatus: boolean) => {
    setUpdating(providerId);
    try {
      const { error } = await supabase
        .from('providers')
        .update({ is_featured: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;

      setProviders(providers.map(p =>
        p.id === providerId ? { ...p, is_featured: !currentStatus } : p
      ));

      toast({
        title: 'Success',
        description: `Provider ${!currentStatus ? 'added to' : 'removed from'} featured list`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update provider status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const toggleRentalFeatured = async (rentalId: string, currentStatus: boolean) => {
    setUpdating(rentalId);
    try {
      const { error } = await supabase
        .from('rental_vehicles')
        .update({ is_featured: !currentStatus })
        .eq('id', rentalId);

      if (error) throw error;

      setRentals(rentals.map(r =>
        r.id === rentalId ? { ...r, is_featured: !currentStatus } : r
      ));

      toast({
        title: 'Success',
        description: `Rental ${!currentStatus ? 'added to' : 'removed from'} featured list`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update rental status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const toggleSaleFeatured = async (saleId: string, currentStatus: boolean) => {
    setUpdating(saleId);
    try {
      const { error } = await supabase
        .from('vehicles_for_sale')
        .update({ is_featured: !currentStatus })
        .eq('id', saleId);

      if (error) throw error;

      setSales(sales.map(s =>
        s.id === saleId ? { ...s, is_featured: !currentStatus } : s
      ));

      toast({
        title: 'Success',
        description: `Vehicle ${!currentStatus ? 'added to' : 'removed from'} featured list`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle status',
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

  const filteredProviders = providers.filter(p =>
    p.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRentals = rentals.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${r.year} ${r.make} ${r.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSales = sales.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${s.year} ${s.make} ${s.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search featured items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchTerm('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="rentals" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Rentals
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            For Sale
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredProviders.filter(p => p.is_featured).length} provider(s) featured
          </div>
          
          {filteredProviders.filter(p => p.is_featured).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Currently Featured</h4>
              {filteredProviders.filter(p => p.is_featured).map((provider) => (
                <Card key={provider.id} className="border-primary/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{provider.business_name}</h4>
                        {provider.is_verified && <Badge variant="default" className="text-xs">Verified</Badge>}
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
                    <Switch
                      checked={provider.is_featured}
                      onCheckedChange={() => toggleProviderFeatured(provider.id, provider.is_featured)}
                      disabled={updating === provider.id}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Available Providers</h4>
            {filteredProviders.filter(p => !p.is_featured).map((provider) => (
              <Card key={provider.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{provider.business_name}</h4>
                      {provider.is_verified && <Badge variant="default" className="text-xs">Verified</Badge>}
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
                  <Switch
                    checked={provider.is_featured}
                    onCheckedChange={() => toggleProviderFeatured(provider.id, provider.is_featured)}
                    disabled={updating === provider.id}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredRentals.filter(r => r.is_featured).length} rental(s) featured
          </div>

          {filteredRentals.filter(r => r.is_featured).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Currently Featured</h4>
              {filteredRentals.filter(r => r.is_featured).map((rental) => (
                <Card key={rental.id} className="border-primary/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rental.title}</h4>
                        <Badge className="text-xs">Featured</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{rental.year} {rental.make} {rental.model}</span>
                        <span>${rental.daily_rate}/day</span>
                        {rental.location_city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{rental.location_city}, {rental.location_state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={rental.is_featured}
                      onCheckedChange={() => toggleRentalFeatured(rental.id, rental.is_featured)}
                      disabled={updating === rental.id}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Available Rentals</h4>
            {filteredRentals.filter(r => !r.is_featured).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No rental vehicles available
              </p>
            ) : (
              filteredRentals.filter(r => !r.is_featured).map((rental) => (
                <Card key={rental.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{rental.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{rental.year} {rental.make} {rental.model}</span>
                        <span>${rental.daily_rate}/day</span>
                        {rental.location_city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{rental.location_city}, {rental.location_state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={rental.is_featured}
                      onCheckedChange={() => toggleRentalFeatured(rental.id, rental.is_featured)}
                      disabled={updating === rental.id}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredSales.filter(s => s.is_featured).length} vehicle(s) featured
          </div>

          {filteredSales.filter(s => s.is_featured).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Currently Featured</h4>
              {filteredSales.filter(s => s.is_featured).map((vehicle) => (
                <Card key={vehicle.id} className="border-primary/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{vehicle.title}</h4>
                        <Badge className="text-xs">Featured</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                        <span>${vehicle.price.toLocaleString()}</span>
                        {vehicle.location_city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{vehicle.location_city}, {vehicle.location_state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={vehicle.is_featured}
                      onCheckedChange={() => toggleSaleFeatured(vehicle.id, vehicle.is_featured)}
                      disabled={updating === vehicle.id}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Available Vehicles</h4>
            {filteredSales.filter(s => !s.is_featured).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No vehicles for sale available
              </p>
            ) : (
              filteredSales.filter(s => !s.is_featured).map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{vehicle.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                        <span>${vehicle.price.toLocaleString()}</span>
                        {vehicle.location_city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{vehicle.location_city}, {vehicle.location_state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={vehicle.is_featured}
                      onCheckedChange={() => toggleSaleFeatured(vehicle.id, vehicle.is_featured)}
                      disabled={updating === vehicle.id}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};