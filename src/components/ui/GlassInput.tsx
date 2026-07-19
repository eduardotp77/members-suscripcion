import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

// Props del componente GlassInput
interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Input con estilo glassmorphism
 * Incluye estados de error y focus animados
 */
const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border px-4 py-2 text-sm",
          "bg-white/5 border-white/10 text-white",
          "placeholder:text-white/40",
          "backdrop-blur-sm",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:border-primary/50 focus:bg-white/[0.08]",
          "focus:ring-1 focus:ring-primary/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive/50 focus:border-destructive focus:ring-destructive/30",
          className
        )}
        {...props}
      />
    );
  }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };
