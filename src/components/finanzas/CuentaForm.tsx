import { useState, useEffect } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassSelect } from '@/components/ui/GlassSelect';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CuentaPreview } from '@/components/finanzas/forms/CuentaPreview';
import type { Cuenta, CuentaFormData, Moneda, TipoCuenta } from '@/types';

interface Props {
  onSubmit: (data: CuentaFormData) => Promise<void>;
  monedasInfo: Record<Moneda, { codigo: Moneda; nombre: string; simbolo: string }>;
  // Modo edición (opcional)
  cuentaEditar?: Cuenta;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TIPOS_CUENTA: { value: TipoCuenta; label: string; icon: string }[] = [
  { value: 'banco', label: 'Cuenta Bancaria', icon: '🏦' },
  { value: 'efectivo', label: 'Efectivo', icon: '💵' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito', icon: '💳' },
  { value: 'paypal', label: 'PayPal', icon: '🅿️' },
  { value: 'crypto', label: 'Crypto Wallet', icon: '₿' },
  { value: 'otro', label: 'Otra', icon: '💰' },
];

const COLORES = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', 
  '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#64748b'
];

export function CuentaForm({ onSubmit, monedasInfo, cuentaEditar, open: openProp, onOpenChange }: Props) {
  const isEditMode = !!cuentaEditar;
  const [localOpen, setLocalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const open = isEditMode ? (openProp ?? false) : localOpen;
  const setOpen = isEditMode ? (onOpenChange ?? (() => {})) : setLocalOpen;

  // Form state
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoCuenta>('banco');
  const [moneda, setMoneda] = useState<Moneda>('USD');
  const [saldoInicial, setSaldoInicial] = useState('0');
  const [color, setColor] = useState('#3b82f6');
  const [descripcion, setDescripcion] = useState('');

  // Pre-llenar formulario cuando se abre en modo edición
  useEffect(() => {
    if (cuentaEditar && open) {
      setNombre(cuentaEditar.nombre);
      setTipo(cuentaEditar.tipo);
      setMoneda(cuentaEditar.moneda);
      setSaldoInicial(String(cuentaEditar.saldoActual));
      setColor(cuentaEditar.color || '#3b82f6');
      setDescripcion(cuentaEditar.descripcion || '');
    }
  }, [cuentaEditar, open]);

  // Opciones para el selector de moneda
  const opcionesMonedas = Object.values(monedasInfo).map(m => ({
    value: m.codigo,
    label: `${m.simbolo} ${m.codigo} - ${m.nombre}`
  }));

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
        moneda,
        saldoInicial: parseFloat(saldoInicial) || 0,
        color,
        descripcion: descripcion || undefined,
      });

      // Reset form (solo en modo creación)
      if (!isEditMode) {
        setNombre('');
        setTipo('banco');
        setMoneda('USD');
        setSaldoInicial('0');
        setColor('#3b82f6');
        setDescripcion('');
      }
      setOpen(false);
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-sm">
            <Wallet className="h-4 w-4" />
            Nueva Cuenta
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[700px] bg-black/90 border border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            {isEditMode ? 'Editar Cuenta' : 'Nueva Cuenta'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda: Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
          <div>
            <Label htmlFor="nombre" className="text-gray-300 mb-2 block">
              Nombre de la cuenta *
            </Label>
            <GlassInput
              id="nombre"
              placeholder="ej: Cuenta Corriente Bancolombia, PayPal USD..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <Label className="text-gray-300 mb-2 block">
              Tipo de cuenta *
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS_CUENTA.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    tipo === t.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs text-white">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Moneda y Saldo Inicial */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="saldoInicial" className="text-gray-300 mb-2 block">
                {isEditMode ? 'Saldo Actual (ajuste)' : 'Saldo Inicial'}
              </Label>
              <GlassInput
                id="saldoInicial"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <Label className="text-gray-300 mb-2 block">
              Color (opcional)
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

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion" className="text-gray-300 mb-2 block">
              Descripción (opcional)
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Notas sobre esta cuenta..."
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
                {guardando ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Crear Cuenta'}
              </HoverBorderGradient>
            </button>
          </div>
        </form>
        
        {/* Columna derecha: Preview */}
        <div className="hidden md:block">
          <CuentaPreview
            nombre={nombre}
            tipo={tipo}
            moneda={moneda}
            saldoInicial={saldoInicial}
            color={color}
            monedasInfo={monedasInfo}
          />
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}
