import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, ArrowLeft, User, Wrench } from "lucide-react";
import { CustomerSignUpForm as CustomerSignUpFormComponent, type CustomerSignUpFormData } from "@/components/auth/CustomerSignUpForm";
import { ProviderSignUpForm as ProviderSignUpFormComponent, type ProviderSignUpFormData } from "@/components/auth/ProviderSignUpForm";

// Validation schemas
const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const customerSignUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  confirmPassword: z.string(),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  preferredComm: z.array(z.enum(["email", "sms"])).optional(),
  ownsVehicle: z.boolean().optional(),
  vehicleMake: z.string().trim().optional(),
  vehicleModel: z.string().trim().optional(),
  vehicleYear: z.string().trim().optional(),
  licensePlate: z.string().trim().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the Terms of Service"),
  agreeToPrivacy: z.boolean().refine((val) => val === true, "You must agree to the Privacy Policy"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const providerSignUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  confirmPassword: z.string(),
  businessPhone: z.string().trim().min(10, "Business phone is required"),
  businessName: z.string().trim().min(2, "Business name is required").max(200, "Name is too long"),
  businessType: z.string().min(1, "Please select a business type"),
  primaryCategory: z.string().min(1, "Please select a primary service category"),
  city: z.string().trim().min(2, "City is required"),
  zipCode: z.string().trim().min(5, "ZIP code is required"),
  serviceRadius: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the Provider Terms of Service"),
  confirmAccuracy: z.boolean().refine((val) => val === true, "You must confirm business info accuracy"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpType, setSignUpType] = useState<"customer" | "provider">("customer");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or localStorage
  const getRedirectPath = async () => {
    const fromState = (location.state as any)?.from?.pathname;
    const fromStorage = localStorage.getItem('redirectAfterLogin');
    
    // Check user roles to redirect to appropriate dashboard
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
      
      const userRoles = rolesData?.map(r => r.role) || [];
      
      if (userRoles.includes('admin')) return '/admin';
      
      // For providers, check if they're approved before redirecting to dashboard
      if (userRoles.includes('provider')) {
        const { data: providerData } = await supabase
          .from('providers')
          .select('status')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (providerData?.status === 'active') {
          return '/provider-dashboard';
        }
        
        // Fallback: check provider request status for this user
        const { data: reqData } = await supabase
          .from('provider_requests')
          .select('status')
          .eq('submitted_by', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (reqData?.status === 'approved') {
          return '/provider-dashboard';
        }
        return '/pending-approval';
      }
      
      if (userRoles.includes('user')) return '/dashboard';
    }
    
    return fromState || fromStorage || '/';
  };

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const customerSignUpForm = useForm<CustomerSignUpFormData>({
    resolver: zodResolver(customerSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
      zipCode: "",
      preferredComm: [],
      ownsVehicle: false,
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      licensePlate: "",
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  const providerSignUpForm = useForm<ProviderSignUpFormData>({
    resolver: zodResolver(providerSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessPhone: "",
      businessName: "",
      businessType: "",
      primaryCategory: "",
      city: "",
      zipCode: "",
      serviceRadius: "",
      websiteUrl: "",
      agreeToTerms: false,
      confirmAccuracy: false,
    },
  });

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const redirectPath = await getRedirectPath();
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    };
    checkAuth();
  }, [navigate]);

  const onSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      
      const redirectPath = await getRedirectPath();
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCustomerSignUp = async (data: CustomerSignUpFormData) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            phone: data.phone,
            display_name: data.fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'user'
          });

        if (roleError) {
          console.error('Error setting user role:', roleError);
        }
      }

      toast({
        title: "Account created!",
        description: "Please check your email and click the confirmation link to complete your registration.",
      });
      
      const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
      signInTab?.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onProviderSignUp = async (data: ProviderSignUpFormData) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            phone: data.businessPhone,
            display_name: data.businessName,
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'provider'
          });

        if (roleError) {
          console.error('Error setting user role:', roleError);
        }

        const { error: profileError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: authData.user.id,
            business_name: data.businessName,
            business_phone: data.businessPhone,
            business_email: data.email,
            owner_full_name: data.fullName,
            business_city: data.city,
            business_zip_code: data.zipCode,
            primary_category: data.primaryCategory,
            service_radius_miles: data.serviceRadius ? parseInt(data.serviceRadius) : 25,
            website_url: data.websiteUrl || null,
            short_description: `${data.businessType} offering ${data.primaryCategory} services`,
          });

        if (profileError) {
          console.error('Error creating provider profile:', profileError);
        }
      }

      toast({
        title: "Provider account created!",
        description: "Please check your email and click the confirmation link to continue.",
      });
      
      // Redirect to pending approval page
      navigate("/pending-approval");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to H3 Automo</CardTitle>
            <CardDescription>
              Sign in to access services, rentals, vehicles for sale, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      {...signInForm.register("email")}
                      disabled={isLoading}
                    />
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...signInForm.register("password")}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Create an account to book services, rent vehicles, buy cars, and access full provider information.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={signUpType}
                      onValueChange={(value) => setSignUpType(value as "customer" | "provider")}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="customer" id="type-customer" />
                        <Label htmlFor="type-customer" className="flex items-center gap-2 cursor-pointer flex-1">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Customer</div>
                            <div className="text-xs text-muted-foreground">Rent, buy, and book services</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="provider" id="type-provider" />
                        <Label htmlFor="type-provider" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Wrench className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Provider</div>
                            <div className="text-xs text-muted-foreground">Offer services, rentals & sales</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {signUpType === "customer" ? (
                    <CustomerSignUpFormComponent 
                      form={customerSignUpForm}
                      onSubmit={onCustomerSignUp}
                      isLoading={isLoading}
                    />
                  ) : (
                    <ProviderSignUpFormComponent 
                      form={providerSignUpForm}
                      onSubmit={onProviderSignUp}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;