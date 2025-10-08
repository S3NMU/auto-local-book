import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Star, MapPin, TrendingUp, Users, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalProviders: number;
  activeProviders: number;
  pendingProviders: number;
  averageRating: number;
  totalReviews: number;
  totalStates: number;
  totalCities: number;
  totalServices: number;
  stateBreakdown: { state: string; count: number }[];
  ratingBreakdown: { rating: number; count: number }[];
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProviders: 0,
    activeProviders: 0,
    pendingProviders: 0,
    averageRating: 0,
    totalReviews: 0,
    totalStates: 0,
    totalCities: 0,
    totalServices: 0,
    stateBreakdown: [],
    ratingBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all providers
      const { data: allProviders, error: providersError } = await supabase
        .from('providers')
        .select('*');

      if (providersError) throw providersError;

      const activeProviders = allProviders?.filter(p => p.status === 'active') || [];
      const pendingRequests = allProviders?.filter(p => p.status === 'pending') || [];

      // Get unique states and cities
      const states = [...new Set(activeProviders.map(p => p.state))].filter(Boolean);
      const cities = [...new Set(activeProviders.map(p => p.city))].filter(Boolean);

      // Calculate average rating
      const avgRating = activeProviders.length > 0
        ? activeProviders.reduce((sum, p) => sum + (p.rating || 0), 0) / activeProviders.length
        : 0;

      // Get total reviews
      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      // Get unique service categories
      const { data: servicesData } = await supabase
        .from('services')
        .select('category');
      
      const uniqueCategories = [...new Set(servicesData?.map(s => s.category) || [])];

      // State breakdown
      const stateBreakdown = states.map(state => ({
        state,
        count: activeProviders.filter(p => p.state === state).length
      })).sort((a, b) => b.count - a.count);

      // Rating breakdown
      const ratingBreakdown = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: activeProviders.filter(p => Math.floor(p.rating) === rating).length
      }));

      setAnalytics({
        totalProviders: allProviders?.length || 0,
        activeProviders: activeProviders.length,
        pendingProviders: pendingRequests.length,
        averageRating: avgRating,
        totalReviews: reviewCount || 0,
        totalStates: states.length,
        totalCities: cities.length,
        totalServices: uniqueCategories.length,
        stateBreakdown,
        ratingBreakdown
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Analytics</h2>
        <p className="text-muted-foreground">Live statistics and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeProviders}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.pendingProviders} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {analytics.totalReviews} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geographic Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStates} States</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalCities} cities covered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Types</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Categories available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* State Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Providers by State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.stateBreakdown.slice(0, 10).map(({ state, count }) => (
              <div key={state} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{state}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.activeProviders) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count} ({((count / analytics.activeProviders) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.ratingBreakdown.reverse().map(({ rating, count }) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{rating} Stars</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: analytics.activeProviders > 0 
                          ? `${(count / analytics.activeProviders) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
