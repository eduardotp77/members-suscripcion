import { useState, useMemo } from "react";
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
import { KanbanColumn, KanbanColumnId, COLUMNAS } from "@/components/clientes/KanbanColumn";
import { KanbanCard } from "@/components/clientes/KanbanCard";
import { GrupoVitalicio } from "@/components/clientes/VitalicioCard";
import { generateMockClientes } from "@/lib/generateMockData";

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

/**
 * Kanban Board interactivo con datos de demostración
 * Permite drag & drop visual sin persistir cambios
 */
export function KanbanBoardMockup() {
  // Generar clientes mock (30 clientes de ejemplo)
  const clientesIniciales = useMemo(() => generateMockClientes(30), []);
  
  // Estado local para cambios visuales durante la demo
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [activoId, setActivoId] = useState<string | null>(null);

  // Sensores con la misma configuración que el Kanban real
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

    // Simular cambio de estado (solo visual, no persiste)
    const nuevoEstado = 
      destino === "activa" ? "activa" : 
      destino === "cancelada" ? "cancelada" : "vencida";
    
    setClientes(prev => 
      prev.map(c => 
        c.id === clienteId 
          ? { ...c, estado: nuevoEstado as Cliente["estado"] }
          : c
      )
    );
  };

  // Handlers dummy para el demo (no hacen nada real)
  const handleEditar = () => {};
  const handleEliminar = () => {};
  const handleRenovar = () => {};
  const handleAgregarNota = () => {};

  return (
    <div className="w-full pointer-events-auto">
      {/* Header compacto con badge "Demo Interactivo" */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">CRM - Tablero Kanban</h2>
          <p className="mt-0.5 text-xs text-white/60 sm:text-sm">
            Arrastra las tarjetas entre columnas • {clientes.length} clientes demo
          </p>
        </div>
        <div className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
          ✨ Prueba arrastrando
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Scroll horizontal en pantallas pequeñas */}
        <div className="overflow-x-auto pb-4" style={{ height: "600px", maxHeight: "calc(100vh - 16rem)" }}>
          <div className="flex gap-4 h-full" style={{ minWidth: "max-content" }}>
            {COLUMNAS.map((columna) => (
              <KanbanColumn
                key={columna.id}
                columna={columna}
                clientes={columna.id === "vitalicio" ? [] : clientesPorColumna[columna.id]}
                gruposVitalicio={columna.id === "vitalicio" ? gruposVitalicio : undefined}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onRenovar={handleRenovar}
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
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onRenovar={handleRenovar}
              onAgregarNota={handleAgregarNota}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* Badge inferior */}
      <div className="mt-2 text-center">
        <p className="text-xs text-white/40">
          Sistema de gestión con drag & drop • Datos de demostración
        </p>
      </div>
    </div>
  );
}
