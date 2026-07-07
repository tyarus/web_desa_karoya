"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/lib/database.types";

export function ServiceCard({ service }: { service: Tables<"services"> }) {
  // Use unique ID for each card to avoid React reconciliation issues
  const cardId = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      id={`service-card-${service.id}`}
      className="rounded-xl border border-zinc-200 bg-white transition-all"
    >
      {/* Header - Always visible, clickable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-zinc-50"
        aria-expanded={isExpanded ? "true" : "false"}
        aria-controls={`service-content-${cardId}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F5EE] text-[#1B4332]">
            <FileText className="size-5" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-lg font-bold text-[#1B4332]">
              {service.title}
            </h3>
            {service.is_featured && <Badge>Unggulan</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          {isExpanded ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <div
        id={`service-content-${cardId}`}
        className={`border-t border-zinc-100 px-5 transition-all duration-200 ${
          isExpanded ? "pb-5 pt-4 opacity-100" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        {/* Description */}
        <p className="text-sm leading-relaxed text-zinc-600">
          {service.description || "Tidak ada deskripsi untuk layanan ini."}
        </p>

        {/* Requirements */}
        {(service.requirements ?? []).length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-[#1B4332]">Syarat</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-600">
              {service.requirements?.map((item, index) => (
                <li key={`${cardId}-req-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Flow */}
        {(service.flow ?? []).length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-[#1B4332]">Alur</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-zinc-600">
              {service.flow?.map((item, index) => (
                <li key={`${cardId}-flow-${index}`}>{item}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Contact */}
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
          <Phone className="size-4 text-[#40916C]" />
          <span>{service.contact ?? "Kantor Desa"}</span>
        </div>
      </div>
    </article>
  );
}
