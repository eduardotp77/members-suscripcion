import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressCircular } from '@/components/finanzas/stats/ProgressCircular';
import type { TipoCategoria } from '@/types';

interface CategoriaPreviewProps {
  nombre: string;
  tipo: TipoCategoria;
  color: string;
  icono: string;
  presupuestoMensual: string;
}

/**
 * Preview en tiempo real de cómo se verá la categoría
 */
export function CategoriaPreview({
  nombre,
  tipo,
  color,
  icono,
  presupuestoMensual,
}: CategoriaPreviewProps) {
  const emoji = obtenerEmoji(icono);
  const presupuesto = parseFloat(presupuestoMensual) || 0;
  const isGasto = tipo === 'gasto';
  
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-medium">Vista Previa</p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className="relative overflow-hidden" padding="none">
          {/* Header con gradiente */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(to right, ${color}40, ${color}80)`
            }}
          />
          
          <div className="p-4 space-y-3">
            {/* Nombre y tipo */}
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg text-2xl"
                style={{ backgroundColor: `${color}15` }}
              >
                {emoji}
              </div>
              <div>
                <span className="text-sm font-semibold text-white">
                  {nombre || 'Nombre de categoría'}
                </span>
                <p className="text-xs text-gray-400 capitalize">{tipo}</p>
              </div>
            </div>
            
            {/* Monto simulado */}
            <div>
              <p className="text-xs text-gray-400">
                {isGasto ? 'Gastado' : 'Recibido'} este mes
              </p>
              <p className="text-xl font-bold text-white">$0.00</p>
            </div>
            
            {/* Presupuesto (solo para gastos) */}
            {isGasto && presupuesto > 0 && (
              <div className="flex items-center gap-4 pt-2">
                <ProgressCircular percentage={0} size={48} strokeWidth={4} />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Presupuesto Mensual</p>
                  <p className="text-sm font-semibold text-white">
                    ${presupuesto.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/**
 * Obtiene el emoji según el icono
 */
function obtenerEmoji(icono: string): string {
  const emojis: Record<string, string> = {
    shopping: '🛍️',
    food: '🍔',
    transport: '🚗',
    home: '🏠',
    health: '🏥',
    education: '📚',
    entertainment: '🎬',
    tech: '💻',
    service: '⚙️',
    other: '📌',
  };
  
  return emojis[icono] || '📌';
}
