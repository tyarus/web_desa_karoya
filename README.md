# Desa Karoya

Website resmi Desa Karoya, Kecamatan Tegalwaru, dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, Supabase, dan panel admin realtime.

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Setup Supabase

Panduan lengkap ada di [docs/supabase-setup.md](docs/supabase-setup.md).

Ringkasnya:

1. Buat project Supabase.
2. Isi `.env.local` dari Supabase Dashboard → Project Settings → API.
3. Jalankan isi `supabase/schema.sql` di SQL Editor.
4. Buat user admin di Authentication → Users.
5. Jalankan verifikasi:

```bash
npm run supabase:check
```

## Route

Publik:

- `/`
- `/profil`
- `/berita`
- `/berita/[slug]`
- `/layanan`
- `/galeri`
- `/kontak`

Admin:

- `/admin`
- `/admin/beranda`
- `/admin/profil`
- `/admin/berita`
- `/admin/layanan`
- `/admin/galeri`
- `/admin/kontak`
- `/admin/pengaturan`

Login admin:

- `/admin/login`

## Verifikasi

```bash
npm run lint
npx tsc --noEmit
npm run build
```
