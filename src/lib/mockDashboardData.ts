import { useMemo } from "react";
import type {
  Cliente,
  MetricasMRR,
  MetricasCrecimiento,
  DistribucionMedioPago,
  DatosGraficoMensual,
} from "@/types";
import {
  generateMockClientes,
  generateMockPagos,
} from "./generateMockData";
import { formatearMoneda, diasHastaVencimiento } from "./utils";
import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Hook mock para el Dashboard interactivo en la landing page
 * Simula el comportamiento de useClientes pero con datos ficticios
 */
export function useMockDashboard() {
  // Generar datos mock (se generan una sola vez)
  const clientes = useMemo(() => generateMockClientes(35), []);
  const pagos = useMemo(() => generateMockPagos(clientes), [clientes]);

  // Estadísticas básicas
  const estadisticas = useMemo(() => {
    const activas = clientes.filter((c) => c.estado === "activa").length;
    const vencidas = clientes.filter((c) => c.estado === "vencida").length;
    const pendientes = clientes.filter((c) => c.estado === "pendiente").length;
    const canceladas = clientes.filter((c) => c.estado === "cancelada").length;
    const vitalicios = clientes.filter((c) => c.tipoSuscripcion === "vitalicio").length;

    // Ingresos totales históricos
    const ingresosTotales = pagos.reduce((sum, p) => sum + p.monto, 0);

    // Ingresos del mes actual
    const mesActual = format(new Date(), "yyyy-MM");
    const ingresosMesActual = pagos
      .filter((p) => p.fecha.startsWith(mesActual))
      .reduce((sum, p) => sum + p.monto, 0);

    console.log("Mock Dashboard - Estadísticas:", {
      totalClientes: clientes.length,
      activas,
      vencidas,
      pendientes,
      canceladas,
      vitalicios,
      ingresosTotales,
      ingresosMesActual,
    });

    return {
      totalClientes: clientes.length,
      activas,
      vencidas,
      pendientes,
      canceladas,
      vitalicios,
      ingresosTotales,
      ingresosMesActual,
    };
  }, [clientes, pagos]);

  // Próximas a vencer (7, 15, 30 días)
  const proximasVencer = useMemo(() => {
    const result = {
      proximos7: [] as Cliente[],
      proximos15: [] as Cliente[],
      proximos30: [] as Cliente[],
    };

    clientes
      .filter((c) => c.estado === "activa")
      .forEach((cliente) => {
        const dias = diasHastaVencimiento(cliente.fechaVencimiento);
        if (dias !== null && dias >= 0 && dias <= 30) {
          if (dias <= 7) result.proximos7.push(cliente);
          else if (dias <= 15) result.proximos15.push(cliente);
          else result.proximos30.push(cliente);
        }
      });

    return result;
  }, [clientes]);

  // Datos para el gráfico mensual (últimos 12 meses)
  const datosGraficoMensual = useMemo((): DatosGraficoMensual[] => {
    const meses: DatosGraficoMensual[] = [];
    const hoy = new Date();

    for (let i = 11; i >= 0; i--) {
      const fecha = subMonths(hoy, i);
      const mesKey = format(fecha, "yyyy-MM");
      const mesLabel = format(fecha, "MMM", { locale: es });

      const ingresosMes = pagos
        .filter((p) => p.fecha.startsWith(mesKey))
        .reduce((sum, p) => sum + p.monto, 0);

      const clientesActivosMes = clientes.filter((c) => {
        const inicio = new Date(c.fechaInicio);
        const vencimiento = new Date(c.fechaVencimiento);
        return inicio <= fecha && vencimiento >= fecha;
      }).length;

      meses.push({
        mes: mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1),
        ingresos: ingresosMes,
        clientes: clientesActivosMes,
        nuevos: 0, // Simplificado
        churn: 0, // Simplificado
      });
    }

    return meses;
  }, [pagos, clientes]);

  // Métricas MRR (Monthly Recurring Revenue)
  const metricasMRR = useMemo((): MetricasMRR => {
    // MRR del mes actual
    const clientesActivos = clientes.filter((c) => c.estado === "activa");
    
    const mrrActual = clientesActivos.reduce((sum, c) => {
      let mrrCliente = 0;
      if (c.tipoSuscripcion === "mensual") mrrCliente = c.valorCobrado;
      else if (c.tipoSuscripcion === "trimestral") mrrCliente = c.valorCobrado / 3;
      else if (c.tipoSuscripcion === "anual") mrrCliente = c.valorCobrado / 12;
      return sum + mrrCliente;
    }, 0);

    // Simular MRR del mes anterior (90-110% del actual)
    const variacion = 0.9 + Math.random() * 0.2;
    const mrrMesAnterior = mrrActual * variacion;

    const tendenciaMRR = mrrMesAnterior > 0
      ? Math.round(((mrrActual - mrrMesAnterior) / mrrMesAnterior) * 100)
      : 0;

    return {
      mrr: mrrActual,
      mrrMesAnterior,
      tendenciaMRR,
    };
  }, [clientes]);

  // Métricas de crecimiento
  const metricasCrecimiento = useMemo((): MetricasCrecimiento => {
    const mesActual = format(new Date(), "yyyy-MM");
    const mesAnterior = format(subMonths(new Date(), 1), "yyyy-MM");

    const nuevosEsteMes = clientes.filter((c) =>
      c.fechaInicio.startsWith(mesActual)
    ).length;

    const nuevosMesAnterior = clientes.filter((c) =>
      c.fechaInicio.startsWith(mesAnterior)
    ).length;

    // Clientes cancelados este mes
    const canceladosEsteMes = clientes.filter(
      (c) => c.estado === "cancelada" && c.updatedAt?.startsWith(mesActual)
    ).length;

    // Clientes activos al inicio del mes
    const activosInicioMes = clientes.filter((c) => {
      const inicio = new Date(c.fechaInicio);
      const inicioMes = new Date(mesActual + "-01");
      return inicio < inicioMes && c.estado === "activa";
    }).length;

    const churnRate = activosInicioMes > 0
      ? (canceladosEsteMes / activosInicioMes) * 100
      : 0;

    const tendenciaNuevos = nuevosMesAnterior > 0
      ? Math.round(((nuevosEsteMes - nuevosMesAnterior) / nuevosMesAnterior) * 100)
      : nuevosEsteMes > 0
      ? 100
      : 0;

    return {
      nuevosEsteMes,
      nuevosMesAnterior,
      canceladosEsteMes,
      tasaChurn: Math.round(churnRate * 10) / 10,
      tendenciaNuevos,
    };
  }, [clientes]);

  // Distribución por medio de pago
  const distribucionMedioPago = useMemo((): DistribucionMedioPago[] => {
    const mesActual = format(new Date(), "yyyy-MM");
    const pagosMesActual = pagos.filter((p) => p.fecha.startsWith(mesActual));
    
    const totalMes = pagosMesActual.reduce((sum, p) => sum + p.monto, 0);

    const coloresMedios: Record<string, string> = {
      stripe: "#635bff",
      paypal: "#0070ba",
      hotmart: "#ff6b00",
      binance: "#f3ba2f",
      transferencia: "#10b981",
      efectivo: "#8b5cf6",
    };

    const acumulado: Record<string, { monto: number; cantidad: number }> = {};

    pagosMesActual.forEach((p) => {
      const metodo = p.medioPago;
      if (!acumulado[metodo]) {
        acumulado[metodo] = { monto: 0, cantidad: 0 };
      }
      acumulado[metodo].monto += p.monto;
      acumulado[metodo].cantidad += 1;
    });

    const mediosOrdenados = [
      "stripe",
      "paypal",
      "hotmart",
      "binance",
      "transferencia",
      "efectivo",
    ];

    return mediosOrdenados.map((metodo) => ({
      metodo,
      color: coloresMedios[metodo],
      monto: acumulado[metodo]?.monto || 0,
      cantidad: acumulado[metodo]?.cantidad || 0,
      porcentaje: totalMes > 0
        ? Math.round(((acumulado[metodo]?.monto || 0) / totalMes) * 100)
        : 0,
    }));
  }, [pagos]);

  // Top 5 clientes por ingresos totales (LTV)
  const topClientesPorLTV = useMemo(() => {
    return clientes
      .map((cliente) => {
        const pagosCliente = pagos.filter((p) => p.clienteId === cliente.id);
        const ltv = pagosCliente.reduce((sum, p) => sum + p.monto, 0);
        return {
          cliente,
          ingresosTotales: ltv,
        };
      })
      .sort((a, b) => b.ingresosTotales - a.ingresosTotales)
      .slice(0, 5);
  }, [clientes, pagos]);

  // Tasa de retención del mes
  const tasaRetencion = useMemo(() => {
    const mesActual = format(new Date(), "yyyy-MM");
    const activasInicioMes = clientes.filter((c) => {
      const inicio = new Date(c.fechaInicio);
      const inicioMes = new Date(mesActual + "-01");
      return inicio < inicioMes && (c.estado === "activa" || c.estado === "vencida");
    }).length;

    const activasAhora = clientes.filter((c) => c.estado === "activa").length;

    return activasInicioMes > 0
      ? Math.round((activasAhora / activasInicioMes) * 100)
      : 100;
  }, [clientes]);

  // Función auxiliar para formatear moneda
  const formatearMonedaMock = (valor: number) => formatearMoneda(valor);

  return {
    // Datos principales
    clientes,
    pagos,
    loading: false,

    // Estadísticas
    suscripcionesActivas: estadisticas.activas,
    totalSuscripciones: estadisticas.totalClientes,
    ingresosMesActual: estadisticas.ingresosMesActual,
    ingresosTotales: estadisticas.ingresosTotales,
    tasaRetencion,

    // Métricas
    metricasMRR,
    metricasCrecimiento,

    // Dashboard específico
    volumenBruto: estadisticas.ingresosMesActual,
    volumenBrutoAnterior: estadisticas.ingresosMesActual * 0.92, // Mock
    activasMesAnterior: Math.round(estadisticas.activas * 0.95), // Mock
    
    // Gráficos y distribución
    datosGrafico: datosGraficoMensual,
    distribucionMedioPago,
    
    // Top clientes
    topClientesPorLTV,
    
    // Alertas
    clientesProximosVencer: [
      ...proximasVencer.proximos7,
      ...proximasVencer.proximos15.slice(0, 3),
    ].slice(0, 5),

    // Utilidades
    formatearMoneda: formatearMonedaMock,
  };
}
