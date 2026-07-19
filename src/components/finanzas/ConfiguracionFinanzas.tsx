import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Archive, RotateCcw, ChevronDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CuentaCard } from '@/components/finanzas/configuracion/CuentaCard';
import { CategoriaCard } from '@/components/finanzas/configuracion/CategoriaCard';
import { CuentasEmptyState, CategoriasEmptyState } from '@/components/finanzas/configuracion/EmptyStates';
import type { Cuenta, CategoriaFinanza, Transaccion } from '@/types';

interface Props {
  cuentas: Cuenta[];
  cuentasArchivadas?: Cuenta[];
  categorias: CategoriaFinanza[];
  transacciones: Transaccion[];
  formatearMonto: (monto: number, moneda?: any) => string;
  onEditarCuenta?: (cuenta: Cuenta) => void;
  onEliminarCuenta?: (cuenta: Cuenta) => void;
  onRestaurarCuenta?: (id: string) => void;
  onEditarCategoria?: (categoria: CategoriaFinanza) => void;
  onEliminarCategoria?: (categoria: CategoriaFinanza) => void;
}

/**
 * Componente de configuración de finanzas rediseñado
 * Muestra cuentas y categorías con diseño premium
 */
export function ConfiguracionFinanzas({ 
  cuentas, 
  cuentasArchivadas = [],
  categorias, 
  transacciones,
  formatearMonto,
  onEditarCuenta,
  onEliminarCuenta,
  onRestaurarCuenta,
  onEditarCategoria,
  onEliminarCategoria,
}: Props) {
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);
  const categoriasIngresos = categorias.filter(c => c.tipo === 'ingreso');
  const categoriasGastos = categorias.filter(c => c.tipo === 'gasto');
  
  // Calcular estadísticas de categorías
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const transaccionesMes = transacciones.filter(t => new Date(t.fecha) >= inicioMes);
  
  const totalIngresosMes = transaccionesMes
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const totalGastosMes = transaccionesMes
    .filter(t => t.tipo === 'gasto' && !t.esRetiroPersonal)
    .reduce((sum, t) => sum + t.montoUsd, 0);
  
  const presupuestoTotalGastos = categoriasGastos
    .filter(c => c.presupuestoMensual)
    .reduce((sum, c) => sum + (c.presupuestoMensual || 0), 0);
  
  const porcentajeConsumido = presupuestoTotalGastos > 0
    ? (totalGastosMes / presupuestoTotalGastos) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* ============================================
          SECCIÓN: CUENTAS
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-6">
          {/* Header de Cuentas */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Mis Cuentas
                </h3>
                <p className="text-xs text-gray-400">
                  {cuentas.length} {cuentas.length === 1 ? 'cuenta registrada' : 'cuentas registradas'}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Cuentas */}
          {cuentas.length === 0 ? (
            <CuentasEmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cuentas.map((cuenta, index) => (
                <motion.div
                  key={cuenta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <CuentaCard
                    cuenta={cuenta}
                    transacciones={transacciones}
                    formatearMonto={formatearMonto}
                    onEditar={onEditarCuenta}
                    onEliminar={onEliminarCuenta}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Cuentas Archivadas ── */}
          {cuentasArchivadas.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <button
                onClick={() => setMostrarArchivadas(v => !v)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Archive className="h-4 w-4" />
                <span>{cuentasArchivadas.length} cuenta{cuentasArchivadas.length !== 1 ? 's' : ''} archivada{cuentasArchivadas.length !== 1 ? 's' : ''}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mostrarArchivadas ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {mostrarArchivadas && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                      {cuentasArchivadas.map((cuenta, index) => (
                        <motion.div
                          key={cuenta.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className="relative"
                        >
                          {/* Overlay archivada */}
                          <div className="opacity-50 pointer-events-none">
                            <CuentaCard
                              cuenta={cuenta}
                              transacciones={transacciones}
                              formatearMonto={formatearMonto}
                            />
                          </div>
                          {/* Botón restaurar encima */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => onRestaurarCuenta?.(cuenta.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-lg"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restaurar
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ============================================
          SECCIÓN: CATEGORÍAS DE INGRESOS
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard className="p-6">
          {/* Header de Categorías Ingresos */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Categorías de Ingresos
                </h3>
                <p className="text-xs text-gray-400">
                  {categoriasIngresos.length} categorías · Total mes: {formatearMonto(totalIngresosMes)}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Categorías Ingresos */}
          {categoriasIngresos.length === 0 ? (
            <CategoriasEmptyState tipo="ingreso" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriasIngresos.map((categoria, index) => (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <CategoriaCard
                    categoria={categoria}
                    transacciones={transacciones}
                    formatearMonto={formatearMonto}
                    onEditar={onEditarCategoria}
                    onEliminar={onEliminarCategoria}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ============================================
          SECCIÓN: CATEGORÍAS DE GASTOS
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard className="p-6">
          {/* Header de Categorías Gastos */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Categorías de Gastos
                </h3>
                <p className="text-xs text-gray-400">
                  {categoriasGastos.length} categorías · Gastado: {formatearMonto(totalGastosMes)}
                  {presupuestoTotalGastos > 0 && (
                    <span className="ml-2">
                      · Presupuesto: {porcentajeConsumido.toFixed(0)}% consumido
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Categorías Gastos */}
          {categoriasGastos.length === 0 ? (
            <CategoriasEmptyState tipo="gasto" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriasGastos.map((categoria, index) => (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <CategoriaCard
                    categoria={categoria}
                    transacciones={transacciones}
                    formatearMonto={formatearMonto}
                    onEditar={onEditarCategoria}
                    onEliminar={onEliminarCategoria}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
