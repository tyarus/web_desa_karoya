import { ProfilePageClient } from "@/components/public/profile-page-client";
import { getProfileContent } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfileContent();

  return <ProfilePageClient profile={profile} />;
}
