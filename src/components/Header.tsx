import { useState, useEffect } from "react";
import logoImage from "@/assets/crossed-wrenches-icon.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, User, LogOut, ChevronDown, Settings, Store, Shield, X, Car, ShoppingCart, Wrench, Briefcase, BookOpen, Bell, HelpCircle, Download, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation as useGeoLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import LocationDialog from "./LocationDialog";
import { ThemeToggle } from "./ThemeToggle";
import type { Session } from "@supabase/supabase-js";

const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="bg-card border-b border-border shadow-card" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="H3 Automo home">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/10 p-1">
              <img src={logoImage} alt="H3 Automo Logo - Crossed wrenches symbol" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">H3 Automo</h1>
              <p className="text-xs text-muted-foreground">Service Booking</p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            <Link to="/" className={getLinkClassName("/")}>
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 transition-fast ${
                  isActive("/providers") || isActive("/services") || isActive("/for-providers")
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary"
                }`}>
                  Get Started
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background border border-border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/rentals?type=rental" className="cursor-pointer">
                    <Car className="w-4 h-4 mr-2" />
                    Rent a Vehicle
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/rentals?type=sale" className="cursor-pointer">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy a Car
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/services" className="cursor-pointer">
                    <Wrench className="w-4 h-4 mr-2" />
                    Schedule a Repair
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/for-providers#application-form" className="cursor-pointer">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Become a Provider
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/how-it-works" className={getLinkClassName("/how-it-works")}>
              How It Works
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 transition-fast ${
                  isActive("/for-providers")
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary"
                }`}>
                  Provider Resources
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-background border border-border shadow-lg z-50">
                <DropdownMenuItem asChild>
                  <Link to="/provider-resources/guides" className="cursor-pointer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Guides & Tutorials
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/provider-resources/announcements" className="cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" />
                    Announcements / Updates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/provider-resources/support" className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Contact Provider Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/provider-resources/downloads" className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" />
                    H3 Provider HUB
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/for-providers" className="cursor-pointer">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Become a Provider
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open mobile menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link 
                    to="/" 
                    className={getLinkClassName("/")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Get Started</p>
                    <Link 
                      to="/rentals?type=rental" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Car className="w-4 h-4" />
                      Rent a Vehicle
                    </Link>
                    <Link 
                      to="/rentals?type=sale" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy a Car
                    </Link>
                    <Link 
                      to="/services" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Wrench className="w-4 h-4" />
                      Schedule a Repair
                    </Link>
                  </div>

                  <Link 
                    to="/how-it-works" 
                    className={getLinkClassName("/how-it-works")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Provider Resources</p>
                    <Link 
                      to="/provider-resources/guides" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      Guides & Tutorials
                    </Link>
                    <Link 
                      to="/provider-resources/announcements" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Bell className="w-4 h-4" />
                      Announcements / Updates
                    </Link>
                    <Link 
                      to="/provider-resources/support" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Contact Provider Support
                    </Link>
                    <Link 
                      to="/provider-resources/downloads" 
                      className="flex items-center gap-2 pl-4 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Download className="w-4 h-4" />
                      H3 Provider HUB
                    </Link>
                  </div>

                  <Link 
                    to="/blog" 
                    className={getLinkClassName("/blog")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/about" 
                    className={getLinkClassName("/about")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className={getLinkClassName("/contact")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  <div className="pt-4 border-t space-y-2">
                    {session ? (
                      <>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{session.user.user_metadata?.display_name || "User"}</p>
                          <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                        <Link 
                          to="/account" 
                          className="flex items-center gap-2 text-foreground hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-2 text-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        {isProvider && (
                          <Link 
                            to="/provider-dashboard" 
                            className="flex items-center gap-2 text-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Store className="w-4 h-4" />
                            Provider Dashboard
                          </Link>
                        )}
                        {!isAdmin && !isProvider && (
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 text-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Customer Dashboard
                          </Link>
                        )}
                        <Button 
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => {
                          const currentPath = routerLocation.pathname;
                          if (currentPath !== '/auth') {
                            localStorage.setItem('redirectAfterLogin', currentPath);
                          }
                          navigate('/auth', { state: { from: { pathname: currentPath } } });
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    )}
                    <Link 
                      to="/for-providers#application-form"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="hero" className="w-full">
                        <Store className="w-4 h-4 mr-2" />
                        List Your Shop
                      </Button>
                    </Link>
                    {location ? (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setLocationDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {location.address.split(",")[0]}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setLocationDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Find Location
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-2" role="toolbar" aria-label="User actions">
            <ThemeToggle />
            {location ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 max-w-48" aria-label={`Current location: ${location.address}`}>
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs text-muted-foreground">Location</span>
                      <span className="text-sm font-medium truncate max-w-32">{location.address.split(",")[0]}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
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
                        aria-label="Clear location"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                        <span className="sr-only">Clear location</span>
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
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => setLocationDialogOpen(true)} aria-label="Find location">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Find Location
              </Button>
            )}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2" aria-label="User menu">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={avatarUrl} alt={`${session.user.user_metadata?.display_name || session.user.email}'s profile picture`} />
                      <AvatarFallback className="text-xs">{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {session.user.user_metadata?.display_name || session.user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
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
                  {!isAdmin && !isProvider && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Customer Dashboard
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
                aria-label="Sign in to your account"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Sign In
              </Button>
            )}
            <Link to="/for-providers#application-form" aria-label="List your auto service shop">
              <Button variant="hero" size="sm">
                <Store className="w-4 h-4" aria-hidden="true" />
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
