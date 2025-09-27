import { Button } from "@/components/ui/button";
import { MapPin, Phone, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">LocalAuto</h1>
              <p className="text-xs text-muted-foreground">Service Booking</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-foreground hover:text-primary transition-fast">
              Services
            </a>
            <a href="#providers" className="text-foreground hover:text-primary transition-fast">
              Providers
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-fast">
              How it Works
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <MapPin className="w-4 h-4" />
              Find Location
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              List Your Shop
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;