import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';

export default function ProviderHubApp() {
  const { user, loading: authLoading } = useAuth();
  const { subscribed, tierName, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Card className="max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Subscription Required</h2>
          <p className="text-muted-foreground mb-6">
            To access Provider Hub, you need an active subscription. Choose a plan that fits your needs.
          </p>
          <Button onClick={() => navigate('/provider-hub-subscription')}>
            View Subscription Plans
          </Button>
        </Card>
      </div>
    );
  }

  const tier = tierName || 'basic';
  const isProUser = tier === 'pro';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Provider Hub</h1>
            <p className="text-muted-foreground">Welcome back to your business dashboard</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/provider-hub-subscription')}>
            Manage Subscription
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Customer Management</h3>
            <p className="text-sm text-muted-foreground mb-4">Track and manage your customers</p>
            <Button className="w-full">Open Module</Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Booking System</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage appointments and schedules</p>
            <Button className="w-full">Open Module</Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Revenue Tracking</h3>
            <p className="text-sm text-muted-foreground mb-4">Monitor your business finances</p>
            <Button className="w-full">Open Module</Button>
          </Card>

          {isProUser ? (
            <>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">Deep insights into your business</p>
                <Button className="w-full">Open Module</Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Automated Workflows</h3>
                <p className="text-sm text-muted-foreground mb-4">Streamline your operations</p>
                <Button className="w-full">Open Module</Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Custom Branding</h3>
                <p className="text-sm text-muted-foreground mb-4">Personalize your customer experience</p>
                <Button className="w-full">Open Module</Button>
              </Card>
            </>
          ) : (
            <Card className="p-6 md:col-span-2 lg:col-span-3 border-primary/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Get access to advanced analytics, automated workflows, and custom branding
                  </p>
                </div>
                <Button onClick={() => navigate('/provider-hub-subscription')}>
                  Upgrade Now
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
