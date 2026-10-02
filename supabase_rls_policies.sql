-- ====================================================================
-- SCRIPT DE CONFIGURACIÓN RLS (ROW LEVEL SECURITY) EN SUPABASE - BORCEGUÍ
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase
-- URL: https://supabase.com/dashboard/project/swqtwrmmhskfchflvrxo/sql
-- ====================================================================

-- 1. MIGRACIONES DE COLUMNAS (Manejo de columnas faltantes)
ALTER TABLE IF EXISTS store_config ADD COLUMN IF NOT EXISTS store_address TEXT;
ALTER TABLE IF EXISTS store_config ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE IF EXISTS store_config ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS model_code TEXT;

-- 2. TABLA: store_config
ALTER TABLE IF EXISTS store_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de store_config" ON store_config;
DROP POLICY IF EXISTS "Permitir escrituras de store_config" ON store_config;

CREATE POLICY "Permitir lectura publica de store_config"
  ON store_config FOR SELECT
  USING (true);

CREATE POLICY "Permitir escrituras de store_config"
  ON store_config FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. TABLA: payment_methods
ALTER TABLE IF EXISTS payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "Permitir escrituras de payment_methods" ON payment_methods;

CREATE POLICY "Permitir lectura publica de payment_methods"
  ON payment_methods FOR SELECT
  USING (true);

CREATE POLICY "Permitir escrituras de payment_methods"
  ON payment_methods FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. TABLA: products
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de products" ON products;
DROP POLICY IF EXISTS "Permitir escrituras de products" ON products;

CREATE POLICY "Permitir lectura publica de products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Permitir escrituras de products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. TABLA: product_sizes
ALTER TABLE IF EXISTS product_sizes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de product_sizes" ON product_sizes;
DROP POLICY IF EXISTS "Permitir escrituras de product_sizes" ON product_sizes;

CREATE POLICY "Permitir lectura publica de product_sizes"
  ON product_sizes FOR SELECT
  USING (true);

CREATE POLICY "Permitir escrituras de product_sizes"
  ON product_sizes FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. VERIFICACIÓN: Conceder permisos al rol anon y authenticated
GRANT ALL ON store_config TO anon, authenticated, service_role;
GRANT ALL ON payment_methods TO anon, authenticated, service_role;
GRANT ALL ON products TO anon, authenticated, service_role;
GRANT ALL ON product_sizes TO anon, authenticated, service_role;
