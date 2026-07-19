import { TrendingUp, Activity, PiggyBank, DollarSign } from 'lucide-react';
import type { EstadisticasFinanzas } from '@/types';
import { BalanceHeroCard } from './dashboard/BalanceHeroCard';
import { KPICompactCard } from './dashboard/KPICompactCard';
import { MetricsStripBar } from './dashboard/MetricsStripBar';

/**
 * Dashboard de Finanzas - Layout Bento Grid Premium
 * 
 * Diseño moderno con cuadrícula asimétrica inspirado en Notion/Linear/Apple
 * 
 * Características:
 * - Balance Total como hero card (2x2) con spotlight effect
 * - 4 KPIs compactos en grid 2x2 (Ingresos, Gastos, Retiros, Ganancia)
 * - Barra horizontal con métricas secundarias (Runway, Burn Rate, Margen, Salud)
 * - Animaciones stagger para entrada progresiva
 * - 100% responsive (mobile → tablet → desktop)
 * - Reutilización de componentes premium existentes
 * 
 * Layout Desktop:
 * ┌─────────────────────┬───────────┬───────────┐
 * │                     │  Ingresos │   Gastos  │
 * │   BALANCE TOTAL     │           │           │
 * │   (Hero Card 2x2)   ├───────────┼───────────┤
 * │                     │  Retiros  │ Ganancia  │
 * ├─────────────────────┴───────────┴───────────┤
 * │     Metrics Strip Bar (Horizontal)          │
 * └─────────────────────────────────────────────┘
 */

interface Props {
  estadisticas: EstadisticasFinanzas;
  formatearMonto: (monto: number) => string;
}

export function FinanzasDashboard({ estadisticas, formatearMonto }: Props) {
  const {
    balanceTotal,
    ingresosMes,
    gastosMes,
    retirosMes,
    gananciaNeta,
    margenNeto,
    burnRate,
    runway,
    variacionIngresos,
    variacionGastos,
    variacionRetiros,
  } = estadisticas;

  // TODO: En el futuro, calcular historial real desde transacciones
  // Por ahora, generar datos mock para el sparkline (últimos 7 días)
  const historialBalance = generarHistorialMock(balanceTotal, 7);
  const variacionBalance = calcularVariacionBalance(historialBalance);

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Balance Total - Hero Card (ocupa 2 columnas en desktop) */}
        <div className="md:col-span-2 lg:row-span-2">
          <BalanceHeroCard
            balanceTotal={balanceTotal}
            formatearMonto={formatearMonto}
            historialBalance={historialBalance}
            variacionBalance={variacionBalance}
          />
        </div>

        {/* Ingresos del Mes */}
        <KPICompactCard
          titulo="Ingresos del Mes"
          valor={ingresosMes}
          formatearMonto={formatearMonto}
          variacion={variacionIngresos}
          icono={TrendingUp}
          colorIcono="text-green-400"
          bgIcono="bg-green-500/20"
          index={0}
        />

        {/* Gastos Operativos */}
        <KPICompactCard
          titulo="Gastos Operativos"
          valor={gastosMes}
          formatearMonto={formatearMonto}
          variacion={variacionGastos}
          icono={Activity}
          colorIcono="text-blue-400"
          bgIcono="bg-blue-500/20"
          index={1}
          esNegativo
        />

        {/* Retiros Personales */}
        <KPICompactCard
          titulo="Retiros Personales"
          valor={retirosMes}
          formatearMonto={formatearMonto}
          variacion={variacionRetiros}
          icono={PiggyBank}
          colorIcono="text-pink-400"
          bgIcono="bg-pink-500/20"
          index={2}
          esNegativo
        />

        {/* Ganancia Neta */}
        <KPICompactCard
          titulo="Ganancia Neta"
          valor={gananciaNeta}
          formatearMonto={formatearMonto}
          icono={DollarSign}
          colorIcono={gananciaNeta >= 0 ? "text-green-400" : "text-red-400"}
          bgIcono={gananciaNeta >= 0 ? "bg-green-500/20" : "bg-red-500/20"}
          index={3}
          className={gananciaNeta >= 0 ? "ring-1 ring-green-500/30" : "ring-1 ring-red-500/30"}
        />
      </div>

      {/* Metrics Strip Bar - Métricas secundarias en horizontal */}
      <MetricsStripBar
        runway={runway}
        burnRate={burnRate}
        margenNeto={margenNeto}
        formatearMonto={formatearMonto}
      />
    </div>
  );
}

/**
 * Genera un historial mock del balance para el sparkline
 * En producción, esto debería venir de la base de datos
 * 
 * @param balanceActual - Balance total actual
 * @param dias - Número de días de historial
 * @returns Array con balance simulado por día
 */
function generarHistorialMock(balanceActual: number, dias: number): number[] {
  const historial: number[] = [];
  const variacionMaxima = balanceActual * 0.15; // ±15% de variación
  
  for (let i = dias - 1; i >= 0; i--) {
    const variacion = (Math.random() - 0.5) * variacionMaxima;
    const balanceDia = balanceActual - (variacion * (i / dias));
    historial.push(Math.max(0, balanceDia)); // Nunca negativo
  }
  
  return historial;
}

/**
 * Calcula la variación porcentual del balance
 * Compara el primer y último valor del historial
 * 
 * @param historial - Array de balances históricos
 * @returns Porcentaje de cambio
 */
function calcularVariacionBalance(historial: number[]): number {
  if (historial.length < 2) return 0;
  
  const inicial = historial[0];
  const final = historial[historial.length - 1];
  
  if (inicial === 0) return 0;
  
  return ((final - inicial) / inicial) * 100;
}
