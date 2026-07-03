// ---------------------------------------------------------------------------
// Pricing Engine — Lógica de Protección Cambiaria B2B
// ---------------------------------------------------------------------------
// Fórmula fiscal híbrida venezolana:
//
//   MontoProtegidoVES  = basePriceUsd × rateBinance
//     → El total vital que necesita cobrar el dueño en Bolívares.
//
//   MontoVitrinaUSD    = MontoProtegidoVES / rateBcv
//     → Precio "en dólares" inflado legalmente. Al convertirlo a Bs a tasa
//       BCV oficial, el resultado cubre el costo real de reposición.
//
// Ejemplo numérico:
//   Base: $10 USD | Binance: 40 | BCV: 36.50
//   netVES     = 10 × 40       = Bs. 400,00
//   displayUSD = 400 / 36.50   = $10,96
// ---------------------------------------------------------------------------

export interface StorePrices {
  /** Precio protegido en Bolívares (basePriceUsd × rateBinance) */
  netVES: number;
  /** Precio vitrina en USD legal (netVES / rateBcv) */
  displayUSD: number;
}

/**
 * Calcula los precios de vitrina para un producto dado las tasas cambiarias.
 *
 * @param basePriceUsd - Costo base de reposición del producto en USD
 * @param rateBcv      - Tasa BCV oficial (ej: 36.50)
 * @param rateBinance  - Tasa Binance / mercado paralelo (ej: 40.00)
 * @returns `{ netVES, displayUSD }`
 */
export function getStorePrices(
  basePriceUsd: number,
  rateBcv: number,
  rateBinance: number
): StorePrices {
  const netVES = basePriceUsd * rateBinance;
  const displayUSD = rateBcv > 0 ? netVES / rateBcv : basePriceUsd;

  return { netVES, displayUSD };
}

/**
 * Calcula el ahorro unitario en ambas monedas al aplicar descuento por volumen.
 */
export function getVolumeSavings(
  originalPriceUsd: number,
  discountPriceUsd: number,
  rateBcv: number,
  rateBinance: number
): { savingsVES: number; savingsUSD: number } {
  const original = getStorePrices(originalPriceUsd, rateBcv, rateBinance);
  const discounted = getStorePrices(discountPriceUsd, rateBcv, rateBinance);

  return {
    savingsVES: original.netVES - discounted.netVES,
    savingsUSD: original.displayUSD - discounted.displayUSD,
  };
}
