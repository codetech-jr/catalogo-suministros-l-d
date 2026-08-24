"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight, Zap, Lightbulb, Cable, Hammer, LayoutGrid, Layers, ShieldCheck, Cpu } from "lucide-react";
import { useProductsStore } from "@/store/products-store";
import WholesaleB2BModal from "./WholesaleB2BModal";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "Catálogo Completo", href: "/catalogo", highlight: false },
  { label: "Marcas Aliadas", href: "/marcas", highlight: false },
  {
    label: "Compras al Mayor",
    href: "https://wa.me/584141025386?text=Hola%20Suministros%20L%26D.%20Deseo%20obtener%20información%20sobre%20compras%20al%20mayor.",
    external: true,
    highlight: false,
  },
  { label: "Tienda Física", href: "/tienda-fisica", highlight: false },
  { label: "Preguntas Frecuentes", href: "/ayuda", highlight: true },
];

function getCategoryIcon(slug: string, name: string) {
  const s = (slug + " " + name).toLowerCase();
  if (s.includes("led") || s.includes("ilumin")) return <Lightbulb className="h-5 w-5 text-[#007BFF]" />;
  if (s.includes("protecc") || s.includes("breaker")) return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
  if (s.includes("control") || s.includes("auto") || s.includes("instru")) return <Cpu className="h-5 w-5 text-amber-400" />;
  if (s.includes("cable") || s.includes("tub") || s.includes("conex")) return <Cable className="h-5 w-5 text-cyan-400" />;
  if (s.includes("herramient")) return <Hammer className="h-5 w-5 text-slate-300" />;
  if (s.includes("cinta") || s.includes("adhes")) return <Layers className="h-5 w-5 text-indigo-400" />;
  return <Zap className="h-5 w-5 text-slate-400" />;
}

export function MobileNavigationDrawer({ isOpen, onClose }: MobileNavigationDrawerProps) {
  const [isCatOpen, setIsCatOpen] = React.useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = React.useState(false);
  const { categories: dbCategories, products } = useProductsStore();

  const dynamicCategories = React.useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((cat: any) => ({
        label: cat.name,
        href: `/catalogo/${cat.slug}`,
        icon: getCategoryIcon(cat.slug, cat.name),
        count: products.filter((p) => p.category === cat.slug || p.category === cat.id).length,
      }));
    }
    return [
      { label: "Luminaria LED", href: "/catalogo/luminaria-led", icon: <Lightbulb className="h-5 w-5 text-[#007BFF]" />, count: 0 },
      { label: "Protección Eléctrica", href: "/catalogo/proteccion-electrica", icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />, count: 0 },
      { label: "Automatización e Instrumentación", href: "/catalogo/automatizacion-e-instrumentacion", icon: <Cpu className="h-5 w-5 text-amber-400" />, count: 0 },
      { label: "Herramientas y Equipos", href: "/catalogo/herramientas-y-equipos", icon: <Hammer className="h-5 w-5 text-slate-300" />, count: 0 },
      { label: "Cintas y Adhesivos", href: "/catalogo/cintas-y-adhesivos", icon: <Layers className="h-5 w-5 text-indigo-400" />, count: 0 },
      { label: "Tuberías, Cables y Conexiones", href: "/catalogo/tuberias-cables-y-conexiones", icon: <Cable className="h-5 w-5 text-cyan-400" />, count: 0 },
    ];
  }, [dbCategories, products]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsCatOpen(false); // reset accordion on close
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[140] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel — slides in from the left */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-slate-900 z-[150] md:hidden
          flex flex-col overflow-y-auto shadow-2xl border-r border-slate-800
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* ── Header del Drawer ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 flex-shrink-0">
          {/* Mini logo */}
          <a href="/" onClick={onClose} className="flex items-center gap-2 group">
            <svg
              className="h-6 w-6 text-[#007BFF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="font-display text-sm font-bold text-slate-100 leading-none tracking-tight">
              SUMINISTROS L&D
            </span>
          </a>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Acordeón de Categorías ── */}
        <div className="flex-shrink-0 border-b border-slate-800">
          <button
            onClick={() => setIsCatOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer active:bg-slate-800"
            aria-expanded={isCatOpen}
          >
            <span className="flex items-center gap-3">
              <LayoutGrid className="h-5 w-5 text-slate-400" />
              <span className="text-base font-bold uppercase tracking-wider">Categorías</span>
            </span>
            {isCatOpen ? (
              <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-200" />
            )}
          </button>

          {/* Category list (accordion body) */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCatOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-slate-950/40 pb-2 max-h-[420px] overflow-y-auto scrollbar-fine">
              {dynamicCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/60 last:border-b-0 hover:bg-[#007BFF]/5 transition-colors active:bg-[#007BFF]/10 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:border-[#007BFF]/30 transition-colors">
                      {cat.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-[#007BFF] transition-colors leading-snug truncate">
                      {cat.label}
                    </span>
                  </div>
                  {cat.count > 0 && (
                    <span className="text-xs font-mono font-bold text-slate-500 ml-2 flex-shrink-0">
                      ({cat.count})
                    </span>
                  )}
                </Link>
              ))}
              {/* CTA full catalog */}
              <Link
                href="/catalogo"
                onClick={onClose}
                className="flex items-center justify-center gap-2 mx-6 mt-3 mb-1 py-2.5 rounded-lg bg-[#007BFF]/10 border border-[#007BFF]/20 text-[#007BFF] text-xs font-bold font-mono uppercase tracking-wider hover:bg-[#007BFF]/20 transition-colors"
              >
                Ver Catálogo Completo →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Menú Principal de Navegación ── */}
        <nav className="flex flex-col flex-1" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => {
            const isWholesale = link.label === "Compras al Mayor";
            return link.external ? (
              <a
                key={link.label}
                href={isWholesale ? undefined : link.href}
                target={isWholesale ? undefined : "_blank"}
                rel={isWholesale ? undefined : "noopener noreferrer"}
                onClick={(e) => {
                  if (isWholesale) {
                    e.preventDefault();
                    onClose();
                    setIsWholesaleOpen(true);
                  } else {
                    onClose();
                  }
                }}
                className={`block px-6 py-4 border-b border-slate-800 text-lg font-bold uppercase tracking-wide transition-colors active:bg-slate-800/60 cursor-pointer ${
                  link.highlight
                    ? "text-[#007BFF]/90 hover:text-[#007BFF]"
                    : "text-slate-200 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`block px-6 py-4 border-b border-slate-800 text-lg font-bold uppercase tracking-wide transition-colors active:bg-slate-800/60 ${
                  link.highlight
                    ? "text-[#007BFF]/90 hover:text-[#007BFF]"
                    : "text-slate-200 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer del Drawer ── */}
        <div className="flex-shrink-0 px-6 py-5 border-t border-slate-800 bg-slate-950/50">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest text-center">
            Suministros L&D 2023, C.A. · Charallave, Miranda
          </p>
        </div>
      </aside>

      {/* Wholesale B2B Modal for Mobile Drawer */}
      <WholesaleB2BModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
      />
    </>
  );
}

export default MobileNavigationDrawer;
