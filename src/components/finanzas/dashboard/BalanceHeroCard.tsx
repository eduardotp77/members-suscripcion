import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { MiniSparkline } from '@/components/finanzas/stats/MiniSparkline';

/**
 * Card hero grande para mostrar el balance total
 * Características:
 * - CardSpotlight con efecto que sigue el cursor
 * - MiniSparkline de balance últimos 7 días
 * - Indicador de tendencia (TrendingUp/Down)
 * - Iconos animados con pulse
 * - Diseño destacado con borde violeta
 */

interface Props {
  balanceTotal: number;
  formatearMonto: (monto: number) => string;
  historialBalance?: number[]; // Últimos 7 días del balance
  variacionBalance?: number; // % de cambio vs semana anterior
}

export function BalanceHeroCard({ 
  balanceTotal, 
  formatearMonto,
  historialBalance = [],
  variacionBalance = 0
}: Props) {
  // Determinar si la tendencia es positiva o negativa
  const esPositivo = variacionBalance >= 0;
  const TrendIcon = esPositivo ? TrendingUp : TrendingDown;
  const trendColor = esPositivo ? 'text-green-400' : 'text-red-400';
  const trendBg = esPositivo ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <CardSpotlight className="h-full">
      <InteractiveCard className="h-full border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
        <div className="p-6 h-full flex flex-col justify-between">
          {/* Header con icono animado */}
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              {/* Icono con animación pulse */}
              <motion.div
                className="bg-violet-500/20 p-4 rounded-2xl backdrop-blur-sm"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wallet className="h-8 w-8 text-violet-400" />
              </motion.div>
              
              {/* Glow effect detrás del icono */}
              <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full -z-10" />
            </div>

            {/* Indicador de tendencia */}
            {variacionBalance !== 0 && (
              <motion.div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${trendBg} backdrop-blur-sm`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                <span className={`text-sm font-semibold ${trendColor}`}>
                  {Math.abs(variacionBalance).toFixed(1)}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Balance principal */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.p 
              className="text-sm text-gray-400 font-medium mb-2 tracking-wide uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Balance Total
            </motion.p>
            
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {formatearMonto(balanceTotal)}
            </motion.h2>

            <motion.p
              className="text-xs text-gray-500 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Todas las cuentas en USD
            </motion.p>
          </div>

          {/* Sparkline de tendencia últimos 7 días */}
          {historialBalance.length > 0 && (
            <motion.div
              className="mt-4 pt-4 border-t border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Últimos 7 días</span>
                <span className="text-xs text-violet-400 font-medium">
                  Tendencia
                </span>
              </div>
              <MiniSparkline 
                data={historialBalance}
                color="rgb(139, 92, 246)" // violet-500
                height={40}
              />
            </motion.div>
          )}
        </div>
      </InteractiveCard>
    </CardSpotlight>
  );
}
