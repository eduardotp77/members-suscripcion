import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Cliente,
  ClienteFormData,
  EstadoSuscripcion,
  NotaCliente,
  Pago,
  TipoSuscripcion,
  MedioPago,
  MetricasMRR,
  MetricasCrecimiento,
  DistribucionMedioPago,
} from "@/types";
import { 
  calcularFechaVencimiento, 
  calcularEstadoSuscripcion,
  obtenerProximasVencer
} from "@/lib/utils";
import { format, parseISO, subMonths, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { logError } from "@/lib/logger";

// Mapeo de tipos de base de datos a tipos de aplicación
type DbTipoSuscripcion = "mensual" | "trimestral" | "semestral" | "anual" | "vitalicio";
type DbMedioPago = "stripe" | "binance" | "paypal" | "hotmart";
type DbEstadoSuscripcion = "activa" | "vencida" | "pendiente" | "cancelada";
type DbConceptoPago = "nuevo" | "renovacion";

/**
 * Hook personalizado para gestionar clientes y suscripciones
 * Conectado a la base de datos real via Supabase
 */
export function useClientes() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [notas, setNotas] = useState<NotaCliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase
  const cargarDatos = useCallback(async () => {
    if (!user) {
      setClientes([]);
      setPagos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientesError) throw clientesError;

      // Cargar pagos
      const { data: pagosData, error: pagosError } = await supabase
        .from("pagos")
        .select("*")
        .order("fecha", { ascending: false });

      if (pagosError) throw pagosError;

      // Cargar notas
      const { data: notasData, error: notasError } = await supabase
        .from("notas_cliente")
        .select("*")
        .order("created_at", { ascending: false });

      if (notasError) throw notasError;

      // Transformar datos de DB a formato de aplicación
      const clientesTransformados: Cliente[] = (clientesData || []).map((c) => ({
        id: c.id,
        nombre: c.nombre,
        correo: c.correo,
        whatsapp: c.whatsapp || undefined,
        producto: c.producto,
        tipoSuscripcion: c.tipo_suscripcion as TipoSuscripcion,
        medioPago: c.medio_pago as MedioPago,
        valorCobrado: Number(c.valor_cobrado),
        fechaInicio: c.fecha_inicio,
        fechaVencimiento: c.fecha_vencimiento,
        estado: calcularEstadoSuscripcion(c.fecha_vencimiento, c.estado as EstadoSuscripcion),
        notas: c.notas || undefined,
        motivoCancelacion: c.motivo_cancelacion || undefined,
        totalRenovaciones: c.total_renovaciones,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));

      const pagosTransformados: Pago[] = (pagosData || []).map((p) => ({
        id: p.id,
        clienteId: p.cliente_id,
        clienteNombre: p.cliente_nombre,
        monto: Number(p.monto),
        medioPago: p.medio_pago as MedioPago,
        concepto: p.concepto as "nuevo" | "renovacion",
        fecha: p.fecha,
        createdAt: p.created_at,
      }));

      const notasTransformadas: NotaCliente[] = (notasData || []).map((n) => ({
        id: n.id,
        clienteId: n.cliente_id,
        contenido: n.contenido,
        createdAt: n.created_at,
      }));

      setClientes(clientesTransformados);
      setPagos(pagosTransformados);
      setNotas(notasTransformadas);
    } catch (error) {
      logError('Error cargando datos de clientes', error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Agregar nuevo cliente
  const agregarCliente = async (datos: ClienteFormData) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return null;
    }

    try {
      const fechaVencimiento = calcularFechaVencimiento(
        datos.fechaInicio,
        datos.tipoSuscripcion
      );

      // Limpiar número de WhatsApp (solo dígitos y +)
      const whatsappLimpio = datos.whatsapp?.replace(/[^\d+]/g, "") || null;

      // Insertar cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from("clientes")
        .insert({
          user_id: user.id,
          nombre: datos.nombre,
          correo: datos.correo.toLowerCase(),
          whatsapp: whatsappLimpio,
          producto: datos.producto,
          tipo_suscripcion: datos.tipoSuscripcion as DbTipoSuscripcion,
          medio_pago: datos.medioPago as DbMedioPago,
          valor_cobrado: datos.valorCobrado,
          fecha_inicio: datos.fechaInicio,
          fecha_vencimiento: fechaVencimiento,
          estado: calcularEstadoSuscripcion(fechaVencimiento, "activa") as DbEstadoSuscripcion,
          notas: datos.notas || null,
          total_renovaciones: 0,
        })
        .select()
        .single();

      if (clienteError) throw clienteError;

      // Insertar pago inicial
      const { error: pagoError } = await supabase
        .from("pagos")
        .insert({
          user_id: user.id,
          cliente_id: clienteData.id,
          cliente_nombre: datos.nombre,
          monto: datos.valorCobrado,
          medio_pago: datos.medioPago as DbMedioPago,
          concepto: "nuevo" as DbConceptoPago,
          fecha: datos.fechaInicio,
        });

      if (pagoError) throw pagoError;

      await cargarDatos();
      toast.success("Cliente creado exitosamente");
      return clienteData;
    } catch (error: any) {
      console.error("Error agregando cliente:", error);
      if (error.code === "23505") {
        toast.error("Ya existe un cliente con ese correo");
      } else {
        toast.error("Error al crear el cliente");
      }
      return null;
    }
  };

  // Editar cliente existente
  const editarCliente = async (id: string, datos: ClienteFormData) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const fechaVencimiento = calcularFechaVencimiento(
        datos.fechaInicio,
        datos.tipoSuscripcion
      );

      // Obtener cliente actual para recalcular estado
      const clienteActual = clientes.find(c => c.id === id);
      const nuevoEstado = calcularEstadoSuscripcion(
        fechaVencimiento, 
        clienteActual?.estado || "activa"
      );

      // Limpiar número de WhatsApp (solo dígitos y +)
      const whatsappLimpio = datos.whatsapp?.replace(/[^\d+]/g, "") || null;

      const { error } = await supabase
        .from("clientes")
        .update({
          nombre: datos.nombre,
          correo: datos.correo.toLowerCase(),
          whatsapp: whatsappLimpio,
          producto: datos.producto,
          tipo_suscripcion: datos.tipoSuscripcion as DbTipoSuscripcion,
          medio_pago: datos.medioPago as DbMedioPago,
          valor_cobrado: datos.valorCobrado,
          fecha_inicio: datos.fechaInicio,
          fecha_vencimiento: fechaVencimiento,
          estado: nuevoEstado as DbEstadoSuscripcion,
          notas: datos.notas || null,
        })
        .eq("id", id);

      if (error) throw error;

      await cargarDatos();
      toast.success("Cliente actualizado exitosamente");
    } catch (error: any) {
      console.error("Error editando cliente:", error);
      if (error.code === "23505") {
        toast.error("Ya existe un cliente con ese correo");
      } else {
        toast.error("Error al actualizar el cliente");
      }
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await cargarDatos();
      toast.success("Cliente eliminado exitosamente");
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      toast.error("Error al eliminar el cliente");
    }
  };

  // Renovar suscripción
  const renovarSuscripcion = async (id: string, fechaRenovacion?: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const cliente = clientes.find((c) => c.id === id);
      if (!cliente) {
        toast.error("Cliente no encontrado");
        return;
      }

      const nuevaFechaInicio = fechaRenovacion || format(new Date(), "yyyy-MM-dd");
      const nuevaFechaVencimiento = calcularFechaVencimiento(
        nuevaFechaInicio,
        cliente.tipoSuscripcion
      );

      // Actualizar cliente
      const { error: clienteError } = await supabase
        .from("clientes")
        .update({
          fecha_inicio: nuevaFechaInicio,
          fecha_vencimiento: nuevaFechaVencimiento,
          estado: "activa" as DbEstadoSuscripcion,
          total_renovaciones: cliente.totalRenovaciones + 1,
        })
        .eq("id", id);

      if (clienteError) throw clienteError;

      // Registrar pago de renovación
      const { error: pagoError } = await supabase
        .from("pagos")
        .insert({
          user_id: user.id,
          cliente_id: id,
          cliente_nombre: cliente.nombre,
          monto: cliente.valorCobrado,
          medio_pago: cliente.medioPago as DbMedioPago,
          concepto: "renovacion" as DbConceptoPago,
          fecha: nuevaFechaInicio,
        });

      if (pagoError) throw pagoError;

      await cargarDatos();
      toast.success("Suscripción renovada exitosamente");
    } catch (error) {
      console.error("Error renovando suscripción:", error);
      toast.error("Error al renovar la suscripción");
    }
  };

  // Cambiar estado de suscripción
  const cambiarEstado = async (id: string, nuevoEstado: EstadoSuscripcion) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const { error } = await supabase
        .from("clientes")
        .update({ estado: nuevoEstado as DbEstadoSuscripcion })
        .eq("id", id);

      if (error) throw error;

      await cargarDatos();
      toast.success(`Estado cambiado a ${nuevoEstado}`);
    } catch (error) {
      console.error("Error cambiando estado:", error);
      toast.error("Error al cambiar el estado");
    }
  };

  // Cancelar suscripción con motivo
  const cancelarSuscripcion = async (id: string, motivo: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const { error } = await supabase
        .from("clientes")
        .update({ 
          estado: "cancelada" as DbEstadoSuscripcion,
          motivo_cancelacion: motivo
        })
        .eq("id", id);

      if (error) throw error;

      await cargarDatos();
      toast.success("Suscripción cancelada exitosamente");
    } catch (error) {
      console.error("Error cancelando suscripción:", error);
      toast.error("Error al cancelar la suscripción");
    }
  };

  // Reactivar cliente cancelado
  const reactivarCliente = async (id: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    try {
      const cliente = clientes.find((c) => c.id === id);
      if (!cliente) {
        toast.error("Cliente no encontrado");
        return;
      }

      // Calcular estado real según fecha de vencimiento (forzando 'activa' como base)
      const nuevoEstado = calcularEstadoSuscripcion(cliente.fechaVencimiento, "activa");

      const { error } = await supabase
        .from("clientes")
        .update({
          estado: nuevoEstado as DbEstadoSuscripcion,
          motivo_cancelacion: null,
        })
        .eq("id", id);

      if (error) throw error;

      await cargarDatos();
      toast.success("Cliente reactivado exitosamente");
    } catch (error) {
      console.error("Error reactivando cliente:", error);
      toast.error("Error al reactivar el cliente");
    }
  };

  // Combinaciones correo|producto existentes (para validar duplicados con multi-producto)
  const combinacionesExistentes = useMemo(
    () => clientes.map((c) => `${c.correo.toLowerCase()}|${c.producto.toLowerCase()}`),
    [clientes]
  );

  // Obtener suscripciones próximas a vencer
  const proximasVencer = useMemo(
    () => obtenerProximasVencer(clientes, 7),
    [clientes]
  );

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const activas = clientes.filter((c) => c.estado === "activa").length;
    const totalIngresos = pagos.reduce((sum, p) => sum + p.monto, 0);
    
    const mesActual = format(new Date(), "yyyy-MM");
    const ingresosMes = pagos
      .filter((p) => p.fecha.startsWith(mesActual))
      .reduce((sum, p) => sum + p.monto, 0);

    // Comparativa mes anterior
    const mesAnterior = format(subMonths(new Date(), 1), "yyyy-MM");
    const ingresosMesAnterior = pagos
      .filter((p) => p.fecha.startsWith(mesAnterior))
      .reduce((sum, p) => sum + p.monto, 0);

    // Activas el mes anterior = activas cuyo created_at es anterior al inicio del mes actual
    const inicioMesActual = startOfMonth(new Date()).toISOString();
    const activasMesAnterior = clientes.filter(
      (c) => c.estado === "activa" && c.createdAt < inicioMesActual
    ).length;

    return {
      totalIngresos,
      suscripcionesActivas: activas,
      totalSuscripciones: clientes.length,
      proximasVencer: proximasVencer.length,
      ingresosMesActual: ingresosMes,
      ingresosMesAnterior,
      activasMesAnterior,
    };
  }, [clientes, pagos, proximasVencer]);

  // Datos para gráfico de ingresos mensuales
  const datosGraficoMensual = useMemo(() => {
    const mesesData: Record<string, number> = {};
    
    pagos.forEach((pago) => {
      const mes = pago.fecha.substring(0, 7); // Formato: YYYY-MM
      mesesData[mes] = (mesesData[mes] || 0) + pago.monto;
    });

    return Object.entries(mesesData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([mes, ingresos]) => {
        const mesFormateado = format(parseISO(mes + "-01"), "MMM", { locale: es });
        // Capitalizar primera letra
        const mesCapitalizado = mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
        return {
          mes: mesCapitalizado,
          ingresos,
        };
      });
  }, [pagos]);

  // Datos para gráfico de distribución por tipo
  const datosDistribucion = useMemo(() => {
    const conteo: Record<string, number> = {};
    
    clientes.forEach((cliente) => {
      conteo[cliente.tipoSuscripcion] = (conteo[cliente.tipoSuscripcion] || 0) + 1;
    });

    const total = clientes.length || 1;

    return Object.entries(conteo).map(([tipo, cantidad]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      cantidad,
      porcentaje: Math.round((cantidad / total) * 100),
    }));
  }, [clientes]);

  // Obtener pagos de un cliente específico
  const obtenerPagosCliente = useCallback((clienteId: string) => {
    return pagos.filter(pago => pago.clienteId === clienteId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [pagos]);

  // Calcular estadísticas específicas de un cliente
  const calcularEstadisticasCliente = useCallback((clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    const pagosCliente = obtenerPagosCliente(clienteId);
    
    if (!cliente) return null;

    const ingresosTotales = pagosCliente.reduce((sum, p) => sum + p.monto, 0);
    const renovaciones = pagosCliente.filter(p => p.concepto === 'renovacion');
    const pagoInicial = pagosCliente.find(p => p.concepto === 'nuevo');
    
    // Calcular promedio mensual (desde el primer pago)
    const fechaPrimerPago = pagoInicial?.fecha || cliente.fechaInicio;
    const mesesActivo = Math.max(1, Math.ceil(
      (new Date().getTime() - new Date(fechaPrimerPago).getTime()) / (1000 * 60 * 60 * 24 * 30)
    ));
    
    // Agrupar pagos por mes para gráfico
    const pagosPorMes: Record<string, number> = {};
    pagosCliente.forEach(pago => {
      const mes = pago.fecha.substring(0, 7); // YYYY-MM
      pagosPorMes[mes] = (pagosPorMes[mes] || 0) + pago.monto;
    });

    return {
      ingresosTotales,
      totalPagos: pagosCliente.length,
      totalRenovaciones: renovaciones.length,
      promedioMensual: ingresosTotales / mesesActivo,
      ultimoPago: pagosCliente[0]?.fecha || null,
      fechaRegistro: cliente.createdAt,
      mesesActivo,
      pagosPorMes,
      renovacionesPorMes: renovaciones.reduce((acc: Record<string, number>, pago) => {
        const mes = pago.fecha.substring(0, 7);
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [clientes, obtenerPagosCliente]);

  // Todos los clientes con sus estadísticas calculadas (sin límite)
  const clientesConEstadisticas = useMemo(() => {
    return clientes.map(cliente => {
      const stats = calcularEstadisticasCliente(cliente.id);
      return {
        cliente,
        ingresosTotales: stats?.ingresosTotales || 0,
        totalRenovaciones: stats?.totalRenovaciones || 0,
      };
    });
  }, [clientes, calcularEstadisticasCliente]);

  // Top clientes por ingresos
  const topClientesPorIngresos = useMemo(() => {
    return clientes
      .map(cliente => {
        const stats = calcularEstadisticasCliente(cliente.id);
        return {
          cliente,
          ingresosTotales: stats?.ingresosTotales || 0,
          totalRenovaciones: stats?.totalRenovaciones || 0,
        };
      })
      .sort((a, b) => b.ingresosTotales - a.ingresosTotales)
      .slice(0, 10);
  }, [clientes, calcularEstadisticasCliente]);

  // Top clientes por renovaciones
  const topClientesPorRenovaciones = useMemo(() => {
    return clientes
      .map(cliente => ({
        cliente,
        totalRenovaciones: cliente.totalRenovaciones,
        ingresosTotales: calcularEstadisticasCliente(cliente.id)?.ingresosTotales || 0,
      }))
      .sort((a, b) => b.totalRenovaciones - a.totalRenovaciones)
      .slice(0, 10);
  }, [clientes, calcularEstadisticasCliente]);

  // Obtener notas de un cliente específico, ordenadas por fecha desc
  const obtenerNotasCliente = useCallback((clienteId: string) => {
    return notas
      .filter((n) => n.clienteId === clienteId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [notas]);

  // Agregar nota a un cliente
  const agregarNota = async (clienteId: string, contenido: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }
    try {
      const { error } = await supabase
        .from("notas_cliente")
        .insert({
          user_id: user.id,
          cliente_id: clienteId,
          contenido: contenido.trim(),
        });
      if (error) throw error;
      await cargarDatos();
      toast.success("Nota guardada");
    } catch (error) {
      console.error("Error guardando nota:", error);
      toast.error("Error al guardar la nota");
    }
  };

  // Eliminar nota
  const eliminarNota = async (notaId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }
    try {
      const { error } = await supabase
        .from("notas_cliente")
        .delete()
        .eq("id", notaId);
      if (error) throw error;
      await cargarDatos();
      toast.success("Nota eliminada");
    } catch (error) {
      console.error("Error eliminando nota:", error);
      toast.error("Error al eliminar la nota");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DATOS PARA EL CALENDARIO
  // Se derivan de clientes/pagos ya cargados → cero queries adicionales.
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Mapa indexado por "yyyy-MM-dd" → lista de clientes cuya fecha de
   * vencimiento coincide con ese día.
   * Se excluyen cancelados (no relevante) y vitalicios (sin fecha).
   */
  const vencimientosPorFecha = useMemo(() => {
    const map = new Map<string, Cliente[]>();
    clientes.forEach((c) => {
      // Solo incluir clientes con fecha de vencimiento y no cancelados
      if (!c.fechaVencimiento || c.estado === "cancelada") return;
      const key = c.fechaVencimiento.substring(0, 10); // "yyyy-MM-dd"
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return map;
  }, [clientes]);

  /**
   * Mapa indexado por "yyyy-MM-dd" → lista de pagos registrados ese día.
   * Permite mostrar ingresos cobrados en el calendario.
   */
  const pagosPorFecha = useMemo(() => {
    const map = new Map<string, Pago[]>();
    pagos.forEach((p) => {
      const key = p.fecha.substring(0, 10); // "yyyy-MM-dd"
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [pagos]);

  // ─── Métricas avanzadas del Dashboard (estilo Stripe) ────────────────────

  /**
   * Factor de normalización mensual por tipo de suscripción.
   * Convierte cualquier ciclo de cobro a su equivalente mensual.
   * Vitalicio = 0 porque es un pago único (no recurrente).
   */
  const MRR_FACTOR: Record<TipoSuscripcion, number> = {
    mensual:    1,
    trimestral: 1 / 3,
    semestral:  1 / 6,
    anual:      1 / 12,
    vitalicio:  0,
  };

  /**
   * MRR — Monthly Recurring Revenue.
   * Suma de todos los valores de suscripciones activas normalizados a
   * mensual. Incluye la variación porcentual respecto al mes anterior.
   */
  const metricasMRR = useMemo((): MetricasMRR => {
    const inicioMesActual = startOfMonth(new Date()).toISOString();

    // MRR actual: todas las suscripciones activas
    const mrr = clientes
      .filter((c) => c.estado === "activa")
      .reduce((sum, c) => sum + c.valorCobrado * MRR_FACTOR[c.tipoSuscripcion], 0);

    // MRR aproximado del mes anterior: solo las activas
    // que ya existían antes del inicio del mes actual
    const mrrMesAnterior = clientes
      .filter((c) => c.estado === "activa" && c.createdAt < inicioMesActual)
      .reduce((sum, c) => sum + c.valorCobrado * MRR_FACTOR[c.tipoSuscripcion], 0);

    // Variación porcentual MoM
    const tendenciaMRR =
      mrrMesAnterior > 0
        ? Math.round(((mrr - mrrMesAnterior) / mrrMesAnterior) * 100)
        : mrr > 0
        ? 100
        : 0;

    return { mrr, mrrMesAnterior, tendenciaMRR };
  }, [clientes]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Métricas de crecimiento: altas y bajas del mes.
   * Nuevos clientes, cancelados y tasa de churn mensual.
   */
  const metricasCrecimiento = useMemo((): MetricasCrecimiento => {
    const hoy = new Date();
    const inicioMesActual  = startOfMonth(hoy).toISOString();
    const inicioMesPasado  = startOfMonth(subMonths(hoy, 1)).toISOString();

    // Nuevos registrados en el mes en curso
    const nuevosEsteMes = clientes.filter(
      (c) => c.createdAt >= inicioMesActual
    ).length;

    // Nuevos registrados el mes pasado (para calcular tendencia)
    const nuevosMesAnterior = clientes.filter(
      (c) => c.createdAt >= inicioMesPasado && c.createdAt < inicioMesActual
    ).length;

    // Cancelados cuyo updatedAt cae en el mes actual
    const canceladosEsteMes = clientes.filter(
      (c) => c.estado === "cancelada" && c.updatedAt >= inicioMesActual
    ).length;

    // Base para el churn: activas que ya existían antes del mes actual
    const activasInicioMes = clientes.filter(
      (c) => c.estado === "activa" && c.createdAt < inicioMesActual
    ).length;

    // Tasa de churn con un decimal de precisión
    const tasaChurn =
      activasInicioMes > 0
        ? Math.round((canceladosEsteMes / activasInicioMes) * 100 * 10) / 10
        : 0;

    // Tendencia de nuevos clientes respecto al mes anterior
    const tendenciaNuevos =
      nuevosMesAnterior > 0
        ? Math.round(((nuevosEsteMes - nuevosMesAnterior) / nuevosMesAnterior) * 100)
        : nuevosEsteMes > 0
        ? 100
        : 0;

    return {
      nuevosEsteMes,
      nuevosMesAnterior,
      canceladosEsteMes,
      tasaChurn,
      tendenciaNuevos,
    };
  }, [clientes]);

  /**
   * Desglose de pagos del mes actual agrupados por método de pago.
   * Muestra el aporte de cada plataforma en monto y cantidad.
   */
  const distribucionMedioPago = useMemo((): DistribucionMedioPago[] => {
    const mesActual = format(new Date(), "yyyy-MM");
    const pagosMes  = pagos.filter((p) => p.fecha.startsWith(mesActual));
    const totalMes  = pagosMes.reduce((sum, p) => sum + p.monto, 0) || 1;

    // Configuración visual fija por método
    const CONFIG: Record<MedioPago, { label: string; color: string }> = {
      stripe:  { label: "Stripe",  color: "#8b5cf6" },
      binance: { label: "Binance", color: "#f59e0b" },
      paypal:  { label: "PayPal",  color: "#3b82f6" },
      hotmart: { label: "Hotmart", color: "#ec4899" },
    };

    // Acumular monto y cantidad por método
    const acumulado: Record<string, { monto: number; cantidad: number }> = {};
    pagosMes.forEach((p) => {
      if (!acumulado[p.medioPago]) acumulado[p.medioPago] = { monto: 0, cantidad: 0 };
      acumulado[p.medioPago].monto    += p.monto;
      acumulado[p.medioPago].cantidad += 1;
    });

    // Generar array con todos los métodos (incluye los que no tienen pagos)
    return (Object.keys(CONFIG) as MedioPago[]).map((metodo) => ({
      medioPago:  metodo,
      label:      CONFIG[metodo].label,
      color:      CONFIG[metodo].color,
      monto:      acumulado[metodo]?.monto    || 0,
      cantidad:   acumulado[metodo]?.cantidad || 0,
      porcentaje: Math.round(((acumulado[metodo]?.monto || 0) / totalMes) * 100),
    }));
  }, [pagos]);

  return {
    clientes,
    pagos,
    notas,
    loading,
    estadisticas,
    proximasVencer,
    datosGraficoMensual,
    datosDistribucion,
    combinacionesExistentes,
    vencimientosPorFecha,
    pagosPorFecha,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    renovarSuscripcion,
    cambiarEstado,
    cancelarSuscripcion,
    reactivarCliente,
    obtenerPagosCliente,
    obtenerNotasCliente,
    agregarNota,
    eliminarNota,
    calcularEstadisticasCliente,
    topClientesPorIngresos,
    topClientesPorRenovaciones,
    clientesConEstadisticas,
    metricasMRR,
    metricasCrecimiento,
    distribucionMedioPago,
  };
}
