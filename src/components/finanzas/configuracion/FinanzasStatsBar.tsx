import { motion } from 'framer-motion';
import { Wallet, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Cuenta, CategoriaFinanza, Transaccion } from '@/types';

interface FinanzasStatsBarProps {
  cuentas: Cuenta[];
  categorias: CategoriaFinanza[];
  transacciones: Transaccion[];
  formatearMonto: (monto: number) => string;
}

/**
 * Barra de estadísticas rápidas del módulo de finanzas
 * Muestra KPIs importantes de forma compacta
 */
export function FinanzasStatsBar({
  cuentas,
  categorias,
  transacciones,
  formatearMonto,
}: FinanzasStatsBarProps) {
  // Cálculos
  const totalEnCuentas = cuentas.reduce((sum, c) => sum + c.saldoActual, 0);
  const cuentasActivas = cuentas.filter(c => c.activa).length;
  
  // Transacciones del mes actual
  const fechaInicio = new Date();
  fechaInicio.setDate(1);
  fechaInicio.setHours(0, 0, 0, 0);
  
  const transaccionesMes = transacciones.filter(t => 
    new Date(t.fecha) >= fechaInicio
  );
  
  // Categorías con presupuesto excedido
  const categoriasExcedidas = categorias.filter(cat => {
    if (cat.tipo !== 'gasto' || !cat.presupuestoMensual) return false;
    
    const gastosMes = transaccionesMes
      .filter(t => t.categoriaId === cat.id && t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.montoUsd, 0);
    
    return gastosMes > cat.presupuestoMensual;
  }).length;
  
  // Categoría más usada
  const categoriaContador = new Map<string, number>();
  transaccionesMes.forEach(t => {
    if (t.categoriaId) {
      categoriaContador.set(
        t.categoriaId,
        (categoriaContador.get(t.categoriaId) || 0) + 1
      );
    }
  });
  
  let categoriaMasUsada = 'N/A';
  let maxUsos = 0;
  categoriaContador.forEach((count, catId) => {
    if (count > maxUsos) {
      maxUsos = count;
      const cat = categorias.find(c => c.id === catId);
      if (cat) categoriaMasUsada = cat.nombre;
    }
  });
  
  const stats = [
    {
      icon: Wallet,
      label: 'Total en Cuentas',
      value: formatearMonto(totalEnCuentas),
      sublabel: `${cuentasActivas} activas`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Activity,
      label: 'Transacciones',
      value: transaccionesMes.length.toString(),
      sublabel: 'este mes',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Más Usada',
      value: categoriaMasUsada,
      sublabel: `${maxUsos} transacciones`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: AlertTriangle,
      label: 'Alertas',
      value: categoriasExcedidas.toString(),
      sublabel: 'presup. excedidos',
      color: categoriasExcedidas > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor: categoriasExcedidas > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
    },
  ];
  
  return (
    <GlassCard className="p-4 sticky top-20 z-10 backdrop-blur-xl bg-black/40">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{stat.label}</p>
              <p className="text-sm font-bold text-white truncate">{stat.value}</p>
              <p className="text-xs text-gray-500 truncate">{stat.sublabel}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
