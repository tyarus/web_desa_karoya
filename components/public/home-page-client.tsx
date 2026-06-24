"use client";

import Link from "next/link";
import { ArrowRight, Camera, FileText, Newspaper } from "lucide-react";

import { HeroSection } from "@/components/public/hero-section";
import { GalleryCard } from "@/components/public/gallery-card";
import { NewsCard } from "@/components/public/news-card";
import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { Button } from "@/components/ui/button";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import type { SiteData } from "@/lib/data/public";

export function HomePageClient({ data }: { data: SiteData }) {
  const settings = useRealtimeRecord("village_settings", data.settings);
  const home = useRealtimeRecord("home_sections", data.home);
  const posts = useRealtimeList("posts", data.posts, {
    predicate: (post) => post.status === "published",
    sort: (a, b) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime(),
  });
  const services = useRealtimeList("services", data.services);
  const gallery = useRealtimeList("gallery", data.gallery, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });

  return (
    <>
      <HeroSection home={home} settings={settings} />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Kabar Desa"
            title="Berita dan pengumuman terbaru"
            description="Informasi kegiatan, jadwal layanan, dan pengumuman resmi Desa Karoya."
          />
          <Button asChild variant="outline">
            <Link href="/berita">
              <Newspaper className="size-4" />
              Semua Berita
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Layanan"
              title="Layanan warga yang sering digunakan"
              description="Pilih layanan, siapkan persyaratan, lalu ajukan kebutuhan administrasi Anda."
            />
            <Button asChild>
              <Link href="/layanan">
                <FileText className="size-4" />
                Ajukan Layanan
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services
              .filter((service) => service.is_featured)
              .slice(0, 3)
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Galeri"
            title="Dokumentasi kegiatan desa"
            description="Foto kegiatan dan suasana Desa Karoya yang dapat diperbarui langsung dari admin."
          />
          <Button asChild variant="outline">
            <Link href="/galeri">
              <Camera className="size-4" />
              Lihat Galeri
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {gallery.slice(0, 3).map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="bg-[#1B4332] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold">
              Perlu bantuan layanan desa?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">
              Hubungi kantor desa atau kirim pesan melalui halaman kontak.
              Petugas akan menindaklanjuti sesuai jam pelayanan.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/kontak">
              Hubungi Desa
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
