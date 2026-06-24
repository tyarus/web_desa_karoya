-- Add UMKM Templates Table
create table if not exists public.umkm_templates (
  id text primary key,
  name text not null,
  description text not null,
  thumbnail_url text,
  layout text not null default 'grid',
  color_scheme text not null default 'green',
  products_per_row integer default 3,
  show_price boolean default true,
  show_description boolean default true,
  created_at timestamptz not null default now()
);

-- Enable RLS first
alter table public.umkm_templates enable row level security;

drop policy if exists "Public can read UMKM templates" on public.umkm_templates;
create policy "Public can read UMKM templates"
on public.umkm_templates for select using (true);

drop policy if exists "Admins manage UMKM templates" on public.umkm_templates;
create policy "Admins manage UMKM templates"
on public.umkm_templates for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Insert default templates BEFORE adding foreign key
insert into public.umkm_templates (id, name, description, layout, color_scheme, products_per_row)
values 
  ('modern', 'Modern Minimalis', 'Template modern dengan desain bersih dan elegan', 'grid', 'green', 3),
  ('vibrant', 'Warna-warni', 'Template penuh warna dengan tampilan yang ceria dan menarik', 'grid', 'orange', 2),
  ('elegant', 'Elegan Premium', 'Template mewah dengan tampilan premium dan profesional', 'list', 'blue', 1),
  ('market', 'Pasar Digital', 'Template gaya marketplace dengan display produk maksimal', 'grid', 'red', 4)
on conflict (id) do nothing;

-- NOW update UMKM table to add template_id with foreign key
alter table public.umkm 
add column if not exists template_id text default 'modern' references public.umkm_templates(id);

alter table public.umkm 
add column if not exists status text default 'draft';
