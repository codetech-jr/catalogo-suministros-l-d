# Sprint 2: Arquitectura de Datos (Supabase BaaS)
**Objetivo:** Crear el modelo de datos exacto basado en la pág 1 y 2 del Documento de Arquitectura.

**Dependencias previas:** 01-Task-Setup-Arquitectura.
**Reglas Aplicables:** Modelado relacional SQL óptimo.

**Acciones:**
Crea el script o los tipos de TypeScript (interfaces) para las siguientes tablas:
1. `Products`: Debe incluir al menos (id, sku, name, description, price_usd, b2b_tier_price, stock, category).
2. `Orders`: Debe incluir información transaccional y método de entrega/flete.
3. Provee en tu respuesta una simulación de los `CREATE TABLE` en SQL que debo ejecutar en mi consola de Supabase, prestando especial atención a que necesitamos consultar rápido por SKU o nombre de pieza.

**Criterios de Éxito:** Archivos `.ts` o `.d.ts` con los tipos e interfaces bien definidos para conectar Next.js con el tipado fuerte que requiere el nicho ferretero.
