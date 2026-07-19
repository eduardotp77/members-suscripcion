import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassSelect } from '@/components/ui/GlassSelect';
import { Label } from '@/components/ui/label';
import { obtenerFechaHoyISO } from '@/lib/dateUtils';
import type { Cuenta, Moneda, TasasCambioActuales, TransferenciaFormData } from '@/types';

interface Props {
  cuentas: Cuenta[];
  monedasInfo: Record<Moneda, { codigo: Moneda; nombre: string; simbolo: string }>;
  tasasCambio: TasasCambioActuales | null;
  onSubmit: (data: TransferenciaFormData) => Promise<void>;
}

export function TransferenciaForm({ cuentas, monedasInfo, tasasCambio, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [cuentaOrigenId, setCuentaOrigenId] = useState('');
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('Transferencia entre cuentas');
  const [fecha, setFecha] = useState(obtenerFechaHoyISO());

  const cuentaOrigen = cuentas.find(c => c.id === cuentaOrigenId);
  const cuentaDestino = cuentas.find(c => c.id === cuentaDestinoId);

  // Preview del monto en moneda destino (solo cuando difieren)
  const previewDestino = useMemo(() => {
    if (!cuentaOrigen || !cuentaDestino) return null;
    if (cuentaOrigen.moneda === cuentaDestino.moneda) return null;
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) return null;

    const tasaOrigen = cuentaOrigen.moneda === 'USD'
      ? 1
      : (tasasCambio?.tasas[cuentaOrigen.moneda] ?? 1);
    const montoUsd = montoNum / tasaOrigen;

    const tasaDestino = cuentaDestino.moneda === 'USD'
      ? 1
      : (tasasCambio?.tasas[cuentaDestino.moneda] ?? 1);
    const montoEnDestino = cuentaDestino.moneda === 'USD' ? montoUsd : montoUsd * tasaDestino;

    const simbolo = monedasInfo[cuentaDestino.moneda]?.simbolo ?? '';
    return `${simbolo}${montoEnDestino.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cuentaDestino.moneda}`;
  }, [cuentaOrigen, cuentaDestino, monto, tasasCambio, monedasInfo]);

  const opcionesCuentas = cuentas.map(c => ({
    value: c.id,
    label: `${c.nombre} (${c.moneda}) · Saldo: ${monedasInfo[c.moneda]?.simbolo}${c.saldoActual.toFixed(2)}`,
  }));

  const opcionesDestino = opcionesCuentas.filter(o => o.value !== cuentaOrigenId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuentaOrigenId || !cuentaDestinoId || !monto || !concepto) return;

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) return;

    setGuardando(true);
    try {
      await onSubmit({ cuentaOrigenId, cuentaDestinoId, monto: montoNum, concepto, fecha });
      // Reset
      setCuentaOrigenId('');
      setCuentaDestinoId('');
      setMonto('');
      setConcepto('Transferencia entre cuentas');
      setFecha(obtenerFechaHoyISO());
      setOpen(false);
    } catch {
      // Error manejado por el hook
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors text-sm">
          <ArrowLeftRight className="h-4 w-4" />
          Transferir
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-black/90 border border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-violet-400" />
            Transferir entre Cuentas
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Cuenta Origen */}
          <div>
            <Label className="text-gray-300 mb-2 block">Cuenta origen *</Label>
            <GlassSelect
              value={cuentaOrigenId}
              onChange={(v) => {
                setCuentaOrigenId(v);
                if (v === cuentaDestinoId) setCuentaDestinoId('');
              }}
              options={opcionesCuentas}
              placeholder="Selecciona cuenta origen"
            />
          </div>

          {/* Monto */}
          <div>
            <Label htmlFor="monto" className="text-gray-300 mb-2 block">
              Monto{cuentaOrigen ? ` (${cuentaOrigen.moneda})` : ''} *
            </Label>
            <GlassInput
              id="monto"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </div>

          {/* Cuenta Destino */}
          <div>
            <Label className="text-gray-300 mb-2 block">Cuenta destino *</Label>
            <GlassSelect
              value={cuentaDestinoId}
              onChange={setCuentaDestinoId}
              options={opcionesDestino}
              placeholder="Selecciona cuenta destino"
            />
          </div>

          {/* Preview conversión (solo si monedas distintas) */}
          {previewDestino && (
            <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <p className="text-sm text-violet-300">
                Recibirá aproximadamente{' '}
                <span className="font-bold text-white">{previewDestino}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Basado en tasas de cambio actuales
              </p>
            </div>
          )}

          {/* Concepto */}
          <div>
            <Label htmlFor="concepto" className="text-gray-300 mb-2 block">Concepto *</Label>
            <GlassInput
              id="concepto"
              placeholder="Descripción de la transferencia"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <Label htmlFor="fecha" className="text-gray-300 mb-2 block">Fecha</Label>
            <GlassInput
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
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
              disabled={guardando || !cuentaOrigenId || !cuentaDestinoId || !monto}
              className="bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HoverBorderGradient
                as="div"
                className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                duration={1.5}
              >
                <ArrowLeftRight className="h-4 w-4" />
                {guardando ? 'Transfiriendo...' : 'Transferir'}
              </HoverBorderGradient>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
