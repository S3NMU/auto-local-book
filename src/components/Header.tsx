import { useState, useEffect } from "react";
import logoImage from "@/assets/crossed-wrenches-logo.jpg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User, LogOut, ChevronDown, Settings, Store, Shield, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation as useGeoLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import LocationDialog from "./LocationDialog";
import type { Session } from "@supabase/supabase-js";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { toast } = useToast();
  const { location, setLocation } = useGeoLocation();
  const { isAdmin, isProvider } = useAuth();
  const routerLocation = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || "");
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const handleClearLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(null);
    toast({
      title: "Location cleared",
      description: "Your location has been cleared successfully.",
    });
  };

  const isActive = (path: string) => {
    return routerLocation.pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return `flex items-center gap-2 transition-fast ${
      isActive(path) ? "text-primary font-medium" : "text-foreground hover:text-primary"
    }`;
  };

  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/10 p-1">
              <img src={logoImage} alt="H3 Automo Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">H3 Automo</h1>
              <p className="text-xs text-muted-foreground">Service Booking</p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={getLinkClassName("/")}>
              Home
            </Link>
            <Link to="/services" className={getLinkClassName("/services")}>
              Auto Services
            </Link>
            <Link to="/providers" className={getLinkClassName("/providers")}>
              Service Providers
            </Link>
            <Link to="/how-it-works" className={getLinkClassName("/how-it-works")}>
              How It Works
            </Link>
            <Link to="/for-providers" className={getLinkClassName("/for-providers")}>
              For Providers
            </Link>
            <Link to="/blog" className={getLinkClassName("/blog")}>
              Blog
            </Link>
            <Link to="/about" className={getLinkClassName("/about")}>
              About
            </Link>
            <Link to="/contact" className={getLinkClassName("/contact")}>
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {location ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 max-w-48">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs text-muted-foreground">Location</span>
                      <span className="text-sm font-medium truncate max-w-32">{location.address.split(",")[0]}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-background border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Current Location</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{location.address}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearLocation}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground ml-2 flex-shrink-0"
                        title="Clear location"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => setLocationDialogOpen(true)} className="cursor-pointer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Change Location
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => setLocationDialogOpen(true)}>
                <MapPin className="w-4 h-4" />
                Find Location
              </Button>
            )}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-xs">{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {session.user.user_metadata?.display_name || session.user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">{session.user.user_metadata?.display_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isProvider && (
                    <DropdownMenuItem asChild>
                      <Link to="/provider-dashboard" className="cursor-pointer">
                        <Store className="w-4 h-4 mr-2" />
                        Provider Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const currentPath = routerLocation.pathname;
                  if (currentPath !== '/auth') {
                    localStorage.setItem('redirectAfterLogin', currentPath);
                  }
                  navigate('/auth', { state: { from: { pathname: currentPath } } });
                }}
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
            <Link to="/list-shop">
              <Button variant="hero" size="sm">
                <Store className="w-4 h-4" />
                List Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <LocationDialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen} onLocationSelect={setLocation} />
    </header>
  );
};

export default Header;
