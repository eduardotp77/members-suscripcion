import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Transaccion } from '@/types';

interface MesHeaderProps {
  nombreMes: string;
  transacciones: Transaccion[];
  formatearMonto: (monto: number) => string;
}

/**
 * Header premium para cada mes con estadísticas resumidas
 */
export function MesHeader({
  nombreMes,
  transacciones,
  formatearMonto,
}: MesHeaderProps) {
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const balance = totalIngresos - totalGastos;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="p-4 mb-4">
        <div className="flex items-center justify-between">
          {/* Título del mes */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Calendar className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white capitalize">
                {nombreMes}
              </h3>
              <p className="text-xs text-gray-400">
                {transacciones.length} {transacciones.length === 1 ? 'transacción' : 'transacciones'}
              </p>
            </div>
          </div>

          {/* Estadísticas del mes */}
          <div className="flex items-center gap-6">
            {/* Ingresos */}
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <div className="text-right">
                <p className="text-xs text-gray-400">Ingresos</p>
                <p className="text-sm font-bold text-green-400">
                  {formatearMonto(totalIngresos)}
                </p>
              </div>
            </div>

            {/* Gastos */}
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <div className="text-right">
                <p className="text-xs text-gray-400">Gastos</p>
                <p className="text-sm font-bold text-red-400">
                  {formatearMonto(totalGastos)}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="pl-6 border-l border-white/10">
              <p className="text-xs text-gray-400">Balance</p>
              <p className={`text-base font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {balance >= 0 ? '+' : ''}{formatearMonto(balance)}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
