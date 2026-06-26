import React from "react";

export function FinancialBanner() {
  return (
    <div className="w-full bg-slate-950 text-slate-300 px-4 py-2 border-b border-slate-900 flex items-center justify-center text-center select-none">
      <span className="text-[11px] font-mono tracking-wide uppercase flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-slate-200">
          Cashea
        </span>
        ¡Compra a cuotas sin interés!
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-slate-200">
          BCV
        </span>
        Tasa oficial garantizada
      </span>
    </div>
  );
}

export default FinancialBanner;
