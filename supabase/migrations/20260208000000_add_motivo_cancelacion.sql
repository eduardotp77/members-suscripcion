-- Agregar campo para motivo de cancelación
ALTER TABLE public.clientes 
ADD COLUMN motivo_cancelacion TEXT;

-- Agregar comentario para documentar el campo
COMMENT ON COLUMN public.clientes.motivo_cancelacion IS 'Motivo o razón por la cual se canceló la suscripción';