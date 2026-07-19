import { faker } from "@faker-js/faker";
import type { Cliente } from "@/types";

/**
 * Generador de datos mock realistas para el Dashboard demo
 */

const PRODUCTOS = [
  "Membresía Premium",
  "Curso Avanzado",
  "Asesoría 1 a 1",
  "Comunidad Privada",
  "Masterclass Online",
  "Programa Anual",
  "Coaching Grupal"
];

const TIPOS_SUSCRIPCION = ["mensual", "trimestral", "anual", "vitalicio"] as const;
const MEDIOS_PAGO = ["stripe", "paypal", "hotmart", "binance", "transferencia", "efectivo"] as const;
const ESTADOS = ["activa", "vencida", "pendiente", "cancelada"] as const;

/**
 * Genera clientes ficticios con datos realistas
 */
export function generateMockClientes(cantidad: number = 30): Cliente[] {
  // Configurar faker en español
  faker.locale = "es";
  
  const clientes: Cliente[] = [];
  const hoy = new Date();
  
  for (let i = 0; i < cantidad; i++) {
    const tipoSuscripcion = faker.helpers.arrayElement(TIPOS_SUSCRIPCION);
    const medioPago = faker.helpers.arrayElement(MEDIOS_PAGO);
    const producto = faker.helpers.arrayElement(PRODUCTOS);
    
    // Determinar estado basado en probabilidades realistas
    let estado: typeof ESTADOS[number];
    const rand = Math.random();
    if (rand < 0.70) estado = "activa";       // 70% activas
    else if (rand < 0.85) estado = "vencida"; // 15% vencidas
    else if (rand < 0.95) estado = "pendiente"; // 10% pendientes
    else estado = "cancelada";                  // 5% canceladas
    
    // Generar fechas lógicas
    const fechaInicio = faker.date.past({ years: 2 });
    let mesesDuracion = 1;
    if (tipoSuscripcion === "trimestral") mesesDuracion = 3;
    else if (tipoSuscripcion === "anual") mesesDuracion = 12;
    else if (tipoSuscripcion === "vitalicio") mesesDuracion = 1200; // Sin vencimiento
    
    const fechaVencimiento = new Date(fechaInicio);
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + mesesDuracion);
    
    // Si está activa, ajustar fecha de vencimiento al futuro
    if (estado === "activa") {
      const diasAleatorios = faker.number.int({ min: 5, max: 60 });
      fechaVencimiento.setTime(hoy.getTime() + diasAleatorios * 24 * 60 * 60 * 1000);
    }
    
    // Valor cobrado según tipo de suscripción
    let valorCobrado: number;
    if (tipoSuscripcion === "mensual") valorCobrado = faker.number.int({ min: 47, max: 197 });
    else if (tipoSuscripcion === "trimestral") valorCobrado = faker.number.int({ min: 127, max: 497 });
    else if (tipoSuscripcion === "anual") valorCobrado = faker.number.int({ min: 497, max: 1997 });
    else valorCobrado = faker.number.int({ min: 997, max: 4997 }); // vitalicio
    
    const cliente: Cliente = {
      id: `demo-${i + 1}`,
      nombre: faker.person.fullName(),
      correo: faker.internet.email().toLowerCase(),
      whatsapp: faker.helpers.maybe(() => `+34 ${faker.phone.number("### ### ###")}`, { probability: 0.7 }),
      producto,
      tipoSuscripcion,
      valorCobrado,
      fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
      estado,
      medioPago,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      notasInternas: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      userId: "demo-user",
      createdAt: fechaInicio.toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    clientes.push(cliente);
  }
  
  return clientes;
}

/**
 * Genera pagos históricos basados en los clientes
 */
export function generateMockPagos(clientes: Cliente[]) {
  const pagos: any[] = [];
  
  clientes.forEach(cliente => {
    // Solo generar pagos para clientes que NO están cancelados sin historial
    if (cliente.estado === "cancelada" && Math.random() < 0.5) return;
    
    // Determinar número de pagos según antigüedad
    const fechaInicio = new Date(cliente.fechaInicio);
    const mesesTranscurridos = Math.floor(
      (new Date().getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    let numPagos = 1;
    if (cliente.tipoSuscripcion === "mensual") {
      numPagos = Math.min(mesesTranscurridos, faker.number.int({ min: 1, max: 12 }));
    } else if (cliente.tipoSuscripcion === "trimestral") {
      numPagos = Math.min(Math.floor(mesesTranscurridos / 3), faker.number.int({ min: 1, max: 4 }));
    } else if (cliente.tipoSuscripcion === "anual") {
      numPagos = Math.min(Math.floor(mesesTranscurridos / 12), faker.number.int({ min: 1, max: 3 }));
    }
    
    // Generar pagos
    for (let i = 0; i < numPagos; i++) {
      const fechaPago = new Date(fechaInicio);
      fechaPago.setMonth(fechaPago.getMonth() + i);
      
      pagos.push({
        id: `pago-${cliente.id}-${i}`,
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        monto: cliente.valorCobrado,
        fecha: fechaPago.toISOString().split('T')[0],
        concepto: `Renovación ${cliente.tipoSuscripcion} - ${cliente.producto}`,
        medioPago: cliente.medioPago,
        producto: cliente.producto,
        estado: "completado"
      });
    }
  });
  
  return pagos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

/**
 * Genera transacciones financieras (gastos operativos)
 */
export function generateMockTransaccionesFinanzas(cantidad: number = 50) {
  const categorias = [
    { id: "hosting", nombre: "Hosting & Servidores", tipo: "gasto" },
    { id: "marketing", nombre: "Marketing Digital", tipo: "gasto" },
    { id: "software", nombre: "Software & Herramientas", tipo: "gasto" },
    { id: "personal", nombre: "Retiro Personal", tipo: "gasto" },
    { id: "otros-ingresos", nombre: "Otros Ingresos", tipo: "ingreso" }
  ];
  
  const transacciones: any[] = [];
  
  for (let i = 0; i < cantidad; i++) {
    const categoria = faker.helpers.arrayElement(categorias);
    const tipo = categoria.tipo as "ingreso" | "gasto";
    
    const monto = tipo === "gasto" 
      ? faker.number.int({ min: 15, max: 500 })
      : faker.number.int({ min: 100, max: 2000 });
    
    transacciones.push({
      id: `txn-${i + 1}`,
      tipo,
      concepto: tipo === "gasto" 
        ? faker.helpers.arrayElement([
            "Servidor VPS",
            "Google Ads",
            "Zoom Premium",
            "Retiro mensual",
            "Facebook Ads",
            "Dominio anual",
            "Software licencia"
          ])
        : "Ingreso adicional",
      descripcion: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.4 }),
      monto,
      moneda: "USD",
      montoUsd: monto,
      fecha: faker.date.past({ years: 1 }).toISOString().split('T')[0],
      categoriaId: categoria.id,
      categoriaNombre: categoria.nombre,
      cuentaId: "demo-cuenta",
      userId: "demo-user",
      createdAt: new Date().toISOString()
    });
  }
  
  return transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}
