"use client";

import { useEffect } from "react";

const OFFICIAL_TITLE = "Suministros L&D | Material Eléctrico B2B";
const AWAY_TITLE = "🚧 ¡Tu obra espera! Finaliza tu carrito";

/**
 * useAttentionGrabber
 * Cambia el título del documento cuando el usuario abandona la pestaña
 * para incentivarlo a regresar y finalizar su compra.
 */
export function useAttentionGrabber(): void {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = AWAY_TITLE;
      } else {
        document.title = OFFICIAL_TITLE;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Restaurar título al desmontar
      document.title = OFFICIAL_TITLE;
    };
  }, []);
}

export default useAttentionGrabber;
