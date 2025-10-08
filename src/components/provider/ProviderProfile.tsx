import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "./ImageUpload";

interface ProviderProfile {
  // MVP Required Fields
  dba_name: string;
  business_phone: string;
  business_email: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip_code: string;
  is_mobile_only: boolean;
  service_radius_miles: number;
  primary_category: string;
  business_hours: any;
  
  // Credentials (at least one required)
  license_number: string;
  license_issuer: string;
  license_expiry: string;
  insurance_carrier: string;
  insurance_expiry: string;
  
  // Media (required)
  logo_url: string;
  cover_photo_url: string;
  
  // Service Pricing (required)
  labor_rate_per_hour: number;
  diagnostic_fee: number;
  cancellation_window_hours: number;
  
  // Optional fields
  business_name: string;
  business_description: string;
  short_description: string;
  tagline: string;
  years_experience: number;
  is_mobile_service: boolean;
  pickup_available: boolean;
  dropoff_available: boolean;
  pickup_fee: number;
  dropoff_fee: number;
}

const CATEGORIES = [
  "General Repair",
  "Oil Change & Maintenance",
  "Brakes",
  "Tires",
  "Electrical",
  "Engine",
  "Transmission",
  "AC & Heating",
  "Suspension",
  "Hybrid/EV",
  "Diagnostics",
  "Body Work",
  "Detailing"
];

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile>({
    dba_name: "",
    business_phone: "",
    business_email: "",
    business_address: "",
    business_city: "",
    business_state: "",
    business_zip_code: "",
    is_mobile_only: false,
    service_radius_miles: 25,
    primary_category: "",
    business_hours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "09:00", close: "15:00", closed: false },
      sunday: { open: "", close: "", closed: true }
    },
    license_number: "",
    license_issuer: "",
    license_expiry: "",
    insurance_carrier: "",
    insurance_expiry: "",
    logo_url: "",
    cover_photo_url: "",
    labor_rate_per_hour: 0,
    diagnostic_fee: 0,
    cancellation_window_hours: 24,
    business_name: "",
    business_description: "",
    short_description: "",
    tagline: "",
    years_experience: 0,
    is_mobile_service: false,
    pickup_available: false,
    dropoff_available: false,
    pickup_fee: 0,
    dropoff_fee: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          dba_name: data.dba_name || "",
          business_phone: data.business_phone || "",
          business_email: data.business_email || "",
          business_address: data.business_address || "",
          business_city: data.business_city || "",
          business_state: data.business_state || "",
          business_zip_code: data.business_zip_code || "",
          is_mobile_only: data.is_mobile_only || false,
          service_radius_miles: data.service_radius_miles || 25,
          primary_category: data.primary_category || "",
          business_hours: data.business_hours || profile.business_hours,
          license_number: data.license_number || "",
          license_issuer: data.license_issuer || "",
          license_expiry: data.license_expiry || "",
          insurance_carrier: data.insurance_carrier || "",
          insurance_expiry: data.insurance_expiry || "",
          logo_url: data.logo_url || "",
          cover_photo_url: data.cover_photo_url || "",
          labor_rate_per_hour: data.labor_rate_per_hour || 0,
          diagnostic_fee: data.diagnostic_fee || 0,
          cancellation_window_hours: data.cancellation_window_hours || 24,
          business_name: data.business_name || "",
          business_description: data.business_description || "",
          short_description: data.short_description || "",
          tagline: data.tagline || "",
          years_experience: data.years_experience || 0,
          is_mobile_service: data.is_mobile_service || false,
          pickup_available: data.pickup_available || false,
          dropoff_available: data.dropoff_available || false,
          pickup_fee: data.pickup_fee || 0,
          dropoff_fee: data.dropoff_fee || 0
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateMVP = (): boolean => {
    const errors: string[] = [];

    if (!profile.dba_name) errors.push("Business name");
    if (!profile.business_phone) errors.push("Phone number");
    if (!profile.business_email) errors.push("Email");
    if (!profile.is_mobile_only && !profile.business_address) errors.push("Address");
    if (profile.is_mobile_only && !profile.service_radius_miles) errors.push("Service radius");
    if (!profile.primary_category) errors.push("Primary category");
    if (!profile.license_number && !profile.insurance_carrier) errors.push("License or Insurance");
    if (!profile.logo_url) errors.push("Logo");
    if (!profile.cover_photo_url) errors.push("Cover photo");
    if (!profile.labor_rate_per_hour && profile.labor_rate_per_hour !== 0) errors.push("Labor rate");
    if (!profile.diagnostic_fee && profile.diagnostic_fee !== 0) errors.push("Diagnostic fee");

    if (errors.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${errors.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const saveProfile = async () => {
    if (!user) return;
    if (!validateMVP()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('provider_profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your business profile has been saved",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: string, value: string | boolean) => {
    setProfile({
      ...profile,
      business_hours: {
        ...profile.business_hours,
        [day]: {
          ...profile.business_hours[day],
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const isProfileComplete = profile.dba_name && profile.business_phone && profile.business_email && 
    (profile.business_address || profile.is_mobile_only) && profile.primary_category && 
    (profile.license_number || profile.insurance_carrier) && profile.logo_url && 
    profile.cover_photo_url && (profile.labor_rate_per_hour || profile.labor_rate_per_hour === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Profile</h2>
          <p className="text-muted-foreground">Complete your profile to start receiving bookings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/providers?id=${user?.id}`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Public Profile
        </Button>
      </div>

      {!isProfileComplete && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete all required fields marked with * to activate your profile
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="multiple" defaultValue={["basic", "credentials", "media", "pricing"]} className="space-y-4">
        {/* Basic Information */}
        <AccordionItem value="basic">
          <Card>
            <AccordionTrigger className="px-6 hover:no-underline">
              <CardHeader className="p-0">
                <CardTitle>Basic Information *</CardTitle>
                <CardDescription>Required business details</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name (Public) *</Label>
                    <Input
                      placeholder="Your Shop Name"
                      value={profile.dba_name}
                      onChange={(e) => setProfile({ ...profile, dba_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Primary Category *</Label>
                    <Select value={profile.primary_category} onValueChange={(value) => setProfile({ ...profile, primary_category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Phone *</Label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={profile.business_phone}
                      onChange={(e) => setProfile({ ...profile, business_phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Business Email *</Label>
                    <Input
                      type="email"
                      placeholder="contact@yourshop.com"
                      value={profile.business_email}
                      onChange={(e) => setProfile({ ...profile, business_email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Tagline (80 characters max)</Label>
                  <Input
                    placeholder="Your shop's unique value proposition"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value.slice(0, 80) })}
                    maxLength={80}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{profile.tagline.length}/80</p>
                </div>

                <div>
                  <Label>Short Description (200-300 characters)</Label>
                  <Textarea
                    placeholder="Brief description of your services"
                    value={profile.short_description}
                    onChange={(e) => setProfile({ ...profile, short_description: e.target.value.slice(0, 300) })}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{profile.short_description.length}/300</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile_only"
                    checked={profile.is_mobile_only}
                    onCheckedChange={(checked) => setProfile({ ...profile, is_mobile_only: checked as boolean })}
                  />
                  <Label htmlFor="mobile_only">Mobile-only service (no physical address)</Label>
                </div>

                {!profile.is_mobile_only && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <Label>Street Address *</Label>
                      <Input
                        placeholder="123 Main St"
                        value={profile.business_address}
                        onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
                        required={!profile.is_mobile_only}
                      />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input
                        placeholder="City"
                        value={profile.business_city}
                        onChange={(e) => setProfile({ ...profile, business_city: e.target.value })}
                        required={!profile.is_mobile_only}
                      />
                    </div>
                    <div>
                      <Label>State *</Label>
                      <Input
                        placeholder="State"
                        value={profile.business_state}
                        onChange={(e) => setProfile({ ...profile, business_state: e.target.value })}
                        required={!profile.is_mobile_only}
                      />
                    </div>
                    <div>
                      <Label>ZIP Code *</Label>
                      <Input
                        placeholder="12345"
                        value={profile.business_zip_code}
                        onChange={(e) => setProfile({ ...profile, business_zip_code: e.target.value })}
                        required={!profile.is_mobile_only}
                      />
                    </div>
                  </div>
                )}

                {(profile.is_mobile_only || profile.is_mobile_service) && (
                  <div>
                    <Label>Service Radius (miles) *</Label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={profile.service_radius_miles}
                      onChange={(e) => setProfile({ ...profile, service_radius_miles: parseInt(e.target.value) || 0 })}
                      required={profile.is_mobile_only}
                    />
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Business Hours */}
        <AccordionItem value="hours">
          <Card>
            <AccordionTrigger className="px-6 hover:no-underline">
              <CardHeader className="p-0">
                <CardTitle>Business Hours *</CardTitle>
                <CardDescription>Set your operating schedule</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-3 pt-4">
                {Object.keys(profile.business_hours).map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <Checkbox
                      checked={!profile.business_hours[day].closed}
                      onCheckedChange={(checked) => updateBusinessHours(day, 'closed', !checked)}
                    />
                    {!profile.business_hours[day].closed && (
                      <>
                        <Input
                          type="time"
                          value={profile.business_hours[day].open}
                          onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={profile.business_hours[day].close}
                          onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                    {profile.business_hours[day].closed && <span className="text-muted-foreground">Closed</span>}
                  </div>
                ))}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Credentials */}
        <AccordionItem value="credentials">
          <Card>
            <AccordionTrigger className="px-6 hover:no-underline">
              <CardHeader className="p-0">
                <CardTitle>Credentials * (At least one required)</CardTitle>
                <CardDescription>License or insurance information</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">License Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>License Number</Label>
                      <Input
                        placeholder="License #"
                        value={profile.license_number}
                        onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Issuer</Label>
                      <Input
                        placeholder="State/City"
                        value={profile.license_issuer}
                        onChange={(e) => setProfile({ ...profile, license_issuer: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={profile.license_expiry}
                        onChange={(e) => setProfile({ ...profile, license_expiry: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Insurance Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Insurance Carrier</Label>
                      <Input
                        placeholder="Carrier name"
                        value={profile.insurance_carrier}
                        onChange={(e) => setProfile({ ...profile, insurance_carrier: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={profile.insurance_expiry}
                        onChange={(e) => setProfile({ ...profile, insurance_expiry: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Media */}
        <AccordionItem value="media">
          <Card>
            <AccordionTrigger className="px-6 hover:no-underline">
              <CardHeader className="p-0">
                <CardTitle>Branding & Photos *</CardTitle>
                <CardDescription>Logo and cover photo required</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6 pt-4">
                {user && (
                  <>
                    <ImageUpload
                      label="Business Logo * (max 5MB)"
                      currentUrl={profile.logo_url}
                      bucket="provider-logos"
                      userId={user.id}
                      onUploadComplete={(url) => setProfile({ ...profile, logo_url: url })}
                      maxSizeMB={5}
                    />
                    <ImageUpload
                      label="Cover Photo * (max 10MB)"
                      currentUrl={profile.cover_photo_url}
                      bucket="provider-photos"
                      userId={user.id}
                      onUploadComplete={(url) => setProfile({ ...profile, cover_photo_url: url })}
                      maxSizeMB={10}
                    />
                  </>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Pricing & Policies */}
        <AccordionItem value="pricing">
          <Card>
            <AccordionTrigger className="px-6 hover:no-underline">
              <CardHeader className="p-0">
                <CardTitle>Pricing & Policies *</CardTitle>
                <CardDescription>Service rates and policies</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-6 pt-4">
                <Alert>
                  <AlertDescription>
                    Set your labor rate OR add at least 5 services in the Services tab
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Labor Rate ($/hour) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={profile.labor_rate_per_hour}
                      onChange={(e) => setProfile({ ...profile, labor_rate_per_hour: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Diagnostic Fee ($) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={profile.diagnostic_fee}
                      onChange={(e) => setProfile({ ...profile, diagnostic_fee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Cancellation Window (hours) *</Label>
                    <Input
                      type="number"
                      placeholder="24"
                      value={profile.cancellation_window_hours}
                      onChange={(e) => setProfile({ ...profile, cancellation_window_hours: parseInt(e.target.value) || 24 })}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Additional Services</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pickup"
                      checked={profile.pickup_available}
                      onCheckedChange={(checked) => setProfile({ ...profile, pickup_available: checked as boolean })}
                    />
                    <Label htmlFor="pickup">Vehicle pickup service</Label>
                  </div>

                  {profile.pickup_available && (
                    <div className="ml-6">
                      <Label>Pickup Fee ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={profile.pickup_fee}
                        onChange={(e) => setProfile({ ...profile, pickup_fee: parseFloat(e.target.value) || 0 })}
                        className="w-48"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dropoff"
                      checked={profile.dropoff_available}
                      onCheckedChange={(checked) => setProfile({ ...profile, dropoff_available: checked as boolean })}
                    />
                    <Label htmlFor="dropoff">Vehicle dropoff service</Label>
                  </div>

                  {profile.dropoff_available && (
                    <div className="ml-6">
                      <Label>Dropoff Fee ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={profile.dropoff_fee}
                        onChange={(e) => setProfile({ ...profile, dropoff_fee: parseFloat(e.target.value) || 0 })}
                        className="w-48"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <Button onClick={saveProfile} disabled={saving} size="lg" className="w-full">
        <Save className="w-4 h-4 mr-2" />
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
};

export default ProviderProfile;
