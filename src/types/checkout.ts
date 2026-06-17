export type DeliveryType = "retiro" | "delivery_charallave" | "delivery_tuy";

export type PaymentMethod = "pago_movil" | "zelle" | "binance" | "efectivo";

export interface CheckoutForm {
  fullName: string;
  rifOrId: string;
  phone: string;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
}
