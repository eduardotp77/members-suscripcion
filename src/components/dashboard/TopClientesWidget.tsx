/**
 * TopClientesWidget — Top 5 clientes por ingresos acumulados (LTV).
 *
 * Inspirado en el bloque "Principais clientes por gasto" de Stripe.
 * Muestra nombre, correo, badge de método de pago principal y LTV total.
 * Incluye un link directo a la página de Historial para ver todos.
 */

import { GlassCard } from "@/components/ui/GlassCard";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { Cliente } from "@/types";
import { formatearMoneda } from "@/lib/utils";
import { Trophy, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ItemTopCliente {
  cliente: Cliente;
  ingresosTotales: number;
}

interface TopClientesWidgetProps {
  /** Los primeros 5 clientes ordenados por LTV (del hook useClientes) */
  topClientes: ItemTopCliente[];
}

// ─── Configuración de colores por método de pago ─────────────────────────────

const CONFIG_METODO: Record<string, { label: string; color: string; bg: string }> = {
  stripe:  { label: "Stripe",  color: "#8b5cf6", bg: "bg-violet-500/15"  },
  binance: { label: "Binance", color: "#f59e0b", bg: "bg-amber-500/15"   },
  paypal:  { label: "PayPal",  color: "#3b82f6", bg: "bg-blue-500/15"    },
  hotmart: { label: "Hotmart", color: "#ec4899", bg: "bg-pink-500/15"    },
};

// ─── Sub-componente: avatar con iniciales del cliente ────────────────────────

function AvatarIniciales({
  nombre,
  indice,
}: {
  nombre: string;
  indice: number;
}) {
  // Paleta rotativa para los avatares cuando no hay foto
  const PALETA = [
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
  ];

  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        "bg-gradient-to-br text-xs font-bold text-white shadow-md",
        PALETA[indice % PALETA.length]
      )}
    >
      {iniciales}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function TopClientesWidget({ topClientes }: TopClientesWidgetProps) {
  // Tomamos solo los primeros 5 por si se pasan más
  const listaTop = topClientes.slice(0, 5);

  return (
    <CardSpotlight>
      <GlassCard className="animate-fade-in max-w-full overflow-hidden">
      {/* Encabezado */}
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Top Clientes</h3>
            <p className="text-[10px] text-white/40">Por ingresos acumulados</p>
          </div>
        </div>

        {/* Link a historial completo */}
        <Link
          to="/historial"
          className="flex items-center gap-1 text-[11px] font-medium text-primary/80 transition-colors hover:text-primary"
        >
          Ver todos
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Lista de clientes */}
      {listaTop.length === 0 ? (
        <p className="py-6 text-center text-sm text-white/30">
          Sin datos disponibles
        </p>
      ) : (
        <div className="space-y-0">
          {listaTop.map(({ cliente, ingresosTotales }, indice) => {
            const metodo = CONFIG_METODO[cliente.medioPago] ?? {
              label: cliente.medioPago,
              color: "#ffffff",
              bg: "bg-white/10",
            };

            return (
              <div key={cliente.id}>
                {/* Separador sutil entre filas (excepto la primera) */}
                {indice > 0 && <div className="border-t border-white/[0.05]" />}

                <div className="flex items-center gap-3 py-3">
                  {/* Avatar con iniciales */}
                  <AvatarIniciales nombre={cliente.nombre} indice={indice} />

                  {/* Nombre + correo */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {cliente.nombre}
                    </p>
                    <p className="truncate text-[10px] text-white/40">
                      {cliente.correo}
                    </p>
                  </div>

                  {/* Badge de método de pago */}
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                      metodo.bg
                    )}
                    style={{ color: metodo.color }}
                  >
                    {metodo.label}
                  </span>

                  {/* LTV total alineado a la derecha */}
                  <p className="shrink-0 text-sm font-bold text-white">
                    {formatearMoneda(ingresosTotales)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie informativo */}
      {listaTop.length > 0 && (
        <p className="mt-3 border-t border-white/[0.05] pt-3 text-[10px] text-white/30">
          Mostrando los {listaTop.length} clientes con mayor LTV acumulado
        </p>
      )}
    </GlassCard>
    </CardSpotlight>
  );
}
