import type { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

export const metadata: Metadata = {
  title: "Desa Karoya | Kecamatan Tegalwaru",
  description:
    "Website resmi Desa Karoya untuk informasi desa, layanan warga, berita, galeri, dan kontak pemerintah desa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-[#F8F9FA] text-[#1C1C1E]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
