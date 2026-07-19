import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassSelect } from '@/components/ui/GlassSelect';
import type { CategoriaFinanza } from '@/types';

interface FiltrosTransaccionesProps {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filtroTipo: 'todos' | 'ingreso' | 'gasto';
  onFiltroTipoChange: (value: 'todos' | 'ingreso' | 'gasto') => void;
  filtroCategoria: string;
  onFiltroCategoriaChange: (value: string) => void;
  categorias: CategoriaFinanza[];
}

/**
 * Panel de filtros mejorado para transacciones
 * Con diseño limpio y opciones organizadas
 */
export function FiltrosTransacciones({
  busqueda,
  onBusquedaChange,
  filtroTipo,
  onFiltroTipoChange,
  filtroCategoria,
  onFiltroCategoriaChange,
  categorias,
}: FiltrosTransaccionesProps) {
  // Contador de filtros activos
  const filtrosActivos = [
    busqueda !== '',
    filtroTipo !== 'todos',
    filtroCategoria !== 'todas',
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="p-6">
        {/* Header de filtros */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
            {filtrosActivos > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                {filtrosActivos} activo{filtrosActivos > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {filtrosActivos > 0 && (
            <button
              onClick={() => {
                onBusquedaChange('');
                onFiltroTipoChange('todos');
                onFiltroCategoriaChange('todas');
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Buscar transacción
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <GlassInput
                placeholder="Concepto o descripción..."
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Tipo de transacción
            </label>
            <GlassSelect 
              value={filtroTipo} 
              onChange={(value) => onFiltroTipoChange(value as any)}
              options={[
                { value: 'todos', label: '📊 Todos los tipos' },
                { value: 'ingreso', label: '💰 Solo Ingresos' },
                { value: 'gasto', label: '💸 Solo Gastos' }
              ]}
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Categoría
            </label>
            <GlassSelect 
              value={filtroCategoria} 
              onChange={(value) => onFiltroCategoriaChange(value)}
              options={[
                { value: 'todas', label: '🏷️ Todas las categorías' },
                ...categorias.map(cat => ({
                  value: cat.id,
                  label: cat.nombre
                }))
              ]}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
