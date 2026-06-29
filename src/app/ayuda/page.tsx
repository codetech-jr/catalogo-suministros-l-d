import type { Metadata } from "next";
import HelpCenterContent from "./HelpCenterContent";

export const metadata: Metadata = {
  title: "Centro de Ayuda al Contratista | Suministros L&D",
  description: "Todo lo que necesitas saber sobre procesos de compra, facturación, pagos a tasa oficial BCV y logística de despacho en los Valles del Tuy (Charallave, Cúa, Ocumare).",
};

export default function AyudaPage() {
  return <HelpCenterContent />;
}
