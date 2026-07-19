import { Cliente } from "@/types";
import { formatearMoneda } from "@/lib/utils";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { Infinity as InfinityIcon, User, Eye, Edit, Trash2, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface GrupoVitalicio {
  correo: string;
  nombre: string;
  productos: string[];
  totalPagado: number;
  representante: Cliente;
}

interface VitalicioCardProps {
  grupo: GrupoVitalicio;
  onEditar: (cliente: Cliente) => void;
  onEliminar: (cliente: Cliente) => void;
  onAgregarNota: (cliente: Cliente) => void;
}

export function VitalicioCard({
  grupo,
  onEditar,
  onEliminar,
  onAgregarNota,
}: VitalicioCardProps) {
  const navigate = useNavigate();

  return (
    <CardSpotlight>
      <div
      className={cn(
        "rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 backdrop-blur-sm",
        "flex flex-col gap-3 select-none"
      )}
    >
      {/* Cabecera: avatar + nombre + correo */}
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30">
          <User className="h-4 w-4 text-violet-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-white text-sm">{grupo.nombre}</p>
          <p className="truncate text-xs text-white/50">{grupo.correo}</p>
        </div>
      </div>

      {/* Chips de productos vitalicios */}
      <div className="flex flex-wrap gap-1.5">
        {grupo.productos.map((producto) => (
          <span
            key={producto}
            className="rounded-md bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300 font-medium"
          >
            {producto}
          </span>
        ))}
      </div>

      {/* Badge vitalicio + total pagado */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <InfinityIcon className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-violet-400 font-medium">Vitalicio</span>
        </div>
        <span className="font-medium text-emerald-400">
          {formatearMoneda(grupo.totalPagado)}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-1 border-t border-white/10 pt-2">
        <button
          onClick={() => navigate(`/clientes/${grupo.representante.id}`)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-primary/20 hover:text-primary transition-colors"
          title="Ver detalles"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onAgregarNota(grupo.representante)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-violet-500/20 hover:text-violet-400 transition-colors"
          title="Añadir nota"
        >
          <StickyNote className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEditar(grupo.representante)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          title="Editar"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEliminar(grupo.representante)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-destructive/20 hover:text-destructive transition-colors"
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    </CardSpotlight>
  );
}
