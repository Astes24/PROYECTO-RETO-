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

**Rol asumido:** Backend. API, reglas de negocio, persistencia y validaciones.

**Componentes y archivos trabajados principalmente**

- `backend/server.js`, `backend/database.js`, `backend/middleware/validation.js`
- `backend/routes/` — `leads.js`, `citas.js`, `whatsapp.js`, `dashboard.js`

**Decisión técnica personal**

_(completar: p. ej. usar `sql.js` con persistencia a archivo y datos semilla para que la
demo arranque siempre con información, sin depender de un motor externo)._

**Problema encontrado y cómo lo resolvió**

_(completar: p. ej. el conflicto de horarios solapados al crear o editar citas, o la
validación de estados permitidos.)_

**Qué mejoraría con un día adicional**

_(completar.)_
