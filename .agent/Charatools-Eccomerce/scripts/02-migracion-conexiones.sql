-- ============================================================
-- ARCHIVO 2: MIGRACIÓN — Reclasificar conexiones
-- ⚠️ Ejecutar DESPUÉS de correr 01-diagnostico y confirmar los datos
-- ============================================================

-- ── PRE-FLIGHT: Contar cuántos productos se van a mover ───────────────────

SELECT 
  'REFORZADAS → conexiones-sanitarias-reforzadas' AS migracion,
  COUNT(*) AS productos_afectados
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'tuberia-sanitaria-reforzada'
  AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci)'

UNION ALL

SELECT 
  'ESTÁNDAR → conexiones-sanitarias-estandar' AS migracion,
  COUNT(*) AS productos_afectados
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'tuberia-sanitaria-estandar'
  AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci)';


-- ============================================================
-- MIGRACIÓN PASO 1: Conexiones Reforzadas
-- Mueve codos, yees, anillos, tapones, tees, reducidos
-- de subitem 'tuberia-sanitaria-reforzada'
-- a subitem 'conexiones-sanitarias-reforzadas'
-- ============================================================

UPDATE products
SET 
  specs = jsonb_set(
    specs,
    '{subitem}',
    '"conexiones-sanitarias-reforzadas"'
  ),
  updated_at = NOW()
WHERE id IN (
  SELECT p.id
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE c.slug = 'plomeria'
    AND p.specs->>'subitem' = 'tuberia-sanitaria-reforzada'
    AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci)'
);
-- Debería devolver: UPDATE N (donde N = cantidad del pre-flight)


-- ============================================================
-- MIGRACIÓN PASO 2: Conexiones Estándar
-- Mismo patrón para las conexiones que estén bajo
-- tuberia-sanitaria-estandar
-- ============================================================

UPDATE products
SET 
  specs = jsonb_set(
    specs,
    '{subitem}',
    '"conexiones-sanitarias-estandar"'
  ),
  updated_at = NOW()
WHERE id IN (
  SELECT p.id
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE c.slug = 'plomeria'
    AND p.specs->>'subitem' = 'tuberia-sanitaria-estandar'
    AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci)'
);


-- ============================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================

-- ── V1. Resumen de sub-ítems después de la migración ──────────────────────

SELECT 
  p.specs->>'subitem' AS subitem,
  COUNT(*) AS total,
  ARRAY_AGG(p.name ORDER BY p.name) AS productos
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
GROUP BY p.specs->>'subitem'
ORDER BY subitem;


-- ── V2. Confirmar que tuberia-sanitaria-reforzada ya NO tiene conexiones ──

SELECT p.name, p.specs->>'subitem' AS subitem
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'tuberia-sanitaria-reforzada'
  AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee)'
ORDER BY p.name;
-- ✅ Debe devolver 0 filas


-- ── V3. Confirmar que conexiones-sanitarias-reforzadas tiene los productos ─

SELECT p.name, p.specs->>'subitem' AS subitem
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
  AND p.specs->>'subitem' = 'conexiones-sanitarias-reforzadas'
ORDER BY p.name;
-- ✅ Debe tener codos, yees, anillos, tapones, tees reforzadas
