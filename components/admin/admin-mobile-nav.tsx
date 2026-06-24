"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GalleryHorizontalEnd,
  Home,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  ShoppingBag,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/beranda", label: "Beranda", icon: Home },
  { href: "/admin/profil", label: "Profil", icon: UsersRound },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/layanan", label: "Layanan", icon: UserRoundCog },
  { href: "/admin/galeri", label: "Galeri", icon: GalleryHorizontalEnd },
  { href: "/admin/umkm", label: "UMKM", icon: ShoppingBag },
  { href: "/admin/kontak", label: "Kontak", icon: Mail },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-600",
                active && "border-[#40916C] bg-[#E9F5EE] text-[#1B4332]",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
