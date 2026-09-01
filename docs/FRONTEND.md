# 🎨 Frontend — Angular 19

SPA de **YourParking** construida con **Angular 19**, **Angular CLI**, **TypeScript** y **Tailwind CSS**, estilizada con una paleta corporativa de parqueadero (naranja, negro, grises y amarillo). Se sirve estáticamente con **Nginx** y usa **HashRouter**.

---

## Comandos

```bash
cd frontend
npm install              # instalar dependencias
npm start                # servidor de desarrollo (puerto 4200)
npm run build            # build (configuración production por defecto)
npm run build:prod       # build de producción (ng build --configuration production)
npm test                 # tests unitarios (Karma)
```

Ejecuta `npx ng build` o `npx ng serve` si no tienes el CLI de Angular global.

---

## Estructura

```
frontend/
├── angular.json                 # Configuración de Angular CLI (build, fileReplacements)
├── tsconfig*.json               # Configuración de TypeScript
├── public/                      # Assets estáticos
└── src/
    ├── index.html               # Punto de entrada
    ├── main.ts                  # Bootstrap de la aplicación
    ├── styles.css               # Utilities y componentes CSS (Tailwind)
    ├── environments/            # Configuración por entorno (apiUrl, breinLogicUrl)
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app/
        ├── app.config.ts        # Providers de la app (router con HashRouter, HTTP)
        ├── app.routes.ts        # Sistema de rutas
        ├── landing/             # Landing pública (navbar, hero, features, ...)
        ├── auth/                # login / signup
        ├── layouts/             # AdminLayoutComponent y ClientLayoutComponent
        ├── pages/               # Páginas del panel admin y del cliente
        ├── core/                # Servicios, guards, interceptors, modelos y enums
        │   ├── services/api.service.ts   # Cliente API centralizado
        │   ├── services/auth.service.ts  # Sesión y autenticación
        │   ├── services/auth.interceptor.ts  # Inyecta el JWT en cada request
        │   ├── guards/auth.guard.ts      # Guard de autenticación
        │   ├── models.ts / enums.ts
        │   └── utils/format.ts  # Formateadores (moneda, fechas)
        └── shared/              # UI reutilizable, iconos y constantes
```

---

## Sistema de rutas (`app.routes.ts`)

Usa **HashRouter** (configurado en `app.config.ts` con `withHashLocation()`). El guard `authGuard` protege las rutas autenticadas y redirige a `/login` si no hay sesión.

| Ruta | Componente | Acceso |
| ---- | ---------- | ------ |
| `/` | `LandingComponent` | Público |
| `/login` | `LoginComponent` | Público |
| `/signup` | `SignupComponent` | Público |
| `/admin` | `AdminLayoutComponent` → `AdminDashboardComponent` | Autenticado |
| `/admin/espacios` | `SpacesComponent` | Autenticado |
| `/admin/niveles` | `LevelsZonesComponent` | Autenticado |
| `/admin/tickets` | `TicketsComponent` | Autenticado |
| `/admin/reservas` | `ReservationsComponent` | Autenticado |
| `/admin/incidentes` | `IncidentsComponent` | Autenticado |
| `/admin/vehiculos` | `VehiclesComponent` | Autenticado |
| `/admin/clientes` | `UsersComponent` | Autenticado |
| `/admin/tarifas` | `RatesComponent` | Autenticado |
| `/admin/pagos` | `PaymentsComponent` | Autenticado |
| `/portal` | `ClientLayoutComponent` → `ClientDashboardComponent` | Autenticado |
| `/portal/chatbot` | `ChatbotComponent` | Autenticado |
| `**` | Redirige a `/` | — |

---

## Servicios API

- **`core/services/api.service.ts`**: cliente HTTP centralizado (inyectable) que agrupa los endpoints por dominio (auth, users, levels, zones, spaces, vehicles, tickets, reservations, payments, rates, subscriptions, incidents).
- **`core/services/auth.interceptor.ts`**: interceptor HTTP que inyecta el token JWT en cada petición.
- **`core/services/auth.service.ts`**: gestiona la sesión (token, email, nombre, rol, cédula) con `isAuthenticated()`, `isStaff()`, `getRole()`, `logout()`, etc.
- **`core/guards/auth.guard.ts`**: protege las rutas del portal y del panel admin.

---

## Variables de entorno

Angular **no** tiene `.env` en tiempo de ejecución; la configuración se declara en `src/environments/` y el build de producción inyecta `environment.prod.ts` mediante `fileReplacements` (`angular.json`).

| Variable | Descripción |
| -------- | ----------- |
| `apiUrl` | URL base de la API backend (ej. `http://localhost:8080`). |
| `breinLogicUrl` | Endpoint del asistente virtual (ChatBot) — **opcional**; si está vacío, el ChatBot no consulta al servicio externo. |

En Docker, la URL de la API se configura en tiempo de build con el build-arg `API_URL`, que reemplaza `apiUrl` en `environment.prod.ts` (`frontend/Dockerfile`).

> En desarrollo el CORS del backend ya permite `http://localhost:4200`.
