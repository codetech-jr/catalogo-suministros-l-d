import { NextResponse } from "next/server";

// Hardcoded default rate in case all network APIs fail
const DEFAULT_FALLBACK_RATE = 40.25;

export async function GET() {
  try {
    // Fetch from primary source, revalidate every 12 hours (43200 seconds)
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error(`DolarAPI returned status ${response.status}`);
    }

    const data = await response.json();
    
    // The BCV rate is represented in the 'promedio', 'venta', or 'compra' field
    const rate = data.promedio || data.venta || data.compra;

    if (!rate || typeof rate !== "number") {
      throw new Error("Invalid rate value received from DolarAPI");
    }

    return NextResponse.json({
      rate,
      source: "bcv_dolarapi",
      updatedAt: data.fechaActualizacion || new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching BCV rate from DolarAPI:", error);

    // Try a secondary source as fallback
    try {
      const fallbackResponse = await fetch("https://open.er-api.com/v6/latest/USD", {
        next: { revalidate: 43200 },
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const rate = fallbackData?.rates?.VES;
        if (rate && typeof rate === "number") {
          return NextResponse.json({
            rate,
            source: "exchange_rate_api",
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (fallbackError) {
      console.error("Error fetching secondary fallback exchange rate:", fallbackError);
    }

    // Return hardcoded fallback if all network calls fail
    return NextResponse.json({
      rate: DEFAULT_FALLBACK_RATE,
      source: "hardcoded_fallback",
      updatedAt: new Date().toISOString(),
    });
  }
}
