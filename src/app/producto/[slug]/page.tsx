"use client";

import * as React from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useProductsStore } from "@/store/products-store";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";
import { getStorePrices, getVolumeSavings } from "@/lib/utils/pricing-engine";
import { formatVES } from "@/lib/utils/format-currency";
import { Product } from "@/types/product";
import { 
  ShoppingCart, 
  Check, 
  Plus, 
  Minus, 
  Tag, 
  Share2, 
  Maximize2, 
  X, 
  ShieldCheck, 
  Truck, 
  Store, 
  MessageCircle, 
  ChevronRight, 
  Zap, 
  Lightbulb, 
  Package, 
  Info,
  Copy
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slugParam = resolvedParams.slug;
  const router = useRouter();

  // Global state integrations
  const { products: storeProducts, isFetchingData } = useProductsStore();
  const rateBcv = useCurrencyStore((s) => s.rateBcv);
  const rateBinance = useCurrencyStore((s) => s.rateBinance);
  const addItem = useCartStore((s) => s.addItem);

  // Local Component States
  const [quantity, setQuantity] = React.useState<number>(1);
  const [added, setAdded] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [lightboxBg, setLightboxBg] = React.useState<"dark" | "light" | "neutral">("dark");

  // Find product by slug from dynamic store first, fallback to static dataset
  const product: Product | undefined = React.useMemo(() => {
    const allProducts = storeProducts.length > 0 ? storeProducts : PRODUCTS;
    return allProducts.find(
      (p) => p.slug.toLowerCase() === slugParam.toLowerCase() || p.id === slugParam
    );
  }, [storeProducts, slugParam]);

  // Related products from same category
  const relatedProducts: Product[] = React.useMemo(() => {
    if (!product) return [];
    const allProducts = storeProducts.length > 0 ? storeProducts : PRODUCTS;
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product, storeProducts]);

  // ── Pricing Engine Calculations ──
  const unitPrices = product ? getStorePrices(product.price, rateBcv, rateBinance) : null;
  
  // Volume discount evaluation
  const isVolumeEligible = Boolean(
    product?.volumeDiscount && quantity >= (product.volumeDiscount.threshold || 1)
  );

  const effectiveUnitPriceUSD = (product?.volumeDiscount && isVolumeEligible)
    ? product.volumeDiscount.discountPrice
    : (product?.price || 0);

  const effectivePrices = product
    ? getStorePrices(effectiveUnitPriceUSD, rateBcv, rateBinance)
    : null;

  const totalPriceUSD = effectiveUnitPriceUSD * quantity;
  const totalPriceVES = (effectivePrices?.netVES || 0) * quantity;

  const volumeSavings = (product?.volumeDiscount && effectivePrices)
    ? getVolumeSavings(product.price, product.volumeDiscount.discountPrice, rateBcv, rateBinance)
    : null;

  // Category vector icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "iluminacion":
        return <Lightbulb className="h-16 w-16 text-slate-500" />;
      case "control":
        return <Zap className="h-16 w-16 text-slate-500" />;
      default:
        return (
          <svg className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3M3 12a9 9 0 0 1 15-6.708M3 12l3 3m-3-3-3 3" />
          </svg>
        );
    }
  };

  // Handlers
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppConsultation = () => {
    if (!product) return;
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const message = `Hola Suministros L&D, me interesa cotizar el producto:\n*${product.name}*\n- SKU: ${product.sku}\n- Cantidad requerida: ${quantity} unds\n- Enlace: ${pageUrl}`;
    const whatsappUrl = `https://wa.me/584141025386?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // If loading or product not found
  if (isFetchingData && !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-[#007BFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-400">Cargando información técnica del producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Package size={32} />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-200 mb-2">
            Producto no encontrado
          </h1>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            No pudimos encontrar el artículo solicitado bajo el slug <code className="text-[#007BFF] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{slugParam}</code>.
          </p>
          <Link
            href="/catalogo"
            className="px-6 py-3 bg-[#007BFF] hover:bg-[#1a8cff] text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all"
          >
            Regresar al Catálogo Principal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-[#007BFF] selection:text-slate-950">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 relative">
        
        {/* Breadcrumb Header Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-[#007BFF] transition-colors">Inicio</Link>
          <ChevronRight size={12} className="text-slate-600 shrink-0" />
          <Link href="/catalogo" className="hover:text-[#007BFF] transition-colors">Catálogo</Link>
          <ChevronRight size={12} className="text-slate-600 shrink-0" />
          <Link href={`/catalogo/${product.category}`} className="hover:text-[#007BFF] transition-colors capitalize">
            {product.categoryLabel}
          </Link>
          <ChevronRight size={12} className="text-slate-600 shrink-0" />
          <span className="text-slate-200 font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Product Master View Grid (Left: Full Photo / Lightbox Trigger | Right: Specifications & Pricing Engine) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: High-Resolution Photo Viewer */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-28">
            
            {/* Image Container Card */}
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group flex items-center justify-center shadow-xl cursor-pointer"
            >
              
              {/* Availability Semaphore Badge */}
              <div className="absolute top-4 left-4 z-20">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950/80 border border-green-700/80 text-green-400 backdrop-blur-md shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    En Tienda / Stock Disponible ({product.stock} unds)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950/80 border border-amber-700/80 text-amber-400 backdrop-blur-md shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Disponible Bajo Pedido
                  </span>
                )}
              </div>

              {/* Mobile Touch Instruction Badge */}
              <div className="absolute bottom-4 left-4 z-20 sm:hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950/90 border border-slate-700 text-slate-200 backdrop-blur-md shadow-lg">
                  <Maximize2 size={12} className="text-[#007BFF]" />
                  Toca la foto para ampliar
                </span>
              </div>

              {/* Full Photo Fullscreen Lightbox Trigger Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:border-[#007BFF] text-xs font-mono font-bold tracking-wide backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Ver fotografía completa en resolución nativa"
              >
                <Maximize2 size={14} className="text-[#007BFF]" />
                <span className="hidden sm:inline">Ver Foto Completa</span>
              </button>

              {/* Product Image Rendering */}
              {product.image === "" || imageError ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    {getCategoryIcon(product.category)}
                  </div>
                  <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                    Imagen Técnica en Edición
                  </span>
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              )}

              {/* Bottom Quick Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-mono text-slate-400">
                  SKU: <strong className="text-slate-200">{product.sku}</strong>
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {product.categoryLabel}
                </span>
              </div>
            </div>

            {/* Click to expand hint banner */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Maximize2 size={14} className="text-[#007BFF]" />
              <span>Haz clic aquí para ampliar la imagen y ver la foto completa sin recortar</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Product Specifications & Commercial Actions */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Header Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 font-bold">
                  SKU: {product.sku}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#007BFF]/10 border border-[#007BFF]/20 text-xs font-mono text-[#007BFF] font-bold uppercase">
                  {product.categoryLabel}
                </span>
              </div>

              {/* Share & Copy button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
              >
                {copiedLink ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
                <span>{copiedLink ? "¡Enlace Copiado!" : "Compartir"}</span>
              </button>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Bi-Monetary Pricing Showcase (USD / VES con Tasa Oficial BCV) */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col gap-4 shadow-lg">
              
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Tag size={14} className="text-[#007BFF]" />
                  Cotización Bi-Monetaria
                </span>
                <span>Tasa Oficial BCV: <strong className="text-slate-200">Bs. {rateBcv.toFixed(2)}</strong></span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                
                {/* VES Main Price */}
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-mono">Precio Total en Bolívares (Neto)</span>
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                    {formatVES(totalPriceVES)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-400 font-mono mt-0.5">
                      ({formatVES(effectivePrices?.netVES || 0)} c/u)
                    </span>
                  )}
                </div>

                {/* USD Reference Price */}
                <div className="flex flex-col sm:items-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                  <span className="text-xs text-slate-400 font-mono">Ref. USD</span>
                  <span className="font-display text-2xl font-bold text-[#007BFF]">
                    ${totalPriceUSD.toFixed(2)} USD
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-400 font-mono mt-0.5">
                      (${effectiveUnitPriceUSD.toFixed(2)} c/u)
                    </span>
                  )}
                </div>

              </div>

              {/* B2B Volume Discount Banner (Si el producto incluye descuento al mayor) */}
              {product.volumeDiscount && (
                <div className={`mt-2 rounded-xl p-4 border transition-all ${
                  isVolumeEligible 
                    ? "bg-emerald-950/60 border-emerald-700/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-slate-950/80 border-slate-800"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isVolumeEligible ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                        <Tag size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isVolumeEligible ? "text-emerald-400" : "text-slate-300"}`}>
                          {isVolumeEligible ? "¡Descuento Corporativo Aplicado!" : "Precio Especial por Volumen (Mayorista)"}
                        </span>
                        <p className="text-xs text-slate-300 mt-1 leading-snug">
                          A partir de <strong className="text-white font-mono">{product.volumeDiscount.threshold} unidades</strong> el precio baja a <strong className="text-emerald-400 font-mono">${product.volumeDiscount.discountPrice.toFixed(2)} USD</strong> /c/u.
                        </p>
                      </div>
                    </div>

                    {volumeSavings && isVolumeEligible && (
                      <span className="text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg shrink-0">
                        Ahorro total: {formatVES(volumeSavings.savingsVES * quantity)}
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Quantity Selector & Commercial Action Buttons */}
            <div className="flex flex-col gap-4 border-t border-b border-slate-800 py-6">
              
              {/* Quantity selector row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Cantidad a Solicitar:
                </span>

                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent font-mono text-sm font-bold text-white outline-none"
                  />

                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-9 w-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Main Action Buttons: Add to Cart & WhatsApp Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full py-4 px-6 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-[0.98] ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-[#007BFF] hover:bg-[#1a8cff] text-slate-950 shadow-blue-950/40"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} strokeWidth={3} />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppConsultation}
                  className="w-full py-4 px-6 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/30 active:scale-[0.98]"
                >
                  <MessageCircle size={18} />
                  <span>Cotizar por WhatsApp</span>
                </button>

              </div>

            </div>

            {/* Technical Specifications Table */}
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Info size={16} className="text-[#007BFF]" />
                Ficha Técnica y Especificaciones
              </h2>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/80">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                    <span className="font-mono text-slate-400 font-medium">{spec.label}</span>
                    <span className="font-mono text-slate-100 font-bold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corporate Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck size={20} className="text-[#007BFF] shrink-0" />
                <div className="flex flex-col text-[11px]">
                  <strong className="text-slate-200">Garantía Directa</strong>
                  <span className="text-slate-400">Respaldo técnico original</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <Store size={20} className="text-[#007BFF] shrink-0" />
                <div className="flex flex-col text-[11px]">
                  <strong className="text-slate-200">Retiro en Tienda</strong>
                  <span className="text-slate-400">Caracas, Venezuela</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
                <Truck size={20} className="text-[#007BFF] shrink-0" />
                <div className="flex flex-col text-[11px]">
                  <strong className="text-slate-200">Despacho Nacional</strong>
                  <span className="text-slate-400">Envíos a todo el país</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION: Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-slate-800/80 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono text-[#007BFF] font-bold uppercase tracking-widest block mb-1">
                  Catálogo Complementario
                </span>
                <h3 className="font-display text-xl font-bold text-slate-100">
                  Productos Relacionados en {product.categoryLabel}
                </h3>
              </div>

              <Link
                href={`/catalogo/${product.category}`}
                className="text-xs font-mono text-[#007BFF] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Ver todos</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />

      {/* FULL PHOTO LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-fade-in select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between border-b border-slate-800 pb-4 z-10">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[#007BFF] font-bold uppercase tracking-widest">
                Visualizador de Fotografía Completa
              </span>
              <h4 className="font-display text-sm sm:text-base font-bold text-slate-100 truncate max-w-md">
                {product.name} (SKU: {product.sku})
              </h4>
            </div>

            {/* Background Style Switcher & Close button */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-[10px] font-mono">
                <button
                  onClick={() => setLightboxBg("dark")}
                  className={`px-2 py-1 rounded transition-colors ${lightboxBg === "dark" ? "bg-[#007BFF] text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  Fondo Oscuro
                </button>
                <button
                  onClick={() => setLightboxBg("light")}
                  className={`px-2 py-1 rounded transition-colors ${lightboxBg === "light" ? "bg-white text-slate-950 font-bold" : "text-slate-400"}`}
                >
                  Fondo Claro
                </button>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Cerrar vista completa"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* High-Res Image Display Area */}
          <div className={`relative flex-1 w-full max-w-6xl my-4 rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-300 ${
            lightboxBg === "light" ? "bg-slate-200" : lightboxBg === "neutral" ? "bg-slate-800" : "bg-slate-950"
          }`}>
            {product.image === "" || imageError ? (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                {getCategoryIcon(product.category)}
                <span className="text-xs font-mono uppercase tracking-widest">Sin imagen de alta resolución</span>
              </div>
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain p-2 sm:p-6 select-none"
              />
            )}
          </div>

          {/* Modal Footer Controls Bar */}
          <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4 z-10 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#007BFF]" />
              Vista panorámica completa de fotografía técnica sin recorte
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold transition-all cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
