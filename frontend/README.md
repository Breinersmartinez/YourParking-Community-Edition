# 🅿️ YourParking — Frontend

Aplicación web (SPA) del sistema de gestión de parqueaderos **YourParking**. Construida con **React 18**, **Vite**, **React Router DOM 7** y **Tailwind CSS**, con la paleta corporativa de parqueadero (naranja, negro, grises y amarillo).

Incluye una landing pública, un panel de administración completo y un portal para clientes. Consume la API REST del backend (Spring Boot).

---

## 🚀 Inicio rápido

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
```

La app abre en `http://localhost:5173` y apunta a la API en `http://localhost:8080`.

### Scripts

| Comando | Descripción |
| ------- | ----------- |
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Build de producción (carpeta `dist/`). |
| `npm run lint` | Análisis estático con ESLint (`--max-warnings 0`). |
| `npm run preview` | Previsualización del build. |
| `npm run start` | Dev server en el puerto 3000. |

---

## 📂 Estructura

```
src/
├── main.jsx                # Punto de entrada
├── App.jsx                 # Sistema de rutas
├── index.css               # Utilidades y componentes CSS (Tailwind v3)
├── constants/              # Datos de la landing (features, pricing, testimonios...)
├── components/             # Componentes de la landing + UI reutilizable
│   └── ui/                 # Badge, DataTable, EmptyState, Modal, PageHeader, Spinner, StatCard
├── layouts/                # AdminLayout (sidebar) y ClientLayout (portal)
├── pages/                  # Páginas de la aplicación
├── services/               # apiClient, AuthService, index (endpoints + ENUMS)
└── utils/format.js         # Formateadores de moneda y fechas
```

---

## 🧭 Rutas principales

- `/` — Landing page.
- `/login`, `/clientSignUp` — Autenticación y registro.
- `/portal` — Dashboard del cliente (vehículos, reservas, suscripciones).
- `/admin` y subrutas — Panel de administración (dashboard, espacios, niveles/zonas, tickets, reservas, incidentes, vehículos, usuarios, tarifas, pagos).
- `/chatBot` — Asistente virtual.

> Consulta `docs/FRONTEND.md` para el detalle completo de rutas y el diseño del sistema.

---

## 🔌 Variables de entorno (`.env`)

| Variable | Descripción |
| -------- | ----------- |
| `VITE_API_URL` | URL base de la API backend. Local: `http://localhost:8080`. |
| `VITE_API_BREINLOGIC_URL` | Endpoint del asistente virtual (ChatBot) — opcional. |

---

## 🧰 Stack

React 18 · Vite 5 · React Router DOM 7 · Tailwind CSS 3 · Axios · Lucide React · React Icons · ESLint.

---

## 📚 Documentación

La documentación completa del monorepo está en la carpeta [`docs/`](../docs/) (índice: [`docs/README.md`](../docs/README.md)).
