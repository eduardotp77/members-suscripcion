import { AreaChart, Area, Grid, XAxis, ChartTooltip } from "@/components/ui/area-chart";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatearMoneda } from "@/lib/utils";
import { FINANZAS_COLORS } from "@/lib/finanzas-colors";
import type { DatosDiariosMes } from "@/types";

/**
 * Props del componente MesActualChartInteractive
 */
interface MesActualChartInteractiveProps {
  datos: DatosDiariosMes[];
  titulo?: string;
}

/**
 * Gráfico de área interactivo que muestra el flujo diario del mes actual
 * Visualiza ingresos y gastos día por día con colores diferenciados
 * 
 * Características:
 * - Dos áreas superpuestas (ingresos en verde, gastos en rojo)
 * - Tooltip interactivo con crosshair mostrando datos del día
 * - Animaciones fluidas con framer-motion
 * - Diseño glassmorphism consistente
 * - Muestra progreso del mes actual
 * - Manejo correcto de zona horaria usando toLocaleDateString
 * 
 * @example
 * ```tsx
 * <MesActualChartInteractive 
 *   datos={datosDiariosMesActual}
 *   titulo="Flujo Diario del Mes Actual"
 * />
 * ```
 */
export function MesActualChartInteractive({ 
  datos, 
  titulo = "Flujo Diario del Mes Actual"
}: MesActualChartInteractiveProps) {
  
  // Validación: retornar mensaje si no hay datos
  if (!datos || datos.length === 0) {
    return (
      <GlassCard className="max-w-full overflow-hidden">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">{titulo}</h3>
          <p className="mt-0.5 text-xs text-white/40">
            No hay datos disponibles para mostrar
          </p>
        </div>
        <div className="h-[200px] w-full sm:h-[250px] lg:h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Agrega transacciones para ver el flujo diario</p>
        </div>
      </GlassCard>
    );
  }
  
  /**
   * Transformar datos al formato requerido por AreaChart
   * El componente AreaChart espera objetos con fecha y valores numéricos
   */
  const chartData = datos.map(d => ({
    date: d.fechaCompleta,
    ingresos: d.ingresos,
    gastos: d.gastos,
    neto: d.neto,
    acumulado: d.acumulado,
  }));
  
  /**
   * Calcular estadísticas del mes
   */
  const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
  const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);
  const balanceFinal = datos[datos.length - 1]?.acumulado || 0;
  
  // Obtener fecha del mes actual
  const hoy = new Date();
  const mesNombre = hoy.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const diaActual = hoy.getDate();
  
  // Calcular progreso del mes (% de días transcurridos)
  const diasConDatos = datos.filter(d => d.ingresos > 0 || d.gastos > 0).length;
  const progresoMes = Math.round((diaActual / datos.length) * 100);
  
  return (
    <GlassCard className="max-w-full overflow-hidden">
      {/* Header con título y estadísticas */}
      <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Título y subtítulo */}
        <div>
          <h3 className="text-lg font-semibold text-white">{titulo}</h3>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-xs text-white/40">
              {mesNombre} • Día {diaActual} de {datos.length}
            </p>
            <span className="text-xs text-violet-400">
              ({progresoMes}%)
            </span>
          </div>
        </div>
        
        {/* Grid de estadísticas */}
        <div className="grid grid-cols-3 gap-4 text-right">
          {/* Total Ingresos del mes */}
          <div>
            <p className="text-xs text-green-400/60 mb-1">Ingresos</p>
            <p className="text-lg font-black text-green-400">
              {formatearMoneda(totalIngresos)}
            </p>
          </div>
          
          {/* Total Gastos del mes */}
          <div>
            <p className="text-xs text-red-400/60 mb-1">Gastos</p>
            <p className="text-lg font-black text-red-400">
              {formatearMoneda(totalGastos)}
            </p>
          </div>
          
          {/* Balance acumulado */}
          <div>
            <p className="text-xs text-violet-400/60 mb-1">Balance</p>
            <p className={`text-lg font-black ${balanceFinal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatearMoneda(balanceFinal)}
            </p>
          </div>
        </div>
      </div>

      {/* Contenedor del gráfico con altura responsiva */}
      <div className="h-[200px] w-full sm:h-[250px] lg:h-[300px] -mx-4">
        <AreaChart 
          data={chartData}
          xDataKey="date"
          aspectRatio="auto"
          animationDuration={1200}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          className="w-full h-full"
        >
          {/* Grid con líneas horizontales sutiles */}
          <Grid 
            horizontal 
            fadeHorizontal 
            numTicksRows={5}
            stroke="hsl(var(--chart-grid))"
            strokeOpacity={0.5}
          />
          
          {/* Área de Gastos (capa inferior, se renderiza primero) */}
          <Area
            dataKey="gastos"
            fill={FINANZAS_COLORS.expense}
            fillOpacity={0.2}
            stroke={FINANZAS_COLORS.expense}
            strokeWidth={2.5}
            animate={true}
            showLine={true}
            showHighlight={true}
            gradientToOpacity={0}
            fadeEdges={true}
          />
          
          {/* Área de Ingresos (capa superior, más opaca) */}
          <Area
            dataKey="ingresos"
            fill={FINANZAS_COLORS.income}
            fillOpacity={0.3}
            stroke={FINANZAS_COLORS.income}
            strokeWidth={2.5}
            animate={true}
            showLine={true}
            showHighlight={true}
            gradientToOpacity={0}
            fadeEdges={true}
          />
          
          {/* Eje X con formato de fechas (cada 5 días aprox) */}
          <XAxis numTicks={6} tickerHalfWidth={55} />
          
          {/* Tooltip interactivo con información detallada del día */}
          <ChartTooltip 
            showDatePill={true}
            showCrosshair={true}
            showDots={true}
            rows={(point) => [
              // Fila de Ingresos
              {
                color: FINANZAS_COLORS.income,
                label: 'Ingresos del día',
                value: formatearMoneda(point.ingresos as number)
              },
              // Fila de Gastos
              {
                color: FINANZAS_COLORS.expense,
                label: 'Gastos del día',
                value: formatearMoneda(point.gastos as number)
              },
              // Fila de Neto (color dinámico)
              {
                color: (point.neto as number) >= 0 ? FINANZAS_COLORS.income : FINANZAS_COLORS.expense,
                label: 'Neto del día',
                value: formatearMoneda(point.neto as number)
              },
              // Fila de Acumulado
              {
                color: FINANZAS_COLORS.balance,
                label: 'Acumulado',
                value: formatearMoneda(point.acumulado as number)
              }
            ]}
          />
        </AreaChart>
      </div>
    </GlassCard>
  );
}
