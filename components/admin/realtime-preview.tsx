"use client";

import { Radio } from "lucide-react";
import type { ReactNode } from "react";

export function RealtimePreview({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1B4332]">
          <Radio className="size-4 animate-pulse" />
          Preview Realtime
        </div>
        <h2 className="mt-2 font-heading text-lg font-bold text-zinc-900">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </aside>
  );
}
