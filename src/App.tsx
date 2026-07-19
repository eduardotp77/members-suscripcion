import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Páginas de la aplicación
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ClienteDetalle from "./pages/ClienteDetalle";
import Renovaciones from "./pages/Renovaciones";
import Historial from "./pages/Historial";
import Calendario from "./pages/Calendario";
import Finanzas from "./pages/Finanzas";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

/**
 * Componente para proteger rutas autenticadas
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

/**
 * Componente principal de la aplicación
 * Sistema de Gestión de Suscripciones
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/" element={<Landing />} />

      {/* Página de autenticación */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/clientes" element={
        <ProtectedRoute>
          <Clientes />
        </ProtectedRoute>
      } />
      
      <Route path="/clientes/:id" element={
        <ProtectedRoute>
          <ClienteDetalle />
        </ProtectedRoute>
      } />
      
      <Route path="/renovaciones" element={
        <ProtectedRoute>
          <Renovaciones />
        </ProtectedRoute>
      } />
      
      <Route path="/historial" element={
        <ProtectedRoute>
          <Historial />
        </ProtectedRoute>
      } />

      {/* Vista calendario de vencimientos y pagos */}
      <Route path="/calendario" element={
        <ProtectedRoute>
          <Calendario />
        </ProtectedRoute>
      } />

      {/* Gestión de finanzas del negocio */}
      <Route path="/finanzas" element={
        <ProtectedRoute>
          <Finanzas />
        </ProtectedRoute>
      } />
      
      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Notificaciones toast */}
        <Toaster />
        <Sonner 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
        
        {/* Router de la aplicación */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
