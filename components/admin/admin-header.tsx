"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { getInitials } from "@/lib/utils";

export function AdminHeader({
  email,
}: {
  email: string;
}) {
  const pathname = usePathname();
  const title =
    pathname === "/admin"
      ? "Dashboard"
      : pathname.includes("/beranda")
        ? "Beranda"
        : pathname.includes("/profil")
          ? "Profil Desa"
          : pathname.includes("/berita")
            ? "Berita"
            : pathname.includes("/layanan")
              ? "Layanan"
              : pathname.includes("/galeri")
                ? "Galeri"
                : pathname.includes("/kontak")
                  ? "Kontak"
                  : pathname.includes("/pengaturan")
                    ? "Pengaturan"
                    : "Panel Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="flex h-18 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 text-[#1B4332] lg:hidden">
            <Menu className="size-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-[#1B4332]">
              {title}
            </h1>
            <p className="text-xs text-zinc-500">
              Kelola konten dan layanan Desa Karoya
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#E9F5EE] text-xs font-bold text-[#1B4332]">
              {getInitials(email)}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-800">Admin</p>
              <p className="text-xs text-zinc-500">{email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
