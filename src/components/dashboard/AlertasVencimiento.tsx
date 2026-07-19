import { GlassCard } from "@/components/ui/GlassCard";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Cliente } from "@/types";
import { diasHastaVencimiento, formatearFechaCorta, formatearMoneda } from "@/lib/utils";
import { AlertTriangle, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Props del componente
interface AlertasVencimientoProps {
  clientes: Cliente[];
  maxItems?: number;
}

/**
 * Panel de alertas para suscripciones próximas a vencer
 * Muestra lista ordenada por urgencia
 */
export function AlertasVencimiento({ clientes, maxItems = 5 }: AlertasVencimientoProps) {
  // Mostrar solo los primeros N items
  const clientesMostrados = clientes.slice(0, maxItems);

  return (
    <CardSpotlight>
      <GlassCard className="h-full max-w-full overflow-hidden">
      {/* Header con icono de alerta */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Próximas a Vencer</h3>
            <p className="text-xs text-white/50">Próximos 7 días</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-400">
          {clientes.length}
        </span>
      </div>

      {/* Lista de alertas */}
      {clientesMostrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
            <Clock className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-sm text-white/60">No hay suscripciones próximas a vencer</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clientesMostrados.map((cliente, index) => {
            const dias = diasHastaVencimiento(cliente.fechaVencimiento);
            const urgente = dias !== null && dias <= 3;
            
            return (
              <div
                key={cliente.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-all duration-300 sm:gap-4 sm:p-4",
                  urgente
                    ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Avatar/Icono */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 text-white/60 sm:h-5 sm:w-5" />
                </div>

                {/* Info del cliente */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {cliente.nombre}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {cliente.producto}
                  </p>
                </div>

                {/* Días restantes */}
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      urgente ? "text-red-400" : "text-amber-400"
                    )}
                  >
                    {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `${dias} días`}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatearFechaCorta(cliente.fechaVencimiento)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
    </CardSpotlight>
  );
}
