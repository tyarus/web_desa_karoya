import { ServicesPageClient } from "@/components/public/services-page-client";
import { getServices } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();

  return <ServicesPageClient services={services} />;
}
