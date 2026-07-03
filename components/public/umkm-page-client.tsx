"use client";

import { Store } from "lucide-react";
import { UMKMCard } from "@/components/public/umkm-card";
import { SectionHeading } from "@/components/public/section-heading";
import type { Tables } from "@/lib/database.types";

interface UMKMPageClientProps {
  umkms: Tables<"umkm">[];
}

export function UMKMPageClient({ umkms }: UMKMPageClientProps) {
  // Filter: hanya tampilkan yang published atau active
  const filteredUMKMs = umkms.filter(
    umkm => umkm.status === "published" || umkm.status === "active"
  ).sort((a, b) =>
    new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="UMKM"
        title="UMKM Desa Karoya"
        description="Produk dan layanan dari Usaha Mikro, Kecil, dan Menengah warga desa."
      />
      {filteredUMKMs.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1B4332]/10">
            <Store className="h-10 w-10 text-[#1B4332]/40" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-zinc-800">
            Belum Ada UMKM
          </h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Saat ini belum ada UMKM yang terdaftar. Segera hadir untuk mendukung produk lokal Desa Karoya.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUMKMs.map((umkm) => (
            <UMKMCard key={umkm.id} umkm={umkm} />
          ))}
        </div>
      )}
    </main>
  );
}
