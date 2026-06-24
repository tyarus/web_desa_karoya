-- Add contact fields to UMKM table
alter table public.umkm add column if not exists phone text;
alter table public.umkm add column if not exists whatsapp text;
alter table public.umkm add column if not exists email text;

-- Add primary_color and secondary_color to templates
alter table public.umkm_templates add column if not exists primary_color text default '#000000';
alter table public.umkm_templates add column if not exists secondary_color text default '#666666';
alter table public.umkm_templates add column if not exists font_family text default 'system-ui';
alter table public.umkm_templates add column if not exists accent_color text default '#06B6D4';
