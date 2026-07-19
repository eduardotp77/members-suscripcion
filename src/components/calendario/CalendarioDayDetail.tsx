/**
 * CalendarioDayDetail.tsx
 * ─────────────────────────────────────────────────────────────────────────
 * Panel lateral que muestra el detalle completo de un día seleccionado:
 *   1. Vencimientos: lista de clientes con StatusBadge + acciones rápidas
 *      (ver detalle, renovar).
 *   2. Pagos recibidos: lista de transacciones con monto e ícono de concepto.
 *
 * El componente es puramente presentacional — toda la lógica de negocio
 * (renovar, navegar) se delega hacia arriba mediante callbacks.
 *
 * Props:
 *  - fecha            : día seleccionado (null → muestra estado vacío)
 *  - clientes         : lista de clientes que vencen ese día
 *  - pagos            : lista de pagos registrados ese día
 *  - onRenovar        : callback para abrir RenovarModal con el cliente
 *  - onVerDetalle     : callback para navegar a /clientes/:id
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  RefreshCw,
  Eye,
  CreditCard,
  PlusCircle,
  Clock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearMoneda, formatearFechaCorta } from "@/lib/utils";
import { labelsMedioPago } from "@/lib/theme";
import { Cliente, Pago } from "@/types";
import { cn } from "@/lib/utils";

// ─── Props ──────────────────────────────────────────────────────────────────

interface CalendarioDayDetailProps {
  fecha: Date | null;
  clientes: Cliente[];
  pagos: Pago[];
  onRenovar: (cliente: Cliente) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Ícono y color según el concepto del pago (nuevo ingreso vs renovación).
 */
function ConceptoIcon({ concepto }: { concepto: Pago["concepto"] }) {
  if (concepto === "nuevo") {
    return <PlusCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />;
  }
  return <RefreshCw className="h-3.5 w-3.5 shrink-0 text-blue-400" />;
}

// ─── Componente ─────────────────────────────────────────────────────────────

export function CalendarioDayDetail({
  fecha,
  clientes,
  pagos,
  onRenovar,
}: CalendarioDayDetailProps) {
  const navigate = useNavigate();

  // ── Estado vacío: ningún día seleccionado ──────────────────────────────
  if (!fecha) {
    return (
      <GlassCard className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Calendar className="h-10 w-10 text-white/20" />
        <p className="text-sm text-white/40">
          Seleccioná un día para ver sus detalles
        </p>
      </GlassCard>
    );
  }

  // Título formateado del panel: "Viernes 13 de marzo, 2026"
  const tituloFecha = format(fecha, "EEEE d 'de' MMMM, yyyy", { locale: es });
  // Capitalizar primera letra del día
  const tituloCapitalizado = tituloFecha.charAt(0).toUpperCase() + tituloFecha.slice(1);

  // Total de ingresos del día
  const totalDia = pagos.reduce((sum, p) => sum + p.monto, 0);

  // ── Panel con datos ────────────────────────────────────────────────────
  return (
    <GlassCard padding="none" className="flex h-full flex-col overflow-hidden">
      {/* Encabezado del panel */}
      <div className="border-b border-white/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">
          Detalle del día
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          {tituloCapitalizado}
        </p>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Sección: Vencimientos ──────────────────────────────── */}
        <section className="border-b border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2">
            {/* Ícono reloj */}
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Vencimientos
            </h3>
            {/* Badge con conteo */}
            {clientes.length > 0 && (
              <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                {clientes.length}
              </span>
            )}
          </div>

          {/* Lista de clientes que vencen este día */}
          {clientes.length === 0 ? (
            <p className="text-xs text-white/30">Sin vencimientos este día</p>
          ) : (
            <ul className="space-y-2">
              {clientes.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-white/5 bg-white/[0.03] p-3"
                >
                  {/* Nombre + badge de estado */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {c.nombre}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/50">
                        {c.producto}
                      </p>
                    </div>
                    <StatusBadge estado={c.estado} size="sm" />
                  </div>

                  {/* Valor cobrado */}
                  <p className="mt-1.5 text-xs text-white/40">
                    {formatearMoneda(c.valorCobrado)} ·{" "}
                    <span className="capitalize">{c.tipoSuscripcion}</span>
                  </p>

                  {/* Acciones rápidas */}
                  <div className="mt-2 flex items-center gap-2">
                    {/* Ver detalle del cliente */}
                    <button
                      onClick={() => navigate(`/clientes/${c.id}`)}
                      className={cn(
                        "flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs",
                        "text-white/60 transition-colors hover:border-white/20 hover:text-white"
                      )}
                    >
                      <Eye className="h-3 w-3" />
                      Ver
                    </button>

                    {/* Renovar suscripción — solo si no está cancelada */}
                    {c.estado !== "cancelada" && (
                      <button
                        onClick={() => onRenovar(c)}
                        className={cn(
                          "flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1 text-xs",
                          "text-primary transition-colors hover:border-primary/60 hover:bg-primary/10"
                        )}
                      >
                        <RefreshCw className="h-3 w-3" />
                        Renovar
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Sección: Pagos del día ─────────────────────────────── */}
        <section className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Pagos recibidos
            </h3>
            {pagos.length > 0 && (
              <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                {pagos.length}
              </span>
            )}
          </div>

          {/* Lista de transacciones */}
          {pagos.length === 0 ? (
            <p className="text-xs text-white/30">Sin pagos este día</p>
          ) : (
            <ul className="space-y-2">
              {pagos.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3"
                >
                  {/* Ícono de concepto */}
                  <ConceptoIcon concepto={p.concepto} />

                  {/* Nombre del cliente y medio de pago */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">
                      {p.clienteNombre}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/40">
                      <CreditCard className="h-3 w-3" />
                      {labelsMedioPago[p.medioPago] ?? p.medioPago}
                    </p>
                  </div>

                  {/* Monto */}
                  <span className="shrink-0 text-sm font-semibold text-emerald-400">
                    {formatearMoneda(p.monto)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Total del día — solo si hay pagos */}
          {pagos.length > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <span className="text-xs font-medium text-emerald-300">
                Total del día
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {formatearMoneda(totalDia)}
              </span>
            </div>
          )}
        </section>
      </div>
    </GlassCard>
  );
}
