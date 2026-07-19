-- ============================================================================
-- MIGRACIÓN: Soporte para transferencias entre cuentas
-- Fecha: 25 Mayo 2026
-- Descripción: Agrega transfer_id a transacciones para vincular el par
--              de movimientos que forman una transferencia (gasto + ingreso)
-- ============================================================================

ALTER TABLE transacciones
  ADD COLUMN IF NOT EXISTS transfer_id UUID DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_transacciones_transfer
  ON transacciones(transfer_id)
  WHERE transfer_id IS NOT NULL;

COMMENT ON COLUMN transacciones.transfer_id IS
  'UUID compartido entre las dos transacciones de una transferencia entre cuentas.
   NULL = transacción normal. Con valor = parte de una transferencia.';
