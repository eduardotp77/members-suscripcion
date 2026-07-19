import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  tapScale?: number;
}

/**
 * Wrapper para cards con microinteracciones sutiles
 * - Scale ligero en hover
 * - Lift effect (translateY)
 * - Feedback al hacer click
 */
export const InteractiveCard = ({
  children,
  className = "",
  hoverScale = 1.01,
  hoverY = -2,
  tapScale = 0.99,
}: InteractiveCardProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{
        scale: tapScale,
        transition: { duration: 0.1 },
      }}
    >
      {children}
    </motion.div>
  );
};
