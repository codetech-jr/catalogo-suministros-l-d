import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed values
  getTotals: () => {
    subtotal: number; // Pre-discount unit sum
    total: number;    // Post-discount volume-aware sum
    savings: number;  // Amount saved via volume discount
    itemCount: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          }
          
          return { items: [...state.items, { product, quantity }] };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotals: () => {
        const items = get().items;
        let subtotal = 0;
        let total = 0;
        let itemCount = 0;
        
        items.forEach((item) => {
          const qty = item.quantity;
          const price = item.product.price;
          let activePrice = price;
          
          if (
            item.product.volumeDiscount &&
            qty >= item.product.volumeDiscount.threshold
          ) {
            activePrice = item.product.volumeDiscount.discountPrice;
          }
          
          subtotal += price * qty;
          total += activePrice * qty;
          itemCount += qty;
        });
        
        const savings = subtotal - total;
        
        return { subtotal, total, savings, itemCount };
      },
    }),
    {
      name: "suministros-ld-cart-v1",
    }
  )
);
export default useCartStore;
