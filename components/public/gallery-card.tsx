/* eslint-disable @next/next/no-img-element */

import type { Tables } from "@/lib/database.types";

export function GalleryCard({ item }: { item: Tables<"gallery"> }) {
  return (
    <figure className="group overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={item.image_url}
          alt={item.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <figcaption className="p-4">
        <p className="font-heading font-bold text-[#1B4332]">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {item.description}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
