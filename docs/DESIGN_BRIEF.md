# Design Brief — Mini Praxia

Fuente: `ui-ux-pro-max --design-system` (producto: *medical clinic operations dashboard*, density 8, motion 4)
+ reglas de `frontend-design` y `redesign-existing-projects`.

## Qué es y para quién

Mini Praxia es la consola operativa de un consultorio: recepción y administración
gestionan leads, citas y mensajes durante la jornada. Se usa **en escritorio, de pie,
con prisa**. La prioridad es leer estado y actuar en segundos, no impresionar.

## Dirección

**Clínico claro, alto contraste, denso pero ordenado.** Se abandona el tema oscuro
"navy + cian + glass", que es exactamente el clúster genérico de dashboard generado
por IA (fondo near-black, un solo acento neón, tarjetas idénticas con el mismo radio).

## Paleta (una sola familia de grises, un acento de marca)

| Rol              | Hex       | Uso                                    |
| ---------------- | --------- | -------------------------------------- |
| `--bg`             | `#F6F9F9`   | lienzo (neutro con un matiz teal)      |
| `--surface`        | `#FFFFFF`   | tarjetas, tablas, modales              |
| `--surface-2`      | `#EEF4F4`   | cabeceras de tabla, zonas hundidas     |
| `--border`         | `#DCE6E7`   | separadores 1px                        |
| `--ink`            | `#0F3235`   | titulares                              |
| `--ink-2`          | `#3F5A5E`   | texto de cuerpo                        |
| `--ink-3`          | `#6E888C`   | texto secundario / metadatos           |
| `--primary`        | `#0E7490`   | marca, acciones primarias (blanco 4.9:1) |
| `--primary-hover`  | `#155E75`   | hover                                  |
| `--accent`         | `#15803D`   | confirmaciones (blanco 4.5:1)          |
| `--warning`        | `#B45309`   | pendiente                              |
| `--danger`         | `#B91C1C`   | cancelada / destructivo                |
| `--ring`           | `#0891B2`   | foco de teclado (3px)                  |

Estados: pendiente ámbar, confirmada verde, cancelada rojo, reprogramada teal.
Nunca se comunica solo con color: cada estado lleva **punto + texto**.

## Tipografía

- **Titulares:** `Figtree` (500/600/700), tracking negativo leve en tamaños grandes.
- **Cuerpo/UI:** `Noto Sans` (400/500/600, base 15–16px, line-height 1.5).
- **Datos:** `font-variant-numeric: tabular-nums` en métricas, horas e importes.
- Escala: 12 / 13 / 15 / 16 / 20 / 24 / 30 px. Sin texto de cuerpo por debajo de 12px.

## Layout

- Escritorio: sidebar fija de 248px + contenido con `max-width` 1200px.
- Móvil (<900px): sidebar oculta, **barra superior con título + menú hamburguesa**,
  drawer con overlay y cierre con `Esc`.
- Radios por jerarquía: controles 8px, tarjetas 12px, contenedores 16px. Nada es "pill"
  salvo los badges de estado.
- Sombras tenues y **tintadas** en teal (nunca negro puro); elevación solo donde
  comunica jerarquía: las tarjetas usan borde, no sombra.

```
DESKTOP                                  MÓVIL
┌──────────┬───────────────────────────┐  ┌───────────────────────────┐
│ brand    │  H1            [acción]   │  │ ☰  Dashboard      [+]     │
├──────────┼───────────────────────────┤  ├───────────────────────────┤
│ ▸ Panel  │  ┌────┐ ┌────┐ ┌────┐     │  │ ┌───────────┐ ┌─────────┐ │
│   Leads  │  │KPI │ │KPI │ │KPI │     │  │ │   KPI     │ │   KPI   │ │
│   Citas  │  └────┘ └────┘ └────┘     │  │ └───────────┘ └─────────┘ │
│ WhatsApp │  ┌───────────────────────┐ │  │ ┌───────────────────────┐ │
│          │  │ tabla / agenda        │ │  │ │ lista apilada         │ │
└──────────┴───────────────────────────┘  └───────────────────────────┘
```

## Principios

1. **Legibilidad primero.** Contraste ≥4.5:1, foco visible, 16px de base.
2. **El estado es la información.** Badges con punto + texto, métricas con número grande.
3. **Densidad con aire.** Escala de espaciado 4/8/12/16/24/32; nada pegado al borde.
4. **Una sola cosa memorable.** El acento teal se gasta en acciones y estado; el resto calla.
5. **Sin decoración que no informe.** Se elimina el glass, los gradientes y el ruido.

## Tells de IA que evitamos

- Fondo near-black + acento neón. · `backdrop-filter` en todo. · Un mismo radio en todo.
- Tarjetas idénticas borde+sombra+blanco. · **Emoji como iconos.** · Azul/index morado "IA".
- Sombras negras genéricas. · Etiquetas en MAYÚSCULAS con tracking por todas partes.
- Modales para todo. · Texto de relleno tipo "Lorem/John Doe".

## Checklist de entrega

- [ ] Iconos SVG, sin emoji · [ ] `cursor:pointer` en lo clickeable
- [ ] Hover 150–300ms · [ ] Contraste 4.5:1 · [ ] Foco visible
- [ ] `prefers-reduced-motion` respetado · [ ] 375 / 768 / 1024 / 1440 sin scroll horizontal
- [ ] Objetivos táctiles ≥44px · [ ] Labels asociados (`htmlFor`/`id`)
