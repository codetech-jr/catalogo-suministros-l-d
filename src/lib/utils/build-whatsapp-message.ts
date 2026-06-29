import { CartItem } from "@/types/cart";
import { CheckoutForm, PaymentMethod } from "@/types/checkout";
import { formatUSD, formatVES } from "./format-currency";

export interface ISplitPayment {
  method: PaymentMethod;
  amountUsd: number;
  ref: string;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  form: CheckoutForm,
  bcvRate: number,
  totals: { subtotal: number; total: number; savings: number },
  splitPayments?: ISplitPayment[],
  isQuoteOnly?: boolean
): string {
  const deliveryLabel = {
    retiro: "Retiro por Mostrador (Gratis)",
    delivery_charallave: "Delivery Charallave (Gratis)",
    delivery_tuy: "Delivery Valles del Tuy (Flete Adicional)",
  }[form.deliveryType];

  const paymentLabel = {
    pago_movil: "PAGO MÓVIL",
    zelle: "ZELLE",
    binance: "BINANCE PAY",
    efectivo: "EFECTIVO USD POR TAQUILLA",
    efectivo_bs: "EFECTIVO BS POR TAQUILLA",
    transferencia: "TRANSFERENCIA BANCARIA NACIONAL",
    mixto: "PAGO MIXTO / MULTI-PAGO",
  }[form.paymentMethod];

  const addressLine = form.deliveryType !== "retiro"
    ? `*Dirección:* ${form.deliveryAddress}\n`
    : "";

  let paymentDetails = "";
  if (form.paymentMethod === "mixto" && splitPayments && splitPayments.length > 0) {
    paymentDetails = "\n*Desglose de Multi-Pago:*\n";
    splitPayments.forEach((payment) => {
      const methodLabel = {
        pago_movil: "Pago Móvil",
        zelle: "Zelle",
        binance: "Binance Pay",
        efectivo: "Efectivo USD",
        efectivo_bs: "Efectivo Bs",
        transferencia: "Transferencia Bs",
        mixto: "Pago Mixto",
      }[payment.method];
      
      const isBs = payment.method === "pago_movil" || payment.method === "transferencia" || payment.method === "efectivo_bs";
      const amountStr = isBs 
        ? `${formatUSD(payment.amountUsd)} (≈ ${formatVES(payment.amountUsd * bcvRate)} Bs)`
        : formatUSD(payment.amountUsd);
        
      const refStr = (payment.method !== "efectivo" && payment.method !== "efectivo_bs") ? ` [Ref: ${payment.ref}]` : "";
      paymentDetails += `- *${methodLabel}*: ${amountStr}${refStr}\n`;
    });
  }

  const referenceLine = form.paymentMethod !== "efectivo" && form.paymentMethod !== "efectivo_bs" && form.paymentMethod !== "mixto"
    ? `*Referencia de Pago:* ${form.paymentReference}\n`
    : "";

  const splitPaymentLine = form.paymentMethod === "mixto" ? paymentDetails : "";

  let itemDetails = "";
  items.forEach((item) => {
    const qty = item.quantity;
    const isVolume = !!(
      item.product.volumeDiscount &&
      qty >= item.product.volumeDiscount.threshold
    );

    const unitPrice = isVolume
      ? item.product.volumeDiscount!.discountPrice
      : item.product.price;

    const itemTotal = unitPrice * qty;
    const volumeTag = isVolume ? " (Tasa Mayorista)" : "";

    itemDetails += `- *${qty}x* ${item.product.name} [${item.product.sku}]\n  ${formatUSD(unitPrice)} c/u${volumeTag} = *${formatUSD(itemTotal)}*\n\n`;
  });

  const totalVES = totals.total * bcvRate;

  const title = isQuoteOnly 
    ? `*SOLICITUD DE COTIZACIÓN — SUMINISTROS L&D*`
    : `*NUEVO PEDIDO — SUMINISTROS L&D*`;

  const paymentSection = isQuoteOnly
    ? `*Método de Pago:* COTIZACIÓN / PAGO POR TAQUILLA (Presupuesto sin pago preventivo)`
    : `${referenceLine}*Método de Pago:* ${paymentLabel}${splitPaymentLine ? "\n" + splitPaymentLine : ""}`;

  const footer = isQuoteOnly
    ? `*Por favor confirme disponibilidad de los materiales y envíe el presupuesto formal firmado.*`
    : `*Por favor confirme el cobro y coordine el despacho.*`;

  const text = `${title}
---
*Cliente:* ${form.fullName}
*Cédula/RIF:* ${form.rifOrId}
*Teléfono:* ${form.phone}
*Despacho:* ${deliveryLabel}
${addressLine}${paymentSection}
---
*Detalle del Pedido:*

${itemDetails.trim()}

---
*Total USD:* ${formatUSD(totals.total)}
*Total VES (BCV):* ${formatVES(totalVES)}
*Tasa Aplicada (BCV):* ${formatVES(bcvRate)}/$
---
${footer}`;

  return text;
}

export function getWhatsAppLink(phone: string, text: string): string {
  // Clean phone number (remove +, spaces, etc.)
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
