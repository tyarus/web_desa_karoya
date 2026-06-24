-- Force PostgREST schema cache reload by recreating RLS policies
-- This often triggers a schema cache refresh in Supabase

-- Drop and recreate RLS policies
DROP POLICY IF EXISTS "Public can read UMKM products" ON public.umkm_products;
CREATE POLICY "Public can read UMKM products"
ON public.umkm_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage UMKM products" ON public.umkm_products;
CREATE POLICY "Admins manage UMKM products"
ON public.umkm_products FOR ALL USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Also grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.umkm_products TO anon;
GRANT ALL ON public.umkm_products TO authenticated;
