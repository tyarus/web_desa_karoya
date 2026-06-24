-- Force schema refresh for umkm_products table
-- This migration ensures all required columns exist

-- Add columns if they don't exist (will be no-op if already exists)
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS umkm_id uuid;
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS price text;
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.umkm_products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Ensure primary key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'umkm_products_pkey'
    AND table_name = 'umkm_products'
  ) THEN
    ALTER TABLE public.umkm_products ADD CONSTRAINT umkm_products_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- Ensure foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'umkm_products_umkm_id_fkey'
    AND table_name = 'umkm_products'
  ) THEN
    ALTER TABLE public.umkm_products ADD CONSTRAINT umkm_products_umkm_id_fkey
    FOREIGN KEY (umkm_id) REFERENCES public.umkm(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure NOT NULL constraints
ALTER TABLE public.umkm_products ALTER COLUMN umkm_id SET NOT NULL;
ALTER TABLE public.umkm_products ALTER COLUMN product_name SET NOT NULL;
ALTER TABLE public.umkm_products ALTER COLUMN description SET NOT NULL;
