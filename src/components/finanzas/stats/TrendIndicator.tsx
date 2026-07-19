import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  showIcon?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Indicador de tendencia con icono y color
 * Muestra variación porcentual con dirección visual
 */
export function TrendIndicator({
  value,
  label,
  showIcon = true,
  showPercentage = true,
  size = 'md',
  className = '',
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  const colorClass = isNeutral 
    ? 'text-gray-400' 
    : isPositive 
    ? 'text-green-400' 
    : 'text-red-400';
  
  const bgClass = isNeutral
    ? 'bg-gray-500/10'
    : isPositive
    ? 'bg-green-500/10'
    : 'bg-red-500/10';
  
  const sizeClasses = {
    sm: 'text-xs gap-1 px-1.5 py-0.5',
    md: 'text-sm gap-1.5 px-2 py-1',
    lg: 'text-base gap-2 px-3 py-1.5',
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        sizeClasses[size],
        colorClass,
        bgClass,
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      
      {showPercentage && (
        <span>
          {isPositive && '+'}{Math.abs(value).toFixed(1)}%
        </span>
      )}
      
      {label && (
        <span className="text-white/60 font-normal ml-1">
          {label}
        </span>
      )}
    </motion.div>
  );
}
