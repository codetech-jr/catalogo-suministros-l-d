import { Truck, Landmark, ShieldCheck } from "lucide-react";

export function TrustSignals() {
  const signals = [
    {
      icon: <Truck className="h-8 w-8 text-accent-electric filter drop-shadow-[0_0_6px_rgba(0,229,255,0.2)]" />,
      title: "Retiro y Delivery Local",
      description: "Retira gratis en nuestro local de Charallave o solicita fletes reducidos para todo el Tuy.",
    },
    {
      icon: <Landmark className="h-8 w-8 text-accent-amber filter drop-shadow-[0_0_6px_rgba(255,179,0,0.2)]" />,
      title: "Pagos Flexibles",
      description: "Zelle, Pago Móvil, Binance Pay y efectivo con facturación legal calculada a tasa oficial BCV.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-success filter drop-shadow-[0_0_6px_rgba(34,197,94,0.2)]" />,
      title: "Verificación por WhatsApp",
      description: "Completas el checkout web y un asesor de mostrador valida tu referencia en menos de 15 minutos.",
    },
  ];

  return (
    <section className="w-full py-12 border-t border-b border-hairline/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {signals.map((signal, idx) => (
          <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-3 p-5 rounded-xl bg-canvas-card border border-hairline/30">
            <div className="p-2.5 rounded-lg bg-canvas-elevated border border-hairline">
              {signal.icon}
            </div>
            <h3 className="font-display text-base font-bold text-text-primary">
              {signal.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              {signal.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustSignals;
