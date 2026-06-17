import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
  themeColor: "#08090c",
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
      <body className="min-h-full flex flex-col bg-[#08090c] text-[#f4f5f6] font-sans selection:bg-[#00e5ff]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

