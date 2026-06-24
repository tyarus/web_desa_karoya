import { HomeEditor } from "@/components/admin/home-editor";
import { getHomeContent, getVillageSettings } from "@/lib/data/public";

export default async function AdminHomePage() {
  const [home, settings] = await Promise.all([
    getHomeContent(),
    getVillageSettings(),
  ]);

  return <HomeEditor home={home} settings={settings} />;
}
