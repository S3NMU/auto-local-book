import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User, LogOut, ChevronDown, Settings, Store, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import LocationDialog from "./LocationDialog";
import type { Session } from "@supabase/supabase-js";

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { toast } = useToast();
  const { location, setLocation } = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setAvatarUrl(session?.user?.user_metadata?.avatar_url || "");
      }
    );

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
            {location ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex items-center gap-2 max-w-48"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs text-muted-foreground">Location</span>
                      <span className="text-sm font-medium truncate max-w-32">
                        {location.address.split(',')[0]}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-background border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-xs text-muted-foreground mt-1">{location.address}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={() => setLocationDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Change Location
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex"
                onClick={() => setLocationDialogOpen(true)}
              >
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
                      <AvatarFallback className="text-xs">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {session.user.user_metadata?.display_name || session.user.email?.split('@')[0]}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
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

      <LocationDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onLocationSelect={setLocation}
      />
    </header>
  );
};

export default Header;