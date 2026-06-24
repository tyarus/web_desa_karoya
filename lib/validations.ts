import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || z.url().safeParse(value).success,
    "Masukkan URL yang valid.",
  );

const optionalText = z
  .string()
  .trim()
  .optional();

function hasValidJson(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function hasMaxWords(value: string, max: number) {
  return value.trim().split(/\s+/).filter(Boolean).length <= max;
}

export const loginSchema = z.object({
  email: z.email("Masukkan email admin yang valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export const homeSchema = z.object({
  hero_title: z.string().trim().min(3, "Judul hero wajib diisi."),
  hero_subtitle: z
    .string()
    .trim()
    .min(20, "Deskripsi hero minimal 20 karakter."),
  hero_image_url: optionalUrl,
  hero_cta_label: optionalText,
  hero_cta_href: z.string().trim().default("/layanan"),
  stats_json: z.string().refine(hasValidJson, "Statistik harus berupa JSON."),
  featured_services_json: z
    .string()
    .refine(hasValidJson, "Layanan unggulan harus berupa JSON."),
});

export const profileSchema = z.object({
  history: z.string().trim().min(30, "Sejarah minimal 30 karakter."),
  vision: z.string().trim().min(20, "Visi minimal 20 karakter."),
  missions_text: z.string().trim().min(10, "Misi wajib diisi."),
  government_structure_json: z
    .string()
    .refine(hasValidJson, "Struktur harus berupa JSON."),
});

export const postSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(3, "Judul wajib diisi.")
    .refine((value) => hasMaxWords(value, 10), "Judul maksimal 10 kata.")
    .refine((value) => !value.includes("!"), "Judul tidak memakai tanda seru."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(20, "Ringkasan minimal 20 karakter."),
  content: z.string().trim().min(60, "Konten minimal 60 karakter."),
  category: z.enum(["berita", "pengumuman"]),
  status: z.enum(["draft", "published"]),
  cover_url: optionalUrl,
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Nama layanan wajib diisi."),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(20, "Deskripsi minimal 20 karakter."),
  requirements_text: z.string().trim().min(3, "Syarat wajib diisi."),
  flow_text: z.string().trim().min(3, "Alur wajib diisi."),
  contact: optionalText,
  is_featured: z.boolean().default(false),
});

export const serviceRequestSchema = z.object({
  service_type: z.string().trim().min(3, "Pilih jenis layanan."),
  resident_name: z.string().trim().min(3, "Nama wajib diisi."),
  nik: z
    .string()
    .trim()
    .regex(/^\d{16}$/, "NIK harus 16 digit angka."),
  phone: z.string().trim().min(8, "Nomor kontak wajib diisi."),
  address: z.string().trim().min(10, "Alamat wajib diisi."),
  notes: optionalText,
});

export const requestStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["masuk", "diproses", "selesai", "ditolak"]),
});

export const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Judul foto wajib diisi."),
  description: optionalText,
  image_url: optionalUrl,
});

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Nama wajib diisi."),
  email: z.email("Email tidak valid.").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(15, "Pesan minimal 15 karakter."),
});

export const contactReplySchema = z.object({
  id: z.string().min(1),
  reply: z.string().trim().min(10, "Balasan minimal 10 karakter."),
  status: z.enum(["baru", "dibalas", "diarsipkan"]),
});

export const settingsSchema = z.object({
  village_name: z.string().trim().min(3, "Nama desa wajib diisi."),
  district: z.string().trim().min(3, "Kecamatan wajib diisi."),
  regency: optionalText,
  province: optionalText,
  address: optionalText,
  phone: optionalText,
  email: z.email("Email tidak valid.").optional().or(z.literal("")),
  whatsapp: optionalText,
  map_url: optionalUrl,
  logo_url: optionalUrl,
});

export type LoginInput = z.input<typeof loginSchema>;
export type HomeInput = z.input<typeof homeSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
export type PostInput = z.input<typeof postSchema>;
export type ServiceInput = z.input<typeof serviceSchema>;
export type ServiceRequestInput = z.input<typeof serviceRequestSchema>;
export type RequestStatusInput = z.input<typeof requestStatusSchema>;
export type GalleryInput = z.input<typeof gallerySchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContactReplyInput = z.input<typeof contactReplySchema>;
export type SettingsInput = z.input<typeof settingsSchema>;
