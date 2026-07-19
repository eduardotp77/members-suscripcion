import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BorderBeamProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

/**
 * Wrapper que añade un borde animado sutil alrededor del contenido
 * El borde gira lentamente creando un efecto elegante
 */
export function BorderBeam({ children, className = "", duration = 8 }: BorderBeamProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <motion.div
          className="absolute inset-[-2px]"
          style={{
            background: "conic-gradient(from 0deg, transparent 60%, rgba(139, 92, 246, 0.4) 80%, transparent 100%)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-[2px] rounded-lg bg-transparent backdrop-blur-sm" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
