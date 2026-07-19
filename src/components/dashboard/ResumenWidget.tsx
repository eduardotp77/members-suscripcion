import { GlassCard } from "@/components/ui/GlassCard";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { DatosGraficoMensual } from "@/types";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { formatearMoneda } from "@/lib/utils";

interface ResumenWidgetProps {
  totalClientes: number;
  porcentajeActivas: number;
  ticketPromedio: number;
  datosGrafico: DatosGraficoMensual[];
}

export function ResumenWidget({
  totalClientes,
  porcentajeActivas,
  ticketPromedio,
  datosGrafico,
}: ResumenWidgetProps) {
  const miniDatos = datosGrafico.slice(-7);

  return (
    <CardSpotlight>
      <GlassCard className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 sm:mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
          <TrendingUp className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Resumen Rápido</p>
          <p className="text-xs text-white/40">métricas generales</p>
        </div>
      </div>

      {/* Métricas apiladas */}
      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
          <span className="text-xs text-white/60">Total clientes</span>
          <span className="text-sm font-bold text-white">{totalClientes}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
          <span className="text-xs text-white/60">Tasa retención</span>
          <span className="text-sm font-bold text-emerald-400">{porcentajeActivas}%</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
          <span className="text-xs text-white/60">Ticket promedio</span>
          <span className="text-sm font-bold text-white">{formatearMoneda(ticketPromedio)}</span>
        </div>
      </div>

      {/* Mini línea de tendencia */}
      {miniDatos.length > 1 && (
        <div className="mt-4 h-[52px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miniDatos}>
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
    </CardSpotlight>
  );
}
