import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// Props del componente
interface StatCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icono: LucideIcon;
  tendencia?: {
    valor: number;
    positiva: boolean;
  };
  colorIcono?: "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
}

/**
 * Tarjeta de estadística para el dashboard
 * Muestra un valor con icono y opcionalmente tendencia
 */
export function StatCard({
  titulo,
  valor,
  subtitulo,
  icono: Icon,
  tendencia,
  colorIcono = "primary",
  className,
}: StatCardProps) {
  // Colores para el icono
  const iconColors = {
    primary: "from-primary to-accent",
    secondary: "from-secondary to-blue-500",
    success: "from-emerald-500 to-teal-400",
    warning: "from-amber-500 to-orange-400",
    danger: "from-red-500 to-rose-400",
  };

  return (
    <InteractiveCard hoverScale={1.015} hoverY={-3}>
      <GlassCard className={cn("animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        {/* Contenido principal */}
        <div className="flex-1">
          <p className="text-sm font-medium text-white/60">{titulo}</p>
          <p className="mt-2 text-3xl font-bold text-white">{valor}</p>
          
          {/* Subtítulo o tendencia */}
          <div className="mt-2 flex items-center gap-2">
            {tendencia && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium",
                  tendencia.positiva ? "text-emerald-400" : "text-red-400"
                )}
              >
                {tendencia.positiva ? "↑" : "↓"} {Math.abs(tendencia.valor)}%
              </span>
            )}
            {subtitulo && (
              <span className="text-xs text-white/40">{subtitulo}</span>
            )}
          </div>
        </div>

        {/* Icono con gradiente */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br shadow-lg",
            iconColors[colorIcono]
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlassCard>
    </InteractiveCard>
  );
}
