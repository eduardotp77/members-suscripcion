/**
 * Sistema de logging centralizado
 * En desarrollo: muestra logs en consola
 * En producción: silencia logs o los envía a servicio externo (Sentry, LogRocket, etc.)
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Log de error - siempre se registra pero con detalles solo en desarrollo
 * @param message Mensaje descriptivo del error
 * @param error Error original o detalles adicionales
 */
export function logError(message: string, error?: unknown): void {
  if (isDevelopment) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    // En producción, enviar a servicio de logging
    // Ejemplo: Sentry.captureException(error, { contexts: { message } });
    console.error(`[ERROR] ${message}`); // Solo mensaje, sin detalles
  }
}

/**
 * Log de advertencia - solo en desarrollo
 * @param message Mensaje de advertencia
 * @param data Datos adicionales opcionales
 */
export function logWarning(message: string, data?: unknown): void {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, data);
  }
  // En producción no mostramos warnings
}

/**
 * Log de información - solo en desarrollo
 * @param message Mensaje informativo
 * @param data Datos adicionales opcionales
 */
export function logInfo(message: string, data?: unknown): void {
  if (isDevelopment) {
    console.info(`[INFO] ${message}`, data);
  }
}

/**
 * Log de debug - solo en desarrollo
 * @param message Mensaje de debug
 * @param data Datos adicionales opcionales
 */
export function logDebug(message: string, data?: unknown): void {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

/**
 * Función para inicializar servicio de logging externo (Sentry, LogRocket, etc.)
 * Llamar al inicio de la aplicación
 */
export function initLogger(): void {
  if (!isDevelopment) {
    // Inicializar servicio de logging en producción
    // Ejemplo:
    // Sentry.init({
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: 'production',
    // });
    console.log('Logger initialized for production');
  }
}
