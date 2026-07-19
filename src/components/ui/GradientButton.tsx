import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

// Variantes del botón
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

// Props del componente
interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Botón con gradiente y efectos de glow
 * Múltiples variantes y tamaños disponibles
 */
const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    // Estilos base comunes
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
      "transition-all duration-300 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
    );

    // Estilos por variante
    const variantStyles: Record<ButtonVariant, string> = {
      primary: cn(
        "bg-gradient-to-r from-primary to-accent text-white",
        "shadow-[0_4px_20px_rgba(139,92,246,0.4)]",
        "hover:opacity-90 hover:scale-[1.02]",
        "hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
        "focus:ring-primary/50"
      ),
      secondary: cn(
        "bg-gradient-to-r from-secondary to-blue-500 text-white",
        "shadow-lg",
        "hover:opacity-90 hover:scale-[1.02]",
        "focus:ring-secondary/50"
      ),
      outline: cn(
        "border border-white/20 bg-white/5 text-white",
        "backdrop-blur-sm",
        "hover:bg-white/10 hover:border-white/30",
        "focus:ring-white/20"
      ),
      ghost: cn(
        "bg-transparent text-white/80",
        "hover:bg-white/10 hover:text-white",
        "focus:ring-white/20"
      ),
      danger: cn(
        "bg-gradient-to-r from-destructive to-red-600 text-white",
        "shadow-lg",
        "hover:opacity-90 hover:scale-[1.02]",
        "focus:ring-destructive/50"
      ),
    };

    // Estilos por tamaño
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };
