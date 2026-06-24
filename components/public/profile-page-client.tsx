"use client";

import { CheckCircle2 } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import { GovernmentStructure } from "@/components/public/government-structure";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import { parseGovernment } from "@/lib/content/parsers";
import type { Tables } from "@/lib/database.types";

export function ProfilePageClient({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  const liveProfile = useRealtimeRecord("profiles", profile);
  const government = parseGovernment(liveProfile.government_structure);

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Profil Desa"
            title="Mengenal Desa Karoya"
            description="Informasi sejarah, arah pembangunan, dan struktur pemerintahan desa."
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-heading text-2xl font-bold text-[#1B4332]">
            Sejarah Singkat
          </h2>
          <div className="content-prose mt-4 text-zinc-600">
            {liveProfile.history.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="font-heading text-2xl font-bold text-[#1B4332]">
            Visi
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            {liveProfile.vision}
          </p>
          <h3 className="mt-8 font-heading text-lg font-bold text-[#1B4332]">
            Misi
          </h3>
          <div className="mt-4 grid gap-3">
            {(liveProfile.missions ?? []).map((mission) => (
              <p key={mission} className="flex gap-2 text-sm leading-6 text-zinc-600">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#40916C]" />
                {mission}
              </p>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <SectionHeading
          eyebrow="Pemerintahan"
          title="Struktur pemerintahan desa"
          description="Data struktur dapat diperbarui dari panel admin."
        />
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <GovernmentStructure government={government} />
        </div>
      </section>
    </main>
  );
}
