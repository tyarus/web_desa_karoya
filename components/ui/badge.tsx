import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#E9F5EE] text-[#1B4332]",
  accent: "bg-[#F4A261]/20 text-[#8A4A15]",
  muted: "bg-zinc-100 text-zinc-700",
  danger: "bg-red-50 text-red-700",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
