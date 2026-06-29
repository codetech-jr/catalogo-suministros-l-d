"use client";

import * as React from "react";
import { Menu, Search, MessageCircle, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useDrawerStore } from "@/store/drawer-store";
import { useCommandPaletteStore } from "@/hooks/useCommandPalette";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

const WHATSAPP_URL =
  "https://wa.me/584141025386?text=Hola%20Suministros%20L%26D.%20Necesito%20asesoría%20para%20mi%20proyecto.";

export function MobileDock() {
  const items = useCartStore((state) => state.items);
  const openDrawer = useDrawerStore((state) => state.openDrawer);
  const openPalette = useCommandPaletteStore((s) => s.openPalette);
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Mobile Navigation Drawer (Sidebar) */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Bottom Dock Bar */}
      <nav
        className="fixed bottom-0 left-0 w-full z-[100] md:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Navegación móvil"
      >
        {/* Glassmorphic background */}
        <div className="bg-slate-950/85 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-around items-center px-2 py-2.5">

            {/* ☰ Menú (reemplaza Inicio) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 text-slate-400 hover:text-[#0ee0d5] transition-colors cursor-pointer active:scale-95 rounded-xl"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-semibold tracking-wide">Menú</span>
            </button>

            {/* 🔍 Buscar — abre CommandPalette */}
            <button
              onClick={openPalette}
              className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 text-slate-400 hover:text-[#0ee0d5] transition-colors cursor-pointer active:scale-95 rounded-xl"
              aria-label="Abrir búsqueda rápida"
            >
              <Search className="h-5 w-5" />
              <span className="text-[10px] font-semibold tracking-wide">Buscar</span>
            </button>

            {/* 💬 Asesoría WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 text-slate-400 hover:text-[#0ee0d5] transition-colors active:scale-95 rounded-xl"
              aria-label="Contactar asesor vía WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-[10px] font-semibold tracking-wide">Asesoría</span>
            </a>

            {/* 🛒 Cesta */}
            <button
              onClick={openDrawer}
              className="relative flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 text-slate-400 hover:text-[#0ee0d5] transition-colors cursor-pointer active:scale-95 rounded-xl"
              aria-label="Abrir carrito de compras"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalQty > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0ee0d5] text-[8px] font-bold text-slate-950 shadow-[0_0_8px_rgba(14,224,213,0.5)]">
                    {totalQty > 99 ? "99+" : totalQty}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-wide">Cesta</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default MobileDock;
