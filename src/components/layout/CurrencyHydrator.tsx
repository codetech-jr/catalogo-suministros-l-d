"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/store/currency-store";
import { useProductsStore } from "@/store/products-store";

export function CurrencyHydrator() {
  const fetchRates = useCurrencyStore((s) => s.fetchRatesFromDB);
  const fetchProducts = useProductsStore((s) => s.fetchProductsAndCategories);

  useEffect(() => {
    fetchRates();
    fetchProducts();
  }, [fetchRates, fetchProducts]);

  return null;
}

export default CurrencyHydrator;
