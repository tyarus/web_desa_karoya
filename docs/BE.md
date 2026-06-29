# Dokumentasi Backend (API)

## Endpoint API

### Upload Photo
```
POST /api/upload-photo
```

Upload gambar ke Supabase Storage.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: File gambar
- `prefix`: Folder path (contoh: `umkm`, `posts`, `gallery`)

**Response:**
```json
{
  "url": "https://storage.supabase.co/bucket/path/image.jpg"
}
```

---

### Lacak Pengajuan Surat
```
GET /api/service-track?name={nama}
```

Mencari pengajuan surat berdasarkan nama pemohon.

**Query Parameters:**
- `name` (optional): Nama pemohon untuk filter

**Response:**
```json
{
  "ok": true,
  "requests": [
    {
      "id": "uuid",
      "resident_name": "Nama Pemohon",
      "service_type": "Surat Keterangan",
      "status": "masuk|diproses|selesai|ditolak",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxx
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=desa-karoya
```

---

## Dependencies Utama

- `@supabase/ssr` - Supabase client untuk Next.js
- `zod` - Schema validation
- `@hookform/resolvers` - React Hook Form integration dengan Zod
- `sonner` - Toast notifications

## Struktur File

```
app/
├── admin/actions/          # Server Actions untuk admin
│   ├── auth.ts            # Login/logout
│   ├── contact.ts        # Update status pesan
│   ├── gallery.ts         # CRUD gallery
│   ├── home.ts           # Edit homepage
│   ├── posts.ts          # CRUD berita
│   ├── profile.ts        # Edit profil
│   ├── requests.ts       # Update status pengajuan
│   ├── services.ts       # CRUD layanan
│   ├── settings.ts       # Update settings
│   └── umkm.ts          # CRUD UMKM
├── (public)/kontak/
│   └── actions.ts        # Kirim pesan kontak
└── (public)/layanan/
    └── actions.ts        # Submit pengajuan surat
```
