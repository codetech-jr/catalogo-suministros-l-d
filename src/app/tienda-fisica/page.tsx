import type { Metadata } from "next";
import StorePageContent from "./StorePageContent";

export const metadata: Metadata = {
  title: "Nuestra Sede Operativa y Tienda | Suministros L&D",
  description: "El epicentro logístico para contratistas en los Valles del Tuy (Charallave). Retira tus compras de inmediato, revisa los materiales y carga tu transporte con la asesoría de especialistas en el mostrador.",
};

export default function TiendaFisicaPage() {
  return <StorePageContent />;
}
