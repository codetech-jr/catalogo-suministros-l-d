# Arquitectura E-Commerce Dinámico Híbrido B2B/B2C — Suministros L&D

> Documento de Arquitectura de Software, Sistema de Diseño y Estrategia UX/CRO
> Fase I — Levantamiento Estratégico

---

## 1. ARQUITECTURA DE INFORMACIÓN DEL HOME

### Mapa de Secciones (Scroll Vertical — Orden Estratégico)

La estructura sigue el principio **AIDA** (Atención → Interés → Deseo → Acción) combinado con las metodologías de *brainstorming* (contexto antes de diseño) e *idea-refine* (convergencia hacia una propuesta clara).

```
┌─────────────────────────────────────────────────────┐
│  01. STICKY NAVBAR                                  │
│      Logo + Buscador Mixto + Tasa BCV + Carrito     │
├─────────────────────────────────────────────────────┤
│  02. BANNER ACELERADORES FINANCIEROS                │
│      [Cashea Cuotas] | [Tasa Oficial BCV]           │
├─────────────────────────────────────────────────────┤
│  03. HERO SECTION (Split Asymmetric)                │
│      Copy Principal + Buscador + Imagen Producto    │
├─────────────────────────────────────────────────────┤
│  04. CATEGORÍAS DE ALTA ROTACIÓN                    │
│      3 Cards Gráficas: Iluminación / Control /      │
│      Material Pesado                                │
├─────────────────────────────────────────────────────┤
│  05. PRODUCTOS DESTACADOS (Grid Catálogo)           │
│      Filtrado por Tabs + Grid Responsivo            │
├─────────────────────────────────────────────────────┤
│  06. SECCIÓN FACILIDADES DE PAGO (Deep Dive)        │
│      BCV + Cashea detallados con iconografía        │
├─────────────────────────────────────────────────────┤
│  07. PROPUESTA DE VALOR / TRUST SIGNALS             │
│      3 Pilares: Logística + Pagos + WhatsApp        │
├─────────────────────────────────────────────────────┤
│  08. CTA FINAL (Cierre)                             │
│      "Cotiza tu obra completa por WhatsApp"         │
├─────────────────────────────────────────────────────┤
│  09. FOOTER                                         │
│      RIF, dirección, redes, enlace WhatsApp         │
└─────────────────────────────────────────────────────┘
```

### Detalle por Sección

#### 01. Sticky Navbar
- **Izquierda:** Logo SVG (isotipo rayo + "Suministros L&D") + subtítulo "Ferretería Especializada"
- **Centro:** Buscador con placeholder: *"Buscar por nombre, SKU o código interno..."*
- **Derecha:** Widget Tasa BCV en vivo (chip compacto) + Botón carrito con badge de cantidad
- **Comportamiento:** Glassmorphism (`backdrop-blur`) al hacer scroll. Se compacta de 64px a 56px en scroll.

#### 02. Banner de Aceleradores Financieros
- **Posición:** Inmediatamente bajo el navbar, banda horizontal completa.
- **Contenido:** Dos módulos lado a lado (en móvil, apilados):
  - `[CASHEA]` — "Compra en cuotas sin interés. Hasta 6 meses."
  - `[BCV]` — "Todos los precios bajo Tasa Oficial. Transparencia legal."
- **Diseño:** Background con gradiente sutil oscuro (#12141c → #241a3a). Badges tipográficos para cada marca.
- **Justificación CRO:** Exponer los aceleradores financieros *antes* del Hero reduce la objeción de precio en el primer scan visual (regla de primacía). El contratista B2B que llega buscando material ve "cuotas" antes de ver precios.

#### 03. Hero Section (Split Asimétrico)
- **Layout:** 60/40 split — Copy a la izquierda, composición visual a la derecha.
- **Copy izquierdo:**
  - Chip superior: `Material Eléctrico Profesional` (pill badge con ícono SVG de bombillo)
  - H1: *"Tu aliado en iluminación y materiales eléctricos de todo los **Valles del Tuy**"*
  - Subtítulo: *"Abastecemos obras, ingenieros y hogares en Charallave, Cúa, Ocumare y más. Compra online y retira hoy."*
  - Buscador integrado (duplicado del navbar para primera carga sin scroll)
- **Visual derecho:** Composición flotante con elementos gráficos de productos reales (bombillo LED, cable, breaker) con efecto parallax sutil. Glow radial de fondo (cyan/amber).
- **Justificación:** El split asimétrico (60/40) cumple la directiva de *design-taste-frontend* que prohíbe héroes centrados cuando `DESIGN_VARIANCE > 4`. La imagen no es decorativa: muestra productos reales para anclar expectativas.

> [!IMPORTANT]
> El Hero NO debe usar imágenes de stock genéricas. Debe mostrar productos reales del catálogo (bombillos LED, brekeras, cables) fotografiados o renderizados con alta calidad. Esto es un diferenciador clave de confianza para el usuario B2B.

#### 04. Categorías de Alta Rotación
- **Layout:** 3 tarjetas horizontales (en móvil: scroll horizontal snap).
- **Cada tarjeta contiene:**
  - Ícono SVG representativo (bombillo, rayo, cable)
  - Nombre de categoría
  - Conteo de artículos: "1,200+ artículos"
  - Click navega a la sección filtrada del catálogo
- **Categorías:**
  1. **Luminaria LED** — Paneles, reflectores, bombillos
  2. **Control Eléctrico** — Brekeras, tableros, interruptores
  3. **Material Pesado** — Cables, tubos conduit
- **Justificación CRO:** Botones gráficos de alta rotación son el shortcut del contratista que ya sabe qué necesita. Reducen el tiempo hasta el primer producto en carrito (métrica clave de conversión).

#### 05. Productos Destacados (Grid Catálogo)
- **Filtros:** Tab bar horizontal (Todos / Iluminación / Controles / Material Pesado) + Contador de resultados
- **Grid:** 3 columnas (desktop) → 2 columnas (tablet) → 1 columna (móvil)
- **Tarjeta de producto:** (ver Sección 3 de este documento para diseño detallado)
- **Orden predeterminado:** Productos más vendidos primero (alta rotación)

#### 06. Sección Facilidades de Pago (Deep Dive)
- **Layout:** 2 columnas iguales (en móvil: apiladas)
- **Columna 1 — Tasa BCV:**
  - Ícono SVG de banco central
  - Título: "Tasa Oficial BCV"
  - Descripción: "Todos los precios se calculan al cambio del día. Sin sorpresas, sin sobreprecio."
  - Badge: "PAGA AL CAMBIO DEL DÍA"
- **Columna 2 — Cashea:**
  - Logo Cashea (SVG)
  - Título: "Financiamiento Cashea"
  - Descripción: "Divide tu compra en cuotas cómodas. Ideal para obras y compras al mayor."
  - Badge: "HASTA 6 MESES"
- **Justificación:** Esta sección duplica intencionalmente la información del banner superior pero con mayor profundidad. Según *page-cro*, la redundancia estratégica en objection handling aumenta la confianza del usuario que scrollea completo.

#### 07. Propuesta de Valor / Trust Signals
- **Layout:** 3 columnas con ícono + título + texto
- **Pilares:**
  1. **Retiro y Delivery Local** — "Retiros gratis en Charallave o fletes reducidos para todo el Tuy"
  2. **Pagos Multi-Firma** — "Zelle, Pago Móvil, Binance Pay y efectivo. Facturación legal a tasa BCV"
  3. **WhatsApp Checkout** — "Compra segura y directa por chat. Un asesor confirma tu pago de inmediato"

#### 08. CTA Final (Cierre)
- **Layout:** Banda completa con background gradiente (eléctrico → ámbar)
- **Copy:** *"¿Tienes una obra grande? Cotiza todo el material eléctrico con descuento mayorista."*
- **Botón:** `[Cotizar por WhatsApp]` — enlace directo a wa.me con mensaje pre-cargado
- **Justificación CRO:** El CTA final captura al usuario B2B que scrolleó todo el home sin comprar. Es una "red de seguridad" para leads de alto valor que prefieren cotización personalizada.

#### 09. Footer
- Razón social: SUMINISTROS L&D 2023, C.A.
- RIF: J-50367899-0
- Ubicación: Charallave, Edo. Miranda, Venezuela
- Enlace WhatsApp + Link "Desarrollado con Next.js"
- Copyright dinámico con año actual

---

## 2. SISTEMA DE DISEÑO Y UI/UX

### 2.1 Paleta de Colores

Aplicando *design-taste-frontend* (máximo 1 acento, saturación <80%, ban de "AI Purple") y *ui-ux-pro-max* (contraste 4.5:1 WCAG AA):

| Token CSS | Hex | Uso | Ratio vs. fondo |
|-----------|-----|-----|-----------------|
| `--canvas-primary` | `#08090c` | Background principal (near-black) | — |
| `--canvas-elevated` | `#0e1117` | Superficies elevadas, drawer, footer | — |
| `--canvas-card` | `#12141c` | Background de tarjetas y secciones | — |
| `--text-primary` | `#f4f5f6` | Texto principal sobre canvas | 18.2:1 |
| `--text-secondary` | `#a1a1aa` | Texto secundario (zinc-400) | 7.1:1 |
| `--text-muted` | `#71717a` | Texto terciario, labels (zinc-500) | 4.6:1 |
| `--accent-electric` | `#00e5ff` | Acento primario — CTAs, highlights | 10.8:1 |
| `--accent-amber` | `#ffb300` | Acento secundario — badges, alertas B2B | 10.2:1 |
| `--success` | `#22c55e` | Confirmaciones, checkouts exitosos | 8.4:1 |
| `--danger` | `#ef4444` | Errores, eliminación | 5.2:1 |
| `--hairline` | `rgba(255,255,255,0.08)` | Bordes sutiles, separadores | — |

> [!TIP]
> **Decisión de diseño:** Se mantiene el cyan eléctrico (`#00e5ff`) como acento primario porque comunica "energía eléctrica" de forma instintiva. El ámbar (`#ffb300`) como secundario connota "iluminación LED cálida". Ambos son semánticamente alineados con el nicho de la ferretería eléctrica, y no caen en los anti-patterns de "AI Purple" o "Neon genérico".

### 2.2 Tipografía

Aplicando *design-taste-frontend* (Inter está **prohibido**, usar alternativas premium):

| Rol | Familia | Variable CSS | Peso | Uso |
|-----|---------|-------------|------|-----|
| Display / Headlines | **Space Grotesk** | `--font-display` | 700, 800 | H1, H2, precios, nombre de marca |
| Body / UI | **Inter** → **Geist Sans** | `--font-sans` | 400, 500, 600 | Párrafos, labels, inputs, UI general |

> [!WARNING]
> La skill *design-taste-frontend* prohíbe Inter. Sin embargo, el proyecto actual usa Inter como body font. **Recomendación:** Migrar a **Geist Sans** (disponible en `next/font/google` como `Geist`) que tiene la misma legibilidad técnica pero evita el sesgo "genérico de startup". Si el equipo prefiere mantener Inter por familiaridad, debe documentarse como excepción explícita.

**Escala Tipográfica (rem-based, mobile-first):**

```
--text-xs:    0.625rem  / 10px  — SKU codes, micro-labels
--text-sm:    0.75rem   / 12px  — Specs, metadata, badges  
--text-base:  0.875rem  / 14px  — Body text, descriptions
--text-lg:    1rem      / 16px  — Card titles, section labels
--text-xl:    1.25rem   / 20px  — Section headings
--text-2xl:   1.5rem    / 24px  — Precios unitarios
--text-3xl:   2rem      / 32px  — H2 secciones
--text-hero:  2.5rem    / 40px  → 3.75rem / 60px (desktop) — H1 Hero
```

### 2.3 Iconografía

| Librería | Uso | Formato |
|----------|-----|---------|
| **Lucide React** (ya instalado) | Iconografía UI general | SVG inline |
| **SVGs custom** | Logo L&D, iconos de categoría, logo Cashea/BCV | SVG archivos |

> [!CAUTION]
> **Política anti-emoji estricta.** Cero emojis en toda la interfaz. Los emojis del mensaje de WhatsApp actual (`⚡👤📍💳🔢📦💵🇻🇪📈`) deben reemplazarse por delimitadores textuales limpios (`---`, `*`, bullets). El WhatsApp message ya sale del dominio de la web, pero debe mantener profesionalismo.

### 2.4 Layout Responsivo

Diseño **mobile-first** pensando en el contratista navegando desde la obra con señal deficiente:

| Breakpoint | Token | Columnas Grid | Comportamiento |
|------------|-------|---------------|----------------|
| < 640px | `sm` | 1 columna | Navegación colapsada, tarjetas full-width |
| 640–1024px | `md` | 2 columnas | Grid 2-col, navbar expandido |
| > 1024px | `lg` | 3 columnas | Grid 3-col, layout completo |
| > 1280px | `xl` | 3 columnas (max-w) | Contenido centrado `max-w-7xl` |

**Reglas Obligatorias (de *ui-ux-pro-max*):**
- Touch targets mínimos de **44x44px** en todos los botones y enlaces
- Font mínimo de **16px** en inputs (previene zoom en iOS)
- Sin scroll horizontal nunca
- `min-h-[100dvh]` en lugar de `h-screen`
- Imágenes con `loading="lazy"` y formato WebP con fallback

**Especificaciones Críticas para Señal Deficiente:**
- Skeleton loaders en todas las secciones de data
- Service Worker para cacheo offline del catálogo
- Imágenes comprimidas (<50KB por thumbnail)
- Priorizar First Contentful Paint: Hero carga sin JS

### 2.5 Efectos y Micro-Interacciones

| Efecto | Implementación | Dónde |
|--------|---------------|-------|
| Glassmorphism | `backdrop-blur(12px)` + `bg-rgba(14,17,23,0.65)` | Navbar, drawer, modales |
| Hover lift | `scale(1.01)` + border cyan glow | Tarjetas de producto |
| Spring transitions | `type: "spring", damping: 25, stiffness: 200` | Drawer carrito, modales |
| Glow radial | Gradiente blur `#00e5ff/20` | Background del Hero |
| Stagger grid | `staggerChildren: 0.05` | Carga de grid de productos |
| Pulse badge | `animate-pulse` en carrito badge | Botón carrito (cuando tiene items) |

---

## 3. TARJETA DE PRODUCTO Y PSICOLOGÍA DE PRECIOS

### 3.1 Framework de Precio (Aplicando *price-psychology-strategist*)

**Audiencia dual:**
- **B2C (casero):** Price-sensitive → mostrar affordability y transparencia
- **B2B (contratista):** Value-sensitive → mostrar ahorro por volumen (outcome)

**Estrategia seleccionada:** Tiered pricing con anclaje visual + reducción de dolor de pago multi-moneda.

### 3.2 Anatomía de la Tarjeta de Producto

```
┌─────────────────────────────────────────────┐
│  [SKU: LD-LED-PR18]          [ILUMINACIÓN]  │  ← Header: código + badge categoría
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         IMAGEN DEL PRODUCTO         │    │  ← Foto real del producto (WebP)
│  │         (aspect-ratio 4:3)          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Panel LED Empotrable Redondo 18W           │  ← Nombre (font-display, bold)
│                                             │
│  Luz blanca de alta luminosidad ideal       │  ← Descripción (2 líneas max,
│  para techos residenciales y comerciales.   │     line-clamp-2)
│                                             │
│  ┌─ FICHA TÉCNICA ──────────────────────┐   │
│  │  · Potencia: 18W                     │   │  ← Specs técnicos (bg elevado)
│  │  · Voltaje: 85-265V                  │   │
│  │  · Lúmenes: 1600 lm                  │   │
│  │  · Color: Luz Fría 6500K             │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌─ PRECIO POR CAJA (B2B) ──────────────┐   │
│  │  Llévate 20+ unidades:               │   │  ← ANCLAJE: precio descuento
│  │            $3.80 c/u                  │   │     resaltado en cyan
│  │  Ahorras $0.70 por unidad            │   │  ← AHORRO explícito (dolor reducido)
│  └──────────────────────────────────────┘   │
│                                             │
│  Precio Unitario                            │
│  $4.50 / unidad                             │  ← Precio ancla (más grande, blanco)
│  ≈ Bs. 181.13 (BCV)                        │  ← Equivalente BCV (texto muted)
│  ≈ Bs. 75.19/mes con Cashea                │  ← Cuota Cashea (texto muted, sutil)
│                                             │
│  [        + Agregar al Carrito        ]     │  ← CTA primario (cyan, full-width)
└─────────────────────────────────────────────┘
```

### 3.3 Técnicas de Psicología de Precios Aplicadas

#### A. Anclaje de Precio (Anchoring)

El **precio unitario ($4.50)** es el ancla alta. El **precio por caja ($3.80)** se muestra *antes* del unitario en la sección B2B, creando el efecto de anclaje invertido:

1. El contratista B2B lee primero "$3.80 por unidad en caja" → percibe deal
2. Luego ve "$4.50 unitario" → confirma que el descuento es real
3. El diferencial "Ahorras $0.70 por unidad" se calcula y muestra explícitamente

**Regla de implementación:** El bloque B2B solo aparece si `product.volumeDiscount` existe. Para productos sin volumen, la tarjeta es más compacta.

#### B. Reducción del Dolor de Pago (Pain-of-Paying Reduction)

El precio se muestra en 3 capas de profundidad **progresiva**, no simultánea:

| Capa | Contenido | Visibilidad | Justificación |
|------|-----------|-------------|---------------|
| 1 (Primaria) | `$4.50 / unidad` | Siempre visible, `text-2xl font-extrabold` | Precio ancla en divisa fuerte. Referencia mental principal. |
| 2 (Contextual) | `≈ Bs. 181.13 (BCV)` | Siempre visible, `text-xs text-muted` | Permite calcular pago local sin calculadora. Tamaño menor para no anclar en número alto. |
| 3 (Facilitador) | `≈ Bs. 75.19/mes con Cashea` | Visible si aplica, `text-xs text-muted` | Fracciona el dolor del pago. El cerebro procesa "75 bolívares/mes" como mucho menor que "181 bolívares". |

> [!IMPORTANT]
> **Decisión clave de diseño:** El equivalente BCV y la cuota Cashea se muestran en texto `muted` (gris claro) intencionalmente. Según *price-psychology-strategist*, mostrar múltiples números grandes genera "sticker shock". Los montos VES son naturalmente altos en Venezuela; mantenerlos visualmente subordinados al precio USD evita que el usuario ancle en la cifra más alta.

#### C. Volumen Pricing con Señalización Social B2B

El bloque de descuento por volumen usa diseño diferenciado:
- Background: `bg-accent-electric/5` (tint cyan casi imperceptible)
- Borde: `border-accent-electric/10`
- Texto del descuento en `text-accent-electric font-semibold`
- Copy: **"Llévate 20+ unidades"** (no "Compra 20", el verbo "llevarse" reduce percepción de gasto)

#### D. Decoy Implícito

No se usa un tercer tier de precio (decoy explícito) porque saturiría la tarjeta. En su lugar, el propio precio unitario funciona como "decoy" que hace al precio por caja parecer la opción inteligente. Esto cumple la regla de *price-psychology-strategist*: "Decoys solo para clarificar valor, no para confundir".

### 3.4 Estados Interactivos de la Tarjeta

| Estado | Comportamiento Visual |
|--------|----------------------|
| Default | Background `glass-card`, borde hairline |
| Hover | Border `accent-electric/30`, sombra `0 0 20px rgba(0,229,255,0.05)`, `scale(1.01)` |
| Added to cart | Flash verde momentáneo (200ms), badge del carrito incrementa con bounce |
| Out of stock | Overlay semi-opaco, botón deshabilitado "Agotado — Consultar", cursor-not-allowed |
| Loading | Skeleton shimmer en imagen, título y precio |

---

## 4. FLUJO DEL WHATSAPP CHECKOUT

### 4.1 Arquitectura UX del Motor Transaccional

Aplicando *page-cro* (CRO Diagnostic Framework) al flujo de checkout:

**Conversion Goal:** Usuario completa el formulario y envía el mensaje pre-cargado a WhatsApp.

**Principales puntos de fricción identificados:**
1. Pedir referencia bancaria *antes* de confirmar el pedido genera desconfianza ("¿Por qué me piden un pago si no he visto el resumen?")
2. El formulario actual mezcla datos de envío con datos de pago sin separación visual
3. No hay resumen del pedido visible mientras se llena el formulario

### 4.2 Flujo Rediseñado (3 Pasos en Drawer)

El drawer del carrito se transforma en un flujo de **3 pasos secuenciales** dentro del mismo panel:

```
PASO 1: REVISIÓN DEL CARRITO
┌─────────────────────────────────────────┐
│  CARRITO DE COMPRAS              [X]    │
│─────────────────────────────────────────│
│                                         │
│  [Producto 1]  qty  precio              │
│  [Producto 2]  qty  precio              │
│  (descuento B2B aplicado indicado)      │
│                                         │
│─────────────────────────────────────────│
│  Subtotal USD:        $45.60            │
│  Total VES (BCV):     Bs. 1,835.40      │
│  Tasa aplicada:       Bs. 40.25/$       │
│                                         │
│  [   Continuar al Checkout   →   ]      │  ← CTA primario (cyan)
│  [   Seguir comprando            ]      │  ← CTA secundario (ghost)
└─────────────────────────────────────────┘

PASO 2: DATOS DE ENVÍO Y PAGO
┌─────────────────────────────────────────┐
│  DATOS DEL PEDIDO          [← Atrás]   │
│─────────────────────────────────────────│
│                                         │
│  --- IDENTIFICACIÓN ---                 │
│  [Nombre o Razón Social *]              │
│                                         │
│  --- ENTREGA ---                        │
│  (o) Retiro en Tienda — GRATIS          │  ← Radio visual con ícono
│  (o) Delivery Charallave — GRATIS       │
│  (o) Delivery Valles del Tuy — FLETE    │
│                                         │
│  --- FORMA DE PAGO ---                  │
│  (o) Pago Móvil                         │
│  (o) Zelle                              │
│  (o) Binance Pay                        │
│  (o) Efectivo por Taquilla              │
│                                         │
│  [Nro. Referencia Bancaria]             │  ← Solo si no es efectivo
│                                         │
│  ┌─ TRUST SIGNAL ──────────────────┐    │
│  │  "Su pedido será confirmado     │    │  ← Micro-copy de confianza
│  │   por un asesor en menos de     │    │
│  │   15 minutos vía WhatsApp"      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [  Revisar Resumen Final  →  ]         │  ← CTA (cyan)
└─────────────────────────────────────────┘

PASO 3: RESUMEN Y CONFIRMACIÓN
┌─────────────────────────────────────────┐
│  RESUMEN DEL PEDIDO        [← Atrás]   │
│─────────────────────────────────────────│
│                                         │
│  Cliente: Orlando C.A.                  │
│  Entrega: Retiro en Tienda (GRATIS)     │
│  Pago: Pago Móvil — Ref: ****4523      │
│                                         │
│  --- PRODUCTOS ---                      │
│  20x Panel LED 18W       $76.00         │
│     (Descuento B2B: $3.80 c/u)         │
│  5x Cable THHN 12AWG     $142.50        │
│     (Descuento B2B: $28.50 c/rollo)    │
│                                         │
│─────────────────────────────────────────│
│  Subtotal USD:        $218.50           │
│  Total VES (BCV):     Bs. 8,794.63      │
│  Tasa BCV del día:    Bs. 40.25/$       │
│                                         │
│  ┌─ GARANTÍA ──────────────────────┐    │
│  │  Suministros L&D 2023, C.A.     │    │
│  │  RIF: J-50367899-0              │    │
│  │  Charallave, Edo. Miranda       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [  Completar Pedido en WhatsApp  ]     │  ← CTA FINAL (verde WhatsApp)
│                                         │
│  Al confirmar, se abrirá WhatsApp con   │
│  el detalle de su pedido pre-cargado.   │
└─────────────────────────────────────────┘
```

### 4.3 Estrategias Anti-Fricción y Objection Handling

Aplicando *page-cro* (Phase 2: Friction & UX Barriers + Objection Handling):

| Objeción del Usuario | Solución UX | Ubicación |
|----------------------|-------------|-----------|
| *"¿Por qué piden mi referencia bancaria antes?"* | Microcopy: "Incluir la referencia agiliza la verificación. Su pago será confirmado por chat." | Debajo del campo de referencia (Paso 2) |
| *"¿Y si el precio cambia mientras lleno el formulario?"* | Widget de tasa BCV visible en el header durante todo el flujo. Texto: "Tasa fija al momento de confirmar" | Navbar sticky + Paso 3 |
| *"¿Es seguro comprar aquí?"* | Trust signals: RIF, dirección física, "Asesor confirma en <15 min" | Paso 2 (trust box) y Paso 3 (datos legales) |
| *"¿Puedo cambiar algo después?"* | Botón "Atrás" visible en cada paso. Copy: "Puede modificar cantidades antes de confirmar" | Navegación entre pasos |
| *"No quiero dar mi referencia si no estoy seguro"* | La referencia se pide DESPUÉS de ver el resumen del carrito, no antes | Flujo secuencial (Paso 2, no Paso 1) |

### 4.4 Jerarquía de CTAs

| Nivel | CTA | Estilo | Contexto |
|-------|-----|--------|----------|
| **Primario** | "Completar Pedido en WhatsApp" | `bg-green-500`, full-width, `font-bold`, ícono WhatsApp | Paso 3 — cierre final |
| **Secundario** | "Continuar al Checkout" / "Revisar Resumen" | `bg-accent-electric`, full-width | Paso 1→2 y 2→3 |
| **Terciario** | "Seguir comprando" / "Atrás" | Ghost button (borde sutil, sin fill) | Escape o navegación reversa |
| **Micro-CTA** | "+ Agregar" en tarjetas de producto | `bg-accent-electric`, compacto | Catálogo (fuera del drawer) |

> [!TIP]
> **Principio CRO aplicado:** Solo un CTA primario visible por pantalla. El botón verde de WhatsApp solo aparece en el Paso 3 cuando el usuario ya revisó todo. Esto cumple la regla de *page-cro*: "Define exactamente UN primary conversion goal por pantalla".

### 4.5 Formato del Mensaje WhatsApp (Optimizado)

```
*NUEVO PEDIDO — SUMINISTROS L&D*
---
*Cliente:* Orlando C.A.
*Despacho:* Retiro por Mostrador (Gratis)
*Método de Pago:* PAGO MOVIL
*Referencia de Pago:* 4523

---
*Detalle del Pedido:*

- *20x* Panel LED Empotrable Redondo 18W [LD-LED-PR18]
  $3.80 c/u (Tasa Mayorista B2B) = *$76.00*

- *5x* Cable THHN Calibre 12 AWG [LD-MAT-C12]
  $28.50 c/rollo (Tasa Mayorista B2B) = *$142.50*

---
*Total USD:* $218.50
*Total VES (BCV):* Bs. 8,794.63
*Tasa Aplicada (BCV):* Bs. 40.25/$
---
*Por favor confirme el cobro y coordine el despacho.*
```

> [!NOTE]
> Se eliminaron todos los emojis del mensaje WhatsApp. Se usan separadores de texto (`---`) y formato bold de WhatsApp (`*texto*`) para mantener legibilidad profesional sin iconografía infantilizada.

---

## 5. ARQUITECTURA TÉCNICA — NEXT.JS APP ROUTER

### 5.1 Estructura de Carpetas

Aplicando *nextjs-best-practices* (Server Components por defecto, route groups, separación de concerns):

```
src/
├── app/
│   ├── (storefront)/               # Route Group: tienda pública
│   │   ├── layout.tsx              # Layout general (navbar + footer)
│   │   ├── page.tsx                # Home / Landing (Server Component)
│   │   ├── loading.tsx             # Skeleton del home
│   │   ├── error.tsx               # Error boundary
│   │   └── producto/
│   │       └── [slug]/
│   │           ├── page.tsx        # Página individual de producto
│   │           └── loading.tsx
│   │
│   ├── (checkout)/                 # Route Group: flujo de checkout
│   │   └── layout.tsx              # Layout minimal (sin footer)
│   │
│   ├── api/
│   │   ├── bcv-rate/
│   │   │   └── route.ts            # API: obtener tasa BCV
│   │   ├── products/
│   │   │   └── route.ts            # API: CRUD productos (futuro admin)
│   │   └── webhook/
│   │       └── route.ts            # API: webhooks futuros (Cashea, pagos)
│   │
│   ├── layout.tsx                  # Root layout (fonts, metadata global)
│   ├── globals.css                 # Tokens de diseño + estilos base
│   ├── favicon.ico
│   └── not-found.tsx               # Página 404 custom
│
├── components/
│   ├── ui/                         # Componentes UI primitivos
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Skeleton.tsx
│   │   └── Modal.tsx
│   │
│   ├── layout/                     # Componentes de layout
│   │   ├── Navbar.tsx              # Client — interactividad (búsqueda, carrito)
│   │   ├── Footer.tsx              # Server — estático
│   │   ├── FinancialBanner.tsx     # Server — Cashea + BCV banner
│   │   └── CategoryNav.tsx         # Client — tabs de filtro
│   │
│   ├── product/                    # Componentes de producto
│   │   ├── ProductCard.tsx         # Client — add to cart interactivo
│   │   ├── ProductGrid.tsx         # Client — grid con filtros
│   │   ├── ProductSpecs.tsx        # Server — ficha técnica
│   │   ├── VolumePricingBadge.tsx  # Server — badge B2B
│   │   └── PriceDisplay.tsx        # Client — precios multi-moneda (BCV dinámico)
│   │
│   ├── cart/                       # Componentes del carrito
│   │   ├── CartDrawer.tsx          # Client — drawer lateral
│   │   ├── CartItem.tsx            # Client — línea de item
│   │   ├── CartSummary.tsx         # Client — totales + tasa
│   │   └── CheckoutFlow.tsx        # Client — wizard 3 pasos
│   │
│   └── shared/                     # Componentes compartidos
│       ├── SearchBar.tsx           # Client — búsqueda mixta
│       ├── BcvRateWidget.tsx       # Client — widget tasa en vivo
│       ├── WhatsAppButton.tsx      # Client — botón flotante WhatsApp
│       └── TrustSignals.tsx        # Server — pilares de confianza
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Cliente Supabase (browser)
│   │   ├── server.ts               # Cliente Supabase (server)
│   │   └── types.ts                # Tipos generados de la DB
│   │
│   ├── utils/
│   │   ├── format-currency.ts      # Formateo USD / VES
│   │   ├── calculate-pricing.ts    # Lógica de volume pricing
│   │   ├── build-whatsapp-message.ts  # Constructor del mensaje WA
│   │   └── cn.ts                   # Utility de class merge (clsx + twMerge)
│   │
│   └── hooks/
│       ├── use-cart.ts             # Hook Zustand del carrito
│       ├── use-bcv-rate.ts         # Hook para tasa BCV
│       └── use-media-query.ts      # Hook responsive
│
├── store/
│   └── cart-store.ts               # Zustand store (carrito persistido)
│
├── types/
│   ├── product.ts                  # Interfaz Product
│   ├── cart.ts                     # Interfaz CartItem, CartState
│   └── checkout.ts                 # Interfaz CheckoutForm
│
└── data/
    └── products.ts                 # Data estática (migra a Supabase en Fase II)
```

### 5.2 Decisiones Arquitectónicas Clave

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| **Rendering** | Server Components por defecto, Client solo para interactividad | *nextjs-best-practices*: "Server Components are the default for a reason" |
| **State Management** | Zustand (ya instalado) para carrito | Ligero, persiste en localStorage, no requiere Provider wrapper |
| **Data fetching** | Server Components + `fetch` con revalidación | Productos desde Supabase con ISR (revalidate: 3600) |
| **Tasa BCV** | API Route `/api/bcv-rate` + Client hook | Se consume desde un API externo, se cachea 1 hora |
| **Imágenes** | `next/image` con WebP + blur placeholder | Performance crítica para señal móvil deficiente |
| **Routing** | Route groups `(storefront)` y `(checkout)` | Layouts distintos para tienda (navbar+footer) vs checkout (minimal) |
| **Styling** | Tailwind CSS v4 (ya configurado) | Inline utilities + CSS custom para glassmorphism |

### 5.3 Los 5 Componentes Críticos de Fase I

Estos son los componentes que deben programarse **primero** porque desbloquean el MVP funcional:

---

#### Componente 1: `ProductCard.tsx`

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Client Component (`"use client"`) |
| **Props** | `product: Product`, `bcvRate: number`, `onAddToCart: (product) => void` |
| **Responsabilidad** | Renderizar la tarjeta completa con pricing multi-capa, badge B2B, specs, y botón de agregar |
| **Complejidad** | Alta — contiene lógica de precio por volumen, cálculo BCV, formato Cashea |
| **Dependencias** | `PriceDisplay`, `VolumePricingBadge`, `ProductSpecs`, `Badge`, `Button` |

---

#### Componente 2: `CartDrawer.tsx`

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Client Component (`"use client"`) |
| **Props** | `isOpen: boolean`, `onClose: () => void` |
| **Responsabilidad** | Drawer lateral con lista de items, totales, y flujo de checkout de 3 pasos |
| **Complejidad** | Muy alta — contiene wizard interno con estado multi-step, formulario, y generación del mensaje WhatsApp |
| **Dependencias** | `CartItem`, `CartSummary`, `CheckoutFlow`, Framer Motion, Zustand store |

---

#### Componente 3: `SearchBar.tsx`

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Client Component (`"use client"`) |
| **Props** | `onSearch: (query: string) => void`, `placeholder?: string` |
| **Responsabilidad** | Buscador mixto (nombre + SKU) con debounce, clear button, y estado vacío |
| **Complejidad** | Media — requiere debounce optimizado para no re-renderizar grid en cada keystroke |
| **Dependencias** | `useDeferredValue` o debounce custom, Lucide icons |

---

#### Componente 4: `BcvRateWidget.tsx`

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Client Component (`"use client"`) |
| **Props** | `rate: number`, `onRateChange: (rate: number) => void` |
| **Responsabilidad** | Widget compacto en navbar que muestra tasa BCV, permite edición manual, y fetcha actualización |
| **Complejidad** | Media — toggle entre modo lectura y edición, validación numérica |
| **Dependencias** | `use-bcv-rate` hook, Lucide icons |

---

#### Componente 5: `Navbar.tsx`

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Client Component (`"use client"`) — requiere interactividad |
| **Props** | Ninguna (consume stores directamente) |
| **Responsabilidad** | Header sticky con logo, búsqueda integrada, widget BCV, botón carrito con badge, glassmorphism en scroll |
| **Complejidad** | Alta — orquesta SearchBar, BcvRateWidget, botón carrito. Detecta scroll para cambiar estilo. |
| **Dependencias** | `SearchBar`, `BcvRateWidget`, Zustand cart store, Lucide icons |

---

## Decisiones Resueltas

> [!NOTE]
> **1. Fuente de la Tasa BCV — RESUELTO:** API pública PyDolarVenezuela consumida vía Route Handler `/api/bcv-rate`. Cacheada con ISR (revalidación 1-2 veces/día). Fallback a valor manual editable si la API falla.

> [!NOTE]
> **2. Imágenes de Productos — RESUELTO:** Enfoque híbrido 80/20. Productos de alta rotación (Hero + Categorías) con fotos reales o renders de fabricante. Resto del catálogo con componente `ProductImageFallback` (placeholder con logo L&D + categoría). Cero stock photos genéricos.

> [!NOTE]
> **3. Migración a Geist Sans — APROBADO:** Se reemplaza Inter por Geist Sans como body font. Space Grotesk se mantiene como display. Geist está optimizada para web por Vercel y transmite el toque premium buscado.

> [!NOTE]
> **4. Cashea — RESUELTO:** Cálculo aritmético local en frontend (`precioTotal / 4` para esquema 1 inicial + 3 cuotas). Sin SDK. La transacción real de Cashea se gestiona por el asesor vía WhatsApp. La web cumple función persuasiva únicamente.

> [!NOTE]
> **5. Emojis WhatsApp — RESUELTO:** Política dual. **Web = 0 emojis** (100% SVG + Lucide icons). **Mensaje WhatsApp = emojis estructurados** (📦💵📍⚡) como viñetas visuales para escaneo rápido en chat conversacional.

---

## Verification Plan

### Automated Tests
- `npm run build` — Verificar que el proyecto compila sin errores tras la reestructuración
- `npm run lint` — ESLint sin warnings
- Lighthouse audit (Target: Performance >90, Accessibility >95)

### Manual Verification
- Navegación completa del flujo Home → Producto → Carrito → Checkout → WhatsApp en dispositivo móvil real
- Verificar responsive en 3 breakpoints (mobile 375px, tablet 768px, desktop 1440px)
- Verificar contraste WCAG AA en todos los textos sobre fondos oscuros
- Test de velocidad en conexión 3G throttled (simular señal deficiente en obra)
