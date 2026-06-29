# Dokumentasi Frontend

## Struktur Halaman

### Halaman Publik

| Route | Komponen | Fungsi |
|-------|----------|--------|
| `/` | `HomePageClient` | Homepage dengan hero, statistik, layanan |
| `/profil` | `ProfilePageClient` | Profil desa & struktur pemerintah |
| `/berita` | `NewsPageClient` | Daftar berita & pengumuman |
| `/berita/[slug]` | `NewsDetailClient` | Detail berita |
| `/layanan` | `ServicesPageClient` | Daftar layanan desa |
| `/kontak` | `ContactPageClient` | Form & riwayat pesan |
| `/lacak` | `ServiceTracker` | Lacak pengajuan surat |
| `/galeri` | `GalleryPageClient` | Galeri foto |
| `/umkm` | `UMKMPageClient` | Daftar UMKM |
| `/umkm/[slug]` | `TemplateA/B/C` | Detail UMKM (3 template |

### Halaman Admin

| Route | Komponen | Fungsi |
|-------|----------|--------|
| `/admin` | Dashboard | Overview & statistik |
| `/admin/beranda` | `HomeEditor` | Edit hero & statistik |
| `/admin/profil` | `ProfileEditor` | Edit profil & struktur |
| `/admin/berita` | `PostManager` | CRUD berita |
| `/admin/layanan` | `ServiceManager` | CRUD layanan |
| `/admin/layanan` | `RequestManager` | Kelola pengajuan |
| `/admin/galeri` | `GalleryManager` | Upload foto |
| `/admin/kontak` | `ContactManager` | Kelola pesan |
| `/admin/umkm` | `UMKMManager` | CRUD UMKM |
| `/admin/pengaturan` | `SettingsEditor` | Pengaturan umum |

## Komponen UI

### Komponen Publik
```
components/public/
├── hero-section.tsx           # Hero banner homepage
├── section-heading.tsx         # Judul section
├── news-card.tsx              # Card berita
├── service-card.tsx           # Card layanan
├── gallery-card.tsx          # Card galeri
├── umkm-card.tsx             # Card UMKM
├── umkm-template-a.tsx       # Template A (Elegant)
├── umkm-template-b.tsx       # Template B (Modern)
├── umkm-template-c.tsx       # Template C (Minimal)
├── contact-form.tsx          # Form kirim pesan
├── contact-history.tsx       # Riwayat pesan
├── service-request-form.tsx  # Form pengajuan surat
├── service-tracker.tsx       # Lacak pengajuan
└── government-structure.tsx    # Struktur pemerintah
```

### Komponen Admin
```
components/admin/
├── data-table.tsx           # Tabel generic dengan sorting
├── confirm-delete-dialog.tsx # Dialog konfirmasi hapus
├── home-editor.tsx          # Editor homepage
├── profile-editor.tsx       # Editor profil
├── government-editor.tsx    # Editor struktur pemerintah
├── post-manager.tsx         # CRUD berita
├── service-manager.tsx      # CRUD layanan
├── gallery-manager.tsx      # CRUD galeri
├── contact-manager.tsx      # Kelola pesan
├── request-manager.tsx      # Kelola pengajuan
├── umkm-manager.tsx         # CRUD UMKM
├── settings-editor.tsx       # Pengaturan
└── realtime-preview.tsx     # Preview real-time
```

## Hooks Real-time

```typescript
// useRealtimeList - Untuk daftar data
const data = useRealtimeList('table_name', initialData, {
  predicate: (row) => row.status === 'published',
  sort: (a, b) => new Date(b.created_at) - new Date(a.created_at)
});

// useRealtimeRecord - Untuk satu record
const settings = useRealtimeRecord('village_settings', initialSettings);
```

## Styling

- **Tailwind CSS** - Utility-first CSS
- **Custom Colors:**
  - `#1B4332` - Primary (Hijau tua)
  - `#40916C` - Secondary (Hijau)
  - `#D4AF37` - Accent (Gold)
  - `#25D366` - WhatsApp green

## Font

- **Heading:** Playfair Display (serif)
- **Body:** Plus Jakarta Sans

## Responsif

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
