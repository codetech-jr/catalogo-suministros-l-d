-- ============================================================================
-- SQL DDL Schema Initialization Script
-- Project: Suministros L&D - E-commerce
-- File: 001-init-schema.sql
-- Description: Establishes base tables (categories, products, config_tasas)
--              with strong relational constraints, automatic updated_at trigger,
--              Row Level Security (RLS) policies, indexes, and base seed data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & UTILITIES
-- ----------------------------------------------------------------------------
-- Habilitar la extensión para generación de UUIDs si no está activa.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Función reutilizable para actualizar la columna updated_at automáticamente.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. TABLE: categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~* '^[a-z0-9-]+$'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.categories IS 'Categorías de productos de ferretería y electricidad.';
COMMENT ON COLUMN public.categories.slug IS 'Identificador amigable para URLs, debe cumplir con formato kebab-case.';

-- ----------------------------------------------------------------------------
-- 2. TABLE: products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(sku) >= 3),
    name TEXT NOT NULL CHECK (char_length(name) >= 3),
    description TEXT,
    base_price_usd NUMERIC(10,2) NOT NULL CHECK (base_price_usd >= 0.00),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    image_url TEXT,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- B2B Wholesale Columns
    wholesale_enabled BOOLEAN NOT NULL DEFAULT false,
    wholesale_min_units INTEGER CHECK (wholesale_min_units >= 1),
    wholesale_price_usd NUMERIC(10,2) CHECK (wholesale_price_usd >= 0.00),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Constraints for Wholesale consistency
    CONSTRAINT chk_wholesale_config CHECK (
        (wholesale_enabled = false) OR 
        (wholesale_enabled = true 
         AND wholesale_min_units IS NOT NULL 
         AND wholesale_price_usd IS NOT NULL 
         AND wholesale_price_usd <= base_price_usd)
    )
);

COMMENT ON TABLE public.products IS 'Catálogo principal de productos con soporte para descuentos B2B.';
COMMENT ON COLUMN public.products.base_price_usd IS 'Precio de venta al detal en USD. Protege contra la inflación de la moneda local.';
COMMENT ON COLUMN public.products.specs IS 'Estructura flexible para almacenar propiedades variables (Voltaje, Color, Calibre, etc.) sin indexación rígida.';

-- ----------------------------------------------------------------------------
-- 3. TABLE: config_tasas
-- ----------------------------------------------------------------------------
-- Esta tabla asegura un único registro global mediante una restricción de ID.
CREATE TABLE IF NOT EXISTS public.config_tasas (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    rate_bcv NUMERIC(10,4) NOT NULL CHECK (rate_bcv > 0.0000),
    rate_binance NUMERIC(10,4) NOT NULL CHECK (rate_binance > 0.0000),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.config_tasas IS 'Registro administrativo de tasas de cambio oficial (BCV) y paralelo (Binance/Reposición).';

-- ----------------------------------------------------------------------------
-- 4. TRIGGERS & INDEXES
-- ----------------------------------------------------------------------------
-- Triggers para actualizar updated_at de manera automática
CREATE OR REPLACE TRIGGER trigger_update_products_timestamp
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_update_config_tasas_timestamp
    BEFORE UPDATE ON public.config_tasas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices explícitos para optimización
-- Nota: PostgreSQL indexa automáticamente las columnas PRIMARY KEY y UNIQUE (como categories.slug y products.sku).
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
-- Índice no único de SKU para optimizar búsquedas directas parciales
CREATE INDEX IF NOT EXISTS idx_products_sku_lookup ON public.products(sku);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) & POLICIES
-- ----------------------------------------------------------------------------
-- Habilitar RLS en todas las tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_tasas ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para categories
CREATE POLICY "Allow public full access to categories" 
    ON public.categories 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Políticas de Seguridad para products
CREATE POLICY "Allow public full access to products" 
    ON public.products 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Políticas de Seguridad para config_tasas
CREATE POLICY "Allow public full access to config_tasas" 
    ON public.config_tasas 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 6. SEED DATA (INITIAL DATA INSERTS)
-- ----------------------------------------------------------------------------
-- Categorías Base
INSERT INTO public.categories (id, name, slug) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Luminaria LED', 'luminaria-led'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Material Pesado', 'material-pesado')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name;

-- Productos Iniciales (Simulación de estado Borrador/Activo)
-- specs incluye pares clave/valor del componente dinámico en frontend.
INSERT INTO public.products (
    sku, 
    name, 
    description, 
    base_price_usd, 
    stock_quantity, 
    category_id, 
    image_url, 
    specs, 
    wholesale_enabled, 
    wholesale_min_units, 
    wholesale_price_usd
) VALUES
    (
        'BOMB-LED-12W', 
        'Bombillo LED 12W Luz Fría E27', 
        'Bombillo de alta potencia lumínica y bajo consumo. Ideal para interiores residenciales.', 
        2.50, 
        150, 
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
        'products/bombillo-led-12w.webp', 
        '{"voltaje": "110-220V", "color": "Luz Fría (6500K)", "vida_util": "25.000 horas", "rosca": "E27"}'::jsonb,
        true, 
        12, 
        1.99
    ),
    (
        'CBL-THHN-12-RD', 
        'Cable Cobre THHN Calibre 12 Rojo', 
        'Conductor de cobre suave con aislamiento de PVC y cubierta de nylon. Presentación rollo de 100 metros.', 
        45.00, 
        20, 
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
        'products/cable-thhn-12-red.webp', 
        '{"calibre": "12 AWG", "color": "Rojo", "material": "Cobre", "longitud": "100m", "temperatura": "90°C"}'::jsonb,
        true, 
        5, 
        39.99
    ),
    (
        'PANEL-LED-60X60', 
        'Panel LED Embutir 60x60 40W', 
        'Panel LED empotrable extraplano para techo raso o drywall. Excelente distribución de luz de oficina.', 
        15.00, 
        0, -- Agotado para simular estados y validaciones en frontend
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
        'products/panel-60x60.webp', 
        '{"dimensiones": "60x60 cm", "potencia": "40W", "voltaje": "85-265V", "color": "Luz Fría"}'::jsonb,
        false, 
        NULL, 
        NULL
    )
ON CONFLICT (sku) DO UPDATE 
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price_usd = EXCLUDED.base_price_usd,
    stock_quantity = EXCLUDED.stock_quantity,
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    specs = EXCLUDED.specs,
    wholesale_enabled = EXCLUDED.wholesale_enabled,
    wholesale_min_units = EXCLUDED.wholesale_min_units,
    wholesale_price_usd = EXCLUDED.wholesale_price_usd;

-- Tasa Cambiaria Inicial (BCV y Binance)
-- Mantiene id = 1 garantizando que solo exista esta fila de configuración.
INSERT INTO public.config_tasas (id, rate_bcv, rate_binance) 
VALUES (1, 36.5000, 40.0000)
ON CONFLICT (id) DO UPDATE 
SET rate_bcv = EXCLUDED.rate_bcv,
    rate_binance = EXCLUDED.rate_binance,
    updated_at = timezone('utc'::text, now());
