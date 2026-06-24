import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Tables } from "@/lib/database.types";

export function PublicFooter({
  settings,
}: {
  settings: Tables<"village_settings">;
}) {
  return (
    <footer className="border-t border-black/5 bg-[#1B4332] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-xl font-bold">{settings.village_name}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
            Website resmi pemerintah desa untuk informasi, pelayanan, dan
            dokumentasi kegiatan warga Kecamatan {settings.district}.
          </p>
        </div>
        <div>
          <p className="font-semibold">Navigasi</p>
          <div className="mt-3 grid gap-2 text-sm text-white/75">
            <Link href="/profil">Profil Desa</Link>
            <Link href="/berita">Berita dan Pengumuman</Link>
            <Link href="/layanan">Layanan Warga</Link>
            <Link href="/galeri">Galeri Foto</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Kontak</p>
          <div className="mt-3 grid gap-3 text-sm text-white/75">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {settings.address}
            </p>
            <p className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              {settings.phone}
            </p>
            <p className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              {settings.email}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {settings.village_name}. Dikelola oleh
        Pemerintah Desa.
      </div>
    </footer>
  );
}
