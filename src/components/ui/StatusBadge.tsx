import { cn } from "@/lib/utils";
import { EstadoSuscripcion } from "@/types";
import { labelsEstado } from "@/lib/theme";

// Props del componente
interface StatusBadgeProps {
  estado: EstadoSuscripcion;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

/**
 * Badge de estado con colores semánticos
 * Incluye animación de pulso para estados activos
 */
export function StatusBadge({ estado, size = "md", showDot = true, className }: StatusBadgeProps) {
  // Clases por estado
  const estadoClasses: Record<EstadoSuscripcion, string> = {
    activa: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    vencida: "bg-red-500/20 text-red-400 border-red-500/30",
    pendiente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelada: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  // Color del punto indicador
  const dotColors: Record<EstadoSuscripcion, string> = {
    activa: "bg-emerald-400",
    vencida: "bg-red-400",
    pendiente: "bg-amber-400",
    cancelada: "bg-gray-400",
  };

  // Tamaños
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        estadoClasses[estado],
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColors[estado],
            estado === "activa" && "animate-pulse"
          )}
        />
      )}
      {labelsEstado[estado]}
    </span>
  );
}
