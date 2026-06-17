import { CartItem } from "@/types/cart";
import { CheckoutForm } from "@/types/checkout";
import { formatUSD, formatVES } from "./format-currency";

export function buildWhatsAppMessage(
  items: CartItem[],
  form: CheckoutForm,
  bcvRate: number,
  totals: { subtotal: number; total: number; savings: number }
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
    efectivo: "EFECTIVO POR TAQUILLA",
  }[form.paymentMethod];

  const addressLine = form.deliveryType !== "retiro"
    ? `*Dirección:* ${form.deliveryAddress}\n`
    : "";

  const referenceLine = form.paymentMethod !== "efectivo"
    ? `*Referencia de Pago:* ${form.paymentReference}\n`
    : "";

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
    const volumeTag = isVolume ? " (Tasa Mayorista B2B)" : "";

    itemDetails += `- *${qty}x* ${item.product.name} [${item.product.sku}]\n  ${formatUSD(unitPrice)} c/u${volumeTag} = *${formatUSD(itemTotal)}*\n\n`;
  });

  const totalVES = totals.total * bcvRate;

  const text = `*NUEVO PEDIDO — SUMINISTROS L&D*
---
*Cliente:* ${form.fullName}
*Cédula/RIF:* ${form.rifOrId}
*Teléfono:* ${form.phone}
*Despacho:* ${deliveryLabel}
${addressLine}${referenceLine}*Método de Pago:* ${paymentLabel}

---
*Detalle del Pedido:*

${itemDetails.trim()}

---
*Total USD:* ${formatUSD(totals.total)}
*Total VES (BCV):* ${formatVES(totalVES)}
*Tasa Aplicada (BCV):* ${formatVES(bcvRate)}/$
---
*Por favor confirme el cobro y coordine el despacho.*`;

  return text;
}

export function getWhatsAppLink(phone: string, text: string): string {
  // Clean phone number (remove +, spaces, etc.)
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
