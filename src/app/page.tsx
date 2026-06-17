"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import FinancialBanner from "@/components/layout/FinancialBanner";
import Footer from "@/components/layout/Footer";
import TrustSignals from "@/components/shared/TrustSignals";
import ProductGrid from "@/components/product/ProductGrid";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchBar from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/Badge";
import { Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <>
      {/* Dynamic Navbar */}
      <Navbar onSearch={handleSearch} />

      {/* Financial info banners */}
      <FinancialBanner />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 pb-16 relative">
        
        {/* Radial Background Glow for Hero */}
        <div className="hero-glow" />

        {/* 03. HERO SECTION (Split Asymmetric) */}
        <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 lg:pt-16 pb-8 items-center min-h-[500px]">
          {/* Copy - 7 Cols */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 text-left">
            <Badge variant="electric" className="flex items-center gap-1.5 py-1 px-3">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Material Eléctrico Profesional</span>
            </Badge>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-text-primary">
              Tu aliado en iluminación y materiales eléctricos de todo los{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-electric to-[#33ffaa]">
                Valles del Tuy
              </span>
            </h1>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl leading-relaxed">
              Abastecemos obras, ingenieros, electricistas y hogares en Charallave, Cúa, Ocumare, Santa Teresa y más. Compra en línea con facilidades de pago y retira hoy mismo.
            </p>

            {/* Quick Hero Search */}
            <div className="w-full max-w-lg mt-3">
              <SearchBar onSearch={handleSearch} placeholder="Busca bombillos, breakers, rollos de cable..." />
            </div>
          </div>

          {/* Visual - 5 Cols */}
          <div className="lg:col-span-5 relative flex items-center justify-center p-6 h-full min-h-[320px] lg:min-h-0">
            {/* Visual vector display board */}
            <div className="relative w-full aspect-square max-w-[350px] rounded-2xl border border-hairline bg-canvas-card/50 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden shadow-2xl shadow-accent-electric/5">
              {/* Radial backdrop light */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent-electric/10 filter blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-amber/10 filter blur-2xl" />

              {/* Grid backdrop */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Decorative wire vectors */}
              <svg className="absolute inset-0 w-full h-full text-hairline" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,100 Q 150,150 250,50 T 400,200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 50,350 Q 200,200 350,300" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="2" />
              </svg>

              {/* Hardware items stylized container */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-accent-electric font-mono tracking-wider uppercase font-semibold">Tug Line</span>
                  <h4 className="text-sm font-bold text-text-primary">Ferretería Especializada</h4>
                </div>
                <div className="p-2 bg-accent-electric/10 border border-accent-electric/30 rounded-lg text-accent-electric">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              {/* Centered graphical neon tube lights */}
              <div className="relative z-10 flex flex-col gap-4 my-8">
                {/* Neon light bulb silhouette */}
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-accent-electric animate-pulse shadow-[0_0_8px_rgba(0,229,255,1)]" />
                  <div className="h-2 w-32 rounded bg-accent-electric/25" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-accent-amber animate-pulse shadow-[0_0_8px_rgba(255,179,0,1)]" />
                  <div className="h-2 w-24 rounded bg-accent-amber/25" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
                  <div className="h-2 w-40 rounded bg-success/25" />
                </div>
              </div>

              {/* Compliance note */}
              <div className="relative z-10 flex items-center gap-2 text-[10px] text-text-secondary border-t border-hairline/80 pt-3">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Productos Certificados &bull; Garantía Oficial</span>
              </div>
            </div>
          </div>
        </section>

        {/* 05. PRODUCTOS DESTACADOS (Grid Catálogo) */}
        <div className="relative z-10">
          <div className="flex flex-col gap-2 mb-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Catálogo de Materiales
            </h2>
            <p className="text-xs text-text-muted">
              Precios dinámicos liquidados en dólares o bolívares al cambio del Banco Central.
            </p>
          </div>
          <ProductGrid searchQuery={searchQuery} />
        </div>

        {/* 06. SECCIÓN FACILIDADES DE PAGO (Deep Dive) */}
        <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* BCV Deep Dive */}
          <div className="rounded-xl bg-canvas-card border border-hairline p-6 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-accent-electric/10 text-accent-electric border border-accent-electric/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-text-primary">Tasa Oficial de Cambio</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Toda cotización emitida se liquida respetando estrictamente el valor del dólar del Banco Central de Venezuela. Sin aumentos de cotización sorpresivos ni recargos ilegales por tipo de cambio.
              </p>
            </div>
            <span className="text-[10px] text-accent-electric font-mono font-bold uppercase tracking-wider bg-accent-electric/5 border border-accent-electric/15 py-1 px-2.5 rounded self-start mt-2">
              PAGA AL CAMBIO DEL DÍA
            </span>
          </div>

          {/* Cashea Deep Dive */}
          <div className="rounded-xl bg-canvas-card border border-hairline p-6 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-base font-bold text-text-primary">Financiamiento Cashea</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Divide tu compra de material eléctrico en cuotas. Pagas una inicial en mostrador y el resto en 3 cuotas fijas quincenales sin interés. Válido para retirar en tienda física en Charallave.
              </p>
            </div>
            <span className="text-[10px] text-accent-amber font-mono font-bold uppercase tracking-wider bg-accent-amber/5 border border-accent-amber/15 py-1 px-2.5 rounded self-start mt-2">
              HASTA 6 MESES
            </span>
          </div>
        </section>

        {/* 07. PROPUESTA DE VALOR / TRUST SIGNALS */}
        <TrustSignals />

        {/* 08. CTA FINAL (Cierre) */}
        <section className="relative z-10 w-full rounded-2xl bg-gradient-to-r from-accent-electric/10 to-accent-amber/10 border border-hairline p-8 flex flex-col items-center text-center gap-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
            ¿Tienes una obra civil o proyecto eléctrico grande?
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
            Escríbenos directamente por chat para cotizaciones corporativas o compras por volumen con descuento mayorista personalizado.
          </p>
          <a
            href="https://wa.me/584120000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent-electric hover:bg-[#33ebff] text-[#08090c] font-bold text-sm px-6 py-3 transition-all duration-200 active:scale-98 shadow-lg shadow-accent-electric/15"
          >
            Cotizar por WhatsApp
          </a>
        </section>

      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Shopping Cart Side Drawer */}
      <CartDrawer />
    </>
  );
}
