"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface CommandPaletteState {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  openPalette: () => set({ isOpen: true }),
  closePalette: () => set({ isOpen: false }),
  togglePalette: () => set((state) => ({ isOpen: !state.isOpen })),
}));

/**
 * useCommandPalette
 * Escucha Ctrl+K / ⌘+K globalmente y togglea la paleta de comandos.
 * Debe invocarse UNA vez en el componente raíz que contiene <CommandPalette />.
 */
export function useCommandPaletteKeyboard(): void {
  const togglePalette = useCommandPaletteStore((s) => s.togglePalette);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        togglePalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [togglePalette]);
}
