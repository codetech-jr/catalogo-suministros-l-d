"use client";

import * as React from "react";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useBcvStore } from "@/store/bcv-store";
import { useCurrencyStore } from "@/store/currency-store";
import { 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X, 
  RotateCcw, 
  Check, 
  Search, 
  Grid3X3, 
  ListFilter 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Available filter dimensions in metadata
const BRANDS_METADATA = [
  { name: "Siemens", count: 4 },
  { name: "Exceline", count: 15 },
  { name: "Bticino", count: 8 },
  { name: "3M Temflex", count: 10 },
  { name: "INGCO", count: 25 },
  { name: "Lumistar", count: 12 },
  { name: "Bosch", count: 6 },
  { name: "Stanley", count: 9 }
];

const VOLTAGES_METADATA = [
  { name: "120v-240v", count: 45 },
  { name: "85-265V", count: 22 },
  { name: "240V AC", count: 14 },
  { name: "600V", count: 8 }
];

const BRANDS = BRANDS_METADATA.map(b => b.name);
const VOLTAGES = VOLTAGES_METADATA.map(v => v.name);

const AVAILABILITIES = [
  { id: "in-stock", label: "En Stock / Tienda" },
  { id: "on-order", label: "Bajo Pedido" }
];

export default function CatalogPage({ params, searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  // URL category parameter
  const urlCategory = resolvedParams.category && resolvedParams.category.length > 0 
    ? resolvedParams.category[0] 
    : "all";

  // Global state integrations
  const rate = useBcvStore((state) => state.rate);
  const globalCurrencyMode = useCurrencyStore((state) => state.globalCurrencyMode);

  // Search & sorting state
  const [searchQuery, setSearchQuery] = React.useState(() => {
    const qParam = resolvedSearchParams.q || resolvedSearchParams.search;
    return typeof qParam === "string" ? qParam : "";
  });
  const [sortBy, setSortBy] = React.useState("relevance");

  // Filtering states
  const [selectedCategory, setSelectedCategory] = React.useState<string>(urlCategory);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>(() => {
    const brandParam = resolvedSearchParams.brand;
    if (typeof brandParam === "string") {
      const match = BRANDS_METADATA.find(b => b.name.toLowerCase() === brandParam.toLowerCase() || (brandParam.toLowerCase() === "3m" && b.name === "3M Temflex"));
      return match ? [match.name] : [brandParam];
    } else if (Array.isArray(brandParam)) {
      return brandParam
        .filter((b): b is string => typeof b === "string")
        .map(b => {
          const match = BRANDS_METADATA.find(bm => bm.name.toLowerCase() === b.toLowerCase() || (b.toLowerCase() === "3m" && bm.name === "3M Temflex"));
          return match ? match.name : b;
        });
    }
    return [];
  });
  const [selectedVoltages, setSelectedVoltages] = React.useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<number>(100);

  // Accordion toggle states
  const [accordions, setAccordions] = React.useState({
    categories: true,
    brands: true,
    voltages: true,
    price: true,
    availability: true
  });

  // Mobile filters sidebar drawer visibility
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Sync state if URL category changes
  React.useEffect(() => {
    if (resolvedParams.category && resolvedParams.category.length > 0) {
      setSelectedCategory(resolvedParams.category[0]);
    } else {
      setSelectedCategory("all");
    }
  }, [resolvedParams.category]);

  // Toggle single accordion
  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle category change from sidebar (updates URL and state)
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      router.push("/catalogo");
    } else {
      router.push(`/catalogo/${cat}`);
    }
  };

  // Toggle checklists
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleVoltage = (volt: string) => {
    setSelectedVoltages(prev => 
      prev.includes(volt) ? prev.filter(v => v !== volt) : [...prev, volt]
    );
  };

  const toggleAvailability = (avail: string) => {
    setSelectedAvailability(prev => 
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedVoltages([]);
    setSelectedAvailability([]);
    setPriceRange(100);
    setSearchQuery("");
    // Also reset back to root catalog page if category is changed
    setSelectedCategory("all");
    router.push("/catalogo");
  };

  // Get active filter count
  const activeFiltersCount = 
    selectedBrands.length + 
    selectedVoltages.length + 
    selectedAvailability.length + 
    (priceRange < 100 ? 1 : 0) + 
    (selectedCategory !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0);

  // Categories helper list with counts
  const categoriesList = React.useMemo(() => {
    return [
      { id: "all", label: "Todos los Suministros", count: PRODUCTS.length },
      { 
        id: "iluminacion", 
        label: "Luminaria LED", 
        count: PRODUCTS.filter(p => p.category === "iluminacion").length 
      },
      { 
        id: "control", 
        label: "Control Eléctrico", 
        count: PRODUCTS.filter(p => p.category === "control").length 
      },
      { 
        id: "cableado", 
        label: "Material Pesado", 
        count: PRODUCTS.filter(p => p.category === "cableado").length 
      }
    ];
  }, []);

  // Filter products by specifications, search query, category, and price range
  const filteredProducts = React.useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      // 2. Search Query Filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryLabel.toLowerCase().includes(query);

      // 3. Brands Filter
      const matchesBrand = 
        selectedBrands.length === 0 || 
        product.specs.some(spec => spec.label === "Marca" && selectedBrands.includes(spec.value)) ||
        (selectedBrands.includes("3M Temflex") && product.name.includes("3M")) ||
        (selectedBrands.includes("INGCO") && product.sku.includes("INGCO")) ||
        (selectedBrands.includes("Lumistar") && product.name.includes("Lumistar")) ||
        (selectedBrands.includes("Stanley") && product.name.includes("Stanley")) ||
        (selectedBrands.includes("Bosch") && product.name.includes("Bosch")) ||
        (selectedBrands.includes("Siemens") && product.category === "control") ||
        (selectedBrands.includes("Exceline") && product.category === "control") ||
        (selectedBrands.includes("Bticino") && (product.category === "control" || product.sku.includes("TAB")));

      // 4. Voltage Filter
      const matchesVoltage = 
        selectedVoltages.length === 0 || 
        product.specs.some(spec => spec.label === "Voltaje" && selectedVoltages.includes(spec.value)) ||
        product.specs.some(spec => spec.label === "Tensión nominal" && selectedVoltages.some(v => spec.value.includes(v))) ||
        (selectedVoltages.includes("120v-240v") && (
          product.specs.some(spec => spec.label === "Voltaje" && (spec.value.includes("120") || spec.value.includes("240") || spec.value.includes("85-265"))) ||
          product.specs.some(spec => spec.label === "Tensión nominal" && (spec.value.includes("120") || spec.value.includes("240")))
        ));

      // 5. Availability Filter
      const matchesAvailability = 
        selectedAvailability.length === 0 || 
        (selectedAvailability.includes("in-stock") && product.stock > 0) ||
        (selectedAvailability.includes("on-order") && product.stock === 0);

      // 6. Price Range Filter
      const matchesPrice = product.price <= priceRange;

      return matchesCategory && matchesSearch && matchesBrand && matchesVoltage && matchesAvailability && matchesPrice;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      // Default (relevance/id)
      return a.id.localeCompare(b.id);
    });
  }, [selectedCategory, searchQuery, selectedBrands, selectedVoltages, selectedAvailability, priceRange, sortBy]);

  // Dynamic Breadcrumb Labeling
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" }
    ];

    if (selectedCategory === "iluminacion") {
      crumbs.push({ label: "Iluminación LED", href: "/catalogo/iluminacion" });
    } else if (selectedCategory === "control") {
      crumbs.push({ label: "Control Eléctrico", href: "/catalogo/control" });
    } else if (selectedCategory === "cableado") {
      crumbs.push({ label: "Material Pesado", href: "/catalogo/cableado" });
    }

    return (
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide" aria-label="Breadcrumb">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-600 select-none">/</span>}
            {idx === crumbs.length - 1 ? (
              <span className="text-slate-350 font-bold truncate max-w-[120px] sm:max-w-none">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-[#0ee0d5] transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  // Header dynamic title
  const getHeaderTitle = () => {
    switch (selectedCategory) {
      case "iluminacion":
        return "Reflectores y LED Exterior";
      case "control":
        return "Control de Fuerza Eléctrica";
      case "cableado":
        return "Canalización y Material Pesado";
      default:
        return "Catálogo Corporativo de Suministros";
    }
  };

  return (
    <>
      <Navbar onSearch={(query) => setSearchQuery(query)} />
      
      {/* Background radial overlay styling */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950/40 via-slate-900 to-slate-900 pointer-events-none" />

      {/* Main Catalog View Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative">
        
        {/* Layout Wrapper: 2 Columns on PC, 1 Column on Mobile */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column: Sidebar Filters Panel (PC Only) */}
          <aside className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-28 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden scrollbar-fine select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-450 flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-[#0ee0d5]" />
                BÚSQUEDA FACETADA
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-mono font-bold text-[#0ee0d5] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={10} />
                  Limpiar ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="flex flex-col gap-5">
              
              {/* Bloque 1: Categorías */}
              <div className="border-b border-slate-800 pb-4 mb-4">
                <button
                  onClick={() => toggleAccordion("categories")}
                  className="w-full flex items-center justify-between font-semibold text-sm uppercase text-slate-300 tracking-wide pb-2 cursor-pointer outline-none"
                >
                  <span>Categorías</span>
                  {accordions.categories ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </button>
                {accordions.categories && (
                  <div className="mt-2 space-y-1">
                    {categoriesList.map((cat) => (
                      <label 
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#0ee0d5] text-sm my-2 transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedCategory === cat.id}
                          onChange={() => handleCategoryChange(cat.id)}
                          className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#0ee0d5] cursor-pointer"
                        />
                        <span className="flex-grow flex items-center justify-between">
                          <span>{cat.label}</span>
                          <span className="text-xs text-slate-600 font-mono">
                            ({cat.id === "all" ? 12 : cat.id === "iluminacion" ? 3 : cat.id === "control" ? 5 : 4})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Bloque 2: Marca */}
              <div className="border-b border-slate-800 pb-4 mb-4">
                <button
                  onClick={() => toggleAccordion("brands")}
                  className="w-full flex items-center justify-between font-semibold text-sm uppercase text-slate-300 tracking-wide pb-2 cursor-pointer outline-none"
                >
                  <span>Marca</span>
                  {accordions.brands ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </button>
                {accordions.brands && (
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-fine pr-1">
                    {BRANDS_METADATA.map((brand) => (
                      <label 
                        key={brand.name}
                        className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#0ee0d5] text-sm my-2 transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#0ee0d5] cursor-pointer"
                        />
                        <span className="flex-grow flex items-center justify-between">
                          <span>{brand.name}</span>
                          <span className="text-xs text-slate-600 font-mono">({brand.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Bloque 3: Capacidad Técnica */}
              <div className="border-b border-slate-800 pb-4 mb-4">
                <button
                  onClick={() => toggleAccordion("voltages")}
                  className="w-full flex items-center justify-between font-semibold text-sm uppercase text-slate-300 tracking-wide pb-2 cursor-pointer outline-none"
                >
                  <span>Capacidad Técnica</span>
                  {accordions.voltages ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </button>
                {accordions.voltages && (
                  <div className="mt-2 space-y-4">
                    {/* Voltages subgroup */}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider block mb-1">
                        Voltaje / Tensión
                      </span>
                      <div className="space-y-1">
                        {VOLTAGES_METADATA.map((volt) => (
                          <label 
                            key={volt.name}
                            className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#0ee0d5] text-sm my-2 transition-all"
                          >
                            <input 
                              type="checkbox"
                              checked={selectedVoltages.includes(volt.name)}
                              onChange={() => toggleVoltage(volt.name)}
                              className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#0ee0d5] cursor-pointer"
                            />
                            <span className="flex-grow flex items-center justify-between">
                              <span>{volt.name}</span>
                              <span className="text-xs text-slate-600 font-mono">({volt.count})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Stock Availability subgroup */}
                    <div className="border-t border-slate-800/65 pt-3.5">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider block mb-1">
                        Disponibilidad
                      </span>
                      <div className="space-y-1">
                        {AVAILABILITIES.map((avail) => (
                          <label 
                            key={avail.id}
                            className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#0ee0d5] text-sm my-2 transition-all"
                          >
                            <input 
                              type="checkbox"
                              checked={selectedAvailability.includes(avail.id)}
                              onChange={() => toggleAvailability(avail.id)}
                              className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#0ee0d5] cursor-pointer"
                            />
                            <span className="flex-grow flex items-center justify-between">
                              <span>{avail.label}</span>
                              <span className="text-xs text-slate-600 font-mono">
                                ({avail.id === "in-stock" ? PRODUCTS.filter(p => p.stock > 0).length : PRODUCTS.filter(p => p.stock === 0).length})
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Budget/Price subgroup */}
                    <div className="border-t border-slate-800/65 pt-3.5">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider block mb-1">
                        Presupuesto Máximo
                      </span>
                      <div className="px-1 flex flex-col gap-2">
                        <input 
                          type="range"
                          min="1"
                          max="100"
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#0ee0d5]"
                        />
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>$1</span>
                          <span className="font-bold text-[#0ee0d5]">${priceRange} Máx</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </aside>

          {/* Right Column: Main Content Container */}
          <div className="flex-grow w-full">
            
            {/* Header del Catálogo (Command Top Area) */}
            <div className="flex flex-col gap-3 pb-6 border-b border-slate-800/80 mb-6">
              
              {/* Flex row for breadcrumbs and mobile filter button */}
              <div className="flex items-center justify-between gap-4">
                {getBreadcrumbs()}
                
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-wider bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                >
                  <ListFilter size={14} className="text-[#0ee0d5]" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="h-4 w-4 bg-[#0ee0d5] text-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* H1 and Sort Select Layout Row (Flex Between) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-extrabold leading-none text-slate-100 tracking-tight">
                    {getHeaderTitle()}
                  </h1>
                </div>

                {/* Ordenar por selector */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                    Ordenar por:
                  </span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-slate-300 outline-none focus:border-[#0ee0d5] cursor-pointer transition-colors shadow-inner"
                  >
                    <option value="relevance">Relevancia / Código</option>
                    <option value="price-low">Precio Menor &rarr; Mayor</option>
                    <option value="price-high">Precio Mayor &rarr; Menor</option>
                    <option value="alpha">Nombre (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips (Tags de descarte) & Reset */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3.5 border-t border-slate-850">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-1">
                      Filtros:
                    </span>
                    
                    {/* Category chip if filtered */}
                    {selectedCategory !== "all" && (
                      <div className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750">
                        <span>{categoriesList.find(c => c.id === selectedCategory)?.label}</span>
                        <button 
                          onClick={() => handleCategoryChange("all")}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label="Quitar filtro de categoría"
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}

                    {/* Brand chips */}
                    {selectedBrands.map((brand) => (
                      <div 
                        key={brand}
                        className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750"
                      >
                        <span>{brand}</span>
                        <button 
                          onClick={() => toggleBrand(brand)}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label={`Quitar filtro de marca ${brand}`}
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    {/* Voltage chips */}
                    {selectedVoltages.map((volt) => (
                      <div 
                        key={volt}
                        className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750"
                      >
                        <span>{volt}</span>
                        <button 
                          onClick={() => toggleVoltage(volt)}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label={`Quitar filtro de voltaje ${volt}`}
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    {/* Availability chips */}
                    {selectedAvailability.map((availId) => (
                      <div 
                        key={availId}
                        className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750"
                      >
                        <span>{AVAILABILITIES.find(a => a.id === availId)?.label}</span>
                        <button 
                          onClick={() => toggleAvailability(availId)}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label={`Quitar filtro de disponibilidad`}
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}

                    {/* Price Range chip */}
                    {priceRange < 100 && (
                      <div className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750">
                        <span>Menos de ${priceRange}</span>
                        <button 
                          onClick={() => setPriceRange(100)}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label="Quitar límite de precio"
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}

                    {/* Search chip */}
                    {searchQuery && (
                      <div className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750">
                        <span className="truncate max-w-[120px]">Buscado: &quot;{searchQuery}&quot;</span>
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="hover:text-red-400 text-slate-500 transition-colors p-0.5 cursor-pointer"
                          aria-label="Limpiar búsqueda"
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer select-none py-1 font-mono font-medium transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}

            </div>

            {/* Dynamic Product Grid Display */}
            {filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 select-none pb-2">
                  <span>
                    BÚSQUEDA DETECTADA
                  </span>
                  <span>
                    Mostrando <span className="text-slate-200 font-bold">{filteredProducts.length}</span> de <span className="font-bold">{PRODUCTS.length}</span> insumos
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-xl bg-slate-950/20 border border-slate-800">
                <div className="h-12 w-12 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl flex items-center justify-center mb-4">
                  <Search size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-200 mb-1">
                  No se encontraron materiales coincidentes
                </h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                  Intenta cambiar las especificaciones de marca o voltaje, remover filtros activos o buscar un término alternativo.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Restablecer Todos los Filtros
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer & Drawer Global wrappers */}
      <Footer />

      {/* Mobile Drawer Slide-over Panel for Filters */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] md:hidden select-none" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          />

          {/* Sliding container */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-250 flex items-center gap-1.5">
                  <SlidersHorizontal size={15} className="text-[#0ee0d5]" />
                  Filtros Disponibles
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="h-8 w-8 rounded-lg bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* Categories */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                    Especialidades
                  </span>
                  <ul className="space-y-1">
                    {categoriesList.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => {
                            handleCategoryChange(cat.id);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-lg font-medium transition-all text-left cursor-pointer ${
                            selectedCategory === cat.id
                              ? "bg-[#0ee0d5]/10 border border-[#0ee0d5]/20 text-[#0ee0d5] font-bold"
                              : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 border border-transparent"
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-950 text-slate-500">
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Brands */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                    Marcas Aliadas
                  </span>
                  <div className="space-y-3 pl-1">
                    {BRANDS.map((brand) => (
                      <label 
                        key={brand}
                        className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 h-4.5 w-4.5 accent-[#0ee0d5]"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Voltages */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                    Voltaje / Tensión
                  </span>
                  <div className="space-y-3 pl-1">
                    {VOLTAGES.map((volt) => (
                      <label 
                        key={volt}
                        className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedVoltages.includes(volt)}
                          onChange={() => toggleVoltage(volt)}
                          className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 h-4.5 w-4.5 accent-[#0ee0d5]"
                        />
                        <span>{volt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-2">
                    Presupuesto Máximo
                  </span>
                  <div className="px-1.5 flex flex-col gap-2">
                    <input 
                      type="range"
                      min="1"
                      max="100"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#0ee0d5]"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>$1</span>
                      <span className="font-bold text-[#0ee0d5]">${priceRange} Máx</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                    Disponibilidad
                  </span>
                  <div className="space-y-3 pl-1">
                    {AVAILABILITIES.map((avail) => (
                      <label 
                        key={avail.id}
                        className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedAvailability.includes(avail.id)}
                          onChange={() => toggleAvailability(avail.id)}
                          className="rounded border-slate-700 bg-slate-950 text-[#0ee0d5] focus:ring-0 h-4.5 w-4.5 accent-[#0ee0d5]"
                        />
                        <span>{avail.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions inside Mobile Filter Drawer */}
            <div className="mt-8 border-t border-slate-800 pt-4 flex flex-col gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-[#0ee0d5] hover:bg-[#12f0e4] text-slate-900 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                Aplicar Filtros
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800 hover:text-white font-bold font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  Restablecer
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
