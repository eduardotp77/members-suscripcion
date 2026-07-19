import { GlassCard } from "@/components/ui/GlassCard";
import { AreaChart, Area, Grid, XAxis, ChartTooltip } from "@/components/ui/area-chart";
import { formatearMoneda } from "@/lib/utils";
import type { DatosGraficoMensual } from "@/types";

// Props del componente
interface RevenueChartInteractiveProps {
  datos: DatosGraficoMensual[];
  titulo?: string;
  valorTotal?: number;
}

// Transformar datos del formato actual al requerido por el AreaChart
function transformarDatosParaAreaChart(datos: DatosGraficoMensual[]): Array<{ date: Date; revenue: number }> {
  const mesesMap: Record<string, number> = {
    Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
    Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11
  };
  
  const añoActual = new Date().getFullYear();
  const mesActual = new Date().getMonth();
  
  return datos.map((d, idx) => {
    // Extraer el mes del string (ej: "Ene", "Feb", etc.)
    const mesStr = d.mes;
    const mesNum = mesesMap[mesStr] ?? idx;
    
    // Calcular el año correcto
    // Si el mes es mayor al actual, es del año pasado
    const año = mesNum > mesActual ? añoActual - 1 : añoActual;
    
    return {
      date: new Date(año, mesNum, 1),
      revenue: d.ingresos,
    };
  });
}

/**
 * Gráfico de área interactivo con efectos avanzados de hover
 * Mantiene el diseño glassmorphism y agrega interacciones fluidas
 */
export function RevenueChartInteractive({ 
  datos, 
  titulo = "Ingresos Históricos", 
  valorTotal 
}: RevenueChartInteractiveProps) {
  // Transformar datos al formato requerido
  const chartData = transformarDatosParaAreaChart(datos);

  return (
    <GlassCard className="max-w-full overflow-hidden">
      {/* Header original - mantener diseño */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{titulo}</h3>
          {datos.length > 0 && (
            <p className="mt-0.5 text-xs text-white/40">
              Últimos {datos.length} meses
            </p>
          )}
        </div>
        {valorTotal !== undefined && (
          <div className="text-right">
            <p className="text-2xl font-black text-white">
              {formatearMoneda(valorTotal)}
            </p>
            <p className="text-xs text-white/40">total acumulado</p>
          </div>
        )}
      </div>

      {/* Gráfico interactivo con efectos avanzados */}
      <div className="h-[200px] w-full sm:h-[250px] lg:h-[300px] -mx-4">
        <AreaChart 
          data={chartData}
          xDataKey="date"
          aspectRatio="auto"
          animationDuration={1200}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          className="w-full h-full"
        >
          {/* Grid con fade sutil */}
          <Grid 
            horizontal 
            fadeHorizontal 
            numTicksRows={5}
            stroke="hsl(var(--chart-grid))"
            strokeOpacity={0.5}
          />
          
          {/* Área con gradiente violeta y animación */}
          <Area
            dataKey="revenue"
            fill="hsl(var(--chart-line-primary))"
            fillOpacity={0.3}
            stroke="hsl(var(--chart-line-primary))"
            strokeWidth={2.5}
            animate={true}
            showLine={true}
            showHighlight={true}
            gradientToOpacity={0}
            fadeEdges={true}
          />
          
          {/* Eje X con labels personalizados */}
          <XAxis numTicks={6} tickerHalfWidth={55} />
          
          {/* Tooltip interactivo avanzado con formato de moneda */}
          <ChartTooltip 
            showDatePill={true}
            showCrosshair={true}
            showDots={true}
            rows={(point) => [{
              color: 'hsl(262 83% 58%)',
              label: 'Ingresos',
              value: formatearMoneda(point.revenue as number)
            }]}
          />
        </AreaChart>
      </div>
    </GlassCard>
  );
}
