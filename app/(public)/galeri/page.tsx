import { GalleryPageClient } from "@/components/public/gallery-page-client";
import { getGallery } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await getGallery();

  return <GalleryPageClient gallery={gallery} />;
}
