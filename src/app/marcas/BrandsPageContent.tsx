"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BrandItem {
  id: string;
  name: string;
  description: string;
  logoSrc: string;
  filterUrl: string;
  ctaText: string;
}

interface BrandGroup {
  categoryTitle: string;
  brands: BrandItem[];
}

const BRAND_GROUPS: BrandGroup[] = [
  {
    categoryTitle: "Control y Protecciones Eléctricas",
    brands: [
      {
        id: "siemens",
        name: "Siemens",
        description: "Breakers y tableros pesados para uso industrial y residencial de alta confiabilidad.",
        logoSrc: "/logo-siemens.svg",
        filterUrl: "/catalogo/control?brand=Siemens",
        ctaText: "Filtrar insumos Siemens ->",
      },
      {
        id: "exceline",
        name: "Exceline",
        description: "Líder en protecciones corporativas, de línea blanca y equipos de refrigeración.",
        logoSrc: "/logo-exceline.svg",
        filterUrl: "/catalogo/control?brand=Exceline",
        ctaText: "Filtrar insumos Exceline ->",
      },
    ],
  },
  {
    categoryTitle: "Iluminación Industrial y Comercial",
    brands: [
      {
        id: "philips",
        name: "Philips",
        description: "Iluminación eficiente de gran envergadura, reflectores de alta potencia y postes LED.",
        logoSrc: "/logo-philips.webp",
        filterUrl: "/catalogo/iluminacion?brand=Philips",
        ctaText: "Filtrar insumos Philips ->",
      },
    ],
  },
  {
    categoryTitle: "Canalización, Conectividad y Consumibles",
    brands: [
      {
        id: "bticino",
        name: "Bticino",
        description: "Instalaciones de primer nivel, tableros y canaletas modulares prémium para acabados de lujo.",
        logoSrc: "/logo-bticino.webp",
        filterUrl: "/catalogo?brand=Bticino",
        ctaText: "Filtrar insumos Bticino ->",
      },
      {
        id: "3m",
        name: "3M",
        description: "Aislantes de alto performance, uniones eléctricas, teipes Temflex y consumibles de resina.",
        logoSrc: "/logo-3M.webp",
        filterUrl: "/catalogo/cableado?brand=3M+Temflex",
        ctaText: "Filtrar insumos 3M ->",
      },
    ],
  },
];

export default function BrandsPageContent() {
  const router = useRouter();

  const handleBrandClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Background radial overlay styling */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950/40 via-slate-900 to-slate-900 pointer-events-none" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-12 px-6 relative flex flex-col">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0ee0d5] transition-colors">
            Inicio
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-350 font-bold">Marcas Aliadas</span>
        </nav>

        {/* Paso 1: Cabecera 'Sello Original' */}
        <div className="flex flex-col items-start border-b border-slate-800/80 pb-8 mb-4">
          <h1 className="text-4xl text-white font-bold tracking-tight font-display">
            Ingeniería de Primer Nivel en cada marca.
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
            Sabemos el impacto y riesgo detrás de una gran obra eléctrica. Por eso en Suministros L&D agrupamos un catálogo 100% certificado. Siendo canales regulares y aliados autorizados de las grandes casas eléctricas del país.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded-full text-sm font-semibold select-none">
            <Check className="h-4 w-4 stroke-[3px]" />
            <span>Certificados contra imitaciones / Respaldo Técnico del Fabricante.</span>
          </div>
        </div>

        {/* Paso 2: Bloques B2B del Directorio (Brands Layout) */}
        {BRAND_GROUPS.map((group) => (
          <section key={group.categoryTitle} className="w-full">
            {/* Subtítulo Divisor */}
            <h2 className="border-b border-slate-800 pb-2 mb-6 mt-16 text-sm text-slate-500 font-bold tracking-widest uppercase font-display">
              {group.categoryTitle}
            </h2>

            {/* Grilla de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {group.brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.filterUrl)}
                  className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-between min-h-[250px] cursor-pointer transition-all hover:bg-slate-800 hover:border-[#0ee0d5]/40 hover:shadow-2xl"
                  title={`Filtrar productos de la marca ${brand.name}`}
                >
                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {/* Logo de la marca */}
                    <img
                      src={brand.logoSrc}
                      alt={`Logo oficial de ${brand.name}`}
                      className="opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-in-out scale-95 group-hover:scale-100 h-16 w-auto object-contain max-w-full"
                    />

                    {/* Descripción corta */}
                    <p className="text-xs text-slate-400 mt-4 text-center leading-relaxed max-w-[200px]">
                      {brand.description}
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="text-xs text-[#0ee0d5] font-semibold opacity-0 group-hover:opacity-100 mt-4 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out select-none text-center">
                    {brand.ctaText}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Back Link to Catalog */}
        <div className="flex justify-center mt-20 mb-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-[#0ee0d5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al Catálogo Completo
          </Link>
        </div>
      </main>

      {/* Footer and Cart Drawer */}
      <Footer />
    </div>
  );
}
