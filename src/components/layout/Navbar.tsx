"use client";

import * as React from "react";
import { ShoppingCart, LayoutGrid, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart-store";
import { useDrawerStore } from "@/store/drawer-store";
import { useProductsStore } from "@/store/products-store";
import { useBcvStore } from "@/store/bcv-store";
import { getSearchSuggestions } from "@/lib/search/smartSearch";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import BcvRateWidget from "../shared/BcvRateWidget";
import { useCommandPaletteKeyboard } from "@/hooks/useCommandPalette";
import CommandPalette from "./CommandPalette";
import WholesaleB2BModal from "./WholesaleB2BModal";
import Image from "next/image";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = React.useState(false);

  // Dynamic products & categories from store
  const { categories: dbCategories, products } = useProductsStore();
  const rate = useBcvStore((state) => state.rate);

  // Dynamic search suggestions
  const searchSuggestions = React.useMemo(() => {
    return getSearchSuggestions(products, dbCategories, searchQuery, 5);
  }, [products, dbCategories, searchQuery]);

  // Dynamic categories list for the dropdown
  const categoriesList = React.useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((cat: any) => ({
        label: cat.name,
        href: `/catalogo/${cat.slug}`,
        count: products.filter((p) => p.category === cat.slug || p.category === cat.id).length,
      }));
    }
    return [
      { label: "Luminaria LED", href: "/catalogo/luminaria-led", count: 0 },
      { label: "Protección Eléctrica", href: "/catalogo/proteccion-electrica", count: 0 },
      { label: "Automatización e Instrumentación", href: "/catalogo/automatizacion-e-instrumentacion", count: 0 },
      { label: "Herramientas y Equipos", href: "/catalogo/herramientas-y-equipos", count: 0 },
      { label: "Cintas y Adhesivos", href: "/catalogo/cintas-y-adhesivos", count: 0 },
      { label: "Tuberías, Cables y Conexiones", href: "/catalogo/tuberias-cables-y-conexiones", count: 0 },
    ];
  }, [dbCategories, products]);

  // Wire up Ctrl+K / ⌘K keyboard shortcut for Command Palette
  useCommandPaletteKeyboard();
  const items = useCartStore((state) => state.items);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchWrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("search") || "";
      setSearchQuery(q);
    }
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setIsSearchFocused(false);
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
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
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
            <div 
              ref={searchWrapperRef}
              className="hidden md:flex flex-1 w-full md:max-w-2xl bg-slate-900 border border-slate-700/80 rounded-lg focus-within:ring-2 focus-within:ring-[#007BFF] focus-within:border-[#007BFF] transition-all h-10 items-center relative"
            >
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

                {/* Dropdown Panel de Categorías */}
                {isMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 z-[100] w-64 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl p-2 overflow-hidden flex flex-col gap-0.5 backdrop-blur-xl">
                    <Link
                      href="/catalogo"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-100 hover:bg-[#007BFF] hover:text-slate-950 rounded-lg cursor-pointer transition-all outline-none border-b border-slate-800 pb-2.5 mb-1 group"
                    >
                      <span>Ver Catálogo Completo</span>
                      <span className="font-mono text-[11px] opacity-80 group-hover:translate-x-0.5 transition-transform">➔</span>
                    </Link>

                    <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto scrollbar-fine pr-1">
                      {categoriesList.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:bg-[#007BFF]/15 hover:text-[#007BFF] rounded-lg cursor-pointer transition-all outline-none"
                        >
                          <span className="truncate">{item.label}</span>
                          {item.count > 0 && (
                            <span className="text-[10px] font-mono text-slate-500 font-bold ml-2">
                              ({item.count})
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
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
                  placeholder="¿Qué material o marca buscas? (Ej: Breaker 20A, Cable THHN, Pickens...)"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchFocused(false);
                    }
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
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

              {/* Panel Flotante Predictivo / Autocompletado en Vivo */}
              {isSearchFocused && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-[110] bg-slate-900/95 border border-slate-700/90 shadow-2xl rounded-2xl p-3.5 backdrop-blur-2xl flex flex-col gap-3 max-h-[480px] overflow-y-auto scrollbar-fine animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Categorías y Marcas Sugeridas */}
                  {(searchSuggestions.categories.length > 0 || searchSuggestions.brands.length > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider mr-1">
                        Sugerencias:
                      </span>
                      {searchSuggestions.categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/catalogo/${cat.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="px-2.5 py-1 rounded-full bg-[#007BFF]/10 hover:bg-[#007BFF]/25 border border-[#007BFF]/30 text-[#007BFF] text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[9px] font-mono text-slate-400">({cat.count})</span>
                        </Link>
                      ))}
                      {searchSuggestions.brands.map((brand) => (
                        <Link
                          key={brand.name}
                          href={`/catalogo?brand=${encodeURIComponent(brand.name)}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{brand.name}</span>
                          <span className="text-[9px] font-mono text-slate-500">({brand.count})</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Lista de Productos Encontrados */}
                  {searchSuggestions.products.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider px-1">
                        Insumos Coincidentes ({searchSuggestions.totalResultsCount}):
                      </span>
                      {searchSuggestions.products.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/producto/${prod.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center p-1">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[9px] text-slate-500 font-mono">
                                  L&D
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-[#007BFF] transition-colors truncate">
                                {prod.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                  {prod.sku}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate">
                                  {prod.categoryLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 pl-2">
                            <span className="text-xs font-bold font-mono text-[#007BFF]">
                              {formatUSD(prod.price)}
                            </span>
                            {rate > 0 && (
                              <span className="text-[10px] font-mono text-slate-500">
                                {formatVES(prod.price * rate)}
                              </span>
                            )}
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded mt-0.5 font-bold ${
                              prod.stock > 0
                                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                            }`}>
                              {prod.stock > 0 ? "En Stock" : "Bajo Pedido"}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      <span>No encontramos coincidencias exactas para &quot;{searchQuery}&quot;.</span>
                      <p className="text-[11px] text-slate-500 mt-1">Presiona Enter para buscar en todo el catálogo de insumos.</p>
                    </div>
                  )}

                  {/* Footer CTA: Ver todos los resultados */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-2 px-3 rounded-lg bg-[#007BFF] hover:bg-[#1a8cff] text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Ver todos los resultados para &quot;{searchQuery}&quot;</span>
                      <span className="text-[10px] opacity-80">({searchSuggestions.totalResultsCount} insumos) ➔</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Derecha (Ticker y Cesta) */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
              <BcvRateWidget />



              {/* Cart trigger button */}
              <button
                onClick={openDrawer}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-slate-350 hover:border-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-inner"
                aria-label="Abrir carrito de compras"
              >
                <ShoppingCart className="h-4 w-4" />
                
                {/* Quantity Badge with neon/cyan glow */}
                {mounted && totalQty > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded bg-[#007BFF] text-[9px] font-bold text-slate-950 shadow-[0_0_8px_rgba(0,123,255,0.6)] animate-pulse">
                    {totalQty}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row (Links Limpios) — oculto en móvil, visible en md+ */}
          <div className="hidden md:flex w-full justify-center items-center gap-6 md:gap-10 mx-auto text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 mb-2">
            <Link href="/catalogo" className="hover:text-white transition-colors duration-200">Catálogo</Link>
            <Link href="/marcas" className="hover:text-white transition-colors duration-200">Marcas Aliadas</Link>
            <button
              onClick={() => setIsWholesaleModalOpen(true)}
              className="hover:text-white transition-colors duration-200 uppercase tracking-widest text-[11px] md:text-xs font-bold bg-transparent border-none outline-none p-0 cursor-pointer text-left"
            >
              Compras al Mayor
            </button>
            <Link href="/tienda-fisica" className="hover:text-white transition-colors duration-200">Tienda Física</Link>
            <Link href="/ayuda" className="text-[#007BFF]/80 hover:text-[#007BFF] transition-colors duration-200">Preguntas Frecuentes</Link>
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
