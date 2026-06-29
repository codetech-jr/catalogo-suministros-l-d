import type { Metadata } from "next";
import BrandsPageContent from "./BrandsPageContent";

export const metadata: Metadata = {
  title: "Marcas Aliadas y Canales Autorizados | Suministros L&D",
  description: "Ingeniería de primer nivel en cada marca. Agrupamos un catálogo 100% certificado. Somos aliados autorizados y canales regulares de las grandes casas eléctricas del país: Siemens, Exceline, 3M, Bticino y Philips.",
};

export default function MarcasPage() {
  return <BrandsPageContent />;
}
