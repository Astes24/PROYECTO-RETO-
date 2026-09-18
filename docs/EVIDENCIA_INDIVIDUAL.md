# Evidencia individual — Grupo 2

Documento de apoyo para la auditoría de cierre (sección 9 del reto).
Cada integrante completa su bloque.

---

## James M.

**Rol asumido:** Frontend. Interfaz, dashboard, formularios, sistema de diseño y accesibilidad.

**Componentes y archivos trabajados principalmente**

- `frontend/src/index.css` — sistema de tokens y componentes base.
- `frontend/src/components/` — `Layout`, `Sidebar`, `Modal`, `ConfirmDialog`,
  `Toast`, `StatusBadge`, `MetricCard`, `CitaCard`, `LeadTable`, `LeadForm`,
  `CitaForm`, `WhatsAppSim`, `icons`, `ErrorBoundary`, `NotFound`.
- `frontend/src/pages/` — `Dashboard`, `Leads`, `Citas`, `WhatsApp`.
- `frontend/src/App.jsx` — rutas, incluida la 404.
- `docs/DESIGN_BRIEF.md` — dirección visual y tokens.
- `scripts/smoke.sh` — verificación del flujo completo por API.

**Decisión técnica personal**

Abandonar el tema oscuro "navy + cian + glassmorphism" y construir un **sistema de
diseño claro, clínico y de alto contraste** sobre tokens (`:root`), con una sola
familia de grises y un único acento. Las decisiones concretas:

1. Un solo acento teal (`#0E7490`) gastado solo en acciones y estado; el resto neutro.
2. Radios por jerarquía y sombras tintadas en teal en lugar de negro.
3. Iconografía SVG propia en lugar de emoji.
4. Estados siempre con punto + texto, nunca solo color.

También decidí **no migrar de stack**: se mantiene CSS vanilla y React sin librerías
nuevas, porque el reto prioriza criterio y explicación por encima del diseño.

**Problema encontrado y cómo lo resolví**

Al probar en el navegador con viewport móvil (390px) el layout se rompía: el
`marginLeft: '260px'` estaba como estilo en línea en `Layout.jsx`, así que la media
query no podía sobrescribirlo y el contenido quedaba cortado sin navegación posible.
Lo resolví moviendo el layout a CSS, agregando una barra superior con menú
hamburguesa y un drawer con overlay, cierre con `Esc` y devolución del foco.

Segundo problema: la agenda mostraba **un día menos** que la fecha real. `new Date('2026-09-17')`
se interpreta como UTC y, en zona -05, retrocede al día anterior. Lo resolví formateando
la fecha por partes (sin `new Date`) y calculando la fecha por defecto en horario local.

**Qué mejoraría con un día adicional**

- Historial de cambios de estado por cita (quién y cuándo).
- Búsqueda y filtros combinados con paginación real en la tabla de leads.
- Pruebas automatizadas de interfaz con Playwright sobre el flujo completo.

---

## Erick E.

> Borrador redactado a partir del código del repositorio. Erick confirma, corrige o ajusta.

**Rol asumido:** Backend. API, reglas de negocio, persistencia y validaciones.

**Componentes y archivos trabajados principalmente**

- `backend/server.js`, `backend/database.js`, `backend/middleware/validation.js`
- `backend/routes/` — `leads.js`, `citas.js`, `whatsapp.js`, `dashboard.js`

**Decisión técnica personal**

Usar **SQLite con `sql.js`**: base en memoria con volcado a archivo en
`backend/data/clinica.db` en cada escritura, más datos semilla en el primer arranque.
Con eso se cumple "base de datos o almacenamiento estructurado" con SQL real, sin
instalar un motor ni manejar credenciales, y la demostración siempre arranca con
información. Además separé el backend en `server.js` (arranque y rutas),
`database.js` (esquema y helpers) y `middleware/validation.js` (reglas), para que
cada archivo se pueda explicar por separado.

**Problema encontrado y cómo lo resolvió**

El control de solapamiento de horarios debía cubrir los tres casos posibles de dos
intervalos (uno contiene al otro, el nuevo empieza antes y termina dentro, el nuevo
empieza dentro y termina después) y, al mismo tiempo, ignorar las citas canceladas y
la propia cita cuando se edita. Lo resolví con una única consulta de comparación de
intervalos sobre `hora_inicio`/`hora_fin`, más `estado != 'cancelada'` y `id != ?` en
el `PUT`, de modo que reprogramar una cita no la bloquea contra sí misma.

**Qué mejoraría con un día adicional**

- Migraciones de esquema y transacciones explícitas en lugar de escrituras sueltas.
- Índices en `citas(fecha, estado)` para las consultas del panel.
- Hacer configurable la ventana de deduplicación de mensajes (hoy son 2 minutos fijos).
- Paginación y filtros por rango de fechas en `GET /api/leads` y `GET /api/citas`.
