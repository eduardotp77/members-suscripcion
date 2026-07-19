import { useState } from 'react';
import { motion } from 'framer-motion';
import { obtenerClaveMes, obtenerNombreMes } from '@/lib/dateUtils';
import { TransaccionesStatsBar } from '@/components/finanzas/transacciones/TransaccionesStatsBar';
import { FiltrosTransacciones } from '@/components/finanzas/transacciones/FiltrosTransacciones';
import { MesHeader } from '@/components/finanzas/transacciones/MesHeader';
import { TransaccionCard } from '@/components/finanzas/transacciones/TransaccionCard';
import { TransaccionesEmptyState, SinResultadosFiltros } from '@/components/finanzas/transacciones/EmptyStates';
import type { Transaccion, CategoriaFinanza, Moneda } from '@/types';

interface Props {
  transacciones: Transaccion[];
  categorias: CategoriaFinanza[];
  onEliminar: (id: string) => Promise<void>;
  formatearMonto: (monto: number, moneda?: Moneda) => string;
  monedasInfo: Record<Moneda, { codigo: Moneda; simbolo: string }>;
}

/**
 * Lista de transacciones rediseñada con componentes premium
 * Incluye filtros avanzados, estadísticas y agrupación por mes
 */
export function TransaccionesList({ 
  transacciones, 
  categorias,
  onEliminar, 
  formatearMonto,
  monedasInfo 
}: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingreso' | 'gasto'>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  // Filtrar transacciones
  const transaccionesFiltradas = transacciones.filter(t => {
    // Buscar por concepto o descripción
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      const coincideConcepto = t.concepto.toLowerCase().includes(textoBusqueda);
      const coincideDescripcion = t.descripcion?.toLowerCase().includes(textoBusqueda);
      if (!coincideConcepto && !coincideDescripcion) return false;
    }

    // Filtro de tipo
    if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false;

    // Filtro de categoría
    if (filtroCategoria !== 'todas' && t.categoriaId !== filtroCategoria) return false;

    return true;
  });

  // Agrupar por mes usando utilidades de fecha
  const transaccionesPorMes = transaccionesFiltradas.reduce((grupos, t) => {
    const mesKey = obtenerClaveMes(t.fecha);
    if (!grupos[mesKey]) grupos[mesKey] = [];
    grupos[mesKey].push(t);
    return grupos;
  }, {} as Record<string, Transaccion[]>);

  const meses = Object.keys(transaccionesPorMes).sort().reverse();
  
  const hayFiltrosActivos = busqueda !== '' || filtroTipo !== 'todos' || filtroCategoria !== 'todas';
  
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroTipo('todos');
    setFiltroCategoria('todas');
  };

  return (
    <div className="space-y-6">
      {/* Barra de estadísticas sticky */}
      <TransaccionesStatsBar
        transacciones={transacciones}
        transaccionesFiltradas={transaccionesFiltradas}
        formatearMonto={formatearMonto}
      />

      {/* Panel de filtros */}
      <FiltrosTransacciones
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={setFiltroCategoria}
        categorias={categorias}
      />

      {/* Lista de transacciones agrupadas por mes */}
      {transacciones.length === 0 ? (
        <TransaccionesEmptyState />
      ) : meses.length === 0 ? (
        <SinResultadosFiltros onLimpiarFiltros={limpiarFiltros} />
      ) : (
        <div className="space-y-6">
          {meses.map((mesKey, mesIndex) => {
            const transaccionesMes = transaccionesPorMes[mesKey];
            const nombreMes = obtenerNombreMes(mesKey);

            return (
              <motion.div
                key={mesKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mesIndex * 0.1, duration: 0.4 }}
                className="space-y-3"
              >
                {/* Header del mes con estadísticas */}
                <MesHeader
                  nombreMes={nombreMes}
                  transacciones={transaccionesMes}
                  formatearMonto={formatearMonto}
                />

                {/* Lista de transacciones del mes */}
                <div className="space-y-3">
                  {transaccionesMes.map((transaccion, index) => (
                    <TransaccionCard
                      key={transaccion.id}
                      transaccion={transaccion}
                      onEliminar={onEliminar}
                      formatearMonto={formatearMonto}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
