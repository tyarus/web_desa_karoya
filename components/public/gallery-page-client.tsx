"use client";

import { GalleryCard } from "@/components/public/gallery-card";
import { SectionHeading } from "@/components/public/section-heading";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";

export function GalleryPageClient({ gallery }: { gallery: Tables<"gallery">[] }) {
  const liveGallery = useRealtimeList("gallery", gallery, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Galeri"
        title="Galeri foto Desa Karoya"
        description="Dokumentasi kegiatan desa, pelayanan warga, dan suasana lingkungan."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {liveGallery.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
