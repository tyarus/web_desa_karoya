/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Tables } from "@/lib/database.types";

export function UMKMCard({ umkm }: { umkm: Tables<"umkm"> }) {
  return (
    <Link href={`/umkm/${umkm.slug}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#40916C]/30 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          {umkm.cover_url ? (
            <img
              src={umkm.cover_url}
              alt={umkm.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1B4332]/5 to-[#40916C]/10">
              <ShoppingBag className="h-12 w-12 text-[#1B4332]/20" />
            </div>
          )}
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Arrow Icon on Hover */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowRight className="h-5 w-5 text-[#1B4332]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-heading text-lg font-bold text-[#1B4332] line-clamp-1">
            {umkm.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-[#40916C]">
            {umkm.owner_name}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 line-clamp-3">
            {umkm.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#40916C] transition-colors group-hover:text-[#1B4332]">
            <span>Lihat Detail</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
