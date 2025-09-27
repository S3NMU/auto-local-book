import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MapPin
} from "lucide-react";
import ProviderAnalytics from "@/components/provider/ProviderAnalytics";
import ProviderBookings from "@/components/provider/ProviderBookings";
import ProviderRevenue from "@/components/provider/ProviderRevenue";
import ProviderCustomers from "@/components/provider/ProviderCustomers";
import ProviderProfile from "@/components/provider/ProviderProfile";
import ServicePricing from "@/components/provider/ServicePricing";

const ProviderDashboard = () => {
  const { user, isProvider, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    monthlyBookings: 0,
    totalCustomers: 0,
    pendingBookings: 0
  });

  useEffect(() => {
    if (!loading && !isProvider) {
      navigate("/");
      return;
    }

    if (user && isProvider) {
      fetchDashboardStats();
    }
  }, [user, isProvider, loading, navigate]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const [revenueData, bookingsData, customersData, pendingData] = await Promise.all([
        supabase
          .from('revenue_entries')
          .select('amount')
          .eq('provider_id', user.id)
          .eq('is_paid', true),
        supabase
          .from('bookings')
          .select('id')
          .eq('provider_id', user.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('customer_records')
          .select('id')
          .eq('provider_id', user.id),
        supabase
          .from('bookings')
          .select('id')
          .eq('provider_id', user.id)
          .eq('status', 'pending')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isProvider) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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

      {/* Main Dashboard */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
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

        <TabsContent value="services" className="space-y-4">
          <ServicePricing />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <ProviderProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;