"use client";

import * as React from "react";
import { ShoppingCart, LayoutGrid, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart-store";
import { useDrawerStore } from "@/store/drawer-store";
import BcvRateWidget from "../shared/BcvRateWidget";
import { useCurrencyStore } from "@/store/currency-store";
import { useCommandPaletteKeyboard } from "@/hooks/useCommandPalette";
import CommandPalette from "./CommandPalette";
import WholesaleB2BModal from "./WholesaleB2BModal";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const MENU_ITEMS = [
  { label: "Cableado Eléctrico", href: "/catalogo/iluminacion" },
  { label: "Luminaria Comercial e Industrial", href: "/catalogo/iluminacion" },
  { label: "Control de Carga", href: "/catalogo/iluminacion" },
  { label: "Tuberías y Herramientas Pesadas", href: "/catalogo/iluminacion" },
];

export function Navbar({ onSearch }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = React.useState(false);

  // Wire up Ctrl+K / ⌘K keyboard shortcut for Command Palette
  useCommandPaletteKeyboard();
  
  const items = useCartStore((state) => state.items);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const { globalCurrencyMode, setCurrencyMode } = useCurrencyStore();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("search") || "";
      setSearchQuery(q);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/catalogo?q=${encodeURIComponent(query)}`);
    }
  };

  React.useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);  return (
    <>
      {/* Cashea Top Ribbon (Cinta superior) */}
      <div className="w-full bg-[#FDFA3D] py-1.5 px-4 text-center text-xs md:text-sm font-bold text-black tracking-wide border-b-2 border-[#D2D020] select-none print:hidden flex items-center justify-center gap-2">
        <img src="/Cashea-Icono-Negro.svg" alt="Cashea" className="w-4.5 h-4.5 object-contain" />
        <span>¡Cashéalo Online! Cuotas sin Interés</span>
      </div>

      {/* Main Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 print:hidden select-none">
        <div className="mx-auto max-w-7xl flex flex-col py-4 px-6 gap-5">
          
          {/* Top Row (Logo, Search Unificado, Badges) */}
          <div className="flex flex-nowrap justify-between items-center gap-4">
            
            {/* Izquierda: Componente Logo L&D */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <svg
                className="h-7 w-7 text-slate-200 transition-transform duration-300 group-hover:scale-105"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold leading-none tracking-tight text-slate-100">
                  SUMINISTROS L&D
                </span>
                <span className="text-[9px] text-slate-400 leading-none font-mono mt-0.5 uppercase tracking-wider">
                  Ferretería Especializada
                </span>
              </div>
            </a>

            {/* Centro (Mega-Buscador B2B) — oculto en móvil, visible en md+ */}
            <div className="hidden md:flex flex-1 w-full md:max-w-2xl bg-slate-900 border border-slate-700/80 rounded-lg focus-within:ring-2 focus-within:ring-[#0ee0d5] focus-within:border-[#0ee0d5] transition-all h-10 items-center relative">
              {/* Categories Menu Selector */}
              <div ref={menuRef} className="relative h-full flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-transparent text-sm font-semibold hover:bg-slate-800 transition-colors border-r border-slate-700/80 cursor-pointer h-full focus:outline-none text-slate-300 hover:text-white rounded-l-lg"
                >
                  <LayoutGrid 
                    strokeWidth={1.8} 
                    size={16} 
                    className="text-slate-400" 
                  />
                  <span>Categorías</span>
                </button>

                {/* Dropdown Panel */}
                {isMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 z-[100] w-56 bg-slate-900 border border-slate-700 shadow-xl rounded-lg p-2 overflow-hidden flex flex-col gap-1">
                    <a
                      href="/catalogo/iluminacion"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-xs font-bold text-slate-200 hover:bg-[#0ee0d5] hover:text-slate-900 rounded-md cursor-pointer transition-colors outline-none border-b border-slate-800 pb-2 mb-1"
                    >
                      Ver Catálogo Completo ➔
                    </a>

                    {MENU_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-[#0ee0d5] hover:text-slate-900 rounded-md cursor-pointer transition-colors outline-none"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input field */}
              <form 
                onSubmit={handleSearchSubmit}
                className="flex-1 h-full relative"
              >
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  className="block w-full h-full bg-transparent pl-9 pr-20 text-xs text-slate-200 placeholder:text-slate-500 outline-none rounded-r-lg"
                  placeholder="¿Qué material o marca buscas hoy? (Ej: Cables, Breakers, LED...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) {
                      onSearch(e.target.value);
                    }
                  }}
                />
                {/* ⌘K Shortcut Badge */}
                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                  <kbd className="hidden lg:flex items-center bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] text-slate-400 font-mono shadow-inner gap-1 select-none">
                    Ctrl+K
                  </kbd>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      if (onSearch) {
                        onSearch("");
                      }
                    }}
                    className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-350 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Derecha (Ticker y Cesta) */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
              <BcvRateWidget />

              {/* Segmented Control / Toggle de Monedas B2B */}
              <div className="flex items-center bg-slate-900 border border-slate-700/60 p-1 rounded-lg">
                <button
                  onClick={() => setCurrencyMode("USD")}
                  className={cn(
                    "px-3 py-1 text-xs transition-colors rounded-md cursor-pointer",
                    globalCurrencyMode === "USD"
                      ? "font-bold text-slate-900 bg-[#0ee0d5] shadow-sm animate-none"
                      : "font-semibold text-slate-400 hover:text-slate-200"
                  )}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrencyMode("VES")}
                  className={cn(
                    "px-3 py-1 text-xs transition-colors rounded-md cursor-pointer",
                    globalCurrencyMode === "VES"
                      ? "font-bold text-slate-900 bg-[#0ee0d5] shadow-sm animate-none"
                      : "font-semibold text-slate-400 hover:text-slate-200"
                  )}
                >
                  Bs VES
                </button>
              </div>

              {/* Cart trigger button */}
              <button
                onClick={openDrawer}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-350 hover:border-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-inner"
                aria-label="Abrir carrito de compras"
              >
                <ShoppingCart className="h-4 w-4" />
                
                {/* Quantity Badge with neon/cyan glow */}
                {mounted && totalQty > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded bg-[#0ee0d5] text-[9px] font-bold text-slate-950 shadow-[0_0_8px_rgba(14,224,213,0.6)] animate-pulse">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row (Links Limpios) — oculto en móvil, visible en md+ */}
          <div className="hidden md:flex w-full justify-center items-center gap-6 md:gap-10 mx-auto text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 mb-2">
            <a href="/catalogo/iluminacion" className="hover:text-white transition-colors duration-200">Catálogo</a>
            <Link href="/marcas" className="hover:text-white transition-colors duration-200">Marcas Aliadas</Link>
            <button
              onClick={() => setIsWholesaleModalOpen(true)}
              className="hover:text-white transition-colors duration-200 uppercase tracking-widest text-[11px] md:text-xs font-bold bg-transparent border-none outline-none p-0 cursor-pointer text-left"
            >
              Compras al Mayor
            </button>
            <Link href="/tienda-fisica" className="hover:text-white transition-colors duration-200">Tienda Física</Link>
            <Link href="/ayuda" className="text-[#0ee0d5]/80 hover:text-[#0ee0d5] transition-colors duration-200">Preguntas Frecuentes</Link>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette />

      {/* Wholesale B2B Modal */}
      <WholesaleB2BModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
