import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Componente que revela texto con una animación sutil y elegante
 * Aparece con fade-in y ligero movimiento vertical
 */
export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1], // Easing elegante
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
