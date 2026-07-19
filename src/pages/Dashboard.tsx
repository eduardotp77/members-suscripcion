import { PageLayout } from "@/components/layout/PageLayout";
import { RevenueChartInteractive } from "@/components/dashboard/RevenueChartInteractive";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { AlertasVencimiento } from "@/components/dashboard/AlertasVencimiento";
import { MesResumen } from "@/components/dashboard/MesResumen";
import { SemanaWidget } from "@/components/dashboard/SemanaWidget";
import { ResumenWidget } from "@/components/dashboard/ResumenWidget";
import { KPIStripRow } from "@/components/dashboard/KPIStripRow";
import { PaymentBreakdown } from "@/components/dashboard/PaymentBreakdown";
import { TopClientesWidget } from "@/components/dashboard/TopClientesWidget";
import { TextReveal } from "@/components/ui/TextReveal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useClientes } from "@/hooks/useClientes";
import { formatearMoneda } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Página principal del Dashboard
 * Layout de 3 columnas inspirado en diseño moderno de productividad
 */
export default function Dashboard() {
  const {
    loading,
    estadisticas,
    proximasVencer,
    datosGraficoMensual,
    datosDistribucion,
    metricasMRR,
    metricasCrecimiento,
    distribucionMedioPago,
    topClientesPorIngresos,
  } = useClientes();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  const porcentajeActivas =
    estadisticas.totalSuscripciones > 0
      ? Math.round(
          (estadisticas.suscripcionesActivas / estadisticas.totalSuscripciones) * 100
        )
      : 0;

  const ticketPromedio =
    estadisticas.totalSuscripciones > 0
      ? estadisticas.totalIngresos / estadisticas.totalSuscripciones
      : 0;

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <TextReveal delay={0.1}>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-1 text-white/60">
              Visión general de tus suscripciones y estadísticas
            </p>
          </TextReveal>
        </div>

        {/* Fila 1: Resumen del mes — full width */}
        <ScrollReveal>
          <MesResumen
            porcentajeActivas={porcentajeActivas}
            suscripcionesActivas={estadisticas.suscripcionesActivas}
            ingresosMesActual={estadisticas.ingresosMesActual}
            proximasVencer={estadisticas.proximasVencer}
            formatearMoneda={formatearMoneda}
          />
        </ScrollReveal>

        {/* Fila 2: KPIs estilo Stripe — full width */}
        <ScrollReveal>
          <KPIStripRow
            volumenBruto={estadisticas.ingresosMesActual}
            volumenBrutoAnterior={estadisticas.ingresosMesAnterior}
            metricasMRR={metricasMRR}
            suscripcionesActivas={estadisticas.suscripcionesActivas}
            activasMesAnterior={estadisticas.activasMesAnterior}
            metricasCrecimiento={metricasCrecimiento}
            formatearMoneda={formatearMoneda}
          />
        </ScrollReveal>

        {/* Fila 3: Contenido principal (2/3) + columna derecha (1/3) */}
        <ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Columna izquierda + central: mini paneles + distribución */}
            <div className="space-y-6 lg:col-span-2">
            {/* Mini paneles duales (estilo hábitos/tareas) */}
            <SemanaWidget
              suscripcionesActivas={estadisticas.suscripcionesActivas}
              totalSuscripciones={estadisticas.totalSuscripciones}
              ingresosMesActual={estadisticas.ingresosMesActual}
              datosGrafico={datosGraficoMensual}
              formatearMoneda={formatearMoneda}
            />

            {/* Distribución por tipo */}
            <DistributionChart
              datos={datosDistribucion}
              titulo="Distribución por Tipo"
            />
          </div>

          {/* Columna derecha: widgets apilados */}
          <div className="space-y-6">
            <AlertasVencimiento clientes={proximasVencer} maxItems={4} />
            <ResumenWidget
              totalClientes={estadisticas.totalSuscripciones}
              porcentajeActivas={porcentajeActivas}
              ticketPromedio={ticketPromedio}
              datosGrafico={datosGraficoMensual}
            />
          </div>
        </div>
        </ScrollReveal>

        {/* Fila 4: Métodos de pago + Top clientes — 2 columnas */}
        <ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Desglose por plataforma de cobro */}
            <PaymentBreakdown distribucion={distribucionMedioPago} />

            {/* Ranking de clientes por LTV */}
            <TopClientesWidget topClientes={topClientesPorIngresos.slice(0, 5)} />
          </div>
        </ScrollReveal>

        {/* Fila 5: Gráfico de ingresos históricos — full width */}
        <ScrollReveal>
          <RevenueChartInteractive
            datos={datosGraficoMensual}
            titulo="Ingresos Históricos"
            valorTotal={estadisticas.totalIngresos}
          />
        </ScrollReveal>
      </div>
    </PageLayout>
  );
}
