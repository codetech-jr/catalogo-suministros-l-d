// ---------------------------------------------------------------------------
// BCV Store — Compatibility Re-export
// ---------------------------------------------------------------------------
// The financial state now lives in the unified `currency-store.ts`.
// This file remains as a compatibility bridge so existing imports
// (cart-store, API route, components) continue to work without mass renames.
// ---------------------------------------------------------------------------

import { useCurrencyStore } from "./currency-store";
import { create } from "zustand";

interface BcvState {
  rate: number;
  source: string;
  updatedAt: string;
  isLoading: boolean;
  error: string | null;
  fetchRate: () => Promise<void>;
  setManualRate: (rate: number) => void;
}

export const useBcvStore = create<BcvState>((set) => ({
  rate: useCurrencyStore.getState().rateBcv,
  source: "unified-store",
  updatedAt: useCurrencyStore.getState().lastUpdated,
  isLoading: false,
  error: null,

  fetchRate: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/bcv-rate");
      if (!res.ok) throw new Error("Failed to fetch rate");
      const data = await res.json();

      // Sync both stores
      useCurrencyStore.getState().setRateBcv(data.rate);
      set({
        rate: data.rate,
        source: data.source,
        updatedAt: data.updatedAt,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al obtener la tasa";
      console.error("Error in fetchRate store action:", err);
      set({
        isLoading: false,
        error: message,
      });
    }
  },

  setManualRate: (newRate: number) => {
    useCurrencyStore.getState().setRateBcv(newRate);
    set({
      rate: newRate,
      source: "manual_override",
      updatedAt: new Date().toISOString(),
    });
  },
}));

export default useBcvStore;
