import { ReactNode } from "react";

interface GlowWrapperProps {
  children?: ReactNode;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

/**
 * Wrapper que añade un efecto de resplandor (glow) multi-capa
 * detrás del contenido, perfecto para destacar el Dashboard mockup
 */
export function GlowWrapper({ 
  children, 
  intensity = "medium",
  className = ""
}: GlowWrapperProps) {
  // Opacidades según intensidad
  const opacities = {
    low: 0.12,
    medium: 0.20,
    high: 0.30
  };

  const opacity = opacities[intensity];

  return (
    <div className={`relative ${className}`}>
      {/* Capas de glow en el fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Glow principal violeta (grande, centrado arriba) */}
        <div
          className="absolute -top-[250px] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full blur-[180px]"
          style={{
            background: `radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        
        {/* Glow secundario emerald (izquierda) */}
        <div
          className="absolute -top-[180px] left-[15%] w-[900px] h-[900px] rounded-full blur-[150px]"
          style={{
            background: `radial-gradient(circle, rgba(16, 185, 129, ${opacity * 0.7}) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        
        {/* Glow terciario pink (derecha) */}
        <div
          className="absolute -top-[120px] right-[15%] w-[700px] h-[700px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, rgba(236, 72, 153, ${opacity * 0.5}) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Glow adicional naranja (esquina inferior) */}
        <div
          className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background: `radial-gradient(circle, rgba(251, 146, 60, ${opacity * 0.4}) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Contenido con marco glassmorphism */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
