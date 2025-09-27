import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">LocalAuto</h1>
              <p className="text-xs text-muted-foreground">Service Booking</p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/services" className="text-foreground hover:text-primary transition-fast">
              Services
            </Link>
            <Link to="/providers" className="text-foreground hover:text-primary transition-fast">
              Providers
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-fast">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-fast">
              Contact
            </Link>
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