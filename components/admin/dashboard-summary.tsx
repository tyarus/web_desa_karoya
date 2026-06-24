import {
  Camera,
  FileText,
  Inbox,
  Mail,
  Newspaper,
  Settings,
} from "lucide-react";

import type { Tables } from "@/lib/database.types";

export function DashboardSummary({
  posts,
  services,
  gallery,
  requests,
  messages,
}: {
  posts: Tables<"posts">[];
  services: Tables<"services">[];
  gallery: Tables<"gallery">[];
  requests: Tables<"service_requests">[];
  messages: Tables<"contact_messages">[];
}) {
  const cards = [
    { label: "Artikel", value: posts.length, icon: Newspaper },
    { label: "Layanan", value: services.length, icon: FileText },
    { label: "Foto", value: gallery.length, icon: Camera },
    { label: "Pengajuan", value: requests.length, icon: Inbox },
    { label: "Pesan", value: messages.length, icon: Mail },
    {
      label: "Draft",
      value: posts.filter((post) => post.status === "draft").length,
      icon: Settings,
    },
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
