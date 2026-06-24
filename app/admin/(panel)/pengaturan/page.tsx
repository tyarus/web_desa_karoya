import { SettingsEditor } from "@/components/admin/settings-editor";
import { getVillageSettings } from "@/lib/data/public";

export default async function AdminSettingsPage() {
  const settings = await getVillageSettings();

  return <SettingsEditor settings={settings} />;
}
