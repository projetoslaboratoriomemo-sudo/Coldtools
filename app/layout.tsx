import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coldtools | Ferramentas técnicas",
  description:
    "Cálculos elétricos, refrigeração, vazão e medições para técnicos em campo.",
  manifest: "/manifest.webmanifest",
  applicationName: "Coldtools",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coldtools",
  },
  icons: {
    icon: [{ url: "/caneca-rf.svg", type: "image/svg+xml" }],
    shortcut: ["/caneca-rf.svg"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#11171a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
