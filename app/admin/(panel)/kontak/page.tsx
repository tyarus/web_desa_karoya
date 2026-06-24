import { ContactManager } from "@/components/admin/contact-manager";
import { getContactMessages } from "@/lib/data/public";

export default async function AdminContactPage() {
  const messages = await getContactMessages();

  return <ContactManager messages={messages} />;
}
