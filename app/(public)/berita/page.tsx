import { NewsPageClient } from "@/components/public/news-page-client";
import { getPublishedPosts } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getPublishedPosts();

  return <NewsPageClient posts={posts} />;
}
