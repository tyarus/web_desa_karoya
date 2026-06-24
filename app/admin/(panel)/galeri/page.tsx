import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGallery } from "@/lib/data/public";

export default async function AdminGalleryPage() {
  const gallery = await getGallery();

  return <GalleryManager gallery={gallery} />;
}
