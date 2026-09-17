# 🏥 Mini Praxia — Sistema de Gestión de Consultorio Médico

Sistema web para gestión de leads (pacientes), citas médicas y simulación de WhatsApp.

## 🚀 Requisitos

- **Node.js** v18 o superior
- **npm** v9 o superior

## 📦 Instalación y Ejecución

### 1. Backend (API REST)

```bash
cd backend
npm install
npm run dev
```

El servidor se levanta en: **http://localhost:3001**

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

La aplicación se abre en: **http://localhost:5173**

> ⚠️ **Importante:** Ejecuta primero el backend y luego el frontend. Ambos deben estar corriendo simultáneamente.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Base de Datos | SQLite (sql.js) |
| Estilos | Vanilla CSS |

## 📋 Funcionalidades

1. **Registro de Leads** — Alta, edición y eliminación de pacientes potenciales
2. **Gestión de Citas** — Crear, editar, cancelar y reprogramar citas médicas
3. **Dashboard** — Vista de métricas generales y agenda del día
4. **Simulación WhatsApp** — Envío/recepción de mensajes simulados
5. **Validaciones** — Campos obligatorios, conflictos de horario, formatos

## 📡 API Endpoints

| Recurso | Endpoints |
|---------|-----------|
| Leads | `GET/POST /api/leads`, `GET/PUT/DELETE /api/leads/:id` |
| Citas | `GET/POST /api/citas`, `GET/PUT/DELETE /api/citas/:id`, `PATCH /api/citas/:id/estado` |
| WhatsApp | `POST /api/whatsapp/webhook`, `POST /api/whatsapp/enviar`, `GET /api/whatsapp/mensajes/:telefono` |
| Dashboard | `GET /api/dashboard/resumen`, `GET /api/dashboard/hoy` |

## 👥 Equipo — Grupo 2

- **Integrante 1 (Backend):** API, lógica de negocio, base de datos, validaciones
- **Integrante 2 (Frontend):** Interfaz de usuario, formularios, dashboard, consumo de API
