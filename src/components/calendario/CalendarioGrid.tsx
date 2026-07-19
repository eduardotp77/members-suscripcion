/**
 * CalendarioGrid.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Grid mensual tipo calendario (7 columnas × N filas).
 * Construye la cuadrícula a partir del mes activo y delega el render de
 * cada celda a <CalendarDayCell>.
 *
 * Lógica de offset:
 *   El primer día de la semana es LUNES (estándar europeo/latinoamericano).
 *   getDay() devuelve 0=Dom…6=Sáb → se ajusta con (getDay() + 6) % 7
 *   para que Lunes=0, Martes=1 … Domingo=6.
 *
 * Props:
 *  - mesActual        : mes y año actualmente visible
 *  - vencimientosPorFecha : Map "yyyy-MM-dd" → Cliente[]
 *  - pagosPorFecha        : Map "yyyy-MM-dd" → Pago[]
 *  - diaSeleccionado      : Date | null del día activo
 *  - mostrarVenc          : toggle global de chips de vencimientos
 *  - mostrarPagos         : toggle global de dots de pagos
 *  - onSelectDay          : callback al hacer click en una celda
 */

import { useMemo } from "react";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDay,
  isSameDay,
  format,
} from "date-fns";
import { Cliente, Pago } from "@/types";
import { CalendarDayCell } from "./CalendarDayCell";

// ─── Constantes ─────────────────────────────────────────────────────────────

/** Cabecera de días de la semana (Lunes primero) */
const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"] as const;

// ─── Props ──────────────────────────────────────────────────────────────────

interface CalendarioGridProps {
  mesActual: Date;
  vencimientosPorFecha: Map<string, Cliente[]>;
  pagosPorFecha: Map<string, Pago[]>;
  diaSeleccionado: Date | null;
  mostrarVenc: boolean;
  mostrarPagos: boolean;
  onSelectDay: (date: Date) => void;
}

// ─── Componente ─────────────────────────────────────────────────────────────

export function CalendarioGrid({
  mesActual,
  vencimientosPorFecha,
  pagosPorFecha,
  diaSeleccionado,
  mostrarVenc,
  mostrarPagos,
  onSelectDay,
}: CalendarioGridProps) {
  const hoy = useMemo(() => new Date(), []);

  /**
   * Genera el arreglo de días del mes actual.
   * Se memoiza para que no recalcule en cada render mientras el mes no cambie.
   */
  const diasDelMes = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(mesActual), end: endOfMonth(mesActual) }),
    [mesActual]
  );

  /**
   * Calcula cuántas celdas vacías poner antes del día 1.
   * Ajuste: domingo (0) pasa a posición 6 (último de la semana).
   */
  const offsetPrimerDia = useMemo(
    () => (getDay(diasDelMes[0]) + 6) % 7,
    [diasDelMes]
  );

  return (
    <div>
      {/* ── Cabecera de días de la semana ──────────────────────────── */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-white/40"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* ── Cuadrícula de celdas ───────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-1">
        {/* Celdas vacías de relleno hasta el primer día del mes */}
        {Array.from({ length: offsetPrimerDia }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[88px]" />
        ))}

        {/* Una celda por cada día del mes */}
        {diasDelMes.map((dia) => {
          // Clave única del día para buscar en los mapas
          const key = format(dia, "yyyy-MM-dd");
          const clientesDia = vencimientosPorFecha.get(key) ?? [];
          const pagosDia = pagosPorFecha.get(key) ?? [];

          return (
            <CalendarDayCell
              key={key}
              date={dia}
              mesActual={mesActual}
              clientes={clientesDia}
              pagos={pagosDia}
              isToday={isSameDay(dia, hoy)}
              isSelected={diaSeleccionado ? isSameDay(dia, diaSeleccionado) : false}
              mostrarVenc={mostrarVenc}
              mostrarPagos={mostrarPagos}
              onSelect={onSelectDay}
            />
          );
        })}
      </div>
    </div>
  );
}
