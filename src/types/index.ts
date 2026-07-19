// Tipos principales del sistema de gestión de suscripciones

// Tipo de suscripción disponible
export type TipoSuscripcion = 'mensual' | 'trimestral' | 'semestral' | 'anual' | 'vitalicio';

// Medios de pago aceptados
export type MedioPago = 'stripe' | 'binance' | 'paypal' | 'hotmart';

// Estados posibles de una suscripción
export type EstadoSuscripcion = 'activa' | 'vencida' | 'pendiente' | 'cancelada';

// Interface principal del cliente con suscripción
export interface Cliente {
  id: string;
  nombre: string;
  correo: string;
  whatsapp?: string;
  producto: string;
  tipoSuscripcion: TipoSuscripcion;
  medioPago: MedioPago;
  valorCobrado: number;
  fechaInicio: string;
  fechaVencimiento: string | null;
  estado: EstadoSuscripcion;
  notas?: string;
  motivoCancelacion?: string;
  totalRenovaciones: number;
  createdAt: string;
  updatedAt: string;
}

// Interface para el historial de pagos
export interface Pago {
  id: string;
  clienteId: string;
  clienteNombre: string;
  monto: number;
  medioPago: MedioPago;
  concepto: 'nuevo' | 'renovacion';
  fecha: string;
  createdAt: string;
}

// Interface para estadísticas del dashboard
export interface EstadisticasDashboard {
  totalIngresos: number;
  suscripcionesActivas: number;
  totalSuscripciones: number;
  proximasVencer: number;
  ingresosMesActual: number;
}

// Interface para datos de gráficos
export interface DatosGraficoMensual {
  mes: string;
  ingresos: number;
}

export interface DatosDistribucion {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

// Props para formulario de cliente
export interface ClienteFormData {
  nombre: string;
  correo: string;
  whatsapp?: string;
  producto: string;
  tipoSuscripcion: TipoSuscripcion;
  medioPago: MedioPago;
  valorCobrado: number;
  fechaInicio: string;
  notas?: string;
}

// Nota tipo timeline de un cliente
export interface NotaCliente {
  id: string;
  clienteId: string;
  contenido: string;
  createdAt: string;
}

// Filtros para lista de clientes
export interface FiltrosCliente {
  busqueda: string;
  estado: EstadoSuscripcion | 'todos';
  tipoSuscripcion: TipoSuscripcion | 'todos';
  producto: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

// ─── Métricas avanzadas para el Dashboard (estilo Stripe) ──────────────────

/**
 * Monthly Recurring Revenue — ingresos recurrentes normalizados a mensual.
 * Solo incluye suscripciones activas; vitalicias se excluyen del cálculo.
 */
export interface MetricasMRR {
  mrr: number;               // MRR del mes actual
  mrrMesAnterior: number;    // MRR del mes anterior (para tendencia)
  tendenciaMRR: number;      // Variación porcentual MoM (puede ser negativa)
}

/**
 * Desglose de ingresos por método de pago en el mes actual.
 * Permite visualizar cuánto aporta cada plataforma.
 */
export interface DistribucionMedioPago {
  medioPago: MedioPago;   // Identificador del método
  label: string;           // Nombre legible: "Stripe", "Binance", etc.
  monto: number;           // Total en $ cobrado este mes
  cantidad: number;        // Número de transacciones
  porcentaje: number;      // % sobre el total del mes
  color: string;           // Color hex fijo por método para la UI
}

/**
 * Métricas de crecimiento: altas y bajas del mes.
 * Permite calcular el churn rate y la adquisición neta.
 */
export interface MetricasCrecimiento {
  nuevosEsteMes: number;       // Clientes creados en el mes en curso
  nuevosMesAnterior: number;   // Clientes creados el mes pasado (tendencia)
  canceladosEsteMes: number;   // Cancelados en el mes en curso
  tasaChurn: number;           // % churn = cancelados / activos inicio mes
  tendenciaNuevos: number;     // Variación % de nuevos MoM
}

// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO FINANZAS - Types
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Monedas soportadas en el sistema
 * USD es la moneda base del negocio
 */
export type Moneda = 'USD' | 'BRL' | 'COP' | 'MXN' | 'ARS' | 'CLP' | 'PEN' | 'EUR';

/**
 * Tipo de cuenta bancaria o monedero
 */
export type TipoCuenta = 'banco' | 'efectivo' | 'tarjeta' | 'paypal' | 'crypto' | 'otro';

/**
 * Tipo de transacción
 */
export type TipoTransaccion = 'ingreso' | 'gasto';

/**
 * Tipo de categoría financiera
 */
export type TipoCategoria = 'ingreso' | 'gasto';

/**
 * Cuenta bancaria o monedero
 */
export interface Cuenta {
  id: string;
  userId: string;
  nombre: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldoInicial: number;
  saldoActual: number;
  color?: string;
  icono?: string;
  activa: boolean;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Categoría de ingresos o gastos
 */
export interface CategoriaFinanza {
  id: string;
  userId: string;
  nombre: string;
  tipo: TipoCategoria;
  color?: string;
  icono?: string;
  presupuestoMensual?: number;
  categoriaPadre?: string;
  esRetiroPersonal: boolean;
  activa: boolean;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tasa de cambio entre monedas
 */
export interface TasaCambio {
  id: string;
  monedaOrigen: string;
  monedaDestino: Moneda;
  tasa: number;
  fecha: string;
  esManual: boolean;
  fuente: string;
  createdAt: string;
}

/**
 * Transacción financiera (ingreso o gasto)
 */
export interface Transaccion {
  id: string;
  userId: string;
  cuentaId?: string;
  categoriaId?: string;
  tipo: TipoTransaccion;
  monto: number;
  moneda: Moneda;
  montoUsd: number;
  tasaCambio?: number;
  concepto: string;
  descripcion?: string;
  fecha: string;
  esRetiroPersonal: boolean;
  etiquetas?: string[];
  adjuntoUrl?: string;
  pagoClienteId?: string;
  transferId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relaciones (populated)
  cuenta?: Cuenta;
  categoria?: CategoriaFinanza;
}

/**
 * Form data para crear/editar cuenta
 */
export interface CuentaFormData {
  nombre: string;
  tipo: TipoCuenta;
  moneda: Moneda;
  saldoInicial: number;
  color?: string;
  icono?: string;
  descripcion?: string;
}

/**
 * Form data para crear/editar categoría
 */
export interface CategoriaFormData {
  nombre: string;
  tipo: TipoCategoria;
  color?: string;
  icono?: string;
  presupuestoMensual?: number;
  descripcion?: string;
}

/**
 * Form data para crear/editar transacción
 */
export interface TransaccionFormData {
  tipo: TipoTransaccion;
  monto: number;
  moneda: Moneda;
  concepto: string;
  descripcion?: string;
  fecha: string;
  cuentaId?: string;
  categoriaId?: string;
  etiquetas?: string[];
}

/**
 * Form data para transferencia entre cuentas
 */
export interface TransferenciaFormData {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  concepto: string;
  fecha: string;
}

/**
 * Filtros para lista de transacciones
 */
export interface FiltrosTransaccion {
  busqueda: string;
  tipo: TipoTransaccion | 'todos';
  moneda: Moneda | 'todas';
  categoriaId: string | 'todas';
  cuentaId: string | 'todas';
  fechaDesde?: string;
  fechaHasta?: string;
  esRetiroPersonal?: boolean;
}

/**
 * Estadísticas del panel de finanzas
 */
export interface EstadisticasFinanzas {
  // Balance y salud
  balanceTotal: number;              // Suma de saldos de todas las cuentas en USD
  balancePorMoneda: Record<Moneda, number>;
  
  // Mes actual
  ingresosMes: number;               // Total ingresos USD este mes
  gastosMes: number;                 // Total gastos operativos USD (sin retiros)
  retirosMes: number;                // Total retiros personales USD este mes
  gananciaNeta: number;              // Ingresos - Gastos - Retiros
  margenNeto: number;                // % ganancia sobre ingresos
  
  // Métricas de salud
  burnRate: number;                  // Gasto promedio mensual (sin retiros)
  runway: number;                    // Meses que puede operar sin ingresos
  promedioRetiros: number;           // Promedio de retiros últimos 3 meses
  
  // Comparativas
  variacionIngresos: number;         // % vs mes anterior
  variacionGastos: number;           // % vs mes anterior
  variacionRetiros: number;          // % vs mes anterior
}

/**
 * Distribución de gastos por categoría
 */
export interface DistribucionGastos {
  categoriaId: string;
  categoriaNombre: string;
  categoriaIcono?: string;
  categoriaColor?: string;
  monto: number;
  cantidad: number;
  porcentaje: number;
}

/**
 * Datos para gráficos de flujo de caja
 */
export interface DatosFlujo {
  mes: string;
  ingresos: number;
  gastos: number;
  retiros: number;
  neto: number;
  balance: number;
}

/**
 * Análisis de retiros personales
 */
export interface AnalisisRetiros {
  mes: string;
  monto: number;
  porcentajeIngresos: number;
  sostenible: boolean;
}

/**
 * Información de moneda con símbolo y nombre
 */
export interface MonedaInfo {
  codigo: Moneda;
  nombre: string;
  simbolo: string;
  pais: string;
}

/**
 * Tasas de cambio actuales (cache)
 */
export interface TasasCambioActuales {
  fecha: string;
  tasas: Record<Moneda, number>;
  fuenteAPI: string;
}

/**
 * Datos históricos mensuales para gráficos de tendencia
 * Utilizado en el componente HistoricoMensualChart para visualizar
 * la evolución de ingresos y gastos a lo largo del tiempo
 */
export interface DatosHistoricoMensual {
  mes: string;              // Formato corto: "Ene 2026"
  mesCompleto: string;      // Formato completo: "enero de 2026"
  fecha: Date;              // Fecha del primer día del mes (para ordenamiento y gráficos)
  ingresos: number;         // Total de ingresos en USD del mes
  gastos: number;           // Total de gastos en USD del mes (incluye retiros)
  neto: number;             // Diferencia: ingresos - gastos
}

/**
 * Datos diarios del mes actual para gráfico día por día
 * Utilizado para visualizar el flujo de caja diario del mes en curso
 */
export interface DatosDiariosMes {
  dia: string;              // Número del día: "1", "2", "3"... "31"
  fecha: string;            // Fecha legible: "1 may", "2 may"
  fechaCompleta: Date;      // Fecha completa para el gráfico
  ingresos: number;         // Ingresos del día en USD
  gastos: number;           // Gastos del día en USD
  neto: number;             // Ingresos - Gastos del día
  acumulado: number;        // Balance acumulado hasta ese día
}
