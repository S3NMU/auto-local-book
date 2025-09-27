import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Wrench } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import LocationDialog from "./LocationDialog";
import SearchDialog from "./SearchDialog";
import ProvidersMap from "./ProvidersMap";

const Hero = () => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { location, setLocation } = useLocation();

  const handleLocationClick = () => {
    setLocationDialogOpen(true);
  };

  const handleSearchSubmit = () => {
    setSearchDialogOpen(true);
  };

  return (
    <section className="relative bg-gradient-subtle pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Find Trusted
                <span className="block text-primary">Auto Services</span>
                Near You
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Book instantly with transparent pricing. Connect with verified mechanics, 
                auto shops, and mobile services in your area.
              </p>
            </div>

            {/* Location and Search */}
            <div className="bg-card rounded-lg p-4 shadow-elegant max-w-lg">
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
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Verified Providers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Wrench className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold text-foreground">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Service Types</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-accent mr-2" />
                  <span className="text-2xl font-bold text-foreground">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="relative lg:order-first animate-fade-scale">
            <div className="bg-card rounded-2xl p-4 shadow-hover">
              <h3 className="text-lg font-semibold text-foreground mb-4">Find Providers Near You</h3>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <ProvidersMap />
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-lg shadow-elegant animate-fade-scale" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Oil Change</p>
                  <p className="text-sm text-success">Available Today</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-lg shadow-elegant animate-fade-scale" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">4.9 Rating</p>
                  <p className="text-sm text-muted-foreground">1000+ Reviews</p>
                </div>
              </div>
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