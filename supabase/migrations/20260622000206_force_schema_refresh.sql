-- Force schema cache refresh by doing a dummy column rename and rename back
-- This forces Supabase to reload the schema cache

BEGIN;

-- Add a dummy column if not exists
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS _schema_refresh_helper text DEFAULT 'temp';

-- Drop the dummy column immediately
ALTER TABLE public.umkm_products DROP COLUMN IF EXISTS _schema_refresh_helper;

-- Also ensure product_name exists (for safety)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'umkm_products' AND column_name = 'product_name'
  ) THEN
    ALTER TABLE public.umkm_products ADD COLUMN product_name text;
  END IF;
END $$;

COMMIT;
