"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  MapPin,
  CreditCard,
  Store,
  Truck,
  Send,
  ShieldCheck,
  Percent,
  Copy,
  Camera,
  Zap
} from "lucide-react";
import { useCart } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { useDrawerStore } from "@/store/drawer-store";
import { CheckoutForm, PaymentMethod } from "@/types/checkout";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/utils/build-whatsapp-message";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

// Teléfono WhatsApp Business corporativo
const CORPORATE_WHATSAPP_PHONE = "584120000000";

const MOCK_ACCOUNTS = {
  pago_movil: {
    bank: "Banesco (0134)",
    phone: "04141025386",
    id: "J-50367899-0",
  },
  zelle: {
    email: "pagos@suministroslyd.com",
    holder: "Suministros L&D 2023, C.A.",
  },
  binance: {
    payId: "987654321",
    alias: "SuministrosLD",
  },
  transferencia: {
    bank: "Banco Ficticio",
    number: "0134-1234-56-1234567890",
    holder: "Suministros L&D 2023, C.A.",
    id: "J-50367899-0",
  },
};

export function CartDrawer() {
  const { isOpen, closeDrawer } = useDrawerStore();
  const { items, updateQuantity, removeItem, getTotals, clearCart } = useCart((state) => state);
  const rate = useBcvStore((state) => state.rate);

  const [step, setStep] = React.useState(1);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [isQuoteOnly, setIsQuoteOnly] = React.useState(false);
  const budgetCode = React.useMemo(() => Math.floor(100000 + Math.random() * 900000), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Multi-payment / split payment states
  const [splitPayments, setSplitPayments] = React.useState<{ method: PaymentMethod; amountUsd: number; ref: string }[]>([]);
  const [newSplitMethod, setNewSplitMethod] = React.useState<PaymentMethod>("pago_movil");
  const [newSplitAmount, setNewSplitAmount] = React.useState<string>("");
  const [newSplitRef, setNewSplitRef] = React.useState<string>("");

  // Checkout Form State
  const [form, setForm] = React.useState<CheckoutForm>({
    fullName: "",
    rifOrId: "",
    phone: "",
    deliveryType: "retiro",
    deliveryAddress: "",
    paymentMethod: "pago_movil",
    paymentReference: "",
  });

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Resetear estados al cerrar o cambiar método
  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({});
      setCopiedField(null);
      setSplitPayments([]);
      setNewSplitAmount("");
      setNewSplitRef("");
      setIsQuoteOnly(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (form.paymentMethod !== "mixto") {
      setSplitPayments([]);
    }
  }, [form.paymentMethod]);

  const totals = getTotals(rate);
  const totalVES = totals.totalUsd * rate;

  const isPaymentRefValid = React.useMemo(() => {
    if (isQuoteOnly) return true;
    if (form.paymentMethod === "efectivo" || form.paymentMethod === "efectivo_bs") return true;
    if (form.paymentMethod === "mixto") {
      const totalPaid = splitPayments.reduce((sum, p) => sum + p.amountUsd, 0);
      const isBalanced = Math.abs(totals.totalUsd - totalPaid) < 0.01;
      const allRefsValid = splitPayments.length > 0 && splitPayments.every(
        (p) => p.method === "efectivo" || p.method === "efectivo_bs" || p.ref.trim().length >= 6
      );
      return isBalanced && allRefsValid;
    }
    return form.paymentReference.trim().length === 6;
  }, [form.paymentMethod, form.paymentReference, splitPayments, totals.totalUsd, isQuoteOnly]);

  if (!mounted) return null;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Nombre o Razón Social es requerido";
    if (!form.rifOrId.trim()) newErrors.rifOrId = "Cédula o RIF es requerido";
    if (!form.phone.trim()) newErrors.phone = "Número de teléfono es requerido";

    if (form.deliveryType !== "retiro" && !form.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Dirección de despacho es requerida";
    }

    if (!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && form.paymentMethod !== "mixto") {
      const ref = form.paymentReference.trim();
      if (!ref) {
        newErrors.paymentReference = "Número de referencia es requerido";
      } else if (!/^\d{6}$/.test(ref)) {
        newErrors.paymentReference = "La referencia debe tener exactamente 6 dígitos numéricos";
      }
    }

    if (!isQuoteOnly && form.paymentMethod === "mixto") {
      const totalPaid = splitPayments.reduce((sum, p) => sum + p.amountUsd, 0);
      const isBalanced = Math.abs(totals.totalUsd - totalPaid) < 0.01;
      const allRefsValid = splitPayments.every((p) => p.method === "efectivo" || p.method === "efectivo_bs" || p.ref.trim().length >= 6);

      if (!isBalanced) {
        newErrors.paymentReference = `El abono total debe igualar exactamente el monto del carrito (${formatUSD(totals.totalUsd)}).`;
      } else if (!allRefsValid) {
        newErrors.paymentReference = "Todas las referencias de abonos deben tener mínimo 6 dígitos.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToStep2 = () => {
    if (items.length > 0) {
      setStep(2);
    }
  };

  const handleProceedToStep3 = () => {
    if (validateForm()) {
      setStep(3);
    }
  };

  const handleConfirmOrder = () => {
    const text = buildWhatsAppMessage(
      items,
      form,
      rate,
      {
        subtotal: totals.subtotalUsd,
        total: totals.totalUsd,
        savings: totals.savingsUsd,
      },
      splitPayments,
      isQuoteOnly
    );
    const link = getWhatsAppLink(CORPORATE_WHATSAPP_PHONE, text);

    window.open(link, "_blank");

    clearCart();
    closeDrawer();
  };

  const handleCasheaWhatsapp = () => {
    const totalPaid = totals.totalUsd;
    const itemsList = items
      .map((item) => `• ${item.quantity}x ${item.product.name} (SKU: ${item.product.sku})`)
      .join("\n");

    const message = `👋 Hola Suministros L&D, mi lista va confirmada en app cart! Me dispongo y *Deseo comprar con modalidad y link código QR oficial de Cashea.* El resumen del equipo / lista unitario a escanear sería:\n\n${itemsList}\n\n- Total Cart de factura: ${formatUSD(totalPaid)}`;

    const encodedText = encodeURIComponent(message);
    const link = `https://wa.me/${CORPORATE_WHATSAPP_PHONE}?text=${encodedText}`;

    window.open(link, "_blank");
    clearCart();
    closeDrawer();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] overflow-hidden print:hidden">
        {/* Backdrop con desenfoque medio y opacidad balanceada */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/40 backdrop-blur-md cursor-pointer transition-opacity duration-200 z-[200]"
        />

        {/* Panel del Drawer con transición rápida y lineal sin rebote */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
          className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#0b0e14] border-l border-[#1b212f] shadow-none z-[200]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1b212f] px-4 py-4">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-[#1b212f] hover:text-cyan-400 transition-colors cursor-pointer"
                  aria-label="Volver al paso anterior"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <h2 className="font-display text-xs font-bold tracking-wider uppercase text-text-primary">
                {step === 1 && "Carrito de Compras"}
                {step === 2 && "Datos del Pedido"}
                {step === 3 && "Resumen y Confirmación"}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="rounded-lg p-1 text-text-secondary hover:bg-[#1b212f] hover:text-cyan-400 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {/* STEP 1: CART REVISION */}
            {step === 1 && (
              <>
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                    <svg
                      className="h-16 w-16 text-text-muted mb-4 opacity-40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                    <h3 className="font-display text-sm font-bold text-text-primary mb-1">
                      El carrito está vacío
                    </h3>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                      Agrega productos del catálogo para poder cotizar y enviar a WhatsApp.
                    </p>
                    <Button
                      onClick={closeDrawer}
                      variant="outline"
                      className="mt-5 border-[#e2e8f0] hover:bg-[#e2e8f0]/10 hover:text-white font-bold"
                    >
                      Volver al Catálogo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {items.map((item) => {
                      const isVolume = !!(
                        item.product.volumeDiscount &&
                        item.quantity >= item.product.volumeDiscount.threshold
                      );

                      return (
                        <div
                          key={item.product.id}
                          className="flex gap-3 items-center justify-between rounded-lg bg-[#0e1420] border border-[#1b212f] p-3 shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] text-text-muted font-mono font-medium tracking-wider">
                                {item.product.sku}
                              </span>
                              {isVolume && (
                                <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                                  AL MAYOR
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-text-primary truncate">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-mono font-bold text-cyan-400/90 tabular-nums">
                              {formatUSD(item.activePrice)} c/u
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            {/* Selector de cantidad */}
                            <div className="flex items-center bg-[#0b0e14] rounded border border-[#1b212f]">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-text-secondary hover:text-cyan-400 transition-colors cursor-pointer"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-1.5 text-xs font-mono font-bold text-text-primary min-w-[20px] text-center tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-text-secondary hover:text-cyan-400 transition-colors cursor-pointer"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Botón de eliminación */}
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-text-muted hover:text-danger p-1 cursor-pointer transition-colors"
                              aria-label="Eliminar artículo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING AND PAYMENTS */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                {/* 1. Datos cliente */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 my-1">
                    <span className="h-px bg-[#1b212f] flex-1" />
                    <h3 className="text-[9px] font-bold font-mono tracking-widest text-cyan-400 uppercase whitespace-nowrap">
                      Identificación
                    </h3>
                    <span className="h-px bg-[#1b212f] flex-1" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Nombre o Razón Social *</label>
                      <input
                        type="text"
                        placeholder="Ej: Inversiones Tuy, C.A."
                        value={form.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`flex w-full bg-slate-900 border ${
                          errors.fullName ? "border-rose-500 focus:ring-rose-500/25" : "border-slate-700/60 focus:border-[#0ee0d5] focus:ring-[#0ee0d5]/25"
                        } p-4 rounded-xl font-sans text-slate-100 outline-none focus:ring-1 transition-all text-sm placeholder:text-slate-500`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-rose-500 font-mono font-medium">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Cédula / RIF *</label>
                      <input
                        type="text"
                        placeholder="Ej: J-12345678-9 o V-12345678"
                        value={form.rifOrId}
                        onChange={(e) => handleInputChange("rifOrId", e.target.value)}
                        className={`flex w-full bg-slate-900 border ${
                          errors.rifOrId ? "border-rose-500 focus:ring-rose-500/25" : "border-slate-700/60 focus:border-[#0ee0d5] focus:ring-[#0ee0d5]/25"
                        } p-4 rounded-xl font-mono tracking-widest text-slate-100 outline-none focus:ring-1 transition-all text-sm placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-500`}
                      />
                      {errors.rifOrId && (
                        <p className="mt-1 text-xs text-rose-500 font-mono font-medium">{errors.rifOrId}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Teléfono Móvil *</label>
                      <input
                        type="tel"
                        placeholder="Ej: 04121234567"
                        value={form.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`flex w-full bg-slate-900 border ${
                          errors.phone ? "border-rose-500 focus:ring-rose-500/25" : "border-slate-700/60 focus:border-[#0ee0d5] focus:ring-[#0ee0d5]/25"
                        } p-4 rounded-xl font-sans text-slate-100 outline-none focus:ring-1 transition-all text-sm placeholder:text-slate-500`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-rose-500 font-mono font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Tipo despacho */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 my-1">
                    <span className="h-px bg-[#1b212f] flex-1" />
                    <h3 className="text-[9px] font-bold font-mono tracking-widest text-cyan-400 uppercase whitespace-nowrap">
                      Distribución
                    </h3>
                    <span className="h-px bg-[#1b212f] flex-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange("deliveryType", "retiro")}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        form.deliveryType === "retiro"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <Store className={`h-5 w-5 flex-shrink-0 transition-colors ${form.deliveryType === "retiro" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-200">Retiro en Tienda</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Charallave Centro - GRATIS</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange("deliveryType", "delivery_charallave")}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        form.deliveryType === "delivery_charallave"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <Truck className={`h-5 w-5 flex-shrink-0 transition-colors ${form.deliveryType === "delivery_charallave" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-200">Delivery Charallave</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Casco Central y aledaños - GRATIS</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange("deliveryType", "delivery_tuy")}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        form.deliveryType === "delivery_tuy"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <MapPin className={`h-5 w-5 flex-shrink-0 transition-colors ${form.deliveryType === "delivery_tuy" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-200">Flete Valles del Tuy</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Cúa, Ocumare, Santa Teresa - FLETE ADICIONAL</div>
                      </div>
                    </button>
                  </div>

                  {form.deliveryType !== "retiro" && (
                    <div className="flex flex-col gap-1.5 w-full mt-1.5">
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Dirección Completa de Entrega *</label>
                      <input
                        type="text"
                        placeholder="Av. Bolívar, Res. Tuy, Apto 4B, Charallave"
                        value={form.deliveryAddress}
                        onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                        className={`flex w-full bg-slate-900 border ${
                          errors.deliveryAddress ? "border-rose-500 focus:ring-rose-500/25" : "border-slate-700/60 focus:border-[#0ee0d5] focus:ring-[#0ee0d5]/25"
                        } p-4 rounded-xl font-sans text-slate-100 outline-none focus:ring-1 transition-all text-sm placeholder:text-slate-500`}
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-xs text-rose-500 font-mono font-medium">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Forma de Pago */}
                <div className="flex flex-col gap-3">
                  {/* Tarjeta con Checkbox interactivo 'Solo Cotizar' */}
                  <div
                    onClick={() => setIsQuoteOnly(!isQuoteOnly)}
                    className="bg-slate-800 rounded-lg p-4 cursor-pointer flex gap-4 items-center hover:bg-slate-800/80 transition-colors border border-slate-700/50 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isQuoteOnly}
                      onChange={(e) => {
                        e.stopPropagation();
                        setIsQuoteOnly(e.target.checked);
                      }}
                      className="h-4 w-4 rounded border-slate-750 bg-slate-900 text-cyan-400 focus:ring-cyan-500/25"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                        Generar solo Cotización / Presupuesto
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-normal">
                        Evita registrar datos de pago ahora. Ideal para cotizar precios corporativos.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 my-1">
                    <span className="h-px bg-[#1b212f] flex-1" />
                    <h3 className="text-[9px] font-bold font-mono tracking-widest text-cyan-400 uppercase whitespace-nowrap">
                      Forma de Pago
                    </h3>
                    <span className="h-px bg-[#1b212f] flex-1" />
                  </div>
                  <div className={`grid grid-cols-2 gap-2 transition-all duration-200 ${isQuoteOnly ? "opacity-30 pointer-events-none" : ""}`}>
                    <button
                      onClick={() => handleInputChange("paymentMethod", "pago_movil")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "pago_movil"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110 fill-current" viewBox="0 0 24 24" aria-label="Pago Móvil">
                        <path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm3 18a1 1 0 100-2 1 1 0 000 2zm-3-4h10V5H7v11z" />
                        <path d="M14 9l-2 2 2 2V9zM10 9v4l2-2-2-2z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Pago Móvil</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "zelle")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "zelle"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110 fill-current" viewBox="0 0 48 48" aria-label="Zelle">
                        <path d="M7 10h34v6L23.5 32H41v6H7v-6l17.5-16H7v-6z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Zelle</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "binance")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "binance"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110 fill-current" viewBox="0 0 20 20" aria-label="Binance">
                        <path d="M10 2L5 7l2 2 3-3 3 3 2-2-5-5zm0 14l-3-3-2 2 5 5 5-5-2-2-3 3zm-6-6l-2 2 2 2 2-2-2-2zm12 0l-2 2 2 2 2-2-2-2zm-6-2l-2 2 2 2 2-2-2-2z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Binance Pay</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "transferencia")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "transferencia"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Transferencia</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "efectivo")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "efectivo"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 10v4M10 12h4" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Efectivo USD</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "efectivo_bs")}
                      className={`group flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "efectivo_bs"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 10v4M10 12h4" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Efectivo Bs</span>
                    </button>

                    <button
                      onClick={() => handleInputChange("paymentMethod", "mixto")}
                      className={`group col-span-2 flex flex-col gap-1.5 p-3.5 rounded-xl border text-center items-center justify-center cursor-pointer transition-all duration-200 ${
                        form.paymentMethod === "mixto"
                          ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_12px_rgba(14,224,213,0.06)]"
                          : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <svg className="w-8 h-8 text-slate-200 opacity-90 transition-all duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-bold text-slate-200">Pago Mixto</span>
                    </button>
                  </div>

                  {/* Bank Account Details dynamically showing based on choice */}
                  {!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && form.paymentMethod !== "mixto" && (
                    <div className="p-3.5 rounded-lg border border-[#1b212f] bg-[#0e1420] flex flex-col gap-2.5 text-xs shadow-sm">
                      <span className="font-mono text-[9px] text-cyan-400 uppercase font-bold tracking-wider">
                        Cuentas Receptoras de Suministros L&D
                      </span>
                      
                      {form.paymentMethod === "pago_movil" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Banco:</span> {MOCK_ACCOUNTS.pago_movil.bank}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.pago_movil.bank, "pm-bank")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "pm-bank" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Teléfono:</span> {MOCK_ACCOUNTS.pago_movil.phone}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.pago_movil.phone, "pm-phone")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "pm-phone" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">RIF:</span> {MOCK_ACCOUNTS.pago_movil.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.pago_movil.id, "pm-id")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "pm-id" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {form.paymentMethod === "zelle" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Correo:</span> {MOCK_ACCOUNTS.zelle.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.zelle.email, "zelle-email")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "zelle-email" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Titular:</span> {MOCK_ACCOUNTS.zelle.holder}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.zelle.holder, "zelle-holder")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "zelle-holder" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {form.paymentMethod === "binance" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Binance Pay ID:</span> {MOCK_ACCOUNTS.binance.payId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.binance.payId, "binance-id")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "binance-id" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Alias:</span> {MOCK_ACCOUNTS.binance.alias}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.binance.alias, "binance-alias")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "binance-alias" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {form.paymentMethod === "transferencia" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Banco:</span> {MOCK_ACCOUNTS.transferencia.bank}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.transferencia.bank, "trans-bank")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "trans-bank" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Cuenta:</span> <span className="font-mono">{MOCK_ACCOUNTS.transferencia.number}</span></span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.transferencia.number, "trans-number")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "trans-number" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">Titular:</span> {MOCK_ACCOUNTS.transferencia.holder}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.transferencia.holder, "trans-holder")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "trans-holder" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-text-secondary">
                            <span><span className="text-text-muted">RIF:</span> {MOCK_ACCOUNTS.transferencia.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(MOCK_ACCOUNTS.transferencia.id, "trans-id")}
                              className="relative p-1 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={14} />
                              {copiedField === "trans-id" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 text-[9px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-10">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!isQuoteOnly && form.paymentMethod === "mixto" && (
                    <div className="p-3.5 rounded-lg border border-[#1b212f] bg-[#131923] flex flex-col gap-3 text-xs shadow-none">
                      <span className="font-mono text-[9px] text-cyan-400 uppercase font-bold tracking-wider">
                        Configuración de Pago Mixto
                      </span>
                      
                      {/* Bookkeeping stats */}
                      <div className="flex flex-col gap-1 bg-[#0b0e14]/40 border border-[#1b212f]/40 p-2.5 rounded font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Total Carrito:</span>
                          <span className="text-text-primary font-bold tabular-nums">{formatUSD(totals.totalUsd)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Abonado:</span>
                          <span className="text-success font-bold tabular-nums">
                            {formatUSD(splitPayments.reduce((sum, p) => sum + p.amountUsd, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-[#1b212f]/30 pt-1.5 mt-1 font-bold">
                          {(() => {
                            const totalPaid = splitPayments.reduce((sum, p) => sum + p.amountUsd, 0);
                            const remaining = totals.totalUsd - totalPaid;
                            if (Math.abs(remaining) < 0.01) {
                              return (
                                <>
                                  <span className="text-success">Estado:</span>
                                  <span className="text-success tracking-tight uppercase">Pago Cuadrado</span>
                                </>
                              );
                            } else if (remaining > 0) {
                              return (
                                <>
                                  <span className="text-cyan-400">Restante:</span>
                                  <span className="text-cyan-400 tabular-nums">Faltan: {formatUSD(remaining)}</span>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <span className="text-danger">Excedente:</span>
                                  <span className="text-danger tabular-nums font-bold">Sobra: {formatUSD(Math.abs(remaining))}</span>
                                </>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* Sub-payments list */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-text-muted font-bold font-mono uppercase tracking-wide">Abonos Registrados</span>
                        {splitPayments.length > 0 ? (
                          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {splitPayments.map((p, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-[#0e1420] border border-[#1b212f]/40 px-2 py-1.5 rounded text-[10px] font-mono">
                                <div className="flex-1 truncate">
                                  <span className="text-text-primary font-bold">
                                    {p.method === "pago_movil" && "PM"}
                                    {p.method === "zelle" && "Zelle"}
                                    {p.method === "binance" && "BinPay"}
                                    {p.method === "transferencia" && "Trans"}
                                    {p.method === "efectivo" && "Efec USD"}
                                    {p.method === "efectivo_bs" && "Efec Bs"}
                                  </span>
                                  <span className="text-text-muted mx-1">|</span>
                                  <span className="text-cyan-400 font-bold">{formatUSD(p.amountUsd)}</span>
                                  {p.method !== "efectivo" && p.method !== "efectivo_bs" && (
                                    <>
                                      <span className="text-text-muted mx-1">|</span>
                                      <span className="text-text-secondary truncate">Ref: {p.ref}</span>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSplitPayments(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-text-muted hover:text-danger p-0.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] text-text-muted italic text-center py-2 bg-[#0e1420]/30 border border-[#1b212f]/20 rounded">
                            No hay abonos agregados.
                          </div>
                        )}
                      </div>

                      {/* Sub-method Account details snippet */}
                      <div className="bg-[#0b0e14]/50 border border-[#1b212f]/30 p-2.5 rounded text-[10px] text-text-secondary flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                            Instrucciones del método
                          </span>
                          <span className="text-[9px] text-text-muted font-mono uppercase font-bold">
                            {newSplitMethod === "pago_movil" && "Pago Móvil"}
                            {newSplitMethod === "zelle" && "Zelle"}
                            {newSplitMethod === "binance" && "Binance"}
                            {newSplitMethod === "transferencia" && "Transferencia"}
                            {newSplitMethod === "efectivo" && "Efectivo USD"}
                            {newSplitMethod === "efectivo_bs" && "Efectivo Bs"}
                          </span>
                        </div>
                        {newSplitMethod === "pago_movil" && (
                          <div className="flex items-center justify-between">
                            <span>Banesco (0134) - {MOCK_ACCOUNTS.pago_movil.phone} - RIF: {MOCK_ACCOUNTS.pago_movil.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(`${MOCK_ACCOUNTS.pago_movil.bank} ${MOCK_ACCOUNTS.pago_movil.phone} ${MOCK_ACCOUNTS.pago_movil.id}`, "mixto-pm")}
                              className="relative p-0.5 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={12} />
                              {copiedField === "mixto-pm" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1 py-0.5 text-[8px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-20">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        {newSplitMethod === "zelle" && (
                          <div className="flex items-center justify-between">
                            <span>Zelle: {MOCK_ACCOUNTS.zelle.email} - {MOCK_ACCOUNTS.zelle.holder}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(`${MOCK_ACCOUNTS.zelle.email} ${MOCK_ACCOUNTS.zelle.holder}`, "mixto-zelle")}
                              className="relative p-0.5 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={12} />
                              {copiedField === "mixto-zelle" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1 py-0.5 text-[8px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-20">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        {newSplitMethod === "binance" && (
                          <div className="flex items-center justify-between">
                            <span>Pay ID: {MOCK_ACCOUNTS.binance.payId} - Alias: {MOCK_ACCOUNTS.binance.alias}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(`${MOCK_ACCOUNTS.binance.payId} ${MOCK_ACCOUNTS.binance.alias}`, "mixto-binance")}
                              className="relative p-0.5 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={12} />
                              {copiedField === "mixto-binance" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1 py-0.5 text-[8px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-20">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        {newSplitMethod === "transferencia" && (
                          <div className="flex items-center justify-between">
                            <span>{MOCK_ACCOUNTS.transferencia.bank} - Cta: {MOCK_ACCOUNTS.transferencia.number} - RIF: {MOCK_ACCOUNTS.transferencia.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(`${MOCK_ACCOUNTS.transferencia.bank} ${MOCK_ACCOUNTS.transferencia.number} ${MOCK_ACCOUNTS.transferencia.id}`, "mixto-trans")}
                              className="relative p-0.5 text-text-muted hover:text-cyan-400 transition-colors"
                            >
                              <Copy size={12} />
                              {copiedField === "mixto-trans" && (
                                <span className="absolute bottom-full right-0 mb-1 px-1 py-0.5 text-[8px] bg-cyan-500 text-black font-bold rounded shadow-lg whitespace-nowrap z-20">
                                  ¡Copiado!
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        {newSplitMethod === "efectivo" && (
                          <span>Se entrega efectivo USD directamente por taquilla.</span>
                        )}
                        {newSplitMethod === "efectivo_bs" && (
                          <span>Se entrega efectivo Bs directamente por taquilla.</span>
                        )}
                      </div>

                      {/* Mini Row Addition Form */}
                      <div className="flex flex-col gap-2 border-t border-[#1b212f]/40 pt-2.5">
                        <div className="flex gap-1.5">
                          <select
                            value={newSplitMethod}
                            onChange={(e) => {
                              setNewSplitMethod(e.target.value as PaymentMethod);
                              setNewSplitRef("");
                            }}
                            className="bg-[#0b0e14] border border-[#1b212f] rounded px-1.5 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan-400 font-mono w-[110px]"
                          >
                            <option value="pago_movil">Pago Móvil</option>
                            <option value="zelle">Zelle</option>
                            <option value="binance">Binance</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="efectivo">Efectivo USD</option>
                            <option value="efectivo_bs">Efectivo Bs</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="$0.00 Monto"
                            value={newSplitAmount}
                            onChange={(e) => setNewSplitAmount(e.target.value)}
                            className="bg-[#0b0e14] border border-[#1b212f] rounded px-1.5 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan-400 font-mono flex-1 min-w-[50px]"
                          />
                        </div>
                        
                        <div className="flex gap-1.5 items-center justify-between">
                          {newSplitMethod !== "efectivo" && newSplitMethod !== "efectivo_bs" ? (
                            <input
                              type="text"
                              placeholder="# Referencia (6+ dig)"
                              maxLength={12}
                              value={newSplitRef}
                              onChange={(e) => setNewSplitRef(e.target.value.replace(/\D/g, ""))}
                              className="bg-[#0b0e14] border border-[#1b212f] rounded px-1.5 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan-400 font-mono flex-1 min-w-[100px]"
                            />
                          ) : (
                            <div className="flex-1 text-[10px] text-text-muted italic px-2">Efectivo no requiere referencia</div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const amt = parseFloat(newSplitAmount);
                              if (isNaN(amt) || amt <= 0) return;
                              if (newSplitMethod !== "efectivo" && newSplitMethod !== "efectivo_bs" && newSplitRef.trim().length < 6) return;
                              setSplitPayments(prev => [
                                ...prev,
                                { method: newSplitMethod, amountUsd: amt, ref: (newSplitMethod === "efectivo" || newSplitMethod === "efectivo_bs") ? "" : newSplitRef.trim() }
                              ]);
                              setNewSplitAmount("");
                              setNewSplitRef("");
                            }}
                            disabled={
                              isNaN(parseFloat(newSplitAmount)) ||
                              parseFloat(newSplitAmount) <= 0 ||
                              (newSplitMethod !== "efectivo" && newSplitMethod !== "efectivo_bs" && newSplitRef.trim().length < 6)
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2.5 py-1 text-[10px] font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
                          >
                            Añadir Sub-Pago +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && form.paymentMethod !== "mixto" && (
                    <div className={`flex flex-col gap-1.5 w-full mt-1 transition-all duration-200 ${isQuoteOnly ? "opacity-40 pointer-events-none" : ""}`}>
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">
                        Número de Referencia Bancaria {isQuoteOnly ? "(Opcional)" : "*"}
                      </label>
                      <input
                        type="text"
                        disabled={isQuoteOnly}
                        placeholder={isQuoteOnly ? "No requerido para cotizar" : "Últimos 6 dígitos del comprobante"}
                        value={isQuoteOnly ? "" : form.paymentReference}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          handleInputChange("paymentReference", val);
                        }}
                        className={`flex w-full bg-slate-900 border ${
                          errors.paymentReference ? "border-rose-500 focus:ring-rose-500/25" : "border-slate-700/60 focus:border-[#0ee0d5] focus:ring-[#0ee0d5]/25"
                        } p-4 rounded-xl font-mono tracking-widest text-slate-100 outline-none focus:ring-1 transition-all text-sm placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-500`}
                      />
                      {errors.paymentReference && (
                        <p className="mt-1 text-xs text-rose-500 font-mono font-medium">{errors.paymentReference}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-emerald-800/30 bg-[#06241b]/10 p-4 flex gap-3.5 items-start">
                  <ShieldCheck className="h-5 w-5 text-emerald-450 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-emerald-450 font-mono tracking-wider uppercase">Verificación Certificada</h4>
                    <p className="text-[11px] text-slate-450 leading-relaxed">
                      <span className="font-bold text-slate-200">Confirmación de Pago:</span> Su comprobante y lista de materiales serán verificados de forma manual por nuestro asesor de taquilla en un lapso inferior a 15 minutos una vez redirigido a WhatsApp. Este es un proceso de handoff 100% seguro.
                    </p>
                  </div>
                </div>

                {/* Alerta de optimización de red (Evitar inyectar Blob Input) */}
                <div className="rounded-lg border border-dashed border-[#1b212f] bg-[#0e1420]/40 p-3 flex gap-2.5 items-center">
                  <Camera className="text-cyan-400 h-5 w-5 flex-shrink-0 opacity-80" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Para evitar esperas de carga de red, nuestra plataforma cargará todos los datos digitalizados primero. Por favor envíe la captura fotográfica o screenshot de la transacción una vez dentro de nuestra ventanilla del agente vía WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUMMARY */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-[#0e1420] border border-[#1b212f] p-3.5 flex flex-col gap-1.5 text-xs text-text-secondary shadow-sm">
                  <div>
                    <span className="text-text-muted">Cliente:</span>{" "}
                    <strong className="text-text-primary">{form.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted">Cédula / RIF:</span>{" "}
                    <span className="font-mono text-text-primary">{form.rifOrId}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Despacho:</span>{" "}
                    <span className="text-text-primary font-medium">
                      {form.deliveryType === "retiro" && "Retiro en Tienda (Gratis)"}
                      {form.deliveryType === "delivery_charallave" && "Delivery Charallave (Gratis)"}
                      {form.deliveryType === "delivery_tuy" && "Flete Valles del Tuy (Flete Adicional)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Pago:</span>{" "}
                    <span className="text-text-primary font-medium uppercase font-mono">
                      {isQuoteOnly ? (
                        <span className="text-cyan-400 font-bold">SOLICITUD DE COTIZACIÓN (Sin Pago preventivo)</span>
                      ) : (
                        <>
                          {form.paymentMethod === "pago_movil" && `Pago Móvil (Ref: ${form.paymentReference})`}
                          {form.paymentMethod === "zelle" && `Zelle (Ref: ${form.paymentReference})`}
                          {form.paymentMethod === "binance" && `Binance (Ref: ${form.paymentReference})`}
                          {form.paymentMethod === "transferencia" && `Transferencia (Ref: ${form.paymentReference})`}
                          {form.paymentMethod === "efectivo" && "Efectivo USD"}
                          {form.paymentMethod === "efectivo_bs" && "Efectivo Bs"}
                          {form.paymentMethod === "mixto" && "Pago Mixto / Multi-Pago"}
                        </>
                      )}
                    </span>
                    {!isQuoteOnly && form.paymentMethod === "mixto" && (
                      <div className="mt-1.5 pl-2 border-l border-[#1b212f] flex flex-col gap-1 text-[10px] text-text-secondary font-mono">
                        {splitPayments.map((p, idx) => (
                          <div key={idx}>
                            • {p.method === "pago_movil" && "Pago Móvil"}
                            {p.method === "zelle" && "Zelle"}
                            {p.method === "binance" && "Binance Pay"}
                            {p.method === "transferencia" && "Transferencia"}
                            {p.method === "efectivo" && "Efectivo USD"}
                            {p.method === "efectivo_bs" && "Efectivo Bs"}:{" "}
                            <span className="text-cyan-400 font-bold">{formatUSD(p.amountUsd)}</span>
                            {p.method !== "efectivo" && p.method !== "efectivo_bs" && ` [Ref: ${p.ref}]`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-[9px] font-bold font-mono tracking-widest text-text-muted uppercase mb-1">
                    Materiales a Despachar
                  </h4>
                  <div className="flex flex-col gap-2 rounded-lg bg-[#0e1420] border border-[#1b212f] p-3">
                    {items.map((item) => {
                      const isVolume = !!(
                        item.product.volumeDiscount &&
                        item.quantity >= item.product.volumeDiscount.threshold
                      );

                      return (
                        <div
                          key={item.product.id}
                          className="flex justify-between items-baseline border-b border-[#1b212f]/40 last:border-b-0 pb-2 last:pb-0 text-xs"
                        >
                          <div className="max-w-[70%]">
                            <span className="font-bold text-cyan-400 font-mono tabular-nums">{item.quantity}x</span>{" "}
                            <span className="text-text-primary">{item.product.name}</span>
                            {isVolume && (
                              <span className="block text-[8px] text-cyan-400 font-mono font-medium leading-none mt-0.5">
                                Tasa al Mayor activa
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-text-primary tabular-nums">
                            {formatUSD(item.activePrice * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg border border-[#1b212f]/60 p-3 mt-1 text-center flex flex-col items-center">
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest font-mono">
                    Suministros L&D 2023, C.A.
                  </span>
                  <span className="text-[9px] text-text-muted font-mono leading-none mt-1">
                    RIF: J-50367899-0 | Charallave, Edo. Miranda
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Totals & Action CTA */}
          {items.length > 0 && (
            <div className="border-t border-[#1b212f] bg-[#0e1420] px-4 pt-4 pb-12 flex flex-col gap-3 shadow-none">
              {/* Pricing breakdown */}
              <div className="flex flex-col gap-1.5 border-b border-[#1b212f]/50 pb-3">
                {totals.savingsUsd > 0 && (
                  <div className="flex justify-between text-xs text-cyan-400 font-medium">
                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Ahorro Mayorista:</span>
                    <span className="font-mono tabular-nums">-{formatUSD(totals.savingsUsd)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">
                    {isQuoteOnly ? "Monto a Cotizar en USD:" : "Subtotal USD:"}
                  </span>
                  <span className="text-sm font-mono font-bold text-[#f4f5f6] tabular-nums">
                    {formatUSD(totals.totalUsd)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">Tasa Oficial BCV:</span>
                  <span className="text-xs font-mono font-semibold text-accent-amber tabular-nums">
                    {formatVES(rate)}/$
                  </span>
                </div>

                <div className="flex justify-between items-baseline mt-1 border-t border-[#1b212f]/40 pt-2">
                  <span className="text-sm font-bold text-text-primary">
                    {isQuoteOnly ? "Monto a Cotizar (VES):" : "Total VES (BCV):"}
                  </span>
                  <span className="text-base font-mono font-bold text-accent-amber tabular-nums">
                    {formatVES(totalVES)}
                  </span>
                </div>
              </div>

              {/* Botón Descargar / Imprimir Presupuesto (gris outline) */}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer shadow-none"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar / Imprimir Presupuesto
              </button>

              {/* Actions */}
              {step === 1 && (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={handleProceedToStep2}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black border border-cyan-400/20 text-xs font-extrabold uppercase tracking-widest py-3 flex items-center justify-center gap-1 focus:ring-2 focus:ring-cyan-500/50 active:scale-98 shadow-none"
                  >
                    Continuar al Checkout
                  </Button>
                  {!isQuoteOnly && (
                    <button
                      onClick={handleCasheaWhatsapp}
                      className="w-full bg-[#FDFA3D] hover:bg-[#e6e235] text-[#000000] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-98 border border-[#c4c120]/30 shadow-none cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-slate-900 shrink-0" viewBox="0 0 24 24" aria-label="Cashea">
                        <path d="M10 20c-3.3 0-6-2.7-6-6s2.7-6 6-6V2c-6.6 0-12 5.4-12 12s5.4 12 12 12c6.6 0 12-5.4 12-12h-6c0 3.3-2.7 6-6 6z" transform="scale(0.8) translate(2, 3)" />
                      </svg>
                      <span>Cashéalo vía WhatsApp ➔</span>
                    </button>
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={handleProceedToStep3}
                    disabled={!isPaymentRefValid}
                    className={`w-full text-xs font-extrabold uppercase tracking-widest py-3 flex items-center justify-center gap-1 focus:ring-2 focus:ring-cyan-500/50 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shadow-none border border-cyan-400/20 ${
                      !isQuoteOnly && form.paymentMethod === "mixto"
                        ? isPaymentRefValid
                          ? "bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold"
                          : "bg-canvas-card text-slate-500 border-[#1b212f]"
                        : "bg-cyan-500 hover:bg-cyan-400 text-black"
                    }`}
                  >
                    {isQuoteOnly
                      ? "Revisar Resumen de Cotización"
                      : form.paymentMethod === "mixto"
                      ? isPaymentRefValid
                        ? "FINALIZAR CÁLCULO AL CHAT"
                        : "Debes cuadrar pago para procesar"
                      : "Revisar Resumen Final"}
                  </Button>
                  {!isQuoteOnly && (
                    <button
                      onClick={handleCasheaWhatsapp}
                      className="w-full bg-[#FDFA3D] hover:bg-[#e6e235] text-[#000000] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-98 border border-[#c4c120]/30 shadow-none cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-slate-900 shrink-0" viewBox="0 0 24 24" aria-label="Cashea">
                        <path d="M10 20c-3.3 0-6-2.7-6-6s2.7-6 6-6V2c-6.6 0-12 5.4-12 12s5.4 12 12 12c6.6 0 12-5.4 12-12h-6c0 3.3-2.7 6-6 6z" transform="scale(0.8) translate(2, 3)" />
                      </svg>
                      <span>Cashéalo vía WhatsApp ➔</span>
                    </button>
                  )}
                </div>
              )}
              {step === 3 && (
                <Button
                  onClick={handleConfirmOrder}
                  disabled={!isPaymentRefValid}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold uppercase tracking-widest py-3 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-cyan-500/50 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shadow-none border border-cyan-400/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isQuoteOnly ? "Enviar Presupuesto vía WhatsApp ↗" : "Confirmar por WhatsApp"}
                </Button>
              )}

              {step === 1 ? (
                <button
                  onClick={closeDrawer}
                  className="text-center text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              ) : (
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  className="text-center text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  Volver al paso anterior
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>

    {/* Printable Budget (A4 format) */}
    {items.length > 0 && (
      <div className="hidden print:block fixed inset-0 bg-white text-black p-10 z-[100] font-sans">
        <div className="max-w-[800px] mx-auto bg-white p-6">
          {/* Membrete Corporativo */}
          <div className="flex justify-between items-start border-b-2 border-slate-300 pb-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                Suministros L&D 2023, C.A.
              </h1>
              <p className="text-[10px] text-slate-600 mt-1 font-mono">
                RIF: J-50367899-0 | Registro Oficial de Comercio
              </p>
              <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                Charallave, Casco Central, Edo. Miranda, Venezuela<br />
                Telf: +58 414-1025386 | Email: ventas@suministroslyd.com
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-1 rounded">
                ESTADO: VALIDO / PROCESABLE
              </span>
              <p className="text-[10px] text-slate-600 mt-2 font-mono">
                Fecha: {new Date().toLocaleDateString("es-VE")}<br />
                Validez: 3 días desde emisión
              </p>
            </div>
          </div>

          {/* Title & Budget Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-center text-slate-900 tracking-wide uppercase border-y border-dashed border-slate-300 py-2">
              PRESUPUESTO OFICIAL
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs mt-4">
              <div>
                <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider font-mono">Información del Cliente:</span>
                <p className="mt-1">
                  <strong>Razón Social:</strong> {form.fullName || "Cliente General Mayorista"}<br />
                  <strong>Cédula/RIF:</strong> <span className="font-mono">{form.rifOrId || "N/A"}</span><br />
                  <strong>Teléfono:</strong> {form.phone || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider font-mono">Código & Referencia:</span>
                <p className="mt-1">
                  <strong>Código Presupuesto:</strong> <span className="font-mono text-sm font-bold">LDP-{budgetCode}</span><br />
                  <strong>Distribución:</strong> {form.deliveryType === "retiro" ? "Retiro en Tienda" : "Despacho a Domicilio"}<br />
                  <strong>Moneda de Pago:</strong> VES / USD
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs mb-6 border-collapse">
            <thead>
              <tr className="border-b border-slate-400 bg-slate-100 text-slate-700 uppercase font-mono text-[10px] font-bold">
                <th className="py-2 px-1">SKU</th>
                <th className="py-2 px-2">Descripción del Material</th>
                <th className="py-2 px-2 text-center">Cant.</th>
                <th className="py-2 px-2 text-right">P. Unit (USD)</th>
                <th className="py-2 px-1 text-right">Total (USD)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isVolume = !!(
                  item.product.volumeDiscount &&
                  item.quantity >= item.product.volumeDiscount.threshold
                );
                return (
                  <tr key={item.product.id} className="border-b border-slate-200">
                    <td className="py-2 px-1 font-mono text-[10px] text-slate-500">{item.product.sku}</td>
                    <td className="py-2 px-2 font-semibold text-slate-800">
                      {item.product.name}
                      {isVolume && <span className="text-[8px] text-blue-600 font-bold ml-1.5">(Tasa Mayorista)</span>}
                    </td>
                    <td className="py-2 px-2 text-center font-mono">{item.quantity}</td>
                    <td className="py-2 px-2 text-right font-mono">{formatUSD(item.activePrice)}</td>
                    <td className="py-2 px-1 text-right font-mono font-bold">{formatUSD(item.activePrice * item.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="flex justify-end mb-10">
            <div className="w-[300px] border border-slate-300 rounded p-3 text-xs bg-slate-50/50">
              {totals.savingsUsd > 0 && (
                <div className="flex justify-between py-1 text-green-700 font-bold">
                  <span>Ahorro Mayorista:</span>
                  <span className="font-mono">-{formatUSD(totals.savingsUsd)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 text-slate-600">
                <span>Subtotal en USD:</span>
                <span className="font-mono font-bold">{formatUSD(totals.totalUsd)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Tasa de Cambio BCV:</span>
                <span className="font-mono font-bold">{formatVES(rate)} Bs.</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-300 mt-1.5 pt-1.5 font-bold text-slate-900 text-sm">
                <span>Monto Total VES:</span>
                <span className="font-mono text-blue-900">{formatVES(totalVES)} Bs.</span>
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="grid grid-cols-2 gap-10 mt-16 pt-10 border-t border-slate-200">
            <div className="text-center">
              <div className="h-12 border-b border-slate-350 w-[200px] mx-auto" />
              <span className="text-[10px] text-slate-550 uppercase mt-2 block font-mono">Firma Responsable (L&D)</span>
            </div>
            <div className="text-center">
              <div className="h-12 border-b border-slate-350 w-[200px] mx-auto" />
              <span className="text-[10px] text-slate-550 uppercase mt-2 block font-mono">Recibido Conforme (Cliente)</span>
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 text-center text-[10px] text-slate-500 leading-relaxed font-mono">
            🔒 Garantía L&D: Su orden está cubierta. Despachamos al verificar su referencia o reintegramos de inmediato.<br />
            Este presupuesto oficial tiene validez de 3 días calendarios. Para concretar, envíe copia al ejecutivo comercial.
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default CartDrawer;
