import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { TextReveal } from "@/components/ui/TextReveal";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { GlowWrapper } from "@/components/landing/GlowWrapper";
import { AutomationSection } from "@/components/landing/AutomationSection";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield, 
  FileText,
  DollarSign,
  Bell,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
  RefreshCw,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Server
} from "lucide-react";

/**
 * Landing Page Profesional - SociosMembres
 * Enfoque: Control operativo, no venta agresiva
 * Tono: Claridad, confianza y trazabilidad
 */

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      {/* Fondo animado sutil */}
      <AnimatedGradient />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <TextReveal delay={0.2}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                Sistema centralizado de gestión
              </div>
            </TextReveal>

            <TextReveal delay={0.4}>
              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
                Centraliza clientes,
                <br />
                <span className="text-white/60">suscripciones y finanzas</span>
                <br />
                en un solo sistema
              </h1>
            </TextReveal>

            <TextReveal delay={0.6}>
              <p className="mb-10 text-lg leading-relaxed text-white/50 sm:text-xl">
                Deja atrás las hojas de cálculo dispersas. Controla renovaciones, pagos, vencimientos y finanzas con trazabilidad completa por cliente.
              </p>
            </TextReveal>
          </div>

          {/* Dashboard Mockup Interactivo */}
          <div className="mt-12 sm:mt-16">
            <GlowWrapper intensity="medium">
              <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
                <div className="w-full p-4">
                  <DashboardMockup />
                </div>
              </div>
            </GlowWrapper>
            
            {/* Badge: Dashboard interactivo */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/40">
                ✨ Explora el dashboard interactivo con datos de demostración
              </p>
            </div>
          </div>
        </section>

        {/* Antes vs Después */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Del caos al orden</h2>
                <p className="text-lg text-white/50">Antes perdías renovaciones. Ahora tienes control.</p>
              </div>
            </ScrollReveal>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Antes */}
              <ScrollReveal delay={0.2}>
                <GlassCard className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                      <XCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Antes</h3>
                  </div>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      <span>Clientes en Excel y WhatsApp sin trazabilidad</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      <span>Renovaciones perdidas por falta de recordatorios</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      <span>Pagos dispersos entre Stripe, PayPal y Binance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      <span>Cancelaciones sin contexto ni motivo registrado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                      <span>Cero visibilidad de métricas como MRR o churn</span>
                    </li>
                  </ul>
                </GlassCard>
              </ScrollReveal>

              {/* Después */}
              <ScrollReveal delay={0.4}>
                <GlassCard className="p-5 sm:p-6 lg:p-8 border-emerald-500/20">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Ahora</h3>
                  </div>
                  <ul className="space-y-3 text-white/60">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Base única con historial completo por cliente</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Calendario con vencimientos y alertas automáticas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Todos los métodos de pago unificados en reportes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Notas por cliente y motivos de cancelación</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Dashboard con MRR, churn rate y crecimiento</span>
                    </li>
                  </ul>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Capacidades Principales */}
        <section id="capacidades" className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Todo lo que necesitas en un solo lugar</h2>
                <p className="text-lg text-white/50">Módulos diseñados para operar, no solo para ver datos</p>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Clientes */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Gestión de Clientes</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Base única con datos completos: correo, WhatsApp, producto, tipo de suscripción y estado actual.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Múltiples productos por cliente</li>
                  <li>• Vista tabla y Kanban</li>
                  <li>• Notas tipo timeline</li>
                </ul>
              </GlassCard>
              </CardSpotlight>

              {/* Renovaciones */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                  <RefreshCw className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Control de Renovaciones</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Lista de próximas a vencer filtrada por días. Renueva con un clic o programa fecha futura.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Alertas a 7, 15 y 30 días</li>
                  <li>• Indicadores de urgencia</li>
                  <li>• Renovación masiva</li>
                </ul>
              </GlassCard>
              </CardSpotlight>

              {/* Calendario */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Calendario Visual</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Vista mensual con vencimientos y pagos cobrados. Cada día muestra clientes y montos.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Indicadores por día</li>
                  <li>• Detalle en panel lateral</li>
                  <li>• Navegación por mes</li>
                </ul>
              </GlassCard>
              </CardSpotlight>

              {/* Historial */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Historial Completo</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Timeline de todos los pagos con filtros por cliente, método, concepto y rango de fechas.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Ingresos totales por cliente</li>
                  <li>• Renovaciones acumuladas</li>
                  <li>• Exportación a CSV</li>
                </ul>
              </GlassCard>
              </CardSpotlight>

              {/* Dashboard */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20">
                  <TrendingUp className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Métricas de Negocio</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Dashboard con MRR, churn rate, nuevos clientes, distribución por método de pago y más.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• MRR con tendencia MoM</li>
                  <li>• Tasa de churn mensual</li>
                  <li>• Top clientes por LTV</li>
                </ul>
              </GlassCard>
              </CardSpotlight>

              {/* Finanzas */}
              <CardSpotlight>
                <GlassCard className="p-4 sm:p-5 lg:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
                  <DollarSign className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Finanzas Multi-Moneda</h3>
                <p className="mb-4 text-sm leading-relaxed text-white/50">
                  Módulo separado para gastos operativos, retiros personales y cuentas con conversión automática.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• 8 monedas soportadas</li>
                  <li>• Tasas de cambio actualizadas</li>
                  <li>• Balance en tiempo real</li>
                </ul>
              </GlassCard>
              </CardSpotlight>
            </div>
          </div>
        </section>

        {/* Automatización de Recordatorios */}
        <AutomationSection />

        {/* Cómo Funciona */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Empieza en minutos</h2>
              <p className="text-lg text-white/50">Sin instalaciones complejas ni configuraciones técnicas</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 border border-violet-500/20 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                    <span className="text-2xl font-bold text-violet-400">1</span>
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">Crea tu cuenta</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Regístrate con correo y contraseña. Tu información está protegida con Row Level Security.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                    <span className="text-2xl font-bold text-emerald-400">2</span>
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">Agrega tus clientes</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Importa o carga uno por uno. Define producto, tipo de suscripción y método de pago.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                    <span className="text-2xl font-bold text-blue-400">3</span>
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">Opera con confianza</h3>
                <p className="text-sm leading-relaxed text-white/50">
                  Recibe alertas, renueva suscripciones y consulta métricas desde un solo panel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seguridad y Confianza */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Tus datos, siempre protegidos</h2>
              <p className="text-lg text-white/50">Arquitectura diseñada para privacidad y seguridad</p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
              <GlassCard className="p-4 sm:p-5 lg:p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                    <Lock className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">Row Level Security</h3>
                <p className="text-xs leading-relaxed text-white/40">
                  Solo ves y modificas tus propios datos. Políticas a nivel de base de datos.
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-5 lg:p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">Autenticación JWT</h3>
                <p className="text-xs leading-relaxed text-white/40">
                  Sesiones seguras con tokens auto-renovables y persistencia local.
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-5 lg:p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
                    <Server className="h-6 w-6 text-violet-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">Supabase Backend</h3>
                <p className="text-xs leading-relaxed text-white/40">
                  Infraestructura escalable con backups automáticos y 99.9% uptime.
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-5 lg:p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20">
                    <Users className="h-6 w-6 text-pink-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">Multi-Usuario</h3>
                <p className="text-xs leading-relaxed text-white/40">
                  Cada cuenta es independiente. Tus clientes nunca se cruzan con otros.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Deja de perder renovaciones</h2>
            <p className="mb-8 text-lg leading-relaxed text-white/50">
              Centraliza tu operación en un solo sistema. Sin planes de pago, sin límites artificiales.
            </p>
            <div className="flex justify-center">
              <Link to="/auth">
                <HoverBorderGradient 
                  as="div" 
                  className="px-6 py-3 text-base font-medium flex items-center gap-2"
                  duration={1.5}
                >
                  Comenzar ahora <ArrowRight className="h-5 w-5" />
                </HoverBorderGradient>
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/40">
              No se requiere tarjeta de crédito
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <img src="/logo-simple.svg" alt="SociosMembres" className="h-8 w-8" />
                  <span className="font-bold text-white">SociosMembres</span>
                </div>
                <p className="text-sm leading-relaxed text-white/40">
                  Sistema centralizado para gestionar clientes, suscripciones y finanzas con trazabilidad completa.
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Producto</h4>
                <ul className="space-y-2 text-sm text-white/40">
                  <li><a href="#capacidades" className="hover:text-white transition-colors">Funciones</a></li>
                  <li><Link to="/auth" className="hover:text-white transition-colors">Acceder</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Sistema</h4>
                <ul className="space-y-2 text-sm text-white/40">
                  <li>Versión 1.3.0</li>
                  <li>Última actualización: 14 Mayo 2026</li>
                  <li>React 18 + TypeScript + Supabase</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 text-center text-sm text-white/30">
              © 2026 SociosMembres. Sistema de gestión de suscripciones.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
