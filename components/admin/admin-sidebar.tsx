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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-[#1B4332] text-white lg:block">
      <div className="flex h-18 items-center border-b border-white/10 px-5">
        <div>
          <p className="font-heading text-lg font-bold">Desa Karoya</p>
          <p className="text-xs text-white/65">Panel Admin</p>
        </div>
      </div>
      <nav className="grid gap-1 p-3">
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
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white",
                active && "bg-[#40916C] text-white",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
