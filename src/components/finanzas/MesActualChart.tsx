import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { FINANZAS_COLORS } from '@/lib/finanzas-colors';

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
  titulo?: string;
}

export function MesActualChart({ datos, formatearMonto, titulo = "Flujo Diario del Mes Actual" }: Props) {
  // Validación: si no hay datos, mostrar mensaje
  if (!datos || datos.length === 0) {
    return (
      <GlassCard className="p-6 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">{titulo}</h3>
          <p className="text-sm text-gray-400">No hay datos disponibles para mostrar</p>
        </div>
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          <p>Agrega transacciones para ver el flujo diario</p>
        </div>
      </GlassCard>
    );
  }

  // Tooltip personalizado con glassmorphism
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-2 font-medium">{data.fecha}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Ingresos
            </span>
            <span className="text-xs text-white font-bold">{formatearMonto(data.ingresos)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Gastos
            </span>
            <span className="text-xs text-white font-bold">{formatearMonto(data.gastos)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-white/10">
            <span className="text-xs text-gray-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
              Neto
            </span>
            <span className={`text-xs font-bold ${data.neto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatearMonto(data.neto)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-violet-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
              Acumulado
            </span>
            <span className="text-xs text-white font-bold">{formatearMonto(data.acumulado)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <GlassCard className="p-6 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{titulo}</h3>
        <p className="text-sm text-gray-400">
          Progreso día a día - Mayo 2026
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={datos}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FINANZAS_COLORS.income} stopOpacity={0.8} />
              <stop offset="95%" stopColor={FINANZAS_COLORS.income} stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FINANZAS_COLORS.expense} stopOpacity={0.8} />
              <stop offset="95%" stopColor={FINANZAS_COLORS.expense} stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
            vertical={false}
          />
          
          <XAxis
            dataKey="dia"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-300">{value}</span>
            )}
          />

          {/* Barras de Ingresos */}
          <Bar
            dataKey="ingresos"
            name="Ingresos"
            fill="url(#colorIngresos)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationBegin={0}
          />

          {/* Barras de Gastos */}
          <Bar
            dataKey="gastos"
            name="Gastos"
            fill="url(#colorGastos)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationBegin={100}
          />

          {/* Línea de Balance Acumulado */}
          <Line
            type="monotone"
            dataKey="acumulado"
            name="Balance Acumulado"
            stroke={FINANZAS_COLORS.balance}
            strokeWidth={3}
            dot={{ fill: FINANZAS_COLORS.balance, r: 4 }}
            activeDot={{ r: 6, fill: FINANZAS_COLORS.balance }}
            animationDuration={1000}
            animationBegin={200}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
