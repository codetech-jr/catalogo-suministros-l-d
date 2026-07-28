"use client";

import * as React from "react";
import { X, Upload, Plus, Trash2, Save, Cloud } from "lucide-react";
import type { ISuministrosProduct } from "@/types/product";

import { useProductsStore } from "@/store/products-store";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ISuministrosProduct | null;
}

const CATEGORIES = [
  { id: "iluminacion", label: "Iluminación LED" },
  { id: "control", label: "Control Eléctrico" },
  { id: "cableado", label: "Cables" },
];

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const saveProduct = useProductsStore((s) => s.saveProduct);
  const isEditing = !!product;

  const [name, setName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("iluminacion");
  const [price, setPrice] = React.useState("");
  const [stock, setStock] = React.useState("");
  
  // Volume Discount State
  const [isVolumeDiscountEnabled, setIsVolumeDiscountEnabled] = React.useState(false);
  const [discountThreshold, setDiscountThreshold] = React.useState("");
  const [discountPrice, setDiscountPrice] = React.useState("");

  // Specs Generator State (Default 2 empty rows for new products)
  const [specs, setSpecs] = React.useState<{ label: string; value: string }[]>([
    { label: "", value: "" },
    { label: "", value: "" },
  ]);

  // Fake drag and drop state
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Populate form when editing or opening
  React.useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (product) {
        setName(product.name);
        setSku(product.sku);
        setDescription(product.description || "");
        setCategory(product.category);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setPreviewImage(product.image || null);
        
        if (product.volumeDiscount) {
          setIsVolumeDiscountEnabled(true);
          setDiscountThreshold(product.volumeDiscount.threshold.toString());
          setDiscountPrice(product.volumeDiscount.discountPrice.toString());
        } else {
          setIsVolumeDiscountEnabled(false);
          setDiscountThreshold("");
          setDiscountPrice("");
        }

        setSpecs(
          product.specs && product.specs.length > 0
            ? product.specs.map((s) => ({ label: s.label, value: s.value }))
            : [
                { label: "", value: "" },
                { label: "", value: "" },
              ]
        );
      } else {
        setName("");
        setSku("");
        setDescription("");
        setCategory("iluminacion");
        setPrice("");
        setStock("");
        setPreviewImage(null);
        setIsVolumeDiscountEnabled(false);
        setDiscountThreshold("");
        setDiscountPrice("");
        setSpecs([
          { label: "", value: "" },
          { label: "", value: "" },
        ]);
      }
    }
  }, [product, isOpen]);

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (
    index: number,
    field: "label" | "value",
    val: string
  ) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      const parsedPrice = parseFloat(price);
      const parsedStock = parseInt(stock, 10);

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error("Ingresa un precio base válido.");
      }
      if (isNaN(parsedStock) || parsedStock < 0) {
        throw new Error("Ingresa un stock válido.");
      }

      const filteredSpecs = specs.filter((s) => s.label.trim() !== "" && s.value.trim() !== "");

      let volumeDiscount = undefined;
      if (isVolumeDiscountEnabled) {
        const threshold = parseInt(discountThreshold, 10);
        const dPrice = parseFloat(discountPrice);

        if (isNaN(threshold) || threshold < 1) {
          throw new Error("Ingresa una cantidad mínima válida para el descuento mayorista.");
        }
        if (isNaN(dPrice) || dPrice < 0) {
          throw new Error("Ingresa un precio mayorista válido.");
        }
        if (dPrice > parsedPrice) {
          throw new Error("El precio mayorista debe ser menor o igual al precio base.");
        }

        volumeDiscount = {
          threshold,
          discountPrice: dPrice,
          label: `paquete a partir de ${threshold} unidades`,
        };
      }

      await saveProduct({
        id: product?.id,
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim(),
        category: category as "iluminacion" | "control" | "cableado",
        price: parsedPrice,
        stock: parsedStock,
        specs: filteredSpecs,
        volumeDiscount,
        image: previewImage || undefined,
      });

      setIsSaving(false);
      onClose();
    } catch (err: any) {
      console.error("Error al guardar el producto:", err);
      setErrorMessage(err.message || "Error al conectar con la base de datos.");
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle =
    "bg-slate-800/50 border border-slate-700 text-sm p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007BFF] text-white w-full placeholder:text-slate-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex justify-center items-center p-4">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800 z-10">
          <h3 className="text-xl font-bold text-white tracking-tight font-display">
            {isEditing ? "Editar Insumo" : "Añadir Nuevo Insumo"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-4 bg-rose-950/50 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-mono">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 p-6">
          
          {/* Column A (Left - Data & SEO - col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* SKU */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej: SKU-LED-18W"
                className={inputStyle}
                required
              />
            </div>

            {/* Nombre del Producto */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Nombre del Producto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Reflector LED Multivoltaje"
                className={inputStyle}
                required
              />
            </div>

            {/* Descripción Breve */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Descripción Breve</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla las características principales del insumo..."
                className={`${inputStyle} h-24 resize-none`}
              />
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Categoría</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Generador de Specs Técnicos */}
            <div className="p-4 border border-slate-800 rounded-lg bg-slate-950/20 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-300">Ficha Técnica</h4>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs font-semibold text-[#007BFF] hover:text-[#007BFF]/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar Otra
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                      placeholder="Nombre (Ej: Polos)"
                      className={`${inputStyle} p-2.5 text-xs`}
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      placeholder="Valor (Ej: 1 Polo)"
                      className={`${inputStyle} p-2.5 text-xs`}
                    />
                    {specs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Eliminar especificación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column B (Right - Media, Tiers & Monetario - col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Zona Upload (Drag & Drop Falso) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Imagen del Insumo</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-[#007BFF] bg-slate-800/30 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Vista previa del insumo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-white" />
                      <span className="text-xs text-white font-medium">Reemplazar Imagen</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Cloud className="h-10 w-10 text-slate-500 group-hover:text-[#007BFF] transition-colors mb-2" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      Arrastra tu JPG o WEBP aquí
                    </span>
                    <span className="text-[10px] text-slate-600 mt-1 font-mono">
                      o haz clic para explorar
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Input Financiero & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Costo Base (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm">
                    $
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className={`${inputStyle} pl-8 font-mono`}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Stock (Unds)</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className={`${inputStyle} font-mono`}
                  required
                />
              </div>
            </div>

            {/* Promociones (Volume Tiers) */}
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isVolumeDiscountEnabled}
                    onChange={(e) => setIsVolumeDiscountEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-800 rounded-full border border-slate-700 transition-colors peer-checked:bg-[#007BFF]/20 peer-checked:border-[#007BFF] relative">
                    <div
                      className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full transition-all ${
                        isVolumeDiscountEnabled ? "translate-x-4 bg-[#007BFF]" : "bg-slate-500"
                      }`}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                  Habilitar Descuento Corporativo Mayorista
                </span>
              </label>

              {isVolumeDiscountEnabled && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-xs text-slate-400 animate-fadeIn">
                  <span>Si llevan más de</span>
                  <input
                    type="number"
                    min="1"
                    value={discountThreshold}
                    onChange={(e) => setDiscountThreshold(e.target.value)}
                    placeholder="10"
                    className="w-16 bg-slate-900 border border-slate-700 text-center rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-[#007BFF] text-white outline-none font-mono"
                    required={isVolumeDiscountEnabled}
                  />
                  <span>unds, cuesta</span>
                  <div className="relative w-20">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="8.50"
                      className="w-full bg-slate-900 border border-slate-700 pl-5 pr-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#007BFF] text-white outline-none font-mono"
                      required={isVolumeDiscountEnabled}
                    />
                  </div>
                  <span>cada uno</span>
                </div>
              )}
            </div>

          </div>

          {/* Footer Action Row (col-span-full) */}
          <div className="col-span-full border-t border-slate-800 pt-6 mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#007BFF] text-slate-900 font-bold px-6 py-2.5 rounded-lg flex gap-2 items-center hover:opacity-90 shadow-[0_0_15px_rgba(0,123,255,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar Catálogo"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ProductFormModal;
