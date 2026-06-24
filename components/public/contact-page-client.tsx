"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/public/contact-form";
import { ContactHistory } from "@/components/public/contact-history";
import { SectionHeading } from "@/components/public/section-heading";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import type { Tables } from "@/lib/database.types";

export function ContactPageClient({
  settings,
  messages = [],
}: {
  settings: Tables<"village_settings">;
  messages?: Tables<"contact_messages">[];
}) {
  const liveSettings = useRealtimeRecord("village_settings", settings);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px]">
      <div className="space-y-8">
        <div>
          <SectionHeading
            eyebrow="Kontak"
            title="Hubungi Pemerintah Desa"
            description="Gunakan kanal resmi desa untuk bertanya tentang layanan, agenda, atau informasi warga."
          />
          <div className="mt-8 grid gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="flex gap-3 text-sm leading-7 text-zinc-700">
                <MapPin className="mt-1 size-5 shrink-0 text-[#40916C]" />
                {liveSettings.address}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="flex gap-3 text-sm leading-7 text-zinc-700">
                <Phone className="mt-1 size-5 shrink-0 text-[#40916C]" />
                {liveSettings.phone}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="flex gap-3 text-sm leading-7 text-zinc-700">
                <Mail className="mt-1 size-5 shrink-0 text-[#40916C]" />
                {liveSettings.email}
              </p>
            </div>
          </div>
          {liveSettings.map_url ? (
            <a
              href={liveSettings.map_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-lg bg-[#1B4332] px-4 py-2 text-sm font-semibold text-white"
            >
              Buka Peta Lokasi
            </a>
          ) : null}
        </div>

        <ContactHistory messages={messages} />
      </div>
      <ContactForm />
    </main>
  );
}
