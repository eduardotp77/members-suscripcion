import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, CheckCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Preview Interactivo de Mensajes
 * 
 * Permite alternar entre visualización de:
 * - Email HTML (resumen para dueños)
 * - WhatsApp (recordatorio para clientes)
 * 
 * Con transiciones suaves y datos de demostración
 */
export function MessagePreviewMockup() {
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp">("email");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Selector de canal */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-xl bg-white/5 p-1 backdrop-blur-sm">
          <TabButton
            active={activeTab === "email"}
            onClick={() => setActiveTab("email")}
            icon={<Mail className="h-4 w-4" />}
            label="Email Preview"
          />
          <TabButton
            active={activeTab === "whatsapp"}
            onClick={() => setActiveTab("whatsapp")}
            icon={<MessageSquare className="h-4 w-4" />}
            label="WhatsApp Preview"
          />
        </div>
      </div>

      {/* Contenedor del preview con transición */}
      <GlassCard className="overflow-hidden p-0">
        <AnimatePresence mode="wait">
          {activeTab === "email" ? (
            <EmailPreview key="email" />
          ) : (
            <WhatsAppPreview key="whatsapp" />
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

/**
 * Componente reutilizable: Botón de tab
 */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "text-white"
          : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-lg bg-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}

/**
 * Preview de Email (Resumen Diario)
 */
function EmailPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8"
    >
      {/* Simulación de email */}
      <div className="mx-auto max-w-2xl">
        {/* Header del email */}
        <div className="mb-6 border-b border-white/10 pb-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-white/40">
            <span>De:</span>
            <span className="text-violet-400">sucorreo@ejemplo.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>Para:</span>
            <span className="text-white/60">tu-cliente@ejemplo.com</span>
          </div>
        </div>

        {/* Contenido del email */}
        <div>
          {/* Título */}
          <h3 className="mb-2 text-2xl font-bold text-violet-400">
            📋 Resumen Diario
          </h3>
          <p className="mb-4 text-sm text-white/40">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          {/* Texto introductorio */}
          <p className="mb-4 text-sm text-white/70">
            Hola <strong className="text-white">Usuario</strong>, estos son tus clientes que vencen{" "}
            <strong className="text-red-400">hoy</strong>:
          </p>

          {/* Badge de alerta */}
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="mb-1 text-xs text-white/50">VENCEN HOY</p>
            <p className="text-3xl font-bold text-red-400">3 clientes</p>
          </div>

          {/* Tabla de clientes */}
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-3 text-left text-xs font-normal text-white/40">#</th>
                  <th className="p-3 text-left text-xs font-normal text-white/40">CLIENTE</th>
                  <th className="p-3 text-left text-xs font-normal text-white/40">PRODUCTO</th>
                  <th className="p-3 text-left text-xs font-normal text-white/40">VALOR</th>
                </tr>
              </thead>
              <tbody>
                <TableRow num={1} name="María González" product="Premium Plus" value={49.99} />
                <TableRow num={2} name="Carlos Ruiz" product="Básico" value={19.99} />
                <TableRow num={3} name="Ana Martínez" product="Empresarial" value={99.99} />
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/30">
            SociosMembres · Resumen automático diario
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Componente auxiliar: Fila de tabla
 */
interface TableRowProps {
  num: number;
  name: string;
  product: string;
  value: number;
}

function TableRow({ num, name, product, value }: TableRowProps) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="p-3 text-white/40">{num}</td>
      <td className="p-3 font-semibold text-white">{name}</td>
      <td className="p-3 text-violet-400">{product}</td>
      <td className="p-3 text-emerald-400">${value} USD</td>
    </tr>
  );
}

/**
 * Preview de WhatsApp (Recordatorio Cliente)
 */
function WhatsAppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0b141a] p-6 sm:p-8"
    >
      {/* Simulación de chat de WhatsApp */}
      <div className="mx-auto max-w-md">
        {/* Header del chat */}
        <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-white">SociosMembres</p>
            <p className="text-xs text-white/40">Sistema Automatizado</p>
          </div>
        </div>

        {/* Bubble del mensaje */}
        <div className="flex justify-start">
          <div className="max-w-[85%]">
            {/* Mensaje */}
            <div className="rounded-2xl rounded-tl-sm bg-[#005c4b] p-4 shadow-lg">
              <p className="mb-1 text-sm leading-relaxed text-white">
                Hola <strong>Juan Pérez</strong> 👋
              </p>
              <p className="mb-1 text-sm leading-relaxed text-white/90">
                Te recordamos que tu suscripción al producto{" "}
                <strong>Premium Plus</strong> vence el{" "}
                <strong>18/05/2026</strong>, es decir, en{" "}
                <strong>3 días</strong>.
              </p>
              <p className="mb-1 text-sm leading-relaxed text-white/90">
                Para renovar y seguir disfrutando del acceso, recuerda tener saldo en tu tarjeta.
              </p>
              <p className="text-sm leading-relaxed text-white/90">
                ¡Gracias por confiar en nosotros! 🙏
              </p>

              {/* Timestamp y checkmarks */}
              <div className="mt-2 flex items-center justify-end gap-1 text-xs text-white/50">
                <span>20:05</span>
                <CheckCheck className="h-4 w-4 text-blue-400" />
              </div>
            </div>

            {/* Indicador de mensaje enviado por sistema */}
            <p className="mt-2 text-xs text-white/30">
              Enviado automáticamente · Sin intervención manual
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
