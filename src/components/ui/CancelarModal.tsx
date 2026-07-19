import { useState } from "react";
import { Cliente } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, X, User, Calendar, DollarSign } from "lucide-react";
import { formatearFechaCorta, formatearMoneda, diasHastaVencimiento } from "@/lib/utils";

interface CancelarModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  loading?: boolean;
}

/**
 * Modal para cancelar suscripción con motivo
 * Permite al usuario ingresar el motivo de cancelación antes de confirmar
 */
export function CancelarModal({
  cliente,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: CancelarModalProps) {
  const [motivo, setMotivo] = useState("");

  // Reset del formulario al cerrar
  const handleClose = () => {
    setMotivo("");
    onClose();
  };

  // Confirmar cancelación
  const handleConfirm = () => {
    if (motivo.trim()) {
      onConfirm(motivo.trim());
      handleClose();
    }
  };

  if (!isOpen || !cliente) return null;

  const dias = diasHastaVencimiento(cliente.fechaVencimiento);
  const urgente = dias !== null && dias <= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <GlassCard className="mx-4 w-full max-w-md border-red-500/30 bg-red-500/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Cancelar Suscripción
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
                {formatearMoneda(cliente.valorCobrado)} ({cliente.producto})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/60" />
              <span className={`text-sm ${urgente ? "text-red-400" : "text-amber-400"}`}>
                {dias === 0 
                  ? "Vence hoy" 
                  : dias === 1 
                    ? "Vence mañana" 
                    : dias && dias < 0 
                      ? `Vencida hace ${Math.abs(dias)} días`
                      : `Vence en ${dias} días`
                } ({formatearFechaCorta(cliente.fechaVencimiento)})
              </span>
            </div>
          </div>

          {/* Campo de motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-white/80">
              Motivo de cancelación *
            </Label>
            <Textarea
              id="motivo"
              placeholder="Ej: Cliente no renovó, falta de pago, solicitud del cliente..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="min-h-[100px] resize-none border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-red-400 focus:ring-red-400/20"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-white/50">
              <span>Describe brevemente la razón de la cancelación</span>
              <span>{motivo.length}/500</span>
            </div>
          </div>
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
            disabled={!motivo.trim() || loading}
            className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HoverBorderGradient
              as="div"
              className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer bg-red-600/80"
              duration={1.5}
              containerClassName="border-red-500/30"
            >
              {loading ? "Cancelando..." : "Confirmar Cancelación"}
            </HoverBorderGradient>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}