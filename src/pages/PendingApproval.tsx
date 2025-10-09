import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Clock, ArrowLeft, CheckCircle2, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PendingApproval = () => {
  const { user, isProvider, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Admins should never see this page
    if (!loading && isAdmin) {
      navigate("/admin");
      return;
    }
    
    if (!loading && !isProvider) {
      navigate("/");
    }
  }, [loading, isProvider, isAdmin, navigate]);

  // Poll for approval status and auto-redirect when approved
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const { data: providerData } = await supabase
          .from('providers')
          .select('status')
          .eq('id', user.id)
          .maybeSingle();
        if (providerData?.status === 'active') {
          navigate('/provider-dashboard');
          return;
        }
        const { data: reqData } = await supabase
          .from('provider_requests')
          .select('status')
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (reqData?.status === 'approved') {
          navigate('/provider-dashboard');
        }
      } catch (e) {
        // no-op
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Your Application is Under Review</CardTitle>
            <CardDescription className="text-base">
              Thank you for joining H3 Automo as a service provider!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription>
                Our team is currently reviewing your business information to ensure quality service for our customers. 
                This process typically takes <strong>1-2 business days</strong>.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review Process Steps:</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">Your business information has been received</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Verification in Progress</p>
                    <p className="text-sm text-muted-foreground">We're verifying your business credentials and license information</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Approval & Activation</p>
                    <p className="text-sm text-muted-foreground">Once approved, you'll receive an email and gain full access to your dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <AlertTitle>What you can do while waiting:</AlertTitle>
              <AlertDescription className="space-y-2">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>You'll receive an email notification once approved</li>
                  <li>Check back here to see your approval status</li>
                  <li>Prepare your service pricing and availability</li>
                  <li>Gather photos of your facility for your profile</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleSignOut} className="flex-1">
                Sign Out
              </Button>
              <Button asChild className="flex-1">
                <Link to="/">Browse Directory</Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Questions? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;
