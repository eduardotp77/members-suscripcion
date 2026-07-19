import { GlassCard } from "@/components/ui/GlassCard";
import { DatosDistribucion } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Props del componente
interface DistributionChartProps {
  datos: DatosDistribucion[];
  titulo?: string;
}

// Colores para cada segmento del gráfico
const COLORES = ["#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f59e0b"];

/**
 * Gráfico de dona para distribución de suscripciones
 * Muestra porcentajes por tipo
 */
export function DistributionChart({
  datos,
  titulo = "Distribución por Tipo",
}: DistributionChartProps) {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/10 bg-black/90 px-4 py-3 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-medium text-white">{payload[0].name}</p>
          <p className="mt-1 text-lg font-bold" style={{ color: payload[0].payload.fill }}>
            {payload[0].value} ({payload[0].payload.porcentaje}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Leyenda personalizada
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-white/70">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <GlassCard className="max-w-full overflow-hidden">
      <h3 className="mb-4 text-lg font-semibold text-white sm:mb-6">{titulo}</h3>
      
      <div className="h-[250px] w-full max-w-full sm:h-[300px] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="cantidad"
              nameKey="tipo"
            >
              {datos.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORES[index % COLORES.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
