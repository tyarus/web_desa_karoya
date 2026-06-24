/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export function NewsCard({ post }: { post: Tables<"posts"> }) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/berita/${post.slug}`}>
        <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
          {post.cover_url ? (
            <img
              src={post.cover_url}
              alt={post.title}
              className="size-full object-cover transition duration-500 hover:scale-105"
            />
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={post.category === "pengumuman" ? "accent" : "default"}>
              {post.category === "pengumuman" ? "Pengumuman" : "Berita"}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <CalendarDays className="size-3.5" />
              {formatDate(post.published_at)}
            </span>
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-[#1B4332]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
