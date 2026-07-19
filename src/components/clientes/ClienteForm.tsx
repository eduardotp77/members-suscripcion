import { useState, useEffect, useRef } from "react";
import { Cliente, ClienteFormData, TipoSuscripcion, MedioPago } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { calcularFechaVencimiento, validarCorreo } from "@/lib/utils";
import { labelsTipoSuscripcion, labelsMedioPago } from "@/lib/theme";
import { X, Save, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Props del componente
interface ClienteFormProps {
  cliente?: Cliente | null;
  onGuardar: (datos: ClienteFormData) => void;
  onCancelar: () => void;
  loading?: boolean;
  combinacionesExistentes?: string[];
  datosIniciales?: Partial<ClienteFormData>;
  productosExistentes?: string[];
}

/**
 * Formulario para crear o editar un cliente
 * Con validación y cálculo automático de vencimiento
 */
export function ClienteForm({
  cliente,
  onGuardar,
  onCancelar,
  loading = false,
  combinacionesExistentes = [],
  datosIniciales,
  productosExistentes = [],
}: ClienteFormProps) {
  const [productoSugerencias, setProductoSugerencias] = useState<string[]>([]);
  const [productoFocused, setProductoFocused] = useState(false);
  const productoRef = useRef<HTMLDivElement>(null);

  // Calcular sugerencias filtradas según lo que escribe el usuario
  const calcularSugerencias = (valor: string) => {
    if (!valor.trim()) {
      setProductoSugerencias(productosExistentes);
    } else {
      const filtradas = productosExistentes.filter((p) =>
        p.toLowerCase().includes(valor.toLowerCase()) && p.toLowerCase() !== valor.toLowerCase()
      );
      setProductoSugerencias(filtradas);
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productoRef.current && !productoRef.current.contains(e.target as Node)) {
        setProductoFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Estado del formulario
  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: datosIniciales?.nombre || "",
    correo: datosIniciales?.correo || "",
    whatsapp: datosIniciales?.whatsapp || "",
    producto: "",
    tipoSuscripcion: "mensual",
    medioPago: "stripe",
    valorCobrado: 0,
    fechaInicio: format(new Date(), "yyyy-MM-dd"),
    notas: "",
  });

  // Estado de errores
  const [errores, setErrores] = useState<Partial<Record<keyof ClienteFormData, string>>>({});

  // Cargar datos del cliente si está editando
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        correo: cliente.correo,
        whatsapp: cliente.whatsapp || "",
        producto: cliente.producto,
        tipoSuscripcion: cliente.tipoSuscripcion,
        medioPago: cliente.medioPago,
        valorCobrado: cliente.valorCobrado,
        fechaInicio: cliente.fechaInicio,
        notas: cliente.notas || "",
      });
    }
  }, [cliente]);

  // Actualizar campo del formulario
  const actualizarCampo = <K extends keyof ClienteFormData>(
    campo: K,
    valor: ClienteFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  // Validar formulario
  const validar = (): boolean => {
    const nuevosErrores: Partial<Record<keyof ClienteFormData, string>> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!validarCorreo(formData.correo)) {
      nuevosErrores.correo = "Ingrese un correo válido";
    } else if (
      combinacionesExistentes.includes(
        `${formData.correo.toLowerCase()}|${formData.producto.toLowerCase()}`
      ) &&
      (
        !cliente ||
        cliente.correo.toLowerCase() !== formData.correo.toLowerCase() ||
        cliente.producto.toLowerCase() !== formData.producto.toLowerCase()
      )
    ) {
      nuevosErrores.correo = "Este cliente ya tiene este producto registrado";
    }

    if (!formData.producto.trim()) {
      nuevosErrores.producto = "El producto es obligatorio";
    }

    if (formData.valorCobrado <= 0) {
      nuevosErrores.valorCobrado = "El valor debe ser mayor a 0";
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = "La fecha de inicio es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      onGuardar(formData);
    }
  };

  // Calcular fecha de vencimiento para mostrar
  const fechaVencimientoPreview = calcularFechaVencimiento(
    formData.fechaInicio,
    formData.tipoSuscripcion
  );

  const esEdicion = !!cliente;
  const esNuevoProducto = !cliente && !!datosIniciales?.correo;

  // Opciones para tipo de suscripción
  const opcionesTipoSuscripcion = Object.entries(labelsTipoSuscripcion).map(
    ([valor, label]) => ({ value: valor, label })
  );

  // Opciones para medio de pago
  const opcionesMedioPago = Object.entries(labelsMedioPago).map(
    ([valor, label]) => ({ value: valor, label })
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Modal */}
      <GlassCard
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
        hoverable={false}
        padding="lg"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {esEdicion ? "Editar Cliente" : esNuevoProducto ? `Nuevo Producto — ${datosIniciales?.nombre}` : "Nuevo Cliente"}
            </h2>
          </div>
          <button
            onClick={onCancelar}
            className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Nombre *
            </label>
            <GlassInput
              value={formData.nombre}
              onChange={(e) => actualizarCampo("nombre", e.target.value)}
              placeholder="Nombre del cliente"
              error={!!errores.nombre}
            />
            {errores.nombre && (
              <p className="mt-1 text-xs text-destructive">{errores.nombre}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Correo Electrónico *
            </label>
            <GlassInput
              type="email"
              value={formData.correo}
              onChange={(e) => actualizarCampo("correo", e.target.value)}
              placeholder="correo@ejemplo.com"
              error={!!errores.correo}
            />
            {errores.correo && (
              <p className="mt-1 text-xs text-destructive">{errores.correo}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              WhatsApp (opcional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <GlassInput
                type="tel"
                value={formData.whatsapp || ""}
                onChange={(e) => actualizarCampo("whatsapp", e.target.value)}
                placeholder="+1 234 567 8900"
                className="pl-10"
              />
            </div>
            <p className="mt-1 text-xs text-white/40">Incluir código de país</p>
          </div>

          {/* Producto — combobox con sugerencias */}
          <div ref={productoRef}>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Producto *
            </label>
            <div className="relative">
              <GlassInput
                value={formData.producto}
                onChange={(e) => {
                  actualizarCampo("producto", e.target.value);
                  calcularSugerencias(e.target.value);
                }}
                onFocus={() => {
                  calcularSugerencias(formData.producto);
                  setProductoFocused(true);
                }}
                placeholder="Nombre del producto o plan"
                error={!!errores.producto}
                autoComplete="off"
              />
              {productoFocused && productoSugerencias.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl shadow-xl overflow-hidden">
                  {productoSugerencias.map((sugerencia) => (
                    <li
                      key={sugerencia}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        actualizarCampo("producto", sugerencia);
                        setProductoFocused(false);
                      }}
                      className={cn(
                        "cursor-pointer px-4 py-2.5 text-sm text-white/80 hover:bg-primary/20 hover:text-white transition-colors"
                      )}
                    >
                      {sugerencia}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errores.producto && (
              <p className="mt-1 text-xs text-destructive">{errores.producto}</p>
            )}
          </div>

          {/* Tipo de suscripción y Medio de pago */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Tipo de Suscripción
              </label>
              <GlassSelect
                value={formData.tipoSuscripcion}
                onChange={(value) =>
                  actualizarCampo("tipoSuscripcion", value as TipoSuscripcion)
                }
                options={opcionesTipoSuscripcion}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Medio de Pago
              </label>
              <GlassSelect
                value={formData.medioPago}
                onChange={(value) =>
                  actualizarCampo("medioPago", value as MedioPago)
                }
                options={opcionesMedioPago}
              />
            </div>
          </div>

          {/* Valor y Fecha de inicio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Valor Cobrado (USD) *
              </label>
              <GlassInput
                type="number"
                min="0"
                step="0.01"
                value={formData.valorCobrado}
                onChange={(e) =>
                  actualizarCampo("valorCobrado", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                error={!!errores.valorCobrado}
              />
              {errores.valorCobrado && (
                <p className="mt-1 text-xs text-destructive">{errores.valorCobrado}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Fecha de Inicio *
              </label>
              <GlassInput
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => actualizarCampo("fechaInicio", e.target.value)}
                error={!!errores.fechaInicio}
              />
              {errores.fechaInicio && (
                <p className="mt-1 text-xs text-destructive">{errores.fechaInicio}</p>
              )}
            </div>
          </div>

          {/* Fecha de vencimiento calculada */}
          {fechaVencimientoPreview && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/50">Fecha de vencimiento calculada:</p>
              <p className="mt-1 text-sm font-medium text-white">
                {fechaVencimientoPreview}
              </p>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => actualizarCampo("notas", e.target.value)}
              placeholder="Notas adicionales sobre el cliente..."
              rows={3}
              className="flex w-full rounded-lg border px-4 py-3 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 bg-transparent border-0 p-0 cursor-pointer"
            >
              <HoverBorderGradient
                as="div"
                className="w-full px-4 py-2.5 text-sm font-medium flex items-center justify-center cursor-pointer"
                duration={1.5}
                containerClassName="w-full border-white/30"
              >
                Cancelar
              </HoverBorderGradient>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-transparent border-0 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HoverBorderGradient
                as="div"
                className="w-full px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                duration={1.5}
                containerClassName="w-full"
              >
                {loading ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {esEdicion ? "Guardar Cambios" : "Crear Cliente"}
                  </>
                )}
              </HoverBorderGradient>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
