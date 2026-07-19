-- Crear enums para tipos
CREATE TYPE public.tipo_suscripcion AS ENUM ('mensual', 'trimestral', 'semestral', 'anual', 'vitalicio');
CREATE TYPE public.medio_pago AS ENUM ('stripe', 'binance', 'paypal');
CREATE TYPE public.estado_suscripcion AS ENUM ('activa', 'vencida', 'pendiente', 'cancelada');
CREATE TYPE public.concepto_pago AS ENUM ('nuevo', 'renovacion');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de clientes/suscripciones
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  whatsapp TEXT,
  producto TEXT NOT NULL,
  tipo_suscripcion public.tipo_suscripcion NOT NULL,
  medio_pago public.medio_pago NOT NULL,
  valor_cobrado NUMERIC(10, 2) NOT NULL CHECK (valor_cobrado >= 0),
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE,
  estado public.estado_suscripcion NOT NULL DEFAULT 'activa',
  notas TEXT,
  total_renovaciones INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, correo)
);

-- Tabla de historial de pagos
CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  cliente_nombre TEXT NOT NULL,
  monto NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
  medio_pago public.medio_pago NOT NULL,
  concepto public.concepto_pago NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas RLS para clientes
CREATE POLICY "Users can view own clients"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para pagos
CREATE POLICY "Users can view own payments"
  ON public.pagos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON public.pagos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nombre', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para mejorar rendimiento
CREATE INDEX idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX idx_clientes_estado ON public.clientes(estado);
CREATE INDEX idx_clientes_fecha_vencimiento ON public.clientes(fecha_vencimiento);
CREATE INDEX idx_pagos_user_id ON public.pagos(user_id);
CREATE INDEX idx_pagos_cliente_id ON public.pagos(cliente_id);
CREATE INDEX idx_pagos_fecha ON public.pagos(fecha);