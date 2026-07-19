import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown, ArrowLeftRight, Calendar, CreditCard, Tag, User, MoreVertical, Edit } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatearFechaLegible } from '@/lib/dateUtils';
import type { Transaccion, Moneda } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TransaccionCardProps {
  transaccion: Transaccion;
  onEliminar: (id: string) => Promise<void>;
  formatearMonto: (monto: number, moneda?: Moneda) => string;
  index: number;
}

/**
 * Tarjeta premium para mostrar una transacción
 * Con efectos spotlight, hover interactivo y diseño profesional
 */
export function TransaccionCard({
  transaccion,
  onEliminar,
  formatearMonto,
  index,
}: TransaccionCardProps) {
  const [eliminando, setEliminando] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await onEliminar(transaccion.id);
      setOpenAlert(false);
    } catch (error) {
      console.error('Error eliminando:', error);
    } finally {
      setEliminando(false);
    }
  };

  const esIngreso = transaccion.tipo === 'ingreso';
  const esTransferencia = !!transaccion.transferId;
  const Icon = esTransferencia ? ArrowLeftRight : (esIngreso ? TrendingUp : TrendingDown);
  
  // Colores según tipo
  const gradientClass = esTransferencia
    ? 'from-violet-500/20 to-purple-600/20'
    : esIngreso 
      ? 'from-green-500/20 to-emerald-600/20' 
      : 'from-red-500/20 to-rose-600/20';
  
  const iconBgClass = esTransferencia ? 'bg-violet-500/20' : (esIngreso ? 'bg-green-500/20' : 'bg-red-500/20');
  const iconColorClass = esTransferencia ? 'text-violet-400' : (esIngreso ? 'text-green-400' : 'text-red-400');
  const montoColorClass = esTransferencia ? 'text-violet-400' : (esIngreso ? 'text-green-400' : 'text-red-400');

  return (
    <CardSpotlight>
      <InteractiveCard hoverScale={1.01} hoverY={-2}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.3 }}
        >
          <GlassCard className="relative overflow-hidden" padding="none">
            {/* Barra superior con gradiente */}
            <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`} />
            
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Icono principal */}
                <motion.div
                  className={`p-2.5 rounded-xl ${iconBgClass} flex-shrink-0`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`h-5 w-5 ${iconColorClass}`} />
                </motion.div>

                {/* Contenido principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    {/* Info de la transacción */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-base leading-tight mb-1">
                        {transaccion.concepto}
                      </h4>
                      {transaccion.descripcion && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {transaccion.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Monto */}
                    <div className="text-right flex-shrink-0">
                      <motion.div
                        className={`text-xl font-bold ${montoColorClass}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.03 + 0.1, duration: 0.3 }}
                      >
                        {esIngreso ? '+' : '-'}{formatearMonto(transaccion.monto, transaccion.moneda)}
                      </motion.div>
                      {transaccion.moneda !== 'USD' && (
                        <div className="text-xs text-gray-500 mt-1">
                          ≈ {formatearMonto(transaccion.montoUsd, 'USD')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadatos con badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Fecha */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatearFechaLegible(transaccion.fecha)}</span>
                    </div>

                    {/* Categoría */}
                    {transaccion.categoria && (
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-white"
                        style={{
                          backgroundColor: `${transaccion.categoria.color || '#8b5cf6'}20`,
                          color: transaccion.categoria.color || '#a78bfa',
                        }}
                      >
                        <Tag className="h-3 w-3" />
                        <span>{transaccion.categoria.nombre}</span>
                      </div>
                    )}

                    {/* Cuenta */}
                    {transaccion.cuenta && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-xs text-blue-400">
                        <CreditCard className="h-3 w-3" />
                        <span>{transaccion.cuenta.nombre}</span>
                      </div>
                    )}

                    {/* Badge de retiro personal */}
                    {transaccion.esRetiroPersonal && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-pink-500/20 text-xs text-pink-400 font-medium">
                        <User className="h-3 w-3" />
                        <span>Retiro Personal</span>
                      </div>
                    )}

                    {/* Badge de transferencia */}
                    {esTransferencia && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-500/20 text-xs text-violet-400 font-medium">
                        <ArrowLeftRight className="h-3 w-3" />
                        <span>Transferencia</span>
                      </div>
                    )}
                  </div>

                  {/* Footer con acciones */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {/* Moneda badge */}
                    <div className="text-xs text-gray-500">
                      <span className="font-mono bg-white/5 px-2 py-1 rounded">
                        {transaccion.moneda}
                      </span>
                      {transaccion.tasaCambio && transaccion.moneda !== 'USD' && (
                        <span className="ml-2">
                          TC: {transaccion.tasaCambio.toFixed(4)}
                        </span>
                      )}
                    </div>

                    {/* Acciones */}
                    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialogContent className="bg-black/90 border border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            ¿Eliminar transacción?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Esta acción no se puede deshacer. Se eliminará la transacción "{transaccion.concepto}" 
                            y se actualizará el saldo de la cuenta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-white">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleEliminar}
                            disabled={eliminando}
                            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                          >
                            {eliminando ? 'Eliminando...' : 'Eliminar'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </InteractiveCard>
    </CardSpotlight>
  );
}
