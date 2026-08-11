import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Auto365 Case Lab Studio V2.0 – Production Zero-Rekey",
  description: "Giao diện bài V1.4 giàu hình ảnh và Studio V2.0 Zero-Rekey cho team content vận hành Case Lab hằng ngày.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
