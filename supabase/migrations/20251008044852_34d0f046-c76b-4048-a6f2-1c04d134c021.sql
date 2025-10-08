-- Add comprehensive provider profile fields

-- Business basics
ALTER TABLE public.provider_profiles
ADD COLUMN IF NOT EXISTS legal_business_name text,
ADD COLUMN IF NOT EXISTS dba_name text,
ADD COLUMN IF NOT EXISTS business_type text, -- 'sole_prop', 'llc', 'corp', 'nonprofit'
ADD COLUMN IF NOT EXISTS year_founded integer,
ADD COLUMN IF NOT EXISTS short_description text,
ADD COLUMN IF NOT EXISTS primary_category text,
ADD COLUMN IF NOT EXISTS secondary_categories text[],
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS languages_spoken text[],

-- Owner & contact (business_phone already exists)
ADD COLUMN IF NOT EXISTS owner_full_name text,
ADD COLUMN IF NOT EXISTS business_email text,
ADD COLUMN IF NOT EXISTS sms_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS google_maps_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,

-- Location & service area (most fields exist, adding new ones)
ADD COLUMN IF NOT EXISTS parking_notes text,
ADD COLUMN IF NOT EXISTS is_mobile_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,

-- Hours & availability (business_hours already exists)
ADD COLUMN IF NOT EXISTS holiday_exceptions jsonb, -- [{date, reason, closed}]
ADD COLUMN IF NOT EXISTS lead_time_days integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS same_day_bookings boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS buffer_minutes integer DEFAULT 30,

-- Credentials & compliance
ADD COLUMN IF NOT EXISTS license_issuer text,
ADD COLUMN IF NOT EXISTS license_expiry date,
ADD COLUMN IF NOT EXISTS license_file_url text,
ADD COLUMN IF NOT EXISTS insurance_carrier text,
ADD COLUMN IF NOT EXISTS insurance_coverage_type text,
ADD COLUMN IF NOT EXISTS insurance_expiry date,
ADD COLUMN IF NOT EXISTS insurance_proof_url text,
ADD COLUMN IF NOT EXISTS certifications jsonb, -- [{code, issuer, expiry, proof_url}]
ADD COLUMN IF NOT EXISTS owner_photo_id_url text,

-- Capacity & equipment
ADD COLUMN IF NOT EXISTS number_of_bays integer,
ADD COLUMN IF NOT EXISTS number_of_lifts integer,
ADD COLUMN IF NOT EXISTS lift_types text[],
ADD COLUMN IF NOT EXISTS max_vehicle_weight integer,
ADD COLUMN IF NOT EXISTS max_vehicle_class text,
ADD COLUMN IF NOT EXISTS scan_tools text[],
ADD COLUMN IF NOT EXISTS ev_equipment boolean DEFAULT false,

-- Branding & media
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS cover_photo_url text,
ADD COLUMN IF NOT EXISTS gallery_photos text[], -- array of URLs

-- Notifications & preferences
ADD COLUMN IF NOT EXISTS preferred_contact_method text, -- 'sms', 'email', 'both'
ADD COLUMN IF NOT EXISTS emergency_contact text,
ADD COLUMN IF NOT EXISTS emergency_phone text,

-- Payouts
ADD COLUMN IF NOT EXISTS stripe_account_id text,
ADD COLUMN IF NOT EXISTS payout_status text, -- 'pending', 'connected', 'verified'

-- Global pricing & policies
ADD COLUMN IF NOT EXISTS labor_rate_per_hour numeric,
ADD COLUMN IF NOT EXISTS diagnostic_fee numeric,
ADD COLUMN IF NOT EXISTS parts_policy text, -- 'oem', 'aftermarket', 'mixed'
ADD COLUMN IF NOT EXISTS parts_markup_percent numeric,
ADD COLUMN IF NOT EXISTS shop_supplies_fee numeric,
ADD COLUMN IF NOT EXISTS shop_supplies_fee_type text, -- 'percent', 'fixed'
ADD COLUMN IF NOT EXISTS warranty_months integer,
ADD COLUMN IF NOT EXISTS warranty_miles integer,
ADD COLUMN IF NOT EXISTS warranty_terms text,
ADD COLUMN IF NOT EXISTS customer_parts_allowed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS customer_parts_policy text,
ADD COLUMN IF NOT EXISTS deposit_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS deposit_percent numeric,
ADD COLUMN IF NOT EXISTS cancellation_window_hours integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS cancellation_fee numeric,
ADD COLUMN IF NOT EXISTS cancellation_fee_type text, -- 'percent', 'fixed'
ADD COLUMN IF NOT EXISTS towing_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS towing_fee numeric;

-- Add comments for clarity
COMMENT ON COLUMN public.provider_profiles.legal_business_name IS 'Official registered business name';
COMMENT ON COLUMN public.provider_profiles.dba_name IS 'Doing Business As / Public name';
COMMENT ON COLUMN public.provider_profiles.business_type IS 'Business entity type: sole_prop, llc, corp, nonprofit';
COMMENT ON COLUMN public.provider_profiles.certifications IS 'JSON array of certifications: [{code, issuer, expiry, proof_url}]';
COMMENT ON COLUMN public.provider_profiles.holiday_exceptions IS 'JSON array of holiday closures: [{date, reason, closed}]';