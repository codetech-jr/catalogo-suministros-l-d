import { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  // 1. Luminaria LED (iluminacion)
  {
    id: "prod-1",
    sku: "LD-LED-PR18",
    name: "Panel LED Empotrable Redondo 18W",
    slug: "panel-led-empotrable-redondo-18w",
    description: "Luz blanca de alta luminosidad y bajo consumo. Ideal para techos residenciales, oficinas y locales comerciales.",
    category: "iluminacion",
    categoryLabel: "Luminaria LED",
    price: 4.50,
    image: "/images/panel-led.webp",
    specs: [
      { label: "Potencia", value: "18W" },
      { label: "Voltaje", value: "85-265V (Multivoltaje)" },
      { label: "Lúmenes", value: "1600 lm" },
      { label: "Temperatura de color", value: "Luz Fría (6500K)" },
      { label: "Diámetro", value: "22 cm" }
    ],
    volumeDiscount: {
      threshold: 20,
      discountPrice: 3.80,
      label: "caja de 20 unidades"
    },
    stock: 150
  },
  {
    id: "prod-2",
    sku: "LD-LED-REF100",
    name: "Reflector LED Exterior 100W IP66",
    slug: "reflector-led-exterior-100w-ip66",
    description: "Reflector de alta potencia resistente al agua y polvo. Ideal para fachadas, estacionamientos y patios de obras.",
    category: "iluminacion",
    categoryLabel: "Luminaria LED",
    price: 18.50,
    image: "/images/reflector-100w.webp",
    specs: [
      { label: "Potencia", value: "100W" },
      { label: "Protección", value: "IP66 (Impermeable)" },
      { label: "Lúmenes", value: "9000 lm" },
      { label: "Temperatura de color", value: "Luz Fría (6500K)" },
      { label: "Material", value: "Aluminio inyectado y vidrio templado" }
    ],
    volumeDiscount: {
      threshold: 5,
      discountPrice: 15.90,
      label: "bulto de 5 unidades"
    },
    stock: 40
  },
  {
    id: "prod-3",
    sku: "LD-LED-B12",
    name: "Bombillo LED A60 12W Multi-voltaje",
    slug: "bombillo-led-a60-12w-multi-voltaje",
    description: "Bombillo tradicional con rosca estándar, alta durabilidad y encendido instantáneo.",
    category: "iluminacion",
    categoryLabel: "Luminaria LED",
    price: 1.20,
    image: "/images/bombillo-12w.webp",
    specs: [
      { label: "Potencia", value: "12W" },
      { label: "Rosca", value: "E27 (Estándar)" },
      { label: "Voltaje", value: "85-265V" },
      { label: "Lúmenes", value: "1080 lm" },
      { label: "Temperatura de color", value: "Luz Fría (6500K)" }
    ],
    volumeDiscount: {
      threshold: 50,
      discountPrice: 0.95,
      label: "caja de 50 unidades"
    },
    stock: 500
  },

  // 2. Sistema de Control Eléctrico (control)
  {
    id: "prod-4",
    sku: "LD-CON-BR201P",
    name: "Breaker Enchufable 1 Polo 20A",
    slug: "breaker-enchufable-1-polo-20a",
    description: "Interruptor termomagnético enchufable para protección de sobrecargas y cortocircuitos en circuitos ramales.",
    category: "control",
    categoryLabel: "Control Eléctrico",
    price: 5.80,
    image: "/images/breaker-20a.webp",
    specs: [
      { label: "Amperaje", value: "20A" },
      { label: "Polos", value: "1 Polo" },
      { label: "Tipo de montaje", value: "Enchufable (QO)" },
      { label: "Tensión nominal", value: "120/240V AC" },
      { label: "Capacidad interruptiva", value: "10 kA" }
    ],
    volumeDiscount: {
      threshold: 10,
      discountPrice: 4.90,
      label: "caja de 10 unidades"
    },
    stock: 80
  },
  {
    id: "prod-5",
    sku: "LD-CON-BR402P",
    name: "Breaker Enchufable 2 Polos 40A",
    slug: "breaker-enchufable-2-polos-40a",
    description: "Breaker bifásico para sistemas de mayor consumo como aires acondicionados y cocinas eléctricas.",
    category: "control",
    categoryLabel: "Control Eléctrico",
    price: 12.50,
    image: "/images/breaker-40a.webp",
    specs: [
      { label: "Amperaje", value: "40A" },
      { label: "Polos", value: "2 Polos" },
      { label: "Tipo de montaje", value: "Enchufable (QO)" },
      { label: "Tensión nominal", value: "240V AC" },
      { label: "Capacidad interruptiva", value: "10 kA" }
    ],
    volumeDiscount: {
      threshold: 10,
      discountPrice: 10.50,
      label: "caja de 10 unidades"
    },
    stock: 50
  },
  {
    id: "prod-6",
    sku: "LD-CON-TAB4",
    name: "Tablero Metálico de 4 Circuitos",
    slug: "tablero-metalico-de-4-circuitos",
    description: "Centro de carga metálico para empotrar. Acabado resistente a la corrosión para distribución eléctrica segura.",
    category: "control",
    categoryLabel: "Control Eléctrico",
    price: 24.00,
    image: "/images/tablero-4c.webp",
    specs: [
      { label: "Circuitos", value: "4 Circuitos" },
      { label: "Material", value: "Chapa de acero galvanizado" },
      { label: "Pintura", value: "Electrostática gris texturizada" },
      { label: "Montaje", value: "Empotrar o sobreponer" },
      { label: "Corriente máxima", value: "100A" }
    ],
    volumeDiscount: {
      threshold: 3,
      discountPrice: 20.50,
      label: "lote de 3 unidades"
    },
    stock: 15
  },

  // 3. Sistema de Cableado y Material Pesado (cableado)
  {
    id: "prod-7",
    sku: "LD-CBL-THHN12",
    name: "Rollo de Cable THHN Calibre 12 AWG (100m)",
    slug: "rollo-cable-thhn-calibre-12-awg-100m",
    description: "Cable de cobre electrolítico de alta pureza. Excelente aislamiento termoplástico resistente al calor y humedad.",
    category: "cableado",
    categoryLabel: "Material Pesado",
    price: 32.50,
    image: "/images/cable-12awg.webp",
    specs: [
      { label: "Calibre", value: "12 AWG" },
      { label: "Longitud", value: "100 metros" },
      { label: "Conductor", value: "Cobre recocido de 7 hilos" },
      { label: "Temperatura máxima", value: "90°C en seco" },
      { label: "Voltaje de operación", value: "600V" }
    ],
    volumeDiscount: {
      threshold: 5,
      discountPrice: 28.50,
      label: "caja de 5 rollos"
    },
    stock: 60
  },
  {
    id: "prod-8",
    sku: "LD-CBL-THHN10",
    name: "Rollo de Cable THHN Calibre 10 AWG (100m)",
    slug: "rollo-cable-thhn-calibre-10-awg-100m",
    description: "Cable de cobre de mayor calibre para circuitos de alimentación principal y distribución pesada.",
    category: "cableado",
    categoryLabel: "Material Pesado",
    price: 48.00,
    image: "/images/cable-10awg.webp",
    specs: [
      { label: "Calibre", value: "10 AWG" },
      { label: "Longitud", value: "100 metros" },
      { label: "Conductor", value: "Cobre recocido de 7 hilos" },
      { label: "Temperatura máxima", value: "90°C en seco" },
      { label: "Voltaje de operación", value: "600V" }
    ],
    volumeDiscount: {
      threshold: 5,
      discountPrice: 42.00,
      label: "caja de 5 rollos"
    },
    stock: 45
  },
  {
    id: "prod-9",
    sku: "LD-MAT-PVC12",
    name: "Tubo Conduit PVC 1/2\" x 3m",
    slug: "tubo-conduit-pvc-1-2-x-3m",
    description: "Tubería conduit autoextinguible para proteger y canalizar conductores eléctricos de forma segura.",
    category: "cableado",
    categoryLabel: "Material Pesado",
    price: 1.80,
    image: "/images/tubo-pvc.webp",
    specs: [
      { label: "Diámetro nominal", value: "1/2 pulgada" },
      { label: "Longitud", value: "3 metros" },
      { label: "Material", value: "PVC rígido" },
      { label: "Estilo", value: "Autoextinguible (resistente al fuego)" },
      { label: "Tipo de uso", value: "Canalizaciones empotradas o expuestas" }
    ],
    volumeDiscount: {
      threshold: 30,
      discountPrice: 1.45,
      label: "fardo de 30 tubos"
    },
    stock: 300
  }
];
