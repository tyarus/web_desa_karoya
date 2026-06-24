-- Add missing product_name column to umkm_products
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS product_name text;

-- Set NOT NULL constraint if possible
DO $$
BEGIN
  -- Try to set NOT NULL, but this might fail if there are NULL values
  ALTER TABLE public.umkm_products ALTER COLUMN product_name SET NOT NULL;
EXCEPTION WHEN others THEN
  -- If it fails (due to NULL values), just leave it as nullable
  RAISE NOTICE 'Could not set NOT NULL on product_name: %', SQLERRM;
END $$;
