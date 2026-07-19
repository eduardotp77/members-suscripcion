import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { AnimatedGradient } from "@/components/ui/AnimatedGradient";
import { TextReveal } from "@/components/ui/TextReveal";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { z } from "zod";

// Esquemas de validación
const emailSchema = z.string().email("Correo electrónico inválido");
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres");
const nombreSchema = z.string().min(2, "El nombre debe tener al menos 2 caracteres");

/**
 * Página de autenticación - Login y Registro
 */
export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar email
    const emailResult = emailSchema.safeParse(formData.email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    // Validar contraseña
    const passwordResult = passwordSchema.safeParse(formData.password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    // Validar nombre solo en registro
    if (!isLogin) {
      const nombreResult = nombreSchema.safeParse(formData.nombre);
      if (!nombreResult.success) {
        newErrors.nombre = nombreResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.nombre);
        if (!error) {
          navigate("/dashboard");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Fondo animado sutil */}
      <AnimatedGradient />

      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8">
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-8">
            <TextReveal delay={0.1}>
              <img src="/logo.svg" alt="SociosMembres" className="h-20 w-20 mb-4" />
            </TextReveal>
            <TextReveal delay={0.2}>
              <h1 className="text-2xl font-bold text-white">SociosMembres</h1>
            </TextReveal>
            <TextReveal delay={0.3}>
              <p className="text-white/50 mt-2 text-center">
                {isLogin ? "Inicia sesión en tu cuenta" : "Crea una cuenta nueva"}
              </p>
            </TextReveal>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nombre (solo registro) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={(e) => updateField("nombre", e.target.value)}
                  className="flex h-11 w-full rounded-lg border px-10 py-2 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 ease-out focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-400 mt-1">{errors.nombre}</p>
                )}
              </div>
            )}

            {/* Campo Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="flex h-11 w-full rounded-lg border px-10 py-2 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 ease-out focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="flex h-11 w-full rounded-lg border px-10 py-2 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 ease-out focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Botón Submit */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                <HoverBorderGradient
                  as="div"
                  className="w-full px-6 py-3 text-base font-medium flex items-center justify-center gap-2 cursor-pointer"
                  duration={1.5}
                  containerClassName="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </HoverBorderGradient>
              </button>
            </div>
          </form>

          {/* Toggle Login/Registro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>¿No tienes cuenta? <span className="text-violet-400 font-medium">Regístrate</span></>
              ) : (
                <>¿Ya tienes cuenta? <span className="text-violet-400 font-medium">Inicia sesión</span></>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
