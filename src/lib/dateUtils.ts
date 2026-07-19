/**
 * Utilidades centralizadas para manejo de fechas
 * 
 * Este archivo soluciona problemas de zona horaria al convertir fechas
 * entre strings ISO y objetos Date. Usa date-fns consistentemente para
 * evitar bugs causados por interpretaciones UTC vs Local.
 * 
 * IMPORTANTE: Todas las fechas en la BD están almacenadas como DATE (sin timezone).
 * Al parsear, debemos tratarlas como fechas locales, no UTC.
 * 
 * @see https://date-fns.org/docs/parseISO
 */

import { 
  parseISO, 
  startOfDay, 
  endOfDay, 
  startOfMonth, 
  endOfMonth,
  isSameDay,
  format,
  addMonths,
  subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';

// ═══════════════════════════════════════════════════════════════════════════
// PARSING Y CONVERSIÓN DE FECHAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convierte un string de fecha ISO a objeto Date en hora local
 * 
 * parseISO interpreta fechas sin timezone como locales, lo cual es el
 * comportamiento correcto para fechas almacenadas como DATE en PostgreSQL.
 * 
 * @example
 * parseFechaLocal("2026-05-13") → Date(2026-05-13 00:00:00 LOCAL)
 * 
 * @param fechaString - Fecha en formato ISO "YYYY-MM-DD"
 * @returns Objeto Date en hora local
 */
export function parseFechaLocal(fechaString: string): Date {
  return parseISO(fechaString);
}

/**
 * Normaliza una fecha a medianoche (00:00:00) en hora local
 * Útil para comparaciones de fechas sin considerar la hora
 * 
 * @param fecha - String ISO o objeto Date
 * @returns Date normalizado a medianoche local
 */
export function normalizarFecha(fecha: string | Date): Date {
  const f = typeof fecha === 'string' ? parseFechaLocal(fecha) : fecha;
  return startOfDay(f);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARACIONES Y RANGOS DE FECHAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Verifica si una fecha está en el rango [desde, hasta] (ambos inclusivos)
 * Normaliza todas las fechas a medianoche antes de comparar
 * 
 * @param fecha - Fecha a verificar (string ISO o Date)
 * @param desde - Fecha inicial del rango
 * @param hasta - Fecha final del rango
 * @returns true si la fecha está en el rango
 */
export function estaEnRango(fecha: string | Date, desde: Date, hasta: Date): boolean {
  const fechaNorm = normalizarFecha(fecha);
  const desdeNorm = startOfDay(desde);
  const hastaNorm = endOfDay(hasta);
  return fechaNorm >= desdeNorm && fechaNorm <= hastaNorm;
}

/**
 * Verifica si una fecha es el mismo día que otra (ignora hora)
 * 
 * @param fecha1 - Primera fecha (string ISO o Date)
 * @param fecha2 - Segunda fecha (Date)
 * @returns true si son el mismo día
 */
export function esMismoDia(fecha1: string | Date, fecha2: Date): boolean {
  const f1 = typeof fecha1 === 'string' ? parseFechaLocal(fecha1) : fecha1;
  return isSameDay(f1, fecha2);
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMATEO Y PRESENTACIÓN DE FECHAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene la clave de mes en formato "YYYY-MM" para agrupar transacciones
 * Usa parseISO para evitar problemas de zona horaria
 * 
 * @example
 * obtenerClaveMes("2026-05-13") → "2026-05"
 * 
 * @param fecha - Fecha en formato ISO "YYYY-MM-DD"
 * @returns String "YYYY-MM"
 */
export function obtenerClaveMes(fecha: string): string {
  return format(parseFechaLocal(fecha), 'yyyy-MM');
}

/**
 * Obtiene el nombre completo del mes en español desde una clave "YYYY-MM"
 * 
 * @example
 * obtenerNombreMes("2026-05") → "mayo 2026"
 * 
 * @param claveMes - String en formato "YYYY-MM"
 * @returns Nombre del mes en español con año
 */
export function obtenerNombreMes(claveMes: string): string {
  return format(parseFechaLocal(claveMes + '-01'), 'MMMM yyyy', { locale: es });
}

/**
 * Formatea una fecha en formato legible: "13 de mayo"
 * 
 * @param fecha - String ISO o Date
 * @returns String formateado
 */
export function formatearFechaLegible(fecha: string | Date): string {
  const f = typeof fecha === 'string' ? parseFechaLocal(fecha) : fecha;
  return format(f, "d 'de' MMMM", { locale: es });
}

/**
 * Formatea una fecha en formato compacto para etiquetas: "13 may"
 * 
 * @param fecha - Date
 * @returns String formateado
 */
export function formatearFechaDia(fecha: Date): string {
  return format(fecha, "d MMM", { locale: es });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES PARA RANGOS DE MESES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el primer día del mes actual
 * 
 * @returns Date del primer día del mes (medianoche)
 */
export function obtenerPrimerDiaMesActual(): Date {
  return startOfMonth(new Date());
}

/**
 * Obtiene el último día del mes actual
 * 
 * @returns Date del último día del mes (23:59:59.999)
 */
export function obtenerUltimoDiaMesActual(): Date {
  return endOfMonth(new Date());
}

/**
 * Obtiene el número de días en un mes específico
 * 
 * @param año - Año (ej: 2026)
 * @param mes - Mes (0-11, donde 0 = enero)
 * @returns Número de días en el mes
 */
export function obtenerDiasEnMes(año: number, mes: number): number {
  return endOfMonth(new Date(año, mes, 1)).getDate();
}

/**
 * Genera un array de fechas con todos los días de un mes
 * Útil para iterar sobre cada día del mes
 * 
 * @param año - Año (ej: 2026)
 * @param mes - Mes (0-11, donde 0 = enero)
 * @returns Array de objetos Date, uno por cada día del mes
 */
export function obtenerDiasDelMes(año: number, mes: number): Date[] {
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = endOfMonth(primerDia);
  const dias: Date[] = [];
  
  const fecha = new Date(primerDia);
  while (fecha <= ultimoDia) {
    dias.push(new Date(fecha));
    fecha.setDate(fecha.getDate() + 1);
  }
  
  return dias;
}

/**
 * Obtiene el rango de fechas para un mes específico
 * 
 * @param año - Año
 * @param mes - Mes (0-11)
 * @returns Objeto con primerDia y ultimoDia del mes
 */
export function obtenerRangoMes(año: number, mes: number): { primerDia: Date; ultimoDia: Date } {
  const primerDia = startOfMonth(new Date(año, mes, 1));
  const ultimoDia = endOfMonth(new Date(año, mes, 1));
  return { primerDia, ultimoDia };
}

/**
 * Obtiene el rango de fechas del mes anterior
 * 
 * @returns Objeto con primerDia y ultimoDia del mes anterior
 */
export function obtenerRangoMesAnterior(): { primerDia: Date; ultimoDia: Date } {
  const hoy = new Date();
  const mesAnterior = subMonths(hoy, 1);
  return obtenerRangoMes(mesAnterior.getFullYear(), mesAnterior.getMonth());
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES PARA FECHA ACTUAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene la fecha actual (hoy) como string ISO "YYYY-MM-DD"
 * Útil para valores por defecto en formularios
 * 
 * @returns String ISO de la fecha actual
 */
export function obtenerFechaHoyISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Obtiene el mes y año actual como objeto
 * 
 * @returns Objeto con año y mes (0-11)
 */
export function obtenerMesYAñoActual(): { año: number; mes: number } {
  const hoy = new Date();
  return {
    año: hoy.getFullYear(),
    mes: hoy.getMonth()
  };
}
