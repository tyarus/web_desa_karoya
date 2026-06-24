import { notFound } from "next/navigation";

import { NewsDetailClient } from "@/components/public/news-detail-client";
import { getPostBySlug } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <NewsDetailClient post={post} />;
}
