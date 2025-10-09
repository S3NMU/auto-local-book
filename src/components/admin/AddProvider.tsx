import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const businessTypes = [
  "Independent Mechanic",
  "Auto Shop",
  "Mobile Service",
  "Detailing",
  "Tire Shop",
  "Body Shop",
  "Transmission Specialist",
  "Other",
];

const serviceCategories = [
  "General Repair",
  "Brakes",
  "Tires",
  "Diagnostics",
  "Oil Change",
  "Engine Repair",
  "Transmission",
  "Electrical",
  "AC/Heating",
  "Detailing",
  "Body Work",
];


export const AddProvider = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessPhone: '',
    businessName: '',
    businessType: '',
    primaryCategory: '',
    city: '',
    zipCode: '',
    serviceRadius: '',
    websiteUrl: '',
    address: '',
    state: '',
    latitude: '',
    longitude: '',
    description: '',
    specialties: '',
    is_mobile: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.businessPhone,
            display_name: formData.businessName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign provider role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'provider'
          });

        if (roleError) throw roleError;

        // Create provider profile
        const { error: profileError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: authData.user.id,
            business_name: formData.businessName,
            business_phone: formData.businessPhone,
            business_email: formData.email,
            owner_full_name: formData.fullName,
            business_city: formData.city,
            business_zip_code: formData.zipCode,
            business_state: formData.state || null,
            business_address: formData.address || null,
            primary_category: formData.primaryCategory,
            service_radius_miles: formData.serviceRadius ? parseInt(formData.serviceRadius) : 25,
            website_url: formData.websiteUrl || null,
            short_description: formData.description || `${formData.businessType} offering ${formData.primaryCategory} services`,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            is_mobile_service: formData.is_mobile,
          });

        if (profileError) throw profileError;

        // Create provider entry if we have location data
        if (formData.latitude && formData.longitude && formData.address) {
          const specialtiesArray = formData.specialties
            ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
            : [];

          const { error: providerError } = await supabase
            .from('providers')
            .insert({
              business_name: formData.businessName,
              owner_name: formData.fullName || null,
              phone: formData.businessPhone || null,
              email: formData.email || null,
              address: formData.address,
              city: formData.city,
              state: formData.state || 'N/A',
              zip_code: formData.zipCode,
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
              description: formData.description || null,
              website_url: formData.websiteUrl || null,
              specialties: specialtiesArray,
              is_mobile: formData.is_mobile,
              status: 'active',
            });

          if (providerError) console.error('Error creating provider entry:', providerError);
        }
      }

      toast({
        title: "Success",
        description: "Provider account created successfully. Confirmation email sent.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessPhone: '',
        businessName: '',
        businessType: '',
        primaryCategory: '',
        city: '',
        zipCode: '',
        serviceRadius: '',
        websiteUrl: '',
        address: '',
        state: '',
        latitude: '',
        longitude: '',
        description: '',
        specialties: '',
        is_mobile: false,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create provider account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Account Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Account Info</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Overview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Overview</h3>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="John's Auto Repair"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange('businessType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryCategory">Primary Service Category *</Label>
                <Select
                  value={formData.primaryCategory}
                  onValueChange={(value) => handleInputChange('primaryCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address (optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                <Input
                  id="serviceRadius"
                  type="number"
                  value={formData.serviceRadius}
                  onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                  placeholder="25"
                />
                <p className="text-xs text-muted-foreground">For mobile services</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website or Google Maps Link</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                placeholder="Brief description of services offered"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => handleInputChange('specialties', e.target.value)}
                placeholder="Oil Change, Brake Repair, Engine Diagnostics"
              />
            </div>
          </div>

          {/* Location Data (Optional) */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Location Data (Optional)</h3>
              <p className="text-sm text-muted-foreground">For map display - can be added later</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="40.7128"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_mobile"
              checked={formData.is_mobile}
              onCheckedChange={(checked) => handleInputChange('is_mobile', checked === true)}
            />
            <Label htmlFor="is_mobile">Mobile Service Available</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating Provider Account...' : 'Create Provider Account'}
          </Button>

          <p className="text-sm text-muted-foreground">
            A confirmation email will be sent to the provider to verify their account.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};