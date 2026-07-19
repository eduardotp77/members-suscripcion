import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

// Props del componente GlassCard
interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "subtle";
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Componente Card con efecto glassmorphism
 * Soporta variantes y efectos de hover animados
 */
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hoverable = true, padding = "md", children, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const variantClasses = {
      default: "bg-white/5 border-white/10",
      highlight: "bg-white/[0.08] border-primary/20",
      subtle: "bg-white/[0.02] border-white/5",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border backdrop-blur-[10px]",
          "shadow-[0_4px_30px_rgba(0,0,0,0.3)]",
          "transition-all duration-300 ease-out",
          variantClasses[variant],
          paddingClasses[padding],
          hoverable && [
            "hover:bg-white/[0.08] hover:border-white/20",
            "hover:shadow-[0_8px_40px_rgba(139,92,246,0.15)]",
            "hover:backdrop-blur-[12px]",
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
