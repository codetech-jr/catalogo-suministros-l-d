"use client";

import * as React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useProductsStore } from "@/store/products-store";
import { useCurrencyStore } from "@/store/currency-store";
import { getStorePrices } from "@/lib/utils/pricing-engine";
import { formatUSD, formatVES } from "@/lib/utils/format-currency";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { ProductFormModal } from "./ProductFormModal";

function ProductRowImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return <Package className="h-4 w-4 text-slate-600" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      unoptimized
      className="object-cover w-full h-full"
      onError={() => setError(true)}
    />
  );
}

export function InventoryTable() {
  const { products, isFetchingData, deleteProduct } = useProductsStore();
  const rateBcv = useCurrencyStore((s) => s.rateBcv);
  const rateBinance = useCurrencyStore((s) => s.rateBinance);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const filteredProducts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
      } catch (err: any) {
        alert("Error al eliminar producto: " + (err.message || "Falla en base de datos."));
      }
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-100 tracking-tight">
            Gestión de Inventario
          </h2>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            {products.length} productos registrados en catálogo
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar SKU, nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF]/25 transition-all placeholder:text-slate-500 font-mono"
            />
          </div>

          {/* New Product Button */}
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#007BFF] hover:bg-[#1a8cff] text-slate-900 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-blue-950/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4 stroke-[2.5px]" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                <th className="px-4 py-3 w-12" />
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 text-right">Base USD</th>
                <th className="px-4 py-3 text-right">Vitrina VES</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isFetchingData ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse bg-slate-900/50">
                    <td className="px-4 py-3"><div className="h-10 w-10 bg-slate-800 rounded-lg" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-slate-800 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-slate-800 rounded" /></td>
                    <td className="px-4 py-3 text-right"><div className="h-4 w-12 bg-slate-800 rounded ml-auto" /></td>
                    <td className="px-4 py-3 text-right"><div className="h-4 w-16 bg-slate-800 rounded ml-auto" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-slate-800 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-16 bg-slate-800 rounded-full mx-auto" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-12 bg-slate-800 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : (
                filteredProducts.map((product) => {
                  const prices = getStorePrices(product.price, rateBcv, rateBinance);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Miniatura */}
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700/50 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <ProductRowImage src={product.image} alt={product.name} />
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-slate-400 tracking-wider">
                          {product.sku}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {product.name}
                        </span>
                      </td>

                      {/* Base USD */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {formatUSD(product.price)}
                        </span>
                      </td>

                      {/* Vitrina VES */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-xs font-bold text-amber-400/90">
                          {formatVES(prices.netVES)}
                        </span>
                      </td>

                      {/* Categoría */}
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                          {product.categoryLabel}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                            product.stock > 0
                              ? "bg-emerald-950/40 border border-emerald-800/40 text-emerald-400"
                              : "bg-amber-950/40 border border-amber-800/40 text-amber-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.stock > 0
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-amber-400"
                            }`}
                          />
                          {product.stock > 0 ? `${product.stock} uds` : "Pedido"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-[#007BFF] hover:border-[#007BFF]/30 transition-all cursor-pointer"
                            title="Editar producto"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>
            Mostrando{" "}
            <strong className="text-slate-300">{filteredProducts.length}</strong>{" "}
            de <strong className="text-slate-300">{products.length}</strong>{" "}
            productos
          </span>
          <span>Tasas: BCV {rateBcv} / Binance {rateBinance}</span>
        </div>
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </>
  );
}

export default InventoryTable;
