# Suministros L&D — Arquitectura E-Commerce Dinámico Híbrido (B2B/B2C)

> **Documento de Arquitectura, Diseño y Planificación Estratégica — Fase I**
> Stack: Next.js (App Router) + TailwindCSS + Supabase
> Modelo: WhatsApp Checkout Híbrido B2B/B2C

---

## User Review Required

> [!NOTE]
> Este plan ha sido actualizado incorporando el feedback estratégico del cliente para el mercado venezolano.

> [!IMPORTANT]
> **Decisiones Consolidadas:**
> 1. **Logo Temporal:** Texto de marca "Suministros L&D" con un isotipo SVG limpio (icono de rayo o bombilla de iluminación).
> 2. **Alcance del Catálogo en Home:** Grid de exactamente 10 productos más vendidos, simplificando la navegación inicial y agilizando la carga de la página.
> 3. **Monitor Cambiario BCV:** API Route de Next.js `/api/bcv-rate` que consume PyDolarVenezuela. Estrategia de caching con ISR (revalidate cada 12 horas / 43,200 segundos) para mitigar caídas de APIs externas y asegurar carga instantánea.
> 4. **Acelerador Cashea:** Banner estático de alto contraste (fondo amarillo brillante, texto en negro, logo de Cashea) ubicado inmediatamente debajo del header/navbar, emulando la referencia visual provista. Sin integraciones complejas de SDK.
> 5. **Canal de Liquidación:** WhatsApp corporativo centralizado en el número **+58 414-1025386**.

---

## 1. ARQUITECTURA DE INFORMACIÓN DEL HOME

> Metodologías aplicadas: [brainstorming](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/brainstorming/SKILL.md), [idea-refine](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/agent-skills-main/skills/idea-refine/SKILL.md), [page-cro](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/page-cro/SKILL.md)

### 1.1 Estructura Jerárquica de Secciones

La landing page sigue un **flujo de persuasión descendente** diseñado para dos personas simultáneamente: el comprador casero rápido y el contratista/electricista B2B.

```
┌─────────────────────────────────────────────────────────┐
│  S0. NAVBAR STICKY                                      │
│  Texto "Suministros L&D" + SVG Rayo | Búsqueda | Carrito│
├─────────────────────────────────────────────────────────┤
│  S0.5 BANNER CASHEA — Tira Amarilla de Alto Contraste   │
│  [SVG Cashea] ¡Cashéalo Online! Cuotas sin interés      │
├─────────────────────────────────────────────────────────┤
│  S1. HERO SECTION — Split Screen Asimétrico             │
│  "Tu aliado en iluminación y materiales eléctricos      │
│   de todo los Valles del Tuy"                           │
│  [CTA: Ver Catálogo]  +  Tasa BCV en vivo (badge)      │
├─────────────────────────────────────────────────────────┤
│  S2. BARRA DE ACELERADORES FINANCIEROS                  │
│  [ Tasa BCV Oficial Hoy: Bs. XX,XX ]                   │
│  (Actualizado automáticamente vía Route Handler ISR)     │
├─────────────────────────────────────────────────────────┤
│  S3. PRODUCTOS DE ALTA ROTACIÓN — Grid de 3 Categorías  │
│  Luminaria LED | Brekeras | Cableado Pesado             │
│  (Botones gráficos inmediatos con ícono SVG + label)    │
├─────────────────────────────────────────────────────────┤
│  S4. LOS 10 MÁS VENDIDOS — Grid de 10 Productos         │
│  Tarjetas de producto destacadas con Volume Pricing     │
│  "Llévate la caja completa y ahorra X%"                 │
├─────────────────────────────────────────────────────────┤
│  S5. PROPUESTA DE VALOR / POR QUÉ NOSOTROS             │
│  3 pilares: Calidad | Variedad | Mejores Precios        │
│  (Iconos SVG, sin emojis — máximo 3 items)              │
├─────────────────────────────────────────────────────────┤
│  S6. COBERTURA Y LOGÍSTICA                              │
│  Mapa visual simplificado de Valles del Tuy             │
│  Delivery Gratis Charallave | Flete resto del Tuy       │
├─────────────────────────────────────────────────────────┤
│  S7. TRUST BAR — Señales de Confianza                   │
│  Métodos de Pago: Zelle | Binance | Pago Móvil          │
│  + Años de experiencia + Tienda Física en Charallave    │
├─────────────────────────────────────────────────────────┤
│  S8. FOOTER                                             │
│  Datos fiscales | Dirección Charallave | WhatsApp        │
│  Horarios | Redes Sociales | Enlace a Cashea            │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Lógica de Cada Sección

#### S0. Navbar Sticky
- **Logo provisional**: Combinación tipográfica premium con fuente Outfit Bold para "Suministros L&D" junto a un isotipo de rayo eléctrico minimalista en SVG.
- **Búsqueda Estratégica Mixta**: Un input con debounce de 300ms contra Supabase que acepta SKU alfanumérico (ej: "SKU-CABLE-12") o nombre del producto.
- **Carrito Drawer**: Side-drawer para gestionar compras.

#### S0.5 Banner Cashea (Faja de Alto Contraste)
- Ubicación inmediatamente debajo de la Navbar, con color de fondo amarillo brillante de alta visibilidad (`bg-[#FACC15]`), texto en color negro charcoal y el isotipo oficial de Cashea en SVG.
- Texto: "¡Cashéalo Online! Cuotas sin interés".

#### S1. Hero Section — Split Screen
- **Layout**: Asimétrico 55/45 (texto izquierda, imagen/visual derecha). Se prohíbe el hero centrado genérico (regla design-taste-frontend, DESIGN_VARIANCE: 6).
- **Headline (H1)**: "Tu aliado en iluminación y materiales eléctricos de todo los Valles del Tuy".
- **Subheadline**: "Precios al detal y por volumen. Cotiza, paga y recibe — todo desde tu celular."

#### S2. Barra de Aceleradores Financieros
- **BCV en vivo**: "Tasa Oficial BCV Hoy: 1 USD = Bs. XX,XX" (Actualizado de forma limpia mediante la llamada en caché a `/api/bcv-rate`).

#### S4. Los 10 Más Vendidos
- Grid asimétrico con scroll horizontal en mobile y grid estructurado en desktop para los 10 productos de mayor rotación comercial. Cada uno incorpora la estrategia de psicología de precios.

---

## 2. SISTEMA DE DISEÑO Y UI/UX

> Metodologías aplicadas: [ui-ux-pro-max](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/ui-ux-pro-max/SKILL.md), [design-taste-frontend](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/design-taste-frontend/SKILL.md)

### 2.1 Parámetros de Diseño Base

```
DESIGN_VARIANCE:  6  (Offset — layouts asimétricos controlados)
MOTION_INTENSITY: 4  (Fluid CSS — transiciones suaves, sin animaciones complejas)
VISUAL_DENSITY:   5  (Daily App — equilibrio entre respiro visual y densidad de info)
```

### 2.2 Paleta de Colores

Concepto: **"Profesionalismo Técnico"** — Base neutral (Slate/Zinc) + Accent singular de alta energía.

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-primary` | `#0F1419` | Fondo principal (dark mode default) |
| `--color-bg-secondary` | `#1A2332` | Superficies elevadas, cards |
| `--color-accent` | `#0EA5E9` | CTA primarios, links, highlights |
| `--color-success` | `#10B981` | Confirmaciones, delivery gratis |
| `--color-warning` | `#F59E0B` | Alertas, flete adicional |
| `--color-danger` | `#EF4444` | Errores, stock agotado |
| `--color-text-primary` | `#F1F5F9` | Texto principal (dark) |
| `--color-text-secondary` | `#94A3B8` | Texto secundario (dark) |
| `--color-cashea-banner` | `#FACC15` | Amarillo Cashea (faja promocional) |

### 2.3 Tipografía
- **Display / H1**: Outfit Bold (`text-4xl md:text-5xl`, tracking-tighter).
- **Body / Textos**: Geist Sans (`text-base`, tracking-normal).
- **Precios / SKU**: Geist Mono (`text-lg md:text-2xl`, tracking-tight) para asegurar alineación exacta de dígitos (tabular).

---

## 3. TARJETA DE PRODUCTO Y PSICOLOGÍA DE PRECIOS

> Metodologías aplicadas: [price-psychology-strategist](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/price-psychology-strategist/SKILL.md)

### 3.1 Anatomía de la Tarjeta

```
┌─────────────────────────────────────────┐
│  [IMAGEN DEL PRODUCTO]                  │
│                                         │
│   ┌─────────────────────────────┐       │
│   │  BADGE: "Ahorra 15% x caja"│ ◄─── Anclaje B2B visible
│   └─────────────────────────────┘       │
├─────────────────────────────────────────┤
│  SKU: EL-PNL-6060-40W                  │ ◄─── Código interno (Geist Mono, muted)
│                                         │
│  Panel LED 60x60 40W Luz Fría           │ ◄─── Nombre del producto (Outfit SemiBold)
│  Marca: Ledvance                        │ ◄─── Submarca (Geist Sans, secondary)
│                                         │
│  ─── BLOQUE DE PRECIOS MULTI-FORMATO ───│
│                                         │
│  UNIDAD          CAJA (12 uds)          │
│  $8.50           $86.70                 │ ◄─── Geist Mono, accent color
│  Bs. 392,65      Bs. 4.005,33           │ ◄─── Equivalente BCV (text muted, sm)
│                  ▼ $7.22/ud             │ ◄─── Precio unitario en caja (success color)
│                                         │
│  ───────────────────────────────────────│
│  Cashea: 3 cuotas de $2.83             │ ◄─── Informativo (sin API call)
│                                         │
│  [ Agregar al carrito    ]              │ ◄─── CTA primario
│  [ Consultar mayorista   ]              │ ◄─── CTA secundario (outline, menor peso)
└─────────────────────────────────────────┘
```

---

## 4. FLUJO DEL WHATSAPP CHECKOUT

> Metodologías aplicadas: [page-cro](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/page-cro/SKILL.md)

### 4.1 Datos de Envío y WhatsApp

- **Número Destino:** `+58 414-1025386` (WhatsApp corporativo).
- **Proceso de Checkout de 4 Pasos (Stepper):**
  - **Paso 1: Tu Pedido:** Resumen y subtotalización en USD e importes en Bs. al BCV.
  - **Paso 2: Método de Pago:** Selección (Pago Móvil, Zelle, Binance, Cashea informativo).
  - **Paso 3: Datos de Pago:** Nombre, número de teléfono y campo obligatorio de los últimos 6 dígitos de la referencia de pago (auditoría previa).
  - **Paso 4: Entrega:** Selectores de despacho obligatorios:
    - Retiro Físico (Gratis)
    - Delivery Charallave Zona Céntrica (Gratis)
    - Flete Valles del Tuy (Costo Adicional según zona)

---

## 5. ARQUITECTURA TÉCNICA

> Metodología aplicada: [nextjs-best-practices](file:///home/alejo/Documentos/Proyectos/SuministrosL&D-Ecommerce/Skills/antigravity-awesome-skills-main/plugins/antigravity-awesome-skills/skills/nextjs-best-practices/SKILL.md)

### 5.1 Route Handler de la Tasa BCV (`/api/bcv-rate/route.ts`)

- **Estrategia:** El Handler consultará la API pública de PyDolarVenezuela (`https://pydolarvenezuela-api.vercel.app/api/v1/dollar/page?page=bcv`).
- **Resiliencia & Performance:** Para evitar llamadas excesivas y lentitud del servicio externo, se utiliza caching ISR/Revalidation con Next.js a nivel de ruta:
```typescript
export const revalidate = 43200; // Cacheado por 12 horas (actualizaciones 1 o 2 veces al día)
```
- Si la API externa falla, el sistema sirve la última versión en caché y escribe un log de fallback.

### 5.2 Estructura de Carpetas Sugerida

```
suministros-ld/
├── public/
│   └── icons/
│       ├── brands/              # SVGs: whatsapp.svg, cashea.svg, zelle.svg, etc.
│       └── categories/          # SVGs: led-panel.svg, breaker.svg, cable-roll.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout root con Outfit y Geist
│   │   ├── page.tsx             # Home con 10 productos estrella
│   │   ├── checkout/
│   │   │   └── page.tsx         # Motor Transaccional de 4 Pasos
│   │   └── api/
│   │       └── bcv-rate/
│   │           └── route.ts     # API Route con PyDolarVenezuela (ISR)
│   ├── components/
│   │   ├── ui/                  # Componentes atómicos (Button, Badge, etc.)
│   │   ├── product/             # ProductCard, PriceDisplay, ProductGrid
│   │   └── checkout/            # CartDrawer, Stepper, PaymentReferenceForm
│   ├── lib/
│   │   ├── bcv/                 # Caching logic y fetch wrappers
│   │   └── whatsapp/            # Formateador de mensaje (wa.me string builder)
│   └── stores/
│       └── cart-store.ts        # Zustand para estado del carrito
```

---

## Verification Plan

### Automated Tests
- Validar las conversiones de moneda en `PriceDisplay` mediante casos de prueba controlados.
- Testear el formateo del link de salida de WhatsApp en `message-builder`.

### Manual Verification
- Validar la visualización del banner amarillo de Cashea en viewports de 375px, 768px y 1200px.
- Confirmar que la ruta `/api/bcv-rate` responde en menos de 200ms con la tasa cacheada tras la primera consulta.
