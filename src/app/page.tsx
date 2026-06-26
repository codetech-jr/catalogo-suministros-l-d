"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import FinancialBanner from "@/components/layout/FinancialBanner";
import Footer from "@/components/layout/Footer";

import ProductGrid from "@/components/product/ProductGrid";
import CartDrawer from "@/components/cart/CartDrawer";
import HeroSlider from "@/components/layout/HeroSlider";
import { CheckCircle, Banknote, Truck, ArrowRight, Sparkles, FileText, Calendar, UploadCloud, Plus, Check, Tag } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart, useCartStore } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";

interface CompactConsumableCardProps {
  product: typeof PRODUCTS[0];
  rate: number;
}

function CompactConsumableCard({ product, rate }: CompactConsumableCardProps) {
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
    <div className="group relative bg-slate-800 border border-slate-700/50 hover:bg-slate-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[240px] transition-all duration-200 shadow-sm">
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
                <span>B2B Mayorista ({threshold}+):</span>
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
            <span className="font-display text-sm font-bold text-slate-100 font-mono">
              {formatUSD(currentUnitPrice * quantity)}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              ≈ {formatVES(currentUnitPrice * quantity * rate)}
            </span>
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

  // States for B2B Final CTA Form
  const [b2bCompany, setB2bCompany] = React.useState("");
  const [b2bProject, setB2bProject] = React.useState("");
  const [b2bContact, setB2bContact] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [showScheduler, setShowScheduler] = React.useState(false);
  const [selectedVisitDate, setSelectedVisitDate] = React.useState("");
  const [selectedVisitTime, setSelectedVisitTime] = React.useState("");

  const cartItems = useCart((state) => state.items);
  const getTotals = useCartStore((state) => state.getTotals);
  const totals = getTotals();
  const rate = useBcvStore((state) => state.rate);

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

  const handleB2BWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build text message
    let text = `Hola Suministros L&D. Deseo realizar una cotización corporativa para un proyecto.\n\n`;
    
    if (b2bCompany) text += `*Empresa / RIF:* ${b2bCompany}\n`;
    if (b2bProject) text += `*Proyecto/Obra:* ${b2bProject}\n`;
    if (b2bContact) text += `*Contacto:* ${b2bContact}\n`;
    
    if (uploadedFile) {
      text += `*Archivo Adjunto (cargado en web):* ${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)} KB)\n`;
    }
    
    if (selectedVisitDate && selectedVisitTime) {
      text += `*Visita Técnica Solicitada:* ${selectedVisitDate} - ${selectedVisitTime}\n`;
    }

    if (cartItems.length > 0) {
      text += `\n*Materiales del Carrito (${cartItems.length} items):*\n`;
      cartItems.forEach(item => {
        text += `- ${item.product.name} x ${item.quantity} unds. (Ref: ${formatUSD(item.activePrice)} c/u)\n`;
      });
      text += `*Monto Estimado:* ${formatUSD(totals.totalUsd)} / ≈ ${formatVES(totals.totalVES)} (Tasa BCV)\n`;
    }
    
    text += `\nPor favor, un asesor comercial póngase en contacto conmigo.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/584141025386?text=${encodedText}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="print:hidden">
        {/* Dynamic Navbar */}
        <Navbar onSearch={handleSearch} />

        {/* Financial info banners */}
        <FinancialBanner />

        {/* Dynamic Hero Section (Asymmetric + Búsqueda predominante) */}
        <HeroSlider searchQuery={searchQuery} onSearch={handleSearch} />

        {/* SECCIÓN 1: MarqueeTrust (Banda de Autoridad) */}
        <section className="w-full py-6 border-t border-b border-slate-800 bg-slate-950/20 print:hidden overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-5">
              Distribuidores y Aliados Comerciales
            </p>
            <div className="flex flex-wrap justify-around items-center gap-8 md:gap-12 opacity-40 hover:opacity-100 transition-all duration-300">
              {/* Logo 3M */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-6 w-auto" viewBox="0 0 80 40" fill="currentColor">
                  <path d="M10 5h20c5.5 0 10 4.5 10 10c0 3.3-1.6 6.2-4.1 8c2.5 1.8 4.1 4.7 4.1 8c0 5.5-4.5 10-10 10H10V5zm10 12h10c1.7 0 3-1.3 3-3s-1.3-3-3-3H20v6zm0 14h10c1.7 0 3-1.3 3-3s-1.3-3-3-3H20v6z M45 5h10l7.5 15L70 5h10v30h-8V15l-9.5 19h-5L38 15v20h-8V5z" />
                </svg>
              </div>
              {/* Logo Philips */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-4.5 w-auto" viewBox="0 0 120 25" fill="currentColor">
                  <path d="M0 0h12c4 0 6 2 6 5s-2 5-6 5H4v10H0V0zm4 4v4h8c2 0 3-1 3-2s-1-2-3-2H4z M24 0h4v8h8V0h4v20h-4v-8h-8v8h-4V0z M48 0h4v20h-4V0z M60 0h4v16h8v4H60V0z M78 0h4v20h-4V0z M90 0h12c4 0 6 2 6 5s-2 5-6 5H94v10h-4V0zm4 4v4h8c2 0 3-1 3-2s-1-2-3-2H94z M118 4h-8v3c0 2 6 1 6 5v4c0 3-3 4-6 4h-8v-4h8c0-1-6 0-6-4V8c0-3 3-4 6-4h8v4z" />
                </svg>
              </div>
              {/* Logo Siemens */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-4.5 w-auto" viewBox="0 0 160 30" fill="currentColor">
                  <path d="M15 5h-10v5c0 3 8 2 8 8v7c0 4-4 5-8 5H0v-6h10c0-2-8-1-8-7V10c0-4 4-5 8-5h15v6z M20 5h6v20h-6V5z M32 5h14v5H38v3h6v5h-6v3h8v4H32V5z M52 5h6l5 12 5-12h6v20h-5V10l-4.5 10h-3L57 10v15h-5V5z M80 5h14v5H86v3h6v5h-6v3h8v4H80V5z M100 5h5l10 13V5h5v20h-5l-10-13v13h-5V5z M140 5h-10v5c0 3 8 2 8 8v7c0 4-4 5-8 5h-7v-6h10c0-2-8-1-8-7V10c0-4 4-5 8-5h15v6z" />
                </svg>
              </div>
              {/* Logo ABB */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-5.5 w-auto" viewBox="0 0 100 30" fill="currentColor">
                  <path d="M5 25 L12 5 H18 L25 25 H19 L17 20 H13 L11 25 H5 Z M14.5 15 H15.5 L15 11 Z M30 5 H40 C44 5 46 7 46 9.5 C46 11.5 44.5 13 42.5 13.5 C45 14 46.5 15.5 46.5 18 C46.5 21 44 25 40 25 H30 V5 Z M35 12 H39 C40.5 12 41.5 11.5 41.5 10 C41.5 8.5 40.5 8 39 8 H35 V12 Z M35 22 H39.5 C41 22 42 21 42 19.5 C42 18 41 17 39.5 17 H35 V22 Z M52 5 H62 C66 5 68 7 68 9.5 C68 11.5 66.5 13 64.5 13.5 C67 14 68.5 15.5 68.5 18 C68.5 21 66 25 62 25 H52 V5 Z M57 12 H61 C62.5 12 63.5 11.5 63.5 10 C63.5 8.5 62.5 8 61 8 H57 V12 Z M57 22 H61.5 C63 22 64 21 64 19.5 C64 18 63 17 61.5 17 H57 V22 Z" />
                </svg>
              </div>
              {/* Logo Bticino */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-5.5 w-auto" viewBox="0 0 120 30" fill="currentColor">
                  <path d="M5 5 H15 C18 5 20 6.5 20 8.5 C20 10 19 11 17.5 11.5 C19.5 12 20.5 13.5 20.5 15.5 C20.5 18 18 20 15 20 H5 V5 Z M9 10 H14 C15 10 15.5 9.5 15.5 9 C15.5 8.5 15 8 14 8 H9 V10 Z M9 17 H14 C15 17 16 16.5 16 16 C16 15.5 15 15 14 15 H9 V17 Z M26 3 H29 V8 H33 V11 H29 V18 C29 19 29.5 19.5 30.5 19.5 H33 V22 H30 C27.5 22 26 20.5 26 18 V11 H24 V8 H26 V3 Z" />
                  <rect x="37" y="3" width="3" height="3" />
                  <rect x="37" y="8" width="3" height="14" />
                  <path d="M54 11 H48 V16 H54 V19 H48 C45 19 44 17 44 14.5 C44 12 45 10 48 10 H54 V11 Z" />
                  <rect x="58" y="3" width="3" height="3" />
                  <rect x="58" y="8" width="3" height="14" />
                  <path d="M66 8 H69 V10 C70 9 71 8 73 8 C76 8 77 9.5 77 12.5 V22 H74 V13 C74 11.5 73.5 11 72.5 11 C71 11 70 12 70 14.5 V22 H66 V8 Z M82 14.5 C82 11.5 84 9.5 87 9.5 C90 9.5 92 11.5 92 14.5 C92 17.5 90 19.5 87 19.5 C84 19.5 82 17.5 82 14.5 Z M85 14.5 C85 16 85.5 17 87 17 C88.5 17 89 16 89 14.5 C89 13 88.5 12 87 12 C85.5 12 85 13 85 14.5 Z" />
                </svg>
              </div>
              {/* Logo Schneider */}
              <div className="text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center">
                <svg className="h-4.5 w-auto" viewBox="0 0 150 25" fill="currentColor">
                  <path d="M10 3 H4 V6 C4 8 10 7 10 10 V12 C10 14 8 15 5 15 H0 V12 H5 C5 11 0 11 0 9 V6 C0 4 2 3 5 3 H10 V3 Z M22 6 H16 V11 H22 V13 H16 C13.5 13 12.5 11.5 12.5 9.5 C12.5 7.5 13.5 6 16 6 H22 V6 Z M26 0 H29 V6 C30 5 31.5 4.5 33 4.5 C36 4.5 37 6 37 9 V15 H34 V9.5 C34 8 33.5 7.5 32.5 7.5 C31 7.5 30 8.5 30 11 V15 H26 V0 Z M42 4.5 H45 V6.5 C46.5 5 48 4.5 49.5 4.5 C52.5 4.5 53.5 6 53.5 9 V15 H50.5 V9.5 C50.5 8 50 7.5 49 7.5 C47.5 7.5 46.5 8.5 46.5 11 V15 H42.5 V4.5 Z M66 9.5 H59 C59 11 59.5 12 61 12 C62.5 12 63.5 11 64 10.5 L66 12 C64.5 13.5 63 15 60.5 15 C57.5 15 56 13 56 9.5 C56 6.5 58.5 4.5 61 4.5 C64 4.5 66 6.5 66 9.5 Z M59 8 H63 C63 6.8 62.5 6 61 6 C59.5 6 59 6.8 59 8 Z M70 0h3v3h-3z M70 4.5h3v10.5h-3z M83 0 H86 V15 H83 V13 C81.5 14.5 80 15 78.5 15 C75.5 15 74.5 13 74.5 9.5 C74.5 6 75.5 4.5 78.5 4.5 C80 4.5 81.5 5 83 6.5 V0 Z M77.5 9.5 C77.5 11.5 78 12.5 79.5 12.5 C81 12.5 82.5 11.5 82.5 9.5 C82.5 7.5 81 6.5 79.5 6.5 C78 6.5 77.5 7.5 77.5 9.5 Z M99 9.5 H92 C92 11 92.5 12 94 12 C95.5 12 96.5 11 97 10.5 L99 12 C97.5 13.5 96 15 93.5 15 C90.5 15 89 13 89 9.5 C89 6.5 91.5 4.5 94 4.5 C97 4.5 99 6.5 99 9.5 Z M92 8 H96 C96 6.8 95.5 6 94 6 C92.5 6 92 6.8 92 8 Z M104 4.5 H107 V6.5 C108 5 109.5 4.5 110.5 4.5 V7.5 C109.5 7.5 108 8 107 9.5 V15 H104 V4.5 Z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Main Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12 mt-12 pb-16 relative">

          {/* SECCIÓN 2: BentoProjectSelector (Comprar por Tipo de Proyecto) */}
          <section className="w-full py-2 border-b border-slate-800/80">
            <div className="flex flex-col gap-2 mb-8">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Soluciones B2B
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                Comprar por Tipo de Proyecto
              </h2>
              <p className="text-xs text-slate-400">
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
            <div className="flex flex-col gap-2 mb-8">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#0ee0d5]" /> Alta Rotación B2B
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                ⚡ Consumibles Básicos de Obra
              </h2>
              <p className="text-xs text-slate-400">
                Ahorra en insumos de alta rotación. Agrega paquetes completos con precios especiales por volumen a un solo clic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRODUCTS.filter(p => ["prod-10", "prod-11", "prod-12"].includes(p.id)).map(product => (
                <CompactConsumableCard key={product.id} product={product} rate={rate} />
              ))}
            </div>
          </section>

          {/* 04. PROCESO DE COMPRA (Banda / Strip horizontal flexible layout container) */}
          <section className="relative z-10 w-full border-t border-b border-slate-800 bg-slate-950/20 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {/* Step 1 */}
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 01</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Eliges Insumos</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1">
                    Explora nuestro catálogo con precios y tasas oficiales BCV en tiempo real.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-3.5 items-start border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 02</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Checkout Híbrido</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1">
                    Fracciona tu pago combinando efectivo, zelle, pago móvil o transferencias.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3.5 items-start border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Paso 03</span>
                  <h3 className="text-xs font-bold text-slate-200 mt-1">Despacho Exprés</h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed mt-1">
                    Confirma al WhatsApp y retira en tienda física o recibe vía delivery local.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 05. PRODUCTOS DESTACADOS (Grid Catálogo) */}
          <div className="relative z-10">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100">
                Catálogo de Materiales
              </h2>
              <p className="text-xs text-slate-450">
                Precios dinámicos liquidados en dólares o bolívares al cambio del Banco Central.
              </p>
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

          {/* SECCIÓN 4: MegaCTABusiness (Atrapador final corporativo B2B) */}
          <section className="relative z-10 w-full rounded-2xl bg-slate-950/30 border-t border-b md:border-b-0 border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-stretch border-t-[#0ee0d5]/30 shadow-[0_-8px_30px_rgba(14,224,213,0.04)]">
            {/* Left side: CTAs / Interactive */}
            <div className="flex-grow flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className="self-start px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#0ee0d5] bg-[#0ee0d5]/10 border border-[#0ee0d5]/20 rounded uppercase">
                  Proyectos & Licitaciones
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100 leading-tight">
                  ¿Tienes una obra civil o proyecto eléctrico grande?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                  Optimiza costos y tiempos de entrega. Envía tu listado de materiales en Excel o planos eléctricos para recibir una cotización formal firmada en menos de 2 horas. También puedes solicitar una visita técnica certificada en sitio.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-3">
                  {/* File Upload Button */}
                  <label className="relative inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#0ee0d5] hover:bg-[#12f0e4] rounded-lg transition-all duration-200 active:scale-98 shadow-sm cursor-pointer select-none">
                    <UploadCloud className="h-4 w-4" />
                    <span>{uploadedFile ? "Cambiar Archivo" : "Subir Lista de Materiales"}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx,.xls,.pdf,.dwg" 
                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    />
                  </label>

                  {/* Visit scheduler toggle */}
                  <button
                    type="button"
                    onClick={() => setShowScheduler(!showScheduler)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-350 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-slate-100 rounded-lg transition-all duration-200 active:scale-98 cursor-pointer select-none"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{selectedVisitDate ? "Editar Visita" : "Agendar Visita en Obra"}</span>
                  </button>
                </div>

                {/* Display states */}
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2 rounded-lg max-w-md">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span className="truncate">✓ Archivo: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)</span>
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="text-red-400 hover:text-red-300 ml-auto font-bold px-1"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Visit Scheduler Inline Component */}
                {showScheduler && (
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 max-w-md text-left flex flex-col gap-3.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#0ee0d5]" /> Agenda de Visita Técnica
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowScheduler(false)}
                        className="text-[10px] font-mono text-slate-500 hover:text-slate-350 cursor-pointer"
                      >
                        [ Cerrar ]
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1">Día Solicitado</label>
                        <select 
                          value={selectedVisitDate} 
                          onChange={(e) => setSelectedVisitDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0ee0d5] font-mono"
                        >
                          <option value="">-- Elegir Día --</option>
                          <option value="Lunes 29/06">Lunes 29/06</option>
                          <option value="Martes 30/06">Martes 30/06</option>
                          <option value="Miércoles 01/07">Miércoles 01/07</option>
                          <option value="Jueves 02/07">Jueves 02/07</option>
                          <option value="Viernes 03/07">Viernes 03/07</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1">Bloque Horario</label>
                        <select 
                          value={selectedVisitTime} 
                          onChange={(e) => setSelectedVisitTime(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#0ee0d5] font-mono"
                        >
                          <option value="">-- Elegir Hora --</option>
                          <option value="Mañana (8:00 AM - 12:00 PM)">Mañana (8:00 AM - 12:00 PM)</option>
                          <option value="Tarde (1:00 PM - 5:00 PM)">Tarde (1:00 PM - 5:00 PM)</option>
                        </select>
                      </div>
                    </div>
                    {selectedVisitDate && selectedVisitTime ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/30 p-2 rounded">
                        <span>✓ Visita pre-agendada para el {selectedVisitDate} en la {selectedVisitTime.split(" ")[0].toLowerCase()}.</span>
                      </div>
                    ) : (
                      <p className="text-[9px] text-slate-500 italic">
                        *La visita técnica se realiza en sitio para levantamiento de planos y validación física.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Form / Capture */}
            <div className="w-full md:w-[360px] bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="font-display text-sm font-bold text-slate-200">
                  Formulario de Cotización Rápida
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Completa los campos para estructurar tu cotización y despacharla por WhatsApp.
                </p>
              </div>

              <form onSubmit={handleB2BWhatsAppSubmit} className="flex flex-col gap-3 flex-1 justify-center">
                <div>
                  <label htmlFor="b2b-company" className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Empresa / RIF
                  </label>
                  <input 
                    id="b2b-company"
                    type="text" 
                    placeholder="Ej: Constructora Metrópolis, C.A. / J-12345678-9" 
                    value={b2bCompany}
                    onChange={(e) => setB2bCompany(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-750 focus:border-[#0ee0d5] text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="b2b-project" className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nombre de la Obra / Ubicación
                  </label>
                  <input 
                    id="b2b-project"
                    type="text" 
                    placeholder="Ej: Residencias El Parque - El Hatillo" 
                    value={b2bProject}
                    onChange={(e) => setB2bProject(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-750 focus:border-[#0ee0d5] text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="b2b-contact" className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nombre del Contacto
                  </label>
                  <input 
                    id="b2b-contact"
                    type="text" 
                    placeholder="Ej: Ing. Carlos Pérez" 
                    value={b2bContact}
                    onChange={(e) => setB2bContact(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-750 focus:border-[#0ee0d5] text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs transition-colors focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-slate-150 hover:bg-slate-200 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Solicitar Cotización por WhatsApp
                </button>
              </form>
            </div>
          </section>

        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Global Shopping Cart Side Drawer */}
      <CartDrawer />
    </>
  );
}
