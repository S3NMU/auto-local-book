import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

interface ProviderProfile {
  business_name: string;
  business_description: string;
  business_phone: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip_code: string;
  specialties: string[];
  years_experience: number;
  license_number: string;
  is_mobile_service: boolean;
  service_radius_miles: number;
}

const ProviderProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProviderProfile>({
    business_name: "",
    business_description: "",
    business_phone: "",
    business_address: "",
    business_city: "",
    business_state: "",
    business_zip_code: "",
    specialties: [],
    years_experience: 0,
    license_number: "",
    is_mobile_service: false,
    service_radius_miles: 25
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
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          business_name: data.business_name || "",
          business_description: data.business_description || "",
          business_phone: data.business_phone || "",
          business_address: data.business_address || "",
          business_city: data.business_city || "",
          business_state: data.business_state || "",
          business_zip_code: data.business_zip_code || "",
          specialties: data.specialties || [],
          years_experience: data.years_experience || 0,
          license_number: data.license_number || "",
          is_mobile_service: data.is_mobile_service || false,
          service_radius_miles: data.service_radius_miles || 25
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

  const saveProfile = async () => {
    if (!user) return;

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Profile</h2>
        <p className="text-muted-foreground">Manage your business information and service details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Update your business details that customers will see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Business Name</Label>
              <Input
                placeholder="Your Business Name"
                value={profile.business_name}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Business Phone</Label>
              <Input
                placeholder="(555) 123-4567"
                value={profile.business_phone}
                onChange={(e) => setProfile({ ...profile, business_phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Business Description</Label>
            <Textarea
              placeholder="Describe your services and specialties..."
              value={profile.business_description}
              onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Address</Label>
              <Input
                placeholder="Street address"
                value={profile.business_address}
                onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                placeholder="City"
                value={profile.business_city}
                onChange={(e) => setProfile({ ...profile, business_city: e.target.value })}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                placeholder="State"
                value={profile.business_state}
                onChange={(e) => setProfile({ ...profile, business_state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>ZIP Code</Label>
              <Input
                placeholder="12345"
                value={profile.business_zip_code}
                onChange={(e) => setProfile({ ...profile, business_zip_code: e.target.value })}
              />
            </div>
            <div>
              <Label>Years of Experience</Label>
              <Input
                type="number"
                placeholder="5"
                value={profile.years_experience}
                onChange={(e) => setProfile({ ...profile, years_experience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>License Number</Label>
              <Input
                placeholder="License #"
                value={profile.license_number}
                onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile_service"
                checked={profile.is_mobile_service}
                onCheckedChange={(checked) => setProfile({ ...profile, is_mobile_service: checked as boolean })}
              />
              <Label htmlFor="mobile_service">I offer mobile services</Label>
            </div>

            {profile.is_mobile_service && (
              <div>
                <Label>Service Radius (miles)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={profile.service_radius_miles}
                  onChange={(e) => setProfile({ ...profile, service_radius_miles: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}
          </div>

          <Button onClick={saveProfile} disabled={saving} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderProfile;