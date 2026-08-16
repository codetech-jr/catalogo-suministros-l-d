const url = 'https://kamjsoixfywsdgdqmwno.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWpzb2l4Znl3c2RnZHFtd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE5MzQ0OCwiZXhwIjoyMDk3NzY5NDQ4fQ.hQ6pFWcJll6t_vDsWT53vVxfU6gBr-7-2oms0OmpXt0';

const headers = {
  'apikey': serviceKey,
  'Authorization': `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

const CATEGORY_MAP = {
  led: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',       // Luminaria LED
  pesado: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',    // Material Pesado
  control: '07838181-24d9-4b1f-8d8b-83082f3c49e5'    // Control Eléctrico
};

// Base cost $2 and stock 200 for all items as requested by user
const BASE_PRICE = 2.00;
const BASE_STOCK = 200;

const products = [
  // --------------------------------------------------------------------------
  // 1. Breacker Pickens Empotrar
  // --------------------------------------------------------------------------
  ...[
    { sku: 'BRK-PCK-EMP-1X15', poles: '1 Pole', amp: '15A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-1X20', poles: '1 Pole', amp: '20A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-1X30', poles: '1 Pole', amp: '30A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-1X40', poles: '1 Pole', amp: '40A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-1X50', poles: '1 Pole', amp: '50A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-1X60', poles: '1 Pole', amp: '60A', volt: '120V' },
    { sku: 'BRK-PCK-EMP-2X20', poles: '2 Polos', amp: '20A', volt: '120/240V' },
    { sku: 'BRK-PCK-EMP-2X30', poles: '2 Polos', amp: '30A', volt: '120/240V' },
    { sku: 'BRK-PCK-EMP-2X40', poles: '2 Polos', amp: '40A', volt: '120/240V' },
    { sku: 'BRK-PCK-EMP-2X50', poles: '2 Polos', amp: '50A', volt: '120/240V' },
    { sku: 'BRK-PCK-EMP-2X60', poles: '2 Polos', amp: '60A', volt: '120/240V' },
    { sku: 'BRK-PCK-EMP-3X20', poles: '3 Polos', amp: '20A', volt: '240V' },
    { sku: 'BRK-PCK-EMP-3X40', poles: '3 Polos', amp: '40A', volt: '240V' },
    { sku: 'BRK-PCK-EMP-3X50', poles: '3 Polos', amp: '50A', volt: '240V' },
  ].map(item => ({
    sku: item.sku,
    name: `Breaker Pickens Empotrar ${item.poles} ${item.amp}`,
    description: `Interruptor termomagnético enchufable de empotrar de ${item.amp} marca Pickens. Diseñado para tableros eléctricos residenciales y comerciales con máxima protección contra sobrecargas y cortocircuitos.`,
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Pickens" },
      { label: "Tipo de Montaje", value: "Empotrar / Enchufable" },
      { label: "Número de Polos", value: item.poles },
      { label: "Corriente Nominal", value: item.amp },
      { label: "Voltaje Nominal", value: item.volt },
      { label: "Capacidad de Interrupción", value: "10 kA" },
      { label: "Curva de Disparo", value: "C (Termomagnética)" }
    ]
  })),

  // --------------------------------------------------------------------------
  // 2. Breacker Bticino Superficial
  // --------------------------------------------------------------------------
  ...[
    { sku: 'BRK-BTC-SUP-1X20', poles: '1 Polo', amp: '20A', volt: '120V' },
    { sku: 'BRK-BTC-SUP-1X30', poles: '1 Polo', amp: '30A', volt: '120V' },
    { sku: 'BRK-BTC-SUP-1X40', poles: '1 Polo', amp: '40A', volt: '120V' },
    { sku: 'BRK-BTC-SUP-1X50', poles: '1 Polo', amp: '50A', volt: '120V' },
    { sku: 'BRK-BTC-SUP-1X60', poles: '1 Polo', amp: '60A', volt: '120V' },
    { sku: 'BRK-BTC-SUP-2X20', poles: '2 Polos', amp: '20A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X30', poles: '2 Polos', amp: '30A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X40', poles: '2 Polos', amp: '40A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X50', poles: '2 Polos', amp: '50A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X60', poles: '2 Polos', amp: '60A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X70', poles: '2 Polos', amp: '70A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-2X90', poles: '2 Polos', amp: '90A', volt: '120/240V' },
    { sku: 'BRK-BTC-SUP-3X50', poles: '3 Polos', amp: '50A', volt: '240V' },
    { sku: 'BRK-BTC-SUP-3X60', poles: '3 Polos', amp: '60A', volt: '240V' },
    { sku: 'BRK-BTC-SUP-3X90', poles: '3 Polos', amp: '90A', volt: '240V' },
    { sku: 'BRK-BTC-SUP-3X100', poles: '3 Polos', amp: '100A', volt: '240V' },
  ].map(item => ({
    sku: item.sku,
    name: `Breaker Bticino Superficial ${item.poles} ${item.amp}`,
    description: `Breaker de superficie atornillable Bticino de ${item.amp}. Construcción robusta de alta fiabilidad industrial y residencial con protección contra fallas eléctricas.`,
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Bticino" },
      { label: "Tipo de Montaje", value: "Superficial / Atornillable" },
      { label: "Número de Polos", value: item.poles },
      { label: "Corriente Nominal", value: item.amp },
      { label: "Voltaje Nominal", value: item.volt },
      { label: "Capacidad de Interrupción", value: "10 kA" },
      { label: "Uso", value: "Residencial / Industrial" }
    ]
  })),

  // --------------------------------------------------------------------------
  // 3. Mini Breacker Europeo Classic Lux (Riel DIN)
  // --------------------------------------------------------------------------
  ...[
    { sku: 'BRK-CLX-DIN-1X6', poles: '1 Polo', amp: '6A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X10', poles: '1 Polo', amp: '10A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X16', poles: '1 Polo', amp: '16A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X25', poles: '1 Polo', amp: '25A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X32', poles: '1 Polo', amp: '32A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X40', poles: '1 Polo', amp: '40A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X50', poles: '1 Polo', amp: '50A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-1X63', poles: '1 Polo', amp: '63A', volt: '230V' },
    { sku: 'BRK-CLX-DIN-2X25', poles: '2 Polos', amp: '25A', volt: '230/400V' },
    { sku: 'BRK-CLX-DIN-2X32', poles: '2 Polos', amp: '32A', volt: '230/400V' },
    { sku: 'BRK-CLX-DIN-2X40', poles: '2 Polos', amp: '40A', volt: '230/400V' },
    { sku: 'BRK-CLX-DIN-2X50', poles: '2 Polos', amp: '50A', volt: '230/400V' },
    { sku: 'BRK-CLX-DIN-3X20', poles: '3 Polos', amp: '20A', volt: '400V' },
    { sku: 'BRK-CLX-DIN-3X25', poles: '3 Polos', amp: '25A', volt: '400V' },
    { sku: 'BRK-CLX-DIN-3X32', poles: '3 Polos', amp: '32A', volt: '400V' },
    { sku: 'BRK-CLX-DIN-3X40', poles: '3 Polos', amp: '40A', volt: '400V' },
    { sku: 'BRK-CLX-DIN-3X50', poles: '3 Polos', amp: '50A', volt: '400V' },
    { sku: 'BRK-CLX-DIN-3X63', poles: '3 Polos', amp: '63A', volt: '400V' },
  ].map(item => ({
    sku: item.sku,
    name: `Mini Breaker Europeo Classic Lux DIN ${item.poles} ${item.amp}`,
    description: `Miniaturizado breaker tipo Europeo para montaje sobre Riel DIN de 35mm marca Classic Lux. Alta sensibilidad de respuesta térmica y magnética según normativa IEC 60898.`,
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Classic Lux" },
      { label: "Tipo de Montaje", value: "Riel DIN (35mm)" },
      { label: "Estándar", value: "IEC 60898 Europeo" },
      { label: "Número de Polos", value: item.poles },
      { label: "Corriente Nominal", value: item.amp },
      { label: "Voltaje Nominal", value: item.volt },
      { label: "Capacidad de Ruptura", value: "6 kA" }
    ]
  })),

  // --------------------------------------------------------------------------
  // 4. Contactores Magnéticos
  // --------------------------------------------------------------------------
  ...[
    { sku: 'CNT-AC3-9A', amp: '9A', kw: '4 kW' },
    { sku: 'CNT-AC3-12A', amp: '12A', kw: '5.5 kW' },
    { sku: 'CNT-AC3-25A', amp: '25A', kw: '11 kW' },
    { sku: 'CNT-AC3-32A', amp: '32A', kw: '15 kW' },
    { sku: 'CNT-AC3-40A', amp: '40A', kw: '18.5 kW' },
    { sku: 'CNT-AC3-50A', amp: '50A', kw: '22 kW' },
    { sku: 'CNT-AC3-80A', amp: '80A', kw: '37 kW' },
    { sku: 'CNT-AC3-95A', amp: '95A', kw: '45 kW' },
  ].map(item => ({
    sku: item.sku,
    name: `Contactor Magnético Tripolar ${item.amp} AC-3 (Bobina 110V/220V)`,
    description: `Contactor electromagnético tripolar de ${item.amp} para maniobra y arranque de motores trifásicos, circuitos de fuerza e iluminación de potencia.`,
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Categoría de Empleo", value: "AC-3 / AC-1" },
      { label: "Corriente Nominal", value: item.amp },
      { label: "Potencia del Motor", value: item.kw },
      { label: "Contactos Auxiliares", value: "1NO + 1NC" },
      { label: "Voltaje de Bobina", value: "110V / 220V AC" },
      { label: "Montaje", value: "Riel DIN / Atornillable" }
    ]
  })),

  // --------------------------------------------------------------------------
  // 5. Guardamotores Regulables
  // --------------------------------------------------------------------------
  ...[
    { sku: 'GDM-4-6.3A', range: '4 - 6.3A' },
    { sku: 'GDM-9-14A', range: '9 - 14A' },
    { sku: 'GDM-13-18A', range: '13 - 18A' },
    { sku: 'GDM-17-23A', range: '17 - 23A' },
    { sku: 'GDM-20-25A', range: '20 - 25A' },
    { sku: 'GDM-24-32A', range: '24 - 32A' },
  ].map(item => ({
    sku: item.sku,
    name: `Guardamotor Magnetotérmico Regulable ${item.range}`,
    description: `Interruptor de protección de motor con disparador térmico ajustable (${item.range}) y disparador magnético instantáneo. Previene fallas por sobrecarga o falta de fase.`,
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Tipo", value: "Guardamotor de Protección de Motor" },
      { label: "Rango de Ajuste Térmico", value: item.range },
      { label: "Capacidad de Ruptura (Icu)", value: "100 kA" },
      { label: "Protección", value: "Sobrecarga, Cortocircuito y Falta de Fase" },
      { label: "Montaje", value: "Riel DIN 35mm" }
    ]
  })),

  // --------------------------------------------------------------------------
  // 6. Productos Individuales Específicos
  // --------------------------------------------------------------------------
  {
    sku: 'ADH-COVO-CC',
    name: 'Silicón Cero Clavo Covo 300ml',
    description: 'Adhesivo de montaje multiusos de alta adherencia inicial Covo. Reemplaza clavos y tornillos en madera, drywall, concreto, azulejos y metales.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Covo" },
      { label: "Contenido", value: "300 ml" },
      { label: "Tipo", value: "Adhesivo Cero Clavo" },
      { label: "Uso", value: "Interior y Exterior" },
      { label: "Secado Inicial", value: "10 a 15 minutos" }
    ]
  },
  {
    sku: 'ADH-SIL-PUR',
    name: 'Silicón Poliuretano Sellador 300ml',
    description: 'Sellador elastomérico de poliuretano de gran resistencia estructural. Ideal para juntas de dilatación, techos, láminas metálicas y grietas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Tipo", value: "Poliuretano Elastomérico" },
      { label: "Contenido", value: "300 ml" },
      { label: "Resistencia UV", value: "Excelente (No amarillea)" },
      { label: "Aplicación", value: "Concreto, Vidrio, Metal, Madera" }
    ]
  },
  {
    sku: 'PLF-TROEN-PLAST',
    name: 'Plafón de Plástico Troen Rosca E27',
    description: 'Plafón para techo o pared incombustible de plástico Troen con contacto de bronce y socate E27 reforzado.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Troen" },
      { label: "Material", value: "Plástico Termoplástico Rígido" },
      { label: "Rosca", value: "E27 Estándar" },
      { label: "Voltaje Máximo", value: "250V AC" }
    ]
  },
  {
    sku: 'PLF-TRIC-PLAST',
    name: 'Plafón de Plástico Tric Rosca E27',
    description: 'Plafón circular blanco de polipropileno ligero marca Tric. Económico y duradero para instalaciones residenciales.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Tric" },
      { label: "Material", value: "Polipropileno Incombustible" },
      { label: "Rosca", value: "E27 Estándar" },
      { label: "Color", value: "Blanco" }
    ]
  },
  {
    sku: 'ODB-RND-EBELI',
    name: 'Ojo de Buey LED Redondo Ebeli 7W',
    description: 'Lámpara empotrable ojo de buey redonda de 7W Ebeli. Marco ultradelgado de aluminio y pantalla anti-deslumbrante para cielo raso o drywall.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ebeli" },
      { label: "Forma", value: "Redonda" },
      { label: "Potencia", value: "7W" },
      { label: "Voltaje", value: "85-265V Multivoltaje" },
      { label: "Color de Luz", value: "Blanco Frío (6500K)" }
    ]
  },
  {
    sku: 'ODB-SQR-EBELI',
    name: 'Ojo de Buey LED Cuadrado Ebeli 7W',
    description: 'Panel empotrable cuadrado LED de 7W Ebeli. Acabado moderno para oficinas y áreas residenciales con disipación térmica integrada.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ebeli" },
      { label: "Forma", value: "Cuadrada" },
      { label: "Potencia", value: "7W" },
      { label: "Voltaje", value: "85-265V AC" },
      { label: "Color de Luz", value: "Blanco Frío (6500K)" }
    ]
  },
  {
    sku: 'BMB-REC-20W-EBELI',
    name: 'Bombillo Recargable LED 20W Ebeli E27',
    description: 'Bombillo LED inteligente recargable de 20W con batería interna de litio. Permite iluminación ininterrumpida de 3 a 5 horas durante fallas eléctricas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ebeli" },
      { label: "Potencia", value: "20W" },
      { label: "Rosca", value: "E27" },
      { label: "Autonomía Batería", value: "3 a 5 Horas" },
      { label: "Tipo Batería", value: "Litio Recargable Integrada" }
    ]
  },
  {
    sku: 'BMB-REC-60W-VERT',
    name: 'Bombillo Recargable LED 60W Vert High Power',
    description: 'Bombillo portátil recargable de alta potencia Vert 60W. Incluye gancho para colgar y puerto de carga con batería de alta capacidad.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Potencia", value: "60W High Power" },
      { label: "Autonomía Batería", value: "4 a 6 Horas" },
      { label: "Modos de Luz", value: "Alta, Media y Estroboscópica" }
    ]
  },
  {
    sku: 'BMB-REC-13W-VERT',
    name: 'Bombillo Recargable LED 13W Vert E27',
    description: 'Bombillo LED recargable compacto Vert 13W de emergencia. Se enciende automáticamente al interrumpirse la corriente en el hogar.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Potencia", value: "13W" },
      { label: "Rosca", value: "E27" },
      { label: "Autonomía Batería", value: "3 a 4 Horas" }
    ]
  },
  {
    sku: 'APL-PAR-DEC',
    name: 'Aplique para Pared Decorativo Moderno',
    description: 'Luminaria decorativa aplique para pared interior y exterior IP65. Diseño arquitectónico apto para fachadas, pasillos y jardines.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Uso", value: "Interior / Exterior IP65" },
      { label: "Voltaje", value: "110V - 220V Multivoltaje" },
      { label: "Material", value: "Aluminio fundido anti-corrosión" },
      { label: "Nota", value: "Consultar modelo específico disponible" }
    ]
  },
  {
    sku: 'ESM-750W-INGCO',
    name: 'Esmeril Angular 750W INGCO 4-1/2"',
    description: 'Amoladora / esmeril angular de mano INGCO 750W. Diseño compacto con empuñadura ergonómica y sistema de ventilación optimizado.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "INGCO" },
      { label: "Potencia", value: "750W" },
      { label: "Diámetro Disco", value: "4-1/2\" (115 mm)" },
      { label: "Velocidad Sin Carga", value: "11.000 RPM" },
      { label: "Voltaje", value: "110V-120V ~ 50/60Hz" }
    ]
  },
  {
    sku: 'PEG-MIX-PEGATANQUE',
    name: 'Pega Mix Pegatanque Soldadura Epóxica 44g',
    description: 'Adhesivo epóxico de dos componentes Pega Mix de gran resistencia química y mecánica. Cura incluso bajo el agua.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Pegatanque" },
      { label: "Presentación", value: "Pega Mix Epóxico 44g" },
      { label: "Resistencia Térmica", value: "Hasta 300°C" },
      { label: "Soporte de Presión", value: "500 PSI" }
    ]
  },
  {
    sku: 'SNS-ESP-TOUCH',
    name: 'Sensor Touch de Espejo para Cintas LED 12V',
    description: 'Interruptor táctil capacitivo oculto para instalación detrás de vidrios o espejos. Controla encendido, apagado y atenuación de cintas LED.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Tipo", value: "Sensor Touch Capacitivo de Espejo" },
      { label: "Voltaje Operación", value: "12V DC" },
      { label: "Funciones", value: "On/Off + Dimmer Ajustable" },
      { label: "Grosor Máximo Vidrio", value: "1 a 5 mm" }
    ]
  },
  {
    sku: 'SNS-TOUCH-12V',
    name: 'Sensor Touch Táctil Módulo 12V DC',
    description: 'Módulo sensor de contacto directo para perfiles de aluminio y muebles de madera con luz indicadora LED integrada.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Voltaje", value: "12V - 24V DC" },
      { label: "Corriente Máxima", value: "5 Amperios" },
      { label: "Instalación", value: "Perfilería / Moblaje" }
    ]
  },
  {
    sku: 'PST-SIL-INGCO',
    name: 'Pistola para Silicón de Cartucho INGCO 9"',
    description: 'Pistola calafateadora profesional reforzada de 9 pulgadas INGCO. Gatillo de alta resistencia para cartuchos de silicona y masillas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "INGCO" },
      { label: "Tamaño", value: "9\" (235 mm)" },
      { label: "Estructura", value: "Acero de alta resistencia" },
      { label: "Compatibilidad", value: "Cartuchos de 300 ml" }
    ]
  },
  {
    sku: 'PST-SIL-WADFOW',
    name: 'Pistola para Silicón de Cartucho Wadfow 9"',
    description: 'Pistola de aplicar silicona en cartucho marca Wadfow de 9 pulgadas. Diseño ligero y ergonómico.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Wadfow" },
      { label: "Tamaño", value: "9\"" },
      { label: "Material", value: "Acero troquelado" }
    ]
  },
  {
    sku: 'LAMP-2CLR-6W',
    name: 'Lámpara LED Doble Color 6W (Fría + Borde Azul)',
    description: 'Panel de embutir LED dual color 6W. Permite encender el centro en luz fría, el borde en color azul o ambos en simultáneo.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Potencia", value: "6W" },
      { label: "Efecto", value: "Doble Color (6500K Frío + Azul)" },
      { label: "Voltaje", value: "85-265V Multivoltaje" },
      { label: "Montaje", value: "Empotrado" }
    ]
  },
  {
    sku: 'TEIPE-COBRA-18M-BLK',
    name: 'Teipe Cobra Negro 18 Mtrs (Presentaciones: Blanco, Amarillo, Rojo, Azul, Negro)',
    description: 'Cinta aislante eléctrica de PVC Cobra de 18 metros. Retardante de llama y resistente a la abrasión y voltaje de 600V. Consultar presentaciones en Blanco, Amarillo, Rojo, Azul y Negro.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Cobra" },
      { label: "Longitud", value: "18 Metros" },
      { label: "Aislamiento", value: "Hasta 600V" },
      { label: "Colores Disponibles", value: "Negro, Blanco, Amarillo, Rojo, Azul" }
    ]
  },
  {
    sku: 'TEIPE-COBRA-10M-BLK',
    name: 'Teipe Cobra Negro 10 Mtrs',
    description: 'Cinta aislante eléctrica económica de PVC marca Cobra de 10 metros para empalmes y trabajos eléctricos rápidos.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Cobra" },
      { label: "Longitud", value: "10 Metros" },
      { label: "Color", value: "Negro" }
    ]
  },
  {
    sku: 'TEIPE-GOMA-COBRA',
    name: 'Teipe Goma Autosulfcanizable Cobra',
    description: 'Cinta aislante de goma autofundente Cobra para sellado hermético e impermeable de empalmes en intemperie.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Cobra" },
      { label: "Tipo", value: "Goma Autosulfcanizable / Autofundente" },
      { label: "Propiedad", value: "Sellado 100% Impermeable al Agua" }
    ]
  },
  {
    sku: 'TEIPE-GOMA-3M',
    name: 'Teipe Goma Autofundente 3M Scotch 23',
    description: 'Cinta aislante de goma autofundente premium 3M Scotch 23. Auto-amalgamable de alta disipación térmica.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "3M" },
      { label: "Modelo", value: "Scotch 23" },
      { label: "Nivel de Voltaje", value: "Alta Tensión (Hasta 69 kV)" }
    ]
  },
  {
    sku: 'TEIPE-3M-SCOTCH-33T',
    name: 'Teipe 3M Scotch Super 33+ Profesional',
    description: 'La cinta aislante vinílica 3M Scotch Super 33+ de uso pesado e industrial. Insuperable flexibilidad y adhesión de -18°C a 105°C.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "3M" },
      { label: "Modelo", value: "Scotch Super 33+" },
      { label: "Certificación", value: "UL / CSA Premium" }
    ]
  },
  {
    sku: 'TIRRO-PAPEL-LUMISTAR',
    name: 'Tirro de Papel Lumistar Masking Tape 3/4"',
    description: 'Cinta de papel adhesivo masking tape Lumistar. Desprendimiento limpio sin dejar residuos en pintura o paredes.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Lumistar" },
      { label: "Ancho", value: "3/4\" (18 mm)" },
      { label: "Tipo", value: "Papel Masking Tape" }
    ]
  },
  {
    sku: 'LAMP-LIN-120-ILUM',
    name: 'Lámpara LED Lineal 120cm Ilumiven 40W',
    description: 'Regleta lineal sobreponer LED de 120cm Ilumiven. Estructura de polímero extruido de alto rendimiento para tiendas y oficinas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ilumiven" },
      { label: "Longitud", value: "120 cm" },
      { label: "Potencia", value: "40W" },
      { label: "Voltaje", value: "85-265V AC" }
    ]
  },
  {
    sku: 'LAMP-LIN-60-ILUM',
    name: 'Lámpara LED Lineal 60cm Ilumiven 20W',
    description: 'Listón LED lineal compacto de 60cm Ilumiven de 20W para cocinas y áreas pequeñas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ilumiven" },
      { label: "Longitud", value: "60 cm" },
      { label: "Potencia", value: "20W" }
    ]
  },
  {
    sku: 'LAMP-LIN-30-ILUM',
    name: 'Lámpara LED Lineal 30cm Ilumiven 10W',
    description: 'Regleta LED mini lineal de 30cm Ilumiven 10W ideal para gabinetes y vitrinas.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ilumiven" },
      { label: "Longitud", value: "30 cm" },
      { label: "Potencia", value: "10W" }
    ]
  },
  {
    sku: 'LAMP-LIN-120-VERT-100W',
    name: 'Lámpara LED Lineal Industrial 120cm Vert 100W',
    description: 'Lámpara lineal súper potente Vert de 100W para galpones, talleres y bodegas industriales.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Longitud", value: "120 cm" },
      { label: "Potencia", value: "100W High Power" },
      { label: "Voltaje", value: "85-265V Multivoltaje" }
    ]
  },
  {
    sku: 'LAMP-LIN-120-VERT-60W',
    name: 'Lámpara LED Lineal 120cm Vert 60W',
    description: 'Listón lineal reforzado Vert 60W de 120cm para alta exigencia lumínica en depósitos.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Longitud", value: "120 cm" },
      { label: "Potencia", value: "60W" }
    ]
  },
  {
    sku: 'ENC-EXT-VERT',
    name: 'Enchufe para Extensión Vert 15A 125V',
    description: 'Clavija aérea reforzada de caucho para armado de extensión eléctrica marca Vert.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Capacidad", value: "15A 125V" },
      { label: "Tipo", value: "Macho con Toma a Tierra" }
    ]
  },
  {
    sku: 'SEL-2POS-CLX',
    name: 'Selector 2 Posiciones Classic Lux 22mm',
    description: 'Conmutador rotativo de mando industrial 2 posiciones (On-Off) para armarios eléctricos.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Classic Lux" },
      { label: "Posiciones", value: "2 (Off-On)" },
      { label: "Diámetro Perforación", value: "22 mm" }
    ]
  },
  {
    sku: 'SEL-3POS-CLX',
    name: 'Selector 3 Posiciones Classic Lux 22mm',
    description: 'Selector industrial de 3 posiciones (Man-Off-Auto) para automatización de bombas y motores.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Classic Lux" },
      { label: "Posiciones", value: "3 (Manual - Off - Auto)" },
      { label: "Diámetro Perforación", value: "22 mm" }
    ]
  },
  {
    sku: 'BMB-G9-VERT',
    name: 'Bombillo LED Bi-Pin G9 Vert 5W',
    description: 'Bombillo miniatura cápsula zócalo G9 Vert de 5W. Alta eficiencia y nula emisión de calor.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Base / Socate", value: "G9 Bi-Pin" },
      { label: "Potencia", value: "5W" },
      { label: "Voltaje", value: "110V AC" }
    ]
  },
  {
    sku: 'BMB-G4-VERT',
    name: 'Bombillo LED Bi-Pin G4 Vert 3W 12V',
    description: 'Cápsula bi-pin G4 de 3W para lámparas de acento o decorativas de 12V.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Base / Socate", value: "G4" },
      { label: "Potencia", value: "3W" },
      { label: "Voltaje", value: "12V AC/DC" }
    ]
  },
  {
    sku: 'TST-DIG-METCO',
    name: 'Tester / Multímetro Digital Metco',
    description: 'Multímetro digital portátil profesional Metco. Mide voltaje AC/DC, amperaje, resistencia y continuidad con zumbador auditivo.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Metco" },
      { label: "Tipo", value: "Multímetro Digital LCD" },
      { label: "Funciones", value: "V AC/DC, A DC, Resistencia, Continuidad Buzzer" }
    ]
  },
  {
    sku: 'VLT-DIG-22MM',
    name: 'Voltímetro Digital de Panel LED 22mm',
    description: 'Indicador digital de voltaje para tablero eléctrico de 22mm. Rango de lectura de 60V a 500V AC.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Lectura", value: "Voltaje 60V a 500V AC" },
      { label: "Diámetro de Panel", value: "22 mm" },
      { label: "Pantalla", value: "Digital LED 3 Dígitos" }
    ]
  },
  {
    sku: 'VAM-DIG-22MM',
    name: 'Voltiamperímetro Digital de Panel LED 22mm + Dona CT',
    description: 'Indicador digital dual de Voltaje (60-500V) y Corriente (0-100A). Incluye transformador de corriente dona de medición.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Medición Dual", value: "60-500V AC / 0-100A AC" },
      { label: "Accesorios Incluidos", value: "Transformador de Corriente (CT)" },
      { label: "Diámetro", value: "22 mm" }
    ]
  },
  {
    sku: 'PRT-INT-63A-CLX',
    name: 'Protector Inteligente Digital Classic Lux 63A',
    description: 'Relé de protección inteligente digital contra alto/bajo voltaje y sobrecorriente marca Classic Lux para riel DIN.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Classic Lux" },
      { label: "Amperaje Máximo", value: "63A" },
      { label: "Protección", value: "Sobrevoltaje, Bajovoltaje y Sobrecorriente" },
      { label: "Montaje", value: "Riel DIN 35mm" }
    ]
  },
  {
    sku: 'PRT-INT-80A-DIG',
    name: 'Protector Inteligente Digital 80A Heavy Duty',
    description: 'Protector digital ajustable de 80A con reconexión temporizada automática para protección integral del hogar o local comercial.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Amperaje Máximo", value: "80A" },
      { label: "Pantalla", value: "Digital LED V / A" },
      { label: "Ajuste de Reconexión", value: "Temporizado 1-500 seg" }
    ]
  },
  {
    sku: 'PIL-LED-VERDE-22MM',
    name: 'Luz Piloto LED Verde 22mm 110V/220V AC',
    description: 'Luz piloto de señalización LED verde para indicar estado activo de fase o motor en tableros eléctricos.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Color", value: "Verde" },
      { label: "Diámetro", value: "22 mm" },
      { label: "Voltaje", value: "110V - 220V AC" }
    ]
  },
  {
    sku: 'PIL-LED-ROJO-22MM',
    name: 'Luz Piloto LED Rojo 22mm 110V/220V AC',
    description: 'Luz piloto de señalización LED rojo para advertencia de paro o falla en tableros eléctricos.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Color", value: "Rojo" },
      { label: "Diámetro", value: "22 mm" },
      { label: "Voltaje", value: "110V - 220V AC" }
    ]
  },
  {
    sku: 'PIL-LED-AMARILLO-22MM',
    name: 'Luz Piloto LED Amarillo 22mm 110V/220V AC',
    description: 'Luz piloto de señalización LED amarillo para indicación de reserva o precaución en paneles de control.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Color", value: "Amarillo" },
      { label: "Diámetro", value: "22 mm" },
      { label: "Voltaje", value: "110V - 220V AC" }
    ]
  },
  {
    sku: 'ABR-UNA-TRIC',
    name: 'Abrazadera de Uña Tric 3/4"',
    description: 'Abrazadera de uña para sujeción de tubería conduit 3/4" marca Tric.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.pesado,
    specs: [
      { label: "Marca", value: "Tric" },
      { label: "Medida", value: "3/4\"" },
      { label: "Tipo", value: "Uña Monopared" }
    ]
  },
  {
    sku: 'BAL-COB-VERT-12V',
    name: 'Balastro / Fuente para Cinta COB Vert 12V 5A 60W',
    description: 'Fuente de poder conmutada ultradelgada Vert de 12V 5A para tiras y cintas LED COB.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Vert" },
      { label: "Salida", value: "12V DC / 5A (60W)" },
      { label: "Entrada", value: "110V-220V AC" }
    ]
  },
  {
    sku: 'MANG-LED-EBELI-100M',
    name: 'Manguera LED Neón Flexible Ebeli 110V (Rollo 100m)',
    description: 'Manguera LED impermeable IP65 Ebeli 110V directo sin transformador para iluminación perimetral.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.led,
    specs: [
      { label: "Marca", value: "Ebeli" },
      { label: "Voltaje", value: "110V AC Directo" },
      { label: "Protección", value: "IP65 Impermeable Exterior" }
    ]
  },
  {
    sku: 'SNS-CNT-110V-ILUM',
    name: 'Sensor para Cinta Directa 110V Ilumilamp',
    description: 'Sensor de presencia e infrarrojo Ilumilamp diseñado para cintas LED y mangueras alimentadas a 110V.',
    base_price_usd: BASE_PRICE,
    stock_quantity: BASE_STOCK,
    category_id: CATEGORY_MAP.control,
    specs: [
      { label: "Marca", value: "Ilumilamp" },
      { label: "Voltaje", value: "110V AC Directo" },
      { label: "Tipo", value: "Sensor PIR Infrarrojo" }
    ]
  }
];

async function uploadProducts() {
  console.log(`Starting upload of ${products.length} products...`);
  
  let successCount = 0;
  let failCount = 0;

  for (const prod of products) {
    try {
      const res = await fetch(`${url}/rest/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(prod)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[FAIL] ${prod.sku} (${prod.name}):`, errText);
        failCount++;
      } else {
        console.log(`[OK] ${prod.sku} - ${prod.name}`);
        successCount++;
      }
    } catch (e) {
      console.error(`[ERROR] ${prod.sku}:`, e.message);
      failCount++;
    }
  }

  console.log(`\nCompleted upload! Success: ${successCount}, Failures: ${failCount}`);
}

uploadProducts();
