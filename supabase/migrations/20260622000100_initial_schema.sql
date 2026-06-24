create extension if not exists "pgcrypto";

do $$ begin
  create type post_category as enum ('berita', 'pengumuman');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type post_status as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type request_status as enum ('masuk', 'diproses', 'selesai', 'ditolak');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type message_status as enum ('baru', 'dibalas', 'diarsipkan');
exception when duplicate_object then null;
end $$;

create table if not exists public.village_settings (
  id text primary key default 'default',
  village_name text not null,
  district text not null,
  regency text,
  province text,
  address text,
  phone text,
  email text,
  whatsapp text,
  map_url text,
  logo_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.home_sections (
  id text primary key default 'default',
  hero_title text not null,
  hero_subtitle text not null,
  hero_image_url text,
  hero_cta_label text,
  hero_cta_href text,
  stats jsonb,
  featured_services jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key default 'default',
  history text not null,
  vision text not null,
  missions text[],
  government_structure jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category post_category not null default 'berita',
  status post_status not null default 'draft',
  cover_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  requirements text[],
  flow text[],
  contact text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  service_type text not null,
  resident_name text not null,
  nik text not null,
  phone text not null,
  address text not null,
  notes text,
  status request_status not null default 'masuk',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  reply text,
  status message_status not null default 'baru',
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_village_settings_updated_at on public.village_settings;
create trigger set_village_settings_updated_at
before update on public.village_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_home_sections_updated_at on public.home_sections;
create trigger set_home_sections_updated_at
before update on public.home_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_service_requests_updated_at on public.service_requests;
create trigger set_service_requests_updated_at
before update on public.service_requests
for each row execute function public.set_updated_at();

alter table public.village_settings enable row level security;
alter table public.home_sections enable row level security;
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.services enable row level security;
alter table public.service_requests enable row level security;
alter table public.gallery enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read village settings" on public.village_settings;
create policy "Public can read village settings"
on public.village_settings for select using (true);

drop policy if exists "Public can read home sections" on public.home_sections;
create policy "Public can read home sections"
on public.home_sections for select using (true);

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles"
on public.profiles for select using (true);

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts for select using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
on public.services for select using (true);

drop policy if exists "Public can read gallery" on public.gallery;
create policy "Public can read gallery"
on public.gallery for select using (true);

drop policy if exists "Public can send service requests" on public.service_requests;
create policy "Public can send service requests"
on public.service_requests for insert with check (true);

drop policy if exists "Public can send contact messages" on public.contact_messages;
create policy "Public can send contact messages"
on public.contact_messages for insert with check (true);

drop policy if exists "Admins manage village settings" on public.village_settings;
create policy "Admins manage village settings"
on public.village_settings for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage home sections" on public.home_sections;
create policy "Admins manage home sections"
on public.home_sections for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts"
on public.posts for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services"
on public.services for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage service requests" on public.service_requests;
create policy "Admins manage service requests"
on public.service_requests for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage gallery" on public.gallery;
create policy "Admins manage gallery"
on public.gallery for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
on public.contact_messages for all using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.village_settings (
  id, village_name, district, regency, province, address, phone, email, whatsapp, map_url
) values (
  'default', 'Desa Karoya', 'Tegalwaru', 'Kabupaten Karawang', 'Jawa Barat',
  'Kantor Desa Karoya, Kecamatan Tegalwaru', '0267-000000',
  'pemdes@desa-karoya.id', '6281200000000',
  'https://maps.google.com/?q=Desa+Karoya+Tegalwaru'
) on conflict (id) do nothing;

insert into public.home_sections (
  id, hero_title, hero_subtitle, hero_image_url, hero_cta_label, hero_cta_href, stats, featured_services
) values (
  'default',
  'Desa Karoya',
  'Pusat informasi resmi Desa Karoya, Kecamatan Tegalwaru, untuk layanan warga, kabar desa, dan dokumentasi kegiatan.',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  'Lihat Layanan',
  '/layanan',
  '[{"label":"Jumlah RT","value":"18","helper":"Tersebar di wilayah Desa Karoya"},{"label":"Jumlah RW","value":"6","helper":"Menjadi penghubung layanan warga"},{"label":"Layanan aktif","value":"8","helper":"Administrasi desa dan surat warga"},{"label":"Agenda desa","value":"12","helper":"Kegiatan warga sepanjang tahun"}]'::jsonb,
  '[{"title":"Surat Domisili","description":"Pengajuan keterangan domisili untuk kebutuhan administrasi.","href":"/layanan"},{"title":"Surat Usaha","description":"Pendataan dan penerbitan keterangan usaha warga.","href":"/layanan"},{"title":"Pengantar SKCK","description":"Pengantar dari desa untuk proses administrasi kepolisian.","href":"/layanan"}]'::jsonb
) on conflict (id) do nothing;

insert into public.profiles (
  id, history, vision, missions, government_structure
) values (
  'default',
  'Desa Karoya tumbuh sebagai ruang hidup warga Tegalwaru yang dekat dengan kegiatan pertanian, usaha keluarga, dan gotong royong. Website ini disiapkan untuk membantu warga mengakses informasi desa secara lebih cepat. Data sejarah dapat diperbarui oleh pemerintah desa melalui panel admin.',
  'Mewujudkan Desa Karoya yang tertib administrasi, terbuka dalam informasi, dan dekat dengan kebutuhan warga.',
  array[
    'Memperkuat layanan administrasi desa yang mudah diakses.',
    'Menyajikan informasi kegiatan, pengumuman, dan program desa secara berkala.',
    'Mendorong partisipasi warga dalam pembangunan dan pelayanan publik.',
    'Menjaga dokumentasi kegiatan desa agar mudah ditemukan kembali.'
  ],
  '[{"name":"Kepala Desa","role":"Kepala Desa Karoya","area":"Pemerintahan desa"},{"name":"Sekretaris Desa","role":"Sekretaris Desa","area":"Administrasi dan tata usaha"},{"name":"Kaur Pelayanan","role":"Kaur Pelayanan","area":"Layanan warga"},{"name":"Kasi Pemerintahan","role":"Kasi Pemerintahan","area":"Data penduduk dan kewilayahan"}]'::jsonb
) on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('desa-karoya', 'desa-karoya', true)
on conflict (id) do nothing;

drop policy if exists "Public can view village assets" on storage.objects;
create policy "Public can view village assets"
on storage.objects for select using (bucket_id = 'desa-karoya');

drop policy if exists "Admins upload village assets" on storage.objects;
create policy "Admins upload village assets"
on storage.objects for insert with check (
  bucket_id = 'desa-karoya' and auth.role() = 'authenticated'
);

drop policy if exists "Admins update village assets" on storage.objects;
create policy "Admins update village assets"
on storage.objects for update using (
  bucket_id = 'desa-karoya' and auth.role() = 'authenticated'
) with check (
  bucket_id = 'desa-karoya' and auth.role() = 'authenticated'
);

drop policy if exists "Admins delete village assets" on storage.objects;
create policy "Admins delete village assets"
on storage.objects for delete using (
  bucket_id = 'desa-karoya' and auth.role() = 'authenticated'
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'village_settings'
  ) then
    alter publication supabase_realtime add table public.village_settings;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'home_sections'
  ) then
    alter publication supabase_realtime add table public.home_sections;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'services'
  ) then
    alter publication supabase_realtime add table public.services;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'service_requests'
  ) then
    alter publication supabase_realtime add table public.service_requests;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'gallery'
  ) then
    alter publication supabase_realtime add table public.gallery;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contact_messages'
  ) then
    alter publication supabase_realtime add table public.contact_messages;
  end if;
end $$;
