-- Create a provider record for existing provider profiles without a provider record
INSERT INTO public.providers (
  id,
  business_name,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  specialties,
  description,
  latitude,
  longitude,
  is_mobile
)
SELECT 
  pp.user_id,
  COALESCE(pp.business_name, 'Business Name'),
  COALESCE(pp.business_address, '123 Main St'),
  COALESCE(pp.business_city, 'City'),
  COALESCE(pp.business_state, 'State'),
  COALESCE(pp.business_zip_code, '12345'),
  pp.business_phone,
  (SELECT email FROM auth.users WHERE id = pp.user_id),
  pp.specialties,
  pp.business_description,
  0.0, -- Default latitude
  0.0, -- Default longitude
  pp.is_mobile_service
FROM public.provider_profiles pp
WHERE NOT EXISTS (
  SELECT 1 FROM public.providers p WHERE p.id = pp.user_id
)
ON CONFLICT (id) DO NOTHING;