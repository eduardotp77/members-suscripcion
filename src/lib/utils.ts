import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, format, differenceInDays, parseISO, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { TipoSuscripcion, EstadoSuscripcion, Cliente } from "@/types";
import { diasPorTipo } from "./theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcularFechaVencimiento(fechaInicio: string | Date, tipoSuscripcion: TipoSuscripcion): string | null {
  const dias = diasPorTipo[tipoSuscripcion];
  if (dias === null) return null;
  const fecha = typeof fechaInicio === 'string' ? parseISO(fechaInicio) : fechaInicio;
  return format(addDays(fecha, dias), 'yyyy-MM-dd');
}

export function calcularEstadoSuscripcion(fechaVencimiento: string | null, estadoActual: EstadoSuscripcion): EstadoSuscripcion {
  if (estadoActual === 'cancelada') return 'cancelada';
  if (fechaVencimiento === null) return 'activa';
  return isBefore(parseISO(fechaVencimiento), new Date()) ? 'vencida' : 'activa';
}

export function diasHastaVencimiento(fechaVencimiento: string | null): number | null {
  if (fechaVencimiento === null) return null;
  return differenceInDays(parseISO(fechaVencimiento), new Date());
}

export function formatearFecha(fecha: string | null): string {
  if (!fecha) return 'Sin vencimiento';
  try { return format(parseISO(fecha), "d 'de' MMMM, yyyy", { locale: es }); } catch { return fecha; }
}

/**
 * Formatea una fecha en formato compacto DD/MM/YYYY
 * Nota: Para formato legible "13 de mayo", usar formatearFechaLegible de dateUtils.ts
 */
export function formatearFechaCorta(fecha: string | null): string {
  if (!fecha) return '-';
  try { return format(parseISO(fecha), 'dd/MM/yyyy'); } catch { return fecha; }
}

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(valor);
}

export function obtenerProximasVencer(clientes: Cliente[], diasLimite: number = 7): Cliente[] {
  return clientes.filter(c => {
    if (!c.fechaVencimiento || c.estado === 'cancelada') return false;
    const dias = diasHastaVencimiento(c.fechaVencimiento);
    return dias !== null && dias >= 0 && dias <= diasLimite;
  }).sort((a, b) => (diasHastaVencimiento(a.fechaVencimiento) ?? 0) - (diasHastaVencimiento(b.fechaVencimiento) ?? 0));
}

export function generarId(): string { return crypto.randomUUID(); }

/**
 * Valida formato de correo electrónico con regex más estricta
 * Rechaza emails obviamente inválidos como "a@b.c"
 */
export function validarCorreo(correo: string): boolean {
  // Regex mejorada que requiere al menos 2 caracteres en el dominio
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!regex.test(correo)) return false;
  
  // Validaciones adicionales
  const [localPart, domain] = correo.split('@');
  
  // El local-part debe tener al menos 1 carácter
  if (localPart.length < 1) return false;
  
  // El dominio debe tener al menos 3 caracteres (ej: a.co)
  if (domain.length < 3) return false;
  
  // No permitir puntos consecutivos
  if (correo.includes('..')) return false;
  
  return true;
}

/** Calcula el porcentaje de cambio entre dos valores. Retorna null si el anterior es 0. */
export function calcularTendencia(actual: number, anterior: number): { valor: number; positiva: boolean } | null {
  if (anterior === 0) return null;
  const porcentaje = Math.round(((actual - anterior) / anterior) * 100);
  return { valor: Math.abs(porcentaje), positiva: porcentaje >= 0 };
}
