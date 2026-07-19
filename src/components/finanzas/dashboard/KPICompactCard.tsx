import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { TrendIndicator } from '@/components/finanzas/stats/TrendIndicator';
import { cn } from '@/lib/utils';

/**
 * Card compacto para KPIs (Ingresos, Gastos, Retiros, Ganancia)
 * Componente reutilizable con:
 * - CardSpotlight con efecto de brillo siguiendo el mouse
 * - InteractiveCard con hover effects
 * - TrendIndicator para mostrar variación
 * - Icono personalizable con color de fondo
 * - Animación de entrada
 * - Soporte para valores positivos y negativos
 */

interface Props {
  titulo: string; // Ej: "Ingresos del Mes"
  valor: number; // Monto numérico
  formatearMonto: (monto: number) => string;
  variacion?: number; // % de cambio vs mes anterior
  icono: LucideIcon; // Icono de lucide-react
  colorIcono: string; // Ej: "text-green-400"
  bgIcono: string; // Ej: "bg-green-500/20"
  index?: number; // Para animación stagger
  esNegativo?: boolean; // Para forzar color rojo en el monto (gastos)
  className?: string;
}

export function KPICompactCard({
  titulo,
  valor,
  formatearMonto,
  variacion,
  icono: Icon,
  colorIcono,
  bgIcono,
  index = 0,
  esNegativo = false,
  className
}: Props) {
  // Determinar color del monto
  const montoColor = esNegativo 
    ? 'text-white' 
    : valor >= 0 
      ? 'text-white' 
      : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.1 + (index * 0.05), // Stagger effect
        duration: 0.3 
      }}
      className="h-full"
    >
      <CardSpotlight className="h-full">
        <InteractiveCard 
          className={cn(
            "h-full",
            // Glassmorphism mejorado para más visibilidad
            "border border-white/10",
            "bg-white/[0.03]",
            "backdrop-blur-xl",
            "rounded-xl",
            "shadow-lg shadow-black/20",
            className
          )}
        >
          <div className="p-5 h-full flex flex-col">
            {/* Header: Icono y Variación */}
            <div className="flex items-start justify-between mb-4">
              {/* Icono con background colorido */}
              <div className={cn("p-3 rounded-xl backdrop-blur-sm", bgIcono)}>
                <Icon className={cn("h-5 w-5", colorIcono)} />
              </div>

              {/* TrendIndicator si hay variación */}
              {variacion !== undefined && variacion !== 0 && (
                <TrendIndicator 
                  value={variacion} 
                  size="sm"
                />
              )}
            </div>

            {/* Título del KPI */}
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
              {titulo}
            </p>

            {/* Valor principal */}
            <motion.h3 
              className={cn("text-2xl md:text-3xl font-bold", montoColor)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (index * 0.05), duration: 0.3 }}
            >
              {formatearMonto(valor)}
            </motion.h3>
          </div>
        </InteractiveCard>
      </CardSpotlight>
    </motion.div>
  );
}
