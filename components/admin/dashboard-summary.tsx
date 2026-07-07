import {
  Camera,
  FileText,
  Inbox,
  Mail,
  Newspaper,
  Package,
  ShoppingBag,
} from "lucide-react";

import type { Tables } from "@/lib/database.types";

export function DashboardSummary({
  posts,
  services,
  gallery,
  requests,
  messages,
  umkm,
}: {
  posts: Tables<"posts">[];
  services: Tables<"services">[];
  gallery: Tables<"gallery">[];
  requests: Tables<"service_requests">[];
  messages: Tables<"contact_messages">[];
  umkm: Tables<"umkm">[];
}) {
  const pendingRequests = requests.filter((r) => r.status === "masuk").length;
  const pendingMessages = messages.filter((m) => m.status === "baru").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const activeUmkm = umkm.filter((u) => u.status === "active").length;

  const cards = [
    { label: "Artikel Terbit", value: publishedPosts, icon: Newspaper },
    { label: "Layanan", value: services.length, icon: FileText },
    { label: "Foto", value: gallery.length, icon: Camera },
    { label: "Pengajuan Masuk", value: pendingRequests, icon: Inbox },
    { label: "Pesan Baru", value: pendingMessages, icon: Mail },
    { label: "UMKM Aktif", value: activeUmkm, icon: ShoppingBag },
    { label: "Total UMKM", value: umkm.length, icon: Package },
    { label: "Total Pesan", value: messages.length, icon: Mail },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-500">
                  {card.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#1B4332]">
                  {card.value}
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#E9F5EE] text-[#1B4332]">
                <Icon className="size-5" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
