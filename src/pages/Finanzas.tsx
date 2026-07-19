import { useState } from 'react';
import { DollarSign, RefreshCw, PieChart, List, Settings } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { TextReveal } from '@/components/ui/TextReveal';
import { FinanzasDashboard } from '@/components/finanzas/FinanzasDashboard';
import { HistoricoMensualChart } from '@/components/finanzas/HistoricoMensualChart';
import { MesActualChartInteractive } from '@/components/finanzas/MesActualChartInteractive';
import { TransaccionForm } from '@/components/finanzas/TransaccionForm';
import { TransaccionesList } from '@/components/finanzas/TransaccionesList';
import { CuentaForm } from '@/components/finanzas/CuentaForm';
import { CategoriaForm } from '@/components/finanzas/CategoriaForm';
import { TransferenciaForm } from '@/components/finanzas/TransferenciaForm';
import { ConfiguracionFinanzas } from '@/components/finanzas/ConfiguracionFinanzas';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFinanzas } from '@/hooks/useFinanzas';
import { useToast } from '@/hooks/use-toast';
import type { Cuenta, CategoriaFinanza } from '@/types';

export default function Finanzas() {
  const { toast } = useToast();
  const {
    cargando,
    cuentas,
    categorias,
    transacciones,
    tasasCambio,
    estadisticas,
    distribucionGastos,
    historicoMensual,
    datosDiariosMesActual,
    agregarCuenta,
    editarCuenta,
    eliminarCuenta,
    restaurarCuenta,
    cuentasArchivadas,
    agregarCategoria,
    agregarTransaccion,
    transferirEntreCuentas,
    eliminarTransaccion,
    formatearMonto,
    actualizarTasasCambioDesdeAPI,
    monedasInfo,
    recargar,
  } = useFinanzas();

  const [vistaActual, setVistaActual] = useState<'dashboard' | 'transacciones' | 'configuracion'>('dashboard');
  const [actualizandoTasas, setActualizandoTasas] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<Cuenta | null>(null);
  const [cuentaEliminando, setCuentaEliminando] = useState<Cuenta | null>(null);

  const handleActualizarTasas = async () => {
    setActualizandoTasas(true);
    await actualizarTasasCambioDesdeAPI();
    setActualizandoTasas(false);
  };

  // Handlers para editar/eliminar cuentas
  const handleEditarCuenta = (cuenta: Cuenta) => {
    setCuentaEditando(cuenta);
  };

  const handleEliminarCuenta = (cuenta: Cuenta) => {
    setCuentaEliminando(cuenta);
  };

  // Handlers para editar/eliminar categorías
  const handleEditarCategoria = (categoria: CategoriaFinanza) => {
    toast({
      title: 'Función en desarrollo',
      description: `Editar categoría: ${categoria.nombre}`,
      variant: 'default',
    });
    // TODO: Implementar edición de categoría
  };

  const handleEliminarCategoria = (categoria: CategoriaFinanza) => {
    toast({
      title: 'Función en desarrollo',
      description: `Eliminar categoría: ${categoria.nombre}`,
      variant: 'destructive',
    });
    // TODO: Implementar eliminación de categoría con confirmación
  };

  if (cargando) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-violet-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando datos financieros...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <TextReveal delay={0.1}>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-violet-400" />
                Finanzas
              </h1>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-400 mt-1">
                Gestión completa de ingresos, gastos y retiros personales
              </p>
            </TextReveal>
          </div>

          <div className="flex items-center gap-3">
            <CuentaForm
              onSubmit={agregarCuenta}
              monedasInfo={monedasInfo}
            />

            {/* Formulario de edición de cuenta (solo se monta cuando hay cuenta seleccionada) */}
            {cuentaEditando && (
              <CuentaForm
                onSubmit={async (data) => {
                  await editarCuenta(cuentaEditando.id, data);
                  setCuentaEditando(null);
                }}
                monedasInfo={monedasInfo}
                cuentaEditar={cuentaEditando}
                open={true}
                onOpenChange={(v) => { if (!v) setCuentaEditando(null); }}
              />
            )}
            
            <CategoriaForm
              onSubmit={agregarCategoria}
            />

            <TransferenciaForm
              cuentas={cuentas}
              monedasInfo={monedasInfo}
              tasasCambio={tasasCambio}
              onSubmit={transferirEntreCuentas}
            />

            <TransaccionForm
              cuentas={cuentas}
              categorias={categorias}
              onSubmit={agregarTransaccion}
              monedasInfo={monedasInfo}
            />
          </div>
        </div>

        {/* Tasas de cambio (info) */}
        {tasasCambio && (
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">
                  Tasas de cambio actualizadas:{' '}
                  <span className="text-white font-medium">
                    {new Date(tasasCambio.fecha).toLocaleDateString('es-ES')}
                  </span>
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  BRL: <span className="text-white">{tasasCambio.tasas.BRL?.toFixed(4)}</span>
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  COP: <span className="text-white">{tasasCambio.tasas.COP?.toFixed(2)}</span>
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  EUR: <span className="text-white">{tasasCambio.tasas.EUR?.toFixed(4)}</span>
                </span>
              </div>

              <button
                onClick={handleActualizarTasas}
                disabled={actualizandoTasas}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors text-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${actualizandoTasas ? 'animate-spin' : ''}`} />
                {actualizandoTasas ? 'Actualizando...' : 'Actualizar tasas'}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Tabs de navegación */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setVistaActual('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vistaActual === 'dashboard'
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <PieChart className="h-4 w-4" />
            Dashboard
          </button>

          <button
            onClick={() => setVistaActual('transacciones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vistaActual === 'transacciones'
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <List className="h-4 w-4" />
            Transacciones ({transacciones.length})
          </button>

          <button
            onClick={() => setVistaActual('configuracion')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              vistaActual === 'configuracion'
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Settings className="h-4 w-4" />
            Cuentas & Categorías
          </button>
        </div>

        {/* Contenido según vista activa */}
        {vistaActual === 'configuracion' && (
          <ConfiguracionFinanzas
            cuentas={cuentas}
            cuentasArchivadas={cuentasArchivadas}
            categorias={categorias}
            transacciones={transacciones}
            formatearMonto={formatearMonto}
            onEditarCuenta={handleEditarCuenta}
            onEliminarCuenta={handleEliminarCuenta}
            onRestaurarCuenta={restaurarCuenta}
            onEditarCategoria={handleEditarCategoria}
            onEliminarCategoria={handleEliminarCategoria}
          />
        )}
        
        {vistaActual === 'dashboard' && (
          <div className="space-y-6">
            <FinanzasDashboard estadisticas={estadisticas} formatearMonto={formatearMonto} />

            {/* Gráfico diario del mes actual */}
            <MesActualChartInteractive 
              datos={datosDiariosMesActual}
              titulo="Flujo Diario del Mes Actual"
            />

            {/* Distribución de gastos */}
            {distribucionGastos.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Distribución de Gastos del Mes
                </h3>

                <div className="space-y-3">
                  {distribucionGastos.map(item => (
                    <div key={item.categoriaId} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{item.categoriaNombre}</span>
                          <div className="text-right">
                            <span className="text-white font-semibold">
                              {formatearMonto(item.monto)}
                            </span>
                            <span className="text-gray-400 text-sm ml-2">
                              ({item.porcentaje.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${item.porcentaje}%`,
                              backgroundColor: item.categoriaColor || '#8b5cf6',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Histórico mensual */}
            <HistoricoMensualChart datos={historicoMensual} />
          </div>
        )}
        
        {vistaActual === 'transacciones' && (
          <TransaccionesList
            transacciones={transacciones}
            categorias={categorias}
            onEliminar={eliminarTransaccion}
            formatearMonto={formatearMonto}
            monedasInfo={monedasInfo}
          />
        )}
      </div>

      {/* ── AlertDialog: Confirmar eliminación de cuenta ── */}
      <AlertDialog
        open={!!cuentaEliminando}
        onOpenChange={(v) => { if (!v) setCuentaEliminando(null); }}
      >
        <AlertDialogContent className="bg-black/90 border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              ¿Archivar cuenta?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              La cuenta <span className="text-white font-medium">"{cuentaEliminando?.nombre}"</span> será
              archivada. Todas sus transacciones se conservarán y podrás restaurarla en cualquier momento
              desde la sección de Cuentas & Categorías.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (cuentaEliminando) {
                  await eliminarCuenta(cuentaEliminando.id);
                  setCuentaEliminando(null);
                }
              }}
            >
              Sí, archivar cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
