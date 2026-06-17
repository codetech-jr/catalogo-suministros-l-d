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
  rate: 40.25,
  source: "default",
  updatedAt: new Date().toISOString(),
  isLoading: false,
  error: null,
  
  fetchRate: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/bcv-rate");
      if (!res.ok) throw new Error("Failed to fetch rate");
      const data = await res.json();
      set({
        rate: data.rate,
        source: data.source,
        updatedAt: data.updatedAt,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Error in fetchRate store action:", err);
      set({
        isLoading: false,
        error: err.message || "Error al obtener la tasa",
      });
    }
  },
  
  setManualRate: (newRate: number) => {
    set({
      rate: newRate,
      source: "manual_override",
      updatedAt: new Date().toISOString(),
    });
  },
}));

export default useBcvStore;
