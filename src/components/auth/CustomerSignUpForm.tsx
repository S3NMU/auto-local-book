import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export interface CustomerSignUpFormData {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  city?: string;
  zipCode?: string;
  preferredComm?: ("email" | "sms")[];
  ownsVehicle?: boolean;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  licensePlate?: string;
  agreeToTerms?: boolean;
  agreeToPrivacy?: boolean;
}

interface CustomerSignUpFormProps {
  form: UseFormReturn<CustomerSignUpFormData>;
  onSubmit: (data: CustomerSignUpFormData) => void;
  isLoading: boolean;
}

export const CustomerSignUpForm = ({ form, onSubmit, isLoading }: CustomerSignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ownsVehicle = form.watch("ownsVehicle");
  const preferredComm = form.watch("preferredComm") || [];

  const toggleCommPreference = (value: "email" | "sms") => {
    const currentPrefs = preferredComm;
    if (currentPrefs.includes(value)) {
      form.setValue("preferredComm", currentPrefs.filter(p => p !== value));
    } else {
      form.setValue("preferredComm", [...currentPrefs, value]);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Account Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Account Info</h3>
        
        <div className="space-y-2">
          <Label htmlFor="customer-fullName">Full Name *</Label>
          <Input
            id="customer-fullName"
            placeholder="John Doe"
            {...form.register("fullName")}
            disabled={isLoading}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-email">Email *</Label>
          <Input
            id="customer-email"
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
          <Label htmlFor="customer-password">Password *</Label>
          <div className="relative">
            <Input
              id="customer-password"
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
          <Label htmlFor="customer-confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="customer-confirmPassword"
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
          <Label htmlFor="customer-phone">Phone Number (optional)</Label>
          <Input
            id="customer-phone"
            type="tel"
            placeholder="(555) 123-4567"
            {...form.register("phone")}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">Useful for booking notifications</p>
        </div>
      </div>

      {/* Location & Preferences */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Location & Preferences</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer-city">City (optional)</Label>
            <Input
              id="customer-city"
              placeholder="New York"
              {...form.register("city")}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-zipCode">ZIP Code (optional)</Label>
            <Input
              id="customer-zipCode"
              placeholder="10001"
              {...form.register("zipCode")}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Communication</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="comm-email"
                checked={preferredComm.includes("email")}
                onCheckedChange={() => toggleCommPreference("email")}
              />
              <Label htmlFor="comm-email" className="cursor-pointer font-normal">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="comm-sms"
                checked={preferredComm.includes("sms")}
                onCheckedChange={() => toggleCommPreference("sms")}
              />
              <Label htmlFor="comm-sms" className="cursor-pointer font-normal">SMS</Label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="customer-ownsVehicle"
            checked={ownsVehicle}
            onCheckedChange={(checked) => form.setValue("ownsVehicle", checked as boolean)}
          />
          <Label htmlFor="customer-ownsVehicle" className="cursor-pointer font-normal">
            I own a vehicle
          </Label>
        </div>

        {ownsVehicle && (
          <div className="pl-6 space-y-4 border-l-2 border-muted">
            <h4 className="font-medium">Vehicle Details (optional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-vehicleMake">Make</Label>
                <Input
                  id="customer-vehicleMake"
                  placeholder="Toyota"
                  {...form.register("vehicleMake")}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-vehicleModel">Model</Label>
                <Input
                  id="customer-vehicleModel"
                  placeholder="Camry"
                  {...form.register("vehicleModel")}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-vehicleYear">Year</Label>
                <Input
                  id="customer-vehicleYear"
                  placeholder="2020"
                  {...form.register("vehicleYear")}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-licensePlate">License Plate (optional)</Label>
                <Input
                  id="customer-licensePlate"
                  placeholder="ABC123"
                  {...form.register("licensePlate")}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Hidden from providers until booking</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Terms</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="customer-agreeToTerms"
              checked={form.watch("agreeToTerms")}
              onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
            />
            <Label htmlFor="customer-agreeToTerms" className="cursor-pointer font-normal text-sm leading-relaxed">
              I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </Label>
          </div>
          {form.formState.errors.agreeToTerms && (
            <p className="text-sm text-destructive ml-6">{form.formState.errors.agreeToTerms.message}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="customer-agreeToPrivacy"
              checked={form.watch("agreeToPrivacy")}
              onCheckedChange={(checked) => form.setValue("agreeToPrivacy", checked as boolean)}
            />
            <Label htmlFor="customer-agreeToPrivacy" className="cursor-pointer font-normal text-sm leading-relaxed">
              I agree to the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </Label>
          </div>
          {form.formState.errors.agreeToPrivacy && (
            <p className="text-sm text-destructive ml-6">{form.formState.errors.agreeToPrivacy.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Customer Account"}
      </Button>
    </form>
  );
};
