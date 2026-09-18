# Guion de demo — Mini Praxia (5–10 min)

## Antes de empezar

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Abrir `http://localhost:5173`. Dejar una segunda pestaña con `http://localhost:3001/api/health`
lista para mostrar que la API responde.

## Recorrido (orden obligatorio del reto)

1. **Panel** — mostrar las métricas: citas de hoy, confirmadas, pendientes, canceladas,
   reprogramadas y total de leads. Señalar que salen de `GET /api/dashboard/resumen`.
2. **Leads** — crear un lead nuevo con nombre y teléfono. Mostrar la validación:
   intentar guardar sin teléfono y ver el error junto al campo.
3. **Mensaje de WhatsApp simulado** — ir a WhatsApp → *Simular mensaje entrante* con un
   teléfono nuevo. Explicar que el backend crea el lead automáticamente.
   Repetir el mismo mensaje para mostrar el rechazo por **mensaje repetido**.
4. **Crear cita** — desde Leads (icono calendario) o Citas → *Nueva cita*.
   Mostrar el error de **horario inválido** (fin ≤ inicio) y el de **cita duplicada**
   agendando dos veces el mismo horario.
5. **Cambiar estado** — en la tarjeta de la cita: pendiente → confirmada → cancelada.
   Volver al Panel y mostrar cómo cambian las métricas.
6. **Persistencia** — recargar el navegador (F5): los datos siguen ahí (SQLite en archivo).
7. **Móvil** — reducir la ventana o abrir el dispositivo emulado: aparece la barra superior
   con menú hamburguesa; el drawer navega entre secciones.

## Cambio en vivo (por si lo piden)

Editar un mensaje de validación y mostrar que se refleja al instante:

1. Abrir `backend/middleware/validation.js`.
2. Cambiar el texto de `'El teléfono es obligatorio y debe tener al menos 7 dígitos.'`.
3. Guardar: `node --watch` reinicia el backend solo.
4. Repetir el caso en la interfaz y mostrar el mensaje nuevo.

Alternativa en frontend: cambiar el color del acento en `frontend/src/index.css`
(`--primary`) y guardar: Vite recarga sin perder estado.

## Explicar (30 s por integrante)

- **Frontend:** arquitectura de `pages/` + `components/`, la capa única `api/client.js`,
  el sistema de tokens de `index.css` y por qué se dejó CSS vanilla.
- **Backend:** por qué `sql.js` con archivo, cómo se separan rutas/middleware/datos y
  dónde viven las validaciones.

Cada uno cierra con **qué hizo personalmente** (ver `docs/EVIDENCIA_INDIVIDUAL.md`).

## Cierre

```bash
bash scripts/smoke.sh     # verifica el flujo completo por API en ~2 s
```
