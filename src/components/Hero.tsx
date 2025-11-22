import { Button } from "@/components/ui/button";
import { Car, Wrench, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-12 animate-slide-up">
          {/* H | 3 Automo Branding */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-6 text-6xl md:text-8xl lg:text-9xl font-bold">
              <span>H</span>
              <span className="text-white/80">|</span>
              <span>3</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              Automo
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Travel smart. Rent the ride. Rest the night.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8">
            <Link to="/rentals?type=rental" className="block group">
              <div className="bg-white/95 backdrop-blur-sm border-2 border-white/20 hover:border-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-blue-600 transition-colors">Rent</h3>
                <p className="text-muted-foreground">Browse available vehicles for rent</p>
              </div>
            </Link>

            <Link to="/rentals?type=sale" className="block group">
              <div className="bg-white/95 backdrop-blur-sm border-2 border-white/20 hover:border-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all">
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-green-600 transition-colors">Buy</h3>
                <p className="text-muted-foreground">Find your perfect vehicle to purchase</p>
              </div>
            </Link>

            <Link to="/services" className="block group">
              <div className="bg-white/95 backdrop-blur-sm border-2 border-white/20 hover:border-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all">
                  <Wrench className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-purple-600 transition-colors">Book Service</h3>
                <p className="text-muted-foreground">Schedule repairs and maintenance</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
