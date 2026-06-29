"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { ChevronDown, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FaqItemProps {
  question: string;
  answer: string;
  id: string;
}

function FaqItem({ question, answer, id }: FaqItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      id={id}
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-slate-900 border rounded-lg p-5 cursor-pointer text-slate-300 font-medium hover:bg-slate-800 hover:text-[#0ee0d5] transition-all select-none flex flex-col justify-between ${
        isOpen ? "border-[#0ee0d5]/30" : "border-slate-800"
      }`}
    >
      <div className="flex justify-between items-center gap-4 w-full">
        <span className="text-sm md:text-base leading-snug">{question}</span>
        <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-950/40 border border-slate-800 text-slate-400 transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[#0ee0d5]" : ""
            }`}
          />
        </div>
      </div>
      
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-normal">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HelpCenterContent() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Background radial overlay styling */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950/40 via-slate-900 to-slate-900 pointer-events-none" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative flex flex-col">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0ee0d5] transition-colors">
            Inicio
          </Link>
          <span className="text-slate-600 select-none">/</span>
          <span className="text-slate-350 font-bold">Centro de Ayuda</span>
        </nav>

        {/* Hero Header */}
        <div className="border-b border-slate-800 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl text-white font-bold tracking-tight font-display">
            Centro de Ayuda al Contratista
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-3 leading-relaxed max-w-3xl">
            Todo lo que necesitas saber sobre procesos de compra, facturación, pagos a tasa oficial y logística de despacho.
          </p>
        </div>

        {/* FAQ Accordion Sections */}
        <div className="flex flex-col gap-6">
          
          {/* Section 1 */}
          <section aria-labelledby="section-pagos">
            <h2 id="section-pagos" className="text-xl text-white mb-4 mt-2 font-semibold font-display tracking-tight flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ee0d5]" />
              TASA Y MÉTODOS DE PAGO
            </h2>
            <div className="flex flex-col gap-3">
              <FaqItem
                id="faq-tasa-bcv"
                question="¿Qué tasa de cambio utilizan para las facturas en Bolívares?"
                answer="Garantizamos absoluta transparencia fiscal. Todos tus presupuestos y liquidaciones en moneda local se calculan estrictamente en base a la tasa de cambio oficial del Banco Central de Venezuela (BCV) del día."
              />
              <FaqItem
                id="faq-cashea"
                question="¿Puedo financiar mis materiales de obra con Cashea?"
                answer="¡Sí! Al concretar tu carrito y pasar por la ventanilla web, indícale al asesor que pagarás bajo el método Cashea. Disfruta de la compra en partes y sin intereses según tu línea de crédito aprobada."
              />
            </div>
          </section>

          {/* Section 2 */}
          <section aria-labelledby="section-logistica">
            <h2 id="section-logistica" className="text-xl text-white mb-4 mt-8 font-semibold font-display tracking-tight flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ee0d5]" />
              LOGÍSTICA Y ENTREGAS (VALLES DEL TUY)
            </h2>
            <div className="flex flex-col gap-3">
              <FaqItem
                id="faq-retiro-tienda"
                question="¿Dónde es el Retiro Gratis por tienda?"
                answer="Contamos con una base central operativa lista para despachar (pick-up). Ubicada en la Calle 15 Miranda, frente al Concejo Municipal, Charallave Centro."
              />
              <FaqItem
                id="faq-despacho-flete"
                question="¿Ofrecen despacho a otros municipios o flete pesado?"
                answer="Por supuesto. Disponemos de delivery rápido dentro del Casco Central de Charallave, y para el resto del Eje Valles del Tuy (Cúa, Ocumare, Santa Teresa, etc.) estructuramos un 'Flete Logístico B2B' seguro a una tarifa preferencial dependiendo del volumen."
              />
            </div>
          </section>

          {/* Section 3 */}
          <section aria-labelledby="section-checkout">
            <h2 id="section-checkout" className="text-xl text-white mb-4 mt-8 font-semibold font-display tracking-tight flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ee0d5]" />
              CÓMO COMPRAR Y VERIFICACIÓN WHATSAPP
            </h2>
            <div className="flex flex-col gap-3">
              <FaqItem
                id="faq-whatsapp-checkout"
                question="¿Por qué la página me redirige a WhatsApp al pagar?"
                answer="Al manejar volúmenes al mayor, aplicamos un protocolo Checkout Híbrido. Tú congelas tu orden digitalmente en esta plataforma e instantáneamente nuestro taquillero corporativo recibe tu #Referencia por chat privado, confirma tu transferencia bancaria/divisa en un máximo de 15 minutos, y despacha fiscalmente de forma 100% segura para ambas partes. Nada de robots automáticos."
              />
            </div>
          </section>

        </div>

        {/* Bottom Call to Action (Glassmorphism Box) */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-750/70 p-8 md:p-10 rounded-2xl text-center mt-16 shadow-xl flex flex-col items-center gap-6 relative overflow-hidden group select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="text-lg md:text-xl font-bold text-white font-display tracking-tight">
              ¿Tienes requerimientos especiales o licitaciones grandes?
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Habla directamente con el escritorio mayorista. Atendemos solicitudes de constructores, ingenieros de obra y departamentos de compra corporativa.
            </p>
          </div>

          <a
            id="cta-atencion-corporativa"
            href="https://wa.me/584141025386?text=Hola,%20deseo%20comunicarme%20con%20el%20escritorio%20mayorista%20sobre%20requerimientos%20especiales%20o%20licitaciones%20B2B."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#0ee0d5]/10 hover:shadow-[#0ee0d5]/20 cursor-pointer"
          >
            Atención Corporativa Inmediata ↗
          </a>
        </div>

        {/* Back Link to Catalog */}
        <div className="flex justify-center mt-12 mb-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-[#0ee0d5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al Catálogo de Materiales
          </Link>
        </div>

      </main>

      {/* Footer and Cart drawer integrations */}
      <Footer />
      <CartDrawer />
    </div>
  );
}
