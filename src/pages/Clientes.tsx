import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ClientesList } from "@/components/clientes/ClientesList";
import { KanbanBoard } from "@/components/clientes/KanbanBoard";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { RenovarModal } from "@/components/ui/RenovarModal";
import { NotaRapidaModal } from "@/components/ui/NotaRapidaModal";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { TextReveal } from "@/components/ui/TextReveal";
import { useClientes } from "@/hooks/useClientes";
import { Cliente, ClienteFormData } from "@/types";
import { LayoutList, LayoutGrid, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Página de gestión de clientes
 * CRUD completo con formulario modal
 */
export default function Clientes() {
  const {
    clientes,
    loading,
    combinacionesExistentes,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    renovarSuscripcion,
    cambiarEstado,
    cancelarSuscripcion,
    reactivarCliente,
    agregarNota,
  } = useClientes();

  // Lista de productos únicos para el combobox del formulario
  const productosExistentes = useMemo(() => {
    const set = new Set(clientes.map((c) => c.producto).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clientes]);

  // Estado del toggle de vista
  const [vistaKanban, setVistaKanban] = useState(false);

  // Estado del modal de formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Estado del diálogo de confirmación de eliminación
  const [clienteEliminar, setClienteEliminar] = useState<Cliente | null>(null);

  // Estado del modal de renovación
  const [modalRenovarAbierto, setModalRenovarAbierto] = useState(false);
  const [clienteRenovar, setClienteRenovar] = useState<Cliente | null>(null);
  const [renovando, setRenovando] = useState(false);

  // Estado del modal de nota rápida (lista)
  const [modalNotaAbierto, setModalNotaAbierto] = useState(false);
  const [clienteParaNota, setClienteParaNota] = useState<Cliente | null>(null);
  const [guardandoNota, setGuardandoNota] = useState(false);

  // Abrir modal para agregar nuevo cliente
  const handleAgregar = () => {
    setClienteEditando(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar cliente
  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalAbierto(true);
  };

  // Guardar cliente (crear o editar)
  const handleGuardar = async (datos: ClienteFormData) => {
    setGuardando(true);
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (clienteEditando) {
        editarCliente(clienteEditando.id, datos);
      } else {
        agregarCliente(datos);
      }
      setModalAbierto(false);
      setClienteEditando(null);
    } finally {
      setGuardando(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmarEliminar = () => {
    if (clienteEliminar) {
      eliminarCliente(clienteEliminar.id);
      setClienteEliminar(null);
    }
  };

  // Renovar suscripción
  const handleRenovar = (cliente: Cliente) => {
    setClienteRenovar(cliente);
    setModalRenovarAbierto(true);
  };

  // Confirmar renovación con fecha
  const handleConfirmarRenovar = async (fechaRenovacion: string) => {
    if (!clienteRenovar) return;
    
    setRenovando(true);
    try {
      await renovarSuscripcion(clienteRenovar.id, fechaRenovacion);
      setModalRenovarAbierto(false);
      setClienteRenovar(null);
    } finally {
      setRenovando(false);
    }
  };

  // Abrir modal de nota desde la lista
  const handleAgregarNota = (cliente: Cliente) => {
    setClienteParaNota(cliente);
    setModalNotaAbierto(true);
  };

  // Confirmar nota desde la lista
  const handleConfirmarNota = async (contenido: string) => {
    if (!clienteParaNota) return;
    setGuardandoNota(true);
    try {
      await agregarNota(clienteParaNota.id, contenido);
      setModalNotaAbierto(false);
      setClienteParaNota(null);
    } finally {
      setGuardandoNota(false);
    }
  };

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
      {/* Header compartido */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <TextReveal delay={0.1}>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="text-sm text-white/60">{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} en total</p>
          </TextReveal>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle tabla / kanban */}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setVistaKanban(false)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                !vistaKanban ? "bg-primary text-white" : "text-white/40 hover:text-white"
              )}
              title="Vista tabla"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVistaKanban(true)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                vistaKanban ? "bg-primary text-white" : "text-white/40 hover:text-white"
              )}
              title="Vista Kanban"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button onClick={handleAgregar} className="bg-transparent border-0 p-0 cursor-pointer">
            <HoverBorderGradient
              as="div"
              className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
              duration={1.5}
            >
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </HoverBorderGradient>
          </button>
        </div>
      </div>

      {/* Vista condicional */}
      {vistaKanban ? (
        <KanbanBoard
          clientes={clientes}
          onEditar={handleEditar}
          onEliminar={setClienteEliminar}
          onRenovar={handleRenovar}
          onCambiarEstado={cambiarEstado}
          onCancelar={cancelarSuscripcion}
          onAgregarNota={agregarNota}
        />
      ) : (
        <ClientesList
          clientes={clientes}
          onEditar={handleEditar}
          onEliminar={setClienteEliminar}
          onRenovar={handleRenovar}
          onAgregarNota={handleAgregarNota}
          onReactivar={(cliente) => reactivarCliente(cliente.id)}
        />
      )}

      {/* Modal de formulario */}
      {modalAbierto && (
        <ClienteForm
          cliente={clienteEditando}
          onGuardar={handleGuardar}
          onCancelar={() => {
            setModalAbierto(false);
            setClienteEditando(null);
          }}
          loading={guardando}
          combinacionesExistentes={combinacionesExistentes}
          productosExistentes={productosExistentes}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog
        open={!!clienteEliminar}
        onOpenChange={(open) => !open && setClienteEliminar(null)}
      >
        <AlertDialogContent className="border-white/10 bg-black/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Eliminar cliente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Esta acción eliminará permanentemente a{" "}
              <span className="font-medium text-white">
                {clienteEliminar?.nombre}
              </span>{" "}
              y todo su historial de pagos. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarEliminar}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de renovación */}
      <RenovarModal
        cliente={clienteRenovar}
        isOpen={modalRenovarAbierto}
        onClose={() => {
          setModalRenovarAbierto(false);
          setClienteRenovar(null);
        }}
        onConfirm={handleConfirmarRenovar}
        loading={renovando}
      />

      {/* Modal de nota rápida (desde lista) */}
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
    </PageLayout>
  );
}
