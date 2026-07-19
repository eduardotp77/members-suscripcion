import { motion } from 'framer-motion';
import { Wallet, MoreVertical, Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { MiniSparkline } from '@/components/finanzas/stats/MiniSparkline';
import { TrendIndicator } from '@/components/finanzas/stats/TrendIndicator';
import { cn } from '@/lib/utils';
import type { Cuenta, Transaccion } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CuentaCardProps {
  cuenta: Cuenta;
  transacciones: Transaccion[];
  formatearMonto: (monto: number, moneda?: any) => string;
  onEditar?: (cuenta: Cuenta) => void;
  onEliminar?: (cuenta: Cuenta) => void;
  onVerDetalles?: (cuenta: Cuenta) => void;
}

/**
 * Tarjeta premium para mostrar información de una cuenta
 * Incluye sparkline, estadísticas y acciones rápidas
 */
export function CuentaCard({
  cuenta,
  transacciones,
  formatearMonto,
  onEditar,
  onEliminar,
  onVerDetalles,
}: CuentaCardProps) {
  // Filtrar transacciones de esta cuenta (últimos 7 días)
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  
  const transaccionesCuenta = transacciones
    .filter(t => t.cuentaId === cuenta.id && new Date(t.fecha) >= hace7Dias)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
  // Calcular datos para sparkline (balance diario últimos 7 días)
  const sparklineData: number[] = [];
  let balanceActual = cuenta.saldoActual;
  
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    fecha.setHours(0, 0, 0, 0);
    
    const transaccionesDia = transaccionesCuenta.filter(t => {
      const fechaT = new Date(t.fecha);
      fechaT.setHours(0, 0, 0, 0);
      return fechaT.getTime() === fecha.getTime();
    });
    
    const cambiosDia = transaccionesDia.reduce((sum, t) => {
      return sum + (t.tipo === 'ingreso' ? t.montoUsd : -t.montoUsd);
    }, 0);
    
    if (i === 0) {
      sparklineData.push(balanceActual);
    } else {
      balanceActual -= cambiosDia;
      sparklineData.push(balanceActual);
    }
  }
  
  // Calcular variación (comparar hace 7 días con hoy)
  const variacion = sparklineData.length >= 2
    ? ((sparklineData[6] - sparklineData[0]) / (sparklineData[0] || 1)) * 100
    : 0;
  
  // Transacciones del mes
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const transaccionesMes = transacciones.filter(
    t => t.cuentaId === cuenta.id && new Date(t.fecha) >= inicioMes
  ).length;
  
  // Última transacción
  const ultimaTransaccion = transacciones
    .filter(t => t.cuentaId === cuenta.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  
  const tiempoUltimaTransaccion = ultimaTransaccion
    ? calcularTiempoRelativo(new Date(ultimaTransaccion.fecha))
    : 'Sin movimientos';
  
  // Determinar color del gradiente según moneda
  const gradients = {
    USD: 'from-green-500/20 to-emerald-600/20',
    BRL: 'from-blue-500/20 to-cyan-600/20',
    COP: 'from-yellow-500/20 to-orange-600/20',
    EUR: 'from-purple-500/20 to-violet-600/20',
    default: 'from-gray-500/20 to-slate-600/20',
  };
  
  const gradient = gradients[cuenta.moneda as keyof typeof gradients] || gradients.default;
  
  const isPositive = cuenta.saldoActual >= cuenta.saldoInicial;
  
  return (
    <CardSpotlight>
      <InteractiveCard hoverScale={1.02} hoverY={-4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard
            className={cn(
              'relative overflow-hidden',
              !cuenta.activa && 'opacity-60'
            )}
            padding="none"
          >
            {/* Header con gradiente */}
            <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
            
            <div className="p-4 space-y-4">
              {/* Fila 1: Tipo + Badge moneda + Acciones */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${cuenta.color || '#3b82f6'}15`,
                    }}
                  >
                    <Wallet
                      className="h-4 w-4"
                      style={{ color: cuenta.color || '#3b82f6' }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {cuenta.nombre}
                      </span>
                      {!cuenta.activa && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {cuenta.tipo}
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                    {onVerDetalles && (
                      <DropdownMenuItem
                        onClick={() => onVerDetalles(cuenta)}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                    )}
                    {onEditar && (
                      <DropdownMenuItem
                        onClick={() => onEditar(cuenta)}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onEliminar && (
                      <DropdownMenuItem
                        onClick={() => onEliminar(cuenta)}
                        className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Fila 2: Saldo principal */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Saldo Actual</p>
                <div className="flex items-end gap-2">
                  <motion.p
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {formatearMonto(cuenta.saldoActual, cuenta.moneda)}
                  </motion.p>
                  {variacion !== 0 && (
                    <TrendIndicator value={variacion} size="sm" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inicial: {formatearMonto(cuenta.saldoInicial, cuenta.moneda)}
                </p>
              </div>
              
              {/* Fila 3: Sparkline */}
              {sparklineData.length > 1 && (
                <div className="pt-2">
                  <MiniSparkline
                    data={sparklineData}
                    color={cuenta.color || '#8b5cf6'}
                    height={28}
                  />
                </div>
              )}
              
              {/* Fila 4: Stats footer */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{transaccionesMes}</span>
                  <span>trans. este mes</span>
                </div>
                <div className="text-gray-500">
                  {tiempoUltimaTransaccion}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </InteractiveCard>
    </CardSpotlight>
  );
}

/**
 * Calcula tiempo relativo desde una fecha
 */
function calcularTiempoRelativo(fecha: Date): string {
  const ahora = new Date();
  const diff = ahora.getTime() - fecha.getTime();
  
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);
  
  if (minutos < 60) return `Hace ${minutos}m`;
  if (horas < 24) return `Hace ${horas}h`;
  if (dias < 7) return `Hace ${dias}d`;
  
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
