import { FiltrosCliente, EstadoSuscripcion, TipoSuscripcion } from "@/types";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { Search, X } from "lucide-react";
import { labelsTipoSuscripcion, labelsEstado } from "@/lib/theme";

// Props del componente
interface ClienteFiltersProps {
  filtros: FiltrosCliente;
  onChange: (filtros: FiltrosCliente) => void;
  productos: string[];
}

/**
 * Barra de filtros para la lista de clientes
 * Búsqueda en tiempo real y filtros por estado/tipo
 */
export function ClienteFilters({ filtros, onChange, productos }: ClienteFiltersProps) {
  // Actualizar un filtro específico
  const actualizarFiltro = <K extends keyof FiltrosCliente>(
    campo: K,
    valor: FiltrosCliente[K]
  ) => {
    onChange({ ...filtros, [campo]: valor });
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    onChange({
      busqueda: "",
      estado: "todos",
      tipoSuscripcion: "todos",
      producto: "todos",
    });
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos =
    filtros.busqueda ||
    filtros.estado !== "todos" ||
    filtros.tipoSuscripcion !== "todos" ||
    filtros.producto !== "todos";

  // Opciones para el filtro de estado
  const opcionesEstado = [
    { value: "todos", label: "Todos los estados" },
    ...Object.entries(labelsEstado).map(([valor, label]) => ({
      value: valor,
      label: label,
    })),
  ];

  // Opciones para el filtro de tipo de suscripción
  const opcionesTipo = [
    { value: "todos", label: "Todas las suscripciones" },
    ...Object.entries(labelsTipoSuscripcion).map(([valor, label]) => ({
      value: valor,
      label: label,
    })),
  ];

  // Opciones para el filtro de producto (dinámico)
  const opcionesProducto = [
    { value: "todos", label: "Todos los productos" },
    ...productos.map((p) => ({ value: p, label: p })),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Campo de búsqueda */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <GlassInput
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={filtros.busqueda}
          onChange={(e) => actualizarFiltro("busqueda", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtro por estado */}
      <div className="w-full sm:w-48">
        <GlassSelect
          value={filtros.estado}
          onChange={(value) =>
            actualizarFiltro("estado", value as EstadoSuscripcion | "todos")
          }
          options={opcionesEstado}
        />
      </div>

      {/* Filtro por tipo de suscripción */}
      <div className="w-full sm:w-52">
        <GlassSelect
          value={filtros.tipoSuscripcion}
          onChange={(value) =>
            actualizarFiltro("tipoSuscripcion", value as TipoSuscripcion | "todos")
          }
          options={opcionesTipo}
        />
      </div>

      {/* Filtro por producto */}
      <div className="w-full sm:w-52">
        <GlassSelect
          value={filtros.producto}
          onChange={(value) => actualizarFiltro("producto", value)}
          options={opcionesProducto}
        />
      </div>

      {/* Botón limpiar filtros */}
      {hayFiltrosActivos && (
        <button
          onClick={limpiarFiltros}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
          Limpiar
        </button>
      )}
    </div>
  );
}
