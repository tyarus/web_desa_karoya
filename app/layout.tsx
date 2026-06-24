import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="id"
      className={`${jakarta.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F8F9FA] text-[#1C1C1E]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
