import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { getVillageSettings } from "@/lib/data/public";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getVillageSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader settings={settings} />
      <div className="flex-1">{children}</div>
      <PublicFooter settings={settings} />
    </div>
  );
}
