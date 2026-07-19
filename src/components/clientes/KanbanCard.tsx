import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Cliente } from "@/types";
import { CardSpotlight } from "@/components/ui/CardSpotlight";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatearFechaCorta, formatearMoneda, diasHastaVencimiento } from "@/lib/utils";
import { labelsTipoSuscripcion, labelsMedioPago } from "@/lib/theme";
import { Calendar, DollarSign, GripVertical, User, Eye, RefreshCw, Edit, Trash2, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface KanbanCardProps {
  cliente: Cliente;
  onEditar: (cliente: Cliente) => void;
  onEliminar: (cliente: Cliente) => void;
  onRenovar: (cliente: Cliente) => void;
  onAgregarNota: (cliente: Cliente) => void;
  isDragOverlay?: boolean;
}

export function KanbanCard({
  cliente,
  onEditar,
  onEliminar,
  onRenovar,
  onAgregarNota,
  isDragOverlay = false,
}: KanbanCardProps) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cliente.id,
    data: { cliente },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const dias = diasHastaVencimiento(cliente.fechaVencimiento);

  return (
    <CardSpotlight>
      <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm",
        "flex flex-col gap-3 select-none",
        isDragging && !isDragOverlay && "opacity-30",
        isDragOverlay && "shadow-2xl shadow-black/50 ring-2 ring-primary/50 rotate-2"
      )}
    >
      {/* Cabecera: avatar + nombre + grip */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-white text-sm">{cliente.nombre}</p>
            <p className="truncate text-xs text-white/50">{cliente.correo}</p>
          </div>
        </div>
        {/* Handle de arrastre */}
        <button
          {...listeners}
          {...attributes}
          className="shrink-0 cursor-grab rounded p-1 text-white/30 hover:bg-white/10 hover:text-white/60 active:cursor-grabbing"
          title="Arrastrar"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Producto + tipo */}
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">
          {cliente.producto}
        </span>
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/50">
          {labelsTipoSuscripcion[cliente.tipoSuscripcion]}
        </span>
      </div>

      {/* Vencimiento + valor */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-white/50">
          <Calendar className="h-3 w-3" />
          <span>{formatearFechaCorta(cliente.fechaVencimiento)}</span>
          {dias !== null && dias >= 0 && (
            <span className={cn(
              "ml-1 font-medium",
              dias <= 3 ? "text-red-400" : dias <= 7 ? "text-amber-400" : "text-white/40"
            )}>
              {dias === 0 ? "(hoy)" : `(${dias}d)`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <DollarSign className="h-3 w-3" />
          <span className="font-medium">{formatearMoneda(cliente.valorCobrado)}</span>
        </div>
      </div>

      {/* Pago + estado */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{labelsMedioPago[cliente.medioPago]}</span>
        <StatusBadge estado={cliente.estado} />
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-1 border-t border-white/10 pt-2">
        <button
          onClick={() => navigate(`/clientes/${cliente.id}`)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-primary/20 hover:text-primary transition-colors"
          title="Ver detalles"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onAgregarNota(cliente)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-violet-500/20 hover:text-violet-400 transition-colors"
          title="Añadir nota"
        >
          <StickyNote className="h-3.5 w-3.5" />
        </button>
        {(cliente.estado === "activa" || cliente.estado === "vencida") && (
          <button
            onClick={() => onRenovar(cliente)}
            className="rounded-lg p-1.5 text-white/40 hover:bg-secondary/20 hover:text-secondary transition-colors"
            title="Renovar"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onEditar(cliente)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          title="Editar"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEliminar(cliente)}
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
