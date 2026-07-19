import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { DatosGraficoMensual } from "@/types";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { Users, DollarSign } from "lucide-react";

interface SemanaWidgetProps {
  suscripcionesActivas: number;
  totalSuscripciones: number;
  ingresosMesActual: number;
  datosGrafico: DatosGraficoMensual[];
  formatearMoneda: (v: number) => string;
}

export function SemanaWidget({
  suscripcionesActivas,
  totalSuscripciones,
  ingresosMesActual,
  datosGrafico,
  formatearMoneda,
}: SemanaWidgetProps) {
  const porcentajeActivas =
    totalSuscripciones > 0
      ? Math.round((suscripcionesActivas / totalSuscripciones) * 100)
      : 0;

  // Últimos 7 meses para los mini charts
  const miniDatos = datosGrafico.slice(-7).map((d) => ({
    mes: d.mes,
    valor: d.ingresos,
  }));

  return (
    <InteractiveCard hoverScale={1.01} hoverY={-2}>
      <GlassCard padding="none" className="overflow-hidden max-w-full">
      <div className="grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {/* Panel izquierdo: Suscripciones */}
        <div className="p-4 sm:p-5 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-medium text-white/70">Suscripciones</span>
            </div>
            <span className="text-sm font-bold text-white">{porcentajeActivas}%</span>
          </div>

          <p className="text-xl font-black text-white break-words sm:text-2xl">{suscripcionesActivas}</p>
          <p className="mb-4 mt-0.5 text-[10px] text-white/40">
            {suscripcionesActivas}/{totalSuscripciones} activas
          </p>

          <div className="h-[80px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniDatos} barCategoryGap="25%">
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                  {miniDatos.map((_, index) => (
                    <Cell
                      key={`cell-izq-${index}`}
                      fill={
                        index === miniDatos.length - 1
                          ? "#8b5cf6"
                          : "rgba(139,92,246,0.25)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel derecho: Ingresos del mes */}
        <div className="p-4 sm:p-5 min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-white/70">Ingresos mes</span>
          </div>

          <p className="text-xl font-black text-white break-words sm:text-2xl">{formatearMoneda(ingresosMesActual)}</p>
          <p className="mb-4 mt-0.5 text-[10px] text-white/40">mes actual</p>

          <div className="h-[60px] w-full sm:h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniDatos} barCategoryGap="25%">
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                  {miniDatos.map((_, index) => (
                    <Cell
                      key={`cell-der-${index}`}
                      fill={
                        index === miniDatos.length - 1
                          ? "#10b981"
                          : "rgba(16,185,129,0.25)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </GlassCard>
    </InteractiveCard>
  );
}
