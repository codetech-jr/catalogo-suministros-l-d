-- ============================================================
-- ARCHIVO 1: DIAGNÓSTICO — Ejecutar primero en Supabase SQL Editor
-- Objetivo: Ver el estado actual de los productos de plomería
-- ============================================================

-- ── 1A. Ver TODOS los sub-ítems actuales de plomería ──────────────────────
-- Esto te dice cuántos productos hay en cada sub-ítem

SELECT 
  p.specs->>'subitem' AS subitem,
  p.specs->>'subcategory' AS subcategory,
  COUNT(*) AS total_productos,
  ARRAY_AGG(p.name ORDER BY p.name) AS nombres
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
GROUP BY p.specs->>'subitem', p.specs->>'subcategory'
ORDER BY subitem NULLS LAST;


-- ── 1B. Ver qué hay bajo "tuberia-sanitaria-reforzada" ────────────────────
-- Aquí verás los productos mal categorizados (conexiones mezcladas con tuberías)

SELECT 
  p.id,
  p.name,
  p.slug,
  p.specs->>'subitem' AS subitem,
  CASE 
    WHEN p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci)' THEN '⚠️ CONEXIÓN (mal categorizado)'
    ELSE '✅ TUBERÍA (correcto)'
  END AS tipo_real
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'tuberia-sanitaria-reforzada'
ORDER BY tipo_real, p.name;


-- ── 1C. Ver qué hay bajo "tuberia-sanitaria-estandar" ─────────────────────
-- Esperamos que esté vacío (ese es el bug)

SELECT 
  p.id,
  p.name,
  p.slug,
  p.specs->>'subitem' AS subitem
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'tuberia-sanitaria-estandar'
ORDER BY p.name;


-- ── 1D. Ver el UUID de la categoría "plomeria" ───────────────────────────
-- Lo necesitarás para el script Node.js de upsert

SELECT id, name, slug FROM categories WHERE slug = 'plomeria';


-- ── 1E. Ver las marcas disponibles (para saber el brand_id de Tubrica, etc.)

SELECT id, name, slug FROM brands ORDER BY name;
