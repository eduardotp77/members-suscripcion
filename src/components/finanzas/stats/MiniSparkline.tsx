import { memo } from 'react';
import { motion } from 'framer-motion';

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

/**
 * Componente mini sparkline para mostrar tendencias
 * Renderiza una línea simple sin ejes ni labels
 * Ideal para mostrar tendencias de 7-30 días en espacios reducidos
 */
export const MiniSparkline = memo(({ 
  data, 
  color = '#8b5cf6',
  height = 32,
  className = ''
}: MiniSparklineProps) => {
  if (!data || data.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <span className="text-xs text-white/30">Sin datos</span>
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Normalizar datos a puntos SVG
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
    >
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ vectorEffect: 'non-scaling-stroke' }}
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
