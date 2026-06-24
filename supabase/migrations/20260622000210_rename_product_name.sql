-- Force PostgREST schema cache by doing a column rename operation
BEGIN;

-- Rename product_name to a temp name
ALTER TABLE public.umkm_products RENAME COLUMN product_name TO _temp_product_name_2024;

-- Rename it back
ALTER TABLE public.umkm_products RENAME COLUMN _temp_product_name_2024 TO product_name;

COMMIT;
