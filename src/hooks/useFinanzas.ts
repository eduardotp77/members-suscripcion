import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { logError, logWarning } from '@/lib/logger';
import {
  parseFechaLocal,
  estaEnRango,
  esMismoDia,
  obtenerPrimerDiaMesActual,
  obtenerRangoMes,
  obtenerRangoMesAnterior,
  obtenerDiasDelMes,
  obtenerMesYAñoActual,
  formatearFechaDia
} from '@/lib/dateUtils';
import type {
  Cuenta,
  CategoriaFinanza,
  Transaccion,
  TasaCambio,
  EstadisticasFinanzas,
  DistribucionGastos,
  TransaccionFormData,
  TransferenciaFormData,
  CuentaFormData,
  CategoriaFormData,
  Moneda,
  TipoTransaccion,
  MonedaInfo,
  TasasCambioActuales,
  DatosHistoricoMensual,
  DatosDiariosMes
} from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

const MONEDAS_INFO: Record<Moneda, MonedaInfo> = {
  USD: { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$', pais: 'Estados Unidos' },
  BRL: { codigo: 'BRL', nombre: 'Real Brasileño', simbolo: 'R$', pais: 'Brasil' },
  COP: { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$', pais: 'Colombia' },
  MXN: { codigo: 'MXN', nombre: 'Peso Mexicano', simbolo: '$', pais: 'México' },
  ARS: { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$', pais: 'Argentina' },
  CLP: { codigo: 'CLP', nombre: 'Peso Chileno', simbolo: '$', pais: 'Chile' },
  PEN: { codigo: 'PEN', nombre: 'Sol Peruano', simbolo: 'S/', pais: 'Perú' },
  EUR: { codigo: 'EUR', nombre: 'Euro', simbolo: '€', pais: 'Europa' },
};

// API key para ExchangeRate-API (debe estar en .env)
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

// Validar que la API key esté configurada
if (!EXCHANGE_RATE_API_KEY) {
  throw new Error(
    '❌ VITE_EXCHANGE_RATE_API_KEY no configurada en .env\n' +
    'Obtén tu API key gratis en: https://www.exchangerate-api.com/'
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function useFinanzas() {
  const { user } = useAuth();
  const { toast } = useToast();

  // ─── Estados ────────────────────────────────────────────────────────────
  const [cargando, setCargando] = useState(true);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [cuentasArchivadas, setCuentasArchivadas] = useState<Cuenta[]>([]);
  const [categorias, setCategorias] = useState<CategoriaFinanza[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [tasasCambio, setTasasCambio] = useState<TasasCambioActuales | null>(null);

  // ═══════════════════════════════════════════════════════════════════════
  // CARGAR DATOS INICIALES
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user?.id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      // Cargar en paralelo
      await Promise.all([
        cargarCuentas(),
        cargarCuentasArchivadas(),
        cargarCategorias(),
        cargarTransacciones(),
        cargarTasasCambio(),
      ]);
    } catch (error) {
      logError('Error cargando datos de finanzas', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los datos financieros',
      });
    } finally {
      setCargando(false);
    }
  };

  // ─── Cargar Cuentas ─────────────────────────────────────────────────────

  const cargarCuentas = async () => {
    const { data, error } = await supabase
      .from('cuentas')
      .select('*')
      .eq('user_id', user!.id)
      .eq('activa', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setCuentas((data || []).map(mapearCuenta));
  };

  const cargarCuentasArchivadas = async () => {
    const { data, error } = await supabase
      .from('cuentas')
      .select('*')
      .eq('user_id', user!.id)
      .eq('activa', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    setCuentasArchivadas((data || []).map(mapearCuenta));
  };

  // ─── Cargar Categorías ──────────────────────────────────────────────────

  const cargarCategorias = async () => {
    // Primero verificar si el usuario ya tiene categorías
    const { data: existentes, error: errorCheck } = await supabase
      .from('categorias_finanzas')
      .select('id')
      .eq('user_id', user!.id)
      .limit(1);

    if (errorCheck) throw errorCheck;

    // Si no tiene categorías, crear las predeterminadas
    if (!existentes || existentes.length === 0) {
      await crearCategoriasPredeterminadas();
    }

    // Cargar todas las categorías
    const { data, error } = await supabase
      .from('categorias_finanzas')
      .select('*')
      .eq('user_id', user!.id)
      .eq('activa', true)
      .order('tipo', { ascending: true })
      .order('nombre', { ascending: true });

    if (error) throw error;
    
    setCategorias((data || []).map(mapearCategoria));
  };

  // ─── Cargar Transacciones ───────────────────────────────────────────────

  const cargarTransacciones = async () => {
    const { data, error } = await supabase
      .from('transacciones')
      .select(`
        *,
        cuenta:cuentas(id, nombre, tipo, moneda),
        categoria:categorias_finanzas(id, nombre, tipo, icono, color)
      `)
      .eq('user_id', user!.id)
      .order('fecha', { ascending: false })
      .limit(1000);

    if (error) throw error;
    
    setTransacciones((data || []).map(mapearTransaccion));
  };

  // ─── Cargar Tasas de Cambio ─────────────────────────────────────────────

  const cargarTasasCambio = async () => {
    // Primero intentar cargar desde la base de datos (cache)
    const hoy = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('tasas_cambio')
      .select('*')
      .eq('fecha', hoy)
      .eq('moneda_origen', 'USD');

    if (!error && data && data.length > 0) {
      // Construir objeto de tasas con todas las monedas
      const tasas: Record<Moneda, number> = {
        USD: 1,
        BRL: 1,
        COP: 1,
        MXN: 1,
        ARS: 1,
        CLP: 1,
        PEN: 1,
        EUR: 1,
      };
      data.forEach((tasa) => {
        tasas[tasa.moneda_destino as Moneda] = tasa.tasa;
      });

      setTasasCambio({
        fecha: hoy,
        tasas,
        fuenteAPI: data[0].fuente,
      });
    } else {
      // No hay tasas en cache, actualizar desde API
      await actualizarTasasCambioDesdeAPI();
    }
  };

  // ─── Actualizar Tasas desde API Externa ─────────────────────────────────

  const actualizarTasasCambioDesdeAPI = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`
      );

      if (!response.ok) throw new Error('Error en API de tasas');

      const data = await response.json();

      if (data.result !== 'success') throw new Error('API retornó error');

      // Guardar en Supabase
      const hoy = new Date().toISOString().split('T')[0];
      const monedasSoportadas: Moneda[] = ['BRL', 'COP', 'MXN', 'ARS', 'CLP', 'PEN', 'EUR'];

      const tasasParaInsertar = monedasSoportadas.map(moneda => ({
        moneda_origen: 'USD',
        moneda_destino: moneda,
        tasa: data.conversion_rates[moneda],
        fecha: hoy,
        es_manual: false,
        fuente: 'exchangerate-api',
      }));

      // Insertar o actualizar (upsert)
      const { error } = await supabase
        .from('tasas_cambio')
        .upsert(tasasParaInsertar, {
          onConflict: 'moneda_origen,moneda_destino,fecha'
        });

      if (error) throw error;

      // Actualizar estado local
      const tasas: Record<Moneda, number> = {
        USD: 1,
        BRL: data.conversion_rates.BRL,
        COP: data.conversion_rates.COP,
        MXN: data.conversion_rates.MXN,
        ARS: data.conversion_rates.ARS,
        CLP: data.conversion_rates.CLP,
        PEN: data.conversion_rates.PEN,
        EUR: data.conversion_rates.EUR,
      };

      setTasasCambio({
        fecha: hoy,
        tasas,
        fuenteAPI: 'exchangerate-api',
      });

      toast({
        title: 'Tasas actualizadas',
        description: 'Se actualizaron las tasas de cambio desde la API',
      });
    } catch (error) {
      logError('Error actualizando tasas de cambio', error);
      // No mostrar error al usuario, usar tasas manuales o del último día
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // FUNCIONES DE CONVERSIÓN
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Convierte un monto de cualquier moneda a USD
   */
  const convertirAUSD = (monto: number, moneda: Moneda): { montoUsd: number; tasa: number } => {
    if (moneda === 'USD') {
      return { montoUsd: monto, tasa: 1 };
    }

    if (!tasasCambio) {
      // Si no hay tasas, asumir 1:1 (fallback)
      return { montoUsd: monto, tasa: 1 };
    }

    const tasa = tasasCambio.tasas[moneda];
    if (!tasa) {
      console.warn(`No hay tasa para ${moneda}, usando 1:1`);
      return { montoUsd: monto, tasa: 1 };
    }

    const montoUsd = monto / tasa;
    return { montoUsd, tasa };
  };

  /**
   * Formatea monto con símbolo de moneda
   */
  const formatearMonto = (monto: number, moneda: Moneda = 'USD'): string => {
    const info = MONEDAS_INFO[moneda];
    return `${info.simbolo}${monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CRUD - CUENTAS
  // ═══════════════════════════════════════════════════════════════════════

  const agregarCuenta = async (data: CuentaFormData) => {
    try {
      const { data: nuevaCuenta, error } = await supabase
        .from('cuentas')
        .insert({
          user_id: user!.id,
          nombre: data.nombre,
          tipo: data.tipo,
          moneda: data.moneda,
          saldo_inicial: data.saldoInicial,
          saldo_actual: data.saldoInicial, // Inicia igual
          color: data.color,
          icono: data.icono,
          descripcion: data.descripcion,
        })
        .select()
        .single();

      if (error) throw error;

      setCuentas([mapearCuenta(nuevaCuenta), ...cuentas]);

      toast({
        title: 'Cuenta creada',
        description: `Se creó la cuenta ${data.nombre}`,
      });

      return nuevaCuenta;
    } catch (error) {
      console.error('Error creando cuenta:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear la cuenta',
      });
      throw error;
    }
  };

  const eliminarCuenta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cuentas')
        .update({ activa: false })
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;

      const cuenta = cuentas.find(c => c.id === id);
      if (cuenta) {
        setCuentas(prev => prev.filter(c => c.id !== id));
        setCuentasArchivadas(prev => [{ ...cuenta, activa: false }, ...prev]);
      }

      toast({
        title: 'Cuenta archivada',
        description: 'La cuenta fue archivada. Puedes restaurarla en cualquier momento.',
      });
    } catch (error) {
      console.error('Error archivando cuenta:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo archivar la cuenta',
      });
      throw error;
    }
  };

  const restaurarCuenta = async (id: string) => {
    try {
      const { data: cuentaRestaurada, error } = await supabase
        .from('cuentas')
        .update({ activa: true })
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;

      setCuentasArchivadas(prev => prev.filter(c => c.id !== id));
      setCuentas(prev => [mapearCuenta(cuentaRestaurada), ...prev]);

      toast({
        title: 'Cuenta restaurada',
        description: `La cuenta ${cuentaRestaurada.nombre} fue restaurada correctamente.`,
      });
    } catch (error) {
      console.error('Error restaurando cuenta:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo restaurar la cuenta',
      });
      throw error;
    }
  };

  const editarCuenta = async (id: string, data: CuentaFormData) => {
    try {
      const { data: cuentaActualizada, error } = await supabase
        .from('cuentas')
        .update({
          nombre: data.nombre,
          tipo: data.tipo,
          moneda: data.moneda,
          saldo_actual: data.saldoInicial,
          color: data.color,
          descripcion: data.descripcion,
        })
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;

      setCuentas(prev => prev.map(c => c.id === id ? mapearCuenta(cuentaActualizada) : c));

      toast({
        title: 'Cuenta actualizada',
        description: `Se actualizó la cuenta ${data.nombre}`,
      });
    } catch (error) {
      console.error('Error editando cuenta:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar la cuenta',
      });
      throw error;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CRUD - CATEGORÍAS
  // ═══════════════════════════════════════════════════════════════════════

  const crearCategoriasPredeterminadas = async () => {
    const categoriasPredefinidas: Omit<CategoriaFinanza, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
      // GASTOS
      { nombre: 'Tecnología', tipo: 'gasto', color: '#3b82f6', icono: 'laptop', activa: true, esRetiroPersonal: false },
      { nombre: 'Marketing', tipo: 'gasto', color: '#ec4899', icono: 'megaphone', activa: true, esRetiroPersonal: false },
      { nombre: 'Herramientas', tipo: 'gasto', color: '#8b5cf6', icono: 'wrench', activa: true, esRetiroPersonal: false },
      { nombre: 'Operaciones', tipo: 'gasto', color: '#10b981', icono: 'briefcase', activa: true, esRetiroPersonal: false },
      { nombre: 'Educación', tipo: 'gasto', color: '#f59e0b', icono: 'book', activa: true, esRetiroPersonal: false },
      { nombre: 'Transporte', tipo: 'gasto', color: '#6366f1', icono: 'car', activa: true, esRetiroPersonal: false },
      { nombre: 'Otros Gastos', tipo: 'gasto', color: '#64748b', icono: 'more', activa: true, esRetiroPersonal: false },
      
      // CATEGORÍA ESPECIAL: Retiro Personal
      { nombre: 'Retiro Personal', tipo: 'gasto', color: '#ef4444', icono: 'user', activa: true, esRetiroPersonal: true, descripcion: 'Dinero que retiras del negocio para uso personal' },
      
      // INGRESOS
      { nombre: 'Clientes', tipo: 'ingreso', color: '#10b981', icono: 'users', activa: true, esRetiroPersonal: false },
      { nombre: 'Consultoría', tipo: 'ingreso', color: '#3b82f6', icono: 'briefcase', activa: true, esRetiroPersonal: false },
      { nombre: 'Otros Ingresos', tipo: 'ingreso', color: '#8b5cf6', icono: 'plus', activa: true, esRetiroPersonal: false },
    ];

    const { error } = await supabase
      .from('categorias_finanzas')
      .insert(
        categoriasPredefinidas.map(cat => ({
          user_id: user!.id,
          nombre: cat.nombre,
          tipo: cat.tipo,
          color: cat.color,
          icono: cat.icono,
          activa: cat.activa,
          es_retiro_personal: cat.esRetiroPersonal,
          descripcion: cat.descripcion,
        }))
      );

    if (error) throw error;
  };

  const agregarCategoria = async (data: CategoriaFormData) => {
    try {
      const { data: nuevaCategoria, error } = await supabase
        .from('categorias_finanzas')
        .insert({
          user_id: user!.id,
          nombre: data.nombre,
          tipo: data.tipo,
          color: data.color,
          icono: data.icono,
          presupuesto_mensual: data.presupuestoMensual,
          descripcion: data.descripcion,
          es_retiro_personal: false,
        })
        .select()
        .single();

      if (error) throw error;

      setCategorias([...categorias, mapearCategoria(nuevaCategoria)]);

      toast({
        title: 'Categoría creada',
        description: `Se creó la categoría ${data.nombre}`,
      });

      return nuevaCategoria;
    } catch (error) {
      console.error('Error creando categoría:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear la categoría',
      });
      throw error;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // CRUD - TRANSACCIONES
  // ═══════════════════════════════════════════════════════════════════════

  const agregarTransaccion = async (data: TransaccionFormData) => {
    try {
      // Convertir a USD si no es USD
      const { montoUsd, tasa } = convertirAUSD(data.monto, data.moneda);

      // Verificar si es categoría de retiro personal
      const categoria = categorias.find(c => c.id === data.categoriaId);
      const esRetiro = categoria?.esRetiroPersonal || false;

      const { data: nuevaTransaccion, error } = await supabase
        .from('transacciones')
        .insert({
          user_id: user!.id,
          tipo: data.tipo,
          monto: data.monto,
          moneda: data.moneda,
          monto_usd: montoUsd,
          tasa_cambio: tasa,
          concepto: data.concepto,
          descripcion: data.descripcion,
          fecha: data.fecha,
          cuenta_id: data.cuentaId,
          categoria_id: data.categoriaId,
          es_retiro_personal: esRetiro,
          etiquetas: data.etiquetas,
        })
        .select(`
          *,
          cuenta:cuentas(id, nombre, tipo, moneda),
          categoria:categorias_finanzas(id, nombre, tipo, icono, color)
        `)
        .single();

      if (error) throw error;

      setTransacciones([mapearTransaccion(nuevaTransaccion), ...transacciones]);

      // Recargar cuentas para actualizar saldo (el trigger lo hace automático)
      await cargarCuentas();

      toast({
        title: 'Transacción registrada',
        description: `${data.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} de ${formatearMonto(data.monto, data.moneda)}`,
      });

      return nuevaTransaccion;
    } catch (error) {
      console.error('Error creando transacción:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo registrar la transacción',
      });
      throw error;
    }
  };

  const transferirEntreCuentas = async (data: TransferenciaFormData) => {
    try {
      const cuentaOrigen = cuentas.find(c => c.id === data.cuentaOrigenId);
      const cuentaDestino = cuentas.find(c => c.id === data.cuentaDestinoId);

      if (!cuentaOrigen || !cuentaDestino) throw new Error('Cuentas no encontradas');

      const transferId = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });

      // Convertir monto origen a USD
      const { montoUsd, tasa: tasaOrigen } = convertirAUSD(data.monto, cuentaOrigen.moneda);

      // Calcular monto en moneda destino
      const tasaDestino = cuentaDestino.moneda === 'USD'
        ? 1
        : (tasasCambio?.tasas[cuentaDestino.moneda] ?? 1);
      const montoDestino = cuentaDestino.moneda === 'USD'
        ? montoUsd
        : montoUsd * tasaDestino;

      const { data: nuevasTransacciones, error } = await supabase
        .from('transacciones')
        .insert([
          // GASTO en cuenta origen
          {
            user_id: user!.id,
            tipo: 'gasto',
            monto: data.monto,
            moneda: cuentaOrigen.moneda,
            monto_usd: montoUsd,
            tasa_cambio: tasaOrigen,
            concepto: data.concepto,
            fecha: data.fecha,
            cuenta_id: data.cuentaOrigenId,
            es_retiro_personal: false,
            transfer_id: transferId,
          },
          // INGRESO en cuenta destino
          {
            user_id: user!.id,
            tipo: 'ingreso',
            monto: montoDestino,
            moneda: cuentaDestino.moneda,
            monto_usd: montoUsd,
            tasa_cambio: tasaDestino,
            concepto: data.concepto,
            fecha: data.fecha,
            cuenta_id: data.cuentaDestinoId,
            es_retiro_personal: false,
            transfer_id: transferId,
          },
        ])
        .select(`
          *,
          cuenta:cuentas(id, nombre, tipo, moneda),
          categoria:categorias_finanzas(id, nombre, tipo, icono, color)
        `);

      if (error) throw error;

      setTransacciones(prev => [
        ...(nuevasTransacciones || []).map(mapearTransaccion),
        ...prev,
      ]);

      // Recargar cuentas para actualizar saldos (el trigger lo actualiza)
      await cargarCuentas();

      toast({
        title: 'Transferencia realizada',
        description: `${formatearMonto(data.monto, cuentaOrigen.moneda)} de "${cuentaOrigen.nombre}" a "${cuentaDestino.nombre}"`,
      });
    } catch (error) {
      console.error('Error en transferencia:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo realizar la transferencia',
      });
      throw error;
    }
  };

  const eliminarTransaccion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transacciones')
        .delete()
        .eq('id', id);

      setTransacciones(transacciones.filter(t => t.id !== id));

      // Recargar cuentas para actualizar saldo
      await cargarCuentas();

      toast({
        title: 'Transacción eliminada',
        description: 'Se eliminó la transacción correctamente',
      });
    } catch (error) {
      console.error('Error eliminando transacción:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la transacción',
      });
      throw error;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ESTADÍSTICAS Y MÉTRICAS
  // ═══════════════════════════════════════════════════════════════════════

  const obtenerEstadisticas = (): EstadisticasFinanzas => {
    const hoy = new Date();
    const primerDiaMes = obtenerPrimerDiaMesActual();
    const { primerDia: primerDiaMesAnterior, ultimoDia: ultimoDiaMesAnterior } = obtenerRangoMesAnterior();

    // Filtrar transacciones del mes actual usando utilidades de fecha
    const transaccionesMes = transacciones.filter(t => 
      estaEnRango(t.fecha, primerDiaMes, hoy)
    );

    // Filtrar transacciones del mes anterior
    const transaccionesMesAnterior = transacciones.filter(t =>
      estaEnRango(t.fecha, primerDiaMesAnterior, ultimoDiaMesAnterior)
    );

    // Calcular totales
    const ingresosMes = transaccionesMes
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.montoUsd, 0);

    const gastosOperativos = transaccionesMes
      .filter(t => t.tipo === 'gasto' && !t.esRetiroPersonal)
      .reduce((sum, t) => sum + t.montoUsd, 0);

    const retirosMes = transaccionesMes
      .filter(t => t.esRetiroPersonal)
      .reduce((sum, t) => sum + t.montoUsd, 0);

    const ingresosMesAnterior = transaccionesMesAnterior
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.montoUsd, 0);

    const gastosMesAnterior = transaccionesMesAnterior
      .filter(t => t.tipo === 'gasto' && !t.esRetiroPersonal)
      .reduce((sum, t) => sum + t.montoUsd, 0);

    const retirosMesAnterior = transaccionesMesAnterior
      .filter(t => t.esRetiroPersonal)
      .reduce((sum, t) => sum + t.montoUsd, 0);

    // Métricas calculadas
    const gananciaNeta = ingresosMes - gastosOperativos - retirosMes;
    const margenNeto = ingresosMes > 0 ? (gananciaNeta / ingresosMes) * 100 : 0;
    const burnRate = gastosOperativos; // Gasto mensual sin retiros
    const balanceTotal = cuentas.reduce((sum, c) => sum + c.saldoActual, 0);
    const runway = burnRate > 0 ? balanceTotal / burnRate : 999;

    // Promedio retiros (últimos 3 meses) - usando rango de fechas
    const { primerDia: hace3Meses } = obtenerRangoMes(hoy.getFullYear(), hoy.getMonth() - 2);
    const retirosUltimos3Meses = transacciones
      .filter(t => t.esRetiroPersonal && estaEnRango(t.fecha, hace3Meses, hoy))
      .reduce((sum, t) => sum + t.montoUsd, 0);
    const promedioRetiros = retirosUltimos3Meses / 3;

    // Variaciones
    const variacionIngresos = ingresosMesAnterior > 0 
      ? ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100 
      : 0;

    const variacionGastos = gastosMesAnterior > 0 
      ? ((gastosOperativos - gastosMesAnterior) / gastosMesAnterior) * 100 
      : 0;

    const variacionRetiros = retirosMesAnterior > 0 
      ? ((retirosMes - retirosMesAnterior) / retirosMesAnterior) * 100 
      : 0;

    // Balance por moneda (inicializado con todas las monedas en 0)
    const balancePorMoneda: Record<Moneda, number> = {
      USD: 0,
      BRL: 0,
      COP: 0,
      MXN: 0,
      ARS: 0,
      CLP: 0,
      PEN: 0,
      EUR: 0,
    };
    cuentas.forEach(cuenta => {
      balancePorMoneda[cuenta.moneda] += cuenta.saldoActual;
    });

    return {
      balanceTotal,
      balancePorMoneda,
      ingresosMes,
      gastosMes: gastosOperativos,
      retirosMes,
      gananciaNeta,
      margenNeto,
      burnRate,
      runway,
      promedioRetiros,
      variacionIngresos,
      variacionGastos,
      variacionRetiros,
    };
  };

  const obtenerDistribucionGastos = (): DistribucionGastos[] => {
    const hoy = new Date();
    const primerDiaMes = obtenerPrimerDiaMesActual();

    // Filtrar gastos del mes (sin retiros personales) usando utilidades de fecha
    const gastosMes = transacciones.filter(t => 
      t.tipo === 'gasto' && 
      !t.esRetiroPersonal && 
      estaEnRango(t.fecha, primerDiaMes, hoy)
    );

    const totalGastos = gastosMes.reduce((sum, t) => sum + t.montoUsd, 0);

    // Agrupar por categoría
    const porCategoria = new Map<string, { nombre: string; icono?: string; color?: string; monto: number; cantidad: number }>();

    gastosMes.forEach(t => {
      const catId = t.categoriaId || 'sin-categoria';
      const catNombre = t.categoria?.nombre || 'Sin categoría';
      const catIcono = t.categoria?.icono;
      const catColor = t.categoria?.color;

      if (!porCategoria.has(catId)) {
        porCategoria.set(catId, {
          nombre: catNombre,
          icono: catIcono,
          color: catColor,
          monto: 0,
          cantidad: 0,
        });
      }

      const actual = porCategoria.get(catId)!;
      actual.monto += t.montoUsd;
      actual.cantidad += 1;
    });

    // Convertir a array y calcular porcentajes
    return Array.from(porCategoria.entries())
      .map(([id, data]) => ({
        categoriaId: id,
        categoriaNombre: data.nombre,
        categoriaIcono: data.icono,
        categoriaColor: data.color,
        monto: data.monto,
        cantidad: data.cantidad,
        porcentaje: totalGastos > 0 ? (data.monto / totalGastos) * 100 : 0,
      }))
      .sort((a, b) => b.monto - a.monto);
  };

  /**
   * Obtiene el histórico mensual de ingresos y gastos
   * Agrupa las transacciones por mes y calcula totales en USD
   * 
   * NOTA: Usa utilidades de fecha para evitar problemas de zona horaria
   * 
   * @param meses - Cantidad de meses hacia atrás a incluir (default: 6)
   * @returns Array de datos mensuales con ingresos, gastos y neto
   */
  const obtenerHistoricoMensual = (meses: number = 6): DatosHistoricoMensual[] => {
    const hoy = new Date();
    const resultado: DatosHistoricoMensual[] = [];
    
    // Iterar desde el mes más antiguo hasta el mes actual
    for (let i = meses - 1; i >= 0; i--) {
      const { primerDia: primerDiaMes, ultimoDia: ultimoDiaMes } = obtenerRangoMes(
        hoy.getFullYear(), 
        hoy.getMonth() - i
      );
      
      // Filtrar transacciones del mes específico usando estaEnRango
      const transaccionesMes = transacciones.filter(t => 
        estaEnRango(t.fecha, primerDiaMes, ultimoDiaMes)
      );
      
      // Calcular totales en USD
      const ingresos = transaccionesMes
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.montoUsd, 0);
      
      const gastos = transaccionesMes
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.montoUsd, 0);
      
      // Agregar datos del mes
      resultado.push({
        mes: primerDiaMes.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        mesCompleto: primerDiaMes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        fecha: primerDiaMes,
        ingresos,
        gastos,
        neto: ingresos - gastos,
      });
    }
    
    return resultado;
  };

  /**
   * Obtiene los datos diarios del mes actual
   * Genera un array con todos los días del mes y sus transacciones
   * 
   * NOTA: Usa utilidades de fecha para evitar problemas de zona horaria.
   * La función esMismoDia() compara fechas correctamente sin desplazamiento UTC.
   * 
   * @returns Array de datos diarios con ingresos, gastos, neto y acumulado
   */
  const obtenerDatosDiariosMesActual = (): DatosDiariosMes[] => {
    const { año, mes } = obtenerMesYAñoActual();
    
    // Obtener todos los días del mes usando utilidad centralizada
    const diasDelMes = obtenerDiasDelMes(año, mes);
    
    const resultado: DatosDiariosMes[] = [];
    let acumuladoTotal = 0;
    
    // Iterar por cada día del mes
    diasDelMes.forEach((fechaDia, index) => {
      const dia = index + 1;
      
      // Filtrar transacciones del día usando esMismoDia para evitar problemas de zona horaria
      const transaccionesDia = transacciones.filter(t => 
        esMismoDia(t.fecha, fechaDia)
      );
      
      // Calcular totales del día
      const ingresos = transaccionesDia
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.montoUsd, 0);
      
      const gastos = transaccionesDia
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.montoUsd, 0);
      
      const neto = ingresos - gastos;
      acumuladoTotal += neto;
      
      // Agregar datos del día
      resultado.push({
        dia: dia.toString(),
        fecha: formatearFechaDia(fechaDia),
        fechaCompleta: fechaDia,
        ingresos,
        gastos,
        neto,
        acumulado: acumuladoTotal,
      });
    });
    
    return resultado;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // MAPPERS (DB → Frontend)
  // ═══════════════════════════════════════════════════════════════════════

  const mapearCuenta = (data: any): Cuenta => ({
    id: data.id,
    userId: data.user_id,
    nombre: data.nombre,
    tipo: data.tipo,
    moneda: data.moneda,
    saldoInicial: parseFloat(data.saldo_inicial),
    saldoActual: parseFloat(data.saldo_actual),
    color: data.color,
    icono: data.icono,
    activa: data.activa,
    descripcion: data.descripcion,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });

  const mapearCategoria = (data: any): CategoriaFinanza => ({
    id: data.id,
    userId: data.user_id,
    nombre: data.nombre,
    tipo: data.tipo,
    color: data.color,
    icono: data.icono,
    presupuestoMensual: data.presupuesto_mensual ? parseFloat(data.presupuesto_mensual) : undefined,
    categoriaPadre: data.categoria_padre,
    esRetiroPersonal: data.es_retiro_personal,
    activa: data.activa,
    descripcion: data.descripcion,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });

  const mapearTransaccion = (data: any): Transaccion => ({
    id: data.id,
    userId: data.user_id,
    cuentaId: data.cuenta_id,
    categoriaId: data.categoria_id,
    tipo: data.tipo,
    monto: parseFloat(data.monto),
    moneda: data.moneda,
    montoUsd: parseFloat(data.monto_usd),
    tasaCambio: data.tasa_cambio ? parseFloat(data.tasa_cambio) : undefined,
    concepto: data.concepto,
    descripcion: data.descripcion,
    fecha: data.fecha,
    esRetiroPersonal: data.es_retiro_personal,
    etiquetas: data.etiquetas,
    adjuntoUrl: data.adjunto_url,
    pagoClienteId: data.pago_cliente_id,
    transferId: data.transfer_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    cuenta: data.cuenta ? mapearCuenta(data.cuenta) : undefined,
    categoria: data.categoria ? mapearCategoria(data.categoria) : undefined,
  });

  // ═══════════════════════════════════════════════════════════════════════
  // RETURN DEL HOOK
  // ═══════════════════════════════════════════════════════════════════════

  return {
    // Estados
    cargando,
    cuentas,
    categorias,
    transacciones,
    tasasCambio,

    // Estados adicionales
    cuentasArchivadas,

    // CRUD Cuentas
    agregarCuenta,
    editarCuenta,
    eliminarCuenta,
    restaurarCuenta,

    // CRUD Categorías
    agregarCategoria,

    // CRUD Transacciones
    agregarTransaccion,
    transferirEntreCuentas,
    eliminarTransaccion,

    // Estadísticas
    estadisticas: obtenerEstadisticas(),
    distribucionGastos: obtenerDistribucionGastos(),
    historicoMensual: obtenerHistoricoMensual(),
    datosDiariosMesActual: obtenerDatosDiariosMesActual(),

    // Utilidades
    convertirAUSD,
    formatearMonto,
    actualizarTasasCambioDesdeAPI,
    monedasInfo: MONEDAS_INFO,

    // Reload
    recargar: cargarDatos,
  };
}
