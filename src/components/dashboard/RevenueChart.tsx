import { GlassCard } from "@/components/ui/GlassCard";
import { DatosGraficoMensual } from "@/types";
import { formatearMoneda } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Props del componente
interface RevenueChartProps {
  datos: DatosGraficoMensual[];
  titulo?: string;
  valorTotal?: number;
}

/**
 * Gráfico de área full-width para mostrar ingresos históricos
 * Diseño glass con gradientes y valor total prominente
 */
export function RevenueChart({ datos, titulo = "Ingresos Históricos", valorTotal }: RevenueChartProps) {
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/10 bg-black/90 px-4 py-3 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="mt-1 text-lg font-bold text-gradient">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="max-w-full overflow-hidden">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{titulo}</h3>
          {datos.length > 0 && (
            <p className="mt-0.5 text-xs text-white/40">Últimos {datos.length} meses</p>
          )}
        </div>
        {valorTotal !== undefined && (
          <div className="text-right">
            <p className="text-2xl font-black text-white">{formatearMoneda(valorTotal)}</p>
            <p className="text-xs text-white/40">total acumulado</p>
          </div>
        )}
      </div>
      
      <div className="h-[200px] w-full max-w-full sm:h-[250px] lg:h-[300px] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={datos}
            margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          >
            {/* Gradiente para el área */}
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            
            <XAxis
              dataKey="mes"
              stroke="rgba(255,255,255,0.3)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
