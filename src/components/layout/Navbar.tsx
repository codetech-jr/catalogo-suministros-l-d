"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart-store";
import { useDrawerStore } from "@/store/drawer-store";
import BcvRateWidget from "../shared/BcvRateWidget";
import SearchBar from "../shared/SearchBar";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  const getTotals = useCartStore((state) => state.getTotals);
  const openDrawer = useDrawerStore((state) => state.openDrawer);

  React.useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totals = mounted ? getTotals() : { itemCount: 0 };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "h-14 glass-navbar shadow-lg" : "h-16 bg-[#08090c]/40 border-b border-hairline backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg
            className="h-8 w-8 text-accent-electric filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold leading-none tracking-tight text-text-primary">
              SUMINISTROS L&D
            </span>
            <span className="text-[10px] text-text-muted leading-none font-mono mt-0.5 uppercase tracking-wider">
              Ferretería Especializada
            </span>
          </div>
        </div>

        {/* Search Bar - desktop only, inside header */}
        {onSearch && (
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar onSearch={onSearch} />
          </div>
        )}

        {/* Widgets and Cart */}
        <div className="flex items-center gap-3">
          <BcvRateWidget />

          {/* Cart trigger button */}
          <button
            onClick={openDrawer}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hairline bg-canvas-card text-text-primary hover:border-accent-electric/40 hover:text-accent-electric transition-all duration-200 active:scale-95"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            
            {/* Quantity Badge with pulse effect */}
            {totals.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent-electric text-[9px] font-bold text-[#08090c] animate-pulse">
                {totals.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
