-- Drop the problematic product_name column that has PostgREST cache issues
-- The name column is used instead

BEGIN;

-- Drop the product_name column if it exists
ALTER TABLE public.umkm_products DROP COLUMN IF EXISTS product_name CASCADE;

COMMIT;
