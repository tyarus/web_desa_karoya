import { HomePageClient } from "@/components/public/home-page-client";
import { getSiteData } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getSiteData();

  return <HomePageClient data={data} />;
}
