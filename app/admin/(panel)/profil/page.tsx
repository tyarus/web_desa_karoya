import { ProfileEditor } from "@/components/admin/profile-editor";
import { getProfileContent } from "@/lib/data/public";

export default async function AdminProfilePage() {
  const profile = await getProfileContent();

  return <ProfileEditor profile={profile} />;
}
