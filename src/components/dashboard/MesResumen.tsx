import { GlassCard } from "@/components/ui/GlassCard";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MesResumenProps {
  porcentajeActivas: number;
  suscripcionesActivas: number;
  ingresosMesActual: number;
  proximasVencer: number;
  formatearMoneda: (v: number) => string;
}

export function MesResumen({
  porcentajeActivas,
  suscripcionesActivas,
  ingresosMesActual,
  proximasVencer,
  formatearMoneda,
}: MesResumenProps) {
  const mesLabel = format(new Date(), "MMMM yyyy", { locale: es });
  const mesCapitalizado = mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1);

  const calificacion =
    porcentajeActivas >= 80
      ? "Excelente"
      : porcentajeActivas >= 60
      ? "Bueno"
      : "Necesita atención";

  const colorCalificacion =
    porcentajeActivas >= 80
      ? "text-emerald-400"
      : porcentajeActivas >= 60
      ? "text-amber-400"
      : "text-red-400";

  return (
    <CardSpotlight>
      <GlassCard variant="highlight" className="animate-fade-in">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: mes + porcentaje grande */}
        <div>
          <p className="mb-1 text-sm font-medium text-white/50">{mesCapitalizado}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white sm:text-5xl">{porcentajeActivas}%</span>
            <span className={cn("text-sm font-semibold", colorCalificacion)}>
              {calificacion}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/40">Tasa de retención activa</p>
        </div>

        {/* Right: 3 badges de métricas */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 sm:gap-3 lg:flex lg:flex-wrap">
          {/* Activas - violeta */}
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 sm:gap-2.5 sm:py-2.5 lg:px-4 lg:py-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-white/40">Activas</p>
              <p className="text-sm font-bold text-white sm:text-base">{suscripcionesActivas}</p>
            </div>
          </div>

          {/* Ingresos mes - esmeralda */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 sm:gap-2.5 sm:py-2.5 lg:px-4 lg:py-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-white/40">Ingresos</p>
              <p className="text-sm font-bold text-white break-words sm:text-base">{formatearMoneda(ingresosMesActual)}</p>
            </div>
          </div>

          {/* Por vencer - ámbar */}
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 sm:gap-2.5 sm:py-2.5 lg:px-4 lg:py-3">
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wide text-white/40">Vencer</p>
              <p className="text-sm font-bold text-white sm:text-base">{proximasVencer}</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
    </CardSpotlight>
  );
}
