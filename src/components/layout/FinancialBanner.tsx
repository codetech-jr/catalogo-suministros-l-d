import { Sparkles, Landmark } from "lucide-react";

export function FinancialBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#12141c] to-[#241a3a] border-b border-hairline py-2.5 px-4 text-xs select-none">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Cashea Promo */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-[#ffb300]/10 border border-[#ffb300]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#ffb300] font-mono uppercase tracking-wider">
            Cashea
          </span>
          <p className="text-text-secondary">
            Compra hoy y paga en cuotas sin interés. Hasta 6 meses de financiamiento.
          </p>
        </div>

        {/* BCV compliance tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/20 px-1.5 py-0.5 text-[10px] font-bold text-accent-electric font-mono uppercase tracking-wider">
            Legal BCV
          </span>
          <p className="text-text-secondary">
            Transparencia total. Liquidación garantizada a Tasa Oficial del Banco Central.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FinancialBanner;
