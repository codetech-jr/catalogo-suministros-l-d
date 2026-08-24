"use client";

import * as React from "react";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useProductsStore } from "@/store/products-store";
import { useBcvStore } from "@/store/bcv-store";
import { useCurrencyStore } from "@/store/currency-store";
import { Product } from "@/types/product";
import { calculateProductSearchScore } from "@/lib/search/smartSearch";
import { 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X, 
  RotateCcw, 
  Search, 
  ListFilter 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Helper to extract brand dynamically from product specs, name or SKU
function getProductBrand(product: Product): string {
  const brandSpec = product.specs?.find(
    (s) => s.label?.trim().toLowerCase() === "marca" || s.label?.trim().toLowerCase() === "brand"
  );
  if (brandSpec && brandSpec.value?.trim()) {
    return brandSpec.value.trim();
  }
  
  const nameUpper = (product.name || "").toUpperCase();
  const skuUpper = (product.sku || "").toUpperCase();
  const knownBrands = [
    "Pickens", "Bticino", "Classic Lux", "Lumistar", "Exceline", 
    "Siemens", "3M Temflex", "3M", "INGCO", "Stanley", "Bosch", 
    "Vért", "Vert", "TOTAL", "Eboli", "Ilumiven", "Philips", 
    "Sylvania", "Tonal", "Trio", "Griven", "Bellota", "Tubrica",
    "Manpica", "Cebra", "Venceramica", "Reinco", "Iconel", "Fermetal",
    "Run", "Aquafina", "Exxel", "Faguax", "Ferco", "Lincoln",
    "Littmann", "Proxical", "Sergeca", "PCP", "Termofusion", "Zasc",
    "Protonic", "Cobra", "Ceramipego", "Belt-G"
  ];
  
  for (const brand of knownBrands) {
    if (nameUpper.includes(brand.toUpperCase()) || skuUpper.includes(brand.toUpperCase())) {
      return brand === "3M" ? "3M Temflex" : brand === "Vert" ? "Vért" : brand;
    }
  }
  
  return "Otras Marcas";
}

// Helper to extract voltages dynamically from product specs or name
function getProductVoltages(product: Product): string[] {
  const voltSpecs = (product.specs || []).filter((s) => {
    const l = s.label?.trim().toLowerCase() || "";
    return l.includes("volt") || l.includes("tensión") || l.includes("tension") || l.includes("voltaje");
  });
  
  if (voltSpecs.length > 0) {
    return voltSpecs.map((s) => s.value.trim()).filter(Boolean);
  }
  
  const match = (product.name || "").match(/\b(85-265V|110-220V|120\/240V|120V|240V|220V|110V|600V|230V)\b/i);
  if (match) {
    return [match[1].toUpperCase()];
  }
  
  return [];
}

export default function CatalogPage({ params, searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  // Dynamic products store integration
  const { products, categories: dbCategories, isFetchingData } = useProductsStore();

  // URL category parameter
  const urlCategory = resolvedParams.category && resolvedParams.category.length > 0 
    ? resolvedParams.category[0] 
    : "all";

  // Calculate dynamic maximum price
  const maxCatalogPrice = React.useMemo(() => {
    if (!products || products.length === 0) return 1000;
    const maxVal = Math.max(...products.map(p => p.price || 0));
    return Math.max(1000, Math.ceil(maxVal / 100) * 100);
  }, [products]);

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
    if (typeof brandParam === "string") return [brandParam];
    if (Array.isArray(brandParam)) return brandParam.filter((b): b is string => typeof b === "string");
    return [];
  });
  const [selectedVoltages, setSelectedVoltages] = React.useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<number>(10000);

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

  // Set default priceRange once products are loaded
  React.useEffect(() => {
    if (maxCatalogPrice > 1000 && priceRange === 1000) {
      setPriceRange(maxCatalogPrice);
    }
  }, [maxCatalogPrice, priceRange]);

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
    setPriceRange(maxCatalogPrice);
    setSearchQuery("");
    setSelectedCategory("all");
    router.push("/catalogo");
  };

  // Categories helper list with counts dynamically built from database
  const categoriesList = React.useMemo(() => {
    const list = [
      { id: "all", label: "Todos los Suministros", count: products.length }
    ];
    (dbCategories || []).forEach((cat: any) => {
      const count = products.filter(
        (p) => p.category === cat.slug || p.category === cat.id
      ).length;
      list.push({
        id: cat.slug,
        label: cat.name,
        count
      });
    });
    return list;
  }, [dbCategories, products]);

  // Dynamic Base Products for facet counting (contextual to the selected category)
  const baseCategoryProducts = React.useMemo(() => {
    if (selectedCategory === "all") return products;
    const catMatch = dbCategories?.find((c: any) => c.slug === selectedCategory);
    return products.filter(
      (p) => p.category === selectedCategory || (catMatch && p.category === catMatch.id)
    );
  }, [products, selectedCategory, dbCategories]);

  // Dynamic Brands list with REAL counts
  const dynamicBrandsList = React.useMemo(() => {
    const brandMap = new Map<string, number>();

    baseCategoryProducts.forEach((p) => {
      const brand = getProductBrand(p);
      brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
    });

    return Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [baseCategoryProducts]);

  // Dynamic Voltages list with REAL counts
  const dynamicVoltagesList = React.useMemo(() => {
    const voltMap = new Map<string, number>();

    baseCategoryProducts.forEach((p) => {
      const volts = getProductVoltages(p);
      volts.forEach((v) => {
        voltMap.set(v, (voltMap.get(v) || 0) + 1);
      });
    });

    return Array.from(voltMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [baseCategoryProducts]);

  // Dynamic Availability list with REAL counts
  const dynamicAvailabilityList = React.useMemo(() => {
    const inStockCount = baseCategoryProducts.filter((p) => p.stock > 0).length;
    const onOrderCount = baseCategoryProducts.filter((p) => p.stock === 0).length;

    return [
      { id: "in-stock", label: "En Stock / Tienda", count: inStockCount },
      { id: "on-order", label: "Bajo Pedido", count: onOrderCount }
    ];
  }, [baseCategoryProducts]);

  // Filter products by specifications, search query, category, and price range with smart search engine
  const filteredProducts = React.useMemo(() => {
    const catMatch = dbCategories?.find((c: any) => c.slug === selectedCategory);
    const query = searchQuery.trim();

    const matched = products
      .map((product) => {
        // 1. Category Filter
        const matchesCategory = 
          selectedCategory === "all" || 
          product.category === selectedCategory || 
          (catMatch && product.category === catMatch.id);

        // 2. Brands Filter
        const productBrand = getProductBrand(product);
        const matchesBrand = 
          selectedBrands.length === 0 || 
          selectedBrands.includes(productBrand);

        // 3. Voltage Filter
        const productVolts = getProductVoltages(product);
        const matchesVoltage = 
          selectedVoltages.length === 0 || 
          selectedVoltages.some((v) => productVolts.includes(v));

        // 4. Availability Filter
        const matchesAvailability = 
          selectedAvailability.length === 0 || 
          (selectedAvailability.includes("in-stock") && product.stock > 0) ||
          (selectedAvailability.includes("on-order") && product.stock === 0);

        // 5. Price Range Filter
        const matchesPrice = product.price <= priceRange;

        if (!matchesCategory || !matchesBrand || !matchesVoltage || !matchesAvailability || !matchesPrice) {
          return null;
        }

        // 6. Smart Search Scoring
        if (!query) {
          return { product, score: 100 };
        }

        const searchResult = calculateProductSearchScore(product, query);
        if (searchResult.score < 35) {
          return null;
        }

        return { product, score: searchResult.score };
      })
      .filter((item): item is { product: Product; score: number } => item !== null);

    return matched
      .sort((a, b) => {
        if (sortBy === "price-low") return a.product.price - b.product.price;
        if (sortBy === "price-high") return b.product.price - a.product.price;
        if (sortBy === "alpha") return a.product.name.localeCompare(b.product.name);
        // Default (relevance/id): if query is active, sort by highest search score
        if (query) {
          return b.score - a.score;
        }
        return a.product.id.localeCompare(b.product.id);
      })
      .map((item) => item.product);
  }, [selectedCategory, searchQuery, selectedBrands, selectedVoltages, selectedAvailability, priceRange, sortBy, products, dbCategories]);

  // Get active filter count
  const activeFiltersCount = 
    selectedBrands.length + 
    selectedVoltages.length + 
    selectedAvailability.length + 
    (priceRange < maxCatalogPrice ? 1 : 0) + 
    (selectedCategory !== "all" ? 1 : 0) + 
    (searchQuery !== "" ? 1 : 0);

  // Dynamic Breadcrumb Labeling
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" }
    ];

    if (selectedCategory !== "all") {
      const activeCat = (dbCategories || []).find(c => c.slug === selectedCategory);
      if (activeCat) {
        crumbs.push({ label: activeCat.name, href: `/catalogo/${activeCat.slug}` });
      }
    }

    return (
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-wide" aria-label="Breadcrumb">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-600 select-none">/</span>}
            {idx === crumbs.length - 1 ? (
              <span className="text-slate-350 font-bold truncate max-w-[120px] sm:max-w-none">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-[#007BFF] transition-colors">
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
    if (selectedCategory !== "all") {
      const activeCat = (dbCategories || []).find(c => c.slug === selectedCategory);
      if (activeCat) return activeCat.name;
    }
    return "Catálogo Corporativo de Suministros";
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
                <SlidersHorizontal size={14} className="text-[#007BFF]" />
                BÚSQUEDA FACETADA
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-mono font-bold text-[#007BFF] hover:underline cursor-pointer flex items-center gap-1"
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
                        className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#007BFF] text-sm my-2 transition-all"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedCategory === cat.id}
                          onChange={() => handleCategoryChange(cat.id)}
                          className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#007BFF] cursor-pointer"
                        />
                        <span className="flex-grow flex items-center justify-between">
                          <span>{cat.label}</span>
                          <span className="text-xs text-slate-600 font-mono">
                            ({cat.count})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Bloque 2: Marca (DINÁMICO CON DATOS REALES) */}
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
                    {dynamicBrandsList.length > 0 ? (
                      dynamicBrandsList.map((brand) => (
                        <label 
                          key={brand.name}
                          className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#007BFF] text-sm my-2 transition-all"
                        >
                          <input 
                            type="checkbox"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={() => toggleBrand(brand.name)}
                            className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#007BFF] cursor-pointer"
                          />
                          <span className="flex-grow flex items-center justify-between">
                            <span className="truncate max-w-[150px]">{brand.name}</span>
                            <span className="text-xs text-slate-600 font-mono">({brand.count})</span>
                          </span>
                        </label>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 font-mono block py-1">Sin marcas registradas</span>
                    )}
                  </div>
                )}
              </div>

              {/* Bloque 3: Capacidad Técnica (DINÁMICO CON DATOS REALES) */}
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
                    {dynamicVoltagesList.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider block mb-1">
                          Voltaje / Tensión
                        </span>
                        <div className="space-y-1 max-h-36 overflow-y-auto scrollbar-fine pr-1">
                          {dynamicVoltagesList.map((volt) => (
                            <label 
                              key={volt.name}
                              className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#007BFF] text-sm my-2 transition-all"
                            >
                              <input 
                                type="checkbox"
                                checked={selectedVoltages.includes(volt.name)}
                                onChange={() => toggleVoltage(volt.name)}
                                className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#007BFF] cursor-pointer"
                              />
                              <span className="flex-grow flex items-center justify-between">
                                <span className="truncate max-w-[140px]">{volt.name}</span>
                                <span className="text-xs text-slate-600 font-mono">({volt.count})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Availability subgroup */}
                    <div className="border-t border-slate-800/65 pt-3.5">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider block mb-1">
                        Disponibilidad
                      </span>
                      <div className="space-y-1">
                        {dynamicAvailabilityList.map((avail) => (
                          <label 
                            key={avail.id}
                            className="flex items-center gap-3 cursor-pointer text-slate-400 hover:text-[#007BFF] text-sm my-2 transition-all"
                          >
                            <input 
                              type="checkbox"
                              checked={selectedAvailability.includes(avail.id)}
                              onChange={() => toggleAvailability(avail.id)}
                              className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#007BFF] cursor-pointer"
                            />
                            <span className="flex-grow flex items-center justify-between">
                              <span>{avail.label}</span>
                              <span className="text-xs text-slate-600 font-mono">
                                ({avail.count})
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
                          max={maxCatalogPrice}
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
                        />
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>$1</span>
                          <span className="font-bold text-[#007BFF]">${priceRange} Máx</span>
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
            <div className="w-full max-w-full px-4 md:px-0 flex flex-col gap-4 overflow-hidden box-border pb-6 border-b border-slate-800/80 mb-6">
              
              {/* Flex row for breadcrumbs and mobile filter button */}
              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-y-4 gap-x-2 w-full">
                {getBreadcrumbs()}
                
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-wider bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                >
                  <ListFilter size={14} className="text-[#007BFF]" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="h-4 w-4 bg-[#007BFF] text-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* H1 and Sort Select Layout Row (Flex Between) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold break-words whitespace-normal text-left max-w-full leading-tight text-slate-100 tracking-tight">
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
                    className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-slate-300 outline-none focus:border-[#007BFF] cursor-pointer transition-colors shadow-inner"
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
                        <span>{dynamicAvailabilityList.find(a => a.id === availId)?.label}</span>
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
                    {priceRange < maxCatalogPrice && (
                      <div className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all hover:bg-slate-750">
                        <span>Menos de ${priceRange}</span>
                        <button 
                          onClick={() => setPriceRange(maxCatalogPrice)}
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
            {isFetchingData ? (
              <div className="flex flex-col gap-6 w-full">
                <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-4 animate-pulse min-h-[480px]">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-16 bg-slate-700 rounded" />
                        <div className="h-3 w-20 bg-slate-700 rounded" />
                      </div>
                      <div className="aspect-[4/3] w-full rounded-lg bg-slate-900/60" />
                      <div className="flex flex-col gap-2">
                        <div className="h-5 w-3/4 bg-slate-700/60 rounded" />
                        <div className="h-3 w-full bg-slate-700/60 rounded" />
                      </div>
                      <div className="h-10 w-full bg-slate-700 rounded-lg mt-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 select-none pb-2">
                  <span>
                    BÚSQUEDA DETECTADA
                  </span>
                  <span>
                    Mostrando <span className="text-slate-200 font-bold">{filteredProducts.length}</span> de <span className="font-bold">{products.length}</span> insumos
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
                  <SlidersHorizontal size={15} className="text-[#007BFF]" />
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
                              ? "bg-[#007BFF]/10 border border-[#007BFF]/20 text-[#007BFF] font-bold"
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

                {/* Brands (DYNAMIC) */}
                {dynamicBrandsList.length > 0 && (
                  <div className="border-b border-slate-800 pb-4">
                    <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                      Marcas Aliadas
                    </span>
                    <div className="space-y-3 pl-1 max-h-48 overflow-y-auto scrollbar-fine pr-1">
                      {dynamicBrandsList.map((brand) => (
                        <label 
                          key={brand.name}
                          className="flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox"
                              checked={selectedBrands.includes(brand.name)}
                              onChange={() => toggleBrand(brand.name)}
                              className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 h-4.5 w-4.5 accent-[#007BFF]"
                            />
                            <span>{brand.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 font-bold">({brand.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voltages (DYNAMIC) */}
                {dynamicVoltagesList.length > 0 && (
                  <div className="border-b border-slate-800 pb-4">
                    <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                      Voltaje / Tensión
                    </span>
                    <div className="space-y-3 pl-1 max-h-40 overflow-y-auto scrollbar-fine pr-1">
                      {dynamicVoltagesList.map((volt) => (
                        <label 
                          key={volt.name}
                          className="flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox"
                              checked={selectedVoltages.includes(volt.name)}
                              onChange={() => toggleVoltage(volt.name)}
                              className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 h-4.5 w-4.5 accent-[#007BFF]"
                            />
                            <span>{volt.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 font-bold">({volt.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Max Price */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-2">
                    Presupuesto Máximo
                  </span>
                  <div className="px-1.5 flex flex-col gap-2">
                    <input 
                      type="range"
                      min="1"
                      max={maxCatalogPrice}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>$1</span>
                      <span className="font-bold text-[#007BFF]">${priceRange} Máx</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <span className="block font-display text-xs font-bold uppercase tracking-wider text-slate-250 mb-3">
                    Disponibilidad
                  </span>
                  <div className="space-y-3 pl-1">
                    {dynamicAvailabilityList.map((avail) => (
                      <label 
                        key={avail.id}
                        className="flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input 
                            type="checkbox"
                            checked={selectedAvailability.includes(avail.id)}
                            onChange={() => toggleAvailability(avail.id)}
                            className="rounded border-slate-700 bg-slate-950 text-[#007BFF] focus:ring-0 h-4.5 w-4.5 accent-[#007BFF]"
                          />
                          <span>{avail.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 font-bold">({avail.count})</span>
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
                className="w-full py-2.5 bg-[#007BFF] hover:bg-[#1a8cff] text-slate-900 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.98] cursor-pointer text-center"
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
