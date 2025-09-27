-- Add RLS policy for providers to manage their own services
CREATE POLICY "Providers can manage their own services" ON provider_services
FOR ALL
USING (provider_id = auth.uid())
WITH CHECK (provider_id = auth.uid());