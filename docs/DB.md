# Dokumentasi Database (Supabase)

## Schema

### Tabel: village_settings

Pengaturan umum desa.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| village_name | text | Nama desa |
| district | text | Nama kecamatan |
| regency | text | Kabupaten |
| province | text | Provinsi |
| address | text | Alamat lengkap |
| phone | text | Nomor telepon |
| email | text | Email |
| whatsapp | text | Nomor WhatsApp |
| map_url | text | URL Google Maps embed |
| logo_url | text | URL logo desa |
| updated_at | timestamp | Waktu update |

### Tabel: home_sections

Konten homepage.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| hero_title | text | Judul hero |
| hero_subtitle | text | Subtitle hero |
| hero_image_url | text | Gambar hero |
| hero_cta_label | text | Label tombol CTA |
| hero_cta_href | text | Link CTA |
| stats | jsonb | Data statistik |
| featured_services | jsonb | Layanan featured |
| updated_at | timestamp | Waktu update |

### Tabel: profiles

Profil & sejarah desa.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| history | text | Sejarah desa |
| vision | text | Visi |
| missions | text[] | Array misi |
| government_structure | jsonb | Struktur pemerintah |
| updated_at | timestamp | Waktu update |

### Tabel: posts

Berita & pengumuman.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| title | text | Judul |
| slug | text | URL slug |
| excerpt | text | Ringkasan |
| content | text | Isi lengkap |
| category | enum | berita/pengumuman |
| status | enum | draft/published |
| cover_url | text | Gambar cover |
| published_at | timestamp | Tanggal publish |
| created_at | timestamp | Waktu buat |
| updated_at | timestamp | Waktu update |

### Tabel: services

Layanan desa.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| title | text | Judul layanan |
| slug | text | URL slug |
| description | text | Deskripsi |
| requirements | text[] | Persyaratan |
| flow | text[] | Alur layanan |
| contact | text | Kontak |
| is_featured | boolean | Featured di homepage |
| created_at | timestamp | Waktu buat |
| updated_at | timestamp | Waktu update |

### Tabel: service_requests

Pengajuan surat layanan.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| service_type | text | Jenis layanan |
| resident_name | text | Nama pemohon |
| nik | text | NIK |
| phone | text | No. HP |
| address | text | Alamat |
| notes | text | Catatan |
| status | enum | masuk/diproses/selesai/ditolak |
| created_at | timestamp | Waktu ajuan |
| updated_at | timestamp | Waktu update |

### Tabel: gallery

Galeri foto.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| title | text | Judul foto |
| image_url | text | URL gambar |
| description | text | Deskripsi |
| created_at | timestamp | Waktu upload |

### Tabel: contact_messages

Pesan kontak.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| name | text | Nama pengirim |
| email | text | Email |
| phone | text | No. HP |
| message | text | Isi pesan |
| reply | text | Jawaban admin |
| status | enum | baru/dibalas/diarsipkan |
| created_at | timestamp | Waktu kirim |
| replied_at | timestamp | Waktu jawab |

### Tabel: umkm

Daftar UMKM.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| name | text | Nama UMKM |
| slug | text | URL slug |
| description | text | Deskripsi |
| owner_name | text | Nama pemilik |
| cover_url | text | Foto/logo |
| phone | text | No. HP |
| whatsapp | text | WhatsApp |
| email | text | Email |
| instagram | text | Instagram |
| facebook | text | Facebook |
| address | text | Alamat |
| maps_url | text | Google Maps |
| template_id | text | A/B/C |
| accent_color | text | Warna aksen |
| status | text | draft/published |
| created_at | timestamp | Waktu daftar |
| updated_at | timestamp | Waktu update |

### Tabel: umkm_products

Produk UMKM.

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | uuid | Primary key |
| umkm_id | uuid | Foreign key ke umkm |
| name | text | Nama produk |
| description | text | Deskripsi |
| price | text | Harga |
| image_url | text | Foto produk |
| created_at | timestamp | Waktu tambah |
| updated_at | timestamp | Waktu update |

---

## Enums

```sql
-- post_category
'berita', 'pengumuman'

-- post_status
'draft', 'published'

-- request_status
'masuk', 'diproses', 'selesai', 'ditolak'

-- message_status
'baru', 'dibalas', 'diarsipkan'
```

---

## RLS (Row Level Security)

### Kebijakan Umum

| Tabel | Select | Insert | Update | Delete |
|-------|--------|--------|--------|--------|
| village_settings | Public | Admin | Admin | Admin |
| home_sections | Public | Admin | Admin | Admin |
| profiles | Public | Admin | Admin | Admin |
| posts | Public | Admin | Admin | Admin |
| services | Public | Admin | Admin | Admin |
| service_requests | Public | Public | Admin | Admin |
| gallery | Public | Admin | Admin | Admin |
| contact_messages | Public | Public | Admin | Admin |
| umkm | Public | Admin | Admin | Admin |
| umkm_products | Public | Admin | Admin | Admin |

---

## Storage

Bucket: `desa-karoya`

Folder:
- `/posts` - Gambar berita
- `/gallery` - Foto galeri
- `/umkm` - Cover & foto UMKM
- `/umkm/products` - Foto produk
- `/village` - Logo & asset umum

---

## Setup Awal

1. Buat project Supabase
2. Run migration di `supabase/migrations/`
3. Buat bucket `desa-karoya` dengan public access
4. Set RLS policies sesuai tabel di atas
5. Isi `village_settings` dengan data desa
6. Isi template profil default
