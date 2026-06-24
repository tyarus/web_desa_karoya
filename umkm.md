Tolong bantu saya merevisi fitur UMKM. Ada dua bagian yang perlu dikerjakan:

---

## BAGIAN 1 — PUBLIC PAGE /umkm

Buat halaman publik UMKM yang UI-nya konsisten dengan halaman /berita dan /galeri 
yang sudah ada. Ikuti pola layout, card style, typography, spacing, dan filter/search 
yang sama persis dengan kedua halaman tersebut. Halaman ini menampilkan daftar UMKM 
dalam bentuk card grid, masing-masing card menampilkan:
- Icon/foto UMKM
- Nama UMKM
- Deskripsi singkat
- Tombol "Lihat Detail" yang mengarah ke halaman detail /umkm/[slug]

Halaman detail /umkm/[slug] merender template yang dipilih oleh admin 
(lihat Bagian 2) dengan data yang sudah diisi, dalam mode read-only untuk pengunjung.

---

## BAGIAN 2 — ADMIN PANEL /admin/umkm

Buat flow multi-step untuk admin menambah/mengedit UMKM. 
Gunakan stepper UI (Step 1 → 2 → 3 → 4) dengan tombol Prev/Next.

### STEP 1 — Identitas UMKM
Form input:
- Nama UMKM (text input) → digunakan sebagai icon label pada menu publik
- Upload foto/logo UMKM
- Deskripsi singkat (textarea, maks 160 karakter)

### STEP 2 — Pilih Template
Tampilkan grid pilihan template. Tersedia 3 template dengan karakteristik berbeda:

**Template A — "Klasik Elegan"**
- Layout: single column, teks besar di kiri, foto di kanan (hero section)
- Font heading: serif (misalnya Playfair Display atau Lora)
- Font body: Inter
- Jumlah gambar: 1 hero image + maks 3 gambar produk
- Accent color: gold/amber

**Template B — "Modern Grid"**
- Layout: masonry/grid, foto dominan
- Font heading: Plus Jakarta Sans Bold
- Font body: Plus Jakarta Sans
- Jumlah gambar: maks 8 gambar (gallery style)
- Accent color: sesuai palette desa (green/orange)

**Template C — "Minimalis Clean"**
- Layout: full-width banner tipis, konten terpusat
- Font heading: Inter ExtraBold
- Font body: Inter Light
- Jumlah gambar: 1 banner + maks 4 gambar produk
- Accent color: monochrome dengan satu accent color pilihan admin

Setiap template punya card preview berupa thumbnail visual yang menggambarkan 
layout-nya (bisa pakai ilustrasi SVG sederhana atau screenshot mockup).

Setelah memilih template, tampilkan **live preview** di panel kanan/bawah 
yang terupdate real-time saat admin mengisi data di step berikutnya. 
Preview harus menyerupai tampilan akhir di halaman publik.

### STEP 3 — Input Produk UMKM
Form untuk menambah produk. Setiap produk punya:
- Nama produk (text)
- Deskripsi produk (textarea)
- Harga (number input, format Rupiah)
- Upload gambar produk (jumlah maks gambar mengikuti batas template yang dipilih)

Bisa tambah multiple produk (tombol "+ Tambah Produk"), bisa hapus produk.
Tampilkan produk yang sudah diinput dalam bentuk list/card kecil di bawah form.

### STEP 4 — Kontak UMKM
Form input kontak yang bisa dihubungi:
- Nomor WhatsApp (dengan validasi format +62)
- Instagram handle (opsional)
- Facebook page (opsional)
- Alamat lengkap (textarea)
- Google Maps embed URL atau koordinat (opsional)

---

## DATABASE — Supabase Tables

Buat migration SQL untuk tabel-tabel berikut:

```sql
-- Tabel utama UMKM
umkm (
  id uuid primary key,
  nama text not null,
  slug text unique not null,
  foto_url text,
  deskripsi_singkat text,
  template_id text check (template_id in ('A', 'B', 'C')),
  template_config jsonb,     -- custom config per template (accent color, dll)
  kontak jsonb,              -- {whatsapp, instagram, facebook, alamat, maps_url}
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

-- Tabel produk UMKM
umkm_produk (
  id uuid primary key,
  umkm_id uuid references umkm(id) on delete cascade,
  nama text not null,
  deskripsi text,
  harga numeric,
  gambar_urls text[],        -- array URL gambar produk
  urutan int,
  created_at timestamptz default now()
)
```

Aktifkan RLS. Public bisa SELECT umkm dan umkm_produk yang is_published = true. 
Hanya authenticated admin yang bisa INSERT/UPDATE/DELETE.

---

## CATATAN TEKNIS

- Gunakan Next.js 14 App Router dengan server components untuk public page
- Gunakan client components untuk admin form + live preview
- Upload gambar ke Supabase Storage bucket 'umkm-assets'
- Slug di-generate otomatis dari nama UMKM (lowercase, spasi → tanda hubung)
- Live preview di admin menggunakan komponen yang sama dengan yang dirender 
  di halaman publik, hanya dibungkus dengan scale transform agar muat di panel preview
- Format harga menggunakan Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'})
- Semua komponen menggunakan shadcn/ui sebagai base, dikustomisasi sesuai design system desa
- Gunakan react-hook-form + zod untuk validasi semua form
- Tambahkan loading skeleton yang konsisten dengan halaman berita dan galeri

Mulai dari struktur folder dan file yang perlu dibuat/dimodifikasi, 
lalu kerjakan satu per satu dimulai dari database migration, 
kemudian komponen template, lalu admin flow, dan terakhir public page.