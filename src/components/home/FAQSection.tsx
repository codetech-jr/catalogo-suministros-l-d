"use client";

import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "¿Qué marcas de interruptores termomagnéticos (breakers) tienen disponibles?",
    answer:
      "Trabajamos con interruptores termomagnéticos de marcas reconocidas como Schneider Electric (línea QO y Easy9), Protonic Electric y Belt-G. Disponibles en amperajes desde 15A hasta 100A para tableros residenciales e industriales. Todos los precios se muestran a tasa BCV del día.",
  },
  {
    question: "¿Hacen envíos fuera de Charallave?",
    answer:
      "Sí, realizamos delivery local cubriendo Charallave, Cúa y Ocumare del Tuy en los Valles del Tuy, Estado Miranda. También puedes retirar directamente en nuestra tienda física ubicada en la Calle 15 Miranda, Charallave. Para zonas fuera de cobertura, contáctanos por WhatsApp para coordinar el envío.",
  },
  {
    question: "¿Tienen precios especiales para compras al por mayor?",
    answer:
      "Sí, ofrecemos descuentos automáticos por volumen a partir de 5 unidades en productos seleccionados como cintas aislantes, tubos PVC, cajetines y conectores. Los electricistas y contratistas pueden solicitar cotizaciones personalizadas para obras completas a través de nuestro WhatsApp.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      aria-label="Preguntas frecuentes"
      className="relative z-10 w-full max-w-3xl mx-auto py-12 px-4 sm:px-6"
    >
      <div className="flex flex-col gap-2 items-center text-center mb-8">
        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          RESUELVE TUS DUDAS
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
          Preguntas Frecuentes sobre Materiales Eléctricos en Charallave
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-colors duration-200 open:border-slate-700"
          >
            <summary className="flex items-center justify-between p-5 font-display text-sm font-bold text-slate-200 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:text-[#007BFF] transition-colors select-none">
              <span>{item.question}</span>
              <ChevronDown
                aria-hidden="true"
                className="chevron-icon h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-hover:text-[#007BFF]"
              />
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
