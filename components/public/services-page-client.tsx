"use client";

import { SectionHeading } from "@/components/public/section-heading";
import { ServiceCard } from "@/components/public/service-card";
import { ServiceRequestForm } from "@/components/public/service-request-form";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";

export function ServicesPageClient({
  services,
}: {
  services: Tables<"services">[];
}) {
  const liveServices = useRealtimeList("services", services);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
      <div>
        <SectionHeading
          eyebrow="Layanan Warga"
          title="Pilih layanan administrasi"
          description="Baca persyaratan, lalu kirim pengajuan agar petugas desa dapat menyiapkan tindak lanjut."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {liveServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ServiceRequestForm services={liveServices} />
      </aside>
    </main>
  );
}
