import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Unified Financial Store — Suministros L&D
// Consolidates exchange-rate state (BCV + Binance) and display-currency toggle
// into a single Zustand store for the entire application.
// ---------------------------------------------------------------------------

export type DisplayCurrency = "VES" | "USD";

export interface CurrencyState {
  /** Tasa BCV oficial (Vitrina Legal Fiscal). Ej: 36.50 */
  rateBcv: number;
  /** Tasa Binance / Mercado de Reposición. Ej: 40.00 */
  rateBinance: number;
  /** Moneda visible al público. Default VES para foco en Bolívares B2C */
  displayCurrency: DisplayCurrency;
  /** ISO timestamp of last rate update */
  lastUpdated: string;

  // — Setters —
  setRateBcv: (rate: number) => void;
  setRateBinance: (rate: number) => void;
  setDisplayCurrency: (mode: DisplayCurrency) => void;
  /** Atomic setter for admin dashboard — updates both rates at once */
  setBothRates: (bcv: number, binance: number) => void;
  /** Fetch exchange rates from Supabase config_tasas table (id=1) */
  fetchRatesFromDB: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  rateBcv: 36.5,
  rateBinance: 40.0,
  displayCurrency: "VES",
  lastUpdated: new Date().toISOString(),

  setRateBcv: (rate) =>
    set({ rateBcv: rate, lastUpdated: new Date().toISOString() }),

  setRateBinance: (rate) =>
    set({ rateBinance: rate, lastUpdated: new Date().toISOString() }),

  setDisplayCurrency: (mode) => set({ displayCurrency: mode }),

  setBothRates: (bcv, binance) =>
    set({
      rateBcv: bcv,
      rateBinance: binance,
      lastUpdated: new Date().toISOString(),
    }),

  fetchRatesFromDB: async () => {
    try {
      const { data, error } = await supabase
        .from("config_tasas")
        .select("rate_bcv, rate_binance, updated_at")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error al obtener tasas desde Supabase:", error);
        return;
      }

      if (data) {
        const bcv = typeof data.rate_bcv === "string" ? parseFloat(data.rate_bcv) : Number(data.rate_bcv);
        const binance = typeof data.rate_binance === "string" ? parseFloat(data.rate_binance) : Number(data.rate_binance);

        if (!isNaN(bcv) && !isNaN(binance) && bcv > 0 && binance > 0) {
          set({
            rateBcv: bcv,
            rateBinance: binance,
            lastUpdated: data.updated_at || new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error("Falla de red/conexión al hidratar tasas de cambio:", err);
    }
  },
}));

export default useCurrencyStore;
