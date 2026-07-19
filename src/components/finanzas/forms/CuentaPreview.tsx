import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { TipoCuenta, Moneda } from '@/types';

interface CuentaPreviewProps {
  nombre: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldoInicial: string;
  color: string;
  monedasInfo: Record<Moneda, { codigo: Moneda; nombre: string; simbolo: string }>;
}

/**
 * Preview en tiempo real de cómo se verá la cuenta
 */
export function CuentaPreview({
  nombre,
  tipo,
  moneda,
  saldoInicial,
  color,
  monedasInfo,
}: CuentaPreviewProps) {
  const simbolo = monedasInfo[moneda]?.simbolo || '$';
  const saldo = parseFloat(saldoInicial) || 0;
  
  const gradients = {
    banco: 'from-blue-500/20 to-cyan-600/20',
    efectivo: 'from-green-500/20 to-emerald-600/20',
    tarjeta: 'from-purple-500/20 to-violet-600/20',
    paypal: 'from-blue-400/20 to-blue-600/20',
    crypto: 'from-orange-500/20 to-yellow-600/20',
    otro: 'from-gray-500/20 to-slate-600/20',
  };
  
  const gradient = gradients[tipo as keyof typeof gradients] || gradients.otro;
  
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-medium">Vista Previa</p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className="relative overflow-hidden" padding="none">
          {/* Header con gradiente */}
          <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
          
          <div className="p-4 space-y-3">
            {/* Nombre y tipo */}
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}15` }}
              >
                <Wallet className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <span className="text-sm font-semibold text-white">
                  {nombre || 'Nombre de la cuenta'}
                </span>
                <p className="text-xs text-gray-400 capitalize">{tipo}</p>
              </div>
            </div>
            
            {/* Saldo */}
            <div>
              <p className="text-xs text-gray-400">Saldo Actual</p>
              <p className="text-xl font-bold text-white">
                {simbolo}{saldo.toFixed(2)} {moneda}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
