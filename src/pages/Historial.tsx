import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { TextReveal } from "@/components/ui/TextReveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useClientes } from "@/hooks/useClientes";
import { MedioPago } from "@/types";
import { formatearMoneda } from "@/lib/utils";
import { parseFechaLocal } from "@/lib/dateUtils";
import { 
  Search, 
  CreditCard,
  RefreshCw,
  Loader2,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Historial() {
  const { 
    pagos, 
    clientes,
    loading,
    clientesConEstadisticas,
  } = useClientes();
  
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [ordenar, setOrdenar] = useState<"renovaciones" | "ingresos">("renovaciones");
  const [paginaActual, setPaginaActual] = useState(1);

  const metricas = useMemo(() => {
    if (!pagos?.length || !clientes?.length) {
      return {
        ingresoTotal: 0,
        pagosMesActual: 0,
        ingresoMesActual: 0,
        clientesActivos: 0
      };
    }

    const ingresoTotal = pagos.reduce((acc, pago) => acc + pago.monto, 0);
    
    // Filtrar pagos del mes actual usando parseFechaLocal para evitar problemas de zona horaria
    const mesActual = new Date();
    const pagosMesActual = pagos.filter(pago => {
      const fechaPago = parseFechaLocal(pago.fecha);
      return fechaPago.getMonth() === mesActual.getMonth() && 
             fechaPago.getFullYear() === mesActual.getFullYear();
    });

    const clientesActivos = clientes.filter(cliente => cliente.estado === 'activa').length;

    return {
      ingresoTotal,
      pagosMesActual: pagosMesActual.length,
      ingresoMesActual: pagosMesActual.reduce((acc, pago) => acc + pago.monto, 0),
      clientesActivos
    };
  }, [pagos, clientes]);

  // Clientes con al menos una renovación, filtrados y ordenados
  const clientesFiltrados = useMemo(() => {
    const conRenovaciones = clientesConEstadisticas.filter(
      (item) => item.totalRenovaciones > 0
    );

    const filtrados = busqueda
      ? conRenovaciones.filter((item) => {
          const q = busqueda.toLowerCase();
          return (
            item.cliente.nombre.toLowerCase().includes(q) ||
            item.cliente.correo.toLowerCase().includes(q) ||
            item.cliente.producto.toLowerCase().includes(q)
          );
        })
      : conRenovaciones;

    return [...filtrados].sort((a, b) =>
      ordenar === "renovaciones"
        ? b.totalRenovaciones - a.totalRenovaciones
        : b.ingresosTotales - a.ingresosTotales
    );
  }, [clientesConEstadisticas, busqueda, ordenar]);

  const ITEMS_POR_PAGINA = 20;
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const opcionesOrden = [
    { value: "renovaciones", label: "Más renovaciones" },
    { value: "ingresos", label: "Más ingresos" },
  ];

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando reportes...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <TextReveal delay={0.1}>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Reportes & Analytics
            </h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="text-white/60">
              Métricas globales y análisis de clientes
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardSpotlight>
            <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Ingresos Totales</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatearMoneda(metricas.ingresoTotal)}
                </p>
              </div>
              <div className="rounded-full bg-emerald-500/20 p-3">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </GlassCard>
          </CardSpotlight>

          <CardSpotlight>
            <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Clientes Activos</p>
                <p className="text-2xl font-bold text-blue-400">
                  {metricas.clientesActivos}
                </p>
              </div>
              <div className="rounded-full bg-blue-500/20 p-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </GlassCard>
          </CardSpotlight>

          <CardSpotlight>
            <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Pagos Este Mes</p>
                <p className="text-2xl font-bold text-purple-400">
                  {metricas.pagosMesActual}
                </p>
              </div>
              <div className="rounded-full bg-purple-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </GlassCard>
          </CardSpotlight>

          <CardSpotlight>
            <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Ingresos Este Mes</p>
                <p className="text-2xl font-bold text-orange-400">
                  {formatearMoneda(metricas.ingresoMesActual)}
                </p>
              </div>
              <div className="rounded-full bg-orange-500/20 p-3">
                <CreditCard className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </GlassCard>
          </CardSpotlight>
        </div>

        {/* Tabla unificada de clientes con renovaciones */}
        <GlassCard>
          <div className="space-y-5">
            {/* Encabezado */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-violet-500/20 p-2">
                  <RefreshCw className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Clientes con Renovaciones
                  </h3>
                  <p className="text-sm text-white/60">
                    {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} encontrado{clientesFiltrados.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Controles de búsqueda y orden */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, correo o producto..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 backdrop-blur focus:border-violet-500/50 focus:outline-none sm:w-72"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <GlassSelect
                    value={ordenar}
                    onChange={(v) => { setOrdenar(v as "renovaciones" | "ingresos"); setPaginaActual(1); }}
                    options={opcionesOrden}
                  />
                </div>
              </div>
            </div>

            {/* Tabla */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-white/40" />
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-white/40">
                <RefreshCw className="h-10 w-10" />
                <p className="text-sm">
                  {busqueda
                    ? "No hay clientes que coincidan con la búsqueda"
                    : "Aún no hay clientes con renovaciones registradas"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-white/50">
                      <th className="pb-3 pr-4 font-medium">#</th>
                      <th className="pb-3 pr-4 font-medium">Cliente</th>
                      <th className="pb-3 pr-4 font-medium">Producto</th>
                      <th className="pb-3 pr-4 font-medium">Estado</th>
                      <th className="pb-3 pr-4 text-center font-medium">Renovaciones</th>
                      <th className="pb-3 pr-4 text-right font-medium">Ingresos Totales</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clientesPaginados.map((item, index) => (
                      <tr
                        key={item.cliente.id}
                        className="group transition-colors hover:bg-white/5"
                      >
                        <td className="py-3 pr-4 text-white/40 font-mono text-xs">
                          {(paginaActual - 1) * ITEMS_POR_PAGINA + index + 1}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-white">{item.cliente.nombre}</p>
                          <p className="text-xs text-white/50">{item.cliente.correo}</p>
                        </td>
                        <td className="py-3 pr-4 text-white/70">
                          {item.cliente.producto}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge estado={item.cliente.estado} />
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                            <RefreshCw className="h-3 w-3" />
                            {item.totalRenovaciones}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right font-semibold text-emerald-400">
                          {formatearMoneda(item.ingresosTotales)}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => navigate(`/clientes/${item.cliente.id}`)}
                            title="Ver detalle"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <p className="text-sm text-white/40">
                  Página {paginaActual} de {totalPaginas} · {clientesFiltrados.length} resultados
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
        </GlassCard>
      </div>
    </PageLayout>
  );
}