# Sprint 5: Motor Cambiario de Estado Global y Carrito
**Objetivo:** Sistema de gestión dual divisa.

**Dependencias previas:** 04-Task-Catalogo-Buscador, Gestor de Zustand del Sprint 01.

**Acciones:**
1. Crea un Hook/Función de "Monitor Inteligente Cambiario" en tu sistema. Debe consumir de alguna manera la API de tasa oficial del BCV (o prever un variable estática local temporal de configuración).
2. Construye el componente "Carrito", agregando el total siempre recalculado tanto en Divisas ($) como su equivalencia precisa en BCV (Bs). 
3. Agrupa logicamente la multi-compra o suma por volúmenes con las reglas del carrito.

**Criterios de Éxito:** Al dar click en 'Agregar', la burbuja del carrito y su contenido reaccionan rápido actualizando importes dobles impecablemente en tiempo real (evitando recargas en pantalla).
