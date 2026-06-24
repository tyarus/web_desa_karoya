import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/lib/database.types";

export function ServiceCard({ service }: { service: Tables<"services"> }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#E9F5EE] text-[#1B4332]">
          <FileText className="size-5" />
        </div>
        {service.is_featured ? <Badge>Unggulan</Badge> : null}
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-[#1B4332]">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {service.description}
      </p>
      <div className="mt-4 grid gap-3 text-sm">
        <div>
          <p className="font-semibold text-zinc-800">Syarat</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-600">
            {(service.requirements ?? []).slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-zinc-800">Kontak</p>
          <p className="mt-1 text-zinc-600">{service.contact ?? "Kantor Desa"}</p>
        </div>
      </div>
    </article>
  );
}
