import { useState } from "react";
import { Cliente } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { Button } from "@/components/ui/button";
import { StickyNote, X, User } from "lucide-react";

interface NotaRapidaModalProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contenido: string) => Promise<void>;
  loading?: boolean;
}

export function NotaRapidaModal({
  cliente,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: NotaRapidaModalProps) {
  const [contenido, setContenido] = useState("");

  if (!isOpen || !cliente) return null;

  const handleConfirm = async () => {
    if (!contenido.trim()) return;
    await onConfirm(contenido);
    setContenido("");
  };

  const handleClose = () => {
    setContenido("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleConfirm();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <GlassCard className="relative z-10 w-full max-w-md">
        {/* Cabecera */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
              <StickyNote className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Nueva nota</h2>
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <User className="h-3.5 w-3.5" />
                <span>{cliente.nombre}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una nota... (Ctrl+Enter para guardar)"
          rows={4}
          className="mb-4 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
          autoFocus
        />

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
            className="text-white/60 hover:text-white"
          >
            Cancelar
          </Button>
          <button
            onClick={handleConfirm}
            disabled={!contenido.trim() || loading}
            className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HoverBorderGradient
              as="div"
              className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
              duration={1.5}
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <StickyNote className="h-4 w-4" />
                  Guardar nota
                </>
              )}
            </HoverBorderGradient>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
