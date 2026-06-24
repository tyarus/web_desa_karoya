# Rencana Implementasi Fitur UMKM

## Analisis Status Saat Ini

### ✅ Sudah Ada
- Database migrations (`supabase/migrations/`) untuk tabel umkm
- Admin page `/admin/umkm/page.tsx`
- Admin actions `app/admin/actions/umkm.ts`
- Public pages: `/umkm/page.tsx` dan `/umkm/[slug]/page.tsx`
- Components: `umkm-card.tsx`, `umkm-page-client.tsx`, `umkm-manager.tsx`, `template-preview.tsx`

### ❌ Perlu Diperbaiki
1. **Admin Panel**: Single-form → Multi-step (4 steps)
2. **Template System**: Template saat ini (`modern`, `vibrant`, `elegant`, `market`) ≠ spesifikasi (A, B, C)
3. **Public Page**: Belum konsisten dengan `/berita` dan `/galeri`
4. **Detail Page**: Belum render template sesuai pilihan admin
5. **Database Types**: `lib/database.types.ts` belum termasuk `umkm` dan `umkm_produk`

---

## Tahap 1: Update Database Types

**File:** `lib/database.types.ts`

Tambahkan type untuk tabel `umkm` dan `umkm_produk` sesuai schema yang sudah ada di migrations.

---

## Tahap 2: Redesain Admin Panel (Multi-Step Form)

**Files:**
- `components/admin/umkm-manager.tsx` — Refactor entire component
- `components/admin/umkm-stepper.tsx` — New stepper UI component
- `components/admin/umkm-step-identity.tsx` — Step 1: Identity
- `components/admin/umkm-step-template.tsx` — Step 2: Template Selection
- `components/admin/umkm-step-products.tsx` — Step 3: Products
- `components/admin/umkm-step-contact.tsx` — Step 4: Contact
- `components/admin/umkm-preview.tsx` — Live preview component

**Stepper UI:**
```
┌─────────────────────────────────────────┐
│  ① Identitas    ② Template    ③ Produk    ④ Kontak  │
│  ────●──────────────●─────────────●─────────○        │
└─────────────────────────────────────────┘
```

**Step 1 - Identitas:**
- Nama UMKM (text)
- Upload foto/logo
- Deskripsi singkat (max 160 chars)

**Step 2 - Template:**
- Template A: "Klasik Elegan" - gold accent, serif fonts, single column
- Template B: "Modern Grid" - green/orange, masonry layout
- Template C: "Minimalis Clean" - monochrome, centered content
- Card preview dengan visual layout
- Live preview panel

**Step 3 - Produk:**
- Form: nama, deskripsi, harga (IDR), gambar
- Multiple products dengan + button
- List/card preview produk
- Batas jumlah gambar sesuai template

**Step 4 - Kontak:**
- WhatsApp (validasi +62)
- Instagram (opsional)
- Facebook (opsional)
- Alamat lengkap
- Google Maps URL (opsional)

---

## Tahap 3: Template Components untuk Public Page

**Files:**
- `components/public/umkm-template-a.tsx` — Klasik Elegan
- `components/public/umkm-template-b.tsx` — Modern Grid
- `components/public/umkm-template-c.tsx` — Minimalis Clean

### Template A — "Klasik Elegan"
- Hero section: teks kiri, foto kanan
- Font: Playfair Display (headings), Inter (body)
- Accent: gold/amber (#D4AF37)
- Max 1 hero + 3 produk images

### Template B — "Modern Grid"
- Masonry/grid layout, foto dominan
- Font: Plus Jakarta Sans
- Accent: green (#1B4332) + orange
- Gallery style, max 8 images

### Template C — "Minimalis Clean"
- Full-width thin banner, centered content
- Font: Inter ExtraBold (headings), Inter Light (body)
- Monochrome + 1 accent color pilihan admin
- Max 1 banner + 4 produk images

---

## Tahap 4: Update Public Pages

**Files:**
- `app/(public)/umkm/page.tsx` — Update untuk konsistensi
- `app/(public)/umkm/[slug]/page.tsx` — Dynamic template rendering
- `components/public/umkm-page-client.tsx` — Update styling
- `components/public/umkm-card.tsx` — Update styling

**Konsistensi dengan /berita:**
- Gunakan `SectionHeading` component
- Grid layout 3 kolom responsive
- Card style dengan hover effect
- Loading skeleton saat data loading

---

## Tahap 5: Update Server Actions

**File:** `app/admin/actions/umkm.ts`

Update schema dan validasi untuk:
- Template A, B, C
- kontak JSON structure
- template_config JSON structure

---

## File yang Perlu Dimodifikasi/Dibuat

### Buat Baru
```
components/admin/umkm-stepper.tsx
components/admin/umkm-step-identity.tsx
components/admin/umkm-step-template.tsx
components/admin/umkm-step-products.tsx
components/admin/umkm-step-contact.tsx
components/admin/umkm-preview.tsx
components/public/umkm-template-a.tsx
components/public/umkm-template-b.tsx
components/public/umkm-template-c.tsx
```

### Modifikasi
```
lib/database.types.ts
components/admin/umkm-manager.tsx
app/admin/actions/umkm.ts
app/(public)/umkm/page.tsx
app/(public)/umkm/[slug]/page.tsx
components/public/umkm-page-client.tsx
components/public/umkm-card.tsx
```

---

## Urutan Implementasi

1. **Database Types** — Update `lib/database.types.ts`
2. **Stepper Component** — Buat UI stepper dasar
3. **Step 1 - Identity** — Form identitas
4. **Step 2 - Template** — Template selection dengan preview
5. **Step 3 - Products** — Product form dengan multiple entries
6. **Step 4 - Contact** — Contact form
7. **Preview Component** — Live preview yang update per step
8. **Template Components** — A, B, C untuk public page
9. **Public Page Update** — Konsistensi styling
10. **Detail Page Update** — Dynamic template rendering
11. **Server Actions** — Update untuk schema baru
12. **Testing & Polish** — Loading states, error handling

---

## Estimasi Effort

- Tahap 1 (Database): ~30 menit
- Tahap 2 (Admin): ~4 jam
- Tahap 3 (Templates): ~3 jam
- Tahap 4 (Public): ~2 jam
- Tahap 5 (Actions): ~1 jam
- **Total**: ~10-12 jam
