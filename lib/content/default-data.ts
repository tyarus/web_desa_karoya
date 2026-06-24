import type { Json, Tables } from "@/lib/database.types";

export type StatItem = {
  label: string;
  value: string;
  helper: string;
};

export type FeaturedServiceItem = {
  title: string;
  description: string;
  href: string;
};

export type GovernmentMember = {
  name: string;
  role: string;
  area: string;
};

export const defaultStats: StatItem[] = [
  {
    label: "Jumlah RT",
    value: "18",
    helper: "Tersebar di wilayah Desa Karoya",
  },
  {
    label: "Jumlah RW",
    value: "6",
    helper: "Menjadi penghubung layanan warga",
  },
  {
    label: "Layanan aktif",
    value: "8",
    helper: "Administrasi desa dan surat warga",
  },
  {
    label: "Agenda desa",
    value: "12",
    helper: "Kegiatan warga sepanjang tahun",
  },
];

export const defaultFeaturedServices: FeaturedServiceItem[] = [
  {
    title: "Surat Domisili",
    description: "Pengajuan keterangan domisili untuk kebutuhan administrasi.",
    href: "/layanan",
  },
  {
    title: "Surat Usaha",
    description: "Pendataan dan penerbitan keterangan usaha warga.",
    href: "/layanan",
  },
  {
    title: "Pengantar SKCK",
    description: "Pengantar dari desa untuk proses administrasi kepolisian.",
    href: "/layanan",
  },
];

export const defaultSettings: Tables<"village_settings"> = {
  id: "default",
  village_name: "Desa Karoya",
  district: "Tegalwaru",
  regency: "Kabupaten Karawang",
  province: "Jawa Barat",
  address: "Kantor Desa Karoya, Kecamatan Tegalwaru",
  phone: "0267-000000",
  email: "pemdes@desa-karoya.id",
  whatsapp: "6281200000000",
  map_url: "https://maps.google.com/?q=Desa+Karoya+Tegalwaru",
  logo_url: null,
  updated_at: new Date().toISOString(),
};

export const defaultHome: Tables<"home_sections"> = {
  id: "default",
  hero_title: "Desa Karoya",
  hero_subtitle:
    "Pusat informasi resmi Desa Karoya, Kecamatan Tegalwaru, untuk layanan warga, kabar desa, dan dokumentasi kegiatan.",
  hero_image_url:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  hero_cta_label: "Lihat Layanan",
  hero_cta_href: "/layanan",
  stats: defaultStats as unknown as Json,
  featured_services: defaultFeaturedServices as unknown as Json,
  updated_at: new Date().toISOString(),
};

export const defaultGovernment: GovernmentMember[] = [
  {
    name: "Kepala Desa",
    role: "Kepala Desa Karoya",
    area: "Pemerintahan desa",
  },
  {
    name: "Sekretaris Desa",
    role: "Sekretaris Desa",
    area: "Administrasi dan tata usaha",
  },
  {
    name: "Kaur Pelayanan",
    role: "Kaur Pelayanan",
    area: "Layanan warga",
  },
  {
    name: "Kasi Pemerintahan",
    role: "Kasi Pemerintahan",
    area: "Data penduduk dan kewilayahan",
  },
];

export const defaultProfile: Tables<"profiles"> = {
  id: "default",
  history:
    "Desa Karoya tumbuh sebagai ruang hidup warga Tegalwaru yang dekat dengan kegiatan pertanian, usaha keluarga, dan gotong royong. Website ini disiapkan untuk membantu warga mengakses informasi desa secara lebih cepat. Data sejarah dapat diperbarui oleh pemerintah desa melalui panel admin.",
  vision:
    "Mewujudkan Desa Karoya yang tertib administrasi, terbuka dalam informasi, dan dekat dengan kebutuhan warga.",
  missions: [
    "Memperkuat layanan administrasi desa yang mudah diakses.",
    "Menyajikan informasi kegiatan, pengumuman, dan program desa secara berkala.",
    "Mendorong partisipasi warga dalam pembangunan dan pelayanan publik.",
    "Menjaga dokumentasi kegiatan desa agar mudah ditemukan kembali.",
  ],
  government_structure: defaultGovernment as unknown as Json,
  updated_at: new Date().toISOString(),
};

export const defaultPosts: Tables<"posts">[] = [
  {
    id: "post-1",
    title: "Jadwal Pelayanan Administrasi Desa",
    slug: "jadwal-pelayanan-administrasi-desa",
    excerpt:
      "Kantor desa membuka pelayanan administrasi warga pada hari kerja. Warga dapat menyiapkan berkas sesuai jenis layanan.",
    content:
      "Pelayanan administrasi Desa Karoya dibuka pada hari Senin sampai Jumat mulai pukul 08.00 sampai 15.00 WIB.\n\nWarga yang membutuhkan surat pengantar, keterangan domisili, atau surat usaha dapat datang ke kantor desa dengan membawa identitas diri. Informasi persyaratan juga tersedia pada halaman layanan.\n\nPemerintah desa akan memperbarui jadwal apabila ada kegiatan lapangan atau agenda kecamatan.",
    category: "pengumuman",
    status: "published",
    cover_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "post-2",
    title: "Kerja Bakti Lingkungan Minggu Ini",
    slug: "kerja-bakti-lingkungan-minggu-ini",
    excerpt:
      "Warga diajak mengikuti kerja bakti lingkungan di wilayah masing-masing RW pada akhir pekan.",
    content:
      "Pemerintah Desa Karoya mengajak warga mengikuti kerja bakti lingkungan pada akhir pekan ini.\n\nKegiatan difokuskan pada pembersihan saluran air, area jalan lingkungan, dan titik kumpul warga. Ketua RT dan RW akan mengatur pembagian lokasi.\n\nWarga dapat membawa alat kebersihan dari rumah agar kegiatan berjalan lancar.",
    category: "berita",
    status: "published",
    cover_url:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultServices: Tables<"services">[] = [
  {
    id: "service-1",
    title: "Surat Keterangan Domisili",
    slug: "surat-keterangan-domisili",
    description:
      "Layanan untuk warga yang memerlukan keterangan domisili dari pemerintah desa.",
    requirements: ["Fotokopi KTP", "Fotokopi KK", "Pengantar RT/RW"],
    flow: [
      "Warga mengisi formulir pengajuan.",
      "Petugas memeriksa berkas.",
      "Surat diproses dan ditandatangani.",
    ],
    contact: "Kaur Pelayanan",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-2",
    title: "Surat Keterangan Usaha",
    slug: "surat-keterangan-usaha",
    description:
      "Keterangan usaha untuk warga yang menjalankan usaha mikro atau kegiatan ekonomi lokal.",
    requirements: ["Fotokopi KTP", "Fotokopi KK", "Foto tempat usaha"],
    flow: [
      "Warga menyampaikan data usaha.",
      "Petugas melakukan verifikasi sederhana.",
      "Surat diterbitkan sesuai data.",
    ],
    contact: "Kaur Umum",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-3",
    title: "Pengantar SKCK",
    slug: "pengantar-skck",
    description:
      "Surat pengantar dari desa untuk keperluan pengurusan SKCK di kepolisian.",
    requirements: ["Fotokopi KTP", "Fotokopi KK", "Pas foto terbaru"],
    flow: [
      "Warga membawa berkas ke kantor desa.",
      "Petugas memeriksa data identitas.",
      "Surat pengantar diberikan kepada warga.",
    ],
    contact: "Kasi Pemerintahan",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultGallery: Tables<"gallery">[] = [
  {
    id: "gallery-1",
    title: "Kegiatan Pelayanan Warga",
    description: "Dokumentasi layanan administrasi di kantor desa.",
    image_url:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "gallery-2",
    title: "Ruang Pertemuan Desa",
    description: "Kegiatan koordinasi perangkat desa dan warga.",
    image_url:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString(),
  },
  {
    id: "gallery-3",
    title: "Lingkungan Desa",
    description: "Suasana lingkungan desa dan kegiatan warga.",
    image_url:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80",
    created_at: new Date().toISOString(),
  },
];

export const defaultServiceRequests: Tables<"service_requests">[] = [];

export const defaultMessages: Tables<"contact_messages">[] = [];
