#!/usr/bin/env node

/**
 * @file upsert-tuberias-estandar.mjs
 * @description Script para cargar masivamente las tuberías sanitarias estándar
 *              (50mm, 75mm, 110mm, 160mm) desde el Excel/CSV del cliente.
 *
 * Uso:
 *   1. Asegúrate de tener las variables de entorno configuradas:
 *      - SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL)
 *      - SUPABASE_SERVICE_ROLE_KEY
 *
 *   2. Ejecuta desde la raíz del proyecto:
 *      node scripts/upsert-tuberias-estandar.mjs
 *
 *   3. Antes de correr, edita las constantes PLOMERIA_CATEGORY_ID y BRAND_ID
 *      con los UUIDs reales de tu base de datos (obtenidos del script SQL 01).
 *
 * Funcionalidad:
 *   - Para cada producto del array, intenta hacer INSERT con ON CONFLICT (slug)
 *     → si ya existe, actualiza los campos de specs para corregir el subitem.
 *   - Los productos se insertan con:
 *       specs.subcategory = 'tuberias'
 *       specs.subitem     = 'tuberia-sanitaria-estandar'
 *       specs.variantLabel = 'Diámetro'
 *       specs.variants    = [{value:'50mm'}, {value:'75mm'}, {value:'110mm'}, {value:'160mm'}]
 */

import { createClient } from '@supabase/supabase-js'

// ── Configuración ─────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL
  || process.env.NEXT_PUBLIC_SUPABASE_URL
  || ''

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en variables de entorno.')
  console.error('   Configúralas antes de ejecutar este script:')
  console.error('   export SUPABASE_URL="https://xxx.supabase.co"')
  console.error('   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."')
  process.exit(1)
}

// ⚠️ REEMPLAZA estos UUIDs con los reales de tu base de datos
// Obtenerlos corriendo: SELECT id, name, slug FROM categories WHERE slug = 'plomeria';
//                       SELECT id, name, slug FROM brands ORDER BY name;
const PLOMERIA_CATEGORY_ID = '8dcaa283-542a-4229-abb2-16bcfbecf459'
const DEFAULT_BRAND_ID     = null // UUID de marca (ej: Tubrica) o null si no aplica

// ── Datos del CSV del cliente ─────────────────────────────────────────────
// Derivados de las líneas 3 y 15 del CSV: LISTA DE PRODUCTOS PLOMERIA.xlsx

const TUBERIAS_ESTANDAR = [
  {
    name: 'Tubería Estándar Sanitaria PVC',
    slug: 'tuberia-estandar-sanitaria-pvc',
    sku: 'TUB-EST-SAN-PVC',
    short_desc: 'Tubería PVC sanitaria estándar. Disponible en diámetros de 50mm, 75mm, 110mm y 160mm.',
    description: 'Tubería sanitaria estándar de PVC para sistemas de drenaje y aguas servidas. Fabricada bajo normas COVENIN para garantizar resistencia y durabilidad. Ideal para instalaciones residenciales y comerciales.',
    subitem: 'tuberia-sanitaria-estandar',
    stockStatus: 'available',
    unidad: 'tramo',
    variantLabel: 'Diámetro',
    variants: [
      { value: '50mm' },
      { value: '75mm' },
      { value: '110mm' },
      { value: '160mm' },
    ],
  },
  {
    name: 'Tubería Reforzada Sanitaria PVC',
    slug: 'tuberia-reforzada-sanitaria-pvc',
    sku: 'TUB-REF-SAN-PVC',
    short_desc: 'Tubería PVC sanitaria reforzada. Disponible en diámetros de 50mm, 75mm, 110mm y 160mm.',
    description: 'Tubería sanitaria reforzada de PVC de mayor espesor para sistemas de drenaje de alto tráfico. Mayor resistencia a presión y aplastamiento. Certificación COVENIN.',
    subitem: 'tuberia-sanitaria-reforzada',
    stockStatus: 'available',
    unidad: 'tramo',
    variantLabel: 'Diámetro',
    variants: [
      { value: '50mm' },
      { value: '75mm' },
      { value: '110mm' },
      { value: '160mm' },
    ],
  },
]

// ── Conexiones Estándar (del CSV líneas 4-13) ─────────────────────────────

const CONEXIONES_ESTANDAR = [
  {
    name: 'Codo 90° Estándar PVC Sanitario',
    slug: 'codo-90-estandar-pvc-sanitario',
    sku: 'COD-90-EST-SAN',
    short_desc: 'Codo PVC sanitario 90° estándar. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Codo 45° Estándar PVC Sanitario',
    slug: 'codo-45-estandar-pvc-sanitario',
    sku: 'COD-45-EST-SAN',
    short_desc: 'Codo PVC sanitario 45° estándar. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Tee Estándar PVC Sanitario',
    slug: 'tee-estandar-pvc-sanitario',
    sku: 'TEE-EST-SAN',
    short_desc: 'Tee PVC sanitario estándar. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Yee Estándar PVC Sanitario',
    slug: 'yee-estandar-pvc-sanitario',
    sku: 'YEE-EST-SAN',
    short_desc: 'Yee PVC sanitario estándar. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Anillo Estándar PVC Sanitario',
    slug: 'anillo-estandar-pvc-sanitario',
    sku: 'ANI-EST-SAN',
    short_desc: 'Anillo PVC sanitario estándar. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Tapa Lisa Estándar PVC Sanitario',
    slug: 'tapa-lisa-estandar-pvc-sanitario',
    sku: 'TAP-LIS-EST-SAN',
    short_desc: 'Tapa lisa PVC sanitario estándar. Disponible en 50mm, 75mm y 110mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }],
  },
  {
    name: 'Tapón de Registro Estándar PVC Sanitario',
    slug: 'tapon-registro-estandar-pvc-sanitario',
    sku: 'TAP-REG-EST-SAN',
    short_desc: 'Tapón de registro PVC sanitario estándar. Disponible en 50mm, 75mm y 110mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }],
  },
  {
    name: 'Tee Reducida Estándar PVC Sanitario',
    slug: 'tee-reducida-estandar-pvc-sanitario',
    sku: 'TEE-RED-EST-SAN',
    short_desc: 'Tee reducida PVC sanitario estándar. Disponible en 110x75mm, 110x50mm y 75x50mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '110x50mm' }, { value: '75x50mm' }],
  },
  {
    name: 'Yee Reducida Estándar PVC Sanitario',
    slug: 'yee-reducida-estandar-pvc-sanitario',
    sku: 'YEE-RED-EST-SAN',
    short_desc: 'Yee reducida PVC sanitario estándar. Disponible en 110x75mm, 110x50mm y 75x50mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '110x50mm' }, { value: '75x50mm' }],
  },
  {
    name: 'Anillo Reducido Estándar PVC Sanitario',
    slug: 'anillo-reducido-estandar-pvc-sanitario',
    sku: 'ANI-RED-EST-SAN',
    short_desc: 'Anillo reducido PVC sanitario estándar. Disponible en 110x75mm, 75x50mm y 110x50mm.',
    subitem: 'conexiones-sanitarias-estandar',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '75x50mm' }, { value: '110x50mm' }],
  },
]

// ── Conexiones Reforzadas (del CSV líneas 16-24) ──────────────────────────

const CONEXIONES_REFORZADAS = [
  {
    name: 'Codo 90° Reforzada PVC Sanitario',
    slug: 'codo-90-reforzada-pvc-sanitario',
    sku: 'COD-90-REF-SAN',
    short_desc: 'Codo PVC sanitario 90° reforzado. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Codo 45° Reforzada PVC Sanitario',
    slug: 'codo-45-reforzada-pvc-sanitario',
    sku: 'COD-45-REF-SAN',
    short_desc: 'Codo PVC sanitario 45° reforzado. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Tee Reforzada PVC Sanitario',
    slug: 'tee-reforzada-pvc-sanitario',
    sku: 'TEE-REF-SAN',
    short_desc: 'Tee PVC sanitario reforzado. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Yee Reforzada PVC Sanitario',
    slug: 'yee-reforzada-pvc-sanitario',
    sku: 'YEE-REF-SAN',
    short_desc: 'Yee PVC sanitario reforzado. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Anillo Reforzada PVC Sanitario',
    slug: 'anillo-reforzada-pvc-sanitario',
    sku: 'ANI-REF-SAN',
    short_desc: 'Anillo PVC sanitario reforzado. Disponible en 50mm, 75mm, 110mm y 160mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }, { value: '160mm' }],
  },
  {
    name: 'Tapa Lisa Reforzada PVC Sanitario',
    slug: 'tapa-lisa-reforzada-pvc-sanitario',
    sku: 'TAP-LIS-REF-SAN',
    short_desc: 'Tapa lisa PVC sanitario reforzado. Disponible en 50mm, 75mm y 110mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Diámetro',
    variants: [{ value: '50mm' }, { value: '75mm' }, { value: '110mm' }],
  },
  {
    name: 'Tee Reducida Reforzada PVC Sanitario',
    slug: 'tee-reducida-reforzada-pvc-sanitario',
    sku: 'TEE-RED-REF-SAN',
    short_desc: 'Tee reducida PVC sanitario reforzado. Disponible en 110x75mm, 110x50mm y 75x50mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '110x50mm' }, { value: '75x50mm' }],
  },
  {
    name: 'Yee Reducida Reforzada PVC Sanitario',
    slug: 'yee-reducida-reforzada-pvc-sanitario',
    sku: 'YEE-RED-REF-SAN',
    short_desc: 'Yee reducida PVC sanitario reforzado. Disponible en 110x75mm, 110x50mm y 75x50mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '110x50mm' }, { value: '75x50mm' }],
  },
  {
    name: 'Anillo Reducido Reforzada PVC Sanitario',
    slug: 'anillo-reducido-reforzada-pvc-sanitario',
    sku: 'ANI-RED-REF-SAN',
    short_desc: 'Anillo reducido PVC sanitario reforzado. Disponible en 110x75mm, 75x50mm y 110x50mm.',
    subitem: 'conexiones-sanitarias-reforzadas',
    variantLabel: 'Medida',
    variants: [{ value: '110x75mm' }, { value: '75x50mm' }, { value: '110x50mm' }],
  },
]

// ── Función principal de upsert ───────────────────────────────────────────

async function upsertProducts(supabase, products, label) {
  console.log(`\n🔄 Procesando: ${label} (${products.length} productos)`)
  
  let success = 0
  let updated = 0
  let errors = 0

  for (const product of products) {
    const specs = {
      imagen: '/placeholder-product.webp',
      stockStatus: product.stockStatus || 'available',
      unidad: product.unidad || 'und',
      tags: [],
      subcategory: 'tuberias',
      subitem: product.subitem,
      variantLabel: product.variantLabel,
      variants: product.variants,
    }

    // Intentar buscar por slug primero
    const { data: existing } = await supabase
      .from('products')
      .select('id, specs')
      .eq('slug', product.slug)
      .maybeSingle()

    if (existing) {
      // UPDATE: Producto existe → actualizar specs con subitem correcto
      const mergedSpecs = { ...existing.specs, ...specs }
      // Preservar imagen existente si no es placeholder
      if (existing.specs?.imagen && existing.specs.imagen !== '/placeholder-product.webp') {
        mergedSpecs.imagen = existing.specs.imagen
      }

      const { error } = await supabase
        .from('products')
        .update({ specs: mergedSpecs, updated_at: new Date().toISOString() })
        .eq('id', existing.id)

      if (error) {
        console.error(`   ❌ UPDATE falló para "${product.name}": ${error.message}`)
        errors++
      } else {
        console.log(`   🔄 Actualizado: ${product.name}`)
        updated++
      }
    } else {
      // INSERT: Producto no existe → crear nuevo
      const row = {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        short_desc: product.short_desc,
        description: product.description || null,
        category_id: PLOMERIA_CATEGORY_ID,
        brand_id: DEFAULT_BRAND_ID,
        is_casheable: false,
        specs,
      }

      const { error } = await supabase
        .from('products')
        .insert(row)

      if (error) {
        if (error.code === '23505') {
          console.log(`   ⚠️  Ya existe (slug/sku duplicado): ${product.name}`)
        } else {
          console.error(`   ❌ INSERT falló para "${product.name}": ${error.message}`)
        }
        errors++
      } else {
        console.log(`   ✅ Insertado: ${product.name}`)
        success++
      }
    }
  }

  console.log(`\n📊 Resultado ${label}:`)
  console.log(`   ✅ Insertados: ${success}`)
  console.log(`   🔄 Actualizados: ${updated}`)
  console.log(`   ❌ Errores: ${errors}`)

  return { success, updated, errors }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  CharaTools — Upsert Masivo de Productos Plomería   ')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`📡 Supabase URL: ${SUPABASE_URL.substring(0, 30)}...`)

  if (PLOMERIA_CATEGORY_ID === 'REEMPLAZAR-CON-UUID-DE-PLOMERIA') {
    console.error('\n❌ Error: Debes reemplazar PLOMERIA_CATEGORY_ID con el UUID real.')
    console.error('   Ejecútalo en Supabase SQL Editor:')
    console.error("   SELECT id FROM categories WHERE slug = 'plomeria';")
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Verificar conexión
  const { count, error: pingErr } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  if (pingErr) {
    console.error(`\n❌ No se pudo conectar a Supabase: ${pingErr.message}`)
    process.exit(1)
  }

  console.log(`✅ Conectado. Productos actuales en la DB: ${count}`)

  // Ejecutar upserts
  const r1 = await upsertProducts(supabase, TUBERIAS_ESTANDAR, 'Tuberías Estándar + Reforzadas')
  const r2 = await upsertProducts(supabase, CONEXIONES_ESTANDAR, 'Conexiones Estándar')
  const r3 = await upsertProducts(supabase, CONEXIONES_REFORZADAS, 'Conexiones Reforzadas')

  // Resumen final
  const totalSuccess = r1.success + r2.success + r3.success
  const totalUpdated = r1.updated + r2.updated + r3.updated
  const totalErrors  = r1.errors + r2.errors + r3.errors

  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  RESUMEN FINAL')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`  ✅ Insertados: ${totalSuccess}`)
  console.log(`  🔄 Actualizados: ${totalUpdated}`)
  console.log(`  ❌ Errores: ${totalErrors}`)
  console.log('═══════════════════════════════════════════════════════')

  if (totalErrors > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('💥 Error fatal:', err)
  process.exit(1)
})
