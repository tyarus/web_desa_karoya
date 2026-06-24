-- Add missing columns to umkm table for multi-step form
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS template_id text DEFAULT 'A';
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS maps_url text;
ALTER TABLE public.umkm ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#1B4332';

-- Create umkm_templates table if not exists
CREATE TABLE IF NOT EXISTS public.umkm_templates (
  id text primary key,
  name text,
  description text,
  layout text default 'single',
  color_scheme text default 'green',
  products_per_row integer default 3,
  show_price boolean default true,
  show_description boolean default true,
  primary_color text default '#1B4332',
  secondary_color text default '#666666',
  font_family text default 'system-ui',
  accent_color text default '#06B6D4',
  created_at timestamptz default now()
);

-- Insert default templates
INSERT INTO public.umkm_templates (id, name, description, layout, accent_color) VALUES
  ('A', 'Klasik Elegan', 'Desain klasik dengan sentuhan premium', 'single', '#D4AF37'),
  ('B', 'Modern Grid', 'Tampilan modern dengan galeri foto dominan', 'grid', '#1B4332'),
  ('C', 'Minimalis Clean', 'Desain minimalis dengan fokus pada konten', 'centered', '#6B7280')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for templates
ALTER TABLE public.umkm_templates ENABLE ROW LEVEL SECURITY;

-- Public can read templates
DROP POLICY IF EXISTS "Public can read umkm_templates" ON public.umkm_templates;
CREATE POLICY "Public can read umkm_templates"
ON public.umkm_templates FOR SELECT USING (true);
