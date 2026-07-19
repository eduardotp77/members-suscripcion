# 📊 SociosMembres

Sistema moderno de gestión de suscripciones con interfaz Glassmorphism Dark. Controla tus clientes, renovaciones, pagos e ingresos de manera visual y eficiente.

## ✨ Características Principales

- 🎯 **Landing Page Interactiva** con CRM Kanban demo funcional (drag & drop en vivo)
- 📈 **Dashboard en tiempo real** con métricas avanzadas (MRR, Churn Rate, LTV)
- 👥 **Gestión completa de clientes** con vista tabla y Kanban (drag & drop)
- 🔄 **Control de renovaciones** con alertas automáticas
- 💰 **Historial de pagos** con filtros avanzados y exportación CSV
- 📅 **Calendario de vencimientos** con vista mensual
- 📝 **Sistema de notas** tipo timeline por cliente
- 💵 **Módulo de Finanzas Premium** con diseño nivel Stripe: UI cards con spotlight effects, sparklines, gráficos circulares, filtros avanzados, multi-moneda, estadísticas en tiempo real
- 🔐 **Autenticación segura** con Supabase Auth + RLS
- 🎨 **Diseño Glassmorphism Dark** con gradientes violeta-rosa
- 📱 **100% Responsive** para todos los dispositivos
- ⚡ **Optimizado** con React Query, useMemo y TypeScript estricto
- 🤖 **Automatización n8n** para recordatorios por email y WhatsApp

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** React 18.3 + TypeScript 5.8
- **Build Tool:** Vite 5.4 + SWC (compilación ultrarrápida)
- **Routing:** React Router DOM v6.30
- **Estado Global:** TanStack React Query v5.83
- **Estilos:** Tailwind CSS 3.4 + Custom CSS Variables
- **UI Components:** Radix UI + shadcn/ui (50+ componentes)
- **Formularios:** React Hook Form v7.61 + Zod v3.25
- **Gráficos:** AreaChart custom con @visx/* + Recharts v2.15 (legacy)
- **Visualización:** @visx/curve, @visx/event, @visx/grid, @visx/scale, @visx/shape
- **Animaciones:** framer-motion v12.38 (hover effects, tooltips)
- **Data Processing:** d3-array (bisector para tooltips)
- **Utils:** react-use-measure (responsive charts)
- **Drag & Drop:** @dnd-kit v6.3
- **Fechas:** date-fns v3.6 (locale es-ES)
- **Notificaciones:** Sonner (toasts glassmorphism)
- **Iconos:** Lucide React 0.462

### Backend
- **BaaS:** Supabase (PostgreSQL 15 + Auth + Storage)
- **ORM:** Supabase JS Client v2.90
- **Autenticación:** Supabase Auth (JWT + RLS)
- **Base de Datos:** PostgreSQL con Row Level Security
- **Migraciones:** SQL migrations versionadas

### DevOps
- **Package Manager:** Bun / npm
- **Linting:** ESLint 9 + TypeScript ESLint
- **Deploy:** Docker Swarm + Nginx Alpine
- **Reverse Proxy:** Traefik v2 con SSL automático
- **Automatización:** n8n (workflows de recordatorios)

## 📋 Requisitos Previos

- **Node.js:** v18.0 o superior
- **Bun:** v1.0+ (recomendado) o npm/yarn
- **Cuenta Supabase:** Proyecto configurado (gratis en supabase.com)
- **Docker:** (solo para deploy en VPS)
- **n8n:** (opcional, para automatización de recordatorios)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <YOUR_GIT_URL>
cd SociosMembers
```

### 2. Instalar dependencias

```bash
# Con Bun (recomendado - más rápido)
bun install

# O con npm
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las credenciales de tu proyecto Supabase:

```env
VITE_SUPABASE_PROJECT_ID="tu-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://tu-project-id.supabase.co"
```

**¿Dónde obtener estas credenciales?**
1. Ve a [supabase.com](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Project Ref → `VITE_SUPABASE_PROJECT_ID`

### 4. Configurar la base de datos en Supabase

Ejecuta las migraciones SQL en orden en el **SQL Editor** de Supabase:

1. `supabase/migrations/20260111205839_f0241746-d86b-40ef-82f1-8f80cac7679a.sql` (estructura inicial)
2. `supabase/migrations/20260119000000_add_hotmart_payment_method.sql` (agrega Hotmart)
3. `supabase/migrations/20260208000000_add_motivo_cancelacion.sql` (campo cancelación)
4. `supabase/migrations/20260311000000_allow_multiple_products_per_email.sql` (múltiples productos)
5. `supabase/migrations/20260313000000_add_notas_cliente.sql` (sistema de notas)

Estas migraciones crean:
- ✅ Tablas: `profiles`, `clientes`, `pagos`, `notas_cliente`
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Políticas de acceso por usuario
- ✅ Triggers automáticos (`updated_at`)
- ✅ Índices optimizados
- ✅ Función para crear perfil al registrarse

### 5. Iniciar el servidor de desarrollo

```bash
# Con Bun
bun run dev

# O con npm
npm run dev
```

La aplicación estará disponible en **http://localhost:8080**


## 📦 Scripts Disponibles

```bash
# Desarrollo
bun run dev              # Inicia servidor de desarrollo en localhost:8080
npm run dev              # Alternativa con npm

# Producción
bun run build            # Build optimizado para producción (output: dist/)
bun run build:dev        # Build en modo desarrollo (sin minificar)
npm run build            # Alternativa con npm

# Previsualización local del build
bun run preview          # Preview del build de producción
npm run preview          # Alternativa con npm

# Calidad de código
bun run lint             # Ejecuta ESLint en todos los archivos
npm run lint             # Alternativa con npm
```

## 📁 Estructura del Proyecto

```
SociosMembers/
├── src/
│   ├── components/
│   │   ├── ui/                    # Sistema de diseño completo (50+ componentes)
│   │   │   ├── GlassCard.tsx      # Card con efecto glassmorphism
│   │   │   ├── GlassInput.tsx     # Input con blur y transparencia
│   │   │   ├── GlassSelect.tsx    # Select estilizado
│   │   │   ├── GradientButton.tsx # Botón con gradiente violeta-rosa
│   │   │   ├── StatusBadge.tsx    # Badge por estado (activa, vencida, etc.)
│   │   │   ├── RenovarModal.tsx   # Modal para renovar suscripciones
│   │   │   ├── CancelarModal.tsx  # Modal para cancelar con motivo
│   │   │   ├── NotaRapidaModal.tsx # Modal para agregar notas
│   │   │   ├── area-chart.tsx     # 🔥 AreaChart interactivo (~1200 líneas)
│   │   │   └── ...radix-ui        # accordion, alert, dialog, etc.
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sidebar glassmorphism con navegación
│   │   │   └── PageLayout.tsx     # Wrapper de páginas con padding
│   │   ├── landing/
│   │   │   ├── DashboardMockup.tsx         # Componente demo para landing
│   │   │   ├── KanbanBoardMockup.tsx       # Kanban interactivo con datos mock
│   │   │   ├── GlowWrapper.tsx             # Wrapper con efecto glow multi-capa
│   │   │   ├── AutomationSection.tsx       # 🔥 Sección de automatización (~95 líneas)
│   │   │   ├── AutomationTimeline.tsx      # Timeline 10AM/8PM animado (~165 líneas)
│   │   │   ├── AutomationFeatureCards.tsx  # Cards Multi-Canal/Inteligente (~155 líneas)
│   │   │   └── MessagePreviewMockup.tsx    # Preview Email/WhatsApp (~285 líneas)
│   │   ├── clientes/
│   │   │   ├── ClientesList.tsx   # Lista tabla de clientes
│   │   │   ├── ClienteForm.tsx    # Formulario CRUD con validación Zod
│   │   │   ├── ClienteFilters.tsx # Filtros avanzados
│   │   │   ├── KanbanBoard.tsx    # Vista Kanban drag & drop
│   │   │   ├── KanbanCard.tsx     # Card de cliente en Kanban
│   │   │   ├── KanbanColumn.tsx   # Columna por estado
│   │   │   ├── NotasTimeline.tsx  # Timeline de notas del cliente
│   │   │   └── VitalicioCard.tsx  # Card especial para vitalicios
│   │   ├── dashboard/
│   │   │   ├── KPIStripRow.tsx              # KPIs estilo Stripe (MRR, churn)
│   │   │   ├── RevenueChart.tsx             # Gráfico legacy (Recharts)
│   │   │   ├── RevenueChartInteractive.tsx  # 🔥 Wrapper del nuevo AreaChart
│   │   │   ├── DistributionChart.tsx        # Pie chart por tipo
│   │   │   ├── PaymentBreakdown.tsx    # Desglose por método de pago
│   │   │   ├── AlertasVencimiento.tsx  # Widget de próximas a vencer
│   │   │   ├── MesResumen.tsx          # Resumen del mes actual
│   │   │   ├── SemanaWidget.tsx        # Mini panel semanal
│   │   │   ├── ResumenWidget.tsx       # Widget de resumen general
│   │   │   ├── TopClientesWidget.tsx   # Ranking por ingresos
│   │   │   └── StatCard.tsx            # Card de estadística
│   │   ├── finanzas/                    # 🔥 Módulo completo de finanzas - Diseño Premium
│   │   │   ├── dashboard/                       # 🆕 Componentes dashboard Bento Grid
│   │   │   │   ├── BalanceHeroCard.tsx          # Hero 2x2 balance total + sparkline
│   │   │   │   ├── KPICompactCard.tsx           # Card compacto reutilizable para KPIs
│   │   │   │   └── MetricsStripBar.tsx          # Barra horizontal métricas secundarias
│   │   │   ├── stats/                           # 🆕 Componentes estadísticos reutilizables
│   │   │   │   ├── MiniSparkline.tsx            # Gráfico mini tendencia (SVG animado)
│   │   │   │   ├── ProgressCircular.tsx         # Indicador circular con auto-color
│   │   │   │   └── TrendIndicator.tsx           # Indicador % con iconos y colores
│   │   │   ├── configuracion/                   # 🆕 Cuentas y categorías premium
│   │   │   │   ├── CuentaCard.tsx               # Card cuenta con spotlight + sparkline + dropdown
│   │   │   │   ├── CategoriaCard.tsx            # Card categoría con progreso circular + dropdown
│   │   │   │   ├── FinanzasStatsBar.tsx         # Barra KPIs sticky
│   │   │   │   └── EmptyStates.tsx              # Estados vacíos profesionales
│   │   │   ├── forms/                           # 🆕 Formularios con preview en vivo
│   │   │   │   ├── CuentaPreview.tsx            # Preview en tiempo real de cuenta
│   │   │   │   └── CategoriaPreview.tsx         # Preview en tiempo real de categoría
│   │   │   ├── transacciones/                   # 🆕 Módulo transacciones premium
│   │   │   │   ├── TransaccionCard.tsx          # Card con spotlight + badges
│   │   │   │   ├── TransaccionesStatsBar.tsx    # Barra estadísticas sticky
│   │   │   │   ├── MesHeader.tsx                # Header resumen por mes
│   │   │   │   ├── FiltrosTransacciones.tsx     # Panel filtros avanzados
│   │   │   │   └── EmptyStates.tsx              # Estados vacíos + sin resultados
│   │   │   ├── FinanzasDashboard.tsx            # 🔄 Dashboard Bento Grid (Balance + 4 KPIs)
│   │   │   ├── HistoricoMensualChart.tsx        # Gráfico últimos 6 meses (AreaChart)
│   │   │   ├── MesActualChartInteractive.tsx    # 🔥 Flujo diario del mes (día por día)
│   │   │   ├── MesActualChart.tsx               # Legacy chart (Recharts)
│   │   │   ├── EstadisticasMesCard.tsx          # Estadísticas y proyecciones
│   │   │   ├── TransaccionesList.tsx            # 🔄 Lista transacciones refactorizada
│   │   │   ├── TransaccionForm.tsx              # Modal registrar ingresos/gastos
│   │   │   ├── CuentaForm.tsx                   # 🔄 Modal crear cuenta (2-col layout)
│   │   │   ├── CategoriaForm.tsx                # 🔄 Modal crear categoría (2-col layout)
│   │   │   └── ConfiguracionFinanzas.tsx        # 🔄 Gestión cuentas/categorías + handlers CRUD
│   │   └── calendario/
│   │       ├── CalendarioGrid.tsx      # Grid mensual
│   │       ├── CalendarDayCell.tsx     # Celda de día con indicadores
│   │       └── CalendarioDayDetail.tsx # Modal detalle del día
│   ├── pages/
│   │   ├── Landing.tsx            # Página pública de bienvenida
│   │   ├── Auth.tsx               # Login / Registro
│   │   ├── Dashboard.tsx          # Dashboard principal con métricas
│   │   ├── Clientes.tsx           # Gestión CRUD de clientes
│   │   ├── ClienteDetalle.tsx     # Vista individual con estadísticas
│   │   ├── Renovaciones.tsx       # Lista de próximas a vencer
│   │   ├── Historial.tsx          # Timeline de pagos con filtros
│   │   ├── Calendario.tsx         # Vista mensual de vencimientos
│   │   ├── Finanzas.tsx           # 🔥 Módulo de finanzas multi-moneda
│   │   ├── Index.tsx              # Redirect handler
│   │   └── NotFound.tsx           # Página 404
│   ├── hooks/
│   │   ├── useAuth.ts             # Hook de autenticación Supabase
│   │   ├── useClientes.ts         # 🔥 Hook de gestión de clientes (~650 líneas)
│   │   ├── useFinanzas.ts         # 🔥 Hook completo de finanzas multi-moneda (~850 líneas)
│   │   ├── use-mobile.tsx         # Detect mobile viewport
│   │   └── use-toast.ts           # Toast notifications
│   ├── lib/
│   │   ├── dateUtils.ts           # 🔥 Utilidades de fechas (fix zona horaria)
│   │   ├── logger.ts              # 🔥 Sistema de logging centralizado (v1.9.0)
│   │   ├── finanzas-colors.ts     # 🔥 Paleta de colores para gráficos financieros
│   │   ├── utils.ts               # Funciones utilitarias (formateo, cálculos)
│   │   └── theme.ts               # Constantes de tema y colores
│   ├── types/
│   │   └── index.ts               # Definiciones TypeScript globales
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Cliente configurado de Supabase con validación
│   │       └── types.ts           # 🔥 Tipos regenerados completos (v1.9.0)
│   ├── App.tsx                    # Componente raíz con Router
│   ├── main.tsx                   # Entry point de React
│   └── index.css                  # Estilos globales + variables CSS
├── supabase/
│   ├── config.toml                # Configuración local de Supabase CLI
│   └── migrations/                # Migraciones SQL versionadas
│       ├── 20260111205839_*.sql   # Estructura inicial
│       ├── 20260119000000_*.sql   # Agrega Hotmart
│       ├── 20260208000000_*.sql   # Campo motivo_cancelacion
│       ├── 20260311000000_*.sql   # Múltiples productos por email
│       ├── 20260313000000_*.sql   # Sistema de notas
│       └── 20260514000000_*.sql   # 🔥 Módulo de finanzas completo (v1.9.0)
├── VPS/
│   ├── docker-compose.yml         # Stack para Docker Swarm
│   └── nginx.conf                 # Configuración Nginx optimizada
├── public/                        # Assets estáticos
├── n8n-workflow-recordatorios.json # Workflow de automatización
├── .env                           # Variables de entorno (NO subir a Git)
├── .env.example                   # Plantilla de variables
├── package.json                   # Dependencias y scripts
├── vite.config.ts                 # Configuración de Vite
├── tailwind.config.ts             # Configuración de Tailwind
├── tsconfig.json                  # Configuración TypeScript
└── README.md                      # Este archivo
```


## 🎨 Sistema de Diseño - Glassmorphism Dark

### Paleta de Colores

```css
/* Colores principales */
--primary: #8b5cf6      /* Violeta - Acciones principales */
--accent: #ec4899       /* Rosa - Highlights y gradientes */
--secondary: #10b981    /* Esmeralda - Success / Ingresos */
--destructive: #ef4444  /* Rojo - Gastos / Errores */
--warning: #f59e0b      /* Ámbar - Warnings / Deudas */
--info: #3b82f6         /* Azul - Info / Neutral */

/* Fondo y superficies */
--background: #000000           /* Negro puro */
--card: rgba(255,255,255,0.05)  /* Glass card */
--border: rgba(255,255,255,0.1) /* Bordes glass */
```

### Gradientes Signature

- **Primary:** `linear-gradient(135deg, #8b5cf6 → #ec4899)` (Violeta → Rosa)
- **Secondary:** `linear-gradient(135deg, #10b981 → #3b82f6)` (Esmeralda → Azul)
- **Violet:** `linear-gradient(135deg, #8b5cf6 → #6366f1)` (Violeta → Índigo)

### Efectos Glass

- **Backdrop Blur:** 10px en cards, 12px en hover
- **Transparencias:** 5% bg normal, 8% en hover
- **Sombras:** Box-shadow con rgba(0,0,0,0.3) + glow de neón en hover
- **Bordes:** 1px solid rgba(255,255,255,0.1)

### Componentes Personalizados

| Componente | Descripción |
|------------|-------------|
| `GlassCard` | Card con efecto vidrio, blur y hover suave |
| `GlassInput` | Input con bg transparente y focus ring violeta |
| `GlassSelect` | Select estilizado con opciones glass |
| `GradientButton` | Botón con gradiente primary y shadow glow |
| `StatusBadge` | Badge por estado con colores semánticos |
| `TrendBadge` | Badge de tendencia con flecha ↑↓ y % |
| `CurrencyDisplay` | Formato de moneda con símbolo $ |

### Animaciones

- **fade-in:** Aparición suave con translateY
- **slide-up:** Deslizamiento desde abajo
- **scale-in:** Zoom in desde 95% a 100%
- **shimmer:** Efecto brillante en loaders

---

## 🔐 Seguridad y Privacidad

### Autenticación
- ✅ **Supabase Auth** con JWT tokens
- ✅ **Persistencia de sesión** en localStorage
- ✅ **Auto-refresh** de tokens
- ✅ **Protected routes** con guardas
- ✅ **Email verificado** opcional

### Base de Datos
- ✅ **Row Level Security (RLS)** en todas las tablas
- ✅ Políticas de acceso: `auth.uid() = user_id`
- ✅ Los usuarios solo ven y modifican **sus propios datos**
- ✅ Constraints: `UNIQUE(user_id, correo, producto)`
- ✅ Cascadas en FK para integridad referencial

### Validación
- ✅ **Frontend:** React Hook Form + Zod schemas
- ✅ **Backend:** Constraints DB + RLS policies
- ✅ **Sanitización:** Limpieza de inputs (WhatsApp, emails)
- ✅ **Prevención SQL Injection:** Supabase usa prepared statements

---

## 📊 Funcionalidades Detalladas

### � Landing Page Interactiva

**CRM Kanban Demo en Vivo:**
- 🎨 **Vista Kanban completa** con 30 clientes de demostración generados automáticamente
- 🖱️ **Drag & Drop funcional** - Los visitantes pueden arrastrar cards entre columnas
- 📊 **5 Columnas de estado:**
  - ✅ **Activos:** Suscripciones activas sin vencimiento próximo
  - ⚠️ **Próximos a vencer:** Clientes que vencen en ≤7 días (solo lectura)
  - 📅 **Vencidos:** Suscripciones expiradas
  - ❌ **Cancelados:** Suscripciones canceladas
  - ♾️ **Vitalicios:** Pagos únicos sin vencimiento (solo lectura)

**Características del Demo:**
- 🎭 **Datos mock realistas:** Generados con nombres, emails, productos y fechas
- 🔄 **Cambios visuales:** Al arrastrar, el estado cambia solo en la UI (no persiste)
- 🚫 **Columnas protegidas:** "Próximos a vencer" y "Vitalicios" no aceptan drops
- 📱 **100% Responsive:** Scroll horizontal en mobile, vista completa en desktop
- ⚡ **Sensores optimizados:** `distance: 5px` para activación natural del drag
- 🎨 **Efectos glassmorphism:** Cards con blur, overlay con scale y rotación

**Tecnología:**
- 🛠️ **Reutiliza componentes reales:** `KanbanBoard`, `KanbanCard`, `KanbanColumn`
- 📦 **Datos generados:** `generateMockClientes()` de `lib/generateMockData.ts`
- 🎯 **DndContext de @dnd-kit:** Mismo sistema que la app real
- 🔒 **Sin dependencias de backend:** Funciona sin Supabase

**UX:**
- 💡 **Header con badge:** "✨ Interactivo - Prueba arrastrando"
- 📏 **Altura fija:** 600px con max-height responsivo
- 🎨 **Overlay visual:** Card fantasma que sigue el cursor durante el drag
- 📊 **Contador dinámico:** Muestra cantidad de clientes por columna

---
### 🔔 Sección de Automatización de Recordatorios (Landing)

**Nueva sección destacada mostrando el sistema de automatización n8n:**
- 🎨 **Diseño profesional glassmorphism** con badge animado "Automatización 24/7"
- 🌟 **Fondo con GlowWrapper** de intensidad alta (gradientes emerald + violet)
- 📜 **ScrollReveal animations** con delays escalonados para máximo impacto

**Timeline Animado Interactivo:**
- ⏰ **Dos momentos clave del día:**
  - **10:00 AM** → Resumen diario para dueños (color violeta)
  - **20:00 PM** → Recordatorios a clientes (color emerald)
- 🔵 **Animaciones de pulso continuo** en nodos (scale + opacity con framer-motion)
- ➡️ **Línea conectora animada** con gradiente de progreso (violet → emerald)
- 🎯 **Flecha flotante** con movimiento perpetuo
- 📱 **100% responsive:** vertical en mobile, horizontal en tablet/desktop

**Tarjetas de Características:**
- 💬 **Multi-Canal:** WhatsApp + Email en un solo flujo, badge "2 canales"
- 🧠 **Inteligente:** Filtrado automático por fechas, badge "3 días antes"
- ⚡ **Cero Intervención:** 100% automático, badge "100% automático"
- 🎨 **Efectos avanzados:**
  - CardSpotlight con efecto hover que sigue el cursor
  - Iconos animados con rotación al hacer hover
  - Badges con efecto ping (círculo expandiéndose)
  - Gradient hover line animada en la parte inferior

**Preview Interactivo de Mensajes:**
- 🔄 **Toggle animado** entre "Email Preview" y "WhatsApp Preview"
- 📧 **Email Preview realista:**
  - Mockup fiel al workflow n8n real
  - Header con remitente/destinatario
  - Badge rojo "VENCEN HOY" con tabla de clientes
  - Valores monetarios y productos de ejemplo
  - Footer "SociosMembres · Resumen automático diario"
- 📱 **WhatsApp Preview auténtico:**
  - Bubble estilo WhatsApp oficial (fondo #005c4b)
  - Mensaje personalizado con emojis 👋 🙏
  - Checkmarks azules de "mensaje entregado"
  - Timestamp y nota "Enviado automáticamente"
- 🎬 **Transiciones suaves** con AnimatePresence (slide left/right)

**Componentes Creados:**
- `AutomationSection.tsx` - Componente principal (~95 líneas)
- `AutomationTimeline.tsx` - Timeline animado (~165 líneas)
- `AutomationFeatureCards.tsx` - Tarjetas de características (~155 líneas)
- `MessagePreviewMockup.tsx` - Preview interactivo (~285 líneas)

**Tecnología de Automatización:**
- 🤖 **n8n Workflow Integration:**
  - Cron 10AM: Resumen diario agrupado por usuario
  - Cron 8PM: Recordatorios 3 días antes del vencimiento
  - Rate limiting: 8s entre mensajes WhatsApp
- 📡 **EvolutionAPI** para WhatsApp Business
- 📬 **Brevo SMTP** para emails profesionales con HTML personalizado
- 🔄 **Filtrado inteligente:** Solo notifica fechas exactas (hoy, o en 3 días)

**Animaciones Profesionales:**
- Pulso en nodos: `scale [1, 1.05, 1]` + `opacity [0.8, 1, 0.8]`
- Línea de progreso: `scaleX 0 → 1` con ease-out (1.5s)
- Flecha flotante: movimiento x/y perpetuo (2s loop)
- Icon rotation: `rotate [0, -10, 10, -10, 0]` al hover (0.5s)
- Tab transition: slide con AnimatePresence (0.3s)
- Gradient hover: `scaleX 0 → 1` en línea inferior

**Responsive:**
- 📱 **Mobile:** Timeline vertical, cards 1 columna, preview full-width
- 💻 **Tablet:** Timeline horizontal, cards 2 columnas
- 🖥️ **Desktop:** Timeline extendido, cards 3 columnas (grid perfecto)

**Posicionamiento:**
- 📍 **Ubicación estratégica:** DESPUÉS de "Capacidades Principales" y ANTES de "Cómo Funciona"
- 🎯 **Objetivo:** Destacar característica diferenciadora para aumentar conversión

---
### �🏠 Dashboard

**KPIs Principales:**
- 💰 **Volumen Bruto Mensual:** Ingresos totales del mes con tendencia MoM
- 📈 **MRR (Monthly Recurring Revenue):** Ingresos recurrentes normalizados
- 👥 **Suscripciones Activas:** Total activo con variación del mes anterior
- ⚠️ **Tasa de Churn:** % de cancelaciones sobre base activa

**Gráficos:**
- 📊 **Ingresos Históricos:** AreaChart interactivo con efectos hover avanzados:
  - 🎯 Crosshair vertical animado con gradiente
  - 💬 Tooltip flotante glassmorphism con datos
  - 🎪 Date ticker animado (pill que sigue el cursor)
  - ⚫ Dots animados en puntos de datos
  - 🌟 Highlight effect en área bajo el cursor
  - 📱 100% responsive con ParentSize wrapper
- 🍰 **Distribución por Tipo:** PieChart (mensual, trimestral, anual, etc.)
- 💳 **Desglose por Plataforma:** Stripe, Binance, PayPal, Hotmart

**Widgets:**
- 🔔 **Alertas de Vencimiento:** Próximos 7 días con indicadores de urgencia
- 👑 **Top Clientes:** Ranking por ingresos totales (LTV)
- 📅 **Resumen Mensual:** Activas, nuevas, vencidas del mes
- 📆 **Vista Semanal:** Mini-gráfico de actividad

---

### � Módulo de Finanzas

**Sistema Completo de Gestión Financiera Multi-Moneda:**
- 💰 **Gestión de Cuentas:** Crea y administra cuentas bancarias, carteras crypto, efectivo, etc.
- 🏷️ **Categorización:** Ingresos y gastos con categorías personalizables (marketing, herramientas, operaciones)
- 💸 **Retiros Personales:** Categoría especial para separar finanzas personales del negocio
- 🌍 **Soporte Multi-Moneda:** USD, BRL, COP, MXN, ARS, CLP, PEN, EUR con conversión automática
- 📊 **Gráficos Interactivos:** Visualización avanzada con AreaChart y efectos hover

**Dashboard Financiero:**
- 💼 **Balance Total:** Suma de todas las cuentas convertida a USD
- 📈 **Ingresos del Mes:** Total de ingresos con variación MoM
- 📉 **Gastos Operativos:** Total de gastos excluyendo retiros personales
- 💰 **Retiros Personales:** Dinero retirado del negocio para uso personal
- 🎯 **Ganancia Neta:** Ingresos - Gastos - Retiros
- 📊 **Margen Neto:** % de ganancia sobre ingresos
- 🔥 **Burn Rate:** Gasto promedio mensual sin retiros
- ⏱️ **Runway:** Meses que puede operar sin ingresos (Balance / Burn Rate)

**Gráficos Avanzados:**
- 📊 **Flujo Diario del Mes Actual:** 
  - Gráfico de área interactivo día por día (1-31)
  - Dos áreas superpuestas: verde (ingresos) y roja (gastos)
  - Header con progreso del mes: "Día 15 de 31 (48%)"
  - Tooltip con 4 valores: Ingresos del día, Gastos del día, Neto, Acumulado
  - Balance acumulado hasta el día actual
  - Estadísticas: Total ingresos, Total gastos, Balance final

- 📈 **Histórico Mensual (6 meses):**
  - Comparativa de ingresos vs gastos por mes
  - Vista de tendencias de largo plazo
  - Resumen de totales acumulados

- 🍰 **Distribución de Gastos:**
  - Desglose por categoría del mes actual
  - Barras de progreso con % y montos
  - Colores personalizables por categoría

**Funcionalidades:**
- ✅ **Registro de Transacciones:** Ingresos y gastos con concepto, fecha, cuenta y categoría
- ✅ **Conversión Automática:** API de ExchangeRate actualiza tasas diariamente
- ✅ **Filtros Avanzados:** Por tipo, moneda, categoría, cuenta, fechas
- ✅ **Gestión de Cuentas:** Crear, ver y administrar cuentas en múltiples monedas
- ✅ **Categorías Predefinidas:** 
  - **Gastos:** Tecnología, Marketing, Herramientas, Operaciones, Educación, Transporte
  - **Especial:** Retiro Personal (separado de gastos operativos)
  - **Ingresos:** Clientes, Consultoría, Otros Ingresos
- ✅ **Saldo Actualizado:** Los saldos se actualizan automáticamente con cada transacción
- ✅ **Multi-Vista:** Dashboard, Transacciones, Configuración de Cuentas/Categorías

**Componentes Creados:**
- `FinanzasDashboard.tsx` - KPIs financieros principales
- `MesActualChartInteractive.tsx` - Gráfico diario interactivo con AreaChart (~210 líneas)
- `HistoricoMensualChart.tsx` - Gráfico de 6 meses con comparativa
- `TransaccionesList.tsx` - Lista de transacciones con filtros
- `TransaccionForm.tsx` - Modal para registrar ingresos/gastos
- `CuentaForm.tsx` - Modal para crear cuentas
- `CategoriaForm.tsx` - Modal para crear categorías
- `ConfiguracionFinanzas.tsx` - Gestión de cuentas y categorías
- `EstadisticasMesCard.tsx` - Card con estadísticas y proyecciones

**Hook Completo (useFinanzas.ts):**
- 📊 **Estadísticas calculadas:** Balance, ingresos, gastos, retiros, neto, margen, burn rate, runway
- 🔄 **CRUD completo:** Cuentas, categorías, transacciones
- 💱 **Conversión de monedas:** Función `convertirAUSD()` con tasas actualizadas
- 📈 **Datos para gráficos:** `obtenerHistoricoMensual()`, `obtenerDatosDiariosMesActual()`
- 🎨 **Distribución por categoría:** Agrupación y cálculo de porcentajes
- 🔄 **Actualización de tasas:** Integración con ExchangeRate-API

**Base de Datos (Supabase):**
- Tablas: `cuentas`, `categorias_finanzas`, `transacciones`, `tasas_cambio`
- RLS policies: Cada usuario solo ve sus propios datos
- Triggers automáticos para actualizar `updated_at`
- Constraint: Conversión automática a USD al insertar transacciones

**Paleta de Colores (finanzas-colors.ts):**
- 🟢 **Ingresos:** Verde (#10b981 / green-500)
- 🔴 **Gastos:** Rojo (#ef4444 / red-500)
- 🟣 **Balance:** Violeta (#8b5cf6 / violet-500)
- 🌸 **Retiros:** Rosa (#ec4899 / pink-500)
- Consistencia visual en todos los gráficos y componentes

**Tecnología:**
- 🎨 **AreaChart interactivo** con @visx/* (mismo sistema que Dashboard)
- 📊 **Efectos avanzados:** Crosshair, tooltip flotante, dots animados, highlight
- 🌍 **API de tasas:** ExchangeRate-API v6 con cache en Supabase
- 💾 **Persistencia total:** Todas las transacciones, cuentas y categorías en PostgreSQL
- 📱 **100% Responsive:** Gráficos adaptables a mobile/tablet/desktop

---

### �👥 Gestión de Clientes

**CRUD Completo:**
- ➕ **Crear:** Formulario con validación Zod en tiempo real
- ✏️ **Editar:** Modificar cualquier campo excepto email+producto (UNIQUE)
- 🗑️ **Eliminar:** Con confirmación y cascada de pagos/notas
- 🔄 **Renovar:** Actualiza fecha_inicio y recalcula vencimiento

**Tipos de Suscripción:**
- 📅 **Mensual:** 30 días de duración
- 📅 **Trimestral:** 90 días (3 meses)
- 📅 **Semestral:** 180 días (6 meses)
- 📅 **Anual:** 365 días (1 año)
- ♾️ **Vitalicio:** Sin fecha de vencimiento (pago único)

**Medios de Pago:**
- 💳 **Stripe:** Color violeta (#8b5cf6)
- ₿ **Binance:** Color ámbar (#f59e0b)
- 💙 **PayPal:** Color azul (#3b82f6)
- 🔥 **Hotmart:** Color rosa (#ec4899)

**Vistas:**
- 📋 **Tabla:** Lista completa con ordenamiento y filtros
- 📌 **Kanban:** Columnas por estado (Activa, Vencida, Pendiente, Cancelada) con drag & drop

**Filtros Avanzados:**
- 🔍 Búsqueda por nombre o correo
- 📦 Por producto (combobox con autocompletado)
- 🎯 Por estado (activa, vencida, pendiente, cancelada)
- 📅 Por tipo de suscripción
- 📆 Rango de fechas (inicio o vencimiento)

**Sistema de Notas:**
- 📝 **Timeline por cliente:** Registro cronológico de eventos
- ⏰ **Timestamp automático:** Fecha y hora de cada nota
- 🗑️ **Eliminar notas:** Con confirmación
- 📌 **Nota rápida desde lista:** Modal flotante

---

### 🔄 Renovaciones

**Alertas Inteligentes:**
- 🔴 **Vencen en 7 días:** Urgencia alta (rojo)
- 🟠 **Vencen en 15 días:** Urgencia media (ámbar)
- 🟡 **Vencen en 30 días:** Urgencia baja (amarillo)

**Acciones Rápidas:**
- ⚡ **Renovar con 1 clic:** Fecha automática (hoy)
- 📅 **Renovar con fecha custom:** Selector de fecha
- 💰 **Registra pago automático:** Concepto "renovación"
- 📊 **Actualiza contador:** `total_renovaciones++`

---

### 💰 Historial de Pagos

**Vista Timeline:**
- 📆 Agrupación por mes con totales
- 🎨 Color por concepto: Verde (nuevo), Azul (renovación)
- 💳 Icono por medio de pago
- 👤 Nombre del cliente clickable

**Filtros:**
- 👥 Por cliente (combobox)
- 💳 Por medio de pago (select)
- 📅 Rango de fechas (date picker)
- 🔍 Búsqueda rápida

**Exportación:**
- 📥 **CSV:** Descarga completa con headers en español
- 📊 Compatible con Excel / Google Sheets
- 🔢 Formato: `fecha,cliente,monto,medio_pago,concepto`

---

### 📅 Calendario

**Vista Mensual:**
- 📆 Grid de 7 columnas (Lu-Do)
- 🔴 **Punto rojo:** Vencimientos ese día
- 🟢 **Punto verde:** Pagos cobrados ese día
- 📊 **Badge con cantidad:** Número de eventos

**Detalle del Día:**
- 📋 Modal con lista de clientes que vencen
- 💰 Lista de pagos cobrados
- ⚡ Acciones rápidas: renovar, ver detalle
- 📈 Total de ingresos del día

---

### 📈 Métricas Avanzadas

**MRR (Monthly Recurring Revenue):**
```
Factor de normalización:
- Mensual: 1x
- Trimestral: 1/3
- Semestral: 1/6
- Anual: 1/12
- Vitalicio: 0 (no es recurrente)

MRR = Σ (valor_cobrado × factor) para todas las activas
```

**Tasa de Churn:**
```
Base = Activas al inicio del mes
Cancelados = Canceladas durante el mes
Churn % = (Cancelados / Base) × 100
```

**LTV (Lifetime Value):**
```
LTV cliente = Σ todos los pagos del cliente
Incluye pago inicial + todas las renovaciones
```

**Crecimiento Neto:**
```
Nuevos - Cancelados = Crecimiento del mes
Tendencia % = ((Nuevos actuales - Nuevos mes anterior) / Nuevos mes anterior) × 100
```

---

## 🔐 Seguridad


## 🚀 Despliegue en Producción

### Opción 1: VPS con Docker Swarm + Traefik

**Compatible con Setup Orion:** https://github.com/oriondesign2015/setuporion

**Tu flujo habitual (3 pasos):**

**1️⃣ Build local:**
```bash
bun run build        # O: npm run build
# Output en carpeta dist/
```

**2️⃣ Subir archivos con Termius SFTP:**
- Conectar como root
- Crear carpeta: `/root/socios-members/`
- Subir TODO el contenido de `dist/` dentro de `/root/socios-members/`
- Subir `VPS/nginx.conf` a `/root/socios-members/nginx.conf`

**3️⃣ Deploy en Portainer:**
- Ir a: **Stacks** → **Add Stack**
- Name: `socios-members`
- Abrir `VPS/docker-compose.yml` en tu editor local
- Cambiar **SOLO 2 cosas**:
  ```yaml
  # Línea 29: Tu dominio
  - traefik.http.routers.socios.rule=Host(`tu-dominio.com`) || Host(`www.tu-dominio.com`)
  
  # Línea 44: Tu red Traefik (si no es SociosNet)
  networks:
    SociosNet:  # Cambiar por tu red (ej: TraefikNet, OrionNet, etc.)
  ```
- Copiar TODO el contenido del .yml
- Pegar en Portainer
- Click en **Deploy the stack**

**✅ Listo.** Visita `https://tu-dominio.com` (SSL automático).

---

**Actualizar app después:**
```bash
# 1. Build nuevo
bun run build

# 2. Resubir dist/ via Termius (sobreescribir)

# 3. En Portainer: 
#    Services → socios-members → Update service
```

---

### Opción 2: Vercel (Recomendado para proyectos pequeños)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en dashboard
# Settings → Environment Variables → Agregar:
# VITE_SUPABASE_URL
# VITE_SUPABASE_PUBLISHABLE_KEY
# VITE_SUPABASE_PROJECT_ID
```

---

### Opción 3: Netlify

```bash
# Build
bun run build

# Subir carpeta dist/ en Netlify dashboard
# O usar CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Configurar variables de entorno en dashboard
```

---

### Opción 4: Render / Railway / Fly.io

Todos soportan despliegue automático desde Git:

1. Conectar repositorio
2. Configurar build command: `bun run build` o `npm run build`
3. Publish directory: `dist`
4. Agregar variables de entorno
5. Deploy automático en cada push

---

## 🤖 Automatización con n8n (Recordatorios)

### ¿Qué hace el workflow?

**Workflow incluido:** `n8n-workflow-recordatorios.json`

**Cron 1 - 10:00 AM (Resumen para dueños):**
- ✅ Consulta clientes que **vencen HOY**
- ✅ Agrupa por usuario (`user_id`)
- ✅ Envía email HTML personalizado con tabla de clientes
- ✅ Formato glassmorphism matching la app

**Cron 2 - 20:00 PM (Notificación a clientes):**
- ✅ Filtra clientes que vencen **en 3 días**
- ✅ Loop cliente por cliente
- ✅ Si tiene WhatsApp → envía mensaje por API
- ✅ Si NO tiene WhatsApp → envía email
- ✅ Recordatorio amigable con datos de suscripción

### Setup de n8n

**1. Instalar n8n:**

```bash
# Con Docker (recomendado)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# O con npm
npm install n8n -g
n8n start
```

**2. Importar workflow:**

1. Abre n8n en `http://localhost:5678`
2. Click en **Import from File**
3. Selecciona `n8n-workflow-recordatorios.json`
4. Click en **Import**

**3. Configurar credenciales:**

**A. Supabase API:**
- Node: "Traer clientes activos"
- Click en **Credentials**
- Host: `https://tu-project.supabase.co`
- Service Key: (obtener en Supabase Dashboard → Settings → API → service_role key)

**B. SMTP (para emails):**
- Node: "Email - Resumen a cada Dueño"
- Proveedor recomendado: **Brevo** (ex-Sendinblue) - 300 emails/día gratis
- Host: `smtp-relay.brevo.com`
- Port: `587`
- User: Tu email registrado en Brevo
- Password: SMTP Key de Brevo

**C. WhatsApp API (opcional):**
- Node: "Enviar WhatsApp"
- Proveedor sugerido: **Twilio** / **WhatsApp Business API** / **Waboxapp**
- Configurar según documentación del proveedor

**4. Activar workflow:**

- Toggle el switch **Active** en la esquina superior derecha
- Los crons se ejecutarán automáticamente a las 10 AM y 8 PM

**5. Testear manualmente:**

- Click en **Execute Workflow** para probar sin esperar al cron
- Verifica logs en la parte inferior

---

### Personalizar recordatorios

**Cambiar horarios:**

Edita los nodos de Cron:

```javascript
// 10 AM → Cambiar a 9 AM
expression: "0 9 * * *"

// 8 PM → Cambiar a 7 PM  
expression: "0 19 * * *"
```

**Cambiar días de anticipación (3 días → 7 días):**

En el nodo "Filtro: vencen en 3 días":

```javascript
// Cambiar esta línea:
en3dias.setDate(hoy.getDate() + 3);

// Por:
en3dias.setDate(hoy.getDate() + 7);  // 7 días
```

**Personalizar templates de email:**

Los emails están en HTML inline en el nodo "Email - Resumen a cada Dueño". Puedes editarlos directamente con tu branding, colores, etc.

---

## 🐛 Troubleshooting

### Error: "Invalid API credentials"

**Problema:** Variables de entorno mal configuradas.

**Solución:**
```bash
# Verificar que .env existe y tiene valores correctos
cat .env

# Reiniciar servidor de desarrollo
bun run dev
```

---

### Error: "Network request failed" al hacer login

**Problema:** Supabase URL incorrecta o proyecto pausado.

**Solución:**
1. Verifica en Supabase Dashboard que el proyecto está activo
2. Confirma que `VITE_SUPABASE_URL` es correcto
3. Chequea la consola del navegador para más detalles

---

### Error: "Row Level Security policy violation"

**Problema:** Las migraciones no se ejecutaron correctamente.

**Solución:**
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta las migraciones en orden (ver paso 4 de Instalación)
3. Verifica políticas RLS en Database → Policies

---

### Error: "duplicate key value violates unique constraint"

**Problema:** Ya existe un cliente con ese email+producto.

**Solución:**
- La combinación `correo + producto` debe ser única por usuario
- Si quieres el mismo email para otro producto, está permitido
- Si quieres el mismo email para el mismo producto → edita el existente

---

### El build falla con "out of memory"

**Problema:** Node se queda sin memoria en builds grandes.

**Solución:**
```bash
# Aumentar límite de memoria
NODE_OPTIONS=--max-old-space-size=4096 bun run build
```

---

### El workflow n8n no se ejecuta

**Problema:** Workflow no está activo o credenciales inválidas.

**Solución:**
1. Verifica que el switch **Active** está ON (verde)
2. Revisa las credenciales de Supabase y SMTP
3. Chequea logs en "Executions" para ver errores
4. Testea manualmente con "Execute Workflow"

---

## ❓ FAQ (Preguntas Frecuentes)

### ¿Puedo cambiar el tema a modo claro?

Actualmente la app está diseñada 100% en modo oscuro (dark-first). Para agregar modo claro necesitarías:
1. Duplicar las variables CSS en `:root` con un selector `.light`
2. Agregar un toggle en Navbar
3. Persistir preferencia en localStorage
4. Actualizar todos los componentes glass (la transparencia no funciona bien en claro)

**Recomendación:** Mantener dark mode, es parte de la identidad visual del proyecto.

---

### ¿Cómo agrego más métodos de pago?

1. **Editar enum en DB:**
```sql
ALTER TYPE public.medio_pago ADD VALUE 'nuevo_metodo';
```

2. **Actualizar types/index.ts:**
```typescript
export type MedioPago = 'stripe' | 'binance' | 'paypal' | 'hotmart' | 'nuevo_metodo';
```

3. **Agregar label en lib/theme.ts:**
```typescript
export const labelsMedioPago = {
  // ...existentes
  nuevo_metodo: 'Nombre Visible',
};
```

4. **Agregar color en useClientes.ts** (sección `distribucionMedioPago`):
```typescript
const CONFIG = {
  // ...existentes
  nuevo_metodo: { label: "Nombre", color: "#hexcolor" },
};
```

---

### ¿Cómo exporto todos los datos?

**Opción 1 - Desde Supabase Dashboard:**
1. Ve a Table Editor
2. Selecciona tabla (clientes, pagos, etc.)
3. Click en "..." → Download as CSV

**Opción 2 - Desde la app:**
- El Historial ya tiene botón de exportar a CSV
- Para clientes: puedes agregar la funcionalidad siguiendo el mismo patrón

---

### ¿Puedo tener varios usuarios administradores?

Sí, cada usuario que se registre tendrá su propio set de datos aislado por RLS.

**Para agregar usuarios:**
1. Crea cuentas desde la página `/auth` (registro)
2. Cada uno verá solo sus propios clientes
3. Los datos están completamente aislados por `user_id`

**Si necesitas acceso compartido:** Requerirías implementar:
- Tabla `teams` o `workspaces`
- Sistema de invitaciones
- Cambiar RLS policies para permitir acceso compartido

---

### ¿Cómo actualizo a una nueva versión?

```bash
# 1. Pull últimos cambios
git pull origin main

# 2. Actualizar dependencias
bun install

# 3. Ejecutar nuevas migraciones en Supabase (si las hay)
# Ver carpeta supabase/migrations/

# 4. Rebuild
bun run build

# 5. Redesplegar (según método usado)
```

---

### ¿Hay un plan Roadmap de features futuras?

Funcionalidades potenciales a considerar:

- [ ] Exportar reportes en PDF
- [ ] Multi-tenancy (equipos/workspaces)
- [ ] Integración con Stripe/PayPal directo (webhooks)
- [ ] Dashboard público compartible (con link único)
- [ ] Plantillas de emails personalizables
- [ ] Modo claro opcional
- [ ] App móvil nativa (React Native)
- [ ] API REST pública
- [ ] Sistema de facturación automática
- [ ] Multi-idioma (i18n)

**¿Quieres contribuir?** Abre un issue o PR en el repositorio.

---

## 📄 Licencia

Este proyecto es **privado y propietario**.  
Todos los derechos reservados © 2026 SociosCoders.

---

## 👨‍💻 Soporte y Contacto

**¿Necesitas ayuda?**

- 📧 Email: sociosdigitales.pro@gmail.com
- 💬 Documentación: Este README
- 🐛 Issues: Repositorio Git (si aplicable)

---

## 🙏 Agradecimientos

Construido con tecnologías de código abierto:

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [n8n](https://n8n.io/)

---

**✨ Hecho con dedicación por el equipo de SociosCoders ✨**
# members-suscripcion
