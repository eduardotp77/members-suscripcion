/**
 * CalendarDayCell.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Celda individual del grid del calendario.
 * Muestra el número del día, chips de vencimientos (hasta 2 + desbordamiento),
 * y un punto indicador cuando hay pagos registrados ese día.
 *
 * Props:
 *  - date          : fecha absoluta que representa esta celda
 *  - mesActual     : mes mostrado; celdas fuera del mes se atenúan
 *  - clientes      : vencimientos de ese día (puede ser [])
 *  - pagos         : pagos registrados ese día (puede ser [])
 *  - isToday       : resalta con anillo violeta
 *  - isSelected    : estado de selección activa
 *  - mostrarVenc   : toggle global para ocultar/mostrar chips de vencimientos
 *  - mostrarPagos  : toggle global para ocultar/mostrar punto de pagos
 *  - onSelect      : callback al hacer click en la celda
 */

import { isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Cliente, Pago } from "@/types";

// ─── Helpers de color por estado ────────────────────────────────────────────

/**
 * Devuelve las clases Tailwind del chip según el estado de la suscripción.
 * Mantiene coherencia visual con StatusBadge.tsx.
 */
function chipColorPorEstado(estado: Cliente["estado"]): string {
  switch (estado) {
    case "activa":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "vencida":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "pendiente":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

/**
 * Devuelve el color del dot indicador del chip según estado.
 */
function dotColorPorEstado(estado: Cliente["estado"]): string {
  switch (estado) {
    case "activa":    return "bg-emerald-400";
    case "vencida":   return "bg-red-400";
    case "pendiente": return "bg-amber-400";
    default:          return "bg-gray-400";
  }
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface CalendarDayCellProps {
  date: Date;
  mesActual: Date;
  clientes: Cliente[];
  pagos: Pago[];
  isToday: boolean;
  isSelected: boolean;
  mostrarVenc: boolean;
  mostrarPagos: boolean;
  onSelect: (date: Date) => void;
}

// ─── Componente ─────────────────────────────────────────────────────────────

export function CalendarDayCell({
  date,
  mesActual,
  clientes,
  pagos,
  isToday,
  isSelected,
  mostrarVenc,
  mostrarPagos,
  onSelect,
}: CalendarDayCellProps) {
  // Día pertenece al mes visible (días de relleno se atenúan)
  const esMismoMes = isSameMonth(date, mesActual);

  // Limitar a 2 chips visibles; el resto va en el contador "+N"
  const MAX_CHIPS = 2;
  const chipsMostrados = mostrarVenc ? clientes.slice(0, MAX_CHIPS) : [];
  const overflow = mostrarVenc ? Math.max(0, clientes.length - MAX_CHIPS) : 0;

  // Indicador de pagos del día
  const tienePagos = mostrarPagos && pagos.length > 0;

  return (
    <button
      onClick={() => onSelect(date)}
      className={cn(
        // Base
        "relative flex h-full min-h-[88px] w-full flex-col rounded-lg border p-1.5 text-left",
        "transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        // Sin eventos: fondo muy sutil
        clientes.length === 0 && pagos.length === 0
          ? "border-white/5 bg-transparent hover:bg-white/[0.03]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
        // Día fuera del mes actual
        !esMismoMes && "opacity-30",
        // Día de hoy — anillo violeta
        isToday && "ring-2 ring-primary/60",
        // Día seleccionado — fondo ligeramente más brillante
        isSelected && "border-primary/40 bg-primary/10 hover:bg-primary/15"
      )}
    >
      {/* ── Número del día ─────────────────────────────────────────── */}
      <span
        className={cn(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isToday
            ? "bg-primary text-white"           // hoy: fondo violeta
            : isSelected
            ? "text-primary"                    // seleccionado: texto violeta
            : esMismoMes
            ? "text-white/80"                   // mes actual: blanco
            : "text-white/30"                   // mes adyacente: gris
        )}
      >
        {date.getDate()}
      </span>

      {/* ── Chips de vencimientos ──────────────────────────────────── */}
      {chipsMostrados.length > 0 && (
        <div className="mt-1 flex flex-col gap-0.5">
          {chipsMostrados.map((c) => (
            <span
              key={c.id}
              className={cn(
                "flex items-center gap-1 truncate rounded border px-1 py-0.5 text-[10px] leading-tight",
                chipColorPorEstado(c.estado)
              )}
            >
              {/* Dot de estado */}
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColorPorEstado(c.estado))} />
              {/* Nombre truncado para que quepa en la celda */}
              <span className="truncate">{c.nombre.split(" ")[0]}</span>
            </span>
          ))}

          {/* Desbordamiento: "+N más" */}
          {overflow > 0 && (
            <span className="pl-0.5 text-[10px] text-white/40">
              +{overflow} más
            </span>
          )}
        </div>
      )}

      {/* ── Dot indicador de pagos (esquina inferior derecha) ─────── */}
      {tienePagos && (
        <span
          className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"
          title={`${pagos.length} pago(s) este día`}
        />
      )}
    </button>
  );
}
