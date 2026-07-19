import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Transaccion } from '@/types';

interface TransaccionesStatsBarProps {
  transacciones: Transaccion[];
  transaccionesFiltradas: Transaccion[];
  formatearMonto: (monto: number) => string;
}

/**
 * Barra de estadísticas para el módulo de transacciones
 * Muestra métricas rápidas y contextuales
 */
export function TransaccionesStatsBar({
  transacciones,
  transaccionesFiltradas,
  formatearMonto,
}: TransaccionesStatsBarProps) {
  // Calcular totales de las transacciones filtradas
  const totalIngresos = transaccionesFiltradas
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const totalGastos = transaccionesFiltradas
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const balance = totalIngresos - totalGastos;
  
  // Promedio por transacción
  const promedioTransaccion = transaccionesFiltradas.length > 0
    ? (totalIngresos + totalGastos) / transaccionesFiltradas.length
    : 0;
  
  // Mes actual
  const mesActual = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Ingresos',
      value: formatearMonto(totalIngresos),
      sublabel: `${transaccionesFiltradas.filter(t => t.tipo === 'ingreso').length} transacciones`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: TrendingDown,
      label: 'Total Gastos',
      value: formatearMonto(totalGastos),
      sublabel: `${transaccionesFiltradas.filter(t => t.tipo === 'gasto').length} transacciones`,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: DollarSign,
      label: 'Balance',
      value: formatearMonto(balance),
      sublabel: balance >= 0 ? 'Positivo' : 'Negativo',
      color: balance >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: balance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      icon: Activity,
      label: 'Promedio',
      value: formatearMonto(promedioTransaccion),
      sublabel: 'por transacción',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
  ];
  
  return (
    <GlassCard className="p-4 sticky top-20 z-10 backdrop-blur-xl bg-black/40">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{stat.label}</p>
              <p className="text-sm font-bold text-white truncate">{stat.value}</p>
              <p className="text-xs text-gray-500 truncate">{stat.sublabel}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          Mostrando {transaccionesFiltradas.length} de {transacciones.length} transacciones
        </span>
        <span className="capitalize">{mesActual}</span>
      </div>
    </GlassCard>
  );
}
