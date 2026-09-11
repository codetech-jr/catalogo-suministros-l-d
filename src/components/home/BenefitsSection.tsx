import { Banknote, Package, Truck } from "lucide-react";

interface BenefitItem {
  icon: typeof Banknote;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: Banknote,
    title: "Precios a Tasa BCV del Día",
    description:
      "Todos nuestros productos se liquidan al tipo de cambio oficial del Banco Central de Venezuela (BCV) del día. Sin sobreprecios ni tasas paralelas. Consulta el precio actualizado en bolívares directamente en cada producto del catálogo.",
  },
  {
    icon: Package,
    title: "Descuentos por Compras al Mayor",
    description:
      "Electricistas y contratistas acceden a precios especiales comprando desde 5 unidades. Cintas aislantes 3M, tubos PVC Tubrica y cajetines con descuento automático por volumen. Ideal para presupuestos de obra.",
  },
  {
    icon: Truck,
    title: "Delivery Local en Charallave y Valles del Tuy",
    description:
      "Recibe tus materiales eléctricos directamente en tu obra o domicilio en Charallave, Cúa y Ocumare del Tuy. También disponible retiro en nuestra tienda física en la Calle 15 Miranda, frente al Concejo Municipal.",
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-label="Beneficios de comprar en Suministros L&D"
      className="w-full py-12"
    >
      <div className="flex flex-col gap-2 mb-8 text-center items-center">
        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          ¿POR QUÉ ELEGIRNOS?
        </span>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-100 text-center">
          ¿Por Qué Comprar en Suministros L&D?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <article
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 w-fit">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-100">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default BenefitsSection;
