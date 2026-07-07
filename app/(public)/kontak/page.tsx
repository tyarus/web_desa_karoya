// @ts-nocheck
import { ContactPageClient } from "@/components/public/contact-page-client";
import { getVillageSettings } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getVillageSettings();

  return <ContactPageClient settings={settings} />;
}
