import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { GlassInput } from '@/components/ui/GlassInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoriaPreview } from '@/components/finanzas/forms/CategoriaPreview';
import type { CategoriaFormData, TipoCategoria } from '@/types';

interface Props {
  onSubmit: (data: CategoriaFormData) => Promise<void>;
}

const COLORES = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', 
  '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#64748b'
];

const ICONOS = [
  { value: 'shopping', label: '🛍️ Compras' },
  { value: 'food', label: '🍔 Comida' },
  { value: 'transport', label: '🚗 Transporte' },
  { value: 'home', label: '🏠 Hogar' },
  { value: 'health', label: '🏥 Salud' },
  { value: 'education', label: '📚 Educación' },
  { value: 'entertainment', label: '🎬 Entretenimiento' },
  { value: 'tech', label: '💻 Tecnología' },
  { value: 'service', label: '⚙️ Servicios' },
  { value: 'other', label: '📌 Otros' },
];

export function CategoriaForm({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoCategoria>('gasto');
  const [color, setColor] = useState('#3b82f6');
  const [icono, setIcono] = useState('other');
  const [presupuestoMensual, setPresupuestoMensual] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre) {
      return;
    }

    setGuardando(true);

    try {
      await onSubmit({
        nombre,
        tipo,
        color,
        icono,
        presupuestoMensual: presupuestoMensual ? parseFloat(presupuestoMensual) : undefined,
        descripcion: descripcion || undefined,
      });

      // Reset form
      setNombre('');
      setTipo('gasto');
      setColor('#3b82f6');
      setIcono('other');
      setPresupuestoMensual('');
      setDescripcion('');
      setOpen(false);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors text-sm">
          <Tag className="h-4 w-4" />
          Nueva Categoría
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] bg-black/90 border border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Tag className="h-5 w-5 text-violet-400" />
            Nueva Categoría
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda: Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <Label htmlFor="nombre" className="text-gray-300 mb-2 block">
                Nombre de la categoría *
            </Label>
            <GlassInput
              id="nombre"
              placeholder="ej: Diseño Gráfico, Capacitaciones..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Tipo: Ingreso o Gasto */}
          <div>
            <Label className="text-gray-300 mb-2 block">
              Tipo *
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('ingreso')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tipo === 'ingreso'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className={`font-semibold ${tipo === 'ingreso' ? 'text-green-400' : 'text-gray-400'}`}>
                    Ingreso
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTipo('gasto')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tipo === 'gasto'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💸</div>
                  <div className={`font-semibold ${tipo === 'gasto' ? 'text-red-400' : 'text-gray-400'}`}>
                    Gasto
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Icono */}
          <div>
            <Label className="text-gray-300 mb-2 block">
              Icono
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {ICONOS.map((i) => (
                <button
                  key={i.value}
                  type="button"
                  onClick={() => setIcono(i.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    icono === i.value
                      ? 'border-violet-500 bg-violet-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  title={i.label}
                >
                  <div className="text-2xl">{i.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <Label className="text-gray-300 mb-2 block">
              Color
            </Label>
            <div className="flex gap-2">
              {COLORES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Presupuesto Mensual (opcional) */}
          <div>
            <Label htmlFor="presupuesto" className="text-gray-300 mb-2 block">
              Presupuesto Mensual (opcional)
            </Label>
            <GlassInput
              id="presupuesto"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={presupuestoMensual}
              onChange={(e) => setPresupuestoMensual(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Define un límite de gasto mensual para esta categoría
            </p>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="text-gray-300 mb-2 block">
              Descripción (opcional)
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Notas sobre esta categoría..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[60px]"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HoverBorderGradient
                as="div"
                className="px-4 py-2.5 text-sm font-medium flex items-center justify-center cursor-pointer"
                duration={1.5}
              >
                {guardando ? 'Guardando...' : 'Crear Categoría'}
              </HoverBorderGradient>
            </button>
          </div>
        </form>
        
        {/* Columna derecha: Preview */}
        <div className="hidden md:block">
          <CategoriaPreview
            nombre={nombre}
            tipo={tipo}
            color={color}
            icono={icono}
            presupuestoMensual={presupuestoMensual}
          />
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}
