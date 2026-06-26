"use client";

import * as React from "react";
import { Search, Sparkles, Shield, Compass, CreditCard } from "lucide-react";

interface HeroSliderProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function HeroSlider({ searchQuery = "", onSearch }: HeroSliderProps) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);

  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleClear = () => {
    setLocalQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setLocalQuery(categoryName);
    if (onSearch) {
      onSearch(categoryName);
    }
  };

  return (
    <section className="relative w-full bg-slate-900 border-b border-slate-800 py-16 md:py-24 overflow-hidden">
      {/* Grid backdrop */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-96 w-96 rounded-full bg-slate-800/10 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-slate-750/5 filter blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content + Search */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Decorative micro badge */}
            <div className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/40 border border-slate-800 text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-widest">
              <Sparkles className="h-3 w-3 text-slate-400" />
              <span>Suministros L&D — Valles del Tuy</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-100 max-w-2xl">
              Tu aliado en iluminación y materiales eléctricos
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
              Abastecemos ingenieros, contratistas, obras y hogares con insumos certificados. Compra en línea con tasa oficial BCV, paga en cuotas con Cashea y retira hoy mismo en Charallave.
            </p>

            {/* Predominant Search Bar */}
            <div className="mt-2 w-full max-w-lg">
              <div className="relative flex items-center h-14 bg-slate-950/40 border border-slate-800 rounded-lg focus-within:border-slate-700/80 focus-within:bg-slate-950/60 transition-all shadow-lg shadow-slate-950/20">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  className="block w-full h-full bg-transparent pl-12 pr-12 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
                  placeholder="¿Qué material o marca buscas hoy? (Ej: Cable, Breaker, LED)"
                  value={localQuery}
                  onChange={handleInputChange}
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 text-xs font-mono text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Fast Value Propositions */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mt-4 border-t border-slate-800/60 pt-6">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <Shield className="h-3 w-3 text-slate-500" />
                  Garantía
                </span>
                <span className="text-xs text-slate-300">Materiales Certificados</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-slate-800/80 pl-4">
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <CreditCard className="h-3 w-3 text-slate-500" />
                  Financiado
                </span>
                <span className="text-xs text-slate-300">Paga con Cashea</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-slate-800/80 pl-4">
                <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <Compass className="h-3 w-3 text-slate-500" />
                  Ubicación
                </span>
                <span className="text-xs text-slate-300">Tienda en Charallave</span>
              </div>
            </div>
          </div>

          {/* Right Column: Next.js/Stripe style category preview layout */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] bg-slate-950/30 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
              {/* Fake Window OS controls */}
              <div className="flex items-center gap-1.5 mb-6 border-b border-slate-800/60 pb-3">
                <div className="h-2 w-2 rounded-full bg-slate-800" />
                <div className="h-2 w-2 rounded-full bg-slate-800" />
                <div className="h-2 w-2 rounded-full bg-slate-800" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">Explorador de Categorías</span>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleCategoryClick("Cable")}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/40 transition-all group flex justify-between items-center cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Línea Técnica</span>
                    <span className="text-xs font-bold text-slate-200">Cableado Eléctrico</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-350 transition-colors">➔</span>
                </button>

                <button 
                  onClick={() => handleCategoryClick("LED")}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/40 transition-all group flex justify-between items-center cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Eficiencia</span>
                    <span className="text-xs font-bold text-slate-200">Luminaria LED B2B</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-350 transition-colors">➔</span>
                </button>

                <button 
                  onClick={() => handleCategoryClick("Breaker")}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/40 transition-all group flex justify-between items-center cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Seguridad</span>
                    <span className="text-xs font-bold text-slate-200">Control de Carga & Protecciones</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-350 transition-colors">➔</span>
                </button>

                <button 
                  onClick={() => handleCategoryClick("Tubo")}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/40 transition-all group flex justify-between items-center cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Instalación</span>
                    <span className="text-xs font-bold text-slate-200">Tuberías y Canalizaciones</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-350 transition-colors">➔</span>
                </button>
              </div>

              {/* Minimalist ambient indicator */}
              <div className="mt-5 text-center">
                <span className="text-[10px] text-slate-500 font-mono">Haz clic para filtrar el catálogo al instante</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
