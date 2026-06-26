"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Check, Lightbulb, Zap, Tag } from "lucide-react";
import { Product } from "@/types/product";
import { useCart, useCartStore } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rate = useBcvStore((state) => state.rate);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCart((state) => state.items);
  
  const [added, setAdded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const inCart = React.useMemo(() => {
    return items.some((item) => item.product.id === product.id);
  }, [items, product.id]);

  const handleAdd = () => {
    if (inCart) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Get vector icon for category representation
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "iluminacion":
        return <Lightbulb className="h-10 w-10 text-slate-500" />;
      case "control":
        return <Zap className="h-10 w-10 text-slate-500" />;
      default:
        // cableado
        return (
          <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3 12a9 9 0 0 1 15-6.708M3 12l3 3m-3-3-3 3" />
          </svg>
        );
    }
  };

  // Calculations
  const bcvPrice = product.price * rate;

  const savingsPerUnit = product.volumeDiscount
    ? product.price - product.volumeDiscount.discountPrice
    : 0;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-800 border border-slate-700/50 transition-all hover:bg-slate-800/80 p-4 gap-4 shadow-sm min-h-[480px]">
      
      {/* Upper Content Area */}
      <div className="flex flex-col gap-3.5 flex-grow">
        
        {/* Card Header: SKU + Category Label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">
            SKU: {product.sku}
          </span>
          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest">
            {product.categoryLabel}
          </span>
        </div>

        {/* Product Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-900/60 flex items-center justify-center border border-slate-700/40">
          {/* Badge de Stock sutil semáforo */}
          <div className="absolute top-2 right-2 z-10">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-950/70 border border-green-800 text-green-400 backdrop-blur-sm select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                ✓ En Tienda / Stock
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-950/70 border border-amber-800/80 text-amber-500 backdrop-blur-sm select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                ✗ Bajo Pedido
              </span>
            )}
          </div>
          {product.image === "" || imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              {/* Grid background pattern */}
              <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:12px_12px]" />
              {getCategoryIcon(product.category)}
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase select-none opacity-80">
                Imagen en edición
              </span>
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-sm md:text-base font-bold leading-snug tracking-tight text-slate-100 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Technical Specs horizontal Badges (Replaces the old spec table box) */}
        <div className="flex flex-wrap gap-2">
          {product.specs.slice(0, 3).map((spec, idx) => (
            <span 
              key={idx} 
              className="bg-slate-700 text-slate-300 px-2 py-1 text-[10px] font-mono rounded"
              title={`${spec.label}: ${spec.value}`}
            >
              {spec.value}
            </span>
          ))}
        </div>

        {/* B2B Volume Pricing Block */}
        {product.volumeDiscount ? (
          <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/50 p-2.5 flex items-center justify-between gap-2 shadow-[inset_0_1px_0_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0 border border-emerald-500/20">
                <Tag className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  Ahorro Corporativo
                </span>
                <span className="text-xs font-medium text-slate-200 mt-0.5 leading-snug">
                  Desde <span className="font-mono font-bold text-emerald-400">{product.volumeDiscount.threshold}</span> Und. &rarr; <span className="font-mono font-bold text-slate-100">{formatUSD(product.volumeDiscount.discountPrice)}</span> /c/u
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0 flex flex-col justify-center bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Ahorras
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-tight block">
                -{formatUSD(savingsPerUnit)} c/u
              </span>
            </div>
          </div>
        ) : (
          <div className="h-[52px]" aria-hidden="true" />
        )}

        {/* Price display block */}
        <div className="flex flex-col gap-1 border-t border-slate-700/40 pt-3 mt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Unitario:</span>
            <div className="flex flex-col items-end">
              <span className="font-display text-lg font-bold text-slate-100">
                {formatUSD(product.price)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ≈ {formatVES(bcvPrice)} (BCV)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Action CTA Botón */}
      <div className="mt-2">
        {inCart ? (
          <button
            disabled
            className="w-full py-2.5 bg-slate-900 text-slate-400 font-bold rounded-lg border border-slate-800/80 flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider select-none"
          >
            ✓ Agregado al Carrito
          </button>
        ) : added ? (
          <button
            disabled
            className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider select-none shadow-md"
          >
            <Check className="h-4 w-4 stroke-[3px]" /> ¡Agregado!
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full py-2.5 bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider select-none shadow-md shadow-cyan-950/20 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3px]" /> Agregar al Carrito
          </button>
        )}
      </div>

    </article>
  );
}

export default ProductCard;
