"use client";

import * as React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { 
  Check, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  Lightbulb, 
  Cable, 
  Hammer, 
  Layers, 
  Zap, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductsStore } from "@/store/products-store";

interface BrandItem {
  id: string;
  name: string;
  categoryKey: string;
  description: string;
  logoSrc?: string;
  filterUrl: string;
}

interface BrandCategoryGroup {
  id: string;
  categoryTitle: string;
  icon: React.ReactNode;
  brands: BrandItem[];
}

const BRAND_GROUPS: BrandCategoryGroup[] = [
  {
    id: "proteccion-electrica",
    categoryTitle: "Protección y Control Eléctrico",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
    brands: [
      {
        id: "bticino",
        name: "Bticino",
        categoryKey: "proteccion-electrica",
        description: "Tableros, breakers, canaletas y mecanismos modulares de alto estándar y acabados prémium.",
        logoSrc: "/logo-bticino.webp",
        filterUrl: "/catalogo?brand=Bticino",
      },
      {
        id: "exceline",
        name: "Exceline",
        categoryKey: "proteccion-electrica",
        description: "Líder indiscutible en protectores de voltaje corporativos, refrigeración y línea blanca.",
        logoSrc: "/logo-exceline.svg",
        filterUrl: "/catalogo?brand=Exceline",
      },
      {
        id: "siemens",
        name: "Siemens",
        categoryKey: "proteccion-electrica",
        description: "Interruptores termomagnéticos, contactores y tableros pesados de máxima fiabilidad industrial.",
        logoSrc: "/logo-siemens.svg",
        filterUrl: "/catalogo?brand=Siemens",
      },
      {
        id: "schneider",
        name: "Schneider Electric",
        categoryKey: "proteccion-electrica",
        description: "Sistemas avanzados de automatización, distribución de potencia y protección modular.",
        logoSrc: "/logo-scheider-electric.webp",
        filterUrl: "/catalogo?brand=Schneider",
      },
      {
        id: "protonic",
        name: "Protonic",
        categoryKey: "proteccion-electrica",
        description: "Protectores electrónicos y supervisores de voltaje de alta precisión.",
        logoSrc: "/logo-protonic.webp",
        filterUrl: "/catalogo?brand=Protonic",
      },
      {
        id: "iconel",
        name: "Iconel",
        categoryKey: "proteccion-electrica",
        description: "Cajetines metálicos, tableros y canalizaciones para obras de media y baja tensión.",
        logoSrc: "/logo-iconel.webp",
        filterUrl: "/catalogo?brand=Iconel",
      },
    ],
  },
  {
    id: "luminaria-led",
    categoryTitle: "Iluminación LED Comercial e Industrial",
    icon: <Lightbulb className="h-5 w-5 text-[#007BFF]" />,
    brands: [
      {
        id: "pickens",
        name: "Pickens",
        categoryKey: "luminaria-led",
        description: "Luminarias, proyectores y tecnología LED de alto rendimiento para iluminación arquitectónica y comercial.",
        filterUrl: "/catalogo?brand=Pickens",
      },
      {
        id: "lumistar",
        name: "Lumistar",
        categoryKey: "luminaria-led",
        description: "Reflectores de alta potencia, paneles LED de empotrar y luminarias viales de bajo consumo.",
        logoSrc: "/logo-lumistar.webp",
        filterUrl: "/catalogo?brand=Lumistar",
      },
      {
        id: "vert",
        name: "Vért",
        categoryKey: "luminaria-led",
        description: "Luminarias industriales, campanas UFO y bombillería LED eficiente de larga durabilidad.",
        logoSrc: "/logo-vert.webp",
        filterUrl: "/catalogo?brand=Vert",
      },
      {
        id: "philips",
        name: "Philips",
        categoryKey: "luminaria-led",
        description: "Iluminación profesional de vanguardia, balastros y tubos LED con garantía internacional.",
        logoSrc: "/logo-philips.webp",
        filterUrl: "/catalogo?brand=Philips",
      },
      {
        id: "exxel",
        name: "Exxel",
        categoryKey: "luminaria-led",
        description: "Reflectores solares, luminarias públicas y bombillos LED recargables.",
        logoSrc: "/logo-exxel.webp",
        filterUrl: "/catalogo?brand=Exxel",
      },
      {
        id: "emg",
        name: "EMG",
        categoryKey: "luminaria-led",
        description: "Sistemas de iluminación de emergencia, balizas y señalética autónoma para proyectos.",
        logoSrc: "/logo-emg.webp",
        filterUrl: "/catalogo?brand=EMG",
      },
    ],
  },
  {
    id: "tuberias-cables-y-conexiones",
    categoryTitle: "Tuberías, Canalización y Conexiones",
    icon: <Cable className="h-5 w-5 text-cyan-400" />,
    brands: [
      {
        id: "tubrica",
        name: "Tubrica",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Tuberías Conduit PVC, CPVC, sistemas sanitarios y canalización eléctrica certificada.",
        logoSrc: "/logo-tubrica.webp",
        filterUrl: "/catalogo?brand=Tubrica",
      },
      {
        id: "pcp",
        name: "PCP",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Válvulas plásticas, tuberías hidráulicas y accesorios de conducción de fluidos.",
        logoSrc: "/logo-pcp.webp",
        filterUrl: "/catalogo?brand=PCP",
      },
      {
        id: "termofusion",
        name: "Termofusión",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Tuberías y conexiones de polipropileno copolímero random (PPR) para alta presión.",
        logoSrc: "/logo-termofusion.webp",
        filterUrl: "/catalogo?brand=Termofusion",
      },
      {
        id: "faguax",
        name: "Faguax",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Válvulas de paso de bronce, cheques, flotadores y griferías de alta resistencia.",
        logoSrc: "/logo-faguax.webp",
        filterUrl: "/catalogo?brand=Faguax",
      },
      {
        id: "ferco",
        name: "Ferco",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Conexiones galvanizadas, niples, uniones universales y codos para conducción rígida.",
        logoSrc: "/logo-ferco.webp",
        filterUrl: "/catalogo?brand=Ferco",
      },
      {
        id: "aquafina",
        name: "Aquafina",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Equipos hidroneumáticos, bombas y filtros de agua de alta durabilidad.",
        logoSrc: "/logo-aquafina.webp",
        filterUrl: "/catalogo?brand=Aquafina",
      },
      {
        id: "venceramica",
        name: "Vencerámica",
        categoryKey: "tuberias-cables-y-conexiones",
        description: "Piezas sanitarias, griferías y acabados hidrosanitarios para obras residenciales y comerciales.",
        logoSrc: "/logo-venceramica.webp",
        filterUrl: "/catalogo?brand=Venceramica",
      },
    ],
  },
  {
    id: "cintas-y-adhesivos",
    categoryTitle: "Cintas, Adhesivos y Químicos de Construcción",
    icon: <Layers className="h-5 w-5 text-indigo-400" />,
    brands: [
      {
        id: "3m",
        name: "3M / Temflex",
        categoryKey: "cintas-y-adhesivos",
        description: "Aislantes eléctricos de alto desempeño, teipes Temflex 1700, resinas y conectores.",
        logoSrc: "/logo-3M.webp",
        filterUrl: "/catalogo?brand=3M",
      },
      {
        id: "cobra",
        name: "Cobra",
        categoryKey: "cintas-y-adhesivos",
        description: "Soldaduras líquidas y cementos solventes para PVC y CPVC de fraguado rápido.",
        logoSrc: "/logo-cobra.webp",
        filterUrl: "/catalogo?brand=Cobra",
      },
      {
        id: "ceramipego",
        name: "Ceramipego",
        categoryKey: "cintas-y-adhesivos",
        description: "Pegas y morteros adhesivos especializados para cerámica, mármol y porcelanato.",
        logoSrc: "/logo-ceramipego.webp",
        filterUrl: "/catalogo?brand=Ceramipego",
      },
      {
        id: "reinco",
        name: "Reinco",
        categoryKey: "cintas-y-adhesivos",
        description: "Pegas de madera, selladores acrílicos y químicos para acabados profesionales.",
        logoSrc: "/logo-reinco.webp",
        filterUrl: "/catalogo?brand=Reinco",
      },
      {
        id: "manpica",
        name: "Manpica",
        categoryKey: "cintas-y-adhesivos",
        description: "Pinturas, anticorrosivos, fondos de herrería y esmaltes de alta durabilidad.",
        logoSrc: "/logo-manpica.webp",
        filterUrl: "/catalogo?brand=Manpica",
      },
      {
        id: "proxical",
        name: "Proxical",
        categoryKey: "cintas-y-adhesivos",
        description: "Cal hidratada de alta pureza y productos químicos para mezclas de albañilería.",
        logoSrc: "/logo-proxical.webp",
        filterUrl: "/catalogo?brand=Proxical",
      },
      {
        id: "cebra",
        name: "Cebra",
        categoryKey: "cintas-y-adhesivos",
        description: "Brochas, rodillos y aplicadores profesionales para recubrimientos y pinturas.",
        logoSrc: "/logo-cebra.webp",
        filterUrl: "/catalogo?brand=Cebra",
      },
    ],
  },
  {
    id: "herramientas-y-equipos",
    categoryTitle: "Herramientas y Equipos de Construcción",
    icon: <Hammer className="h-5 w-5 text-slate-300" />,
    brands: [
      {
        id: "truper",
        name: "Truper",
        categoryKey: "herramientas-y-equipos",
        description: "Línea completa de herramientas manuales, pinzas de electricista, cintas y equipos de obra.",
        logoSrc: "/logo-truper.webp",
        filterUrl: "/catalogo?brand=Truper",
      },
      {
        id: "ingco",
        name: "Ingco",
        categoryKey: "herramientas-y-equipos",
        description: "Herramientas electroportátiles, taladros, esmeriles, niveles láser y accesorios de grado industrial.",
        logoSrc: "/logo-ingco.webp",
        filterUrl: "/catalogo?brand=Ingco",
      },
      {
        id: "bosch",
        name: "Bosch",
        categoryKey: "herramientas-y-equipos",
        description: "Ingeniería alemana en rotomartillos, discos de corte, brocas y herramientas de precisión.",
        logoSrc: "/logo-bosch.webp",
        filterUrl: "/catalogo?brand=Bosch",
      },
      {
        id: "stanley",
        name: "Stanley",
        categoryKey: "herramientas-y-equipos",
        description: "Flexómetros, arcos de segueta, organizadores y herramientas para contratistas.",
        logoSrc: "/logo-stanley.webp",
        filterUrl: "/catalogo?brand=Stanley",
      },
      {
        id: "bellota",
        name: "Bellota",
        categoryKey: "herramientas-y-equipos",
        description: "Herramientas agrícolas, palas, llanas y discos de desbaste de máxima resistencia.",
        logoSrc: "/logo-bellota.webp",
        filterUrl: "/catalogo?brand=Bellota",
      },
      {
        id: "fermetal",
        name: "Fermetal",
        categoryKey: "herramientas-y-equipos",
        description: "Cerraduras, candados, pernos, tornillería y herrajes de seguridad para edificaciones.",
        logoSrc: "/logo-fermetal.webp",
        filterUrl: "/catalogo?brand=Fermetal",
      },
      {
        id: "lincoln",
        name: "Lincoln Electric",
        categoryKey: "herramientas-y-equipos",
        description: "Electrodos para soldadura eléctrica, caretas y consumibles para estructuras metálicas.",
        logoSrc: "/logo-lincoln.webp",
        filterUrl: "/catalogo?brand=Lincoln",
      },
    ],
  },
];

export default function BrandsPageContent() {
  const router = useRouter();
  const { products } = useProductsStore();
  const [searchFilter, setSearchFilter] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Helper to count products of a brand in real-time
  const getBrandProductCount = React.useCallback(
    (brandName: string) => {
      const bLower = brandName.toLowerCase();
      return products.filter((p) => {
        const brandSpec = p.specs?.find(
          (s) => s.label?.toLowerCase() === "marca" || s.label?.toLowerCase() === "brand"
        );
        const nameMatch = p.name.toLowerCase().includes(bLower);
        const specMatch = brandSpec?.value?.toLowerCase().includes(bLower);
        const skuMatch = p.sku.toLowerCase().includes(bLower);
        return nameMatch || specMatch || skuMatch;
      }).length;
    },
    [products]
  );

  // Filter groups according to search and category tab
  const filteredGroups = React.useMemo(() => {
    const q = searchFilter.trim().toLowerCase();

    return BRAND_GROUPS.map((group) => {
      if (selectedCategory !== "all" && group.id !== selectedCategory) {
        return null;
      }

      const filteredBrands = group.brands.filter((b) => {
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          group.categoryTitle.toLowerCase().includes(q)
        );
      });

      if (filteredBrands.length === 0) return null;

      return {
        ...group,
        brands: filteredBrands,
      };
    }).filter(Boolean) as BrandCategoryGroup[];
  }, [searchFilter, selectedCategory]);

  const totalBrandsCount = React.useMemo(() => {
    return BRAND_GROUPS.reduce((acc, g) => acc + g.brands.length, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-[#007BFF]/30">
      {/* Dynamic ambient background glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,123,255,0.15),rgba(2,6,23,0.95))] pointer-events-none" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative flex flex-col">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#007BFF] transition-colors">
            Inicio
          </Link>
          <span className="text-slate-700 select-none">/</span>
          <span className="text-slate-300 font-bold">Marcas Aliadas</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-start border-b border-slate-800 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-full text-xs font-bold uppercase tracking-wider mb-4 select-none shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Check className="h-3.5 w-3.5 stroke-[3px]" />
            <span>Canales Regulares & Aliados Autorizados en Venezuela</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-extrabold tracking-tight font-display">
            Ingeniería y Calidad de Primer Nivel en Cada Marca.
          </h1>

          <p className="text-slate-400 mt-4 max-w-3xl text-sm sm:text-base leading-relaxed">
            Sabemos el impacto y riesgo técnico detrás de una gran obra eléctrica, comercial o residencial. En <strong className="text-slate-200">Suministros L&D</strong> agrupamos las marcas líderes con certificación de fábrica, garantía directa y respaldo técnico especializado.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Marcas Oficiales</span>
              <span className="text-xl font-bold font-mono text-[#007BFF] mt-0.5">+{totalBrandsCount} Aliadas</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Insumos en Catálogo</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5">+{products.length > 0 ? products.length : 500} Productos</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Autenticidad</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5">100% Original</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex flex-col">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Compras al Mayor</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-0.5">Precios B2B</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar marca (Ej: Bticino, Truper, Tubrica, Lumistar...)"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-fine pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-[#007BFF] text-slate-950 shadow-md"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              Todas ({totalBrandsCount})
            </button>
            {BRAND_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedCategory(g.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === g.id
                    ? "bg-[#007BFF] text-slate-950 shadow-md"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <span>{g.categoryTitle.split(" ")[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">({g.brands.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Directory Section */}
        {filteredGroups.length > 0 ? (
          <div className="flex flex-col gap-12">
            {filteredGroups.map((group) => (
              <section key={group.id} className="w-full">
                {/* Header de Categoría */}
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-6">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-display">
                      {group.categoryTitle}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      {group.brands.length} casas comerciales aliadas
                    </span>
                  </div>
                </div>

                {/* Grid de Marcas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {group.brands.map((brand) => {
                    const count = getBrandProductCount(brand.name);

                    return (
                      <div
                        key={brand.id}
                        onClick={() => router.push(brand.filterUrl)}
                        className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-[#007BFF]/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,123,255,0.12)] hover:-translate-y-1 relative overflow-hidden"
                      >
                        {/* Top Accent Gradient on Hover */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#007BFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Logo Container con Alto Contraste */}
                        <div className="w-full h-24 bg-white/95 rounded-xl p-3 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:shadow-md transition-all mb-4">
                          {brand.logoSrc ? (
                            <img
                              src={brand.logoSrc}
                              alt={`Logo oficial de ${brand.name}`}
                              className="max-h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-xl font-black font-display tracking-widest text-slate-900 group-hover:text-[#007BFF] transition-colors">
                                {brand.name.toUpperCase()}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 tracking-wider">
                                LÍNEA PROFESIONAL
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info de la Marca */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#007BFF] transition-colors flex items-center gap-1.5">
                              <span>{brand.name}</span>
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            </h3>

                            {count > 0 && (
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                                {count} insumos
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                            {brand.description}
                          </p>
                        </div>

                        {/* Call to action footer */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold font-mono text-slate-400 group-hover:text-[#007BFF] transition-colors select-none">
                          <span>Ver catálogo de insumos</span>
                          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
            <p className="text-base text-slate-300 font-semibold">
              No se encontraron marcas que coincidan con &quot;{searchFilter}&quot;
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Prueba buscando por otra palabra clave o limpia el filtro de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchFilter("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#007BFF] text-slate-950 text-xs font-bold font-mono uppercase tracking-wider hover:bg-[#1a8cff] transition-all cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* Back Link to Catalog */}
        <div className="flex justify-center mt-16 mb-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-[#007BFF] transition-colors p-2 rounded-lg hover:bg-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al Catálogo Completo
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
