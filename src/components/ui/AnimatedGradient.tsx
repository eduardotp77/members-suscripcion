import { motion } from "framer-motion";

interface AnimatedGradientProps {
  className?: string;
}

/**
 * Fondo con gradientes animados sutiles
 * Los orbes se mueven lentamente creando una atmósfera elegante
 */
export function AnimatedGradient({ className = "" }: AnimatedGradientProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orbe violeta */}
      <motion.div
        className="absolute rounded-full bg-violet-600/10 blur-[120px]"
        style={{
          width: "500px",
          height: "500px",
          top: "0%",
          left: "25%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Orbe esmeralda */}
      <motion.div
        className="absolute rounded-full bg-emerald-600/8 blur-[100px]"
        style={{
          width: "400px",
          height: "400px",
          bottom: "0%",
          right: "25%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Orbe rosa sutil (nuevo) */}
      <motion.div
        className="absolute rounded-full bg-pink-600/6 blur-[90px]"
        style={{
          width: "350px",
          height: "350px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
