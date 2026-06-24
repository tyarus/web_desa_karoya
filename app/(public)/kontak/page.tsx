// @ts-nocheck
import { ContactPageClient } from "@/components/public/contact-page-client";
import { getVillageSettings } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getVillageSettings();

  // Fetch contact messages
  const supabase = await createClient();
  const { data: messages = [] } = await supabase
    .from("contact_messages")
    .select("*")
    .neq("status", "baru")
    .order("created_at", { ascending: false });

  return <ContactPageClient settings={settings} messages={messages} />;
}
