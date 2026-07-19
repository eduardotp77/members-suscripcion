import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Cliente } from "@/types";
import { diasHastaVencimiento } from "@/lib/utils";
import { KanbanColumn, KanbanColumnId, COLUMNAS } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { GrupoVitalicio } from "./VitalicioCard";
import { CancelarModal } from "@/components/ui/CancelarModal";
import { NotaRapidaModal } from "@/components/ui/NotaRapidaModal";

interface KanbanBoardProps {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (cliente: Cliente) => void;
  onRenovar: (cliente: Cliente) => void;
  onCambiarEstado: (id: string, estado: "activa" | "vencida" | "pendiente" | "cancelada") => Promise<void>;
  onCancelar: (id: string, motivo: string) => Promise<void>;
  onAgregarNota: (clienteId: string, contenido: string) => Promise<void>;
}

/** Clasifica un cliente en la columna kanban correcta */
function columnaDeCliente(cliente: Cliente): KanbanColumnId {
  if (cliente.estado === "cancelada") return "cancelada";
  if (cliente.tipoSuscripcion === "vitalicio") return "vitalicio";
  if (cliente.estado === "vencida" || cliente.estado === "pendiente") return "vencida";
  // activa: distinguir próximos a vencer (≤7 días)
  const dias = diasHastaVencimiento(cliente.fechaVencimiento);
  if (dias !== null && dias >= 0 && dias <= 7) return "proxima";
  return "activa";
}

export function KanbanBoard({
  clientes,
  onEditar,
  onEliminar,
  onRenovar,
  onCambiarEstado,
  onCancelar,
  onAgregarNota,
}: KanbanBoardProps) {
  const [activoId, setActivoId] = useState<string | null>(null);
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [clienteACancelar, setClienteACancelar] = useState<Cliente | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [modalNotaAbierto, setModalNotaAbierto] = useState(false);
  const [clienteParaNota, setClienteParaNota] = useState<Cliente | null>(null);
  const [guardandoNota, setGuardandoNota] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // Distribuir clientes en columnas
  const clientesPorColumna: Record<KanbanColumnId, Cliente[]> = {
    activa: [],
    proxima: [],
    vitalicio: [],
    vencida: [],
    cancelada: [],
  };
  clientes.forEach((c) => {
    clientesPorColumna[columnaDeCliente(c)].push(c);
  });

  // Agrupar vitalicios por correo → una tarjeta por persona
  const gruposVitalicio: GrupoVitalicio[] = Object.values(
    clientesPorColumna.vitalicio.reduce((acc, c) => {
      if (!acc[c.correo]) {
        acc[c.correo] = { correo: c.correo, nombre: c.nombre, productos: [], totalPagado: 0, representante: c };
      }
      acc[c.correo].productos.push(c.producto);
      acc[c.correo].totalPagado += c.valorCobrado;
      return acc;
    }, {} as Record<string, GrupoVitalicio>)
  );

  const clienteActivo = activoId
    ? clientes.find((c) => c.id === activoId) ?? null
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActivoId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivoId(null);
    const { active, over } = event;
    if (!over) return;

    const clienteId = active.id as string;
    const destino = over.id as KanbanColumnId;
    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) return;

    const columnaOrigen = columnaDeCliente(cliente);
    if (columnaOrigen === destino) return;

    // "Próximos a vencer" y "Vitalicio" son solo lectura — no se acepta drop aquí
    if (destino === "proxima" || destino === "vitalicio") return;

    if (destino === "cancelada") {
      // Abrir modal para capturar motivo
      setClienteACancelar(cliente);
      setModalCancelarAbierto(true);
      return;
    }

    // Para activa o vencida, cambiar estado directamente
    const nuevoEstado = destino === "activa" ? "activa" : "vencida";
    onCambiarEstado(clienteId, nuevoEstado);
  };

  const handleConfirmarCancelar = async (motivo: string) => {
    if (!clienteACancelar) return;
    setCancelando(true);
    try {
      await onCancelar(clienteACancelar.id, motivo);
      setModalCancelarAbierto(false);
      setClienteACancelar(null);
    } finally {
      setCancelando(false);
    }
  };

  const handleAgregarNota = (cliente: Cliente) => {
    setClienteParaNota(cliente);
    setModalNotaAbierto(true);
  };

  const handleConfirmarNota = async (contenido: string) => {
    if (!clienteParaNota) return;
    setGuardandoNota(true);
    try {
      await onAgregarNota(clienteParaNota.id, contenido);
      setModalNotaAbierto(false);
      setClienteParaNota(null);
    } finally {
      setGuardandoNota(false);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Scroll horizontal en pantallas pequeñas */}
        <div className="overflow-x-auto pb-4" style={{ height: "calc(100vh - 14rem)" }}>
          <div className="flex gap-4 h-full" style={{ minWidth: "max-content" }}>
            {COLUMNAS.map((columna) => (
              <KanbanColumn
                key={columna.id}
                columna={columna}
                clientes={columna.id === "vitalicio" ? [] : clientesPorColumna[columna.id]}
                gruposVitalicio={columna.id === "vitalicio" ? gruposVitalicio : undefined}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onRenovar={onRenovar}
                onAgregarNota={handleAgregarNota}
              />
            ))}
          </div>
        </div>

        {/* Tarjeta fantasma durante el arrastre */}
        <DragOverlay>
          {clienteActivo && (
            <KanbanCard
              cliente={clienteActivo}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onRenovar={onRenovar}
              onAgregarNota={handleAgregarNota}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Modal de cancelación */}
      <CancelarModal
        cliente={clienteACancelar}
        isOpen={modalCancelarAbierto}
        onClose={() => {
          setModalCancelarAbierto(false);
          setClienteACancelar(null);
        }}
        onConfirm={handleConfirmarCancelar}
        loading={cancelando}
      />

      {/* Modal de nota rápida */}
      <NotaRapidaModal
        cliente={clienteParaNota}
        isOpen={modalNotaAbierto}
        onClose={() => {
          setModalNotaAbierto(false);
          setClienteParaNota(null);
        }}
        onConfirm={handleConfirmarNota}
        loading={guardandoNota}
      />
    </>
  );
}
