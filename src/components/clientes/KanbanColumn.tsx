import { useDroppable } from "@dnd-kit/core";
import { Cliente } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { VitalicioCard, GrupoVitalicio } from "./VitalicioCard";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export type KanbanColumnId = "activa" | "proxima" | "vitalicio" | "vencida" | "cancelada";

interface KanbanColumnConfig {
  id: KanbanColumnId;
  titulo: string;
  colorBorde: string;
  colorCabecera: string;
  colorContador: string;
  colorScrollbar: string;
  isReadOnly?: boolean;
}

export const COLUMNAS: KanbanColumnConfig[] = [
  {
    id: "activa",
    titulo: "Activos",
    colorBorde: "border-emerald-500/30",
    colorCabecera: "text-emerald-400",
    colorContador: "bg-emerald-500/20 text-emerald-400",
    colorScrollbar: "[&::-webkit-scrollbar-thumb]:bg-emerald-500/40",
  },
  {
    id: "proxima",
    titulo: "Próximos a vencer",
    colorBorde: "border-amber-500/30",
    colorCabecera: "text-amber-400",
    colorContador: "bg-amber-500/20 text-amber-400",
    colorScrollbar: "[&::-webkit-scrollbar-thumb]:bg-amber-500/40",
    isReadOnly: true,
  },
  {
    id: "vencida",
    titulo: "Vencidos",
    colorBorde: "border-white/10",
    colorCabecera: "text-white/50",
    colorContador: "bg-white/10 text-white/50",
    colorScrollbar: "[&::-webkit-scrollbar-thumb]:bg-white/20",
  },
  {
    id: "cancelada",
    titulo: "Cancelados",
    colorBorde: "border-red-500/30",
    colorCabecera: "text-red-400",
    colorContador: "bg-red-500/20 text-red-400",
    colorScrollbar: "[&::-webkit-scrollbar-thumb]:bg-red-500/40",
  },
  {
    id: "vitalicio",
    titulo: "Vitalicios",
    colorBorde: "border-violet-500/30",
    colorCabecera: "text-violet-400",
    colorContador: "bg-violet-500/20 text-violet-400",
    colorScrollbar: "[&::-webkit-scrollbar-thumb]:bg-violet-500/40",
    isReadOnly: true,
  },
];

interface KanbanColumnProps {
  columna: KanbanColumnConfig;
  clientes: Cliente[];
  gruposVitalicio?: GrupoVitalicio[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (cliente: Cliente) => void;
  onRenovar: (cliente: Cliente) => void;
  onAgregarNota: (cliente: Cliente) => void;
}

export function KanbanColumn({
  columna,
  clientes,
  gruposVitalicio,
  onEditar,
  onEliminar,
  onRenovar,
  onAgregarNota,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columna.id,
    disabled: columna.isReadOnly,
  });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 h-full">
      {/* Cabecera de columna */}
      <div className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3",
        "bg-white/5 backdrop-blur-sm",
        columna.colorBorde
      )}>
        <h3 className={cn("font-semibold text-sm", columna.colorCabecera)}>
          {columna.titulo}
        </h3>
        <span className={cn(
          "rounded-full px-2 py-0.5 text-xs font-bold",
          columna.colorContador
        )}>
          {columna.id === "vitalicio" ? (gruposVitalicio?.length ?? 0) : clientes.length}
        </span>
      </div>

      {/* Zona droppable */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 rounded-xl border p-2 transition-colors overflow-y-auto",
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent",
          columna.colorScrollbar,
          columna.colorBorde,
          isOver && !columna.isReadOnly && "border-primary/50 bg-primary/5",
          columna.isReadOnly && "opacity-80"
        )}
      >
        {columna.id === "vitalicio" ? (
          (gruposVitalicio?.length ?? 0) === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
              <User className="h-8 w-8 text-white/15" />
              <p className="text-xs text-white/25">Sin clientes</p>
            </div>
          ) : (
            gruposVitalicio!.map((grupo) => (
              <VitalicioCard
                key={grupo.correo}
                grupo={grupo}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onAgregarNota={onAgregarNota}
              />
            ))
          )
        ) : (
          clientes.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
              <User className="h-8 w-8 text-white/15" />
              <p className="text-xs text-white/25">Sin clientes</p>
            </div>
          ) : (
            clientes.map((cliente) => (
              <KanbanCard
                key={cliente.id}
                cliente={cliente}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onRenovar={onRenovar}
                onAgregarNota={onAgregarNota}
              />
            ))
          )
        )}
        {columna.id === "proxima" && (
          <p className="text-center text-xs text-amber-400/50 pb-1">
            Solo lectura — arrastra desde aquí
          </p>
        )}
      </div>
    </div>
  );
}
