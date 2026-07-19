// Constantes de tema y estilos para el sistema de gestión
// Tema: Glassmorphism Dark con gradientes violeta-rosa

export const colores = {
  // Colores base
  bgPrimary: '#000000',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBgHover: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  cardBorderHover: 'rgba(255, 255, 255, 0.2)',
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  
  // Gradientes
  gradientPrimary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  gradientSecondary: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  gradientViolet: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  
  // Estados
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Colores de estado para badges
  estadoActiva: '#10b981',
  estadoVencida: '#ef4444',
  estadoPendiente: '#f59e0b',
  estadoCancelada: '#6b7280',
} as const;

export const sombras = {
  card: '0 4px 30px rgba(0, 0, 0, 0.3)',
  cardHover: '0 8px 40px rgba(139, 92, 246, 0.15)',
  glow: '0 0 20px rgba(139, 92, 246, 0.3)',
  glowPink: '0 0 20px rgba(236, 72, 153, 0.3)',
  button: '0 4px 20px rgba(139, 92, 246, 0.4)',
} as const;

export const blur = {
  card: 'blur(10px)',
  cardHover: 'blur(12px)',
  modal: 'blur(20px)',
  backdrop: 'blur(8px)',
} as const;

export const transiciones = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

// Mapeo de estados a colores
export const colorEstado: Record<string, string> = {
  activa: colores.estadoActiva,
  vencida: colores.estadoVencida,
  pendiente: colores.estadoPendiente,
  cancelada: colores.estadoCancelada,
};

// Mapeo de tipos de suscripción a días
export const diasPorTipo: Record<string, number | null> = {
  mensual: 30,
  trimestral: 90,
  semestral: 180,
  anual: 365,
  vitalicio: null,
};

// Labels en español
export const labelsTipoSuscripcion: Record<string, string> = {
  mensual: 'Mensual',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
  vitalicio: 'Vitalicio',
};

export const labelsMedioPago: Record<string, string> = {
  stripe: 'Stripe',
  binance: 'Binance',
  paypal: 'PayPal',
  hotmart: 'Hotmart',
};

export const labelsEstado: Record<string, string> = {
  activa: 'Activa',
  vencida: 'Vencida',
  pendiente: 'Pendiente',
  cancelada: 'Cancelada',
};
