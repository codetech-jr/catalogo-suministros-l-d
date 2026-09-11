import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MobileDock from "@/components/layout/MobileDock";
import CartDrawer from "@/components/cart/CartDrawer";
import CurrencyHydrator from "@/components/layout/CurrencyHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suministrosld.com"),
  alternates: {
    canonical: "/",
  },
  title:
    "Materiales Eléctricos y Ferretería en Charallave | Suministros L&D",
  description:
    "Interruptores termomagnéticos, tubos PVC, reflectores LED y herramientas en Charallave. Precios a tasa BCV, compras al mayor y delivery en Valles del Tuy.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title:
      "Materiales Eléctricos y Ferretería en Charallave | Suministros L&D",
    description:
      "Breakers Schneider, iluminación LED, tubería PVC y herramientas. Precios a tasa BCV, descuentos al mayor y delivery en los Valles del Tuy.",
    url: "/",
    type: "website",
    locale: "es_VE",
    siteName: "Suministros L&D 2023, C.A.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-slate-800/50 selection:text-slate-100 pb-16 md:pb-0 overflow-x-hidden w-full relative">
        <CurrencyHydrator />
        {children}
        <CartDrawer />
        <MobileDock />
        <Analytics />
      </body>
    </html>
  );
}
