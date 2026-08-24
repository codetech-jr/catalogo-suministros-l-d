import { Product } from "@/types/product";

/**
 * Normaliza un texto removiendo acentos/diacríticos, pasando a minúsculas
 * y estandarizando signos de puntuación, unidades eléctricas y medidas.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes/acentos
    .replace(/["”″]/g, "") // Normalizar comillas de pulgadas (1/2" -> 1/2)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Diccionario de sinónimos, modismos y variantes ortográficas del sector ferretero y eléctrico.
 */
const SYNONYMS_MAP: Record<string, string[]> = {
  // Interruptores / Breakers
  breaker: ["brecker", "braker", "braquer", "pastilla", "termomagnetico", "disyuntor", "suiche", "interruptor"],
  brecker: ["breaker", "braker", "pastilla", "termomagnetico", "interruptor"],
  braker: ["breaker", "brecker", "pastilla", "termomagnetico", "interruptor"],
  pastilla: ["breaker", "brecker", "braker", "termomagnetico"],
  termomagnetico: ["breaker", "brecker", "braker", "disyuntor", "interruptor"],
  interruptor: ["breaker", "brecker", "suiche", "switch", "apagador"],

  // Cintas / Aislantes
  teipe: ["tape", "cinta", "cinta aislante", "temflex", "3m", "aislante", "adhesiva"],
  tape: ["teipe", "cinta", "cinta aislante", "temflex", "3m"],
  cinta: ["teipe", "tape", "cinta aislante", "temflex", "resina"],
  temflex: ["teipe", "tape", "cinta", "3m"],

  // Iluminación
  bombillo: ["foco", "lampara", "bombillo led", "ampolleta", "iluminacion", "led", "bombillo recargable"],
  foco: ["bombillo", "lampara", "reflector", "led"],
  lampara: ["bombillo", "foco", "panel led", "luminaria", "tubo led"],
  reflector: ["proyector", "farol", "luminaria exterior", "reflector led"],
  panel: ["panel led", "plafon", "luminaria empotrar", "ojo de buey"],
  tubo: ["tubo led", "tuberia", "conduit", "pvc", "galvanizado"],
  iluminacion: ["luminaria", "bombillo", "foco", "led", "lampara", "reflector"],

  // Cableado y Conductores
  cable: ["alambre", "conductor", "thhn", "cordon", "cables", "cablera", "bobina", "rollo"],
  alambre: ["cable", "conductor", "solido", "thhn"],
  conductor: ["cable", "alambre", "thhn"],
  thhn: ["cable", "alambre", "conductor", "cobre"],

  // Canalización y Tuberías
  tuberia: ["tubo", "conduit", "pvc", "galvanizado", "curva", "codo", "union", "conector"],
  conduit: ["tubo", "tuberia", "pvc", "emt", "galvanizado"],
  pvc: ["tubo", "tuberia", "plastico", "conduit"],
  cajetin: ["caja de paso", "caja metalica", "octagonal", "cajetines", "caja plastica"],
  socate: ["soquete", "portalampara", "portalampatas", "base e27"],
  soquete: ["socate", "portalampara"],

  // Adhesivos y Químicos
  pega: ["adhesivo", "silicon", "soldadura liquida", "solda", "cemento solvente"],
  adhesivo: ["pega", "silicon", "cinta", "epoxico"],
  silicon: ["silicona", "sellador", "pega"],

  // Marcas comunes y variantes
  bticino: ["ticino", "biticino", "b-ticino"],
  pickens: ["picken", "pikens"],
  lumistar: ["lumistar led", "lumistariluminacion"],
  exceline: ["exeline", "protector exceline", "gentek"],
  vert: ["vert led", "vert"],
};

/**
 * Expande los términos de búsqueda con sus sinónimos conocidos.
 */
export function getExpandedTokens(query: string): string[] {
  const normalized = normalizeSearchText(query);
  const rawTokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  const tokenSet = new Set<string>(rawTokens);

  for (const token of rawTokens) {
    if (SYNONYMS_MAP[token]) {
      for (const syn of SYNONYMS_MAP[token]) {
        tokenSet.add(normalizeSearchText(syn));
      }
    }
    // Si contiene números y letras unidas (ej: 20a, 120v, 1/2)
    const matchUnit = token.match(/^(\d+)(a|v|w|k|ka|m|cm|mm|hp)$/);
    if (matchUnit) {
      tokenSet.add(`${matchUnit[1]} ${matchUnit[2]}`);
    }
  }

  return Array.from(tokenSet);
}

/**
 * Interfaz para el resultado con puntuación de relevancia.
 */
export interface ScoredProduct {
  product: Product;
  score: number;
  matchedFields: string[];
}

/**
 * Calcula la puntuación de relevancia de un producto contra una consulta de búsqueda.
 */
export function calculateProductSearchScore(product: Product, query: string): ScoredProduct {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) {
    return { product, score: 0, matchedFields: [] };
  }

  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  const expandedTokens = getExpandedTokens(query);

  const normName = normalizeSearchText(product.name || "");
  const normSku = normalizeSearchText(product.sku || "");
  const normCat = normalizeSearchText(product.categoryLabel || "");
  const normDesc = normalizeSearchText(product.description || "");

  // Extraer valores de especificaciones técnicas
  const normSpecs = (product.specs || []).map((s) => ({
    label: normalizeSearchText(s.label || ""),
    value: normalizeSearchText(s.value || ""),
  }));
  const normSpecsFull = normSpecs.map((s) => `${s.label} ${s.value}`).join(" ");

  let score = 0;
  const matchedFields: string[] = [];

  // 1. Coincidencia Exacta en SKU (Prioridad Máxima)
  if (normSku === normQuery) {
    score += 1500;
    matchedFields.push("sku_exact");
  } else if (normSku.includes(normQuery)) {
    score += 800;
    matchedFields.push("sku_partial");
  }

  // 2. Coincidencia en Nombre del Producto
  if (normName === normQuery) {
    score += 1000;
    matchedFields.push("name_exact");
  } else if (normName.startsWith(normQuery)) {
    score += 500;
    matchedFields.push("name_starts_with");
  } else if (normName.includes(normQuery)) {
    score += 350;
    matchedFields.push("name_phrase");
  }

  // 3. Verificación de Tokens individuales en el Nombre
  let allTokensInName = true;
  let tokensInNameCount = 0;
  for (const token of queryTokens) {
    if (normName.includes(token)) {
      tokensInNameCount++;
      score += 120;
    } else {
      allTokensInName = false;
    }
  }
  if (allTokensInName && queryTokens.length > 1) {
    score += 300;
    matchedFields.push("name_all_tokens");
  }

  // 4. Coincidencia en Marca
  const brandSpec = normSpecs.find((s) => s.label === "marca");
  if (brandSpec) {
    if (brandSpec.value === normQuery || queryTokens.some((t) => brandSpec.value.includes(t))) {
      score += 250;
      matchedFields.push("brand");
    }
  }

  // 5. Coincidencia en Categoría
  if (normCat.includes(normQuery) || queryTokens.some((t) => normCat.includes(t))) {
    score += 180;
    matchedFields.push("category");
  }

  // 6. Coincidencia en Especificaciones Técnicas (Voltaje, Amperaje, Medidas)
  let specsMatched = 0;
  for (const token of queryTokens) {
    if (normSpecsFull.includes(token)) {
      specsMatched++;
      score += 90;
    }
  }
  if (specsMatched > 0) {
    matchedFields.push("specs");
  }

  // 7. Coincidencia en Descripción
  if (normDesc.includes(normQuery)) {
    score += 50;
    matchedFields.push("description");
  } else {
    for (const token of queryTokens) {
      if (normDesc.includes(token)) {
        score += 20;
      }
    }
  }

  // 8. Coincidencia por Sinónimos Expandidos
  for (const expToken of expandedTokens) {
    if (!queryTokens.includes(expToken)) {
      if (normName.includes(expToken)) {
        score += 80;
        matchedFields.push("synonym_name");
      }
      if (normSpecsFull.includes(expToken)) {
        score += 60;
        matchedFields.push("synonym_specs");
      }
      if (normCat.includes(expToken)) {
        score += 50;
        matchedFields.push("synonym_category");
      }
    }
  }

  // 9. Bonificación por Disponibilidad de Stock
  if (score > 0 && product.stock > 0) {
    score += 15; // Dar ligera preferencia a productos listos para despacho
  }

  return { product, score, matchedFields };
}

/**
 * Ejecuta una búsqueda inteligente sobre el catálogo de productos y retorna
 * los resultados filtrados y ordenados por su puntaje de relevancia.
 */
export function smartSearch(
  products: Product[],
  query: string,
  minScoreThreshold = 40
): Product[] {
  const norm = normalizeSearchText(query);
  if (!norm) return products;

  const scored = products
    .map((p) => calculateProductSearchScore(p, query))
    .filter((res) => res.score >= minScoreThreshold)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.product);
}

/**
 * Estructura de sugerencias para el Mega-Search desplegable.
 */
export interface SearchSuggestionsResult {
  products: Product[];
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; count: number }[];
  totalResultsCount: number;
}

/**
 * Genera sugerencias predictivas categorizadas para el autocompletado en tiempo real.
 */
export function getSearchSuggestions(
  products: Product[],
  categories: { id?: string; name: string; slug: string }[],
  query: string,
  limitProducts = 5
): SearchSuggestionsResult {
  const norm = normalizeSearchText(query);
  if (!norm || norm.length < 2) {
    return {
      products: [],
      categories: [],
      brands: [],
      totalResultsCount: 0,
    };
  }

  // 1. Obtener productos puntuados
  const scoredProducts = products
    .map((p) => calculateProductSearchScore(p, query))
    .filter((res) => res.score >= 35)
    .sort((a, b) => b.score - a.score);

  const matchedProducts = scoredProducts.slice(0, limitProducts).map((s) => s.product);

  // 2. Extraer categorías coincidentes
  const matchedCategories: { name: string; slug: string; count: number }[] = [];
  (categories || []).forEach((cat) => {
    const normCatName = normalizeSearchText(cat.name);
    const normCatSlug = normalizeSearchText(cat.slug);
    const expanded = getExpandedTokens(query);

    const matches =
      normCatName.includes(norm) ||
      normCatSlug.includes(norm) ||
      expanded.some((t) => normCatName.includes(t) || normCatSlug.includes(t));

    if (matches) {
      const count = products.filter(
        (p) => p.category === cat.slug || p.category === cat.id
      ).length;
      matchedCategories.push({ name: cat.name, slug: cat.slug, count });
    }
  });

  // 3. Extraer marcas coincidentes
  const brandCountMap = new Map<string, number>();
  products.forEach((p) => {
    const brandSpec = p.specs?.find(
      (s) => s.label?.toLowerCase() === "marca" || s.label?.toLowerCase() === "brand"
    );
    if (brandSpec && brandSpec.value?.trim()) {
      const bName = brandSpec.value.trim();
      const normBName = normalizeSearchText(bName);
      if (normBName.includes(norm) || norm.includes(normBName)) {
        brandCountMap.set(bName, (brandCountMap.get(bName) || 0) + 1);
      }
    }
  });

  const matchedBrands = Array.from(brandCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    products: matchedProducts,
    categories: matchedCategories.slice(0, 3),
    brands: matchedBrands,
    totalResultsCount: scoredProducts.length,
  };
}
