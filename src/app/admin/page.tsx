import { CurrencyCalculator } from "@/components/admin/CurrencyCalculator";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-tight">
          Panel de Control
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Gestión centralizada de tasas, inventario y operaciones de
          Suministros L&D.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Productos Activos
          </span>
          <span className="font-display text-2xl font-bold text-slate-100">
            12
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            +3 esta semana
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Cotizaciones Hoy
          </span>
          <span className="font-display text-2xl font-bold text-slate-100">
            8
          </span>
          <span className="text-[10px] text-[#007BFF] font-mono font-bold">
            WhatsApp activo
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Spread Actual
          </span>
          <span className="font-display text-2xl font-bold text-amber-400">
            +9.6%
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-bold">
            Binance vs BCV
          </span>
        </div>
      </div>

      {/* Currency Calculator Module */}
      <CurrencyCalculator />
    </div>
  );
}
