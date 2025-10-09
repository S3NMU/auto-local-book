import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings,
  Plus,
  BarChart3,
  Clock,
  MapPin,
  Star,
  ArrowLeft,
  ChevronDown,
  LogOut,
  Shield,
  Store,
  X
} from "lucide-react";
import ProviderAnalytics from "@/components/provider/ProviderAnalytics";
import ProviderBookings from "@/components/provider/ProviderBookings";
import ProviderRevenue from "@/components/provider/ProviderRevenue";
import ProviderCustomers from "@/components/provider/ProviderCustomers";
import ProviderProfile from "@/components/provider/ProviderProfile";
import ServicePricing from "@/components/provider/ServicePricing";
import ProviderReviews from "@/components/provider/ProviderReviews";

const ProviderDashboard = () => {
  const { user, isProvider, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    monthlyBookings: 0,
    totalCustomers: 0,
    pendingBookings: 0
  });
  const [showBenefits, setShowBenefits] = useState(false);

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.user_metadata?.avatar_url || "");
      
      // Check if user is new provider (less than 7 days old)
      const benefitsDismissed = localStorage.getItem(`benefits-dismissed-${user.id}`);
      if (!benefitsDismissed) {
        const userCreatedAt = new Date(user.created_at);
        const daysSinceCreation = (Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
        setShowBenefits(daysSinceCreation <= 7);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !isProvider) {
      navigate("/");
      return;
    }

    if (user && isProvider) {
      checkApprovalStatus();
      fetchDashboardStats();
    }
  }, [user, isProvider, loading, navigate]);

  const checkApprovalStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('providers')
        .select('status')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking approval status:', error);
        setIsApproved(false);
        return;
      }

      // Provider is approved if they have an active entry in providers table
      setIsApproved(data?.status === 'active');
      
      // Redirect to pending approval page if not approved
      if (!data || data.status !== 'active') {
        navigate('/pending-approval');
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      setIsApproved(false);
    }
  };

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const [revenueData, bookingsData, customersData, pendingData] = await Promise.all([
        supabase
          .from('revenue_entries')
          .select('amount')
          .eq('provider_id', user.id)
          .eq('is_paid', true)
          .is('deleted_at', null),
        supabase
          .from('bookings')
          .select('id')
          .eq('provider_id', user.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .is('deleted_at', null),
        supabase
          .from('customer_records')
          .select('id')
          .eq('provider_id', user.id)
          .is('deleted_at', null),
        supabase
          .from('bookings')
          .select('id')
          .eq('provider_id', user.id)
          .eq('status', 'pending')
          .is('deleted_at', null)
      ]);

      const totalRevenue = revenueData.data?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;
      const monthlyBookings = bookingsData.data?.length || 0;
      const totalCustomers = customersData.data?.length || 0;
      const pendingBookings = pendingData.data?.length || 0;

      setDashboardStats({
        totalRevenue,
        monthlyBookings,
        totalCustomers,
        pendingBookings
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    }
  };

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
      navigate("/");
    }
  };

  const handleDismissBenefits = () => {
    if (user) {
      localStorage.setItem(`benefits-dismissed-${user.id}`, 'true');
      setShowBenefits(false);
    }
  };

  if (loading || isApproved === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isProvider || !isApproved) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar with Profile */}
      <div className="bg-card border-b border-border shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to main website
            </Link>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-xs">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {user.user_metadata?.display_name || user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">{user.user_metadata?.display_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
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
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto p-6 space-y-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-muted-foreground">Manage your automotive services business</p>
          </div>
          <Button onClick={() => navigate("/providers")} variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            View Public Profile
          </Button>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.monthlyBookings}</div>
            <p className="text-xs text-muted-foreground">Bookings this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.pendingBookings === 1 ? 'booking' : 'bookings'} awaiting response
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Feature Highlights - What You Get (Only for new providers) */}
      {showBenefits && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={handleDismissBenefits}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Your H3 Automo Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Digital Presence</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ Professional searchable profile</li>
                  <li>✓ Customer reviews & ratings</li>
                  <li>✓ SEO-optimized local listings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Operational Tools</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ Automated booking management</li>
                  <li>✓ Integrated payment processing</li>
                  <li>✓ Customer history tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Growth Support</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ Featured listing opportunities</li>
                  <li>✓ Analytics & insights</li>
                  <li>✓ Marketing support</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/20">
              <Link to="/provider-benefits" className="text-sm text-primary hover:underline">
                View all benefits →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <ProviderAnalytics />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <ProviderBookings onBookingUpdate={fetchDashboardStats} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <ProviderRevenue onRevenueUpdate={fetchDashboardStats} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <ProviderCustomers />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <ProviderReviews />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServicePricing />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <ProviderProfile />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
};

export default ProviderDashboard;