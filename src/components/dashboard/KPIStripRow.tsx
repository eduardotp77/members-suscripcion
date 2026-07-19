/**
 * KPIStripRow — Fila de 5 KPIs estilo Stripe.
 *
 * Muestra las métricas de negocio más importantes del mes en curso:
 * Volumen Bruto · MRR · Suscriptores Activos · Nuevos · Churn.
 * Cada celda incluye el valor principal y un indicador de tendencia MoM.
 */

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { MetricasMRR, MetricasCrecimiento } from "@/types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Users,
  UserPlus,
  UserMinus,
  LucideIcon,
} from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface KPIStripRowProps {
  /** Ingresos brutos cobrados en el mes actual */
  volumenBruto: number;
  /** Ingresos brutos del mes anterior (para tendencia) */
  volumenBrutoAnterior: number;
  /** Métricas de MRR calculadas en useClientes */
  metricasMRR: MetricasMRR;
  /** Suscriptores activos ahora */
  suscripcionesActivas: number;
  /** Suscriptores activos al inicio del mes (para delta numérico) */
  activasMesAnterior: number;
  /** Métricas de crecimiento calculadas en useClientes */
  metricasCrecimiento: MetricasCrecimiento;
  /** Función para formatear moneda ($1,234.56) */
  formatearMoneda: (v: number) => string;
}

// ─── Sub-componente: celda individual de KPI ─────────────────────────────────

interface KPICeldaProps {
  /** Etiqueta descriptiva del KPI */
  etiqueta: string;
  /** Valor formateado para mostrar en grande */
  valor: string;
  /** Icono de Lucide para la celda */
  icono: LucideIcon;
  /** Color del icono */
  colorIcono: string;
  /** Variación porcentual vs mes anterior (positiva o negativa) */
  tendenciaPct?: number;
  /** Texto descriptivo adicional bajo el valor */
  descripcion?: string;
  /** Indica si un valor alto es bueno (true) o malo (false, e.g. churn) */
  altoEsBueno?: boolean;
}

function KPICelda({
  etiqueta,
  valor,
  icono: Icono,
  colorIcono,
  tendenciaPct,
  descripcion,
  altoEsBueno = true,
}: KPICeldaProps) {
  // Determina si el indicador se pinta verde o rojo
  const esTendenciaPositiva =
    tendenciaPct !== undefined
      ? altoEsBueno
        ? tendenciaPct >= 0
        : tendenciaPct <= 0
      : null;

  return (
    <div className="flex flex-col gap-2.5 px-4 py-4 sm:gap-3 sm:px-5 sm:py-4 lg:px-5 lg:py-4 min-w-0">
      {/* Fila superior: etiqueta + icono */}
      <div className="flex items-center justify-between min-w-0">
        <span className="text-xs font-medium uppercase tracking-wide text-white/50 break-words pr-2">
          {etiqueta}
        </span>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${colorIcono}1a` }} // 10% opacidad del color
        >
          <Icono className="h-3.5 w-3.5" style={{ color: colorIcono }} />
        </div>
      </div>

      {/* Valor principal */}
      <p className="text-xl font-black tracking-tight text-white sm:text-2xl break-words">{valor}</p>

      {/* Indicador de tendencia y descripción */}
      <div className="flex items-center gap-2">
        {tendenciaPct !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              esTendenciaPositiva
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {esTendenciaPositiva ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {Math.abs(tendenciaPct)}%
          </span>
        )}
        {descripcion && (
          <span className="text-[10px] text-white/40">{descripcion}</span>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function KPIStripRow({
  volumenBruto,
  volumenBrutoAnterior,
  metricasMRR,
  suscripcionesActivas,
  activasMesAnterior,
  metricasCrecimiento,
  formatearMoneda,
}: KPIStripRowProps) {
  // Tendencia porcentual del volumen bruto MoM
  const tendenciaVolumen =
    volumenBrutoAnterior > 0
      ? Math.round(
          ((volumenBruto - volumenBrutoAnterior) / volumenBrutoAnterior) * 100
        )
      : volumenBruto > 0
      ? 100
      : 0;

  // Delta numérico de suscriptores activos (absoluto)
  const deltaActivos = suscripcionesActivas - activasMesAnterior;

  return (
    <GlassCard padding="none" className="animate-fade-in overflow-hidden">
      {/*
       * Grid adaptativo: 1 col en mobile, 2 en sm, 3 en md, 5 en lg+.
       * Las celdas están separadas por bordes sutiles.
       */}
      <div className="grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-2 sm:divide-x md:grid-cols-3 lg:grid-cols-5 lg:divide-y-0 max-w-full">

        {/* 1 — Volumen Bruto del mes */}
        <KPICelda
          etiqueta="Volumen Bruto"
          valor={formatearMoneda(volumenBruto)}
          icono={DollarSign}
          colorIcono="#10b981"
          tendenciaPct={tendenciaVolumen}
          descripcion="vs mes anterior"
        />

        {/* 2 — MRR (Monthly Recurring Revenue) */}
        <KPICelda
          etiqueta="MRR"
          valor={formatearMoneda(metricasMRR.mrr)}
          icono={BarChart2}
          colorIcono="#8b5cf6"
          tendenciaPct={metricasMRR.tendenciaMRR}
          descripcion="recurrente mensual"
        />

        {/* 3 — Suscriptores activos con delta absoluto */}
        <KPICelda
          etiqueta="Suscriptores Activos"
          valor={suscripcionesActivas.toString()}
          icono={Users}
          colorIcono="#3b82f6"
          tendenciaPct={
            activasMesAnterior > 0
              ? Math.round((deltaActivos / activasMesAnterior) * 100)
              : suscripcionesActivas > 0
              ? 100
              : 0
          }
          descripcion={
            deltaActivos >= 0
              ? `+${deltaActivos} este mes`
              : `${deltaActivos} este mes`
          }
        />

        {/* 4 — Nuevos clientes este mes */}
        <KPICelda
          etiqueta="Nuevos Este Mes"
          valor={metricasCrecimiento.nuevosEsteMes.toString()}
          icono={UserPlus}
          colorIcono="#f59e0b"
          tendenciaPct={metricasCrecimiento.tendenciaNuevos}
          descripcion={`${metricasCrecimiento.nuevosMesAnterior} el mes anterior`}
        />

        {/* 5 — Tasa de Churn (alto es malo) */}
        <KPICelda
          etiqueta="Churn Mensual"
          valor={`${metricasCrecimiento.tasaChurn}%`}
          icono={UserMinus}
          colorIcono="#ef4444"
          tendenciaPct={
            metricasCrecimiento.canceladosEsteMes > 0
              ? metricasCrecimiento.tasaChurn
              : 0
          }
          descripcion={`${metricasCrecimiento.canceladosEsteMes} cancelados`}
          altoEsBueno={false}
        />
      </div>
    </GlassCard>
  );
}
