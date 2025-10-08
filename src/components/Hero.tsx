import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Wrench } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import LocationDialog from "./LocationDialog";
import SearchDialog from "./SearchDialog";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { location, setLocation } = useLocation();
  const [stats, setStats] = useState({
    providers: 0,
    services: 0,
    rating: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get provider count
        const { count: providerCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Get unique service categories
        const { data: servicesData } = await supabase
          .from('services')
          .select('category');
        
        const uniqueCategories = [...new Set(servicesData?.map(s => s.category) || [])];

        // Get average rating
        const { data: providersData } = await supabase
          .from('providers')
          .select('rating')
          .eq('status', 'active');

        const avgRating = providersData && providersData.length > 0
          ? providersData.reduce((sum, p) => sum + (p.rating || 0), 0) / providersData.length
          : 0;

        setStats({
          providers: providerCount || 0,
          services: uniqueCategories.length,
          rating: avgRating
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLocationClick = () => {
    setLocationDialogOpen(true);
  };

  const handleSearchSubmit = () => {
    setSearchDialogOpen(true);
  };

  return (
    <section className="relative bg-gradient-subtle pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Full-width hero content */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
              Find Trusted
              <span className="block text-primary">Auto Services</span>
              Near You
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Book instantly with transparent pricing. Connect with verified mechanics, 
              auto shops, and mobile services in your area.
            </p>
          </div>

          {/* Location and Search */}
          <div className="bg-card rounded-lg p-6 shadow-elegant max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder={location ? location.address : "Enter your location or ZIP code"}
                  className="pl-10 py-3 text-base cursor-pointer"
                  onClick={handleLocationClick}
                  readOnly
                  value={location?.address || ""}
                />
              </div>
              <Button variant="hero" size="lg" className="w-full py-3" onClick={handleSearchSubmit}>
                Find Providers Near You
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.providers}+</span>
              </div>
              <p className="text-lg text-muted-foreground">Verified Providers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-primary mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.services}+</span>
              </div>
              <p className="text-lg text-muted-foreground">Service Types</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-accent mr-2" />
                <span className="text-3xl font-bold text-foreground">{stats.rating > 0 ? stats.rating.toFixed(1) : '0.0'}</span>
              </div>
              <p className="text-lg text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <LocationDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onLocationSelect={setLocation}
      />

      <SearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        defaultServices={[]}
      />
    </section>
  );
};

export default Hero;