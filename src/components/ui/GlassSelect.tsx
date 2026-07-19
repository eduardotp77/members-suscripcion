import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Props del componente
interface GlassSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  options?: { value: string; label: string }[];
}

/**
 * Select con estilo glassmorphism usando Radix UI
 * Soporta dos modos:
 * 1. Con prop `options` - array de opciones
 * 2. Con children - opciones como elementos hijos (para compatibilidad)
 */
const GlassSelect = ({
  value,
  onChange,
  placeholder = "Seleccionar...",
  error,
  disabled,
  className,
  options,
}: GlassSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          error && "border-destructive/50 focus:border-destructive focus:ring-destructive/30",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

GlassSelect.displayName = "GlassSelect";

export { GlassSelect };
