import { create } from "zustand";

export type CurrencyMode = "USD" | "VES";

interface CurrencyState {
  globalCurrencyMode: CurrencyMode;
  switchCount: number;
  setCurrencyMode: (mode: CurrencyMode) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  globalCurrencyMode: "USD",
  switchCount: 0,
  setCurrencyMode: (mode) =>
    set((state) => ({
      globalCurrencyMode: mode,
      switchCount: state.switchCount + 1,
    })),
}));

export default useCurrencyStore;
