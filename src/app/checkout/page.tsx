"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Store, Truck, MapPin, Send, ShieldCheck, CheckCircle2, Zap, FileText } from "lucide-react";
import { useCart } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { CheckoutForm } from "@/types/checkout";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/utils/build-whatsapp-message";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CORPORATE_WHATSAPP_PHONE = "584141025386";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCart((state) => state);
  const { rate, fetchRate } = useBcvStore();

  const [step, setStep] = React.useState(1);
  const [mounted, setMounted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isQuoteOnly, setIsQuoteOnly] = React.useState(false);
  const budgetCode = React.useMemo(() => Math.floor(100000 + Math.random() * 900000), []);
  
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

  React.useEffect(() => {
    setMounted(true);
    fetchRate();
  }, [fetchRate]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#08090c] text-text-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-electric border-t-transparent" />
          <p className="text-sm font-mono text-text-secondary">Cargando módulo de checkout...</p>
        </div>
      </div>
    );
  }

  const totals = getTotals(rate);
  const totalVES = totals.totalUsd * rate;

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

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Nombre o Razón Social es requerido";
    if (!form.rifOrId.trim()) newErrors.rifOrId = "Cédula o RIF es requerido";
    
    // Simple phone number validation
    if (!form.phone.trim()) {
      newErrors.phone = "Número de teléfono es requerido";
    } else if (!/^\+?58\d{10}$|^\d{11}$/.test(form.phone.replace(/[\s-()]/g, ""))) {
      newErrors.phone = "Formato de número inválido. Ej: +58 414-1234567";
    }

    if (!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && !form.paymentReference.trim()) {
      newErrors.paymentReference = "Número de referencia es requerido (últimos 6 dígitos)";
    } else if (!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && form.paymentReference.trim().length < 6) {
      newErrors.paymentReference = "Debe ingresar al menos 6 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.deliveryType !== "retiro" && !form.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Dirección de despacho es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (items.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (validateStep3()) {
        setStep(4);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleConfirmOrder = () => {
    if (step === 4 && validateStep4()) {
      const text = buildWhatsAppMessage(items, form, rate, {
        subtotal: totals.subtotalUsd,
        total: totals.totalUsd,
        savings: totals.savingsUsd,
      }, undefined, isQuoteOnly);
      const link = getWhatsAppLink(CORPORATE_WHATSAPP_PHONE, text);
      
      // Open WhatsApp link in a new window
      window.open(link, "_blank");

      // Clear cart and redirect home
      clearCart();
      router.push("/");
    }
  };

  // Prevent accessing checkout with empty cart
  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-[#08090c] text-text-primary flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6 p-8 rounded-2xl border border-hairline bg-canvas-card">
          <svg className="h-16 w-16 text-text-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">Tu carrito está vacío</h2>
            <p className="text-xs text-text-muted leading-relaxed">No puedes proceder al checkout sin productos agregados.</p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full font-bold">
            Ir al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-text-primary flex flex-col justify-between">
      <div className="print:hidden flex flex-col justify-between min-h-screen w-full">
      
      {/* Checkout Navbar */}
      <header className="h-16 border-b border-hairline bg-canvas-primary/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-4">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer group text-xs font-mono font-medium"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>VOLVER A LA TIENDA</span>
          </button>
          
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-accent-electric filter drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="font-display text-sm font-bold tracking-tight">SUMINISTROS L&D</span>
          </div>

          <div className="flex items-center gap-1.5 bg-accent-electric/5 border border-accent-electric/20 rounded-full px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-electric" />
            <span className="text-[10px] font-bold text-accent-electric uppercase font-mono tracking-wider">Checkout Seguro</span>
          </div>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        
        {/* Stepper Indicators */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between relative">
            {/* Background progress bar */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-hairline z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-accent-electric transition-all duration-300 z-0" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Tu Pedido" },
              { num: 2, label: "Pago" },
              { num: 3, label: "Datos" },
              { num: 4, label: "Entrega" }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`h-8 w-8 rounded-full flex items-center justify-center border font-mono text-xs font-bold transition-all duration-300 ${
                    step >= s.num 
                      ? "bg-canvas-primary border-accent-electric text-accent-electric shadow-[0_0_12px_rgba(0,229,255,0.15)]" 
                      : "bg-[#0e1117] border-hairline text-text-muted"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="h-4.5 w-4.5 text-accent-electric fill-canvas-primary" /> : s.num}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold transition-colors duration-300 ${
                  step >= s.num ? "text-text-primary" : "text-text-muted"
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Steps Container */}
        <div className="bg-canvas-card border border-hairline rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40">
          
          {/* STEP 1: ORDER REVISION */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary mb-1">Revisa tu Pedido</h2>
                <p className="text-xs text-text-secondary">Confirma las cantidades de tus materiales eléctricos antes de liquidar.</p>
              </div>

              <div className="flex flex-col gap-4 border-b border-hairline/60 pb-6">
                {items.map((item) => {
                  const isVolume = !!(
                    item.product.volumeDiscount &&
                    item.quantity >= item.product.volumeDiscount.threshold
                  );

                  return (
                    <div key={item.product.id} className="flex justify-between items-center gap-4 py-2 border-b border-hairline/25 last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-text-muted font-mono tracking-wider">{item.product.sku}</span>
                          {isVolume && (
                            <span className="text-[8px] bg-accent-electric/10 text-accent-electric border border-accent-electric/25 px-1.5 py-0.5 rounded font-mono font-bold">
                              TASA MAYORISTA APLICADA
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-text-primary truncate">{item.product.name}</h4>
                        <div className="text-xs text-text-secondary mt-0.5">
                          <span className="font-mono">{item.quantity}x</span> &times; <span className="font-mono">{formatUSD(item.activePrice)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-mono font-bold text-text-primary">{formatUSD(item.activePrice * item.quantity)}</div>
                        <div className="text-[10px] font-mono text-text-muted mt-0.5">Bs. {formatVES(item.activePrice * item.quantity * rate)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Summary */}
              <div className="flex flex-col gap-2.5">
                {totals.savingsUsd > 0 && (
                  <div className="flex justify-between items-baseline text-xs text-success font-semibold">
                    <span>Ahorro Mayorista:</span>
                    <span className="font-mono font-bold tracking-tight tabular-nums">-{formatUSD(totals.savingsUsd)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-xs text-text-secondary">
                  <span>{isQuoteOnly ? "Monto a Cotizar en USD:" : "Subtotal en USD:"}</span>
                  <span className="font-mono text-text-primary font-bold tracking-tight tabular-nums">{formatUSD(totals.totalUsd)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-text-secondary">
                  <span>Tasa oficial de cambio (BCV):</span>
                  <span className="font-mono text-accent-amber font-semibold">{formatVES(rate)}/$</span>
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-hairline/60 pt-3">
                  <span className="text-sm font-bold text-text-primary">
                    {isQuoteOnly ? "Monto a Cotizar (VES):" : "Total estimado (VES):"}
                  </span>
                  <span className="text-xl font-mono font-extrabold text-accent-amber">{formatVES(totalVES)}</span>
                </div>
              </div>

              {/* Botón Descargar / Imprimir Presupuesto (gris outline) */}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full mt-4 py-2.5 border border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer shadow-none"
              >
                <FileText className="h-3.5 w-3.5" />
                Descargar / Imprimir Presupuesto
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary mb-1">Método de Pago</h2>
                <p className="text-xs text-text-secondary">Elige la forma de pago para tu comprobante. Verificamos tu referencia en WhatsApp.</p>
              </div>

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

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-200 ${isQuoteOnly ? "opacity-30 pointer-events-none" : ""}`}>
                {/* Pago Movil */}
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "pago_movil")}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === "pago_movil"
                      ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                      : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className={`h-5 w-5 mt-0.5 transition-colors ${form.paymentMethod === "pago_movil" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                  <div>
                    <div className="text-sm font-bold text-slate-200">Pago Móvil</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Transferencia inmediata en Bolívares al cambio del BCV.
                    </div>
                  </div>
                </button>

                {/* Zelle */}
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "zelle")}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === "zelle"
                      ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                      : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <svg className={`h-5 w-5 mt-0.5 transition-colors ${form.paymentMethod === "zelle" ? "text-[#0ee0d5]" : "text-slate-500"}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.29 11.29c-.39.39-1.02.39-1.41 0L9.3 10.7a.996.996 0 1 1 1.41-1.41l1.79 1.79 4.29-4.3a.996.996 0 1 1 1.41 1.41l-5 5z" />
                  </svg>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Zelle</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Pagos directos en dólares para compras al mayor o detal.
                    </div>
                  </div>
                </button>

                {/* Binance Pay */}
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "binance")}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === "binance"
                      ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                      : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <span className={`text-[10px] font-mono font-extrabold border rounded px-1.5 py-0.5 mt-0.5 transition-colors ${form.paymentMethod === "binance" ? "border-[#0ee0d5] text-[#0ee0d5]" : "border-slate-700 text-slate-500"}`}>BINANCE</span>
                  <div>
                    <div className="text-sm font-bold text-slate-200">Binance Pay</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Pagos digitales con criptomonedas (USDT/BUSD).
                    </div>
                  </div>
                </button>

                {/* Efectivo USD */}
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "efectivo")}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === "efectivo"
                      ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                      : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <Store className={`h-5 w-5 mt-0.5 transition-colors ${form.paymentMethod === "efectivo" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                  <div>
                    <div className="text-sm font-bold text-slate-200">Efectivo USD (Taquilla)</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Paga en dólares físicos al retirar en nuestra tienda.
                    </div>
                  </div>
                </button>

                {/* Efectivo Bs */}
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "efectivo_bs")}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    form.paymentMethod === "efectivo_bs"
                      ? "bg-slate-900/50 border-[#0ee0d5] text-slate-100 shadow-[0_0_15px_rgba(14,224,213,0.08)]"
                      : "bg-slate-800 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <Store className={`h-5 w-5 mt-0.5 transition-colors ${form.paymentMethod === "efectivo_bs" ? "text-[#0ee0d5]" : "text-slate-500"}`} />
                  <div>
                    <div className="text-sm font-bold text-slate-200">Efectivo Bs (Taquilla)</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Paga en bolívares en efectivo al retirar en nuestra tienda.
                    </div>
                  </div>
                </button>
              </div>

              {/* Cashea Info Banner */}
              {!isQuoteOnly && (
                <div className="rounded-xl border border-hairline bg-[#1c1a12] p-4 flex gap-3.5 items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent-amber" />
                  <div className="bg-[#FACC15]/10 border border-[#FACC15]/30 rounded-lg p-2 text-accent-amber flex-shrink-0">
                    <Zap className="h-5 w-5 fill-[#FACC15] text-[#08090c]" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-[#FACC15] font-mono tracking-wider uppercase">Cashea — Compra en Cuotas Sin Interés</h4>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      ¿Quieres pagar con Cashea? Selecciona <strong className="text-text-primary">Efectivo USD (Taquilla)</strong>, completa tu pedido y ven a nuestra tienda física en Charallave para escanear tu QR de Cashea. Cancelarás una inicial y el resto en 3 cuotas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CONTACT & REFERENCE */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary mb-1">Datos de Pago y Contacto</h2>
                <p className="text-xs text-text-secondary">Tus datos se manejan con seguridad para verificar la referencia bancaria.</p>
              </div>

              {/* Bank Account Details dynamically showing based on choice */}
              {!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && (
                <div className="p-4 rounded-xl border border-hairline bg-[#0e1117] flex flex-col gap-2.5 text-xs">
                  <span className="font-mono text-[10px] text-accent-electric uppercase font-bold tracking-wider">Cuentas Receptoras de Suministros L&D</span>
                  {form.paymentMethod === "pago_movil" && (
                    <div className="grid grid-cols-2 gap-2 text-text-secondary leading-relaxed">
                      <div><span className="text-text-muted">Banco:</span> Banesco (0134)</div>
                      <div><span className="text-text-muted">Teléfono:</span> +58 414-1025386</div>
                      <div><span className="text-text-muted">RIF:</span> J-50367899-0</div>
                      <div><span className="text-text-muted">Monto a transferir:</span> <strong className="text-accent-amber">{formatVES(totalVES)} Bs.</strong></div>
                    </div>
                  )}
                  {form.paymentMethod === "zelle" && (
                    <div className="flex flex-col gap-1 text-text-secondary leading-relaxed">
                      <div><span className="text-text-muted">Correo Zelle:</span> pagos@suministroslyd.com</div>
                      <div><span className="text-text-muted">Titular:</span> Suministros L&D 2023, C.A.</div>
                      <div><span className="text-text-muted">Monto a transferir:</span> <strong className="text-accent-electric font-mono tracking-tight tabular-nums">{formatUSD(totals.totalUsd)}</strong></div>
                    </div>
                  )}
                  {form.paymentMethod === "binance" && (
                    <div className="flex flex-col gap-1 text-text-secondary leading-relaxed">
                      <div><span className="text-text-muted">Binance Pay ID:</span> 987654321</div>
                      <div><span className="text-text-muted">Alias:</span> SuministrosLD</div>
                      <div><span className="text-text-muted">Monto a transferir:</span> <strong className="text-accent-electric font-mono tracking-tight tabular-nums">{formatUSD(totals.totalUsd)} USDT</strong></div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Nombre o Razón Social *</label>
                    <input
                      type="text"
                      placeholder="Ej: Constructora Tuy, C.A. / Juan Pérez"
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
                      placeholder="Ej: J-50367899-0 o V-12345678"
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Teléfono Móvil (WhatsApp) *</label>
                    <input
                      type="tel"
                      placeholder="Ej: 04141234567"
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

                  {form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && (
                    <div className={`flex flex-col gap-1.5 w-full transition-all duration-200 ${isQuoteOnly ? "opacity-40 pointer-events-none" : ""}`}>
                      <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">
                        Últimos 6 dígitos de Referencia {isQuoteOnly ? "(Opcional)" : "*"}
                      </label>
                      <input
                        type="text"
                        disabled={isQuoteOnly}
                        placeholder={isQuoteOnly ? "No requerido para cotizar" : "Ej: 489230"}
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
              </div>
            </div>
          )}

          {/* STEP 4: LOGISTICS & CONFIRMATION */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary mb-1">Método de Despacho</h2>
                <p className="text-xs text-text-secondary">Indícanos dónde deseas recibir el material. Delivery gratis en Charallave.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Retiro */}
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
                    <div className="text-sm font-bold text-slate-200">Retiro en Tienda (Ferretería)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Charallave Casco Central — GRATIS</div>
                  </div>
                </button>

                {/* Delivery Express Charallave */}
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
                    <div className="text-sm font-bold text-slate-200">Delivery Express Charallave</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Casco central y zonas residenciales céntricas — GRATIS</div>
                  </div>
                </button>

                {/* Delivery Valles del Tuy */}
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
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Cúa, Ocumare, Santa Teresa, Santa Lucía — FLETE ADICIONAL</div>
                  </div>
                </button>
              </div>

              {form.deliveryType !== "retiro" && (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold font-mono tracking-wide text-slate-400 uppercase">Dirección Completa de Despacho *</label>
                  <input
                    type="text"
                    placeholder="Ej: Sector Las Brisas, Calle Bolívar, Casa Nro 4, Charallave"
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

              {/* Final Order Review Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col gap-3">
                <span className="font-mono text-[9px] text-slate-500 uppercase font-bold tracking-wider">Detalles de Facturación</span>
                <div className="grid grid-cols-2 gap-y-2 text-xs leading-relaxed text-slate-400">
                  <div><span className="text-slate-500 font-medium">Cliente:</span> <strong className="text-slate-200">{form.fullName}</strong></div>
                  <div><span className="text-slate-500 font-medium">Doc/RIF:</span> <span className="font-mono text-slate-200">{form.rifOrId}</span></div>
                  <div>
                    <span className="text-slate-500 font-medium">Forma de Pago:</span>{" "}
                    <span className="text-slate-200 uppercase font-mono font-medium">
                      {isQuoteOnly ? "SOLICITUD DE COTIZACIÓN" : (form.paymentMethod === "efectivo" ? "Efectivo USD" : form.paymentMethod === "efectivo_bs" ? "Efectivo Bs" : form.paymentMethod.replace("_", " "))}
                    </span>
                  </div>
                  {!isQuoteOnly && form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && (
                    <div><span className="text-slate-500 font-medium">Referencia:</span> <span className="font-mono text-slate-200">{form.paymentReference}</span></div>
                  )}
                  <div className="col-span-2"><span className="text-slate-500 font-medium">Distribución:</span> <span className="text-slate-200 font-medium">{form.deliveryType === "retiro" ? "Retira por mostrador (Charallave)" : "Entrega a domicilio física"}</span></div>
                </div>
              </div>

              {/* Trust validation handoff box (Task 5 requirement) */}
              <div className="rounded-xl border border-emerald-800/30 bg-[#06241b]/10 p-4 flex gap-3.5 items-start">
                <ShieldCheck className="h-5 w-5 text-emerald-450 flex-shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-emerald-400 font-mono tracking-wider uppercase">
                    {isQuoteOnly ? "Verificación de Presupuesto" : "Verificación Certificada"}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-200">{isQuoteOnly ? "Confirmación de Cotización:" : "Confirmación de Pago:"}</span>{" "}
                    {isQuoteOnly 
                      ? "Su presupuesto y lista de materiales serán verificados de forma manual por nuestro asesor de taquilla en un lapso inferior a 15 minutos una vez redirigido a WhatsApp. Este es un proceso de handoff 100% seguro."
                      : "Su comprobante y lista de materiales serán verificados de forma manual por nuestro asesor de taquilla en un lapso inferior a 15 minutos una vez redirigido a WhatsApp. Este es un proceso de handoff 100% seguro."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8 border-t border-hairline/60 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="text-xs font-mono font-bold text-text-secondary hover:text-text-primary disabled:opacity-40 transition-colors py-2 px-3 flex items-center gap-1 cursor-pointer"
            >
              &larr; VOLVER
            </button>

            {step < 4 ? (
              <Button onClick={handleNext} className="font-bold text-xs uppercase px-5 py-2.5">
                Siguiente Paso
              </Button>
            ) : (
              <Button 
                onClick={handleConfirmOrder} 
                variant="success" 
                className="bg-success hover:bg-green-600 font-bold text-xs uppercase px-5 py-2.5 flex items-center gap-2 text-white"
              >
                <Send className="h-4 w-4" />
                {isQuoteOnly ? "Enviar Presupuesto vía WhatsApp ↗" : "Confirmar y enviar a WhatsApp"}
              </Button>
            )}
          </div>
        </div>

      </main>

      {/* Trust Signoffs */}
      <footer className="w-full bg-canvas-elevated border-t border-hairline py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-text-muted">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>SUMINISTROS L&D 2023, C.A. &bull; RIF: J-50367899-0</span>
          </div>
          <span>Charallave, Miranda, Venezuela &bull; Ventas de Iluminación y Electricidad</span>
        </div>
      </footer>
    </div>

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
                <div className="flex justify-between py-1 border-t border-slate-350 mt-1.5 pt-1.5 font-bold text-slate-900 text-sm">
                  <span>Monto Total VES:</span>
                  <span className="font-mono text-blue-900">{formatVES(totalVES)} Bs.</span>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-10 mt-16 pt-10 border-t border-slate-200">
              <div className="text-center">
                <div className="h-12 border-b border-slate-350 w-[200px] mx-auto" />
                <span className="text-[10px] text-slate-550 mt-2 block font-mono">Firma Responsable (L&D)</span>
              </div>
              <div className="text-center">
                <div className="h-12 border-b border-slate-350 w-[200px] mx-auto" />
                <span className="text-[10px] text-slate-550 mt-2 block font-mono">Recibido Conforme (Cliente)</span>
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

    </div>
  );
}
