-- Agregar 'hotmart' al enum medio_pago
ALTER TYPE public.medio_pago ADD VALUE 'hotmart';

-- Nota: Los valores de enum en PostgreSQL no se pueden eliminar fácilmente,
-- solo se pueden agregar. Esta migración es irreversible.
