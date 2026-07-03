"use client";

import * as React from "react";
import { useCurrencyStore } from "@/store/currency-store";
import { getStorePrices } from "@/lib/utils/pricing-engine";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { ArrowDownUp, Save, RefreshCcw, TrendingUp, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

export function CurrencyCalculator() {
  const rateBcv = useCurrencyStore((s) => s.rateBcv);
  const rateBinance = useCurrencyStore((s) => s.rateBinance);
  const lastUpdated = useCurrencyStore((s) => s.lastUpdated);
  const setBothRates = useCurrencyStore((s) => s.setBothRates);
  const fetchRatesFromDB = useCurrencyStore((s) => s.fetchRatesFromDB);

  const [localBcv, setLocalBcv] = React.useState(rateBcv.toString());
  const [localBinance, setLocalBinance] = React.useState(rateBinance.toString());
  const [saved, setSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState("");

  // Sync local state when store changes externally
  React.useEffect(() => {
    setLocalBcv(rateBcv.toString());
    setLocalBinance(rateBinance.toString());
  }, [rateBcv, rateBinance]);

  const handleSave = async () => {
    const bcv = parseFloat(localBcv) || 0;
    const binance = parseFloat(localBinance) || 0;
    if (bcv <= 0 || binance <= 0) return;

    setIsSaving(true);
    setToastMsg("");

    try {
      const now = new Date().toISOString();
      const { data, error, count } = await supabase
        .from("config_tasas")
        .update({
          rate_bcv: bcv,
          rate_binance: binance,
          updated_at: now,
        })
        .eq("id", 1)
        .select();

      if (error) {
        throw error;
      }

      // Detect silent RLS/policy failures — Supabase returns success but 0 rows affected
      if (!data || data.length === 0) {
        console.error("Supabase update returned 0 rows — possible RLS policy blocking writes with anon key.");
        setToastMsg("⚠️ Error: La base de datos rechazó la escritura. Revisa los permisos RLS en Supabase.");
        setTimeout(() => setToastMsg(""), 5000);
        return;
      }

      // Sync Zustand Store state with database
      await fetchRatesFromDB();

      setSaved(true);
      setToastMsg("¡Guardado exitoso! Tasas actualizadas en base de datos. ✅");
      setTimeout(() => {
        setSaved(false);
      }, 2000);
      setTimeout(() => {
        setToastMsg("");
      }, 3000);
    } catch (err: any) {
      console.error("Error al actualizar las tasas cambiarias:", err);
      setToastMsg("Error de conexión: No se pudieron guardar las tasas.");
      setTimeout(() => {
        setToastMsg("");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Live simulation
  const simBcv = parseFloat(localBcv) || 0;
  const simBinance = parseFloat(localBinance) || 0;
  const simulation = getStorePrices(10, simBcv, simBinance);
  const spread = simBcv > 0 ? (((simBinance - simBcv) / simBcv) * 100).toFixed(1) : "0.0";

  return (
    <section className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-[#007BFF]/10 border border-[#007BFF]/20 rounded-xl">
          <ArrowDownUp className="h-5 w-5 text-[#007BFF]" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-slate-100 tracking-tight">
            Calculadora Cambiaria Global
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">
            Último ajuste: {new Date(lastUpdated).toLocaleString("es-VE")}
          </p>
        </div>
      </div>

      {/* Rate Inputs Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* BCV Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-amber-400" />
              Tasa BCV Oficial (Bs/$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono font-bold">
                Bs.
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={localBcv}
                onChange={(e) => setLocalBcv(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 rounded-lg pl-10 pr-4 py-3 text-lg font-mono font-bold text-slate-100 outline-none transition-all placeholder:text-slate-600"
                placeholder="36.50"
              />
            </div>
            <span className="text-[9px] text-slate-500 font-mono">
              Tasa Fiscal BCV para facturación legal
            </span>
          </div>

          {/* Binance Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-[#007BFF]" />
              Tasa Binance / Reposición (Bs/$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono font-bold">
                Bs.
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={localBinance}
                onChange={(e) => setLocalBinance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/25 rounded-lg pl-10 pr-4 py-3 text-lg font-mono font-bold text-slate-100 outline-none transition-all placeholder:text-slate-600"
                placeholder="40.00"
              />
            </div>
            <span className="text-[9px] text-slate-500 font-mono">
              Tasa de mercado paralelo para proteger tu costo
            </span>
          </div>
        </div>

        {/* Spread Indicator */}
        <div className="mt-4 px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            Spread Binance / BCV
          </span>
          <span className={`text-sm font-mono font-bold ${parseFloat(spread) > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            +{spread}%
          </span>
        </div>

        {/* Live Simulation Panel */}
        <div className="mt-5 p-4 bg-slate-950/40 border border-dashed border-slate-700 rounded-lg">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3">
            Simulación en Tiempo Real
          </span>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-slate-500">Costo Base</span>
              <span className="text-sm font-mono font-bold text-slate-300">$10.00</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-slate-500">Cliente ve (Bs)</span>
              <span className="text-sm font-mono font-bold text-white">
                {formatVES(simulation.netVES)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-slate-500">Vitrina USD</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {formatUSD(simulation.displayUSD)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-slate-500 leading-relaxed text-center">
            Tus productos de <strong className="text-slate-300">$10 USD</strong> mostrarán al cliente:{" "}
            <strong className="text-white">{formatVES(simulation.netVES)}</strong>
            {" "}o{" "}
            <strong className="text-amber-400">{formatUSD(simulation.displayUSD)}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              saved
                ? "bg-emerald-600 text-white"
                : isSaving
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-[#007BFF] hover:bg-[#1a8cff] text-slate-900 shadow-md shadow-blue-950/20 active:scale-[0.98]"
            }`}
          >
            {isSaving ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Guardado Exitosamente" : isSaving ? "Guardando..." : "Guardar Ajuste Diario"}
          </button>
          <button
            onClick={() => {
              setLocalBcv(rateBcv.toString());
              setLocalBinance(rateBinance.toString());
            }}
            className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Revertir cambios"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-mono text-xs max-w-sm"
          >
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CurrencyCalculator;
