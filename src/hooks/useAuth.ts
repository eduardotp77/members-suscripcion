import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logError } from "@/lib/logger";

interface Profile {
  id: string;
  nombre: string;
  email: string;
  avatar_url: string | null;
}

/**
 * Hook de autenticación con Supabase
 * Maneja login, registro, logout y estado de sesión
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Cargar perfil de forma diferida
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // DESPUÉS verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      logError('Error fetching profile', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  };

  const signUp = async (email: string, password: string, nombre: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { nombre }
      }
    });

    if (error) {
      const errorMessage = error?.message || 'Error desconocido';
      if (errorMessage.includes("already registered")) {
        toast.error("Este correo ya está registrado");
      } else {
        toast.error(errorMessage);
      }
      return { error };
    }

    toast.success("¡Cuenta creada exitosamente!");
    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      const errorMessage = error?.message || 'Error desconocido';
      if (errorMessage.includes("Invalid login credentials")) {
        toast.error("Credenciales inválidas");
      } else {
        toast.error(errorMessage);
      }
      return { error };
    }

    toast.success("¡Bienvenido de nuevo!");
    return { data, error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    // Si el error es que la sesión ya no existe en el servidor (403 / "Auth session missing"),
    // igual limpiamos el estado local para que el usuario pueda salir sin problemas.
    const sessionAlreadyGone =
      !error ||
      error?.message?.toLowerCase().includes('session') ||
      error?.status === 403;

    if (error && !sessionAlreadyGone) {
      const errorMessage = error?.message || 'Error al cerrar sesión';
      toast.error(errorMessage);
      return { error };
    }

    setUser(null);
    setSession(null);
    setProfile(null);
    toast.success("Sesión cerrada");
    return { error: null };
  };

  return {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut
  };
}
