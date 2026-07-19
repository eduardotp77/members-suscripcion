import { motion } from 'framer-motion';
import { Calendar, Receipt } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * Estado vacío cuando no hay transacciones
 */
export function TransaccionesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="p-12">
        <div className="text-center">
          {/* Icono animado */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 flex items-center justify-center"
          >
            <div className="relative">
              <Receipt className="h-16 w-16 text-white/20" />
              <Calendar className="h-8 w-8 text-white/20 absolute -bottom-1 -right-1" />
            </div>
          </motion.div>
          
          {/* Textos */}
          <h3 className="text-lg font-semibold text-white mb-2">
            No hay transacciones que mostrar
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Agrega tu primera transacción usando el botón "Nueva Transacción" para comenzar a llevar un registro de tus finanzas
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Estado cuando los filtros no devuelven resultados
 */
export function SinResultadosFiltros({ onLimpiarFiltros }: { onLimpiarFiltros: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            No se encontraron transacciones
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            No hay transacciones que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
          </p>
          
          <button
            onClick={onLimpiarFiltros}
            className="px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 transition-colors text-sm font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
