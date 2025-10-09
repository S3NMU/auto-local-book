import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Star, FileText } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, loading, isProvider, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (isAdmin) {
        navigate('/admin');
      } else if (isProvider) {
        navigate('/provider-dashboard');
      }
    }
  }, [user, loading, isAdmin, isProvider, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Get first name from user metadata or email
        const metadata = user.user_metadata;
        const fullName = metadata?.fullName || metadata?.full_name || '';
        const extractedFirstName = fullName.split(' ')[0] || user.email?.split('@')[0] || 'User';
        setFirstName(extractedFirstName);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to email-based name
        setFirstName(user.email?.split('@')[0] || 'User');
      } finally {
        setUserLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {firstName}!</h1>
          <p className="text-muted-foreground">
            Manage your bookings and explore automotive services.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No upcoming appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Services</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Service history
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Share your experiences
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest bookings and service history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No recent activity to display
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with your next service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => navigate('/providers')}
                className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Find a Service Provider</h3>
                <p className="text-sm text-muted-foreground">
                  Browse local automotive professionals
                </p>
              </button>
              <button
                onClick={() => navigate('/services')}
                className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-1">Explore Services</h3>
                <p className="text-sm text-muted-foreground">
                  View available automotive services
                </p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
