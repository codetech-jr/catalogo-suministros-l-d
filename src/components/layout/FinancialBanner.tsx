import React from "react";

export function FinancialBanner() {
  return (
    <div className="w-full bg-[#FDFA3D] text-[#000000] px-4 py-2 flex items-center justify-center text-center print:hidden select-none">
      <span className="text-xs md:text-sm font-bold flex items-center gap-2">
        <img src="/Cashea-Icono-Negro.svg" alt="Cashea" className="w-5 h-5" />
        ¡Cashéalo Online! Cuotas sin interés
      </span>
    </div>
  );
}

export default FinancialBanner;

