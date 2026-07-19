import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Cliente, FiltrosCliente } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ClienteFilters } from "./ClienteFilters";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { 
  formatearFechaCorta, 
  formatearMoneda,
  diasHastaVencimiento 
} from "@/lib/utils";
import { labelsTipoSuscripcion, labelsMedioPago } from "@/lib/theme";
import { 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  MessageCircle,
  StickyNote,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Props del componente
interface ClientesListProps {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (cliente: Cliente) => void;
  onRenovar: (cliente: Cliente) => void;
  onAgregarNota: (cliente: Cliente) => void;
  onReactivar: (cliente: Cliente) => void;
}

// Items por página
const ITEMS_POR_PAGINA = 20;

/**
 * Lista principal de clientes con filtros, búsqueda y paginación
 * Tabla responsive con acciones por fila
 */
export function ClientesList({
  clientes,
  onEditar,
  onEliminar,
  onRenovar,
  onAgregarNota,
  onReactivar,
}: ClientesListProps) {
  const navigate = useNavigate();
  
  // Estado de filtros
  const [filtros, setFiltros] = useState<FiltrosCliente>({
    busqueda: "",
    estado: "todos",
    tipoSuscripcion: "todos",
    producto: "todos",
  });

  // Lista de productos únicos derivada de los clientes
  const productosUnicos = useMemo(() => {
    const set = new Set(clientes.map((c) => c.producto).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clientes]);

  // Estado de paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    // Búsqueda por nombre o correo
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      if (
        !cliente.nombre.toLowerCase().includes(busqueda) &&
        !cliente.correo.toLowerCase().includes(busqueda)
      ) {
        return false;
      }
    }

    // Filtro por estado
    if (filtros.estado !== "todos" && cliente.estado !== filtros.estado) {
      return false;
    }

    // Filtro por tipo de suscripción
    if (
      filtros.tipoSuscripcion !== "todos" &&
      cliente.tipoSuscripcion !== filtros.tipoSuscripcion
    ) {
      return false;
    }

    // Filtro por producto
    if (filtros.producto !== "todos" && cliente.producto !== filtros.producto) {
      return false;
    }

    return true;
  });

  // Calcular paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const clientesPaginados = clientesFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

  // Cambiar página
  const cambiarPagina = (pagina: number) => {
    setPaginaActual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  return (
    <div className="space-y-6">
      {/* Contador de resultados */}
      <p className="text-sm text-white/60">
        {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} encontrado{clientesFiltrados.length !== 1 ? "s" : ""}
      </p>

      {/* Filtros */}
      <ClienteFilters filtros={filtros} onChange={setFiltros} productos={productosUnicos} />

      {/* Tabla de clientes */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Suscripción
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Vencimiento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/50">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-white/50">
                  Acciones
                </th>
              </tr>
            </thead>
            <StaggerContainer as="tbody" className="divide-y divide-white/5" staggerDelay={0.03}>
              {clientesPaginados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <User className="h-12 w-12 text-white/20" />
                      <p className="text-white/50">No se encontraron clientes</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clientesPaginados.map((cliente, index) => {
                  const dias = diasHastaVencimiento(cliente.fechaVencimiento);
                  const proximoVencer = dias !== null && dias >= 0 && dias <= 7;
                  
                  return (
                    <StaggerItem 
                      key={cliente.id} 
                      as="tr" 
                      duration={0.3}
                      className={cn(
                        "transition-colors hover:bg-white/5",
                        proximoVencer && cliente.estado === "activa" && "bg-amber-500/5"
                      )}
                    >
                      {/* Cliente */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{cliente.nombre}</p>
                              {cliente.whatsapp && (
                                <a
                                  href={`https://wa.me/${cliente.whatsapp.replace(/[^\d]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded p-1 text-green-400 hover:bg-green-400/20 transition-colors"
                                  title={`WhatsApp: ${cliente.whatsapp}`}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-white/50">{cliente.correo}</p>
                          </div>
                        </div>
                      </td>

                      {/* Producto */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{cliente.producto}</p>
                      </td>

                      {/* Tipo de suscripción */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {labelsTipoSuscripcion[cliente.tipoSuscripcion]}
                        </p>
                        <p className="text-xs text-white/40">
                          {labelsMedioPago[cliente.medioPago]}
                        </p>
                      </td>

                      {/* Vencimiento */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {formatearFechaCorta(cliente.fechaVencimiento)}
                        </p>
                        {dias !== null && dias >= 0 && (
                          <p className={cn(
                            "text-xs",
                            dias <= 3 ? "text-red-400" : dias <= 7 ? "text-amber-400" : "text-white/40"
                          )}>
                            {dias === 0 ? "Vence hoy" : `${dias} días restantes`}
                          </p>
                        )}
                      </td>

                      {/* Valor */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">
                          {formatearMoneda(cliente.valorCobrado)}
                        </p>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <StatusBadge estado={cliente.estado} />
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                            className="rounded-lg p-2 text-white/50 hover:bg-primary/20 hover:text-primary transition-colors"
                            title="Ver Detalles"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => onAgregarNota(cliente)}
                            className="rounded-lg p-2 text-white/50 hover:bg-violet-500/20 hover:text-violet-400 transition-colors"
                            title="Añadir nota"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <StickyNote className="h-4 w-4" />
                          </motion.button>
                          {(cliente.estado === "activa" || cliente.estado === "vencida") && (
                            <motion.button
                              onClick={() => onRenovar(cliente)}
                              className="rounded-lg p-2 text-white/50 hover:bg-secondary/20 hover:text-secondary transition-colors"
                              title="Renovar"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </motion.button>
                          )}
                          {cliente.estado === "cancelada" && (
                            <motion.button
                              onClick={() => onReactivar(cliente)}
                              className="rounded-lg p-2 text-white/50 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                              title="Reactivar cliente"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => onEditar(cliente)}
                            className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            title="Editar"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => onEliminar(cliente)}
                            className="rounded-lg p-2 text-white/50 hover:bg-destructive/20 hover:text-destructive transition-colors"
                            title="Eliminar"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </StaggerItem>
                  );
                })
              )}
            </StaggerContainer>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-sm text-white/50">
              Mostrando {inicio + 1} - {Math.min(inicio + ITEMS_POR_PAGINA, clientesFiltrados.length)} de {clientesFiltrados.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => cambiarPagina(pagina)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                    pagina === paginaActual
                      ? "bg-primary text-white"
                      : "text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {pagina}
                </button>
              ))}

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
