import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export interface ProductsState {
  products: Product[];
  categories: any[];
  isFetchingData: boolean;
  error: string | null;
  fetchProductsAndCategories: () => Promise<void>;
  saveProduct: (productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
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
          category_id,
          categories (
            id,
            name,
            slug
          )
        `);

      if (prodError) throw prodError;

      const mappedCategories = dbCategories || [];

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

        // Handle possible array or single object for joined categories relation, with fallback to category_id
        const joinedCat = Array.isArray(dbProd.categories) ? dbProd.categories[0] : dbProd.categories;
        const fallbackCat = mappedCategories.find((c: any) => c.id === dbProd.category_id);
        const catObj = joinedCat || fallbackCat;
        const dbCatSlug = catObj?.slug || (mappedCategories[0]?.slug || "luminaria-led");
        const dbCatName = catObj?.name || (mappedCategories[0]?.name || "Luminaria LED");

        // Normalize image paths if starting with products/ or similar, or fallback seed images to public assets
        let finalImage = dbProd.image_url || "";
        if (finalImage.startsWith("products/") || finalImage.startsWith("/products/")) {
          if (dbCatSlug.includes("iluminacion") || dbCatSlug.includes("led")) finalImage = "/iluminaria-led.jpg";
          else if (dbCatSlug.includes("tubo") || dbCatSlug.includes("cable") || dbCatSlug.includes("pesado")) finalImage = "/cables-y-tubos.jpg";
          else if (dbCatSlug.includes("control") || dbCatSlug.includes("proteccion")) finalImage = "/breakers.jpg";
          else finalImage = "/iluminaria-led.jpg";
        } else if (finalImage && !finalImage.startsWith("http") && !finalImage.startsWith("/") && !finalImage.startsWith("data:")) {
          finalImage = `/${finalImage}`;
        }

        return {
          id: dbProd.id,
          sku: dbProd.sku,
          name: dbProd.name,
          slug: dbProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          description: dbProd.description || "",
          category: dbCatSlug,
          categoryLabel: dbCatName,
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

  saveProduct: async (productData: Partial<Product>) => {
    const categories = get().categories;

    // Resolve category_id
    const categoryKey = productData.category || "";
    let categoryId = "";

    const catMatch = categories.find((c) => c.slug === categoryKey || c.id === categoryKey);

    if (catMatch) {
      categoryId = catMatch.id;
    } else if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      throw new Error("No se pudo asignar una categoría válida.");
    }

    const payload = {
      sku: productData.sku,
      name: productData.name,
      description: productData.description || "",
      base_price_usd: productData.price,
      stock_quantity: productData.stock,
      category_id: categoryId,
      image_url: productData.image || null,
      specs: productData.specs || [],
      wholesale_enabled: Boolean(productData.volumeDiscount),
      wholesale_min_units: productData.volumeDiscount?.threshold || null,
      wholesale_price_usd: productData.volumeDiscount?.discountPrice || null,
    };

    if (productData.id) {
      // Update existing
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productData.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from("products")
        .insert(payload);

      if (error) throw error;
    }

    // Refresh products list
    await get().fetchProductsAndCategories();
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    await get().fetchProductsAndCategories();
  },
}));
