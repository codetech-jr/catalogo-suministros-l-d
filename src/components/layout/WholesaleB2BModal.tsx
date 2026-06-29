"use client";

import * as React from "react";
import { X, ClipboardList } from "lucide-react";

interface WholesaleB2BModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WholesaleB2BModal({ isOpen, onClose }: WholesaleB2BModalProps) {
  const [razonSocial, setRazonSocial] = React.useState("");
  const [rif, setRif] = React.useState("");
  const [nombreProyecto, setNombreProyecto] = React.useState("");
  const [materiales, setMateriales] = React.useState("");

  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Template of url-text ordered
    const message = `*NUEVO REQUERIMIENTO MAYORISTA*
━━━━━━━━━━━━━━━━━━━━━━

🏢 *Razón Social:* ${razonSocial.trim()}
🆔 *Cédula / RIF:* ${rif.trim()}
🏗️ *Obra o Proyecto:* ${nombreProyecto.trim()}

📋 *Listado de Materiales:*
${materiales.trim()}

━━━━━━━━━━━━━━━━━━━━━━
Enviado desde el Portal de Mayoristas.`;

    const whatsappUrl = `https://wa.me/584141025386?text=${encodeURIComponent(message)}`;
    
    // Open clean window/tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    
    // Close modal
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0ee0d5]"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl text-white font-bold leading-tight flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-[#0ee0d5]" />
            Portal de Atención a Mayoristas y Proyectos
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Cotizamos listas pesadas (BOM) y despachamos proyectos corporativos bajo márgenes preferenciales.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Razón Social */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="razonSocial" 
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Razón Social de la Empresa
              </label>
              <input
                id="razonSocial"
                type="text"
                required
                placeholder="Ej. Constructora Delta, C.A."
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-[#0ee0d5] outline-none text-white transition-colors"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
              />
            </div>

            {/* Cédula / RIF */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="rif" 
                className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Cédula / RIF
              </label>
              <input
                id="rif"
                type="text"
                required
                placeholder="Ej. J-12345678-9"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-[#0ee0d5] outline-none text-white transition-colors"
                value={rif}
                onChange={(e) => setRif(e.target.value)}
              />
            </div>
          </div>

          {/* Nombre de la Obra o Proyecto */}
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="nombreProyecto" 
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Nombre de la Obra o Proyecto
            </label>
            <input
              id="nombreProyecto"
              type="text"
              required
              placeholder="Ej. Proyecto Res. Las Margaritas"
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-[#0ee0d5] outline-none text-white transition-colors"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
            />
          </div>

          {/* Área para Pegar Materiales (Full Width) */}
          <div className="flex flex-col gap-1.5">
            <label 
              htmlFor="materiales" 
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Área para Pegar Materiales
            </label>
            <div className="relative group rounded-lg overflow-hidden border border-slate-700 focus-within:border-[#0ee0d5] transition-colors bg-slate-800">
              <textarea
                id="materiales"
                required
                rows={6}
                placeholder="Ejemplo:&#10;- 50 rollos de cable THHN #12 Pirelli&#10;- 20 tableros de 12 circuitos Square D&#10;- 100 paneles LED 60x60 Luz Fría 40W"
                className="w-full bg-transparent p-3 text-sm outline-none text-white font-mono resize-none"
                value={materiales}
                onChange={(e) => setMateriales(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 pointer-events-none select-none font-mono">
                Formato libre o copia de Excel
              </div>
            </div>
          </div>

          {/* WhatsApp Handoff Button */}
          <button
            type="submit"
            className="w-full bg-[#0ee0d5] hover:bg-[#0bc2b9] text-slate-900 font-bold py-4 rounded-xl mt-4 flex justify-center items-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#0ee0d5]/10 hover:shadow-[#0ee0d5]/20 cursor-pointer"
          >
            <span>Generar Requerimiento Comercial y Asignar Asesor ➔</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default WholesaleB2BModal;
