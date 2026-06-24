import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40916C] disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "bg-[#1B4332] text-white hover:bg-[#143326]",
        secondary: "bg-[#40916C] text-white hover:bg-[#2D6A4F]",
        outline:
          "border border-[#1B4332]/25 bg-transparent text-[#1B4332] hover:bg-[#E9F5EE]",
        destructive:
          "border border-red-300 bg-transparent text-red-700 hover:bg-red-50",
        ghost: "bg-transparent text-[#1C1C1E] hover:bg-black/5",
        upload:
          "border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
