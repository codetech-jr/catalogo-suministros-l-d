"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProductGrid from "@/components/product/ProductGrid";

import HeroSlider from "@/components/layout/HeroSlider";
import { CheckCircle, Banknote, Truck, ArrowRight, Sparkles, Plus, Check, Tag, MapPin, Clock } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart, useCartStore } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { useCurrencyStore } from "@/store/currency-store";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { useAttentionGrabber } from "@/hooks/useAttentionGrabber";

const BRANDS = [
  { name: "INGCO", src: "/logo-ingco.webp" },
  { name: "EMG", src: "/logo-emg.webp" },
  { name: "3M", src: "/logo-3M.webp" },
  { name: "Stanley", src: "/logo-stanley.webp" },
  { name: "Bellota", src: "/logo-bellota.webp" },
  { name: "Bticino", src: "/logo-bticino.webp" },
  { name: "Tubrica", src: "/logo-tubrica.webp" },
  { name: "Manpica", src: "/logo-manpica.webp" },
  { name: "Cebra", src: "/logo-cebra.webp" },
  { name: "Venceramica", src: "/logo-venceramica.webp" },
  { name: "Reinco", src: "/logo-reinco.webp" },
  { name: "Griven", src: "/logo-griven.webp" },
  { name: "Iconel", src: "/logo-iconel.webp" },
  { name: "Fermetal", src: "/logo-fermetal.webp" },
  { name: "Run", src: "/logo-run.webp" },
  { name: "Lumistar", src: "/logo-lumistar.webp" },
  { name: "Aquafina", src: "/logo-aquafina.webp" },
  { name: "Exxel", src: "/logo-exxel.webp" },
  { name: "Faguax", src: "/logo-faguax.webp" },
  { name: "Ferco", src: "/logo-ferco.webp" },
  { name: "Lincoln", src: "/logo-lincoln.webp" },
  { name: "Littmann", src: "/logo-littmann.webp" },
  { name: "Proxical", src: "/logo-proxical.webp" },
  { name: "Sergeca", src: "/logo-sergeca.webp" },
  { name: "PCP", src: "/logo-pcp.webp" },
  { name: "Bosch", src: "/logo-bosch.webp" },
  { name: "Termofusion", src: "/logo-termofusion.webp" },
  { name: "Vert", src: "/logo-vert.webp" },
  { name: "Zasc", src: "/logo-zasc.webp" },
  { name: "Protonic Electric", src: "/logo-protonic.webp" },
  { name: "Cobra", src: "/logo-cobra.webp" },
  { name: "Ceramipego", src: "/logo-ceramipego.webp" },
  { name: "Belt-G", src: "/logo-belt-g.webp" }
];

interface CompactConsumableCardProps {
  product: typeof PRODUCTS[0];
  rate: number;
  switchCount: number;
}

function CompactConsumableCard({ product, rate, switchCount }: CompactConsumableCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCart((state) => state.items);
  
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [addedQty, setAddedQty] = React.useState(0);

  const cartItem = React.useMemo(() => {
    return items.find((item) => item.product.id === product.id);
  }, [items, product.id]);

  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const threshold = product.volumeDiscount?.threshold || 5;
  const discountPrice = product.volumeDiscount?.discountPrice || product.price;
  const isVolumePrice = quantity >= threshold;
  const currentUnitPrice = isVolumePrice ? discountPrice : product.price;

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleSetBulk = () => {
    setQuantity(threshold);
  };

  const handleAdd = () => {
    addItem(product, quantity);
    setAddedQty(quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="group relative bg-slate-800 border border-slate-700/50 hover:bg-slate-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[240px] transition-all duration-200 shadow-sm flex-none w-[85vw] sm:w-[320px] md:w-auto snap-center md:snap-align-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-mono tracking-wider">SKU: {product.sku}</span>
          {quantityInCart > 0 && (
            <span className="text-[9px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
              {quantityInCart} en cesta
            </span>
          )}
        </div>
        <div>
          <h3 className="font-display text-xs font-bold text-slate-200 leading-snug group-hover:text-slate-100 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Volume Promo Banner */}
        {product.volumeDiscount && (
          <div className={`mt-1.5 p-2 rounded-lg text-[11px] leading-snug border transition-all duration-200 ${
            isVolumePrice 
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
              : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
          }`}>
            <div className="flex items-center justify-between gap-1">
              <span className="flex items-center gap-1 font-mono text-[9px]">
                <Tag className="h-3 w-3 text-emerald-400" />
                <span>Precio al Mayor ({threshold}+):</span>
              </span>
              <span className="font-bold text-slate-250 font-mono text-[10px]">
                {formatUSD(discountPrice)} c/u
              </span>
            </div>
            {!isVolumePrice && (
              <button 
                onClick={handleSetBulk}
                className="mt-1 text-[9px] font-mono font-bold text-[#0ee0d5] hover:underline uppercase block text-left cursor-pointer"
              >
                Activar Descuento al Mayor ({threshold} unidades)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-4 border-t border-slate-700/30 pt-3">
        {/* Quantity Controls & Dynamic Price Display */}
        <div className="flex items-center justify-between gap-2">
          {/* Price Preview */}
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Monto</span>
            <div key={switchCount} className="animate-blur-pop">
              <span className="font-display text-sm font-bold text-slate-100 font-mono">
                {formatUSD(currentUnitPrice * quantity)}
              </span>
              <br />
              <span className="text-[9px] text-slate-400 font-mono">
                ≈ {formatVES(currentUnitPrice * quantity * rate)}
              </span>
            </div>
          </div>

          {/* Interactive Qty Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-750 rounded-lg p-1">
            <button
              onClick={handleDecrease}
              className="h-7 w-7 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded flex items-center justify-center text-sm font-bold font-mono transition-colors cursor-pointer select-none"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-slate-200 select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="h-7 w-7 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded flex items-center justify-center text-sm font-bold font-mono transition-colors cursor-pointer select-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Add CTA */}
        {added ? (
          <button
            disabled
            className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider select-none shadow-md"
          >
            <Check className="h-3.5 w-3.5 stroke-[3px]" /> ¡Agregado +{addedQty}!
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full py-2 bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider select-none shadow-md cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3px]" /> Agregar Insumos
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  // Módulo 1: Retención Activa — cambia document.title al abandonar pestaña
  useAttentionGrabber();

  const cartItems = useCart((state) => state.items);
  const getTotals = useCartStore((state) => state.getTotals);
  const totals = getTotals();
  const rate = useBcvStore((state) => state.rate);
  const switchCount = useCurrencyStore((state) => state.switchCount);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleProjectClick = React.useCallback((category: string) => {
    setCategoryFilter(category);
    setSearchQuery(""); // Clear search query to show all category products
    // Scroll to catalog
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <>
      <div className="print:hidden">
        {/* Dynamic Navbar */}
        <Navbar onSearch={handleSearch} />

        {/* Dynamic Hero Section (Asymmetric + Búsqueda predominante) */}
        <HeroSlider searchQuery={searchQuery} onSearch={handleSearch} />

        {/* SECCIÓN 1: MarqueeTrust (Banda de Autoridad - Marquee Infinito) */}
        <section id="marcas" className="relative w-full py-6 border-t border-b border-slate-800 bg-slate-950/20 print:hidden overflow-hidden flex">
          <div className="w-full flex flex-col items-center">
            <p className="text-center text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-5">
              Distribuidores y Aliados Comerciales
            </p>
            
            <div className="overflow-hidden relative w-full flex">
              {/* Overlay gradients to fade out/in logos smoothly */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none" />
              <div className="flex animate-[scroll_150s_linear_infinite] hover:[animation-play-state:paused] gap-12 md:gap-16">
                
                {/* Primera lista */}
                <div className="flex items-center justify-around gap-12 md:gap-16 min-w-max shrink-0">
                  {BRANDS.map((brand, idx) => (
                    <div
                      key={`brand-1-${idx}`}
                      className="flex items-center justify-center h-8 md:h-12 w-24 md:w-32"
                    >
                      <img
                        src={brand.src}
                        alt={`Logo de ${brand.name}`}
                        className="object-contain w-auto h-12 grayscale brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>

                {/* Segunda lista (Duplicada para efecto infinito) */}
                <div className="flex items-center justify-around gap-12 md:gap-16 min-w-max shrink-0" aria-hidden="true">
                  {BRANDS.map((brand, idx) => (
                    <div
                      key={`brand-2-${idx}`}
                      className="flex items-center justify-center h-8 md:h-12 w-24 md:w-32"
                    >
                      <img
                        src={brand.src}
                        alt={`Logo de ${brand.name}`}
                        className="object-contain w-auto h-12 grayscale brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Main Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 mt-12 pb-24 md:pb-16 relative">

          {/* SECCIÓN 2: BentoProjectSelector (Comprar por Tipo de Proyecto) */}
          <section className="w-full py-2 border-b border-slate-800/80">
            <div className="flex flex-col gap-2 mb-8 text-center items-center">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                OBRAS Y PROYECTOS
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                Comprar por Tipo de Proyecto
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Selecciona la especialidad de tu obra para filtrar insumos certificados al instante.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Panel A: Construcción y Obra Pesada */}
              <div
                onClick={() => handleProjectClick("cableado")}
                className="group relative md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 cursor-pointer bg-slate-950 min-h-[350px] flex flex-col justify-end p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-55"
                  style={{ backgroundImage: "url('/cables-y-tubos.jpg')" }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2.5 max-w-xl">
                  <span className="self-start px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#0ee0d5] bg-[#0ee0d5]/10 border border-[#0ee0d5]/20 rounded uppercase">
                    Urbano / Industrial
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-slate-100 group-hover:text-[#0ee0d5] transition-colors duration-200">
                    Obras Civiles y Construcción Pesada
                  </h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    Canalización conduit de PVC autoextinguible, rollos de cable THHN de cobre electrolítico de alto calibre (10/12 AWG) y sistemas de distribución de potencia media.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                    Ver Catálogo de Material Pesado <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Panel B: Iluminación Vial y Comercial */}
              <div
                onClick={() => handleProjectClick("iluminacion")}
                className="group relative md:col-span-1 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 cursor-pointer bg-slate-950 min-h-[220px] flex flex-col justify-end p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-50"
                  style={{ backgroundImage: "url('/iluminaria-led.jpg')" }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="self-start px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded uppercase">
                    LED Eficiencia
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-100 group-hover:text-[#0ee0d5] transition-colors duration-200">
                    Iluminación Vial y Comercial
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    Reflectores IP66 de alta potencia, paneles empotrables y bombillos ahorradores para urbanismo y galpones.
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                    Ver Luminarias LED <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Panel C: Fuerza y Automatización */}
              <div
                onClick={() => handleProjectClick("control")}
                className="group relative md:col-span-1 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 cursor-pointer bg-slate-950 min-h-[220px] flex flex-col justify-end p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 opacity-50"
                  style={{ backgroundImage: "url('/breakers.jpg')" }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="self-start px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded uppercase">
                    Control & Fuerza
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-100 group-hover:text-[#0ee0d5] transition-colors duration-200">
                    Fuerza y Control Industrial
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    Tableros eléctricos para empotrar, interruptores termomagnéticos (breakers QO) y dispositivos de maniobra.
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                    Ver Sistemas de Control <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: FlashVolumeRotator (Compra Rápida de Consumibles) */}
          <section className="w-full py-2 border-b border-slate-800/80">
            <div className="flex flex-col gap-2 mb-8 text-center items-center">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                <Sparkles className="h-3 w-3 text-[#0ee0d5]" /> MAYORISTAS Y CONTRATISTAS
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100 text-center">
                    ⚡ Consumibles Básicos de Obra
                  </h2>
                  <p className="text-xs text-slate-400 text-center max-w-xl">
                    Ahorra en insumos de alta rotación. Agrega paquetes completos con precios especiales por volumen a un solo clic.
                  </p>
                </div>
                <span className="md:hidden flex items-center gap-1 text-[9px] font-mono font-bold text-[#0ee0d5] uppercase tracking-wider bg-slate-950/40 border border-slate-800 px-2.5 py-1 rounded-full shrink-0 select-none animate-pulse">
                  Desliza ➔
                </span>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-4 px-4 md:px-0 md:grid md:grid-cols-3 md:overflow-visible pb-8 snap-x snap-mandatory scroll-smooth scrollbar-hide">
              {PRODUCTS.filter(p => ["prod-10", "prod-11", "prod-12"].includes(p.id)).map(product => (
                <CompactConsumableCard key={product.id} product={product} rate={rate} switchCount={switchCount} />
              ))}
            </div>
          </section>

          {/* 04. PROCESO DE COMPRA (Banda / Strip horizontal flexible layout container) */}
          <section className="relative z-10 w-full border-t border-b border-slate-800 bg-slate-950/20 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* Step 1 */}
              <div className="flex flex-col gap-3.5 items-center text-center">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 01</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Eliges Insumos</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1 max-w-xs">
                    Explora nuestro catálogo con precios y tasas oficiales BCV en tiempo real.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col gap-3.5 items-center text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 02</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Checkout Híbrido</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1 max-w-xs">
                    Fracciona tu pago combinando efectivo, zelle, pago móvil o transferencias.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-3.5 items-center text-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 03</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Despacho Exprés</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1 max-w-xs">
                    Confirma al WhatsApp y retira en tienda física o recibe vía delivery local.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 05. PRODUCTOS DESTACADOS (Grid Catálogo) */}
          <div className="relative z-10">
            <div className="flex flex-col gap-2 mb-6 text-center items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100 text-center">
                    Catálogo de Materiales
                  </h2>
                  <p className="text-xs text-slate-450 text-center max-w-xl">
                    Precios dinámicos liquidados en dólares o bolívares al cambio del Banco Central.
                  </p>
                </div>
                <span className="md:hidden flex items-center gap-1 text-[9px] font-mono font-bold text-[#0ee0d5] uppercase tracking-wider bg-slate-950/40 border border-slate-800 px-2.5 py-1 rounded-full shrink-0 select-none animate-pulse">
                  Desliza ➔
                </span>
              </div>
            </div>
            <ProductGrid searchQuery={searchQuery} categoryFilter={categoryFilter} onCategoryFilterChange={setCategoryFilter} />

            {/* NEW "VER TODO" ACTION CATCHER */}
            <div className="flex justify-center mt-12 mb-20">
              <button
                onClick={() => {
                  handleSearch("");
                  setCategoryFilter("all");
                }}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 border border-slate-800 bg-slate-950/30 rounded-lg transition-all duration-200 hover:bg-slate-850 hover:text-slate-100 hover:border-slate-700 cursor-pointer"
              >
                Ver Catálogo de Suministros completo <span className="transition-transform duration-200 group-hover:translate-x-1">➔</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN DE UBICACIÓN INTERACTIVA (SEO Local & Tienda Física) */}
          <section id="ubicacion" className="relative z-10 w-full flex flex-col gap-6 py-4 print:hidden text-center items-center">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Presencia Física & SEO Local
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100 text-center">
                Centro de Distribución y Tienda Física
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-slate-900 border border-slate-700/60 rounded-2xl p-6 items-stretch shadow-lg">
              {/* Columna Izquierda (Datos SEO y Atención) */}
              <div className="md:col-span-5 flex flex-col justify-between gap-6 text-center items-center">
                <div className="flex flex-col gap-4 items-center w-full">
                  <div className="flex items-center justify-center gap-3 flex-wrap w-full">
                    <h3 className="font-display text-lg font-bold text-slate-100 uppercase tracking-tight text-center">
                      SUMINISTROS L&D 2023, C.A.
                    </h3>
                    <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/40 border border-emerald-800 text-emerald-400 select-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Operativo - Tienda Abierta
                    </span>
                  </div>
 
                  <div className="flex flex-col gap-5 mt-2 items-center w-full">
                    {/* Ubicación */}
                    <div className="flex flex-col gap-2 items-center text-center">
                      <MapPin className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">📍 Ubicación Física</span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          Calle 15 Miranda, frente al Concejo, Charallave. Municipio Cristóbal Rojas, Estado Miranda. Venezuela 1210.
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1 max-w-sm">
                          Ubicados en la zona céntrica comercial, ven y verifica todos nuestros conectores e iluminación LED en el mostrador.
                        </p>
                      </div>
                    </div>
 
                    {/* Horario */}
                    <div className="flex flex-col gap-2 items-center text-center">
                      <Clock className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">🕒 Horario Industrial</span>
                        <p className="text-xs text-slate-200 font-mono font-bold">
                          Lunes a Sábado: 8:00 AM – 5:00 PM.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/584141025386?text=Hola%20Suministros%20L%26D.%20Deseo%20hacer%20una%20consulta%20directa%20a%20la%20tienda%20f%C3%ADsica."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0ee0d5] text-slate-900 hover:bg-[#12f0e4] hover:opacity-90 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  Hablar con Asesor en Tienda
                </a>
              </div>

              {/* Columna Derecha (El Mapa) */}
              <div className="md:col-span-7">
                <div className="relative w-full h-full min-h-[320px] overflow-hidden rounded-xl border border-slate-800">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.191516983365!2d-66.86194539070132!3d10.246132532297272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2aef002d2bc151%3A0x31421bc29607a6a9!2sSUMINISTROS%20L%26D%202023!5e0!3m2!1ses!2sve!4v1782491638989!5m2!1ses!2sve"
                    className="w-full h-full border-0 grayscale-[50%] contrast-[90%] invert-0 dark:opacity-80 filter brightness-[75%]"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Google Maps - Suministros L&D"
                  />
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
}
