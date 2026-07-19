/**
 * Calendario.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Página principal de la Vista Calendario.
 *
 * Estructura:
 *   ┌──────────────────────────────────────────────────────┐
 *   │ Header: título + navegación de mes + toggles         │
 *   ├──────────────────────────────────┬───────────────────┤
 *   │ Mini-stats del mes (4 tarjetas)  │                   │
 *   ├──────────────────────────────────┤  Panel lateral    │
 *   │                                  │  (día selec.)     │
 *   │       CalendarioGrid             │                   │
 *   │                                  │                   │
 *   └──────────────────────────────────┴───────────────────┘
 *
 * Fuentes de datos:
 *  - useClientes() → vencimientosPorFecha, pagosPorFecha, loading
 *  - Todo calculado en memoria; cero queries adicionales a Supabase.
 *
 * Estado local:
 *  - mesActual       : mes/año visible en el grid
 *  - diaSeleccionado : día activo en el panel lateral
 *  - mostrarVenc     : toggle chips de vencimientos
 *  - mostrarPagos    : toggle dots de pagos
 *  - clienteARenovar : cliente para RenovarModal
 */

import { useState, useMemo } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  DollarSign,
  Clock,
  RefreshCw,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { RenovarModal } from "@/components/ui/RenovarModal";
import { TextReveal } from "@/components/ui/TextReveal";
import { CalendarioGrid } from "@/components/calendario/CalendarioGrid";
import { CalendarioDayDetail } from "@/components/calendario/CalendarioDayDetail";
import { useClientes } from "@/hooks/useClientes";
import { formatearMoneda } from "@/lib/utils";
import { Cliente } from "@/types";
import { cn } from "@/lib/utils";

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Calendario() {
  // ── Datos del hook (ya cargados, sin queries extra) ──────────────────
  const {
    loading,
    vencimientosPorFecha,
    pagosPorFecha,
    renovarSuscripcion,
  } = useClientes();

  // ── Estado de navegación ─────────────────────────────────────────────
  /** Mes actualmente visible en el grid */
  const [mesActual, setMesActual] = useState<Date>(() => new Date());

  /** Día activo en el panel lateral; por defecto: hoy */
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(
    () => new Date()
  );

  // ── Toggles de visibilidad ───────────────────────────────────────────
  /** Mostrar/ocultar chips de vencimientos en las celdas */
  const [mostrarVenc, setMostrarVenc] = useState(true);
  /** Mostrar/ocultar dots de pagos en las celdas */
  const [mostrarPagos, setMostrarPagos] = useState(true);

  // ── Estado del modal de renovación ──────────────────────────────────
  const [clienteARenovar, setClienteARenovar] = useState<Cliente | null>(null);

  // ── Navegación entre meses ───────────────────────────────────────────
  const irMesAnterior = () => setMesActual((m) => subMonths(m, 1));
  const irMesSiguiente = () => setMesActual((m) => addMonths(m, 1));
  /** Volver al mes actual y seleccionar el día de hoy */
  const irHoy = () => {
    const hoy = new Date();
    setMesActual(hoy);
    setDiaSeleccionado(hoy);
  };

  // ── Título del mes visible ───────────────────────────────────────────
  const tituloMes = useMemo(() => {
    const raw = format(mesActual, "MMMM yyyy", { locale: es });
    return raw.charAt(0).toUpperCase() + raw.slice(1); // "Marzo 2026"
  }, [mesActual]);

  // ── Mini-estadísticas del mes actual ─────────────────────────────────
  /**
   * Se calculan filtrando los mapas por el rango del mes visible.
   * Todos los datos ya están en memoria → costo O(n) sin IO.
   */
  const statsDelMes = useMemo(() => {
    const inicio = startOfMonth(mesActual);
    const fin = endOfMonth(mesActual);

    let totalVencimientos = 0;
    let ingresosMes = 0;
    let renovacionesMes = 0;

    // Recorrer pagos del mes para ingresos y renovaciones
    pagosPorFecha.forEach((pagos, key) => {
      const fecha = new Date(key + "T00:00:00"); // evitar offsets de timezone
      if (fecha >= inicio && fecha <= fin) {
        pagos.forEach((p) => {
          ingresosMes += p.monto;
          if (p.concepto === "renovacion") renovacionesMes++;
        });
      }
    });

    // Recorrer vencimientos del mes
    vencimientosPorFecha.forEach((clientes, key) => {
      const fecha = new Date(key + "T00:00:00");
      if (fecha >= inicio && fecha <= fin) {
        totalVencimientos += clientes.length;
      }
    });

    return { totalVencimientos, ingresosMes, renovacionesMes };
  }, [mesActual, pagosPorFecha, vencimientosPorFecha]);

  // ── Datos del día seleccionado para el panel lateral ─────────────────
  const { clientesDia, pagosDia } = useMemo(() => {
    if (!diaSeleccionado) return { clientesDia: [], pagosDia: [] };
    const key = format(diaSeleccionado, "yyyy-MM-dd");
    return {
      clientesDia: vencimientosPorFecha.get(key) ?? [],
      pagosDia: pagosPorFecha.get(key) ?? [],
    };
  }, [diaSeleccionado, vencimientosPorFecha, pagosPorFecha]);

  // ── Handlers ─────────────────────────────────────────────────────────

  /** Al hacer click en una celda: actualizar día seleccionado */
  const handleSelectDay = (date: Date) => setDiaSeleccionado(date);

  /** Abrir modal de renovación desde el panel lateral */
  const handleRenovar = (cliente: Cliente) => setClienteARenovar(cliente);

  /** Confirmar renovación y cerrar modal */
  const handleConfirmarRenovacion = async (fechaRenovacion: string) => {
    if (!clienteARenovar) return;
    await renovarSuscripcion(clienteARenovar.id, fechaRenovacion);
    setClienteARenovar(null);
  };

  // ── Loader ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <div className="space-y-6">

        {/* ── Encabezado de la página ──────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <TextReveal delay={0.1}>
              <h1 className="text-3xl font-bold text-white">Calendario</h1>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="mt-1 text-white/60">
                Vencimientos y pagos organizados por día
              </p>
            </TextReveal>
          </div>

          {/* Controles: navegación de mes + toggles + botón Hoy */}
          <div className="flex flex-wrap items-center gap-2">

            {/* Toggle: mostrar vencimientos */}
            <ToggleButton
              active={mostrarVenc}
              color="amber"
              onClick={() => setMostrarVenc((v) => !v)}
              label="Vencimientos"
            />

            {/* Toggle: mostrar pagos */}
            <ToggleButton
              active={mostrarPagos}
              color="emerald"
              onClick={() => setMostrarPagos((v) => !v)}
              label="Pagos"
            />

            {/* Separador visual */}
            <div className="h-6 w-px bg-white/10" />

            {/* Navegación de mes */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={irMesAnterior}
                className="rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="min-w-[130px] text-center text-sm font-semibold text-white">
                {tituloMes}
              </span>

              <button
                onClick={irMesSiguiente}
                className="rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Botón "Hoy" */}
            <button
              onClick={irHoy}
              className={cn(
                "rounded-lg border border-white/10 bg-white/5 px-3 py-1.5",
                "text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              )}
            >
              Hoy
            </button>
          </div>
        </div>

        {/* ── Mini-stats del mes ───────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat
            icono={Clock}
            colorIcono="text-amber-400"
            bgIcono="bg-amber-500/20"
            label="Vencimientos del mes"
            valor={statsDelMes.totalVencimientos}
          />
          <MiniStat
            icono={DollarSign}
            colorIcono="text-emerald-400"
            bgIcono="bg-emerald-500/20"
            label="Ingresos del mes"
            valor={formatearMoneda(statsDelMes.ingresosMes)}
          />
          <MiniStat
            icono={RefreshCw}
            colorIcono="text-blue-400"
            bgIcono="bg-blue-500/20"
            label="Renovaciones del mes"
            valor={statsDelMes.renovacionesMes}
          />
        </div>

        {/* ── Contenido principal: grid + panel lateral ────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* Grid del calendario */}
          <GlassCard padding="md">
            <CalendarioGrid
              mesActual={mesActual}
              vencimientosPorFecha={vencimientosPorFecha}
              pagosPorFecha={pagosPorFecha}
              diaSeleccionado={diaSeleccionado}
              mostrarVenc={mostrarVenc}
              mostrarPagos={mostrarPagos}
              onSelectDay={handleSelectDay}
            />
          </GlassCard>

          {/* Panel de detalle del día seleccionado */}
          <CalendarioDayDetail
            fecha={diaSeleccionado}
            clientes={clientesDia}
            pagos={pagosDia}
            onRenovar={handleRenovar}
          />
        </div>
      </div>

      {/* Modal de renovación (reutiliza el componente existente) */}
      <RenovarModal
        cliente={clienteARenovar}
        isOpen={!!clienteARenovar}
        onClose={() => setClienteARenovar(null)}
        onConfirm={handleConfirmarRenovacion}
      />
    </PageLayout>
  );
}

// ─── Sub-componentes locales ────────────────────────────────────────────────

/**
 * Botón de toggle con estado activo/inactivo y color semántico.
 * Se usa para mostrar/ocultar capas de información en el grid.
 */
function ToggleButton({
  active,
  color,
  onClick,
  label,
}: {
  active: boolean;
  color: "amber" | "emerald";
  onClick: () => void;
  label: string;
}) {
  const colorMap = {
    amber: {
      active: "border-amber-500/40 bg-amber-500/20 text-amber-300",
      inactive: "border-white/10 bg-white/5 text-white/40",
      dot: "bg-amber-400",
    },
    emerald: {
      active: "border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
      inactive: "border-white/10 bg-white/5 text-white/40",
      dot: "bg-emerald-400",
    },
  };

  const styles = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
        "transition-all duration-200",
        active ? styles.active : styles.inactive
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", active ? styles.dot : "bg-white/20")} />
      {label}
    </button>
  );
}

/**
 * Tarjeta de estadística compacta para el resumen del mes.
 * Más pequeña que StatCard.tsx, diseñada para ocupar menos alto.
 */
function MiniStat({
  icono: Icon,
  colorIcono,
  bgIcono,
  label,
  valor,
}: {
  icono: React.ElementType;
  colorIcono: string;
  bgIcono: string;
  label: string;
  valor: string | number;
}) {
  return (
    <GlassCard className="flex items-center gap-4 p-4">
      {/* Ícono */}
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bgIcono)}>
        <Icon className={cn("h-4 w-4", colorIcono)} />
      </div>
      {/* Texto */}
      <div className="min-w-0">
        <p className="truncate text-xs text-white/50">{label}</p>
        <p className="mt-0.5 text-lg font-bold text-white">{valor}</p>
      </div>
    </GlassCard>
  );
}
