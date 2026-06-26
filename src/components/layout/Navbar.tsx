"use client";

import * as React from "react";
import { ShoppingCart, LayoutGrid, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart-store";
import { useDrawerStore } from "@/store/drawer-store";
import BcvRateWidget from "../shared/BcvRateWidget";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const MENU_ITEMS = [
  { label: "Cableado Eléctrico", href: "/catalogo/iluminacion" },
  { label: "Luminaria LED B2B", href: "/catalogo/iluminacion" },
  { label: "Control de Carga", href: "/catalogo/iluminacion" },
  { label: "Tuberías y Herramientas Pesadas", href: "/catalogo/iluminacion" },
];

export function Navbar({ onSearch }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const items = useCartStore((state) => state.items);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const menuRef = React.useRef<HTMLDivElement>(null);

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

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass-navbar shadow-md" : "bg-slate-900/60 border-b border-slate-800/50 backdrop-blur-md"
      )}
    >
      <div 
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-6 transition-all duration-300",
          scrolled ? "h-14" : "h-16"
        )}
      >
        {/* Brand/Logo */}
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
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-sm font-bold leading-none tracking-tight text-slate-100">
              SUMINISTROS L&D
            </span>
            <span className="text-[9px] text-slate-400 leading-none font-mono mt-0.5 uppercase tracking-wider">
              Ferretería Especializada
            </span>
          </div>
        </a>

        {/* Search Bar & Categories Dropdown Cluster */}
        {onSearch && (
          <div className="flex flex-1 max-w-[200px] min-w-[140px] min-[450px]:max-w-xs md:max-w-lg lg:max-w-xl items-center h-10 bg-slate-950/40 border border-slate-800 rounded-lg relative focus-within:border-slate-700/80 transition-all">
            {/* Categories Menu Selector */}
            <div ref={menuRef} className="relative h-full flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group h-full px-3 md:px-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-transparent transition-colors cursor-pointer border-r border-slate-800 outline-none"
              >
                <LayoutGrid 
                  strokeWidth={1.5} 
                  size={14} 
                  className="text-slate-500 transition-colors duration-150 group-hover:text-slate-300" 
                />
                <span className="md:hidden">Menú</span>
                <span className="hidden md:inline">Categorías</span>
              </button>

              {/* Dropdown Panel (Next.js/Stripe minimal style) */}
              {isMenuOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-52 rounded-lg border border-slate-850 bg-slate-950 p-1 flex flex-col gap-0.5 shadow-2xl animate-none">
                  {/* Master Link */}
                  <a
                    href="/catalogo/iluminacion"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900 rounded-md cursor-pointer outline-none border-b border-slate-900 pb-2 mb-1"
                  >
                    Ver Catálogo Completo ➔
                  </a>

                  {MENU_ITEMS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 rounded-md cursor-pointer outline-none"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input field */}
            <div className="flex-1 h-full relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full h-full bg-transparent pl-9 pr-8 text-xs text-slate-200 placeholder:text-slate-500 outline-none"
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    onSearch("");
                  }}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Widgets and Cart */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden min-[450px]:block">
            <BcvRateWidget />
          </div>

          {/* Cart trigger button */}
          <button
            onClick={openDrawer}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white transition-all duration-200 active:scale-95"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="h-4 w-4" />
            
            {/* Quantity Badge with minimalist flat style */}
            {mounted && totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded bg-slate-100 text-[9px] font-bold text-slate-950 shadow-sm">
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Navigation Bar (Submenu) */}
      <div className="w-full h-10 bg-slate-950/40 border-t border-slate-800/60 text-xs text-slate-400 font-medium tracking-wide flex items-center justify-center gap-6 sm:gap-8 px-4">
        <a href="/" className="hover:text-slate-100 transition-colors">Inicio</a>
        <a href="/catalogo/iluminacion" className="hover:text-slate-100 transition-colors">Catálogo General</a>
        <a href="/#nosotros" className="hover:text-slate-100 transition-colors">Quiénes Somos</a>
        <a href="https://wa.me/584141025386" target="_blank" rel="noopener noreferrer" className="hover:text-slate-100 transition-colors">Contacto</a>
      </div>
    </header>
  );
}

export default Navbar;
