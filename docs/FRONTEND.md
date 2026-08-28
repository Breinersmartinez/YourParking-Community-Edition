# 🎨 Frontend — React + Vite

SPA de **YourParking** construida con **React 18**, **Vite** y **Tailwind CSS**, estilizada con una paleta corporativa de parqueadero (naranja, negro, grises y amarillo).

---

## Comandos

```bash
cd frontend
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo (puerto 5173)
npm run build        # build de producción (carpeta dist/)
npm run lint         # análisis estático (ESLint)
npm run preview      # previsualizar el build
```

---

## Estructura

```
frontend/
├── tailwind.config.js       # Paleta de colores, fuentes y sombras
├── .env                     # Variables de entorno (VITE_API_URL, etc.)
└── src/
    ├── main.jsx             # Punto de entrada
    ├── App.jsx              # Sistema de rutas
    ├── index.css            # Utilities y componentes CSS (Tailwind v3)
    ├── assets/              # Imágenes y recursos
    ├── constants/           # Datos de la landing (features, pricing, ...)
    ├── components/          # Comparadores de la landing
    │   ├── Navbar.jsx, HeroSection.jsx, FeatureSection.jsx,
    │   ├── Workflow.jsx, Pricing.jsx, Testimonials.jsx, Footer.jsx
    │   └── ui/              # UI reutilizable
    │       ├── Badge.jsx, DataTable.jsx, EmptyState.jsx,
    │       ├── Modal.jsx, PageHeader.jsx, Spinner.jsx, StatCard.jsx
    ├── layouts/             # Layouts con navegación
    │   ├── AdminLayout.jsx  # Sidebar + topbar del panel admin
    │   └── ClientLayout.jsx # Cabecera del portal de cliente
    ├── pages/               # Páginas de la aplicación
    ├── services/            # Cliente API centralizado
    │   ├── apiClient.js     # Fetch con token + manejo de errores
    │   ├── AuthService.js   # Sesión y autenticación
    │   └── index.js         # Endpoints por dominio + ENUMS
    └── utils/format.js      # Formateadores (moneda, fechas)
```

---

## Sistema de rutas (`App.jsx`)

Usa **HashRouter**. Guard de autenticación `RequireAuth` redirige a `/login` si no hay sesión.

| Ruta | Elemento | Acceso |
| ---- | -------- | ------ |
| `/` | Landing (Navbar, Hero, Features, Workflow, Pricing, Testimonials, Footer) | Público |
| `/login` | `Login` | Público |
| `/clientSignUp` | `ClientSignUp` | Público |
| `/chatBot` | `ChatBot` | Público |
| `/portal` | `ClientRoute` → `ClientDashboard` | Autenticado |
| `/admin` | `AdminRoute` → `AdminDashboard` | Autenticado |
| `/admin/espacios` | `SpacesManagement` | Autenticado |
| `/admin/niveles` | `LevelsZones` | Autenticado |
| `/admin/tickets` | `TicketsManagement` | Autenticado |
| `/admin/reservas` | `ReservationsManagement` | Autenticado |
| `/admin/incidentes` | `IncidentsManagement` | Autenticado |
| `/admin/vehiculos` | `VehiclesManagement` | Autenticado |
| `/admin/clientes` | `UsersManagement` | Autenticado |
| `/admin/tarifas` | `RatesManagement` | Autenticado |
| `/admin/pagos` | `PaymentsManagement` | Autenticado |
| `/UserHomeDashboard` | Redirige a `/portal` | — |
| `/AdminHomeDashboard` | Redirige a `/admin` | — |
| `/user-dashboard` | Redirige a `/admin/clientes` | — |
| `*` | Redirige a `/` | — |

---

## Sistema de diseño

### Paleta (Tailwind)

Definida en `tailwind.config.js`:

- `primary` — naranja (`#f97316`): acciones principales.
- `accent` — amarillo (`#facc15`): destacados.
- `ink` — negro/grises (`#0c0a09`): fondos oscuros del panel.
- `success` / `danger` — estados positivos/negativos.
- Fuente: **Poppins**; sombras `card`, `cardHover` y `glow`.

### Utilidades de componente (`index.css`)

Clases reutilizables tipo *design system*:

- Botones: `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.btn-success`, `.btn-danger`, `.btn-blue`, `.btn-sm`.
- Formularios: `.input`, `.label`, `.select`.
- Contenedores: `.card`, `.card-header`, `.table`.
- Badges: `.badge` y variantes `.badge-orange`, `.badge-yellow`, `.badge-green`, `.badge-red`, `.badge-gray`, `.badge-blue`.

---

## Servicios API

- **`apiClient.js`**: capa de red basada en `fetch` que inyecta el token JWT y centraliza el manejo de errores (401 → logout, `ApiError`).
- **`index.js`**: agrupa por dominio (`auth`, `users`, `levels`, `zones`, `spaces`, `vehicles`, `tickets`, `reservations`, `payments`, `rates`, `subscriptions`, `incidents`) y exporta `ENUMS` con los valores de los enums del backend.
- **`AuthService.js`**: gestiona sesión en `localStorage` (`token`, `email`, `firstName`, `lastName`, `role`, `idCard`) con métodos `isAuthenticated()`, `isStaff()`, `getFullName()`, `getRole()`, `getUserIdCard()` y `logout(navigate)`.

---

## Variables de entorno (`frontend/.env`)

| Variable | Descripción |
| -------- | ----------- |
| `VITE_API_URL` | URL base de la API backend (ej. `http://localhost:8080`). |
| `VITE_API_BREINLOGIC_URL` | Endpoint del asistente virtual (ChatBot) — **opcional**; si no está definido, el ChatBot no consulta al servicio externo. |

> En desarrollo el CORS del backend ya permite `http://localhost:5173`.
