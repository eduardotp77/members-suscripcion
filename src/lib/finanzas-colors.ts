/**
 * Paleta de colores para componentes de finanzas
 * Mantiene consistencia visual en toda la aplicación
 * 
 * @module finanzas-colors
 * @description Centraliza los colores utilizados en gráficos y componentes
 * del módulo de finanzas para evitar duplicación y facilitar mantenimiento
 */

export const FINANZAS_COLORS = {
  // Ingresos - Verde
  income: '#10b981',       // Verde (green-500)
  incomeLight: '#34d399',  // Verde claro (green-400)
  incomeDark: '#059669',   // Verde oscuro (green-600)
  
  // Gastos - Rojo
  expense: '#ef4444',      // Rojo (red-500)
  expenseLight: '#f87171', // Rojo claro (red-400)
  expenseDark: '#dc2626',  // Rojo oscuro (red-600)
  
  // Balance/Neto - Violeta
  balance: '#8b5cf6',      // Violeta (violet-500)
  balanceLight: '#a78bfa', // Violeta claro (violet-400)
  
  // Retiros Personales - Rosa
  withdrawal: '#ec4899',   // Rosa (pink-500)
  
  // Neutro - Gris
  neutral: '#64748b',      // Gris (slate-500)
  neutralLight: '#94a3b8', // Gris claro (slate-400)
} as const;

/**
 * Tipo derivado de las claves de colores
 * Útil para validación de tipos en componentes
 */
export type FinanzasColorKey = keyof typeof FINANZAS_COLORS;
