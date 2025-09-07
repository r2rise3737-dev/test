// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const runtime = "edge"; // для Cloudflare Pages

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Заголовок вкладки
  title: {
    default: "Angela Pearl — Академия",
    template: "%s — Angela Pearl",
  },
  description: "Авторские программы обучения. Таро и Астрология.",
  // База для абсолютных ссылок OG/каноникал
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://angelapearl-academy.pages.dev"
  ),
  // Иконки (favicon / apple-touch)
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "Angela Pearl — Академия",
    description: "Авторские программы обучения. Таро и Астрология.",
    url: "/",
    siteName: "Angela Pearl — Академия",
    images: [
      // (необязательно) положи public/og-image.jpg — тогда картинка будет в предпросмотрах ссылок
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Angela Pearl — Академия" },
    ],
    type: "website",
    locale: "ru_RU",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">`n  <head>`n    <meta charSet="utf-8" />`n  </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
