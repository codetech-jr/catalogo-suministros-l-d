"use client";

import * as React from "react";
import { useBcvStore } from "@/store/bcv-store";
import { Edit2, Check, X, RefreshCw } from "lucide-react";
import { formatVES } from "@/lib/utils/format-currency";

export function BcvRateWidget() {
  const { rate, source, updatedAt, isLoading, fetchRate, setManualRate } = useBcvStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(rate.toString());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Keep input value in sync with rate when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setInputValue(rate.toString());
    }
  }, [rate, isEditing]);

  // Fetch initial rate on load
  React.useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const handleSave = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed > 0) {
      setManualRate(parsed);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setInputValue(rate.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-950/40 border border-slate-800 px-3 py-1 text-xs select-none">
      <span className="text-slate-400 font-mono font-medium tracking-tight">BCV:</span>
      
      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.01"
            className="w-16 bg-slate-900 text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 outline-none font-mono text-center text-xs"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-emerald-500 hover:text-emerald-450 p-0.5 cursor-pointer"
            title="Guardar tasa"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setInputValue(rate.toString());
              setIsEditing(false);
            }}
            className="text-rose-500 hover:text-rose-400 p-0.5 cursor-pointer"
            title="Cancelar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-slate-200">
            {formatVES(rate)}
          </span>
          {source === "manual_override" && (
            <span className="text-[9px] bg-amber-500/10 text-amber-400/80 border border-amber-500/20 px-1.5 rounded font-mono scale-90">
              MANUAL
            </span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-500 hover:text-slate-350 transition-colors p-0.5 cursor-pointer"
            title="Editar tasa manualmente"
          >
            <Edit2 className="h-3 w-3" />
          </button>
        </div>
      )}

      <button
        onClick={() => fetchRate()}
        disabled={isLoading}
        className={`text-slate-500 hover:text-slate-350 transition-colors p-0.5 cursor-pointer ${
          isLoading ? "animate-spin text-slate-450" : ""
        }`}
        title={mounted ? `Actualizar tasa. Origen: ${source}. Último fetch: ${new Date(
          updatedAt
        ).toLocaleTimeString()}` : "Actualizar tasa"}
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default BcvRateWidget;
