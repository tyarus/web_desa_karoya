"use client";

import { NewsCard } from "@/components/public/news-card";
import { SectionHeading } from "@/components/public/section-heading";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";

export function NewsPageClient({ posts }: { posts: Tables<"posts">[] }) {
  const livePosts = useRealtimeList("posts", posts, {
    predicate: (post) => post.status === "published",
    sort: (a, b) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime(),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Berita"
        title="Berita dan pengumuman"
        description="Kabar terbaru, agenda layanan, dan informasi resmi Desa Karoya."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {livePosts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
