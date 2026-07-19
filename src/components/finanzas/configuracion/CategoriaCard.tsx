import { motion } from 'framer-motion';
import { Tag, MoreVertical, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressCircular } from '@/components/finanzas/stats/ProgressCircular';
import { TrendIndicator } from '@/components/finanzas/stats/TrendIndicator';
import { cn } from '@/lib/utils';
import type { CategoriaFinanza, Transaccion } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoriaCardProps {
  categoria: CategoriaFinanza;
  transacciones: Transaccion[];
  formatearMonto: (monto: number) => string;
  onEditar?: (categoria: CategoriaFinanza) => void;
  onEliminar?: (categoria: CategoriaFinanza) => void;
}

/**
 * Tarjeta premium para mostrar información de una categoría
 * Versión diferenciada para ingresos y gastos
 */
export function CategoriaCard({
  categoria,
  transacciones,
  formatearMonto,
  onEditar,
  onEliminar,
}: CategoriaCardProps) {
  // Filtrar transacciones del mes actual de esta categoría
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const transaccionesMes = transacciones.filter(
    t => t.categoriaId === categoria.id && 
         new Date(t.fecha) >= inicioMes &&
         t.tipo === categoria.tipo
  );
  
  const totalMes = transaccionesMes.reduce((sum, t) => sum + t.montoUsd, 0);
  
  // Calcular mes anterior para comparación
  const inicioMesAnterior = new Date(inicioMes);
  inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1);
  
  const transaccionesMesAnterior = transacciones.filter(
    t => t.categoriaId === categoria.id &&
         new Date(t.fecha) >= inicioMesAnterior &&
         new Date(t.fecha) < inicioMes &&
         t.tipo === categoria.tipo
  );
  
  const totalMesAnterior = transaccionesMesAnterior.reduce((sum, t) => sum + t.montoUsd, 0);
  
  // Calcular variación
  const variacion = totalMesAnterior > 0
    ? ((totalMes - totalMesAnterior) / totalMesAnterior) * 100
    : totalMes > 0 ? 100 : 0;
  
  // Para gastos: calcular porcentaje de presupuesto usado
  const porcentajePresupuesto = categoria.presupuestoMensual
    ? (totalMes / categoria.presupuestoMensual) * 100
    : null;
  
  // Última transacción
  const ultimaTransaccion = transacciones
    .filter(t => t.categoriaId === categoria.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  
  const tiempoUltima = ultimaTransaccion
    ? calcularTiempoRelativo(new Date(ultimaTransaccion.fecha))
    : 'Sin movimientos';
  
  // Emoji del icono o icono por defecto
  const emoji = obtenerEmoji(categoria.icono);
  
  const isGasto = categoria.tipo === 'gasto';
  const baseColor = isGasto ? categoria.color || '#ef4444' : categoria.color || '#10b981';
  
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
              !categoria.activa && 'opacity-60'
            )}
            padding="none"
          >
            {/* Header con gradiente según tipo */}
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(to right, ${baseColor}40, ${baseColor}80)`
              }}
            />
            
            <div className="p-4 space-y-4">
              {/* Fila 1: Icono + Nombre + Acciones */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="p-2 rounded-lg text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${baseColor}15` }}
                  >
                    {emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">
                        {categoria.nombre}
                      </span>
                      {categoria.esRetiroPersonal && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 flex-shrink-0">
                          Retiro Personal
                        </span>
                      )}
                      {!categoria.activa && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 flex-shrink-0">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {categoria.tipo}
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                    {onEditar && (
                      <DropdownMenuItem
                        onClick={() => onEditar(categoria)}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onEliminar && (
                      <DropdownMenuItem
                        onClick={() => onEliminar(categoria)}
                        className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Fila 2: Monto principal */}
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  {isGasto ? 'Gastado este mes' : 'Recibido este mes'}
                </p>
                <div className="flex items-end gap-2">
                  <motion.p
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {formatearMonto(totalMes)}
                  </motion.p>
                  {variacion !== 0 && (
                    <TrendIndicator value={variacion} size="sm" />
                  )}
                </div>
              </div>
              
              {/* Fila 3: Progreso de presupuesto (solo para gastos con presupuesto) */}
              {isGasto && categoria.presupuestoMensual && porcentajePresupuesto !== null && (
                <div className="flex items-center gap-4 pt-2">
                  <ProgressCircular
                    percentage={porcentajePresupuesto}
                    size={56}
                    strokeWidth={5}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Presupuesto Mensual</p>
                    <p className="text-sm font-semibold text-white">
                      {formatearMonto(categoria.presupuestoMensual)}
                    </p>
                    <p className={cn(
                      "text-xs font-medium",
                      porcentajePresupuesto > 100 
                        ? "text-red-400" 
                        : porcentajePresupuesto > 90
                        ? "text-yellow-400"
                        : "text-green-400"
                    )}>
                      {porcentajePresupuesto > 100
                        ? `Excedido por ${formatearMonto(totalMes - categoria.presupuestoMensual)}`
                        : `Disponible: ${formatearMonto(categoria.presupuestoMensual - totalMes)}`
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {/* Fila 4: Stats footer */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                <div className="flex items-center gap-1 text-gray-400">
                  <span>{transaccionesMes.length}</span>
                  <span>transacciones</span>
                </div>
                <div className="text-gray-500">
                  {tiempoUltima}
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
 * Obtiene el emoji según el icono
 */
function obtenerEmoji(icono?: string): string {
  const emojis: Record<string, string> = {
    shopping: '🛍️',
    food: '🍔',
    transport: '🚗',
    home: '🏠',
    health: '🏥',
    education: '📚',
    entertainment: '🎬',
    tech: '💻',
    service: '⚙️',
    other: '📌',
  };
  
  return emojis[icono || 'other'] || '📌';
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
