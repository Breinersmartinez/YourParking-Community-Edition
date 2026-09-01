# 🏗️ Arquitectura del Sistema

**YourParking — Community Edition** es un monorepo que contiene un backend REST y un frontend SPA para la gestión integral de parqueaderos: autenticación, control de vehículos, espacios, reservas, tickets, pagos, tarifas, suscripciones e incidentes.

---

## Vista general

```
┌──────────────────────┐        HTTPS/JSON        ┌──────────────────────────────────┐
│      FRONTEND        │  ──────────────────────► │              BACKEND              │
│   Angular 19         │                          │      Spring Boot 3.4.3 (Java 17)  │
│   Tailwind CSS       │                          │  Spring Security + JWT            │
│   (Browser)          │                          │  Spring Data JPA                  │
└──────────────────────┘                          │  SpringDoc OpenAPI (Swagger)      │
                                                  │  JavaMail (SMTP) · Mercado Pago    │
                                                  └──────────────────┬─────────────────┘
                                                                     │
                                                                     ▼
                                                          ┌────────────────────┐
                                                          │     PostgreSQL      │
                                                          │ (Neon / local / DB) │
                                                          └────────────────────┘
```

---

## Componentes

### Backend (`backend/`)

API REST alojada en el puerto `8080`. Tecnologías principales:

| Tecnología | Uso |
| ---------- | --- |
| Spring Boot 3.4.3 | Framework base (web, data, security, mail). |
| Spring Security + JWT (jjwt 0.12.3) | Autenticación basada en tokens y control de acceso por roles. |
| Spring Data JPA / JDBC | Persistencia y repositorios. |
| PostgreSQL | Base de datos principal (dialecto PostgreSQL). |
| SpringDoc OpenAPI 2.8.6 | Generación de Swagger UI en `/swagger-ui.html`. |
| Lombok | Reducción de código repetitivo. |
| Mercado Pago SDK (2.1.7) | Integración de pasarela de pagos. |
| H2 | Base en memoria para pruebas automáticas. |

### Frontend (`frontend/`)

SPA servida por **Nginx** en el puerto `3000` (producción) y por el dev server de **Angular CLI** (`ng serve`) en el puerto `4200` (desarrollo). Tecnologías:

| Tecnología | Uso |
| ---------- | --- |
| Angular 19 | Framework de interfaz (TypeScript). |
| Angular CLI | Build, dev server y scaffolding. |
| Angular Router (HashRouter) | Enrutamiento del lado del cliente. |
| RxJS | Programación reactiva y clientes HTTP. |
| Tailwind CSS 3 | Framework de estilos utility-first. |
| Nginx | Servidor estático del build de producción. |

---

## Estructura del monorepo

```
YourParking-Community-Edition/
├── backend/                      # API Spring Boot
│   ├── src/main/java/...         # Código fuente Java
│   ├── src/main/resources/       # application.properties y config
│   ├── Dockerfile                # Imagen multi-stage
│   ├── mvnw / mvnw.cmd / pom.xml
│   └── .env                      # Variables locales (ignorado por git)
├── frontend/                     # SPA Angular 19
│   ├── angular.json              # Configuración del Angular CLI (build, fileReplacements)
│   ├── src/
│   │   ├── environments/         # environment.ts / environment.prod.ts (apiUrl, breinLogicUrl)
│   │   ├── styles.css            # Utilities y componentes CSS (Tailwind)
│   │   └── app/
│   │       ├── app.config.ts     # Providers (router con HashRouter, HTTP)
│   │       ├── app.routes.ts     # Sistema de rutas
│   │       ├── landing/          # Landing pública (navbar, hero, features, ...)
│   │       ├── auth/             # login / signup
│   │       ├── layouts/          # AdminLayout, ClientLayout
│   │       ├── pages/            # Páginas del panel admin y del cliente
│   │       ├── core/             # services (api, auth, interceptor), guards, models/enums
│   │       └── shared/           # UI reutilizable, iconos y constantes
│   ├── Dockerfile                # Build multi-stage (Angular + Nginx)
│   ├── nginx.conf                # Config de Nginx (SPA con HashRouter)
│   └── package.json
├── db/                           # Scripts SQL de la base de datos
├── docs/                         # Documentación del proyecto
└── .github/workflows/            # CI/CD (docker-image.yml)
```

---

## Flujo de autenticación

1. El cliente envía credenciales a `POST /api/auth/login`.
2. El backend valida contra la base (BCrypt) y devuelve un **JWT** firmado con `TOKEN_JWT` (expiración: 24 h, `jwt.expiration.time=86400000`).
3. El token viaja en la cabecera `Authorization: Bearer <jwt>` en peticiones protegidas.
4. El frontend guarda el token y los datos de sesión en `localStorage` (`AuthService`) y redirige según el rol: `/admin` (staff) o `/portal` (cliente).

Detalle completo en [BACKEND.md](./BACKEND.md) y [FRONTEND.md](./FRONTEND.md).
