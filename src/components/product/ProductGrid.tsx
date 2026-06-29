"use client";

import * as React from "react";
import { Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  searchQuery: string;
  categoryFilter?: string;
  onCategoryFilterChange?: (category: "all" | "iluminacion" | "control" | "cableado") => void;
}

type CategoryFilter = "all" | "iluminacion" | "control" | "cableado";

export function ProductGrid({ searchQuery, categoryFilter, onCategoryFilterChange }: ProductGridProps) {
  const [localCategory, setLocalCategory] = React.useState<CategoryFilter>("all");

  const activeCategory = (categoryFilter as CategoryFilter) || localCategory;
  
  const setActiveCategory = (cat: CategoryFilter) => {
    if (onCategoryFilterChange) {
      onCategoryFilterChange(cat);
    } else {
      setLocalCategory(cat);
    }
  };

  const categories = [
    { id: "all" as CategoryFilter, label: "Todos" },
    { id: "iluminacion" as CategoryFilter, label: "Iluminación LED" },
    { id: "control" as CategoryFilter, label: "Control Eléctrico" },
    { id: "cableado" as CategoryFilter, label: "Material Pesado" },
  ];

  // Filter products by search query and active category
  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;
      
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="catalogo" className="w-full max-w-full overflow-hidden flex flex-col gap-6 py-8">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-lg border transition-all duration-200 cursor-pointer snap-start ${
                activeCategory === cat.id
                  ? "bg-slate-100 border-slate-100 text-slate-950"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 font-mono self-end md:self-auto">
          Mostrando <span className="text-slate-200 font-bold">{filteredProducts.length}</span> productos
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible pb-8 snap-x snap-mandatory scroll-smooth scrollbar-hide">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl bg-slate-950/20 border border-slate-800">
          <svg
            className="h-12 w-12 text-slate-600 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <h4 className="font-display text-base font-bold text-slate-200 mb-1">
            No se encontraron productos
          </h4>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Intenta buscando otros términos o seleccionando otra categoría de artículos.
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
