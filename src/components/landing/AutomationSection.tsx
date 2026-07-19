import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlowWrapper } from "@/components/landing/GlowWrapper";
import { AutomationTimeline } from "@/components/landing/AutomationTimeline";
import { AutomationFeatureCards } from "@/components/landing/AutomationFeatureCards";
import { MessagePreviewMockup } from "@/components/landing/MessagePreviewMockup";

/**
 * Sección de Automatización de Recordatorios
 * 
 * Muestra visualmente el sistema automatizado de recordatorios
 * que envía notificaciones por WhatsApp y Email tanto a dueños
 * como a clientes mediante n8n.
 * 
 * Características:
 * - Timeline animado con horarios de ejecución (10AM y 8PM)
 * - Tarjetas de características con efectos hover
 * - Preview interactivo de mensajes Email/WhatsApp
 * - Totalmente responsive
 */
export function AutomationSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative">
      {/* Fondo con efecto glow intenso */}
      <GlowWrapper intensity="high" className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <ScrollReveal>
          <div className="mb-12 text-center sm:mb-16">
            {/* Badge superior */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Automatización 24/7
            </div>

            {/* Título principal */}
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Nunca más pierdas una renovación
            </h2>

            {/* Subtítulo */}
            <p className="mx-auto max-w-2xl text-base text-white/60 sm:text-lg lg:text-xl">
              Sistema automatizado de recordatorios que trabaja mientras tú duermes.
              <br className="hidden sm:block" />
              <span className="text-white/80">WhatsApp + Email</span> sin intervención manual.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline animado */}
        <ScrollReveal delay={0.2}>
          <div className="mb-12 sm:mb-16">
            <AutomationTimeline />
          </div>
        </ScrollReveal>

        {/* Tarjetas de características */}
        <ScrollReveal delay={0.3}>
          <div className="mb-12 sm:mb-16">
            <AutomationFeatureCards />
          </div>
        </ScrollReveal>

        {/* Preview interactivo de mensajes */}
        <ScrollReveal delay={0.4}>
          <MessagePreviewMockup />
        </ScrollReveal>

        {/* Descripción técnica */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-white/40">
              Powered by{" "}
              <span className="text-violet-400">n8n</span>
              {" + "}
              <span className="text-emerald-400">EvolutionAPI</span>
              {" + "}
              <span className="text-blue-400">Brevo SMTP</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
