-- ============================================================================
-- MIGRACIÓN: Módulo de Finanzas v1.0.0
-- Fecha: 14 Mayo 2026
-- Descripción: Sistema completo de gestión financiera para el negocio
--              con soporte multi-moneda y retiros personales
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. TABLA: cuentas (Cuentas bancarias, efectivo, PayPal, etc.)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cuentas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  nombre VARCHAR(100) NOT NULL,                    -- "Cuenta Corriente Bancolombia"
  tipo VARCHAR(20) NOT NULL                        -- "banco", "efectivo", "tarjeta", "paypal", "crypto"
    CHECK (tipo IN ('banco', 'efectivo', 'tarjeta', 'paypal', 'crypto', 'otro')),
  
  moneda VARCHAR(3) NOT NULL DEFAULT 'USD'         -- USD, BRL, COP, etc.
    CHECK (moneda IN ('USD', 'BRL', 'COP', 'MXN', 'ARS', 'CLP', 'PEN', 'EUR')),
  
  saldo_inicial DECIMAL(12,2) DEFAULT 0,           -- Balance al crear la cuenta
  saldo_actual DECIMAL(12,2) DEFAULT 0,            -- Balance actual (calculado)
  
  color VARCHAR(7),                                 -- #3b82f6 (para UI)
  icono VARCHAR(50),                                -- "bank", "wallet", "card", "bitcoin"
  
  activa BOOLEAN DEFAULT true,
  descripcion TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar queries
CREATE INDEX idx_cuentas_user ON cuentas(user_id);
CREATE INDEX idx_cuentas_activa ON cuentas(activa);

-- RLS (Row Level Security)
ALTER TABLE cuentas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cuentas"
  ON cuentas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cuentas"
  ON cuentas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cuentas"
  ON cuentas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cuentas"
  ON cuentas FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. TABLA: categorias_finanzas (Categorías de ingresos/gastos)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categorias_finanzas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  nombre VARCHAR(100) NOT NULL,                    -- "Marketing Digital"
  tipo VARCHAR(10) NOT NULL                        -- "ingreso" o "gasto"
    CHECK (tipo IN ('ingreso', 'gasto')),
  
  color VARCHAR(7),                                 -- #ef4444
  icono VARCHAR(50),                                -- "shopping", "tech", "food"
  
  presupuesto_mensual DECIMAL(12,2),               -- Budget asignado (opcional)
  
  categoria_padre UUID REFERENCES categorias_finanzas(id) ON DELETE SET NULL,  -- Para subcategorías
  
  es_retiro_personal BOOLEAN DEFAULT false,        -- Categoría especial para retiros
  
  activa BOOLEAN DEFAULT true,
  descripcion TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_categorias_user ON categorias_finanzas(user_id);
CREATE INDEX idx_categorias_tipo ON categorias_finanzas(tipo);
CREATE INDEX idx_categorias_activa ON categorias_finanzas(activa);

-- RLS
ALTER TABLE categorias_finanzas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categorias"
  ON categorias_finanzas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categorias"
  ON categorias_finanzas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorias"
  ON categorias_finanzas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorias"
  ON categorias_finanzas FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. TABLA: tasas_cambio (Tasas de conversión de monedas)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tasas_cambio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  moneda_origen VARCHAR(3) NOT NULL,               -- Siempre será USD
  moneda_destino VARCHAR(3) NOT NULL               -- BRL, COP, MXN, etc.
    CHECK (moneda_destino IN ('BRL', 'COP', 'MXN', 'ARS', 'CLP', 'PEN', 'EUR')),
  
  tasa DECIMAL(10,4) NOT NULL,                     -- Ej: 5.0200 (1 USD = 5.02 BRL)
  
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  
  es_manual BOOLEAN DEFAULT false,                 -- true si fue ingresada manualmente
  fuente VARCHAR(50) DEFAULT 'exchangerate-api',   -- Fuente de la tasa
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(moneda_origen, moneda_destino, fecha)
);

-- Índices
CREATE INDEX idx_tasas_fecha ON tasas_cambio(fecha DESC);
CREATE INDEX idx_tasas_destino ON tasas_cambio(moneda_destino);

-- No necesita RLS porque es data pública (tasas de cambio)

-- ────────────────────────────────────────────────────────────────────────────
-- 4. TABLA: transacciones (Movimientos de dinero)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  cuenta_id UUID REFERENCES cuentas(id) ON DELETE SET NULL,
  categoria_id UUID REFERENCES categorias_finanzas(id) ON DELETE SET NULL,
  
  tipo VARCHAR(10) NOT NULL                        -- "ingreso" o "gasto"
    CHECK (tipo IN ('ingreso', 'gasto')),
  
  -- Multi-moneda
  monto DECIMAL(12,2) NOT NULL,                    -- Monto en la moneda original
  moneda VARCHAR(3) NOT NULL DEFAULT 'USD'         -- Moneda de la transacción
    CHECK (moneda IN ('USD', 'BRL', 'COP', 'MXN', 'ARS', 'CLP', 'PEN', 'EUR')),
  
  -- Conversión a USD (moneda base del negocio)
  monto_usd DECIMAL(12,2) NOT NULL,                -- Monto convertido a USD
  tasa_cambio DECIMAL(10,4),                       -- Tasa usada en la conversión
  
  concepto VARCHAR(255) NOT NULL,                  -- "Pago VPS Mayo"
  descripcion TEXT,
  
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Metadata
  es_retiro_personal BOOLEAN DEFAULT false,        -- true si es retiro personal
  
  etiquetas TEXT[],                                -- ["importante", "deducible"]
  adjunto_url TEXT,                                -- URL de factura/recibo
  
  -- Relación con módulo de clientes (opcional)
  pago_cliente_id UUID,                            -- Si viene de un pago de cliente
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar queries
CREATE INDEX idx_transacciones_user ON transacciones(user_id);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha DESC);
CREATE INDEX idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX idx_transacciones_moneda ON transacciones(moneda);
CREATE INDEX idx_transacciones_categoria ON transacciones(categoria_id);
CREATE INDEX idx_transacciones_cuenta ON transacciones(cuenta_id);
CREATE INDEX idx_transacciones_retiro ON transacciones(es_retiro_personal);

-- RLS
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transacciones"
  ON transacciones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transacciones"
  ON transacciones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transacciones"
  ON transacciones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transacciones"
  ON transacciones FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. FUNCIÓN: Actualizar saldo de cuenta automáticamente
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION actualizar_saldo_cuenta()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se inserta una transacción, actualizar el saldo de la cuenta
  IF (TG_OP = 'INSERT') THEN
    IF NEW.cuenta_id IS NOT NULL THEN
      UPDATE cuentas
      SET saldo_actual = saldo_actual + 
        CASE 
          WHEN NEW.tipo = 'ingreso' THEN NEW.monto
          WHEN NEW.tipo = 'gasto' THEN -NEW.monto
        END
      WHERE id = NEW.cuenta_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Cuando se elimina una transacción, revertir el saldo
  IF (TG_OP = 'DELETE') THEN
    IF OLD.cuenta_id IS NOT NULL THEN
      UPDATE cuentas
      SET saldo_actual = saldo_actual - 
        CASE 
          WHEN OLD.tipo = 'ingreso' THEN OLD.monto
          WHEN OLD.tipo = 'gasto' THEN -OLD.monto
        END
      WHERE id = OLD.cuenta_id;
    END IF;
    RETURN OLD;
  END IF;
  
  -- Cuando se actualiza una transacción
  IF (TG_OP = 'UPDATE') THEN
    -- Revertir saldo antiguo
    IF OLD.cuenta_id IS NOT NULL THEN
      UPDATE cuentas
      SET saldo_actual = saldo_actual - 
        CASE 
          WHEN OLD.tipo = 'ingreso' THEN OLD.monto
          WHEN OLD.tipo = 'gasto' THEN -OLD.monto
        END
      WHERE id = OLD.cuenta_id;
    END IF;
    
    -- Aplicar nuevo saldo
    IF NEW.cuenta_id IS NOT NULL THEN
      UPDATE cuentas
      SET saldo_actual = saldo_actual + 
        CASE 
          WHEN NEW.tipo = 'ingreso' THEN NEW.monto
          WHEN NEW.tipo = 'gasto' THEN -NEW.monto
        END
      WHERE id = NEW.cuenta_id;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar saldos automáticamente
CREATE TRIGGER trigger_actualizar_saldo
  AFTER INSERT OR UPDATE OR DELETE ON transacciones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_saldo_cuenta();

-- ────────────────────────────────────────────────────────────────────────────
-- 6. FUNCIÓN: Actualizar updated_at automáticamente
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_cuentas_updated_at
  BEFORE UPDATE ON cuentas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_categorias_updated_at
  BEFORE UPDATE ON categorias_finanzas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_transacciones_updated_at
  BEFORE UPDATE ON transacciones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 7. DATOS INICIALES: Categorías predefinidas
-- ────────────────────────────────────────────────────────────────────────────

-- Nota: Estas categorías se crearán al crear el primer usuario
-- Se pueden insertar con un trigger o desde la app en el primer uso

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================

-- COMENTARIOS:
-- Esta migración crea la estructura base para el módulo de finanzas.
-- Incluye:
--   - 4 tablas principales (cuentas, categorias, tasas_cambio, transacciones)
--   - RLS habilitado en todas las tablas de usuario
--   - Índices para optimizar queries
--   - Triggers para actualizar saldos automáticamente
--   - Triggers para updated_at
--   - Soporte multi-moneda completo
--   - Categoría especial para retiros personales
