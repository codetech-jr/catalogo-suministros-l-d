# Sprint: Refinamiento UI E-Commerce + WhatsApp Checkout (Fase 1)

**Objetivo:** Elevar visualmente la plataforma guiados ESTRICTAMENTE por el "SuministrosL&D-Fase-I.pdf".
**Restricciones de Negocio (¡CRÍTICO!):**

1. Cero sistemas de Login o creación de usuarios (la venta es directa, guiada a WhatsApp).
2. Mantener la paleta de colores actual e identidad visual intacta (Solo puliremos espaciados, bordes y layout, nada de cambiar los fondos actuales si ya representan la marca).
   **Habilidades Activas:** design-taste-frontend, form-cro.

## Tareas a completar:

### [ ] Task 1: Navegación, Header y Portada (Inicio)

- **Archivo sugerido:** `layout.tsx` / `page.tsx` (Inicio) / `Header.tsx`
- **Acciones:**
  - El NavBar debe tener SOLO el Logo, un potente Motor de Búsqueda (que incite a buscar "nombre de pieza" o "SKU"), el Selector de Moneda y el acceso al Carrito (NADA de inicio de sesión).
  - Incluir el _Hook_ principal en el texto del Home: "Tu aliado en iluminación y materiales eléctricos de todo los Valles del Tuy".
  - Crear/resaltar banners "Aceleradores Financieros": Destacar que se acepta "Cashea" y un letrero vivo de la "Tasa BCV del día".
  - Construir 3 botones gráficos principales en la portada (como dicta el alcance): (1) Luminaria LED, (2) Control Eléctrico, (3) Sistema de Cableado y Material pesado.

### [ ] Task 2: Volume Pricing B2B (Tarjetas de Productos)

- **Archivo sugerido:** Componente `ProductCard.tsx` / Catálogo.
- **Acciones:**
  - Refinar la tarjeta sin cambiar la paleta: limpiar el borde grueso, reemplazar el ícono brillante temporal por un placeholder visual corporativo o logo con opacidad si no hay imagen.
  - Implementar _Exhibición Estratégica (Volume Pricing)_. Mostrar explícitamente en el diseño elementos o badges con textos estilo: "[Llévate x caja entera a descuento / Consulta descuento a mayorista]".
  - Botón prominente de Agregar al carrito para escalar cantidades fluidamente.

### [ ] Task 3: El WhatsApp Checkout Híbrido (Módulo Transaccional)

- **Archivo sugerido:** Vista lateral o Modal del `Carrito / Checkout`.
- **Acciones:**
  - Separar este menú mediante CRO para que no se vea desorganizado. Debe verse corporativo y confiable con pasos lógicos y fluidos para cerrar todo ANTES de ir al WhatsApp.
  - Diseñar la _Logística Expandida_ (selectores claros obligatorios en formato de tarjetas clicables): "Retiro Charallave - GRATIS", "Delivery Centro Charallave - GRATIS" y "Flete Valles del Tuy - Flete Adicional".
  - Limpiar la lista de pagos de opciones convencionales (Pago Móvil, Zelle, Binance, Retiro, Mixto).
  - Validar y mantener de forma impecable el formulario de captura inteligente de número de referencia (inputs claros).
  - Módulo final resaltando "Monitor Inteligente Cambiario": Totales transparentes mostrando cuánto paga exacto en Divisas y cuánto es la Base legal en VES, sumado al botón final directo "Liquidar en WhatsApp".
