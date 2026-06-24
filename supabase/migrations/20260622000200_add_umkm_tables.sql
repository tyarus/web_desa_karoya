-- UMKM Tables
create table if not exists public.umkm (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  owner_name text not null,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.umkm_products (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references public.umkm(id) on delete cascade,
  product_name text not null,
  description text not null,
  image_url text,
  price text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.umkm enable row level security;
alter table public.umkm_products enable row level security;

drop policy if exists "Public can read UMKM" on public.umkm;
create policy "Public can read UMKM"
on public.umkm for select using (true);

drop policy if exists "Public can read UMKM products" on public.umkm_products;
create policy "Public can read UMKM products"
on public.umkm_products for select using (true);

drop policy if exists "Admins manage UMKM" on public.umkm;
create policy "Admins manage UMKM"
on public.umkm for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage UMKM products" on public.umkm_products;
create policy "Admins manage UMKM products"
on public.umkm_products for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop trigger if exists set_umkm_updated_at on public.umkm;
create trigger set_umkm_updated_at
before update on public.umkm
for each row execute function public.set_updated_at();

drop trigger if exists set_umkm_products_updated_at on public.umkm_products;
create trigger set_umkm_products_updated_at
before update on public.umkm_products
for each row execute function public.set_updated_at();
