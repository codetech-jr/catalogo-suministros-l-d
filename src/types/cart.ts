import { ISuministrosProduct } from "./product";

export interface CartItem {
  product: ISuministrosProduct;
  quantity: number;
  activePrice: number; // Computed unit price based on volume tier
}
