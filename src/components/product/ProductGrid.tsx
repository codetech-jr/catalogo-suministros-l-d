"use client";

import * as React from "react";
import { Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  searchQuery: string;
}

type CategoryFilter = "all" | "iluminacion" | "control" | "cableado";

export function ProductGrid({ searchQuery }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>("all");

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
    <section id="catalogo" className="w-full flex flex-col gap-6 py-8">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-full border transition-all duration-200 cursor-pointer snap-start ${
                activeCategory === cat.id
                  ? "bg-accent-electric/10 border-accent-electric text-accent-electric animate-none"
                  : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary hover:text-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs text-text-muted font-mono self-end md:self-auto">
          Mostrando <span className="text-text-primary font-bold">{filteredProducts.length}</span> productos
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl bg-canvas-card border border-hairline">
          <svg
            className="h-12 w-12 text-text-muted mb-3"
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
          <h4 className="font-display text-base font-bold text-text-primary mb-1">
            No se encontraron productos
          </h4>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            Intenta buscando otros términos o seleccionando otra categoría de artículos.
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
