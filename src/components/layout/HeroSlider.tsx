"use client";

import * as React from "react";
import { Sparkles, Shield, Compass, CreditCard, UploadCloud, FileText, Check, ArrowRight } from "lucide-react";

interface HeroSliderProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function HeroSlider({ searchQuery = "", onSearch }: HeroSliderProps) {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileSize, setFileSize] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${Math.round(file.size / 1024)} KB`);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleWhatsAppSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileName) return;
    const text = `Hola Suministros L&D. He cargado mi listado de materiales en la web:\n\n*Archivo:* ${fileName} (${fileSize})\n\nPor favor, cotícenme estos insumos con precios mayoristas.`;
    window.open(`https://wa.me/584141025386?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleScrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
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
          
          {/* Left Column: Content + CTAs — centrado absoluto */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center items-center">
            {/* Decorative micro badge */}
            <div className="self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/40 border border-slate-800 text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-widest">
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

            {/* Call To Actions de Alto Impacto */}
            <div className="flex flex-wrap gap-4 mt-2 justify-center w-full">
              <button
                onClick={handleScrollToCatalog}
                className="bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold px-6 py-3 rounded-lg transition-all duration-200 active:scale-98 shadow-md shadow-cyan-950/20 text-sm font-mono uppercase tracking-wider cursor-pointer"
              >
                Explorar Catálogo
              </button>
              <a
                href="https://wa.me/584141025386?text=Hola%20Suministros%20L%26D.%20Deseo%20obtener%20informaci%C3%B3n%20sobre%20el%20financiamiento%20con%20Cashea%20para%20mis%20compras."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 active:scale-98 font-medium cursor-pointer"
              >
                <CreditCard className="h-4 w-4 text-slate-400" />
                Financia con Cashea
              </a>
            </div>

            {/* Fast Value Propositions */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mt-4 border-t border-slate-800/60 pt-6 justify-center mx-auto w-full">
              <div className="flex flex-col gap-1 items-center text-center">
                <span className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <Shield className="h-3 w-3 text-slate-500" />
                  Garantía
                </span>
                <span className="text-xs text-slate-300">Materiales Certificados</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-slate-800/80 pl-4 items-center text-center">
                <span className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <CreditCard className="h-3 w-3 text-slate-500" />
                  Financiado
                </span>
                <span className="text-xs text-slate-300">Paga con Cashea</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-slate-800/80 pl-4 items-center text-center">
                <span className="flex items-center justify-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  <Compass className="h-3 w-3 text-slate-500" />
                  Ubicación
                </span>
                <span className="text-xs text-slate-300">Tienda en Charallave</span>
              </div>
            </div>
          </div>

          {/* Right Column: Carga Express de Obras */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] bg-slate-900/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-2xl relative flex flex-col gap-4">
              {/* Fake Window OS controls */}
              <div className="flex items-center gap-1.5 border-b border-slate-800/60 pb-3">
                <div className="h-2 w-2 rounded-full bg-slate-750" />
                <div className="h-2 w-2 rounded-full bg-slate-750" />
                <div className="h-2 w-2 rounded-full bg-slate-750" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">Carga Express de Obras</span>
              </div>

              <div>
                <h3 className="text-xl text-white font-semibold leading-tight">
                  🔌 ¿Tienes una Lista de Materiales?
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  No pierdas tiempo buscando 50 códigos. Carga tu listado y un Asesor Corporativo procesará tu cotización con márgenes de mayorista.
                </p>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".xlsx,.xls,.pdf,.dwg,.jpg,.png"
                onChange={handleFileChange}
              />

              {/* Drag & Drop box */}
              <div 
                onClick={handleBoxClick}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                  fileName 
                    ? 'border-emerald-500/50 bg-emerald-950/10' 
                    : 'border-slate-700 bg-slate-800/50 hover:border-[#0ee0d5]/50'
                }`}
              >
                {fileName ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200 font-mono font-bold max-w-[200px] truncate">{fileName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{fileSize}</span>
                    </div>
                    <button 
                      onClick={handleClearFile}
                      className="mt-2 text-[9px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-wider cursor-pointer"
                    >
                      Remover Archivo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 text-center select-none">
                    <div className="p-3 bg-slate-900 border border-slate-750 rounded-full text-slate-400">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-350 font-medium leading-tight">
                        Haz clic aquí para pegar tus materiales
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        o Subir Foto / Excel
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {fileName && (
                <button
                  onClick={handleWhatsAppSubmit}
                  className="w-full py-3 bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Enviar Lista a WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
