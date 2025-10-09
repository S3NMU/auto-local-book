import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export interface ProviderSignUpFormData {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  businessPhone?: string;
  businessName?: string;
  businessType?: string;
  primaryCategory?: string;
  city?: string;
  zipCode?: string;
  serviceRadius?: string;
  websiteUrl?: string;
  agreeToTerms?: boolean;
  confirmAccuracy?: boolean;
}

interface ProviderSignUpFormProps {
  form: UseFormReturn<ProviderSignUpFormData>;
  onSubmit: (data: ProviderSignUpFormData) => void;
  isLoading: boolean;
}

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

export const ProviderSignUpForm = ({ form, onSubmit, isLoading }: ProviderSignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Account Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Account Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="provider-fullName">Full Name *</Label>
          <Input
            id="provider-fullName"
            placeholder="John Doe"
            {...form.register("fullName")}
            disabled={isLoading}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-email">Email *</Label>
          <Input
            id="provider-email"
            type="email"
            placeholder="john@example.com"
            {...form.register("email")}
            disabled={isLoading}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-password">Password *</Label>
          <div className="relative">
            <Input
              id="provider-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...form.register("password")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="provider-confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...form.register("confirmPassword")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-businessPhone">Business Phone *</Label>
          <Input
            id="provider-businessPhone"
            type="tel"
            placeholder="(555) 123-4567"
            {...form.register("businessPhone")}
            disabled={isLoading}
          />
          {form.formState.errors.businessPhone && (
            <p className="text-sm text-destructive">{form.formState.errors.businessPhone.message}</p>
          )}
        </div>
      </div>

      {/* Business Overview */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Business Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your full profile after signup
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="provider-businessName">Business Name *</Label>
          <Input
            id="provider-businessName"
            placeholder="John's Auto Repair"
            {...form.register("businessName")}
            disabled={isLoading}
          />
          {form.formState.errors.businessName && (
            <p className="text-sm text-destructive">{form.formState.errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-businessType">Business Type *</Label>
          <Select
            value={form.watch("businessType")}
            onValueChange={(value) => form.setValue("businessType", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="provider-businessType">
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
          {form.formState.errors.businessType && (
            <p className="text-sm text-destructive">{form.formState.errors.businessType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-primaryCategory">Primary Service Category *</Label>
          <Select
            value={form.watch("primaryCategory")}
            onValueChange={(value) => form.setValue("primaryCategory", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="provider-primaryCategory">
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
          {form.formState.errors.primaryCategory && (
            <p className="text-sm text-destructive">{form.formState.errors.primaryCategory.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provider-city">City *</Label>
            <Input
              id="provider-city"
              placeholder="New York"
              {...form.register("city")}
              disabled={isLoading}
            />
            {form.formState.errors.city && (
              <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider-zipCode">ZIP Code *</Label>
            <Input
              id="provider-zipCode"
              placeholder="10001"
              {...form.register("zipCode")}
              disabled={isLoading}
            />
            {form.formState.errors.zipCode && (
              <p className="text-sm text-destructive">{form.formState.errors.zipCode.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-serviceRadius">Service Radius (miles, optional)</Label>
          <Input
            id="provider-serviceRadius"
            type="number"
            placeholder="25"
            {...form.register("serviceRadius")}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">For mobile services</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-websiteUrl">Business Website or Google Maps Link (optional)</Label>
          <Input
            id="provider-websiteUrl"
            type="url"
            placeholder="https://example.com"
            {...form.register("websiteUrl")}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Terms</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="provider-agreeToTerms"
              checked={form.watch("agreeToTerms")}
              onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
            />
            <Label htmlFor="provider-agreeToTerms" className="cursor-pointer font-normal text-sm leading-relaxed">
              I agree to the <Link to="/terms" className="text-primary hover:underline">Provider Terms of Service</Link>
            </Label>
          </div>
          {form.formState.errors.agreeToTerms && (
            <p className="text-sm text-destructive ml-6">{form.formState.errors.agreeToTerms.message}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="provider-confirmAccuracy"
              checked={form.watch("confirmAccuracy")}
              onCheckedChange={(checked) => form.setValue("confirmAccuracy", checked as boolean)}
            />
            <Label htmlFor="provider-confirmAccuracy" className="cursor-pointer font-normal text-sm leading-relaxed">
              I confirm that my business information is accurate
            </Label>
          </div>
          {form.formState.errors.confirmAccuracy && (
            <p className="text-sm text-destructive ml-6">{form.formState.errors.confirmAccuracy.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Provider Account"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        After registration, complete your profile with licensing, insurance, hours, photos, and payment setup
      </p>
    </form>
  );
};
