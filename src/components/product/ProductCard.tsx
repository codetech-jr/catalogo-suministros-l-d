"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Check, Lightbulb, Zap, HelpCircle } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rate = useBcvStore((state) => state.rate);
  const addItem = useCartStore((state) => state.addItem);
  
  const [added, setAdded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Get vector icon for category representation
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "iluminacion":
        return <Lightbulb className="h-12 w-12 text-accent-electric opacity-60" />;
      case "control":
        return <Zap className="h-12 w-12 text-accent-amber opacity-60" />;
      default:
        // cableado
        return (
          <svg className="h-12 w-12 text-text-muted opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3 12a9 9 0 0 1 15-6.708M3 12l3 3m-3-3-3 3" />
          </svg>
        );
    }
  };

  // Calculations
  const bcvPrice = product.price * rate;
  const casheaPrice = (product.price / 4) * rate; // 1 initial payment + 3 cuotas

  const savingsPerUnit = product.volumeDiscount
    ? product.price - product.volumeDiscount.discountPrice
    : 0;

  return (
    <article className="glass-card flex flex-col justify-between overflow-hidden rounded-xl bg-canvas-card">
      <div className="p-4 flex flex-col gap-3">
        {/* Card Header: SKU + Category Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted font-mono font-medium tracking-wider">
            SKU: {product.sku}
          </span>
          <Badge variant={product.category === "iluminacion" ? "electric" : "amber"}>
            {product.categoryLabel}
          </Badge>
        </div>

        {/* Product Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-canvas-elevated flex items-center justify-center border border-hairline/50">
          {product.image === "" || imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              {/* Grid background pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:14px_24px]" />
              {getCategoryIcon(product.category)}
              <div className="absolute h-24 w-24 rounded-full bg-accent-electric/[0.02] filter blur-xl" />
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-base font-bold leading-snug tracking-tight text-text-primary line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 min-h-[2rem] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specs Box */}
        <div className="rounded-lg bg-canvas-elevated/40 border border-hairline/30 p-2.5">
          <ul className="flex flex-col gap-1 text-[10px] text-text-secondary font-mono">
            {product.specs.slice(0, 3).map((spec, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="text-text-muted">{spec.label}:</span>
                <span className="text-text-primary font-medium">{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* B2B Volume Pricing Block */}
        {product.volumeDiscount ? (
          <div className="rounded-lg bg-accent-electric/[0.02] border border-accent-electric/15 p-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] text-accent-electric font-mono uppercase tracking-wider font-semibold">
              Precio al Mayor (B2B)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-text-secondary">
                Llevando <span className="font-bold text-accent-electric">{product.volumeDiscount.threshold}+</span> uds:
              </span>
              <span className="font-display text-sm font-bold text-accent-electric">
                {formatUSD(product.volumeDiscount.discountPrice)} c/u
              </span>
            </div>
            <span className="text-[9px] text-text-muted italic self-end">
              Ahorras {formatUSD(savingsPerUnit)} por unidad
            </span>
          </div>
        ) : (
          <div className="h-[52px] invisible" aria-hidden="true" />
        )}

        {/* Price display block */}
        <div className="flex flex-col gap-1 border-t border-hairline/50 pt-3 mt-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-text-muted font-medium">Unitario:</span>
            <div className="flex flex-col items-end">
              <span className="font-display text-lg font-bold text-text-primary">
                {formatUSD(product.price)}
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                ≈ {formatVES(bcvPrice)} (BCV)
              </span>
            </div>
          </div>

          {/* Cashea micro-display */}
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono mt-1 border-t border-hairline/20 pt-1.5">
            <span className="text-accent-amber/90 font-semibold tracking-wider">CASHEA:</span>
            <span>≈ {formatVES(casheaPrice)}/mes (x3)</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAdd}
          variant={added ? "success" : "primary"}
          className="w-full relative overflow-hidden transition-all duration-300 font-bold"
        >
          {added ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4 stroke-[3px]" /> ¡Agregado!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4 stroke-[3px]" /> Agregar al Carrito
            </span>
          )}
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;
