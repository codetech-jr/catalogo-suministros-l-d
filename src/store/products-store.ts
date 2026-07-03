import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export interface ProductsState {
  products: Product[];
  categories: any[];
  isFetchingData: boolean;
  error: string | null;
  fetchProductsAndCategories: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  categories: [],
  isFetchingData: false,
  error: null,

  fetchProductsAndCategories: async () => {
    set({ isFetchingData: true, error: null });
    try {
      // 1. Fetch categories
      const { data: dbCategories, error: catError } = await supabase
        .from("categories")
        .select("id, name, slug");

      if (catError) throw catError;

      // 2. Fetch products and join categories
      const { data: dbProducts, error: prodError } = await supabase
        .from("products")
        .select(`
          id,
          sku,
          name,
          description,
          base_price_usd,
          stock_quantity,
          image_url,
          specs,
          wholesale_enabled,
          wholesale_min_units,
          wholesale_price_usd,
          categories (
            id,
            name,
            slug
          )
        `);

      if (prodError) throw prodError;

      const mappedCategories = dbCategories || [];

      // Helper functions for category mapping to match frontend "iluminacion" | "control" | "cableado"
      const mapCategorySlug = (slug: string): "iluminacion" | "control" | "cableado" => {
        const s = slug.toLowerCase();
        if (s.includes("iluminacion") || s.includes("luminaria") || s.includes("led")) return "iluminacion";
        if (s.includes("cable") || s.includes("material-pesado") || s.includes("tubo") || s.includes("conduit") || s.includes("pesado")) return "cableado";
        if (s.includes("control") || s.includes("breaker") || s.includes("tablero")) return "control";
        return "iluminacion"; // default fallback
      };

      const mapCategoryLabel = (slug: string, dbName: string): string => {
        const mapped = mapCategorySlug(slug);
        if (mapped === "iluminacion") return "Luminaria LED";
        if (mapped === "cableado") return "Material Pesado";
        if (mapped === "control") return "Control Eléctrico";
        return dbName || "Otros";
      };

      // 4. Map products to frontend structure
      const mappedProducts: Product[] = (dbProducts || []).map((dbProd: any) => {
        let mappedSpecs: { label: string; value: string }[] = [];
        if (Array.isArray(dbProd.specs)) {
          mappedSpecs = dbProd.specs;
        } else if (dbProd.specs && typeof dbProd.specs === "object") {
          mappedSpecs = Object.entries(dbProd.specs).map(([key, val]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(val),
          }));
        }

        // Handle possible array or single object for joined categories relation
        const catObj = Array.isArray(dbProd.categories) ? dbProd.categories[0] : dbProd.categories;
        const dbCatSlug = catObj?.slug || "iluminacion";
        const dbCatName = catObj?.name || "Luminaria LED";

        const categoryMapped = mapCategorySlug(dbCatSlug);
        const categoryLabelMapped = mapCategoryLabel(dbCatSlug, dbCatName);

        // Normalize image paths if starting with products/ or similar
        let finalImage = dbProd.image_url || "";
        if (finalImage && !finalImage.startsWith("http") && !finalImage.startsWith("/")) {
          finalImage = `/${finalImage}`;
        }

        return {
          id: dbProd.id,
          sku: dbProd.sku,
          name: dbProd.name,
          slug: dbProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          description: dbProd.description || "",
          category: categoryMapped,
          categoryLabel: categoryLabelMapped,
          price: Number(dbProd.base_price_usd),
          image: finalImage,
          specs: mappedSpecs,
          volumeDiscount: dbProd.wholesale_enabled && dbProd.wholesale_min_units && dbProd.wholesale_price_usd
            ? {
                threshold: Number(dbProd.wholesale_min_units),
                discountPrice: Number(dbProd.wholesale_price_usd),
                label: `paquete a partir de ${dbProd.wholesale_min_units} unidades`
              }
            : undefined,
          stock: Number(dbProd.stock_quantity),
        };
      });

      set({
        products: mappedProducts,
        categories: mappedCategories,
        isFetchingData: false,
      });
    } catch (err: any) {
      console.error("Error al cargar productos y categorías desde Supabase:", err);
      set({
        isFetchingData: false,
        error: err.message || "Falla al conectar con base de datos Supabase.",
      });
    }
  },
}));
