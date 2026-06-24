import { PostManager } from "@/components/admin/post-manager";
import { getAllPosts } from "@/lib/data/public";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return <PostManager posts={posts} />;
}
