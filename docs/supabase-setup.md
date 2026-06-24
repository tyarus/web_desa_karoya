# Setup Supabase Desa Karoya

Panduan ini menyambungkan project Next.js ke Supabase Cloud.

## 1. Buat Project Supabase

1. Buka `https://supabase.com/dashboard`.
2. Buat project baru.
3. Simpan database password di tempat aman.
4. Tunggu sampai project selesai dibuat.

## 2. Isi Environment

Buka Supabase Dashboard:

`Project Settings` → `API`

Isi file `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://gsgdgzajihwhgravotfg.supabase.co/rest/v1/
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_OLI0q9drCv_HUFEz3GzDVA_pDjyn0M9
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=desa-karoya
```

Catatan:

- Gunakan `Publishable key` untuk app ini.
- Jangan masukkan `Secret key` atau `service_role` ke file frontend.
- Jika project lama hanya punya `anon key`, kode masih mendukung `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Jalankan SQL Schema

1. Buka `SQL Editor` di Supabase Dashboard.
2. Buat query baru.
3. Salin isi `supabase/schema.sql`.
4. Klik `Run`.

SQL ini akan membuat:

- tabel konten publik dan admin
- enum status
- trigger `updated_at`
- RLS policies
- bucket Storage `desa-karoya`
- policy upload Storage untuk admin login
- Realtime publication untuk semua tabel yang dipakai preview
- data awal untuk profil, beranda, dan pengaturan desa

## 4. Buat User Admin

1. Buka `Authentication` → `Users`.
2. Klik `Add user`.
3. Isi email dan password admin.
4. Centang email confirmed jika ada opsi tersebut.

User ini dipakai untuk login di `/admin/login`.

## 5. Aktifkan Realtime

Schema sudah menambahkan tabel ke publication `supabase_realtime`. Jika preview belum berubah realtime:

1. Buka `Database` → `Replication`.
2. Pastikan tabel berikut aktif di publication `supabase_realtime`:
   `village_settings`, `home_sections`, `profiles`, `posts`, `services`,
   `service_requests`, `gallery`, `contact_messages`.

## 6. Verifikasi Koneksi

Jalankan:

```bash
npm run supabase:check
```

Jika semua baris bertanda `✓`, jalankan:

```bash
npm run dev
```

Buka:

- publik: `http://localhost:3000`
- admin: `http://localhost:3000/admin/login`

## Troubleshooting

Jika admin selalu kembali ke login:

- pastikan `.env.local` sudah benar
- restart dev server setelah mengubah env
- pastikan user admin sudah dibuat di Supabase Auth

Jika upload gambar gagal:

- pastikan bucket `desa-karoya` ada
- pastikan policy Storage dari `schema.sql` sudah berhasil dibuat
- pastikan admin sudah login

Jika data publik tampil fallback:

- `schema.sql` belum dijalankan, atau
- `.env.local` belum terisi, atau
- RLS policy belum dibuat dengan benar
