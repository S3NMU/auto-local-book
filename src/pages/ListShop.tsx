import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "@/hooks/useLocation";
import LocationDialog from "@/components/LocationDialog";
import { MapPin, Store, Phone, Mail, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

// Validation schema for shop listing
const shopSchema = z.object({
  business_name: z.string()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  address: z.string()
    .min(5, "Please provide a complete address")
    .max(200, "Address must be less than 200 characters"),
  city: z.string()
    .min(1, "City is required")
    .max(50, "City must be less than 50 characters"),
  state: z.string()
    .min(2, "State is required")
    .max(2, "Please use 2-letter state code"),
  zip_code: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  phone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter phone in format: (555) 123-4567"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  website_url: z.string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  specialties: z.array(z.string())
    .min(1, "Please select at least one specialty"),
  is_mobile: z.boolean(),
  business_hours: z.string()
    .min(5, "Please provide business hours")
    .max(100, "Business hours must be less than 100 characters"),
});

type ShopForm = z.infer<typeof shopSchema>;

const ListShop = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const { location, setLocation } = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const specialtyOptions = [
    "Oil Change", "Brake Service", "Diagnostics", "Tune-Up",
    "Inspection", "Auto Detailing", "Tire Service", "Battery Replacement",
    "Engine Repair", "Transmission Service", "Air Conditioning", "Electrical Work",
    "Exhaust Repair", "Suspension Repair", "Collision Repair", "Paint & Body"
  ];

  const form = useForm<ShopForm>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      business_name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone: "",
      email: "",
      website_url: "",
      specialties: [],
      is_mobile: false,
      business_hours: "",
    },
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user?.email) {
        form.setValue("email", session.user.email);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-fill address fields when location is selected
  useEffect(() => {
    if (location) {
      const addressParts = location.address.split(', ');
      if (addressParts.length >= 3) {
        form.setValue("address", addressParts[0]);
        form.setValue("city", addressParts[addressParts.length - 3]);
        
        const stateZip = addressParts[addressParts.length - 2].split(' ');
        if (stateZip.length >= 2) {
          form.setValue("state", stateZip[0]);
          form.setValue("zip_code", stateZip[1]);
        }
      }
    }
  }, [location, form]);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return phoneNumber;
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties");
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    
    form.setValue("specialties", newSpecialties);
  };

  const onSubmit = async (data: ShopForm) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to list your shop.",
        variant: "destructive",
      });
      return;
    }

    if (!location) {
      toast({
        title: "Location required",
        description: "Please set your shop location before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('provider_requests')
        .insert({
          business_name: data.business_name,
          description: data.description,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          phone: data.phone,
          email: data.email,
          website_url: data.website_url || null,
          specialties: data.specialties,
          is_mobile: data.is_mobile,
          business_hours: JSON.stringify({ hours: data.business_hours }),
          latitude: location.lat,
          longitude: location.lng,
          status: 'pending',
          submitted_by: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Shop listing submitted!",
        description: "Your shop request has been submitted for admin review. We'll notify you once it's approved.",
      });

      // Redirect to success page or home
      navigate("/");
    } catch (error: any) {
      console.error("Error submitting shop:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit your shop listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Sign in to list your shop</h1>
          <p className="text-muted-foreground mb-6">
            Join our network of trusted automotive service providers
          </p>
          <Button onClick={() => {
            localStorage.setItem('redirectAfterLogin', '/list-shop');
            navigate('/auth', { state: { from: { pathname: '/list-shop' } } });
          }}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Store className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">List Your Shop</h1>
              <p className="text-muted-foreground">Join our network of trusted automotive service providers</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>
              Provide details about your automotive service business to get listed on H3 Automo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    placeholder="Your Auto Shop Name"
                    {...form.register("business_name")}
                  />
                  {form.formState.errors.business_name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.business_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services, expertise, and what makes your shop special..."
                    rows={4}
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    placeholder="https://yourshop.com"
                    {...form.register("website_url")}
                  />
                  {form.formState.errors.website_url && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.website_url.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                
                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Shop Location *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setLocationDialogOpen(true)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {location ? "Change Location" : "Set Location"}
                    </Button>
                  </div>
                  {location && (
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  )}
                  {!location && (
                    <p className="text-sm text-destructive">Please set your shop location</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      {...form.register("address")}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Your City"
                      {...form.register("city")}
                    />
                    {form.formState.errors.city && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      maxLength={2}
                      {...form.register("state")}
                      onChange={(e) => {
                        form.setValue("state", e.target.value.toUpperCase());
                      }}
                    />
                    {form.formState.errors.state && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      placeholder="12345"
                      {...form.register("zip_code")}
                    />
                    {form.formState.errors.zip_code && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.zip_code.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      {...form.register("phone")}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        form.setValue("phone", formatted);
                      }}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shop@example.com"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_hours">Business Hours *</Label>
                  <Input
                    id="business_hours"
                    placeholder="Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
                    {...form.register("business_hours")}
                  />
                  {form.formState.errors.business_hours && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.business_hours.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Services Offered *</h3>
                <p className="text-sm text-muted-foreground">
                  Select all services your shop provides
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={form.watch("specialties").includes(specialty)}
                        onCheckedChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <label
                        htmlFor={specialty}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.specialties && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.specialties.message}
                  </p>
                )}
              </div>

              {/* Mobile Service */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_mobile"
                    checked={form.watch("is_mobile")}
                    onCheckedChange={(checked) => form.setValue("is_mobile", !!checked)}
                  />
                  <Label htmlFor="is_mobile" className="cursor-pointer">
                    We offer mobile services (we come to the customer's location)
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={isSubmitting || !location} className="flex-1">
                    {isSubmitting ? "Submitting..." : "Submit Shop Listing"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your listing will be reviewed and approved within 1-2 business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <LocationDialog
          open={locationDialogOpen}
          onOpenChange={setLocationDialogOpen}
          onLocationSelect={setLocation}
        />
      </div>
    </div>
  );
};

export default ListShop;