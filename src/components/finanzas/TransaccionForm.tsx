import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassSelect } from '@/components/ui/GlassSelect';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { obtenerFechaHoyISO } from '@/lib/dateUtils';
import type { Cuenta, CategoriaFinanza, Moneda, TipoTransaccion, TransaccionFormData } from '@/types';

interface Props {
  cuentas: Cuenta[];
  categorias: CategoriaFinanza[];
  onSubmit: (data: TransaccionFormData) => Promise<void>;
  monedasInfo: Record<Moneda, { codigo: Moneda; nombre: string; simbolo: string }>;
}

export function TransaccionForm({ cuentas, categorias, onSubmit, monedasInfo }: Props) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Form state
  const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('USD');
  const [concepto, setConcepto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(obtenerFechaHoyISO());
  const [cuentaId, setCuentaId] = useState<string | undefined>(undefined);
  const [categoriaId, setCategoriaId] = useState<string | undefined>(undefined);

  // Opciones para los selectores
  const opcionesMonedas = Object.values(monedasInfo).map(m => ({
    value: m.codigo,
    label: `${m.simbolo} ${m.codigo} - ${m.nombre}`
  }));

  // Filtrar categorías según tipo
  const categoriasDisponibles = categorias.filter(c => c.tipo === tipo);
  
  const opcionesCategorias = categoriasDisponibles.map(cat => ({
    value: cat.id,
    label: cat.nombre
  }));

  const opcionesCuentas = cuentas.map(cuenta => ({
    value: cuenta.id,
    label: `${cuenta.nombre} (${cuenta.moneda})`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!monto || !concepto || !fecha) {
      return;
    }

    // Validar que el monto sea un número válido
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      console.error('Monto inválido:', monto);
      return;
    }

    setGuardando(true);

    try {
      await onSubmit({
        tipo,
        monto: montoNumerico,
        moneda,
        concepto,
        descripcion: descripcion || undefined,
        fecha,
        cuentaId: cuentaId || undefined,
        categoriaId: categoriaId || undefined,
      });

      // Reset form
      setMonto('');
      setConcepto('');
      setDescripcion('');
      setFecha(obtenerFechaHoyISO());
      setCuentaId(undefined);
      setCategoriaId(undefined);
      setOpen(false);
    } catch (error) {
      console.error('Error al guardar transacción:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-transparent border-0 p-0 cursor-pointer">
          <HoverBorderGradient
            as="div"
            className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
            duration={1.5}
          >
            <Plus className="h-5 w-5" />
            Nueva Transacción
          </HoverBorderGradient>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-black/90 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Nueva Transacción</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Tipo: Ingreso o Gasto */}
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

          {/* Monto y Moneda */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monto" className="text-gray-300 mb-2 block">
                Monto *
              </Label>
              <GlassInput
                id="monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="moneda" className="text-gray-300 mb-2 block">
                Moneda * 💱
              </Label>
              <GlassSelect 
                value={moneda} 
                onChange={(value) => setMoneda(value as Moneda)}
                options={opcionesMonedas}
                placeholder="Selecciona moneda"
              />
            </div>
          </div>

          {/* Concepto */}
          <div>
            <Label htmlFor="concepto" className="text-gray-300 mb-2 block">
              Concepto *
            </Label>
            <GlassInput
              id="concepto"
              placeholder="ej: Pago VPS Mayo, Venta a cliente..."
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria" className="text-gray-300 mb-2 block">
              Categoría (opcional)
            </Label>
            <GlassSelect
              value={categoriaId}
              onChange={(value) => setCategoriaId(value)}
              options={opcionesCategorias}
              placeholder="Sin categoría"
            />
          </div>

          {/* Cuenta */}
          <div>
            <Label htmlFor="cuenta" className="text-gray-300 mb-2 block">
              Cuenta (opcional)
            </Label>
            <GlassSelect
              value={cuentaId}
              onChange={(value) => setCuentaId(value)}
              options={opcionesCuentas}
              placeholder="Sin cuenta"
            />
          </div>

          {/* Fecha */}
          <div>
            <Label htmlFor="fecha" className="text-gray-300 mb-2 block">
              Fecha *
            </Label>
            <GlassInput
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Descripción (opcional) */}
          <div>
            <Label htmlFor="descripcion" className="text-gray-300 mb-2 block">
              Descripción (opcional)
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Notas adicionales..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px]"
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
                {guardando ? 'Guardando...' : 'Guardar Transacción'}
              </HoverBorderGradient>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
