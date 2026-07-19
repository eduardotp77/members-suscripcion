import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Estado vacío genérico para cuando no hay datos
 * Muestra un mensaje amigable y CTA opcional
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {/* Icono animado con efecto de "respiración" */}
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
        className="mb-4 text-white/20"
      >
        {icon}
      </motion.div>
      
      {/* Textos */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {/* CTA opcional */}
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * Estado vacío específico para cuentas
 */
export function CuentasEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      title="No tienes cuentas registradas"
      description="Crea tu primera cuenta para comenzar a gestionar tus finanzas de forma profesional"
      icon={<div className="text-6xl">💳</div>}
      actionLabel="Crear primera cuenta"
      onAction={onCreate}
    />
  );
}

/**
 * Estado vacío específico para categorías
 */
export function CategoriasEmptyState({ 
  tipo,
  onCreate 
}: { 
  tipo: 'ingreso' | 'gasto';
  onCreate?: () => void;
}) {
  const config = tipo === 'ingreso' 
    ? {
        title: 'No hay categorías de ingresos',
        description: 'Crea categorías para organizar tus fuentes de ingresos',
        icon: '📈',
      }
    : {
        title: 'No hay categorías de gastos',
        description: 'Crea categorías para controlar tus gastos y presupuestos',
        icon: '📉',
      };
  
  return (
    <EmptyState
      title={config.title}
      description={config.description}
      icon={<div className="text-6xl">{config.icon}</div>}
      actionLabel="Crear categoría"
      onAction={onCreate}
    />
  );
}
