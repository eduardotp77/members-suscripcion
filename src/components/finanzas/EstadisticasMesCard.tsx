import { Calendar, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface DatoDiaMes {
  dia: string;
  fecha: string;
  ingresos: number;
  gastos: number;
  neto: number;
  acumulado: number;
}

interface Props {
  datos: DatoDiaMes[];
  formatearMonto: (monto: number) => string;
}

export function EstadisticasMesCard({ datos, formatearMonto }: Props) {
  // Validación: si no hay datos, mostrar mensaje
  if (!datos || datos.length === 0) {
    return (
      <GlassCard className="p-6 h-full hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300">
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Estadísticas del Mes</h3>
            <p className="text-sm text-gray-400">No hay datos disponibles para este mes</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  // Filtrar solo días con datos (días transcurridos)
  const diasConDatos = datos.filter(d => d.ingresos > 0 || d.gastos > 0);
  const diasTranscurridos = diasConDatos.length || 1; // Evitar división por 0
  const totalDiasMes = datos.length;
  
  // Calcular totales
  const totalIngresos = datos.reduce((sum, d) => sum + d.ingresos, 0);
  const totalGastos = datos.reduce((sum, d) => sum + d.gastos, 0);
  
  // Promedios
  const promedioIngresos = totalIngresos / diasTranscurridos;
  const promedioGastos = totalGastos / diasTranscurridos;
  
  // Mejor y peor día
  const mejorDia = datos.reduce((max, d) => (d.ingresos > max.ingresos ? d : max), datos[0]);
  const peorDia = datos.reduce((max, d) => (d.gastos > max.gastos ? d : max), datos[0]);
  
  // Proyección de cierre de mes
  const diasRestantes = totalDiasMes - diasTranscurridos;
  const proyeccionIngresos = totalIngresos + (promedioIngresos * diasRestantes);
  const proyeccionGastos = totalGastos + (promedioGastos * diasRestantes);
  const proyeccionNeta = proyeccionIngresos - proyeccionGastos;
  
  return (
    <GlassCard className="p-6 h-full hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Estadísticas del Mes</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              Día {diasTranscurridos} de {totalDiasMes} ({((diasTranscurridos / totalDiasMes) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Promedios Diarios */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Promedio Ingresos</p>
                <p className="text-lg font-bold text-white">{formatearMonto(promedioIngresos)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-sm font-semibold text-green-400">{formatearMonto(totalIngresos)}</p>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Promedio Gastos</p>
                <p className="text-lg font-bold text-white">{formatearMonto(promedioGastos)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-sm font-semibold text-red-400">{formatearMonto(totalGastos)}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Días Destacados */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">🏆 Mejor Día</p>
            <div className="text-right">
              <p className="text-xs text-gray-400">{mejorDia.fecha}</p>
              <p className="text-sm font-bold text-green-400">{formatearMonto(mejorDia.ingresos)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">📉 Mayor Gasto</p>
            <div className="text-right">
              <p className="text-xs text-gray-400">{peorDia.fecha}</p>
              <p className="text-sm font-bold text-red-400">{formatearMonto(peorDia.gastos)}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Proyección de Cierre */}
        <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-lg p-4 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-violet-400" />
            <p className="text-xs font-semibold text-violet-400">Proyección de Cierre</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Ingresos estimados</span>
              <span className="text-sm font-bold text-white">{formatearMonto(proyeccionIngresos)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Gastos estimados</span>
              <span className="text-sm font-bold text-white">{formatearMonto(proyeccionGastos)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-sm font-semibold text-white">Neto proyectado</span>
              <span className={`text-base font-black ${proyeccionNeta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatearMonto(proyeccionNeta)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
