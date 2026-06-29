"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Zap, Lightbulb, Cable, X } from "lucide-react";
import { useCommandPaletteStore } from "@/hooks/useCommandPalette";

const QUICK_ITEMS = [
  { label: "Cable THHN 12 AWG", category: "Cableado", query: "Cable THHN" },
  { label: "Lámpara LED 18W Philips", category: "Iluminación", query: "Lámpara LED 18W" },
  { label: "Breaker SquareD 20A", category: "Control", query: "Breaker SquareD" },
  { label: "Tubo Conduit PVC 3/4\"", category: "Canalización", query: "Tubo Conduit" },
  { label: "Reflector LED 100W IP66", category: "Iluminación", query: "Reflector LED" },
  { label: "Cinta Aislante 3M", category: "Consumibles", query: "Cinta 3M" },
];

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, closePalette } = useCommandPaletteStore();
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Filter items
  const filtered = React.useMemo(() => {
    if (!search.trim()) return QUICK_ITEMS;
    const lower = search.toLowerCase();
    return QUICK_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [search]);

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

  const handleSelect = (query: string) => {
    closePalette();
    router.push(`/catalogo?q=${encodeURIComponent(query)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      handleSelect(filtered[selectedIndex]?.query ?? search);
    } else if (search.trim()) {
      handleSelect(search.trim());
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
    switch (category) {
      case "Iluminación":
        return <Lightbulb className="h-4 w-4 text-slate-500" />;
      case "Control":
        return <Zap className="h-4 w-4 text-slate-500" />;
      default:
        return <Cable className="h-4 w-4 text-slate-500" />;
    }
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
        <div className="max-h-80 overflow-y-auto scrollbar-fine">
          {filtered.length > 0 ? (
            <ul className="py-2" role="listbox">
              {filtered.map((item, idx) => (
                <li
                  key={item.label}
                  role="option"
                  aria-selected={idx === selectedIndex}
                  onClick={() => handleSelect(item.query)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-100 ${
                    idx === selectedIndex
                      ? "bg-[#0ee0d5]/10"
                      : "hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex-shrink-0 p-1.5 rounded-md bg-slate-800/80 border border-slate-700/50">
                    {getCategoryIcon(item.category)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-200 block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <ArrowRight
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-all duration-150 ${
                      idx === selectedIndex
                        ? "text-[#0ee0d5] translate-x-0 opacity-100"
                        : "text-slate-600 -translate-x-1 opacity-0"
                    }`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                Sin resultados para &ldquo;{search}&rdquo;
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Presiona Enter para buscar en el catálogo completo
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
