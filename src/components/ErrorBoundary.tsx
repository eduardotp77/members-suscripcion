import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { HoverBorderGradient } from "./ui/HoverBorderGradient";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary global para capturar errores no manejados
 * Muestra una UI amigable en lugar de pantalla blanca
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar estado para mostrar UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio como Sentry
    // sendErrorToLoggingService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <GlassCard className="max-w-2xl w-full p-8 space-y-6">
            {/* Icono de error */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-destructive/20 rounded-full" />
                <div className="relative bg-destructive/10 border border-destructive/30 rounded-full p-6">
                  <AlertTriangle className="h-16 w-16 text-destructive" />
                </div>
              </div>
            </div>

            {/* Mensaje principal */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">
                ¡Algo salió mal!
              </h1>
              <p className="text-white/60 text-lg">
                Lo sentimos, ha ocurrido un error inesperado en la aplicación.
              </p>
            </div>

            {/* Detalles del error (solo en desarrollo) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-white/40 hover:text-white/60 transition-colors">
                    Ver detalles técnicos ▼
                  </summary>
                  <div className="mt-3 p-4 bg-black/50 border border-white/5 rounded-lg overflow-auto max-h-64">
                    <div className="space-y-2 font-mono text-xs">
                      <div>
                        <span className="text-destructive font-bold">Error:</span>
                        <p className="text-white/80 mt-1">
                          {this.state.error.message}
                        </p>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <span className="text-warning font-bold">Stack:</span>
                          <pre className="text-white/60 mt-1 whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo && (
                        <div>
                          <span className="text-info font-bold">Component Stack:</span>
                          <pre className="text-white/60 mt-1 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={this.handleReload}
                className="sm:w-auto bg-transparent border-0 p-0 cursor-pointer"
              >
                <HoverBorderGradient
                  as="div"
                  className="px-4 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer"
                  duration={1.5}
                >
                  <RefreshCw className="h-4 w-4" />
                  Recargar Página
                </HoverBorderGradient>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                <Home className="h-4 w-4" />
                Ir al Inicio
              </button>
            </div>

            {/* Información de ayuda */}
            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-white/40">
                Si el problema persiste, contacta con soporte:
              </p>
              <a
                href="mailto:sociosdigitales.pro@gmail.com"
                className="text-sm text-primary hover:text-accent transition-colors"
              >
                sociosdigitales.pro@gmail.com
              </a>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
