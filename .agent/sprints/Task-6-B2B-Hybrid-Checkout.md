# Task 6: Módulo Checkout Hibrido & Generador de Cotizaciones B2B

**Objetivos y Lógica Basada en CRO:**

1. **Reducir Fricción en Step 3 (Métodos de pago):** Incluir un "Switch/Checkbox" elegante estilo UI Apple que diga "Generar solo Cotización para el Ejecutivo de Cuenta (Pagaré por caja)". Si está activo, el `required` de las Referencias Bancarias DESAPARECE, el panel de comprobante se desvanece (opacity-50) y el CTA principal pasa a decir "Transferir Presupuesto a WhatsApp ↗".
2. **Implementar "SmartBcvQuoteExporter":** Agregar un botón visual secundario estilo Outline (Transparente con borde oscuro) al lado del total, que al clicar lance una ventana pre-configurada para Imprimir (`window.print()`). Debes inyectar clases específicas de Tailwind para impresión (`print:block, print:hidden`) a un componente anexo o rediseñar la vista para generar un presupuesto PDF A4 ultra corporativo solo al dar Print.
3. **Sello Trust Guard:** Añadir un minitexto o Sello visual verde junto a los datos Banesco/Zelle: "🔒 Garantía L&D: Su orden está cubierta. Despachamos al verificar su referencia o reintegramos de inmediato".
   **Componentes implicados:** OrderCheckout.tsx/jsx, Cesta Lateral, Estilos Globales de Impresión.
