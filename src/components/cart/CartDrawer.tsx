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
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useBcvStore } from "@/store/bcv-store";
import { useDrawerStore } from "@/store/drawer-store";
import { CheckoutForm, DeliveryType, PaymentMethod } from "@/types/checkout";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { buildWhatsAppMessage, getWhatsAppLink } from "@/lib/utils/build-whatsapp-message";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

// Corporate WhatsApp Business number for sales confirmation
const CORPORATE_WHATSAPP_PHONE = "584120000000";

export function CartDrawer() {
  const { isOpen, closeDrawer } = useDrawerStore();
  const { items, updateQuantity, removeItem, getTotals, clearCart } = useCartStore();
  const rate = useBcvStore((state) => state.rate);

  const [step, setStep] = React.useState(1);
  const [mounted, setMounted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

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
  }, []);

  // Reset steps and error state when drawer closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totals = mounted ? getTotals() : { subtotal: 0, total: 0, savings: 0, itemCount: 0 };
  const totalVES = totals.total * rate;

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

    if (form.paymentMethod !== "efectivo" && !form.paymentReference.trim()) {
      newErrors.paymentReference = "Número de referencia es requerido";
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
    const text = buildWhatsAppMessage(items, form, rate, totals);
    const link = getWhatsAppLink(CORPORATE_WHATSAPP_PHONE, text);
    
    // Open WhatsApp link in a new window
    window.open(link, "_blank");

    // Clear cart and close checkout
    clearCart();
    closeDrawer();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
        />

        {/* Drawer panel with spring animation */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-canvas-elevated border-l border-hairline shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline px-4 py-4">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  className="rounded-full p-1 text-text-secondary hover:bg-canvas-card hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Volver al paso anterior"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <h2 className="font-display text-sm font-bold tracking-wider uppercase text-text-primary">
                {step === 1 && "Carrito de Compras"}
                {step === 2 && "Datos del Pedido"}
                {step === 3 && "Resumen y Confirmación"}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="rounded-full p-1 text-text-secondary hover:bg-canvas-card hover:text-text-primary transition-colors cursor-pointer"
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
                    <h3 className="font-display text-base font-bold text-text-primary mb-1">
                      El carrito está vacío
                    </h3>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                      Agrega productos del catálogo para poder cotizar y enviar a WhatsApp.
                    </p>
                    <Button onClick={closeDrawer} variant="outline" className="mt-5 font-bold">
                      Volver al Catálogo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => {
                      const isVolume = !!(
                        item.product.volumeDiscount &&
                        item.quantity >= item.product.volumeDiscount.threshold
                      );
                      const activePrice = isVolume
                        ? item.product.volumeDiscount!.discountPrice
                        : item.product.price;

                      return (
                        <div
                          key={item.product.id}
                          className="flex gap-3 items-center justify-between rounded-lg bg-canvas-card border border-hairline p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] text-text-muted font-mono font-medium tracking-wider">
                                {item.product.sku}
                              </span>
                              {isVolume && (
                                <span className="text-[8px] bg-accent-electric/15 text-accent-electric border border-accent-electric/20 px-1 rounded font-mono font-bold">
                                  TASA B2B
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-text-primary truncate">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-mono font-bold text-text-secondary">
                              {formatUSD(activePrice)} c/u
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-canvas-elevated rounded border border-hairline">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-text-secondary hover:text-text-primary cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-text-primary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-text-secondary hover:text-text-primary cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Trash button */}
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-text-muted hover:text-danger p-1 cursor-pointer transition-colors"
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
              <div className="flex flex-col gap-5">
                {/* 1. Identification section */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold font-mono tracking-wider text-accent-electric uppercase">
                    --- Identificación ---
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Nombre o Razón Social *"
                      value={form.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      error={errors.fullName}
                    />
                    <Input
                      placeholder="Cédula / RIF *"
                      value={form.rifOrId}
                      onChange={(e) => handleInputChange("rifOrId", e.target.value)}
                      error={errors.rifOrId}
                    />
                    <Input
                      placeholder="Teléfono Móvil *"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={errors.phone}
                    />
                  </div>
                </div>

                {/* 2. Dispatch type */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold font-mono tracking-wider text-accent-electric uppercase">
                    --- Distribución ---
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Retiro */}
                    <button
                      onClick={() => handleInputChange("deliveryType", "retiro")}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        form.deliveryType === "retiro"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <Store className="h-4.5 w-4.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold">Retiro en Tienda</div>
                        <div className="text-[10px] text-text-muted font-mono leading-none">Charallave Centro - GRATIS</div>
                      </div>
                    </button>

                    {/* Delivery Charallave */}
                    <button
                      onClick={() => handleInputChange("deliveryType", "delivery_charallave")}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        form.deliveryType === "delivery_charallave"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <Truck className="h-4.5 w-4.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold">Delivery Charallave</div>
                        <div className="text-[10px] text-text-muted font-mono leading-none">Casco Central y aledaños - GRATIS</div>
                      </div>
                    </button>

                    {/* Delivery Valles del Tuy */}
                    <button
                      onClick={() => handleInputChange("deliveryType", "delivery_tuy")}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        form.deliveryType === "delivery_tuy"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <MapPin className="h-4.5 w-4.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold">Flete Valles del Tuy</div>
                        <div className="text-[10px] text-text-muted font-mono leading-none">Cúa, Ocumare, Santa Teresa - FLETE ADICIONAL</div>
                      </div>
                    </button>
                  </div>

                  {/* Delivery address input */}
                  {form.deliveryType !== "retiro" && (
                    <Input
                      placeholder="Dirección Completa de Entrega *"
                      value={form.deliveryAddress}
                      onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                      error={errors.deliveryAddress}
                      className="mt-1"
                    />
                  )}
                </div>

                {/* 3. Payment Method */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold font-mono tracking-wider text-accent-electric uppercase">
                    --- Forma de Pago ---
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Pago movil */}
                    <button
                      onClick={() => handleInputChange("paymentMethod", "pago_movil")}
                      className={`flex flex-col gap-1 p-2.5 rounded-lg border text-center items-center justify-center cursor-pointer transition-all ${
                        form.paymentMethod === "pago_movil"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs font-bold">Pago Móvil</span>
                    </button>

                    {/* Zelle */}
                    <button
                      onClick={() => handleInputChange("paymentMethod", "zelle")}
                      className={`flex flex-col gap-1 p-2.5 rounded-lg border text-center items-center justify-center cursor-pointer transition-all ${
                        form.paymentMethod === "zelle"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.29 11.29c-.39.39-1.02.39-1.41 0L9.3 10.7a.996.996 0 1 1 1.41-1.41l1.79 1.79 4.29-4.3a.996.996 0 1 1 1.41 1.41l-5 5z" />
                      </svg>
                      <span className="text-xs font-bold">Zelle</span>
                    </button>

                    {/* Binance Pay */}
                    <button
                      onClick={() => handleInputChange("paymentMethod", "binance")}
                      className={`flex flex-col gap-1 p-2.5 rounded-lg border text-center items-center justify-center cursor-pointer transition-all ${
                        form.paymentMethod === "binance"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase font-mono">Binance</span>
                    </button>

                    {/* Efectivo */}
                    <button
                      onClick={() => handleInputChange("paymentMethod", "efectivo")}
                      className={`flex flex-col gap-1 p-2.5 rounded-lg border text-center items-center justify-center cursor-pointer transition-all ${
                        form.paymentMethod === "efectivo"
                          ? "bg-accent-electric/[0.03] border-accent-electric text-text-primary"
                          : "bg-canvas-card border-hairline text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      <span className="text-xs font-bold">Efectivo USD</span>
                    </button>
                  </div>

                  {/* Payment Reference field (not for cash) */}
                  {form.paymentMethod !== "efectivo" && (
                    <Input
                      placeholder="Número de Referencia Bancaria *"
                      value={form.paymentReference}
                      onChange={(e) => handleInputChange("paymentReference", e.target.value)}
                      error={errors.paymentReference}
                      className="mt-1"
                    />
                  )}
                </div>

                {/* Trust signal micro box */}
                <div className="rounded-lg bg-canvas-card border border-hairline p-3 flex gap-2.5 items-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-success flex-shrink-0 mt-0.5" />
                  <div className="text-[10px] text-text-secondary leading-relaxed">
                    <span className="font-bold text-text-primary">Confirmación de Pago:</span> Su pedido y comprobante serán verificados manualmente por un asesor técnico en menos de 15 minutos vía chat de WhatsApp.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUMMARY */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Meta details */}
                <div className="rounded-lg bg-canvas-card border border-hairline p-3 flex flex-col gap-1.5 text-xs text-text-secondary">
                  <div>
                    <span className="text-text-muted">Cliente:</span>{" "}
                    <strong className="text-text-primary">{form.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted">Cédula / RIF:</span>{" "}
                    <span className="font-mono text-text-primary">{form.rifOrId}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Entrega:</span>{" "}
                    <span className="text-text-primary font-medium">
                      {form.deliveryType === "retiro" && "Retiro en Tienda (Gratis)"}
                      {form.deliveryType === "delivery_charallave" && "Delivery Charallave (Gratis)"}
                      {form.deliveryType === "delivery_tuy" && "Flete Valles del Tuy (Flete Adicional)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Pago:</span>{" "}
                    <span className="text-text-primary font-medium uppercase font-mono">
                      {form.paymentMethod.replace("_", " ")}{" "}
                      {form.paymentMethod !== "efectivo" && `(Ref: ${form.paymentReference})`}
                    </span>
                  </div>
                </div>

                {/* Items Summary list */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-bold font-mono tracking-wider text-text-muted uppercase mb-1">
                    Productos del Pedido
                  </h4>
                  {items.map((item) => {
                    const isVolume = !!(
                      item.product.volumeDiscount &&
                      item.quantity >= item.product.volumeDiscount.threshold
                    );
                    const activePrice = isVolume
                      ? item.product.volumeDiscount!.discountPrice
                      : item.product.price;

                    return (
                      <div
                        key={item.product.id}
                        className="flex justify-between items-baseline border-b border-hairline/30 pb-2 text-xs"
                      >
                        <div className="max-w-[70%]">
                          <span className="font-bold text-text-primary">{item.quantity}x</span>{" "}
                          <span className="text-text-secondary">{item.product.name}</span>
                          {isVolume && (
                            <span className="block text-[9px] text-accent-electric font-mono font-medium leading-none mt-0.5">
                              Tasa Mayorista B2B aplicada
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-text-primary">
                          {formatUSD(activePrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legal and RIF confirmation */}
                <div className="rounded-lg bg-canvas-card border border-hairline/50 p-3 mt-2 text-center flex flex-col items-center">
                  <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider font-mono">
                    SUMINISTROS L&D 2023, C.A.
                  </span>
                  <span className="text-[9px] text-text-muted font-mono leading-none mt-0.5">
                    RIF: J-50367899-0 | Charallave, Edo. Miranda
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Totals & Action CTA */}
          {items.length > 0 && (
            <div className="border-t border-hairline bg-canvas-card px-4 py-4 flex flex-col gap-3">
              {/* Pricing breakdown */}
              <div className="flex flex-col gap-1.5 border-b border-hairline/50 pb-3">
                {totals.savings > 0 && (
                  <div className="flex justify-between text-xs text-accent-electric font-medium">
                    <span>Ahorro Mayorista B2B:</span>
                    <span>-{formatUSD(totals.savings)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">Subtotal USD:</span>
                  <span className="text-sm font-mono font-bold text-text-primary">
                    {formatUSD(totals.total)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">Tasa del día:</span>
                  <span className="text-xs font-mono font-semibold text-accent-amber">
                    {formatVES(rate)}/$
                  </span>
                </div>

                <div className="flex justify-between items-baseline mt-1 border-t border-hairline/20 pt-1.5">
                  <span className="text-sm font-bold text-text-primary">Total VES (BCV):</span>
                  <span className="text-base font-mono font-extrabold text-accent-amber">
                    {formatVES(totalVES)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {step === 1 && (
                <Button
                  onClick={handleProceedToStep2}
                  className="w-full text-sm font-bold flex items-center justify-center gap-1"
                >
                  Continuar al Checkout
                </Button>
              )}
              {step === 2 && (
                <Button
                  onClick={handleProceedToStep3}
                  className="w-full text-sm font-bold"
                >
                  Revisar Resumen Final
                </Button>
              )}
              {step === 3 && (
                <Button
                  onClick={handleConfirmOrder}
                  variant="success"
                  className="w-full text-sm font-bold bg-[#22c55e] hover:bg-green-600 flex items-center justify-center gap-1.5 text-white"
                >
                  <Send className="h-4 w-4" /> Completar Pedido en WhatsApp
                </Button>
              )}

              {step === 1 && (
                <button
                  onClick={closeDrawer}
                  className="text-center text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  Seguir comprando
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CartDrawer;
