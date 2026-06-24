/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { parseStats } from "@/lib/content/parsers";
import type { Tables } from "@/lib/database.types";

export function HeroSection({
  home,
  settings,
}: {
  home: Tables<"home_sections">;
  settings: Tables<"village_settings">;
}) {
  const stats = parseStats(home.stats);

  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E9F5EE] px-3 py-1 text-sm font-semibold text-[#1B4332]">
            <MapPin className="size-4" />
            Kecamatan {settings.district}
          </div>
          <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-normal text-[#1B4332] sm:text-6xl">
            {home.hero_title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg">
            {home.hero_subtitle}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={home.hero_cta_href ?? "/layanan"}>
                {home.hero_cta_label ?? "Lihat Layanan"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/berita">Baca Kabar Desa</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-200 bg-[#F8F9FA] p-4"
              >
                <p className="font-heading text-2xl font-bold text-[#1B4332]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-zinc-700">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-xl lg:min-h-[32rem]">
          <img
            src={home.hero_image_url ?? ""}
            alt="Suasana Desa Karoya"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/75 via-[#1B4332]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="font-heading text-2xl font-bold">
              Informasi desa dalam satu tempat
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
              Warga dapat membaca pengumuman, melihat layanan, dan menghubungi
              pemerintah desa lebih mudah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
