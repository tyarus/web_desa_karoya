-- Force schema cache refresh by adding and dropping a dummy column
BEGIN;

-- Add a new column (this forces PostgREST to re-read schema)
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS _cache_refresh_col_temp text DEFAULT 'force_refresh';

-- Drop it immediately
ALTER TABLE public.umkm_products DROP COLUMN IF EXISTS _cache_refresh_col_temp;

COMMIT;
