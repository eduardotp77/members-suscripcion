import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressCircularProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  className?: string;
}

/**
 * Componente de progreso circular
 * Ideal para mostrar porcentajes de presupuesto consumido
 * Cambia de color según el nivel de consumo
 */
export function ProgressCircular({
  percentage,
  size = 48,
  strokeWidth = 4,
  color,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showLabel = true,
  className = '',
}: ProgressCircularProps) {
  // Limitar entre 0 y 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Color automático según porcentaje si no se especifica
  const autoColor = normalizedPercentage < 70 
    ? '#10b981' // verde
    : normalizedPercentage < 90
    ? '#f59e0b' // amarillo
    : '#ef4444'; // rojo
  
  const finalColor = color || autoColor;
  
  // Cálculo del círculo
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedPercentage / 100) * circumference;
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Círculo de fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Círculo de progreso */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={finalColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Label centrado */}
      {showLabel && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span 
            className="text-xs font-bold"
            style={{ color: finalColor }}
          >
            {Math.round(normalizedPercentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}
