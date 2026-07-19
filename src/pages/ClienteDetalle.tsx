import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useClientes } from "@/hooks/useClientes";
import { formatearFecha, formatearFechaCorta, formatearMoneda } from "@/lib/utils";
import { labelsTipoSuscripcion, labelsMedioPago } from "@/lib/theme";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  CreditCard,
  DollarSign,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Clock,
  MessageCircle,
  Mail,
  Loader2,
  Package,
  Eye,
  Plus,
  RotateCcw
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { NotasTimeline } from "@/components/clientes/NotasTimeline";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { ClienteFormData } from "@/types";

/**
 * Página de detalle específico de cliente
 * Vista completa con métricas, gráficos y historial detallado
 */
export default function ClienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    clientes, 
    loading, 
    obtenerPagosCliente, 
    calcularEstadisticasCliente,
    agregarCliente,
    combinacionesExistentes,
    obtenerNotasCliente,
    agregarNota,
    eliminarNota,
    reactivarCliente,
  } = useClientes();

  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleAgregarProducto = async (datos: ClienteFormData) => {
    setGuardando(true);
    try {
      await agregarCliente(datos);
      setModalProductoAbierto(false);
    } finally {
      setGuardando(false);
    }
  };

  // Lista de productos únicos para el combobox del formulario
  const productosExistentes = useMemo(() => {
    const set = new Set(clientes.map((c) => c.producto).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clientes]);

  // Encontrar cliente actual
  const cliente = useMemo(() => {
    return clientes.find(c => c.id === id);
  }, [clientes, id]);

  // Obtener datos específicos del cliente
  const pagosCliente = useMemo(() => {
    return id ? obtenerPagosCliente(id) : [];
  }, [id, obtenerPagosCliente]);

  const estadisticas = useMemo(() => {
    return id ? calcularEstadisticasCliente(id) : null;
  }, [id, calcularEstadisticasCliente]);

  // Otros productos del mismo cliente (mismo correo, distinto id)
  const otrosProductos = useMemo(() => {
    if (!cliente) return [];
    return clientes.filter(
      (c) => c.correo.toLowerCase() === cliente.correo.toLowerCase() && c.id !== cliente.id
    );
  }, [clientes, cliente]);

  // Obtener notas del cliente
  const notasCliente = id ? obtenerNotasCliente(id) : [];

  // Preparar datos para gráficos
  const datosGrafico = useMemo(() => {
    if (!estadisticas) return [];
    
    return Object.entries(estadisticas.pagosPorMes)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mes, ingresos]) => ({
        mes: format(parseISO(mes + "-01"), "MMM yyyy", { locale: es }),
        ingresos,
        renovaciones: estadisticas.renovacionesPorMes[mes] || 0,
      }));
  }, [estadisticas]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!cliente) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <User className="mx-auto h-16 w-16 text-white/20" />
            <h3 className="mt-4 text-lg font-medium text-white">Cliente no encontrado</h3>
            <p className="mt-2 text-white/50">El cliente solicitado no existe o fue eliminado</p>
            <button onClick={() => navigate('/clientes')} className="mt-4 bg-transparent border-0 p-0 cursor-pointer">
              <HoverBorderGradient
                as="div"
                className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                duration={1.5}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Clientes
              </HoverBorderGradient>
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/clientes')} className="bg-transparent border-0 p-0 cursor-pointer">
              <HoverBorderGradient
                as="div"
                className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                duration={1.5}
                containerClassName="border-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </HoverBorderGradient>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{cliente.nombre}</h1>
              <p className="mt-1 text-white/60">Detalles completos del cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge estado={cliente.estado} />
            {cliente.estado === "cancelada" && (
              <button onClick={() => reactivarCliente(cliente.id)} className="bg-transparent border-0 p-0 cursor-pointer">
                <HoverBorderGradient
                  as="div"
                  className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  duration={1.5}
                  containerClassName="border-white/30"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reactivar
                </HoverBorderGradient>
              </button>
            )}
            <button onClick={() => setModalProductoAbierto(true)} className="bg-transparent border-0 p-0 cursor-pointer">
              <HoverBorderGradient
                as="div"
                className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                duration={1.5}
              >
                <Plus className="h-4 w-4" />
                Agregar Producto
              </HoverBorderGradient>
            </button>
          </div>
        </div>

        {/* Información básica del cliente */}
        <GlassCard>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Info personal */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <User className="h-5 w-5 text-primary" />
                Información Personal
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-white/50" />
                  <span className="text-white/80">{cliente.correo}</span>
                </div>
                {cliente.whatsapp && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                    <a
                      href={`https://wa.me/${cliente.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      {cliente.whatsapp}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/50" />
                  <span className="text-white/80">
                    Registrado: {formatearFecha(cliente.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info suscripción */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <CreditCard className="h-5 w-5 text-primary" />
                Suscripción Actual
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/50">Producto</p>
                  <p className="text-white">{cliente.producto}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Tipo</p>
                  <p className="text-white">{labelsTipoSuscripcion[cliente.tipoSuscripcion]}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Valor</p>
                  <p className="text-white font-semibold">{formatearMoneda(cliente.valorCobrado)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Medio de Pago</p>
                  <p className="text-white">{labelsMedioPago[cliente.medioPago]}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">Vencimiento</p>
                  <p className="text-white">{formatearFecha(cliente.fechaVencimiento)}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Estadísticas principales */}
        {estadisticas && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatearMoneda(estadisticas.ingresosTotales)}
                  </p>
                  <p className="text-sm text-white/50">Ingresos Totales</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                  <RefreshCw className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {estadisticas.totalRenovaciones}
                  </p>
                  <p className="text-sm text-white/50">Renovaciones</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatearMoneda(estadisticas.promedioMensual)}
                  </p>
                  <p className="text-sm text-white/50">Promedio Mensual</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {estadisticas.mesesActivo}
                  </p>
                  <p className="text-sm text-white/50">Meses Activo</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Gráficos */}
        {datosGrafico.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Gráfico de ingresos */}
            <GlassCard>
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                <BarChart3 className="h-5 w-5 text-primary" />
                Ingresos por Mes
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="mes" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [formatearMoneda(Number(value)), 'Ingresos']}
                    />
                    <Bar dataKey="ingresos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Gráfico de renovaciones */}
            <GlassCard>
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
                <TrendingUp className="h-5 w-5 text-primary" />
                Renovaciones por Mes
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="mes" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [value, 'Renovaciones']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="renovaciones" 
                      stroke="#06d6a0" 
                      strokeWidth={3}
                      dot={{ fill: '#06d6a0', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Timeline de pagos */}
        <GlassCard>
          <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-white">
            <Calendar className="h-5 w-5 text-primary" />
            Historial de Pagos ({pagosCliente.length})
          </h3>
          
          {pagosCliente.length === 0 ? (
            <div className="py-8 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-white/20" />
              <p className="mt-2 text-white/50">No hay pagos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pagosCliente.map((pago, index) => (
                <div 
                  key={pago.id}
                  className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    pago.concepto === 'nuevo' 
                      ? 'bg-emerald-500/20' 
                      : 'bg-blue-500/20'
                  }`}>
                    {pago.concepto === 'nuevo' ? (
                      <User className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <RefreshCw className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">
                        {pago.concepto === 'nuevo' ? 'Registro inicial' : 'Renovación'}
                      </p>
                      <p className="font-bold text-emerald-400">
                        {formatearMoneda(pago.monto)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span>{formatearFechaCorta(pago.fecha)}</span>
                      <span>•</span>
                      <span>{labelsMedioPago[pago.medioPago]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Otros productos del mismo cliente */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Package className="h-5 w-5 text-primary" />
              Otros Productos de este Cliente
              {otrosProductos.length > 0 && (
                <span className="ml-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-normal text-violet-300">
                  {otrosProductos.length}
                </span>
              )}
            </h3>
            <button
              onClick={() => setModalProductoAbierto(true)}
              className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300 transition-colors hover:bg-violet-500/20 hover:text-violet-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar producto
            </button>
          </div>

          {otrosProductos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-white/30">
              <Package className="h-8 w-8" />
              <p className="text-sm">Este cliente no tiene otros productos registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {otrosProductos.map((otro) => (
                <div
                  key={otro.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                      <Package className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{otro.producto}</p>
                      <p className="text-sm text-white/50">
                        {labelsTipoSuscripcion[otro.tipoSuscripcion]} &bull; {formatearMoneda(otro.valorCobrado)}
                      </p>
                      <p className="text-xs text-white/40">
                        Vence: {formatearFecha(otro.fechaVencimiento)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge estado={otro.estado} />
                    <button
                      onClick={() => navigate(`/clientes/${otro.id}`)}
                      title="Ver detalle de este producto"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Notas de registro del formulario */}
        {(cliente.notas || cliente.motivoCancelacion) && (
          <GlassCard>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Notas y Observaciones
            </h3>
            <div className="space-y-4">
              {cliente.notas && (
                <div>
                  <p className="text-sm text-white/50">Nota de registro:</p>
                  <p className="text-white/80">{cliente.notas}</p>
                </div>
              )}
              {cliente.motivoCancelacion && (
                <div>
                  <p className="text-sm text-white/50">Motivo de Cancelación:</p>
                  <p className="text-white/80">{cliente.motivoCancelacion}</p>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Timeline de notas */}
        {id && (
          <NotasTimeline
            clienteId={id}
            notas={notasCliente}
            onAgregarNota={agregarNota}
            onEliminarNota={eliminarNota}
          />
        )}
      </div>
    </PageLayout>

    {/* Modal para agregar nuevo producto al mismo cliente */}
    {modalProductoAbierto && (
      <ClienteForm
        onGuardar={handleAgregarProducto}
        onCancelar={() => setModalProductoAbierto(false)}
        loading={guardando}
        combinacionesExistentes={combinacionesExistentes}
        productosExistentes={productosExistentes}
        datosIniciales={{
          nombre: cliente.nombre,
          correo: cliente.correo,
          whatsapp: cliente.whatsapp || "",
        }}
      />
    )}
  </>
  );
}