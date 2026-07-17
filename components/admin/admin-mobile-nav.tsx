"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GalleryHorizontalEnd,
  Home,
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  MoreHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";

const mainItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/beranda", label: "Beranda", icon: Home },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/umkm", label: "UMKM", icon: ShoppingBag },
  { href: "/admin/galeri", label: "Galeri", icon: GalleryHorizontalEnd },
];

const moreItems = [
  { href: "/admin/profil", label: "Profil" },
  { href: "/admin/layanan", label: "Layanan" },
  { href: "/admin/kontak", label: "Kontak" },
  { href: "/admin/pengaturan", label: "Pengaturan" },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mainItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-all",
                  active
                    ? "text-[#1B4332]"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-all",
                    active ? "bg-[#E9F5EE] text-[#1B4332]" : "",
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <span className="max-w-[60px] truncate text-center">{item.label}</span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-all",
              showMore || moreItems.some((item) => pathname.startsWith(item.href))
                ? "text-[#1B4332]"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full transition-all",
                showMore || moreItems.some((item) => pathname.startsWith(item.href))
                  ? "bg-[#E9F5EE] text-[#1B4332]"
                  : "",
              )}
            >
              <MoreHorizontal className="size-5" />
            </div>
            <span className="max-w-[60px] truncate text-center">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setShowMore(false)}
          />

          {/* Menu Sheet */}
          <div className="fixed inset-x-0 bottom-[72px] z-50 rounded-t-2xl bg-white p-4 shadow-xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-[#1B4332]">
                Menu Lainnya
              </h3>
              <button
                onClick={() => setShowMore(false)}
                className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "border-[#40916C] bg-[#E9F5EE] text-[#1B4332]"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed bottom nav */}
      <div className="h-[72px] lg:hidden" />
    </>
  );
}
