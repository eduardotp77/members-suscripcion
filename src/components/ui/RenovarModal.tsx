import { useState } from "react";
import { Cliente } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, X, User, Calendar, DollarSign, Clock } from "lucide-react";
import { formatearFechaCorta, formatearMoneda, calcularFechaVencimiento } from "@/lib/utils";
import { labelsTipoSuscripcion } from "@/lib/theme";
import { format } from "date-fns";

interface RenovarModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fechaRenovacion: string) => void;
  loading?: boolean;
}

/**
 * Modal para renovar suscripción con fecha personalizada
 * Permite seleccionar la fecha real de pago/renovación
 */
export function RenovarModal({
  cliente,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: RenovarModalProps) {
  const [fechaRenovacion, setFechaRenovacion] = useState(format(new Date(), "yyyy-MM-dd"));

  // Reset del formulario al cerrar
  const handleClose = () => {
    setFechaRenovacion(format(new Date(), "yyyy-MM-dd"));
    onClose();
  };

  // Confirmar renovación
  const handleConfirm = () => {
    if (fechaRenovacion) {
      onConfirm(fechaRenovacion);
      handleClose();
    }
  };

  if (!isOpen || !cliente) return null;

  // Calcular nueva fecha de vencimiento
  const nuevaFechaVencimiento = calcularFechaVencimiento(fechaRenovacion, cliente.tipoSuscripcion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <GlassCard className="mx-4 w-full max-w-md border-secondary/30 bg-secondary/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
              <RefreshCw className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Renovar Suscripción
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Info del cliente */}
        <div className="py-4">
          <div className="mb-4 space-y-2 rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-white/60" />
              <span className="font-medium text-white">{cliente.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/80">
                {formatearMoneda(cliente.valorCobrado)} - {cliente.producto}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/80">
                Suscripción {labelsTipoSuscripcion[cliente.tipoSuscripcion].toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/80">
                Vence: {formatearFechaCorta(cliente.fechaVencimiento)}
              </span>
            </div>
          </div>

          {/* Selector de fecha */}
          <div className="space-y-3">
            <Label htmlFor="fechaRenovacion" className="text-white/80">
              Fecha de renovación/pago *
            </Label>
            <Input
              id="fechaRenovacion"
              type="date"
              value={fechaRenovacion}
              onChange={(e) => setFechaRenovacion(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")} // No permite fechas futuras
              className="border-white/20 bg-white/5 text-white focus:border-secondary focus:ring-secondary/20"
            />
            <p className="text-xs text-white/50">
              Selecciona la fecha real en que el cliente realizó el pago
            </p>
          </div>

          {/* Preview de nueva fecha */}
          {nuevaFechaVencimiento && (
            <div className="mt-4 rounded-lg bg-secondary/10 p-3">
              <p className="text-sm text-white/80">
                <span className="text-white/60">Nuevo período:</span> 
                <span className="ml-2 font-medium text-white">
                  {formatearFechaCorta(fechaRenovacion)} → {formatearFechaCorta(nuevaFechaVencimiento)}
                </span>
              </p>
              <p className="mt-1 text-xs text-white/50">
                Renovación #{cliente.totalRenovaciones + 1}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <button
            onClick={handleConfirm}
            disabled={!fechaRenovacion || loading}
            className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HoverBorderGradient
              as="div"
              className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
              duration={1.5}
              containerClassName="border-emerald-500/30"
            >
              {loading ? (
                "Renovando..."
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Confirmar Renovación
                </>
              )}
            </HoverBorderGradient>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}