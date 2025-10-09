-- Fix FK on provider_services.provider_id to match RLS (provider_id = auth.uid())
-- 1) Drop incorrect FK (currently pointing to providers.id)
ALTER TABLE public.provider_services
DROP CONSTRAINT IF EXISTS provider_services_provider_id_fkey;

-- 2) Recreate FK referencing auth.users(id)
ALTER TABLE public.provider_services
ADD CONSTRAINT provider_services_provider_id_fkey
FOREIGN KEY (provider_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;