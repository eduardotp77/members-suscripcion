import { motion } from "framer-motion";
import { ReactNode, ElementType } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  as?: ElementType;
}

/**
 * Contenedor que anima sus hijos con un retraso escalonado sutil
 * Perfecto para listas que aparecen progresivamente
 */
export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.05,
  duration = 0.4,
  as = "div",
}: StaggerContainerProps) => {
  const MotionComponent = motion(as);
  
  return (
    <MotionComponent
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  as?: ElementType;
}

/**
 * Item individual dentro del StaggerContainer
 * Se anima con fade-in y ligero movimiento hacia arriba
 */
export const StaggerItem = ({
  children,
  className = "",
  duration = 0.4,
  as = "div",
}: StaggerItemProps) => {
  const MotionComponent = motion(as);
  
  return (
    <MotionComponent
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
};
