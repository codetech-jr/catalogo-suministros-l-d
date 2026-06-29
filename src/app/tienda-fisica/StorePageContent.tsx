"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { MapPin, Clock, Map, Navigation, Zap, Cpu, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StorePageContent() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Background radial overlay styling */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950/40 via-slate-900 to-slate-900 pointer-events-none" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative flex flex-col">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0ee0d5] transition-colors">
            Inicio
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-350 font-bold">Nuestra Sede</span>
        </nav>

        {/* Paso 1: El Título y Presentación (Header de Sede) */}
        <div className="border-b border-slate-800 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl text-white font-bold tracking-tight font-display">
            Nuestra Sede Operativa y Tienda
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-3 leading-relaxed max-w-3xl">
            El epicentro logístico para contratistas en los Valles del Tuy. Retira tus compras de inmediato, revisa los materiales y carga tu transporte con la asesoría de especialistas en el mostrador.
          </p>
        </div>

        {/* Paso 2: Layout Dual (Información vs Coordenadas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-2">
          {/* A. Columna Izquierda */}
          <div className="w-full lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col gap-8">
              
              {/* Bloque 1: Ubicación Exacta */}
              <div className="flex gap-4 items-start">
                <div className="flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-[#0ee0d5] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">📍 Dirección</span>
                  <h3 className="font-display text-lg font-bold text-slate-100 leading-tight">Sede Charallave Centro</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Calle 15 Miranda, frente al Concejo Municipal, Charallave. Edo. Miranda, Venezuela.
                  </p>
                </div>
              </div>

              {/* Bloque 2: Horarios */}
              <div className="flex gap-4 items-start">
                <div className="flex items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-[#0ee0d5] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">🕒 Horario de Atención</span>
                  <h3 className="font-display text-lg font-bold text-slate-100 leading-tight">Despachos y Atención</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-mono">
                    Lunes a Sábados desde las 8:00 AM hasta las 5:00 PM (Horario corrido).
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-800/80 w-full" />

              {/* Botones de GPS */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=SUMINISTROS+L%26D+2023+Charallave"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 font-semibold px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-md active:scale-[0.98] select-none text-center cursor-pointer"
                >
                  <Map className="w-4 h-4 shrink-0" />
                  <span>Abrir en Maps</span>
                </a>
                <a
                  href="https://waze.com/ul?ll=10.2461325,-66.8619453&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-700 bg-slate-800 hover:bg-[#0ee0d5] hover:text-slate-900 transition-colors font-semibold px-4 py-3 text-slate-300 rounded-lg text-sm flex items-center justify-center gap-2 active:scale-[0.98] select-none text-center cursor-pointer"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Ir con Waze</span>
                </a>
              </div>

            </div>
          </div>

          {/* B. Columna Derecha (Iframe de Google Maps Embebido) */}
          <div className="w-full lg:col-span-7 h-full min-h-[400px]">
            <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.191516983365!2d-66.86194539070132!3d10.246132532297272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2aef002d2bc151%3A0x31421bc29607a6a9!2sSUMINISTROS%20L%26D%202023!5e0!3m2!1ses!2sve!4v1782491638989!5m2!1ses!2sve"
                className="absolute inset-0 w-full h-full border-0 filter invert-[100%] hue-rotate-[180deg] contrast-[95%] opacity-90"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Ubicación Sede Operativa Suministros L&D"
              />
            </div>
          </div>
        </div>

        {/* Paso 3: Fila Final 'Infraestructura' (Micro-tarjetas logísticas) */}
        <div className="mt-16 border-t border-slate-800/80 pt-12">
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              Infraestructura y Logística
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
              Sede de Distribución y Abastecimiento B2B
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1: Recogida Express */}
            <div className="bg-transparent border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all duration-300 group flex flex-col gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-[#0ee0d5] group-hover:bg-[#0ee0d5] group-hover:text-slate-900 transition-colors duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">
                  Recogida Express
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tu carrito embalado en minutos. Trae la <span className="font-bold text-[#0ee0d5]/90 font-mono">#Referencia</span> o tu confirmación y subimos todo de una vez a tu vehículo.
                </p>
              </div>
            </div>

            {/* Tarjeta 2: Asesoría Técnica */}
            <div className="bg-transparent border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all duration-300 group flex flex-col gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-[#0ee0d5] group-hover:bg-[#0ee0d5] group-hover:text-slate-900 transition-colors duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">
                  Asesoría Técnica en Mesa
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Si tienes dudas entre voltajes o brekeras, ven a probar nuestros tableros directamente en físico antes de liquidar.
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Zona de Carga */}
            <div className="bg-transparent border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all duration-300 group flex flex-col gap-4 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-[#0ee0d5] group-hover:bg-[#0ee0d5] group-hover:text-slate-900 transition-colors duration-300">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">
                  Zona de Carga Mayorista
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capacidad en entrada principal para atender o estacionar el remolque / vehículo de gran volumen de tu obra sin embotellamientos.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Back Link to Catalog */}
        <div className="flex justify-center mt-16 mb-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-[#0ee0d5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al Catálogo de Materiales
          </Link>
        </div>

      </main>

      {/* Footer and Cart Drawer */}
      <Footer />
      <CartDrawer />
    </div>
  );
}
