import { useState } from "react";
import { NotaCliente } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { StickyNote, Plus, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface NotasTimelineProps {
  clienteId: string;
  notas: NotaCliente[];
  onAgregarNota: (clienteId: string, contenido: string) => Promise<void>;
  onEliminarNota: (notaId: string) => Promise<void>;
}

export function NotasTimeline({
  clienteId,
  notas,
  onAgregarNota,
  onEliminarNota,
}: NotasTimelineProps) {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [contenido, setContenido] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!contenido.trim()) return;
    setGuardando(true);
    try {
      await onAgregarNota(clienteId, contenido);
      setContenido("");
      setFormularioAbierto(false);
    } finally {
      setGuardando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGuardar();
    }
  };

  return (
    <GlassCard>
      {/* Cabecera */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <StickyNote className="h-5 w-5 text-primary" />
          Notas del Cliente
          {notas.length > 0 && (
            <span className="ml-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-normal text-violet-300">
              {notas.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setFormularioAbierto((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300 transition-colors hover:bg-violet-500/20 hover:text-violet-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir nota
        </button>
      </div>

      {/* Formulario inline */}
      {formularioAbierto && (
        <div className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe una nota... (Ctrl+Enter para guardar)"
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => { setFormularioAbierto(false); setContenido(""); }}
              className="rounded-lg px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={!contenido.trim() || guardando}
              className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:pointer-events-none"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {/* Timeline de notas */}
      {notas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-white/30">
          <MessageSquare className="h-8 w-8" />
          <p className="text-sm">No hay notas registradas</p>
          <p className="text-xs">Añade notas para registrar conversaciones y acuerdos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notas.map((nota, index) => (
            <div
              key={nota.id}
              className={cn(
                "flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/[0.07]",
                index === 0 && "border-violet-500/20 bg-violet-500/5"
              )}
            >
              {/* Indicador timeline */}
              <div className="mt-0.5 flex flex-col items-center gap-1">
                <div className={cn(
                  "h-2 w-2 rounded-full shrink-0",
                  index === 0 ? "bg-violet-400" : "bg-white/20"
                )} />
                {index < notas.length - 1 && (
                  <div className="w-px flex-1 bg-white/10" style={{ minHeight: "16px" }} />
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="whitespace-pre-wrap text-sm text-white/80 break-words">
                  {nota.contenido}
                </p>
                <p className="mt-1.5 text-xs text-white/30">
                  {formatDistanceToNow(parseISO(nota.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => onEliminarNota(nota.id)}
                className="shrink-0 rounded-lg p-1.5 text-white/20 transition-colors hover:bg-destructive/20 hover:text-destructive"
                title="Eliminar nota"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
