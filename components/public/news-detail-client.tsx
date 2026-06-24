"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import type { Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export function NewsDetailClient({ post }: { post: Tables<"posts"> }) {
  const livePost = useRealtimeRecord("posts", post, post.id);

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/berita">
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
        </Button>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant={livePost.category === "pengumuman" ? "accent" : "default"}>
            {livePost.category === "pengumuman" ? "Pengumuman" : "Berita"}
          </Badge>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
            <CalendarDays className="size-4" />
            {formatDate(livePost.published_at)}
          </span>
        </div>
        <h1 className="mt-5 font-heading text-3xl font-bold text-[#1B4332] sm:text-5xl">
          {livePost.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600">
          {livePost.excerpt}
        </p>
        {livePost.cover_url ? (
          <div className="mt-8 overflow-hidden rounded-xl">
            <img
              src={livePost.cover_url}
              alt={livePost.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        ) : null}
        <div className="content-prose mt-8 text-base text-zinc-700">
          {livePost.content.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
