"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Zap, Lightbulb, Cable, X, Layers, ShieldCheck, Cpu } from "lucide-react";
import { useCommandPaletteStore } from "@/hooks/useCommandPalette";
import { useProductsStore } from "@/store/products-store";
import { useBcvStore } from "@/store/bcv-store";
import { smartSearch } from "@/lib/search/smartSearch";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";

const QUICK_ITEMS = [
  { label: "Breakers y Protecciones", category: "Control", query: "breaker" },
  { label: "Bombillos y Reflectores LED", category: "Iluminación", query: "led" },
  { label: "Cables THHN y Conductores", category: "Cableado", query: "cable thhn" },
  { label: "Tuberías Conduit y Accesorios", category: "Canalización", query: "tubo" },
  { label: "Cintas Aislantes y Consumibles", category: "Consumibles", query: "teipe" },
];

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, closePalette } = useCommandPaletteStore();
  const { products, categories: dbCategories } = useProductsStore();
  const rate = useBcvStore((state) => state.rate);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Filter items using smartSearch
  const filtered = React.useMemo(() => {
    if (!search.trim()) {
      return QUICK_ITEMS.map((q) => ({
        label: q.label,
        category: q.category,
        query: q.query,
        isProduct: false,
        sku: "",
        price: 0,
        stock: 1,
        slug: "",
        image: "",
      }));
    }

    // Smart search over all real products
    const matchedProducts = smartSearch(products, search).slice(0, 8);

    if (matchedProducts.length > 0) {
      return matchedProducts.map((p) => ({
        label: p.name,
        category: p.categoryLabel,
        query: p.name,
        isProduct: true,
        sku: p.sku,
        price: p.price,
        stock: p.stock,
        slug: p.slug,
        image: p.image,
      }));
    }

    return [];
  }, [search, products]);

  // Reset state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      // Delay focus to allow animation
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Reset selected index when filtered items change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filtered.length]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelect = (item: typeof filtered[0]) => {
    closePalette();
    if (item.isProduct && item.slug) {
      router.push(`/producto/${item.slug}`);
    } else {
      router.push(`/catalogo?q=${encodeURIComponent(item.query)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      handleSelect(filtered[selectedIndex]);
    } else if (search.trim()) {
      closePalette();
      router.push(`/catalogo?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const getCategoryIcon = (category: string) => {
    const s = (category || "").toLowerCase();
    if (s.includes("led") || s.includes("ilumin")) return <Lightbulb className="h-4 w-4 text-[#007BFF]" />;
    if (s.includes("protecc") || s.includes("breaker")) return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
    if (s.includes("control") || s.includes("auto")) return <Cpu className="h-4 w-4 text-amber-400" />;
    if (s.includes("cinta") || s.includes("adhes")) return <Layers className="h-4 w-4 text-indigo-400" />;
    return <Cable className="h-4 w-4 text-slate-400" />;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-start pt-24 md:pt-32 px-4"
      onClick={closePalette}
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de búsqueda rápida"
    >
      <div
        className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-blur-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 px-5 border-b border-slate-800">
            <Search className="h-5 w-5 text-slate-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent py-5 text-base text-slate-100 placeholder:text-slate-500 outline-none font-sans"
              placeholder="Buscar material, marca o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden md:flex items-center bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] text-slate-500 font-mono select-none">
              ESC
            </kbd>
          </div>
        </form>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto scrollbar-fine">
          {filtered.length > 0 ? (
            <ul className="py-2" role="listbox">
              {filtered.map((item, idx) => (
                <li
                  key={item.label + idx}
                  role="option"
                  aria-selected={idx === selectedIndex}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-100 ${
                    idx === selectedIndex
                      ? "bg-[#007BFF]/15"
                      : "hover:bg-slate-800/60"
                  }`}
                >
                  {item.isProduct && item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.label}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0" 
                    />
                  ) : (
                    <span className="flex-shrink-0 p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      {getCategoryIcon(item.category)}
                    </span>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-200 block truncate">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.sku && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1 rounded border border-slate-800">
                          {item.sku}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {item.isProduct && item.price > 0 && (
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-xs font-bold font-mono text-[#007BFF]">
                        {formatUSD(item.price)}
                      </span>
                      {rate > 0 && (
                        <span className="text-[10px] font-mono text-slate-500">
                          {formatVES(item.price * rate)}
                        </span>
                      )}
                    </div>
                  )}

                  <ArrowRight
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-all duration-150 ${
                      idx === selectedIndex
                        ? "text-[#007BFF] translate-x-0 opacity-100"
                        : "text-slate-600 -translate-x-1 opacity-0"
                    }`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-400">
                Sin resultados para &ldquo;{search}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Presiona Enter para buscar en todo el catálogo de insumos
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-800 bg-slate-950/50">
          <span className="text-[10px] text-slate-600 font-mono">
            Búsqueda rápida de materiales
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[9px]">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[9px]">↵</kbd>
              seleccionar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
