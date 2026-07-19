-- Tabla de notas tipo timeline por cliente
-- Permite registrar conversaciones, acuerdos y eventos sin modificar el cliente

CREATE TABLE public.notas_cliente (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cliente_id  uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  contenido   text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Índice para consultas por cliente
CREATE INDEX notas_cliente_cliente_id_idx ON public.notas_cliente(cliente_id);
CREATE INDEX notas_cliente_user_id_idx ON public.notas_cliente(user_id);

-- RLS: cada usuario solo ve y gestiona sus propias notas
ALTER TABLE public.notas_cliente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven sus notas"
  ON public.notas_cliente FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "usuarios crean sus notas"
  ON public.notas_cliente FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan sus notas"
  ON public.notas_cliente FOR DELETE
  USING (auth.uid() = user_id);
