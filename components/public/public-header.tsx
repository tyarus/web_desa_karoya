"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import type { Tables } from "@/lib/database.types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/layanan", label: "Layanan" },
  { href: "/lacak", label: "Lacak" },
  { href: "/galeri", label: "Galeri" },
  { href: "/umkm", label: "UMKM" },
  { href: "/kontak", label: "Kontak" },
];

export function PublicHeader({
  settings,
}: {
  settings: Tables<"village_settings">;
}) {
  const liveSettings = useRealtimeRecord("village_settings", settings);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-[#1B4332] text-sm font-bold text-white">
            {liveSettings.logo_url ? (
              <img
                src={liveSettings.logo_url}
                alt={`Logo ${liveSettings.village_name}`}
                className="size-full object-cover"
              />
            ) : (
              "DK"
            )}
          </div>
          <div>
            <p className="font-heading text-base font-bold leading-tight text-[#1B4332]">
              {liveSettings.village_name}
            </p>
            <p className="text-xs text-zinc-500">
              Kecamatan {liveSettings.district}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-[#E9F5EE] hover:text-[#1B4332]",
                  active && "bg-[#E9F5EE] text-[#1B4332]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm">
            <Link href="/layanan">Ajukan Surat</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 text-[#1B4332] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Buka navigasi"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white px-4 py-3 lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-[#E9F5EE] hover:text-[#1B4332]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
