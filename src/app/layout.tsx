import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import MobileDock from "@/components/layout/MobileDock";
import CartDrawer from "@/components/cart/CartDrawer";

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
  title: "Suministros L&D — Ferretería Especializada en Iluminación y Electricidad",
  description: "Tu aliado en iluminación LED, sistemas de control eléctrico (brekeras) y cableado pesado en los Valles del Tuy (Charallave, Cúa, Ocumare). Compra en línea, paga a cuotas con Cashea o tasa BCV, y retira hoy mismo.",
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
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-slate-800/50 selection:text-slate-100 pb-16 md:pb-0">
        {children}
        <CartDrawer />
        <MobileDock />
      </body>
    </html>
  );
}

