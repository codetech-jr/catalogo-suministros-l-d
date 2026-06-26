import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import { ISuministrosProduct } from "@/types/product";
import { useBcvStore } from "./bcv-store";
import { useState, useEffect } from "react";

export interface CartTotals {
  subtotalUsd: number;          // Pre-discount unit sum in USD
  totalUsd: number;             // Post-discount B2B volume-aware sum in USD
  savingsUsd: number;           // Total savings via volume discount in USD
  totalVES: number;             // Total in Bolívares using the official BCV rate
  itemCount: number;            // Total units of all products
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: ISuministrosProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: (customRate?: number) => CartTotals;
}

const getActivePrice = (product: ISuministrosProduct, quantity: number): number => {
  if (product.volumeDiscount && quantity >= product.volumeDiscount.threshold) {
    return product.volumeDiscount.discountPrice;
  }
  return product.price;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          let updatedItems = [...state.items];

          if (existingItemIndex > -1) {
            const existingItem = state.items[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;
            const newActivePrice = getActivePrice(product, newQuantity);

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
              activePrice: newActivePrice,
            };
          } else {
            const newActivePrice = getActivePrice(product, quantity);
            updatedItems.push({
              product,
              quantity,
              activePrice: newActivePrice,
            });
          }

          return { items: updatedItems };
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
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const newActivePrice = getActivePrice(item.product, quantity);
                return {
                  ...item,
                  quantity,
                  activePrice: newActivePrice,
                };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotals: (customRate) => {
        const rate = customRate ?? useBcvStore.getState().rate ?? 40.25;
        const items = get().items;
        let subtotalUsd = 0;
        let totalUsd = 0;
        let itemCount = 0;

        items.forEach((item) => {
          const qty = item.quantity;
          const originalPrice = item.product.price;
          const activePrice = item.activePrice;

          subtotalUsd += originalPrice * qty;
          totalUsd += activePrice * qty;
          itemCount += qty;
        });

        const savingsUsd = subtotalUsd - totalUsd;
        const totalVES = totalUsd * rate;

        return {
          subtotalUsd,
          totalUsd,
          savingsUsd,
          totalVES,
          itemCount,
        };
      },
    }),
    {
      name: "suministros-ld-cart-v2",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Custom hook to prevent SSR/Hydration errors in Next.js 16+
export function useCart<T>(selector: (state: CartState) => T): T {
  const store = useCartStore(selector);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return selector applied to initial state if not mounted
  return mounted
    ? store
    : selector({
        items: [],
        hasHydrated: false,
        setHasHydrated: () => {},
        addItem: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        getTotals: () => ({
          subtotalUsd: 0,
          totalUsd: 0,
          savingsUsd: 0,
          totalVES: 0,
          itemCount: 0,
        }),
      } as unknown as CartState);
}

export default useCartStore;
