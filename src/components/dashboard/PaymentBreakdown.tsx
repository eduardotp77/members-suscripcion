/**
 * PaymentBreakdown — Desglose de ingresos por método de pago.
 *
 * Inspirado en el panel "Pagamentos" de Stripe.
 * Muestra cuánto aportó cada plataforma en el mes actual,
 * con barras de progreso proporcionales y conteo de transacciones.
 */

import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { DistribucionMedioPago } from "@/types";
import { formatearMoneda } from "@/lib/utils";
import { CreditCard } from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface PaymentBreakdownProps {
  /** Array de métodos de pago con sus montos del mes actual */
  distribucion: DistribucionMedioPago[];
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function PaymentBreakdown({ distribucion }: PaymentBreakdownProps) {
  // Total real del mes (suma de todos los métodos)
  const totalMes = distribucion.reduce((sum, d) => sum + d.monto, 0);

  // Filtramos primero los que tienen movimiento para pintarlos arriba,
  // luego los sin actividad para que aparezcan debajo en gris
  const conActividad    = distribucion.filter((d) => d.monto > 0);
  const sinActividad    = distribucion.filter((d) => d.monto === 0);
  const distribOrdenada = [...conActividad, ...sinActividad];

  return (
    <InteractiveCard hoverScale={1.01} hoverY={-2}>
      <GlassCard className="animate-fade-in max-w-full overflow-hidden">
      {/* Encabezado */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Métodos de Pago</h3>
            <p className="text-[10px] text-white/40">Mes actual</p>
          </div>
        </div>

        {/* Total del mes en el lado derecho */}
        <div className="text-right">
          <p className="text-lg font-black text-white">{formatearMoneda(totalMes)}</p>
          <p className="text-[10px] text-white/40">total cobrado</p>
        </div>
      </div>

      {/* Lista de métodos */}
      <div className="space-y-3 sm:space-y-4">
        {distribOrdenada.map((item) => {
          const estaActivo = item.monto > 0;

          return (
            <div key={item.medioPago} className="space-y-1.5">
              {/* Fila superior: nombre + monto */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Punto de color del método */}
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: estaActivo ? item.color : "rgba(255,255,255,0.2)",
                      boxShadow: estaActivo ? `0 0 6px ${item.color}99` : "none",
                    }}
                  />
                  <span
                    className={
                      estaActivo ? "text-sm font-medium text-white" : "text-sm text-white/30"
                    }
                  >
                    {item.label}
                  </span>
                </div>

                {/* Monto + cantidad de transacciones */}
                <div className="flex items-center gap-3">
                  {item.cantidad > 0 && (
                    <span className="text-[10px] text-white/40">
                      {item.cantidad} {item.cantidad === 1 ? "pago" : "pagos"}
                    </span>
                  )}
                  <span
                    className={
                      estaActivo
                        ? "text-sm font-bold text-white"
                        : "text-sm text-white/30"
                    }
                  >
                    {estaActivo ? formatearMoneda(item.monto) : "—"}
                  </span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width:           `${item.porcentaje}%`,
                    backgroundColor: estaActivo ? item.color : "transparent",
                    boxShadow:       estaActivo ? `0 0 8px ${item.color}66` : "none",
                  }}
                />
              </div>

              {/* Porcentaje del total */}
              {estaActivo && (
                <p className="text-right text-[10px] text-white/40">
                  {item.porcentaje}% del total
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Pie: nota informativa cuando no hay pagos */}
      {totalMes === 0 && (
        <p className="mt-4 text-center text-xs text-white/30">
          Sin pagos registrados este mes
        </p>
      )}
    </GlassCard>
    </InteractiveCard>
  );
}
