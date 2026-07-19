-- Permitir que un mismo cliente (correo) pueda tener múltiples productos registrados.
-- Se elimina la restricción UNIQUE(user_id, correo) y se reemplaza por
-- UNIQUE(user_id, correo, producto), de modo que la combinación correo+producto
-- debe ser única por usuario, pero el mismo correo puede tener distintos productos.

ALTER TABLE public.clientes
  DROP CONSTRAINT IF EXISTS clientes_user_id_correo_key;

ALTER TABLE public.clientes
  ADD CONSTRAINT clientes_user_id_correo_producto_key
  UNIQUE (user_id, correo, producto);
