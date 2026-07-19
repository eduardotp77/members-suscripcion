import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { TextReveal } from "@/components/ui/TextReveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CancelarModal } from "@/components/ui/CancelarModal";
import { RenovarModal } from "@/components/ui/RenovarModal";
import { useClientes } from "@/hooks/useClientes";
import { Cliente } from "@/types";
import { 
  formatearFechaCorta, 
  formatearMoneda, 
  diasHastaVencimiento,
  obtenerProximasVencer
} from "@/lib/utils";
import { labelsTipoSuscripcion } from "@/lib/theme";
import { 
  RefreshCw, 
  Clock, 
  User, 
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Página de gestión de renovaciones
 * Lista suscripciones próximas a vencer con opción de renovación rápida
 */
export default function Renovaciones() {
  const { clientes, loading, renovarSuscripcion, cancelarSuscripcion } = useClientes();
  const [renovando, setRenovando] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<string | null>(null);
  
  // Estados del modal de cancelación
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [clienteACancelar, setClienteACancelar] = useState<Cliente | null>(null);

  // Estados del modal de renovación
  const [modalRenovarAbierto, setModalRenovarAbierto] = useState(false);
  const [clienteARenovar, setClienteARenovar] = useState<Cliente | null>(null);

  // Filtros de días
  const [diasFiltro, setDiasFiltro] = useState(7);

  // Paginación
  const ITEMS_POR_PAGINA = 10;
  const [paginaActual, setPaginaActual] = useState(1);

  // Obtener suscripciones según el filtro
  const proximasVencer = obtenerProximasVencer(clientes, diasFiltro);
  const totalPaginas = Math.ceil(proximasVencer.length / ITEMS_POR_PAGINA);
  const proximasVencerPaginadas = proximasVencer.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  // Manejar renovación
  const handleRenovar = async (cliente: Cliente) => {
    setClienteARenovar(cliente);
    setModalRenovarAbierto(true);
  };

  // Confirmar renovación con fecha
  const handleConfirmarRenovar = async (fechaRenovacion: string) => {
    if (!clienteARenovar) return;
    
    setRenovando(clienteARenovar.id);
    try {
      await renovarSuscripcion(clienteARenovar.id, fechaRenovacion);
      setModalRenovarAbierto(false);
      setClienteARenovar(null);
    } finally {
      setRenovando(null);
    }
  };

  // Abrir modal de cancelación
  const handleAbrirCancelar = (cliente: Cliente) => {
    setClienteACancelar(cliente);
    setModalCancelarAbierto(true);
  };

  // Manejar cancelación con motivo
  const handleCancelar = async (motivo: string) => {
    if (!clienteACancelar) return;
    
    setCancelando(clienteACancelar.id);
    try {
      await cancelarSuscripcion(clienteACancelar.id, motivo);
      setModalCancelarAbierto(false);
      setClienteACancelar(null);
    } finally {
      setCancelando(null);
    }
  };

  // Opciones de filtro de días
  const opcionesDias = [
    { valor: 7, label: "7 días" },
    { valor: 15, label: "15 días" },
    { valor: 30, label: "30 días" },
  ];

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <TextReveal delay={0.1}>
              <h1 className="text-2xl font-bold text-white">Renovaciones</h1>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="mt-1 text-white/60">
                Gestiona las suscripciones próximas a vencer
              </p>
            </TextReveal>
          </div>

          {/* Filtro de días */}
          <div className="flex gap-2">
            {opcionesDias.map((opcion) => (
              <button
                key={opcion.valor}
                onClick={() => { setDiasFiltro(opcion.valor); setPaginaActual(1); }}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300",
                  diasFiltro === opcion.valor
                    ? "bg-primary text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {opcion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{proximasVencer.length}</p>
              <p className="text-sm text-white/50">Próximas a vencer</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <Clock className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {proximasVencer.filter((c) => (diasHastaVencimiento(c.fechaVencimiento) ?? 0) <= 3).length}
              </p>
              <p className="text-sm text-white/50">Urgentes (3 días)</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatearMoneda(
                  proximasVencer.reduce((sum, c) => sum + c.valorCobrado, 0)
                )}
              </p>
              <p className="text-sm text-white/50">Ingresos potenciales</p>
            </div>
          </GlassCard>
        </div>

        {/* Lista de renovaciones */}
        {proximasVencer.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-400/50" />
            <h3 className="mt-4 text-lg font-medium text-white">
              ¡Todo en orden!
            </h3>
            <p className="mt-2 text-white/50">
              No hay suscripciones próximas a vencer en los próximos {diasFiltro} días
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {proximasVencerPaginadas.map((cliente, index) => {
              const dias = diasHastaVencimiento(cliente.fechaVencimiento);
              const urgente = dias !== null && dias <= 3;

              return (
                <CardSpotlight key={cliente.id}>
                  <GlassCard
                  className={cn(
                    "animate-fade-in",
                    urgente && "border-red-500/30 bg-red-500/5"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Info del cliente */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{cliente.nombre}</p>
                        <p className="text-sm text-white/50">{cliente.correo}</p>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-white/40">Producto</p>
                        <p className="text-sm font-medium text-white">{cliente.producto}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-white/40">Tipo</p>
                        <p className="text-sm font-medium text-white">
                          {labelsTipoSuscripcion[cliente.tipoSuscripcion]}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-white/40">Vencimiento</p>
                        <p className={cn(
                          "text-sm font-bold",
                          urgente ? "text-red-400" : "text-amber-400"
                        )}>
                          {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `${dias} días`}
                        </p>
                        <p className="text-xs text-white/40">
                          {formatearFechaCorta(cliente.fechaVencimiento)}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-white/40">Valor</p>
                        <p className="text-sm font-bold text-emerald-400">
                          {formatearMoneda(cliente.valorCobrado)}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-white/40">Renovaciones</p>
                        <p className="text-sm font-medium text-white">
                          {cliente.totalRenovaciones}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRenovar(cliente)}
                        disabled={renovando === cliente.id || cancelando === cliente.id}
                        className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <HoverBorderGradient
                          as="div"
                          className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                          duration={1.5}
                          containerClassName="border-emerald-500/30"
                        >
                          {renovando === cliente.id ? (
                            "Renovando..."
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                              Renovar
                            </>
                          )}
                        </HoverBorderGradient>
                      </button>
                      
                      <button
                        onClick={() => handleAbrirCancelar(cliente)}
                        disabled={cancelando === cliente.id || renovando === cliente.id}
                        className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <HoverBorderGradient
                          as="div"
                          className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer bg-red-600/80"
                          duration={1.5}
                          containerClassName="border-red-500/30"
                        >
                          {cancelando === cliente.id ? (
                            "Cancelando..."
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              Cancelar
                            </>
                          )}
                        </HoverBorderGradient>
                      </button>
                    </div>
                  </div>
                </GlassCard>
                </CardSpotlight>
              );
            })}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <p className="text-sm text-white/40">
                  Página {paginaActual} de {totalPaginas} · {proximasVencer.length} suscripciones
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaginaActual((p) => p - 1)}
                    disabled={paginaActual === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPaginaActual((p) => p + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de cancelación */}
      <CancelarModal
        cliente={clienteACancelar}
        isOpen={modalCancelarAbierto}
        onClose={() => {
          setModalCancelarAbierto(false);
          setClienteACancelar(null);
        }}
        onConfirm={handleCancelar}
        loading={!!cancelando}
      />

      {/* Modal de renovación */}
      <RenovarModal
        cliente={clienteARenovar}
        isOpen={modalRenovarAbierto}
        onClose={() => {
          setModalRenovarAbierto(false);
          setClienteARenovar(null);
        }}
        onConfirm={handleConfirmarRenovar}
        loading={!!renovando}
      />
    </PageLayout>
  );
}
