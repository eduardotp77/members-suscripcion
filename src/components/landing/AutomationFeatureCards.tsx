import { motion } from "framer-motion";
import { MessageSquare, Mail, Brain, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CardSpotlight } from "@/components/ui/CardSpotlight";

/**
 * Tarjetas de Características de Automatización
 * 
 * Muestra 3 características principales:
 * 1. Multi-Canal (WhatsApp + Email)
 * 2. Inteligente (Filtrado automático)
 * 3. Cero Intervención (100% automático)
 */
export function AutomationFeatureCards() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature, index) => (
        <FeatureCard key={feature.title} feature={feature} delay={index * 0.1} />
      ))}
    </div>
  );
}

/**
 * Definición de características
 */
const FEATURES = [
  {
    title: "Multi-Canal",
    description: "WhatsApp + Email en un solo flujo automatizado",
    badge: "2 canales",
    icon: <TwoChannelIcon />,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/20",
  },
  {
    title: "Inteligente",
    description: "Filtra automáticamente por fechas de vencimiento exactas",
    badge: "3 días antes",
    icon: <Brain className="h-7 w-7" />,
    gradient: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/20",
  },
  {
    title: "Cero Intervención",
    description: "Ejecuciones diarias automáticas sin tocar nada",
    badge: "100% automático",
    icon: <Zap className="h-7 w-7" />,
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/20",
  },
];

/**
 * Componente reutilizable: Tarjeta de característica
 */
interface FeatureCardProps {
  feature: typeof FEATURES[0];
  delay: number;
}

function FeatureCard({ feature, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <CardSpotlight>
        <GlassCard className="group relative h-full p-6 transition-all hover:border-white/20">
          {/* Badge con ping effect */}
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex items-center gap-2 rounded-full ${feature.bgColor} px-3 py-1 text-xs font-medium`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-r ${feature.gradient} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r ${feature.gradient}`}
                ></span>
              </span>
              {feature.badge}
            </div>
          </div>

          {/* Icono animado */}
          <div className="mb-4">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
            >
              {feature.icon}
            </motion.div>
          </div>

          {/* Título */}
          <h3 className="mb-2 text-xl font-bold text-white">
            {feature.title}
          </h3>

          {/* Descripción */}
          <p className="text-sm leading-relaxed text-white/60">
            {feature.description}
          </p>

          {/* Gradient hover line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r ${feature.gradient}`}
          />
        </GlassCard>
      </CardSpotlight>
    </motion.div>
  );
}

/**
 * Componente auxiliar: Icono de dos canales (WhatsApp + Email)
 */
function TwoChannelIcon() {
  return (
    <div className="relative h-7 w-7">
      {/* Email icon (fondo) */}
      <Mail className="absolute left-0 top-0 h-5 w-5 text-blue-400" />
      {/* WhatsApp icon (frente, desplazado) */}
      <MessageSquare className="absolute bottom-0 right-0 h-5 w-5 text-cyan-400" />
    </div>
  );
}
