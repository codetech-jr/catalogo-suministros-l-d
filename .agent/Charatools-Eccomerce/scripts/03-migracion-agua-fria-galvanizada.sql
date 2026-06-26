-- ============================================================
-- ARCHIVO 3: MIGRACIÓN — Conexiones Agua Fría y Galvanizadas + Categorías Admin
-- Objetivo: Crear subcategorías en la tabla `categories` e incorporar conexiones
-- ============================================================

-- ── 1. REGISTRAR LAS NUEVAS CATEGORÍAS/SUB-ÍTEMS DE NIVEL 3 ────────────────
-- Vinculados a la subcategoría "Tuberías y Conexiones" (parent_id: '0dee6607-2184-4ff2-b57a-9cc1ee771c20')

INSERT INTO categories (name, slug, parent_id, depth) VALUES
('Conexiones Sanitarias Estándar', 'conexiones-sanitarias-estandar', '0dee6607-2184-4ff2-b57a-9cc1ee771c20', 2),
('Conexiones Sanitarias Reforzadas', 'conexiones-sanitarias-reforzadas', '0dee6607-2184-4ff2-b57a-9cc1ee771c20', 2),
('Conexiones Agua Fría', 'conexiones-agua-fria', '0dee6607-2184-4ff2-b57a-9cc1ee771c20', 2),
('Conexiones Galvanizadas', 'conexiones-galvanizadas', '0dee6607-2184-4ff2-b57a-9cc1ee771c20', 2)
ON CONFLICT (slug) DO NOTHING;


-- ── 2. MIGRACIÓN: Mover conexiones de Agua Fría a 'conexiones-agua-fria' ────
-- Filtra codos, yees, anillos, tapones, tapas, tees, reducciones, adaptadores, uniones, juntas, bushing

UPDATE products
SET 
  specs = jsonb_set(
    specs,
    '{subitem}',
    '"conexiones-agua-fria"'
  ),
  updated_at = NOW()
WHERE id IN (
  SELECT p.id
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE c.slug = 'plomeria'
    AND p.specs->>'subitem' = 'tuberia-agua-fria'
    AND p.name ~* '(codo|yee|anillo|tap[oó]n|tapa|tee|reduci|adaptador|uni[oó]n|junta|bushing)'
);


-- ── 3. MIGRACIÓN: Mover todas las conexiones galvanizadas a 'conexiones-galvanizadas'
-- Todos los productos de hierro galvanizado actualmente en la DB son conexiones (anillos, codos, tees, uniones, etc.)

UPDATE products
SET 
  specs = jsonb_set(
    specs,
    '{subitem}',
    '"conexiones-galvanizadas"'
  ),
  updated_at = NOW()
WHERE id IN (
  SELECT p.id
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE c.slug = 'plomeria'
    AND p.specs->>'subitem' = 'tuberia-galvanizada'
);


-- ── 4. CONSULTA DE VERIFICACIÓN POST-MIGRACIÓN ──────────────────────────────
-- Ejecutar para verificar que los productos se reubicaron correctamente

SELECT 
  p.specs->>'subitem' AS subitem,
  COUNT(*) AS total,
  ARRAY_AGG(p.name ORDER BY p.name) AS productos
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'plomeria'
GROUP BY p.specs->>'subitem'
ORDER BY subitem;
