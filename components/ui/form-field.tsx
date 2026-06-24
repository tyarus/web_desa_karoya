import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  helper,
  error,
  children,
  className,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
      {helper ? <p className="text-xs leading-5 text-zinc-500">{helper}</p> : null}
      {error ? <p className="text-xs leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}
