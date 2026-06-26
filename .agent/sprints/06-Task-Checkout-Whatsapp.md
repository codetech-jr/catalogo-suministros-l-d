# Sprint 6: Módulo Checkout WhatsApp (Ingeniería de Cierres)
**Objetivo:** Terminar la app capturando toda la data bancaria y fletes en pantalla sin pasar a la pasarela final en BD.

**Dependencias previas:** Sprint 5 - El subtotal/carrito cerrado listo para pago.

**Acciones (Componente Transaccional):**
1. Crea el "Formulario de Opciones de Pago" para los casos no-Zelle y Cripto. (Pago Movil, Binance, Retiro Mostrador).
2. Añade un "Logística Inteligente" de Radio button (Selector regional Valles del Tuy):
   - Charallave -> Etiqueta "Gratis" 
   - Resto del Tuy (Cúa, Santa Teresa) -> Carga una Variable calculando flete a pagar extra.
3. **El Cierre Whatsapp B2B:** Captura campos requeridos y serialízalo en un formato tipo "RECIBO DIGITAL". Codifica el estado del carrito de ese 'form', incluyendo los SKUS e ítems agregados y los importes exactos, hacia la URL estructurada api.whatsapp `wa.me/+XXXXX?text=Mi%20Pedido%20es...`
4. Al hacer click final genera el salto a WHATSAPP completando este "Motor Mixto".

**Criterios de Éxito:** Embudaje B2C y B2B completo terminado sin utilizar bases transaccionales complejas más que armar string limpio del whatsapp tras recolectar datos bancarios necesarios y referenciarlos.
