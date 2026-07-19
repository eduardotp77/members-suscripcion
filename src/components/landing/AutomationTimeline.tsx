import { motion } from "framer-motion";
import { Clock, Users, Bell, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Timeline Animado de Automatización
 * 
 * Muestra visualmente los dos momentos clave del día:
 * - 10:00 AM: Resumen diario para dueños
 * - 20:00 PM: Recordatorios a clientes
 * 
 * Incluye animaciones de pulso y línea de progreso
 */
export function AutomationTimeline() {
  return (
    <div className="relative">
      {/* Contenedor responsive */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-0">
        
        {/* Nodo 1: 10:00 AM - Resumen Dueños */}
        <TimelineNode
          time="10:00 AM"
          title="Resumen para ti"
          description="Lista de clientes que vencen HOY"
          icon={<Users className="h-6 w-6" />}
          color="violet"
          delay={0}
        />

        {/* Línea conectora animada */}
        <TimelineConnector />

        {/* Nodo 2: 20:00 PM - Recordatorio Clientes */}
        <TimelineNode
          time="20:00 PM"
          title="Recordatorio clientes"
          description="Alerta 3 días antes del vencimiento"
          icon={<Bell className="h-6 w-6" />}
          color="emerald"
          delay={0.2}
        />
      </div>

      {/* Badge explicativo */}
      <div className="mt-8 text-center">
        <p className="text-sm text-white/50">
          <Clock className="inline h-4 w-4 mr-1" />
          Ejecuciones automáticas diarias · Sin intervención manual
        </p>
      </div>
    </div>
  );
}

/**
 * Componente reutilizable: Nodo de Timeline
 */
interface TimelineNodeProps {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "violet" | "emerald";
  delay: number;
}

function TimelineNode({ time, title, description, icon, color, delay }: TimelineNodeProps) {
  // Colores según el tipo
  const colors = {
    violet: {
      bg: "bg-violet-500/20",
      border: "border-violet-500/30",
      text: "text-violet-400",
      glow: "shadow-violet-500/20",
    },
    emerald: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
    },
  };

  const colorScheme = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative z-10"
    >
      <GlassCard className={`p-6 ${colorScheme.border} max-w-xs lg:max-w-sm`}>
        {/* Icono central con pulso */}
        <div className="mb-4 flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorScheme.bg} ${colorScheme.text} shadow-lg ${colorScheme.glow}`}
          >
            {icon}
          </motion.div>
        </div>

        {/* Hora */}
        <div className={`mb-2 text-center text-2xl font-bold ${colorScheme.text}`}>
          {time}
        </div>

        {/* Título */}
        <h3 className="mb-1 text-center text-lg font-semibold text-white">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-center text-sm text-white/50">
          {description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Componente: Línea conectora animada
 */
function TimelineConnector() {
  return (
    <div className="relative flex items-center justify-center lg:mx-8">
      {/* Línea base (vertical en mobile, horizontal en desktop) */}
      <div className="h-12 w-0.5 bg-white/10 lg:h-0.5 lg:w-32" />

      {/* Línea de progreso animada */}
      <motion.div
        initial={{ scaleY: 0, scaleX: 0 }}
        whileInView={{ scaleY: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        className="absolute h-12 w-0.5 bg-gradient-to-b from-violet-500 to-emerald-500 lg:h-0.5 lg:w-32 lg:bg-gradient-to-r"
        style={{ transformOrigin: "left center" }}
      />

      {/* Flecha animada */}
      <motion.div
        animate={{
          x: [0, 8, 0],
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute hidden lg:block"
      >
        <ArrowRight className="h-5 w-5 text-emerald-400" />
      </motion.div>
    </div>
  );
}
