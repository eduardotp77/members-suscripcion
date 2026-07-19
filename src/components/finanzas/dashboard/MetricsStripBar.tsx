import { motion } from 'framer-motion';
import { Clock, TrendingDown, Percent, Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

/**
 * Barra horizontal con métricas secundarias
 * Muestra stats como Runway, Burn Rate, Margen Neto en una sola fila
 * Características:
 * - Layout horizontal responsive
 * - Separadores visuales entre stats
 * - Iconos descriptivos
 * - Colores semánticos según valores
 * - Animación de entrada con stagger
 */

interface StatItem {
  label: string;
  value: string | number;
  icon: typeof Clock | typeof TrendingDown | typeof Percent | typeof Activity;
  color: string; // Clase de color para el icono
  bgColor: string; // Color de fondo del icono
  suffix?: string; // Ej: "meses", "%", "/mes"
  alerta?: boolean; // Para resaltar valores críticos
}

interface Props {
  runway: number; // Meses de pista
  burnRate: number; // Gasto mensual promedio
  margenNeto: number; // % de margen
  formatearMonto: (monto: number) => string;
  className?: string;
}

export function MetricsStripBar({
  runway,
  burnRate,
  margenNeto,
  formatearMonto,
  className
}: Props) {
  // Definir las estadísticas a mostrar
  const stats: StatItem[] = [
    {
      label: 'Runway',
      value: runway.toFixed(1),
      suffix: 'meses',
      icon: Clock,
      color: runway < 3 ? 'text-red-400' : runway < 6 ? 'text-yellow-400' : 'text-green-400',
      bgColor: runway < 3 ? 'bg-red-500/10' : runway < 6 ? 'bg-yellow-500/10' : 'bg-green-500/10',
      alerta: runway < 3
    },
    {
      label: 'Burn Rate',
      value: formatearMonto(burnRate),
      suffix: '/mes',
      icon: TrendingDown,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Margen Neto',
      value: margenNeto.toFixed(1),
      suffix: '%',
      icon: Percent,
      color: margenNeto < 20 ? 'text-red-400' : margenNeto < 40 ? 'text-yellow-400' : 'text-green-400',
      bgColor: margenNeto < 20 ? 'bg-red-500/10' : margenNeto < 40 ? 'bg-yellow-500/10' : 'bg-green-500/10',
      alerta: margenNeto < 20
    },
    {
      label: 'Salud Financiera',
      value: calcularSaludFinanciera(runway, margenNeto),
      icon: Activity,
      color: calcularColorSalud(runway, margenNeto),
      bgColor: calcularBgSalud(runway, margenNeto),
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className={cn("w-full", className)}
    >
      <GlassCard className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                "hover:bg-white/5",
                stat.alerta && "ring-1 ring-red-500/30"
              )}
            >
              {/* Icono */}
              <div className={cn("p-2 rounded-lg backdrop-blur-sm flex-shrink-0", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>

              {/* Label y Valor */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium truncate">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-lg font-bold", stat.color)}>
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-xs text-gray-500">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </div>

              {/* Indicador de alerta (opcional) */}
              {stat.alerta && (
                <div className="flex-shrink-0">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Calcula un indicador de salud financiera basado en runway y margen
 * @param runway - Meses de pista
 * @param margen - % de margen neto
 * @returns Etiqueta de salud: Excelente, Buena, Regular, Crítica
 */
function calcularSaludFinanciera(runway: number, margen: number): string {
  const score = (runway / 12) * 50 + (margen / 100) * 50;
  
  if (score >= 75) return 'Excelente';
  if (score >= 50) return 'Buena';
  if (score >= 25) return 'Regular';
  return 'Crítica';
}

/**
 * Determina el color del indicador de salud
 */
function calcularColorSalud(runway: number, margen: number): string {
  const salud = calcularSaludFinanciera(runway, margen);
  
  switch (salud) {
    case 'Excelente': return 'text-green-400';
    case 'Buena': return 'text-blue-400';
    case 'Regular': return 'text-yellow-400';
    case 'Crítica': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

/**
 * Determina el color de fondo del indicador de salud
 */
function calcularBgSalud(runway: number, margen: number): string {
  const salud = calcularSaludFinanciera(runway, margen);
  
  switch (salud) {
    case 'Excelente': return 'bg-green-500/10';
    case 'Buena': return 'bg-blue-500/10';
    case 'Regular': return 'bg-yellow-500/10';
    case 'Crítica': return 'bg-red-500/10';
    default: return 'bg-gray-500/10';
  }
}
