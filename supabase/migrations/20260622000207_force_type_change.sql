-- Force PostgREST schema cache refresh
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE public.umkm_products ALTER COLUMN product_name TYPE text;
