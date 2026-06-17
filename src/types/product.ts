export interface VolumeDiscount {
  threshold: number;
  discountPrice: number; // Price per unit if quantity >= threshold
  label: string; // e.g., "caja de 20 unidades"
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: "iluminacion" | "control" | "cableado";
  categoryLabel: string; // e.g., "Iluminación LED", "Control Eléctrico", "Material Pesado"
  price: number; // Unit price in USD
  image: string; // URL path to image (or fallback text icon if empty)
  specs: {
    label: string;
    value: string;
  }[];
  volumeDiscount?: VolumeDiscount;
  stock: number;
}
